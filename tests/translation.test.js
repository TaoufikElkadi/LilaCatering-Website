// Translation Test Suite
// This test verifies that the translation system works correctly

// Import the translation functions
import { getTranslation } from '../utils/translations.ts';

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

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.key}`);

    ['en', 'fr', 'nl'].forEach(lang => {
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

// Component rendering test
function testComponentTranslations() {
  console.log('🧪 Testing Component Translation Integration...\n');

  // This would test that components can actually use the translations
  // In a real test environment, we'd render the components and check their content

  console.log('Note: Component integration tests would require a full React testing environment.');
  console.log('For now, the core translation function tests above verify the foundation works.');

  return true;
}

// Export for use in different environments
if (typeof window !== 'undefined') {
  // Browser environment
  window.runTranslationTests = runTranslationTests;
  window.testComponentTranslations = testComponentTranslations;
  console.log('💡 Translation tests loaded. Run runTranslationTests() in the browser console to test.');
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { runTranslationTests, testComponentTranslations };
}

// Auto-run in Node.js
if (typeof module !== 'undefined' && !module.parent) {
  runTranslationTests();
  testComponentTranslations();
}
