import fs from "node:fs";
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

let testEnv;
const professor = { uid: "prof-1", email: "renzkerbysajuelaofficial@gmail.com", email_verified: true };
const student = { uid: "student-1", email: "student@example.test", email_verified: true };
const endedSession = { status: "ended", meetingCode: "abc-defg-hij", course: "Class", classLabel: "Class", startedAtMs: 1, elapsedMs: 1000, teacherUid: professor.uid, endedAt: new Date() };

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-iseenta-rules",
    firestore: { rules: fs.readFileSync(new URL("../firestore.rules", import.meta.url), "utf8") }
  });
  await testEnv.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), "sessions", "ended-session"), endedSession);
    await setDoc(doc(context.firestore(), "sessions", "active-session"), { ...endedSession, status: "active", endedAt: null });
  });
});

after(async () => testEnv?.cleanup());

test("session owner can add a short note to an ended recap", async () => {
  const db = testEnv.authenticatedContext(professor.uid, professor).firestore();
  await assertSucceeds(updateDoc(doc(db, "sessions", "ended-session"), { sessionNote: "Inheritance review" }));
});

test("session owner can clear a note from an ended recap", async () => {
  const db = testEnv.authenticatedContext(professor.uid, professor).firestore();
  await assertSucceeds(updateDoc(doc(db, "sessions", "ended-session"), { sessionNote: "" }));
});

test("student cannot edit a session note", async () => {
  const db = testEnv.authenticatedContext(student.uid, student).firestore();
  await assertFails(updateDoc(doc(db, "sessions", "ended-session"), { sessionNote: "Unauthorized" }));
});

test("another authorized professor cannot edit a session they do not own", async () => {
  const otherProfessor = { uid: "prof-2", email: "draconic788@gmail.com", email_verified: true };
  const db = testEnv.authenticatedContext(otherProfessor.uid, otherProfessor).firestore();
  await assertFails(updateDoc(doc(db, "sessions", "ended-session"), { sessionNote: "Not the owner" }));
});

test("professor cannot add a note to an active session", async () => {
  const db = testEnv.authenticatedContext(professor.uid, professor).firestore();
  await assertFails(updateDoc(doc(db, "sessions", "active-session"), { sessionNote: "Still live" }));
});

test("session note is limited to 160 characters", async () => {
  const db = testEnv.authenticatedContext(professor.uid, professor).firestore();
  await assertFails(updateDoc(doc(db, "sessions", "ended-session"), { sessionNote: "x".repeat(161) }));
});

test("adding note permission preserves normal session state transitions", async () => {
  const db = testEnv.authenticatedContext(professor.uid, professor).firestore();
  await assertSucceeds(updateDoc(doc(db, "sessions", "active-session"), {
    status: "paused", elapsedMs: 2000, pausedAtMs: 1200, updatedAt: serverTimestamp()
  }));
});
