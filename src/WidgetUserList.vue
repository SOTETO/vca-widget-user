<template>

  <div v-if="hasError()" class="user-widget-list error">
    <span v-if="errorState === 401">{{ $vcaI18n.t('error.notAuthenticated') }}</span>
    <span v-else-if="errorState === 403">{{ $vcaI18n.t('error.forbidden') }}</span>
    <span v-else>{{ $vcaI18n.t('error.unknown') }}</span>
  </div>
  <div v-else class="user-widget-list">
    <SearchField :activeFlag="activeFlag" :crewName="crewName" v-on:newQuery="setQuery" />

    <div class="vca-button-selections">
      <button v-if="config.hasActionButtons()" class="vca-button-margin vca-button-primary vca-button-selection" v-for="button in config.buttons" @click="emitClick(button.callback)">
        {{ button.label }}
      </button>
    </div>
    <ListMenu v-bind:type="type"
    v-bind:sorting="sorting"
    v-on:typeSelect="setType"
    v-on:sortDirSelect="setSortingDir"
    v-on:sortFieldSelect="setSortingField"
    v-if="config.hasMenue()"
    v-bind:config="config"
    />
    <button v-if="config.hasPagination() && page.hasPrevious()" v-on:click="removePage" class="paginate">
      {{ $vcaI18n.tc('label.pagination.button.previous', page.howManyPrevious(), { 'number': page.howManyPrevious() }) }}
    </button>
    <WidgetUsers v-if="type !== 'tableRow'" :users="users" :type="type" />
    <TableUsers v-else :users="users" :showOptions="config.hasActionButtons()" />
    <button v-if="config.hasPagination() && page.hasNext()" v-on:click="addPage" class="paginate">
      {{ $vcaI18n.tc('label.pagination.button.next', page.howManyNext(), { 'number': page.howManyNext() }) }}
    </button>
  </div>

</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import Config from './utils/Config'
  import Page from './utils/Page'
  import Sorting from './utils/Sorting'
  import ListMenu from './ListMenu'
  import TableUsers from './TableUsers'
  import WidgetUsers from './WidgetUsers'
  import SearchField from './SearchField/SearchField'
  import {
    Notification,
    Button
  } from 'element-ui'
  Vue.use(Notification);
  Vue.use(Button);
  Notification.closeAll();

  export default {
    name: 'WidgetUserList',
    props: ['options', 'activeFlag'],
    components: {
      'ListMenu': ListMenu,
      'TableUsers': TableUsers,
      'WidgetUsers': WidgetUsers,
      'SearchField': SearchField
    },
    data () {
      var config = new Config(this.options)
      var pageParams = config.getPage()

      return {
        config: config,
        type: config.getType(),
        users: [],
        page: Page.apply(0, pageParams.sliding, pageParams.size),
        sorting: new Sorting(config.getType(), this.$vcaI18n, config.getSortingInit()),
        query: { 'query': '', 'values': {} },
        selectedUsers: [],
        errorState: null,
        crewName: null
      }
    },
    created () {
      var lang = this.config.getLang()
      Vue.config.lang = lang
      this.$vcaI18n.locale = lang
      this.sorting = new Sorting(this.config.getType(), this.$vcaI18n, this.config.getSortingInit())
      axios.get('/drops/webapp/identity').then((response) => {
        if (response.status === 200) {
          // Check if admin or employee, then show full list of active requested users
          var userRoles = response.data.additional_information.roles.map((role) => role.role)
          if (!userRoles.includes('employee') && !userRoles.includes('admin')) {
            this.crewName = response.data.additional_information.profiles[0].supporter.crew.name;
          } else {
            this.getCount()
            this.getPage()
          }
        }
      })
    },
    mounted() {
      this.$root.$on('setSelectedUsers', (userList) => { this.setSelectedUsers(userList); })
    },
    methods: {
      emitClick(callback) {
        this.$emit(callback, { 'callback': callback, 'users': this.selectedUsers })
      },
      submit(url, data) {
        axios
       .post(url, data)
       .then(response => {
        switch (response.status) {
         case 200:
         this.open(
           this.$t('success.title'),
           this.$t('success.msg'),
           "success"
           )
         window.location.reload();
         break;
       }
     }).catch(error => {
       this.selection = this.default
       this.open(
        this.$t('error.title'),
        this.$t('error.unknown'),
        "error"
        )
     })
   },
   setSelectedUsers: function (userList) {
     this.selectedUsers = userList;
   },
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
      'sort': this.sorting.toJSONRequest(),
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
      if (!axios.isCancel(error)) {
        this.errorState = error.response.status
      }
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
        this.page = Page.apply(response.data.additional_information.count, this.config.getPage().sliding, this.config.getPage().size)
        break
      }
    }).catch(error => {
      this.errorState = error.response.status
    })
  },
  setType: function (event) {
    this.type = event
    this.sorting.setType(this.type)
  },
  setSortingDir: function (event) {
    this.sorting.setDir(event)
    this.getPage()
  },
  setSortingField: function (event) {
    this.sorting.setField(event)
    this.getPage()
  },
  setQuery: function(event) {
    if(event.state === "success") {
      this.query = event
      this.getCount()
      this.getPage()
    }
  },
  hasError () {
    return this.errorState !== null && (typeof this.errorState !== 'undefined')
  },
  open(title, message, type) {
    Notification({
      title:  title,
      message: message,
      type: type
    });
  }
}
}
</script>

<style scoped lang="less">
  @import './assets/general.less';

  .user-widget-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: 1em;

    &.error {
      align-items: center;
      text-align: center;

      span {
        .colorProfileThirdly();
        width: 30em;
        border-radius: @radius;
        height: 2em;
        box-shadow: #shadow[primary];
        line-height: 2em;
      }
    }

    & /deep/ a {
      text-decoration: none;
      color: #colors[primary];
    }
  }

  .vca-button-selections {
   margin-top: 0.5em;
 }

 .vca-button-selection {
   width: 200px;
 }

 .vca-button-margin {
  margin-right: 5px;
}

.paginate {
  height: 2.5em;
  .inputElement();
  cursor: pointer;
  background: none;
}
</style>
