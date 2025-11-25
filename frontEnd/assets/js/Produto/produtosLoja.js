// produtosLoja.js
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
});

function carregarProdutos() {
    fetch('http://localhost:3000/produtos')
        .then(resp => resp.json())
        .then(produtos => {
            exibirProdutos(produtos);
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err);
            document.getElementById('grade-produtos').innerHTML = 
                '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        });
}

function exibirProdutos(produtos) {
    const container = document.getElementById('grade-produtos');
    container.innerHTML = '';

    produtos.forEach(produto => {
        if (produto.ativo) { // Mostrar apenas produtos ativos
            const produtoElement = criarProdutoElement(produto);
            container.appendChild(produtoElement);
        }
    });
}

function criarProdutoElement(produto) {
    const article = document.createElement('article');
    article.className = 'produto';
    
    article.innerHTML = `
        <figure>
            <img src="${produto.imagem_url || '../assets/img/placeholder.jpg'}" 
                 alt="${produto.nome}" 
                 onerror="this.src='../assets/img/placeholder.jpg'">
            <figcaption>${produto.nome}</figcaption>
        </figure>
        
        <div class="produto-descricao">
            <p>${produto.descricao || 'Descrição não disponível'}</p>
        </div>
        
        <div class="produto-beneficios">
            <h4>Características</h4>
            <ul>
                <li>Modelo: ${produto.modelo}</li>
                <li>Categoria: ${produto.categoriaProduto?.nome || 'Geral'}</li>
            </ul>
        </div>
        
        <div class="controle-produto">
            <span class="preco">R$ ${parseFloat(produto.preco).toFixed(2)}</span>
            <input type="number" id="qtde-${produto.id}" min="1" value="1" class="input-qtde">
            <button onclick="adicionarAoCarrinho(${produto.id})" 
                    class="btn btn-primary">
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    return article;
}

function adicionarAoCarrinho(idProduto) {
    const inputQtde = document.getElementById(`qtde-${idProduto}`);
    const quantidade = parseInt(inputQtde.value) || 1;
    
    // Recuperar carrinho atual do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === idProduto);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        // Buscar informações completas do produto
        fetch(`http://localhost:3000/produtos/${idProduto}`)
            .then(resp => resp.json())
            .then(produto => {
                carrinho.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem_url,
                    quantidade: quantidade
                });
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                mostrarFeedback('Produto adicionado ao carrinho!');
            })
            .catch(err => {
                console.error('Erro ao adicionar produto:', err);
                mostrarFeedback('Erro ao adicionar produto', 'error');
            });
        return;
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarFeedback('Produto adicionado ao carrinho!');
}

function mostrarFeedback(mensagem, tipo = 'success') {
    // Criar elemento de feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
    `;
    feedback.textContent = mensagem;
    
    document.body.appendChild(feedback);
    
    // Remover após 3 segundos
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}