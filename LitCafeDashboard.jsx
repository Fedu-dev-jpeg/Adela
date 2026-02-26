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
  progressBg: "#E8E2D6",
};

const drawerItems = [
  { icon: "HM", label: "Inicio" },
  { icon: "DB", label: "Tablero", active: true },
  { icon: "CR", label: "Mis Cursos" },
  { icon: "CL", label: "Calendario" },
  { icon: "FR", label: "Foros" },
  { icon: "GR", label: "Calificaciones" },
  { icon: "MS", label: "Mensajes" },
  { icon: "PF", label: "Perfil" },
];

const courses = [
  { title: "Borges: Ficciones y Laberintos", genre: "Narrativa", progress: 72, modules: 12, completed: 9, color: "#B8654A" },
  { title: "Poesia Contemporanea Latinoamericana", genre: "Poesia", progress: 45, modules: 8, completed: 4, color: "#C4973B" },
  { title: "Cortazar y la Antinovela", genre: "Narrativa", progress: 18, modules: 10, completed: 2, color: "#7A8B6F" },
  { title: "Taller de Escritura Creativa", genre: "Taller", progress: 90, modules: 6, completed: 5, color: "#8B7A6F" },
];

const discussions = [
  {
    topic: "El tiempo circular en El jardin de senderos que se bifurcan",
    course: "Borges: Ficciones",
    replies: 14,
    lastActivity: "Hace 20 min",
  },
  {
    topic: "Forma vs contenido en Altazor",
    course: "Poesia Contemporanea",
    replies: 8,
    lastActivity: "Hace 1 hora",
  },
  {
    topic: "La Maga como simbolo",
    course: "Cortazar y la Antinovela",
    replies: 23,
    lastActivity: "Hace 3 horas",
  },
];

const readings = [
  { title: "El Aleph", author: "Borges", pagesRead: 42, totalPages: 56, lastRead: "Hace 2 horas", color: "#B8654A" },
  { title: "Rayuela", author: "Cortazar", pagesRead: 120, totalPages: 564, lastRead: "Ayer", color: "#C4973B" },
  { title: "Veinte poemas de amor", author: "Neruda", pagesRead: 18, totalPages: 32, lastRead: "Hace 3 dias", color: "#7A8B6F" },
];

const events = [
  { name: "Club de Lectura: Cuentos de Borges", date: "Sabado 1 Mar", time: "17:00", spots: 4, type: "presencial" },
  { name: "Debate abierto: Poesia y politica", date: "Miercoles 5 Mar", time: "19:00", spots: 12, type: "presencial" },
  { name: "Taller de microrrelato", date: "Viernes 7 Mar", time: "18:30", spots: 6, type: "hibrido" },
];

const socialPosts = [
  {
    source: "Instagram",
    handle: "@cafeliterario.lr",
    text: "Nueva vitrina de libros argentinos clasicos. Pasate por el cafe y descubri tu proximo favorito.",
    time: "Hace 3h",
  },
  {
    source: "Facebook",
    handle: "Cafe Literario BA",
    text: "Este sabado recibimos a la poeta Ana Garcia para una lectura intima. Cupos limitados.",
    time: "Hace 5h",
  },
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
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              cursor: "pointer",
              fontSize: 16,
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
            LitCafe LMS
          </h1>
        </div>

        <div className="lcf-dash-search" style={{ flex: 1, maxWidth: 440 }}>
          <label style={{ display: "block" }}>
            <span className="sr-only">Buscar</span>
            <input
              type="search"
              placeholder="Buscar actividades o cursos"
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
        <li style={{ color: C.textSec }}>Mis Cursos</li>
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

function ProgressBar({ value, color }) {
  return (
    <div
      style={{
        width: "100%",
        height: 7,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        background: C.progressBg,
        overflow: "hidden",
      }}
      aria-label={`Progreso ${value}%`}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
        }}
      />
    </div>
  );
}

function WelcomeCard() {
  return (
    <section
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.textMeta,
        }}
      >
        Panel principal
      </p>
      <h2
        style={{
          margin: "0 0 8px",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 34,
          lineHeight: 1.2,
          color: C.charcoal,
        }}
      >
        Bienvenida de vuelta
      </h2>
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: C.textSec,
        }}
      >
        Continua donde lo dejaste. Tienes 3 actividades pendientes y 2 foros activos para esta semana.
      </p>
    </section>
  );
}

function ActiveCourses() {
  return (
    <section
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
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
          Cursos Activos
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
          Ver todos
        </a>
      </div>

      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 12,
        }}
      >
        {courses.map((course) => (
          <article
            key={course.title}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              background: C.bg,
              padding: 12,
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: course.color,
              }}
            >
              {course.genre}
            </p>
            <h4
              style={{
                margin: "0 0 10px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20,
                color: C.charcoal,
                lineHeight: 1.25,
              }}
            >
              {course.title}
            </h4>
            <ProgressBar value={course.progress} color={course.color} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: C.textMeta,
                }}
              >
                {course.completed}/{course.modules} modulos
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: C.textSec,
                  fontWeight: 700,
                }}
              >
                {course.progress}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ForumUpdates() {
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
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 24,
          color: C.charcoal,
        }}
      >
        Debates Recientes
      </div>
      <div style={{ padding: "8px 16px" }}>
        {discussions.map((discussion, index) => (
          <article
            key={discussion.topic}
            style={{
              padding: "10px 4px",
              borderBottom: index === discussions.length - 1 ? "none" : `1px solid ${C.border}`,
            }}
          >
            <p
              style={{
                margin: "0 0 5px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.5,
                color: C.charcoal,
              }}
            >
              {discussion.topic}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: C.textMeta,
              }}
            >
              {discussion.course} | {discussion.replies} respuestas | {discussion.lastActivity}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadingBlock() {
  return (
    <Block title="Progreso de lectura" footer="Abrir biblioteca">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {readings.map((reading) => {
          const progress = Math.round((reading.pagesRead / reading.totalPages) * 100);
          return (
            <li key={reading.title} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 9 }}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18,
                  color: C.charcoal,
                }}
              >
                {reading.title}
              </p>
              <p
                style={{
                  margin: "0 0 7px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: C.textMeta,
                }}
              >
                {reading.author} | {reading.lastRead}
              </p>
              <ProgressBar value={progress} color={reading.color} />
              <p
                style={{
                  margin: "6px 0 0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: C.textSec,
                }}
              >
                {reading.pagesRead}/{reading.totalPages} paginas
              </p>
            </li>
          );
        })}
      </ul>
    </Block>
  );
}

function EventsBlock() {
  return (
    <Block title="Eventos del cafe" footer="Ir al calendario">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {events.map((event) => (
          <li key={event.name} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
            <p
              style={{
                margin: "0 0 3px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.4,
                color: C.charcoal,
              }}
            >
              {event.name}
            </p>
            <p
              style={{
                margin: "0 0 2px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: C.textMeta,
              }}
            >
              {event.date} | {event.time}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: C.ochre,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {event.type} | {event.spots} cupos
            </p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function SocialBlock() {
  return (
    <Block title="Feed social" footer="Ver mas actividad">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {socialPosts.map((post) => (
          <li key={`${post.source}-${post.time}`} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
            <p
              style={{
                margin: "0 0 3px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: C.textMeta,
              }}
            >
              {post.source} | {post.handle} | {post.time}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.45,
                color: C.textSec,
              }}
            >
              {post.text}
            </p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export default function Dashboard() {
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
          .lcf-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 860px) {
          .lcf-dash-main {
            margin-left: 0 !important;
            padding: 78px 12px 24px !important;
          }
          .lcf-dash-drawer {
            transform: translateX(-100%);
          }
          .lcf-dash-search {
            display: none;
          }
        }
      `}</style>

      <Topbar onToggleDrawer={() => setDrawerOpen((v) => !v)} />

      <div className="lcf-dash-drawer">
        <Drawer open={drawerOpen} />
      </div>

      <main
        className="lcf-dash-main"
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
            className="lcf-dashboard-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2.25fr) minmax(260px, 1fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            <section>
              <WelcomeCard />
              <ActiveCourses />
              <ForumUpdates />
            </section>
            <aside style={{ display: "grid", gap: 14 }}>
              <ReadingBlock />
              <EventsBlock />
              <SocialBlock />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
