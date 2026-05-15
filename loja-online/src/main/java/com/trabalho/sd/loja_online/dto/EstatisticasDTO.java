package com.trabalho.sd.loja_online.dto;

import lombok.Data;
import java.util.List;

@Data
public class EstatisticasDTO {
    private Double faturadoDia;
    private Double faturadoSemana;
    private Double faturadoMes;
    private List<TopClienteDTO> melhoresClientes;
}
