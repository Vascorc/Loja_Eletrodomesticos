package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carrinho")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CarrinhoController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/reservar/{produtoId}")
    public ResponseEntity<?> reservarProduto(@PathVariable Long produtoId, @RequestBody Map<String, Integer> payload, Authentication authentication) {
        try {
            int quantidade = payload.getOrDefault("quantidade", 1);
            String userEmail = authentication.getName();
            
            reservaService.reservarProduto(produtoId, quantidade, userEmail);
            return ResponseEntity.ok().body(Map.of("message", "Produto reservado com sucesso por 5 minutos."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/libertar/{produtoId}")
    public ResponseEntity<?> libertarReserva(@PathVariable Long produtoId, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            reservaService.libertarReserva(produtoId, userEmail);
            return ResponseEntity.ok().body(Map.of("message", "Reserva libertada com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
