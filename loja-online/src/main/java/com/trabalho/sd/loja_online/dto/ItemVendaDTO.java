package com.trabalho.sd.loja_online.dto;

import lombok.Data;

@Data
public class ItemVendaDTO {
    private String produtoNome;
    private Integer quantidade;
    private Double precoUnitario;
}
