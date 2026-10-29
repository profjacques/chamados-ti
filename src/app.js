const path = require('path');
const express = require('express');
const routes = require('./routes');
const constants = require('./constants');
const formatadores = require('./utils/formatadores');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Variáveis disponíveis em todas as views
app.use((req, res, next) => {
  res.locals.C = constants;
  res.locals.fmt = formatadores;
  res.locals.caminho = req.originalUrl.split('?')[0];
  res.locals.aviso = constants.MENSAGENS[req.query.ok] || null;
  res.locals.erroGeral = constants.ERROS[req.query.erro] || null;
  next();
});

app.use('/', routes);

// 404
app.use((req, res, next) => {
  const erro = new Error('Página não encontrada.');
  erro.status = 404;
  next(erro);
});

// Erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).render('erro', {
    titulo: status === 404 ? 'Não encontrado' : 'Algo deu errado',
    mensagem: status === 404 ? err.message : 'Ocorreu um erro inesperado. Tente novamente.',
  });
});

module.exports = app;
