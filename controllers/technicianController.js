const { Technician, Ticket } = require('../models');
const { STATUS_ATIVOS } = require('../config/constants');
const { validationMessages } = require('../utils/helpers');

function pick(body) {
  return {
    nome: (body.nome || '').trim(),
    email: (body.email || '').trim().toLowerCase(),
    especialidade: (body.especialidade || '').trim() || null,
    ativo: body.ativo === 'on' || body.ativo === 'true',
  };
}

function renderForm(res, { tecnico, errors = [], isEdit, status = 200 }) {
  res.status(status).render('technicians/form', {
    title: isEdit ? 'Editar técnico' : 'Novo técnico',
    tecnico,
    errors,
    isEdit,
  });
}

// GET /technicians
exports.index = async (req, res) => {
  const lista = await Technician.findAll({
    include: [{ model: Ticket, as: 'tickets', attributes: ['id', 'status'], required: false }],
    order: [['ativo', 'DESC'], ['nome', 'ASC']],
  });
  const tecnicos = lista.map((t) => ({
    id: t.id,
    nome: t.nome,
    email: t.email,
    especialidade: t.especialidade,
    ativo: t.ativo,
    iniciais: t.iniciais,
    ativos: t.tickets.filter((x) => STATUS_ATIVOS.includes(x.status)).length,
    concluidos: t.tickets.filter((x) => !STATUS_ATIVOS.includes(x.status)).length,
  }));
  res.render('technicians/index', { title: 'Técnicos', tecnicos });
};

exports.new = (req, res) => renderForm(res, { tecnico: { ativo: true }, isEdit: false });

exports.create = async (req, res) => {
  const data = pick(req.body);
  try {
    await Technician.create(data);
    res.redirect(`/technicians?msg=${encodeURIComponent('Técnico cadastrado com sucesso!')}`);
  } catch (err) {
    const errors = validationMessages(err);
    if (!errors) throw err;
    renderForm(res, { tecnico: data, errors, isEdit: false, status: 422 });
  }
};

exports.edit = async (req, res) => {
  const tecnico = await Technician.findByPk(req.params.id);
  if (!tecnico) return res.status(404).render('404', { title: 'Técnico não encontrado' });
  renderForm(res, { tecnico, isEdit: true });
};

exports.update = async (req, res) => {
  const tecnico = await Technician.findByPk(req.params.id);
  if (!tecnico) return res.status(404).render('404', { title: 'Técnico não encontrado' });
  const data = pick(req.body);
  try {
    await tecnico.update(data);
    res.redirect(`/technicians?msg=${encodeURIComponent('Técnico atualizado.')}`);
  } catch (err) {
    const errors = validationMessages(err);
    if (!errors) throw err;
    renderForm(res, { tecnico: { ...data, id: tecnico.id }, errors, isEdit: true, status: 422 });
  }
};

exports.destroy = async (req, res) => {
  const tecnico = await Technician.findByPk(req.params.id);
  if (!tecnico) return res.status(404).render('404', { title: 'Técnico não encontrado' });
  // Chamados do técnico ficam sem responsável
  await Ticket.update({ technicianId: null }, { where: { technicianId: tecnico.id } });
  await tecnico.destroy();
  res.redirect(`/technicians?msg=${encodeURIComponent('Técnico removido.')}`);
};
