import { useCallback, useEffect, useMemo, useState } from "react";
import {
  appSections,
  fallbackLiteratureNews,
  initialCommunities,
  initialCourses,
  initialEvents,
  initialForums,
  initialMessageThreads,
  initialSiteNews,
  initialSocialAccounts,
  initialSocialPosts,
  mockUsers,
} from "./mockData.js";
import { fetchLiteratureNews } from "./newsService.js";

const SESSION_STORAGE_KEY = "litcafe-session-v1";

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
  successBg: "#E7F3EC",
  successText: "#2A6D46",
  warningBg: "#FFF4DE",
  warningText: "#8D6122",
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.name || !parsed?.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function eventSortValue(event) {
  const safeDate = event.date || "2100-01-01";
  const safeTime = event.time || "23:59";
  return new Date(`${safeDate}T${safeTime}:00`).getTime();
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

      * {
        box-sizing: border-box;
      }

      html, body, #root {
        margin: 0;
        padding: 0;
        min-height: 100%;
      }

      body {
        font-family: "DM Sans", sans-serif;
        background: ${C.bg};
        color: ${C.charcoal};
      }

      .lc-app {
        min-height: 100vh;
      }

      .lc-topbar {
        height: 60px;
        border-bottom: 1px solid ${C.border};
        background: ${C.bgCard};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 16px;
      }

      .lc-brand-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .lc-icon-button {
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.charcoal};
        border-radius: 8px;
        height: 34px;
        min-width: 34px;
        padding: 0 10px;
        cursor: pointer;
        font: inherit;
      }

      .lc-icon-button:hover {
        background: ${C.bgWarm};
      }

      .lc-brand {
        margin: 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 25px;
        font-weight: 600;
        white-space: nowrap;
      }

      .lc-topbar-meta {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .lc-pill {
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.textSec};
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 600;
      }

      .lc-body {
        display: grid;
        grid-template-columns: var(--drawer-width, 250px) minmax(0, 1fr);
        min-height: calc(100vh - 60px);
      }

      .lc-sidebar {
        border-right: 1px solid ${C.border};
        background: ${C.bgDrawer};
        padding: 10px 8px;
      }

      .lc-nav-title {
        margin: 0 6px 10px;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${C.textSec};
        font-weight: 700;
      }

      .lc-nav-list {
        display: grid;
        gap: 6px;
      }

      .lc-nav-button {
        border: 1px solid transparent;
        border-radius: 8px;
        background: transparent;
        color: ${C.charcoal};
        cursor: pointer;
        font: inherit;
        text-align: left;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
      }

      .lc-nav-button:hover {
        background: ${C.bgCard};
      }

      .lc-nav-button.is-active {
        background: ${C.bgCard};
        border-color: ${C.border};
        color: ${C.accent};
        border-left: 4px solid ${C.accent};
        font-weight: 700;
      }

      .lc-nav-icon {
        width: 24px;
        text-align: center;
        font-size: 12px;
        color: ${C.textSec};
      }

      .lc-main {
        padding: 14px;
        min-width: 0;
      }

      .lc-main-shell {
        max-width: 1260px;
        margin: 0 auto;
        display: grid;
        gap: 12px;
      }

      .lc-main-heading {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 10px;
        padding: 12px 14px;
      }

      .lc-main-heading h2 {
        margin: 0 0 5px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 29px;
      }

      .lc-main-heading p {
        margin: 0;
        color: ${C.textSec};
        font-size: 14px;
      }

      .lc-grid {
        display: grid;
        gap: 12px;
      }

      .lc-grid-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .lc-grid-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .lc-grid-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .lc-card {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 10px;
      }

      .lc-card-head {
        border-bottom: 1px solid ${C.border};
        background: ${C.bgWarm};
        border-radius: 10px 10px 0 0;
        padding: 9px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .lc-card-title {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        color: ${C.textSec};
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .lc-card-body {
        padding: 12px;
      }

      .lc-meta {
        margin: 0;
        color: ${C.textMeta};
        font-size: 12px;
      }

      .lc-muted {
        color: ${C.textSec};
      }

      .lc-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 10px;
      }

      .lc-list-item {
        padding-bottom: 8px;
        border-bottom: 1px solid ${C.border};
      }

      .lc-list-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .lc-stat-value {
        margin: 0 0 4px;
        font-size: 30px;
        line-height: 1;
        font-family: "Playfair Display", Georgia, serif;
      }

      .lc-stat-label {
        margin: 0 0 5px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
        color: ${C.textSec};
      }

      .lc-progress {
        width: 100%;
        height: 8px;
        border-radius: 99px;
        background: #e8e2d6;
        border: 1px solid ${C.border};
        overflow: hidden;
      }

      .lc-progress > span {
        display: block;
        height: 100%;
        background: ${C.accent};
      }

      .lc-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .lc-tag {
        display: inline-flex;
        align-items: center;
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.textSec};
        border-radius: 999px;
        font-size: 11px;
        padding: 2px 8px;
        font-weight: 700;
      }

      .lc-tag.is-accent {
        color: ${C.accent};
      }

      .lc-tag.is-warning {
        background: ${C.warningBg};
        color: ${C.warningText};
      }

      .lc-tag.is-success {
        background: ${C.successBg};
        color: ${C.successText};
      }

      .lc-button {
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.charcoal};
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
        font: inherit;
      }

      .lc-button:hover {
        background: ${C.bgWarm};
      }

      .lc-button.is-primary {
        background: ${C.accent};
        border-color: ${C.accent};
        color: #fff;
        font-weight: 700;
      }

      .lc-button.is-primary:hover {
        filter: brightness(0.95);
      }

      .lc-link {
        border: none;
        background: transparent;
        color: ${C.accent};
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
      }

      .lc-form-grid {
        display: grid;
        gap: 8px;
      }

      .lc-input,
      .lc-select,
      .lc-textarea {
        border: 1px solid ${C.border};
        background: #fff;
        border-radius: 8px;
        min-height: 36px;
        font: inherit;
        color: ${C.charcoal};
        padding: 8px 10px;
        width: 100%;
      }

      .lc-textarea {
        min-height: 88px;
        resize: vertical;
      }

      .lc-login-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 20px;
      }

      .lc-login-card {
        width: min(960px, 100%);
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(280px, 1fr);
        gap: 12px;
      }

      .lc-login-main {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 20px;
      }

      .lc-login-main h1 {
        margin: 0 0 6px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 38px;
      }

      .lc-login-main p {
        margin: 0 0 14px;
        color: ${C.textSec};
      }

      .lc-login-side {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 14px;
      }

      .lc-login-side h2 {
        margin: 0 0 8px;
        font-size: 15px;
      }

      .lc-alert {
        border: 1px solid ${C.border};
        border-radius: 8px;
        padding: 8px 10px;
        font-size: 13px;
      }

      .lc-alert.is-error {
        background: #ffe9e8;
        color: #812a27;
      }

      .lc-alert.is-info {
        background: ${C.bgWarm};
        color: ${C.textSec};
      }

      .lc-forum-layout,
      .lc-message-layout {
        display: grid;
        grid-template-columns: minmax(250px, 1fr) minmax(0, 2fr);
        gap: 12px;
      }

      .lc-message-bubble {
        border: 1px solid ${C.border};
        background: ${C.bg};
        border-radius: 8px;
        padding: 8px 10px;
      }

      .lc-message-bubble.is-me {
        background: #f7ece8;
        border-color: #ead7cf;
      }

      @media (max-width: 980px) {
        .lc-body {
          grid-template-columns: 1fr;
        }

        .lc-sidebar {
          border-right: none;
          border-bottom: 1px solid ${C.border};
          overflow-x: auto;
        }

        .lc-nav-list {
          display: flex;
          gap: 8px;
          padding-bottom: 4px;
        }

        .lc-nav-button {
          min-width: fit-content;
        }

        .lc-grid-4 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .lc-grid-3 {
          grid-template-columns: 1fr;
        }

        .lc-grid-2 {
          grid-template-columns: 1fr;
        }

        .lc-forum-layout,
        .lc-message-layout {
          grid-template-columns: 1fr;
        }

        .lc-login-card {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

function Card({ title, action, children }) {
  return (
    <section className="lc-card">
      <div className="lc-card-head">
        <h3 className="lc-card-title">{title}</h3>
        {action}
      </div>
      <div className="lc-card-body">{children}</div>
    </section>
  );
}

function DashboardSection({
  courses,
  events,
  forums,
  messageThreads,
  communities,
  siteNews,
  literatureNews,
  literatureSource,
  newsLoading,
  onGoToSection,
}) {
  const totalPendingTasks = courses.reduce((acc, course) => acc + (course.pendingTasks || 0), 0);
  const avgProgress = Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / Math.max(courses.length, 1));
  const unreadMessages = messageThreads.reduce((acc, thread) => acc + (thread.unread || 0), 0);

  const upcomingEvents = [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)).slice(0, 4);
  const topForums = forums.slice(0, 4);
  const topNews = literatureNews.slice(0, 4);

  return (
    <div className="lc-grid">
      <div className="lc-grid lc-grid-4">
        <article className="lc-card">
          <div className="lc-card-body">
            <p className="lc-stat-label">Cursos activos</p>
            <p className="lc-stat-value">{courses.length}</p>
            <p className="lc-meta">Con progreso promedio de {avgProgress}%</p>
          </div>
        </article>

        <article className="lc-card">
          <div className="lc-card-body">
            <p className="lc-stat-label">Tareas pendientes</p>
            <p className="lc-stat-value">{totalPendingTasks}</p>
            <p className="lc-meta">Para completar esta semana</p>
          </div>
        </article>

        <article className="lc-card">
          <div className="lc-card-body">
            <p className="lc-stat-label">Eventos proximos</p>
            <p className="lc-stat-value">{events.length}</p>
            <p className="lc-meta">Con calendario compartido</p>
          </div>
        </article>

        <article className="lc-card">
          <div className="lc-card-body">
            <p className="lc-stat-label">Mensajes sin leer</p>
            <p className="lc-stat-value">{unreadMessages}</p>
            <p className="lc-meta">En conversaciones y grupos</p>
          </div>
        </article>
      </div>

      <div className="lc-grid lc-grid-3">
        <Card
          title="Accesos rapidos"
          action={
            <span className="lc-tag is-accent">
              {literatureSource === "api" ? "Noticias via API" : "Noticias via mocks"}
            </span>
          }
        >
          <div className="lc-grid lc-grid-2">
            <button className="lc-button" type="button" onClick={() => onGoToSection("cursos")}>
              Ir a Mis cursos
            </button>
            <button className="lc-button" type="button" onClick={() => onGoToSection("foros")}>
              Abrir Foros
            </button>
            <button className="lc-button" type="button" onClick={() => onGoToSection("mensajes")}>
              Revisar Mensajes
            </button>
            <button className="lc-button" type="button" onClick={() => onGoToSection("calendario")}>
              Ver Calendario
            </button>
          </div>
        </Card>

        <Card title="Proximos eventos">
          <ul className="lc-list">
            {upcomingEvents.map((eventItem) => (
              <li className="lc-list-item" key={eventItem.id}>
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{eventItem.title}</p>
                <p className="lc-meta">
                  {formatDate(eventItem.date)} | {eventItem.time} | {eventItem.type}
                </p>
                <p className="lc-meta">
                  {eventItem.location} | cupos: {eventItem.seats}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Actividad en foros">
          <ul className="lc-list">
            {topForums.map((forum) => (
              <li className="lc-list-item" key={forum.id}>
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{forum.title}</p>
                <p className="lc-meta">
                  {forum.course} | {forum.comments.length} comentarios
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="lc-grid lc-grid-2">
        <Card
          title="Noticias de literatura"
          action={
            <span className={`lc-tag ${literatureSource === "api" ? "is-success" : "is-warning"}`}>
              {newsLoading ? "Actualizando..." : literatureSource === "api" ? "API conectada" : "Fallback mock"}
            </span>
          }
        >
          <ul className="lc-list">
            {topNews.map((newsItem) => (
              <li key={newsItem.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{newsItem.title}</p>
                <p className="lc-meta">{newsItem.summary}</p>
                <p className="lc-meta">
                  {newsItem.source} | {formatDate(newsItem.publishedAt)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Novedades internas y comunidades">
          <div className="lc-grid lc-grid-2">
            <div>
              <p className="lc-stat-label" style={{ marginTop: 0 }}>
                Noticias internas
              </p>
              <ul className="lc-list">
                {siteNews.slice(0, 3).map((item) => (
                  <li key={item.id} className="lc-list-item">
                    <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{item.title}</p>
                    <p className="lc-meta">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="lc-stat-label" style={{ marginTop: 0 }}>
                Comunidades
              </p>
              <ul className="lc-list">
                {communities.slice(0, 3).map((community) => (
                  <li key={community.id} className="lc-list-item">
                    <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{community.name}</p>
                    <p className="lc-meta">
                      {community.category} | {community.members} miembros
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CoursesSection({ courses, currentUser, onAddCourseComment }) {
  const [commentDrafts, setCommentDrafts] = useState({});

  function updateDraft(courseId, value) {
    setCommentDrafts((prev) => ({ ...prev, [courseId]: value }));
  }

  function submitComment(event, courseId) {
    event.preventDefault();
    const text = (commentDrafts[courseId] || "").trim();
    if (!text) {
      return;
    }
    onAddCourseComment(courseId, text, currentUser.name);
    setCommentDrafts((prev) => ({ ...prev, [courseId]: "" }));
  }

  return (
    <div className="lc-grid lc-grid-2">
      {courses.map((course) => (
        <article className="lc-card" key={course.id}>
          <div className="lc-card-body">
            <div className="lc-row" style={{ marginBottom: 8 }}>
              <span className="lc-tag is-accent">{course.mentor}</span>
              <span className="lc-meta">
                {course.modulesCompleted}/{course.totalModules} modulos
              </span>
            </div>
            <h3 style={{ margin: "0 0 6px", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24 }}>{course.title}</h3>
            <p className="lc-muted" style={{ margin: "0 0 10px", fontSize: 14 }}>
              {course.description}
            </p>
            <div className="lc-progress">
              <span style={{ width: `${course.progress}%` }} />
            </div>
            <div className="lc-row" style={{ marginTop: 7 }}>
              <p className="lc-meta">{course.progress}% completado</p>
              <p className="lc-meta">Pendientes: {course.pendingTasks}</p>
            </div>
            <p className="lc-meta" style={{ marginTop: 6 }}>
              Proxima clase: {formatDate(course.nextClass)}
            </p>

            <div style={{ marginTop: 12 }}>
              <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>
                Comentarios mock del curso
              </p>
              <ul className="lc-list">
                {course.comments.map((comment) => (
                  <li key={comment.id} className="lc-list-item">
                    <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{comment.author}</p>
                    <p className="lc-muted" style={{ margin: "0 0 3px", fontSize: 13 }}>
                      {comment.text}
                    </p>
                    <p className="lc-meta">{comment.at}</p>
                  </li>
                ))}
              </ul>
            </div>

            <form className="lc-form-grid" style={{ marginTop: 10 }} onSubmit={(event) => submitComment(event, course.id)}>
              <input
                className="lc-input"
                type="text"
                value={commentDrafts[course.id] || ""}
                onChange={(event) => updateDraft(course.id, event.target.value)}
                placeholder="Agregar comentario al curso"
              />
              <button type="submit" className="lc-button is-primary">
                Publicar comentario
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

function CalendarSection({ events }) {
  const sortedEvents = useMemo(() => [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)), [events]);

  return (
    <div className="lc-grid">
      <Card title="Calendario academico">
        <ul className="lc-list">
          {sortedEvents.map((eventItem) => (
            <li key={eventItem.id} className="lc-list-item">
              <div className="lc-row">
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{eventItem.title}</p>
                  <p className="lc-meta">
                    {formatDate(eventItem.date)} | {eventItem.time} | {eventItem.type}
                  </p>
                  <p className="lc-meta">
                    {eventItem.location} | cupos {eventItem.seats}
                  </p>
                </div>
                <span className="lc-tag">{eventItem.type}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ForumsSection({ forums, currentUser, onCreateForumThread, onAddForumComment }) {
  const [selectedForumId, setSelectedForumId] = useState(forums[0]?.id || "");
  const [threadForm, setThreadForm] = useState({ title: "", course: "", content: "" });
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    if (forums.length === 0) {
      setSelectedForumId("");
      return;
    }
    const stillExists = forums.some((forum) => forum.id === selectedForumId);
    if (!stillExists) {
      setSelectedForumId(forums[0].id);
    }
  }, [forums, selectedForumId]);

  const selectedForum = forums.find((forum) => forum.id === selectedForumId);

  function submitThread(event) {
    event.preventDefault();
    const title = threadForm.title.trim();
    const course = threadForm.course.trim();
    const content = threadForm.content.trim();
    if (!title || !course || !content) {
      return;
    }
    const newId = onCreateForumThread({ title, course, content, author: currentUser.name });
    setThreadForm({ title: "", course: "", content: "" });
    setSelectedForumId(newId);
  }

  function submitComment(event) {
    event.preventDefault();
    if (!selectedForum) {
      return;
    }
    const text = commentDraft.trim();
    if (!text) {
      return;
    }
    onAddForumComment(selectedForum.id, text, currentUser.name);
    setCommentDraft("");
  }

  return (
    <div className="lc-grid">
      <Card title="Crear nuevo hilo de foro">
        <form className="lc-form-grid" onSubmit={submitThread}>
          <input
            className="lc-input"
            type="text"
            placeholder="Titulo del hilo"
            value={threadForm.title}
            onChange={(event) => setThreadForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            className="lc-input"
            type="text"
            placeholder="Curso relacionado"
            value={threadForm.course}
            onChange={(event) => setThreadForm((prev) => ({ ...prev, course: event.target.value }))}
          />
          <textarea
            className="lc-textarea"
            placeholder="Contenido inicial del debate"
            value={threadForm.content}
            onChange={(event) => setThreadForm((prev) => ({ ...prev, content: event.target.value }))}
          />
          <button type="submit" className="lc-button is-primary">
            Publicar hilo
          </button>
        </form>
      </Card>

      <div className="lc-forum-layout">
        <Card title={`Hilos disponibles (${forums.length})`}>
          <ul className="lc-list">
            {forums.map((forum) => (
              <li key={forum.id} className="lc-list-item">
                <button
                  type="button"
                  className="lc-link"
                  style={{ textAlign: "left", display: "block", width: "100%" }}
                  onClick={() => setSelectedForumId(forum.id)}
                >
                  {forum.title}
                </button>
                <p className="lc-meta" style={{ marginTop: 4 }}>
                  {forum.course} | {forum.author} | {forum.comments.length} comentarios
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Detalle del hilo">
          {!selectedForum ? (
            <p className="lc-meta">Selecciona un hilo para ver su contenido.</p>
          ) : (
            <div className="lc-grid">
              <div>
                <h3 style={{ margin: "0 0 6px", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24 }}>
                  {selectedForum.title}
                </h3>
                <p className="lc-meta">
                  {selectedForum.course} | iniciado por {selectedForum.author} | {formatDate(selectedForum.createdAt)}
                </p>
                <p className="lc-muted" style={{ marginTop: 8 }}>
                  {selectedForum.content}
                </p>
              </div>

              <div>
                <p className="lc-stat-label" style={{ margin: 0 }}>
                  Comentarios mock
                </p>
                <ul className="lc-list" style={{ marginTop: 8 }}>
                  {selectedForum.comments.map((comment) => (
                    <li key={comment.id} className="lc-list-item">
                      <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{comment.author}</p>
                      <p className="lc-muted" style={{ margin: "0 0 3px", fontSize: 13 }}>
                        {comment.text}
                      </p>
                      <p className="lc-meta">{comment.at}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <form className="lc-form-grid" onSubmit={submitComment}>
                <textarea
                  className="lc-textarea"
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Agregar comentario al hilo"
                />
                <button type="submit" className="lc-button is-primary">
                  Comentar
                </button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MessagesSection({ messageThreads, currentUser, onOpenThread, onSendMessage }) {
  const [selectedThreadId, setSelectedThreadId] = useState(messageThreads[0]?.id || "");
  const [draftMessage, setDraftMessage] = useState("");

  useEffect(() => {
    if (messageThreads.length === 0) {
      setSelectedThreadId("");
      return;
    }
    if (!messageThreads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(messageThreads[0].id);
    }
  }, [messageThreads, selectedThreadId]);

  const selectedThread = messageThreads.find((thread) => thread.id === selectedThreadId);

  function selectThread(threadId) {
    setSelectedThreadId(threadId);
    onOpenThread(threadId);
  }

  function submitMessage(event) {
    event.preventDefault();
    if (!selectedThread) {
      return;
    }
    const text = draftMessage.trim();
    if (!text) {
      return;
    }
    onSendMessage(selectedThread.id, text, currentUser.name);
    setDraftMessage("");
  }

  return (
    <div className="lc-message-layout">
      <Card title={`Conversaciones (${messageThreads.length})`}>
        <ul className="lc-list">
          {messageThreads.map((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1];
            const isSelected = selectedThreadId === thread.id;
            return (
              <li key={thread.id} className="lc-list-item">
                <button
                  type="button"
                  className="lc-link"
                  style={{ textAlign: "left", display: "block", width: "100%", color: isSelected ? C.accent : C.charcoal }}
                  onClick={() => selectThread(thread.id)}
                >
                  {thread.title}
                </button>
                <p className="lc-meta" style={{ marginTop: 4 }}>
                  {lastMessage?.author}: {lastMessage?.text}
                </p>
                <div className="lc-row" style={{ marginTop: 5 }}>
                  <p className="lc-meta">{thread.participants.length} participantes</p>
                  {thread.unread > 0 ? <span className="lc-tag is-warning">{thread.unread} sin leer</span> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card title={selectedThread ? selectedThread.title : "Mensajes"}>
        {!selectedThread ? (
          <p className="lc-meta">Selecciona una conversacion.</p>
        ) : (
          <div className="lc-grid">
            <div className="lc-grid">
              {selectedThread.messages.map((message) => {
                const isMe = message.author === currentUser.name;
                return (
                  <div key={message.id} className={`lc-message-bubble ${isMe ? "is-me" : ""}`}>
                    <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{message.author}</p>
                    <p style={{ margin: "0 0 4px", fontSize: 14 }} className="lc-muted">
                      {message.text}
                    </p>
                    <p className="lc-meta">{message.at}</p>
                  </div>
                );
              })}
            </div>

            <form className="lc-form-grid" onSubmit={submitMessage}>
              <textarea
                className="lc-textarea"
                placeholder="Escribe un mensaje"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
              />
              <button type="submit" className="lc-button is-primary">
                Enviar mensaje
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}

function FeedSection({ socialAccounts, socialPosts, communities, currentUser, onToggleAccount, onPublishPost }) {
  const [networkFilter, setNetworkFilter] = useState("all");
  const [postNetwork, setPostNetwork] = useState("");
  const [postText, setPostText] = useState("");

  const connectedNetworks = socialAccounts.filter((account) => account.connected);

  useEffect(() => {
    if (connectedNetworks.length === 0) {
      setPostNetwork("");
      return;
    }
    if (!postNetwork || !connectedNetworks.some((item) => item.network === postNetwork)) {
      setPostNetwork(connectedNetworks[0].network);
    }
  }, [connectedNetworks, postNetwork]);

  const filteredPosts = socialPosts.filter((post) => (networkFilter === "all" ? true : post.network === networkFilter));

  function submitPost(event) {
    event.preventDefault();
    const text = postText.trim();
    if (!text) {
      return;
    }
    onPublishPost({
      network: postNetwork || "Comunidad",
      text,
      author: currentUser.name,
    });
    setPostText("");
  }

  return (
    <div className="lc-grid">
      <div className="lc-grid lc-grid-2">
        <Card title="Conexiones de redes">
          <ul className="lc-list">
            {socialAccounts.map((account) => (
              <li key={account.id} className="lc-list-item">
                <div className="lc-row">
                  <div>
                    <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{account.network}</p>
                    <p className="lc-meta">{account.handle}</p>
                  </div>
                  <button type="button" className="lc-button" onClick={() => onToggleAccount(account.id)}>
                    {account.connected ? "Desconectar" : "Conectar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Publicar en feed social">
          <form className="lc-form-grid" onSubmit={submitPost}>
            <select
              className="lc-select"
              value={postNetwork}
              onChange={(event) => setPostNetwork(event.target.value)}
              disabled={connectedNetworks.length === 0}
            >
              {connectedNetworks.length === 0 ? (
                <option value="">No hay redes conectadas</option>
              ) : (
                connectedNetworks.map((network) => (
                  <option key={network.id} value={network.network}>
                    {network.network}
                  </option>
                ))
              )}
            </select>
            <textarea
              className="lc-textarea"
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              placeholder="Escribe una actualizacion para la comunidad"
            />
            <button className="lc-button is-primary" type="submit" disabled={connectedNetworks.length === 0}>
              Publicar
            </button>
          </form>
        </Card>
      </div>

      <div className="lc-grid lc-grid-2">
        <Card
          title="Feed agregado"
          action={
            <select className="lc-select" value={networkFilter} onChange={(event) => setNetworkFilter(event.target.value)} style={{ minHeight: 30 }}>
              <option value="all">Todas las redes</option>
              {[...new Set(socialPosts.map((post) => post.network))].map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          }
        >
          <ul className="lc-list">
            {filteredPosts.map((post) => (
              <li key={post.id} className="lc-list-item">
                <div className="lc-row">
                  <p style={{ margin: 0, fontWeight: 700 }}>{post.network}</p>
                  <span className="lc-meta">{post.at}</span>
                </div>
                <p className="lc-meta" style={{ marginTop: 4 }}>
                  {post.author}
                </p>
                <p className="lc-muted" style={{ margin: "6px 0", fontSize: 14 }}>
                  {post.text}
                </p>
                <p className="lc-meta">
                  {post.likes} me gusta | {post.comments} comentarios
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Comunidades activas">
          <ul className="lc-list">
            {communities.map((community) => (
              <li key={community.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{community.name}</p>
                <p className="lc-meta">
                  {community.category} | {community.members} miembros
                </p>
                <p className="lc-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
                  {community.description}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function AdministrationSection({
  currentUser,
  events,
  communities,
  siteNews,
  literatureSource,
  onRefreshNews,
  newsLoading,
  onAddEvent,
  onAddCommunity,
  onAddSiteNews,
}) {
  const isAdmin = currentUser.role === "admin";
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "presencial",
    location: "",
    seats: "20",
  });
  const [communityForm, setCommunityForm] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    url: "",
  });

  if (!isAdmin) {
    return (
      <Card title="Acceso restringido">
        <p className="lc-muted" style={{ margin: 0 }}>
          Esta seccion es solo para administradores. Inicia sesion con credenciales admin para crear eventos, noticias y
          comunidades.
        </p>
      </Card>
    );
  }

  function submitEvent(event) {
    event.preventDefault();
    const payload = {
      title: eventForm.title.trim(),
      date: eventForm.date,
      time: eventForm.time,
      type: eventForm.type,
      location: eventForm.location.trim(),
      seats: Number(eventForm.seats) || 0,
    };
    if (!payload.title || !payload.date || !payload.time || !payload.location) {
      return;
    }
    onAddEvent(payload);
    setEventForm({
      title: "",
      date: "",
      time: "",
      type: "presencial",
      location: "",
      seats: "20",
    });
  }

  function submitCommunity(event) {
    event.preventDefault();
    const payload = {
      name: communityForm.name.trim(),
      category: communityForm.category.trim(),
      description: communityForm.description.trim(),
    };
    if (!payload.name || !payload.category || !payload.description) {
      return;
    }
    onAddCommunity(payload);
    setCommunityForm({ name: "", category: "", description: "" });
  }

  function submitNews(event) {
    event.preventDefault();
    const payload = {
      title: newsForm.title.trim(),
      summary: newsForm.summary.trim(),
      url: newsForm.url.trim() || "#",
    };
    if (!payload.title || !payload.summary) {
      return;
    }
    onAddSiteNews(payload);
    setNewsForm({ title: "", summary: "", url: "" });
  }

  return (
    <div className="lc-grid">
      <Card
        title="Control de noticias literarias API"
        action={
          <button type="button" className="lc-button" onClick={onRefreshNews} disabled={newsLoading}>
            {newsLoading ? "Actualizando..." : "Actualizar noticias"}
          </button>
        }
      >
        <p className="lc-muted" style={{ margin: "0 0 8px" }}>
          Fuente actual: <strong>{literatureSource === "api" ? "The Guardian API (filtrado literatura)" : "Mock local"}</strong>
        </p>
        <p className="lc-meta" style={{ margin: 0 }}>
          La consulta aplica filtros por palabras clave para asegurar que ingresen solo noticias del mundo de la literatura.
        </p>
      </Card>

      <div className="lc-grid lc-grid-3">
        <Card title="Agregar evento">
          <form className="lc-form-grid" onSubmit={submitEvent}>
            <input
              className="lc-input"
              type="text"
              placeholder="Titulo del evento"
              value={eventForm.title}
              onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              className="lc-input"
              type="date"
              value={eventForm.date}
              onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
            />
            <input
              className="lc-input"
              type="time"
              value={eventForm.time}
              onChange={(event) => setEventForm((prev) => ({ ...prev, time: event.target.value }))}
            />
            <select
              className="lc-select"
              value={eventForm.type}
              onChange={(event) => setEventForm((prev) => ({ ...prev, type: event.target.value }))}
            >
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrido">Hibrido</option>
            </select>
            <input
              className="lc-input"
              type="text"
              placeholder="Ubicacion"
              value={eventForm.location}
              onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
            />
            <input
              className="lc-input"
              type="number"
              min="1"
              max="500"
              value={eventForm.seats}
              onChange={(event) => setEventForm((prev) => ({ ...prev, seats: event.target.value }))}
            />
            <button type="submit" className="lc-button is-primary">
              Guardar evento
            </button>
          </form>
        </Card>

        <Card title="Agregar noticia del sitio">
          <form className="lc-form-grid" onSubmit={submitNews}>
            <input
              className="lc-input"
              type="text"
              placeholder="Titulo de la noticia"
              value={newsForm.title}
              onChange={(event) => setNewsForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <textarea
              className="lc-textarea"
              placeholder="Resumen"
              value={newsForm.summary}
              onChange={(event) => setNewsForm((prev) => ({ ...prev, summary: event.target.value }))}
            />
            <input
              className="lc-input"
              type="url"
              placeholder="URL (opcional)"
              value={newsForm.url}
              onChange={(event) => setNewsForm((prev) => ({ ...prev, url: event.target.value }))}
            />
            <button type="submit" className="lc-button is-primary">
              Publicar noticia
            </button>
          </form>
        </Card>

        <Card title="Agregar comunidad">
          <form className="lc-form-grid" onSubmit={submitCommunity}>
            <input
              className="lc-input"
              type="text"
              placeholder="Nombre de la comunidad"
              value={communityForm.name}
              onChange={(event) => setCommunityForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="lc-input"
              type="text"
              placeholder="Categoria"
              value={communityForm.category}
              onChange={(event) => setCommunityForm((prev) => ({ ...prev, category: event.target.value }))}
            />
            <textarea
              className="lc-textarea"
              placeholder="Descripcion"
              value={communityForm.description}
              onChange={(event) => setCommunityForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <button type="submit" className="lc-button is-primary">
              Crear comunidad
            </button>
          </form>
        </Card>
      </div>

      <div className="lc-grid lc-grid-3">
        <Card title="Eventos cargados">
          <ul className="lc-list">
            {events.slice(0, 5).map((eventItem) => (
              <li key={eventItem.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{eventItem.title}</p>
                <p className="lc-meta">
                  {formatDate(eventItem.date)} | {eventItem.time} | {eventItem.type}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Noticias internas">
          <ul className="lc-list">
            {siteNews.slice(0, 5).map((item) => (
              <li key={item.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{item.title}</p>
                <p className="lc-meta">{item.summary}</p>
                <p className="lc-meta">{formatDate(item.publishedAt)}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Comunidades">
          <ul className="lc-list">
            {communities.slice(0, 5).map((community) => (
              <li key={community.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{community.name}</p>
                <p className="lc-meta">
                  {community.category} | {community.members} miembros
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function LoginScreen({ credentials, authError, onChange, onSubmit }) {
  return (
    <main className="lc-login-shell">
      <div className="lc-login-card">
        <section className="lc-login-main">
          <p className="lc-tag is-accent" style={{ marginBottom: 12 }}>
            Plataforma de aprendizaje y comunidad
          </p>
          <h1>LitCafe LMS</h1>
          <p>
            Inicia sesion para usar el tablero, cursos, calendario, foros, mensajes, feed social y panel de
            administracion.
          </p>

          <form className="lc-form-grid" onSubmit={onSubmit}>
            <input
              className="lc-input"
              type="email"
              autoComplete="username"
              placeholder="Email"
              value={credentials.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
            <input
              className="lc-input"
              type="password"
              autoComplete="current-password"
              placeholder="Contrasena"
              value={credentials.password}
              onChange={(event) => onChange("password", event.target.value)}
            />
            <button type="submit" className="lc-button is-primary">
              Iniciar sesion
            </button>
          </form>

          {authError ? (
            <div className="lc-alert is-error" style={{ marginTop: 10 }}>
              {authError}
            </div>
          ) : null}
        </section>

        <aside className="lc-login-side">
          <h2>Credenciales de prueba</h2>
          <div className="lc-alert is-info" style={{ marginBottom: 10 }}>
            <strong>Admin</strong>
            <br />
            admin@litcafe.local
            <br />
            Admin#LitCafe2026
          </div>
          <div className="lc-alert is-info">
            <strong>Alumno demo</strong>
            <br />
            lector@litcafe.local
            <br />
            Lector#2026
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function LitCafeApp() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("tablero");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(readStoredSession);

  const [courses, setCourses] = useState(initialCourses);
  const [events, setEvents] = useState(initialEvents);
  const [forums, setForums] = useState(initialForums);
  const [messageThreads, setMessageThreads] = useState(initialMessageThreads);
  const [socialAccounts, setSocialAccounts] = useState(initialSocialAccounts);
  const [socialPosts, setSocialPosts] = useState(initialSocialPosts);
  const [communities, setCommunities] = useState(initialCommunities);
  const [siteNews, setSiteNews] = useState(initialSiteNews);
  const [literatureNews, setLiteratureNews] = useState(fallbackLiteratureNews);
  const [literatureSource, setLiteratureSource] = useState("mock");
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (currentUser) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUser]);

  const refreshLiteratureNews = useCallback(async () => {
    setNewsLoading(true);
    const result = await fetchLiteratureNews();
    setLiteratureNews(result.items);
    setLiteratureSource(result.source);
    setNewsLoading(false);
  }, []);

  useEffect(() => {
    void refreshLiteratureNews();
  }, [refreshLiteratureNews]);

  function updateCredentials(field, value) {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;
    const matchedUser = mockUsers.find((user) => user.email === email && user.password === password);

    if (!matchedUser) {
      setAuthError("Credenciales invalidas. Usa las credenciales mock para ingresar.");
      return;
    }

    setCurrentUser({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      avatar: matchedUser.avatar,
    });
    setAuthError("");
    setActiveSection("tablero");
    setCredentials({ email: "", password: "" });
  }

  function handleLogout() {
    setCurrentUser(null);
    setCredentials({ email: "", password: "" });
    setAuthError("");
  }

  const activeSectionInfo = appSections.find((section) => section.id === activeSection) || appSections[0];

  const totalUnreadMessages = useMemo(
    () => messageThreads.reduce((acc, thread) => acc + (thread.unread || 0), 0),
    [messageThreads],
  );

  const handleAddCourseComment = useCallback((courseId, text, author) => {
    const comment = {
      id: createId("course-comment"),
      author,
      text,
      at: "Hace un momento",
    };

    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, comments: [...course.comments, comment] } : course,
      ),
    );
  }, []);

  const handleCreateForumThread = useCallback(({ title, course, content, author }) => {
    const newForumId = createId("forum");
    const thread = {
      id: newForumId,
      title,
      course,
      author,
      content,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setForums((prevForums) => [thread, ...prevForums]);
    return newForumId;
  }, []);

  const handleAddForumComment = useCallback((forumId, text, author) => {
    const comment = {
      id: createId("forum-comment"),
      author,
      text,
      at: "Hace un momento",
    };

    setForums((prevForums) =>
      prevForums.map((forum) => (forum.id === forumId ? { ...forum, comments: [...forum.comments, comment] } : forum)),
    );
  }, []);

  const handleOpenThread = useCallback((threadId) => {
    setMessageThreads((prevThreads) =>
      prevThreads.map((thread) => (thread.id === threadId ? { ...thread, unread: 0 } : thread)),
    );
  }, []);

  const handleSendMessage = useCallback((threadId, text, author) => {
    const newMessage = {
      id: createId("thread-message"),
      author,
      text,
      at: new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    setMessageThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              unread: 0,
              messages: [...thread.messages, newMessage],
            }
          : thread,
      ),
    );
  }, []);

  const handleToggleSocialAccount = useCallback((accountId) => {
    setSocialAccounts((prevAccounts) =>
      prevAccounts.map((account) => (account.id === accountId ? { ...account, connected: !account.connected } : account)),
    );
  }, []);

  const handlePublishPost = useCallback(({ network, text, author }) => {
    const post = {
      id: createId("social-post"),
      network,
      author,
      text,
      likes: 0,
      comments: 0,
      at: "Ahora",
    };
    setSocialPosts((prevPosts) => [post, ...prevPosts]);
  }, []);

  const handleAddEvent = useCallback(
    (payload) => {
      const eventItem = {
        id: createId("event"),
        ...payload,
        createdBy: currentUser?.name || "Admin LitCafe",
      };
      setEvents((prevEvents) => [...prevEvents, eventItem].sort((a, b) => eventSortValue(a) - eventSortValue(b)));
    },
    [currentUser],
  );

  const handleAddCommunity = useCallback((payload) => {
    const community = {
      id: createId("community"),
      ...payload,
      members: 1,
    };
    setCommunities((prevCommunities) => [community, ...prevCommunities]);
  }, []);

  const handleAddSiteNews = useCallback(
    (payload) => {
      const newsItem = {
        id: createId("site-news"),
        ...payload,
        author: currentUser?.name || "Admin LitCafe",
        publishedAt: new Date().toISOString().slice(0, 10),
      };
      setSiteNews((prevSiteNews) => [newsItem, ...prevSiteNews]);
    },
    [currentUser],
  );

  if (!currentUser) {
    return (
      <>
        <GlobalStyles />
        <LoginScreen credentials={credentials} authError={authError} onChange={updateCredentials} onSubmit={handleLogin} />
      </>
    );
  }

  function renderSection() {
    switch (activeSection) {
      case "tablero":
        return (
          <DashboardSection
            courses={courses}
            events={events}
            forums={forums}
            messageThreads={messageThreads}
            communities={communities}
            siteNews={siteNews}
            literatureNews={literatureNews}
            literatureSource={literatureSource}
            newsLoading={newsLoading}
            onGoToSection={setActiveSection}
          />
        );
      case "cursos":
        return <CoursesSection courses={courses} currentUser={currentUser} onAddCourseComment={handleAddCourseComment} />;
      case "calendario":
        return <CalendarSection events={events} />;
      case "foros":
        return (
          <ForumsSection
            forums={forums}
            currentUser={currentUser}
            onCreateForumThread={handleCreateForumThread}
            onAddForumComment={handleAddForumComment}
          />
        );
      case "mensajes":
        return (
          <MessagesSection
            messageThreads={messageThreads}
            currentUser={currentUser}
            onOpenThread={handleOpenThread}
            onSendMessage={handleSendMessage}
          />
        );
      case "feed":
        return (
          <FeedSection
            socialAccounts={socialAccounts}
            socialPosts={socialPosts}
            communities={communities}
            currentUser={currentUser}
            onToggleAccount={handleToggleSocialAccount}
            onPublishPost={handlePublishPost}
          />
        );
      case "administracion":
        return (
          <AdministrationSection
            currentUser={currentUser}
            events={events}
            communities={communities}
            siteNews={siteNews}
            literatureSource={literatureSource}
            onRefreshNews={refreshLiteratureNews}
            newsLoading={newsLoading}
            onAddEvent={handleAddEvent}
            onAddCommunity={handleAddCommunity}
            onAddSiteNews={handleAddSiteNews}
          />
        );
      default:
        return <p className="lc-meta">Seccion no disponible.</p>;
    }
  }

  return (
    <>
      <GlobalStyles />
      <div className="lc-app">
        <header className="lc-topbar">
          <div className="lc-brand-wrap">
            <button
              type="button"
              className="lc-icon-button"
              aria-label="Expandir o colapsar menu"
              onClick={() => setDrawerOpen((prev) => !prev)}
            >
              |||
            </button>
            <h1 className="lc-brand">LitCafe LMS</h1>
          </div>

          <div className="lc-topbar-meta">
            <span className="lc-pill">
              {currentUser.name} ({currentUser.role === "admin" ? "admin" : "usuario"})
            </span>
            <span className="lc-pill">Mensajes sin leer: {totalUnreadMessages}</span>
            <button type="button" className="lc-button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <div className="lc-body" style={{ "--drawer-width": `${drawerOpen ? 250 : 86}px` }}>
          <aside className="lc-sidebar">
            <p className="lc-nav-title">Navegacion</p>
            <nav className="lc-nav-list" aria-label="Secciones principales">
              {appSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`lc-nav-button ${section.id === activeSection ? "is-active" : ""}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="lc-nav-icon">{section.icon}</span>
                  {drawerOpen ? section.label : null}
                </button>
              ))}
            </nav>
          </aside>

          <main className="lc-main">
            <div className="lc-main-shell">
              <header className="lc-main-heading">
                <h2>{activeSectionInfo.label}</h2>
                <p>
                  {activeSection === "tablero"
                    ? "Resumen de actividad en cursos, foros, mensajes, comunidades y noticias de literatura."
                    : activeSection === "administracion"
                      ? "Panel de gestion para crear eventos, noticias del sitio y comunidades."
                      : "Modulo funcional con datos mock para iterar la plataforma completa."}
                </p>
              </header>
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
