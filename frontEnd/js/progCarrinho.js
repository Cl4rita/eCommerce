// Referências aos elementos
const areaCarrinho = document.getElementById('area-carrinho')
const totalTexto = document.getElementById('total')
const btnLimpar = document.getElementById('btn-limpar')
const btnFinalizar = document.getElementById('btn-finalizar')
const btnVoltar = document.getElementById('btn-voltar')

// Recupera os produtos do localStorage
let produtos = JSON.parse(localStorage.getItem('produtos')) || []

// Função para renderizar toda a tabela
function mostrarCarrinho() {
    if (produtos.length === 0) {
        areaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>'
        totalTexto.textContent = 'Total: R$ 0,00'
        return
    }

    let total = 0;
    let tabelaHTML = `
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Preço (R$)</th>
                    <th>Qtde</th>
                    <th>Subtotal (R$)</th>
                </tr>
            </thead>
            <tbody>
    `

    produtos.forEach(p => {
        const subtotal = p.preco * p.qtde
        total += subtotal

        tabelaHTML += `
            <tr>
                <td>${p.nome}</td>
                <td>${p.preco.toFixed(2)}</td>
                <td>${p.qtde}</td>
                <td>${subtotal.toFixed(2)}</td>
            </tr>
        `
    })

    tabelaHTML += `
            </tbody>
        </table>
    `

    areaCarrinho.innerHTML = tabelaHTML
    totalTexto.textContent = `Total: R$ ${total.toFixed(2)}`
}

// Finalizar compra — envia os dados para o backend
btnFinalizar.addEventListener('click', () => {
    if (produtos.length === 0) {
        alert('Seu carrinho está vazio!')
        return
    }

    // Transforma os dados do carrinho para o formato do model Terno
    const pedidoData = produtos.map(produto => ({
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.qtde, // Note: 'quantidade' no model, 'qtde' no carrinho
        descricao: `Pedido: ${produto.nome} - Quantidade: ${produto.qtde}`,
        marca: 'Marca do Produto', // Você pode ajustar isso
        imagem: 'imagem_padrao.jpg' // Imagem padrão ou ajuste conforme necessário
    }))

    fetch('http://localhost:3000/terno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
    })
    .then(res => res.json())
    .then(dados => {
        console.log('Resposta do servidor:', dados)
        alert('Compra finalizada com sucesso!')
        localStorage.removeItem('produtos')
        produtos = []
        mostrarCarrinho()
    })
    .catch(err => {
        console.error('Erro ao enviar dados:', err)
        alert('Erro ao finalizar compra.')
    })
})

// Botão de limpar carrilho
btnLimpar.addEventListener('click', () => {
    areaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>'
    totalTexto.textContent = 'Total: R$ 0,00'
    localStorage.clear()
})
// Botão de voltar à loja
btnVoltar.addEventListener('click', () => {
    location.href = 'index.html'
})

// Exibe os produtos ao carregar a página
mostrarCarrinho()
