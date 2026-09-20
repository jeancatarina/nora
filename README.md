# NORAH — A operação por trás do seu negócio

Site institucional da Norah — Núcleo de Organização, Relacionamento e Apoio Humanizado. A Norah oferece apoio administrativo remoto, atendimento e relacionamento para profissionais autônomos, clínicas, consultórios, empresas de serviços e pequenos negócios.

## Conteúdo e posicionamento

- Frentes de atuação: Atendimento & Relacionamento, Agenda & Rotina de Clientes, Organização Administrativa, Financeiro Operacional e Apoio à Operação.
- Processo personalizado: Entender, Mapear, Dimensionar, Personalizar e Operar.
- Capacidades Essencial, Profissional e Integral como referências de capacidade operacional, sem preços ou pacotes fixos de tarefas.
- Comunicação explícita de que a contratação não é por hora ou tarefa, e de que o financeiro é operacional — não contábil, consultivo ou decisório.
- Formulário de conversa que monta uma mensagem para o WhatsApp oficial da Norah.

## SEO e acessibilidade

- HTML semântico, hierarquia de headings, textos alternativos e estados de foco visíveis.
- Schema.org para `Organization`/`ProfessionalService` e `FAQPage`.
- Metadados Open Graph e Twitter Card.
- `robots.txt`, `sitemap.xml` e canonical apontando para a publicação atual.
- Identidade editorial recuperada da versão anterior: marca monumental, textura de parede, luz natural, folhagem e transição da marca na rolagem.
- Fontes Cormorant Garamond e Plus Jakarta Sans hospedadas localmente; imagens WebP e conteúdo principal disponível sem JavaScript.

## Desenvolvimento

Requer Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

O build é gerado em `dist/` pelo Vite. A publicação atual do GitHub Pages usa a raiz da branch `main`, que mantém a mesma experiência sem etapa de servidor.

## Publicação atual

O site está publicado em [jeancatarina.github.io/nora](https://jeancatarina.github.io/nora/). Quando `sounorah.com.br` for conectado, será necessário atualizar o domínio do Pages e os campos `canonical`, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml`.

## Estrutura principal

```text
index.html                  Conteúdo, SEO e dados estruturados
src/main.js                 Menu, modal, formulário e interações leves
src/styles/site.css         Sistema visual responsivo
src/editorial-motion.js     Transição da marca e movimento da folhagem
src/fonts/                  Fontes locais e licenças
public/images/              Imagens WebP usadas pelo site
robots.txt e sitemap.xml    Arquivos de indexação da publicação atual
```

Projeto proprietário da Norah.
