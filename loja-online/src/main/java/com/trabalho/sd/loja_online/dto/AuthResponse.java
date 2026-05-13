package com.trabalho.sd.loja_online.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String nome;
    private String email;
    private String perfil;

    public AuthResponse(String token, Long id, String nome, String email, String perfil) {
        this.token = token;
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
    }
}
