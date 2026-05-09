package com.trabalho.sd.loja_online;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class LojaOnlineApplication {

	public static void main(String[] args) {

		// Carrega o .env manualmente e injeta nas propriedades do sistema
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(LojaOnlineApplication.class, args);
	}

}
