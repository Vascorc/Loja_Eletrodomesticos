package com.trabalho.sd.loja_online.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProdutoVendasDTO {
    private String nome;
    private Long totalVendido;
}
