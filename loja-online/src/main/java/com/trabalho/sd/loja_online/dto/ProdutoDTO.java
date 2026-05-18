package com.trabalho.sd.loja_online.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProdutoDTO {

    private Long id;
    private String nome;
    private Double preco;
    private Integer stock;
    private String eficienciaEnergetica;
    private Long categoriaId;
    private String categoriaNome;
    private String imagemUrl;
}
