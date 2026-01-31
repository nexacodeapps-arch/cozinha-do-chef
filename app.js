const appEl = document.getElementById("app");
const toastEl = document.getElementById("toast");

/* ===================== CONFIG GAMIFICATION ===================== */
const XP_PER_RECIPE = 20;
const XP_PER_LEVEL = 120;
const META_RECIPES = 10;

/* ===================== FIT (estimativas seguras) ===================== */
/**
 * IMPORTANTE:
 * - Isso é um planner educativo (front-end).
 * - Não é prescrição médica/nutricional.
 * - Resultados variam MUITO por pessoa. Procure um profissional, principalmente se você for menor de idade
 *   ou tiver condições de saúde.
 */
const FIT_RATES = {
  lose: {
    // kg/semana (faixas conservadoras)
    conservative: 0.25,
    standard: 0.5,
    aggressive: 0.75,
  },
  gain: {
    // kg/semana (ganho saudável costuma ser mais lento)
    conservative: 0.1,
    standard: 0.2,
    aggressive: 0.25,
  },
};

const RANKS = [
  { minLevel: 1, name: "Aprendiz", icon: "🥄" },
  { minLevel: 3, name: "Cozinheiro", icon: "🍳" },
  { minLevel: 5, name: "Chef", icon: "👨‍🍳" },
  { minLevel: 7, name: "Chef Sênior", icon: "🏅" },
  { minLevel: 10, name: "Mestre da Cozinha", icon: "👑" },
];

const EMBLEMS = [
  { id: "e1", name: "Bronze", icon: "🥉", unlockLevel: 1 },
  { id: "e2", name: "Prata", icon: "🥈", unlockLevel: 3 },
  { id: "e3", name: "Ouro", icon: "🥇", unlockLevel: 5 },
  { id: "e4", name: "Estrela", icon: "⭐", unlockLevel: 7 },
  { id: "e5", name: "Coroa", icon: "👑", unlockLevel: 10 },
];

/* ===================== STORAGE ===================== */
const STORAGE_KEY = "cozinha_do_chef_front_v4";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    toast("Armazenamento cheio (localStorage). Imagem muito grande.", "bad");
    return false;
  }
}
function loadStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw, null) : null;
}

/* ===================== TIME/DATE HELPERS ===================== */
function pad2(n) {
  return String(n).padStart(2, "0");
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addDaysISO(iso, delta) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}
function weekdayPtShort(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const map = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return map[dt.getDay()];
}

/* ===================== MOCK API ===================== */
const mockApi = (() => {
  const users = [
    { id: 1, email: "teste@teste.com", password: "123456", name: "Felipe" },
  ];

  const tracks = [
    {
      id: 1,
      title: "Airfryer",
      status: "active",
      description: "Receitas rápidas e crocantes.",
    },
    { id: 2, title: "Massas", status: "soon", description: "Em breve…" },
    { id: 3, title: "Doces", status: "soon", description: "Em breve…" },
    { id: 4, title: "Fitness", status: "soon", description: "Em breve…" },
    { id: 5, title: "Café da manhã", status: "soon", description: "Em breve…" },
    {
      id: 6,
      title: "Pratos rápidos",
      status: "soon",
      description: "Em breve…",
    },
    { id: 7, title: "Molhos", status: "soon", description: "Em breve…" },
    { id: 8, title: "Carnes", status: "soon", description: "Em breve…" },
    { id: 9, title: "Vegetariano", status: "soon", description: "Em breve…" },
    { id: 10, title: "Sobremesas", status: "soon", description: "Em breve…" },
  ];

  const recipesBase = [
    {
      id: 101,
      trackId: 1,
      title: "Batata crocante na Airfryer",
      description: "Crocante por fora e macia por dentro.",
      imageUrl:
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60",
      prepTime: 20,
      servings: 2,
      method: "Airfryer",
      temperature: 200,
      ingredients: [
        { name: "batata", qty: "2 unidades" },
        { name: "azeite", qty: "1 colher (sopa)" },
        { name: "sal", qty: "a gosto" },
        { name: "páprica", qty: "1 colher (chá)" },
      ],
      steps: [
        "Corte as batatas em palitos.",
        "Deixe 10 min na água e seque bem.",
        "Tempere com sal, páprica e azeite.",
        "Airfryer a 200°C por 15–20 min, chacoalhando na metade.",
      ],
      owner: "system",
    },
    {
      id: 102,
      trackId: 1,
      title: "Frango empanado crocante",
      description: "Empanado sem óleo e bem sequinho.",
      imageUrl:
        "https://images.unsplash.com/photo-1604908177071-2f76b1c1c8d1?auto=format&fit=crop&w=1200&q=60",
      prepTime: 25,
      servings: 2,
      method: "Airfryer",
      temperature: 200,
      ingredients: [
        { name: "frango", qty: "300g" },
        { name: "ovo", qty: "1 unidade" },
        { name: "farinha de rosca", qty: "qtd suficiente" },
        { name: "sal", qty: "a gosto" },
        { name: "pimenta-do-reino", qty: "a gosto" },
      ],
      steps: [
        "Tempere o frango com sal e pimenta.",
        "Passe no ovo batido.",
        "Empane na farinha de rosca.",
        "Airfryer a 200°C por 18–22 min, virando na metade.",
      ],
      owner: "system",
    },
    {
      id: 103,
      trackId: 1,
      title: "Banana com canela e mel",
      description: "Sobremesa rápida e cheirosa.",
      imageUrl:
        "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1200&q=60",
      prepTime: 10,
      servings: 1,
      method: "Airfryer",
      temperature: 180,
      ingredients: [
        { name: "banana", qty: "1 unidade" },
        { name: "canela", qty: "a gosto" },
        { name: "mel", qty: "1 colher (sobremesa)" },
      ],
      steps: [
        "Corte a banana ao meio.",
        "Polvilhe canela e finalize com mel.",
        "Airfryer a 180°C por 6–8 min.",
        "Sirva quente.",
      ],
      owner: "system",
    },
  ];

  const state = {
    authedUser: null,
    favorites: new Set(),
    ratings: new Map(),
    userRecipes: [],
    customIngredients: new Set(),
    progress: { xp: 0, recipesMade: 0, madeRecipeIds: new Set() },
    profile: { emblemId: "e1" },

    // Calendar: key "YYYY-MM-DD|HH:MM" -> {date,time,recipeId}
    calendar: new Map(),

    // Fit: saved plan
    fitPlan: null, // {startDate, weight, goal, pace, weeklyRateKg, targetChangeKg, projected[]}
  };

  function persist() {
    const data = {
      authedUser: state.authedUser,
      favorites: [...state.favorites],
      ratings: Object.fromEntries([...state.ratings.entries()]),
      userRecipes: state.userRecipes,
      customIngredients: [...state.customIngredients],
      progress: {
        xp: state.progress.xp,
        recipesMade: state.progress.recipesMade,
        madeRecipeIds: [...state.progress.madeRecipeIds],
      },
      profile: state.profile,
      calendar: [...state.calendar.entries()],
      fitPlan: state.fitPlan,
    };
    saveStorage(data);
  }

  function hydrateFromStorage() {
    const saved = loadStorage();
    if (!saved) return;

    state.authedUser = saved.authedUser || null;
    state.favorites = new Set(saved.favorites || []);
    state.ratings = new Map(
      Object.entries(saved.ratings || {}).map(([k, v]) => [Number(k), v]),
    );
    state.userRecipes = Array.isArray(saved.userRecipes)
      ? saved.userRecipes
      : [];
    state.customIngredients = new Set(saved.customIngredients || []);
    state.progress = {
      xp: saved.progress?.xp || 0,
      recipesMade: saved.progress?.recipesMade || 0,
      madeRecipeIds: new Set(saved.progress?.madeRecipeIds || []),
    };
    state.profile = saved.profile || { emblemId: "e1" };
    state.calendar = new Map(
      Array.isArray(saved.calendar) ? saved.calendar : [],
    );
    state.fitPlan = saved.fitPlan || null;
  }

  hydrateFromStorage();

  function delay(ms = 120) {
    return new Promise((r) => setTimeout(r, ms));
  }
  function allRecipes() {
    return [...recipesBase, ...state.userRecipes];
  }
  function normalizeMethod(m) {
    const x = String(m || "").trim();
    return x || "Airfryer";
  }

  return {
    async login(email, password, name, phone) {
      await delay();

      const e = String(email || "").trim();
      const p = String(password || "");
      const nm = String(name || "").trim();
      const ph = String(phone || "").trim();

      if (!nm) throw new Error("Digite seu nome.");
      if (!ph) throw new Error("Digite seu número.");

      const isTest = users.some((u) => u.email === e && u.password === p);
      const basicOk = e.includes("@") && p.length >= 4;

      if (!isTest && !basicOk) throw new Error("Email ou senha inválidos.");

      state.authedUser = {
        id: isTest ? 1 : 999,
        name: nm,
        phone: ph,
        email: e,
      };
      persist();
      return state.authedUser;
    },

    logout() {
      state.authedUser = null;
      persist();
    },
    me() {
      return state.authedUser;
    },

    async getTracks() {
      await delay();
      return tracks;
    },

    listAllRecipes() {
      return allRecipes();
    },

    async getRecipesByTrack(trackId) {
      await delay();
      const t = tracks.find((x) => x.id === trackId);
      if (!t) throw new Error("Trilha não encontrada.");
      if (t.status !== "active")
        throw new Error("Essa trilha está em breve 🔒");
      return allRecipes().filter((r) => r.trackId === trackId);
    },

    async getRecipe(recipeId) {
      await delay();
      const r = allRecipes().find((x) => x.id === recipeId);
      if (!r) throw new Error("Receita não encontrada.");

      return {
        recipe: r,
        userState: {
          isFavorite: state.favorites.has(recipeId),
          rating: state.ratings.get(recipeId) || null,
          isUserRecipe: r.owner === "user",
          isMade: state.progress.madeRecipeIds.has(recipeId),
        },
      };
    },

    async toggleFavorite(recipeId) {
      await delay(70);
      if (state.favorites.has(recipeId)) state.favorites.delete(recipeId);
      else state.favorites.add(recipeId);
      persist();
      return { isFavorite: state.favorites.has(recipeId) };
    },

    async getFavorites() {
      await delay();
      return [...state.favorites]
        .map((id) => allRecipes().find((r) => r.id === id))
        .filter(Boolean);
    },

    async getUserRecipes() {
      await delay();
      return [...state.userRecipes].slice().reverse();
    },

    async addUserRecipe(payload) {
      await delay(110);

      const title = String(payload.title || "").trim();
      if (!title) throw new Error("Dê um nome para a receita.");

      const ingList = (payload.ingredients || [])
        .map((n) => String(n || "").trim())
        .filter(Boolean)
        .map((name) => ({ name, qty: "" }));

      const steps = (payload.steps || [])
        .map((s) => String(s || "").trim())
        .filter(Boolean);

      if (ingList.length === 0)
        throw new Error("Adicione pelo menos 1 ingrediente.");
      if (steps.length === 0)
        throw new Error("Coloque pelo menos 1 passo no modo de preparo.");

      const id = Date.now();
      const imageUrl =
        payload.imageDataUrl ||
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60";

      const method = normalizeMethod(payload.method);
      const temperature =
        payload.temperature == null ? null : Number(payload.temperature);

      state.userRecipes.push({
        id,
        trackId: 1,
        title,
        description: String(payload.description || "").trim(),
        imageUrl,
        prepTime: payload.prepTime ?? null,
        servings: payload.servings ?? null,
        method,
        temperature,
        ingredients: ingList,
        steps,
        owner: "user",
      });

      ingList.forEach((i) => state.customIngredients.add(i.name.toLowerCase()));
      persist();
      return id;
    },

    async setRating(recipeId, stars) {
      await delay(70);
      const prev = state.ratings.get(recipeId) || { stars: null, loved: false };
      state.ratings.set(recipeId, { ...prev, stars });
      persist();
      return state.ratings.get(recipeId);
    },

    async setLoved(recipeId) {
      await delay(70);
      const prev = state.ratings.get(recipeId) || { stars: null, loved: false };
      state.ratings.set(recipeId, { ...prev, loved: true });
      persist();
      return state.ratings.get(recipeId);
    },

    async getAllIngredients() {
      await delay();
      const set = new Set();
      allRecipes().forEach((r) =>
        r.ingredients.forEach((i) => set.add(i.name.toLowerCase())),
      );
      state.customIngredients.forEach((x) => set.add(x));
      return [...set].sort().map((name, idx) => ({ id: idx + 1, name }));
    },

    async addIngredient(name) {
      await delay(50);
      const n = String(name || "")
        .trim()
        .toLowerCase();
      if (!n) throw new Error("Digite o nome do ingrediente.");
      state.customIngredients.add(n);
      persist();
      return true;
    },

    async recipesByIngredients(names) {
      await delay(120);
      const have = new Set(
        names.map((n) => n.toLowerCase().trim()).filter(Boolean),
      );
      if (have.size === 0) return [];
      return allRecipes().filter((r) => {
        const req = r.ingredients.map((x) => x.name.toLowerCase());
        return req.length > 0 && req.every((x) => have.has(x));
      });
    },

    async markRecipeMade(recipeId) {
      await delay(70);
      if (!state.progress.madeRecipeIds.has(recipeId)) {
        state.progress.madeRecipeIds.add(recipeId);
        state.progress.recipesMade += 1;
        state.progress.xp += XP_PER_RECIPE;
        persist();
        return { gained: XP_PER_RECIPE };
      }
      return { gained: 0 };
    },

    getProgress() {
      return {
        xp: state.progress.xp,
        recipesMade: state.progress.recipesMade,
        madeRecipeIds: new Set([...state.progress.madeRecipeIds]),
      };
    },

    updateProfile({ name, phone, email }) {
      if (state.authedUser) {
        state.authedUser.name =
          String(name || "").trim() || state.authedUser.name;
        state.authedUser.phone =
          String(phone || "").trim() || state.authedUser.phone;
        state.authedUser.email =
          String(email || "").trim() || state.authedUser.email;
      }
      persist();
    },

    getProfile() {
      return {
        user: state.authedUser,
        emblemId: state.profile.emblemId || "e1",
      };
    },
    equipEmblem(emblemId) {
      state.profile.emblemId = emblemId;
      persist();
    },

    // ======= Calendar =======
    async calendarUpsert({ date, time, recipeId }) {
      await delay(60);
      const d = String(date || "").trim();
      const t = String(time || "").trim();
      const rid = Number(recipeId);
      if (!d) throw new Error("Escolha a data.");
      if (!t) throw new Error("Escolha a hora.");
      if (!rid) throw new Error("Escolha uma receita.");
      const key = `${d}|${t}`;
      state.calendar.set(key, { date: d, time: t, recipeId: rid });
      persist();
      return true;
    },

    async calendarRemove({ date, time }) {
      await delay(50);
      const key = `${date}|${time}`;
      state.calendar.delete(key);
      persist();
      return true;
    },

    async calendarListByDate(date) {
      await delay(60);
      const d = String(date || "").trim();
      const items = [];
      for (const v of state.calendar.values()) if (v.date === d) items.push(v);
      items.sort((a, b) => a.time.localeCompare(b.time));
      return items;
    },

    // ======= Fit Planner =======
    fitGetPlan() {
      return state.fitPlan;
    },

    fitStartPlan({ weightKg, goal, pace }) {
      const w = Number(weightKg);
      if (!w || w <= 0) throw new Error("Digite um peso válido (kg).");
      const g = goal === "gain" ? "gain" : "lose";
      const p = ["conservative", "standard", "aggressive"].includes(pace)
        ? pace
        : "standard";

      const rate = FIT_RATES[g][p]; // kg por semana
      const weeks = 4;
      const targetChangeKg = rate * weeks * (g === "lose" ? -1 : 1);

      // projeção diária (30 dias)
      const days = 30;
      const dailyDelta = targetChangeKg / days;
      const startDate = todayISO();
      const projected = [];
      for (let i = 0; i < days; i++) {
        const date = addDaysISO(startDate, i);
        const val = w + dailyDelta * i;
        projected.push({ date, weight: Math.round(val * 10) / 10 });
      }

      state.fitPlan = {
        startDate,
        weightKg: w,
        goal: g,
        pace: p,
        weeklyRateKg: rate,
        targetChangeKg: Math.round(targetChangeKg * 10) / 10,
        projected,
      };
      persist();
      return state.fitPlan;
    },

    fitReset() {
      state.fitPlan = null;
      persist();
    },
  };
})();

/* ===================== UI HELPERS ===================== */
function toast(msg, type = "ok") {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden", "ok", "bad");
  toastEl.classList.add(type === "ok" ? "ok" : "bad");
  setTimeout(() => toastEl.classList.add("hidden"), 2400);
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}
function route() {
  const hash = location.hash || "#/login";
  const [_, base, id] = hash.split("/");
  return { base: base || "login", id };
}
function setHash(h) {
  location.hash = h;
}

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}
function getRank(level) {
  let best = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) best = r;
  return best;
}
function getEmblemById(id) {
  return EMBLEMS.find((e) => e.id === id) || EMBLEMS[0];
}

function layout(contentHtml) {
  const me = mockApi.me();
  const { emblemId } = mockApi.getProfile();
  const emblem = getEmblemById(emblemId);
  const userName = me?.name || "Chef";

  return `
    <div class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="#/home">
          <span class="brand-badge">🍲</span>
          <span>Cozinha do Chef</span>
        </a>

        <div class="nav">
          <a href="#/calendar">Calendário</a>
          <a href="#/fit">Fit</a>
          <a href="#/contact">Contato</a>
          <a href="#/feedback">Feedback</a>
          <a href="#/favorites">Minhas receitas</a>
          <a href="#/ingredients" class="btn-accent">Ingredientes</a>
          <a href="#/settings">Configurações</a>
          <button class="btn-danger" id="btnLogout">Sair</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="small-muted">
        Olá, ${escapeHtml(userName)} ${escapeHtml(emblem.icon)} <span style="opacity:.8;">(${escapeHtml(emblem.name)})</span>
      </div>
      ${contentHtml}
    </div>
  `;
}

function bindLogout() {
  const btn = document.getElementById("btnLogout");
  if (!btn) return;
  btn.onclick = () => {
    mockApi.logout();
    toast("Você saiu.", "ok");
    setHash("#/login");
  };
}

function recipeCard(r, isMine = false) {
  return `
    <div class="recipe-card" data-recipe="${r.id}">
      <img src="${r.imageUrl}" alt="Imagem da receita" />
      <h3>${escapeHtml(r.title)}</h3>
      ${isMine ? `<div class="badge" style="margin:6px 0;">✨ Sua receita</div>` : ""}
      <p>${escapeHtml(r.description || "")}</p>
      <div class="meta">
        <span>⏱ ${r.prepTime ?? "-"} min</span>
        <span>🍽 ${r.servings ?? "-"} porções</span>
      </div>
    </div>
  `;
}

/* ===================== ROUTER ===================== */
async function render() {
  const r = route();
  const authed = !!mockApi.me();

  if (!authed && r.base !== "login") {
    setHash("#/login");
    return;
  }
  if (authed && r.base === "login") {
    setHash("#/home");
    return;
  }

  if (r.base === "login") return renderLogin();
  if (r.base === "home") return renderHome();
  if (r.base === "track") return renderTrack(Number(r.id));
  if (r.base === "recipe") return renderRecipe(Number(r.id));
  if (r.base === "favorites") return renderFavorites();
  if (r.base === "ingredients") return renderIngredients();
  if (r.base === "calendar") return renderCalendar();
  if (r.base === "fit") return renderFit();
  if (r.base === "feedback") return renderFeedback();
  if (r.base === "contact") return renderContact();
  if (r.base === "settings") return renderSettings();

  setHash("#/home");
}

/* ===================== LOGIN ===================== */
function renderLogin() {
  appEl.innerHTML = `
    <div class="form-wrap card">
      <h1>Entrar</h1>
      <p>
        Bem-vindo(a) à <b>Cozinha do Chef</b> 🍲<br/>
        Trilhas organizadas, receitas práticas e evolução por XP.
      </p>

      <div class="row">
        <div class="field">
          <label>Seu nome</label>
          <input id="name" type="text" placeholder="Ex: Felipe" />
        </div>
        <div class="field">
          <label>Seu número</label>
          <input id="phone" type="tel" placeholder="Ex: 14999999999" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Email</label>
          <input id="email" type="email" placeholder="seuemail@email.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
      </div>

      <div class="row">
        <button class="btn primary" id="btnLogin">Entrar</button>
      </div>

      <p class="small-muted" style="margin-top:12px;">
        Dica: usuário teste: <b>teste@teste.com</b> / <b>123456</b>
      </p>
    </div>
  `;

  document.getElementById("btnLogin").onclick = async () => {
    try {
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      await mockApi.login(email, password, name, phone);
      toast("Login feito!", "ok");
      setHash("#/home");
    } catch (e) {
      toast(e.message, "bad");
    }
  };
}

/* ===================== HOME ===================== */
async function renderHome() {
  const heroImg =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1400&q=60";

  try {
    const tracks = await mockApi.getTracks();
    const prog = mockApi.getProgress();
    const level = getLevelFromXp(prog.xp);
    const rank = getRank(level);

    const xpInLevel = prog.xp % XP_PER_LEVEL;
    const pct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));
    const metaPct = Math.min(
      100,
      Math.round((prog.recipesMade / META_RECIPES) * 100),
    );

    const tracksHtml = tracks
      .map((t) => {
        const pill =
          t.status === "active"
            ? `<span class="pill active">Liberada</span>`
            : `<span class="pill soon">Em breve</span>`;
        return `
          <div class="track" data-track="${t.id}" data-status="${t.status}">
            <div class="t">${escapeHtml(t.title)}</div>
            <div class="s">${escapeHtml(t.description || "—")}</div>
            ${pill}
          </div>
        `;
      })
      .join("");

    appEl.innerHTML = layout(`
      <div class="grid-2">
        <div class="hero card">
          <h1>Bem-vindo(a) à Cozinha do Chef 🍲</h1>
          <p>
            Trilhas organizadas, receitas claras e um sistema de evolução por XP.
            Marque receitas como <b>feitas</b>, suba de nível e equipe emblemas no seu perfil.
            <br/><br/>
            Use o <b>Calendário</b> para planejar receitas por horário e a aba <b>Fit</b> para acompanhar sua meta do mês.
          </p>

          <div class="divider"></div>

          <div class="kpi">
            <div class="box">
              <div class="t">Patente</div>
              <div class="v">${escapeHtml(rank.icon)} ${escapeHtml(rank.name)}</div>
              <div class="small-muted">Nível ${level}</div>
            </div>

            <div class="box">
              <div class="t">XP</div>
              <div class="v">${prog.xp}</div>
              <div class="small-muted">${xpInLevel}/${XP_PER_LEVEL} para o próximo nível</div>
            </div>

            <div class="box">
              <div class="t">Receitas feitas</div>
              <div class="v">${prog.recipesMade}</div>
              <div class="small-muted">Meta: ${META_RECIPES}</div>
            </div>
          </div>

          <div style="margin-top:12px;">
            <div class="small-muted">Progresso do nível</div>
            <div class="progress"><div style="width:${pct}%"></div></div>
          </div>

          <div style="margin-top:12px;">
            <div class="small-muted">Meta de receitas feitas</div>
            <div class="progress"><div style="width:${metaPct}%"></div></div>
          </div>
        </div>

        <div class="hero-media card">
          <img src="${heroImg}" alt="Cozinha" />
          <div class="hero-caption">
            <div class="small-muted">Atalho</div>
            <div style="font-weight:700; margin-top:4px;">Planeje sua semana em 2 minutos:</div>
            <div class="small-muted" style="margin-top:6px;">
              1) Selecione receitas → 2) Agenda por horário no Calendário → 3) Marque “feito” pra ganhar XP.
            </div>
          </div>
        </div>
      </div>

      <div class="section-title">
        <h2>Trilhas</h2>
      </div>

      <div class="tracks">
        ${tracksHtml}
      </div>
    `);

    bindLogout();

    document.querySelectorAll(".track").forEach((el) => {
      el.onclick = () => {
        const id = Number(el.getAttribute("data-track"));
        const status = el.getAttribute("data-status");
        if (status !== "active") {
          toast("Essa trilha está em breve 🔒", "ok");
          return;
        }
        setHash(`#/track/${id}`);
      };
    });
  } catch (e) {
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Erro</h1><p>${escapeHtml(e.message)}</p></div>`,
    );
    bindLogout();
  }
}

/* ===================== TRILHA ===================== */
async function renderTrack(trackId) {
  try {
    const list = await mockApi.getRecipesByTrack(trackId);
    const cards = list.map((r) => recipeCard(r, r.owner === "user")).join("");

    appEl.innerHTML = layout(`
      <div class="section-title">
        <h2>Airfryer • Receitas</h2>
        <a class="btn small" href="#/home">← Voltar</a>
      </div>

      <div class="recipes">
        ${cards || `<div class="card hero"><p>Nenhuma receita cadastrada ainda.</p></div>`}
      </div>
    `);

    bindLogout();

    document.querySelectorAll(".recipe-card").forEach((el) => {
      el.onclick = () => setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
    });
  } catch (e) {
    toast(e.message, "bad");
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Ops</h1><p>${escapeHtml(e.message)}</p></div>`,
    );
    bindLogout();
  }
}

/* ===================== RECEITA ===================== */
async function renderRecipe(recipeId) {
  try {
    const { recipe, userState } = await mockApi.getRecipe(recipeId);

    const ingHtml = (recipe.ingredients || [])
      .map(
        (i) =>
          `<li>${escapeHtml(i.name)} ${i.qty ? `<span class="small-muted">• ${escapeHtml(i.qty)}</span>` : ""}</li>`,
      )
      .join("");

    const stepsHtml = (recipe.steps || [])
      .map((s) => `<li>${escapeHtml(s)}</li>`)
      .join("");

    const isFav = !!userState?.isFavorite;
    const starsSaved = userState?.rating?.stars || 0;
    const lovedSaved = !!userState?.rating?.loved;
    const isUserRecipe = !!userState?.isUserRecipe;
    const isMade = !!userState?.isMade;

    appEl.innerHTML = layout(`
      <div class="section-title">
        <h2>Receita</h2>
        <a class="btn small" href="#/home">← Home</a>
      </div>

      <div class="card recipe-detail">
        <h1>${escapeHtml(recipe.title)}</h1>
        ${isUserRecipe ? `<div class="badge">✨ Receita adicionada por você</div>` : ""}
        <p class="desc">${escapeHtml(recipe.description || "")}</p>

        <div class="meta" style="margin-bottom:12px;">
          <span>🍲 ${escapeHtml(recipe.method || "-")}</span>
          <span>🌡 ${recipe.temperature != null ? `${recipe.temperature}°C` : "-"}</span>
          <span>⏱ ${recipe.prepTime ?? "-"} min</span>
          <span>🍽 ${recipe.servings ?? "-"} porções</span>
        </div>

        <div class="detail-grid">
          <div>
            <div class="panel">
              <h3>Ingredientes</h3>
              <ul class="list">${ingHtml || "<li>Nenhum ingrediente cadastrado.</li>"}</ul>
            </div>

            <div class="panel" style="margin-top:12px;">
              <h3>Modo de preparo</h3>
              <ol class="steps">${stepsHtml || "<li>Sem passos cadastrados.</li>"}</ol>

              <div style="margin-top:14px;" class="row">
                <button class="btn ${isFav ? "primary" : ""}" id="btnFav">
                  ${isFav ? "★ Salva em Minhas receitas" : "☆ Salvar em Minhas receitas"}
                </button>

                <button class="btn primary" id="btnMade">
                  ${isMade ? "✅ Receita feita (XP ganho)" : "Marcar como feita (+XP)"}
                </button>
              </div>

              <div style="margin-top:10px;" class="row">
                <button class="btn primary" id="btnLoved">
                  ${lovedSaved ? "❤️ Você amou!" : "Fiz e amei"}
                </button>
              </div>

              <div style="margin-top:14px;">
                <div class="small-muted">Dê uma nota (5 estrelas):</div>
                <div class="stars" id="stars"></div>
                <div class="small-muted" id="starsHint" style="margin-top:6px;">
                  ${starsSaved ? `Sua nota atual: ${starsSaved}/5` : "Nenhuma nota ainda."}
                </div>
              </div>
            </div>
          </div>

          <div>
            <img class="detail-img" src="${recipe.imageUrl}" alt="Imagem da receita" />
          </div>
        </div>
      </div>
    `);

    bindLogout();

    // estrelas
    const starsEl = document.getElementById("stars");
    const hintEl = document.getElementById("starsHint");
    let selectedStars = starsSaved;

    function drawStars() {
      starsEl.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const s = document.createElement("div");
        s.className = "star" + (i <= selectedStars ? " on" : "");
        s.textContent = "★";
        s.onclick = async () => {
          try {
            selectedStars = i;
            drawStars();
            await mockApi.setRating(recipeId, i);
            hintEl.textContent = `Sua nota atual: ${i}/5`;
            toast("Avaliação salva!", "ok");
          } catch (e) {
            toast(e.message, "bad");
          }
        };
        starsEl.appendChild(s);
      }
    }
    drawStars();

    document.getElementById("btnFav").onclick = async () => {
      try {
        const st = await mockApi.toggleFavorite(recipeId);
        toast(
          st.isFavorite
            ? "Salvo em Minhas receitas!"
            : "Removido dos favoritos.",
          "ok",
        );
        renderRecipe(recipeId);
      } catch (e) {
        toast(e.message, "bad");
      }
    };

    document.getElementById("btnMade").onclick = async () => {
      try {
        const r = await mockApi.markRecipeMade(recipeId);
        toast(
          r.gained > 0
            ? `Boa! +${r.gained} XP 🎉`
            : "Essa receita já foi marcada como feita.",
          "ok",
        );
        renderRecipe(recipeId);
      } catch (e) {
        toast(e.message, "bad");
      }
    };

    document.getElementById("btnLoved").onclick = async () => {
      try {
        await mockApi.setLoved(recipeId);
        const r = await mockApi.markRecipeMade(recipeId);
        toast(
          r.gained > 0 ? `Amei! +${r.gained} XP ❤️` : "Feedback enviado! ❤️",
          "ok",
        );
        renderRecipe(recipeId);
      } catch (e) {
        toast(e.message, "bad");
      }
    };
  } catch (e) {
    toast(e.message, "bad");
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Ops</h1><p>${escapeHtml(e.message)}</p></div>`,
    );
    bindLogout();
  }
}

/* ===================== MINHAS RECEITAS (ingredientes: CAIXA DE DIGITAR) ===================== */
async function renderFavorites() {
  try {
    const favorites = await mockApi.getFavorites();
    const myRecipes = await mockApi.getUserRecipes();

    const favCards = favorites
      .map((r) => recipeCard(r, r.owner === "user"))
      .join("");
    const myCards = myRecipes.map((r) => recipeCard(r, true)).join("");

    appEl.innerHTML = layout(`
      <div class="section-title">
        <h2>Minhas receitas</h2>
        <a class="btn small" href="#/home">← Home</a>
      </div>

      <div class="card hero">
        <h1 style="margin:0 0 8px; font-size:18px;">Adicionar receita</h1>
        <p style="margin:0; color:var(--muted);">
          Faça upload da foto, escolha método e temperatura. Ingredientes: digite separados por vírgula.
        </p>

        <div class="divider"></div>

        <div class="row">
          <div class="field">
            <label>Nome da receita</label>
            <input id="arTitle" placeholder="Ex: Pão de queijo" />
          </div>

          <div class="field">
            <label>Foto (upload)</label>
            <input id="arFile" type="file" accept="image/*" />
            <img id="arPreview" class="preview-img hidden" alt="Preview" />
            <div class="small-muted">*A imagem é salva localmente (localStorage). Evite arquivos muito grandes.</div>
          </div>
        </div>

        <div class="field">
          <label>Descrição (curta)</label>
          <input id="arDesc" placeholder="Ex: Rápido, crocante e perfeito pro café." />
        </div>

        <div class="row">
          <div class="field">
            <label>Método</label>
            <select id="arMethod">
              <option>Airfryer</option>
              <option>Forno</option>
              <option>Fogão</option>
              <option>Microondas</option>
              <option>Panela de pressão</option>
              <option>Churrasqueira</option>
              <option>Outro</option>
            </select>
          </div>

          <div class="field">
            <label>Temperatura (°C) (opcional)</label>
            <input id="arTemp" type="number" placeholder="Ex: 200" />
          </div>

          <div class="field">
            <label>Tempo (min) / Porções (opcional)</label>
            <div class="row" style="margin:0;">
              <input id="arTime" type="number" placeholder="Tempo" />
              <input id="arServ" type="number" placeholder="Porções" />
            </div>
          </div>
        </div>

        <div class="field">
          <label>Ingredientes (separe por vírgula)</label>
          <input id="arIngs" placeholder="Ex: batata, sal, azeite..." />
        </div>

        <div class="field">
          <label>Modo de preparo (1 passo por linha)</label>
          <textarea id="arSteps" placeholder="Ex:
Misture...
Leve ao forno...
Sirva..."></textarea>
        </div>

        <div class="actions">
          <button class="btn primary" id="btnAddRecipe">Adicionar</button>
          <button class="btn" id="btnClearRecipe">Limpar</button>
        </div>
      </div>

      <div class="section-title">
        <h2>Receitas salvas</h2>
      </div>

      <div class="recipes">
        ${favCards || `<div class="card hero"><p>Você ainda não salvou receitas.</p></div>`}
      </div>

      <div class="section-title">
        <h2>Receitas que você adicionou</h2>
      </div>

      <div class="recipes">
        ${myCards || `<div class="card hero"><p>Você ainda não adicionou nenhuma receita.</p></div>`}
      </div>
    `);

    bindLogout();

    document.querySelectorAll(".recipe-card").forEach((el) => {
      el.onclick = () => setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
    });

    const fileEl = document.getElementById("arFile");
    const previewEl = document.getElementById("arPreview");
    let imageDataUrl = null;

    fileEl.onchange = () => {
      const f = fileEl.files?.[0];
      if (!f) return;

      const reader = new FileReader();
      reader.onload = () => {
        imageDataUrl = String(reader.result || "");
        previewEl.src = imageDataUrl;
        previewEl.classList.remove("hidden");
      };
      reader.readAsDataURL(f);
    };

    document.getElementById("btnAddRecipe").onclick = async () => {
      try {
        const title = document.getElementById("arTitle").value.trim();
        const description = document.getElementById("arDesc").value.trim();
        const stepsStr = document.getElementById("arSteps").value.trim();

        const method = document.getElementById("arMethod").value;
        const temperatureRaw = document.getElementById("arTemp").value;
        const prepTimeRaw = document.getElementById("arTime").value;
        const servingsRaw = document.getElementById("arServ").value;

        // ✅ ingredientes por caixa de digitar
        const ingStr = document.getElementById("arIngs").value.trim();
        const ingredients = ingStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const steps = stepsStr
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        const prepTime = prepTimeRaw ? Number(prepTimeRaw) : null;
        const servings = servingsRaw ? Number(servingsRaw) : null;
        const temperature = temperatureRaw ? Number(temperatureRaw) : null;

        const id = await mockApi.addUserRecipe({
          title,
          description,
          imageDataUrl,
          method,
          temperature,
          ingredients,
          steps,
          prepTime,
          servings,
        });

        toast("Receita adicionada!", "ok");
        setHash(`#/recipe/${id}`);
      } catch (e) {
        toast(e.message, "bad");
      }
    };

    document.getElementById("btnClearRecipe").onclick = () => {
      [
        "arTitle",
        "arDesc",
        "arSteps",
        "arTemp",
        "arTime",
        "arServ",
        "arIngs",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      imageDataUrl = null;
      previewEl.classList.add("hidden");
      previewEl.src = "";
      if (fileEl) fileEl.value = "";
      toast("Campos limpos.", "ok");
    };
  } catch (e) {
    toast(e.message, "bad");
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Erro</h1><p>${escapeHtml(e.message)}</p></div>`,
    );
    bindLogout();
  }
}

/* ===================== INGREDIENTES (SELECIONÁVEL DE VERDADE) ===================== */
async function renderIngredients() {
  try {
    const ingredients = await mockApi.getAllIngredients();

    appEl.innerHTML = layout(`
      <div class="section-title">
        <h2>Ingredientes</h2>
        <a class="btn small" href="#/home">← Home</a>
      </div>

      <div class="card hero">
        <p style="margin:0; color:var(--muted);">
          Selecione os ingredientes (clicando nos chips) e clique em <b>Buscar receitas</b>.
          A busca retorna receitas em que você tem <b>todos</b> os ingredientes.
        </p>

        <div class="divider"></div>

        <div class="row">
          <div class="field">
            <label>Adicionar novo ingrediente</label>
            <input id="newIng" placeholder="Ex: queijo, tomate..." />
          </div>
          <div class="field" style="align-self:end;">
            <button class="btn primary" id="btnAddIng">Adicionar</button>
          </div>
        </div>

        <div class="field" style="margin-top:6px;">
          <label>Filtrar lista</label>
          <input id="ingSearch" placeholder="Digite pra filtrar (ex: batata)" />
        </div>

        <div class="small-muted" id="selCount" style="margin-top:6px;">Selecionados: 0</div>
        <div class="chips" id="chips"></div>

        <div class="actions">
          <button class="btn primary" id="btnFind">Buscar receitas</button>
          <button class="btn" id="btnClear">Limpar seleção</button>
        </div>
      </div>

      <div class="section-title">
        <h2>Receitas possíveis</h2>
      </div>

      <div class="recipes" id="results"></div>
    `);

    bindLogout();

    const chipsEl = document.getElementById("chips");
    const resultsEl = document.getElementById("results");
    const searchEl = document.getElementById("ingSearch");
    const newIngEl = document.getElementById("newIng");
    const selCountEl = document.getElementById("selCount");

    const selected = new Set();

    function drawChips() {
      const f = searchEl.value.trim().toLowerCase();
      const list = f
        ? ingredients.filter((i) => i.name.includes(f))
        : ingredients;

      chipsEl.innerHTML = "";
      list.slice(0, 300).forEach((i) => {
        const on = selected.has(i.name);

        // ✅ botão simples: clique alterna seleção (sem checkbox)
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (on ? " on" : "");
        btn.textContent = i.name;

        btn.onclick = () => {
          if (selected.has(i.name)) selected.delete(i.name);
          else selected.add(i.name);
          selCountEl.textContent = `Selecionados: ${selected.size}`;
          btn.className = "chip" + (selected.has(i.name) ? " on" : "");
        };

        chipsEl.appendChild(btn);
      });

      selCountEl.textContent = `Selecionados: ${selected.size}`;
    }

    drawChips();
    searchEl.oninput = () => drawChips();

    document.getElementById("btnAddIng").onclick = async () => {
      try {
        const name = newIngEl.value.trim();
        await mockApi.addIngredient(name);
        toast("Ingrediente adicionado!", "ok");
        renderIngredients();
      } catch (e) {
        toast(e.message, "bad");
      }
    };

    document.getElementById("btnClear").onclick = () => {
      selected.clear();
      resultsEl.innerHTML = "";
      toast("Seleção limpa.", "ok");
      drawChips();
    };

    document.getElementById("btnFind").onclick = async () => {
      try {
        const names = Array.from(selected);
        const list = await mockApi.recipesByIngredients(names);

        resultsEl.innerHTML = list
          .map((r) => recipeCard(r, r.owner === "user"))
          .join("");

        if (!list.length) {
          resultsEl.innerHTML = `<div class="card hero"><p>Nenhuma receita 100% possível com esses ingredientes.</p></div>`;
        } else {
          toast(`Achamos ${list.length} receita(s)!`, "ok");
        }

        document.querySelectorAll(".recipe-card").forEach((el) => {
          el.onclick = () =>
            setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
        });
      } catch (e) {
        toast(e.message, "bad");
      }
    };
  } catch (e) {
    toast(e.message, "bad");
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Erro</h1><p>${escapeHtml(e.message)}</p></div>`,
    );
    bindLogout();
  }
}

/* ===================== CALENDÁRIO (receitas por qualquer horário) ===================== */
async function renderCalendar() {
  const all = mockApi.listAllRecipes();
  const d0 = todayISO();

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Calendário</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <p style="margin:0; color:var(--muted);">
        Escolha uma data e qualquer horário, selecione uma receita (do site ou sua) e adicione.
      </p>

      <div class="divider"></div>

      <div class="row">
        <div class="field">
          <label>Data</label>
          <input id="calDate" type="date" value="${d0}" />
        </div>
        <div class="field">
          <label>Hora</label>
          <input id="calTime" type="time" value="12:00" />
        </div>
      </div>

      <div class="field">
        <label>Receita</label>
        <select id="calRecipe"></select>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnCalAdd">Adicionar no horário</button>
        <button class="btn" id="btnCalRefresh">Atualizar lista do dia</button>
      </div>
    </div>

    <div class="section-title">
      <h2>Agenda do dia</h2>
    </div>

    <div class="card hero" id="calList">
      <p class="small-muted" style="margin:0;">Carregando...</p>
    </div>
  `);

  bindLogout();

  const sel = document.getElementById("calRecipe");
  sel.innerHTML = all
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (r) =>
        `<option value="${r.id}">${escapeHtml(r.title)}${r.owner === "user" ? " (minha)" : ""}</option>`,
    )
    .join("");

  const dateEl = document.getElementById("calDate");
  const timeEl = document.getElementById("calTime");
  const listEl = document.getElementById("calList");

  async function refreshList() {
    const date = dateEl.value || todayISO();
    const items = await mockApi.calendarListByDate(date);

    if (!items.length) {
      listEl.innerHTML = `<p style="margin:0; color:var(--muted);">Sem receitas planejadas para esse dia.</p>`;
      return;
    }

    const rows = items
      .map((it) => {
        const r = all.find((x) => x.id === it.recipeId);
        const title = r ? r.title : `Receita #${it.recipeId}`;
        return `
          <div class="panel" style="display:flex; justify-content:space-between; gap:10px; align-items:center; margin-top:10px;">
            <div>
              <div style="font-weight:700;">${escapeHtml(it.time)} • ${escapeHtml(title)}</div>
              <div class="small-muted">${escapeHtml(it.date)}</div>
            </div>
            <div class="actions" style="margin:0;">
              <button class="btn" data-open="${it.recipeId}">Abrir</button>
              <button class="btn-danger" data-del="${escapeHtml(it.time)}">Remover</button>
            </div>
          </div>
        `;
      })
      .join("");

    listEl.innerHTML = rows;

    listEl.querySelectorAll("[data-open]").forEach((b) => {
      b.onclick = () => setHash(`#/recipe/${b.getAttribute("data-open")}`);
    });

    listEl.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = async () => {
        try {
          const t = b.getAttribute("data-del");
          await mockApi.calendarRemove({ date, time: t });
          toast("Removido do calendário.", "ok");
          refreshList();
        } catch (e) {
          toast(e.message, "bad");
        }
      };
    });
  }

  document.getElementById("btnCalAdd").onclick = async () => {
    try {
      await mockApi.calendarUpsert({
        date: dateEl.value,
        time: timeEl.value,
        recipeId: sel.value,
      });
      toast("Receita agendada!", "ok");
      refreshList();
    } catch (e) {
      toast(e.message, "bad");
    }
  };

  document.getElementById("btnCalRefresh").onclick = () => refreshList();
  dateEl.onchange = () => refreshList();

  refreshList();
}

/* ===================== FIT (peso + meta + plano do mês + gráficos) ===================== */
function renderFit() {
  const plan = mockApi.fitGetPlan();

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Fit • Plano do mês</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <p style="margin:0; color:var(--muted);">
        Isso é um planner educativo (não substitui nutricionista/médico). Você define peso e meta, e o app
        gera um plano-base do mês + estimativas e gráficos.
      </p>

      <div class="divider"></div>

      <div class="row">
        <div class="field">
          <label>Peso atual (kg)</label>
          <input id="fitWeight" type="number" step="0.1" placeholder="Ex: 78.5" value="${plan ? plan.weightKg : ""}" />
        </div>
        <div class="field">
          <label>Meta</label>
          <select id="fitGoal">
            <option value="lose" ${plan?.goal === "lose" ? "selected" : ""}>Emagrecer</option>
            <option value="gain" ${plan?.goal === "gain" ? "selected" : ""}>Ganhar massa</option>
          </select>
        </div>
        <div class="field">
          <label>Ritmo (estimativa segura)</label>
          <select id="fitPace">
            <option value="conservative" ${plan?.pace === "conservative" ? "selected" : ""}>Conservador</option>
            <option value="standard" ${plan?.pace === "standard" ? "selected" : ""}>Padrão</option>
            <option value="aggressive" ${plan?.pace === "aggressive" ? "selected" : ""}>Intenso</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnFitStart">Começar</button>
        <button class="btn" id="btnFitReset">Resetar</button>
      </div>
    </div>

    <div class="section-title">
      <h2>Resultado</h2>
    </div>

    <div class="card hero" id="fitResult">
      ${
        plan
          ? `
        <div class="kpi">
          <div class="box">
            <div class="t">Início</div>
            <div class="v">${escapeHtml(plan.startDate)}</div>
            <div class="small-muted">${weekdayPtShort(plan.startDate)}</div>
          </div>
          <div class="box">
            <div class="t">Meta</div>
            <div class="v">${plan.goal === "lose" ? "⬇️ Emagrecer" : "⬆️ Ganhar massa"}</div>
            <div class="small-muted">Ritmo: ${escapeHtml(plan.pace)}</div>
          </div>
          <div class="box">
            <div class="t">Estimativa no mês</div>
            <div class="v">${plan.targetChangeKg > 0 ? "+" : ""}${plan.targetChangeKg} kg</div>
            <div class="small-muted">${Math.round(plan.weeklyRateKg * 10) / 10} kg/semana</div>
          </div>
        </div>

        <div class="divider"></div>

        <h1 style="margin:0 0 10px; font-size:18px;">Plano-base de alimentação (mês)</h1>
        <p style="margin:0; color:var(--muted);">
          Use isso como guia simples. Ajuste por preferência e saúde. Se tiver restrições, procure profissional.
        </p>

        <div class="panel" style="margin-top:10px;">
          <div style="font-weight:700;">Estrutura diária (modelo prato):</div>
          <ul class="list" style="margin-top:8px;">
            <li><b>Café da manhã:</b> 1 proteína + 1 carbo bom + 1 fruta (ex: ovos + aveia + banana)</li>
            <li><b>Almoço:</b> 1/2 prato de legumes + 1 proteína + 1 porção de carbo (arroz/mandioca/batata) + água</li>
            <li><b>Lanche:</b> iogurte/queijo + fruta ou castanhas (porção pequena)</li>
            <li><b>Jantar:</b> parecido com almoço, mas com carbo menor (ou sopa + proteína)</li>
          </ul>

          <div class="divider"></div>

          <div style="font-weight:700;">Foco da meta:</div>
          <ul class="list" style="margin-top:8px;">
            ${
              plan.goal === "lose"
                ? `
              <li>Priorize: proteína em todas as refeições, vegetais e água.</li>
              <li>Evite: líquidos calóricos (refrigerante/suco), excesso de doce e beliscos.</li>
              <li>Consistência > perfeição: 80% do mês bem feito já muda tudo.</li>
            `
                : `
              <li>Priorize: proteína + carbo em pelo menos 2 refeições fortes.</li>
              <li>Inclua: lanches com proteína (iogurte, ovos, frango desfiado, whey se usar).</li>
              <li>Treino de força + sono bom = ganho de massa melhor.</li>
            `
            }
          </ul>
        </div>

        <div class="divider"></div>

        <h1 style="margin:0 0 10px; font-size:18px;">Gráfico de projeção (30 dias)</h1>
        <canvas id="fitChartLine" height="220" style="width:100%; display:block;"></canvas>
        <div class="small-muted" id="fitSummary" style="margin-top:10px;"></div>
      `
          : `
        <p style="margin:0; color:var(--muted);">
          Preencha seu peso e escolha a meta para gerar o plano do mês + gráficos.
        </p>
      `
      }
    </div>
  `);

  bindLogout();

  const btnStart = document.getElementById("btnFitStart");
  const btnReset = document.getElementById("btnFitReset");

  btnStart.onclick = () => {
    try {
      const weight = document.getElementById("fitWeight").value;
      const goal = document.getElementById("fitGoal").value;
      const pace = document.getElementById("fitPace").value;
      mockApi.fitStartPlan({ weightKg: weight, goal, pace });
      toast("Plano gerado!", "ok");
      renderFit();
    } catch (e) {
      toast(e.message, "bad");
    }
  };

  btnReset.onclick = () => {
    mockApi.fitReset();
    toast("Fit resetado.", "ok");
    renderFit();
  };

  // desenhar gráfico se existir plano
  const newPlan = mockApi.fitGetPlan();
  if (newPlan) {
    drawFitLineChart(newPlan);
  }
}

function drawFitLineChart(plan) {
  const canvas = document.getElementById("fitChartLine");
  const summaryEl = document.getElementById("fitSummary");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Canvas nítido
  const cssW = canvas.getBoundingClientRect().width;
  const cssH = canvas.getBoundingClientRect().height;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(cssW * ratio);
  canvas.height = Math.floor(cssH * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  ctx.clearRect(0, 0, cssW, cssH);

  const pad = 18;
  const w = cssW - pad * 2;
  const h = cssH - pad * 2;

  const pts = plan.projected;
  const weights = pts.map((p) => p.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);

  // evita divisão por zero
  const range = Math.max(0.1, maxW - minW);

  function xAt(i) {
    return pad + (i / (pts.length - 1)) * w;
  }
  function yAt(val) {
    const t = (val - minW) / range; // 0..1
    return pad + (1 - t) * h;
  }

  // eixo base
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  // linha
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = "rgba(76,201,240,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = xAt(i);
    const y = yAt(p.weight);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // pontos (a cada 7 dias)
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "12px Poppins, sans-serif";
  for (let i = 0; i < pts.length; i += 7) {
    const x = xAt(i);
    const y = yAt(pts[i].weight);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`${pts[i].weight}kg`, x + 6, y - 6);
  }

  const start = pts[0].weight;
  const end = pts[pts.length - 1].weight;
  const delta = Math.round((end - start) * 10) / 10;

  summaryEl.textContent =
    `Estimativa: ${start}kg → ${end}kg (${delta > 0 ? "+" : ""}${delta}kg em ~30 dias). ` +
    `Isso é apenas uma projeção e varia de pessoa pra pessoa.`;

  window.addEventListener(
    "resize",
    () => {
      if (route().base === "fit") drawFitLineChart(plan);
    },
    { once: true },
  );
}

/* ===================== FEEDBACK/CONTATO/SETTINGS (simples) ===================== */
function renderFeedback() {
  const emailTo = "nexacode.apps@gmail.com";
  const me = mockApi.me();

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Feedback</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <div class="field">
        <label>Mensagem</label>
        <textarea id="fbMsg" placeholder="Escreva seu feedback..."></textarea>
      </div>
      <div class="actions">
        <button class="btn primary" id="btnSendFb">Enviar por email</button>
      </div>
      <div class="small-muted">Sem backend: abre seu app de email (mailto).</div>
    </div>
  `);

  bindLogout();

  document.getElementById("btnSendFb").onclick = () => {
    const message = document.getElementById("fbMsg").value.trim();
    if (!message) return toast("Digite uma mensagem.", "bad");

    const subject = encodeURIComponent("Feedback • Cozinha do Chef");
    const body = encodeURIComponent(
      `Nome: ${me?.name || "-"}\n` +
        `Número: ${me?.phone || "-"}\n` +
        `Email (login): ${me?.email || "-"}\n\n` +
        `Mensagem:\n${message}\n`,
    );

    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    toast("Abrindo seu email…", "ok");
  };
}

function renderContact() {
  const phone = "14998577898";
  const phoneIntl = "5514998577898";
  const email = "nexacode.apps@gmail.com";

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Contato</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <h1 style="margin:0 0 10px;">Quem somos</h1>
      <p style="margin:0; color:var(--muted);">
        A <b>Cozinha do Chef</b> organiza receitas em trilhas e facilita a prática no dia a dia — com favoritos,
        avaliação e busca por ingredientes. Projeto desenvolvido pela <b>NexaCode</b>.
      </p>

      <div class="divider"></div>

      <div class="panel">
        <p style="margin:0;">📱 WhatsApp: <b>${phone}</b></p>
        <p style="margin:8px 0 0;">📩 Email: <b>${email}</b></p>

        <div class="actions">
          <a class="btn primary" href="https://wa.me/${phoneIntl}" target="_blank" rel="noopener">
            Falar no WhatsApp
          </a>
          <a class="btn" href="mailto:${email}">
            Enviar email
          </a>
        </div>
      </div>
    </div>
  `);

  bindLogout();
}

function renderSettings() {
  const me = mockApi.me();
  const prog = mockApi.getProgress();
  const level = getLevelFromXp(prog.xp);
  const rank = getRank(level);

  const xpInLevel = prog.xp % XP_PER_LEVEL;
  const pct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));

  const profile = mockApi.getProfile();
  const equipped = getEmblemById(profile.emblemId);

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Configurações</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <h1 style="margin:0 0 10px; font-size:18px;">Editar perfil</h1>

      <div class="row">
        <div class="field">
          <label>Nome</label>
          <input id="pfName" value="${escapeHtml(me?.name || "")}" />
        </div>
        <div class="field">
          <label>Número</label>
          <input id="pfPhone" value="${escapeHtml(me?.phone || "")}" />
        </div>
      </div>

      <div class="field">
        <label>Email (login)</label>
        <input id="pfEmail" value="${escapeHtml(me?.email || "")}" />
      </div>

      <div class="actions">
        <button class="btn primary" id="btnSaveProfile">Salvar</button>
      </div>

      <div class="divider"></div>

      <h1 style="margin:0 0 10px; font-size:18px;">Patentes e níveis</h1>
      <div class="kpi">
        <div class="box">
          <div class="t">Patente atual</div>
          <div class="v">${escapeHtml(rank.icon)} ${escapeHtml(rank.name)}</div>
          <div class="small-muted">Nível ${level}</div>
        </div>
        <div class="box">
          <div class="t">XP total</div>
          <div class="v">${prog.xp}</div>
          <div class="small-muted">${xpInLevel}/${XP_PER_LEVEL} para o próximo nível</div>
        </div>
        <div class="box">
          <div class="t">Receitas feitas</div>
          <div class="v">${prog.recipesMade}</div>
          <div class="small-muted">+${XP_PER_RECIPE} XP por receita</div>
        </div>
      </div>

      <div style="margin-top:12px;">
        <div class="small-muted">Progresso do nível</div>
        <div class="progress"><div style="width:${pct}%"></div></div>
      </div>

      <div class="divider"></div>

      <h1 style="margin:0 0 10px; font-size:18px;">Emblemas</h1>
      <p style="margin:0; color:var(--muted);">
        Emblema equipado: <b>${escapeHtml(equipped.icon)} ${escapeHtml(equipped.name)}</b>
      </p>

      <div class="emblems" id="emblems"></div>
    </div>
  `);

  bindLogout();

  document.getElementById("btnSaveProfile").onclick = () => {
    const name = document.getElementById("pfName").value.trim();
    const phone = document.getElementById("pfPhone").value.trim();
    const email = document.getElementById("pfEmail").value.trim();
    mockApi.updateProfile({ name, phone, email });
    toast("Perfil atualizado!", "ok");
    renderSettings();
  };

  const emblemsEl = document.getElementById("emblems");
  emblemsEl.innerHTML = "";
  EMBLEMS.forEach((em) => {
    const locked = level < em.unlockLevel;
    const on = profile.emblemId === em.id;

    const btn = document.createElement("div");
    btn.className = "emblem" + (locked ? " locked" : "") + (on ? " on" : "");
    btn.innerHTML = `
      <div style="font-weight:700;">${escapeHtml(em.icon)} ${escapeHtml(em.name)}</div>
      <div class="small-muted">Desbloqueia no nível ${em.unlockLevel}${locked ? " (bloqueado)" : ""}</div>
    `;

    btn.onclick = () => {
      if (locked) return toast("Esse emblema ainda está bloqueado.", "bad");
      mockApi.equipEmblem(em.id);
      toast("Emblema equipado!", "ok");
      renderSettings();
    };
    emblemsEl.appendChild(btn);
  });
}

/* ===================== INIT ===================== */
window.addEventListener("hashchange", render);
render();
