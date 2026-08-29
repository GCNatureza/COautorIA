# COautorIA 🎓✨
### Assistente de Escrita Científica para Mostras do Conhecimento e Feiras de Ciências

O **COautorIA** é uma aplicação web full-stack desenvolvida em **React 19**, **TypeScript**, **Tailwind CSS** e **Node.js/Express**, integrada à **API Gemini da Google (@google/genai)**.

A plataforma foi projetada para auxiliar estudantes da Educação Básica (Ensino Fundamental Anos Finais e Ensino Médio) a transformar seus rascunhos informais em textos científicos com rigor metodológico, organizados na **Regra dos 2 Parágrafos por Seção**, além de fornecer justificativas pedagógicas detalhadas e sugestões de fontes de pesquisa acadêmicas.

---

## 🚀 Funcionalidades Principais

- **Escrita Seção por Seção:** Suporte a todas as etapas canônicas de um projeto científico:
  - *Introdução* (Contexto amplo e delimitação do problema)
  - *Justificativa* (Relevância social/tecnológica e impacto da solução)
  - *Problema e Hipótese* (Pergunta norteadora e hipótese testável)
  - *Objetivos* (Objetivo Geral e Objetivos Específicos)
  - *Metodologia* (Materiais/amostras e procedimentos experimentais)
  - *Resultados e Discussão* (Apresentação de dados e confronto analítico)
  - *Conclusão* (Validação da hipótese e pesquisas futuras)
  - *Resumo Geral / Abstract* (Síntese estruturada do projeto)
- **Regra dos 2 Parágrafos:** Cada seção gerada é estruturada estritamente em **dois parágrafos** coesos e progressivos, ideais para cadernos de campo, banners e relatórios de feiras científicas.
- **Relatório Pedagógico de Alterações:** Identificação dos trechos modificados categorizados em:
  - *Gramática e Ortografia*
  - *Clareza e Coesão*
  - *Linguagem Científica e Voz Impessoal*
  - *Estrutura e Síntese*
- **Sugestão de Fontes e Referências Reais:** Indicações de bases acadêmicas confiáveis com termos de busca prontos e atalhos diretos para o **Google Acadêmico** e **SciELO**.
- **Dicas para Banca Avaliadora:** Recomendações práticas para defender a seção apresentada diante dos avaliadores.
- **Visualização Comparativa e Exportação:** Comparação lado a lado (Antes vs. Depois) e cópia/download do texto formatado em `.txt`.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend / Servidor:** Express.js, TypeScript (`tsx` em dev e `esbuild` em produção).
- **Inteligência Artificial:** Google Gemini API (`@google/genai` com modelo `gemini-3.7-flash`).
- **Build Tool:** Vite 6.

---

## 📦 Como Instalar e Rodar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **NPM** ou gerenciador de pacotes equivalente
- Chave de API do Google Gemini ([Google AI Studio](https://aistudio.google.com/))

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU-USUARIO/coautoria.git
cd coautoria
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```bash
cp .env.example .env
```
Edite o arquivo `.env` e adicione sua chave:
```env
GEMINI_API_KEY=sua_chave_aqui_do_google_ai_studio
```

### 4. Iniciar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

---

## 🏗️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor Express com suporte a Vite em modo de desenvolvimento (porta 3000).
- `npm run build`: Compila a interface estática do React e empacota o backend para produção com `esbuild` em `dist/server.cjs`.
- `npm start`: Inicia o servidor em modo de produção a partir do build compilado.
- `npm run lint`: Executa a verificação estática de tipos TypeScript com `tsc --noEmit`.

---

## 🌐 Como Publicar no GitHub

1. Inicialize o repositório git local (se ainda não o fez):
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - COautorIA"
   ```

2. Crie um novo repositório no [GitHub](https://github.com/new).

3. Vincule e envie seu código:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git push -u origin main
   ```

> 💡 **Nota de Segurança:** Nunca envie seu arquivo `.env` com sua chave real para o GitHub. O arquivo `.gitignore` já está configurado para proteger suas credenciais.

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
