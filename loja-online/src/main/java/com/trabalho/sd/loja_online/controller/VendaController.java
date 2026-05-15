package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.CheckoutRequestDTO;
import com.trabalho.sd.loja_online.dto.VendaDTO;
import com.trabalho.sd.loja_online.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping("/checkout")
    public VendaDTO checkout(@RequestBody CheckoutRequestDTO request, Authentication authentication) {
        return vendaService.checkout(authentication.getName(), request);
    }

    @GetMapping("/historico")
    public List<VendaDTO> getHistorico(Authentication authentication) {
        return vendaService.getHistorico(authentication.getName());
    }

    @GetMapping("/{id}/fatura")
    public VendaDTO getFatura(@PathVariable Long id, Authentication authentication) {
        return vendaService.getFatura(id, authentication.getName());
    }
}
