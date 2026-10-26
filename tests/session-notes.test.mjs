import test from "node:test";
import assert from "node:assert/strict";
import { matchesSessionHistorySearch, normalizeSessionNote } from "../dashboard/src/sessionNotes.js";

test("normalizes whitespace and trims session notes", () => {
  assert.equal(normalizeSessionNote("  Objects   and\nclasses  "), "Objects and classes");
});

test("caps notes at 160 characters", () => {
  assert.equal(normalizeSessionNote("x".repeat(180)).length, 160);
});

test("search matches meeting code or note without case sensitivity", () => {
  const recap = { meetingCode: "abc-defg-hij", sessionNote: "Inheritance and Polymorphism" };
  assert.equal(matchesSessionHistorySearch(recap, "ABC"), true);
  assert.equal(matchesSessionHistorySearch(recap, "polymorphism"), true);
  assert.equal(matchesSessionHistorySearch(recap, "unrelated"), false);
});
