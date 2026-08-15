type Substitutions = string | (string | number)[];
type Translate = (key: string, substitutions?: Substitutions) => string;

export const useTranslation = (namespace: string): Translate => {
  return (key, substitutions) => chrome.i18n.getMessage(
    namespace ? `${namespace}_${key}` : key,
    substitutions,
  );
};
