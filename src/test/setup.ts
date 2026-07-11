import '@testing-library/jest-dom/vitest';
import { matchMedia } from 'mock-match-media';
import ResizeObserverPolyfill from 'resize-observer-polyfill';

window.matchMedia = matchMedia;
window.ResizeObserver = ResizeObserverPolyfill;
