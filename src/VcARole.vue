<template>
    <span class="role">
        {{ $vcaI18n.t('value.roles.' + name) }}
    </span>
</template>

<script>
    export default {
        name: "VcARole",
        props: ['name']
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
  }

</style>
