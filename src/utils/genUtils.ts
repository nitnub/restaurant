import { NamedObject } from '@/types/utilTypes';

export function sortName(a: string, b: string) {
  if (!a || !b) return 0;

  if (a.toLowerCase().startsWith('the ')) a = a.slice(4);
  if (b.toLowerCase().startsWith('the ')) b = b.slice(4);

  return a > b ? 1 : -1;
}

export function sortObjByName<T extends NamedObject>(a: T, b: T) {
  return sortName(a.name, b.name);
}


