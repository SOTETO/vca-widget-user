<template>
  <div class="searchWrapper">
    <div class="searchInput">
      <UserInput
        @addFilter="add"
        @commitFilter="commitFilter"
        @popFilter="pop"
        @vca-input-focus="focus"
        @vca-input-blur="blur"
      />
    </div>
    <SearchTagSet :queries="currentQueries" @removeFilter="update" />
  </div>
</template>

<script>
  import UserInput from './UserInput'
  import SearchTagSet from './SearchTagSet'

  export default {
    name: "SearchField",
    props: ['query'],
    components: { UserInput, SearchTagSet },
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
      pop () {
        this.currentQueries.splice(this.pointer, 1)
        this.issueRequest()
      },
      commitFilter () {
        this.pointer = this.currentQueries.length
        this.issueRequest()
      },
      update (event) {
        this.currentQueries.splice(event.index, 1, event.query)
        if(event.query.isEmpty()) {
          this.currentQueries.splice(event.index, 1)
          this.pointer -= 1
        }
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
  .searchInput {
    .inputElement();
    padding: 0.25em;
    height: 2.75em;

    &.vca-focused {
      border-color: #409eff;
    }

    &:not(.vca-focused):hover {
      border-color: #c0c4cc
    }
  }
</style>
