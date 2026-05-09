package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByCategoriaId(Long categoriaId);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
