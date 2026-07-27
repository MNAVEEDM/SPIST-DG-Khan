import { navigation } from './site';

/**
 * Flattens the nav tree into `[{ href, label, trail }]` so any route can
 * resolve its own page title and breadcrumb without a second config.
 */
export function flattenNavigation(items = navigation, trail = []) {
  return items.flatMap((item) => {
    const currentTrail = [...trail, item.label];
    const self = item.href ? [{ href: item.href, label: item.label, trail: currentTrail }] : [];
    const children = item.children ? flattenNavigation(item.children, currentTrail) : [];
    return [...self, ...children];
  });
}

const flat = flattenNavigation();

/** Resolves the nav entry (title + breadcrumb trail) for a pathname. */
export function navEntryFor(pathname) {
  return flat.find((entry) => entry.href === pathname) ?? null;
}
