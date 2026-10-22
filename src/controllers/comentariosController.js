const { ValidationError } = require('sequelize');
const { Comentario } = require('../models');

const campo = (v) => (typeof v === 'string' ? v.trim() : '');

exports.criar = async (req, res) => {
  const chamado = req.chamado;
  try {
    await Comentario.create({
      chamadoId: chamado.id,
      autor: campo(req.body.autor),
      texto: campo(req.body.texto),
      tipo: 'nota',
    });
    res.redirect(`/chamados/${chamado.id}?ok=comentado#historico`);
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err;
    res.redirect(`/chamados/${chamado.id}?erro=comentario#historico`);
  }
};
