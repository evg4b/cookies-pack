import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { OptionsPage } from '../../../options/OptionsPage.tsx';

let iconClickAction: 'popup' | 'sidepanel' = 'popup';
const setIconClickAction = vi.fn().mockImplementation((value: 'popup' | 'sidepanel') => {
  iconClickAction = value;
  return Promise.resolve();
});

let cookieEditorEnabled = true;
const setCookieEditorEnabled = vi.fn().mockImplementation((value: boolean) => {
  cookieEditorEnabled = value;
  return Promise.resolve();
});

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useIconClickAction: () => [iconClickAction, setIconClickAction],
  useCookieEditorEnabled: () => [cookieEditorEnabled, setCookieEditorEnabled],
}));

describe('OptionsPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    iconClickAction = 'popup';
    cookieEditorEnabled = true;
  });

  it('renders the icon click action options with the stored value selected', () => {
    iconClickAction = 'popup';
    render(<OptionsPage/>, { wrapper: MantineProvider });

    expect(screen.getByText('options_icon_click_action_label')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'options_icon_click_action_popup' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'options_icon_click_action_sidepanel' })).not.toBeChecked();
  });

  it('persists the side panel option when selected', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByRole('radio', { name: 'options_icon_click_action_sidepanel' }));

    expect(setIconClickAction).toHaveBeenCalledWith('sidepanel');
  });

  it('renders the cookie editor toggle enabled by default', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    expect(screen.getByText('options_cookie_editor_enabled_label')).toBeInTheDocument();
    expect(screen.getByLabelText('options_cookie_editor_enabled_label')).toBeChecked();
  });

  it('persists disabling the cookie editor', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('options_cookie_editor_enabled_label'));

    expect(setCookieEditorEnabled).toHaveBeenCalledWith(false);
  });
});
