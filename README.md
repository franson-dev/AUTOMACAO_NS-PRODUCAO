# AUTOMACAO_NS-PRODUCAO

Sistema de automação de processos operacionais desenvolvido com Google Apps Script, integrando Google Sheets, Google Calendar, Gmail e Google Forms.

## Sobre o projeto

O AUTOMACAO_NS-PRODUCAO foi desenvolvido para otimizar processos administrativos e operacionais de uma corretora de seguros, reduzindo atividades manuais, organizando acompanhamentos e automatizando notificações.

A solução utiliza uma planilha central como fonte de dados e executa rotinas automatizadas para acompanhamento de visitas e renovações.

Este repositório contém uma versão demonstrativa e sanitizada do projeto, preparada para fins de documentação, estudo e portfólio profissional.

## Funcionalidades

### 1. Agenda de Visitas
- Identificação de visitas pendentes.
- Verificação de datas programadas.
- Consulta de informações dos responsáveis.
- Criação de eventos no Google Calendar.
- Envio de notificações por e-mail.

### 2. Gestão de Renovações
- Monitoramento de datas de renovação.
- Identificação de oportunidades próximas do vencimento.
- Criação de eventos no Google Calendar.
- Geração de relatório consolidado por e-mail.

### 3. Integrações complementares
- Google Forms para processos de mapeamento.
- Triggers configurados diretamente na interface do Google Apps Script.
- Google Sheets como base central de informações.

## Tecnologias utilizadas

- Google Apps Script
- JavaScript
- Google Sheets
- Google Calendar
- Gmail
- Google Forms

## Estrutura do projeto

```text
AUTOMACAO_NS-PRODUCAO/
├── README.md
├── Codigo.gs
├── Agenda_Visitas.gs
├── Renovacoes.gs
├── Config.gs
└── Utilitarios.gs
```

## Arquitetura

A solução utiliza uma estrutura modular:

- **Codigo.gs:** apresentação e visão geral do sistema.
- **Agenda_Visitas.gs:** processamento de visitas e notificações.
- **Renovacoes.gs:** acompanhamento de renovações.
- **Config.gs:** centralização de configurações.
- **Utilitarios.gs:** funções auxiliares compartilhadas.

As configurações de formulários e acionadores (Triggers) são realizadas diretamente no ambiente do Google Apps Script.

## Instalação e configuração

1. Crie uma planilha no Google Sheets com a estrutura de colunas esperada pelo projeto.
2. Crie um projeto no Google Apps Script vinculado à planilha.
3. Adicione os arquivos `.gs` deste repositório.
4. Configure os parâmetros necessários no arquivo `Config.gs`.
5. Configure as permissões de acesso aos serviços Google utilizados.
6. Configure os calendários, destinatários e acionadores conforme seu ambiente.
7. Execute os testes em uma planilha demonstrativa antes de utilizar o sistema.

**Importante:** a estrutura da planilha, os nomes das abas e as posições das colunas precisam corresponder às configurações utilizadas pelos módulos.

## Segurança e privacidade

Este repositório é uma versão demonstrativa.

- Não contém dados reais de clientes.
- Não deve conter IDs de planilhas ou calendários privados.
- Não deve conter endereços de e-mail corporativos ou pessoais.
- As configurações sensíveis devem ser definidas pelo usuário em seu próprio ambiente.
- Recomenda-se testar todas as rotinas com dados fictícios antes da utilização.

## Objetivo

Demonstrar a aplicação de automação de processos, integração entre serviços Google e organização de rotinas operacionais utilizando Google Apps Script.

## Autor

**Welinton Franson**

Projeto desenvolvido para fins de estudo, documentação técnica e portfólio profissional.
