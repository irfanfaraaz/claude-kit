export type Page = 'my-islamic-carousel' | 'piousdeenn-carousel'

declare module 'claude-code' {
  interface PluginState {
    'carousel-ship': { offer: Page | null }
  }
}
