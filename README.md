# HelpDesk TI — Organização de Chamados

Sistema web local para abertura, acompanhamento e organização de chamados de TI, construído no padrão **MVC** com **Node.js, Express, EJS, CSS e Sequelize** (SQLite).

> Sem login: o sistema foi pensado para rodar localmente de forma simples.

## Como rodar

```bash
npm install
npm start        # http://localhost:3000
```

- `npm run dev` — reinicia automaticamente ao salvar arquivos (`node --watch`).
- `npm run seed` — **recria** o banco com os dados de exemplo.

Na primeira execução o arquivo `database.sqlite` é criado e populado automaticamente.

## Funcionalidades

- **Dashboard**: indicadores, fila prioritária, chamados por prioridade/status, carga da equipe, distribuição por categoria e tempo médio de resolução.
- **Chamados**: CRUD completo, busca (título, solicitante, protocolo `CH-00001`), filtros por status, prioridade, categoria e técnico.
- **Ações rápidas**: alterar status, prioridade e responsável com registro automático no histórico.
- **Comentários** e linha do tempo por chamado.
- **Técnicos** e **Categorias**: cadastro, edição e remoção.

## Estrutura (MVC)

```
app.js                 # inicialização do Express e do banco
config/                # conexão Sequelize e constantes (status, prioridades, setores)
models/                # Category, Technician, Ticket, Comment + associações
controllers/           # regras de cada recurso
routes/                # mapeamento de URLs -> controllers
middlewares/           # variáveis globais para as views
views/                 # templates EJS (partials, tickets, technicians, categories)
public/                # CSS e JS estáticos
seeders/               # dados de exemplo
utils/                 # helpers (datas, ícones, erros de validação)
```
