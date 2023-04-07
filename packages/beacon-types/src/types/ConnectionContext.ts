import { Origin } from '..'

/**
 * @internalapi
 */
export interface ConnectionContext {
  origin: Origin
  id: string
  extras?: { sender:
    // taken from chrome.runtime.MessageSender type in @types/chrome
    {
      /** The ID of the extension or app that opened the connection, if any. */
      id?: string | undefined;
      /** The tabs.Tab which opened the connection, if any. This property will only be present when the connection was opened from a tab (including content scripts), and only if the receiver is an extension, not an app. */
      //tab?: chrome.tabs.Tab | undefined;
      tab: any;
      /** The name of the native application that opened the connection, if any.
       * @since Chrome 74
       */
      nativeApplication?: string | undefined;
      /**
       * The frame that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when tab is set.
       * @since Chrome 41.
       */
      frameId?: number | undefined;
      /**
       * The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.
       * @since Chrome 28.
       */
      url?: string | undefined;
      /**
       * The TLS channel ID of the page or frame that opened the connection, if requested by the extension or app, and if available.
       * @since Chrome 32.
       */
      tlsChannelId?: string | undefined;
      /**
       * The origin of the page or frame that opened the connection. It can vary from the url property (e.g., about:blank) or can be opaque (e.g., sandboxed iframes). This is useful for identifying if the origin can be trusted if we can't immediately tell from the URL.
       * @since Chrome 80.
       */
      origin?: string | undefined;
    }; sendResponse(response?: unknown): void }
}
