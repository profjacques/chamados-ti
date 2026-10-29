// Apaga o banco e cria chamados de exemplo:  npm run seed
const { sequelize, Chamado, Comentario } = require('../models');

const atras = (horas) => new Date(Date.now() - horas * 60 * 60 * 1000);

const exemplos = [
  {
    titulo: 'Servidor de arquivos fora do ar',
    descricao: 'Ninguém do financeiro consegue abrir a pasta compartilhada desde as 8h.',
    solicitante: 'Marina Costa', setor: 'Financeiro', categoria: 'Rede e internet',
    prioridade: 'critica', status: 'em_andamento', responsavel: 'Rafael', criado: 5,
    notas: [['Rafael', 'Serviço de compartilhamento parado. Reiniciando o servidor agora.']],
  },
  {
    titulo: 'Notebook não liga após atualização',
    descricao: 'Depois da atualização de ontem a tela fica preta e o led pisca duas vezes.',
    solicitante: 'Carlos Menezes', setor: 'Comercial', categoria: 'Hardware',
    prioridade: 'alta', status: 'aberto', responsavel: null, criado: 20,
  },
  {
    titulo: 'Criar e-mail para novo colaborador',
    descricao: 'Entra na segunda-feira: Beatriz Lima, setor de RH. Precisa de e-mail e acesso ao sistema de ponto.',
    solicitante: 'Paulo Andrade', setor: 'RH', categoria: 'Acesso e senhas',
    prioridade: 'media', status: 'aberto', responsavel: 'Juliana', criado: 30,
  },
  {
    titulo: 'Impressora do 2º andar com papel enroscando',
    descricao: 'Já tentamos retirar o papel, mas continua travando na bandeja 2.',
    solicitante: 'Fernanda Rocha', setor: 'Jurídico', categoria: 'Impressoras',
    prioridade: 'baixa', status: 'aberto', responsavel: null, criado: 52,
  },
  {
    titulo: 'Instalar o pacote de design no computador novo',
    descricao: 'Precisamos do editor de imagens e das fontes da marca no computador da Larissa.',
    solicitante: 'Larissa Prado', setor: 'Marketing', categoria: 'Software',
    prioridade: 'media', status: 'em_andamento', responsavel: 'Juliana', criado: 28,
    notas: [['Larissa Prado', 'Pode instalar no horário do almoço, a máquina fica livre.']],
  },
  {
    titulo: 'Wi-Fi da sala de reuniões cai com frequência',
    descricao: 'Durante videochamadas a conexão cai a cada 10 minutos.',
    solicitante: 'Diego Martins', setor: 'Diretoria', categoria: 'Rede e internet',
    prioridade: 'alta', status: 'resolvido', responsavel: 'Rafael', criado: 70, resolvido: 26,
    notas: [['Rafael', 'Roteador trocado de canal e firmware atualizado. Teste de 2 horas sem quedas.']],
  },
  {
    titulo: 'Esqueci a senha do sistema de ponto',
    descricao: 'Preciso redefinir a senha para registrar o ponto de hoje.',
    solicitante: 'Aline Souza', setor: 'Atendimento', categoria: 'Acesso e senhas',
    prioridade: 'baixa', status: 'fechado', responsavel: 'Juliana', criado: 120, resolvido: 118,
  },
  {
    titulo: 'Monitor com listras na tela',
    descricao: 'Aparecem listras verticais depois de alguns minutos ligado.',
    solicitante: 'Roberto Lins', setor: 'Compras', categoria: 'Hardware',
    prioridade: 'media', status: 'resolvido', responsavel: 'Rafael', criado: 48, resolvido: 6,
  },
];

(async () => {
  await sequelize.sync({ force: true });

  for (const e of exemplos) {
    const chamado = await Chamado.create({
      titulo: e.titulo, descricao: e.descricao, solicitante: e.solicitante, setor: e.setor,
      categoria: e.categoria, prioridade: e.prioridade, status: e.status,
      responsavel: e.responsavel, createdAt: atras(e.criado),
      resolvidoEm: e.resolvido ? atras(e.resolvido) : null,
    });
    for (const [autor, texto] of e.notas || []) {
      await Comentario.create({ chamadoId: chamado.id, autor, texto, tipo: 'nota' });
    }
  }

  console.log(`${exemplos.length} chamados de exemplo criados.`);
  await sequelize.close();
})();
