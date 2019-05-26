import Vue from 'vue'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import App from './App.vue'

Vue.use(VueI18n)

Vue.config.productionTip = false

const locale = navigator.language
const i18n = new VueI18n({
  locale: locale,
  messages: {
    'en-US': {}, // Object.assign(en, enElement),
    'de-DE': {}, // Object.assign(de, deElement),
    'de': {}, // Object.assign(de, deElement),
    'en': {} // Object.assign(en, enElement)
  }
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
