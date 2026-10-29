const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const { sequelize } = require('./models');
const routes = require('./routes');
const locals = require('./middlewares/locals');
const seed = require('./seeders/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // permite PUT/PATCH/DELETE via formulários (?_method=PUT)
app.use(express.static(path.join(__dirname, 'public')));
app.use(locals);

// Rotas
app.use(routes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// Erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Erro', error: err });
});

(async () => {
  try {
    await sequelize.sync();
    await seed({ onlyIfEmpty: true });
    app.listen(PORT, () => {
      console.log(`\n  HelpDesk TI rodando em http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
})();
