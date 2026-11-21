declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
  export class URL {
    constructor(input: string, base?: string | URL);
    href: string;
    pathname: string;
  }
}

interface ImportMeta {
  readonly url: string;
}
