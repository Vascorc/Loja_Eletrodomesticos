package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.dto.EstatisticasDTO;
import com.trabalho.sd.loja_online.dto.TopClienteDTO;
import com.trabalho.sd.loja_online.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EstatisticasService {

    @Autowired
    private VendaRepository vendaRepository;

    public EstatisticasDTO getEstatisticas() {
        EstatisticasDTO dto = new EstatisticasDTO();

        LocalDateTime now = LocalDateTime.now();
        
        // Dia
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);
        dto.setFaturadoDia(vendaRepository.sumValorFaturadoBetween(startOfDay, endOfDay));

        // Semana
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);
        dto.setFaturadoSemana(vendaRepository.sumValorFaturadoBetween(startOfWeek, endOfWeek));

        // Mês
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
        dto.setFaturadoMes(vendaRepository.sumValorFaturadoBetween(startOfMonth, endOfMonth));

        // Top Clientes
        List<Object[]> topClientesRows = vendaRepository.findTopClientes();
        List<TopClienteDTO> topClientes = new ArrayList<>();
        int count = 0;
        for (Object[] row : topClientesRows) {
            if (count >= 5) break; // Top 5
            String nome = (String) row[0];
            Double total = (Double) row[1];
            topClientes.add(new TopClienteDTO(nome, total));
            count++;
        }
        dto.setMelhoresClientes(topClientes);

        return dto;
    }
}
