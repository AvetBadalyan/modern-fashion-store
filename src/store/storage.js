// Small typed-ish localStorage helpers with safe fallbacks.
const PREFIX = 'modern:'

export const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

// Like loadState, but guarantees an array. Stored JSON can be edited or
// corrupted, and a non-array would crash code that calls .map/.reduce on it.
export const loadList = (key) => {
  const value = loadState(key, [])
  return Array.isArray(value) ? value : []
}

export const saveState = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    // Storage full, disabled, or private mode — report failure so callers
    // can surface it (e.g. warn the user their order didn't persist).
    return false
  }
}

export const clearState = (key) => {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}
