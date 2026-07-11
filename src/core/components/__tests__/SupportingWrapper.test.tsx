import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { SupportingWrapper } from '../SupportingWrapper';

let url: string | null = 'https://example.com/page';

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useCookies: () => ({ url }),
}));

describe('SupportingWrapper', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the children when the current page is a supported http(s) page', () => {
    url = 'https://example.com/page';
    render(<SupportingWrapper><div>child content</div></SupportingWrapper>, { wrapper: MantineProvider });

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('renders the unsupported empty state for internal browser pages', () => {
    url = 'chrome://extensions';
    render(<SupportingWrapper><div>child content</div></SupportingWrapper>, { wrapper: MantineProvider });

    expect(screen.queryByText('child content')).not.toBeInTheDocument();
    expect(screen.getByText('supporting_wrapper_title')).toBeInTheDocument();
    expect(screen.getByText('supporting_wrapper_description')).toBeInTheDocument();
  });

  it('renders the unsupported empty state when there is no active tab url', () => {
    url = null;
    render(<SupportingWrapper><div>child content</div></SupportingWrapper>, { wrapper: MantineProvider });

    expect(screen.queryByText('child content')).not.toBeInTheDocument();
    expect(screen.getByText('supporting_wrapper_title')).toBeInTheDocument();
  });
});
