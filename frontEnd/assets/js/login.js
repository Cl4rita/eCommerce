const messageEl = document.getElementById('message')
let nomeUs = document.getElementById('nomeUs')

let login = document.getElementById('login')

login.addEventListener('click', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    try {
        const resp = await ApiService.login({ email, senha })
        // resp deve conter { token, usuario }
        Auth.setAuth(resp)

        if (resp.usuario && resp.usuario.nome) {
            nomeUs.innerHTML = resp.usuario.nome
        }

        // redirecionar para a loja por padrão
        window.location.href = 'loja.html'
    } catch (err) {
        console.error('Erro no login', err)
        if (messageEl) messageEl.textContent = err.message || 'Erro no login'
    }
})