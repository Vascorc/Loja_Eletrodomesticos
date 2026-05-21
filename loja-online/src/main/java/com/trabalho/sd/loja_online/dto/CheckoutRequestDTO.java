package com.trabalho.sd.loja_online.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequestDTO {
    private List<CartItemDTO> itens;
    private String metodoPagamento;
    private String nomeDestinatario;
    private String morada;
    private String cidade;
    private String codigoPostal;
    private String telefone;
}
