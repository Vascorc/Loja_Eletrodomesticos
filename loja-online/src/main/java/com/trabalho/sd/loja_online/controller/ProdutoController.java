package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.ProdutoDTO;
import com.trabalho.sd.loja_online.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<ProdutoDTO> getProdutos() {
        return produtoService.listarProdutos();
    }
}
