# Vistoria de segurança: Prumo Engenharia (site de demonstração)

Data: 08/11/2026. Vistoria feita por mim, Rodrigo Jr, com apoio de ferramenta, sobre o site estático a ser publicado em `https://toshiro01001.github.io/engenharia/`.

## Resumo

Site 100% estático, sem servidor próprio, sem banco de dados, sem envio de dados, sem armazenamento no navegador. O único risco real seria alguém confundir a demonstração com um escritório de verdade ou tomar os valores do estimador como orçamento, e a faixa permanente no topo, os avisos ao lado de cada função, o rodapé e a seção "Como isto funciona" deixam claro que tudo é fictício.

## Content-Security-Policy

Declarada por `<meta http-equiv="Content-Security-Policy">` em `index.html`:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'
```

- Nenhum script inline, nenhum atributo `style` no HTML, nenhum `onclick`. Todo comportamento está em `js/app.js`. As larguras das barras do estimador e do diagrama da linha do tempo são definidas por CSSOM (`element.style.setProperty`), que a CSP permite sem `unsafe-inline`.
- `img-src data:` existe só por causa da seta do `<select>`, desenhada em SVG dentro do CSS.
- `connect-src 'none'`: o site não consegue fazer `fetch`, `XMLHttpRequest` nem WebSocket, nem que alguém injetasse código.
- `form-action 'none'`: mesmo que o JavaScript falhe, nenhum dos três formulários consegue enviar dados para lugar algum.
- `frame-ancestors` não funciona em meta tag, por isso ficou de fora. Em um site com servidor, iria no cabeçalho HTTP.
- O `404.html` tem `script-src 'none'`: a página de erro não roda script nenhum.

## Envio de dados

Nenhum. Os três formulários (estimador, linha do tempo, pedido de visita) são interceptados com `preventDefault()` e processados no navegador. Não há analytics, pixel, fonte externa, CDN ou iframe. O único link externo é `https://mileumalinhas.com.br`.

## O que fica no navegador

Nada. O site não usa `localStorage`, `sessionStorage`, cookies nem IndexedDB. O teste automatizado confere que `localStorage.length` continua zero depois de usar todas as funções. Os dados digitados no pedido de visita existem só na memória da página e somem ao recarregar.

O "protocolo" mostrado no resumo do pedido (`PR-AAMM-NNN`) é gerado na hora com um número aleatório, não identifica ninguém e não é guardado.

## Dependências

Nenhuma em produção. O site usa apenas HTML, CSS e JavaScript escritos à mão e duas fontes locais (Archivo e IBM Plex Mono, licença SIL OFL 1.1, arquivos de licença em `fonts/`). O Playwright é usado só nos testes, fora do site. A imagem provisória do hero foi gerada localmente com Pillow.

## Dados no repositório

O repositório é público. Conferido: não há senhas, chaves de API, tokens, e-mails pessoais, telefones reais ou endereços reais. A empresa, o número do CREA, o endereço, o telefone, as obras e os números do portfólio são inventados e marcados como tal. Os valores por metro quadrado do estimador são fictícios e o site avisa isso ao lado do formulário. O arquivo `google20db0e080e71c701.html` é a verificação de propriedade do Google Search Console do dono do site e não é um segredo.

## Riscos residuais

1. Alguém usar o estimador como orçamento real. Mitigado pelo aviso fixo ao lado do formulário ("Valores fictícios... Não use como orçamento") e pelo resultado mostrado como faixa, não como número exato.
2. Alguém confundir a demonstração com um escritório real e tentar pedir visita. Mitigado pela faixa permanente, pelo texto abaixo do botão ("Nada sai do seu navegador") e pelo aviso no resumo ("nada foi enviado e nada ficou guardado").
3. Meta tag de CSP não cobre `frame-ancestors`; o site pode ser colocado em um iframe por terceiros. Sem impacto prático, porque não há sessão nem ação sensível a sequestrar.
4. O GitHub Pages serve os cabeçalhos HTTP que quiser; não controlamos HSTS nem cabeçalhos de segurança além do que cabe na meta tag.
