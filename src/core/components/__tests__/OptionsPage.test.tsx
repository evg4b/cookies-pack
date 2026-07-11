import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { OptionsPage } from '../OptionsPage';

let iconClickAction: 'popup' | 'sidepanel' = 'popup';
const setIconClickAction = vi.fn().mockImplementation((value: 'popup' | 'sidepanel') => {
  iconClickAction = value;
  return Promise.resolve();
});

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useIconClickAction: () => [iconClickAction, setIconClickAction],
}));

describe('OptionsPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    iconClickAction = 'popup';
  });

  it('renders the icon click action options with the stored value selected', () => {
    iconClickAction = 'popup';
    render(<OptionsPage/>, { wrapper: MantineProvider });

    expect(screen.getByText('options_title')).toBeInTheDocument();
    expect(screen.getByLabelText('options_icon_click_action_popup')).toBeChecked();
    expect(screen.getByLabelText('options_icon_click_action_sidepanel')).not.toBeChecked();
  });

  it('persists the side panel option when selected', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('options_icon_click_action_sidepanel'));

    expect(setIconClickAction).toHaveBeenCalledWith('sidepanel');
  });
});
