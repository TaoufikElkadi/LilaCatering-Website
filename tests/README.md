# Translation Tests

This folder contains tests to verify that the translation system is working correctly for the Lila Catering website.

## Test Files

### `translation.test.js`
A universal test file that can be run in both Node.js and browser environments.

### `run-translation-tests.js`
Node.js test runner that verifies all translations work correctly.

### `translation-test.html`
Browser-based test interface that allows you to test translations interactively.

## Running Tests

### Option 1: Node.js Tests
```bash
node tests/run-translation-tests.js
```

This will run all translation tests and verify that:
- All expected translations exist for English, French, and Dutch
- Component-style usage patterns work correctly
- No translation keys are missing

### Option 2: Browser Tests
Open `tests/translation-test.html` in your browser.

This interactive test page allows you to:
- Switch between languages (EN/FR/NL) using buttons
- See real-time translation results
- Verify component-style usage patterns
- Check for missing translations

## What Gets Tested

The tests verify translations for:

### Testimonials Section
- Section headers (kicker, title, subtitle)
- Customer testimonial data (name, role, company, text)
- Statistics labels (years, events, satisfaction, excellence)
- Button text (Book Your Event)

### Cultural Authenticity Section
- Section headers (kicker, title, description)
- Card content (title, subtitle, description for all 4 cards)
- Bottom text

### Navigation & General
- Basic navigation translations
- Language switching functionality

## Debugging Failed Tests

If tests fail, check:

1. **Missing translations**: Ensure all keys exist in `utils/translations.ts`
2. **Incorrect translations**: Verify the translated text matches expectations
3. **Path errors**: Check that translation paths are correctly formatted (e.g., `testimonials.kicker`)
4. **Import issues**: Make sure the test files can import from `../utils/translations.ts`

## Adding New Tests

To add tests for new translation keys:

1. Add the key and expected translations to the `testCases` array in both test files
2. Update this README if needed
3. Run the tests to verify they pass

## Expected Output

When all tests pass, you should see:
```
🧪 Running Translation Tests...

Test 1: testimonials.kicker
  ✅ en: "Client Excellence"
  ✅ fr: "Excellence Client"
  ✅ nl: "Klantuitmuntendheid"

[... more tests ...]

📊 Results: 15 passed, 0 failed
🎉 All translation tests passed!
```
