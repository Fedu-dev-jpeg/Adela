import { useState } from "react";

const COLORS = {
  bg: "#F5F1E8",
  bgCard: "#FDFBF7",
  bgSidebar: "#EDE8DC",
  accent: "#B8654A",
  accentHover: "#A0573F",
  ochre: "#C4973B",
  ochreLight: "#F0E4C8",
  charcoal: "#2A2A2A",
  textSecondary: "#6B6458",
  textMeta: "#9A9286",
  border: "#E5DFD3",
  progressBg: "#E8E2D6",
  shadow: "0 2px 16px rgba(42,42,42,0.06)",
  shadowHover: "0 4px 24px rgba(42,42,42,0.1)",
};

const sidebarItems = [
  { label: "Inicio", active: true },
  { label: "Mis Cursos" },
  { label: "Biblioteca" },
  { label: "Foros" },
  { label: "Calendario" },
  { label: "Eventos del Cafe" },
  { label: "Calificaciones" },
  { label: "Mensajes" },
  { label: "Perfil" },
];

const courses = [
  { title: "Borges: Ficciones y Laberintos", genre: "Narrativa", progress: 72, modules: 12, completed: 9, color: "#B8654A" },
  { title: "Poesia Contemporanea Latinoamericana", genre: "Poesia", progress: 45, modules: 8, completed: 4, color: "#C4973B" },
  { title: "Cortazar y la Antinovela", genre: "Narrativa", progress: 18, modules: 10, completed: 2, color: "#7A8B6F" },
  { title: "Taller de Escritura Creativa", genre: "Taller", progress: 90, modules: 6, completed: 5, color: "#8B7A6F" },
];

const readings = [
  { title: "El Aleph", author: "Borges", pagesRead: 42, totalPages: 56, lastRead: "Hace 2 horas" },
  { title: "Rayuela", author: "Cortazar", pagesRead: 120, totalPages: 564, lastRead: "Ayer" },
  { title: "Veinte poemas de amor", author: "Neruda", pagesRead: 18, totalPages: 32, lastRead: "Hace 3 dias" },
];

const discussions = [
  { topic: "El tiempo circular en El jardin de senderos que se bifurcan", course: "Borges: Ficciones", replies: 14, lastActivity: "Hace 20 min", active: true },
  { topic: "Forma vs contenido en Altazor", course: "Poesia Contemporanea", replies: 8, lastActivity: "Hace 1 hora", active: true },
  { topic: "La Maga como simbolo", course: "Cortazar y la Antinovela", replies: 23, lastActivity: "Hace 3 horas", active: false },
];

const events = [
  { name: "Club de Lectura: Cuentos de Borges", date: "Sabado 1 Mar", time: "17:00", spots: 4, type: "presencial" },
  { name: "Debate abierto: Poesia y politica", date: "Miercoles 5 Mar", time: "19:00", spots: 12, type: "presencial" },
  { name: "Taller de microrrelato", date: "Viernes 7 Mar", time: "18:30", spots: 6, type: "hibrido" },
];

const socialPosts = [
  { source: "Instagram", handle: "@cafeliterario.lr", text: "Nueva vitrina de libros argentinos clasicos. Pasate por el cafe y descubri tu proximo favorito.", time: "Hace 3h", likes: 47 },
  { source: "Facebook", handle: "Cafe Literario BA", text: "Este sabado recibimos a la poeta Ana Garcia para una lectura intima. Cupos limitados.", time: "Hace 5h", likes: 32 },
];

function Sidebar({ open, onToggle }) {
  return (
    <>
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          top: 20,
          left: open ? 264 : 16,
          zIndex: 50,
          background: COLORS.accent,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          width: 40,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: COLORS.shadow,
        }}
      >
        {open ? "\u2190" : "\u2192"}
      </button>

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 260,
          height: "100vh",
          background: COLORS.bgSidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          padding: "32px 0",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: COLORS.charcoal,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            LitCafe
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              fontSize: 12,
              color: COLORS.textMeta,
              margin: "4px 0 0",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Plataforma de Aprendizaje
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {sidebarItems.map((item, i) => (
            <a
              key={i}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                padding: "12px 24px",
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                fontSize: 14,
                fontWeight: item.active ? 600 : 400,
                color: item.active ? COLORS.accent : COLORS.charcoal,
                textDecoration: "none",
                background: item.active ? "rgba(184,101,74,0.08)" : "transparent",
                borderRight: item.active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: "0 24px" }}>
          <div
            style={{
              background: COLORS.bgCard,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: COLORS.textSecondary,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Proximo evento presencial en <strong style={{ color: COLORS.accent }}>2 dias</strong>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.charcoal,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: COLORS.textMeta,
            margin: "4px 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProgressBar({ value, color, height = 6 }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: COLORS.progressBg,
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color || COLORS.accent,
          borderRadius: height,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div
      style={{
        background: COLORS.bgCard,
        borderRadius: 24,
        padding: 24,
        boxShadow: COLORS.shadow,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = COLORS.shadowHover;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = COLORS.shadow;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 20,
            background: `${course.color}14`,
            color: course.color,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {course.genre}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 17,
          fontWeight: 600,
          color: COLORS.charcoal,
          margin: "0 0 16px",
          lineHeight: 1.35,
        }}
      >
        {course.title}
      </h3>
      <ProgressBar value={course.progress} color={course.color} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: COLORS.textSecondary,
          }}
        >
          {course.completed} de {course.modules} modulos
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: course.color,
          }}
        >
          {course.progress}%
        </span>
      </div>
    </div>
  );
}

function ReadingItem({ reading }) {
  const pct = Math.round((reading.pagesRead / reading.totalPages) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 0",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 56,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${COLORS.ochreLight}, ${COLORS.bgSidebar})`,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            color: COLORS.charcoal,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {reading.title}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: COLORS.textMeta,
            margin: "2px 0 8px",
          }}
        >
          {reading.author}
        </p>
        <ProgressBar value={pct} color={COLORS.ochre} height={4} />
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.charcoal,
            margin: 0,
          }}
        >
          {reading.pagesRead}/{reading.totalPages}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: COLORS.textMeta,
            margin: "2px 0 0",
          }}
        >
          {reading.lastRead}
        </p>
      </div>
    </div>
  );
}

function DiscussionItem({ discussion }) {
  return (
    <div
      style={{
        padding: 20,
        background: COLORS.bgCard,
        borderRadius: 20,
        boxShadow: COLORS.shadow,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {discussion.active && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#7A8B6F",
              flexShrink: 0,
              marginTop: 6,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.charcoal,
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {discussion.topic}
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: COLORS.textMeta,
              }}
            >
              {discussion.course}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: COLORS.textSecondary,
              }}
            >
              {discussion.replies} respuestas
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: COLORS.textMeta,
              }}
            >
              {discussion.lastActivity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div
      style={{
        padding: 20,
        background: COLORS.bgCard,
        borderRadius: 20,
        boxShadow: COLORS.shadow,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${COLORS.accent}18, ${COLORS.accent}08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.accent,
          }}
        >
          {event.date.split(" ")[1]}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.charcoal,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {event.name}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.textMeta }}>
            {event.date}, {event.time}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.ochre,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {event.type}
          </span>
        </div>
      </div>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: COLORS.textSecondary,
          flexShrink: 0,
        }}
      >
        {event.spots} cupos
      </span>
    </div>
  );
}

function SocialPost({ post }) {
  return (
    <div
      style={{
        padding: 20,
        background: COLORS.bgCard,
        borderRadius: 20,
        boxShadow: COLORS.shadow,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: post.source === "Instagram"
                ? "linear-gradient(135deg, #C13584, #F56040)"
                : "#1877F2",
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.charcoal, margin: 0 }}>
              {post.handle}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.textMeta, margin: 0 }}>
              {post.source}
            </p>
          </div>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.textMeta }}>
          {post.time}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: COLORS.textSecondary,
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {post.text}
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: COLORS.accent,
            cursor: "pointer",
            padding: 0,
            fontWeight: 500,
          }}
        >
          Compartir en IG
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: COLORS.accent,
            cursor: "pointer",
            padding: 0,
            fontWeight: 500,
          }}
        >
          Compartir en FB
        </button>
      </div>
    </div>
  );
}

function WelcomeHeader() {
  return (
    <div style={{ marginBottom: 40 }}>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.charcoal,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        Bienvenida de vuelta
      </h1>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          color: COLORS.textSecondary,
          margin: "8px 0 0",
          lineHeight: 1.5,
        }}
      >
        Continua donde lo dejaste. Tienes 3 actividades pendientes esta semana.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          padding: "48px 24px 80px",
          maxWidth: 1080,
          margin: "0 auto",
          transition: "padding-left 0.3s ease",
        }}
      >
        <WelcomeHeader />

        <section style={{ marginBottom: 48 }}>
          <SectionHeader title="Cursos Activos" subtitle="Tu progreso actual en cada curso" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {courses.map((c, i) => (
              <CourseCard key={i} course={c} />
            ))}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            marginBottom: 48,
          }}
        >
          <section>
            <SectionHeader title="Progreso de Lectura" subtitle="Libros y textos en curso" />
            <div
              style={{
                background: COLORS.bgCard,
                borderRadius: 24,
                padding: "8px 24px",
                boxShadow: COLORS.shadow,
              }}
            >
              {readings.map((r, i) => (
                <ReadingItem key={i} reading={r} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Debates Recientes" subtitle="Conversaciones activas en los foros" />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {discussions.map((d, i) => (
                <DiscussionItem key={i} discussion={d} />
              ))}
            </div>
          </section>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            marginBottom: 48,
          }}
        >
          <section>
            <SectionHeader title="Eventos del Cafe" subtitle="Proximas actividades presenciales" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {events.map((e, i) => (
                <EventCard key={i} event={e} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Feed Social" subtitle="Novedades de @cafeliterario.lr" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {socialPosts.map((p, i) => (
                <SocialPost key={i} post={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
