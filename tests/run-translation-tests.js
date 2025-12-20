#!/usr/bin/env node

// Node.js Translation Test Runner
// Run with: node tests/run-translation-tests.js

const { getTranslation, getAvailableLanguages } = require('../utils/translations.ts');

// Test data - expected translations for key phrases
const testCases = [
  {
    key: 'testimonials.kicker',
    expected: {
      en: 'Client Excellence',
      fr: 'Excellence Client',
      nl: 'Klantuitmuntendheid'
    }
  },
  {
    key: 'testimonials.title',
    expected: {
      en: 'Testimonials.',
      fr: 'Témoignages.',
      nl: 'Getuigenissen.'
    }
  },
  {
    key: 'culturalAuthenticity.kicker',
    expected: {
      en: 'Cultural Authenticity',
      fr: 'Authenticité Culturelle',
      nl: 'Culturele Authenticiteit'
    }
  },
  {
    key: 'testimonials.testimonials.0.name',
    expected: {
      en: 'Sophie Laurent',
      fr: 'Sophie Laurent',
      nl: 'Sophie Laurent'
    }
  },
  {
    key: 'culturalAuthenticity.cards.0.title',
    expected: {
      en: 'Artisan Spices',
      fr: 'Épices Artisanales',
      nl: 'Ambachtelijke Specerijen'
    }
  }
];

// Test function
function runTranslationTests() {
  console.log('🧪 Running Translation Tests...\n');

  const languages = getAvailableLanguages();
  console.log('Available languages:', languages.join(', '), '\n');

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.key}`);

    languages.forEach(lang => {
      try {
        const result = getTranslation(lang, testCase.key);
        const expected = testCase.expected[lang];

        if (result === expected) {
          console.log(`  ✅ ${lang}: "${result}"`);
          passed++;
        } else {
          console.log(`  ❌ ${lang}: Expected "${expected}", got "${result}"`);
          failed++;
        }
      } catch (error) {
        console.log(`  ❌ ${lang}: Error - ${error.message}`);
        failed++;
      }
    });

    console.log('');
  });

  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All translation tests passed!');
    return true;
  } else {
    console.log('💥 Some translation tests failed!');
    return false;
  }
}

// Component rendering simulation test
function testComponentTranslations() {
  console.log('🧪 Testing Component Translation Integration...\n');

  const languages = getAvailableLanguages();

  languages.forEach(lang => {
    console.log(`Testing ${lang} component translations:`);

    // Simulate how Testimonials component uses translations
    const testimonials = [
      getTranslation(lang, 'testimonials.testimonials.0'),
      getTranslation(lang, 'testimonials.testimonials.1'),
      getTranslation(lang, 'testimonials.testimonials.2'),
    ];

    // Simulate how CulturalAuthenticity component uses translations
    const cards = [
      getTranslation(lang, 'culturalAuthenticity.cards.0'),
      getTranslation(lang, 'culturalAuthenticity.cards.1'),
      getTranslation(lang, 'culturalAuthenticity.cards.2'),
      getTranslation(lang, 'culturalAuthenticity.cards.3'),
    ];

    console.log(`  Testimonials kicker: "${getTranslation(lang, 'testimonials.kicker')}"`);
    console.log(`  First testimonial name: "${testimonials[0]?.name}"`);
    console.log(`  Cultural Authenticity title: "${getTranslation(lang, 'culturalAuthenticity.title')}"`);
    console.log(`  First card title: "${cards[0]?.title}"`);
    console.log('');
  });

  console.log('Component integration tests completed.');
  return true;
}

// Run the tests
if (require.main === module) {
  const translationTestsPassed = runTranslationTests();
  console.log('');
  const componentTestsPassed = testComponentTranslations();

  if (translationTestsPassed && componentTestsPassed) {
    console.log('🎉 All tests passed! Translations are working correctly.');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed! Check the translation implementation.');
    process.exit(1);
  }
}

module.exports = { runTranslationTests, testComponentTranslations };
