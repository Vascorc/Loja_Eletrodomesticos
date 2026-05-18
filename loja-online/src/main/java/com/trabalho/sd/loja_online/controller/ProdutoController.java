package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.ProdutoDTO;
import com.trabalho.sd.loja_online.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // porta padrão do Vite
public class ProdutoController {

    private final ProdutoService produtoService;

    // GET /api/produtos
    // Retorna todos os produtos. Aceita filtro opcional por nome: /api/produtos?nome=samsung
    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> listar(
            @RequestParam(required = false) String nome) {

        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(produtoService.pesquisarPorNome(nome));
        }
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    // GET /api/produtos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    // GET /api/produtos/categoria/{categoriaId}
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProdutoDTO>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(produtoService.listarPorCategoria(categoriaId));
    }

    // POST /api/produtos  (apenas ADMIN — segurança a adicionar pelo colega)
    @PostMapping
    public ResponseEntity<ProdutoDTO> criar(@RequestBody ProdutoDTO dto) {
        ProdutoDTO criado = produtoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // PUT /api/produtos/{id}  (apenas ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody ProdutoDTO dto) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    // DELETE /api/produtos/{id}  (apenas ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        produtoService.remover(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/produtos/{id}/stock?quantidade=5
    // Endpoint para o colega das vendas chamar quando uma venda é concluída
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Void> atualizarStock(
            @PathVariable Long id,
            @RequestParam int quantidade) {
        produtoService.atualizarStock(id, quantidade);
        return ResponseEntity.ok().build();
    }
}