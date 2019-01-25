<template>
  <div class="search">
    <input v-bind:value="keyword" :placeholder="$vcaI18n.t('label.placeholder.search')"
           v-on:input="input" v-on:keyup.enter.prevent="clear" v-on:keyup.space.prevent="clear" />
    <button @click="clear" :title="$vcaI18n.t('label.search.button.and')">
      <div v-html="require('../images/plus.svg')" />
    </button>
  </div>
</template>

<script>
  import FilterQuery from '../utils/FilterQuery'

    export default {
      name: "UserInput",
      data () {
          return {
            "keyword": ""
          }
      },
      methods: {
        input: function (event) {
          var keyword = event.target.value.trim()
          if(keyword !== "" && keyword !== this.keyword) {
            this.keyword = keyword
            this.$emit("addFilter", FilterQuery.apply(this.keyword))
          } else if(keyword === "" && keyword !== this.keyword) {
            this.keyword = ""
            this.$emit("popFilter")
          }
        },
        clear () {
          this.keyword = ""
          this.$emit("commitFilter")
        }
      }
    }
</script>

<style scoped lang="less">
  @import '../assets/general.less';

  .search {
    display: flex;
    flex-direction: row;

    input {
      flex-grow: 1;
      .inputElement();
      padding: 0 0.25em;
    }

    button {
      .svgButton()
    }
  }
</style>
