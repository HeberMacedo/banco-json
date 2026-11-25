// Teste de fumaça da API: sobe o servidor num banco temporário e confere o básico.
// Roda no GitHub Actions a cada push (npm test). Os testes completos ficam no
// repositório La-Farina (tests/), que tem o mesmo server.js.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { createApp } = require("./server");

const PEDIDO = {
  nome: "Teste de fumaça",
  pizzas: [{ tamanho: { id: 2, valor: 40 }, sabores: [{ id: 1 }], valor: 40 }],
  statusId: 5,
  taxaEntrega: 8,
  total: 48,
};

async function main() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), "banco-json-"));
  const dbPath = path.join(pasta, "db.json");

  fs.copyFileSync(path.join(__dirname, "db.json"), dbPath);

  const servidor = createApp({ dbPath, logs: false }).listen(0);
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const enviar = (rota, corpo) =>
    fetch(base + rota, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });

  const verificacoes = [
    ["GET /health responde 200", async () => assert.equal((await fetch(`${base}/health`)).status, 200)],
    ["GET /tamanhos traz os tamanhos", async () => assert.ok((await (await fetch(`${base}/tamanhos`)).json()).length > 0)],
    ["Toda resposta traz X-Request-Id", async () => assert.match((await fetch(`${base}/menu`)).headers.get("x-request-id"), /^[\da-f]{32}$/)],
    ["Pedido sem nome é recusado (400)", async () => assert.equal((await enviar("/pedidos", { ...PEDIDO, nome: "" })).status, 400)],
    [
      "Pizza com 3 sabores é recusada (400)",
      async () => {
        const pizzas = [{ ...PEDIDO.pizzas[0], sabores: [{ id: 1 }, { id: 2 }, { id: 3 }] }];
        assert.equal((await enviar("/pedidos", { ...PEDIDO, pizzas })).status, 400);
      },
    ],
    ["Pedido válido é criado (201)", async () => assert.equal((await enviar("/pedidos", PEDIDO)).status, 201)],
    ["GET /metrics conta o pedido criado", async () => assert.match(await (await fetch(`${base}/metrics`)).text(), /lafarina_pedidos_criados_total 1\b/)],
  ];

  let falhas = 0;

  for (const [nome, verificar] of verificacoes) {
    try {
      await verificar();
      console.log(`✓ ${nome}`);
    } catch (erro) {
      falhas += 1;
      console.log(`✗ ${nome}: ${erro.message}`);
    }
  }

  servidor.close();
  console.log(falhas ? `${falhas} verificação(ões) falharam.` : `Todas as ${verificacoes.length} verificações passaram.`);
  process.exit(falhas ? 1 : 0);
}

main();
