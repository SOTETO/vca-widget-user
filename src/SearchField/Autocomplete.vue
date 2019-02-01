<template>
  <div class="autocomplete" ref="autocomplete">
    <div class="selected">
      <WidgetUser v-for="user in selected" :user="user" type="small" :key="user.id" :removable="true" @vca-user-remove="remove" @vca-user-focus="focus" @vca-user-blur="blur" />
    </div>
    <UserInput :complexQueries="false" @addFilter="add" @popFilter="pop" @vca-input-focus="focus" @vca-input-blur="blur" :focused="focused" />
  </div>
</template>

<script>
  import UserInput from './UserInput'
  import WidgetUser from '../WidgetUser'

  export default {
    name: "Autocomplete",
    components: { UserInput, WidgetUser },
    props: {
      "selected": {
        "type": Array,
        "default": []
      },
      "focused": {
        "type": Boolean,
        "default": false
      }
    },
    data () {
      return {
        "currentQueries": [],
        "pointer": 0
      }
    },
    methods: {
      add: function (query) {
        this.currentQueries.splice(this.pointer, 1, query)
        this.issueRequest()
      },
      pop() {
        this.currentQueries.splice(this.pointer, 1)
        this.issueRequest()
      },
      issueRequest () {
        var queries = this.currentQueries.slice(0)
        if(queries.length > 0) {
          var query = queries.pop()
          query = queries.reduce((acc, current) => acc.and(current), query)

          var res = {'state': 'error'}
          if (typeof query !== "undefined") {
            res = query.getQuery()
            res['state'] = query.status
          }
          this.$emit('newQuery', res)
        } else {
          this.$emit('newQuery', {
            'state': 'success',
            'query': "",
            'values': {}
          })
        }
      },
      remove(user) {
        this.$emit('vca-user-remove', user)
      },
      focus () {
        this.$emit('vca-autocomplete-focus')
        this.$refs.autocomplete.classList.add("vca-focused")
      },
      blur() {
        this.$emit('vca-autocomplete-blur')
        this.$refs.autocomplete.classList.remove("vca-focused")
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/general.less';
  .autocomplete {
    display: flex;
    flex-direction: row;
    align-items: center;
    .inputElement();
    padding: 0 0.25em;
    height: 2.5em;

    &.vca-focused {
      border-color: #409eff;
    }

    &:not(.vca-focused):hover {
      border-color: #c0c4cc
    }

    & /deep/ .search {
      flex-grow: 1;
    }

    .selected {
      display: flex;
      flex-direction: row;
      & /deep/ .user-role-wrapper {
        .card {
          font-size: 1em;
        }
        &:not(:first-child) {
          margin-left: 0.2em;
        }
      }
    }
  }

</style>
