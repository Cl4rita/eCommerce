const messageEl = document.getElementById('message')
let nomeUs = document.getElementById('nomeUs')

let login = document.getElementById('login')

login.addEventListener('click', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    try {
        const resp = await ApiService.login({ email, senha })
        Auth.setAuth(resp)

        if (resp.usuario && resp.usuario.nome) {
            nomeUs.innerHTML = resp.usuario.nome
        }

        // redirecionar conforme tipo de usuário (pequeno delay para feedback)
        setTimeout(() => {
            try {
                const tipo = resp && resp.usuario && (resp.usuario.tipo || resp.usuario.tipo_usuario)
                if (tipo === 'ADMIN') {
                    location.href = './Admin.html'
                } else {
                    location.href = './loja.html'
                }
            } catch (e) {
                // fallback
                window.location.href = 'loja.html'
            }
        }, 100)
    } catch (err) {
        console.error('Erro no login', err)
        if (messageEl) messageEl.textContent = err.message || 'Erro no login'
    }
})