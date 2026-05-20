const BASE_URL = 'http://localhost:8080/api';

function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
}

export const vendaService = {
  listarTodas: async () => {
    const res = await fetch(`${BASE_URL}/vendas/historico/todos`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });
    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro || 'Erro ao carregar vendas');
    }
    return res.json();
  },
  listarMinhas: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${BASE_URL}/vendas/historico`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const erro = await res.text();
        throw new Error(erro || 'Erro ao carregar compras');
      }
      return res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },
};
