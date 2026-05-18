package com.trabalho.sd.loja_online.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequestDTO {
    private List<CartItemDTO> itens;
    private String metodoPagamento;
}
