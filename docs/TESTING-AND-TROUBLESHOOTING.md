# Testing and troubleshooting

## Local build

Use Node.js 22 or later and Java 21. From the project root:

```powershell
if (-not (Test-Path .\src\firebase.js)) { Copy-Item .\src\firebase.example.js .\src\firebase.js }
npm ci
npm --prefix dashboard ci
npm run build
```

`npm run build` compiles the React dashboard and packages the browser extension into `dist`. The Firebase example config is only a local build input and must not be committed.

## Automated checks

```powershell
npm test
```

This runs the existing dashboard, Meet-content, and background-service regression tests, the session-note behavior tests, and Firestore rules tests in a local emulator. Rules tests use the demo project ID `demo-iseenta-rules`; they do not connect to or deploy to the production Firebase project. Java 21 must be on `PATH`. The Firebase CLI must be installed and available as `firebase`.

If `firebase` is not recognized, install the Firebase CLI with npm and reopen the terminal. If Java is not recognized, install Temurin JDK 21 and add its `bin` directory to `PATH`, then open a new terminal. To diagnose a rules test, run `npm run test:rules` directly and keep the emulator output.

## Sign-in and Firestore troubleshooting

- A dashboard login is restricted to a verified professor email in the allowlist. A student should choose the student role in the extension popup.
- `Permission denied` for a student notice, response, or professor session-note save can mean the deployed Firestore rules are older than this source. Compare `firestore.rules` with the Firebase Console before publishing. Rules are separate from the extension build.
- A note can only be saved on an ended session by the professor who owns that session. It is limited to 160 characters.
- The local dev dashboard uses Firebase settings from `src/firebase.js`; the packaged extension needs to be rebuilt after changing source. Reload the unpacked extension in `chrome://extensions` after rebuilding.
- Do not run production Firebase deploy commands as part of local tests. Publishing rules or functions is an explicit project-owner operation.
