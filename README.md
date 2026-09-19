# NORAH — A operação por trás do seu negócio

Website institucional da **Norah** (*Núcleo de Organização, Relacionamento e Apoio Humanizado*), operação boutique de apoio administrativo remoto e relacionamento para profissionais autônomos, consultórios, clínicas, pequenos negócios e empresas de serviços.

> *"Nem toda a operação do seu negócio precisa depender de você."*

---

## 🏛️ Identidade Visual & Design Editorial

- **Paleta Proporcional**:
  - `60%` **Creme** (`#F4EDE2`): Fundos principais, leveza e respiração editorial.
  - `20%` **Café Profundo** (`#493C35`): Tipografia primária, rodapé e heroico CTA final.
  - `10%` **Verde Oliva** (`#727A5B`): Acentos refinados, tags ativas, badges e marcadores.
  - `10%` **Bege Areia** (`#CFC0AA`): Bordas sutis e divisores elegantes.
  - **Preto Suave** (`#252525`): Textos corridos com contraste acessível (WCAG AAA).
- **Tipografia**: *Playfair Display* (serifa editorial nobre) com *Plus Jakarta Sans* (geometria e legibilidade moderna).
- **Composição**: Respiração generosa, grid editorial, microinterações discretas, sem glassmorphism exagerado ou aparência de template genérico.

---

## ✨ Funcionalidades

- **Frentes e capacidades**:
  - Cinco frentes: atendimento, agenda, organização administrativa, financeiro operacional e apoio à operação.
  - Capacidades Essencial, Profissional e Integral como referências de dimensionamento, sem pacotes de tarefas ou preços fixos.
- **SEO Técnico para 1ª Página do Google**:
  - HTML5 semântico com indexação estática instantânea.
  - Dados estruturados Schema.org JSON-LD (`ProfessionalService`, `FAQPage`, `BreadcrumbList`).
  - Metatags completas Open Graph e Twitter Cards.
  - Arquivos `robots.txt` e `sitemap.xml` configurados.
- **Modal de conversa & WhatsApp**:
  - Formulário modal com seleção opcional das frentes e descrição do principal gargalo.
  - Geração de link pré-formatado para o WhatsApp oficial da Norah.

---

## 🚀 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)

### Instalação e Desenvolvimento
```bash
# Clone o repositório
git clone https://github.com/jeancatarina/nora.git
cd nora

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Visualização Estática Direta
O projeto também roda perfeitamente em qualquer servidor HTTP estático, sem necessidade de build:
```bash
npx serve .
# ou com Python:
python3 -m http.server 3000
```

---

## 📁 Estrutura de Pastas

```
nora/
├── index.html              # HTML5 semântico + SEO JSON-LD + Metatags
├── favicon.svg             # Monograma tipográfico SVG
├── og-image.svg            # Card Open Graph para redes sociais
├── robots.txt              # Instruções para Googlebot
├── sitemap.xml             # Mapa do site para indexação
├── package.json            # Configurações do projeto
├── vite.config.js          # Configurações Vite
└── src/
    ├── main.js             # Menu, modal, WhatsApp e interações leves
    ├── vendor/
    │   └── three.module.js # Three.js minificado
    └── styles/
        ├── variables.css   # Paleta (#493C35, #F4EDE2, #727A5B, #CFC0AA)
        ├── typography.css  # Playfair Display + Plus Jakarta Sans
        ├── layout.css      # Grid editorial e espaçamento
        ├── components.css  # Cards, tags selecionáveis, modal
        └── animations.css  # Microinterações discretas
```

---

## 📄 Licença

Projeto desenvolvido para **NORA — Núcleo de Organização, Relacionamento e Apoio**. Todos os direitos reservados.
