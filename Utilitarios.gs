/*******************************************************
 * UTILITÁRIOS DO SISTEMA
 *
 * AUTOMACAO_NS-PRODUCAO
 *
 * Funções auxiliares compartilhadas pelos módulos.
 *******************************************************/

/**
 * Formata uma data no padrão dd/MM/yyyy.
 *
 * @param {Date|string} data Data a ser formatada.
 * @return {string} Data formatada ou string vazia.
 */
function formatarData(data) {
  if (!data) return "";

  var dataValida = new Date(data);

  if (isNaN(dataValida.getTime())) {
    return "";
  }

  return Utilities.formatDate(
    dataValida,
    Session.getScriptTimeZone(),
    "dd/MM/yyyy"
  );
}

/**
 * Calcula a quantidade de dias até uma data.
 *
 * @param {Date|string} data Data de referência.
 * @return {number} Dias restantes ou 9999 para data inválida.
 */
function diasRestantes(data) {
  var futura = converterData(data);

  if (!futura) return 9999;

  var hoje = new Date();

  hoje.setHours(0, 0, 0, 0);
  futura.setHours(0, 0, 0, 0);

  return Math.floor(
    (futura.getTime() - hoje.getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

/**
 * Converte um valor em data válida.
 *
 * @param {Date|string} valor Valor de entrada.
 * @return {Date|null} Data válida ou null.
 */
function converterData(valor) {
  if (!valor) return null;

  var data = valor instanceof Date
    ? new Date(valor.getTime())
    : new Date(valor);

  if (isNaN(data.getTime())) {
    return null;
  }

  return data;
}

/**
 * Normaliza textos para comparação.
 *
 * @param {*} texto Valor de entrada.
 * @return {string} Texto normalizado.
 */
function normalizarTexto(texto) {
  if (texto === null || texto === undefined) {
    return "";
  }

  return texto.toString().trim().toUpperCase();
}

/**
 * Verifica se um status deve ser ignorado.
 *
 * @param {string} status Status do registro.
 * @return {boolean} Resultado da verificação.
 */
function statusIgnorado(status) {
  status = normalizarTexto(status);

  return CONFIG.STATUS_IGNORAR.indexOf(status) > -1;
}

/**
 * Verifica se um status permite agendamento de visita.
 *
 * @param {string} status Status do registro.
 * @return {boolean} Resultado da verificação.
 */
function statusVisita(status) {
  status = normalizarTexto(status);

  return CONFIG.STATUS_VISITA.indexOf(status) > -1;
}

/**
 * Obtém um calendário pelo ID.
 *
 * @param {string} id Identificador do calendário.
 * @return {GoogleAppsScript.Calendar.Calendar|null}
 */
function obterCalendario(id) {
  if (!id) {
    throw new Error("O ID do calendário não foi informado.");
  }

  var calendario = CalendarApp.getCalendarById(id);

  if (!calendario) {
    throw new Error(
      "Calendário não encontrado ou sem permissão de acesso."
    );
  }

  return calendario;
}

/**
 * Verifica se uma data está dentro do período informado.
 *
 * @param {Date|string} data Data de referência.
 * @param {number} dias Quantidade máxima de dias.
 * @return {boolean} Resultado da verificação.
 */
function dentroDoPeriodo(data, dias) {
  if (
    typeof dias !== "number" ||
    !Number.isFinite(dias) ||
    dias < 0
  ) {
    return false;
  }

  var restante = diasRestantes(data);

  return restante >= 0 && restante <= dias;
}

/**
 * Registra mensagens no log do Apps Script.
 *
 * Não utilize esta função para registrar dados pessoais
 * ou informações confidenciais de clientes.
 *
 * @param {string} msg Mensagem de log.
 */
function logSistema(msg) {
  Logger.log(
    "AUTOMACAO_NS-PRODUCAO | " + normalizarTexto(msg)
  );
}
