// Server-only Signhost (Entrust/Evidos) e-signing client.
// Auth uses TWO headers (both required):
//   Authorization: APIKey  <SIGNHOST_API_KEY>   (the usertoken)
//   Application:   APPKey   <SIGNHOST_APP_KEY>   (the application key — note: contains a space)
//
// Flow: createTransaction (customer then office) → addFile (the contract PDF) →
// startTransaction (sends the email to the first signer). On completion, Signhost
// POSTs to PostbackUrl; we re-fetch the transaction to verify and download the
// signed document.

import 'server-only';

const BASE = 'https://api.signhost.com/api';

/** Signhost Transaction.Status: 30 = Signed (all signers done). */
export const SIGNHOST_STATUS_SIGNED = 30;
/** File id we store the contract under within a transaction. */
export const CONTRACT_FILE_ID = 'overeenkomst';

export function isSignhostConfigured(): boolean {
  return Boolean(process.env.SIGNHOST_API_KEY && process.env.SIGNHOST_APP_KEY);
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    Authorization: `APIKey ${process.env.SIGNHOST_API_KEY}`,
    Application: `APPKey ${process.env.SIGNHOST_APP_KEY}`,
    ...extra,
  };
}

export interface SignhostSigner {
  name: string;
  email: string;
}

export interface SignhostTransaction {
  Id: string;
  Status: number;
  Signers: Array<{ Email: string; SignedDateTime: string | null }>;
  Files: Record<string, unknown>;
}

/**
 * Create a transaction with signers in order. Signers receive their request
 * sequentially (SignRequestMode 2): the next signer only after the previous
 * signs. The document is uploaded separately via addFile().
 */
export async function createTransaction(opts: {
  signers: SignhostSigner[];
  message: string;
  postbackUrl?: string;
  reference?: string;
}): Promise<string> {
  const body = {
    Signers: opts.signers.map((s) => ({
      Email: s.email,
      ScribbleName: s.name,
      SignRequestMessage: opts.message,
      SendSignRequest: true,
      SendSignConfirmation: true,
      Language: 'nl-NL',
      Verifications: [{ Type: 'Consent' }],
    })),
    SignRequestMode: 2, // sequential — send to each signer when the previous is done
    PostbackUrl: opts.postbackUrl,
    Reference: opts.reference,
  };
  const res = await fetch(`${BASE}/transaction`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`signhost create failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { Id: string };
  return data.Id;
}

/** Upload (or replace) the PDF to be signed. */
export async function addFile(transactionId: string, fileId: string, pdf: Uint8Array): Promise<void> {
  const res = await fetch(`${BASE}/transaction/${transactionId}/file/${encodeURIComponent(fileId)}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/pdf' }),
    body: Buffer.from(pdf),
  });
  if (!res.ok) throw new Error(`signhost upload failed: ${res.status} ${await res.text()}`);
}

/** Start the transaction — triggers Signhost to email the first signer. */
export async function startTransaction(transactionId: string): Promise<void> {
  const res = await fetch(`${BASE}/transaction/${transactionId}/start`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`signhost start failed: ${res.status} ${await res.text()}`);
}

export async function getTransaction(transactionId: string): Promise<SignhostTransaction> {
  const res = await fetch(`${BASE}/transaction/${transactionId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`signhost get failed: ${res.status}`);
  return (await res.json()) as SignhostTransaction;
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  await fetch(`${BASE}/transaction/${transactionId}`, { method: 'DELETE', headers: authHeaders() });
}

/** Download the (signed) document from a transaction. */
export async function downloadFile(transactionId: string, fileId: string): Promise<Buffer> {
  const res = await fetch(`${BASE}/transaction/${transactionId}/file/${encodeURIComponent(fileId)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`signhost download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Download the signing receipt PDF for a completed transaction. */
export async function downloadReceipt(transactionId: string): Promise<Buffer> {
  const res = await fetch(`${BASE}/file/receipt/${transactionId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`signhost receipt failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * High-level helper used at payment time: generate-and-attach. Creates a
 * transaction (customer first, office counter-signs) and uploads the PDF.
 * Does NOT start it — the webhook starts it on payment success.
 * Returns the transaction id.
 */
export async function createContractTransaction(opts: {
  pdf: Uint8Array;
  customer: SignhostSigner;
  office: SignhostSigner;
  message: string;
  postbackUrl?: string;
  reference?: string;
}): Promise<string> {
  const id = await createTransaction({
    signers: [opts.customer, opts.office],
    message: opts.message,
    postbackUrl: opts.postbackUrl,
    reference: opts.reference,
  });
  await addFile(id, CONTRACT_FILE_ID, opts.pdf);
  return id;
}
