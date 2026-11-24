export async function requestPersistentStorage(): Promise<{
  isPersisted: boolean;
  quotaUsedMB: number;
  quotaTotalMB: number;
}> {
  let isPersisted = false;

  if (navigator.storage && navigator.storage.persist) {
    isPersisted = await navigator.storage.persist();
  } else if (navigator.storage && navigator.storage.persisted) {
    isPersisted = await navigator.storage.persisted();
  }

  let quotaUsedMB = 0;
  let quotaTotalMB = 0;

  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    quotaUsedMB = Math.round((estimate.usage || 0) / (1024 * 1024) * 10) / 10;
    quotaTotalMB = Math.round((estimate.quota || 0) / (1024 * 1024) * 10) / 10;
  }

  return { isPersisted, quotaUsedMB, quotaTotalMB };
}
