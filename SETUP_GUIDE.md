# Setup Guide - Lila Catering Website

## Quick Start

Your Moroccan catering website is ready to use! Follow these steps to get started:

### 1. Development Server is Running

The development server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.214:3000

You can access the website in your browser now!

### 2. Project Structure Overview

```
LilaCatering/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (hero, services, menu builder, booking)
│   ├── about/page.tsx     # About Us page
│   ├── gallery/page.tsx   # Gallery page
│   └── layout.tsx         # Root layout with navigation & footer
├── components/            # Reusable React components
├── data/menuData.ts       # Menu items and event types
├── public/                # Static assets (images, videos)
└── tailwind.config.ts     # Tailwind configuration
```

## Next Steps

### Adding Your Own Content

#### 1. Replace Placeholder Images

The website currently uses placeholder emojis. Add your real images here:

```
public/
├── images/
│   ├── starters/          # Images for starter dishes
│   ├── mains/             # Images for main courses
│   ├── desserts/          # Images for desserts
│   ├── events/            # Event photos
│   └── decor/             # Decor and setup photos
└── videos/                # Hero background video
```

**Image Requirements:**
- Format: JPG, PNG, or WebP
- Recommended size: 800x800px for menu items
- Optimize images before uploading (use tools like TinyPNG)

#### 2. Update Menu Items

Edit `/data/menuData.ts`:

```typescript
{
  id: 'starter-1',
  name: 'Your Dish Name',
  description: 'Delicious description',
  price: '€12',
  image: '/images/starters/your-image.jpg', // Update this path
  category: 'starter',
}
```

#### 3. Add Hero Video

Replace the background in `/components/Hero.tsx`:

```tsx
// Find this line and replace with your video:
<video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/videos/hero-background.mp4" type="video/mp4" />
</video>
```

**Video Requirements:**
- Format: MP4 (H.264 codec)
- Recommended size: 1920x1080px
- Keep file size under 10MB for performance
- Consider having both MP4 and WebM formats

#### 4. Update Contact Information

Edit `/components/Footer.tsx`:

```tsx
// Update these fields:
<li>Email: your-email@lilacatering.com</li>
<li>Phone: +212 XXX-XXX-XXX</li>
<li>Location: Your Actual City</li>
```

#### 5. Add Your Logo

1. Place your logo in `/public/images/logo.png`
2. Edit `/components/Navigation.tsx`:

```tsx
// Replace the text logo with:
<Link href="/" className="flex items-center">
  <Image 
    src="/images/logo.png" 
    alt="Lila Catering" 
    width={150} 
    height={50}
  />
</Link>
```

### Color Customization

The color palette is defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    black: '#000000',      // Main background
    white: '#FFFFFF',      // Text on dark backgrounds
    gold: '#D4AF37',       // Accent color (buttons, highlights)
    'dark-red': '#8B0000', // Secondary accent
    'golden-brown': '#996515', // Tertiary accent
  },
}
```

Feel free to adjust these to match your brand!

## Features Overview

### Home Page
- ✅ Full-screen hero with video background
- ✅ Services section showcasing event types
- ✅ Interactive menu builder with visual cards
- ✅ Category filters (Starters, Mains, Desserts)
- ✅ Main course subcategories (Fish, Meat, Chicken, Vegetarian)
- ✅ Live cart summary with total price
- ✅ Booking form with date picker and guest count

### About Page
- ✅ Company story and values
- ✅ Team member profiles
- ✅ Call-to-action sections

### Gallery Page
- ✅ Filterable image grid (Dishes, Events, Decor)
- ✅ Lightbox modal for viewing images
- ✅ Smooth animations

### Additional Features
- ✅ Responsive navigation with mobile menu
- ✅ Smooth scroll animations
- ✅ Scroll-to-top button
- ✅ Moroccan design patterns
- ✅ Gold gradient accents
- ✅ Professional typography

## Testing Checklist

- [ ] Test on mobile devices (iPhone, Android)
- [ ] Test on tablets (iPad)
- [ ] Test on desktop browsers (Chrome, Safari, Firefox)
- [ ] Check all navigation links work
- [ ] Test menu builder selection and cart
- [ ] Test booking form submission
- [ ] Verify all images load correctly
- [ ] Check page load performance

## Building for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Option 2: Netlify
1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Option 3: Your Own Server
1. Build: `npm run build`
2. Copy `.next` folder and `public` folder
3. Run: `npm start`

## Common Customizations

### Change Fonts
Edit `app/globals.css` and update the Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

### Add More Event Types
Edit `data/menuData.ts`:

```typescript
export const eventTypes = [
  { id: 'new-event', name: 'Your Event Type', icon: '🎊' },
];
```

### Modify Animation Speed
All animations use Framer Motion. Adjust duration values:

```tsx
transition={{ duration: 0.6 }} // Increase for slower animations
```

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Make sure all dependencies are installed: `npm install`
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server: `npm run dev`

---

**Enjoy building your Moroccan catering business online! 🇲🇦✨**

