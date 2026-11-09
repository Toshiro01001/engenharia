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

A imagem forte é a **foto do hero**: um contêiner 3:2 à direita do título, cantos retos, com uma linha de cota em mono passando por baixo ("1600 × 1067"), como se a própria foto fosse uma peça medida no projeto. A foto atual de `img/hero.webp` foi gerada por IA no Canva (ilustrativa, não é uma obra real), 1620 x 1080px, sem texto.

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

## Design systems aplicados (leva final)

A paleta não mudou. O que mudou foi superfície, tipografia de display, botões, navegação, cartões, faixas, rodapé e movimento, misturando dois design systems do catálogo:

- **Grotesk Zero 45** (tema claro: osso e tinta, Archivo variável e IBM Plex Mono, cruz de registro e grão) nas seções claras: serviços, prazo, obras, visita e como funciona.
- **IX-7 Mission** (tema escuro: tinta quente com painéis de vidro, campo de grade, faixa de status e cartões de token) nas seções escuras: hero, estimador e rodapé.

Regra da mistura: o verde-água do IX-7 e o vermelhão do Grotesk não entram; os dois viram Trena `#F2B705`, que continua aparecendo uma vez por tela. Nada de biblioteca externa: o que nos originais era GSAP ou Lenis virou CSS puro ou um IntersectionObserver, e tudo para com `prefers-reduced-motion`.

| Padrão | Origem | Onde está |
|---|---|---|
| Grão (`body::after`, ruído SVG a 5%, `steps(10)` em 7s) | Grotesk Zero | toda a página |
| Cruz de registro (`.reg-cross`, 26px, hairline a 50%) | Grotesk Zero | cota de abertura das seções 01 a 05 e os quatro tiques de canto da moldura do hero (`.canto`) |
| Eixo de peso no display (`.palavra`, 600 a 760 perto do ponteiro, ease 16% por quadro) | Grotesk Zero | `h1.hero-titulo`; parado em 600 no toque e com movimento reduzido |
| Spec block (mono 11px caixa alta, .14em, entrelinha 2.1, valores em 500) | Grotesk Zero | `dl.hero-numeros` |
| Ledger (rótulo mono .18em à esquerda, valor tabular à direita, hairline) | Grotesk Zero | `dl.obra-dados` e `dl.resumo-dados` |
| Preset buttons (hairline 1px, mono 11px .16em caixa alta, ativo preenche de tinta em .25s) | Grotesk Zero | `.filtro` (ativo com sublinhado Trena) e `label.opcao` do estimador e do pedido de visita |
| Ribbon (duas linhas em mono rolando em sentidos opostos, 28s, entre hairlines) | Grotesk Zero | `div.faixa-ribbon`, entre serviços e estimador, fundo Argamassa |
| Navbar com `mix-blend-mode: difference`, sem fundo próprio, sublinhado que cresce em .35s | Grotesk Zero | `header.topo` (fixo por `position: sticky`, sobreposto ao hero); no celular, com o menu aberto, o cabeçalho ganha fundo Grafite sólido para os links ficarem legíveis |
| Rodapé revelado por baixo e wordmark que afina sob o ponteiro (Archivo 900 a 150) | Grotesk Zero | `footer.rodape` sticky no fundo, `#rodape-marca` "PRUMO" com cruz Trena |
| Map field (grade + brilho radial Trena a 5% + vinheta rgba(11,12,10,.72)) | IX-7 | `.grade-fundo` em `#inicio` e `#estimador` |
| Glass panel (rgba(31,29,25,.48), blur 4px, linha a 16%) | IX-7 | `.estimador-resultado` e campos de `form.form-escuro` |
| Status strip (pares rótulo/valor em mono, hairlines verticais) | IX-7 | `.resultado-sub`, `.resultado-prazo` e `div.rodape-status` |
| Token cards (rótulo pequeno em caixa alta, valor grande, ativo com barra Trena) | IX-7 | cabeçalho de `article.etapa-detalhe` (etapa, duração, datas) |
| Replay reveal (sobe 30px com fade em .7s `cubic-bezier(.16,1,.3,1)`, escalonado 80ms) | Grotesk Zero | `.reveal` em serviços, obras, linha do tempo, detalhe da etapa e formulário de visita; na abertura as duas linhas do h1 sobem em 1.1s antes de a cota se esticar |

Observação: os presets usam 11px (não os 10px do original) para manter a leitura em caixa alta; a área de toque continua com 44px de altura.

## Fotos (leva final)

As fotos abaixo substituem os ícones dos serviços e três desenhos do portfólio, e entram na seção de visita. São geradas por IA no Canva (ilustrativas, sem pessoas identificáveis) e estão em `img/` em webp, com o nome e a proporção finais.

| Arquivo | Proporção | Onde | Prompt |
|---|---|---|---|
| `img/servico-projeto.webp` | 3:2 (1456 × 970) | serviço Projeto estrutural | Fotografia editorial realista para site premium de engenharia civil. Prancha de projeto estrutural em papel branco aberta sobre uma bancada de concreto polido cinza-claro quente, com linhas finas em grafite mostrando pilares e vigas, um escalímetro triangular de alumínio e um pedaço curto de vergalhão de aço apoiados sobre o papel. Luz natural lateral de fim de tarde vinda da esquerda, sombras longas e suaves. Paleta restrita a cinza-concreto quente (#ECE9E4), grafite (#2A2724) e aço (#5B5F66), sem acento amarelo nesta imagem. Sem pessoas, sem texto legível, sem logotipos. Proporção 3:2 horizontal. |
| `img/servico-laudo.webp` | 3:2 (1456 × 970) | serviço Laudos técnicos | Fotografia editorial realista, close de uma parede de alvenaria com reboco cinza-claro e uma fissura inclinada fina atravessando o quadro, com uma trena amarela de aço aberta na horizontal cruzando a fissura e um pequeno fissurômetro de acrílico transparente colado ao lado. Luz lateral quente e suave de fim de tarde, textura do reboco visível. Paleta: cinza-concreto quente, grafite nas sombras e um único acento amarelo (#F2B705) na trena. Sem pessoas, sem texto legível, sem logotipos. Estilo sóbrio de revista de arquitetura, proporção 3:2 horizontal. |
| `img/servico-acompanhamento.webp` | 3:2 (1456 × 970) | serviço Acompanhamento de obra | Fotografia editorial realista de um canteiro de obra silencioso ao fim do dia: armação de vergalhões de aço de uma laje vista em diagonal, fôrmas de madeira clara ao fundo e, em primeiro plano, um prumo de latão escurecido pendurado por um fio fino, perfeitamente vertical e parado. Luz natural lateral quente, sombras longas, profundidade de campo curta com foco no prumo. Paleta: cinza-concreto quente, grafite, aço e tons de madeira crua dessaturada, sem acento amarelo. Sem pessoas, sem texto, sem logotipos. Proporção 3:2 horizontal. |
| `img/obra-sobrado.webp` | 4:3 (1456 × 1088) | obra Sobrado no Jardim Itália | Fotografia editorial de arquitetura de um sobrado residencial contemporâneo de dois pavimentos em Cuiabá, estrutura de concreto aparente com marcas de fôrma, paredes em reboco cinza-claro quente, laje em balanço sobre a varanda e esquadrias escuras. Céu limpo e claro, luz de fim de tarde dourada e suave vinda da esquerda, sombras longas. Enquadramento frontal ligeiramente em diagonal, lente 35mm, tudo nítido. Paleta: concreto quente, grafite, aço, vegetação de cerrado dessaturada. Sem pessoas, sem carros, sem texto, sem placas, sem logotipos. Proporção 4:3 horizontal. |
| `img/obra-galpao.webp` | 4:3 (1456 × 1088) | obra Galpão logístico | Fotografia editorial realista do interior de um galpão logístico recém-concluído e vazio: pórticos e treliças de aço pintadas em cinza-grafite em perspectiva profunda, telhas translúcidas deixando entrar luz difusa, piso de concreto polido cinza-claro refletindo levemente a estrutura. Luz suave e uniforme, tons dessaturados, composição simétrica com ponto de fuga ao centro. Paleta: concreto quente, grafite, aço. Sem pessoas, sem empilhadeiras, sem caixas, sem texto, sem logotipos. Proporção 4:3 horizontal. |
| `img/obra-vistoria.webp` | 4:3 (1456 × 1088) | obra Recebimento de apartamento novo | Fotografia editorial realista, vista de cima em ângulo de 45 graus, de uma prancheta de alumínio escovado com folhas de checklist em branco sem texto legível, um nível de bolha de alumínio e uma trena amarela de aço fechada, apoiados no piso de porcelanato cinza-claro de um apartamento novo e vazio, com uma parede branca e um rodapé ao fundo desfocados. Luz natural lateral de janela, sombras suaves. Paleta: cinza-claro quente, grafite, aço e um único acento amarelo (#F2B705) na trena. Sem pessoas, sem texto legível, sem logotipos. Proporção 4:3 horizontal. |
| `img/escritorio-equipe.webp` | 4:5 (1088 × 1360) | seção Visita, entre a frase e o endereço | Fotografia editorial realista de site premium de engenharia: dois engenheiros adultos, vistos de costas e de perfil, sem rosto reconhecível, debruçados sobre uma prancha estrutural aberta em uma mesa de concreto polido, um deles apontando uma viga com uma lapiseira; ao fundo, parede de concreto aparente e uma estante com rolos de projeto. Luz natural lateral de fim de tarde vinda de uma janela à esquerda, sombras longas e suaves. Roupas em tons neutros de grafite e cinza, sem logotipos. Paleta: cinza-concreto quente, grafite, aço, um detalhe discreto de amarelo em um capacete apoiado na mesa. Sem texto legível. Proporção vertical 4:5. |
