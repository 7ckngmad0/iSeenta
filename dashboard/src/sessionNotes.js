export const normalizeSessionNote = value => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 160);

export const matchesSessionHistorySearch = (session, query) => {
  const term = String(query ?? "").trim().toLocaleLowerCase();
  return !term || `${session.meetingCode ?? ""} ${session.sessionNote ?? ""}`.toLocaleLowerCase().includes(term);
};
