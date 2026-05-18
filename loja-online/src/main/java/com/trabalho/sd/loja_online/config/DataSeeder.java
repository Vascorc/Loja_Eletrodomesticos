package com.trabalho.sd.loja_online.config;

import com.trabalho.sd.loja_online.model.Categoria;
import com.trabalho.sd.loja_online.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() == 0) {
            List<String> nomes = Arrays.asList(
                    "Grandes Eletrodomésticos",
                    "Pequenos Eletrodomésticos",
                    "Imagem e Som",
                    "Informática",
                    "Climatização",
                    "Smartphones e Comunicações",
                    "Cuidados Pessoais",
                    "Gaming"
            );
            
            List<Categoria> categorias = nomes.stream().map(nome -> {
                Categoria c = new Categoria();
                c.setNome(nome);
                return c;
            }).toList();
            categoriaRepository.saveAll(categorias);
            System.out.println("Categorias iniciais inseridas na base de dados com sucesso!");
        }
    }
}
