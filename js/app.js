/* Prumo Engenharia: comportamentos do site.
   Tudo roda no navegador. Nenhum dado sai daqui, nada é guardado.
   Blocos: menu, estimador de custo, linha do tempo, filtro de obras, pedido de visita. */
(function () {
  "use strict";

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
  const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const dataCurta = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const mesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

  /* ---------- Menu no celular ---------- */
  (function menu() {
    const botao = $(".menu-botao");
    const menu = $("#menu");
    if (!botao || !menu) return;
    const fecha = () => { menu.classList.remove("aberto"); botao.setAttribute("aria-expanded", "false"); };
    botao.addEventListener("click", () => {
      const aberto = menu.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", fecha));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecha(); });
  })();

  /* ---------- Estimador de custo (valores fictícios) ---------- */
  const CUSTO_M2 = { economico: 2100, medio: 3200, alto: 4900 };
  const FATOR_TIPO = { casa: 1.0, comercial: 1.1, galpao: 0.62 };
  const FATOR_PAV = { 1: 1.0, 2: 1.06, 3: 1.13 };
  const REPARTICAO = {
    casa: { projetos: 0.07, fundacao: 0.08, estrutura: 0.19, vedacao: 0.17, instalacoes: 0.14, acabamento: 0.35 },
    comercial: { projetos: 0.08, fundacao: 0.09, estrutura: 0.22, vedacao: 0.15, instalacoes: 0.18, acabamento: 0.28 },
    galpao: { projetos: 0.07, fundacao: 0.14, estrutura: 0.38, vedacao: 0.22, instalacoes: 0.11, acabamento: 0.08 }
  };

  function porteDaArea(area) {
    if (area <= 120) return "pequena";
    if (area <= 300) return "media";
    return "grande";
  }

  function iniciaEstimador() {
    const form = $("#form-estimador");
    if (!form) return;
    const campoArea = $("#area");
    const erroArea = $("#area-erro");
    campoArea.setAttribute("aria-describedby", "area-erro");
    const saida = {
      min: $("#est-min"), max: $("#est-max"), m2: $("#est-m2"), area: $("#est-area"), prazo: $("#est-prazo")
    };
    const barras = $$("#est-barras .barra");

    function calcula() {
      const area = Number(campoArea.value);
      const tipo = form.elements.tipo.value;
      const padrao = form.elements.padrao.value;
      const pav = form.elements.pavimentos.value;
      if (!Number.isFinite(area) || area < 20 || area > 20000) {
        erroArea.textContent = "Informe uma área entre 20 e 20.000 m².";
        erroArea.hidden = false;
        campoArea.setAttribute("aria-invalid", "true");
        return;
      }
      erroArea.hidden = true;
      campoArea.removeAttribute("aria-invalid");

      const m2 = CUSTO_M2[padrao] * FATOR_TIPO[tipo] * FATOR_PAV[pav];
      const total = area * m2;
      saida.min.textContent = reais.format(total * 0.92);
      saida.max.textContent = reais.format(total * 1.08);
      saida.m2.textContent = reais.format(m2);
      saida.area.textContent = inteiro.format(area) + " m²";

      const partes = REPARTICAO[tipo];
      const maior = Math.max(...Object.values(partes));
      barras.forEach((li) => {
        const chave = li.dataset.etapa;
        const fracao = partes[chave];
        li.querySelector(".barra-fill").style.setProperty("--w", String(Math.round((fracao / maior) * 100)));
        li.querySelector(".barra-valor").textContent = reais.format(total * fracao);
      });

      const semanas = totalSemanas(porteDaArea(area));
      saida.prazo.textContent = Math.round(semanas / 4.33) + " meses";
    }

    form.addEventListener("input", calcula);
    form.addEventListener("change", calcula);
    form.addEventListener("submit", (e) => { e.preventDefault(); calcula(); });
    calcula();

    /* Levar a área do estimador para a linha do tempo */
    $("#est-ver-prazo").addEventListener("click", () => {
      const area = Number(campoArea.value);
      if (Number.isFinite(area) && area >= 20) {
        const porte = $("#porte");
        porte.value = porteDaArea(area);
        porte.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
   }

  /* O estimador depende das etapas da linha do tempo, por isso é iniciado no fim. */

  /* ---------- Linha do tempo da obra ---------- */
  const ETAPAS = [
    {
      id: "projeto", nome: "Levantamento e projeto", semanas: 6,
      acontece: "Medimos o terreno, fazemos a sondagem do solo e desenhamos o projeto arquitetônico e o estrutural. É a etapa mais barata e a que mais define o resto.",
      decide: ["O programa: quantos quartos, salas, vagas e o que não pode faltar", "O padrão de acabamento e o orçamento-alvo", "Se a obra terá etapas (fazer parte agora, parte depois)"],
      alerta: "Mudar o projeto aqui custa horas de desenho. Mudar depois custa concreto quebrado."
    },
    {
      id: "aprovacao", nome: "Aprovação e licenças", semanas: 5,
      acontece: "Protocolamos o projeto na prefeitura, registramos a ART no CREA e emitimos o alvará de construção. Enquanto isso, fechamos o orçamento com fornecedores.",
      decide: ["Quem executa: empreiteiro, construtora ou administração direta", "A forma de contratação (empreitada global ou por etapa)", "Assinatura dos documentos da prefeitura"],
      alerta: ""
    },
    {
      id: "fundacao", nome: "Fundação", semanas: 4,
      acontece: "Locamos a obra com teodolito, escavamos e executamos a fundação indicada pela sondagem: sapatas, estacas ou radier. Conferimos a armação antes de cada concretagem.",
      decide: ["Nada técnico: a sondagem já decidiu o tipo de fundação", "Onde ficam o muro, o portão e a entrada de obra", "Ligações provisórias de água e energia"],
      alerta: "É a etapa que fica enterrada. Cada visita nossa aqui vale por três depois."
    },
    {
      id: "estrutura", nome: "Estrutura", semanas: 8,
      acontece: "Pilares, vigas e lajes sobem conforme as pranchas. Conferimos prumo, armação, cobrimento e o concreto de cada caminhão. Depois de desformar, medimos tudo de novo.",
      decide: ["Confirmar a posição final de janelas e portas antes da laje", "Pé-direito e rebaixos de forro", "Pontos pesados: caixa d'água, ar-condicionado central, banheira"],
      alerta: "Depois que a laje é concretada, mover uma parede é projeto novo, não ajuste."
    },
    {
      id: "vedacao", nome: "Alvenaria e cobertura", semanas: 6,
      acontece: "Levantamos as paredes, fazemos vergas e contravergas, montamos o telhado e a impermeabilização. A casa ganha forma e fica protegida da chuva.",
      decide: ["Tipo de telha e de forro", "Modelo das esquadrias (janelas e portas), que precisam ser pedidas agora", "Posição de nichos e prateleiras embutidas"],
      alerta: "Esquadria demora de 4 a 8 semanas para chegar. Quem escolhe tarde atrasa a obra."
    },
    {
      id: "instalacoes", nome: "Instalações", semanas: 5,
      acontece: "Passamos eletrodutos, fiação, tubulação de água, esgoto, gás e ar-condicionado. Testamos cada trecho com pressão antes de fechar.",
      decide: ["Posição de cada tomada, interruptor e ponto de luz", "Pontos de água e esgoto de cada equipamento (máquina, filtro, ducha)", "Automação, câmeras e internet cabeada, se quiser"],
      alerta: "Depois do reboco, cada tomada nova é parede aberta de novo."
    },
    {
      id: "acabamento", nome: "Acabamento", semanas: 10,
      acontece: "Reboco, contrapiso, pisos, revestimentos, pintura, louças, metais, bancadas e esquadrias instaladas. É a etapa mais longa e a que mais pesa no bolso.",
      decide: ["Piso, revestimento e rejunte de cada ambiente", "Louças, metais, bancadas e cores de pintura", "Marcenaria, se for entrar antes da entrega"],
      alerta: "Aqui vai cerca de um terço do custo total. Decidir cedo evita compra apressada."
    },
    {
      id: "entrega", nome: "Vistoria e entrega", semanas: 2,
      acontece: "Fazemos a vistoria final com lista de pendências, acompanhamos os ajustes, emitimos o habite-se e entregamos o manual da obra com as plantas como construído.",
      decide: ["Aceitar ou não cada item da lista de pendências", "Quem fica com as chaves, os manuais e as garantias", "Data da mudança"],
      alerta: ""
    }
  ];
  const FATOR_PORTE = { pequena: 0.8, media: 1.0, grande: 1.35 };

  function semanasDaEtapa(etapa, porte) {
    return Math.max(1, Math.round(etapa.semanas * FATOR_PORTE[porte]));
  }
  function totalSemanas(porte) {
    return ETAPAS.reduce((s, e) => s + semanasDaEtapa(e, porte), 0);
  }
  function somaSemanas(data, semanas) {
    const d = new Date(data.getTime());
    d.setDate(d.getDate() + semanas * 7);
    return d;
  }

  (function linhaDoTempo() {
    const lista = $("#gantt");
    if (!lista) return;
    const porte = $("#porte");
    const inicio = $("#mes-inicio");
    const saidaSemanas = $("#prazo-semanas");
    const saidaFim = $("#prazo-fim");
    const det = {
      num: $("#det-num"), semanas: $("#det-semanas"), titulo: $("#det-titulo"), datas: $("#det-datas"),
      acontece: $("#det-acontece"), decide: $("#det-decide"), alerta: $("#det-alerta"),
      anterior: $("#det-anterior"), proxima: $("#det-proxima")
    };
    let ativa = 0;

    /* Mês de início padrão: o mês que vem */
    const hoje = new Date();
    const proximo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    inicio.value = proximo.getFullYear() + "-" + String(proximo.getMonth() + 1).padStart(2, "0");

    function dataInicio() {
      const m = /^(\d{4})-(\d{2})$/.exec(inicio.value || "");
      if (!m) return proximo;
      return new Date(Number(m[1]), Number(m[2]) - 1, 1);
    }

    /* Monta os botões uma vez */
    ETAPAS.forEach((etapa, i) => {
      const li = document.createElement("li");
      li.className = "gantt-item";
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "gantt-botao";
      botao.dataset.indice = String(i);
      botao.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      const nome = document.createElement("span");
      nome.className = "gantt-nome";
      const num = document.createElement("span");
      num.className = "mono";
      num.textContent = String(i + 1).padStart(2, "0");
      nome.append(num, document.createTextNode(etapa.nome));
      const trilho = document.createElement("span");
      trilho.className = "gantt-trilho";
      const fill = document.createElement("span");
      fill.className = "gantt-fill";
      trilho.append(fill);
      const semanas = document.createElement("span");
      semanas.className = "gantt-semanas";
      botao.append(nome, trilho, semanas);
      botao.addEventListener("click", () => { ativa = i; atualiza(); });
      li.append(botao);
      lista.append(li);
    });

    function atualiza() {
      const p = porte.value in FATOR_PORTE ? porte.value : "media";
      const total = totalSemanas(p);
      const comeco = dataInicio();
      let acumulado = 0;
      const periodos = [];
      ETAPAS.forEach((etapa, i) => {
        const sem = semanasDaEtapa(etapa, p);
        const de = somaSemanas(comeco, acumulado);
        const ate = somaSemanas(comeco, acumulado + sem);
        periodos.push({ sem, de, ate });
        const botao = lista.children[i].querySelector(".gantt-botao");
        botao.setAttribute("aria-pressed", i === ativa ? "true" : "false");
        const fill = botao.querySelector(".gantt-fill");
        fill.style.setProperty("--ini", String((acumulado / total) * 100));
        fill.style.setProperty("--dur-pct", String((sem / total) * 100));
        botao.querySelector(".gantt-semanas").textContent = sem + (sem === 1 ? " semana" : " semanas");
        acumulado += sem;
      });
      saidaSemanas.textContent = total + " semanas (" + Math.round(total / 4.33) + " meses)";
      saidaFim.textContent = mesAno.format(somaSemanas(comeco, total));

      const etapa = ETAPAS[ativa];
      const per = periodos[ativa];
      det.num.textContent = String(ativa + 1).padStart(2, "0");
      det.semanas.textContent = per.sem + (per.sem === 1 ? " semana" : " semanas");
      det.titulo.textContent = etapa.nome;
      det.datas.textContent = dataCurta.format(per.de) + " a " + dataCurta.format(per.ate);
      det.acontece.textContent = etapa.acontece;
      det.decide.replaceChildren(...etapa.decide.map((t) => { const li = document.createElement("li"); li.textContent = t; return li; }));
      det.alerta.textContent = etapa.alerta;
      det.anterior.disabled = ativa === 0;
      det.proxima.disabled = ativa === ETAPAS.length - 1;
    }

    det.anterior.addEventListener("click", () => { if (ativa > 0) { ativa--; atualiza(); } });
    det.proxima.addEventListener("click", () => { if (ativa < ETAPAS.length - 1) { ativa++; atualiza(); } });
    porte.addEventListener("change", atualiza);
    inicio.addEventListener("change", atualiza);
    inicio.addEventListener("input", atualiza);
    $("#form-prazo").addEventListener("submit", (e) => { e.preventDefault(); atualiza(); });
    atualiza();
  })();

  /* ---------- Filtro do portfólio ---------- */
  (function obras() {
    const botoes = $$(".filtro");
    const itens = $$("#lista-obras .obra");
    const contagem = $("#filtro-contagem");
    const vazio = $("#filtro-vazio");
    if (!botoes.length) return;
    botoes.forEach((b) => b.addEventListener("click", () => {
      const filtro = b.dataset.filtro;
      botoes.forEach((o) => { const on = o === b; o.classList.toggle("ativo", on); o.setAttribute("aria-pressed", String(on)); });
      let visiveis = 0;
      itens.forEach((li) => {
        const mostra = filtro === "todas" || li.dataset.tipo === filtro;
        li.hidden = !mostra;
        if (mostra) visiveis++;
      });
      contagem.textContent = visiveis + (visiveis === 1 ? " obra" : " obras") + (filtro === "todas" ? "" : " · " + b.textContent.trim());
      vazio.hidden = visiveis > 0;
    }));
  })();

  /* ---------- Pedido de visita (valida e resume, não envia) ---------- */
  (function visita() {
    const form = $("#form-visita");
    if (!form) return;
    const resumo = $("#visita-resumo");
    const erroGeral = $("#visita-erro");
    const telefone = $("#telefone");
    const descricao = $("#descricao");
    const contagem = $("#descricao-contagem");
    const NOMES_SERVICO = {
      laudo: "Laudo técnico", recebimento: "Vistoria de recebimento de imóvel", projeto: "Projeto estrutural",
      acompanhamento: "Acompanhamento de obra", reforma: "Avaliação para reforma"
    };
    const NOMES_PERIODO = { manha: "Manhã", tarde: "Tarde", qualquer: "Qualquer período" };

    /* Liga cada mensagem de erro ao seu campo */
    ["nome", "telefone", "email", "servico", "endereco", "descricao"].forEach((id) => {
      $("#" + id).setAttribute("aria-describedby", id + "-erro");
    });

    /* Máscara de telefone: (65) 99999-0000 ou (65) 3333-0000 */
    telefone.addEventListener("input", () => {
      const d = telefone.value.replace(/\D/g, "").slice(0, 11);
      let v = d;
      if (d.length > 2) v = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 6) {
        const corpo = d.slice(2);
        const corte = corpo.length > 8 ? 5 : 4;
        v = "(" + d.slice(0, 2) + ") " + corpo.slice(0, corte) + "-" + corpo.slice(corte);
      }
      telefone.value = v;
    });

    descricao.addEventListener("input", () => { contagem.textContent = String(descricao.value.trim().length); });

    function marca(id, msg) {
      const campo = $("#" + id);
      const erro = $("#" + id + "-erro");
      if (msg) {
        erro.textContent = msg; erro.hidden = false;
        if (campo) campo.setAttribute("aria-invalid", "true");
      } else {
        erro.hidden = true; erro.textContent = "";
        if (campo) campo.removeAttribute("aria-invalid");
      }
      return !msg;
    }

    function valida() {
      const v = (id) => $("#" + id).value.trim();
      const erros = [];
      if (!marca("nome", v("nome").length >= 3 ? "" : "Escreva seu nome com pelo menos 3 letras.")) erros.push("nome");
      const digitos = v("telefone").replace(/\D/g, "");
      if (!marca("telefone", digitos.length === 10 || digitos.length === 11 ? "" : "Informe o telefone com DDD, 10 ou 11 números.")) erros.push("telefone");
      const email = v("email");
      if (!marca("email", !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Este e-mail não parece completo. Confira ou deixe em branco.")) erros.push("email");
      if (!marca("servico", v("servico") ? "" : "Escolha o que você precisa.")) erros.push("servico");
      if (!marca("endereco", v("endereco").length >= 4 ? "" : "Informe o endereço ou pelo menos o bairro.")) erros.push("endereco");
      if (!marca("descricao", v("descricao").length >= 20 ? "" : "Conte um pouco mais: pelo menos 20 caracteres.")) erros.push("descricao");
      const periodo = form.elements.periodo.value;
      if (!marca("periodo", periodo ? "" : "Escolha um período para a visita.")) erros.push("periodo");
      return erros;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const erros = valida();
      if (erros.length) {
        erroGeral.textContent = erros.length === 1 ? "Falta corrigir 1 campo, marcado abaixo." : "Faltam corrigir " + erros.length + " campos, marcados em vermelho.";
        erroGeral.hidden = false;
        const primeiro = erros[0] === "periodo" ? form.elements.periodo[0] : $("#" + erros[0]);
        primeiro.focus();
        return;
      }
      erroGeral.hidden = true;
      const v = (id) => $("#" + id).value.trim();
      $("#res-nome").textContent = v("nome");
      $("#res-telefone").textContent = v("telefone");
      $("#res-email").textContent = v("email") || "Não informado";
      $("#res-servico").textContent = NOMES_SERVICO[v("servico")] || v("servico");
      $("#res-endereco").textContent = v("endereco");
      $("#res-periodo").textContent = NOMES_PERIODO[form.elements.periodo.value];
      $("#res-descricao").textContent = v("descricao");
      /* Protocolo fictício, só para a tela parecer completa: não identifica ninguém */
      const agora = new Date();
      $("#res-protocolo").textContent = "PR-" + String(agora.getFullYear()).slice(2) + String(agora.getMonth() + 1).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 900) + 100);
      form.hidden = true;
      resumo.hidden = false;
      resumo.focus();
      resumo.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    $("#res-editar").addEventListener("click", () => {
      resumo.hidden = true; form.hidden = false; $("#nome").focus();
    });
    $("#res-novo").addEventListener("click", () => {
      form.reset();
      contagem.textContent = "0";
      ["nome", "telefone", "email", "servico", "endereco", "descricao", "periodo"].forEach((id) => marca(id, ""));
      resumo.hidden = true; form.hidden = false; $("#nome").focus();
    });
  })();

  iniciaEstimador();
})();
