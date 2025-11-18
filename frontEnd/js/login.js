let res = document.getElementById('res')
let nomeVen = document.getElementById('nomeVen')

let logout = document.getElementById('logout')
let login = document.getElementById('login')

login.addEventListener('click', (e)=> {
    e.preventDefault()

    let email = document.getElementById('email').value
    let senha = document.getElementById('senha').value

    const valores = {
        email, senha
    }

    fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        localStorage.setItem('nome', dados.nome)
        localStorage.setItem('statusLog', dados.statusLog)

        nomeVen.innerHTML = dados.nome

        res.innerHTML = ''
        res.innerHTML = dados.message
    })
    .catch((err)=> {
        console.error('Erro no login', err)
    })
})
logout.addEventListener('click', ()=>{
    localStorage.clear()
})