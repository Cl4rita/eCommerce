let message = document.getElementById('message')

let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', async (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let descricao = document.getElementById('descricao').value
    let modelo = document.getElementById('modelo').value
    let preco = Number(document.getElementById('preco').value)
    let imagem_url = document.getElementById('imagem_url').value
    let ativo = document.getElementById('ativo').value


    try {
        const payload = {
            nome,
            descricao,
            modelo,
            preco: Number(preco),
            imagem_url,
            ativo: ativo === 'true' || ativo === true
        }

        const resp = await ApiService.request('/produto', {
            method: 'POST',
            body: payload
        })

        message.innerHTML = resp.message || 'Cadastro realizado com sucesso'
    } catch (err) {
        console.error('Erro no cadastrar', err)
        message.innerHTML = err.message || (err && err.message) || 'Erro ao cadastrar'
    }
})