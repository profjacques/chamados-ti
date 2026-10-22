module.exports = {
  dataHora(data) {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  },

  // "há 5 min", "há 3 h", "há 2 dias"
  idade(data) {
    const minutos = Math.floor((Date.now() - new Date(data).getTime()) / 60000);
    if (minutos < 1) return 'agora';
    if (minutos < 60) return `há ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `há ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  },
};
