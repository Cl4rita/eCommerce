document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nome do usuário se estiver logado e ativar logout
    if (window.Auth) {
        // exigir autenticação para acessar o perfil
        if (!Auth.requireAuth()) return

        const user = Auth.getUser()
        const userNameEl = document.getElementById('userName')
        if (user && userNameEl) userNameEl.textContent = user.nome || 'Usuário'

        // attach logout button if present
        const logoutBtn = document.getElementById('logoutBtn')
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.clearAuth()
                window.location.href = '../login.html'
            })
        }

        // preencher os dados do usuário no formulário
        if (user) carregarDadosUsuario(user)
        // carregar endereços do usuário
        listarEnderecos()
    }

    // inicializar UI da página (abas, modal, formulários)
    configurarNavegacao()
    configurarModal()
    configurarFormularios()
});

function carregarDadosUsuario(usuario) {
    // Preencher dados do usuário
    document.getElementById('userName').textContent = usuario.nome || 'Usuário';
    document.getElementById('nome').value = usuario.nome || '';
    document.getElementById('email').value = usuario.email || '';
    // não preencher senha por segurança; deixar campo em branco
    const senhaEl = document.getElementById('senha')
    if (senhaEl) senhaEl.value = ''
    document.getElementById('telefone').value = usuario.telefone || '';
}

function configurarNavegacao() {
    const botoesNavegacao = document.querySelectorAll('.nav-btn');
    const conteudosAba = document.querySelectorAll('.tab-content');

    botoesNavegacao.forEach(botao => {
        botao.addEventListener('click', function() {
            const abaAlvo = this.getAttribute('data-tab');
            console.log('Clicou na aba:', abaAlvo); // Debug
            
            // Remover classe active de todos
            botoesNavegacao.forEach(btn => btn.classList.remove('active'));
            conteudosAba.forEach(conteudo => conteudo.classList.remove('active'));
            
            // Adicionar classe active no botão e conteúdo selecionados
            this.classList.add('active');
            document.getElementById(abaAlvo).classList.add('active');
        });
    });
}

function configurarModal() {
    const modal = document.getElementById('addressModal');
    const btnAbrirModal = document.getElementById('addAddressBtn');
    const btnFecharModal = document.getElementById('closeModalBtn');
    const btnCancelarModal = document.getElementById('cancelModalBtn');

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => abrirModal());
    }
    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => fecharModal());
    }
    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', () => fecharModal());
    }

    // Fechar modal clicando fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }

    // Buscar CEP automaticamente
    const inputCEP = document.getElementById('cep');
    if (inputCEP) {
        inputCEP.addEventListener('blur', buscarCEP);
    }
}

function abrirModal() {
    const modal = document.getElementById('addressModal');
    const formulario = document.getElementById('addressForm');
    
    if (modal && formulario) {
        document.getElementById('modalTitle').textContent = 'Adicionar Endereço';
        formulario.reset();
        modal.classList.add('active');
    }
}

function fecharModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (!dados.erro) {
            document.getElementById('logradouro').value = dados.logradouro;
            document.getElementById('bairro').value = dados.bairro;
            document.getElementById('localidade').value = dados.localidade;
            document.getElementById('uf').value = dados.uf;
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

function configurarFormularios() {
    // Formulário de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarPerfil();
        });
    }

    // Formulário de senha
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alterarSenha();
        });
    }

    // Formulário de endereço
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarEndereco();
        });
    }
}

function salvarPerfil() {
    const nome = document.getElementById('nome').value.trim()
    const email = document.getElementById('email').value.trim()
    const telefone = document.getElementById('telefone').value.trim()

    ApiService.request('/usuario', {
        method: 'PUT',
        body: { nome, email, telefone }
    }).then(resp => {
        if (resp && resp.id) {
            const stored = Auth.getUser() || {}
            const novo = Object.assign({}, stored, { nome: resp.nome, email: resp.email, telefone: resp.telefone, id: resp.id })
            Auth.setAuth(localStorage.getItem('token'), novo)
            alert('Perfil atualizado com sucesso!')
        } else if (resp && resp.message) {
            alert(resp.message)
        } else {
            alert('Perfil atualizado com sucesso!')
        }
    }).catch(err => {
        console.error('Erro ao atualizar perfil', err)
        alert('Erro ao atualizar perfil: ' + (err.message || err))
    })
}

function alterarSenha() {
    const senhaAtual = document.getElementById('senhaAtual').value
    const novaSenha = document.getElementById('novaSenha').value
    const confirmar = document.getElementById('confirmarSenha').value

    if (!senhaAtual || !novaSenha || !confirmar) {
        return alert('Preencha todos os campos de senha')
    }
    if (novaSenha !== confirmar) return alert('A nova senha e a confirmação não coincidem')
    if (novaSenha.length < 6) return alert('A senha deve ter pelo menos 6 caracteres')

    ApiService.request('/usuario/senha', {
        method: 'PATCH',
        body: { senhaAtual, novaSenha }
    }).then(resp => {
        if (resp && resp.message) {
            alert(resp.message)
        } else {
            alert('Senha alterada com sucesso!')
        }
        document.getElementById('senhaAtual').value = ''
        document.getElementById('novaSenha').value = ''
        document.getElementById('confirmarSenha').value = ''
    }).catch(err => {
        console.error('Erro ao alterar senha', err)
        alert('Erro ao alterar senha: ' + (err.message || err))
    })
}

function salvarEndereco() {
    const form = document.getElementById('addressForm')
    const data = {
        cep: document.getElementById('cep').value.trim(),
        apelido: document.getElementById('apelido').value.trim(),
        logradouro: document.getElementById('logradouro').value.trim(),
        numero: document.getElementById('numero').value.trim(),
        complemento: document.getElementById('complemento').value.trim(),
        bairro: document.getElementById('bairro').value.trim(),
        localidade: document.getElementById('localidade').value.trim(),
        uf: document.getElementById('uf').value.trim(),
        is_principal: document.getElementById('is_principal').checked
    }

    ApiService.request('/endereco', {
        method: 'POST',
        body: data
    }).then(resp => {
        alert('Endereço salvo com sucesso!')
        fecharModal()
        listarEnderecos()
        form.reset()
    }).catch(err => {
        console.error('Erro ao salvar endereço', err)
        alert('Erro ao salvar endereço: ' + (err.message || err))
    })
}
 
async function listarEnderecos() {
    try {
        const dados = await ApiService.request('/endereco', { method: 'GET' })
        const container = document.getElementById('addressesList')
        if (!container) return

        if (!dados || dados.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>Nenhum endereço cadastrado</p><small>Clique em "Adicionar Endereço" para cadastrar seu primeiro endereço</small></div>`
            return
        }

        container.innerHTML = ''
        dados.forEach(addr => {
            const card = document.createElement('div')
            card.className = 'address-card'
            const addrId = addr.codEndereco || addr.id
            card.innerHTML = `
                <h4>${addr.apelido || 'Endereço' } ${addr.is_principal ? '(Principal)' : ''}</h4>
                <p>${addr.logradouro}, ${addr.numero} ${addr.complemento || ''}</p>
                <p>${addr.bairro} - ${addr.localidade}/${addr.uf}</p>
                <div class="address-actions">
                    ${addr.is_principal ? '' : `<button class="btn btn-outline set-principal" data-id="${addrId}">Definir como principal</button>`}
                    <button class="btn btn-danger delete-addr" data-id="${addrId}">Remover</button>
                </div>
            `
            container.appendChild(card)
        })

        // attach actions
        document.querySelectorAll('.set-principal').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                await ApiService.request(`/endereco/${id}/principal`, { method: 'PATCH' })
                listarEnderecos()
            })
        })

        document.querySelectorAll('.delete-addr').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                if (!confirm('Remover este endereço?')) return
                await ApiService.request(`/endereco/${id}`, { method: 'DELETE' })
                listarEnderecos()
            })
        })

    } catch (err) {
        console.error('Erro ao listar endereços', err)
    }
}
// logout handler is attached during DOMContentLoaded if button exists