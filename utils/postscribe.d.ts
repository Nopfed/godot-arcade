declare module 'postscribe' {
  export default (
    elem: HTMLElement | string,
    html: string | ((doc: HTMLDocument) => void),
    opts?: any
  ) => {}
}