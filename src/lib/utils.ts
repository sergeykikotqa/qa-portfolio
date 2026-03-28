import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupBy<TItem, TKey extends string>(
  items: TItem[],
  getKey: (item: TItem) => TKey,
) {
  return items.reduce<Record<TKey, TItem[]>>((groups, item) => {
    const key = getKey(item)

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(item)

    return groups
  }, {} as Record<TKey, TItem[]>)
}
