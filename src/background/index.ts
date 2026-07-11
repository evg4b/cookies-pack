type IconClickAction = 'popup' | 'sidepanel';

const ICON_CLICK_ACTION_KEY = 'iconClickAction';
const manifestAction = chrome.runtime.getManifest().action as chrome.runtime.ManifestAction | undefined;
const defaultPopup = manifestAction?.default_popup ?? '';

export const applyIconClickAction = async (action: IconClickAction): Promise<void> => {
  const useSidePanel = action === 'sidepanel';

  await chrome.action.setPopup({ popup: useSidePanel ? '' : defaultPopup });
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: useSidePanel });
};

export const syncIconClickAction = async (): Promise<void> => {
  const stored = await chrome.storage.sync.get<Record<string, IconClickAction>>(ICON_CLICK_ACTION_KEY);
  await applyIconClickAction(stored[ICON_CLICK_ACTION_KEY] ?? 'popup');
};

chrome.runtime.onInstalled.addListener(() => void syncIconClickAction());
chrome.runtime.onStartup.addListener(() => void syncIconClickAction());

chrome.storage.sync.onChanged.addListener((changes) => {
  if (Object.prototype.hasOwnProperty.call(changes, ICON_CLICK_ACTION_KEY)) {
    void applyIconClickAction(changes[ICON_CLICK_ACTION_KEY].newValue as IconClickAction);
  }
});
