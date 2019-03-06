interface StringSearchResult {
  line: number,
  term: string,
  text: string,
}

declare module 'string-search' {
  export function find (
    targetString: string,
    regex: RegExp
  ): Promise<StringSearchResult[]>;
}

