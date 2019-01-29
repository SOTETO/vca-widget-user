<template>
  <div class="user-role-wrapper" :class="rolesExist() ? type + ' roles' : type + ' noRoles'">
    <div v-if="this.empty()" :class="type" class="card user">
      <Avatar v-bind:error-code="errorState" v-bind:user="userData" v-bind:type="type"></Avatar>
      <InfoField v-bind:error-code="errorState" v-bind:user="userData" v-bind:type="type"></InfoField>
    </div>
    <a v-else :class="classes" class="card user" v-bind:href="getURL()">
      <Avatar v-bind:error-code="errorState" v-bind:user="userData" v-bind:type="type"></Avatar>
      <InfoField v-bind:error-code="errorState" v-bind:user="userData" v-bind:type="type"></InfoField>
      <button class="remove" v-if="type === 'small' && removable" @click.stop.prevent="remove">X</button>
    </a>
    <span v-if="type !== 'small'" class="roles" :class="rolesExist() ? 'exists' : 'empty'">
      {{ getRoles().map((role) => $vcaI18n.t('value.roles.' + role.role)).join(", ") }}
    </span>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import Avatar from './Avatar'
  import InfoField from './InfoField'

  Vue.use(Avatar)
  Vue.use(InfoField)
  // Vue.use(axios);

  export default {
    name: 'UserWidget',
    props: {
      "uuid": {
        "type": String,
        "required": false
      },
      "type": {
        "type": String,
        "required": true
      },
      "user": {
        "type": Object,
        "required": false
      },
      "removable": {
        "type": Boolean,
        "default": false
      }
    },
    components: {
      'Avatar': Avatar,
      'InfoField': InfoField
    },
    data () {
      return {
        errorState: null,
        userData: this.user,
        uuidData: this.uuid// ,
        // typeData: null
      }
    },
    computed: {
      classes () {
        var classes = this.type
        if(this.removable) {
          classes += " removable"
        }
        return classes
      }
    },
    created () {
      // Todo: Should be part of some external wrapper solution!
      // if (this.uuidData == null) {
      //   this.uuidData = Vue.$widgetUserDefaultUUID
      // }
      // if (this.typeData == null) {
      //   this.typeData = Vue.$widgetUserDefaultType
      // }
      if (this.userData == null) {
        axios.get('/drops/widgets/user/' + this.uuidData)
          .then(response => {
            switch (response.status) {
              case 200:
                this.userData = response.data.additional_information
                break
            }
          }).catch(error => {
            this.errorState = error.response.status
          })
      }
    },
    methods: {
      empty: function () {
        return this.userData == null || typeof this.userData === 'undefined'
      },
      getURL: function () {
        var result = ''
        if (!this.empty()) {
          result = '/arise/#/user/' + this.userData.id
        }
        return result
      },
      getRoles: function () {
        return this.userData.roles.filter((role) => role.role !== "supporter")
      },
      rolesExist: function () {
        return this.getRoles().length > 0
      },
      remove () {
        this.$emit('vca-user-remove', this.userData)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./assets/general.less";
  @import "./assets/responsive.less";

  #sizes() {
    removable: 1em;
    small: 6em;
    medium: 15em;
    large: 10em;
  }

  #heights() {
    small: 2.5em;
  }

  .user-role-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .card {
      line-height: 1em;
    }

    .roles {
      line-height: 1.2em;
      font-size: 0.9em;
      text-align: center;

      &.exists {
        background-color: #colors[thirdly];
        color: #colors[secundary];
      }
    }
    &.medium {
      @media @phone-down {
        width: 100%;
      }
    }
    &.medium.roles, &.large.roles {
      .button();
    }

    &.noRoles {
      .card.medium, .card.large {
        .button();
      }
    }
    & /deep/ a {
      text-decoration: none;
      color: #colors[primary];
    }
  }

  .card {
    display: flex;

    &.small {
      .colorProfileThirdly();
      width: #sizes[small];
      height: #heights[small];
      border-radius: @radius;
      padding: 0.2em 0.5em;
      justify-content: center;

      &.removable {
        padding: 0 0 0 0.5em;
        width: #sizes[small] + #sizes[removable];
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      &:hover {
        background-color: #colors[thirdlyHover];
      }
    }

    &.medium {
      text-align: center;
      width: #sizes[medium];
      flex-direction: row;

      @media @phone-down {
        width: 100%;
      }

      .user-infos {
        flex-grow: 1;
      }
    }

    &.large {
      text-align: center;
      flex-direction: column;
      width: #sizes[large];
    }
  }

  .remove {
    width: 20%;
    background-color: #colors[warn-inactive];
    border: 0;
    /*border-width: 1px;
    border-style: solid;
    border-color: #colors[secundary];*/
    border-radius: 0 @radius @radius 0;
    padding: 0.2em 0.2em;

    &:hover {
      /*font-weight: bold;*/
      background-color: #colors[warn];
    }
  }
</style>
