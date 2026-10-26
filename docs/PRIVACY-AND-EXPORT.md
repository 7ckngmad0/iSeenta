# Privacy, data, and exports

## What iSEENTA records

Tracking starts only after a student chooses the student role, signs in, and enables tracking consent. During an active class session, the extension sends the professor dashboard presence events such as joining, returning, going away, leaving, idle, locked, and active. Records include the student's display name, verified email, account ID, meeting code, session ID, event time, and open-tab count when available. The extension does not collect tab titles, page URLs, browsing history, microphone/camera content, or Google Meet chat.

When a professor posts a quick question or poll, the round stores its prompt, answer format, optional answer key, target students, response window, and student submissions. An AFK notice stores its reason and acknowledgement/return state. A professor may add an optional 160-character topic note to an ended session. These records are used to show presence and response summaries; they are not measurements of attention, learning, or academic performance.

## Access and retention

Professors on the configured allowlist can see their class sessions and the related student activity and responses. Students can submit their own responses and notices through the extension. Firestore rules are the access boundary; the dashboard's professor allowlist is only a user-interface check.

Session records and related activity are retained for 30 days after a session ends, then the scheduled cleanup function may delete them after the project owner deploys it. Unended sessions do not follow the ended-session expiry date until ended. During the retention window, professors can open **Session history**, search a meeting code or note, and download an Excel workbook with **Meeting Info**, **Student Activity**, and **Questions & Answers** sheets. Downloaded workbooks are outside Firebase retention and should be stored and shared carefully.

## Reading an export

- **Meeting Info** contains the meeting code, start/end times, duration, number of students and questions, an average focus-share estimate, and any saved session note.
- **Student Activity** summarizes per-student event-derived durations and counts. “Focused” is a time estimate based on presence signals; it does not prove attention.
- **Questions & Answers** lists each targeted student's answer and whether it matched the optional answer key. Polls without an answer key are reported as answered, not correct/incorrect.

Rows may be absent when records have expired, the professor lacks access, or optional question results could not be loaded. The workbook is generated in the browser; it is not uploaded as a separate report.

## Project-owner checklist

- Keep professor allowlists synchronized in `src/config.js`, `dashboard/src/App.tsx`, and `firestore.rules`.
- Review Firestore rules before publishing, especially after adding a new field or write path.
- Deploy the scheduled cleanup function if automatic retention enforcement is required.
- Do not commit `src/firebase.js`, student exports, or real class data to the repository.
