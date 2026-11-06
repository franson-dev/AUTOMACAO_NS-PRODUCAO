/*******************************************************
 * GESTÃO DE RENOVAÇÕES
 *
 * AUTOMACAO_NS-PRODUCAO
 *
 * Responsabilidades:
 * - Identificar renovações próximas do vencimento.
 * - Criar eventos no Google Calendar.
 * - Gerar relatório consolidado.
 * - Enviar notificações por e-mail.
 *******************************************************/

/**
 * Processa os registros de renovação.
 */
function processarRenovacoes() {
  logSistema("INICIO PROCESSAMENTO DE RENOVACOES");

  var planilha;
  var abaBase;
  var calendario;

  try {
    planilha = SpreadsheetApp.openById(CONFIG.ID_PLANILHA);
    abaBase = planilha.getSheetByName(CONFIG.ABA_BASE);

    if (!abaBase) {
      throw new Error("A aba principal não foi encontrada.");
    }

    calendario = obterCalendario(CONFIG.CALENDARIO_GIOVANA);

  } catch (erro) {
    logSistema("ERRO NA INICIALIZACAO: " + erro.message);
    return;
  }

  var ultimaLinha = abaBase.getLastRow();

  if (ultimaLinha < 12) {
    logSistema("NENHUM REGISTRO PARA PROCESSAR");
    return;
  }

  var dados = abaBase
    .getRange(12, 1, ultimaLinha - 11, abaBase.getLastColumn())
    .getValues();

  var relatorio = [];
  var processados = 0;
  var limite = CONFIG.LIMITE_PROCESSAMENTO;

  for (var i = 0; i < dados.length; i++) {
    if (processados >= limite) break;

    var linha = dados[i];
    var numeroLinha = i + 12;

    try {
      // Índices das colunas (base zero).
      var cliente = linha[3];
      var produto = linha[6];
      var gerente = linha[7];
      var dataRenovacao = linha[12];
      var status = linha[14];
      var checkRenovacao = linha[18];

      if (normalizarTexto(checkRenovacao) === "OK") continue;
      if (statusIgnorado(status)) continue;

      if (!dentroDoPeriodo(dataRenovacao, CONFIG.DIAS_RENOVACAO)) {
        continue;
      }

      if (!cliente || !produto || !dataRenovacao) {
        logSistema("DADOS OBRIGATORIOS AUSENTES NA LINHA " + numeroLinha);
        continue;
      }

      var dias = diasRestantes(dataRenovacao);
      var dataFormatada = formatarData(dataRenovacao);

      var tituloEvento = "RENOVACAO: " + cliente + " (" + produto + ")";

      // 1. Criar ou localizar evento.
      var evento = localizarEvento(
        calendario,
        dataRenovacao,
        tituloEvento
      );

      if (!evento) {
        calendario.createAllDayEvent(
          tituloEvento,
          converterData(dataRenovacao),
          {
            description: [
              "Acompanhamento de renovação",
              "Cliente: " + cliente,
              "Produto: " + produto,
              "Responsável: " + gerente,
              "Data de renovação: " + dataFormatada,
              "Dias restantes: " + dias
            ].join("\n")
          }
        );
      }

      // 2. Preparar relatório.
      relatorio.push({
        cliente: cliente,
        produto: produto,
        gerente: gerente,
        data: dataFormatada,
        dias: dias
      });

      // 3. Marcar registro como processado.
      abaBase.getRange(numeroLinha, 19).setValue("OK");

      processados++;

    } catch (erro) {
      logSistema(
        "ERRO NA LINHA " + numeroLinha + ": " + erro.message
      );
    }
  }

  // 4. Enviar relatório consolidado.
  if (relatorio.length > 0) {
    try {
      enviarRelatorioRenovacoes(relatorio);

      logSistema(
        "RELATORIO ENVIADO. REGISTROS: " + relatorio.length
      );

    } catch (erro) {
      logSistema("ERRO NO ENVIO DO RELATORIO: " + erro.message);
    }
  } else {
    logSistema("NENHUMA RENOVACAO IDENTIFICADA");
  }

  logSistema("PROCESSAMENTO FINALIZADO: " + processados);
}

/**
 * Envia o relatório consolidado de renovações.
 *
 * @param {Array<Object>} registros Registros identificados.
 */
function enviarRelatorioRenovacoes(registros) {
  if (!CONFIG.EMAIL_GIOVANA) {
    throw new Error("Destinatário do relatório não configurado.");
  }

  var linhas = registros.map(function(registro) {
    return `
      <tr>
        <td>${escaparHTML(registro.cliente)}</td>
        <td>${escaparHTML(registro.produto)}</td>
        <td>${escaparHTML(registro.gerente)}</td>
        <td>${escaparHTML(registro.data)}</td>
        <td>${escaparHTML(registro.dias)}</td>
      </tr>
    `;
  }).join("");

  var html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Relatório de Renovações</h2>

      <p>
        Foram identificadas ${registros.length}
        renovações dentro do período configurado.
      </p>

      <table cellpadding="8" cellspacing="0" border="1"
        style="border-collapse: collapse; border-color: #ddd;">

        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Responsável</th>
            <th>Renovação</th>
            <th>Dias restantes</th>
          </tr>
        </thead>

        <tbody>
          ${linhas}
        </tbody>
      </table>

      <p style="margin-top: 20px;">
        Mensagem automática do sistema de acompanhamento.
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.EMAIL_GIOVANA,
    subject: "[AUTOMACAO] Relatorio de Renovacoes",
    htmlBody: html
  });
}
