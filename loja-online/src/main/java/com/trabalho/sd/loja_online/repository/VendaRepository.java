package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByUtilizadorId(Long utilizadorId);
    List<Venda> findByDataVendaBetween(LocalDateTime startDate, LocalDateTime endDate);
}
