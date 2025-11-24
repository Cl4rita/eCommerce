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

        // Adicionar token se existir
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async register(userData) {
        return this.request('/registro', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Produtos
    static async getProdutos() {
        return this.request('/produtos');
    }

    static async getProduto(id) {
        return this.request(`/produtos/${id}`);
    }

    // Categorias
    static async getCategorias() {
        return this.request('/categorias');
    }

    // Pedidos
    static async criarPedido(pedidoData) {
        return this.request('/pedidos', {
            method: 'POST',
            body: JSON.stringify(pedidoData)
        });
    }

    static async getPedidosUsuario() {
        return this.request('/pedidos');
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