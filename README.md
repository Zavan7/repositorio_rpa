# Portfólio · Vitor Zavan

Site estático (HTML, CSS e JavaScript puros) hospedado no GitHub Pages, com o mesmo tema visual do **Maestro**: IBM Plex, fundo azul petróleo, acento azul royal e janelas no estilo terminal.

## O que tem no site

- **Hero** com o log simulado de uma execução do Maestro
- **Maestro** em destaque: arquitetura (Django, Celery, Redis, Channels e agente em Go) e principais recursos
- **Automações** (foco principal) com filtro por ferramenta e tema, seção de **backend** (Blog, E-commerce, Eco) e atividade recente puxada ao vivo da API pública do GitHub
- **Stack**, **trajetória** e **certificados**
- Contato, responsivo, com suporte a `prefers-reduced-motion`

## Estrutura

```text
index.html               página única
style.css                tema (tokens iguais aos do Maestro)
script.js                menu, animações, filtro, certificados e API do GitHub
data/certificados.json   lista de certificados (edite aqui)
images/logo-mark.svg     logo do Maestro, usado também como favicon
```

## Como adicionar um certificado

Edite `data/certificados.json` e acrescente um objeto à lista. Só `titulo` é obrigatório; `credencial_url` precisa começar com `https://`.

```json
[
  {
    "titulo": "Nome do curso",
    "emissor": "Instituição",
    "data": "Out/2026",
    "credencial_url": "https://exemplo.com/credencial/123",
    "tags": ["Python", "SQL"]
  }
]
```

Com a lista vazia (`[]`), a seção mostra apenas o convite para ver os certificados no LinkedIn.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000. É preciso servir por HTTP (e não abrir o arquivo direto) para o `fetch` dos certificados funcionar.

## Publicação

GitHub Pages a partir da branch principal, pasta raiz. O arquivo `.nojekyll` evita o processamento do Jekyll.
