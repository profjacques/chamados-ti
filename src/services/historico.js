const { Comentario } = require('../models');
const { rotuloStatus, rotuloPrioridade } = require('../constants');

// Compara o chamado antes/depois de uma edição e grava um registro automático no histórico.
async function registrarHistorico(chamado, antes) {
  const linhas = [];

  if (antes.status !== chamado.status) {
    linhas.push(
      `Etapa alterada de ${rotuloStatus(antes.status)} para ${rotuloStatus(chamado.status)}.`
    );
  }
  if (antes.prioridade !== chamado.prioridade) {
    linhas.push(
      `Prioridade alterada de ${rotuloPrioridade(antes.prioridade)} para ${rotuloPrioridade(chamado.prioridade)}.`
    );
  }
  if ((antes.responsavel || null) !== (chamado.responsavel || null)) {
    linhas.push(
      chamado.responsavel
        ? `Responsável: ${chamado.responsavel}.`
        : 'Responsável removido.'
    );
  }

  for (const texto of linhas) {
    await Comentario.create({ chamadoId: chamado.id, autor: 'Sistema', texto, tipo: 'sistema' });
  }
}

const fotografar = (c) => ({
  status: c.status,
  prioridade: c.prioridade,
  responsavel: c.responsavel,
});

module.exports = { registrarHistorico, fotografar };
