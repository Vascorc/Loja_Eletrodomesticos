import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Fatura.css';

const Fatura = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [fatura, setFatura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const faturaId = location.state?.faturaId;

    useEffect(() => {
        if (!faturaId) {
            navigate('/catalogo');
            return;
        }

        fetch(`http://localhost:8080/api/vendas/${faturaId}/fatura`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Falha ao obter fatura');
                return res.json();
            })
            .then(data => {
                setFatura(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [faturaId, navigate]);

    if (loading) return <div className="fatura-container">A carregar fatura...</div>;
    if (error) return <div className="fatura-container error">{error}</div>;
    if (!fatura) return null;

    return (
        <div className="fatura-container">
            <div className="fatura-card">
                <div className="fatura-header">
                    <h2>Fatura / Recibo</h2>
                    <p>Loja de Eletrodomésticos</p>
                </div>

                <div className="fatura-info">
                    <p><strong>Nº da Venda:</strong> #{fatura.id}</p>
                    <p><strong>Data:</strong> {new Date(fatura.dataVenda).toLocaleString()}</p>
                </div>

                <table className="fatura-table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Preço Unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fatura.itens.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.produtoNome}</td>
                                <td>{item.quantidade}</td>
                                <td>{item.precoUnitario.toFixed(2)} €</td>
                                <td>{(item.quantidade * item.precoUnitario).toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fatura-total">
                    <h3>Total Pago: {fatura.valorTotal.toFixed(2)} €</h3>
                </div>

                <div className="fatura-actions">
                    <button onClick={() => window.print()} className="btn-print">Imprimir Fatura</button>
                    <button onClick={() => navigate('/minha-conta')} className="btn-back">Ver Histórico</button>
                </div>
            </div>
        </div>
    );
};

export default Fatura;
