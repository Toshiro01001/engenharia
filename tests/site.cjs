/* Testes do site com Playwright.
   Como rodar, na raiz do projeto:  node tests/site.cjs
   O script sobe um servidor local (python3 -m http.server 8309, na pasta acima, para o site
   responder em /engenharia/ como no GitHub Pages), abre o site em três tamanhos
   (1280x900, iPhone 13 e 320px), exercita as quatro funções, confere console, rolagem
   horizontal e textos cortados. Com CAPTURAS=1 salva PNGs em CAP_DIR (depois convertidos
   para webp em docs/) e, com SHOTS_DIR definido, salva a abertura em 1440x900 e no celular. */
"use strict";
const { chromium, devices } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORTA = 8309;
const RAIZ = path.resolve(__dirname, "..");
const SLUG = path.basename(RAIZ);
const URL = `http://127.0.0.1:${PORTA}/${SLUG}/`;
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";
const CAP_DIR = process.env.CAP_DIR || path.join(RAIZ, "tests", "capturas");

const falhas = [];
function checa(cond, msg) { if (!cond) falhas.push(msg); }
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function servidor() {
  const proc = spawn("python3", ["-m", "http.server", String(PORTA), "--bind", "127.0.0.1"], { cwd: path.dirname(RAIZ), stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(URL); if (r.ok) return proc; } catch (e) { /* ainda subindo */ }
    await espera(150);
  }
  proc.kill();
  throw new Error("Servidor local não subiu na porta " + PORTA);
}

async function verificacoesBasicas(page, rotulo) {
  const largura = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  checa(largura.doc <= largura.win, `${rotulo}: rolagem horizontal (${largura.doc} > ${largura.win})`);

  const cortados = await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll("h1,h2,h3,h4,p,a,button,label,legend,li,dt,dd,summary,span,small,address,option");
    for (const el of els) {
      if (el.closest("[hidden]") || (el.offsetParent === null && getComputedStyle(el).position !== "fixed")) continue;
      /* A faixa de glifos rola de propósito para fora da tela, dentro de um contêiner com overflow hidden. */
      if (el.closest('[aria-hidden="true"]')) continue;
      const cs = getComputedStyle(el);
      if (cs.overflow === "hidden" || cs.overflowX === "hidden") continue;
      if (el.tagName === "OPTION") continue;
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        out.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`);
      }
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 1 && r.width > 0) out.push(`${el.tagName.toLowerCase()}.${el.className} sai da tela (${Math.round(r.right)})`);
    }
    return out;
  });
  checa(cortados.length === 0, `${rotulo}: textos cortados ou fora da tela: ${cortados.join(" | ")}`);
}

async function capturar(page, seletor, nome) {
  await page.evaluate(() => { document.querySelector(".topo").style.position = "static"; });
  await page.locator(seletor).screenshot({ path: path.join(CAP_DIR, nome + ".png") });
  await page.evaluate(() => { document.querySelector(".topo").style.position = ""; });
}

async function testaFuncoes(page, rotulo, capturas, sufixo) {
  /* Estimador: 180 m², casa, médio, 1 pavimento = 180 × 3200 = 576.000; faixa 529.920 a 622.080 */
  let min = await page.textContent("#est-min");
  checa(min.replace(/\D/g, "") === "529920", `${rotulo}: estimador inicial errado (${min})`);
  await page.fill("#area", "400");
  await page.check('input[name="padrao"][value="alto"]');
  await page.selectOption("#pavimentos", "2");
  await espera(100);
  /* 400 × 4900 × 1.06 = 2.077.600 → máx 2.243.808 */
  const max = await page.textContent("#est-max");
  checa(max.replace(/\D/g, "") === "2243808", `${rotulo}: estimador com alto padrão errado (${max})`);
  const acabamento = await page.textContent('#est-barras .barra[data-etapa="acabamento"] .barra-valor');
  checa(acabamento.replace(/\D/g, "") === "727160", `${rotulo}: repartição do acabamento errada (${acabamento})`);
  const larguraBarra = await page.evaluate(() => getComputedStyle(document.querySelector('.barra[data-etapa="acabamento"] .barra-fill')).width);
  checa(parseFloat(larguraBarra) > 50, `${rotulo}: barra do acabamento não cresceu (${larguraBarra})`);
  checa((await page.textContent("#est-prazo")).includes("meses"), `${rotulo}: prazo do estimador vazio`);
  await page.fill("#area", "5");
  await espera(100);
  checa(!(await page.isHidden("#area-erro")), `${rotulo}: área inválida não mostrou erro`);
  await page.fill("#area", "400");
  await espera(100);
  checa(await page.isHidden("#area-erro"), `${rotulo}: erro da área não sumiu`);
  if (capturas) await capturar(page, "#estimador", `funcao-estimador${sufixo}`);

  /* Estimador leva o porte para a linha do tempo: 400 m² = grande */
  await page.click("#est-ver-prazo");
  await espera(300);
  checa((await page.inputValue("#porte")) === "grande", `${rotulo}: porte não veio do estimador`);
  const semanasGrande = await page.textContent("#prazo-semanas");
  /* grande: 6,5,4,8,6,5,10,2 × 1,35 arredondado = 8+7+5+11+8+7+14+3 = 63 */
  checa(semanasGrande.startsWith("63 semanas"), `${rotulo}: total de semanas do porte grande errado (${semanasGrande})`);

  /* Linha do tempo: trocar porte e mês, clicar etapa, navegar */
  await page.selectOption("#porte", "media");
  await page.fill("#mes-inicio", "2027-03");
  await espera(100);
  checa((await page.textContent("#prazo-semanas")).startsWith("46 semanas"), `${rotulo}: total de semanas do porte médio errado`);
  checa((await page.textContent("#prazo-fim")).includes("2028"), `${rotulo}: conclusão não caiu em 2028 (${await page.textContent("#prazo-fim")})`);
  await page.click('.gantt-botao[data-indice="3"]');
  checa((await page.textContent("#det-titulo")) === "Estrutura", `${rotulo}: clicar na etapa 4 não abriu Estrutura`);
  checa((await page.textContent("#det-datas")).includes("2027"), `${rotulo}: datas da etapa sem ano`);
  checa((await page.locator("#det-decide li").count()) === 3, `${rotulo}: lista de decisões da etapa vazia`);
  await page.click("#det-proxima");
  checa((await page.textContent("#det-titulo")) === "Alvenaria e cobertura", `${rotulo}: botão próxima etapa não avançou`);
  checa((await page.getAttribute('.gantt-botao[data-indice="4"]', "aria-pressed")) === "true", `${rotulo}: marcador da etapa ativa não acompanhou`);
  await page.click('.gantt-botao[data-indice="7"]');
  checa(await page.isDisabled("#det-proxima"), `${rotulo}: última etapa não desativou "próxima"`);
  await page.click('.gantt-botao[data-indice="3"]');
  if (capturas) await capturar(page, "#prazo", `funcao-prazo${sufixo}`);

  /* Portfólio */
  await page.click('.filtro[data-filtro="laudo"]');
  checa((await page.locator("#lista-obras .obra:not([hidden])").count()) === 2, `${rotulo}: filtro laudo não deixou 2 obras`);
  checa((await page.textContent("#filtro-contagem")).startsWith("2 obras"), `${rotulo}: contagem do filtro errada`);
  checa((await page.getAttribute('.filtro[data-filtro="laudo"]', "aria-pressed")) === "true", `${rotulo}: aria-pressed do filtro`);
  if (capturas) await capturar(page, "#obras", `funcao-obras${sufixo}`);
  await page.click('.filtro[data-filtro="todas"]');
  checa((await page.locator("#lista-obras .obra:not([hidden])").count()) === 8, `${rotulo}: voltar para todas não devolveu 8`);

  /* Pedido de visita: envio vazio, correção e resumo */
  await page.click('#form-visita button[type="submit"]');
  checa(!(await page.isHidden("#visita-erro")), `${rotulo}: formulário vazio passou`);
  checa((await page.evaluate(() => document.activeElement.id)) === "nome", `${rotulo}: foco não foi para o primeiro erro`);
  await page.fill("#nome", "Joana de Teste");
  await page.fill("#telefone", "65999990000");
  checa((await page.inputValue("#telefone")) === "(65) 99999-0000", `${rotulo}: máscara do telefone errada (${await page.inputValue("#telefone")})`);
  await page.fill("#email", "joana@exemplo");
  await page.selectOption("#servico", "laudo");
  await page.fill("#endereco", "Rua Exemplo, 10, Bosque da Saúde");
  await page.fill("#descricao", "Apareceu uma trinca inclinada na parede da sala depois da chuva.");
  await page.check('input[name="periodo"][value="manha"]');
  await page.click('#form-visita button[type="submit"]');
  checa(!(await page.isHidden("#email-erro")), `${rotulo}: e-mail incompleto passou`);
  await page.fill("#email", "joana@exemplo.com.br");
  if (capturas) await capturar(page, "#visita", `funcao-visita${sufixo}`);
  await page.click('#form-visita button[type="submit"]');
  await page.waitForSelector("#visita-resumo:not([hidden])");
  checa((await page.textContent("#res-servico")) === "Laudo técnico", `${rotulo}: resumo sem o serviço`);
  checa((await page.textContent("#res-periodo")) === "Manhã", `${rotulo}: resumo sem o período`);
  checa(/^PR-\d{4}-\d{3}$/.test(await page.textContent("#res-protocolo")), `${rotulo}: protocolo fora do padrão`);
  checa((await page.evaluate(() => localStorage.length)) === 0, `${rotulo}: algo foi parar no localStorage`);
  if (capturas) await capturar(page, "#visita", `funcao-visita-resumo${sufixo}`);
  await page.click("#res-editar");
  checa(!(await page.isHidden("#form-visita")), `${rotulo}: corrigir dados não voltou ao formulário`);
  checa((await page.inputValue("#nome")) === "Joana de Teste", `${rotulo}: corrigir dados perdeu o nome`);
  await page.click('#form-visita button[type="submit"]');
  await page.waitForSelector("#visita-resumo:not([hidden])");
  await page.click("#res-novo");
  checa((await page.inputValue("#nome")) === "", `${rotulo}: novo pedido não limpou`);
}

(async () => {
  if (CAPTURAS) fs.mkdirSync(CAP_DIR, { recursive: true });
  const proc = await servidor();
  const browser = await chromium.launch();
  const cenarios = [
    { nome: "1280x900", ctx: { viewport: { width: 1280, height: 900 } }, sufixo: "" },
    { nome: "iPhone 13", ctx: { ...devices["iPhone 13"] }, sufixo: "-celular" },
    { nome: "320px", ctx: { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, sufixo: "" }
  ];
  try {
    for (const c of cenarios) {
      const context = await browser.newContext(c.ctx);
      const page = await context.newPage();
      const erros = [];
      page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") erros.push(`${m.type()}: ${m.text()}`); });
      page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
      page.on("requestfailed", (r) => erros.push("requestfailed: " + r.url()));
      await page.goto(URL, { waitUntil: "networkidle" });
      await espera(1000);
      await verificacoesBasicas(page, c.nome + " (abertura)");

      await page.keyboard.press("Tab");
      const ativo = await page.evaluate(() => document.activeElement.className);
      checa(ativo.includes("pular"), `${c.nome}: primeiro Tab não foi para "Pular para o conteúdo" (${ativo})`);
      await page.mouse.click(5, 5);

      const capturas = CAPTURAS && c.nome !== "320px";
      if (capturas) await page.screenshot({ path: path.join(CAP_DIR, `capa${c.sufixo || "-desktop"}.png`) });

      if (c.nome !== "1280x900") {
        await page.click(".menu-botao");
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "true", `${c.nome}: menu não abriu`);
        await page.click('#menu a[href="#estimador"]');
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "false", `${c.nome}: menu não fechou ao clicar`);
      }
      await testaFuncoes(page, c.nome, capturas, c.sufixo);
      await verificacoesBasicas(page, c.nome + " (após uso)");

      await page.goto(URL + "404.html", { waitUntil: "networkidle" });
      await verificacoesBasicas(page, c.nome + " (404)");

      const errosReais = erros.filter((e) => !/404\.html|favicon/.test(e) || /pageerror/.test(e));
      checa(errosReais.length === 0, `${c.nome}: console: ${errosReais.join(" | ")}`);
      console.log(`${c.nome}: ok (console ${errosReais.length}, falhas até aqui ${falhas.length})`);
      await context.close();
    }

    if (SHOTS_DIR) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await d.goto(URL, { waitUntil: "networkidle" }); await espera(1000);
      await d.screenshot({ path: path.join(SHOTS_DIR, `${SLUG}-desk.png`) });
      await d.close();
      const ctx = await browser.newContext({ ...devices["iPhone 13"] });
      const m = await ctx.newPage();
      await m.goto(URL, { waitUntil: "networkidle" }); await espera(1000);
      await m.screenshot({ path: path.join(SHOTS_DIR, `${SLUG}-cel.png`) });
      await ctx.close();
    }
  } finally {
    await browser.close();
    proc.kill();
  }

  if (falhas.length) {
    console.error("\nFALHAS:\n- " + falhas.join("\n- "));
    process.exit(1);
  }
  console.log("\nTodos os testes passaram.");
})().catch((e) => { console.error(e); process.exit(1); });
