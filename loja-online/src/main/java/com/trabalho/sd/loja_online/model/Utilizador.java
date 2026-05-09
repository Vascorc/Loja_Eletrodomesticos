package com.trabalho.sd.loja_online.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilizador")
@Getter
@Setter
@NoArgsConstructor
public class Utilizador implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String perfil; // Ex: "CLIENTE", "ADMIN"

    @OneToMany(mappedBy = "utilizador", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();
}
