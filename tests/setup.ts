import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

type Query = Record<string, string | number | boolean | undefined>;

type NuxtRouter = {
  currentRoute: { value: { query: Query } };
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
};

const createRouter = (): NuxtRouter => {
  const currentRoute = { value: { query: {} } };

  return {
    currentRoute,
    push: vi.fn(async ({ query }: { query: Query }) => {
      currentRoute.value = { query: { ...query } };
    }),
    replace: vi.fn(async ({ query }: { query: Query }) => {
      currentRoute.value = { query: { ...query } };
    }),
  };
};

type StateRef<T> = { value: T };
const stateStore = new Map<string, StateRef<unknown>>();
const serverReaderModeMocks = {
  checkFrameAccess: vi.fn(async () => ({ iframeLikelyBlocked: false })),
  fetchReaderMode: vi.fn(async () => ({})),
};

let router = createRouter();

const resetNuxtMocks = () => {
  stateStore.clear();
  router = createRouter();
  serverReaderModeMocks.checkFrameAccess.mockReset();
  serverReaderModeMocks.checkFrameAccess.mockResolvedValue({
    iframeLikelyBlocked: false,
  });
  serverReaderModeMocks.fetchReaderMode.mockReset();
  serverReaderModeMocks.fetchReaderMode.mockResolvedValue({});
};

Object.assign(globalThis, {
  __resetNuxtMocks: resetNuxtMocks,
  __serverReaderModeMocks: serverReaderModeMocks,
});

// mimics the behavior of the nuxt auto imports
Object.assign(globalThis, {
  useState: <T>(key: string, init: () => T): StateRef<T> => {
    if (!stateStore.has(key)) {
      stateStore.set(key, { value: init() });
    }
    return stateStore.get(key) as StateRef<T>;
  },
  useRouter: () => router,
  useI18n: () => ({
    $t: (key: string, params?: { hostname?: string }) =>
      params?.hostname ? `${key}:${params.hostname}` : key,
    $getLocale: () => 'en',
  }),
  useServerReaderMode: () => serverReaderModeMocks,
  definePageMeta: () => undefined,
  useHead: () => undefined,
  onMounted: (callback: () => void) => {
    callback();
  },
});
