let message = document.getElementById('message')

let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', async (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    let cpf = document.getElementById('cpf').value
    const tipo_usuario = document.getElementById('tipo_usuario').value
    const telefone = document.getElementById('telefone').value

    // limpar caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, '')

    try {
        const resp = await ApiService.register({ nome, email, senha, cpf, tipo_usuario, telefone })
        message.innerHTML = resp.message || 'Cadastro realizado com sucesso'
        // redirecionar para login após pequeno delay (página está em public/Usuario)
        setTimeout(() => window.location.href = '../login.html', 1200)
    } catch (err) {
        console.error('Erro no cadastrar', err)
        message.innerHTML = err.message || (err && err.message) || 'Erro ao cadastrar'
    }
})