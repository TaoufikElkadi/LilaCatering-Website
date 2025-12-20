type Lang = 'en' | 'fr' | 'nl';

type TranslationTree = Record<string, any>;

const translations: Record<Lang, TranslationTree> = {
  en: {
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      gallery: 'GALLERY',
      menu: 'MENU',
      bookAppointment: 'Book Appointment',
      quote: 'Quote',
    },
    hero: {
      kicker: 'Lila Catering',
      heading: 'Moroccan hospitality crafted with fire and calm.',
      ctaPrimary: 'Book Appointment',
      ctaSecondary: 'Quote',
    },
    services: {
      kicker: 'Perfect for every occasion',
      title: 'Corporate. Wedding. Signature Events.',
      subtext:
        'Three tailored experiences, each crafted with calm hospitality, open-fire technique, and seasonal Moroccan flavors.',
      cta: 'See menu',
      cards: {
        corporate: {
          title: 'Corporate Dinner',
          description:
            'Executive dining with discreet service, seasonal produce, and a composed tasting that keeps conversation at the center.',
        },
        wedding: {
          title: 'Wedding Table',
          description:
            'An elevated wedding feast with live-fire touches, shared plates, and thoughtful pacing for every moment.',
        },
        event: {
          title: 'Signature Event',
          description:
            "Bespoke celebrations pairing Morocco's warmth with refined technique—crafted for launches, galas, and milestones.",
        },
      },
    },
    companyLogos: {
      kicker: 'Our Partners',
      title: 'Trusted by Prestigious Brands',
      description: "Delivering exceptional catering experiences to the world's most discerning clients",
    },
    craft: {
      kicker: 'Morrocan craft & warmth',
      title: 'An artisanal kitchen rooted in Morocco.',
      description: 'Tradition, open-fire cooking, and rare ingredients come together to share the calm hospitality of Morocco—crafted slowly, served with intention.',
      cta: 'More about Lila',
    },
    menuBuilder: {
      kicker: 'Menu Builder',
      title: 'Design your experience',
      description: 'Move through each step to shape the menu, details, and date for your event.',
      stepOf: 'Step {current} of {total}',
      categories: {
        starter: 'Starters',
        main: 'Main Courses',
        dessert: 'Desserts',
      },
      mainCategories: {
        fish: 'Fish',
        meat: 'Meat',
        chicken: 'Chicken',
        vegetarian: 'Vegetarian',
      },
      validation: {
        weddingRequires: 'Wedding requires: {missing}',
        starter: 'Starter',
        main: 'Main',
        dessert: 'Dessert',
      },
      buttons: {
        previous: '← Previous',
        buildMenu: 'Build menu →',
        downloadPDF: 'Download Offerte PDF',
      },
    },
    testimonials: {
      kicker: 'Client Excellence',
      title: 'Testimonials.',
      subtitle: 'Trusted by discerning clients for exceptional catering',
      testimonials: {
        '0': {
          name: 'Sophie Laurent',
          role: 'Corporate Event Manager',
          company: 'Hermès Paris',
          text: 'Lila Catering transformed our executive dinner into an unforgettable experience. The attention to detail and authentic Moroccan flavors exceeded all expectations.',
        },
        '1': {
          name: 'David van Berg',
          role: 'Wedding Planner',
          company: 'Elite Events',
          text: 'The seamless service and exquisite presentation made our couple\'s special day truly magical. Every dish was a work of art.',
        },
        '2': {
          name: 'Isabella Romano',
          role: 'Director of Operations',
          company: 'Four Seasons Hotel',
          text: 'Their commitment to quality and refined technique sets them apart. We trust Lila Catering for our most prestigious events.',
        },
      },
      stats: {
        years: 'years',
        events: 'Events Catered',
        satisfaction: 'Client Satisfaction',
        excellence: 'of Excellence',
        company: 'Lila Catering',
        bookEvent: 'Book Your Event',
        eventsLabel: 'Events across Europe & Morocco',
      },
    },
    culturalAuthenticity: {
      kicker: 'Cultural Authenticity',
      title: 'From Morocco to Your Table.',
      description: 'Rooted in centuries of tradition, refined with contemporary interpretation. No clichés, just authentic craft.',
      cards: {
        '0': {
          title: 'Artisan Spices',
          subtitle: 'Traditional blending passed through generations',
          description: 'Hand-selected herbs and spices blended with ancient techniques',
        },
        '1': {
          title: 'Heritage & Craft',
          subtitle: 'Centuries of culinary tradition from Fes',
          description: 'Refined palace cuisine meets timeless artistry',
        },
        '2': {
          title: 'Slow-Cooked Soul',
          subtitle: 'Tagine mastery and the art of patience',
          description: 'Every dish tells a story of time and dedication',
        },
        '3': {
          title: 'Ancestral Techniques',
          subtitle: 'Authentic methods, contemporary interpretation',
          description: 'Honoring tradition while embracing innovation',
        },
      },
      bottomText: 'Every dish carries the soul of Morocco, refined for the modern palate',
    },
  },
  fr: {
    nav: {
      home: 'ACCUEIL',
      about: 'À PROPOS',
      gallery: 'GALERIE',
      menu: 'MENU',
      bookAppointment: 'Prendre Rendez-vous',
      quote: 'Offerte',
    },
    hero: {
      kicker: 'Lila Catering',
      heading: 'Hospitalité marocaine, travaillée avec le feu et la sérénité.',
      ctaPrimary: 'Prendre Rendez-vous',
      ctaSecondary: 'Offerte',
    },
    services: {
      kicker: 'Parfait pour chaque occasion',
      title: 'Corporate. Mariage. Événements signature.',
      subtext:
        'Trois expériences sur mesure, façonnées par une hospitalité apaisée, la cuisson au feu et des saveurs marocaines de saison.',
      cta: 'Voir le menu',
      cards: {
        corporate: {
          title: "Dîner d'entreprise",
          description:
            'Un repas exécutif avec service discret, produits de saison et dégustation composée qui laisse la conversation au centre.',
        },
        wedding: {
          title: 'Table de mariage',
          description:
            'Un banquet de mariage raffiné avec touches au feu vif, plats à partager et rythme pensé pour chaque moment.',
        },
        event: {
          title: 'Événement signature',
          description:
            "Des célébrations sur mesure alliant chaleur marocaine et technique raffinée—pour lancements, galas et moments d'exception.",
        },
      },
    },
    companyLogos: {
      kicker: 'Nos Partenaires',
      title: 'La Confiance des Marques Prestigieuses',
      description: 'Offrant des expériences traiteur exceptionnelles aux clients les plus exigeants du monde',
    },
    craft: {
      kicker: 'Artisanat & chaleur marocaine',
      title: 'Une cuisine artisanale enracinée au Maroc.',
      description: "Tradition, cuisson au feu et ingrédients rares se rejoignent pour partager l'hospitalité sereine du Maroc—élaborée lentement, servie avec intention.",
      cta: 'En savoir plus sur Lila',
    },
    menuBuilder: {
      kicker: 'Créateur de Menu',
      title: 'Concevez votre expérience',
      description: 'Parcourez chaque étape pour composer le menu, les détails et la date de votre événement.',
      stepOf: 'Étape {current} sur {total}',
      categories: {
        starter: 'Entrées',
        main: 'Plats principaux',
        dessert: 'Desserts',
      },
      mainCategories: {
        fish: 'Poisson',
        meat: 'Viande',
        chicken: 'Poulet',
        vegetarian: 'Végétarien',
      },
      validation: {
        weddingRequires: 'Mariage nécessite : {missing}',
        starter: 'Entrée',
        main: 'Plat principal',
        dessert: 'Dessert',
      },
      buttons: {
        previous: '← Précédent',
        buildMenu: 'Créer le menu →',
        downloadPDF: 'Télécharger le PDF Offerte',
      },
    },
    testimonials: {
      kicker: 'Excellence Client',
      title: 'Témoignages.',
      subtitle: 'Fait confiance par des clients exigeants pour un service traiteur exceptionnel',
      testimonials: {
        '0': {
          name: 'Sophie Laurent',
          role: 'Directrice Événements Corporate',
          company: 'Hermès Paris',
          text: 'Lila Catering a transformé notre dîner exécutif en une expérience inoubliable. L\'attention aux détails et les saveurs marocaines authentiques ont dépassé toutes les attentes.',
        },
        '1': {
          name: 'David van Berg',
          role: 'Planificateur de Mariages',
          company: 'Elite Events',
          text: 'Le service impeccable et la présentation exquise ont rendu la journée spéciale du couple vraiment magique. Chaque plat était une œuvre d\'art.',
        },
        '2': {
          name: 'Isabella Romano',
          role: 'Directrice des Opérations',
          company: 'Four Seasons Hotel',
          text: 'Leur engagement envers la qualité et leur technique raffinée les distinguent. Nous faisons confiance à Lila Catering pour nos événements les plus prestigieux.',
        },
      },
      stats: {
        years: 'années',
        events: 'Événements organisés',
        satisfaction: 'Satisfaction Client',
        excellence: 'd\'Excellence',
        company: 'Lila Catering',
        bookEvent: 'Réservez votre événement',
        eventsLabel: 'Événements à travers l\'Europe & le Maroc',
      },
    },
    culturalAuthenticity: {
      kicker: 'Authenticité Culturelle',
      title: 'Du Maroc à Votre Table.',
      description: 'Enracinée dans des siècles de tradition, raffinée par une interprétation contemporaine. Pas de clichés, juste un artisanat authentique.',
      cards: {
        '0': {
          title: 'Épices Artisanales',
          subtitle: 'Mélange traditionnel transmis de génération en génération',
          description: 'Herbes et épices sélectionnées à la main mélangées selon des techniques ancestrales',
        },
        '1': {
          title: 'Héritage & Artisanat',
          subtitle: 'Siècles de tradition culinaire de Fès',
          description: 'Cuisine de palais raffinée rencontre un art intemporel',
        },
        '2': {
          title: 'Âme Cuite Lentement',
          subtitle: 'Maîtrise du tajine et l\'art de la patience',
          description: 'Chaque plat raconte une histoire de temps et de dévouement',
        },
        '3': {
          title: 'Techniques Ancestrales',
          subtitle: 'Méthodes authentiques, interprétation contemporaine',
          description: 'Honorer la tradition tout en embrassant l\'innovation',
        },
      },
      bottomText: 'Chaque plat porte l\'âme du Maroc, raffinée pour le palais moderne',
    },
  },
  nl: {
    nav: {
      home: 'HOME',
      about: 'OVER',
      gallery: 'GALERIJ',
      menu: 'MENU',
      bookAppointment: 'Boek een afspraak',
      quote: 'Offerte',
    },
    hero: {
      kicker: 'Lila Catering',
      heading: 'Marokkaanse gastvrijheid, met vuur en rust bereid.',
      ctaPrimary: 'Boek een afspraak',
      ctaSecondary: 'Offerte',
    },
    services: {
      kicker: 'Perfect voor elke gelegenheid',
      title: 'Zakelijk. Huwelijk. Signature events.',
      subtext:
        'Drie op maat gemaakte ervaringen, met rustige gastvrijheid, koken op vuur en seizoensgebonden Marokkaanse smaken.',
      cta: 'Bekijk menu',
      cards: {
        corporate: {
          title: 'Zakelijk diner',
          description:
            'Executive dining met discreet service, seizoensproducten en een uitgebalanceerd menu waarbij het gesprek centraal blijft.',
        },
        wedding: {
          title: 'Bruiloftstafel',
          description:
            'Een verfijnd bruiloftsfeest met vuuraccenten, shared dining en een aandachtig tempo voor elk moment.',
        },
        event: {
          title: 'Signature event',
          description:
            "Maatwerkfeesten die Marokkaanse warmte en verfijnde techniek samenbrengen—voor lanceringen, gala's en mijlpalen.",
        },
      },
    },
    companyLogos: {
      kicker: 'Onze Partners',
      title: 'Vertrouwd door Prestigieuze Merken',
      description: "Het leveren van uitzonderlijke catering-ervaringen aan 's werelds meest veeleisende klanten",
    },
    craft: {
      kicker: 'Marokkaans ambacht & warmte',
      title: 'Een ambachtelijke keuken geworteld in Marokko.',
      description: 'Traditie, koken op vuur en zeldzame ingrediënten komen samen om de rustige gastvrijheid van Marokko te delen—langzaam bereid, met intentie geserveerd.',
      cta: 'Meer over Lila',
    },
    menuBuilder: {
      kicker: 'Menu Samensteller',
      title: 'Ontwerp uw ervaring',
      description: 'Doorloop elke stap om het menu, details en datum voor uw evenement vorm te geven.',
      stepOf: 'Stap {current} van {total}',
      categories: {
        starter: 'Voorgerechten',
        main: 'Hoofdgerechten',
        dessert: 'Desserts',
      },
      mainCategories: {
        fish: 'Vis',
        meat: 'Vlees',
        chicken: 'Kip',
        vegetarian: 'Vegetarisch',
      },
      validation: {
        weddingRequires: 'Bruiloft vereist: {missing}',
        starter: 'Voorgerecht',
        main: 'Hoofdgerecht',
        dessert: 'Dessert',
      },
      buttons: {
        previous: '← Vorige',
        buildMenu: 'Menu samenstellen →',
        downloadPDF: 'Download Offerte PDF',
      },
    },
    testimonials: {
      kicker: 'Klantuitmuntendheid',
      title: 'Getuigenissen.',
      subtitle: 'Vertrouwd door veeleisende klanten voor uitzonderlijke catering',
      testimonials: {
        '0': {
          name: 'Sophie Laurent',
          role: 'Evenementmanager Corporate',
          company: 'Hermès Paris',
          text: 'Lila Catering transformeerde onze executive dinner in een onvergetelijke ervaring. De aandacht voor detail en authentieke Marokkaanse smaken overtroffen alle verwachtingen.',
        },
        '1': {
          name: 'David van Berg',
          role: 'Bruiloftsplanner',
          company: 'Elite Events',
          text: 'De naadloze service en exquise presentatie maakten onze speciale dag van het paar werkelijk magisch. Elk gerecht was een werk van kunst.',
        },
        '2': {
          name: 'Isabella Romano',
          role: 'Directeur Operaties',
          company: 'Four Seasons Hotel',
          text: 'Hun toewijding aan kwaliteit en verfijnde techniek zet hen apart. We vertrouwen Lila Catering voor onze meest prestigieuze evenementen.',
        },
      },
      stats: {
        years: 'jaren',
        events: 'Georganiseerde evenementen',
        satisfaction: 'Klanttevredenheid',
        excellence: 'van Uitmuntendheid',
        company: 'Lila Catering',
        bookEvent: 'Boek uw evenement',
        eventsLabel: 'Evenementen door heel Europa & Marokko',
      },
    },
    culturalAuthenticity: {
      kicker: 'Culturele Authenticiteit',
      title: 'Van Marokko naar Uw Tafel.',
      description: 'Geworteld in eeuwenoude tradities, verfijnd met hedendaagse interpretatie. Geen clichés, gewoon authentiek vakmanschap.',
      cards: {
        '0': {
          title: 'Ambachtelijke Specerijen',
          subtitle: 'Traditioneel mengen doorgegeven van generatie op generatie',
          description: 'Met de hand geselecteerde kruiden en specerijen gemengd volgens oude technieken',
        },
        '1': {
          title: 'Erfgoed & Vakmanschap',
          subtitle: 'Eeuwen culinaire traditie uit Fès',
          description: 'Verfijnde paleiskeuken ontmoet tijdloze kunst',
        },
        '2': {
          title: 'Langzaam Gekookte Ziel',
          subtitle: 'Tajine-meesterschap en de kunst van geduld',
          description: 'Elk gerecht vertelt een verhaal van tijd en toewijding',
        },
        '3': {
          title: 'Voorouderlijke Technieken',
          subtitle: 'Authentieke methodes, hedendaagse interpretatie',
          description: 'Traditie eren terwijl innovatie wordt omarmd',
        },
      },
      bottomText: 'Elk gerecht draagt de ziel van Marokko, verfijnd voor de moderne smaak',
    },
  },
};

export function getTranslation(lang: Lang, path: string): any {
  const parts = path.split('.');
  let current: any = translations[lang];
  for (const part of parts) {
    if (current && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }
  if (current !== undefined) return current;

  // Fallback to English if missing
  current = translations.en;
  for (const part of parts) {
    if (current && part in current) {
      current = current[part];
    } else {
      return '';
    }
  }
  return current;
}

export function getAvailableLanguages(): Lang[] {
  return Object.keys(translations) as Lang[];
}

export function getLanguageName(lang: Lang): string {
  const names = {
    en: 'English',
    fr: 'Français',
    nl: 'Nederlands'
  };
  return names[lang] || lang;
}
