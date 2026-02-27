import { useCallback, useEffect, useMemo, useState } from "react";
import {
  appSections,
  fallbackLiteratureNews,
  initialCommunities,
  initialCourseCatalog,
  initialCourses,
  initialEnrollments,
  initialEvents,
  initialForums,
  initialMessageThreads,
  initialPayments,
  initialSiteNews,
  initialSocialAccounts,
  initialSocialPosts,
  initialTrainingPrograms,
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

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

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

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftMonth(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function buildMonthGrid(monthAnchor, eventsByDate) {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - firstWeekday;
    const cellDate = new Date(year, month, dayOffset + 1);
    const isoDate = toIsoDate(cellDate);
    cells.push({
      key: `${isoDate}-${index}`,
      date: cellDate,
      isoDate,
      day: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === month,
      events: eventsByDate.get(isoDate) || [],
    });
  }

  return cells;
}

function renderParagraphs(text) {
  const chunks = String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return <p className="lc-muted">Sin contenido disponible.</p>;
  }

  return (
    <div className="lc-grid" style={{ gap: 8 }}>
      {chunks.map((chunk, index) => (
        <p key={`paragraph-${index}`} className="lc-muted" style={{ margin: 0, lineHeight: 1.65 }}>
          {chunk}
        </p>
      ))}
    </div>
  );
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
        overflow-x: hidden;
        max-width: 100vw;
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

      .lc-pill.is-unread {
        border-color: #eed9af;
        background: ${C.warningBg};
        color: ${C.warningText};
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

      .lc-stat-card-button {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 10px;
        padding: 12px;
        text-align: left;
        cursor: pointer;
        font: inherit;
        color: inherit;
      }

      .lc-stat-card-button:hover {
        border-color: ${C.accent};
      }

      .lc-stat-card-button .lc-stat-value {
        margin-top: 2px;
      }

      .lc-stat-card-help {
        margin: 6px 0 0;
        color: ${C.accent};
        font-size: 12px;
        font-weight: 700;
      }

      .lc-tab-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .lc-tab-button {
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.charcoal};
        border-radius: 999px;
        padding: 6px 12px;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        font-weight: 700;
      }

      .lc-tab-button.is-active {
        background: ${C.accent};
        border-color: ${C.accent};
        color: #fff;
      }

      .lc-month-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }

      .lc-month-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
      }

      .lc-month-weekday {
        text-align: center;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: ${C.textSec};
        font-weight: 700;
      }

      .lc-month-cell {
        border: 1px solid ${C.border};
        border-radius: 8px;
        background: #fff;
        min-height: 86px;
        padding: 6px;
      }

      .lc-month-cell.is-outside {
        background: ${C.bgWarm};
        color: ${C.textMeta};
      }

      .lc-month-day {
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 700;
      }

      .lc-month-events {
        display: grid;
        gap: 4px;
      }

      .lc-month-event {
        border: 1px solid ${C.border};
        background: ${C.bg};
        border-radius: 6px;
        font-size: 11px;
        padding: 2px 4px;
      }

      .lc-landing-page {
        min-height: 100vh;
        background: linear-gradient(180deg, #f8f4ec 0%, #f5f1e8 35%, #f5f1e8 100%);
        overflow-x: hidden;
        max-width: 100vw;
      }

      .lc-landing-topbar {
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 18px;
        border-bottom: 1px solid ${C.border};
        background: ${C.bgCard};
        overflow: hidden;
        max-width: 100%;
      }

      .lc-landing-main {
        padding: 16px;
        overflow-x: hidden;
      }

      .lc-landing-hero {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 14px;
      }

      .lc-landing-hero h1 {
        margin: 0 0 8px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 44px;
      }

      .lc-landing-hero p {
        margin: 0;
        color: ${C.textSec};
        line-height: 1.6;
      }

      .lc-landing-kpis {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-top: 14px;
      }

      .lc-landing-kpi {
        border: 1px solid ${C.border};
        background: ${C.bg};
        border-radius: 8px;
        padding: 9px;
      }

      .lc-landing-kpi p {
        margin: 0;
      }

      .lc-marketplace-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .lc-marketplace-item {
        border: 1px solid ${C.border};
        border-radius: 12px;
        background: ${C.bgCard};
        padding: 20px;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .lc-marketplace-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      }

      /* ── Landing page hero redesign ── */
      .lc-landing-hero-new {
        background: linear-gradient(135deg, ${C.bgCard} 0%, #f0e9db 100%);
        border: 1px solid ${C.border};
        border-radius: 16px;
        padding: 48px 40px 44px;
        margin-bottom: 28px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .lc-landing-hero-new::before {
        content: "";
        position: absolute;
        top: -60px;
        right: -60px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: ${C.accent}10;
      }

      .lc-landing-hero-new::after {
        content: "";
        position: absolute;
        bottom: -40px;
        left: -40px;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: ${C.ochre}10;
      }

      .lc-landing-hero-new h1 {
        margin: 0 0 14px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 48px;
        line-height: 1.15;
        color: ${C.charcoal};
        position: relative;
        z-index: 1;
      }

      .lc-landing-hero-new .lc-hero-sub {
        margin: 0 auto 24px;
        max-width: 640px;
        font-size: 17px;
        line-height: 1.7;
        color: ${C.textSec};
        position: relative;
        z-index: 1;
      }

      .lc-landing-hero-new .lc-hero-ctas {
        display: flex;
        justify-content: center;
        gap: 12px;
        position: relative;
        z-index: 1;
      }

      .lc-button-lg {
        padding: 14px 28px;
        font-size: 16px;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        border: 2px solid ${C.accent};
        transition: all 0.18s ease;
      }

      .lc-button-lg.is-primary {
        background: ${C.accent};
        color: #fff;
      }

      .lc-button-lg.is-primary:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }

      .lc-button-lg.is-outline {
        background: transparent;
        color: ${C.accent};
      }

      .lc-button-lg.is-outline:hover {
        background: ${C.accent}0A;
      }

      /* ── Trust badges ── */
      .lc-trust-row {
        display: flex;
        justify-content: center;
        gap: 32px;
        margin-top: 28px;
        position: relative;
        z-index: 1;
      }

      .lc-trust-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: ${C.textSec};
      }

      .lc-trust-icon {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: ${C.accent}15;
        color: ${C.accent};
        font-size: 13px;
        font-weight: 700;
      }

      /* ── Section headings ── */
      .lc-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .lc-section-header h2 {
        margin: 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 28px;
        color: ${C.charcoal};
      }

      .lc-section-header .lc-see-all {
        font-size: 14px;
        font-weight: 700;
        color: ${C.accent};
        text-decoration: none;
        cursor: pointer;
        border: none;
        background: none;
      }

      .lc-section-header .lc-see-all:hover {
        text-decoration: underline;
      }

      /* ── News carousel ── */
      .lc-news-carousel-wrap {
        position: relative;
        margin-bottom: 36px;
        overflow: hidden;
        padding: 0 4px;
      }

      .lc-news-carousel {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        padding: 4px 0 12px;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .lc-news-carousel::-webkit-scrollbar {
        display: none;
      }

      .lc-news-card {
        flex: 0 0 300px;
        scroll-snap-align: start;
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }

      .lc-news-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.07);
      }

      .lc-news-card-img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
      }

      .lc-news-card-img-placeholder {
        width: 100%;
        height: 160px;
        background: linear-gradient(135deg, #f0ebe1 0%, #e8e2d6 50%, #ddd6c8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${C.textMeta};
        font-size: 32px;
      }

      .lc-news-card-content {
        padding: 16px 20px 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 8px;
      }

      .lc-news-card .lc-news-tag {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: ${C.ochre};
        background: ${C.ochre}12;
        border-radius: 6px;
        padding: 3px 8px;
        align-self: flex-start;
      }

      .lc-news-card h3 {
        margin: 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 18px;
        line-height: 1.3;
        color: ${C.charcoal};
      }

      .lc-news-card p {
        margin: 0;
        font-size: 13px;
        color: ${C.textSec};
        line-height: 1.5;
      }

      .lc-news-card .lc-news-meta {
        margin-top: auto;
        font-size: 12px;
        color: ${C.textMeta};
      }

      .lc-carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        color: ${C.charcoal};
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        z-index: 2;
        transition: background 0.15s ease;
      }

      .lc-carousel-nav:hover {
        background: ${C.bgWarm};
      }

      .lc-carousel-nav.is-left {
        left: 4px;
      }

      .lc-carousel-nav.is-right {
        right: 4px;
      }

      /* ── Course cards (landing) ── */
      .lc-course-card {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 14px;
        overflow: hidden;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .lc-course-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(0,0,0,0.09);
      }

      .lc-course-card-banner {
        height: 8px;
        background: linear-gradient(90deg, ${C.accent}, ${C.ochre});
      }

      .lc-course-card-body {
        padding: 22px 20px 18px;
      }

      .lc-course-card-body .lc-course-level {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: ${C.accent};
        margin-bottom: 8px;
      }

      .lc-course-card-body h3 {
        margin: 0 0 8px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 22px;
        line-height: 1.25;
        color: ${C.charcoal};
      }

      .lc-course-card-body .lc-course-desc {
        margin: 0 0 14px;
        font-size: 14px;
        line-height: 1.6;
        color: ${C.textSec};
      }

      .lc-course-card-details {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        font-size: 12px;
        color: ${C.textMeta};
      }

      .lc-course-card-details span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .lc-course-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        border-top: 1px solid ${C.border};
        padding: 14px 20px;
        background: ${C.bg};
      }

      .lc-course-price {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 24px;
        font-weight: 700;
        color: ${C.charcoal};
      }

      /* ── Event cards (landing) ── */
      .lc-event-card {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 18px;
        display: flex;
        gap: 16px;
        align-items: flex-start;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        cursor: pointer;
      }

      .lc-event-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.07);
      }

      .lc-event-date-box {
        flex: 0 0 56px;
        text-align: center;
        border: 1px solid ${C.border};
        border-radius: 10px;
        background: linear-gradient(180deg, ${C.accent}12 0%, ${C.bgCard} 100%);
        padding: 8px 6px;
      }

      .lc-event-date-box .lc-event-day {
        margin: 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 24px;
        font-weight: 700;
        color: ${C.accent};
        line-height: 1;
      }

      .lc-event-date-box .lc-event-month {
        margin: 2px 0 0;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: ${C.textMeta};
      }

      .lc-event-info h3 {
        margin: 0 0 6px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 17px;
        color: ${C.charcoal};
        line-height: 1.3;
      }

      .lc-event-info .lc-event-meta-line {
        margin: 0 0 3px;
        font-size: 13px;
        color: ${C.textSec};
      }

      .lc-event-type-tag {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-radius: 6px;
        padding: 2px 8px;
        margin-top: 4px;
      }

      .lc-event-type-tag.is-presencial {
        background: ${C.successBg};
        color: ${C.successText};
      }

      .lc-event-type-tag.is-virtual {
        background: #EAE8FF;
        color: #5046A5;
      }

      .lc-event-type-tag.is-hibrido {
        background: ${C.warningBg};
        color: ${C.warningText};
      }

      /* ── Community/Silo cards ── */
      .lc-community-card {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 22px 20px;
        text-align: center;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .lc-community-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.07);
      }

      .lc-community-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${C.accent}20, ${C.ochre}20);
        border: 2px solid ${C.accent}30;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 20px;
        font-weight: 700;
        color: ${C.accent};
      }

      .lc-community-card h3 {
        margin: 0 0 4px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 17px;
        color: ${C.charcoal};
      }

      .lc-community-card .lc-community-cat {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: ${C.ochre};
        margin-bottom: 6px;
      }

      .lc-community-card .lc-community-desc {
        margin: 0 0 10px;
        font-size: 13px;
        line-height: 1.5;
        color: ${C.textSec};
      }

      .lc-community-card .lc-community-members {
        font-size: 12px;
        font-weight: 600;
        color: ${C.textMeta};
      }

      /* ── CTA banner ── */
      .lc-cta-banner {
        background: linear-gradient(135deg, ${C.accent} 0%, #9A4A33 100%);
        border-radius: 16px;
        padding: 40px;
        text-align: center;
        margin-top: 12px;
      }

      .lc-cta-banner h2 {
        margin: 0 0 10px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 32px;
        color: #fff;
      }

      .lc-cta-banner p {
        margin: 0 0 20px;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
      }

      .lc-cta-banner .lc-button-cta {
        background: #fff;
        color: ${C.accent};
        border: none;
        border-radius: 10px;
        padding: 14px 32px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease;
      }

      .lc-cta-banner .lc-button-cta:hover {
        transform: translateY(-1px);
      }

      /* ── Landing sections spacing ── */
      .lc-landing-section {
        margin-bottom: 36px;
      }

      .lc-events-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .lc-communities-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .lc-ig-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .lc-ig-post {
        border: 1px solid ${C.border};
        border-radius: 12px;
        background: ${C.bgCard};
        overflow: hidden;
        transition: border-color 0.15s, box-shadow 0.15s;
      }

      .lc-ig-post:hover {
        border-color: ${C.accent};
        box-shadow: 0 2px 12px rgba(184, 101, 74, 0.08);
      }

      .lc-ig-post-placeholder {
        aspect-ratio: 1;
        background: linear-gradient(135deg, #f0ebe1 0%, #e8e2d6 50%, #ddd6c8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${C.textMeta};
      }

      .lc-social-footer {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 12px;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 36px;
      }

      .lc-social-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 8px;
        border: 1px solid ${C.border};
        background: ${C.bg};
        color: ${C.textSec};
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: color 0.15s, border-color 0.15s;
      }

      .lc-social-badge:hover {
        color: ${C.accent};
        border-color: ${C.accent};
      }

      .lc-detail-main {
        min-height: 100vh;
        padding: 18px;
        overflow-x: hidden;
        background: ${C.bg};
      }

      .lc-detail-shell {
        max-width: 980px;
        margin: 0 auto;
        display: grid;
        gap: 16px;
      }

      .lc-detail-hero-img {
        width: 100%;
        height: 340px;
        object-fit: cover;
        border-radius: 14px;
        display: block;
        border: 1px solid ${C.border};
      }

      .lc-detail-hero-placeholder {
        width: 100%;
        height: 340px;
        border-radius: 14px;
        background: linear-gradient(135deg, ${C.bgWarm} 0%, #ddd6c8 50%, ${C.bgDrawer} 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${C.textMeta};
        font-size: 48px;
        border: 1px solid ${C.border};
      }

      .lc-detail-header {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 14px;
        padding: 28px 32px;
      }

      .lc-detail-header h1 {
        margin: 0 0 12px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 36px;
        line-height: 1.2;
        color: ${C.charcoal};
      }

      .lc-detail-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }

      .lc-detail-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid ${C.border};
        background: ${C.bg};
        font-size: 13px;
        font-weight: 600;
        color: ${C.textSec};
      }

      .lc-detail-tag.is-accent {
        border-color: ${C.accent}40;
        background: ${C.accent}08;
        color: ${C.accent};
      }

      .lc-detail-body {
        border: 1px solid ${C.border};
        background: ${C.bgCard};
        border-radius: 14px;
        padding: 28px 32px;
      }

      .lc-detail-body h3 {
        margin: 0 0 12px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 20px;
        color: ${C.charcoal};
      }

      .lc-detail-sidebar {
        display: grid;
        gap: 16px;
      }

      .lc-detail-price-card {
        border: 2px solid ${C.accent};
        background: ${C.bgCard};
        border-radius: 14px;
        padding: 24px;
        text-align: center;
      }

      .lc-detail-price {
        margin: 0 0 4px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 38px;
        font-weight: 700;
        color: ${C.accent};
      }

      .lc-detail-2col {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
        gap: 16px;
        align-items: start;
      }

      .lc-detail-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .lc-detail-info-item {
        border: 1px solid ${C.border};
        border-radius: 10px;
        padding: 14px;
        background: ${C.bg};
      }

      .lc-detail-info-item .lc-detail-info-label {
        margin: 0 0 4px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        font-weight: 700;
        color: ${C.textMeta};
      }

      .lc-detail-info-item .lc-detail-info-value {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: ${C.charcoal};
      }

      .lc-syllabus-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }

      .lc-syllabus-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border: 1px solid ${C.border};
        border-radius: 8px;
        background: ${C.bg};
        font-size: 14px;
        color: ${C.charcoal};
      }

      .lc-syllabus-num {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: ${C.accent}15;
        color: ${C.accent};
        font-size: 12px;
        font-weight: 700;
        flex-shrink: 0;
      }

      .lc-detail-img-edit {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 8px;
      }

      .lc-detail-img-edit input {
        flex: 1;
      }

      .lc-event-detail-map {
        width: 100%;
        height: 180px;
        border-radius: 10px;
        background: linear-gradient(135deg, #e8e2d6 0%, #ddd6c8 50%, #d4cfc4 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${C.border};
        color: ${C.textMeta};
        font-size: 14px;
        gap: 8px;
      }

      @media (max-width: 980px) {
        .lc-detail-2col {
          grid-template-columns: 1fr;
        }

        .lc-detail-hero-img,
        .lc-detail-hero-placeholder {
          height: 200px;
        }

        .lc-detail-header {
          padding: 20px;
        }

        .lc-detail-header h1 {
          font-size: 26px;
        }

        .lc-detail-body {
          padding: 20px;
        }

        .lc-detail-info-grid {
          grid-template-columns: 1fr;
        }
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

        .lc-landing-kpis {
          grid-template-columns: 1fr;
        }

        .lc-marketplace-grid {
          grid-template-columns: 1fr;
        }

        .lc-landing-hero-new h1 {
          font-size: 32px;
        }

        .lc-landing-hero-new {
          padding: 28px 20px;
        }

        .lc-trust-row {
          flex-wrap: wrap;
          gap: 16px;
        }

        .lc-events-grid {
          grid-template-columns: 1fr;
        }

        .lc-communities-grid {
          grid-template-columns: 1fr;
        }

        .lc-ig-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .lc-social-footer {
          flex-direction: column;
          align-items: flex-start;
        }

        .lc-hero-ctas {
          flex-direction: column;
          align-items: stretch;
        }

        .lc-cta-banner {
          padding: 28px 20px;
        }

        .lc-cta-banner h2 {
          font-size: 24px;
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

function SocialIcon({ network, size = 22 }) {
  const icons = {
    Instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    Facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    X: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    YouTube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  };
  return icons[network] || null;
}

function LandingScreen({
  literatureNews,
  siteNews,
  events,
  forums,
  courseCatalog,
  communities,
  socialAccounts,
  socialPosts,
  cartItems,
  cartTotal,
  onAddCourseToCart,
  onDecreaseCourseFromCart,
  onRemoveCourseFromCart,
  onClearCart,
  onOpenLogin,
  onOpenDetail,
}) {
  const allNews = [
    ...literatureNews.slice(0, 4).map((n) => ({ ...n, kind: "Literatura" })),
    ...siteNews.slice(0, 4).map((n) => ({ ...n, kind: "Novedad", source: n.author })),
  ];
  const sortedEvents = [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)).slice(0, 4);
  const connectedAccounts = socialAccounts.filter((a) => a.connected);
  const instagramConnected = socialAccounts.some((a) => a.network === "Instagram" && a.connected);
  const instagramPosts = instagramConnected ? socialPosts.filter((p) => p.network === "Instagram").slice(0, 6) : [];
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const carouselRef = { current: null };

  function scrollCarousel(direction) {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = 320;
    el.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  }

  function getEventDateParts(dateStr) {
    if (!dateStr) return { day: "--", month: "---" };
    const d = new Date(dateStr + "T00:00:00");
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("es-AR", { month: "short" }).format(d).toUpperCase(),
    };
  }

  function eventTypeClass(type) {
    if (type === "presencial") return "is-presencial";
    if (type === "virtual") return "is-virtual";
    return "is-hibrido";
  }

  return (
    <div className="lc-landing-page">
      <header className="lc-landing-topbar">
        <div className="lc-brand-wrap">
          <h1 className="lc-brand">Lead Cafe</h1>
          <span className="lc-pill">Tu espacio de formacion literaria</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {connectedAccounts.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {connectedAccounts.map((account) => (
                <span
                  key={account.id}
                  title={`${account.network}: ${account.handle}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    background: C.bg,
                    color: C.textSec,
                    cursor: "pointer",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.accent;
                    e.currentTarget.style.borderColor = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.textSec;
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  <SocialIcon network={account.network} size={18} />
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            className="lc-button-lg is-outline"
            style={{ padding: "8px 16px", fontSize: 14 }}
            onClick={() => onOpenDetail("cart", "landing-cart")}
          >
            Carrito ({cartItemsCount})
          </button>
          <button
            type="button"
            className="lc-button-lg is-outline"
            style={{ padding: "8px 16px", fontSize: 14 }}
            onClick={onOpenLogin}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            className="lc-button-lg is-primary"
            style={{ padding: "8px 16px", fontSize: 14 }}
            onClick={() => onOpenDetail("catalog-course", courseCatalog[0]?.id)}
            disabled={courseCatalog.length === 0}
          >
            Ver cursos
          </button>
        </div>
      </header>

      <main className="lc-landing-main">
        <div className="lc-main-shell">

          {/* ── Hero ── */}
          <section className="lc-landing-hero-new">
            <span
              className="lc-tag is-accent"
              style={{ marginBottom: 16, display: "inline-flex", position: "relative", zIndex: 1 }}
            >
              Inscripciones abiertas
            </span>
            <h1>Transforma tu pasion por la literatura en conocimiento real</h1>
            <p className="lc-hero-sub">
              Cursos con mentores especializados, talleres en vivo, comunidades activas y
              herramientas para que tu formacion literaria no tenga limites.
            </p>
            <div className="lc-hero-ctas">
              <button
                type="button"
                className="lc-button-lg is-primary"
                onClick={() => onOpenDetail("catalog-course", courseCatalog[0]?.id)}
                disabled={courseCatalog.length === 0}
              >
                Explorar cursos
              </button>
              <button type="button" className="lc-button-lg is-outline" onClick={onOpenLogin}>
                Comenzar gratis
              </button>
            </div>
            <div className="lc-trust-row">
              <span className="lc-trust-item">
                <span className="lc-trust-icon">M</span> Mentores expertos
              </span>
              <span className="lc-trust-item">
                <span className="lc-trust-icon">C</span> Certificacion incluida
              </span>
              <span className="lc-trust-item">
                <span className="lc-trust-icon">V</span> Clases en vivo y grabadas
              </span>
            </div>
          </section>

          {/* ── Cursos ── */}
          <section className="lc-landing-section">
            <div className="lc-section-header">
              <h2>Cursos disponibles</h2>
              <button type="button" className="lc-see-all" onClick={onOpenLogin}>
                Ver todos
              </button>
            </div>
            <div className="lc-marketplace-grid">
              {courseCatalog.map((course) => (
                <article key={course.id} className="lc-course-card">
                  <div className="lc-course-card-banner" />
                  <div className="lc-course-card-body">
                    <span className="lc-course-level">{course.level}</span>
                    <h3>{course.title}</h3>
                    <p className="lc-course-desc">{course.description}</p>
                    <div className="lc-course-card-details">
                      <span>{course.duration}</span>
                      <span>{course.format}</span>
                    </div>
                  </div>
                  <div className="lc-course-card-footer">
                    <span className="lc-course-price">{formatCurrency(course.price)}</span>
                    <button
                      type="button"
                      className="lc-button is-primary"
                      style={{ borderRadius: 8, padding: "10px 18px", fontWeight: 700 }}
                      onClick={() => onOpenDetail("catalog-course", course.id)}
                    >
                      Ver curso
                    </button>
                    <button
                      type="button"
                      className="lc-button"
                      style={{ borderRadius: 8, padding: "10px 14px", fontWeight: 700 }}
                      onClick={() => onAddCourseToCart(course.id)}
                    >
                      Agregar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Carrito ── */}
          <section className="lc-landing-section">
            <div className="lc-section-header">
              <h2>Carrito de compra ({cartItemsCount})</h2>
              {cartItems.length > 0 ? (
                <button type="button" className="lc-see-all" onClick={onClearCart}>
                  Vaciar carrito
                </button>
              ) : null}
            </div>
            {cartItems.length === 0 ? (
              <p className="lc-meta">Tu carrito esta vacio. Agrega cursos desde el catalogo para empezar.</p>
            ) : (
              <div className="lc-grid" style={{ gap: 10 }}>
                <ul className="lc-list">
                  {cartItems.map((item) => (
                    <li key={item.course.id} className="lc-list-item">
                      <div className="lc-row" style={{ alignItems: "flex-start" }}>
                        <div>
                          <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{item.course.title}</p>
                          <p className="lc-meta">
                            {item.quantity} x {formatCurrency(item.course.price)} = {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                        <div className="lc-row" style={{ gap: 6 }}>
                          <button type="button" className="lc-button" onClick={() => onDecreaseCourseFromCart(item.course.id)}>
                            -
                          </button>
                          <button type="button" className="lc-button" onClick={() => onAddCourseToCart(item.course.id)}>
                            +
                          </button>
                          <button type="button" className="lc-link" onClick={() => onRemoveCourseFromCart(item.course.id)}>
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="lc-row">
                  <p className="lc-stat-label" style={{ margin: 0 }}>
                    Total
                  </p>
                  <p style={{ margin: 0, fontWeight: 700 }}>{formatCurrency(cartTotal)}</p>
                </div>
                <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>
                  Iniciar sesion para finalizar compra
                </button>
              </div>
            )}
          </section>

          {/* ── Noticias carousel ── */}
          <section className="lc-landing-section">
            <div className="lc-section-header">
              <h2>Noticias</h2>
            </div>
            <div className="lc-news-carousel-wrap">
              <button
                type="button"
                className="lc-carousel-nav is-left"
                onClick={() => scrollCarousel("left")}
                aria-label="Anterior"
              >
                &#8249;
              </button>
              <div
                className="lc-news-carousel"
                ref={(el) => { carouselRef.current = el; }}
              >
                {allNews.map((item) => (
                  <article
                    key={item.id}
                    className="lc-news-card"
                    onClick={() =>
                      onOpenDetail(
                        item.kind === "Literatura" ? "literature-news" : "internal-news",
                        item.id,
                      )
                    }
                  >
                    {item.thumbnail ? (
                      <img
                        className="lc-news-card-img"
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="lc-news-card-img-placeholder">&#9997;</div>
                    )}
                    <div className="lc-news-card-content">
                      <span className="lc-news-tag">{item.kind}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <p className="lc-news-meta">
                        {item.source || "Lead Cafe"} &middot; {formatDate(item.publishedAt)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="lc-carousel-nav is-right"
                onClick={() => scrollCarousel("right")}
                aria-label="Siguiente"
              >
                &#8250;
              </button>
            </div>
          </section>

          {/* ── Eventos ── */}
          <section className="lc-landing-section">
            <div className="lc-section-header">
              <h2>Proximos eventos</h2>
              <button type="button" className="lc-see-all" onClick={onOpenLogin}>
                Ver calendario
              </button>
            </div>
            <div className="lc-events-grid">
              {sortedEvents.map((eventItem) => {
                const dp = getEventDateParts(eventItem.date);
                return (
                  <article
                    key={eventItem.id}
                    className="lc-event-card"
                    onClick={() => onOpenDetail("event", eventItem.id)}
                  >
                    <div className="lc-event-date-box">
                      <p className="lc-event-day">{dp.day}</p>
                      <p className="lc-event-month">{dp.month}</p>
                    </div>
                    <div className="lc-event-info">
                      <h3>{eventItem.title}</h3>
                      <p className="lc-event-meta-line">{eventItem.time} &middot; {eventItem.location}</p>
                      <span className={`lc-event-type-tag ${eventTypeClass(eventItem.type)}`}>
                        {eventItem.type}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Comunidades / Silos ── */}
          {communities && communities.length > 0 && (
            <section className="lc-landing-section">
              <div className="lc-section-header">
                <h2>Nuestras comunidades</h2>
                <button type="button" className="lc-see-all" onClick={onOpenLogin}>
                  Unirme
                </button>
              </div>
              <div className="lc-communities-grid">
                {communities.map((community) => (
                  <article key={community.id} className="lc-community-card">
                    <div className="lc-community-avatar">
                      {community.name.charAt(0)}
                    </div>
                    <span className="lc-community-cat">{community.category}</span>
                    <h3>{community.name}</h3>
                    <p className="lc-community-desc">{community.description}</p>
                    <p className="lc-community-members">Comunidad activa</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Instagram feed ── */}
          {instagramPosts.length > 0 && (
            <section className="lc-landing-section">
              <div className="lc-section-header">
                <h2>Ultimas de Instagram</h2>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textSec, fontSize: 13, fontWeight: 600 }}>
                  <SocialIcon network="Instagram" size={16} />
                  {socialAccounts.find((a) => a.network === "Instagram")?.handle}
                </span>
              </div>
              <div className="lc-ig-grid">
                {instagramPosts.map((post) => (
                  <article key={post.id} className="lc-ig-post">
                    <div className="lc-ig-post-placeholder">
                      <SocialIcon network="Instagram" size={28} />
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.55, color: C.charcoal }}>
                        {post.text}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="lc-meta" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          {post.likes}
                        </span>
                        <span className="lc-meta" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          {post.comments}
                        </span>
                        <span className="lc-meta">{post.at}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Redes sociales footer ── */}
          {connectedAccounts.length > 0 && (
            <section className="lc-social-footer">
              <div>
                <h3 style={{ margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.charcoal }}>
                  Seguinos en redes
                </h3>
                <p className="lc-meta">Encontra mas contenido literario en nuestras redes sociales.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {connectedAccounts.map((account) => (
                  <span
                    key={account.id}
                    title={`${account.network}: ${account.handle}`}
                    className="lc-social-badge"
                  >
                    <SocialIcon network={account.network} size={16} />
                    {account.handle}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── CTA final ── */}
          <section className="lc-cta-banner">
            <h2>Empieza hoy tu formacion literaria</h2>
            <p>Unite a una comunidad de lectores apasionados y aprende con los mejores mentores.</p>
            <button type="button" className="lc-button-cta" onClick={onOpenLogin}>
              Crear cuenta gratis
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

function LandingDetailScreen({
  view,
  literatureNews,
  siteNews,
  events,
  forums,
  courseCatalog,
  cartItems,
  cartTotal,
  onAddCourseToCart,
  onDecreaseCourseFromCart,
  onRemoveCourseFromCart,
  onClearCart,
  onBack,
  onOpenLogin,
  onUpdateCourseCatalog,
  onUpdateEvent,
  isAdmin,
}) {
  const [editingImage, setEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  function getEventDateParts(dateStr) {
    if (!dateStr) return { day: "--", month: "---", weekday: "---" };
    const d = new Date(dateStr + "T00:00:00");
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("es-AR", { month: "long" }).format(d),
      weekday: new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(d),
    };
  }

  function eventTypeLabel(type) {
    if (type === "presencial") return "Presencial";
    if (type === "virtual") return "Virtual";
    return "Hibrido";
  }

  if (view.kind === "catalog-course") {
    const course = courseCatalog.find((item) => item.id === view.id);
    if (!course) {
      return (
        <main className="lc-detail-main">
          <div className="lc-detail-shell">
            <button type="button" className="lc-button" onClick={onBack}>&#8592; Volver</button>
            <div className="lc-detail-header">
              <h1>Curso no encontrado</h1>
              <p className="lc-muted">El curso solicitado no esta disponible.</p>
            </div>
          </div>
        </main>
      );
    }

    const currentImage = course.image || "";

    return (
      <main className="lc-detail-main">
        <div className="lc-detail-shell">
          <div className="lc-row">
            <button type="button" className="lc-button" onClick={onBack}>&#8592; Volver</button>
            <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>Iniciar sesion</button>
          </div>

          {currentImage ? (
            <img className="lc-detail-hero-img" src={currentImage} alt={course.title} />
          ) : (
            <div className="lc-detail-hero-placeholder">&#128218;</div>
          )}

          {isAdmin && (
            <div className="lc-detail-body" style={{ padding: "14px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span className="lc-tag is-accent">Admin</span>
                <span style={{ fontSize: 13, color: C.textSec }}>Editar imagen del curso:</span>
                {editingImage ? (
                  <>
                    <input
                      className="lc-input"
                      type="url"
                      placeholder="URL de la imagen"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <button
                      type="button"
                      className="lc-button is-primary"
                      onClick={() => {
                        if (onUpdateCourseCatalog && imageUrl.trim()) {
                          onUpdateCourseCatalog(course.id, { image: imageUrl.trim() });
                        }
                        setEditingImage(false);
                        setImageUrl("");
                      }}
                    >
                      Guardar
                    </button>
                    <button type="button" className="lc-button" onClick={() => { setEditingImage(false); setImageUrl(""); }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button type="button" className="lc-button" onClick={() => { setEditingImage(true); setImageUrl(currentImage); }}>
                    Cambiar imagen
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="lc-detail-2col">
            <div style={{ display: "grid", gap: 16 }}>
              <div className="lc-detail-header">
                <div className="lc-detail-tags">
                  <span className="lc-detail-tag is-accent">{course.level}</span>
                  <span className="lc-detail-tag">{course.duration}</span>
                  <span className="lc-detail-tag">{course.format}</span>
                </div>
                <h1>{course.title}</h1>
                {course.mentor && (
                  <p style={{ margin: "0 0 12px", fontSize: 15, color: C.textSec }}>
                    Mentor: <strong style={{ color: C.charcoal }}>{course.mentor}</strong>
                  </p>
                )}
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.textSec }}>
                  {course.longDescription || course.description}
                </p>
              </div>

              {course.syllabus && course.syllabus.length > 0 && (
                <div className="lc-detail-body">
                  <h3>Programa del curso</h3>
                  <ul className="lc-syllabus-list">
                    {course.syllabus.map((item, idx) => (
                      <li key={idx} className="lc-syllabus-item">
                        <span className="lc-syllabus-num">{idx + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lc-detail-sidebar">
              <div className="lc-detail-price-card">
                <p className="lc-detail-price">{formatCurrency(course.price)}</p>
                <p className="lc-meta" style={{ marginBottom: 16 }}>Precio total del curso</p>
                <button
                  type="button"
                  className="lc-button-lg is-primary"
                  style={{ width: "100%", marginBottom: 10 }}
                  onClick={() => onAddCourseToCart(course.id)}
                >
                  Agregar al carrito
                </button>
                <button
                  type="button"
                  className="lc-button-lg is-outline"
                  style={{ width: "100%" }}
                  onClick={onOpenLogin}
                >
                  Inscribirme ahora
                </button>
              </div>

              <div className="lc-detail-body">
                <h3>Detalles</h3>
                <div className="lc-detail-info-grid">
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Nivel</p>
                    <p className="lc-detail-info-value">{course.level}</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Duracion</p>
                    <p className="lc-detail-info-value">{course.duration}</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Formato</p>
                    <p className="lc-detail-info-value">{course.format}</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Mentor</p>
                    <p className="lc-detail-info-value">{course.mentor || "Por confirmar"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (view.kind === "event") {
    const eventItem = events.find((event) => event.id === view.id);
    if (!eventItem) {
      return (
        <main className="lc-detail-main">
          <div className="lc-detail-shell">
            <button type="button" className="lc-button" onClick={onBack}>&#8592; Volver</button>
            <div className="lc-detail-header">
              <h1>Evento no encontrado</h1>
              <p className="lc-muted">El evento solicitado no esta disponible.</p>
            </div>
          </div>
        </main>
      );
    }

    const dp = getEventDateParts(eventItem.date);
    const currentImage = eventItem.image || "";

    return (
      <main className="lc-detail-main">
        <div className="lc-detail-shell">
          <div className="lc-row">
            <button type="button" className="lc-button" onClick={onBack}>&#8592; Volver</button>
            <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>Iniciar sesion</button>
          </div>

          {currentImage ? (
            <img className="lc-detail-hero-img" src={currentImage} alt={eventItem.title} />
          ) : (
            <div className="lc-detail-hero-placeholder">&#128197;</div>
          )}

          {isAdmin && (
            <div className="lc-detail-body" style={{ padding: "14px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span className="lc-tag is-accent">Admin</span>
                <span style={{ fontSize: 13, color: C.textSec }}>Editar imagen del evento:</span>
                {editingImage ? (
                  <>
                    <input
                      className="lc-input"
                      type="url"
                      placeholder="URL de la imagen"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <button
                      type="button"
                      className="lc-button is-primary"
                      onClick={() => {
                        if (onUpdateEvent && imageUrl.trim()) {
                          onUpdateEvent(eventItem.id, { image: imageUrl.trim() });
                        }
                        setEditingImage(false);
                        setImageUrl("");
                      }}
                    >
                      Guardar
                    </button>
                    <button type="button" className="lc-button" onClick={() => { setEditingImage(false); setImageUrl(""); }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button type="button" className="lc-button" onClick={() => { setEditingImage(true); setImageUrl(currentImage); }}>
                    Cambiar imagen
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="lc-detail-2col">
            <div style={{ display: "grid", gap: 16 }}>
              <div className="lc-detail-header">
                <div className="lc-detail-tags">
                  <span className={`lc-detail-tag is-accent`}>{eventTypeLabel(eventItem.type)}</span>
                  <span className="lc-detail-tag">{dp.weekday}, {dp.day} de {dp.month}</span>
                  <span className="lc-detail-tag">{eventItem.time} hs</span>
                </div>
                <h1>{eventItem.title}</h1>
                {eventItem.description && (
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.textSec }}>
                    {eventItem.description}
                  </p>
                )}
              </div>

              <div className="lc-detail-body">
                <h3>Ubicacion</h3>
                <div className="lc-detail-info-grid" style={{ marginBottom: 16 }}>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Lugar</p>
                    <p className="lc-detail-info-value">{eventItem.location}</p>
                  </div>
                  {eventItem.address && (
                    <div className="lc-detail-info-item">
                      <p className="lc-detail-info-label">Direccion</p>
                      <p className="lc-detail-info-value">{eventItem.address}</p>
                    </div>
                  )}
                </div>
                <div className="lc-event-detail-map">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {eventItem.address || eventItem.location}
                </div>
              </div>
            </div>

            <div className="lc-detail-sidebar">
              <div className="lc-detail-price-card" style={{ borderColor: C.ochre }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `${C.accent}15`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px", fontSize: 28, color: C.accent,
                }}>
                  &#128197;
                </div>
                <p style={{ margin: "0 0 2px", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.charcoal }}>
                  {dp.day} de {dp.month}
                </p>
                <p className="lc-meta" style={{ marginBottom: 16 }}>{eventItem.time} hs &middot; {eventTypeLabel(eventItem.type)}</p>
                <button
                  type="button"
                  className="lc-button-lg is-primary"
                  style={{ width: "100%" }}
                  onClick={onOpenLogin}
                >
                  Reservar lugar
                </button>
              </div>

              <div className="lc-detail-body">
                <h3>Informacion</h3>
                <div className="lc-detail-info-grid">
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Tipo</p>
                    <p className="lc-detail-info-value">{eventTypeLabel(eventItem.type)}</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Cupos</p>
                    <p className="lc-detail-info-value">{eventItem.seats} lugares</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Fecha</p>
                    <p className="lc-detail-info-value">{formatDate(eventItem.date)}</p>
                  </div>
                  <div className="lc-detail-info-item">
                    <p className="lc-detail-info-label">Organiza</p>
                    <p className="lc-detail-info-value">{eventItem.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  let title = "Detalle";
  let meta = "";
  let body = null;
  let cta = null;
  let heroImage = null;

  if (view.kind === "literature-news") {
    const item = literatureNews.find((news) => news.id === view.id);
    if (item) {
      title = item.title;
      meta = `${item.source || "LitCafe"} | ${formatDate(item.publishedAt)}`;
      heroImage = item.thumbnail || "";
      body = renderParagraphs(item.content || item.summary);
      cta = (
        <a className="lc-link" href={item.url || "#"} target="_blank" rel="noreferrer">
          Abrir noticia completa &#8594;
        </a>
      );
    }
  } else if (view.kind === "internal-news") {
    const item = siteNews.find((news) => news.id === view.id);
    if (item) {
      title = item.title;
      meta = `Novedad interna | ${formatDate(item.publishedAt)}`;
      body = <p className="lc-muted">{item.summary}</p>;
      cta = (
        <a className="lc-link" href={item.url || "#"} target="_blank" rel="noreferrer">
          Abrir publicacion &#8594;
        </a>
      );
    }
  } else if (view.kind === "forum") {
    const forum = forums.find((item) => item.id === view.id);
    if (forum) {
      title = forum.title;
      meta = `${forum.course} | ${forum.author} | ${formatDate(forum.createdAt)}`;
      body = (
        <div className="lc-grid" style={{ gap: 10 }}>
          <p className="lc-muted" style={{ margin: 0 }}>{forum.content}</p>
          <div>
            <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>Comentarios del foro</p>
            <ul className="lc-list">
              {forum.comments.map((comment) => (
                <li key={comment.id} className="lc-list-item">
                  <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{comment.author}</p>
                  <p className="lc-muted" style={{ margin: "0 0 3px", fontSize: 13 }}>{comment.text}</p>
                  <p className="lc-meta">{comment.at}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
      cta = (
        <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>
          Iniciar sesion para responder en el foro
        </button>
      );
    }
  } else if (view.kind === "cart") {
    title = "Carrito de compra";
    meta = `${cartItemsCount} curso(s) agregados`;
    body =
      cartItems.length === 0 ? (
        <p className="lc-muted">Tu carrito esta vacio. Vuelve al catalogo para sumar cursos.</p>
      ) : (
        <div className="lc-grid" style={{ gap: 10 }}>
          <ul className="lc-list">
            {cartItems.map((item) => (
              <li key={item.course.id} className="lc-list-item">
                <div className="lc-row" style={{ alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{item.course.title}</p>
                    <p className="lc-meta">
                      {item.quantity} x {formatCurrency(item.course.price)} = {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                  <div className="lc-row" style={{ gap: 6 }}>
                    <button type="button" className="lc-button" onClick={() => onDecreaseCourseFromCart(item.course.id)}>-</button>
                    <button type="button" className="lc-button" onClick={() => onAddCourseToCart(item.course.id)}>+</button>
                    <button type="button" className="lc-link" onClick={() => onRemoveCourseFromCart(item.course.id)}>Quitar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="lc-row">
            <p className="lc-stat-label" style={{ margin: 0 }}>Total</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{formatCurrency(cartTotal)}</p>
          </div>
        </div>
      );
    cta = (
      <div className="lc-row" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
        {cartItems.length > 0 ? (
          <button type="button" className="lc-button" onClick={onClearCart}>Vaciar carrito</button>
        ) : null}
        <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>
          Iniciar sesion para finalizar compra
        </button>
      </div>
    );
  }

  return (
    <main className="lc-detail-main">
      <div className="lc-detail-shell">
        <div className="lc-row">
          <button type="button" className="lc-button" onClick={onBack}>&#8592; Volver</button>
          <button type="button" className="lc-button is-primary" onClick={onOpenLogin}>Iniciar sesion</button>
        </div>

        {heroImage && (
          <img className="lc-detail-hero-img" src={heroImage} alt={title} />
        )}

        <div className="lc-detail-header">
          <h1>{title}</h1>
          <p className="lc-meta" style={{ marginBottom: 0 }}>{meta || "Contenido no encontrado."}</p>
        </div>

        <div className="lc-detail-body">
          {body || <p className="lc-muted">No se encontro el detalle solicitado.</p>}
          {cta ? <div style={{ marginTop: 16 }}>{cta}</div> : null}
        </div>
      </div>
    </main>
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
  onOpenForumThread,
}) {
  const totalPendingTasks = courses.reduce(
    (acc, course) => acc + (course.activities || []).filter((activity) => activity.status !== "completada").length,
    0,
  );
  const avgProgress = Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / Math.max(courses.length, 1));
  const unreadMessages = messageThreads.reduce((acc, thread) => acc + (thread.unread || 0), 0);

  const upcomingEvents = [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)).slice(0, 4);
  const topForums = forums.slice(0, 4);
  const topNews = literatureNews.slice(0, 4);

  return (
    <div className="lc-grid">
      <div className="lc-grid lc-grid-4">
        <button type="button" className="lc-stat-card-button" onClick={() => onGoToSection("cursos")}>
          <p className="lc-stat-label">Cursos activos</p>
          <p className="lc-stat-value">{courses.length}</p>
          <p className="lc-meta">Con progreso promedio de {avgProgress}%</p>
          <p className="lc-stat-card-help">Abrir cursos activos</p>
        </button>

        <button type="button" className="lc-stat-card-button" onClick={() => onGoToSection("tareas")}>
          <p className="lc-stat-label">Tareas pendientes</p>
          <p className="lc-stat-value">{totalPendingTasks}</p>
          <p className="lc-meta">Para completar esta semana</p>
          <p className="lc-stat-card-help">Abrir tareas pendientes</p>
        </button>

        <button type="button" className="lc-stat-card-button" onClick={() => onGoToSection("calendario")}>
          <p className="lc-stat-label">Eventos proximos</p>
          <p className="lc-stat-value">{events.length}</p>
          <p className="lc-meta">Con calendario academico y grilla mensual</p>
          <p className="lc-stat-card-help">Abrir eventos proximos</p>
        </button>

        <button type="button" className="lc-stat-card-button" onClick={() => onGoToSection("mensajes")}>
          <p className="lc-stat-label">Mensajes sin leer</p>
          <p className="lc-stat-value">{unreadMessages}</p>
          <p className="lc-meta">En conversaciones y grupos</p>
          <p className="lc-stat-card-help">Abrir mensajes</p>
        </button>
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
                <button className="lc-link" type="button" onClick={() => onGoToSection("calendario")}>
                  {eventItem.title}
                </button>
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
                <button className="lc-link" type="button" onClick={() => onOpenForumThread(forum.id)}>
                  {forum.title}
                </button>
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

function CoursesSection({ courses, currentUser, onAddCourseComment, externalSelection }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [courseTab, setCourseTab] = useState("inicio");
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    if (courses.length === 0) {
      setSelectedCourseId("");
      return;
    }
    if (!courses.some((course) => course.id === selectedCourseId)) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (!externalSelection?.courseId) {
      return;
    }
    if (!courses.some((course) => course.id === externalSelection.courseId)) {
      return;
    }
    setSelectedCourseId(externalSelection.courseId);
    if (externalSelection.tab) {
      setCourseTab(externalSelection.tab);
    }
  }, [externalSelection, courses]);

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  function openCourse(courseId) {
    setSelectedCourseId(courseId);
    setCourseTab("inicio");
    setCommentDraft("");
  }

  function submitComment(event) {
    event.preventDefault();
    if (!selectedCourse) {
      return;
    }
    const text = commentDraft.trim();
    if (!text) {
      return;
    }
    onAddCourseComment(selectedCourse.id, text, currentUser.name);
    setCommentDraft("");
  }

  function statusTagClass(status) {
    if (status === "completada") {
      return "is-success";
    }
    if (status === "pendiente") {
      return "is-warning";
    }
    return "is-accent";
  }

  return (
    <div className="lc-grid lc-grid-2">
      <Card title={`Mis cursos (${courses.length})`}>
        <ul className="lc-list">
          {courses.map((course) => (
            <li key={course.id} className="lc-list-item">
              <button
                type="button"
                className="lc-link"
                style={{ textAlign: "left", display: "block", marginBottom: 3 }}
                onClick={() => openCourse(course.id)}
              >
                {course.title}
              </button>
              <p className="lc-meta">
                Mentor: {course.mentor} | {course.progress}% completado
              </p>
              <p className="lc-meta">
                Pendientes: {(course.activities || []).filter((activity) => activity.status !== "completada").length}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={selectedCourse ? `Curso abierto: ${selectedCourse.title}` : "Curso"}>
        {!selectedCourse ? (
          <p className="lc-meta">Selecciona un curso para abrir su pantalla inicial.</p>
        ) : (
          <div className="lc-grid">
            <div className="lc-tab-row">
              <button
                type="button"
                className={`lc-tab-button ${courseTab === "inicio" ? "is-active" : ""}`}
                onClick={() => setCourseTab("inicio")}
              >
                Pantalla inicial
              </button>
              <button
                type="button"
                className={`lc-tab-button ${courseTab === "actividades" ? "is-active" : ""}`}
                onClick={() => setCourseTab("actividades")}
              >
                Actividades
              </button>
              <button
                type="button"
                className={`lc-tab-button ${courseTab === "todo" ? "is-active" : ""}`}
                onClick={() => setCourseTab("todo")}
              >
                Ver todo
              </button>
            </div>

            {courseTab === "inicio" ? (
              <div className="lc-grid" style={{ gap: 8 }}>
                <p className="lc-muted" style={{ margin: 0 }}>
                  {selectedCourse.description}
                </p>
                <p className="lc-meta" style={{ margin: 0 }}>
                  Mentor: {selectedCourse.mentor}
                </p>
                <p className="lc-meta" style={{ margin: 0 }}>
                  Modulos: {selectedCourse.modulesCompleted}/{selectedCourse.totalModules}
                </p>
                <p className="lc-meta" style={{ margin: 0 }}>
                  Proxima clase: {formatDate(selectedCourse.nextClass)}
                </p>
                <div className="lc-progress">
                  <span style={{ width: `${selectedCourse.progress}%` }} />
                </div>
              </div>
            ) : null}

            {courseTab === "actividades" ? (
              <ul className="lc-list">
                {(selectedCourse.activities || []).map((activity) => (
                  <li key={activity.id} className="lc-list-item">
                    <div className="lc-row">
                      <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{activity.title}</p>
                      <span className={`lc-tag ${statusTagClass(activity.status)}`}>{activity.status}</span>
                    </div>
                    <p className="lc-meta">
                      {activity.type} | Entrega: {formatDate(activity.dueDate)}
                    </p>
                    <p className="lc-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
                      {activity.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            {courseTab === "todo" ? (
              <div className="lc-grid" style={{ gap: 10 }}>
                <div>
                  <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>
                    Resumen general
                  </p>
                  <p className="lc-meta" style={{ margin: 0 }}>
                    Curso: {selectedCourse.title}
                  </p>
                  <p className="lc-meta" style={{ margin: 0 }}>
                    Mentor: {selectedCourse.mentor}
                  </p>
                  <p className="lc-meta" style={{ margin: 0 }}>
                    Avance: {selectedCourse.progress}% | Modulos {selectedCourse.modulesCompleted}/{selectedCourse.totalModules}
                  </p>
                </div>
                <div>
                  <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>
                    Actividades del curso
                  </p>
                  <ul className="lc-list">
                    {(selectedCourse.activities || []).map((activity) => (
                      <li key={activity.id} className="lc-list-item">
                        <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 13 }}>{activity.title}</p>
                        <p className="lc-meta">
                          {activity.status} | {formatDate(activity.dueDate)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div>
              <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>
                Comentarios del curso
              </p>
              <ul className="lc-list">
                {selectedCourse.comments.map((comment) => (
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
              <input
                className="lc-input"
                type="text"
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Agregar comentario al curso abierto"
              />
              <button type="submit" className="lc-button is-primary">
                Publicar comentario
              </button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}

function TasksSection({ courses, onOpenCourse }) {
  const allActivities = useMemo(
    () =>
      courses.flatMap((course) =>
        (course.activities || []).map((activity) => ({
          ...activity,
          courseId: course.id,
          courseTitle: course.title,
        })),
      ),
    [courses],
  );

  const pendingActivities = allActivities.filter((activity) => activity.status !== "completada");
  const completedActivities = allActivities.filter((activity) => activity.status === "completada").slice(0, 6);

  return (
    <div className="lc-grid lc-grid-2">
      <Card title={`Tareas pendientes (${pendingActivities.length})`}>
        <ul className="lc-list">
          {pendingActivities.map((activity) => (
            <li key={activity.id} className="lc-list-item">
              <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{activity.title}</p>
              <p className="lc-meta">
                {activity.courseTitle} | {activity.type}
              </p>
              <p className="lc-meta">Entrega: {formatDate(activity.dueDate)}</p>
              <div className="lc-row" style={{ marginTop: 6 }}>
                <span className={`lc-tag ${activity.status === "pendiente" ? "is-warning" : "is-accent"}`}>{activity.status}</span>
                <button type="button" className="lc-link" onClick={() => onOpenCourse(activity.courseId, "actividades")}>
                  Abrir curso
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Ultimas tareas completadas">
        {completedActivities.length === 0 ? (
          <p className="lc-meta">Aun no hay tareas completadas.</p>
        ) : (
          <ul className="lc-list">
            {completedActivities.map((activity) => (
              <li key={activity.id} className="lc-list-item">
                <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{activity.title}</p>
                <p className="lc-meta">{activity.courseTitle}</p>
                <p className="lc-meta">{formatDate(activity.dueDate)}</p>
                <span className="lc-tag is-success">completada</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function CalendarSection({ events }) {
  const sortedEvents = useMemo(() => [...events].sort((a, b) => eventSortValue(a) - eventSortValue(b)), [events]);
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const firstDate = sortedEvents[0]?.date;
    return firstDate ? new Date(`${firstDate}T00:00:00`) : new Date();
  });

  const eventsByDate = useMemo(() => {
    const map = new Map();
    sortedEvents.forEach((event) => {
      const key = event.date;
      const items = map.get(key) || [];
      items.push(event);
      map.set(key, items);
    });
    return map;
  }, [sortedEvents]);

  const monthCells = useMemo(() => buildMonthGrid(monthAnchor, eventsByDate), [monthAnchor, eventsByDate]);
  const monthTitle = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(monthAnchor);

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

      <Card title="Calendario mensual (grilla)">
        <div className="lc-month-toolbar">
          <button type="button" className="lc-button" onClick={() => setMonthAnchor((prev) => shiftMonth(prev, -1))}>
            Mes anterior
          </button>
          <p style={{ margin: 0, fontWeight: 700, textTransform: "capitalize" }}>{monthTitle}</p>
          <button type="button" className="lc-button" onClick={() => setMonthAnchor((prev) => shiftMonth(prev, 1))}>
            Mes siguiente
          </button>
        </div>

        <div className="lc-month-grid">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="lc-month-weekday">
              {day}
            </div>
          ))}
          {monthCells.map((cell) => (
            <div key={cell.key} className={`lc-month-cell ${cell.isCurrentMonth ? "" : "is-outside"}`}>
              <p className="lc-month-day">{cell.day}</p>
              <div className="lc-month-events">
                {cell.events.slice(0, 2).map((event) => (
                  <div key={event.id} className="lc-month-event">
                    {event.time} {event.title}
                  </div>
                ))}
                {cell.events.length > 2 ? <div className="lc-month-event">+{cell.events.length - 2} mas</div> : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ForumsSection({ forums, currentUser, onCreateForumThread, onAddForumComment, externalSelectionId }) {
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

  useEffect(() => {
    if (!externalSelectionId) {
      return;
    }
    if (forums.some((forum) => forum.id === externalSelectionId)) {
      setSelectedForumId(externalSelectionId);
    }
  }, [externalSelectionId, forums]);

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

function MessagesSection({ messageThreads, currentUser, onOpenThread, onSendMessage, contacts, onStartDirectMessage }) {
  const cohortFourThreadId = messageThreads.find((thread) => thread.title.toLowerCase().includes("cohorte 4"))?.id || "";
  const [selectedThreadId, setSelectedThreadId] = useState(cohortFourThreadId || messageThreads[0]?.id || "");
  const [draftMessage, setDraftMessage] = useState("");
  const [newContact, setNewContact] = useState(contacts[0] || "");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (messageThreads.length === 0) {
      setSelectedThreadId("");
      return;
    }
    if (!messageThreads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(cohortFourThreadId || messageThreads[0].id);
    }
  }, [messageThreads, selectedThreadId, cohortFourThreadId]);

  useEffect(() => {
    if (contacts.length === 0) {
      setNewContact("");
      return;
    }
    if (!newContact || !contacts.includes(newContact)) {
      setNewContact(contacts[0]);
    }
  }, [contacts, newContact]);

  const selectedThread = messageThreads.find((thread) => thread.id === selectedThreadId);
  const participantDetails =
    selectedThread?.participantDetails?.length > 0
      ? selectedThread.participantDetails
      : (selectedThread?.participants || []).map((name, index) => ({
          id: `participant-${index}-${name}`,
          name,
          role: "Integrante",
        }));

  function selectThread(threadId) {
    setSelectedThreadId(threadId);
    onOpenThread(threadId);
  }

  function sendCurrentMessage() {
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

  function submitMessage(event) {
    event.preventDefault();
    sendCurrentMessage();
  }

  function startDirectMessage() {
    const contact = newContact.trim();
    const text = newMessage.trim();
    if (!contact || !text) {
      return;
    }
    const threadId = onStartDirectMessage({
      contactName: contact,
      text,
      author: currentUser.name,
    });
    setSelectedThreadId(threadId);
    onOpenThread(threadId);
    setNewMessage("");
  }

  function submitNewChat(event) {
    event.preventDefault();
    startDirectMessage();
  }

  function handleEnterToSend(event, sender) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      sender();
    }
  }

  return (
    <div className="lc-grid">
      <Card title="Nuevo mensaje directo">
        <form className="lc-form-grid" onSubmit={submitNewChat}>
          <select className="lc-select" value={newContact} onChange={(event) => setNewContact(event.target.value)}>
            {contacts.length === 0 ? <option value="">No hay contactos disponibles</option> : null}
            {contacts.map((contact) => (
              <option key={contact} value={contact}>
                {contact}
              </option>
            ))}
          </select>
          <textarea
            className="lc-textarea"
            placeholder="Escribe el primer mensaje del chat"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => handleEnterToSend(event, startDirectMessage)}
          />
          <button type="submit" className="lc-button is-primary" disabled={contacts.length === 0}>
            Abrir chat con esta persona
          </button>
          {cohortFourThreadId ? (
            <div className="lc-row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <p className="lc-meta" style={{ margin: 0 }}>
                Atajo: abrir solo el grupo de cohorte 4.
              </p>
              <button type="button" className="lc-link" onClick={() => selectThread(cohortFourThreadId)}>
                Ir al grupo cohorte 4
              </button>
            </div>
          ) : null}
        </form>
      </Card>

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
              <div>
                <p className="lc-stat-label" style={{ margin: "0 0 8px" }}>
                  Integrantes del grupo
                </p>
                <div className="lc-row" style={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 6 }}>
                  {participantDetails.map((participant) => (
                    <span key={participant.id} className="lc-tag">
                      {participant.name} ({participant.role})
                    </span>
                  ))}
                </div>
              </div>

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
                  placeholder="Escribe un mensaje (Enter para enviar, Shift+Enter para salto)"
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  onKeyDown={(event) => handleEnterToSend(event, sendCurrentMessage)}
                />
                <button type="submit" className="lc-button is-primary">
                  Enviar mensaje
                </button>
              </form>
            </div>
          )}
        </Card>
      </div>
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
  courses,
  courseCatalog,
  trainingPrograms,
  enrollments,
  payments,
  literatureSource,
  onRefreshNews,
  newsLoading,
  onAddEvent,
  onAddCommunity,
  onAddSiteNews,
  onAddTrainingProgram,
  onAddEnrollment,
  onAddPayment,
  onAssignCourseTask,
  onUpdateCourseCatalog,
  onUpdateEvent,
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
  const [trainingForm, setTrainingForm] = useState({
    name: "",
    coordinator: "",
    status: "activo",
  });
  const [enrollmentForm, setEnrollmentForm] = useState({
    studentName: "",
    plan: "",
    status: "activa",
    startDate: "",
    renewalDate: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    studentName: "",
    concept: "",
    amount: "",
    dueDate: "",
    status: "pendiente",
    method: "Transferencia",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: courses[0]?.id || "",
    title: "",
    type: "Entrega escrita",
    dueDate: "",
    target: "Toda la cohorte",
    description: "",
  });
  const [editingCourseImageId, setEditingCourseImageId] = useState("");
  const [courseImageUrl, setCourseImageUrl] = useState("");
  const [editingEventImageId, setEditingEventImageId] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");

  useEffect(() => {
    if (courses.length === 0) {
      setAssignmentForm((prev) => ({ ...prev, courseId: "" }));
      return;
    }

    if (!courses.some((course) => course.id === assignmentForm.courseId)) {
      setAssignmentForm((prev) => ({ ...prev, courseId: courses[0].id }));
    }
  }, [courses, assignmentForm.courseId]);

  const selectedAssignmentCourse = courses.find((course) => course.id === assignmentForm.courseId);

  if (!isAdmin) {
    const myEnrollments = enrollments.filter((item) => item.studentName === currentUser.name);
    const myPayments = payments.filter((item) => item.studentName === currentUser.name);

    return (
      <div className="lc-grid">
        <Card title="Mi administracion (alumno)">
          <p className="lc-muted" style={{ margin: 0 }}>
            Esta version para alumno centraliza tu formacion, matricula y pagos para que puedas autogestionar todo desde
            un solo lugar.
          </p>
        </Card>

        <div className="lc-grid lc-grid-3">
          <Card title="Mi formacion">
            <ul className="lc-list">
              {courses.map((course) => (
                <li key={course.id} className="lc-list-item">
                  <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{course.title}</p>
                  <p className="lc-meta">
                    {course.progress}% completado | mentor {course.mentor}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Mi matricula">
            {myEnrollments.length === 0 ? (
              <p className="lc-meta">No hay matriculas registradas para este usuario.</p>
            ) : (
              <ul className="lc-list">
                {myEnrollments.map((enrollment) => (
                  <li key={enrollment.id} className="lc-list-item">
                    <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{enrollment.plan}</p>
                    <p className="lc-meta">
                      {enrollment.status} | alta: {formatDate(enrollment.startDate)}
                    </p>
                    <p className="lc-meta">Renovacion: {formatDate(enrollment.renewalDate)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Mi pago">
            {myPayments.length === 0 ? (
              <p className="lc-meta">No hay pagos registrados para este usuario.</p>
            ) : (
              <ul className="lc-list">
                {myPayments.map((payment) => (
                  <li key={payment.id} className="lc-list-item">
                    <p style={{ margin: "0 0 3px", fontWeight: 700 }}>{payment.concept}</p>
                    <p className="lc-meta">
                      {formatCurrency(payment.amount)} | {payment.status}
                    </p>
                    <p className="lc-meta">
                      Vence: {formatDate(payment.dueDate)} | {payment.method}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
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

  function submitTraining(event) {
    event.preventDefault();
    const payload = {
      name: trainingForm.name.trim(),
      coordinator: trainingForm.coordinator.trim(),
      status: trainingForm.status,
    };
    if (!payload.name || !payload.coordinator) {
      return;
    }
    onAddTrainingProgram(payload);
    setTrainingForm({ name: "", coordinator: "", status: "activo" });
  }

  function submitEnrollment(event) {
    event.preventDefault();
    const payload = {
      studentName: enrollmentForm.studentName.trim(),
      plan: enrollmentForm.plan.trim(),
      status: enrollmentForm.status,
      startDate: enrollmentForm.startDate,
      renewalDate: enrollmentForm.renewalDate,
    };
    if (!payload.studentName || !payload.plan || !payload.startDate || !payload.renewalDate) {
      return;
    }
    onAddEnrollment(payload);
    setEnrollmentForm({
      studentName: "",
      plan: "",
      status: "activa",
      startDate: "",
      renewalDate: "",
    });
  }

  function submitPayment(event) {
    event.preventDefault();
    const payload = {
      studentName: paymentForm.studentName.trim(),
      concept: paymentForm.concept.trim(),
      amount: Number(paymentForm.amount) || 0,
      currency: "ARS",
      dueDate: paymentForm.dueDate,
      status: paymentForm.status,
      method: paymentForm.method,
    };
    if (!payload.studentName || !payload.concept || !payload.dueDate) {
      return;
    }
    onAddPayment(payload);
    setPaymentForm({
      studentName: "",
      concept: "",
      amount: "",
      dueDate: "",
      status: "pendiente",
      method: "Transferencia",
    });
  }

  function submitAssignment(event) {
    event.preventDefault();
    const payload = {
      courseId: assignmentForm.courseId,
      title: assignmentForm.title.trim(),
      type: assignmentForm.type,
      dueDate: assignmentForm.dueDate,
      target: assignmentForm.target.trim() || "Toda la cohorte",
      description: assignmentForm.description.trim(),
    };

    if (!payload.courseId || !payload.title || !payload.dueDate || !payload.description) {
      return;
    }

    onAssignCourseTask(payload);
    setAssignmentForm((prev) => ({
      ...prev,
      title: "",
      dueDate: "",
      target: "Toda la cohorte",
      description: "",
    }));
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

      <Card title="Enviar tareas a alumnos de cursos">
        <form className="lc-form-grid" onSubmit={submitAssignment}>
          <select
            className="lc-select"
            value={assignmentForm.courseId}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, courseId: event.target.value }))}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <input
            className="lc-input"
            type="text"
            placeholder="Titulo de la tarea"
            value={assignmentForm.title}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <select
            className="lc-select"
            value={assignmentForm.type}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="Entrega escrita">Entrega escrita</option>
            <option value="Foro">Foro</option>
            <option value="Cuestionario">Cuestionario</option>
            <option value="Proyecto">Proyecto</option>
          </select>
          <input
            className="lc-input"
            type="date"
            value={assignmentForm.dueDate}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, dueDate: event.target.value }))}
          />
          <input
            className="lc-input"
            type="text"
            placeholder="Destinatarios (ej: cohorte 4)"
            value={assignmentForm.target}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, target: event.target.value }))}
          />
          <textarea
            className="lc-textarea"
            placeholder="Descripcion y consigna de la tarea"
            value={assignmentForm.description}
            onChange={(event) => setAssignmentForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <button type="submit" className="lc-button is-primary">
            Enviar tarea al curso
          </button>
        </form>
        <p className="lc-meta" style={{ marginTop: 10 }}>
          {selectedAssignmentCourse
            ? `Curso seleccionado: ${selectedAssignmentCourse.title} (mentor: ${selectedAssignmentCourse.mentor}).`
            : "Selecciona un curso para enviar la tarea."}
        </p>
        <p className="lc-meta" style={{ marginTop: 4 }}>
          Al publicar, la tarea se agrega en "Mis cursos" y tambien en "Tareas pendientes".
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
        <Card title="Agregar formacion">
          <form className="lc-form-grid" onSubmit={submitTraining}>
            <input
              className="lc-input"
              type="text"
              placeholder="Nombre de la formacion"
              value={trainingForm.name}
              onChange={(event) => setTrainingForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="lc-input"
              type="text"
              placeholder="Coordinador"
              value={trainingForm.coordinator}
              onChange={(event) => setTrainingForm((prev) => ({ ...prev, coordinator: event.target.value }))}
            />
            <select
              className="lc-select"
              value={trainingForm.status}
              onChange={(event) => setTrainingForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="activo">Activo</option>
              <option value="planificacion">Planificacion</option>
              <option value="cerrado">Cerrado</option>
            </select>
            <button type="submit" className="lc-button is-primary">
              Crear formacion
            </button>
          </form>
        </Card>

        <Card title="Registrar matricula">
          <form className="lc-form-grid" onSubmit={submitEnrollment}>
            <input
              className="lc-input"
              type="text"
              placeholder="Nombre del alumno"
              value={enrollmentForm.studentName}
              onChange={(event) => setEnrollmentForm((prev) => ({ ...prev, studentName: event.target.value }))}
            />
            <input
              className="lc-input"
              type="text"
              placeholder="Plan / trayecto"
              value={enrollmentForm.plan}
              onChange={(event) => setEnrollmentForm((prev) => ({ ...prev, plan: event.target.value }))}
            />
            <select
              className="lc-select"
              value={enrollmentForm.status}
              onChange={(event) => setEnrollmentForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="activa">Activa</option>
              <option value="pausada">Pausada</option>
              <option value="baja">Baja</option>
            </select>
            <input
              className="lc-input"
              type="date"
              value={enrollmentForm.startDate}
              onChange={(event) => setEnrollmentForm((prev) => ({ ...prev, startDate: event.target.value }))}
            />
            <input
              className="lc-input"
              type="date"
              value={enrollmentForm.renewalDate}
              onChange={(event) => setEnrollmentForm((prev) => ({ ...prev, renewalDate: event.target.value }))}
            />
            <button type="submit" className="lc-button is-primary">
              Guardar matricula
            </button>
          </form>
        </Card>

        <Card title="Registrar pago">
          <form className="lc-form-grid" onSubmit={submitPayment}>
            <input
              className="lc-input"
              type="text"
              placeholder="Nombre del alumno"
              value={paymentForm.studentName}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, studentName: event.target.value }))}
            />
            <input
              className="lc-input"
              type="text"
              placeholder="Concepto"
              value={paymentForm.concept}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, concept: event.target.value }))}
            />
            <input
              className="lc-input"
              type="number"
              min="0"
              value={paymentForm.amount}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="Monto"
            />
            <input
              className="lc-input"
              type="date"
              value={paymentForm.dueDate}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
            <select
              className="lc-select"
              value={paymentForm.status}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="vencido">Vencido</option>
              <option value="bonificado">Bonificado</option>
            </select>
            <select
              className="lc-select"
              value={paymentForm.method}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, method: event.target.value }))}
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Interno">Interno</option>
            </select>
            <button type="submit" className="lc-button is-primary">
              Guardar pago
            </button>
          </form>
        </Card>
      </div>

      <div className="lc-grid lc-grid-3">
        <Card title="Formaciones">
          <ul className="lc-list">
            {trainingPrograms.slice(0, 8).map((program) => (
              <li key={program.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{program.name}</p>
                <p className="lc-meta">
                  {program.coordinator} | {program.students} alumnos
                </p>
                <span className="lc-tag">{program.status}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Matriculas">
          <ul className="lc-list">
            {enrollments.slice(0, 8).map((enrollment) => (
              <li key={enrollment.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{enrollment.studentName}</p>
                <p className="lc-meta">{enrollment.plan}</p>
                <p className="lc-meta">
                  {enrollment.status} | renovacion: {formatDate(enrollment.renewalDate)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Pagos">
          <ul className="lc-list">
            {payments.slice(0, 8).map((payment) => (
              <li key={payment.id} className="lc-list-item">
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{payment.studentName}</p>
                <p className="lc-meta">
                  {payment.concept} | {formatCurrency(payment.amount)}
                </p>
                <p className="lc-meta">
                  {payment.status} | {formatDate(payment.dueDate)}
                </p>
              </li>
            ))}
          </ul>
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

      <Card title="Catalogo de cursos (imagenes y contenido)">
        <div className="lc-grid" style={{ gap: 16 }}>
          {courseCatalog.map((course) => (
            <div key={course.id} style={{
              border: `1px solid ${C.border}`, borderRadius: 12,
              background: C.bg, overflow: "hidden",
            }}>
              <div style={{ display: "flex", gap: 16, padding: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 180px" }}>
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{ width: 180, height: 110, objectFit: "cover", borderRadius: 8, display: "block", border: `1px solid ${C.border}` }}
                    />
                  ) : (
                    <div style={{
                      width: 180, height: 110, borderRadius: 8,
                      background: `linear-gradient(135deg, ${C.bgWarm}, ${C.bgDrawer})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: C.textMeta, fontSize: 28, border: `1px solid ${C.border}`,
                    }}>&#128218;</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span className="lc-tag is-accent">{course.level}</span>
                    <span className="lc-tag">{course.duration}</span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16 }}>{course.title}</p>
                  <p className="lc-meta" style={{ margin: "0 0 4px" }}>{course.description}</p>
                  <p className="lc-meta">Precio: {formatCurrency(course.price)} | Formato: {course.format}</p>
                </div>
              </div>
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {editingCourseImageId === course.id ? (
                  <>
                    <input
                      className="lc-input"
                      type="url"
                      placeholder="URL de la nueva imagen"
                      value={courseImageUrl}
                      onChange={(e) => setCourseImageUrl(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <button
                      type="button"
                      className="lc-button is-primary"
                      onClick={() => {
                        if (courseImageUrl.trim()) {
                          onUpdateCourseCatalog(course.id, { image: courseImageUrl.trim() });
                        }
                        setEditingCourseImageId("");
                        setCourseImageUrl("");
                      }}
                    >Guardar</button>
                    <button
                      type="button"
                      className="lc-button"
                      onClick={() => { setEditingCourseImageId(""); setCourseImageUrl(""); }}
                    >Cancelar</button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="lc-button"
                    onClick={() => { setEditingCourseImageId(course.id); setCourseImageUrl(course.image || ""); }}
                  >Cambiar imagen</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Imagenes de eventos">
        <div className="lc-grid" style={{ gap: 16 }}>
          {events.map((eventItem) => (
            <div key={eventItem.id} style={{
              border: `1px solid ${C.border}`, borderRadius: 12,
              background: C.bg, overflow: "hidden",
            }}>
              <div style={{ display: "flex", gap: 16, padding: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 180px" }}>
                  {eventItem.image ? (
                    <img
                      src={eventItem.image}
                      alt={eventItem.title}
                      style={{ width: 180, height: 110, objectFit: "cover", borderRadius: 8, display: "block", border: `1px solid ${C.border}` }}
                    />
                  ) : (
                    <div style={{
                      width: 180, height: 110, borderRadius: 8,
                      background: `linear-gradient(135deg, ${C.bgWarm}, ${C.bgDrawer})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: C.textMeta, fontSize: 28, border: `1px solid ${C.border}`,
                    }}>&#128197;</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16 }}>{eventItem.title}</p>
                  <p className="lc-meta" style={{ margin: "0 0 4px" }}>
                    {formatDate(eventItem.date)} | {eventItem.time} | {eventItem.type}
                  </p>
                  <p className="lc-meta">{eventItem.location}</p>
                </div>
              </div>
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {editingEventImageId === eventItem.id ? (
                  <>
                    <input
                      className="lc-input"
                      type="url"
                      placeholder="URL de la nueva imagen"
                      value={eventImageUrl}
                      onChange={(e) => setEventImageUrl(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <button
                      type="button"
                      className="lc-button is-primary"
                      onClick={() => {
                        if (eventImageUrl.trim()) {
                          onUpdateEvent(eventItem.id, { image: eventImageUrl.trim() });
                        }
                        setEditingEventImageId("");
                        setEventImageUrl("");
                      }}
                    >Guardar</button>
                    <button
                      type="button"
                      className="lc-button"
                      onClick={() => { setEditingEventImageId(""); setEventImageUrl(""); }}
                    >Cancelar</button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="lc-button"
                    onClick={() => { setEditingEventImageId(eventItem.id); setEventImageUrl(eventItem.image || ""); }}
                  >Cambiar imagen</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LoginScreen({ credentials, authError, onChange, onSubmit, onBack }) {
  return (
    <main className="lc-login-shell">
      <div className="lc-login-card">
        <section className="lc-login-main">
          <button type="button" className="lc-button" style={{ marginBottom: 10 }} onClick={onBack}>
            Volver
          </button>
          <p className="lc-tag is-accent" style={{ marginBottom: 12 }}>
            Plataforma de aprendizaje y comunidad
          </p>
          <h1>LitCafe LMS</h1>
          <p>
            Inicia sesion desde la landing para usar tablero, cursos, calendario, foros, mensajes, feed social y panel de
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
  const [publicView, setPublicView] = useState({ screen: "landing", kind: "", id: "" });
  const [courseSelection, setCourseSelection] = useState({ courseId: "", tab: "inicio" });
  const [forumSelectionId, setForumSelectionId] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(readStoredSession);

  const [courseCatalog, setCourseCatalog] = useState(initialCourseCatalog);
  const [cartItems, setCartItems] = useState([]);
  const [courses, setCourses] = useState(initialCourses);
  const [events, setEvents] = useState(initialEvents);
  const [forums, setForums] = useState(initialForums);
  const [messageThreads, setMessageThreads] = useState(initialMessageThreads);
  const [socialAccounts, setSocialAccounts] = useState(initialSocialAccounts);
  const [socialPosts, setSocialPosts] = useState(initialSocialPosts);
  const [communities, setCommunities] = useState(initialCommunities);
  const [siteNews, setSiteNews] = useState(initialSiteNews);
  const [trainingPrograms, setTrainingPrograms] = useState(initialTrainingPrograms);
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [payments, setPayments] = useState(initialPayments);
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
    setPublicView({ screen: "landing", kind: "", id: "" });
  }

  function handleLogout() {
    setCurrentUser(null);
    setCredentials({ email: "", password: "" });
    setAuthError("");
    setActiveSection("tablero");
    setCourseSelection({ courseId: "", tab: "inicio" });
    setForumSelectionId("");
    setPublicView({ screen: "landing", kind: "", id: "" });
  }

  const activeSectionInfo = appSections.find((section) => section.id === activeSection) || appSections[0];

  const totalUnreadMessages = useMemo(
    () => messageThreads.reduce((acc, thread) => acc + (thread.unread || 0), 0),
    [messageThreads],
  );

  const messageContacts = useMemo(() => {
    const names = new Set();
    mockUsers.forEach((user) => names.add(user.name));
    messageThreads.forEach((thread) => thread.participants.forEach((name) => names.add(name)));
    courses.forEach((course) => names.add(course.mentor));
    forums.forEach((forum) => {
      names.add(forum.author);
      forum.comments.forEach((comment) => names.add(comment.author));
    });
    if (currentUser?.name) {
      names.delete(currentUser.name);
    }
    return Array.from(names).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [currentUser, messageThreads, courses, forums]);

  const cartItemsDetailed = useMemo(
    () =>
      cartItems
        .map((item) => {
          const course = courseCatalog.find((catalogCourse) => catalogCourse.id === item.courseId);
          if (!course) {
            return null;
          }
          return {
            ...item,
            course,
            subtotal: course.price * item.quantity,
          };
        })
        .filter(Boolean),
    [cartItems, courseCatalog],
  );

  const cartTotal = useMemo(
    () => cartItemsDetailed.reduce((acc, item) => acc + item.subtotal, 0),
    [cartItemsDetailed],
  );

  const handleAddCourseToCart = useCallback((courseId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.courseId === courseId);
      if (existingItem) {
        return prevItems.map((item) => (item.courseId === courseId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevItems, { courseId, quantity: 1 }];
    });
  }, []);

  const handleDecreaseCourseFromCart = useCallback((courseId) => {
    setCartItems((prevItems) =>
      prevItems.flatMap((item) => {
        if (item.courseId !== courseId) {
          return item;
        }
        if (item.quantity <= 1) {
          return [];
        }
        return { ...item, quantity: item.quantity - 1 };
      }),
    );
  }, []);

  const handleRemoveCourseFromCart = useCallback((courseId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.courseId !== courseId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

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

  const openCourseWorkspace = useCallback((courseId, tab = "inicio") => {
    setCourseSelection({ courseId, tab });
    setActiveSection("cursos");
  }, []);

  const openForumWorkspace = useCallback((forumId) => {
    setForumSelectionId(forumId);
    setActiveSection("foros");
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

  const handleStartDirectMessage = useCallback(({ contactName, text, author }) => {
    const cleanContact = contactName.trim();
    const cleanText = text.trim();
    if (!cleanContact || !cleanText) {
      return "";
    }

    const messagePayload = {
      id: createId("thread-message"),
      author,
      text: cleanText,
      at: new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    let resolvedThreadId = "";

    setMessageThreads((prevThreads) => {
      const existingDirect = prevThreads.find(
        (thread) =>
          thread.participants.length === 2 &&
          thread.participants.includes(author) &&
          thread.participants.includes(cleanContact),
      );

      if (existingDirect) {
        resolvedThreadId = existingDirect.id;
        const updatedThread = {
          ...existingDirect,
          unread: 0,
          messages: [...existingDirect.messages, messagePayload],
        };
        return [updatedThread, ...prevThreads.filter((thread) => thread.id !== existingDirect.id)];
      }

      resolvedThreadId = createId("thread");
      const newThread = {
        id: resolvedThreadId,
        title: `Chat con ${cleanContact}`,
        participants: [author, cleanContact],
        unread: 0,
        messages: [messagePayload],
      };
      return [newThread, ...prevThreads];
    });

    return resolvedThreadId;
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

  const handleAddTrainingProgram = useCallback((payload) => {
    const program = {
      id: createId("training"),
      ...payload,
      students: 0,
    };
    setTrainingPrograms((prevPrograms) => [program, ...prevPrograms]);
  }, []);

  const handleAddEnrollment = useCallback((payload) => {
    const enrollment = {
      id: createId("enrollment"),
      ...payload,
    };
    setEnrollments((prevEnrollments) => [enrollment, ...prevEnrollments]);
  }, []);

  const handleAddPayment = useCallback((payload) => {
    const payment = {
      id: createId("payment"),
      ...payload,
    };
    setPayments((prevPayments) => [payment, ...prevPayments]);
  }, []);

  const handleAssignCourseTask = useCallback(
    ({ courseId, title, type, dueDate, target, description }) => {
      const newActivity = {
        id: createId("course-activity"),
        title,
        type,
        dueDate,
        status: "pendiente",
        description: `${description} | Destinatarios: ${target}`,
      };

      const adminComment = {
        id: createId("course-comment"),
        author: currentUser?.name || "Admin LitCafe",
        text: `Nueva tarea publicada: "${title}" para ${target}.`,
        at: "Hace un momento",
      };

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                pendingTasks: (course.pendingTasks || 0) + 1,
                activities: [newActivity, ...(course.activities || [])],
                comments: [...(course.comments || []), adminComment],
              }
            : course,
        ),
      );
    },
    [currentUser],
  );

  const handleUpdateCourseCatalog = useCallback((courseId, updates) => {
    setCourseCatalog((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, ...updates } : course)),
    );
  }, []);

  const handleUpdateEvent = useCallback((eventId, updates) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
    );
  }, []);

  if (!currentUser) {
    return (
      <>
        <GlobalStyles />
        {publicView.screen === "landing" ? (
          <LandingScreen
            literatureNews={literatureNews}
            siteNews={siteNews}
            events={events}
            forums={forums}
            courseCatalog={courseCatalog}
            communities={communities}
            socialAccounts={socialAccounts}
            socialPosts={socialPosts}
            cartItems={cartItemsDetailed}
            cartTotal={cartTotal}
            onAddCourseToCart={handleAddCourseToCart}
            onDecreaseCourseFromCart={handleDecreaseCourseFromCart}
            onRemoveCourseFromCart={handleRemoveCourseFromCart}
            onClearCart={handleClearCart}
            onOpenLogin={() => setPublicView({ screen: "login", kind: "", id: "" })}
            onOpenDetail={(kind, id) => setPublicView({ screen: "detail", kind, id })}
          />
        ) : null}

        {publicView.screen === "detail" ? (
          <LandingDetailScreen
            view={publicView}
            literatureNews={literatureNews}
            siteNews={siteNews}
            events={events}
            forums={forums}
            courseCatalog={courseCatalog}
            cartItems={cartItemsDetailed}
            cartTotal={cartTotal}
            onAddCourseToCart={handleAddCourseToCart}
            onDecreaseCourseFromCart={handleDecreaseCourseFromCart}
            onRemoveCourseFromCart={handleRemoveCourseFromCart}
            onClearCart={handleClearCart}
            onBack={() => setPublicView({ screen: "landing", kind: "", id: "" })}
            onOpenLogin={() => setPublicView({ screen: "login", kind: "", id: "" })}
            onUpdateCourseCatalog={handleUpdateCourseCatalog}
            onUpdateEvent={handleUpdateEvent}
            isAdmin={false}
          />
        ) : null}

        {publicView.screen === "login" ? (
          <LoginScreen
            credentials={credentials}
            authError={authError}
            onChange={updateCredentials}
            onSubmit={handleLogin}
            onBack={() => setPublicView({ screen: "landing", kind: "", id: "" })}
          />
        ) : null}
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
            onOpenForumThread={openForumWorkspace}
          />
        );
      case "cursos":
        return (
          <CoursesSection
            courses={courses}
            currentUser={currentUser}
            onAddCourseComment={handleAddCourseComment}
            externalSelection={courseSelection}
          />
        );
      case "tareas":
        return <TasksSection courses={courses} onOpenCourse={openCourseWorkspace} />;
      case "calendario":
        return <CalendarSection events={events} />;
      case "foros":
        return (
          <ForumsSection
            forums={forums}
            currentUser={currentUser}
            onCreateForumThread={handleCreateForumThread}
            onAddForumComment={handleAddForumComment}
            externalSelectionId={forumSelectionId}
          />
        );
      case "mensajes":
        return (
          <MessagesSection
            messageThreads={messageThreads}
            currentUser={currentUser}
            onOpenThread={handleOpenThread}
            onSendMessage={handleSendMessage}
            contacts={messageContacts}
            onStartDirectMessage={handleStartDirectMessage}
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
            courses={courses}
            courseCatalog={courseCatalog}
            trainingPrograms={trainingPrograms}
            enrollments={enrollments}
            payments={payments}
            literatureSource={literatureSource}
            onRefreshNews={refreshLiteratureNews}
            newsLoading={newsLoading}
            onAddEvent={handleAddEvent}
            onAddCommunity={handleAddCommunity}
            onAddSiteNews={handleAddSiteNews}
            onAddTrainingProgram={handleAddTrainingProgram}
            onAddEnrollment={handleAddEnrollment}
            onAddPayment={handleAddPayment}
            onAssignCourseTask={handleAssignCourseTask}
            onUpdateCourseCatalog={handleUpdateCourseCatalog}
            onUpdateEvent={handleUpdateEvent}
          />
        );
      default:
        return <p className="lc-meta">Seccion no disponible.</p>;
    }
  }

  const sectionTitle = activeSection === "administracion" && currentUser.role !== "admin" ? "Mi administracion" : activeSectionInfo.label;
  const sectionDescription =
    activeSection === "tablero"
      ? "Resumen de actividad en cursos, tareas, foros, mensajes y noticias."
      : activeSection === "tareas"
        ? "Listado de tareas pendientes con acceso directo al curso."
        : activeSection === "administracion"
          ? currentUser.role === "admin"
            ? "Panel de gestion de formacion, matriculas, pagos, eventos y comunidades."
            : "Panel del alumno para gestionar su formacion, matricula y pagos."
          : "Modulo funcional con datos mock para iterar la plataforma completa.";
  const unreadIcon = currentUser.role === "admin" ? "🔔" : "✉️";
  const unreadRoleLabel = currentUser.role === "admin" ? "Admin" : "Alumno";
  const unreadPillText =
    totalUnreadMessages > 0
      ? `${unreadIcon} ${unreadRoleLabel}: ${totalUnreadMessages} sin leer`
      : `${unreadIcon} ${unreadRoleLabel}: sin mensajes pendientes`;

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
              {currentUser.name} ({currentUser.role === "admin" ? "admin" : "alumno"})
            </span>
            <span className={`lc-pill ${totalUnreadMessages > 0 ? "is-unread" : ""}`}>{unreadPillText}</span>
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
                <h2>{sectionTitle}</h2>
                <p>{sectionDescription}</p>
              </header>
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
