export interface NotePart {
  text: string;
  href?: string;
}

/** Splits a note into plain text and links, so a bare URL in the data becomes an anchor. */
export function noteParts(note: string): NotePart[] {
  return note
    .split(/(https?:\/\/[^\s]*[^\s.,;:)])/)
    .filter((part) => part !== '')
    .map((part) => (part.startsWith('http') ? { text: part, href: part } : { text: part }));
}
