// ===== AMOR E CUMPLICIDADE — Motor de Navegação =====

document.addEventListener("DOMContentLoaded", () => {
    const paginas = document.querySelectorAll(".pagina");
    const indicadoresContainer = document.querySelector(".indicadores");
    const barraProgresso = document.querySelector(".barra-progresso");
    const CLASSE_ATIVA = "ativa";
    const CLASSE_FOCO = "em-foco";
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

    function marcarPaginaEmFoco(pagina) {
        pagina.classList.remove(CLASSE_FOCO);
        void pagina.offsetWidth;
        pagina.classList.add(CLASSE_FOCO);
    }

    function prepararHotspotParaTeclado(hotspot) {
        hotspot.setAttribute("tabindex", "0");
        hotspot.setAttribute("role", "button");
        hotspot.setAttribute("aria-label", "Ativar simbolo escondido");

        hotspot.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                hotspot.click();
            }
        });
    }

    function irParaPagina(indice) {
        if (indice < 0 || indice >= paginas.length) return;

        const anterior = paginas[paginaAtual];
        anterior.classList.remove(CLASSE_ATIVA, CLASSE_FOCO);

        paginaAtual = indice;
        const nova = paginas[paginaAtual];
        nova.classList.add(CLASSE_ATIVA);
        marcarPaginaEmFoco(nova);

        // Scroll to top da nova página
        nova.scrollTop = 0;

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
        prepararHotspotParaTeclado(hotspot);

        hotspot.addEventListener("click", () => {
            const container = hotspot.closest(".imagem-container");
            if (!container) return;

            const dica = container.querySelector(".hotspot-dica");

            // Feedback visual no hotspot
            if (dica) {
                dica.style.animation = "none";
                dica.style.borderColor = "#4caf50";
                dica.style.background = "rgba(76,175,80,0.2)";
                dica.style.transform = "translate(-50%, -50%) scale(1.8)";
                dica.style.opacity = "0";
            }

            // Brilho na imagem
            container.style.transition = "box-shadow 0.4s ease, transform 0.4s ease";
            container.style.boxShadow = "0 0 40px rgba(201,168,76,0.4)";
            container.style.transform = "scale(1.02)";

            setTimeout(() => {
                container.style.boxShadow = "";
                container.style.transform = "";
                proximaPagina();
            }, 500);
        });
    });

    // ===== Perguntas de escolha múltipla =====
    document.querySelectorAll(".pergunta-container").forEach(container => {
        const opcoes = container.querySelectorAll(".opcao");
        const feedback = container.querySelector(".feedback");
        const btnContinuar = container.querySelector(".btn-continuar");
        let respondida = false;

        if (feedback) {
            feedback.setAttribute("aria-live", "polite");
        }

        opcoes.forEach(opcao => {
            opcao.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;

                const correta = opcao.dataset.correta === "true";

                opcoes.forEach(o => {
                    o.disabled = true;
                    if (o.dataset.correta === "true") {
                        o.classList.add("correta");
                    }
                });

                if (correta) {
                    opcao.classList.add("correta");
                    feedback.textContent = "Correto! Muito bem!";
                    feedback.className = "feedback correto";
                    pontuacao++;
                } else {
                    opcao.classList.add("errada");
                    feedback.textContent = "Não é bem isso... Vê a resposta correta a verde.";
                    feedback.className = "feedback incorreto";
                }

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
                d.style.borderColor = "";
                d.style.background = "";
                d.style.transform = "";
            });
            pontuacao = 0;
            irParaPagina(0);
        });
    });

    // ===== Mostrar resultado final =====
    function mostrarResultado() {
        const elResultado = document.querySelector(".resultado");
        if (elResultado && totalPerguntas > 0) {
            elResultado.textContent = "Acertaste " + pontuacao + " de " + totalPerguntas + " pergunta" + (totalPerguntas !== 1 ? "s" : "") + "!";
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
    marcarPaginaEmFoco(paginas[paginaAtual]);
    atualizarProgresso();
});