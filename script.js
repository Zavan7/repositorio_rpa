/* Portfólio Vitor Zavan — comportamento do site (sem dependências) */
(function () {
  "use strict";

  var GITHUB_USER = "Zavan7";
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var aberto = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(aberto));
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Entrada suave das seções ---------- */
  var revelaveis = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduzMovimento) {
    var io = new IntersectionObserver(
      function (itens) {
        itens.forEach(function (item) {
          if (item.isIntersecting) {
            item.target.classList.add("in");
            io.unobserve(item.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revelaveis.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revelaveis.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Link ativo no menu ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".menu a[href^='#']:not(.btn)"));
  var secoes = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var ioMenu = new IntersectionObserver(
      function (itens) {
        itens.forEach(function (item) {
          if (item.isIntersecting) {
            links.forEach(function (a) {
              a.classList.toggle("ativo", a.getAttribute("href") === "#" + item.target.id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secoes.forEach(function (s) {
      ioMenu.observe(s);
    });
  }

  /* ---------- Terminal do hero: log simulado do Maestro ---------- */
  var term = document.getElementById("heroTerm");

  var linhas = [
    ["c-muted", "$ maestro run coleta-crm --agente go"],
    ["c-acc", "[ambiente] uv sync ......................... ok"],
    ["", "[agente]   robô resolvido na pasta aprovada"],
    ["", "[robô]     abrindo navegador (headless)"],
    ["", "[robô]     login no CRM ........................ ok"],
    ["c-warn", "[robô]     timeout no download, tentativa 2/3"],
    ["", "[robô]     baixando relatório .................. ok"],
    ["", "[robô]     consolidando 12.480 linhas com pandas"],
    ["c-ok", "✔ execução concluída em 00:01:42 · código 0"],
    ["c-muted", "→ log salvo · notificação enviada · próxima: 08:00"]
  ];

  function escreverTerminal() {
    if (!term) return;

    if (reduzMovimento) {
      linhas.forEach(function (l) {
        term.appendChild(criarLinha(l));
      });
      return;
    }

    var i = 0;
    var cursor = document.createElement("span");
    cursor.className = "cursor";

    (function proxima() {
      if (i >= linhas.length) {
        term.appendChild(cursor);
        return;
      }
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      term.appendChild(criarLinha(linhas[i]));
      term.appendChild(cursor);
      i += 1;
      setTimeout(proxima, i === 1 ? 650 : 520);
    })();
  }

  function criarLinha(par) {
    var el = document.createElement("span");
    el.className = "ln " + par[0];
    el.textContent = par[1];
    return el;
  }

  escreverTerminal();

  /* ---------- Filtro de projetos ---------- */
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".pcard");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-f");
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-c") || "").split(" ");
        card.hidden = !(f === "todos" || cats.indexOf(f) !== -1);
      });
    });
  });

  /* ---------- Certificados (data/certificados.json) ---------- */
  var certGrid = document.getElementById("certGrid");

  function textoSeguro(valor) {
    return document.createTextNode(valor == null ? "" : String(valor));
  }

  function urlSegura(url) {
    return typeof url === "string" && /^https:\/\//i.test(url) ? url : null;
  }

  function criarCert(c) {
    var card = document.createElement("article");
    card.className = "cert reveal in";

    if (c.emissor) {
      var em = document.createElement("span");
      em.className = "emissor";
      em.appendChild(textoSeguro(c.emissor));
      card.appendChild(em);
    }

    var h = document.createElement("h3");
    h.appendChild(textoSeguro(c.titulo));
    card.appendChild(h);

    if (c.data) {
      var d = document.createElement("span");
      d.className = "data";
      d.appendChild(textoSeguro(c.data));
      card.appendChild(d);
    }

    if (Array.isArray(c.tags) && c.tags.length) {
      var t = document.createElement("div");
      t.className = "tags";
      c.tags.forEach(function (tag) {
        var s = document.createElement("span");
        s.className = "tag";
        s.appendChild(textoSeguro(tag));
        t.appendChild(s);
      });
      card.appendChild(t);
    }

    var url = urlSegura(c.credencial_url);
    if (url) {
      var a = document.createElement("a");
      a.className = "go";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.appendChild(textoSeguro("ver credencial →"));
      card.appendChild(a);
    }

    return card;
  }

  if (certGrid) {
    fetch("data/certificados.json", { cache: "no-cache" })
      .then(function (r) {
        return r.ok ? r.json() : [];
      })
      .then(function (lista) {
        if (!Array.isArray(lista) || !lista.length) {
          certGrid.hidden = true;
          return;
        }
        lista.forEach(function (c) {
          if (c && c.titulo) certGrid.appendChild(criarCert(c));
        });
      })
      .catch(function () {
        certGrid.hidden = true;
      });
  }

  /* ---------- Atividade pública do GitHub ---------- */
  var kpiRepos = document.getElementById("kpiRepos");
  var painel = document.getElementById("activity");
  var corpo = document.getElementById("activityBody");

  function dataCurta(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  }

  if (kpiRepos || painel) {
    fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed")
      .then(function (r) {
        if (!r.ok) throw new Error("GitHub " + r.status);
        return r.json();
      })
      .then(function (repos) {
        var publicos = repos.filter(function (r) {
          return !r.fork;
        });

        if (kpiRepos && publicos.length) kpiRepos.textContent = String(publicos.length);

        if (!painel || !corpo) return;

        publicos
          .sort(function (a, b) {
            return new Date(b.pushed_at) - new Date(a.pushed_at);
          })
          .slice(0, 6)
          .forEach(function (r) {
            var linha = document.createElement("div");
            linha.className = "commit";

            var d = document.createElement("span");
            d.className = "d";
            d.textContent = dataCurta(r.pushed_at);

            var a = document.createElement("a");
            a.href = r.html_url;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = r.name;

            var l = document.createElement("span");
            l.className = "l";
            l.textContent = r.language || "";

            linha.appendChild(d);
            linha.appendChild(a);
            linha.appendChild(l);
            corpo.appendChild(linha);
          });

        painel.hidden = false;
      })
      .catch(function () {
        /* sem rede ou limite da API: o painel simplesmente não aparece */
      });
  }
})();
