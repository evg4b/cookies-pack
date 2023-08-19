/// <reference types="vite/client" />

declare module '*.svg' {

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  export default src;
}

declare module '*.json' {
  const content: string;
  export default content;
}

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type Cookie = chrome.cookies.Cookie;
