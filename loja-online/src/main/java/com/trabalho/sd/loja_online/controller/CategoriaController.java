package com.trabalho.sd.loja_online.controller;

import com.trabalho.sd.loja_online.dto.CategoriaDTO;
import com.trabalho.sd.loja_online.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    // GET /api/categorias
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listar() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    // GET /api/categorias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    // POST /api/categorias  (apenas ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaDTO> criar(@RequestBody CategoriaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.criar(dto));
    }

    // PUT /api/categorias/{id}  (apenas ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaDTO> atualizar(
            @PathVariable Long id,
            @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.atualizar(id, dto));
    }

    // DELETE /api/categorias/{id}  (apenas ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        categoriaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
