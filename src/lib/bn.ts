const englishToBanglaDigits: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

const banglaToEnglishDigits = Object.fromEntries(
  Object.entries(englishToBanglaDigits).map(([english, bangla]) => [bangla, english]),
);

const transliterationPairs: Array<[RegExp, string]> = [
  [/kh/g, "খ"],
  [/gh/g, "ঘ"],
  [/ch/g, "চ"],
  [/jh/g, "ঝ"],
  [/th/g, "থ"],
  [/dh/g, "ধ"],
  [/ph/g, "ফ"],
  [/bh/g, "ভ"],
  [/sh/g, "শ"],
  [/ng/g, "ং"],
  [/a/g, "আ"],
  [/b/g, "ব"],
  [/c/g, "ক"],
  [/d/g, "দ"],
  [/e/g, "এ"],
  [/f/g, "ফ"],
  [/g/g, "গ"],
  [/h/g, "হ"],
  [/i/g, "ই"],
  [/j/g, "জ"],
  [/k/g, "ক"],
  [/l/g, "ল"],
  [/m/g, "ম"],
  [/n/g, "ন"],
  [/o/g, "ও"],
  [/p/g, "প"],
  [/r/g, "র"],
  [/s/g, "স"],
  [/t/g, "ত"],
  [/u/g, "উ"],
  [/y/g, "য়"],
];

export function toBanglaDigits(text: string) {
  return text.replace(/[0-9]/g, (digit) => englishToBanglaDigits[digit] ?? digit);
}

export function toEnglishDigits(text: string) {
  return text.replace(/[০-৯]/g, (digit) => banglaToEnglishDigits[digit] ?? digit);
}

export function transliterateBasic(text: string) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word) =>
      transliterationPairs.reduce(
        (current, [pattern, replacement]) => current.replace(pattern, replacement),
        word,
      ),
    )
    .join(" ");
}
