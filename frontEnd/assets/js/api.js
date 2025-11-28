const API_BASE_URL = 'http://localhost:3000';

// Funções genéricas para API
class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Adicionar token se existir (suporta sessionStorage e localStorage)
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // se o corpo for um objeto (e não um FormData), serializar para JSON
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body)
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Auth
    static async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: credentials
        });
    }

    static async register(userData) {
        return this.request('/usuario', {
            method: 'POST',
            body: userData
        });
    }

    // Produtos
    static async getProdutos() {
        return this.request('/produto');
    }

    static async getProduto(id) {
        return this.request(`/produto/${id}`);
    }

    // Categorias
    static async getCategorias() {
        return this.request('/categoria');
    }

    // Pedidos
    static async criarPedido(pedidoData) {
        return this.request('/pedido', {
            method: 'POST',
            body: pedidoData
        });
    }
    
    static async getPedidosUsuario() {
        return this.request('/pedido');
    }

    // Carrinho (local storage)
    static getCarrinho() {
        return JSON.parse(localStorage.getItem('carrinho')) || [];
    }

    static salvarCarrinho(carrinho) {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    static limparCarrinho() {
        localStorage.removeItem('carrinho');
    }
}

// Utilitários
class Utils {
    static formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    }

    static formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static mostrarMensagem(elementId, mensagem, tipo = 'error') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = mensagem;
            element.className = `message ${tipo}`;
            element.style.display = 'block';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
}