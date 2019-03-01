<template>
  <h2 class="crew">
    {{ user.profiles[0].supporter.crew.name }}
  </h2>
</template>

<script>
  export default {
    name: "Crew",
    props: {
      "user": {
        "type": Object,
        "required": true
      }
    }
  }
</script>

<style scoped lang="less">
  h2.crew {
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
  }
</style>
