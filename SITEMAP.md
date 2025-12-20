# Lila Catering - Site Structure

## 🗺️ Visual Sitemap

```
🏠 Home (/)
├── Hero Section
│   ├── Video Background
│   ├── Main Heading
│   ├── Subtitle
│   └── CTA Buttons
│       ├── "Build Your Menu" → #menu-builder
│       └── "Explore Services" → #services
│
├── Services Section (#services)
│   ├── Event Type Cards (4)
│   │   ├── Weddings 💍
│   │   ├── Private Dinners 🍽️
│   │   ├── Corporate Events 🏢
│   │   └── Celebrations 🎉
│   └── Feature Cards (3)
│       ├── Authentic Recipes
│       ├── Fresh Ingredients
│       └── Professional Service
│
├── Menu Builder Section (#menu-builder)
│   ├── Category Tabs
│   │   ├── Starters (5 items)
│   │   ├── Main Courses (8 items)
│   │   │   ├── Fish (2)
│   │   │   ├── Meat (2)
│   │   │   ├── Chicken (2)
│   │   │   └── Vegetarian (2)
│   │   └── Desserts (5 items)
│   ├── Menu Cards Grid
│   └── Floating Cart Summary
│       ├── Selected Items
│       ├── Total Price
│       └── "Continue to Booking" → #booking
│
└── Booking Form Section (#booking)
    ├── Contact Information
    │   ├── Name
    │   ├── Email
    │   └── Phone
    ├── Event Details
    │   ├── Event Type
    │   ├── Event Date
    │   └── Guest Count
    ├── Additional Message
    └── Submit Button

👥 About (/about)
├── Hero Section
│   ├── Page Title
│   └── Subtitle
│
├── Story Section
│   ├── Company History
│   └── Values & Mission
│
├── Values Section
│   ├── Authenticity 🌟
│   ├── Quality ✨
│   └── Hospitality 🤝
│
├── Team Section
│   ├── Chef Fatima (Head Chef)
│   ├── Chef Youssef (Pastry Chef)
│   └── Amina (Event Coordinator)
│
└── CTA Section
    └── "Start Building Your Menu" → /#menu-builder

🖼️ Gallery (/gallery)
├── Hero Section
│   ├── Page Title
│   └── Subtitle
│
├── Gallery Section
│   ├── Category Filter
│   │   ├── All 🖼️
│   │   ├── Dishes 🍽️
│   │   ├── Events 🎉
│   │   └── Decor ✨
│   ├── Image Grid (12 items)
│   └── Lightbox Modal
│       ├── Full Image View
│       └── Close Button
│
└── CTA Section
    └── "Plan Your Event" → /#menu-builder
```

## 🧭 Navigation Structure

### Header Navigation (All Pages)
```
Logo / Lila Catering
├── Home → /
├── About → /about
├── Gallery → /gallery
└── Build Your Menu → /#menu-builder
```

### Footer (All Pages)
```
Brand Column
├── Logo
└── Description

Quick Links Column
├── Home → /
├── About → /about
└── Gallery → /gallery

Contact Column
├── Email
├── Phone
└── Location
```

## 📱 Mobile Navigation
```
Hamburger Menu
├── Home → /
├── About → /about
├── Gallery → /gallery
└── Build Your Menu → /#menu-builder
```

## 🔗 Key User Journeys

### Journey 1: Book an Event
```
1. Land on Home page
2. Click "Build Your Menu" or scroll down
3. Select dishes from categories
4. Review cart summary
5. Click "Continue to Booking"
6. Fill out booking form
7. Submit request
```

### Journey 2: Learn About Company
```
1. Click "About" in navigation
2. Read company story
3. View team members
4. Click "Start Building Your Menu"
5. → Returns to Home #menu-builder
```

### Journey 3: View Portfolio
```
1. Click "Gallery" in navigation
2. Filter by category (Dishes/Events/Decor)
3. Click image to view in lightbox
4. Click "Plan Your Event"
5. → Returns to Home #menu-builder
```

## 🎯 Conversion Points (CTAs)

### Primary CTAs
1. **Hero**: "Build Your Menu" → Menu Builder
2. **Services**: Each event card links to menu builder
3. **Menu Builder**: "Continue to Booking" → Booking Form
4. **About**: "Start Building Your Menu" → Home Menu Builder
5. **Gallery**: "Plan Your Event" → Home Menu Builder

### Secondary CTAs
1. **Hero**: "Explore Services" → Services Section
2. **Navigation**: "Build Your Menu" → Menu Builder
3. **Footer**: Quick Links navigation

## 📊 Page Hierarchy

```
Level 1 (Main Pages)
├── Home (/)
├── About (/about)
└── Gallery (/gallery)

Level 2 (Sections - Internal Anchors)
├── #services
├── #menu-builder
└── #booking
```

## 🎨 Layout Components

### Global Components (on all pages)
- Navigation Header
- Footer
- Scroll to Top Button

### Page-Specific Components
**Home:**
- Hero
- Services
- MenuBuilder (+ MenuCard)
- BookingForm

**About:**
- Hero variant
- Story section
- Values grid
- Team grid
- CTA section

**Gallery:**
- Hero variant
- Category filter
- Image grid
- Lightbox modal
- CTA section

## 🔄 Component Relationships

```
App Layout
├── Navigation (global)
├── Page Content
│   ├── Home
│   │   ├── Hero
│   │   ├── Services
│   │   ├── MenuBuilder
│   │   │   └── MenuCard (repeated)
│   │   └── BookingForm
│   ├── About
│   │   └── [About sections]
│   └── Gallery
│       └── [Gallery sections]
├── Footer (global)
└── ScrollToTop (global)
```

## 📍 Anchor Links Map

| Anchor ID | Location | Purpose |
|-----------|----------|---------|
| `#services` | Home page | Event types & features section |
| `#menu-builder` | Home page | Interactive menu selection |
| `#booking` | Home page | Booking form |

---

**Total Pages**: 3
**Total Sections**: 10+
**Total Components**: 11
**Navigation Items**: 3
**CTA Buttons**: 7

