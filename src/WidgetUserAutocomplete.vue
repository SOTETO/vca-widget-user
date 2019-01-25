<template>
  <div v-if="hasError" class="user-widget-list error">
    <span v-if="errorState === 401">{{ $vcaI18n.t('error.notAuthenticated') }}</span>
    <span v-else-if="errorState === 403">{{ $vcaI18n.t('error.forbidden') }}</span>
    <span v-else>{{ $vcaI18n.t('error.unknown') }}</span>
  </div>
  <div v-else class="user-widget-autocomplete">
    <SearchField v-bind:query="query" v-on:newQuery="setQuery" />
    <div v-if="hasUser" class="user-widget-options">
      <button v-if="page.hasPrevious()" v-on:click="removePage" class="paginate">
        {{ $vcaI18n.tc('label.pagination.button.previous', page.howManyPrevious(), { 'number': page.howManyPrevious() }) }}
      </button>
      <WidgetUsers :users="users" :type="type" />
      <button v-if="page.hasNext()" v-on:click="addPage" class="paginate">
        {{ $vcaI18n.tc('label.pagination.button.next', page.howManyNext(), { 'number': page.howManyNext() }) }}
      </button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Page from './utils/Page'
  import WidgetUsers from './WidgetUsers'
  import SearchField from './SearchField/SearchField'

    export default {
      name: "WidgetUserAutocomplete",
      components: {
        'WidgetUsers': WidgetUsers,
        'SearchField': SearchField
      },
      data () {
        var config = {
          "page": {
            "sliding": 20,
            "page": 40
          }
        }

        return {
          "users": [],
          "query": { 'query': '', 'values': {} },
          "config": config,
          "page": Page.apply(0, config.page.sliding, config.page.size),
          "errorState": null,
          "type": "small"
        }
      },
      computed: {
        hasError () {
          return this.errorState !== null && (typeof this.errorState !== 'undefined')
        },
        hasUser () {
          return this.users.length !== 0
        }
      },
      created () {
        this.getCount()
        this.getPage()
      },
      methods: {
        addPage: function (event) {
          if (this.page.hasNext()) {
            this.page = this.page.next()
            this.getPage()
          }
        },
        removePage: function (event) {
          if (this.page.hasPrevious()) {
            this.page = this.page.previous()
            this.getPage()
          }
        },
        getPage: function () {
          var request = {
            'values': this.query.values,
            'limit': this.page.getSize(),
            'offset': this.page.getOffset()
          }
          if(this.query.query !== null && (typeof this.query.query !== "undefined") && this.query.query !== "") {
            request['query'] = this.query.query
          }
          axios.post('/drops/widgets/users', request)
            .then(response => {
              switch (response.status) {
                case 200:
                  this.users = response.data.additional_information
                  break
                }
            }).catch(error => {
                this.errorState = error.response.status
            })
        },
        getCount: function() {
          var request = {
            'values': this.query.values
          }
          if(this.query.query !== null && (typeof this.query.query !== "undefined") && this.query.query !== "") {
            request['query'] = this.query.query
          }
          axios.post('/drops/widgets/users/count', request)
            .then(response => {
              switch (response.status) {
                case 200:
                  this.page = Page.apply(response.data.additional_information.count, this.config.page.sliding, this.config.page.size)
                  break
                }
            }).catch(error => {
                this.errorState = error.response.status
            })
        },
        setQuery: function(event) {
          if(event.state === "success") {
            this.query = event
            this.getCount()
            this.getPage()
          }
        }
      }
    }
</script>

<style scoped lang="less">

  .user-widget-autocomplete {
    position: relative;
    display: inline-block;
  }

  .user-widget-options {
    position: absolute;
    min-width: 10em;
    z-index: 1;
  }

</style>
