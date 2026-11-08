# Identidade visual: Prumo Engenharia

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, o engenheiro responsável, o número do CREA, o endereço, o telefone, as obras do portfólio e os valores do estimador.

## Nome e posicionamento

**Prumo Engenharia** (CREA/MT 000000, número fictício). Escritório de engenharia civil em Cuiabá com três serviços: projeto estrutural, laudos técnicos e acompanhamento de obra.

Frase de posicionamento: **"Estrutura calculada, obra acompanhada."**

O prumo é o fio com peso que mostra a vertical exata. É a ferramenta mais simples do canteiro e a que ninguém dispensa, porque a parede ou está no prumo ou não está. A marca pega essa ideia: precisão que se vê, sem discurso. O site fala em primeira pessoa do escritório, em frases curtas, com número onde cabe número.

## Paleta

Fugi de propósito do azul-corporativo e do laranja de capacete. As cores vêm do canteiro depois da chuva: concreto curado, aço, grafite quente da sombra sob a laje e a única cor viva que existe ali, o amarelo da trena.

| Papel | Nome | Hex | Uso |
|---|---|---|---|
| Fundo | Concreto | `#ECE9E4` | fundo de toda a página, cinza claro e quente |
| Fundo 2 | Argamassa | `#DCD8D1` | campos de formulário, faixas de apoio, trilhos da linha do tempo |
| Texto e bloco escuro | Grafite quente | `#2A2724` | todo o texto, o cabeçalho e as seções escuras (hero e estimador) |
| Superfície no escuro | Grafite claro | `#3A3733` | caixas e campos dentro das seções escuras |
| Texto secundário | Aço | `#5B5F66` | legendas, cotas, textos de apoio sobre fundo claro |
| Texto secundário no escuro | Aço claro | `#B3B7BE` | legendas sobre grafite |
| Linha | Linha | `#B9B4AB` | bordas de 1px, divisórias, grade visível |
| Destaque | Trena | `#F2B705` | a marcação técnica: uma por tela |
| Erro | Giz vermelho | `#B5351B` | só em mensagens de validação |
| Confirmação | Nível | `#1F6E4A` | só na confirmação do pedido de visita |

Regras de uso:

- A trena aparece **uma vez por tela**: o grifo do título do hero, o marcador da etapa ativa na linha do tempo, o filtro ativo do portfólio, a barra de total do estimador. Nunca como fundo de seção, nunca como cor de texto (amarelo sobre concreto não passa no contraste). Texto sobre trena é sempre grafite.
- Não existe gradiente decorativo. Não existe sombra em cartão. O que separa um bloco do outro é uma linha de 1px cor Linha ou a troca de fundo (Concreto para Argamassa, ou para Grafite).
- A grade é visível como elemento: linhas finas de 1px a cada 64px no fundo do hero e das seções escuras, como papel milimetrado, e "cotas" (linhas com traço nas pontas e número em mono) marcando medidas reais do layout.
- Contraste conferido: Grafite sobre Concreto 12,3:1; Grafite sobre Argamassa 10,5:1; Aço sobre Concreto 5,3:1; Aço sobre Argamassa 4,5:1; Concreto sobre Grafite 12,3:1; Concreto sobre Grafite claro 9,8:1; Aço claro sobre Grafite 7,4:1; Grafite sobre Trena 8,2:1; Giz vermelho sobre Concreto 5,0:1; Concreto sobre Nível 5,1:1. Tudo AA; a maior parte AAA.

## Tipografia

Duas famílias, ambas com licença SIL OFL 1.1, servidas da pasta `fonts/` (arquivos woff2 latinos, licenças ao lado):

- **Archivo** (variável, eixos peso 100 a 900 e largura 62 a 125): títulos, corpo, botões e formulários. É uma grotesca desenhada para texto de jornal e de placa, com desenho firme e nada de enfeite. Nos títulos uso a largura 88 (um pouco condensada, como letra de prancheta) e peso 600; no corpo, largura 100 e peso 400; em botões e rótulos, peso 600. Nunca em caixa alta no título.
- **IBM Plex Mono** (400 e 500): números, cotas, medidas, valores em reais, códigos de obra e os rótulos de grade. Mono porque é a fonte da tabela de cálculo e da planilha de medição, e porque números alinhados em coluna passam a sensação de precisão que a marca precisa. Rótulos pequenos em mono podem ir em caixa alta com espaçamento de 0,08em, e só eles.

Escala (base 16px, razão 1,25, com `clamp` para o celular):

| Papel | Tamanho | Família e peso | Entrelinha |
|---|---|---|---|
| Título do hero | 40 a 68px | Archivo 600, largura 88 | 1,0 |
| Título de seção | 30 a 44px | Archivo 600, largura 88 | 1,1 |
| Subtítulo | 21 a 24px | Archivo 600, largura 100 | 1,25 |
| Corpo | 17px | Archivo 400 | 1,6 |
| Corpo pequeno | 15px | Archivo 400 | 1,5 |
| Número grande (resultado) | 32 a 48px | IBM Plex Mono 500 | 1,1 |
| Cota e rótulo | 12 a 13px | IBM Plex Mono 500, caixa alta | 1,4 |

Regra de peso: Archivo só em 400 e 600; Plex Mono só em 400 e 500. Nada de negrito dentro de parágrafo: quando um número importa, ele vai para o mono.

## Layout

- Grade de 12 colunas, largura máxima de 1200px, calha de 24px. No celular, uma coluna com margem lateral de 20px (16px em 320px).
- Alinhamento à esquerda em tudo, inclusive o hero. Nenhum texto centralizado, a não ser dentro de botões.
- Ritmo em múltiplos de 8px: seções respiram 112px no computador e 64px no celular. Dentro das seções, blocos a 32px.
- Cada seção abre com uma linha de cota (número da seção em mono, traço, título curto) e uma frase que diz o que é e o que fazer. A numeração existe porque as seções seguem a ordem real de uma obra: projeto, custo, prazo, obras feitas, pedido de visita.
- Seções claras e escuras alternam: hero escuro, serviços claro, estimador escuro, linha do tempo claro, portfólio claro com faixa Argamassa, pedido de visita claro, "como funciona" Argamassa, rodapé escuro.
- Cantos retos em tudo (raio 0). Botões são retângulos com borda de 2px; o primário é Grafite com texto Concreto, o secundário é só borda. No hero, o primário inverte (Concreto com texto Grafite).

## Imagem forte

A imagem forte é a **foto do hero**: um contêiner 3:2 à direita do título, cantos retos, com uma linha de cota em mono passando por baixo ("1600 × 1067"), como se a própria foto fosse uma peça medida no projeto. Enquanto a foto do Canva não chega, `img/hero.webp` é uma composição abstrata gerada com Pillow nas cores da identidade (concreto com grão, planos de grafite, barras de aço em diagonal e uma faixa de trena), 1600px de largura, sem texto.

As demais ilustrações são SVG inline ou CSS: os ícones dos três serviços, as miniaturas do portfólio (plantas e cortes esquemáticos em linha, estilo prancha de projeto), as barras do estimador e o diagrama de Gantt da linha do tempo.

## Foto do hero

Proporção esperada: **3:2 horizontal, 1600 × 1067 px** (ou maior na mesma proporção), exportada em webp, salva em `img/hero.webp`. A imagem é cortada pelo contêiner com `object-fit: cover`, então o objeto principal deve ficar no terço central e à direita, com ar à esquerda.

Prompt em português para gerar no Canva:

> Fotografia editorial de site premium de engenharia. Sobre uma bancada de concreto polido cinza-claro e quente, vista levemente de cima em ângulo de 30 graus, estão apoiados: um prumo de latão escurecido pendurado por um fio fino, parado, perfeitamente vertical; ao lado, uma trena amarela de aço meio aberta, com a fita saindo em linha reta para a direita; ao fundo, fora de foco, um pedaço de planta estrutural impressa em papel branco com linhas finas em grafite e um pedaço de vergalhão de aço. Luz natural lateral de fim de tarde, vinda da esquerda, sombras longas e suaves, sem luz dura. Paleta restrita: cinza-concreto quente (#ECE9E4), grafite quente (#2A2724), aço (#5B5F66) e um único acento amarelo (#F2B705) na trena. Fundo limpo e sem textura chamativa. Profundidade de campo curta, foco no prumo. Sem pessoas, sem mãos, sem texto, sem logotipo, sem marca d'água. Estilo sóbrio, minimalista, fotografia de produto de revista de arquitetura. Proporção 3:2 horizontal, alta resolução.

Variante, se a primeira sair muito "mesa de escritório":

> Fotografia editorial, close de um pilar de concreto aparente recém-desformado, textura lisa com as marcas das tábuas da fôrma, em um canteiro silencioso ao fim do dia. Na frente do pilar, uma trena amarela de aço aberta na horizontal, presa por um ímã, marcando a medida. Luz lateral quente e suave, sombras longas no concreto. Paleta: concreto cinza-claro quente, grafite nas sombras, um único acento amarelo na trena. Sem pessoas, sem texto, sem logotipo. Estilo minimalista, revista de arquitetura. Proporção 3:2 horizontal.

## Movimento

- Um único momento orquestrado na abertura: a linha de cota do hero "se estica" da esquerda para a direita (300ms) e o grifo de trena aparece embaixo da palavra-chave do título (250ms, depois da cota). Nada mais se mexe sozinho.
- Respostas a ações: barras do estimador crescem em 400ms quando o resultado muda; a etapa escolhida na linha do tempo ganha o marcador de trena com transição de 200ms; cartões do portfólio somem e aparecem sem deslizar; mensagens de erro aparecem sem animação.
- Com `prefers-reduced-motion: reduce`, todas as transições e animações ficam em 0ms e a cota e o grifo já nascem prontos.
