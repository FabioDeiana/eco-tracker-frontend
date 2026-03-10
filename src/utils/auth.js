// Decodifica il payload del token JWT
// Il token è composto da 3 parti separate da "." — header.payload.signature
// Il payload è la seconda parte, codificata in Base64
export function decodeToken(token) {
  try {
    // Prendiamo la seconda parte del token (il payload)
    const base64Payload = token.split(".")[1]

    // Decodifichiamo il Base64 in una stringa JSON
    const jsonPayload = atob(base64Payload)

    // Convertiamo la stringa JSON in un oggetto JavaScript
    return JSON.parse(jsonPayload)
  } catch (err) {
    return null
  }
}

// Restituisce il ruolo dell'utente loggato ("USER" o "ADMIN")
export function getUserRole() {
  const token = localStorage.getItem("token")
  if (!token) return null

  const decoded = decodeToken(token)
  return decoded?.role || null
}

// Restituisce true se l'utente loggato è ADMIN
export function isAdmin() {
  return getUserRole() === "ADMIN"
}