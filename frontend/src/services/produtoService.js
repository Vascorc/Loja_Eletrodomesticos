// Serviço que centraliza todas as chamadas à API de produtos e categorias
// Usar em qualquer componente: import { produtoService, categoriaService } from '../services/produtoService'

const BASE_URL = 'http://localhost:8080/api';

function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}

// ── Produtos ──────────────────────────────────────────────────────────────────

export const produtoService = {

  listarTodos: async () => {
    const res = await fetch(`${BASE_URL}/produtos`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao carregar produtos');
    return res.json();
  },

  pesquisar: async (nome) => {
    const res = await fetch(`${BASE_URL}/produtos?nome=${encodeURIComponent(nome)}`);
    if (!res.ok) throw new Error('Erro na pesquisa');
    return res.json();
  },

  buscarPorId: async (id) => {
    const res = await fetch(`${BASE_URL}/produtos/${id}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    return res.json();
  },

  listarPorCategoria: async (categoriaId) => {
    const res = await fetch(`${BASE_URL}/produtos/categoria/${categoriaId}`);
    if (!res.ok) throw new Error('Erro ao carregar produtos da categoria');
    return res.json();
  },

  criar: async (dto) => {
    const res = await fetch(`${BASE_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || 'Erro ao criar produto');
    }
    return res.json();
  },

  atualizar: async (id, dto) => {
    const res = await fetch(`${BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || 'Erro ao atualizar produto');
    }
    return res.json();
  },

  remover: async (id) => {
    const res = await fetch(`${BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (!res.ok) throw new Error('Erro ao remover produto');
  },

  // Chamado pelo módulo de vendas após uma compra
  atualizarStock: async (id, quantidade) => {
    const res = await fetch(`${BASE_URL}/produtos/${id}/stock?quantidade=${quantidade}`, {
      method: 'PATCH',
      headers: authHeader(),
    });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || 'Erro ao atualizar stock');
    }
  },
};

// ── Categorias ────────────────────────────────────────────────────────────────

export const categoriaService = {

  listarTodas: async () => {
    const res = await fetch(`${BASE_URL}/categorias`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao carregar categorias');
    return res.json();
  },

  buscarPorId: async (id) => {
    const res = await fetch(`${BASE_URL}/categorias/${id}`);
    if (!res.ok) throw new Error('Categoria não encontrada');
    return res.json();
  },

  criar: async (dto) => {
    const res = await fetch(`${BASE_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || 'Erro ao criar categoria');
    }
    return res.json();
  },

  atualizar: async (id, dto) => {
    const res = await fetch(`${BASE_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || 'Erro ao atualizar categoria');
    }
    return res.json();
  },

  remover: async (id) => {
    const res = await fetch(`${BASE_URL}/categorias/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (!res.ok) throw new Error('Erro ao remover categoria');
  },
};
