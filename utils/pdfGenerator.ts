import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuItem } from '@/data/menuData';
import { EventType } from '@/components/EventTypeSelector';
import { DecorationType } from '@/components/DecorationSelector';

interface OfferteData {
  eventType: EventType;
  eventDate: string;
  selectedItems: MenuItem[];
  guestCount: number;
  includeCoffee: boolean;
  includeDrinks: boolean;
  selectedDecoration: DecorationType;
  totalPrice: number;
}

export const generateOffertePDF = (data: OfferteData): jsPDF => {
  const doc = new jsPDF();
  
  // Header - Lila Catering Logo and Title
  doc.setFillColor(31, 31, 31);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('LILA CATERING', 105, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Authentic Moroccan Catering', 105, 23, { align: 'center' });
  doc.text('Event Proposal', 105, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(31, 31, 31);
  
  // Event Details Section
  let yPos = 50;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Details', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const eventDateFormatted = new Date(data.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  doc.text(`Event Type: ${data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)}`, 20, yPos);
  yPos += 7;
  doc.text(`Event Date: ${eventDateFormatted}`, 20, yPos);
  yPos += 7;
  doc.text(`Number of Guests: ${data.guestCount}`, 20, yPos);
  
  // Menu Selection Section
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Menu Selection', 20, yPos);
  
  yPos += 5;
  
  // Group items by category
  const starters = data.selectedItems.filter(item => item.category === 'starter');
  const mains = data.selectedItems.filter(item => item.category === 'main');
  const desserts = data.selectedItems.filter(item => item.category === 'dessert');
  
  // Starters
  if (starters.length > 0) {
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Starters', 20, yPos);
    
    const starterRows = starters.map(item => [
      item.name,
      item.description,
      item.price,
      `€${(parseFloat(item.price.replace('€', '')) * data.guestCount).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: yPos + 2,
      head: [['Dish', 'Description', 'Price/Guest', 'Total']],
      body: starterRows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 211, 197], textColor: [31, 31, 31], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 75 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 5;
  }
  
  // Mains
  if (mains.length > 0) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Main Courses', 20, yPos);
    
    const mainRows = mains.map(item => [
      item.name,
      item.description,
      item.price,
      `€${(parseFloat(item.price.replace('€', '')) * data.guestCount).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: yPos + 2,
      head: [['Dish', 'Description', 'Price/Guest', 'Total']],
      body: mainRows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 211, 197], textColor: [31, 31, 31], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 75 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 5;
  }
  
  // Desserts
  if (desserts.length > 0) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Desserts', 20, yPos);
    
    const dessertRows = desserts.map(item => [
      item.name,
      item.description,
      item.price,
      `€${(parseFloat(item.price.replace('€', '')) * data.guestCount).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: yPos + 2,
      head: [['Dish', 'Description', 'Price/Guest', 'Total']],
      body: dessertRows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 211, 197], textColor: [31, 31, 31], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 75 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 5;
  }
  
  // Extras and Decoration
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Additional Services', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const extrasRows = [];
  
  if (data.includeCoffee) {
    extrasRows.push([
      'Moroccan Coffee & Tea',
      'Traditional mint tea and coffee service',
      '€5.00',
      `€${(5 * data.guestCount).toFixed(2)}`
    ]);
  }
  
  if (data.includeDrinks) {
    extrasRows.push([
      'Premium Beverages',
      'Selection of soft drinks and juices',
      '€8.00',
      `€${(8 * data.guestCount).toFixed(2)}`
    ]);
  }
  
  const decorationPrices: Record<DecorationType, number> = {
    none: 0,
    minimal: 150,
    traditional: 350,
    luxury: 650,
    custom: 0,
  };
  
  const decorationNames: Record<DecorationType, string> = {
    none: 'None',
    minimal: 'Minimal Decoration',
    traditional: 'Traditional Decoration',
    luxury: 'Luxury Decoration',
    custom: 'Custom Decoration',
  };
  
  if (data.selectedDecoration !== 'none') {
    extrasRows.push([
      decorationNames[data.selectedDecoration],
      'Event decoration and table setup',
      '-',
      `€${decorationPrices[data.selectedDecoration].toFixed(2)}`
    ]);
  }
  
  if (extrasRows.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Service', 'Description', 'Price/Guest', 'Total']],
      body: extrasRows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [220, 211, 197], textColor: [31, 31, 31], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 75 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.text('No additional services selected', 20, yPos);
    yPos += 10;
  }
  
  // Total Price Section
  yPos += 10;
  doc.setFillColor(247, 243, 236);
  doc.rect(20, yPos - 5, 170, 20, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estimated Total:', 25, yPos + 5);
  
  doc.setFontSize(18);
  doc.text(`€${data.totalPrice.toFixed(2)}`, 185, yPos + 5, { align: 'right' });
  
  // Footer Notes
  yPos += 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(108, 101, 91);
  doc.text('This is an estimated proposal. Final pricing may vary based on specific requirements.', 20, yPos);
  yPos += 5;
  doc.text('All prices are inclusive of VAT. A deposit of 30% is required to confirm the booking.', 20, yPos);
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(31, 31, 31);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('LILA CATERING | info@lilacatering.com | +31 (0)6 1234 5678', 105, pageHeight - 10, { align: 'center' });
  
  return doc;
};

export const downloadOffertePDF = (data: OfferteData, fileName?: string) => {
  const doc = generateOffertePDF(data);
  const name = fileName || `Lila_Catering_Offerte_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(name);
};

