package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.dto.CategoriaDTO;
import com.trabalho.sd.loja_online.model.Categoria;
import com.trabalho.sd.loja_online.repository.CategoriaRepository;
import com.trabalho.sd.loja_online.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + id));
        return toDTO(categoria);
    }

    @Transactional
    public CategoriaDTO criar(CategoriaDTO dto) {
        if (categoriaRepository.findByNome(dto.getNome()).isPresent()) {
            throw new RuntimeException("Já existe uma categoria com o nome: " + dto.getNome());
        }
        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        return toDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaDTO atualizar(Long id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + id));

        categoriaRepository.findByNome(dto.getNome())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new RuntimeException("Já existe uma categoria com o nome: " + dto.getNome()); });

        categoria.setNome(dto.getNome());
        return toDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public void remover(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada com id: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    private CategoriaDTO toDTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNome(categoria.getNome());
        dto.setTotalProdutos(produtoRepository.findByCategoriaId(categoria.getId()).size());
        return dto;
    }
}
