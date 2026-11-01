/**
 * Cross-browser WebExtension MV3 abstraction for Firefox (browser.*) and Chromium/Chrome (chrome.*).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getExtApi(): any {
  const g = globalThis as Record<string, unknown>;
  return g.browser || g.chrome || null;
}

export function isFirefoxWebExt(): boolean {
  const g = globalThis as Record<string, unknown>;
  const b = g.browser as { runtime?: { id?: string } } | undefined;
  return Boolean(b && b.runtime && typeof b.runtime.id === 'string');
}

export function getExtensionUrl(relPath: string): string {
  const api = getExtApi();
  if (api?.runtime?.getURL) {
    return api.runtime.getURL(relPath);
  }
  return relPath;
}

export async function sendRuntimeMessage<T = unknown>(msg: unknown): Promise<T> {
  const api = getExtApi();
  if (!api?.runtime?.sendMessage) {
    throw new Error('WebExtension runtime.sendMessage is unavailable in this context');
  }
  return (await api.runtime.sendMessage(msg)) as T;
}

export function onRuntimeMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (msg: any, sender: chrome.runtime.MessageSender) => Promise<unknown>
): void {
  const g = globalThis as Record<string, unknown>;
  // Firefox WebExtensions prefer returning a Promise directly from runtime.onMessage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const browserApi = g.browser as any;
  if (browserApi?.runtime?.onMessage?.addListener) {
    browserApi.runtime.onMessage.addListener((rawMsg: unknown, sender: chrome.runtime.MessageSender) => {
      return handler(rawMsg, sender).catch((err: unknown) => ({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }));
    });
    return;
  }

  // Chromium / Chrome MV3 callback + return true pattern
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromeApi = g.chrome as any;
  if (chromeApi?.runtime?.onMessage?.addListener) {
    chromeApi.runtime.onMessage.addListener(
      (rawMsg: unknown, sender: chrome.runtime.MessageSender, sendResponse: (res: unknown) => void) => {
        handler(rawMsg, sender)
          .then(sendResponse)
          .catch((err: unknown) => {
            sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) });
          });
        return true;
      }
    );
  }
}

export async function queryTabs(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
  const api = getExtApi();
  if (!api?.tabs?.query) return [];
  return (await api.tabs.query(queryInfo)) as chrome.tabs.Tab[];
}

export async function createTab(props: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab | null> {
  const api = getExtApi();
  if (!api?.tabs?.create) return null;
  return (await api.tabs.create(props)) as chrome.tabs.Tab;
}

export async function reloadTab(tabId: number): Promise<void> {
  const api = getExtApi();
  if (api?.tabs?.reload) {
    await api.tabs.reload(tabId);
  }
}

export async function sendTabMessage(tabId: number, msg: unknown): Promise<unknown> {
  const api = getExtApi();
  if (!api?.tabs?.sendMessage) return null;
  return api.tabs.sendMessage(tabId, msg);
}

export async function storageLocalGet(key: string): Promise<Record<string, unknown>> {
  const api = getExtApi();
  if (api?.storage?.local?.get) {
    return (await api.storage.local.get(key)) || {};
  }
  return {};
}

export async function storageLocalSet(items: Record<string, unknown>): Promise<void> {
  const api = getExtApi();
  if (api?.storage?.local?.set) {
    await api.storage.local.set(items);
  }
}
