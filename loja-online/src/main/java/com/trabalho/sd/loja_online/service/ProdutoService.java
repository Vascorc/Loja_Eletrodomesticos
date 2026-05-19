package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.dto.ProdutoDTO;
import com.trabalho.sd.loja_online.model.Categoria;
import com.trabalho.sd.loja_online.model.Produto;
import com.trabalho.sd.loja_online.repository.CategoriaRepository;
import com.trabalho.sd.loja_online.repository.ItemVendaRepository;
import com.trabalho.sd.loja_online.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ItemVendaRepository itemVendaRepository;

    // ── Listar todos ──────────────────────────────────────────────────────────

    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Buscar por ID ─────────────────────────────────────────────────────────

    public ProdutoDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));
        return toDTO(produto);
    }

    // ── Pesquisar por nome ────────────────────────────────────────────────────

    public List<ProdutoDTO> pesquisarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Listar por categoria ──────────────────────────────────────────────────

    public List<ProdutoDTO> listarPorCategoria(Long categoriaId) {
        return produtoRepository.findByCategoriaId(categoriaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Top 5 mais vendidos ───────────────────────────────────────────────────

    public List<ProdutoDTO> listarMaisVendidos() {
        List<Produto> maisVendidos = itemVendaRepository.findTopProdutosMaisVendidos(5);
        if (maisVendidos.size() < 5) {
            List<Produto> todos = produtoRepository.findAll();
            for (Produto p : todos) {
                if (maisVendidos.stream().noneMatch(mv -> mv.getId().equals(p.getId()))) {
                    maisVendidos.add(p);
                }
                if (maisVendidos.size() == 5) break;
            }
        }
        return maisVendidos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Criar produto ─────────────────────────────────────────────────────────

    @Transactional
    public ProdutoDTO criar(ProdutoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + dto.getCategoriaId()));

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setPreco(dto.getPreco());
        produto.setStock(dto.getStock());
        produto.setEficienciaEnergetica(dto.getEficienciaEnergetica());
        produto.setImagemUrl(dto.getImagemUrl());
        produto.setCategoria(categoria);

        return toDTO(produtoRepository.save(produto));
    }

    // ── Editar produto ────────────────────────────────────────────────────────

    @Transactional
    public ProdutoDTO atualizar(Long id, ProdutoDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + dto.getCategoriaId()));

        produto.setNome(dto.getNome());
        produto.setPreco(dto.getPreco());
        produto.setStock(dto.getStock());
        produto.setEficienciaEnergetica(dto.getEficienciaEnergetica());
        produto.setImagemUrl(dto.getImagemUrl());
        produto.setCategoria(categoria);

        return toDTO(produtoRepository.save(produto));
    }

    // ── Remover produto ───────────────────────────────────────────────────────

    @Transactional
    public void remover(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
        produtoRepository.deleteById(id);
    }

    // ── Atualizar stock (chamado após uma venda) ───────────────────────────────

    @Transactional
    public void atualizarStock(Long produtoId, int quantidadeVendida) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + produtoId));

        int novoStock = produto.getStock() - quantidadeVendida;
        if (novoStock < 0) {
            throw new RuntimeException("Stock insuficiente para o produto: " + produto.getNome());
        }
        produto.setStock(novoStock);
        produtoRepository.save(produto);
    }

    // ── Conversão entidade → DTO ──────────────────────────────────────────────

    private ProdutoDTO toDTO(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setPreco(produto.getPreco());
        dto.setStock(produto.getStock());
        dto.setEficienciaEnergetica(produto.getEficienciaEnergetica());
        dto.setImagemUrl(produto.getImagemUrl());
        if (produto.getCategoria() != null) {
            dto.setCategoriaId(produto.getCategoria().getId());
            dto.setCategoriaNome(produto.getCategoria().getNome());
        }
        return dto;
    }
}
