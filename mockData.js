export const appSections = [
  { id: "tablero", label: "Tablero", icon: "DB" },
  { id: "cursos", label: "Mis cursos", icon: "CR" },
  { id: "tareas", label: "Tareas pendientes", icon: "TS" },
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
    price: 34900,
    description: "Analisis de cuentos, simbolos y estructuras circulares.",
    activities: [
      {
        id: "c1-activity-1",
        title: "Ensayo breve sobre El Aleph",
        type: "Entrega escrita",
        dueDate: "2026-03-01",
        status: "pendiente",
        description: "Subir un texto de 700 palabras sobre simultaneidad y punto de vista.",
      },
      {
        id: "c1-activity-2",
        title: "Foro guiado: El jardin de senderos",
        type: "Foro",
        dueDate: "2026-03-03",
        status: "en progreso",
        description: "Participar con dos intervenciones argumentadas y una replica.",
      },
      {
        id: "c1-activity-3",
        title: "Cuestionario modulo 8",
        type: "Cuestionario",
        dueDate: "2026-02-20",
        status: "completada",
        description: "Evaluacion automatica sobre recursos narrativos borgeanos.",
      },
    ],
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
    price: 29900,
    description: "Lectura de poesia del cono sur y discusion de recursos.",
    activities: [
      {
        id: "c2-activity-1",
        title: "Lectura comentada de antologia",
        type: "Lectura",
        dueDate: "2026-03-04",
        status: "pendiente",
        description: "Anotar 5 recursos poeticos y compartirlos en el aula.",
      },
      {
        id: "c2-activity-2",
        title: "Micro podcast de analisis",
        type: "Audio",
        dueDate: "2026-02-27",
        status: "completada",
        description: "Grabar una reflexion de 3 minutos sobre oralidad y ritmo.",
      },
    ],
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
    price: 38900,
    description: "Ejercicios semanales de cuento breve y devoluciones.",
    activities: [
      {
        id: "c3-activity-1",
        title: "Entrega de microcuento",
        type: "Entrega escrita",
        dueDate: "2026-03-05",
        status: "pendiente",
        description: "Publicar version final de 1000 palabras para devolucion grupal.",
      },
      {
        id: "c3-activity-2",
        title: "Peer review en pareja",
        type: "Revision",
        dueDate: "2026-03-02",
        status: "en progreso",
        description: "Comentar estructura y tono del cuento asignado.",
      },
    ],
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
    participants: ["Prof. Laura Quiroga", "Sofia", "Bruno", "Luz", "Lector Demo"],
    participantDetails: [
      { id: "coh4-prof", name: "Prof. Laura Quiroga", role: "Profesor/a" },
      { id: "coh4-s1", name: "Sofia", role: "Alumna" },
      { id: "coh4-s2", name: "Bruno", role: "Alumno" },
      { id: "coh4-s3", name: "Luz", role: "Alumna" },
      { id: "coh4-s4", name: "Lector Demo", role: "Alumno" },
    ],
    unread: 3,
    messages: [
      { id: "t2-m1", author: "Prof. Laura Quiroga", text: "Subi la consigna final del modulo 10 para toda la cohorte 4.", at: "Ayer" },
      { id: "t2-m2", author: "Bruno", text: "Si, hago una plantilla compartida y la paso.", at: "Ayer" },
      { id: "t2-m3", author: "Luz", text: "Genial, asi todos avanzamos con la misma estructura.", at: "Hoy" },
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
  {
    id: "post-4",
    network: "Instagram",
    author: "LitCafe",
    text: "Tarde de lluvia perfecta para empezar con Silvina Ocampo. Recomendacion del dia.",
    likes: 87,
    comments: 23,
    at: "Hace 1 dia",
  },
  {
    id: "post-5",
    network: "Instagram",
    author: "LitCafe",
    text: "Asi se vivio el taller de microrrelato del sabado. Gracias a todos los participantes.",
    likes: 112,
    comments: 31,
    at: "Hace 2 dias",
  },
  {
    id: "post-6",
    network: "Instagram",
    author: "LitCafe",
    text: "Nueva coleccion de poesia en la biblioteca del cafe. Pasen a conocerla.",
    likes: 74,
    comments: 15,
    at: "Hace 3 dias",
  },
  {
    id: "post-7",
    network: "Facebook",
    author: "Comunidad LitCafe",
    text: "Lectura en voz alta de poesia mapuche este viernes en la terraza.",
    likes: 41,
    comments: 9,
    at: "Hace 3 dias",
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
    content:
      "La organizacion de la feria internacional del libro confirmo la edicion 2026 con invitados de doce paises y un eje especial dedicado a la narrativa latinoamericana contemporanea. El cronograma incluye mesas de debate sobre nuevos formatos de lectura, talleres para mediadores culturales y una agenda federal con actividades en distintas provincias.\n\nTambien se anuncio un programa de formacion para docentes y bibliotecarios, orientado a estrategias de lectura en comunidad y acompanamiento de clubes de lectura escolares. Segun el comite curatorial, el objetivo es ampliar el acceso a novedades editoriales y fortalecer el vinculo entre autores, editoriales y lectores.",
    source: "Mock Literario",
    publishedAt: "2026-02-26",
    url: "#",
  },
  {
    id: "lit-news-mock-2",
    title: "Premio nacional de poesia abre convocatoria para obras ineditas",
    summary: "La convocatoria estara abierta hasta fines de abril y tendra categoria sub-30.",
    content:
      "El premio nacional de poesia abrio oficialmente su convocatoria para obras ineditas y sumo una categoria especifica para autores menores de 30 anos. La postulacion podra realizarse hasta fines de abril y se evaluaran manuscritos de todo el pais.\n\nEl jurado estara integrado por poetas, editores y docentes especializados en oralidad y escritura contemporanea. Ademas del reconocimiento economico, las obras ganadoras tendran acompanamiento editorial y una gira de lecturas en espacios culturales aliados.",
    source: "Mock Literario",
    publishedAt: "2026-02-24",
    url: "#",
  },
  {
    id: "lit-news-mock-3",
    title: "Editoriales independientes reportan suba en clubes de lectura",
    summary: "El crecimiento de comunidades locales impulsa nuevas colecciones de cuento breve.",
    content:
      "Diversas editoriales independientes reportaron un crecimiento sostenido de clubes de lectura y espacios de conversacion literaria en barrios y centros culturales. Este movimiento, segun referentes del sector, esta impulsando nuevas colecciones de cuento breve, poesia y ensayo para lectores que buscan encuentros periodicos y lectura guiada.\n\nLos sellos tambien destacaron que las comunidades lectoras mejoran la circulacion de catalogos de fondo y fomentan la recomendacion entre pares, un factor clave para sostener tiradas pequenas. Para 2026, varias editoriales anunciaron alianzas con bibliotecas populares para ampliar la distribucion.",
    source: "Mock Literario",
    publishedAt: "2026-02-21",
    url: "#",
  },
];

export const initialCourseCatalog = [
  {
    id: "catalog-1",
    title: "Critica literaria para comunidades",
    level: "Intermedio",
    format: "Virtual en vivo",
    duration: "8 semanas",
    price: 42900,
    description: "Aprende a leer, argumentar y moderar debates literarios en espacios colaborativos.",
  },
  {
    id: "catalog-2",
    title: "Introduccion a la poesia latinoamericana",
    level: "Inicial",
    format: "Aula asincronica + encuentros",
    duration: "6 semanas",
    price: 31900,
    description: "Recorrido guiado por poeticas contemporaneas con actividades semanales.",
  },
  {
    id: "catalog-3",
    title: "Laboratorio de novela corta",
    level: "Avanzado",
    format: "Presencial + virtual",
    duration: "10 semanas",
    price: 51900,
    description: "Del plan argumental al borrador final, con revision editorial y mentoria.",
  },
];

export const initialTrainingPrograms = [
  {
    id: "training-1",
    name: "Trayecto narrativo 2026",
    coordinator: "Laura Quiroga",
    students: 42,
    status: "activo",
  },
  {
    id: "training-2",
    name: "Programa poesia viva",
    coordinator: "Marta Elizondo",
    students: 29,
    status: "activo",
  },
  {
    id: "training-3",
    name: "Semillero de escritura",
    coordinator: "Rocio Ferrer",
    students: 18,
    status: "planificacion",
  },
];

export const initialEnrollments = [
  {
    id: "enroll-1",
    studentName: "Lector Demo",
    plan: "Trayecto narrativo 2026",
    status: "activa",
    startDate: "2026-01-10",
    renewalDate: "2026-03-10",
  },
  {
    id: "enroll-2",
    studentName: "Admin LitCafe",
    plan: "Programa institucional",
    status: "activa",
    startDate: "2025-11-01",
    renewalDate: "2026-11-01",
  },
];

export const initialPayments = [
  {
    id: "pay-1",
    studentName: "Lector Demo",
    concept: "Cuota febrero",
    amount: 32000,
    currency: "ARS",
    dueDate: "2026-02-10",
    status: "pagado",
    method: "Transferencia",
  },
  {
    id: "pay-2",
    studentName: "Lector Demo",
    concept: "Cuota marzo",
    amount: 32000,
    currency: "ARS",
    dueDate: "2026-03-10",
    status: "pendiente",
    method: "Tarjeta",
  },
  {
    id: "pay-3",
    studentName: "Admin LitCafe",
    concept: "Membresia anual",
    amount: 0,
    currency: "ARS",
    dueDate: "2026-11-01",
    status: "bonificado",
    method: "Interno",
  },
];
