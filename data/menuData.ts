export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'starter' | 'main' | 'dessert';
  mainCategory?: 'fish' | 'meat' | 'chicken' | 'vegetarian';
}

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 'starter-1',
    name: 'Moroccan Mezze Platter',
    description: 'A selection of traditional hummus, baba ganoush, and fresh zaalouk',
    price: '€12',
    image: '/images/menu/m1.webp',
    category: 'starter',
  },
  {
    id: 'starter-2',
    name: 'Briouats',
    description: 'Crispy phyllo pastries filled with spiced lamb and herbs',
    price: '€14',
    image: '/images/menu/m2.webp',
    category: 'starter',
  },
  {
    id: 'starter-3',
    name: 'Harira Soup',
    description: 'Rich tomato-based soup with lentils, chickpeas, and aromatic spices',
    price: '€10',
    image: '/images/menu/m3.webp',
    category: 'starter',
  },
  {
    id: 'starter-4',
    name: 'Seafood Pastilla',
    description: 'Delicate layers of warqa pastry with mixed seafood and vermicelli',
    price: '€16',
    image: '/images/menu/m4.webp',
    category: 'starter',
  },
  {
    id: 'starter-5',
    name: 'Taktouka Salad',
    description: 'Roasted peppers and tomatoes with garlic, olive oil, and cumin',
    price: '€11',
    image: '/images/menu/m5.webp',
    category: 'starter',
  },

  // Mains - Fish
  {
    id: 'main-fish-1',
    name: 'Chermoula Sea Bass',
    description: 'Grilled sea bass marinated in chermoula with preserved lemons',
    price: '€32',
    image: '/images/menu/m6.webp',
    category: 'main',
    mainCategory: 'fish',
  },
  {
    id: 'main-fish-2',
    name: 'Moroccan Fish Tagine',
    description: 'Slow-cooked fish with vegetables, olives, and saffron sauce',
    price: '€30',
    image: '/images/menu/m7.webp',
    category: 'main',
    mainCategory: 'fish',
  },

  // Mains - Meat
  {
    id: 'main-meat-1',
    name: 'Lamb Tagine with Prunes',
    description: 'Tender lamb slow-cooked with caramelized prunes and almonds',
    price: '€35',
    image: '/images/menu/m8.webp',
    category: 'main',
    mainCategory: 'meat',
  },
  {
    id: 'main-meat-2',
    name: 'Beef Mechoui',
    description: 'Slow-roasted beef shoulder with cumin and traditional spices',
    price: '€38',
    image: '/images/menu/m9.webp',
    category: 'main',
    mainCategory: 'meat',
  },

  // Mains - Chicken
  {
    id: 'main-chicken-1',
    name: 'Chicken Tagine with Olives',
    description: 'Succulent chicken with preserved lemons and green olives',
    price: '€28',
    image: '/images/menu/m10.webp',
    category: 'main',
    mainCategory: 'chicken',
  },
  {
    id: 'main-chicken-2',
    name: 'Bastilla Royale',
    description: 'Traditional pigeon pie (made with chicken) with almonds and cinnamon',
    price: '€30',
    image: '/images/menu/m11.webp',
    category: 'main',
    mainCategory: 'chicken',
  },

  // Mains - Vegetarian
  {
    id: 'main-veg-1',
    name: 'Seven Vegetable Couscous',
    description: 'Fluffy couscous with seasonal vegetables and aromatic broth',
    price: '€24',
    image: '/images/menu/m1.webp',
    category: 'main',
    mainCategory: 'vegetarian',
  },
  {
    id: 'main-veg-2',
    name: 'Vegetable Tagine',
    description: 'Medley of vegetables with apricots, honey, and ras el hanout',
    price: '€26',
    image: '/images/menu/m2.webp',
    category: 'main',
    mainCategory: 'vegetarian',
  },

  // Desserts
  {
    id: 'dessert-1',
    name: 'Baklava Selection',
    description: 'Assorted honey-soaked phyllo pastries with pistachios and almonds',
    price: '€12',
    image: '/images/desserts/md1.webp',
    category: 'dessert',
  },
  {
    id: 'dessert-2',
    name: 'Moroccan Orange Salad',
    description: 'Fresh oranges with cinnamon, orange blossom water, and dates',
    price: '€10',
    image: '/images/desserts/md2.webp',
    category: 'dessert',
  },
  {
    id: 'dessert-3',
    name: 'Chebakia',
    description: 'Traditional sesame cookies fried and dipped in honey',
    price: '€11',
    image: '/images/desserts/md3.webp',
    category: 'dessert',
  },
  {
    id: 'dessert-4',
    name: 'M\'hencha',
    description: 'Coiled almond pastry with orange blossom and honey',
    price: '€13',
    image: '/images/desserts/md4.webp',
    category: 'dessert',
  },
  {
    id: 'dessert-5',
    name: 'Moroccan Mint Tea & Dates',
    description: 'Traditional mint tea service with Medjool dates and pastries',
    price: '€9',
    image: '/images/desserts/md5.webp',
    category: 'dessert',
  },
];

export const eventTypes = [
  { id: 'wedding', name: 'Weddings', icon: '💍' },
  { id: 'dinner', name: 'Private Dinners', icon: '🍽️' },
  { id: 'corporate', name: 'Corporate Events', icon: '🏢' },
  { id: 'celebration', name: 'Celebrations', icon: '🎉' },
];

