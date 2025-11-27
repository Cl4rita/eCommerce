let message = document.getElementById('message')

let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', async (e) => {
    e.preventDefault()

    let idCategoria = Number(document.getElementById('idCategoria').value)
    let nome = document.getElementById('nome').value
    let descricao = document.getElementById('descricao').value
    let modelo = document.getElementById('modelo').value
    let preco = Number(document.getElementById('preco').value)
    let imagem_url = document.getElementById('imagem_url').value
    let ativo = document.getElementById('ativo').value


    try {
        const resp = await ApiService.register({ idCategoria, nome, descricao, modelo, preco, imagem_url, ativo })
        message.innerHTML = resp.message || 'Cadastro realizado com sucesso'
        setTimeout(() => window.location.href = '../loja.html', 1200)
    } catch (err) {
        console.error('Erro no cadastrar', err)
        message.innerHTML = err.message || (err && err.message) || 'Erro ao cadastrar'
    }
})