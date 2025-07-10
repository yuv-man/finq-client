import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import App from './App.vue';
import router from './router';
//import './assets/styles.scss'; // SCSS styles

// Create Vue app instance
const app = createApp(App);

// Create Pinia store instance
const pinia = createPinia();

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

// Add global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue error:', err);
  console.error('Component instance:', instance);
  console.error('Error info:', info);
};

// Add global warning handler for development
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue warning:', msg);
    console.warn('Component trace:', trace);
  };
}

// Global properties (if needed)
app.config.globalProperties.$formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

app.config.globalProperties.$formatNumber = (num) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num?.toLocaleString() || '0';
};

app.config.globalProperties.$formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Use plugins
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

// Global directive for outside clicks (useful for dropdowns)
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
});

// Global directive for auto-focus
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

// Development tools
if (import.meta.env.DEV) {
  console.log('🚀 FINQ Investment Platform - Development Mode');
  console.log('📊 Vue DevTools should be available');
  console.log('🔧 API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
}

// Mount the app
app.mount('#app');

// Handle app-level errors
window.addEventListener('error', (event) => {
  console.error('Global JavaScript error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

export default app;