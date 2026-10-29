// Listas usadas nos formulários, filtros, validações e telas.
const STATUS = [
  { valor: 'aberto', rotulo: 'Aberto' },
  { valor: 'em_andamento', rotulo: 'Em andamento' },
  { valor: 'resolvido', rotulo: 'Resolvido' },
  { valor: 'fechado', rotulo: 'Fechado' },
];

const PRIORIDADES = [
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
  { valor: 'critica', rotulo: 'Crítica' },
];

const CATEGORIAS = [
  'Hardware',
  'Software',
  'Rede e internet',
  'Acesso e senhas',
  'Impressoras',
  'Outros',
];

// Mensagens exibidas após uma ação (?ok=codigo) ou erro (?erro=codigo).
const MENSAGENS = {
  criado: 'Chamado aberto com sucesso.',
  atualizado: 'Chamado atualizado.',
  andamento: 'Andamento atualizado.',
  comentado: 'Comentário adicionado.',
  excluido: 'Chamado excluído.',
};

const ERROS = {
  comentario: 'Informe seu nome e escreva o comentário.',
  status: 'Escolha uma etapa válida para o chamado.',
};

const rotulo = (lista, valor) => (lista.find((i) => i.valor === valor) || { rotulo: valor }).rotulo;

module.exports = {
  STATUS,
  PRIORIDADES,
  CATEGORIAS,
  MENSAGENS,
  ERROS,
  valoresStatus: STATUS.map((s) => s.valor),
  valoresPrioridade: PRIORIDADES.map((p) => p.valor),
  rotuloStatus: (v) => rotulo(STATUS, v),
  rotuloPrioridade: (v) => rotulo(PRIORIDADES, v),
};
