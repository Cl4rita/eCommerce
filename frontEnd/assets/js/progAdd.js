// Recupera os botões e inputs pelos seus IDs
const b1 = document.getElementById('btn1')
const b2 = document.getElementById('btn2')
const b3 = document.getElementById('btn3')
const b4 = document.getElementById('btn4')

const q1 = document.getElementById('qtde1')
const q2 = document.getElementById('qtde2')
const q3 = document.getElementById('qtde3')
const q4 = document.getElementById('qtde4')

// Carrega o carrinho existente ou inicia um novo array
let produtos = JSON.parse(localStorage.getItem('produtos')) || []

// Função genérica para adicionar produto
function adicionarProduto(b, q) {
    const originalText = b.textContent;
    const originalColor = b.style.backgroundColor;
    
    b.style.backgroundColor = 'green'
    b.textContent = 'Adicionado ao carrinho'

    setTimeout(() => {
        b.style.backgroundColor = originalColor;
        b.textContent = originalText;
    }, 1000);

    const nome = b.dataset.nome
    const preco = Number(b.dataset.preco)
    const codProd = b.dataset.codprod
    const qtde = Number(q.value)

    const produto = { nome, preco, codProd, qtde }

    produtos.push(produto)
    // console.log(produtos)
    localStorage.setItem('produtos', JSON.stringify(produtos))

    // alert(`${qtde}x ${nome} adicionado(s) ao carrinho!`)
}

// Eventos individuais
b1.addEventListener('click', () => adicionarProduto(b1, q1))
b2.addEventListener('click', () => adicionarProduto(b2, q2))
b3.addEventListener('click', () => adicionarProduto(b3, q3))
b4.addEventListener('click', () => adicionarProduto(b4, q4))

