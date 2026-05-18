-- Script para popular a base de dados com produtos de teste para a loja Electro-SD
-- As imagens são provenientes do Unsplash (livres de direitos) para o site ficar bonito!

INSERT INTO produto (nome, preco, stock, eficiencia_energetica, imagem_url, categoria_id) VALUES
('Frigorífico Combinado LG 341L', 649.99, 15, 'A', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 1),
('Máquina de Lavar Roupa Bosch 9kg', 429.00, 10, 'A', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 1),
('Máquina de Café Nespresso Essenza', 99.90, 40, 'B', 'https://images.unsplash.com/photo-1585515320310-259814833e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 2),
('Aspirador Robô iRobot Roomba', 299.00, 30, 'C', 'https://images.unsplash.com/photo-1589824781470-42287964b321?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 2),
('Smart TV Samsung 4K OLED 55"', 899.00, 20, 'G', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 3),
('Barra de Som Sony HT-S400', 199.99, 25, 'F', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 3),
('Portátil Apple MacBook Air M2', 1249.00, 10, NULL, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4),
('Monitor LG UltraGear 27" 144Hz', 249.50, 15, 'F', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4),
('Ar Condicionado Daikin 12000 BTU', 589.50, 8, 'A', 'https://images.unsplash.com/photo-1616422325350-13e6480b06b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 5),
('Ventilador de Torre Rowenta', 89.90, 45, 'B', 'https://images.unsplash.com/photo-1565514220359-5484da63f034?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 5),
('iPhone 15 Pro Max 256GB', 1469.00, 25, NULL, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 6),
('Secador de Cabelo Dyson Supersonic', 399.00, 12, 'B', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 7),
('Consola PlayStation 5 Slim', 449.99, 50, NULL, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 8),
('Comando Xbox Series X Wireless', 59.99, 80, NULL, 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 8);
