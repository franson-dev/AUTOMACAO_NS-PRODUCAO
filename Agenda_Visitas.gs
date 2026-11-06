/*******************************************************
 * AGENDA DE VISITAS
 *
 * AUTOMACAO_NS-PRODUCAO
 *
 * Responsabilidades:
 * - Identificar visitas dentro do período configurado.
 * - Consultar o responsável pela conta.
 * - Criar eventos no Google Calendar.
 * - Enviar notificações por e-mail.
 * - Registrar o processamento na planilha.
 *******************************************************/

/**
 * Processa visitas programadas na base.
 */
function agendarVisitas() {
  logSistema("INICIO AGENDA DE VISITAS");

  var planilha;
  var abaBase;
  var abaGerentes;

  try {
    planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
    abaBase = planilha.getSheetByName(CONFIG.ABA_BASE);
    abaGerentes = planilha.getSheetByName(CONFIG.ABA_GERENTES);

    if (!abaBase || !abaGerentes) {
      throw new Error("Uma ou mais abas configuradas não foram encontradas.");
    }
  } catch (erro) {
    logSistema("ERRO AO ACESSAR A PLANILHA: " + erro.message);
    return;
  }

  var ultimaLinha = abaBase.getLastRow();

  if (ultimaLinha < 12) {
    logSistema("NENHUMA LINHA PARA PROCESSAR");
    return;
  }

  var dados = abaBase
    .getRange(12, 1, ultimaLinha - 11, abaBase.getLastColumn())
    .getValues();

  var gerentes = abaGerentes.getDataRange().getValues();

  var calendario;

  try {
    calendario = obterCalendario(CONFIG.CALENDARIO_GERENTES);
  } catch (erro) {
    logSistema("ERRO AO OBTER CALENDARIO: " + erro.message);
    return;
  }

  var processados = 0;
  var limite = CONFIG.LIMITE_PROCESSAMENTO;

  for (var i = 0; i < dados.length; i++) {
    if (processados >= limite) break;

    var linha = dados[i];
    var numeroLinha = i + 12;

    try {
      // Índices das colunas (base zero).
      var checkPortal = linha[1];
      var cliente = linha[3];
      var produto = linha[6];
      var gerente = linha[7];
      var seguradora = linha[8];
      var proposta = linha[9];
      var dataVisita = linha[10];
      var status = linha[14];
      var observacoes = linha[16];

      if (normalizarTexto(checkPortal) === "OK") continue;
      if (!statusVisita(status) || statusIgnorado(status)) continue;
      if (!dentroDoPeriodo(dataVisita, CONFIG.DIAS_LEMBRETE_VISITA)) continue;

      if (!cliente || !gerente) {
        logSistema("DADOS OBRIGATORIOS AUSENTES NA LINHA " + numeroLinha);
        continue;
      }

      var emailGerente = localizarEmailGerente(gerentes, gerente);

      if (!emailGerente) {
        logSistema("RESPONSAVEL SEM EMAIL NA LINHA " + numeroLinha);
        continue;
      }

      var dataFormatada = formatarData(dataVisita);

      var tituloEvento = "Visita: " + cliente;

      var descricaoEvento = [
        "Visita programada",
        "Cliente: " + cliente,
        "Produto: " + produto,
        "Responsável: " + gerente,
        "Seguradora: " + seguradora,
        "Proposta/Apólice: " + proposta,
        "Data: " + dataFormatada,
        "Observações: " + observacoes
      ].join("\n");

      // 1. Criar ou localizar evento.
      var evento = localizarEvento(
        calendario,
        dataVisita,
        tituloEvento
      );

      if (!evento) {
        evento = calendario.createAllDayEvent(
          tituloEvento,
          converterData(dataVisita),
          { description: descricaoEvento }
        );
      }

      // 2. Enviar notificação.
      var assunto = "Lembrete de visita - " + cliente;

      var mensagem = montarEmailVisita({
        cliente: cliente,
        produto: produto,
        gerente: gerente,
        seguradora: seguradora,
        proposta: proposta,
        data: dataFormatada,
        observacoes: observacoes
      });

      var destinatarios = [emailGerente];

      if (CONFIG.EMAIL_COPIA_VISITAS) {
        destinatarios.push(CONFIG.EMAIL_COPIA_VISITAS);
      }

      MailApp.sendEmail({
        to: emailGerente,
        cc: CONFIG.EMAIL_COPIA_VISITAS || "",
        subject: assunto,
        htmlBody: mensagem
      });

      // 3. Marcar como processado somente após as operações.
      abaBase.getRange(numeroLinha, 2).setValue("OK");

      processados++;

    } catch (erro) {
      logSistema(
        "FALHA NO PROCESSAMENTO DA LINHA " +
        numeroLinha + ": " + erro.message
      );
    }
  }

  logSistema("VISITAS PROCESSADAS: " + processados);
}

/**
 * Localiza o e-mail do gerente na aba de responsáveis.
 *
 * Coluna B: nome do gerente.
 * Coluna C: e-mail.
 *
 * @param {Array} gerentes Dados da aba de gerentes.
 * @param {string} nomeGerente Nome a pesquisar.
 * @return {string} E-mail encontrado ou vazio.
 */
function localizarEmailGerente(gerentes, nomeGerente) {
  var nomeProcurado = normalizarTexto(nomeGerente);

  for (var i = 0; i < gerentes.length; i++) {
    var nome = normalizarTexto(gerentes[i][1]);
    var email = gerentes[i][2];

    if (nome === nomeProcurado && email) {
      return email.toString().trim();
    }
  }

  return "";
}

/**
 * Localiza evento existente na mesma data e com o mesmo título.
 *
 * @param {GoogleAppsScript.Calendar.Calendar} calendario Calendário.
 * @param {Date|string} data Data do evento.
 * @param {string} titulo Título do evento.
 * @return {GoogleAppsScript.Calendar.CalendarEvent|null}
 */
function localizarEvento(calendario, data, titulo) {
  var dataEvento = converterData(data);

  if (!dataEvento) {
    throw new Error("Data inválida para localizar evento.");
  }

  var inicio = new Date(dataEvento);
  inicio.setHours(0, 0, 0, 0);

  var fim = new Date(inicio);
  fim.setDate(fim.getDate() + 1);

  var eventos = calendario.getEvents(inicio, fim);
  var tituloProcurado = normalizarTexto(titulo);

  for (var i = 0; i < eventos.length; i++) {
    if (normalizarTexto(eventos[i].getTitle()) === tituloProcurado) {
      return eventos[i];
    }
  }

  return null;
}

/**
 * Monta o corpo HTML do e-mail de visita.
 *
 * @param {Object} dados Informações da visita.
 * @return {string} HTML do e-mail.
 */
function montarEmailVisita(dados) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Lembrete de visita</h2>

      <p>Uma visita programada foi identificada no sistema.</p>

      <table cellpadding="8" cellspacing="0" border="1"
        style="border-collapse: collapse; border-color: #ddd;">

        <tr>
          <td><strong>Cliente</strong></td>
          <td>${escaparHTML(dados.cliente)}</td>
        </tr>

        <tr>
          <td><strong>Produto</strong></td>
          <td>${escaparHTML(dados.produto)}</td>
        </tr>

        <tr>
          <td><strong>Responsável</strong></td>
          <td>${escaparHTML(dados.gerente)}</td>
        </tr>

        <tr>
          <td><strong>Seguradora</strong></td>
          <td>${escaparHTML(dados.seguradora)}</td>
        </tr>

        <tr>
          <td><strong>Proposta/Apólice</strong></td>
          <td>${escaparHTML(dados.proposta)}</td>
        </tr>

        <tr>
          <td><strong>Data</strong></td>
          <td>${escaparHTML(dados.data)}</td>
        </tr>

        <tr>
          <td><strong>Observações</strong></td>
          <td>${escaparHTML(dados.observacoes)}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        Mensagem automática do sistema de acompanhamento.
      </p>
    </div>
  `;
}

/**
 * Escapa caracteres especiais para uso em HTML.
 *
 * @param {*} valor Valor de entrada.
 * @return {string} Texto seguro para HTML.
 */
function escaparHTML(valor) {
  return String(valor === null || valor === undefined ? "" : valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
