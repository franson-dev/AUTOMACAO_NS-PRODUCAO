/*******************************************************
 * CONFIGURAÇÕES DO SISTEMA
 *
 * AUTOMACAO_NS-PRODUCAO
 *
 * IMPORTANTE:
 * Esta configuração é demonstrativa.
 * Substitua os valores de exemplo pelos dados do
 * ambiente Google que utilizará o projeto.
 *******************************************************/

const CONFIG = {

  // ================================================
  // PLANILHA
  // ================================================

  // ID da planilha Google Sheets.
  // Exemplo: "SEU_ID_DE_PLANILHA"
  ID_PLANILHA: "SUBSTITUA_PELO_ID_DA_PLANILHA",

  // Nome das abas utilizadas pelo sistema.
  ABA_BASE: "BASE_GERAL",
  ABA_GERENTES: "GERENTES",

  // ================================================
  // CALENDÁRIOS
  // ================================================

  // "primary" representa o calendário principal
  // da conta Google que executa o script.
  CALENDARIO_GERENTES: "primary",

  // Substitua pelo ID do calendário de renovações.
  CALENDARIO_GIOVANA: "SUBSTITUA_PELO_ID_DO_CALENDARIO",

  // ================================================
  // PROCESSAMENTO
  // ================================================

  LIMITE_PROCESSAMENTO: 30,

  // Quantidade de dias para acompanhamento
  // das renovações.
  DIAS_RENOVACAO: 30,

  // Antecedência para lembrete de visitas.
  DIAS_LEMBRETE_VISITA: 5,

  // ================================================
  // STATUS
  // ================================================

  STATUS_VISITA: [
    "PENDENTE",
    "MAPEAMENTO/VISITA"
  ],

  STATUS_IGNORAR: [
    "RENOVADO",
    "ENCARTEIRADO",
    "ENCARTERADO"
  ],

  // ================================================
  // NOTIFICAÇÕES
  // ================================================

  // Utilize um endereço de e-mail de teste.
  EMAIL_GIOVANA: "SEU_EMAIL_DE_TESTE",

};
