import { en } from './translations/en';
import { as } from './translations/as';
import { bn } from './translations/bn';
import { mni, kha } from './translations/regional';
import type { LanguageCode } from '../types';

export const translations: Record<LanguageCode, typeof en> = {
  en,
  as,
  bn,
  mni,
  kha,
};

export const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; nativeLabel: string; regionBadge: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', regionBadge: 'Universal' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', regionBadge: 'Assam' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', regionBadge: 'Tripura / Assam' },
  { code: 'mni', label: 'Manipuri', nativeLabel: 'মৈতৈলোন্ (Meiteilon)', regionBadge: 'Manipur' },
  { code: 'kha', label: 'Khasi', nativeLabel: 'Ka Ktien Khasi', regionBadge: 'Meghalaya' },
];

export function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}
