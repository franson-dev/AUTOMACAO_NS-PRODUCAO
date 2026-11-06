/*******************************************************
 *
 * AUTOMACAO_NS-PRODUCAO
 * Sistema de Automação de Processos
 *
 * Autor: Welinton Franson
 *
 * -----------------------------------------------------
 * SOBRE O PROJETO
 * -----------------------------------------------------
 *
 * Sistema desenvolvido com Google Apps Script para
 * automatizar processos operacionais e administrativos.
 *
 * A solução utiliza o Google Sheets como base central
 * de informações e integra serviços do Google para
 * organizar acompanhamentos e notificações.
 *
 * -----------------------------------------------------
 * MÓDULOS
 * -----------------------------------------------------
 *
 * 1. Agenda de Visitas
 *    - Identificação de visitas programadas.
 *    - Criação de eventos no Google Calendar.
 *    - Envio de notificações por e-mail.
 *
 * 2. Renovações
 *    - Monitoramento de datas de renovação.
 *    - Criação de eventos no Google Calendar.
 *    - Envio de relatório consolidado por e-mail.
 *
 * 3. Mapeamento
 *    - Integração complementar com Google Forms.
 *    - Configuração realizada no ambiente Apps Script.
 *
 * 4. Utilitários
 *    - Funções auxiliares compartilhadas.
 *    - Padronização e tratamento de informações.
 *
 * 5. Configurações
 *    - Centralização de parâmetros do sistema.
 *    - Definição de abas, calendários e regras.
 *
 * -----------------------------------------------------
 * FLUXO GERAL
 * -----------------------------------------------------
 *
 *                 GOOGLE SHEETS
 *                       |
 *          +------------+------------+
 *          |            |            |
 *          v            v            v
 *     VISITAS       RENOVAÇÕES   MAPEAMENTO
 *          |            |            |
 *          v            v            v
 *      CALENDAR      CALENDAR     GOOGLE FORMS
 *          |            |
 *          v            v
 *       E-MAIL       RELATÓRIO
 *
 * -----------------------------------------------------
 * CONFIGURAÇÕES EXTERNAS
 * -----------------------------------------------------
 *
 * - Triggers configurados diretamente no Apps Script.
 * - Formulários configurados no ambiente Google.
 * - Autorizações concedidas conforme os serviços usados.
 *
 * -----------------------------------------------------
 * SEGURANÇA
 * -----------------------------------------------------
 *
 * Esta é uma versão demonstrativa e sanitizada.
 *
 * Não inserir neste projeto:
 * - Dados reais de clientes.
 * - IDs privados de planilhas ou calendários.
 * - Endereços reais de e-mail.
 * - Credenciais ou informações confidenciais.
 *
 *******************************************************/
