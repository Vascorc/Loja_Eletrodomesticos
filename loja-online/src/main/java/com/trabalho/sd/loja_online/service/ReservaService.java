package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.model.Produto;
import com.trabalho.sd.loja_online.model.Reserva;
import com.trabalho.sd.loja_online.model.Utilizador;
import com.trabalho.sd.loja_online.repository.ProdutoRepository;
import com.trabalho.sd.loja_online.repository.ReservaRepository;
import com.trabalho.sd.loja_online.repository.UtilizadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Transactional
    public Reserva reservarProduto(Long produtoId, int quantidade, String userEmail) {
        Utilizador utilizador = utilizadorRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        Produto produto = produtoRepository.findByIdWithPessimisticLock(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (produto.getStock() < quantidade) {
            throw new RuntimeException("Stock indisponível para o produto: " + produto.getNome());
        }

        // Deduzir o stock temporariamente
        produto.setStock(produto.getStock() - quantidade);
        produtoRepository.save(produto);

        // Verificar se já existe reserva para este produto/utilizador e atualizar, ou criar nova
        Optional<Reserva> reservaExistente = reservaRepository.findByUtilizadorIdAndProdutoId(utilizador.getId(), produtoId);
        Reserva reserva;

        if (reservaExistente.isPresent()) {
            reserva = reservaExistente.get();
            reserva.setQuantidade(reserva.getQuantidade() + quantidade);
            reserva.setDataExpiracao(LocalDateTime.now().plusMinutes(5));
        } else {
            reserva = new Reserva(produto, utilizador, quantidade, LocalDateTime.now().plusMinutes(5));
        }

        return reservaRepository.save(reserva);
    }

    @Transactional
    public void libertarReserva(Long produtoId, String userEmail) {
        Utilizador utilizador = utilizadorRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        Optional<Reserva> reservaOpt = reservaRepository.findByUtilizadorIdAndProdutoId(utilizador.getId(), produtoId);
        
        if (reservaOpt.isPresent()) {
            Reserva reserva = reservaOpt.get();
            Produto produto = produtoRepository.findByIdWithPessimisticLock(produtoId)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            
            // Restaurar o stock
            produto.setStock(produto.getStock() + reserva.getQuantidade());
            produtoRepository.save(produto);
            
            // Apagar a reserva
            reservaRepository.delete(reserva);
        }
    }

    @Transactional
    public void limparReservasExpiradas() {
        var expiradas = reservaRepository.findByDataExpiracaoBefore(LocalDateTime.now());
        for (Reserva reserva : expiradas) {
            try {
                Produto produto = produtoRepository.findByIdWithPessimisticLock(reserva.getProduto().getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
                
                // Restaurar stock
                produto.setStock(produto.getStock() + reserva.getQuantidade());
                produtoRepository.save(produto);
                
                // Apagar reserva
                reservaRepository.delete(reserva);
                System.out.println("Reserva expirada limpa para o produto: " + produto.getNome());
            } catch (Exception e) {
                System.err.println("Erro ao limpar reserva expirada: " + e.getMessage());
            }
        }
    }
}
