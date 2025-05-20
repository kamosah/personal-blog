import '@testing-library/jest-dom/vitest';
import { JSDOM } from 'jsdom';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';
import 'vitest-axe/extend-expect';

const { window } = new JSDOM();

// ResizeObserver mock
vi.stubGlobal('ResizeObserver', ResizeObserver);
window['ResizeObserver'] = ResizeObserver;

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
window['IntersectionObserver'] = IntersectionObserverMock;

// Scroll Methods mock
// eslint-disable-next-line @typescript-eslint/no-empty-function
window.Element.prototype.scrollTo = () => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
window.Element.prototype.scrollIntoView = () => {};

// matchMedia mock
window.matchMedia =
  window.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };

// requestAnimationFrame mock
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60);

// URL object mock
window.URL.createObjectURL = () => 'https://i.pravatar.cc/300';
// eslint-disable-next-line @typescript-eslint/no-empty-function
window.URL.revokeObjectURL = () => {};

// navigator mock
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
});

// Set window.location.href to an absolute URL for URL constructor compatibility
window.location.href = 'http://localhost/';

// Patch global URL constructor to resolve relative URLs against http://localhost
const OriginalURL = global.URL;
class PatchedURL extends OriginalURL {
  constructor(url: string, base?: string) {
    if (base === undefined && url.startsWith('/')) {
      super(url, 'http://localhost');
    } else {
      super(url, base);
    }
  }
}
global.URL = PatchedURL as typeof URL;

// Override globalThis
Object.assign(global, { window, document: window.document });
