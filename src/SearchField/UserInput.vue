<template>
  <div class="search">
    <input v-bind:value="keyword" :placeholder="placeholderString" ref="search"
           v-on:input="input" v-on:keyup.enter.prevent="clear" v-on:keyup.space.prevent="clear" @focus="focus" @blur="blur"/>
    <button v-if="complexQueries" @click="clear" :title="$vcaI18n.t('label.search.button.and')">
      <div v-html="require('../images/plus.svg')" />
    </button>
  </div>
</template>

<script>
  import FilterQuery from '../utils/FilterQuery'
  import WidgetUsers from '../WidgetUsers'

    export default {
      name: "UserInput",
      components: {
        "WidgetUsers": WidgetUsers
      },
      props: {
        "complexQueries": {
          "type": Boolean,
          "default": true
        },
        "focused": {
          "type": Boolean,
          "default": false
        },
        "placeholder": {
          "type": String,
          "required": false
        }
      },
      data () {
        return {
          "keyword": ""
        }
      },
      computed: {
        placeholderString () {
          var placeholderData = this.$vcaI18n.t('label.placeholder.search')
          if(typeof this.placeholder === "string" && this.placeholder !== null) {
            placeholderData = this.placeholder
          }
          return placeholderData
        }
      },
      mounted(){
        if(this.focused) {
          this.$refs.search.focus();
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
          if(this.complexQueries) {
            this.keyword = ""
            this.$emit("commitFilter")
          }
        },
        focus () {
          this.$emit("vca-input-focus")
        },
        blur () {
          this.$emit("vca-input-blur")
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
      //.inputElement();
      background-color: transparent;
      border: 0;
      padding: 0 0.25em;
      &:active, &:focus {
        border: 0;
        outline: 0;
      }
    }

    button {
      .svgButton()
    }
  }
</style>
