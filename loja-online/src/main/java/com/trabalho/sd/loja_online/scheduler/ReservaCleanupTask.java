package com.trabalho.sd.loja_online.scheduler;

import com.trabalho.sd.loja_online.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReservaCleanupTask {

    @Autowired
    private ReservaService reservaService;

    // Executa a cada 60 segundos (60000 ms)
    @Scheduled(fixedRate = 60000)
    public void limparReservas() {
        reservaService.limparReservasExpiradas();
    }
}
