<template>
    <span :class="['role', additionalClass ]">
        {{ getTitle() }}
    </span>
</template>

<script>
    export default {
      name: "VcARole",
      props: ['name', 'pillar', 'translated', 'additionalClass'],
      methods: {
          getTitle() {
            var title = ""
            if(typeof this.translated !== "undefined" && this.translated !== null && this.translated !== "") {
              title = this.translated
            } else if(typeof this.pillar !== "undefined" && this.pillar !== null && this.pillar !== "") {
              title = this.$vcaI18n.t('label.asp.' + this.pillar)
            } else {
              title = this.$vcaI18n.t('value.roles.' + this.name)
            }
            return title
          },
          getAdditionalClass() {
              return this.additionalClass
          }
      }
    }
</script>

<style scoped lang="less">
  @import "./assets/general.less";

  @padding: 0.3em;

  .role {
    .colorProfileThirdly();
    padding: @padding;
    font-size: 0.9em;
    border-radius: 0.5em;
    margin: 0.2em;
    display: inline-block;
  }

</style>
