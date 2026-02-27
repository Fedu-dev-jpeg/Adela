import { fallbackLiteratureNews } from "./mockData.js";

const LITERATURE_KEYWORDS = [
  "literature",
  "literary",
  "book",
  "books",
  "novel",
  "novels",
  "poetry",
  "poet",
  "author",
  "authors",
  "publishing",
  "literatura",
  "libro",
  "libros",
  "novela",
  "novelas",
  "poesia",
  "poeta",
  "autor",
  "autora",
  "editorial",
  "lectura",
  "cuento",
  "cuentos",
];

function buildFallbackImage(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || "litcafe-news")}/960/540`;
}

function stripHtml(value) {
  return (value || "").replace(/<[^>]*>/g, "").trim();
}

function normalizeGuardianResult(item) {
  const summary = stripHtml(item.fields?.trailText) || "Sin resumen disponible.";
  const fullBody = stripHtml(item.fields?.bodyText);
  const imageUrl = item.fields?.thumbnail || buildFallbackImage(item.id || item.webTitle);
  return {
    id: item.id,
    title: item.webTitle,
    summary,
    content: fullBody || summary,
    imageUrl,
    source: "The Guardian",
    publishedAt: item.webPublicationDate ? item.webPublicationDate.slice(0, 10) : "",
    url: item.webUrl || "#",
    sectionName: item.sectionName || "",
  };
}

function isLiteratureNews(item) {
  const haystack = `${item.title} ${item.summary} ${item.content || ""} ${item.sectionName}`.toLowerCase();
  return LITERATURE_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

async function fetchGuardianFullContent(articleId) {
  const endpoint = new URL(`https://content.guardianapis.com/${articleId}`);
  endpoint.searchParams.set("api-key", "test");
  endpoint.searchParams.set("show-fields", "bodyText");

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    throw new Error(`Guardian API detail status ${response.status}`);
  }

  const payload = await response.json();
  return stripHtml(payload?.response?.content?.fields?.bodyText);
}

async function enrichWithFullContent(newsItem) {
  if (!newsItem?.id || (newsItem.content && newsItem.content !== newsItem.summary)) {
    return newsItem;
  }

  try {
    const fullContent = await fetchGuardianFullContent(newsItem.id);
    if (fullContent) {
      return { ...newsItem, content: fullContent };
    }
  } catch (error) {
    console.error(`No se pudo hidratar contenido completo para ${newsItem.id}:`, error);
  }

  return newsItem;
}

export async function fetchLiteratureNews() {
  const endpoint = new URL("https://content.guardianapis.com/search");
  endpoint.searchParams.set(
    "q",
    "(literature OR books OR novels OR poetry OR literatura OR libros OR novela OR poesia)",
  );
  endpoint.searchParams.set("api-key", "test");
  endpoint.searchParams.set("show-fields", "trailText,bodyText,thumbnail");
  endpoint.searchParams.set("order-by", "newest");
  endpoint.searchParams.set("page-size", "12");

  try {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error(`Guardian API status ${response.status}`);
    }

    const payload = await response.json();
    const rawResults = payload?.response?.results ?? [];

    const filteredItems = rawResults
      .map(normalizeGuardianResult)
      .filter(isLiteratureNews)
      .slice(0, 8);

    if (filteredItems.length > 0) {
      const hydratedItems = await Promise.all(filteredItems.map(enrichWithFullContent));
      return { source: "api", items: hydratedItems };
    }
  } catch (error) {
    console.error("No se pudo traer noticias desde la API:", error);
  }

  return { source: "mock", items: fallbackLiteratureNews };
}
