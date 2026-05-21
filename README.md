# copiloto-vendas-ia
# 🤖 Copiloto de Vendas com IA

> Ferramenta de apoio em tempo real para vendedores em loja, desenvolvida com React + Anthropic Claude API.  
> Projeto prático entregue como desafio na plataforma [DIO.me](https://www.dio.me).

---

## 📌 Sobre o Projeto

O **Copiloto de Vendas com IA** é uma solução inteligente projetada para apoiar profissionais comerciais durante atendimentos reais em loja. Utilizando IA generativa, a ferramenta estrutura pitches, responde objeções, organiza informações de produtos e orienta follow-ups — aumentando a produtividade e a assertividade no atendimento.

---

## ✨ Funcionalidades

| Ação | Descrição |
|------|-----------|
| 🎯 Gerar Pitch | Argumentos de venda persuasivos e personalizados |
| 🛡️ Responder Objeção | Contra-argumentos para objeções de preço, prazo, concorrência e necessidade |
| 📋 Ficha do Produto | Organização de informações técnicas e diferenciais do produto |
| 📲 Follow-up | Mensagens prontas para WhatsApp ou e-mail pós-atendimento |
| 👋 Script de Abordagem | Abertura para clientes que entram na loja sem pedir ajuda |
| 🤝 Técnica de Fechamento | Estratégias para converter clientes indecisos |

Além das ações rápidas, o copiloto aceita perguntas livres em linguagem natural — o vendedor pode descrever qualquer situação de atendimento e receber orientação imediata.

---

## 🛠 Tecnologias Utilizadas

- **React** (JSX com hooks)
- **Anthropic Claude API** — modelo `claude-sonnet-4-20250514`
- **CSS-in-JS** (estilos inline e animations)
- **Prompt Engineering** — system prompt especializado em contexto comercial

---

## 🖥️ Como Visualizar o Projeto

### Opção 1 — Claude.ai (mais fácil)
1. Acesse [claude.ai](https://claude.ai)
2. Cole o conteúdo do arquivo `copiloto-vendas-ia.jsx` em uma mensagem
3. Peça para o Claude renderizar como Artifact
4. O app abre diretamente no navegador, já conectado à API

### Opção 2 — Ambiente React local
```bash
# Pré-requisitos: Node.js instalado
npx create-react-app copiloto-vendas
cd copiloto-vendas
# Substitua o conteúdo de src/App.js pelo arquivo copiloto-vendas-ia.jsx
npm start
```

> ⚠️ Para rodar localmente fora do Claude.ai, é necessário configurar sua chave da [Anthropic API](https://console.anthropic.com).

---

## 📁 Estrutura do Repositório

```
📦 copiloto-vendas-ia
 ┣ 📄 copiloto-vendas-ia.jsx   # Componente React principal
 ┗ 📄 README.md                # Documentação do projeto
```

---

## 💡 Aprendizados

- Integração com a **Anthropic Claude API** via `fetch` no frontend
- Construção de **system prompts** especializados para contexto de negócio
- Gerenciamento de **histórico de conversa** para manter contexto entre mensagens
- Design de **UX conversacional** para uso em ambiente profissional real
- Aplicação prática de **IA generativa** em um problema comercial concreto

---

## 🚀 Possíveis Evoluções

- [ ] Integração com catálogo de produtos via upload de PDF
- [ ] Modo offline com respostas pré-treinadas para objeções mais comuns
- [ ] Histórico de atendimentos salvo localmente
- [ ] Dashboard de métricas de conversão por vendedor
- [ ] Versão mobile (PWA) para uso no chão de loja

---

## 👩‍💻 Autora

Desenvolvido como entrega do desafio prático da trilha de IA na [DIO.me](https://www.dio.me).

---

## 📜 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, adaptar e evoluir.
