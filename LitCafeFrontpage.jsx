import { useState, useEffect } from "react";

const C = {
  bg: "#F5F1E8",
  bgCard: "#FDFBF7",
  bgWarm: "#EDE8DC",
  bgDark: "#3B3228",
  accent: "#B8654A",
  accentHover: "#A0573F",
  ochre: "#C4973B",
  ochreLight: "#F0E4C8",
  sage: "#7A8B6F",
  charcoal: "#2A2A2A",
  textSec: "#6B6458",
  textMeta: "#9A9286",
  border: "#E5DFD3",
  shadow: "0 2px 16px rgba(42,42,42,0.06)",
  shadowLift: "0 8px 32px rgba(42,42,42,0.10)",
};

const heroInsight = {
  tag: "Reflexion Semanal",
  title: "Por que leer a Cortazar en otono",
  excerpt:
    "Hay algo en la cadencia de Cortazar que resuena con los dias mas cortos. Sus cuentos piden cafe caliente, una manta y la voluntad de perderse en pasajes que no llevan a donde uno espera. Esta semana en el cafe, abrimos Bestiario y encontramos mas preguntas que respuestas.",
  author: "Maria Elena",
  date: "24 de febrero, 2026",
  readTime: "6 min de lectura",
};

const newsItems = [
  { text: "Premio Herralde 2026 para la argentina Leila Guerriero", tag: "Premio" },
  { text: "Nueva edicion anotada de Rayuela por Alfaguara", tag: "Editorial" },
  { text: "Festival de Poesia de Buenos Aires abre convocatoria", tag: "Evento" },
  { text: "Samanta Schweblin finalista del International Booker", tag: "Premio" },
  { text: "Reedicion de Operacion Masacre con prologo inedito", tag: "Editorial" },
];

const communityPosts = [
  {
    source: "Instagram",
    handle: "@cafeliterario.lr",
    text: "Tarde de lluvia perfecta para empezar con los cuentos de Silvina Ocampo. Los esperamos con medialunas recien hechas y silencio.",
    time: "Hace 2h",
    likes: 63,
  },
  {
    source: "Facebook",
    handle: "Cafe Literario BA",
    text: "Este viernes a las 19h: lectura en voz alta de poesia mapuche contemporanea. Entrada libre, cupos limitados a 20 personas.",
    time: "Hace 4h",
    likes: 41,
  },
  {
    source: "WhatsApp",
    handle: "Grupo Club de Lectura",
    text: "Recordatorio: esta semana terminamos los capitulos 12-18 de El tunel. Traigan sus anotaciones para el debate del sabado.",
    time: "Hace 6h",
    likes: 28,
  },
];

const blogPosts = [
  {
    title: "El silencio como recurso narrativo en Onetti",
    genre: "Ensayo",
    author: "Maria Elena",
    date: "22 feb",
    readTime: "8 min",
    excerpt: "En Juntacadaveres, lo que no se dice construye mas que cualquier dialogo. Un analisis del vacio como herramienta literaria.",
    linkedCourse: "Narrativa Rioplatense Avanzada",
    color: C.accent,
  },
  {
    title: "Cinco poetas jovenes argentinas que hay que leer ahora",
    genre: "Resena",
    author: "Maria Elena",
    date: "19 feb",
    readTime: "5 min",
    excerpt: "Desde el slam porteno hasta las editoriales independientes, estas voces estan redefiniendo la poesia en castellano.",
    linkedCourse: "Poesia Contemporanea Latinoamericana",
    color: C.ochre,
  },
  {
    title: "Guia para organizar un club de lectura en tu barrio",
    genre: "Guia",
    author: "Maria Elena",
    date: "15 feb",
    readTime: "10 min",
    excerpt: "Todo lo que aprendi en tres anos de encuentros semanales: desde elegir libros hasta manejar silencios incomodos.",
    linkedCourse: null,
    color: C.sage,
  },
];

const featuredCourses = [
  {
    title: "Borges: Ficciones y Laberintos",
    modules: 12,
    students: 34,
    genre: "Narrativa",
    color: C.accent,
    description: "Un recorrido profundo por el universo borgeano, desde Tlon hasta El Aleph.",
  },
  {
    title: "Taller de Escritura Creativa",
    modules: 6,
    students: 22,
    genre: "Taller",
    color: C.sage,
    description: "Tecnicas y ejercicios para encontrar tu voz propia. Para principiantes y curiosos.",
  },
  {
    title: "Poesia Contemporanea Latinoamericana",
    modules: 8,
    students: 18,
    genre: "Poesia",
    color: C.ochre,
    description: "De Pizarnik a los slams actuales. Un mapa sonoro del verso en castellano.",
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(245,241,232,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            color: C.charcoal,
            margin: 0,
          }}
        >
          LitCafe
        </h1>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Inicio", "Blog", "Cursos", "Eventos"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: C.textSec,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textSec)}
            >
              {item}
            </a>
          ))}
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: C.accent,
              border: "none",
              borderRadius: 24,
              padding: "10px 24px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            Ingresar
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroInsight() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 64 }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.accent,
              background: `${C.accent}12`,
              padding: "6px 14px",
              borderRadius: 20,
              marginBottom: 24,
            }}
          >
            {heroInsight.tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 44,
              fontWeight: 700,
              color: C.charcoal,
              lineHeight: 1.15,
              margin: "0 0 20px",
              maxWidth: 560,
            }}
          >
            {heroInsight.title}
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: C.textSec,
              lineHeight: 1.7,
              margin: "0 0 28px",
              maxWidth: 520,
            }}
          >
            {heroInsight.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: C.bgWarm,
                flexShrink: 0,
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.charcoal,
                  margin: 0,
                }}
              >
                {heroInsight.author}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: C.textMeta,
                  margin: "2px 0 0",
                }}
              >
                {heroInsight.date} &middot; {heroInsight.readTime}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: 28,
            background: `linear-gradient(160deg, ${C.bgWarm} 0%, ${C.ochreLight} 50%, ${C.bgWarm} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              background: "rgba(253,251,247,0.88)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 14,
                fontStyle: "italic",
                color: C.charcoal,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              "Andabamos sin buscarnos pero sabiendo que andabamos para encontrarnos."
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: C.textMeta,
                margin: "8px 0 0",
              }}
            >
              Julio Cortazar, Rayuela
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsTicker() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setOffset((o) => o + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const visible = newsItems[offset % newsItems.length];

  return (
    <section
      style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: C.bgCard,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.accent,
            flexShrink: 0,
          }}
        >
          Noticias
        </span>
        <div
          style={{
            width: 1,
            height: 20,
            background: C.border,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, overflow: "hidden", position: "relative", height: 22 }}>
          <div
            key={offset}
            style={{
              animation: "fadeSlide 0.5s ease",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: C.ochre,
                background: `${C.ochre}14`,
                padding: "2px 8px",
                borderRadius: 6,
                flexShrink: 0,
              }}
            >
              {visible.tag}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: C.charcoal,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {visible.text}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 28,
                fontWeight: 700,
                color: C.charcoal,
                margin: 0,
              }}
            >
              Desde el Blog
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: C.textMeta,
                margin: "6px 0 0",
              }}
            >
              Lecturas, ensayos y reflexiones de nuestra comunidad
            </p>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.accent,
              textDecoration: "none",
            }}
          >
            Ver todo
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {blogPosts.map((post, i) => (
            <article
              key={i}
              style={{
                background: C.bgCard,
                borderRadius: 24,
                padding: 28,
                boxShadow: C.shadow,
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = C.shadowLift;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = C.shadow;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: post.color,
                    background: `${post.color}12`,
                    padding: "4px 10px",
                    borderRadius: 16,
                  }}
                >
                  {post.genre}
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textMeta }}>
                  {post.readTime}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 19,
                  fontWeight: 600,
                  color: C.charcoal,
                  lineHeight: 1.35,
                  margin: "0 0 12px",
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: C.textSec,
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {post.excerpt}
              </p>
              {post.linkedCourse && (
                <div
                  style={{
                    background: `${post.color}08`,
                    borderRadius: 14,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textSec }}>
                    Curso relacionado
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: post.color }}>
                    {post.linkedCourse}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textMeta }}>
                  {post.author} &middot; {post.date}
                </span>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: C.textMeta,
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textMeta)}
                  >
                    Compartir IG
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      color: C.textMeta,
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textMeta)}
                  >
                    Compartir FB
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityFeed() {
  return (
    <section style={{ padding: "64px 0", background: C.bgWarm }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: C.charcoal,
            margin: "0 0 8px",
          }}
        >
          La Comunidad
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: C.textMeta,
            margin: "0 0 32px",
          }}
        >
          Lo ultimo desde nuestras redes y grupos
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {communityPosts.map((post, i) => {
            const sourceColor =
              post.source === "Instagram"
                ? "#C13584"
                : post.source === "Facebook"
                ? "#1877F2"
                : "#25D366";
            return (
              <div
                key={i}
                style={{
                  background: C.bgCard,
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: C.shadow,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: sourceColor,
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.charcoal,
                        margin: 0,
                      }}
                    >
                      {post.handle}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.textMeta, margin: 0 }}>
                      {post.source} &middot; {post.time}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: C.textSec,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {post.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CoursesPreview() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32,
              fontWeight: 700,
              color: C.charcoal,
              margin: "0 0 10px",
            }}
          >
            Biblioteca de Cursos
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: C.textSec,
              margin: 0,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Exploraciones guiadas por la literatura. Cada curso combina lectura, debate y encuentros presenciales en el cafe.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {featuredCourses.map((course, i) => (
            <div
              key={i}
              style={{
                background: C.bgCard,
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: C.shadow,
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = C.shadowLift;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = C.shadow;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  height: 120,
                  background: `linear-gradient(135deg, ${course.color}20, ${course.color}08)`,
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "0 24px 16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: course.color,
                    background: "rgba(253,251,247,0.85)",
                    backdropFilter: "blur(4px)",
                    padding: "4px 12px",
                    borderRadius: 16,
                  }}
                >
                  {course.genre}
                </span>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 19,
                    fontWeight: 600,
                    color: C.charcoal,
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {course.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: C.textSec,
                    lineHeight: 1.55,
                    margin: "0 0 20px",
                  }}
                >
                  {course.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.textMeta }}>
                    {course.modules} modulos &middot; {course.students} alumnos
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.accent,
                    }}
                  >
                    Explorar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.bgDark, padding: "48px 24px" }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#F5F1E8",
              margin: "0 0 12px",
            }}
          >
            LitCafe
          </h3>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "rgba(245,241,232,0.55)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Plataforma de aprendizaje literario del Cafe Literario. Buenos Aires, Argentina.
          </p>
        </div>
        <div>
          <h4
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,241,232,0.4)",
              margin: "0 0 16px",
            }}
          >
            Plataforma
          </h4>
          {["Cursos", "Blog", "Eventos", "Foros"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "rgba(245,241,232,0.65)",
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              {item}
            </a>
          ))}
        </div>
        <div>
          <h4
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,241,232,0.4)",
              margin: "0 0 16px",
            }}
          >
            Redes
          </h4>
          {["@cafeliterario.lr", "Cafe Literario BA", "WhatsApp"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "rgba(245,241,232,0.65)",
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <div
        style={{
          maxWidth: 1120,
          margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(245,241,232,0.1)",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "rgba(245,241,232,0.3)",
            margin: 0,
          }}
        >
          LitCafe LMS &middot; Compatible con SCORM, xAPI y RAIS
        </p>
      </div>
    </footer>
  );
}

export default function Frontpage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "100vh" }}>
        <HeroInsight />
        <NewsTicker />
        <BlogSection />
        <CommunityFeed />
        <CoursesPreview />
      </main>
      <Footer />
    </>
  );
}
