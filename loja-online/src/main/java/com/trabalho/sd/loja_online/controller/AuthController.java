package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.AuthRequest;
import com.trabalho.sd.loja_online.dto.AuthResponse;
import com.trabalho.sd.loja_online.dto.RegisterRequest;
import com.trabalho.sd.loja_online.model.Utilizador;
import com.trabalho.sd.loja_online.repository.UtilizadorRepository;
import com.trabalho.sd.loja_online.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UtilizadorRepository utilizadorRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Utilizador userDetails = (Utilizador) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(jwt,
                userDetails.getId(),
                userDetails.getNome(),
                userDetails.getEmail(),
                userDetails.getPerfil()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (utilizadorRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro: Email já está em uso!");
        }

        // Criar novo utilizador
        Utilizador user = new Utilizador();
        user.setNome(signUpRequest.getNome());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        // Se não for especificado perfil, assume CLIENTE
        String strPerfil = signUpRequest.getPerfil();
        if (strPerfil == null || strPerfil.isEmpty()) {
            user.setPerfil("CLIENTE");
        } else {
            user.setPerfil(strPerfil.toUpperCase());
        }

        utilizadorRepository.save(user);

        return ResponseEntity.ok("Utilizador registado com sucesso!");
    }
}
