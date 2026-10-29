const { Op, ValidationError } = require('sequelize');
const { Chamado, Comentario } = require('../models');
const { registrarHistorico, fotografar } = require('../services/historico');
const { valoresStatus } = require('../constants');

const campo = (v) => (typeof v === 'string' ? v.trim() : '');

// Só os campos permitidos entram no banco (evita gravar o que não deveria vir do formulário).
function dadosDoFormulario(body, editando) {
  const dados = {
    titulo: campo(body.titulo),
    descricao: campo(body.descricao),
    solicitante: campo(body.solicitante),
    setor: campo(body.setor) || null,
    categoria: campo(body.categoria),
    prioridade: campo(body.prioridade),
    responsavel: campo(body.responsavel) || null,
  };
  if (editando) dados.status = campo(body.status);
  return dados;
}

function erroNaoEncontrado() {
  const erro = new Error('Chamado não encontrado.');
  erro.status = 404;
  return erro;
}

// Executado por router.param('id'): carrega o chamado e o deixa em req.chamado.
exports.carregar = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return next(erroNaoEncontrado());
  const chamado = await Chamado.findByPk(id);
  if (!chamado) return next(erroNaoEncontrado());
  req.chamado = chamado;
  next();
};

exports.index = async (req, res) => {
  const q = campo(req.query.q);
  const status = campo(req.query.status);
  const prioridade = campo(req.query.prioridade);
  const categoria = campo(req.query.categoria);

  const where = {};
  if (status) where.status = status;
  if (prioridade) where.prioridade = prioridade;
  if (categoria) where.categoria = categoria;
  if (q) {
    const termo = `%${q}%`;
    where[Op.or] = [
      { titulo: { [Op.like]: termo } },
      { descricao: { [Op.like]: termo } },
      { solicitante: { [Op.like]: termo } },
      { responsavel: { [Op.like]: termo } },
    ];
  }

  const chamados = await Chamado.findAll({ where, order: [['createdAt', 'DESC']], limit: 300 });
  const filtrado = Boolean(q || status || prioridade || categoria);

  res.render('chamados/index', {
    titulo: 'Todos os chamados',
    chamados,
    filtros: { q, status, prioridade, categoria },
    filtrado,
  });
};

exports.novo = (req, res) => {
  res.render('chamados/form', {
    titulo: 'Novo chamado',
    chamado: null,
    erros: [],
    editando: false,
    acao: '/chamados',
    textoBotao: 'Abrir chamado',
    cancelar: '/',
  });
};

exports.criar = async (req, res) => {
  const dados = dadosDoFormulario(req.body, false);
  try {
    const chamado = await Chamado.create(dados);
    res.redirect(`/chamados/${chamado.id}?ok=criado`);
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err;
    res.status(422).render('chamados/form', {
      titulo: 'Novo chamado',
      chamado: dados,
      erros: err.errors.map((e) => e.message),
      editando: false,
      acao: '/chamados',
      textoBotao: 'Abrir chamado',
      cancelar: '/',
    });
  }
};

exports.mostrar = async (req, res) => {
  const comentarios = await req.chamado.getComentarios({
    order: [['createdAt', 'ASC'], ['id', 'ASC']],
  });
  res.render('chamados/show', { titulo: req.chamado.codigo, chamado: req.chamado, comentarios });
};

exports.editar = (req, res) => {
  res.render('chamados/form', {
    titulo: `Editar ${req.chamado.codigo}`,
    chamado: req.chamado,
    erros: [],
    editando: true,
    acao: `/chamados/${req.chamado.id}/editar`,
    textoBotao: 'Salvar alterações',
    cancelar: `/chamados/${req.chamado.id}`,
  });
};

exports.atualizar = async (req, res) => {
  const chamado = req.chamado;
  const antes = fotografar(chamado);
  const dados = dadosDoFormulario(req.body, true);
  try {
    chamado.set(dados);
    await chamado.save();
    await registrarHistorico(chamado, antes);
    res.redirect(`/chamados/${chamado.id}?ok=atualizado`);
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err;
    res.status(422).render('chamados/form', {
      titulo: `Editar ${chamado.codigo}`,
      chamado: { ...dados, id: chamado.id },
      erros: err.errors.map((e) => e.message),
      editando: true,
      acao: `/chamados/${chamado.id}/editar`,
      textoBotao: 'Salvar alterações',
      cancelar: `/chamados/${chamado.id}`,
    });
  }
};

// Atalho da tela de detalhes: muda a etapa e o responsável sem abrir o formulário completo.
exports.atualizarAndamento = async (req, res) => {
  const chamado = req.chamado;
  const status = campo(req.body.status);
  if (!valoresStatus.includes(status)) {
    return res.redirect(`/chamados/${chamado.id}?erro=status`);
  }
  const antes = fotografar(chamado);
  chamado.status = status;
  chamado.responsavel = campo(req.body.responsavel) || null;
  await chamado.save();
  await registrarHistorico(chamado, antes);
  res.redirect(`/chamados/${chamado.id}?ok=andamento#historico`);
};

exports.excluir = async (req, res) => {
  await Comentario.destroy({ where: { chamadoId: req.chamado.id } });
  await req.chamado.destroy();
  res.redirect('/?ok=excluido');
};
