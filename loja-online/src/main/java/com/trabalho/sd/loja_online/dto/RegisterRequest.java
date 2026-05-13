package com.trabalho.sd.loja_online.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String nome;
    private String email;
    private String password;
    private String perfil; // por defeito é CLIENTE
}
