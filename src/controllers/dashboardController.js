const { fn, col } = require('sequelize');
const { Chamado, Comentario } = require('../models');
const { STATUS } = require('../constants');

const PESO_PRIORIDADE = { critica: 0, alta: 1, media: 2, baixa: 3 };
const LIMITE_POR_COLUNA = 8;
const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;

exports.index = async (req, res) => {
  const chamados = await Chamado.findAll({ order: [['createdAt', 'DESC']] });

  const ativos = chamados.filter((c) => ['aberto', 'em_andamento'].includes(c.status));
  const indicadores = {
    ativos: ativos.length,
    urgentes: ativos.filter((c) => ['critica', 'alta'].includes(c.prioridade)).length,
    semResponsavel: ativos.filter((c) => !c.responsavel).length,
    resolvidosSemana: chamados.filter(
      (c) => c.resolvidoEm && Date.now() - new Date(c.resolvidoEm).getTime() <= SETE_DIAS
    ).length,
  };

  // Nas etapas ativas, o mais urgente (e mais antigo) aparece primeiro.
  const colunas = STATUS.map((etapa) => {
    const doStatus = chamados.filter((c) => c.status === etapa.valor);
    const ativa = ['aberto', 'em_andamento'].includes(etapa.valor);
    const ordenados = ativa
      ? [...doStatus].sort(
          (a, b) =>
            PESO_PRIORIDADE[a.prioridade] - PESO_PRIORIDADE[b.prioridade] ||
            new Date(a.createdAt) - new Date(b.createdAt)
        )
      : doStatus;
    return { ...etapa, total: doStatus.length, chamados: ordenados.slice(0, LIMITE_POR_COLUNA) };
  });

  const contagens = await Comentario.findAll({
    attributes: ['chamadoId', [fn('COUNT', col('id')), 'total']],
    where: { tipo: 'nota' },
    group: ['chamadoId'],
    raw: true,
  });
  const comentarios = Object.fromEntries(contagens.map((r) => [r.chamadoId, Number(r.total)]));

  res.render('dashboard', { titulo: 'Painel', indicadores, colunas, comentarios });
};
