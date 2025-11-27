// auth.js - helper para frontend
// Guarda token e usuário no localStorage e fornece helpers

const Auth = {
  setAuth(authResult) {
    // espera { token, usuario } ou { token, user }
    if (!authResult) return
    const token = authResult.token || authResult.accessToken || null
    const user = authResult.usuario || authResult.user || null

    if (token) localStorage.setItem('token', token)
    if (user) localStorage.setItem('user', JSON.stringify(user))
    if (user && user.nome) localStorage.setItem('nome', user.nome)
    if (user && user.tipo) localStorage.setItem('role', user.tipo)
  },

  clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('nome')
    localStorage.removeItem('role')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getUser() {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  },

  getRole() {
    return localStorage.getItem('role') || null
  },

  isLoggedIn() {
    return !!this.getToken()
  },

  // allowedRoles: array of roles allowed (e.g. ['ADMIN'])
  requireAuth(allowedRoles = null, redirectTo = '/public/login.html') {
    // If not logged, redirect to login
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo
      return false
    }

    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      const role = this.getRole()
      if (!role || !allowedRoles.includes(role)) {
        // redirect to store / unauthorized page
        window.location.href = '/public/loja.html'
        return false
      }
    }

    return true
  }
}

// expor global para uso em páginas
window.Auth = Auth

// Attach logout behavior globally when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtns = document.querySelectorAll('#logoutBtn')
  if (logoutBtns && logoutBtns.length) {
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        Auth.clearAuth()
        // try sensible redirects depending on current path
        const tryPaths = ['login.html', '../login.html', '/public/login.html']
        for (const p of tryPaths) {
          try { window.location.href = p; break } catch (err) {}
        }
        // fallback: reload
        setTimeout(() => location.reload(), 200)
      })
    })
  }
})
