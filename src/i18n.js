import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Removemos o LanguageDetector pois você está controlando o 'lng' manualmente.

// 1. Defina seus recursos de tradução (Textos do Site)
const resources = {
  // -----------------------
  // INGLÊS (en) - IDIOMA PADRÃO
  // -----------------------
  en: {
    translation: {
      // --- GERAL / NAVEGAÇÃO (Adicionado) ---
      "home": "Home",
      "favorites": "Favorites",
      "login": "Login",
      "register": "Register", // Cadastro
      "login_to_view_favorites": "Please login to view your favorite drinks.", // Mensagem de Favoritos

      // --- HEADER ---
      "view_profile": "View Profile",
      "sign_in_google": "Sign in with Google",

      // --- INGREDIENT CATEGORIES (Títulos) ---
      "cat_alcoholic_beverages": "Alcoholic Beverages",
      "cat_fruits": "Fruits",
      "cat_juices": "Juices",
      "cat_syrups": "Syrups",
      "cat_non_alcoholic_beverages": "Non-alcoholic Beverages",
      "cat_spices": "Spices",
      "cat_others": "Others",
      
      // --- INGREDIENT NAMES (Nomes de Ingredientes) ---
      "Rum": "Rum",
      "Light rum": "Light rum",
      "Dark rum": "Dark rum",
      "Vodka": "Vodka",
      "Gin": "Gin",
      "Tequila": "Tequila",
      "Whiskey": "Whiskey",
      "Scotch": "Scotch",
      "Bourbon": "Bourbon",
      "Brandy": "Brandy",
      "Cachaça": "Cachaça",
      "Triple sec": "Triple sec",
      "Vermouth": "Vermouth",
      "Kahlua": "Kahlua",
      "Amaretto": "Amaretto",
      "Baileys irish cream": "Baileys Irish Cream",
      "Cognac": "Cognac",
      "Champagne": "Champagne",
      "Beer": "Beer",
      "Lime": "Lime",
      "Lemon": "Lemon",
      "Orange": "Orange",
      "Pineapple": "Pineapple",
      "Mango": "Mango",
      "Banana": "Banana",
      "Apple": "Apple",
      "Lime juice": "Lime juice",
      "Lemon juice": "Lemon juice",
      "Orange juice": "Orange juice",
      "Pineapple juice": "Pineapple juice",
      "Cranberry juice": "Cranberry juice",
      "Apple juice": "Apple juice",
      "Tomato juice": "Tomato juice",
      "Grapefruit juice": "Grapefruit juice",
      "Grenadine": "Grenadine",
      "Sugar syrup": "Sugar syrup",
      "Honey syrup": "Honey syrup",
      "Orgeat syrup": "Orgeat syrup",
      "Agave syrup": "Agave syrup",
      "Maple syrup": "Maple syrup",
      "Tonic water": "Tonic water",
      "Soda water": "Soda water",
      "Ginger ale": "Ginger ale",
      "Coconut water": "Coconut water",
      "Iced tea": "Iced tea",
      "Coffee": "Coffee",
      "Espresso": "Espresso",
      "Hot chocolate": "Hot chocolate",
      "Milk": "Milk",
      "Cream": "Cream",
      "Sugar": "Sugar",
      "Brown sugar": "Brown sugar",
      "Salt": "Salt",
      "Cinnamon": "Cinnamon",
      "Mint": "Mint",
      "Egg": "Egg",
      "Egg yolk": "Egg yolk",
      "Egg white": "Egg white",
      "Bitters": "Bitters (Aromatic)",
      "Angostura bitters": "Angostura bitters",
      "Tabasco sauce": "Tabasco sauce",

      // --- CAMPOS DINÂMICOS DA API (Modal) ---
      "Cocktail": "Cocktail",
      "Ordinary Drink": "Ordinary Drink",
      "Shake": "Shake",
      "Alcoholic": "Alcoholic",
      "Non alcoholic": "Non alcoholic",
      "Optional alcohol": "Optional alcohol",
      "White wine glass": "White wine glass",
      "Highball glass": "Highball glass",
      "Cocktail glass": "Cocktail glass",
      "Old-fashioned glass": "Old-fashioned glass",

      // --- UNIDADES DE MEDIDA ---
      "oz": "oz",
      "shot": "shot",
      "cl": "cl",
      "tsp": "tsp",
      "tblsp": "tblsp",
      "dash": "dash",
      "part": "part",
      "piece": "piece",
      "cup": "cup",
      "ml": "ml",
      "lb": "lb",
      "slice": "slice",
      
      // --- TESTDRINKSERVICE & PLURALS ---
      "choose_ingredients": "Choose your ingredients",
      "search_ingredients_placeholder": "Search for your ingredients...",
      "drinks_found": "Drinks found",
      "search_drinks_placeholder": "Search drinks...",
      "random_drinks": "Random drinks",
      "no_drinks_found": "No drinks found yet.",
      "reset_selection": "Reset selection",
      "show_more": "Show more",

      // Plurals
      "match_single": "match",
      "match_plural": "matches",
      "ingredient_in_common_single": "ingredient in common",
      "ingredient_in_common_plural": "ingredients in common",

      // --- MODAL (Consentimento e Detalhes de Drinks) ---
      "attention_title": "⚠ Attention",
      "modal_age_warning_1": "Before continuing, please confirm that you are 18 years of age or older.",
      "modal_age_warning_2": "This application may contain sensitive content related to alcoholic beverages. Read carefully before proceeding.",
      "modal_age_confirmation": "To continue, you must confirm that you are 18 years of age or older and agree to our Terms of Use and Privacy Policy. Drink responsibly.",
      "modal_checkbox_label": "I confirm that I am 18 years of age or older and accept the terms.",
      "modal_accept_button": "Accept and Enter",
      
      // Modal Shared Details
      "loading_details": "Loading drink details...",
      "category": "Category:",
      "alcoholic": "Alcoholic:",
      "glass": "Glass:",
      "instructions": "Instructions:",
      "ingredients": "Ingredients",
      "as_you_like": "as you like",
      "youtube_warning": "The video shown may not be 100% identical to the recipe listed here.",
      "no_video_found": "No tutorial video found for this drink.",
      "search_on_youtube": "🔍 Search on YouTube",
      
      // --- PROFILE SCREEN ---
      "profile_login_required": "You need to be logged in to view the profile.",
      "logout": "Logout",
      "my_favorite_drinks": "My Favorite Drinks",
      "loading_drinks": "Loading your drinks...",
      "no_favorites_yet": "You have no favorite drinks yet.",
      "favorite_alert_login": "You need to be logged in to favorite a drink!",
      "desfavoritar": "Unfavorite", 
      "favoritar": "Favorite", 		
      "youtube_warning_profile": "The videos found on YouTube may not perfectly match our recipe.",
    }
  },
  // -----------------------
  // PORTUGUÊS (pt-BR) - TRADUÇÃO
  // -----------------------
  'pt-BR': {
    translation: {
      // --- GERAL / NAVEGAÇÃO (Adicionado) ---
      "home": "Início",
      "favorites": "Favoritos",
      "login": "Entrar",
      "register": "Cadastrar", // Cadastro
      "login_to_view_favorites": "Por favor, faça login para ver seus drinks favoritos.", // Mensagem de Favoritos

      // CHAVES DO HEADER.JS
      "view_profile": "Ver Perfil",
      "sign_in_google": "Entrar com Google",

      // --- INGREDIENT CATEGORIES (Títulos) ---
      "cat_alcoholic_beverages": "Bebidas Alcoólicas",
      "cat_fruits": "Frutas",
      "cat_juices": "Sucos",
      "cat_syrups": "Xaropes",
      "cat_non_alcoholic_beverages": "Bebidas Não-Alcoólicas",
      "cat_spices": "Temperos",
      "cat_others": "Outros",

      // --- INGREDIENT NAMES (Nomes de Ingredientes) ---
      "Rum": "Rum",
      "Light rum": "Rum Claro",
      "Dark rum": "Rum Escuro",
      "Vodka": "Vodka",
      "Gin": "Gin",
      "Tequila": "Tequila",
      "Whiskey": "Whisky",
      "Scotch": "Scotch",
      "Bourbon": "Bourbon",
      "Brandy": "Brandy",
      "Cachaça": "Cachaça",
      "Triple sec": "Triple Sec",
      "Vermouth": "Vermute",
      "Kahlua": "Kahlúa",
      "Amaretto": "Amaretto",
      "Baileys irish cream": "Creme Irlandês Baileys",
      "Cognac": "Conhaque",
      "Champagne": "Champagne",
      "Beer": "Cerveja",
      "Lime": "Limão Taiti",
      "Lemon": "Limão Siciliano",
      "Orange": "Laranja",
      "Pineapple": "Abacaxi",
      "Mango": "Manga",
      "Banana": "Banana",
      "Apple": "Maçã",
      "Lime juice": "Suco de Limão Taiti",
      "Lemon juice": "Suco de Limão Siciliano",
      "Orange juice": "Suco de Laranja",
      "Pineapple juice": "Suco de Abacaxi",
      "Cranberry juice": "Suco de Cranberry",
      "Apple juice": "Suco de Maçã",
      "Tomato juice": "Suco de Tomate",
      "Grapefruit juice": "Suco de Toranja",
      "Grenadine": "Groselha (Xarope)",
      "Sugar syrup": "Xarope de Açúcar",
      "Honey syrup": "Xarope de Mel",
      "Orgeat syrup": "Xarope de Orgeat",
      "Agave syrup": "Xarope de Agave",
      "Maple syrup": "Xarope de Bordo",
      "Tonic water": "Água Tônica",
      "Soda water": "Água com Gás",
      "Ginger ale": "Ginger Ale",
      "Coconut water": "Água de Coco",
      "Iced tea": "Chá Gelado",
      "Coffee": "Café",
      "Espresso": "Espresso",
      "Hot chocolate": "Chocolate Quente",
      "Milk": "Leite",
      "Cream": "Creme",
      "Sugar": "Açúcar",
      "Brown sugar": "Açúcar Mascavo",
      "Salt": "Sal",
      "Cinnamon": "Canela",
      "Mint": "Hortelã",
      "Egg": "Ovo",
      "Egg yolk": "Gema de Ovo",
      "Egg white": "Clara de Ovo",
      "Bitters": "Bitters (Aromatizante)",
      "Angostura bitters": "Angostura Bitters",
      "Tabasco sauce": "Molho Tabasco",

      // --- CAMPOS DINÂMICOS DA API (Modal) ---
      "Cocktail": "Coquetel",
      "Ordinary Drink": "Drink Comum",
      "Shake": "Batido",
      "Alcoholic": "Alcoólico",
      "Non alcoholic": "Não-alcoólico",
      "Optional alcohol": "Álcool Opcional",
      "White wine glass": "Copo de vinho branco",
      "Highball glass": "Copo Highball",
      "Cocktail glass": "Taça de Coquetel",
      "Old-fashioned glass": "Copo Old-fashioned",
      
      // --- UNIDADES DE MEDIDA ---
      "oz": "oz", // Mantido como oz na tradução.
      "shot": "dose",
      "cl": "cl",
      "tsp": "colher de chá",
      "tblsp": "colher de sopa",
      "dash": "pitada",
      "part": "parte",
      "piece": "pedaço",
      "cup": "xícara",
      "ml": "ml",
      "lb": "libra",
      "slice": "fatia",


      // CHAVES DO TESTDRINKSERVICE.JS
      "choose_ingredients": "Escolha seus ingredientes",
      "search_ingredients_placeholder": "Pesquise seus ingredientes...",
      "drinks_found": "Drinks encontrados",
      "search_drinks_placeholder": "Pesquisar drinks...",
      "random_drinks": "Drinks aleatórios",
      "no_drinks_found": "Nenhum drink encontrado ainda.",
      "reset_selection": "Reiniciar seleção",
      "show_more": "Mostrar mais",

      // Plurais
      "match_single": "combinação",
      "match_plural": "combinações",
      "ingredient_in_common_single": "ingrediente em comum",
      "ingredient_in_common_plural": "ingredientes em comum",

      // Modal
      "attention_title": "⚠ Atenção",
      "modal_age_warning_1": "Antes de continuar, confirme que possui 18 anos ou mais.",
      "modal_age_warning_2": "Este aplicativo pode conter conteúdo sensível relacionado a bebidas alcoólicas. Leia atentamente antes de prosseguir.",
      "modal_age_confirmation": "Para continuar, você precisa confirmar que tem 18 anos ou mais e que concorda com nossos Termos de Uso e Política de Privacidade. Beba com responsabilidade.",
      "modal_checkbox_label": "Eu confirmo que tenho 18 anos ou mais e aceito os termos.",
      "modal_accept_button": "Aceitar e Entrar",

      // Modal Shared Details
      "loading_details": "Carregando detalhes do drink...",
      "category": "Categoria:",
      "alcoholic": "Alcoólico:",
      "glass": "Copo:",
      "instructions": "Instruções:",
      "ingredients": "Ingredientes",
      "as_you_like": "a gosto",
      "youtube_warning": "O vídeo mostrado pode não ser 100% idêntico à receita listada aqui.",
      "no_video_found": "Nenhum vídeo tutorial encontrado para este drink.",
      "search_on_youtube": "🔍 Pesquisar no YouTube",

      // CHAVES DO PROFILESCREEN.JS
      "profile_login_required": "Você precisa estar logado para ver o perfil.",
      "logout": "Sair",
      "my_favorite_drinks": "Meus Drinks Favoritos",
      "loading_drinks": "Carregando seus drinks...",
      "no_favorites_yet": "Você ainda não tem drinks favoritos.",
      "favorite_alert_login": "Você precisa estar logado para favoritar um drink!",
      "desfavoritar": "Desfavoritar",
      "favoritar": "Favoritar",
      "youtube_warning_profile": "Os vídeos encontrados no YouTube podem não corresponder perfeitamente à nossa receita.",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Tenta carregar o idioma do localStorage ou usa 'en' como padrão
    lng: localStorage.getItem('i18nextLng') || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
