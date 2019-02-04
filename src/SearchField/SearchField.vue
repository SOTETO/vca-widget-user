<template>
  <div class="searchWrapper">
    <UserInput @addFilter="add" @commitFilter="commitFilter" @popFilter="pop" />
    <SearchTagSet :queries="currentQueries" @removeFilter="update" />
  </div>
</template>

<script>
  import UserInput from './UserInput'
  import SearchTagSet from './SearchTagSet'

  export default {
    name: "SearchField",
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
      }
    }
  }
</script>

<style scoped>

</style>
