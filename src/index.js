import WidgetUser from './WidgetUser.vue'
import WidgetUserList from './WidgetUserList.vue'
import WidgetUserAutocomplete from './WidgetUserAutocomplete.vue'
import VcARole from './VcARole.vue'
import Avatar from './Avatar.vue'
import Tag from './UserRepresentation/Tag.vue'
import CrewSelect from './CrewSelect'
import CrewPlainName from './CrewPlainName'
import VueI18n from 'vue-i18n'
import en from './lang/en.json'
import de from './lang/de.json'

function getLang(Vue, options) {

  function exists(options) {
    return (typeof options !== "undefined") && options.hasOwnProperty("i18n") && (typeof options.i18n !== "undefined") && options.i18n !== null
  }

  if(!exists(options)) {
    Vue.use(VueI18n)

    const i18n = new VueI18n({
      locale: 'de-DE',
      fallbackLocale: 'en-US',
      messages: {'en-US': en, 'de-DE': de}
    })

    Vue.prototype.$vcaI18n = i18n
  } else {
    options.i18n.mergeLocaleMessage('de-DE', de)
    options.i18n.mergeLocaleMessage('en-US', en)
    Vue.prototype.$vcaI18n = options.i18n
  }
  return Vue
}

VcARole.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.component('vca-role', VcARole)
}

Avatar.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.component('avatar', Avatar)
}

Tag.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.component('tag', Tag)
}

CrewSelect.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.component('crew-select', CrewSelect)
}

CrewPlainName.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.component('crew-plain-name', CrewPlainName)
}

WidgetUser.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.use(Avatar, options)

  if (options != null && typeof options === 'object' && options.hasOwnProperty('uuid')) {
    Vue.prototype.$widgetUserDefaultUUID = options.uuid
  } else {
    Vue.prototype.$widgetUserDefaultUUID = null
  }
  if (options != null && typeof options === 'object' && options.hasOwnProperty('type')) {
    Vue.prototype.$widgetUserDefaultType = options.type
  } else {
    Vue.prototype.$widgetUserDefaultType = null
  }
  Vue.component('widget-user', WidgetUser)
}

WidgetUserList.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.use(VcARole, options)
  Vue.use(WidgetUser, options)
  Vue.use(Avatar, options)
  Vue.component('widget-user-list', WidgetUserList)
}

WidgetUserAutocomplete.install = function (Vue, options) {
  Vue = getLang(Vue, options)
  Vue.use(VcARole, options)
  Vue.use(WidgetUser, options)
  Vue.use(Avatar, options)
  Vue.component('widget-user-autocomplete', WidgetUserAutocomplete)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CrewPlainName)
  window.Vue.use(CrewSelect)
  window.Vue.use(Tag)
  window.Vue.use(Avatar)
  window.Vue.use(VcARole)
  window.Vue.use(WidgetUser)
  window.Vue.use(WidgetUserList)
  window.Vue.user(WidgetUserAutocomplete)
}

export default WidgetUserList
const version = '__VERSION__'
// Export all components too
export {
  CrewPlainName,
  CrewSelect,
  Tag,
  Avatar,
  VcARole,
  WidgetUser,
  WidgetUserList,
  WidgetUserAutocomplete,
  version
}
