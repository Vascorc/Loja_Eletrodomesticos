package com.trabalho.sd.loja_online.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VendaDTO {
    private Long id;
    private LocalDateTime dataVenda;
    private Double valorTotal;
    private List<ItemVendaDTO> itens;
    private String clienteNome;
    private String clienteEmail;
    private String metodoPagamento;
    private String nomeDestinatario;
    private String morada;
    private String cidade;
    private String codigoPostal;
    private String telefone;
}
