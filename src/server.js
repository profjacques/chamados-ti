const app = require('./app');
const { sequelize } = require('./models');

const PORTA = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync(); // cria as tabelas se ainda não existirem
    app.listen(PORTA, () => {
      console.log(`Chamados de TI rodando em http://localhost:${PORTA}`);
    });
  } catch (err) {
    console.error('Não foi possível iniciar o servidor:', err);
    process.exit(1);
  }
})();
