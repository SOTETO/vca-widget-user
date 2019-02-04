<template>
  <h2 class="name">
    <span class="firstName">{{ user.profiles[0].supporter.firstName }}</span>
    <span class="lastName">{{ user.profiles[0].supporter.lastName }}</span>
  </h2>
</template>

<script>
    export default {
      name: "UserName",
      props: {
          "user": {
            "type": Object,
            "required": true
          }
      }
    }
</script>

<style scoped lang="less">
  h2.name {
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;

    .firstName {
      margin-right: 0.5em;
    }
  }
</style>
