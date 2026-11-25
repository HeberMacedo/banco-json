# API T-Pizza Artesanal

API mockada com JSON Server para alimentar o projeto [La Farina](https://github.com/HeberMacedo/La-Farina) (Vue 3).

Publicada em: https://api-tpizza-artesanal.onrender.com

O `server.js` é o mesmo servidor customizado do La Farina (`server/server.js`): JSON Server com validações que retornam `400` (nome, e-mail, senha e tamanho obrigatórios; pedido com lista de pizzas vazia; mais de 2 sabores na mesma pizza; e-mail inválido; PATCH inválido) e `404` com mensagem para pedido inexistente.

## Rotas principais

- `/menu`
- `/tamanhos`
- `/opcionais`
- `/pedidos`
- `/status_pedido`
- `/usuarios`

## Observabilidade

O `observabilidade.js` é o mesmo módulo do La Farina (`server/observabilidade.js`).

- `/health`: responde `200` quando a API consegue ler o banco e `503` quando não consegue
- `/metrics`: métricas no formato do Prometheus (requisições, tempo de resposta, pedidos criados, validações recusadas e pedidos por status)
- Toda resposta traz o header `X-Request-Id`, e cada requisição gera uma linha de log em JSON com esse id
- `telemetria.js`: traces com OpenTelemetry. Ficam desligados aqui no Render; ligam quando existe a variável `OTEL_EXPORTER_OTLP_ENDPOINT` (no La Farina, o Docker Compose manda os traces para o Jaeger e os logs para o ELK)

## Testes e publicação

A cada push, o GitHub Actions valida o `db.json`, confere a sintaxe do servidor e roda o teste de fumaça (`npm test`): sobe a API num banco temporário e confere `/health`, as validações, a criação de pedido e as métricas. No Render, o Auto-Deploy deve ficar em **After CI Checks Pass** (Settings > Build & Deploy > Auto-Deploy): assim a API só é publicada se esses testes passarem.

## Contas de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@tpizza.com | admin123 |
| Cliente | marina@teste.com | 123456 |
| Cliente | heber@teste.com | 123456 |

> No plano gratuito do Render o disco não é persistente: quando o serviço reinicia, o banco volta ao `db.json` deste repositório. Contas e pedidos criados pelo site somem nesse momento; as contas acima sempre existem.

## Execucao

```bash
npm install
npm start
```
