export const appSections = [
  { id: "tablero", label: "Tablero", icon: "DB" },
  { id: "cursos", label: "Mis cursos", icon: "CR" },
  { id: "calendario", label: "Calendario", icon: "CL" },
  { id: "foros", label: "Foros", icon: "FR" },
  { id: "mensajes", label: "Mensajes", icon: "MS" },
  { id: "feed", label: "Feed social", icon: "FD" },
  { id: "administracion", label: "Administracion", icon: "AD" },
];

export const mockUsers = [
  {
    id: "u-admin",
    name: "Admin LitCafe",
    email: "admin@litcafe.local",
    password: "Admin#LitCafe2026",
    role: "admin",
    avatar: "AL",
  },
  {
    id: "u-demo",
    name: "Lector Demo",
    email: "lector@litcafe.local",
    password: "Lector#2026",
    role: "student",
    avatar: "LD",
  },
];

export const initialCourses = [
  {
    id: "course-1",
    title: "Borges: ficciones y laberintos",
    mentor: "Laura Quiroga",
    progress: 72,
    modulesCompleted: 9,
    totalModules: 12,
    pendingTasks: 2,
    nextClass: "2026-03-02",
    description: "Analisis de cuentos, simbolos y estructuras circulares.",
    comments: [
      { id: "c1-comment-1", author: "Sofia", text: "Subi una guia de lectura para el modulo 9.", at: "Hace 1h" },
      { id: "c1-comment-2", author: "Bruno", text: "El foro del Aleph esta buenisimo.", at: "Hace 3h" },
    ],
  },
  {
    id: "course-2",
    title: "Poesia latinoamericana contemporanea",
    mentor: "Marta Elizondo",
    progress: 45,
    modulesCompleted: 4,
    totalModules: 9,
    pendingTasks: 1,
    nextClass: "2026-03-03",
    description: "Lectura de poesia del cono sur y discusion de recursos.",
    comments: [
      { id: "c2-comment-1", author: "Nico", text: "Comparti una antologia digital en recursos.", at: "Ayer" },
    ],
  },
  {
    id: "course-3",
    title: "Taller de escritura creativa",
    mentor: "Rocio Ferrer",
    progress: 84,
    modulesCompleted: 5,
    totalModules: 6,
    pendingTasks: 1,
    nextClass: "2026-03-06",
    description: "Ejercicios semanales de cuento breve y devoluciones.",
    comments: [
      { id: "c3-comment-1", author: "Luz", text: "Cerramos ronda de feedback para microcuentos.", at: "Hace 40m" },
    ],
  },
];

export const initialForums = [
  {
    id: "forum-1",
    title: "El tiempo circular en Borges",
    course: "Borges: ficciones y laberintos",
    author: "Sofia",
    createdAt: "2026-02-24T15:10:00.000Z",
    content: "Que ejemplos les parecieron mas claros para defender la idea de tiempo circular?",
    comments: [
      { id: "f1-comment-1", author: "Bruno", text: "El jardin de senderos funciona perfecto para eso.", at: "Hace 2h" },
      { id: "f1-comment-2", author: "Valen", text: "Tambien en El Aleph se siente esa simultaneidad.", at: "Hace 1h" },
    ],
  },
  {
    id: "forum-2",
    title: "Poesia y oralidad en lecturas en vivo",
    course: "Poesia latinoamericana contemporanea",
    author: "Nico",
    createdAt: "2026-02-23T21:20:00.000Z",
    content: "Les dejo preguntas para debatir: cambia la interpretacion al escuchar un poema en voz alta?",
    comments: [
      { id: "f2-comment-1", author: "Julia", text: "La cadencia cambia todo, sobre todo en versos largos.", at: "Ayer" },
    ],
  },
];

export const initialMessageThreads = [
  {
    id: "thread-1",
    title: "Equipo de moderacion",
    participants: ["Admin LitCafe", "Laura Quiroga", "Rocio Ferrer"],
    unread: 2,
    messages: [
      { id: "t1-m1", author: "Laura Quiroga", text: "Necesitamos abrir un subforo nuevo para ensayos.", at: "09:14" },
      { id: "t1-m2", author: "Rocio Ferrer", text: "Hoy subo la propuesta de reglas de convivencia.", at: "09:45" },
    ],
  },
  {
    id: "thread-2",
    title: "Grupo Borges - cohorte 4",
    participants: ["Sofia", "Bruno", "Luz", "Lector Demo"],
    unread: 1,
    messages: [
      { id: "t2-m1", author: "Sofia", text: "Ya vieron la consigna del modulo 10?", at: "Ayer" },
      { id: "t2-m2", author: "Bruno", text: "Si, hago una plantilla compartida y la paso.", at: "Ayer" },
    ],
  },
  {
    id: "thread-3",
    title: "Comunidad poesia",
    participants: ["Nico", "Julia", "Lector Demo"],
    unread: 0,
    messages: [{ id: "t3-m1", author: "Julia", text: "El viernes hacemos lectura abierta en el patio.", at: "Lun" }],
  },
];

export const initialEvents = [
  {
    id: "event-1",
    title: "Club de lectura: cuentos de Borges",
    date: "2026-03-01",
    time: "17:00",
    type: "presencial",
    location: "Sede Centro",
    seats: 12,
    createdBy: "Admin LitCafe",
  },
  {
    id: "event-2",
    title: "Debate abierto: poesia y politica",
    date: "2026-03-05",
    time: "19:00",
    type: "hibrido",
    location: "Sala Norte + streaming",
    seats: 30,
    createdBy: "Admin LitCafe",
  },
  {
    id: "event-3",
    title: "Taller de microrelato",
    date: "2026-03-07",
    time: "18:30",
    type: "virtual",
    location: "Aula virtual 3",
    seats: 40,
    createdBy: "Admin LitCafe",
  },
];

export const initialCommunities = [
  {
    id: "community-1",
    name: "Narrativa rioplatense",
    members: 128,
    category: "Narrativa",
    description: "Lecturas cruzadas de autores clasicos y contemporaneos.",
  },
  {
    id: "community-2",
    name: "Laboratorio de poesia",
    members: 76,
    category: "Poesia",
    description: "Espacio para escritura, oralidad y revision colectiva.",
  },
  {
    id: "community-3",
    name: "Club de editoriales independientes",
    members: 54,
    category: "Industria editorial",
    description: "Noticias y debates sobre sellos, ferias y tendencias.",
  },
];

export const initialSocialAccounts = [
  { id: "network-ig", network: "Instagram", handle: "@litcafe.ar", connected: true },
  { id: "network-fb", network: "Facebook", handle: "LitCafe Comunidad", connected: true },
  { id: "network-x", network: "X", handle: "@litcafe_news", connected: false },
  { id: "network-yt", network: "YouTube", handle: "LitCafe TV", connected: false },
];

export const initialSocialPosts = [
  {
    id: "post-1",
    network: "Instagram",
    author: "LitCafe",
    text: "Hoy abrimos votacion para elegir la proxima novela del club.",
    likes: 49,
    comments: 12,
    at: "Hace 2h",
  },
  {
    id: "post-2",
    network: "Facebook",
    author: "Comunidad LitCafe",
    text: "Nueva galeria de fotos del encuentro de poesia en la terraza.",
    likes: 33,
    comments: 7,
    at: "Hace 5h",
  },
  {
    id: "post-3",
    network: "Instagram",
    author: "LitCafe",
    text: "Disponible el resumen semanal de foros y cursos activos.",
    likes: 65,
    comments: 18,
    at: "Ayer",
  },
];

export const initialSiteNews = [
  {
    id: "site-news-1",
    title: "Nueva comunidad de narrativa historica",
    summary: "Ya podes sumarte a la comunidad para lecturas guiadas de marzo.",
    author: "Admin LitCafe",
    publishedAt: "2026-02-25",
    url: "#",
  },
  {
    id: "site-news-2",
    title: "Actualizamos el calendario academico",
    summary: "Se agregaron dos encuentros de taller para abril.",
    author: "Admin LitCafe",
    publishedAt: "2026-02-22",
    url: "#",
  },
];

export const fallbackLiteratureNews = [
  {
    id: "lit-news-mock-1",
    title: "Feria internacional del libro anuncia edicion 2026",
    summary: "La organizacion confirmo invitados de 12 paises y foco en narrativa latinoamericana.",
    source: "Mock Literario",
    publishedAt: "2026-02-26",
    url: "#",
  },
  {
    id: "lit-news-mock-2",
    title: "Premio nacional de poesia abre convocatoria para obras ineditas",
    summary: "La convocatoria estara abierta hasta fines de abril y tendra categoria sub-30.",
    source: "Mock Literario",
    publishedAt: "2026-02-24",
    url: "#",
  },
  {
    id: "lit-news-mock-3",
    title: "Editoriales independientes reportan suba en clubes de lectura",
    summary: "El crecimiento de comunidades locales impulsa nuevas colecciones de cuento breve.",
    source: "Mock Literario",
    publishedAt: "2026-02-21",
    url: "#",
  },
];
