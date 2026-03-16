# Amor e Cumplicidade - Memorial do Convento

Projeto interativo em HTML, CSS e JavaScript sobre a relacao entre Blimunda e Baltasar.

## Estrutura

- index.html: conteudo das paginas, perguntas e hotspots.
- css/style.css: estilos visuais e responsividade.
- js/js.js: logica de navegacao, pontuacao e interacoes.
- img/: imagens usadas em cada capitulo.

## Fluxo da experiencia

1. Pagina de introducao.
2. Paginas de pergunta (escolha multipla).
3. Paginas com imagem e hotspot clicavel.
4. Pagina final com resultado e reflexao.

A navegacao segue a ordem em que as paginas aparecem no HTML.

## Convencoes para manter organizado

1. IDs de paginas devem ser unicos e sequenciais: pagina-0, pagina-1, pagina-2, etc.
2. Cada bloco de pagina deve manter o mesmo padrao:
	- titulo e separador;
	- conteudo (texto, pergunta ou imagem);
	- instrucao final.
3. Em perguntas, usar data-correta="true" apenas na opcao certa.
4. Em hotspots, ajustar apenas os valores do rect no SVG (x, y, width, height).

## Como editar um capitulo

1. Atualizar texto no index.html.
2. Trocar a imagem correspondente em img/.
3. Se necessario, reajustar hotspot no SVG da pagina.
4. Validar no browser se:
	- botao continuar aparece apos resposta;
	- hotspot avanca para a pagina seguinte;
	- progresso e indicadores continuam corretos.

## Melhorias futuras recomendadas

1. Separar dados dos capitulos para um ficheiro JSON.
2. Gerar paginas dinamicamente via JavaScript.
3. Adicionar botao de voltar ao capitulo anterior.
