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
  import FilterQuery from '../utils/FilterQuery'

  export default {
    name: "SearchField",
	props: {
	  "crewName": {
	     "type": String,
	     "default": null
	  },
	  "activeFlag": {
	     "type": String,
	     "default": null
	  }
	},
    components: { UserInput, SearchTagSet },
    data () {


      	var currentQuery = [];
     	var currentPointer = 0;

     	if (this.crewName !== null) {
     	    currentQuery.push(new FilterQuery.applyByCrew(this.crewName));
	    currentPointer++;
        }

        if (this.activeFlag !== null) {
            currentQuery.push(new FilterQuery.applyByActive(this.activeFlag));
	    currentPointer++;
     	}

      return {
        "currentQueries": currentQuery,
        "pointer": currentPointer
      }
    },
    created() {
	this.issueRequest();
    },
    watch: {
        crewName: function(value) {
            if (value !== null) {
		this.currentQueries.push(new FilterQuery.applyByCrew(value));
		this.pointer++;
                this.issueRequest();
            }
        },
        activeFlag: function(value) {
            if (value !== null) {
		this.currentQueries.push(new FilterQuery.applyByActive(value));
		this.pointer++;
                this.issueRequest();
            }
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
