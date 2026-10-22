// Permite usar async/await nos controllers sem try/catch em cada rota (Express 4).
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
