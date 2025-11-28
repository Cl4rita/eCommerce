const login = document.getElementById('login')
let mensagem = document.getElementById('message')

login.addEventListener('click', (e) => {
    e.preventDefault()

    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    if (!email || !senha) {
        mensagem.innerHTML = `Preencha todos os campos para prosseguir.`
        mensagem.style.color = 'pink'
        mensagem.style.textAlign = 'center'
        return
    }

    const valores = {
        email: email,
        senha: senha
    }

    fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {

        console.log(dados)
        console.log('Nome:', dados.usuario.nome)
        console.log('Tipo:', dados.usuario.tipo_usuario)

        if(!dados.token){

            mensagem.innerHTML = dados.message || 'Erro ao realizar login!'
            mensagem.style.color = 'pink'
            mensagem.style.textAlign = 'center'
            return
        }

        // Salvar token 
        sessionStorage.setItem('token', dados.token)
        // Salvar nome
        sessionStorage.setItem('nome', dados.usuario.nome)
        sessionStorage.setItem('tipo_usuario', dados.usuario.tipo_usuario)

        mensagem.innerHTML += `Login realizado com sucesso!`
        mensagem.style.textAlign = 'center'

        setTimeout(() => {
            
            // Redirecionar conforme tipo
            if(dados.usuario.tipo_usuario === 'ADMIN') {

                location.href = '/frontend/public/Admin.html'
            }else{

                location.href = '/frontend/public/loja.html'
            }
        }, 500)
    })
    .catch((err) => {

        console.error('Erro ao realizar login:', err)
        mensagem.innerHTML = `Erro ao realizar login.`
        mensagem.style.color = 'pink'
        mensagem.style.textAlign = 'center'
    })
})

/*const messageEl = document.getElementById('message')
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
}) */