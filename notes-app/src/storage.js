export function getNotes(user) {
  try {
    return JSON.parse(localStorage.getItem(`notes_${user}`)) || [];
  } catch {
    localStorage.removeItem(`notes_${user}`);
    return [];
  }
}

export function saveNotes(user, notes) {
  localStorage.setItem(`notes_${user}`, JSON.stringify(notes));
}
