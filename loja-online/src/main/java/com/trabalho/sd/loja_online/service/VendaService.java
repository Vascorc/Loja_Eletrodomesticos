package com.trabalho.sd.loja_online.service;

import com.trabalho.sd.loja_online.dto.CartItemDTO;
import com.trabalho.sd.loja_online.dto.CheckoutRequestDTO;
import com.trabalho.sd.loja_online.dto.ItemVendaDTO;
import com.trabalho.sd.loja_online.dto.VendaDTO;
import com.trabalho.sd.loja_online.model.ItemVenda;
import com.trabalho.sd.loja_online.model.Produto;
import com.trabalho.sd.loja_online.model.Utilizador;
import com.trabalho.sd.loja_online.model.Venda;
import com.trabalho.sd.loja_online.repository.ProdutoRepository;
import com.trabalho.sd.loja_online.repository.ReservaRepository;
import com.trabalho.sd.loja_online.repository.UtilizadorRepository;
import com.trabalho.sd.loja_online.repository.VendaRepository;
import com.trabalho.sd.loja_online.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private UtilizadorRepository utilizadorRepository;
    @Autowired
    private ReservaRepository reservaRepository;

    @Transactional
    public VendaDTO checkout(String userEmail, CheckoutRequestDTO request) {
        Utilizador utilizador = utilizadorRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        Venda venda = new Venda();
        venda.setUtilizador(utilizador);
        venda.setDataVenda(LocalDateTime.now());
        
        double valorTotal = 0.0;
        List<ItemVenda> itensVenda = new ArrayList<>();

        for (CartItemDTO cartItem : request.getItens()) {
            Produto produto = produtoRepository.findByIdWithPessimisticLock(cartItem.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            Optional<Reserva> reservaOpt = reservaRepository.findByUtilizadorIdAndProdutoId(utilizador.getId(), produto.getId());
            
            if (reservaOpt.isPresent()) {
                Reserva reserva = reservaOpt.get();
                if (reserva.getQuantidade() >= cartItem.getQuantidade()) {
                    // Tem reserva suficiente. Consumir reserva.
                    if (reserva.getQuantidade() == cartItem.getQuantidade()) {
                        reservaRepository.delete(reserva);
                    } else {
                        reserva.setQuantidade(reserva.getQuantidade() - cartItem.getQuantidade());
                        reservaRepository.save(reserva);
                    }
                    // NOTA: O stock não é deduzido do Produto aqui, pois já foi deduzido no momento da reserva!
                } else {
                    // Reserva insuficiente, tenta tirar o restante do stock
                    int restante = cartItem.getQuantidade() - reserva.getQuantidade();
                    if (produto.getStock() < restante) {
                        throw new RuntimeException("Stock indisponível para o produto: " + produto.getNome());
                    }
                    produto.setStock(produto.getStock() - restante);
                    produtoRepository.save(produto);
                    reservaRepository.delete(reserva);
                }
            } else {
                // Sem reserva (fallback). Tenta comprar direto do stock disponível.
                if (produto.getStock() < cartItem.getQuantidade()) {
                    throw new RuntimeException("A reserva expirou e já não há stock disponível para: " + produto.getNome());
                }
                produto.setStock(produto.getStock() - cartItem.getQuantidade());
                produtoRepository.save(produto);
            }

            ItemVenda item = new ItemVenda();
            item.setVenda(venda);
            item.setProduto(produto);
            item.setQuantidade(cartItem.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());

            valorTotal += produto.getPreco() * cartItem.getQuantidade();
            itensVenda.add(item);
        }

        venda.setValorTotal(valorTotal);
        venda.setItens(itensVenda);

        Venda savedVenda = vendaRepository.save(venda);
        return toDTO(savedVenda);
    }

    public List<VendaDTO> getHistorico(String userEmail) {
        Utilizador utilizador = utilizadorRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        return vendaRepository.findByUtilizadorIdOrderByDataVendaDesc(utilizador.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public VendaDTO getFatura(Long idVenda, String userEmail) {
        Venda venda = vendaRepository.findById(idVenda)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        if (!venda.getUtilizador().getEmail().equals(userEmail)) {
            throw new RuntimeException("Acesso negado");
        }

        return toDTO(venda);
    }

    private VendaDTO toDTO(Venda venda) {
        VendaDTO dto = new VendaDTO();
        dto.setId(venda.getId());
        dto.setDataVenda(venda.getDataVenda());
        dto.setValorTotal(venda.getValorTotal());
        dto.setItens(venda.getItens().stream().map(this::toItemDTO).collect(Collectors.toList()));
        return dto;
    }

    private ItemVendaDTO toItemDTO(ItemVenda item) {
        ItemVendaDTO dto = new ItemVendaDTO();
        dto.setProdutoNome(item.getProduto().getNome());
        dto.setQuantidade(item.getQuantidade());
        dto.setPrecoUnitario(item.getPrecoUnitario());
        return dto;
    }
}
