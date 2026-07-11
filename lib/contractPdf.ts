// Server-side generator for the Lila Catering "Offertevoorstel + Overeenkomst"
// (the 5-page offer + contract that gets signed via Signhost in phase 2).
//
// Built with pdf-lib (no React peer deps — safe on Vercel serverless).
// The legal/boilerplate text is reproduced verbatim from the office Word
// template; only the booking-specific fields are dynamic.
//
// MONEY (confirmed):
//  - BTW: the total is treated as exclusief BTW; the Overeenkomst shows the
//    excl. total, a 9% BTW line, and the incl.-BTW total.
//  - Deposit: 10% of the total with a €1000 minimum (see getDepositAmount).

import 'server-only';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

const GOLD = rgb(0.757, 0.604, 0.357); // #C19A5B
const INK = rgb(0.12, 0.12, 0.12);
const MUTED = rgb(0.42, 0.4, 0.36);

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 56;

export type DecorationStyle = 'classic' | 'luxury' | 'natural' | 'moroccan';

export interface ContractBooking {
  customer: {
    firstName: string;
    lastName?: string;
    name: string;
    email: string;
    phone: string;
    address: string; // street + number
    postcode: string;
    city: string;
  };
  eventDateLabel: string; // e.g. "Donderdag 30 April 2026"
  eventStart?: string; // "18:00"
  eventEnd?: string; // "01:00"
  foodTime?: string; // "21:00"
  guestCount: number;
  venue?: string; // location label
  /** Selected dishes per course (already translated names). */
  menu: { hapjes: string[]; voorgerecht: string[]; hoofdgerecht: string[]; nagerecht: string[] };
  decoration: DecorationStyle | null;
  total: number; // estimated total (see BTW TODO)
  deposit: number; // 10% of total (see deposit TODO)
  reservationNumber: string;
  issueDateLabel: string; // e.g. "5 September 2025"
  optionDateLabel?: string; // offer expiry
}

/** Reservation number like 20260430-1-ID from an event date (YYYY-MM-DD). */
export function buildReservationNumber(eventDateISO: string, seq = 1): string {
  const digits = eventDateISO.replace(/-/g, '');
  return `${digits}-${seq}-ID`;
}

const STYLE_LABEL: Record<DecorationStyle, string> = {
  classic: 'Classic Elegance',
  luxury: 'Luxury Ambiance',
  natural: 'Natural Chic',
  moroccan: 'Moroccan Touch',
};
const STYLE_DESCRIPTION: Record<DecorationStyle, string> = {
  classic: 'Tijdloos en verfijnd met zachte tinten, gouden accenten en romantische bloemen.',
  luxury: 'Diepe kleuren, rijke bloemen en kaarslicht voor een luxueuze en intieme sfeer.',
  natural: 'Licht, natuurlijk en stijlvol met veel groen, witte tinten en subtiele accenten.',
  moroccan: 'Oosterse elegantie met warme kleuren, lantaarns en traditionele details.',
};

// pdf-lib StandardFonts use WinAnsi — map smart punctuation to safe equivalents.
function sanitize(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/ /g, ' ');
}

class Writer {
  doc!: PDFDocument;
  page!: PDFPage;
  font!: PDFFont;
  bold!: PDFFont;
  y = 0;

  async init() {
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.newPage();
  }

  newPage() {
    this.page = this.doc.addPage([A4.w, A4.h]);
    this.y = A4.h - MARGIN;
  }

  ensure(space: number) {
    if (this.y - space < MARGIN) this.newPage();
  }

  /** Word-wrap a string to the content width at the given size/font. */
  private wrap(text: string, size: number, font: PDFFont): string[] {
    const maxW = A4.w - MARGIN * 2;
    const out: string[] = [];
    for (const rawLine of sanitize(text).split('\n')) {
      const words = rawLine.split(/\s+/).filter(Boolean);
      let line = '';
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      out.push(line);
    }
    return out;
  }

  para(text: string, opts: { size?: number; bold?: boolean; color?: typeof INK; gap?: number; lh?: number } = {}) {
    const size = opts.size ?? 10;
    const font = opts.bold ? this.bold : this.font;
    const lh = opts.lh ?? size * 1.45;
    for (const line of this.wrap(text, size, font)) {
      this.ensure(lh);
      this.page.drawText(line, { x: MARGIN, y: this.y, size, font, color: opts.color ?? INK });
      this.y -= lh;
    }
    this.y -= opts.gap ?? 4;
  }

  heading(text: string, opts: { size?: number; top?: number } = {}) {
    const size = opts.size ?? 15;
    this.y -= opts.top ?? 10;
    this.ensure(size * 1.6);
    this.page.drawText(sanitize(text), { x: MARGIN, y: this.y, size, font: this.bold, color: GOLD });
    this.y -= size * 1.1;
    // gold underline
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 4 },
      end: { x: MARGIN + 60, y: this.y + 4 },
      thickness: 1.2,
      color: GOLD,
    });
    this.y -= 10;
  }

  subheading(text: string) {
    this.y -= 4;
    this.ensure(16);
    this.page.drawText(sanitize(text), { x: MARGIN, y: this.y, size: 11, font: this.bold, color: INK });
    this.y -= 15;
  }

  row(label: string, value: string) {
    const size = 10;
    const lh = 15;
    this.ensure(lh);
    this.page.drawText(sanitize(label), { x: MARGIN, y: this.y, size, font: this.bold, color: INK });
    const labelW = 150;
    // value (wrapped within remaining width)
    const valLines = this.wrap(value, size, this.font);
    valLines.forEach((line, i) => {
      if (i > 0) this.ensure(lh);
      this.page.drawText(line, { x: MARGIN + labelW, y: this.y, size, font: this.font, color: INK });
      this.y -= lh;
    });
    if (valLines.length === 0) this.y -= lh;
  }

  bullet(text: string) {
    const size = 10;
    const lh = size * 1.45;
    const lines = this.wrap(text, size, this.font);
    lines.forEach((line, i) => {
      this.ensure(lh);
      if (i === 0) this.page.drawText('•', { x: MARGIN, y: this.y, size, font: this.font, color: GOLD });
      this.page.drawText(line, { x: MARGIN + 14, y: this.y, size, font: this.font, color: INK });
      this.y -= lh;
    });
    this.y -= 2;
  }

  spacer(h = 8) {
    this.y -= h;
  }

  pageBreak() {
    this.newPage();
  }
}

export async function generateContractPdf(b: ContractBooking): Promise<Uint8Array> {
  const w = new Writer();
  await w.init();

  const fmt = (n: number) =>
    '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const timeRange =
    b.eventStart && b.eventEnd ? ` (${b.eventStart} - ${b.eventEnd})` : '';

  // ---- PAGE 1 — OFFERTEVOORSTEL ----------------------------------------
  w.heading('OFFERTEVOORSTEL', { top: 0 });
  w.subheading('Contactgegevens:');
  w.row('Naam:', b.customer.name);
  w.row('Adres:', `${b.customer.address}, ${b.customer.postcode} ${b.customer.city}`);
  w.row('Tel:', b.customer.phone);
  w.row('E-mail:', b.customer.email);
  w.spacer(6);
  w.para(`Amsterdam, ${b.issueDateLabel}`);
  w.para(`Betreft: offerte (${b.reservationNumber})`, { bold: true });
  w.spacer(4);
  w.para('Geachte gast,');
  w.para(
    'Het was ons een genoegen om de details van uw evenement door te spreken. Met plezier sturen wij u de offerte voor uw evenement. De offerte bevat informatie over het diner, bediening en de decoratie. Wij hopen dat de offerte aan uw wensen en verwachtingen voldoet. De offerte is met alle zorg en aandacht opgesteld, maar eventuele wijzigingen of aanvullingen zijn altijd bespreekbaar.'
  );
  w.spacer(2);
  w.row('Datum evenement:', `${b.eventDateLabel}${timeRange}`);
  w.row('Aantal gasten:', `${b.guestCount} personen`);
  w.row('Reserveringsnummer:', b.reservationNumber);
  if (b.optionDateLabel) w.row('Optiedatum:', `${b.optionDateLabel} (vervaldatum offerte)`);
  w.spacer(4);
  w.para(
    'In deze offerte is een programmavoorstel opgenomen. Uiteraard is dit een voorstel dat geheel aan uw specifieke wensen kan worden aangepast. Tevens kunt u meer informatie lezen over de prijzen en voorwaarden van Lila Catering.'
  );
  w.para(
    'Wij vertrouwen erop u met deze offerte voldoende geïnformeerd te hebben en zien ernaar uit om van uw evenement een onvergetelijke avond te maken. Mocht u nog vragen hebben, aarzelt u dan niet om contact met ons op te nemen via 06-559 888 95 of per e-mail info@lilacatering.nl.'
  );
  w.spacer(4);
  w.para('Met vriendelijke groet,', { bold: true });
  w.para('Lila Catering', { bold: true });

  // ---- PAGE 2 — OPBOUWOFFERTE ------------------------------------------
  w.pageBreak();
  w.heading('OPBOUWOFFERTE', { top: 0 });
  w.para('Het voorstel is opgebouwd uit een arrangement. In het arrangement zijn de volgende onderdelen inbegrepen:');
  w.subheading('Ontvangst');
  w.para(
    'Wij verzorgen de entreetafel inclusief accessoires, gevulde dadels met walnoot en glaasjes melk. Uw gasten worden ontvangen in de feestzaal. Tot aan het diner staan Jus d’Orange en water op de tafels. Nadat de gasten binnen zijn zal de bediening Marokkaanse thee uitserveren.'
  );
  w.row('Koffie:', 'Standaard Koffie');
  w.row('Frisdrank:', 'Onbeperkte service tijdens diner');
  w.row('Marokkaanse koekjes:', "Lila's Moroccan Sweets");
  w.spacer(4);
  w.subheading('Hapjes');
  (b.menu.hapjes.length ? b.menu.hapjes : ['—']).forEach((h) => w.bullet(h));
  w.spacer(2);
  w.subheading('Diner');
  w.para(
    `Een uitgebreid diner zal worden verzorgd voor ${b.guestCount} personen. Het diner bevat traditionele invloeden uit de Marokkaanse keuken en bestaat uit de volgende gerechten:`
  );
  w.row('Voorgerecht:', b.menu.voorgerecht.join(', ') || '—');
  w.row('Hoofdgerecht:', b.menu.hoofdgerecht.join(', ') || '—');
  w.row('Nagerecht:', b.menu.nagerecht.join(', ') || '—');
  w.para('Een onbeperkte service van ons assortiment frisdranken (Cola, Sprite, Ginger ale en sinaasappelsap).');
  w.spacer(2);
  w.subheading('Decoratie');
  w.para('De zaal staat volledig opgedekt voor u klaar met ons tafelzilver en prachtig servies met Marokkaanse invloeden. Zie bijlage I voor gedetailleerde info over de decoratie.');
  w.subheading('Bijzonderheden');
  w.para(
    'Eventuele keukenkosten of andere kosten die de zaal berekent voor Lila Catering ten behoeve van uw feest zijn voor uw rekening. Zoals oven, warmhoudwagen, afval en vaatwasser.'
  );

  // ---- PAGE 3 — BIJLAGE I (Decoratie) ----------------------------------
  w.pageBreak();
  w.heading('BIJLAGE I', { top: 0 });
  w.subheading('Decoratie');
  w.para('Onderstaande decoratiestijl is door u gekozen. De concrete invulling (tafeldecoratie, servies en sfeeraankleding) wordt binnen deze stijl definitief met u afgestemd.');
  w.spacer(4);

  if (b.decoration) {
    w.subheading(STYLE_LABEL[b.decoration]);
    w.para(STYLE_DESCRIPTION[b.decoration]);
    w.spacer(4);
  }

  // Generic breakdown within the chosen style. PLACEHOLDER values
  // ("nader te bepalen") until the office confirms items per style.
  const DECOR_DETAILS: [string, [string, string][]][] = [
    ['Tafeldecoratie', [
      ['Tafelkleed', 'nader te bepalen'],
      ['Kaarsen', 'nader te bepalen'],
      ['Servetten', 'nader te bepalen'],
      ['Centrepieces', 'nader te bepalen'],
    ]],
    ['Servies', [
      ['Servies', 'nader te bepalen'],
      ['Onderborden', 'nader te bepalen'],
      ['Bestek', 'nader te bepalen'],
      ['Glazen', 'nader te bepalen'],
    ]],
    ['Sfeeraankleding', [
      ['Collectie', 'nader te bepalen'],
      ['Entreetafel', 'nader te bepalen'],
      ['Bruidstaarttafel', 'nader te bepalen'],
      ['Zaalaankleding', 'nader te bepalen'],
    ]],
  ];

  DECOR_DETAILS.forEach(([label, rows]) => {
    w.subheading(label);
    rows.forEach(([k, val]) => w.row(`${k}:`, val));
    w.spacer(4);
  });

  w.para(
    'De entreetafel en bruidstaarttafel worden door ons gedecoreerd. Bovenstaande invulling wordt definitief afgestemd op de gekozen stijl.'
  );

  // ---- PAGE 4 — OVEREENKOMST -------------------------------------------
  w.pageBreak();
  w.heading('Overeenkomst', { top: 0 });
  w.para('De ondergetekenden:');
  w.row('de onderneming:', 'Lila Catering');
  w.row('de contractant:', b.customer.name);
  w.spacer(4);
  w.para('In aanmerking nemende dat:', { bold: true });
  w.para(
    'Lila Catering, hierna te noemen Lila, een onderneming is die zich in het kader van evenementen richt op het organiseren van evenementen ten behoeve van de voor contractant aanwezige gasten.'
  );
  w.para(
    'Deze overeenkomst zal contractant worden toegezonden als offerte. Na 7 dagen te rekenen vanaf datum verzending vervalt de offerte. Ingeval contractant akkoord gaat met de inhoud van de offerte en hij de offerte wil omzetten in een overeenkomst dient hij er zorg voor te dragen dat een exemplaar van de overeenkomst, voorzien van zijn handtekening, uiterlijk binnen de optietermijn in het bezit is van Lila. Indien dit het geval is, zijn partijen de volgende overeenkomst aangegaan.'
  );
  w.spacer(2);
  w.subheading('Algemeen');
  w.para(`Dit evenement zal plaatsvinden te: ${b.venue || '—'}`);
  w.para(`op datum ${b.eventDateLabel}`);
  if (b.eventStart && b.eventEnd) w.para(`tijdstip van ${b.eventStart} tot ${b.eventEnd}`);
  const btw = Math.round(b.total * 0.09 * 100) / 100;
  const totalIncl = Math.round((b.total + btw) * 100) / 100;
  w.para(
    `Lila zal op de datum van het evenement naar beste vermogen de zaaldecoratie en catering verzorgen voor ${b.guestCount} gasten tegen een totaalprijs van ${fmt(b.total)} (exclusief BTW). BTW 9%: ${fmt(btw)}. Totaalprijs inclusief BTW: ${fmt(totalIncl)}.`
  );
  w.para(
    `Na ontvangst van een aanbetaling van 10% van het totaalbedrag, met een minimum van € 1.000,- (in dit geval ${fmt(b.deposit)}) zal de datum worden vrijgehouden voor uw evenement. Zonder aanbetaling kunnen wij niet garanderen dat wij beschikbaar zijn op uw evenement.`
  );
  w.para(
    'Het totaalbedrag dient 30 dagen voor aanvang van het evenement in het bezit te zijn van Lila. Indien dit bedrag niet uiterlijk op de vervaldatum is bijgeschreven op de rekening van Lila, wordt de overeenkomst geacht te zijn geannuleerd door contractant, overeenkomstig de annuleringsvoorwaarden.'
  );
  w.spacer(2);
  w.subheading('Annuleringsvoorwaarden');
  w.para(
    'Contractant is niet bevoegd de overeenkomst te annuleren, tenzij hij tegelijkertijd onherroepelijk aanbiedt de hierna bepaalde bedragen te betalen. Iedere annulering wordt geacht een dergelijk aanbod te omvatten. Een dergelijk aanbod wordt geacht te zijn aanvaard indien Lila het aanbod niet onmiddellijk verwerpt.'
  );
  w.bullet('Bij annulering meer dan 120 dagen voor de (eerste) dag van uitvoering is contractant gehouden aan de compensatie van de reeds gemaakte kosten en verrichte werkzaamheden.');
  w.bullet('Bij annulering 30 dagen of meer voor bedoeld tijdstip is contractant gehouden 30% van de totaalsom aan Lila te betalen.');
  w.bullet('Bij annulering minder dan 30 dagen voor bedoeld tijdstip is contractant gehouden 50% van de totaalsom aan Lila te betalen.');
  w.bullet('Bij annulering minder dan 7 dagen voor bedoeld tijdstip is contractant gehouden 100% van de totaalsom aan Lila te betalen.');
  w.para(
    'In geval dat er onverhoopt omstandigheden voordoen in uw privesituatie, heeft u de mogelijkheid uw evenement tot 1 maand voor aanvang te verplaatsen naar een nader te bepalen datum met een maximum van 7 maanden. De reeds gedane aanbetaling blijft staan en wordt niet geretourneerd. Reeds gemaakte kosten door Lila in verband met reserveringskosten aan externe leveranciers dienen gecompenseerd te worden.'
  );
  w.spacer(2);
  w.subheading('Aansprakelijkheid');
  w.para(
    'Lila aanvaardt geen enkele aansprakelijkheid voor schade in verband met diefstal, verduistering of verlies van zaken welke zich in de gehuurde ruimte(n) bevinden. Deze zaken verblijven in het gehuurde voor eigen risico van de eigenaar en/of belanghebbende.'
  );
  w.para('Contractant is aansprakelijk voor de schade die door hem en/of zijn gasten aan Lila en zijn medewerkers wordt toegebracht.');
  w.para('Lila is nimmer aansprakelijk voor schade door toedoen van derden waaronder toeleveranciers.');
  w.spacer(2);
  w.subheading('Overige voorwaarden');
  w.para(
    'Ongeacht verzuim heeft Lila het recht de overeenkomst te ontbinden indien redelijke grond bestaat dat client zijn verplichtingen niet na zal komen, failliet gaat, surseance van betaling aanvraagt of een beroep zal doen op de Wet Schuldsanering Natuurlijke Personen, zonder ingebrekestelling of rechterlijke tussenkomst.'
  );
  w.para('Contractant heeft kennisgenomen van de Algemene Voorwaarden van Lila en gaat hiermee akkoord.');

  // ---- PAGE 5 — HANDTEKENINGEN -----------------------------------------
  w.pageBreak();
  w.heading('Ondertekening', { top: 0 });
  w.para(`Aldus overeengekomen d.d. ${b.issueDateLabel} te Amsterdam.`);
  w.spacer(30);
  // Two signature columns
  const colY = w.y;
  const drawSig = (x: number, party: string, name: string) => {
    w.page.drawText(sanitize(party), { x, y: colY, size: 10, font: w.bold, color: INK });
    w.page.drawText(sanitize(name), { x, y: colY - 16, size: 10, font: w.font, color: INK });
    w.page.drawText('Datum:', { x, y: colY - 50, size: 10, font: w.font, color: MUTED });
    w.page.drawText('Handtekening:', { x, y: colY - 84, size: 10, font: w.font, color: MUTED });
    w.page.drawLine({ start: { x: x + 78, y: colY - 86 }, end: { x: x + 210, y: colY - 86 }, thickness: 0.8, color: MUTED });
  };
  drawSig(MARGIN, 'Contractant 1:', 'Lila Catering');
  drawSig(MARGIN + 270, 'Contractant 2:', b.customer.name);
  w.y = colY - 110;
  w.spacer(20);
  w.para('Handtekeningen worden digitaal geplaatst via Signhost.', { size: 9, color: MUTED });

  return w.doc.save();
}

/** Capitalise the first letter of each word (so "donderdag 30 april" → "Donderdag 30 April"). */
function titleCaseWords(s: string): string {
  return s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/** Format a YYYY-MM-DD date in Dutch, e.g. "Donderdag 30 April 2026" (or without weekday). */
export function formatDutchDate(iso: string, withWeekday = false): string {
  const d = new Date(`${iso}T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    weekday: withWeekday ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return titleCaseWords(fmt.format(d));
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Build a ContractBooking from raw reservation data (formats dates, reservation nr). */
export function buildContractBooking(input: {
  customer: ContractBooking['customer'];
  eventDateISO: string; // YYYY-MM-DD
  eventStart?: string;
  eventEnd?: string;
  foodTime?: string;
  guestCount: number;
  venue?: string;
  menu: ContractBooking['menu'];
  decoration: ContractBooking['decoration'];
  total: number;
  deposit: number;
  todayISO: string; // YYYY-MM-DD (offer issue date)
}): ContractBooking {
  return {
    customer: input.customer,
    eventDateLabel: formatDutchDate(input.eventDateISO, true),
    eventStart: input.eventStart,
    eventEnd: input.eventEnd,
    foodTime: input.foodTime,
    guestCount: input.guestCount,
    venue: input.venue,
    menu: input.menu,
    decoration: input.decoration,
    total: input.total,
    deposit: input.deposit,
    reservationNumber: buildReservationNumber(input.eventDateISO, 1),
    issueDateLabel: formatDutchDate(input.todayISO, false),
    optionDateLabel: formatDutchDate(addDaysISO(input.todayISO, 7), false),
  };
}

/** A realistic sample booking for previewing the contract layout. */
export function sampleBooking(): ContractBooking {
  const total = 7250;
  return {
    customer: {
      firstName: 'Omar',
      lastName: 'el Idrissi',
      name: 'Omar el Idrissi',
      email: 'omar@example.com',
      phone: '06-87821547',
      address: 'Noordwachter 77',
      postcode: '1503 VL',
      city: 'Zaandam',
    },
    eventDateLabel: 'Donderdag 30 April 2026',
    eventStart: '18:00',
    eventEnd: '01:00',
    foodTime: '21:00',
    guestCount: 200,
    venue: 'Majestic Venues, Amsterdam',
    menu: {
      hapjes: ['Kiploempia', 'Tempura Shrimp in chilisaus'],
      voorgerecht: ["Lila's Classic Vispastilla"],
      hoofdgerecht: ["Lila's Gold Dal'a"],
      nagerecht: ['Grand Lila Dessert'],
    },
    decoration: 'classic',
    total,
    deposit: Math.max(1000, Math.round(total * 0.1 * 100) / 100),
    reservationNumber: buildReservationNumber('2026-04-30', 1),
    issueDateLabel: '27 Juni 2026',
    optionDateLabel: '4 Juli 2026',
  };
}
