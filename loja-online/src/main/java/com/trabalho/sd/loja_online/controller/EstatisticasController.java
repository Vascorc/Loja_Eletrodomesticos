package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.EstatisticasDTO;
import com.trabalho.sd.loja_online.service.EstatisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticasController {

    @Autowired
    private EstatisticasService estatisticasService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EstatisticasDTO getEstatisticas() {
        return estatisticasService.getEstatisticas();
    }
}
