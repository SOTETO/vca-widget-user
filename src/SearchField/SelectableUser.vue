<template>
  <button class="user" @click.prevent="commit" @focus="focus" @blur="blur">
    <Avatar v-bind:error-code="errorState" v-bind:user="userData" type="medium"></Avatar>
    <div class="infos">
      <div class="text">
        <span class="name">
          <span class="firstName">{{ userData.profiles[0].supporter.firstName }}</span>
          <span class="lastName">{{ userData.profiles[0].supporter.lastName }}</span>
        </span>
        <span class="crew">{{ crew }}</span>
      </div>
      <div class="roles">
        <VcARole v-for="role in roles" :name="role.role" :key="role.role" />
        <VcARole
          v-for="role in crewRoles"
          :role="role.name"
          :pillar="role.pillar.pillar"
          :key="role.name + '.' + role.crew.name + '.' + role.pillar.pillar"
        />
      </div>
    </div>
  </button>
</template>

<script>
  import axios from 'axios'
  import Avatar from '../Avatar'
  import VcARole from '../VcARole'

  export default {
    name: "SelectableUser",
    components: {
      "Avatar": Avatar,
      "VcARole": VcARole
    },
    props: {
      "user": {
        "type": Object,
        "required": false
      },
      "uuid": {
        "type": String,
        "required": false
      }
    },
    data () {
      return {
        errorState: null,
        userData: this.user,
        uuidData: this.uuid
      }
    },
    computed: {
      crew() {
        var res = this.$vcaI18n.t('fallback.noCrew')
        if(this.userData.profiles[0].supporter.hasOwnProperty("crew")) {
          res = this.userData.profiles[0].supporter.crew.name
        }
        return res
      },
      crewRoles: function () {
        var crew = this.userData.profiles[0].supporter.crew
        var res = null
        if((typeof crew !== "undefined") && crew !== null && crew.hasOwnProperty("name")) {
          var roles = this.userData.profiles[0].supporter.roles.filter(function (role) {
            var result = false
            if (role.hasOwnProperty("crew")) {
              result = role.crew.name === crew.name
            }
            return result
          })
          if (typeof roles !== "undefined" && roles !== null) {
            res = roles
          }
        }
        return res
      },
      roles () {
        return this.userData.roles.filter((r) => r.role !== 'supporter')
      }
    },
    created () {
      if (this.userData === null || typeof this.userData === "undefined") {
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
      commit () {
        this.$emit("vca-select-user", this.userData)
      },
      focus () {
        this.$emit("vca-option-focus", this.userData)
      },
      blur () {
        this.$emit("vca-option-blur", this.userData)
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/general.less';
  .user {
    width: 100%;
    margin: 0;
    .colorProfileSecundary();
    border: 0;

    &:hover, &:active, &:focus {
      .colorProfilePrimary();
      border: 0;
      outline: 0;
    }

    display: flex;
    flex-direction: row;
    justify-content: stretch;

    .infos {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: stretch;

      .text {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .name {
          font-size: 1.2em;
          font-weight: bold;
        }
      }
      .roles {
        width: 40%;
        /*& /deep/ .role:not(:first-child) {*/
        font-size: 0.8em;
      }
    }
  }
</style>
