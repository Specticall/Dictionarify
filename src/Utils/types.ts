export type TPhonetic = {
  text: string;
  audio: string;
  sourceUrl: string;
  license: {
    name: string;
    url: string;
  };
};

export type TDefinition = {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
};

export type TMeaning = {
  partOfSpeech: string;
  definitions: TDefinition[];
  synonyms: string[];
  antonyms: string[];
};

export type TLicense = {
  name: string;
  url: string;
};

export type TWord = {
  word: string;
  phonetics: TPhonetic[];
  meanings: TMeaning[];
  license: TLicense;
  sourceUrls: string[];
};

export type TDictionaryResponse = TWord[];

export type TDictionaryErrorResponse = {
  message: string;
  resolution: string;
  title: string;
};

export type TUser = {
  email: string;
  password: string;
  id: string;
  bookmarks: TBookmark[];
};

export type TBookmark = {
  word: string;
  partOfSpeech: string;
  definition: string;
  dateCreated: Date;
};
