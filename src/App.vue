<template>
  <div id="app">
    <h1>Testing grounds for the vca-user-widget</h1>
    <WidgetUserAutocomplete
      :placeholder="widgetPlaceholder"
      :preselection="involvedSupporter"
      :SelectableUser="recipients"
      @vca-user-selection="onUserSelected"
    />
  </div>
</template>

<script>
import WidgetUserAutocomplete from "./WidgetUserAutocomplete.vue"

export default {
  name: 'app',
  components: {
    WidgetUserAutocomplete
  },
  data() {
    return {
      recipients: null,
      widgetPlaceholder: "",
      involvedSupporter: [],
      autocompletePlaceholder: "asdasd"
    }
  },
  methods: {
    onUserSelected() {
      alert('user selected')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
