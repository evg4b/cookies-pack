import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { OptionsPage } from '../../../options/OptionsPage';

type CookieEditorMode = 'bulk-editor-only' | 'editor-only' | 'both-editors';

let iconClickAction: 'popup' | 'sidepanel' = 'popup';
const setIconClickAction = vi.fn().mockImplementation((value: 'popup' | 'sidepanel') => {
  iconClickAction = value;
  return Promise.resolve();
});

let cookieEditorMode: CookieEditorMode = 'both-editors';
const setCookieEditorMode = vi.fn().mockImplementation((value: CookieEditorMode) => {
  cookieEditorMode = value;
  return Promise.resolve();
});

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useIconClickAction: () => [iconClickAction, setIconClickAction],
  useCookieEditorMode: () => [cookieEditorMode, setCookieEditorMode],
}));

describe('OptionsPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    iconClickAction = 'popup';
    cookieEditorMode = 'both-editors';
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

  it('renders the editor mode options with both editors selected by default', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    expect(screen.getByText('Editor mode')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'options_editor_mode_bulk_editor_only' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'options_editor_mode_editor_only' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'options_editor_mode_both_editors' })).toBeChecked();
  });

  it('reflects a previously stored editor mode as selected', () => {
    cookieEditorMode = 'editor-only';
    render(<OptionsPage/>, { wrapper: MantineProvider });

    expect(screen.getByRole('radio', { name: 'options_editor_mode_editor_only' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'options_editor_mode_both_editors' })).not.toBeChecked();
  });

  it('persists selecting the bulk-editor-only mode', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByRole('radio', { name: 'options_editor_mode_bulk_editor_only' }));

    expect(setCookieEditorMode).toHaveBeenCalledWith('bulk-editor-only');
  });

  it('persists selecting the editor-only mode', () => {
    render(<OptionsPage/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByRole('radio', { name: 'options_editor_mode_editor_only' }));

    expect(setCookieEditorMode).toHaveBeenCalledWith('editor-only');
  });
});
