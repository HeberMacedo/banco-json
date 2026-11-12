# API T-Pizza Artesanal

API mockada com JSON Server para alimentar o projeto [La Farina](https://github.com/HeberMacedo/La-Farina) (Vue 3).

Publicada em: https://api-tpizza-artesanal.onrender.com

O `server.js` é o mesmo servidor customizado do La Farina (`server/server.js`): JSON Server com validações que retornam `400` (nome, e-mail, senha e tamanho obrigatórios; e-mail inválido; PATCH inválido) e `404` com mensagem para pedido inexistente.

## Rotas principais

- `/menu`
- `/tamanhos`
- `/opcionais`
- `/pedidos`
- `/status_pedido`
- `/usuarios`

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
