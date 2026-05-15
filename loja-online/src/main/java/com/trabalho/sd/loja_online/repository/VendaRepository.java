package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByUtilizadorIdOrderByDataVendaDesc(Long utilizadorId);
    List<Venda> findByDataVendaBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(v.valorTotal), 0) FROM Venda v WHERE v.dataVenda >= :startDate AND v.dataVenda <= :endDate")
    Double sumValorFaturadoBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT v.utilizador.nome, SUM(v.valorTotal) as total FROM Venda v GROUP BY v.utilizador.id, v.utilizador.nome ORDER BY total DESC")
    List<Object[]> findTopClientes();
}
