package com.trabalho.sd.loja_online.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoriaDTO {

    private Long id;
    private String nome;
    private Integer totalProdutos;
}