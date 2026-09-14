# NORA — Gestão, Atendimento & Suporte Administrativo Boutique

Website institucional e interativo da **NORA** (*Núcleo de Organização, Relacionamento e Apoio*), empresa boutique de serviços e suporte administrativo remoto voltada para profissionais autônomos, consultórios, clínicas, pequenos negócios e empresas de serviços.

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

- **Experiência 3D Interativa em Three.js**:
  - Conceito: *"Transformar complexidade em organização"*.
  - Tarefas, documentos, mensagens, eventos de agenda e processos começam dispersos e convergem suavemente para uma matriz organizada conforme o usuário rola a página ou move o cursor.
  - Otimizado com `IntersectionObserver` para pausar rendering quando fora de foco (0% de impacto na bateria).
- **Formatos de Contratação**:
  - 4 cards apresentando modelos comuns de apoio: **Agenda**, **Atendimento**, **Administrativo** e **Monte do seu jeito** (Card 4 com 15 tags interativas selecionáveis).
  - *Sem exibição de preços fixos* — todo orçamento é personalizado sob medida.
- **Calculadora de Economia Operacional**:
  - Apresenta a economia comparativa de terceirizar rotinas versus carregar os custos integrais de um funcionário interno CLT (encargos, FGTS, 13º, férias + 1/3, benefícios e ociosidade de horas).
  - Resultado em percentual marcante (*"Até 64% de redução no custo da estrutura administrativa"*).
  - Gaveta expansível *"Ver como calculamos"* com premissas detalhadas e controles interativos.
- **SEO Técnico para 1ª Página do Google**:
  - HTML5 semântico com indexação estática instantânea.
  - Dados estruturados Schema.org JSON-LD (`ProfessionalService`, `FAQPage`, `BreadcrumbList`).
  - Metatags completas Open Graph e Twitter Cards.
  - Arquivos `robots.txt` e `sitemap.xml` configurados.
- **Modal de Orçamento & WhatsApp**:
  - Formulário modal com sincronização automática das tags selecionadas no Card 4.
  - Geração de link pré-formatado direto para atendimento no WhatsApp.

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
    ├── main.js             # Inicializador, controle de modal e tags
    ├── scene3d.js          # Experiência 3D Three.js
    ├── calculator.js       # Calculadora de economia operacional
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
