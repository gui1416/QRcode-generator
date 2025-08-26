# Gerador de QR Code e Encurtador de Links

Uma aplicação web moderna e intuitiva para gerar QR Codes e encurtar URLs de forma rápida e eficiente. Construída com Next.js, a ferramenta oferece uma experiência de usuário fluida e armazena o histórico de suas atividades localmente no navegador.

### ✨ **[Acesse a demonstração ao vivo](https://qrl-ink-all.vercel.app/)** ✨

## 🚀 Funcionalidades Principais

  * **Gerador de QR Code:** Crie QR Codes instantaneamente a partir de qualquer URL válida.
  * **Download em PNG:** Baixe os QR Codes gerados em formato de imagem PNG com alta qualidade.
  * **Encurtador de URL:** Transforme links longos em URLs curtas e fáceis de compartilhar usando a API `is.gd`.
  * **Histórico Local:** Acompanhe os últimos 30 links encurtados e QR Codes gerados. Seu histórico é salvo diretamente no navegador para acesso rápido.
  * **Interface Responsiva:** Totalmente adaptado para funcionar perfeitamente em desktops, tablets e dispositivos móveis.
  * **Tema Claro e Escuro:** Alterne entre os modos claro e escuro para uma visualização mais confortável.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um conjunto de tecnologias modernas para garantir performance e uma ótima experiência de desenvolvimento:

  * **Framework:** [Next.js](https://nextjs.org/)
  * **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
  * **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
  * **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/)
  * **Geração de QR Code:** [qrcode.react](https://github.com/zpao/qrcode.react)
  * **Notificações:** [Sonner](https://www.google.com/search?q=https://sonner.emilkowal.ski/)
  * **Ícones:** [Lucide React](https://lucide.dev/)
  * **Deployment:** [Vercel](https://vercel.com/)

## ⚙️ Como Executar o Projeto Localmente

Para executar este projeto em seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (versão 18.x ou superior)
  * [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), ou [pnpm](https://pnpm.io/)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/qrcode-generator.git
    cd qrcode-generator
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

4.  **Abra o navegador:**
    Acesse [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) para ver a aplicação em execução.

## 📁 Estrutura do Projeto

O projeto segue a estrutura padrão do Next.js com o App Router:

```
/src
├── @types/          # Tipos globais
├── app/             # Rotas da aplicação (App Router)
│   ├── api/         # Rotas de API
│   │   └── shorten/ # Endpoint para encurtar URL
│   ├── layout.tsx   # Layout principal
│   └── page.tsx     # Página inicial
├── components/      # Componentes React reutilizáveis
│   ├── ui/          # Componentes gerados pelo Shadcn/ui
│   └── *.tsx        # Componentes principais da aplicação
├── contexts/        # Contextos React (ex: HistoryContext)
├── hooks/           # Hooks customizados (ex: useHistory, useMobile)
└── lib/             # Funções utilitárias
```

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas\! Se você tiver alguma ideia para melhorar o projeto, sinta-se à vontade para:

1.  Fazer um **Fork** deste repositório.
2.  Criar uma nova **Branch** (`git checkout -b feature/sua-feature`).
3.  Fazer **Commit** de suas alterações (`git commit -m 'Adiciona nova feature'`).
4.  Fazer **Push** para a Branch (`git push origin feature/sua-feature`).
5.  Abrir um **Pull Request**.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.