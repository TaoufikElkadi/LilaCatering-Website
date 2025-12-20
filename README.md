# Lila Catering - Authentic Moroccan Catering Website

A modern, luxury website for a Moroccan catering business built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Elegant Design**: Black, white, gold, dark red, and golden brown color scheme inspired by Moroccan luxury
- 📱 **Fully Responsive**: Mobile-first design that works beautifully on all devices
- ✨ **Smooth Animations**: Powered by Framer Motion for delightful user interactions
- 🍽️ **Interactive Menu Builder**: Visual menu selection system with categories (Starters, Mains, Desserts)
- 📋 **Detailed Menu Summary**: View all selected dishes with descriptions and prices
- 📄 **PDF Offerte Generation**: Download professional PDF proposals with full event details
- 📅 **Calendly Integration**: Embedded appointment scheduling with automatic conflict prevention
- 🔒 **Double-Booking Protection**: Calendly syncs with your calendar to prevent overlapping appointments
- 📅 **Event Planning**: Calendar date picker, guest count, and event type selection
- 🖼️ **Gallery**: Filterable image gallery with lightbox functionality
- 🇲🇦 **Moroccan Authenticity**: Traditional patterns, colors, and cultural elements throughout

## Pages

1. **Home** - Hero section, services, menu builder, and booking form
2. **About** - Company story, values, and team
3. **Gallery** - Filtered gallery of dishes, events, and decor

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF with jspdf-autotable
- **Email**: Nodemailer
- **Fonts**: Playfair Display (serif) & Inter (sans-serif)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
LilaCatering/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── api/
│   │   └── book-call/
│   │       └── route.ts
│   ├── gallery/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── MenuBuilder.tsx
│   ├── MenuCard.tsx
│   ├── BookingForm.tsx
│   └── ... (other components)
├── data/
│   └── menuData.ts
├── utils/
│   └── pdfGenerator.ts
├── public/
│   ├── images/
│   └── videos/
├── env.example
└── EMAIL_SETUP.md
```

## Customization

### Adding Real Images/Videos

Replace placeholder content in:
- `/public/images/` - Add dish, event, and decor photos
- `/public/videos/` - Add hero background video
- Update `Hero.tsx` component to use your video

### Menu Items

Edit `/data/menuData.ts` to:
- Add/remove dishes
- Update prices
- Modify descriptions
- Change event types

### Colors

Modify the color scheme in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    black: '#000000',
    white: '#FFFFFF',
    gold: '#D4AF37',
    'dark-red': '#8B0000',
    'golden-brown': '#996515',
  },
}
```

### Contact Information

Update footer contact details in `/components/Footer.tsx`

## New Features ✨

### PDF Offerte Generation
- Professional PDF proposals with event details
- Itemized menu with descriptions and pricing
- Extras and decoration breakdown
- Downloadable directly from the menu builder

### Book a Call System
- Simplified booking form for consultation calls
- Optional PDF upload (if user downloaded offerte)
- Automatic email notifications to business owner
- Form data validation and error handling

### Email Integration
- Automatic booking notifications via email
- PDF attachments included in emails
- Configurable SMTP settings
- Works with Gmail, SendGrid, Mailgun, and more

## Features to Add (Future)

- [ ] Admin dashboard for menu management
- [ ] Multi-language support (Arabic, French)
- [ ] Real-time availability calendar
- [ ] Customer testimonials section
- [ ] Blog/recipes section
- [ ] Shopping cart for package deals
- [ ] Integration with calendar booking tools (Calendly, etc.)

## License

All rights reserved © 2024 Lila Catering

## Support

For questions or support, contact: info@lilacatering.com

