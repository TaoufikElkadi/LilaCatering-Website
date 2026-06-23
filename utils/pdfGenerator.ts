import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItem } from '@/data/menuData';
import { EventType } from '@/components/EventTypeSelector';
import { DecorationType } from '@/components/DecorationSelector';
import { getTranslation, Lang } from './translations';
import {
  BASE_PRICE,
  getPerPersonPrice,
  formatEuro,
  TABLE_EXTRA_PRICES,
  TEA_SHOW_FEES,
  SMOOTHIE_MIX_PER_GUEST,
  type TableExtraId,
  type TeaShowId,
} from '@/lib/pricing';

interface OfferteData {
  eventType: EventType;
  eventDate: string;
  selectedItems: MenuItem[];
  guestCount: number;
  coffeeLuxe: boolean;
  cookiesLuxe: boolean;
  tableExtras?: TableExtraId[];
  mocktailMix?: boolean;
  teaShow?: TeaShowId;
  selectedDecoration: DecorationType;
  venueName?: string;
  venueCity?: string;
  transportFee?: number;
  transportOnRequest?: boolean;
  totalPrice: number;
  lang?: Lang;
}

// Moroccan Color Palette
const COLORS = {
  burgundy: [139, 69, 19] as [number, number, number],
  gold: [193, 154, 91] as [number, number, number],
  cream: [245, 237, 224] as [number, number, number],
  warmWhite: [252, 249, 244] as [number, number, number],
  darkText: [31, 31, 31] as [number, number, number],
  lightGold: [220, 196, 154] as [number, number, number],
  terracotta: [142, 68, 68] as [number, number, number],
};

// Helper function to draw Moroccan geometric pattern
const drawMoroccanPattern = (doc: jsPDF, x: number, y: number, size: number) => {
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.3);

  // Draw diamond pattern
  const half = size / 2;
  doc.line(x + half, y, x + size, y + half);
  doc.line(x + size, y + half, x + half, y + size);
  doc.line(x + half, y + size, x, y + half);
  doc.line(x, y + half, x + half, y);

  // Inner star
  const quarter = size / 4;
  doc.line(x + half, y + quarter, x + half + quarter, y + half);
  doc.line(x + half + quarter, y + half, x + half, y + half + quarter);
  doc.line(x + half, y + half + quarter, x + half - quarter, y + half);
  doc.line(x + half - quarter, y + half, x + half, y + quarter);
};

// Helper function to draw decorative border
const drawDecorativeBorder = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  // Outer frame with gold
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.8);
  doc.rect(x, y, width, height);

  // Inner frame with burgundy
  doc.setDrawColor(...COLORS.burgundy);
  doc.setLineWidth(0.3);
  doc.rect(x + 1, y + 1, width - 2, height - 2);

  // Corner ornaments
  const cornerSize = 3;
  const corners = [
    { x: x, y: y }, // top-left
    { x: x + width - cornerSize, y: y }, // top-right
    { x: x, y: y + height - cornerSize }, // bottom-left
    { x: x + width - cornerSize, y: y + height - cornerSize }, // bottom-right
  ];

  doc.setFillColor(...COLORS.gold);
  corners.forEach(corner => {
    doc.circle(corner.x + cornerSize/2, corner.y + cornerSize/2, 0.8, 'F');
  });
};

// Helper function to draw geometric section divider
const drawSectionDivider = (doc: jsPDF, y: number) => {
  const centerX = 105;
  const lineWidth = 40;

  // Gold line
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(centerX - lineWidth, y, centerX + lineWidth, y);

  // Center ornament
  doc.setFillColor(...COLORS.gold);
  doc.circle(centerX, y, 1.5, 'F');

  // Small diamonds on sides
  for (let i = 0; i < 3; i++) {
    const offset = 8 + (i * 10);
    doc.circle(centerX - offset, y, 0.6, 'F');
    doc.circle(centerX + offset, y, 0.6, 'F');
  }
};

// Helper function to draw repeating pattern border
const drawPatternBorder = (doc: jsPDF, startX: number, startY: number, endX: number) => {
  const patternSize = 4;
  const numPatterns = Math.floor((endX - startX) / patternSize);

  for (let i = 0; i < numPatterns; i++) {
    const x = startX + (i * patternSize);
    drawMoroccanPattern(doc, x, startY, patternSize);
  }
};

export const generateOffertePDF = (data: OfferteData): jsPDF => {
  const lang: Lang = data.lang || 'en';
  const t = (path: string) => getTranslation(lang, path);
  const doc = new jsPDF();

  // ============ HEADER SECTION ============
  // Background with gradient effect (simulated with overlapping rectangles)
  doc.setFillColor(...COLORS.warmWhite);
  doc.rect(0, 0, 210, 60, 'F');

  // Top decorative border with pattern
  doc.setFillColor(...COLORS.burgundy);
  doc.rect(0, 0, 210, 8, 'F');
  drawPatternBorder(doc, 0, 2, 210);

  // Logo placeholder with ornamental frame
  const logoX = 85;
  const logoY = 14;
  const logoWidth = 40;
  const logoHeight = 20;

  // Logo background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoX, logoY, logoWidth, logoHeight, 2, 2, 'F');

  // Decorative border around logo
  drawDecorativeBorder(doc, logoX - 2, logoY - 2, logoWidth + 4, logoHeight + 4);

  // Logo placeholder text
  doc.setTextColor(...COLORS.gold);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('[LOGO]', logoX + logoWidth/2, logoY + logoHeight/2 + 1, { align: 'center' });

  // Company name below logo
  doc.setTextColor(...COLORS.burgundy);
  doc.setFontSize(26);
  doc.setFont('times', 'bold');
  doc.text('LILA CATERING', 105, 45, { align: 'center' });

  // Tagline with decorative elements
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gold);
  const tagline = t('menuBuilder.pdf.header.tagline');
  doc.text('✦  ' + tagline + '  ✦', 105, 52, { align: 'center' });

  // Quote title
  doc.setFontSize(11);
  doc.setFont('times', 'italic');
  doc.setTextColor(...COLORS.darkText);
  doc.text(t('menuBuilder.pdf.header.title'), 105, 58, { align: 'center' });

  // Decorative divider after header
  drawSectionDivider(doc, 65);

  // ============ EVENT DETAILS SECTION ============
  let yPos = 75;

  // Section title with decorative background
  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(20, yPos - 6, 170, 10, 1, 1, 'F');

  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.burgundy);
  doc.text(t('menuBuilder.pdf.eventDetails'), 25, yPos);

  // Small decorative element
  doc.setFillColor(...COLORS.gold);
  doc.circle(185, yPos - 2, 1.2, 'F');

  yPos += 10;

  // Event details in elegant layout
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkText);

  const locale = lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US';
  const eventDateFormatted = new Date(data.eventDate + 'T00:00:00').toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTypeTranslation = t(`menuBuilder.eventType.types.${data.eventType}.name`);

  // Detail boxes with subtle backgrounds
  const detailsBoxY = yPos;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...COLORS.lightGold);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, detailsBoxY, 170, 22, 2, 2, 'FD');

  // Grid layout for details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gold);
  doc.text(t('menuBuilder.pdf.eventType'), 25, yPos + 5);
  doc.text(t('menuBuilder.pdf.eventDate'), 25, yPos + 12);
  doc.text(t('menuBuilder.pdf.numberOfGuests'), 25, yPos + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkText);
  doc.text(eventTypeTranslation, 75, yPos + 5);
  doc.text(eventDateFormatted, 75, yPos + 12);
  doc.text(data.guestCount.toString(), 75, yPos + 19);

  yPos += 30;

  // Decorative divider
  drawSectionDivider(doc, yPos);
  yPos += 10;

  // ============ MENU SELECTION SECTION ============
  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(20, yPos - 6, 170, 10, 1, 1, 'F');

  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.burgundy);
  doc.text(t('menuBuilder.pdf.menuSelection'), 25, yPos);

  doc.setFillColor(...COLORS.gold);
  doc.circle(185, yPos - 2, 1.2, 'F');

  yPos += 8;

  // Group items by category
  const appetizers = data.selectedItems.filter(item => item.category === 'appetizer');
  const starters = data.selectedItems.filter(item => item.category === 'starter');
  const mains = data.selectedItems.filter(item => item.category === 'main');
  const desserts = data.selectedItems.filter(item => item.category === 'dessert');

  // Build a dish table row from a MenuItem using the new pricing model.
  // - included items: per-guest column shows the "included" label, total is €0,00
  // - flatFee items: surcharge is a one-time fee, not multiplied by guests
  // - normal items: per-guest = surcharge, total = surcharge × guests
  const buildDishRow = (item: MenuItem): string[] => {
    let perGuest: string;
    let total: string;
    if (item.included) {
      perGuest = t('menuBuilder.pdf.included');
      total = formatEuro(0);
    } else if (item.flatFee) {
      perGuest = `${formatEuro(item.surcharge)} (1×)`;
      total = formatEuro(item.surcharge);
    } else {
      perGuest = formatEuro(item.surcharge);
      total = formatEuro(item.surcharge * data.guestCount);
    }
    return [item.name, item.description, perGuest, total];
  };

  // Base price summary line
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkText);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gold);
  doc.text(t('menuBuilder.pdf.basePrice'), 25, yPos + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.darkText);
  doc.text(
    `${formatEuro(BASE_PRICE)}  •  ${formatEuro(getPerPersonPrice(data.selectedItems))} / ${t('menuBuilder.pdf.numberOfGuests').toLowerCase()}`,
    75,
    yPos + 4
  );

  yPos += 8;

  // Enhanced table styling
  const tableConfig = {
    theme: 'plain' as const,
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: COLORS.lightGold,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLORS.burgundy,
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold' as const,
      fontSize: 9,
      halign: 'center' as const,
    },
    bodyStyles: {
      textColor: COLORS.darkText,
    },
    alternateRowStyles: {
      fillColor: COLORS.warmWhite,
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' as const },
      1: { cellWidth: 75, fontSize: 8 },
      2: { cellWidth: 25, halign: 'right' as const },
      3: { cellWidth: 25, halign: 'right' as const, fontStyle: 'bold' as const, textColor: COLORS.burgundy },
    },
    margin: { left: 20, right: 20 },
  };

  // Appetizers
  if (appetizers.length > 0) {
    yPos += 3;
    doc.setFontSize(11);
    doc.setFont('times', 'italic');
    doc.setTextColor(...COLORS.gold);
    doc.text('◆ ' + t('menuBuilder.pdf.appetizers'), 20, yPos);

    const appetizerRows = appetizers.map(buildDishRow);

    autoTable(doc, {
      startY: yPos + 2,
      head: [[t('menuBuilder.pdf.tableHeaders.dish'), t('menuBuilder.pdf.tableHeaders.description'), t('menuBuilder.pdf.tableHeaders.pricePerGuest'), t('menuBuilder.pdf.tableHeaders.total')]],
      body: appetizerRows,
      ...tableConfig,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  }

  // Starters
  if (starters.length > 0) {
    yPos += 3;
    doc.setFontSize(11);
    doc.setFont('times', 'italic');
    doc.setTextColor(...COLORS.gold);
    doc.text('◆ ' + t('menuBuilder.pdf.starters'), 20, yPos);

    const starterRows = starters.map(buildDishRow);

    autoTable(doc, {
      startY: yPos + 2,
      head: [[t('menuBuilder.pdf.tableHeaders.dish'), t('menuBuilder.pdf.tableHeaders.description'), t('menuBuilder.pdf.tableHeaders.pricePerGuest'), t('menuBuilder.pdf.tableHeaders.total')]],
      body: starterRows,
      ...tableConfig,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  }

  // Mains
  if (mains.length > 0) {
    doc.setFontSize(11);
    doc.setFont('times', 'italic');
    doc.setTextColor(...COLORS.gold);
    doc.text('◆ ' + t('menuBuilder.pdf.mainCourses'), 20, yPos);

    const mainRows = mains.map(buildDishRow);

    autoTable(doc, {
      startY: yPos + 2,
      head: [[t('menuBuilder.pdf.tableHeaders.dish'), t('menuBuilder.pdf.tableHeaders.description'), t('menuBuilder.pdf.tableHeaders.pricePerGuest'), t('menuBuilder.pdf.tableHeaders.total')]],
      body: mainRows,
      ...tableConfig,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  }

  // Desserts
  if (desserts.length > 0) {
    doc.setFontSize(11);
    doc.setFont('times', 'italic');
    doc.setTextColor(...COLORS.gold);
    doc.text('◆ ' + t('menuBuilder.pdf.desserts'), 20, yPos);

    const dessertRows = desserts.map(buildDishRow);

    autoTable(doc, {
      startY: yPos + 2,
      head: [[t('menuBuilder.pdf.tableHeaders.dish'), t('menuBuilder.pdf.tableHeaders.description'), t('menuBuilder.pdf.tableHeaders.pricePerGuest'), t('menuBuilder.pdf.tableHeaders.total')]],
      body: dessertRows,
      ...tableConfig,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  }

  // Decorative divider
  drawSectionDivider(doc, yPos);
  yPos += 10;

  // ============ ADDITIONAL SERVICES SECTION ============
  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(20, yPos - 6, 170, 10, 1, 1, 'F');

  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.burgundy);
  doc.text(t('menuBuilder.pdf.additionalServices'), 25, yPos);

  doc.setFillColor(...COLORS.gold);
  doc.circle(185, yPos - 2, 1.2, 'F');

  yPos += 8;

  const extrasRows = [];

  // Standard table service is always included with every package.
  extrasRows.push([
    t('menuBuilder.pdf.extras.standardService'),
    t('menuBuilder.pdf.extras.standardServiceDesc'),
    t('menuBuilder.pdf.included'),
    formatEuro(0),
  ]);

  if (data.coffeeLuxe) {
    extrasRows.push([
      t('menuBuilder.pdf.extras.coffeeLuxe'),
      t('menuBuilder.pdf.extras.coffeeLuxeDesc'),
      formatEuro(4.5),
      formatEuro(4.5 * data.guestCount)
    ]);
  }

  if (data.cookiesLuxe) {
    extrasRows.push([
      t('menuBuilder.pdf.extras.cookiesLuxe'),
      t('menuBuilder.pdf.extras.cookiesLuxeDesc'),
      formatEuro(3),
      formatEuro(3 * data.guestCount)
    ]);
  }

  // Optional per-guest table extras / soups.
  (data.tableExtras ?? []).forEach((id) => {
    const price = TABLE_EXTRA_PRICES[id];
    extrasRows.push([
      t(`menuBuilder.extras.items.${id}`),
      t('menuBuilder.extras.tableExtrasLabel'),
      formatEuro(price),
      formatEuro(price * data.guestCount),
    ]);
  });

  // 4-soort mocktail & smoothie mix — on request.
  if (data.mocktailMix) {
    extrasRows.push([
      t('menuBuilder.extras.mocktailMixName'),
      t('menuBuilder.extras.extraServicesLabel'),
      formatEuro(SMOOTHIE_MIX_PER_GUEST),
      formatEuro(SMOOTHIE_MIX_PER_GUEST * data.guestCount),
    ]);
  }

  // Tea show (standard included; Jbala / Chleuh are one-time fees).
  {
    const teaShow = data.teaShow ?? 'standard';
    const fee = TEA_SHOW_FEES[teaShow];
    extrasRows.push([
      t(`menuBuilder.extras.teaShows.${teaShow}`),
      t('menuBuilder.extras.teaShowLabel'),
      '-',
      fee === 0 ? t('menuBuilder.pdf.included') : formatEuro(fee),
    ]);
  }

  const decorationPrices: Record<DecorationType, number> = {
    basic: 0,
    classic: 500,
    grace: 1000,
    custom: 0,
  };

  extrasRows.push([
    t(`menuBuilder.pdf.decoration.${data.selectedDecoration}`),
    t('menuBuilder.pdf.extras.decoration'),
    '-',
    data.selectedDecoration === 'custom'
      ? t('menuBuilder.pdf.onRequest')
      : data.selectedDecoration === 'basic'
      ? t('menuBuilder.pdf.included')
      : formatEuro(decorationPrices[data.selectedDecoration])
  ]);

  // Transport — venue-based; one-time, not multiplied.
  if (data.venueName) {
    const venueLabel = data.venueCity ? `${data.venueName}, ${data.venueCity}` : data.venueName;
    extrasRows.push([
      t('menuBuilder.pdf.extras.transport'),
      venueLabel,
      '-',
      data.transportOnRequest ? t('menuBuilder.pdf.onRequest') : formatEuro(data.transportFee ?? 0)
    ]);
  }

  if (extrasRows.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [[t('menuBuilder.pdf.tableHeaders.service'), t('menuBuilder.pdf.tableHeaders.description'), t('menuBuilder.pdf.tableHeaders.pricePerGuest'), t('menuBuilder.pdf.tableHeaders.total')]],
      body: extrasRows,
      ...tableConfig,
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(t('menuBuilder.pdf.noServices'), 25, yPos + 5);
    yPos += 15;
  }

  // Decorative divider
  drawSectionDivider(doc, yPos);
  yPos += 12;

  // ============ TOTAL PRICE SECTION ============
  // Elegant total box with Moroccan border
  const totalBoxHeight = 28;

  // Background with gradient effect
  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(20, yPos, 170, totalBoxHeight, 3, 3, 'F');

  // Decorative border
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1);
  doc.roundedRect(20, yPos, 170, totalBoxHeight, 3, 3, 'S');

  // Inner accent border
  doc.setDrawColor(...COLORS.burgundy);
  doc.setLineWidth(0.3);
  doc.roundedRect(22, yPos + 2, 166, totalBoxHeight - 4, 2, 2, 'S');

  // Corner ornaments
  doc.setFillColor(...COLORS.gold);
  [24, 186].forEach(x => {
    [yPos + 4, yPos + totalBoxHeight - 4].forEach(y => {
      doc.circle(x, y, 1, 'F');
    });
  });

  // Total label
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.burgundy);
  doc.text(t('menuBuilder.pdf.estimatedTotal'), 30, yPos + 12);

  // Total amount - prominently displayed
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.setTextColor(...COLORS.gold);
  doc.text(formatEuro(data.totalPrice), 180, yPos + 13, { align: 'right' });

  // Price disclaimer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(t('menuBuilder.pdf.priceDisclaimer'), 30, yPos + 22, { maxWidth: 150 });

  // ============ FOOTER NOTES ============
  yPos += totalBoxHeight + 12;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text('✦  ' + t('menuBuilder.pdf.footerNote1'), 20, yPos);
  yPos += 5;
  doc.text('✦  ' + t('menuBuilder.pdf.footerNote2'), 20, yPos);

  // ============ FOOTER BAR ============
  const pageHeight = doc.internal.pageSize.height;

  // Footer with pattern
  doc.setFillColor(...COLORS.burgundy);
  doc.rect(0, pageHeight - 25, 210, 25, 'F');

  // Top border pattern
  drawPatternBorder(doc, 0, pageHeight - 25, 210);

  // Decorative line
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 18, 190, pageHeight - 18);

  // Footer text
  doc.setTextColor(...COLORS.warmWhite);
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('LILA CATERING', 105, pageHeight - 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('info@lilacatering.com  •  +31 (0)6 1234 5678', 105, pageHeight - 6, { align: 'center' });

  return doc;
};

export const downloadOffertePDF = (data: OfferteData, fileName?: string) => {
  const doc = generateOffertePDF(data);
  const name = fileName || `Lila_Catering_Offerte_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(name);
};
