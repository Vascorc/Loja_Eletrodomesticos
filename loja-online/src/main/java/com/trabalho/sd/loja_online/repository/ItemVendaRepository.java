package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.ItemVenda;
import com.trabalho.sd.loja_online.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
    List<ItemVenda> findByVendaId(Long vendaId);

    @Query("SELECT iv.produto FROM ItemVenda iv GROUP BY iv.produto ORDER BY SUM(iv.quantidade) DESC LIMIT :limit")
    List<Produto> findTopProdutosMaisVendidos(@Param("limit") int limit);
}
