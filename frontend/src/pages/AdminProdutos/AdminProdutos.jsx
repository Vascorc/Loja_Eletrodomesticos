import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtoService, categoriaService } from '../../services/produtoService';
import './AdminProdutos.css';

const FORM_VAZIO = {
  nome: '',
  preco: '',
  stock: '',
  eficienciaEnergetica: 'A',
  categoriaId: '',
  imagemUrl: '',
};

const EFICIENCIAS = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'];

const AdminProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const carregar = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        produtoService.listarTodos(),
        categoriaService.listarTodas(),
      ]);
      setProdutos(prods);
      setCategorias(cats);
    } catch {
      setErro('Erro ao carregar dados. Verifique se o servidor está ativo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => {
    setFormData(FORM_VAZIO);
    setEditandoId(null);
    setErro('');
    setModalAberto(true);
  };

  const abrirEditar = (produto) => {
    setFormData({
      nome: produto.nome,
      preco: produto.preco,
      stock: produto.stock,
      eficienciaEnergetica: produto.eficienciaEnergetica || 'A',
      categoriaId: produto.categoriaId,
      imagemUrl: produto.imagemUrl || '',
    });
    setEditandoId(produto.id);
    setErro('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFormData(FORM_VAZIO);
    setEditandoId(null);
    setErro('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErro('');
    try {
      const dto = {
        ...formData,
        preco: parseFloat(formData.preco),
        stock: parseInt(formData.stock, 10),
        categoriaId: parseInt(formData.categoriaId, 10),
      };
      if (editandoId) {
        await produtoService.atualizar(editandoId, dto);
      } else {
        await produtoService.criar(dto);
      }
      fecharModal();
      carregar();
    } catch (err) {
      setErro(err.message || 'Erro ao guardar produto.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (produto) => {
    if (!window.confirm(`Eliminar "${produto.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await produtoService.remover(produto.id);
      carregar();
    } catch (err) {
      alert(err.message || 'Erro ao eliminar produto.');
    }
  };

  return (
    <div className="admin-page">
      <main className="admin-main">

        <div className="admin-header">
          <div className="admin-header-text">
            <h1>Gestão de Produtos</h1>
            <p>{produtos.length} produto{produtos.length !== 1 ? 's' : ''} no catálogo</p>
          </div>
          <button className="btn-novo" onClick={abrirNovo}>+ Novo Produto</button>
        </div>

        <div className="admin-subheader">
          <button className="btn-secondary" onClick={() => navigate('/admin/vendas')}>
            Ver todas as vendas
          </button>
        </div>

        {loading ? (
          <div className="admin-estado">
            <div className="spinner"></div>
            <p>A carregar...</p>
          </div>
        ) : erro && !modalAberto ? (
          <div className="admin-estado erro-msg">{erro}</div>
        ) : (
          <div className="table-container">
            <table className="produtos-table">
              <thead>
                <tr>
                  <th>Img</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Stock</th>
                  <th>Eficiência</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="td-vazio">Nenhum produto encontrado.</td>
                  </tr>
                ) : (
                  produtos.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.imagemUrl ? (
                          <img src={p.imagemUrl} alt={p.nome} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                        ) : (
                          <div style={{width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b'}}>N/A</div>
                        )}
                      </td>
                      <td className="td-nome">{p.nome}</td>
                      <td><span className="tag-categoria">{p.categoriaNome}</span></td>
                      <td className="td-preco">
                        {p.preco?.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className={p.stock === 0 ? 'td-semstock' : p.stock <= 5 ? 'td-stockbaixo' : ''}>
                        {p.stock}
                      </td>
                      <td>
                        <span className="badge-eficiencia">{p.eficienciaEnergetica || '—'}</span>
                      </td>
                      <td className="td-acoes">
                        <button className="btn-editar" onClick={() => abrirEditar(p)}>Editar</button>
                        <button className="btn-eliminar" onClick={() => handleEliminar(p)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editandoId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button className="btn-fechar" onClick={fecharModal}>&#10005;</button>
            </div>

            <form className="modal-form" onSubmit={handleGuardar}>
              {erro && <div className="form-erro">{erro}</div>}

              <div className="input-group">
                <label htmlFor="nome">Nome do Produto</label>
                <input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Máquina de Lavar Samsung 8kg"
                />
              </div>

              <div className="input-group">
                <label htmlFor="imagemUrl">URL da Imagem (Link)</label>
                <input
                  id="imagemUrl"
                  name="imagemUrl"
                  value={formData.imagemUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.png (Opcional)"
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="preco">Preço (€)</label>
                  <input
                    id="preco"
                    name="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="eficienciaEnergetica">Eficiência Energética</label>
                  <select
                    id="eficienciaEnergetica"
                    name="eficienciaEnergetica"
                    value={formData.eficienciaEnergetica}
                    onChange={handleChange}
                  >
                    {EFICIENCIAS.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="categoriaId">Categoria</label>
                  <select
                    id="categoriaId"
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar" disabled={guardando}>
                  {guardando ? 'A guardar...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProdutos;
