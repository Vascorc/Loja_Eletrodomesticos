package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    // Encontrar reservas de um utilizador específico para um produto específico
    Optional<Reserva> findByUtilizadorIdAndProdutoId(Long utilizadorId, Long produtoId);
    
    // Listar todas as reservas de um utilizador
    List<Reserva> findByUtilizadorId(Long utilizadorId);
    
    // Encontrar reservas que já expiraram
    List<Reserva> findByDataExpiracaoBefore(LocalDateTime data);
}
