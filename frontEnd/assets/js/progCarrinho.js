document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nome do usuário se estiver logado e ativar logout
    if (window.Auth) {
        const user = Auth.getUser()
        const userNameEl = document.getElementById('userName')
        if (user && userNameEl) userNameEl.textContent = user.nome || 'Usuário'

        // attach logout button if present
        const logoutBtn = document.getElementById('logoutBtn')
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.clearAuth()
                window.location.href = 'login.html'
            })
        }
    }

    carregarProdutos();
    // configurarFiltros();
    // configurarModalDetalhes();
});

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
        areaCarrinho.innerHTML = '<div class="carrinho-vazio"><p>Seu carrinho está vazio.</p></div>'
        totalTexto.textContent = 'Total: R$ 0,00'
        return
    }

    let total = 0;
    let tabelaHTML = `
        <table class="tabela-carrinho">
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
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.qtde}</td>
                <td>R$ ${subtotal.toFixed(2)}</td>
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
        quantidade: produto.qtde,
        descricao: `Pedido: ${produto.nome} - Quantidade: ${produto.qtde}`,
        marca: 'Marca do Produto',
        imagem: 'imagem_padrao.jpg'
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

// Botão de limpar carrinho
btnLimpar.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
        localStorage.removeItem('produtos')
        produtos = []
        mostrarCarrinho()
    }
})

// Botão de voltar à loja
btnVoltar.addEventListener('click', () => {
    location.href = './loja.html'
})

// Exibe os produtos ao carregar a página
mostrarCarrinho()