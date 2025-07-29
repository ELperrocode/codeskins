import { en } from './en'
import { es } from './es'

export const dictionaries = {
  en,
  es,
}

export type Dictionary = typeof en

export async function getDictionary(locale: string): Promise<Dictionary> {
  return (dictionaries[locale as keyof typeof dictionaries] || en) as Dictionary
} 