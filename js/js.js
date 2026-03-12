// ===== MEMORIAL DO CONVENTO — Motor de Navegação =====

document.addEventListener("DOMContentLoaded", () => {
    const paginas = document.querySelectorAll(".pagina");
    const indicadoresContainer = document.querySelector(".indicadores");
    const barraProgresso = document.querySelector(".barra-progresso");
    let paginaAtual = 0;
    let pontuacao = 0;
    let totalPerguntas = 0;

    // Contar perguntas
    paginas.forEach(p => {
        if (p.querySelector(".pergunta-container")) totalPerguntas++;
    });

    // Criar indicadores de página
    paginas.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.classList.add("indicador");
        if (i === 0) dot.classList.add("ativo");
        indicadoresContainer.appendChild(dot);
    });

    function irParaPagina(indice) {
        if (indice < 0 || indice >= paginas.length) return;
        paginas[paginaAtual].classList.remove("ativa");
        paginaAtual = indice;
        paginas[paginaAtual].classList.add("ativa");
        atualizarIndicadores();
        atualizarProgresso();
    }

    function proximaPagina() {
        irParaPagina(paginaAtual + 1);
    }

    function atualizarIndicadores() {
        const dots = indicadoresContainer.querySelectorAll(".indicador");
        dots.forEach((d, i) => {
            d.classList.toggle("ativo", i === paginaAtual);
        });
    }

    function atualizarProgresso() {
        const percentagem = ((paginaAtual) / (paginas.length - 1)) * 100;
        barraProgresso.style.width = percentagem + "%";
    }

    // ===== Botão "Começar" =====
    document.querySelectorAll(".btn-comecar").forEach(btn => {
        btn.addEventListener("click", () => proximaPagina());
    });

    // ===== Hotspots nas imagens (SVG) =====
    document.querySelectorAll(".hotspot").forEach(hotspot => {
        hotspot.addEventListener("click", () => {
            // Animação de feedback visual
            const container = hotspot.closest(".imagem-container");
            const dica = container.querySelector(".hotspot-dica");
            if (dica) {
                dica.style.animation = "none";
                dica.style.opacity = "0";
            }
            // Pequeno delay para feedback visual antes de avançar
            container.style.transition = "transform 0.3s, opacity 0.3s";
            container.style.transform = "scale(1.02)";
            container.style.opacity = "0.8";
            setTimeout(() => {
                container.style.transform = "";
                container.style.opacity = "";
                proximaPagina();
            }, 400);
        });
    });

    // ===== Perguntas de escolha múltipla =====
    document.querySelectorAll(".pergunta-container").forEach(container => {
        const opcoes = container.querySelectorAll(".opcao");
        const feedback = container.querySelector(".feedback");
        const btnContinuar = container.querySelector(".btn-continuar");
        let respondida = false;

        opcoes.forEach(opcao => {
            opcao.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;

                const correta = opcao.dataset.correta === "true";

                // Desativar todas as opções
                opcoes.forEach(o => {
                    o.disabled = true;
                    if (o.dataset.correta === "true") {
                        o.classList.add("correta");
                    }
                });

                if (correta) {
                    opcao.classList.add("correta");
                    feedback.textContent = "Correto! 🎉";
                    feedback.className = "feedback correto";
                    pontuacao++;
                } else {
                    opcao.classList.add("errada");
                    feedback.textContent = "Não é bem isso... Vê a resposta correta.";
                    feedback.className = "feedback incorreto";
                }

                // Mostrar botão continuar
                if (btnContinuar) {
                    btnContinuar.classList.add("visivel");
                }
            });
        });

        if (btnContinuar) {
            btnContinuar.addEventListener("click", () => proximaPagina());
        }
    });

    // ===== Botão recomeçar =====
    document.querySelectorAll(".btn-recomecar").forEach(btn => {
        btn.addEventListener("click", () => {
            // Reset perguntas
            document.querySelectorAll(".pergunta-container").forEach(container => {
                const opcoes = container.querySelectorAll(".opcao");
                const feedback = container.querySelector(".feedback");
                const btnCont = container.querySelector(".btn-continuar");
                opcoes.forEach(o => {
                    o.disabled = false;
                    o.classList.remove("correta", "errada");
                });
                if (feedback) {
                    feedback.textContent = "";
                    feedback.className = "feedback";
                }
                if (btnCont) btnCont.classList.remove("visivel");
            });
            // Reset hotspot dicas
            document.querySelectorAll(".hotspot-dica").forEach(d => {
                d.style.animation = "";
                d.style.opacity = "";
            });
            pontuacao = 0;
            irParaPagina(0);
        });
    });

    // ===== Mostrar resultado final =====
    function mostrarResultado() {
        const elResultado = document.querySelector(".resultado");
        if (elResultado && totalPerguntas > 0) {
            elResultado.textContent = `Acertaste ${pontuacao} de ${totalPerguntas} perguntas!`;
        }
    }

    // Observer para página final
    const observer = new MutationObserver(() => {
        const paginaFinal = document.querySelector(".pagina-final");
        if (paginaFinal && paginaFinal.classList.contains("ativa")) {
            mostrarResultado();
        }
    });

    paginas.forEach(p => {
        observer.observe(p, { attributes: true, attributeFilter: ["class"] });
    });

    // Inicializar
    atualizarProgresso();
});