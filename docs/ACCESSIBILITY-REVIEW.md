# Accessibility review

This review records the dashboard's current accessibility support and the manual checks to repeat before releases. It is not a claim of formal WCAG certification.

## Implemented support

- A keyboard-visible skip link moves focus to the main dashboard content.
- Native buttons, labels, fieldsets, headings, and table structures are used for core interactions.
- The history note editor has a visible label, a 160-character counter, keyboard dismissal with Escape, and a polite live status for save results.
- Loading, errors, response timers, and notification updates use status/live regions where appropriate.
- Charts and visual summaries include text alternatives, and reduced-motion styles are defined in the dashboard stylesheet.
- Keyboard focus styles are provided by the shared button and form styles.

## Release check

1. Use Tab and Shift+Tab to reach every navigation action, student row action, history filter, note editor, export action, and dialog control. Confirm the focus indicator is visible and order follows the page.
2. Activate the skip link and verify focus lands on the main content.
3. Use the history page with keyboard only: search, add/edit/clear a note, save, change pages, and export a workbook.
4. Check dashboard layouts at narrow mobile width and at 200% zoom. No controls or status text should overlap or become unreachable.
5. Use a screen reader to confirm the page title, navigation state, student status, charts' text summaries, errors, and note-save confirmation are announced.
6. Check color contrast in both themes, especially muted text, status colors, and focus indicators. Color must not be the only way to distinguish a result.
7. Enable the operating system's reduced-motion preference and confirm page transitions and notification animations become minimal.

Record any release-blocking issue with the browser, screen reader, viewport, steps, and expected result.
