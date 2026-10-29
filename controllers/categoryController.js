const { Category, Ticket } = require('../models');
const { STATUS_ATIVOS } = require('../config/constants');
const { validationMessages } = require('../utils/helpers');

function pick(body) {
  return {
    nome: (body.nome || '').trim(),
    descricao: (body.descricao || '').trim() || null,
    cor: body.cor || '#6366f1',
  };
}

function renderForm(res, { categoria, errors = [], isEdit, status = 200 }) {
  res.status(status).render('categories/form', {
    title: isEdit ? 'Editar categoria' : 'Nova categoria',
    categoria,
    errors,
    isEdit,
  });
}

// GET /categories
exports.index = async (req, res) => {
  const lista = await Category.findAll({
    include: [{ model: Ticket, as: 'tickets', attributes: ['id', 'status'], required: false }],
    order: [['nome', 'ASC']],
  });
  const categorias = lista.map((c) => ({
    id: c.id,
    nome: c.nome,
    descricao: c.descricao,
    cor: c.cor,
    total: c.tickets.length,
    ativos: c.tickets.filter((t) => STATUS_ATIVOS.includes(t.status)).length,
  }));
  res.render('categories/index', { title: 'Categorias', categorias });
};

exports.new = (req, res) => renderForm(res, { categoria: { cor: '#6366f1' }, isEdit: false });

exports.create = async (req, res) => {
  const data = pick(req.body);
  try {
    await Category.create(data);
    res.redirect(`/categories?msg=${encodeURIComponent('Categoria criada com sucesso!')}`);
  } catch (err) {
    const errors = validationMessages(err);
    if (!errors) throw err;
    renderForm(res, { categoria: data, errors, isEdit: false, status: 422 });
  }
};

exports.edit = async (req, res) => {
  const categoria = await Category.findByPk(req.params.id);
  if (!categoria) return res.status(404).render('404', { title: 'Categoria não encontrada' });
  renderForm(res, { categoria, isEdit: true });
};

exports.update = async (req, res) => {
  const categoria = await Category.findByPk(req.params.id);
  if (!categoria) return res.status(404).render('404', { title: 'Categoria não encontrada' });
  const data = pick(req.body);
  try {
    await categoria.update(data);
    res.redirect(`/categories?msg=${encodeURIComponent('Categoria atualizada.')}`);
  } catch (err) {
    const errors = validationMessages(err);
    if (!errors) throw err;
    renderForm(res, { categoria: { ...data, id: categoria.id }, errors, isEdit: true, status: 422 });
  }
};

exports.destroy = async (req, res) => {
  const categoria = await Category.findByPk(req.params.id);
  if (!categoria) return res.status(404).render('404', { title: 'Categoria não encontrada' });
  await Ticket.update({ categoryId: null }, { where: { categoryId: categoria.id } });
  await categoria.destroy();
  res.redirect(`/categories?msg=${encodeURIComponent('Categoria removida.')}`);
};
