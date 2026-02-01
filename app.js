"use strict";

const appEl = document.getElementById("app");
const toastEl = document.getElementById("toast");

const STORAGE_KEY = "cozinha_do_chef_front_final_v2";

const XP_PER_RECIPE = 20;
const XP_PER_LEVEL = 120;
const META_RECIPES = 10;

const FIT_RATES = {
  lose: { conservative: 0.25, standard: 0.5, aggressive: 0.75 },
  gain: { conservative: 0.1, standard: 0.2, aggressive: 0.25 },
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

const TRACKS = [
  {
    id: 1,
    title: "Airfryer",
    status: "active",
    description: "Receitas rápidas, práticas e crocantes.",
  },
  { id: 2, title: "Massas", status: "soon", description: "Em breve…" },
  { id: 3, title: "Doces", status: "soon", description: "Em breve…" },
  { id: 4, title: "Fitness", status: "soon", description: "Em breve…" },
  { id: 5, title: "Café da manhã", status: "soon", description: "Em breve…" },
  { id: 6, title: "Pratos rápidos", status: "soon", description: "Em breve…" },
  { id: 7, title: "Molhos", status: "soon", description: "Em breve…" },
  { id: 8, title: "Carnes", status: "soon", description: "Em breve…" },
  { id: 9, title: "Vegetariano", status: "soon", description: "Em breve…" },
  { id: 10, title: "Sobremesas", status: "soon", description: "Em breve…" },
];

const BASE_RECIPES = [
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
    isFit: true,
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
    isFit: false,
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
    isFit: true,
  },

  {
    id: 104,
    trackId: 1,
    title: "Frango em cubos temperado",
    description: "Fit - rápido, dourado e bem temperado.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908177071-2f76b1c1c8d1?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "peito de frango", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "páprica", qty: "" },
      { name: "alho", qty: "" },
      { name: "limão", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere: misture frango + sal + pimenta + páprica + alho + limão + azeite.",
      "Descanse: deixe 10 min pegando sabor.",
      "Asse: pré-aqueça 3 min. Coloque na cesta.",
      "Tempo/Temp: 200°C por 12–15 min, mexendo na metade.",
      "Ponto: frango dourado por fora e sem partes rosadas por dentro.",
      "Dica: não encha a cesta; se precisar, faça em 2 levas.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 105,
    trackId: 1,
    title: "Sobrecoxa marinada crocante",
    description: "Não fit - pele bem dourada e carne soltando do osso.",
    imageUrl:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=60",
    prepTime: 25,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "sobrecoxas", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "páprica", qty: "" },
      { name: "limão", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere e deixe marinar 20 min (se der).",
      "Airfryer pré-aquecida.",
      "200°C por 20–25 min, virando na metade.",
      "Ponto: pele bem dourada e carne soltando do osso.",
      "Dica: sai bastante gordura; por isso entra como não fit.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 106,
    trackId: 1,
    title: "Peito de frango recheado (ricota + espinafre)",
    description: "Fit - recheio leve e suculento.",
    imageUrl:
      "https://images.unsplash.com/photo-1516685018646-549d72c46f8c?auto=format&fit=crop&w=1200&q=60",
    prepTime: 18,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "peito de frango", qty: "" },
      { name: "ricota", qty: "" },
      { name: "espinafre", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "orégano", qty: "" },
      { name: "azeite", qty: "" },
      { name: "molho de tomate", qty: "" },
    ],
    steps: [
      "Tempere o frango por dentro e por fora.",
      "Misture ricota + espinafre + temperos e recheie.",
      "Feche com palitos (ou barbante).",
      "200°C por 15–18 min.",
      "Ponto: corte no meio (sem rosa).",
      "Dica: coloque 1 colher de molho de tomate por cima se quiser mais suculência.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 107,
    trackId: 1,
    title: "Almôndegas de peru",
    description: "Fit - firmes e douradas.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908812664-97c3b7f1ce5b?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "peru moído", qty: "" },
      { name: "cebola", qty: "" },
      { name: "alho", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "cheiro-verde", qty: "" },
      { name: "ovo", qty: "" },
      { name: "molho de tomate", qty: "" },
    ],
    steps: [
      "Misture tudo até virar uma massa firme.",
      "Modele bolinhas.",
      "200°C por 10–12 min, sacudindo no meio.",
      "Ponto: firmes e douradas.",
      "Dica: finalize com molho de tomate caseiro.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 108,
    trackId: 1,
    title: "Almôndegas com queijo",
    description: "Não fit - queijo derretendo dentro.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908812664-97c3b7f1ce5b?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "carne moída", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "queijo", qty: "" },
      { name: "farinha de rosca", qty: "" },
    ],
    steps: [
      "Tempere a carne.",
      "Coloque um cubo de queijo no centro e feche bem.",
      "200°C por 10–12 min.",
      "Ponto: douradas e queijo derretendo dentro.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 109,
    trackId: 1,
    title: "Hambúrguer caseiro",
    description: "Fit - suculento e simples.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 1,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "patinho moído", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
    ],
    steps: [
      "Modele os discos (sem amassar demais).",
      "Pré-aqueça a airfryer.",
      "200°C por 8–10 min, virando na metade.",
      "Ponto: suculento no meio (ou mais tempo se preferir).",
      "Dica: não fure o hambúrguer (perde suco).",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 110,
    trackId: 1,
    title: "Hambúrguer com bacon e cheddar",
    description: "Não fit - bacon + cheddar.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 1,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "hambúrguer", qty: "" },
      { name: "cheddar", qty: "" },
      { name: "bacon", qty: "" },
    ],
    steps: [
      "Asse o hambúrguer 200°C 8–10 min.",
      "Nos 2 min finais, coloque cheddar por cima.",
      "Faça o bacon separado: 200°C 6–10 min.",
      "Monte.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 111,
    trackId: 1,
    title: "Salmão com limão e ervas",
    description: "Fit - lasca fácil com o garfo.",
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "salmão", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "limão", qty: "" },
      { name: "ervas", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere e deixe 5–10 min.",
      "200°C por 8–12 min.",
      "Ponto: lasca fácil com o garfo.",
      "Dica: papel manteiga perfurado ajuda a não grudar.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 112,
    trackId: 1,
    title: "Tilápia com páprica",
    description: "Fit - rápida e saborosa.",
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "filé de tilápia", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "páprica", qty: "" },
      { name: "limão", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere e deixe 5 min.",
      "200°C por 8–10 min.",
      "Ponto: opaca e soltando em lascas.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 113,
    trackId: 1,
    title: "Camarão alho e limão",
    description: "Fit - fica pronto rapidinho.",
    imageUrl:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=60",
    prepTime: 8,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "camarão", qty: "" },
      { name: "alho", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "limão", qty: "" },
      { name: "azeite", qty: "" },
      { name: "salsinha", qty: "" },
    ],
    steps: [
      "Misture tudo.",
      "200°C por 6–8 min.",
      "Ponto: rosado e firme (não borrachudo).",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 114,
    trackId: 1,
    title: "Linguiça acebolada",
    description: "Não fit - dourada e cebola macia.",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60",
    prepTime: 18,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "linguiça", qty: "" },
      { name: "cebola", qty: "" },
      { name: "pimentão", qty: "" },
    ],
    steps: [
      "Fure levemente a linguiça (bem pouco).",
      "200°C 12–18 min, virando e mexendo a cebola.",
      "Ponto: dourada e cebola macia.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 115,
    trackId: 1,
    title: "Costelinha com BBQ",
    description: "Não fit - macia e caramelizada.",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60",
    prepTime: 38,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "costelinha", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "molho bbq", qty: "" },
    ],
    steps: [
      "Tempere a costelinha.",
      "180°C por 25–30 min (cozinhar por dentro).",
      "Pincele BBQ.",
      "200°C por 5–8 min (caramelizar).",
      "Ponto: macia e dourada.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 116,
    trackId: 1,
    title: "Ovo cozido na Airfryer",
    description: "Fit - sem panela.",
    imageUrl:
      "https://images.unsplash.com/photo-1505253213348-cea8f42d7d53?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 160,
    ingredients: [{ name: "ovos", qty: "" }],
    steps: [
      "Coloque os ovos na cesta.",
      "160°C por 12–15 min.",
      "Tire e coloque em água gelada por 5 min.",
      "Descasque.",
      "Dica: tempo menor = gema mais cremosa.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 117,
    trackId: 1,
    title: "Omelete de Airfryer",
    description: "Fit - firme e fácil.",
    imageUrl:
      "https://images.unsplash.com/photo-1510693206971-df098062cb71?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 1,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "ovos", qty: "2" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "tomate", qty: "" },
      { name: "cebola", qty: "" },
      { name: "cheiro-verde", qty: "" },
    ],
    steps: [
      "Bata os ovos e misture recheios.",
      "Coloque em forma pequena untada.",
      "180°C por 8–10 min.",
      "Ponto: firme no centro.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 118,
    trackId: 1,
    title: "Kafta",
    description: "Fit - temperada e firme.",
    imageUrl:
      "https://images.unsplash.com/photo-1604909053199-b63218b8ba11?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "carne moída", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "cominho", qty: "" },
      { name: "cheiro-verde", qty: "" },
    ],
    steps: [
      "Misture e modele em “palitos”.",
      "200°C por 10–12 min, virando.",
      "Ponto: dourada e firme.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 119,
    trackId: 1,
    title: "Batata-doce chips",
    description: "Fit - crocante (faça em levas).",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60",
    prepTime: 18,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "batata-doce", qty: "" },
      { name: "sal", qty: "" },
      { name: "páprica", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Seque as fatias com papel toalha.",
      "Misture temperos + azeite.",
      "180°C 12–18 min, mexendo.",
      "Ponto: crocante.",
      "Dica: pequenas levas.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 120,
    trackId: 1,
    title: "Batata rústica",
    description: "Fit - dourada e macia.",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60",
    prepTime: 25,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "batata", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "páprica", qty: "" },
      { name: "alecrim", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Lave, seque e tempere.",
      "200°C por 18–25 min, mexendo na metade.",
      "Ponto: dourada por fora e macia por dentro.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 121,
    trackId: 1,
    title: "Batata frita congelada",
    description: "Não fit - bem dourada.",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60",
    prepTime: 18,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [{ name: "batata congelada", qty: "" }],
    steps: [
      "Coloque na cesta sem lotar.",
      "200°C por 12–18 min.",
      "Sacuda 2x.",
      "Ponto: bem dourada.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 122,
    trackId: 1,
    title: "Mandioca crocante",
    description: "Não fit - casquinha crocante.",
    imageUrl:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60",
    prepTime: 20,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "mandioca cozida", qty: "" },
      { name: "sal", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Seque bem.",
      "200°C 15–20 min, mexendo.",
      "Ponto: casquinha crocante.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 123,
    trackId: 1,
    title: "Abobrinha chips",
    description: "Fit - o segredo é secar bem.",
    imageUrl:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "abobrinha", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "ervas", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Seque as rodelas (isso é o segredo).",
      "Tempere.",
      "180°C 10–15 min.",
      "Ponto: bordas douradas e crocantes.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 124,
    trackId: 1,
    title: "Brócolis crocante",
    description: "Fit - finalize com limão.",
    imageUrl:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "brócolis", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "azeite", qty: "" },
      { name: "limão", qty: "" },
    ],
    steps: [
      "Seque bem o brócolis.",
      "Tempere.",
      "200°C 8–12 min.",
      "Finalize com limão.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 125,
    trackId: 1,
    title: "Couve-flor temperada",
    description: "Fit - dourada e macia.",
    imageUrl:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "couve-flor", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "páprica", qty: "" },
      { name: "curry", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere.",
      "200°C 12–15 min, mexendo no meio.",
      "Ponto: dourada e macia.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 126,
    trackId: 1,
    title: "Cenoura assada",
    description: "Fit - palitos douradinhos.",
    imageUrl:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=60",
    prepTime: 16,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "cenoura", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Tempere.",
      "200°C 12–16 min, mexendo.",
      "Ponto: douradinha e macia.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 127,
    trackId: 1,
    title: "Milho com manteiga",
    description: "Não fit - manteiga e sal.",
    imageUrl:
      "https://images.unsplash.com/photo-1598515213692-5f6f37f5d4c2?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "milho", qty: "" },
      { name: "manteiga", qty: "" },
      { name: "sal", qty: "" },
    ],
    steps: [
      "Passe manteiga e sal.",
      "200°C 10–15 min, virando.",
      "Ponto: levemente dourado.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 128,
    trackId: 1,
    title: "Tomate recheado (atum)",
    description: "Fit - macio sem desmanchar.",
    imageUrl:
      "https://images.unsplash.com/photo-1546470427-227e9ccdbb84?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "tomate", qty: "" },
      { name: "atum", qty: "" },
      { name: "cebola", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "orégano", qty: "" },
    ],
    steps: [
      "Corte a tampa e tire o miolo.",
      "Misture o recheio.",
      "Recheie e leve 180°C 8–12 min.",
      "Ponto: tomate macio sem desmanchar.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 129,
    trackId: 1,
    title: "Berinjela à parmegiana",
    description: "Não fit - gratinada com queijo.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908554007-18e87140c880?auto=format&fit=crop&w=1200&q=60",
    prepTime: 22,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "berinjela", qty: "" },
      { name: "molho de tomate", qty: "" },
      { name: "queijo", qty: "" },
      { name: "orégano", qty: "" },
      { name: "sal", qty: "" },
    ],
    steps: [
      "Salgue a berinjela 10 min e seque.",
      "Asse as fatias 200°C 8 min.",
      "Monte com molho + queijo.",
      "180°C 8–12 min até gratinar.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 130,
    trackId: 1,
    title: "Cogumelos salteados",
    description: "Fit - douradinhos e suculentos.",
    imageUrl:
      "https://images.unsplash.com/photo-1449430864466-80fc365f1f5f?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "cogumelos", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Misture tudo.",
      "200°C 6–10 min, mexendo no meio.",
      "Ponto: douradinhos e suculentos.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 131,
    trackId: 1,
    title: "Aspargos com alho",
    description: "Fit - finalize com limão.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=60",
    prepTime: 8,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "aspargos", qty: "" },
      { name: "sal", qty: "" },
      { name: "pimenta-do-reino", qty: "" },
      { name: "alho", qty: "" },
      { name: "azeite", qty: "" },
      { name: "limão", qty: "" },
    ],
    steps: ["Tempere.", "200°C 6–8 min.", "Finalize com limão."],
    owner: "system",
    isFit: true,
  },
  {
    id: 132,
    trackId: 1,
    title: "Grão-de-bico crocante",
    description: "Fit - seque MUITO bem.",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60",
    prepTime: 18,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "grão-de-bico cozido", qty: "" },
      { name: "sal", qty: "" },
      { name: "páprica", qty: "" },
      { name: "azeite", qty: "" },
    ],
    steps: [
      "Seque MUITO bem (papel toalha).",
      "Misture temperos.",
      "200°C 12–18 min, sacudindo 2–3x.",
      "Ponto: crocante ao morder.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 133,
    trackId: 1,
    title: "Tofu crocante",
    description: "Fit - dourado e firme.",
    imageUrl:
      "https://images.unsplash.com/photo-1604909053199-b63218b8ba11?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "tofu", qty: "" },
      { name: "shoyu", qty: "" },
      { name: "alho", qty: "" },
      { name: "gengibre", qty: "" },
      { name: "amido de milho", qty: "" },
    ],
    steps: [
      "Seque o tofu.",
      "Tempere (e passe no amido se quiser).",
      "200°C 12–15 min, sacudindo na metade.",
      "Ponto: dourado e firme.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 134,
    trackId: 1,
    title: "Castanhas temperadas",
    description: "Fit - levemente tostadas.",
    imageUrl:
      "https://images.unsplash.com/photo-1598373182133-52452a3a2d38?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 2,
    method: "Airfryer",
    temperature: 160,
    ingredients: [
      { name: "castanhas", qty: "" },
      { name: "amendoim", qty: "" },
      { name: "sal", qty: "" },
      { name: "páprica", qty: "" },
      { name: "alecrim", qty: "" },
    ],
    steps: [
      "Misture temperos.",
      "160°C 6–10 min, mexendo.",
      "Ponto: levemente tostadas.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 135,
    trackId: 1,
    title: "Pão de alho",
    description: "Não fit - dourado e gostoso.",
    imageUrl:
      "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=60",
    prepTime: 8,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "pão", qty: "" },
      { name: "manteiga", qty: "" },
      { name: "alho", qty: "" },
      { name: "salsinha", qty: "" },
    ],
    steps: [
      "Misture manteiga + alho + salsinha.",
      "Passe no pão.",
      "180°C 5–8 min.",
      "Ponto: dourado.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 136,
    trackId: 1,
    title: "Pão de queijo",
    description: "Não fit - crescido e dourado.",
    imageUrl:
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 2,
    method: "Airfryer",
    temperature: 180,
    ingredients: [{ name: "pão de queijo", qty: "" }],
    steps: ["Pré-aqueça.", "180°C 10–15 min.", "Ponto: crescido e dourado."],
    owner: "system",
    isFit: false,
  },
  {
    id: 137,
    trackId: 1,
    title: "Pastel / salgado congelado",
    description: "Não fit - massa dourada.",
    imageUrl:
      "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 2,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "pastel congelado", qty: "" },
      { name: "salgado congelado", qty: "" },
    ],
    steps: [
      "Coloque sem encostar.",
      "200°C 8–12 min.",
      "Vire no meio.",
      "Ponto: massa dourada.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 138,
    trackId: 1,
    title: "Mini pizza",
    description: "Não fit - bordas crocantes.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 1,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "pão sírio", qty: "" },
      { name: "tortilha", qty: "" },
      { name: "molho de tomate", qty: "" },
      { name: "queijo", qty: "" },
      { name: "orégano", qty: "" },
      { name: "tomate", qty: "" },
    ],
    steps: [
      "Monte a base.",
      "180°C 6–10 min.",
      "Ponto: queijo derretido e bordas crocantes.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 139,
    trackId: 1,
    title: "Banana com canela",
    description: "Fit - macia e caramelizada.",
    imageUrl:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1200&q=60",
    prepTime: 10,
    servings: 1,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "banana", qty: "" },
      { name: "canela", qty: "" },
      { name: "cacau", qty: "" },
    ],
    steps: [
      "Corte ao meio (ou em rodelas grossas).",
      "Polvilhe canela.",
      "180°C 8–10 min.",
      "Ponto: macia e caramelizada.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 140,
    trackId: 1,
    title: "Maçã assada com canela",
    description: "Fit - doce natural.",
    imageUrl:
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=1200&q=60",
    prepTime: 15,
    servings: 1,
    method: "Airfryer",
    temperature: 180,
    ingredients: [
      { name: "maçã", qty: "" },
      { name: "canela", qty: "" },
      { name: "aveia", qty: "" },
      { name: "uva-passa", qty: "" },
    ],
    steps: [
      "Corte em gomos e tire sementes.",
      "Tempere com canela (e aveia se quiser).",
      "180°C 10–15 min.",
      "Ponto: macia mas firme.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 141,
    trackId: 1,
    title: "Bolo de banana com aveia",
    description: "Fit - simples e gostoso.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=60",
    prepTime: 25,
    servings: 4,
    method: "Airfryer",
    temperature: 165,
    ingredients: [
      { name: "bananas", qty: "2" },
      { name: "ovos", qty: "2" },
      { name: "aveia", qty: "" },
      { name: "canela", qty: "" },
      { name: "fermento", qty: "" },
    ],
    steps: [
      "Misture bananas + ovos.",
      "Adicione aveia e canela.",
      "Por último, fermento.",
      "Forma pequena untada.",
      "160–170°C 15–25 min.",
      "Ponto: palito sai limpo.",
    ],
    owner: "system",
    isFit: true,
  },
  {
    id: 142,
    trackId: 1,
    title: "Brownie tradicional",
    description: "Não fit - centro úmido.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=60",
    prepTime: 22,
    servings: 6,
    method: "Airfryer",
    temperature: 160,
    ingredients: [
      { name: "chocolate", qty: "" },
      { name: "manteiga", qty: "" },
      { name: "açúcar", qty: "" },
      { name: "ovos", qty: "" },
      { name: "farinha", qty: "" },
    ],
    steps: [
      "Derreta chocolate + manteiga.",
      "Misture açúcar e ovos.",
      "Junte farinha.",
      "Forma pequena.",
      "160°C 15–22 min.",
      "Ponto: centro úmido.",
    ],
    owner: "system",
    isFit: false,
  },
  {
    id: 143,
    trackId: 1,
    title: "Churros",
    description: "Não fit - dourado e crocante.",
    imageUrl:
      "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1200&q=60",
    prepTime: 12,
    servings: 3,
    method: "Airfryer",
    temperature: 200,
    ingredients: [
      { name: "massa de churros", qty: "" },
      { name: "açúcar", qty: "" },
      { name: "canela", qty: "" },
    ],
    steps: [
      "Modele os churros.",
      "200°C 8–12 min.",
      "Passe no açúcar e canela.",
      "Ponto: dourado e crocante por fora.",
    ],
    owner: "system",
    isFit: false,
  },
];

function toast(msg, type) {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden", "ok", "bad");
  toastEl.classList.add(type === "bad" ? "bad" : "ok");
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

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const s = raw ? safeParse(raw, null) : null;
  if (s) return s;

  return {
    session: null,
    favorites: [],
    ratings: {},
    madeRecipeIds: [],
    xp: 0,
    userRecipes: [],
    customIngredients: [],
    calendar: [],
    profile: { emblemId: "e1" },
    fit: { plan: null, checkins: {} },
  };
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    toast("Armazenamento cheio. Tente uma foto menor.", "bad");
    return false;
  }
}

function getAllRecipes() {
  return [...BASE_RECIPES, ...(state.userRecipes || [])];
}

function getRecipeById(id) {
  return getAllRecipes().find((r) => r.id === id) || null;
}

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor((xp || 0) / XP_PER_LEVEL) + 1);
}

function getRank(level) {
  let best = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) best = r;
  return best;
}

function getEmblemById(id) {
  return EMBLEMS.find((e) => e.id === id) || EMBLEMS[0];
}

function isAuthed() {
  return !!state.session;
}

function route() {
  const hash = location.hash || "#/login";
  const parts = hash.replace(/^#\//, "").split("/");
  return { page: parts[0] || "login", id: parts[1] || null };
}

function setHash(h) {
  location.hash = h;
}

function layout(inner) {
  const me = state.session;
  const level = getLevelFromXp(state.xp);
  const emblem = getEmblemById(state.profile?.emblemId);
  const name = me?.name || "Chef";

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
          <button class="btn danger" id="btnLogout">Sair</button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="small-muted">Olá, ${escapeHtml(name)} ${escapeHtml(emblem.icon)} <span style="opacity:.85;">(nível ${level})</span></div>
      ${inner}
    </div>
  `;
}

function bindLogout() {
  const btn = document.getElementById("btnLogout");
  if (!btn) return;
  btn.onclick = () => {
    state.session = null;
    saveState();
    toast("Você saiu.", "ok");
    setHash("#/login");
  };
}

function fitLabel(r) {
  if (r.isFit === true) return "🥗 Fit";
  if (r.isFit === false) return "🍔 Não fit";
  return "";
}

function recipeCardHTML(r) {
  const mine = r.owner === "user";
  const fit = fitLabel(r);
  return `
    <div class="recipe-card" data-recipe="${r.id}">
      <img src="${r.imageUrl}" alt="Imagem da receita" />
      <div class="body">
        <h3>${escapeHtml(r.title)}</h3>
        ${mine ? `<div class="badge">✨ Sua receita</div>` : ""}
        ${fit ? `<div class="badge">${escapeHtml(fit)}</div>` : ""}
        <p>${escapeHtml(r.description || "")}</p>
        <div class="meta">
          <span>⏱ ${r.prepTime ?? "-"} min</span>
          <span>🍽 ${r.servings ?? "-"} porções</span>
        </div>
      </div>
    </div>
  `;
}

function renderLogin() {
  appEl.innerHTML = `
    <div class="form-wrap card">
      <h1 style="margin:0 0 10px;">Entrar</h1>
      <p style="margin:0; color: var(--muted); line-height:1.55;">
        Bem-vindo(a) à <b>Cozinha do Chef</b> 🍲<br />
        Trilhas organizadas, receitas claras e evolução por XP.
      </p>

      <div class="divider"></div>

      <div class="row">
        <div class="field">
          <label>Seu nome</label>
          <input id="lgName" type="text" placeholder="Ex: Felipe" />
        </div>
        <div class="field">
          <label>Seu número</label>
          <input id="lgPhone" type="tel" placeholder="Ex: 14999999999" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Email</label>
          <input id="lgEmail" type="email" placeholder="teste@teste.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <input id="lgPass" type="password" placeholder="123456" />
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnLogin">Entrar</button>
      </div>

      <div class="small-muted" style="margin-top:12px;">
        Acesso: <b>teste@teste.com</b> / <b>123456</b>
      </div>
    </div>
  `;

  document.getElementById("btnLogin").onclick = () => {
    const name = document.getElementById("lgName").value.trim();
    const phone = document.getElementById("lgPhone").value.trim();
    const email = document.getElementById("lgEmail").value.trim();
    const pass = document.getElementById("lgPass").value;

    if (!name) return toast("Digite seu nome.", "bad");
    if (!phone) return toast("Digite seu número.", "bad");
    if (!email.includes("@")) return toast("Digite um email válido.", "bad");
    if (String(pass || "").length < 4) return toast("Senha inválida.", "bad");

    const ok = email === "teste@teste.com" && pass === "123456";
    if (!ok) return toast("Conta não encontrada. Use o acesso teste.", "bad");

    state.session = { name, phone, email };
    saveState();
    toast("Login feito!", "ok");
    setHash("#/home");
  };
}

function renderHome() {
  const heroImg =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1400&q=60";

  const level = getLevelFromXp(state.xp);
  const rank = getRank(level);
  const xpInLevel = (state.xp || 0) % XP_PER_LEVEL;
  const pct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));
  const recipesMade = (state.madeRecipeIds || []).length;
  const metaPct = Math.min(100, Math.round((recipesMade / META_RECIPES) * 100));

  const tracksHtml = TRACKS.map((t) => {
    const pill =
      t.status === "active"
        ? `<span class="pill active">Liberada</span>`
        : `<span class="pill soon">Em breve</span>`;
    return `
      <div class="track" data-track="${t.id}" data-status="${t.status}">
        <div class="t">${escapeHtml(t.title)}</div>
        <div class="s">${escapeHtml(t.description)}</div>
        ${pill}
      </div>
    `;
  }).join("");

  appEl.innerHTML = layout(`
    <div class="grid-2">
      <div class="hero card">
        <h1>Bem-vindo(a) à Cozinha do Chef 🍲</h1>
        <p>
          Aqui você encontra trilhas por tema, receitas diretas ao ponto e um sistema de evolução que deixa a rotina mais divertida.
          Marque receitas como <b>feitas</b>, ganhe <b>XP</b>, suba de nível e equipe emblemas no seu perfil.
          <br/><br/>
          Use o <b>Calendário</b> para planejar por horário e a aba <b>Fit</b> para gerar um plano do mês com base no seu peso.
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
            <div class="v">${state.xp || 0}</div>
            <div class="small-muted">${xpInLevel}/${XP_PER_LEVEL} para o próximo nível</div>
          </div>

          <div class="box">
            <div class="t">Receitas feitas</div>
            <div class="v">${recipesMade}</div>
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
          <div style="font-weight:900;">Cozinhar bem não precisa ser difícil.</div>
          <div class="small-muted" style="margin-top:6px;">
            Escolha uma receita, siga os passos, marque como feita e evolua com consistência.
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
      const status = el.getAttribute("data-status");
      const id = Number(el.getAttribute("data-track"));
      if (status !== "active")
        return toast("Essa trilha está em breve 🔒", "ok");
      setHash(`#/track/${id}`);
    };
  });
}

function renderTrack(trackId) {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) {
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Trilha não encontrada</h1></div>`,
    );
    bindLogout();
    return;
  }

  if (track.status !== "active") {
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Em breve 🔒</h1><p>Essa trilha ainda não foi liberada.</p></div>`,
    );
    bindLogout();
    return;
  }

  const list = getAllRecipes().filter((r) => r.trackId === trackId);
  const cards = list.map(recipeCardHTML).join("");

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>${escapeHtml(track.title)} • Receitas</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="recipes">
      ${cards || `<div class="card hero"><p>Nenhuma receita por aqui ainda.</p></div>`}
    </div>
  `);

  bindLogout();

  document.querySelectorAll(".recipe-card").forEach((el) => {
    el.onclick = () => setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
  });
}

function renderRecipe(recipeId) {
  const recipe = getRecipeById(recipeId);
  if (!recipe) {
    appEl.innerHTML = layout(
      `<div class="card hero"><h1>Receita não encontrada</h1></div>`,
    );
    bindLogout();
    return;
  }

  const isFav = (state.favorites || []).includes(recipeId);
  const rating = state.ratings?.[recipeId] || { stars: 0, loved: false };
  const isMade = (state.madeRecipeIds || []).includes(recipeId);
  const fit = fitLabel(recipe);

  const ingHtml = (recipe.ingredients || [])
    .map(
      (i) =>
        `<li>${escapeHtml(i.name)} ${i.qty ? `<span class="small-muted">• ${escapeHtml(i.qty)}</span>` : ""}</li>`,
    )
    .join("");

  const stepsHtml = (recipe.steps || [])
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Receita</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card recipe-detail">
      <h1>${escapeHtml(recipe.title)}</h1>
      ${recipe.owner === "user" ? `<div class="badge">✨ Receita adicionada por você</div>` : ""}
      ${fit ? `<div class="badge">${escapeHtml(fit)}</div>` : ""}
      <p class="desc">${escapeHtml(recipe.description || "")}</p>

      <div class="meta" style="margin-top:10px;">
        <span>🍲 ${escapeHtml(recipe.method || "-")}</span>
        <span>🌡 ${recipe.temperature != null ? `${recipe.temperature}°C` : "-"}</span>
        <span>⏱ ${recipe.prepTime ?? "-"} min</span>
        <span>🍽 ${recipe.servings ?? "-"} porções</span>
      </div>

      <div class="detail-grid">
        <div>
          <div class="panel">
            <h3>Ingredientes</h3>
            <ul class="list">${ingHtml}</ul>
          </div>

          <div class="panel" style="margin-top:12px;">
            <h3>Modo de preparo</h3>
            <ol class="steps">${stepsHtml}</ol>

            <div class="actions" style="margin-top:12px;">
              <button class="btn ${isFav ? "primary" : ""}" id="btnFav">
                ${isFav ? "★ Salva em Minhas receitas" : "☆ Salvar em Minhas receitas"}
              </button>

              <button class="btn primary" id="btnMade">
                ${isMade ? "✅ Receita feita (XP ganho)" : "Marcar como feita (+XP)"}
              </button>

              <button class="btn primary" id="btnLoved">
                ${rating.loved ? "❤️ Você amou!" : "Fiz e amei"}
              </button>
            </div>

            <div style="margin-top:14px;">
              <div class="small-muted">Dê uma nota (5 estrelas):</div>
              <div class="stars" id="stars"></div>
              <div class="small-muted" id="starsHint" style="margin-top:6px;">
                ${rating.stars ? `Sua nota: ${rating.stars}/5` : "Nenhuma nota ainda."}
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

  const starsEl = document.getElementById("stars");
  const hintEl = document.getElementById("starsHint");

  function drawStars(selected) {
    starsEl.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement("div");
      s.className = "star" + (i <= selected ? " on" : "");
      s.textContent = "★";
      s.onclick = () => {
        state.ratings = state.ratings || {};
        const prev = state.ratings[recipeId] || { stars: 0, loved: false };
        state.ratings[recipeId] = { ...prev, stars: i };
        saveState();
        hintEl.textContent = `Sua nota: ${i}/5`;
        drawStars(i);
        toast("Avaliação salva!", "ok");
      };
      starsEl.appendChild(s);
    }
  }

  drawStars(rating.stars || 0);

  document.getElementById("btnFav").onclick = () => {
    state.favorites = state.favorites || [];
    const idx = state.favorites.indexOf(recipeId);
    if (idx >= 0) state.favorites.splice(idx, 1);
    else state.favorites.push(recipeId);
    saveState();
    toast(
      idx >= 0 ? "Removido dos favoritos." : "Salvo em Minhas receitas!",
      "ok",
    );
    renderRecipe(recipeId);
  };

  document.getElementById("btnMade").onclick = () => {
    state.madeRecipeIds = state.madeRecipeIds || [];
    if (state.madeRecipeIds.includes(recipeId)) {
      toast("Essa receita já foi marcada como feita.", "ok");
      return;
    }
    state.madeRecipeIds.push(recipeId);
    state.xp = (state.xp || 0) + XP_PER_RECIPE;
    saveState();
    toast(`Boa! +${XP_PER_RECIPE} XP 🎉`, "ok");
    renderRecipe(recipeId);
  };

  document.getElementById("btnLoved").onclick = () => {
    state.ratings = state.ratings || {};
    const prev = state.ratings[recipeId] || { stars: 0, loved: false };
    state.ratings[recipeId] = { ...prev, loved: true };
    if (!(state.madeRecipeIds || []).includes(recipeId)) {
      state.madeRecipeIds = state.madeRecipeIds || [];
      state.madeRecipeIds.push(recipeId);
      state.xp = (state.xp || 0) + XP_PER_RECIPE;
    }
    saveState();
    toast("❤️ Registrado!", "ok");
    renderRecipe(recipeId);
  };
}

function renderFavorites() {
  const favorites = (state.favorites || [])
    .map((id) => getRecipeById(id))
    .filter(Boolean);
  const myRecipes = (state.userRecipes || []).slice().reverse();

  const favCards = favorites.map(recipeCardHTML).join("");
  const myCards = myRecipes.map(recipeCardHTML).join("");

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Minhas receitas</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <h1 style="margin:0 0 8px; font-size:18px;">Adicionar receita</h1>
      <p style="margin:0; color: var(--muted); line-height:1.55;">
        Foto por upload, método e temperatura. Ingredientes: digite separados por vírgula.
      </p>

      <div class="divider"></div>

      <div class="row">
        <div class="field">
          <label>Nome da receita</label>
          <input id="arTitle" placeholder="Ex: Pão de queijo" />
        </div>

        <div class="field">
          <label>Foto (upload)</label>
          <div class="file-row">
            <input id="arFile" type="file" accept="image/*" class="hidden" />
            <button class="btn" id="btnPickFile">Escolher arquivo</button>
            <span class="file-name" id="fileName">Nenhum arquivo</span>
          </div>
          <img id="arPreview" class="preview-img hidden" alt="Preview" />
        </div>
      </div>

      <div class="field">
        <label>Descrição (curta)</label>
        <input id="arDesc" placeholder="Ex: Crocante por fora e macio por dentro." />
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
          <div class="row" style="grid-template-columns: 1fr 1fr; margin:0;">
            <input id="arTime" type="number" placeholder="Tempo" />
            <input id="arServ" type="number" placeholder="Porções" />
          </div>
        </div>
      </div>

      <div class="field">
        <label>Ingredientes (separe por vírgula)</label>
        <input id="arIngs" placeholder="Ex: batata, sal, azeite" />
      </div>

      <div class="field">
        <label>Modo de preparo (1 passo por linha)</label>
        <textarea id="arSteps" placeholder="Misture...\nLeve ao forno...\nSirva..."></textarea>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnAddRecipe">Adicionar</button>
        <button class="btn" id="btnClearRecipe">Limpar</button>
      </div>

      <div class="small-muted" style="margin-top:10px;">
        Dica: fotos muito grandes podem encher o armazenamento do navegador.
      </div>
    </div>

    <div class="section-title">
      <h2>Receitas salvas</h2>
    </div>

    <div class="recipes">
      ${favCards || `<div class="card hero"><p style="margin:0;">Você ainda não salvou receitas.</p></div>`}
    </div>

    <div class="section-title">
      <h2>Receitas que você adicionou</h2>
    </div>

    <div class="recipes">
      ${myCards || `<div class="card hero"><p style="margin:0;">Você ainda não adicionou nenhuma receita.</p></div>`}
    </div>
  `);

  bindLogout();

  document.querySelectorAll(".recipe-card").forEach((el) => {
    el.onclick = () => setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
  });

  const fileInput = document.getElementById("arFile");
  const pickBtn = document.getElementById("btnPickFile");
  const fileName = document.getElementById("fileName");
  const preview = document.getElementById("arPreview");

  let imageDataUrl = null;

  pickBtn.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    fileName.textContent = f.name;

    const reader = new FileReader();
    reader.onload = () => {
      imageDataUrl = String(reader.result || "");
      preview.src = imageDataUrl;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(f);
  };

  document.getElementById("btnAddRecipe").onclick = () => {
    const title = document.getElementById("arTitle").value.trim();
    const description = document.getElementById("arDesc").value.trim();
    const method = document.getElementById("arMethod").value;
    const temperatureRaw = document.getElementById("arTemp").value.trim();
    const prepRaw = document.getElementById("arTime").value.trim();
    const servRaw = document.getElementById("arServ").value.trim();
    const ingStr = document.getElementById("arIngs").value.trim();
    const stepsStr = document.getElementById("arSteps").value.trim();

    if (!title) return toast("Dê um nome para a receita.", "bad");

    const ingredients = ingStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const steps = stepsStr
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!ingredients.length)
      return toast("Adicione pelo menos 1 ingrediente.", "bad");
    if (!steps.length) return toast("Coloque pelo menos 1 passo.", "bad");

    const temperature = temperatureRaw ? Number(temperatureRaw) : null;
    const prepTime = prepRaw ? Number(prepRaw) : null;
    const servings = servRaw ? Number(servRaw) : null;

    const newId = Date.now();

    const img =
      imageDataUrl ||
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60";

    const recipe = {
      id: newId,
      trackId: 1,
      title,
      description,
      imageUrl: img,
      prepTime,
      servings,
      method,
      temperature,
      ingredients: ingredients.map((name) => ({
        name: name.toLowerCase(),
        qty: "",
      })),
      steps,
      owner: "user",
      isFit: null,
    };

    state.userRecipes = state.userRecipes || [];
    state.userRecipes.push(recipe);

    state.customIngredients = state.customIngredients || [];
    for (const it of recipe.ingredients) {
      const n = String(it.name || "").toLowerCase();
      if (n && !state.customIngredients.includes(n))
        state.customIngredients.push(n);
    }

    if (!saveState()) return;

    toast("Receita adicionada!", "ok");
    setHash(`#/recipe/${newId}`);
  };

  document.getElementById("btnClearRecipe").onclick = () => {
    [
      "arTitle",
      "arDesc",
      "arTemp",
      "arTime",
      "arServ",
      "arIngs",
      "arSteps",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    imageDataUrl = null;
    fileName.textContent = "Nenhum arquivo";
    preview.src = "";
    preview.classList.add("hidden");
    fileInput.value = "";
    toast("Campos limpos.", "ok");
  };
}

function collectAllIngredients() {
  const set = new Set();
  for (const r of getAllRecipes()) {
    for (const i of r.ingredients || []) {
      const n = String(i.name || "")
        .trim()
        .toLowerCase();
      if (n) set.add(n);
    }
  }
  for (const n of state.customIngredients || []) {
    const x = String(n || "")
      .trim()
      .toLowerCase();
    if (x) set.add(x);
  }
  return [...set].sort();
}

function recipesByIngredients(selected) {
  const have = new Set(
    (selected || []).map((x) => String(x).toLowerCase().trim()).filter(Boolean),
  );
  if (!have.size) return [];
  return getAllRecipes().filter((r) => {
    const req = (r.ingredients || []).map((i) =>
      String(i.name || "").toLowerCase(),
    );
    if (!req.length) return false;
    return req.every((x) => have.has(x));
  });
}

function renderIngredients() {
  const all = collectAllIngredients();

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Ingredientes</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <p style="margin:0; color:var(--muted); line-height:1.55;">
        Clique nos ingredientes para selecionar e depois busque receitas possíveis.
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

  const selected = new Set();
  const chipsEl = document.getElementById("chips");
  const resultsEl = document.getElementById("results");
  const searchEl = document.getElementById("ingSearch");
  const countEl = document.getElementById("selCount");

  function drawChips() {
    const f = searchEl.value.trim().toLowerCase();
    const list = f ? all.filter((x) => x.includes(f)) : all;

    chipsEl.innerHTML = "";
    list.slice(0, 700).forEach((name) => {
      const on = selected.has(name);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (on ? " on" : "");
      btn.textContent = name;
      btn.onclick = () => {
        if (selected.has(name)) selected.delete(name);
        else selected.add(name);
        btn.className = "chip" + (selected.has(name) ? " on" : "");
        countEl.textContent = `Selecionados: ${selected.size}`;
      };
      chipsEl.appendChild(btn);
    });

    countEl.textContent = `Selecionados: ${selected.size}`;
  }

  drawChips();
  searchEl.oninput = () => drawChips();

  document.getElementById("btnAddIng").onclick = () => {
    const name = document.getElementById("newIng").value.trim().toLowerCase();
    if (!name) return toast("Digite o ingrediente.", "bad");
    state.customIngredients = state.customIngredients || [];
    if (!state.customIngredients.includes(name))
      state.customIngredients.push(name);
    saveState();
    toast("Ingrediente adicionado!", "ok");
    renderIngredients();
  };

  document.getElementById("btnClear").onclick = () => {
    selected.clear();
    resultsEl.innerHTML = "";
    toast("Seleção limpa.", "ok");
    drawChips();
  };

  document.getElementById("btnFind").onclick = () => {
    const list = recipesByIngredients([...selected]);
    if (!list.length) {
      resultsEl.innerHTML = `<div class="card hero"><p style="margin:0;">Nenhuma receita 100% possível com esses ingredientes.</p></div>`;
      return;
    }
    resultsEl.innerHTML = list.map(recipeCardHTML).join("");
    document.querySelectorAll(".recipe-card").forEach((el) => {
      el.onclick = () => setHash(`#/recipe/${el.getAttribute("data-recipe")}`);
    });
    toast(`Achamos ${list.length} receita(s)!`, "ok");
  };
}

function renderCalendar() {
  const all = getAllRecipes()
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  const d0 = todayISO();

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Calendário</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <p style="margin:0; color:var(--muted); line-height:1.55;">
        Agende receitas por dia e horário (do site ou suas receitas).
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
        <select id="calRecipe">
          ${all.map((r) => `<option value="${r.id}">${escapeHtml(r.title)}${r.owner === "user" ? " (minha)" : ""}</option>`).join("")}
        </select>
      </div>

      <div class="actions">
        <button class="btn primary" id="btnCalAdd">Adicionar</button>
        <button class="btn" id="btnCalRefresh">Atualizar</button>
      </div>
    </div>

    <div class="section-title">
      <h2>Agenda do dia</h2>
    </div>

    <div class="card hero" id="calList"><p class="small-muted" style="margin:0;">Carregando…</p></div>
  `);

  bindLogout();

  const dateEl = document.getElementById("calDate");
  const timeEl = document.getElementById("calTime");
  const recipeEl = document.getElementById("calRecipe");
  const listEl = document.getElementById("calList");

  function listForDate(date) {
    const items = (state.calendar || []).filter((x) => x.date === date);
    items.sort((a, b) => String(a.time).localeCompare(String(b.time)));
    return items;
  }

  function renderList() {
    const date = dateEl.value || todayISO();
    const items = listForDate(date);

    if (!items.length) {
      listEl.innerHTML = `<p style="margin:0; color:var(--muted);">Sem receitas planejadas para esse dia.</p>`;
      return;
    }

    listEl.innerHTML = items
      .map((it) => {
        const r = getRecipeById(Number(it.recipeId));
        const title = r ? r.title : `Receita #${it.recipeId}`;
        return `
          <div class="panel" style="display:flex; justify-content:space-between; gap:10px; align-items:center; margin-top:10px;">
            <div>
              <div style="font-weight:900;">${escapeHtml(it.time)} • ${escapeHtml(title)}</div>
              <div class="small-muted">${escapeHtml(it.date)}</div>
            </div>
            <div class="actions" style="margin:0;">
              <button class="btn small" data-open="${it.recipeId}">Abrir</button>
              <button class="btn small danger" data-del="${escapeHtml(it.time)}">Remover</button>
            </div>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-open]").forEach((b) => {
      b.onclick = () => setHash(`#/recipe/${b.getAttribute("data-open")}`);
    });

    listEl.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = () => {
        const time = b.getAttribute("data-del");
        const date = dateEl.value || todayISO();
        state.calendar = (state.calendar || []).filter(
          (x) => !(x.date === date && x.time === time),
        );
        saveState();
        toast("Removido.", "ok");
        renderList();
      };
    });
  }

  document.getElementById("btnCalAdd").onclick = () => {
    const date = dateEl.value;
    const time = timeEl.value;
    const rid = Number(recipeEl.value);

    if (!date) return toast("Escolha a data.", "bad");
    if (!time) return toast("Escolha a hora.", "bad");
    if (!rid) return toast("Escolha a receita.", "bad");

    state.calendar = state.calendar || [];
    const key = `${date}|${time}`;
    state.calendar = state.calendar.filter(
      (x) => `${x.date}|${x.time}` !== key,
    );
    state.calendar.push({ date, time, recipeId: rid });
    saveState();
    toast("Agendado!", "ok");
    renderList();
  };

  document.getElementById("btnCalRefresh").onclick = () => renderList();
  dateEl.onchange = () => renderList();

  renderList();
}

function fitComputePlan(weightKg, goal, pace) {
  const w = Number(weightKg);
  const g = goal === "gain" ? "gain" : "lose";
  const p = ["conservative", "standard", "aggressive"].includes(pace)
    ? pace
    : "standard";

  const weeklyRate = FIT_RATES[g][p];
  const weeks = 4;
  const change = weeklyRate * weeks * (g === "lose" ? -1 : 1);

  const startDate = todayISO();
  const days = 30;
  const dailyDelta = change / days;

  const projected = [];
  for (let i = 0; i < days; i++) {
    const date = addDaysISO(startDate, i);
    const val = w + dailyDelta * i;
    projected.push({ date, weight: Math.round(val * 10) / 10 });
  }

  const weekly = [];
  for (let wk = 1; wk <= 4; wk++) {
    const idx = Math.min(days - 1, wk * 7 - 1);
    weekly.push({
      week: wk,
      date: projected[idx].date,
      weight: projected[idx].weight,
    });
  }

  const waterLow = Math.round(w * 30);
  const waterHigh = Math.round(w * 35);

  const proteinLow = g === "lose" ? Math.round(w * 1.6) : Math.round(w * 1.8);
  const proteinHigh = g === "lose" ? Math.round(w * 2.0) : Math.round(w * 2.2);

  const fiberLow = Math.round(w * 0.3);
  const fiberHigh = Math.round(w * 0.45);

  const stepsLow = 6000;
  const stepsHigh = 10000;

  const kcalPerDayAbs = Math.round((weeklyRate * 7700) / 7);
  const kcalDelta = kcalPerDayAbs * (g === "lose" ? -1 : 1);

  return {
    startDate,
    weightKg: w,
    goal: g,
    pace: p,
    weeklyRateKg: weeklyRate,
    targetChangeKg: Math.round(change * 10) / 10,
    projected,
    weekly,
    waterLow,
    waterHigh,
    proteinLow,
    proteinHigh,
    fiberLow,
    fiberHigh,
    stepsLow,
    stepsHigh,
    kcalDelta,
  };
}

function drawLineChart(canvas, points) {
  const ctx = canvas.getContext("2d");

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

  const vals = points.map((p) => p.y);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = Math.max(0.1, maxV - minV);

  const xAt = (i) => pad + (i / (points.length - 1)) * w;
  const yAt = (val) => {
    const t = (val - minV) / range;
    return pad + (1 - t) * h;
  };

  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = "rgba(255,122,24,0.80)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = xAt(i);
    const y = yAt(p.y);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "12px system-ui";
  for (let i = 0; i < points.length; i += 7) {
    const x = xAt(i);
    const y = yAt(points[i].y);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    if (points[i].label) ctx.fillText(String(points[i].label), x + 6, y - 8);
  }
}

function drawBarChart(canvas, labels, values) {
  const ctx = canvas.getContext("2d");

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

  const maxV = Math.max(1, ...values);
  const n = labels.length;
  const gap = 10;
  const barW = Math.max(10, (w - gap * (n - 1)) / n);

  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  for (let i = 0; i < n; i++) {
    const x = pad + i * (barW + gap);
    const barH = (values[i] / maxV) * (h - 18);
    const y = pad + h - barH;

    ctx.globalAlpha = 0.95;
    ctx.fillStyle = values[i]
      ? "rgba(43,214,123,0.75)"
      : "rgba(255,255,255,0.16)";
    ctx.fillRect(x, y, barW, barH);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "12px system-ui";
    ctx.fillText(labels[i], x, pad + h + 14);
  }
}

function renderFit() {
  const plan = state.fit?.plan || null;

  appEl.innerHTML = layout(`
    <div class="section-title">
      <h2>Fit • Plano do mês</h2>
      <a class="btn small" href="#/home">← Home</a>
    </div>

    <div class="card hero">
      <p style="margin:0; color:var(--muted); line-height:1.55;">
        Você escolhe seu peso, meta e ritmo. O app gera estimativas, metas semanais e gráficos.
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
          <label>Ritmo</label>
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
      <h2>Resultados</h2>
    </div>

    <div class="card hero" id="fitResult">
      ${
        plan
          ? `
        <div class="kpi">
          <div class="box">
            <div class="t">Estimativa no mês</div>
            <div class="v">${plan.targetChangeKg > 0 ? "+" : ""}${plan.targetChangeKg} kg</div>
            <div class="small-muted">${plan.weeklyRateKg} kg/semana</div>
          </div>

          <div class="box">
            <div class="t">Água por dia</div>
            <div class="v">${plan.waterLow}–${plan.waterHigh} ml</div>
            <div class="small-muted">30–35 ml por kg</div>
          </div>

          <div class="box">
            <div class="t">Proteína/dia</div>
            <div class="v">${plan.proteinLow}–${plan.proteinHigh} g</div>
            <div class="small-muted">Baseado no seu peso</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="kpi">
          <div class="box">
            <div class="t">Fibras/dia</div>
            <div class="v">${plan.fiberLow}–${plan.fiberHigh} g</div>
            <div class="small-muted">Baseado no peso</div>
          </div>

          <div class="box">
            <div class="t">Passos/dia</div>
            <div class="v">${plan.stepsLow}–${plan.stepsHigh}</div>
            <div class="small-muted">Faixa recomendada</div>
          </div>

          <div class="box">
            <div class="t">Ajuste energético (estim.)</div>
            <div class="v">${plan.kcalDelta > 0 ? "+" : ""}${plan.kcalDelta} kcal/dia</div>
            <div class="small-muted">Estimativa pelo ritmo</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="panel">
          <h3>Plano-base do mês</h3>
          <ul class="list">
            <li><b>Café da manhã:</b> proteína + carbo bom + fruta</li>
            <li><b>Almoço:</b> 1/2 legumes + proteína + carbo (porção controlada)</li>
            <li><b>Lanche:</b> proteína leve + fruta ou castanhas</li>
            <li><b>Jantar:</b> parecido com almoço (ou sopa + proteína)</li>
          </ul>
          <div class="divider"></div>
          ${
            plan.goal === "lose"
              ? `<div class="small-muted">Foco: proteína em todas as refeições, vegetais, água, reduzir beliscos e líquidos calóricos.</div>`
              : `<div class="small-muted">Foco: proteína + carbo em refeições fortes, treino de força, sono bem feito e constância.</div>`
          }
        </div>

        <div class="divider"></div>

        <div class="panel">
          <h3>Marcos semanais</h3>
          <table class="table">
            <thead>
              <tr><th>Semana</th><th>Data</th><th>Peso estimado</th></tr>
            </thead>
            <tbody>
              ${plan.weekly
                .map(
                  (w) =>
                    `<tr><td>${w.week}</td><td>${escapeHtml(w.date)}</td><td>${w.weight} kg</td></tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="divider"></div>

        <div class="panel">
          <h3>Projeção do peso (30 dias)</h3>
          <div class="canvas-wrap">
            <canvas id="fitChartLine" height="220"></canvas>
          </div>
          <div class="small-muted" id="fitSummary" style="margin-top:10px;"></div>
        </div>

        <div class="divider"></div>

        <div class="panel">
          <h3>Rotina semanal</h3>
          <div class="small-muted">Marque 1x por dia se você se alimentou bem (últimos 7 dias).</div>
          <div class="actions" style="margin-top:10px;">
            <button class="btn primary" id="btnCheckin">Marcar hoje</button>
          </div>
          <div class="canvas-wrap" style="margin-top:12px;">
            <canvas id="fitChartBar" height="200"></canvas>
          </div>
        </div>
      `
          : `<p style="margin:0; color:var(--muted);">Preencha seu peso e escolha a meta para gerar o plano do mês.</p>`
      }
    </div>
  `);

  bindLogout();

  document.getElementById("btnFitStart").onclick = () => {
    const w = document.getElementById("fitWeight").value.trim();
    const goal = document.getElementById("fitGoal").value;
    const pace = document.getElementById("fitPace").value;

    const weight = Number(w);
    if (!weight || weight <= 0) return toast("Digite um peso válido.", "bad");

    state.fit = state.fit || { plan: null, checkins: {} };
    state.fit.plan = fitComputePlan(weight, goal, pace);
    saveState();
    toast("Plano gerado!", "ok");
    renderFit();
  };

  document.getElementById("btnFitReset").onclick = () => {
    state.fit = state.fit || { plan: null, checkins: {} };
    state.fit.plan = null;
    saveState();
    toast("Fit resetado.", "ok");
    renderFit();
  };

  if (plan) {
    const canvasLine = document.getElementById("fitChartLine");
    const summaryEl = document.getElementById("fitSummary");

    const pts = plan.projected.map((p, idx) => ({
      y: p.weight,
      label: idx % 7 === 0 ? `${p.weight}kg` : "",
    }));

    drawLineChart(canvasLine, pts);

    const start = plan.projected[0].weight;
    const end = plan.projected[plan.projected.length - 1].weight;
    const delta = Math.round((end - start) * 10) / 10;
    summaryEl.textContent = `Estimativa: ${start}kg → ${end}kg (${delta > 0 ? "+" : ""}${delta}kg em ~30 dias).`;

    const checkins = state.fit?.checkins || {};
    const labels = [];
    const values = [];
    const today = todayISO();

    for (let i = 6; i >= 0; i--) {
      const d = addDaysISO(today, -i);
      labels.push(weekdayPtShort(d));
      values.push(checkins[d] ? 1 : 0);
    }

    const canvasBar = document.getElementById("fitChartBar");
    drawBarChart(canvasBar, labels, values);

    document.getElementById("btnCheckin").onclick = () => {
      const d = todayISO();
      state.fit = state.fit || { plan: null, checkins: {} };
      state.fit.checkins = state.fit.checkins || {};
      if (state.fit.checkins[d]) return toast("Você já marcou hoje.", "ok");
      state.fit.checkins[d] = true;
      saveState();
      toast("Marcado!", "ok");
      renderFit();
    };

    window.addEventListener(
      "resize",
      () => {
        if (route().page === "fit" && state.fit?.plan) renderFit();
      },
      { once: true },
    );
  }
}

function renderFeedback() {
  const emailTo = "nexacode.apps@gmail.com";
  const me = state.session;

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

      <div class="small-muted">Ao enviar, abre seu app de email.</div>
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
      <h1 style="margin:0 0 10px; font-size:18px;">Quem somos</h1>
      <p style="margin:0; color:var(--muted); line-height:1.55;">
        A <b>Cozinha do Chef</b> organiza receitas em trilhas, facilita o dia a dia e traz evolução por XP.
        Projeto desenvolvido pela <b>NexaCode</b>.
      </p>

      <div class="divider"></div>

      <div class="panel">
        <div style="font-weight:900;">📱 WhatsApp: ${phone}</div>
        <div class="small-muted" style="margin-top:6px;">📩 Email: ${email}</div>

        <div class="actions" style="margin-top:12px;">
          <a class="btn primary" href="https://wa.me/${phoneIntl}" target="_blank" rel="noopener">Falar no WhatsApp</a>
          <a class="btn" href="mailto:${email}">Enviar email</a>
        </div>
      </div>
    </div>
  `);

  bindLogout();
}

function renderSettings() {
  const me = state.session;
  const level = getLevelFromXp(state.xp || 0);
  const rank = getRank(level);
  const xpInLevel = (state.xp || 0) % XP_PER_LEVEL;
  const pct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));
  const emblem = getEmblemById(state.profile?.emblemId);

  const emblemsHtml = EMBLEMS.map((em) => {
    const locked = level < em.unlockLevel;
    const on = (state.profile?.emblemId || "e1") === em.id;
    return `
        <div class="emblem ${locked ? "locked" : ""} ${on ? "on" : ""}" data-emblem="${em.id}">
          <div style="font-weight:900;">${escapeHtml(em.icon)} ${escapeHtml(em.name)}</div>
          <div class="small-muted">Desbloqueia no nível ${em.unlockLevel}${locked ? " (bloqueado)" : ""}</div>
        </div>
      `;
  }).join("");

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
          <div class="v">${state.xp || 0}</div>
          <div class="small-muted">${xpInLevel}/${XP_PER_LEVEL} para o próximo nível</div>
        </div>

        <div class="box">
          <div class="t">Emblema equipado</div>
          <div class="v">${escapeHtml(emblem.icon)} ${escapeHtml(emblem.name)}</div>
          <div class="small-muted">Troque abaixo</div>
        </div>
      </div>

      <div style="margin-top:12px;">
        <div class="small-muted">Progresso do nível</div>
        <div class="progress"><div style="width:${pct}%"></div></div>
      </div>

      <div class="divider"></div>

      <h1 style="margin:0 0 10px; font-size:18px;">Emblemas</h1>
      <div class="emblems" id="emblems">${emblemsHtml}</div>

      <div class="divider"></div>

      <h1 style="margin:0 0 10px; font-size:18px;">Como funcionam as patentes</h1>
      <div class="panel">
        <ul class="list">
          ${RANKS.map((r) => `<li><b>${escapeHtml(r.icon)} ${escapeHtml(r.name)}</b> — a partir do nível ${r.minLevel}</li>`).join("")}
        </ul>
      </div>
    </div>
  `);

  bindLogout();

  document.getElementById("btnSaveProfile").onclick = () => {
    const name = document.getElementById("pfName").value.trim();
    const phone = document.getElementById("pfPhone").value.trim();
    const email = document.getElementById("pfEmail").value.trim();

    if (!name) return toast("Nome inválido.", "bad");
    if (!phone) return toast("Número inválido.", "bad");
    if (!email.includes("@")) return toast("Email inválido.", "bad");

    state.session = { name, phone, email };
    saveState();
    toast("Perfil atualizado!", "ok");
    renderSettings();
  };

  document.querySelectorAll(".emblem").forEach((el) => {
    el.onclick = () => {
      const id = el.getAttribute("data-emblem");
      const em = getEmblemById(id);
      if (level < em.unlockLevel)
        return toast("Esse emblema ainda está bloqueado.", "bad");
      state.profile = state.profile || { emblemId: "e1" };
      state.profile.emblemId = id;
      saveState();
      toast("Emblema equipado!", "ok");
      renderSettings();
    };
  });
}

function renderPage() {
  const r = route();

  if (!isAuthed() && r.page !== "login") {
    setHash("#/login");
    return;
  }
  if (isAuthed() && r.page === "login") {
    setHash("#/home");
    return;
  }

  if (r.page === "login") return renderLogin();
  if (r.page === "home") return renderHome();
  if (r.page === "track") return renderTrack(Number(r.id));
  if (r.page === "recipe") return renderRecipe(Number(r.id));
  if (r.page === "favorites") return renderFavorites();
  if (r.page === "ingredients") return renderIngredients();
  if (r.page === "calendar") return renderCalendar();
  if (r.page === "fit") return renderFit();
  if (r.page === "feedback") return renderFeedback();
  if (r.page === "contact") return renderContact();
  if (r.page === "settings") return renderSettings();

  setHash("#/home");
}

window.addEventListener("hashchange", renderPage);
renderPage();
