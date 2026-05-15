package com.trabalho.sd.loja_online.dto;

import lombok.Data;

@Data
public class ProdutoDTO {
    private Long id;
    private String nome;
    private Double preco;
    private Integer stock;
    private String eficienciaEnergetica;
    private String categoriaNome;
}
