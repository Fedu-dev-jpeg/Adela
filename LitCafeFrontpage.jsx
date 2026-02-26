import { useState } from "react";

const C = {
  bg: "#F5F1E8",
  bgCard: "#FDFBF7",
  bgWarm: "#EDE8DC",
  bgDrawer: "#D9D1C3",
  accent: "#B8654A",
  ochre: "#C4973B",
  charcoal: "#2A2A2A",
  textSec: "#6B6458",
  textMeta: "#9A9286",
  border: "#E5DFD3",
};

const drawerItems = [
  { icon: "HM", label: "Inicio", active: true },
  { icon: "DB", label: "Tablero" },
  { icon: "CR", label: "Mis Cursos" },
  { icon: "CL", label: "Calendario" },
  { icon: "FR", label: "Foros" },
  { icon: "MS", label: "Mensajes" },
  { icon: "AD", label: "Administracion" },
];

const heroInsight = {
  tag: "Anuncio del sitio",
  title: "Por que leer a Cortazar en otono",
  excerpt:
    "Hay algo en la cadencia de Cortazar que resuena con los dias mas cortos. Sus cuentos piden cafe caliente, una manta y la voluntad de perderse en pasajes que no llevan a donde uno espera.",
  author: "Maria Elena",
  date: "24 de febrero, 2026",
  readTime: "6 min de lectura",
};

const blogPosts = [
  {
    title: "El silencio como recurso narrativo en Onetti",
    kind: "Ensayo",
    summary:
      "En Juntacadaveres, lo que no se dice construye mas que cualquier dialogo. Un analisis del vacio como herramienta literaria.",
    meta: "Maria Elena | 22 feb",
  },
  {
    title: "Cinco poetas jovenes argentinas que hay que leer ahora",
    kind: "Resena",
    summary:
      "Desde el slam porteno hasta las editoriales independientes, estas voces estan redefiniendo la poesia en castellano.",
    meta: "Maria Elena | 19 feb",
  },
  {
    title: "Guia para organizar un club de lectura en tu barrio",
    kind: "Guia",
    summary:
      "Todo lo que aprendi en tres anos de encuentros semanales: desde elegir libros hasta manejar silencios incomodos.",
    meta: "Maria Elena | 15 feb",
  },
];

const newsItems = [
  { text: "Premio Herralde 2026 para Leila Guerriero", tag: "Premio" },
  { text: "Nueva edicion anotada de Rayuela por Alfaguara", tag: "Editorial" },
  { text: "Festival de Poesia BA abre convocatoria", tag: "Evento" },
  { text: "Samanta Schweblin finalista del International Booker", tag: "Premio" },
];

const events = [
  { day: "01", month: "MAR", name: "Club de Lectura: Borges", time: "17:00" },
  { day: "05", month: "MAR", name: "Debate: Poesia y politica", time: "19:00" },
  { day: "07", month: "MAR", name: "Taller de microrrelato", time: "18:30" },
];

const socialNotes = [
  "Instagram: Tarde de lluvia perfecta para empezar con Silvina Ocampo.",
  "Facebook: Lectura en voz alta de poesia mapuche este viernes.",
  "WhatsApp: Recordatorio de capitulos 12-18 para el sabado.",
];

function Topbar({ onToggleDrawer }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: C.bgCard,
        borderBottom: `1px solid ${C.border}`,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            type="button"
            onClick={onToggleDrawer}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.charcoal,
              fontSize: 16,
              cursor: "pointer",
            }}
            aria-label="Colapsar menu lateral"
          >
            |||
          </button>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24,
              color: C.charcoal,
              whiteSpace: "nowrap",
            }}
          >
            LitCafe
          </h1>
        </div>

        <div className="lcf-front-search" style={{ flex: 1, maxWidth: 460 }}>
          <label style={{ display: "block" }}>
            <span className="sr-only">Buscar</span>
            <input
              type="search"
              placeholder="Buscar en cursos, anuncios y foros"
              style={{
                width: "100%",
                height: 38,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.bg,
                padding: "0 12px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: C.charcoal,
                outline: "none",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.textSec,
              cursor: "pointer",
              fontSize: 14,
            }}
            aria-label="Notificaciones"
          >
            !
          </button>
          <div
            style={{
              minWidth: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bgWarm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: C.charcoal,
              padding: "0 8px",
            }}
            title="Maria Elena"
          >
            ME
          </div>
        </div>
      </div>
    </header>
  );
}

function Breadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 16,
      }}
    >
      <ol
        style={{
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: 0,
          padding: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: C.textMeta,
        }}
      >
        <li style={{ color: C.charcoal }}>Inicio</li>
        <li aria-hidden="true">&gt;</li>
        <li style={{ color: C.charcoal }}>Tablero</li>
        <li aria-hidden="true">&gt;</li>
        <li style={{ color: C.textSec }}>Frontpage</li>
      </ol>
    </nav>
  );
}

function Drawer({ open }) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 64,
        left: 0,
        bottom: 0,
        width: open ? 240 : 78,
        borderRight: `1px solid ${C.border}`,
        background: C.bgDrawer,
        transition: "width 0.22s ease",
        overflow: "hidden",
        zIndex: 90,
      }}
    >
      <div style={{ padding: open ? "14px 14px 10px" : "14px 8px 10px" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.textSec,
          }}
        >
          Navegacion
        </p>
      </div>

      <nav aria-label="Menu lateral" style={{ paddingBottom: 16 }}>
        {drawerItems.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "4px 8px",
              padding: "10px 10px",
              borderRadius: 8,
              textDecoration: "none",
              border: item.active ? `1px solid ${C.border}` : "1px solid transparent",
              background: item.active ? C.bgCard : "transparent",
              color: item.active ? C.accent : C.charcoal,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: item.active ? 600 : 500,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ width: 20, textAlign: "center", color: C.textSec }}>{item.icon}</span>
            {open ? <span>{item.label}</span> : null}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Block({ title, children, footer }) {
  return (
    <section
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: `1px solid ${C.border}`,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: C.textSec,
        }}
      >
        {title}
      </div>
      <div style={{ padding: "12px 14px" }}>{children}</div>
      {footer ? (
        <div
          style={{
            padding: "10px 14px",
            borderTop: `1px solid ${C.border}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.accent,
            fontWeight: 600,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}

function HeroInsightCard() {
  return (
    <article
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <div style={{ padding: "20px 22px 18px" }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.accent,
            background: `${C.accent}12`,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            padding: "4px 8px",
            marginBottom: 12,
          }}
        >
          {heroInsight.tag}
        </span>
        <h2
          style={{
            margin: "0 0 10px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 36,
            lineHeight: 1.18,
            color: C.charcoal,
          }}
        >
          {heroInsight.title}
        </h2>
        <p
          style={{
            margin: "0 0 16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            lineHeight: 1.65,
            color: C.textSec,
          }}
        >
          {heroInsight.excerpt}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.textMeta,
          }}
        >
          {heroInsight.author} | {heroInsight.date} | {heroInsight.readTime}
        </p>
      </div>
    </article>
  );
}

function BlogStream() {
  return (
    <section
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 24,
            color: C.charcoal,
          }}
        >
          Blog literario
        </h3>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            color: C.accent,
          }}
        >
          Ver todo
        </a>
      </div>

      {blogPosts.map((post, index) => (
        <article
          key={post.title}
          style={{
            padding: "16px 18px",
            borderBottom: index === blogPosts.length - 1 ? "none" : `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: C.ochre,
              }}
            >
              {post.kind}
            </span>
          </div>
          <h4
            style={{
              margin: "0 0 8px",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 21,
              color: C.charcoal,
            }}
          >
            {post.title}
          </h4>
          <p
            style={{
              margin: "0 0 8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: C.textSec,
            }}
          >
            {post.summary}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: C.textMeta,
            }}
          >
            {post.meta}
          </p>
        </article>
      ))}
    </section>
  );
}

function RightBlocks() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Block title="Noticias" footer="Mas noticias del sitio">
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
          {newsItems.map((item) => (
            <li key={item.text}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: C.charcoal,
                }}
              >
                {item.text}
              </p>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: C.ochre,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontWeight: 700,
                }}
              >
                {item.tag}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Eventos del cafe" footer="Ir al calendario">
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
          {events.map((event) => (
            <li key={event.name} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10 }}>
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.bgWarm,
                  padding: "5px 4px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    color: C.accent,
                    fontSize: 14,
                  }}
                >
                  {event.day}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMeta,
                    letterSpacing: "0.04em",
                  }}
                >
                  {event.month}
                </p>
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: C.charcoal,
                    lineHeight: 1.4,
                  }}
                >
                  {event.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: C.textMeta,
                  }}
                >
                  {event.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Comunidad" footer="Abrir feed social">
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 9 }}>
          {socialNotes.map((note) => (
            <li
              key={note}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.45,
                color: C.textSec,
              }}
            >
              {note}
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

export default function Frontpage() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const drawerWidth = drawerOpen ? 240 : 78;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        @media (max-width: 1120px) {
          .lcf-front-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 860px) {
          .lcf-front-main {
            margin-left: 0 !important;
            padding: 78px 12px 24px !important;
          }
          .lcf-front-drawer {
            transform: translateX(-100%);
          }
          .lcf-front-search {
            display: none;
          }
        }
      `}</style>

      <Topbar onToggleDrawer={() => setDrawerOpen((v) => !v)} />

      <div className="lcf-front-drawer">
        <Drawer open={drawerOpen} />
      </div>

      <main
        className="lcf-front-main"
        style={{
          minHeight: "100vh",
          padding: "80px 18px 28px",
          marginLeft: drawerWidth,
          transition: "margin-left 0.22s ease",
        }}
      >
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Breadcrumbs />

          <div
            className="lcf-front-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2.25fr) minmax(260px, 1fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            <section>
              <HeroInsightCard />
              <BlogStream />
            </section>
            <aside>
              <RightBlocks />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
