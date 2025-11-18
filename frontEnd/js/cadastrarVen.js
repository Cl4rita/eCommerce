let res = document.getElementById('res')

let cadastrar = document.getElementById('cadastrar')

cadastrar.addEventListener('click', (e)=> {
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    const valores = {
        nome, email, senha
    }

    fetch(`http://localhost:3000/vendendor`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {

        res.innerHTML = ''
        res.innerHTML = dados.message
    })
    .catch((err)=> {
        console.error('Erro no cadastrar', err)
    })
})