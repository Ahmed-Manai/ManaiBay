import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      welcome_to_manaibay: 'Welcome to ManaiBay',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      home: 'Home',
      shop: 'Shop',
      cart: 'Cart',
      account: 'Account',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      // ...add more keys as needed
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      welcome_to_manaibay: 'Bienvenue à ManaiBay',
      login: 'Connexion',
      register: 'S\'inscrire',
      logout: 'Déconnexion',
      email: 'E-mail',
      password: 'Mot de passe',
      home: 'Accueil',
      shop: 'Boutique',
      cart: 'Panier',
      account: 'Compte',
      contact: 'Contact',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      // ...add more keys as needed
    }
  },
  ar: {
    translation: {
      welcome: 'مرحبا',
      welcome_to_manaibay: 'مرحبا بكم في ManaiBay',
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      home: 'الرئيسية',
      shop: 'المتجر',
      cart: 'عربة التسوق',
      account: 'الحساب',
      contact: 'اتصل',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      // ...add more keys as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
