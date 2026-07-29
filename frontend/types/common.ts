export type Language = "en" | "uk";

export type LocalizedText = Record<Language, string>;

// Not a union: the generation pipeline carries `difficulty` through as a
// free-form string with no validation against a fixed set of values, so a
// union here would claim a guarantee the data doesn't actually have.
export type Difficulty = string;
