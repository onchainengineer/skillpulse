export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  // Additional subreddits for this language
  subredditSuffixes: string[];
  // Search terms to add for HN Algolia
  searchTerms: string[];
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    subredditSuffixes: [],
    searchTerms: [],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    subredditSuffixes: ["india", "developersIndia", "IndiaTech"],
    searchTerms: ["india", "hindi"],
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    subredditSuffixes: ["programacion", "tecnologia"],
    searchTerms: ["spanish", "español"],
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    subredditSuffixes: ["programmation", "informatique"],
    searchTerms: ["french", "français"],
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    subredditSuffixes: ["de_EDV", "programmierer"],
    searchTerms: ["german", "deutsch"],
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    subredditSuffixes: ["brdev", "tecnologia"],
    searchTerms: ["brazil", "portuguese"],
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    subredditSuffixes: ["japan_anime", "newsokur"],
    searchTerms: ["japan", "japanese"],
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    subredditSuffixes: ["korea", "hanguk"],
    searchTerms: ["korea", "korean"],
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    subredditSuffixes: ["China_irl", "programming_cn"],
    searchTerms: ["china", "chinese"],
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    subredditSuffixes: ["arabs"],
    searchTerms: ["arabic"],
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    subredditSuffixes: ["Pikabu", "ru_programming"],
    searchTerms: ["russian"],
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
    subredditSuffixes: ["tamil", "developersIndia"],
    searchTerms: ["tamil", "india"],
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    subredditSuffixes: ["telugu", "developersIndia"],
    searchTerms: ["telugu", "india"],
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇮🇳",
    subredditSuffixes: ["bengali", "developersIndia"],
    searchTerms: ["bengali", "india"],
  },
];

export function getLanguageByCode(code: string): LanguageConfig {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
