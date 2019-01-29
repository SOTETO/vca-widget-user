<template>
  <div v-if="hasError" class="user-widget-list error">
    <span v-if="errorState === 401">{{ $vcaI18n.t('error.notAuthenticated') }}</span>
    <span v-else-if="errorState === 403">{{ $vcaI18n.t('error.forbidden') }}</span>
    <span v-else>{{ $vcaI18n.t('error.unknown') }}</span>
  </div>
  <div v-else class="user-widget-autocomplete">
    <Autocomplete v-on:newQuery="setQuery" :selected="selected" @vca-user-remove="remove" />
    <div v-if="hasUser" class="user-widget-options visible">
      <button v-if="page.hasPrevious()" v-on:click="removePage" class="paginate">
        {{ $vcaI18n.tc('label.pagination.button.previous', page.howManyPrevious(), { 'number': page.howManyPrevious() }) }}
      </button>
      <ul class="users">
        <li v-for="user in users" :key="user.id">
          <SelectableUser :user="user" @vca-select-user="select" />
        </li>
      </ul>
      <button v-if="page.hasNext()" v-on:click="addPage" class="paginate">
        {{ $vcaI18n.tc('label.pagination.button.next', page.howManyNext(), { 'number': page.howManyNext() }) }}
      </button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Page from './utils/Page'
  import SelectableUser from './SearchField/SelectableUser'
  import Autocomplete from './SearchField/Autocomplete'

    export default {
      name: "WidgetUserAutocomplete",
      components: {
        'SelectableUser': SelectableUser,
        'Autocomplete': Autocomplete
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
          "selected": [],
          "query": { 'query': '', 'values': {} },
          "config": config,
          "page": Page.apply(0, config.page.sliding, config.page.size),
          "errorState": null,
          "type": "medium"
        }
      },
      computed: {
        hasError () {
          return this.errorState !== null && (typeof this.errorState !== 'undefined')
        },
        hasUser () {
          return this.users.length !== 0
        },
        emptyQuery () {
          return this.query.query === ""
        }
      },
      created () {
        // this.getCount()
        // this.getPage()
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
          if(!this.emptyQuery) {
            var request = {
              'values': this.query.values,
              'limit': this.page.getSize(),
              'offset': this.page.getOffset()
            }
            if (this.query.query !== null && (typeof this.query.query !== "undefined") && this.query.query !== "") {
              request['query'] = this.query.query
            }
            axios.post('/drops/widgets/users', request)
              .then(response => {
                switch(response.status) {
                  case 200:
                    this.users = response.data.additional_information.filter(user =>
                      // check if there is no already selected user inside the user set
                      !this.selected.some(selection => selection.id === user.id)
                    )
                    break
                }
            }).catch(error => {
              this.errorState = error.response.status
            })
          } else {
            this.users = []
          }
        },
        getCount: function() {
          if(!this.emptyQuery) {
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
                    var countSelection = this.selected.length
                    this.page = Page.apply(
                      response.data.additional_information.count - countSelection,
                      this.config.page.sliding,
                      this.config.page.size
                    )
                    break
                  }
              }).catch(error => {
                  this.errorState = error.response.status
              })
          } else {
            this.page = Page.apply(0, this.config.page.sliding, this.config.page.size)
          }
        },
        setQuery: function(event) {
          if(event.state === "success") {
            this.query = event
            this.getCount()
            this.getPage()
          }
        },
        select(user) {
          this.selected.push(user)
          this.getCount()
          this.getPage()
        },
        remove(user) {
          this.selected = this.selected.filter(u => u.id !== user.id)
          this.getCount()
          this.getPage()
        }
      }
    }
</script>

<style scoped lang="less">
  @import './assets/general.less';

  .user-widget-autocomplete {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .user-widget-options {
    position: absolute;
    width: 100%;
    z-index: 1100;
    background-color: #fff;
    border: 1px solid #dcdfe6;

    &.visible {
      display: block;
    }
  }

  .users {
    list-style: none;
    padding: 0;
  }

  .paginate {
    height: 2.5em;
    .inputElement();
    cursor: pointer;
    background: none;
  }
</style>
