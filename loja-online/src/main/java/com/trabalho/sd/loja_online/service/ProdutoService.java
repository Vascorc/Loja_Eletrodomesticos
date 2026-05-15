package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.dto.ProdutoDTO;
import com.trabalho.sd.loja_online.model.Produto;
import com.trabalho.sd.loja_online.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoDTO> listarProdutos() {
        return produtoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ProdutoDTO toDTO(Produto p) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(p.getId());
        dto.setNome(p.getNome());
        dto.setPreco(p.getPreco());
        dto.setStock(p.getStock());
        dto.setEficienciaEnergetica(p.getEficienciaEnergetica());
        if (p.getCategoria() != null) {
            dto.setCategoriaNome(p.getCategoria().getNome());
        }
        return dto;
    }
}
