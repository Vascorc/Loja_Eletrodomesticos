package com.trabalho.sd.loja_online.repository;

import com.trabalho.sd.loja_online.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByCategoriaId(Long categoriaId);
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Produto p WHERE p.id = :id")
    Optional<Produto> findByIdWithPessimisticLock(@Param("id") Long id);
}
