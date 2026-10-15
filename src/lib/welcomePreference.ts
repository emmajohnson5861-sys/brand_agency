const storageKey = 'algofort:hide-project-popup'
const cookieName = 'algofort_hide_project_popup'

function cookieIsSet() {
  try { return document.cookie.split(';').some(cookie => cookie.trim() === `${cookieName}=1`) }
  catch { return false }
}

export function isWelcomeSuppressed() {
  try { if (localStorage.getItem(storageKey) === '1') return true }
  catch { /* Fall back to the preference cookie. */ }
  return cookieIsSet()
}

export function saveWelcomePreference(suppressed: boolean) {
  try {
    if (suppressed) localStorage.setItem(storageKey, '1')
    else localStorage.removeItem(storageKey)
  } catch { /* Cookies can still remember the preference. */ }
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${cookieName}=${suppressed ? '1' : ''}; Max-Age=${suppressed ? 31536000 : 0}; Path=/; SameSite=Lax${secure}`
  } catch { /* Local storage can still remember the preference. */ }
  return isWelcomeSuppressed() === suppressed
}
