import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "./index.css"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount("#app")

// Inicializar sesión en segundo plano — no bloquea el montaje
import { useAuthStore } from "./stores/auth"
useAuthStore().initSession()
