<template>
  <tr v-if="type === 'header'" :class="getClass()" class="rowWrapper">
    <th class="selection"><input type="checkbox" @change="selectAllUsers" class="custom-control-input" /></div></th>
    <th class="image">{{ $vcaI18n.t('label.table.avatar') }}</th>
    <th class="name">{{ $vcaI18n.t('label.table.name') }}</th>
    <th class="since">{{ $vcaI18n.t('label.table.since') }}</th>
    <th class="crew">{{ $vcaI18n.t('label.table.crew') }}</th>
    <th class="email noPhone">{{ $vcaI18n.t('label.table.email') }}</th>
    <th class="mobilePhone noPhone">{{ $vcaI18n.t('label.table.mobile') }}</th>
    <th class="age noPhone noTablet">{{ $vcaI18n.t('label.table.age') }}</th>
    <th class="gender noPhone noTablet">{{ $vcaI18n.t('label.table.gender') }}</th>
  </tr>
  <tr v-else :class="getClass()" class="rowWrapper content">
    <td class="selection">
      <input type="checkbox" v-on:click="selectUser" :checked="selected" class="custom-control-input"/>
    </td>
    <td class="image" v-on:click="callLink()">
      <Avatar v-bind:error-code="errorState" v-bind:user="user" type="medium"></Avatar>
    </td>
    <td class="name" v-on:click="callLink()">
      <a :href="getURL()" ref="profileLink">{{ user.profiles[0].supporter.fullName }}</a>
      <div class="roles">
        <VcARole v-for="role in user.roles.filter((r) => r.role !== 'supporter')" :name="role.role" :key="role.role" />
      </div>
    </td>
    <td class="since" v-on:click="callLink()">{{ getSince() }}</td>
    <td class="crew" v-on:click="callLink()">
      {{ hasCrew() ? user.profiles[0].supporter.crew.name : $vcaI18n.t('fallback.noCrew') }}
      <div class="roles">
        <VcARole
          v-for="role in getCrewRoles()"
          :role="role.name"
          :pillar="role.pillar.pillar"
          :key="role.name + '.' + role.crew.name + '.' + role.pillar.pillar"
        />
      </div>
    </td>
    <td class="email noPhone" v-on:click="callLink()">{{ user.profiles[0].email }}</td>
    <td class="mobilePhone noPhone" v-on:click="callLink()">{{ user.profiles[0].supporter.mobilePhone }}</td>
    <td class="age noPhone noTablet" v-on:click="callLink()">{{ getAge() }}</td>
    <td class="gender noPhone noTablet" v-on:click="callLink()">{{ getGender() }}</td>
  </tr>
</template>

<script>
    import Avatar from './Avatar'
    import VcARole from './VcARole'

    export default {
      name: 'TableRow',
      props: ['className', 'type', 'user', 'errorState', 'selected'],
      components: {
        'Avatar': Avatar,
        'VcARole': VcARole
      },
      methods: {
	selectUser: function() {
	  this.$root.$emit('doSelectUser', this.user.id);
	},
	selectAllUsers: function(event) {
	  if (event.target.checked) {
	    this.$root.$emit('doSelectAllUser');
	  } else {
	    this.$root.$emit('doUnSelectAllUser');
	  }

	},
        getClass: function () {
          return this.type + ' ' + this.className
        },
        hasCrew: function () {
          return this.user != null && typeof this.user !== 'undefined' &&
            this.user.profiles[0].supporter.hasOwnProperty('crew')
        },
        getGender: function() {
          var gender = this.user.profiles[0].supporter.sex
          var res = this.$vcaI18n.t('value.gender.undefined')
          if(typeof gender !== "undefined" && gender !== null && gender !== "") {
            res = this.$vcaI18n.t('value.gender.' + gender)
          }
          return res
        },
        getAge: function () {
          var age = this.calcAge()
          var res = this.$vcaI18n.t('value.age.notAvailable')
          if(age >= 0) {
            res = age
          }
          return res;
        },
        calcAge: function () {
          var birthday = this.user.profiles[0].supporter.birthday
          var res = -1
          if(typeof birthday !== "undefined" && birthday !== null) {
            var today = new Date()
            var birthDate = new Date(birthday)
            var age = today.getFullYear() - birthDate.getFullYear()
            var m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age = age - 1
            }
            res = age
          }
          return res
        },
        getSince: function () {
          var created = new Date(this.user.created)
          return created.getUTCFullYear()
        },
        getURL: function () {
          return '/arise/#/user/' + this.user.id
        },
        callLink: function () {
          this.$refs.profileLink.click()
        },
        getCrewRoles: function () {
          var crew = this.user.profiles[0].supporter.crew
          var res = null
          if((typeof crew !== "undefined") && crew !== null && crew.hasOwnProperty("name")) {
            var roles = this.user.profiles[0].supporter.roles.filter(function (role) {
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
        hasCrewRole: function () {
          return this.getCrewRoles() !== null
        }
      }
    }
</script>

<style scoped lang="less">
  @import "./assets/general.less";
  @import "./assets/responsive.less";

  @padding: 0.3em;

  .rowWrapper {
    height: 2em;
    padding: 1em 0;

    &.content {
      .colorProfileSecundary();
      cursor: pointer;
      text-align: center;

      &:hover {
        box-shadow: #shadow[secundary];
      }
    }

    &.odd {
      background-color: fadeout(#colors[primary], 80%);
    }

    th {
      .colorProfilePrimary();
      font-weight: bold;
    }
  }

  .roles {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    & /deep/ .role:not(:first-child) {
      margin-left: 0.2em;
    }
  }

  /*<!--.role {-->*/
    /*<!--.colorProfileThirdly();-->*/
    /*<!--padding: @padding;-->*/
    /*<!--font-size: 0.7em;-->*/
    /*<!--border-radius: 0.5em;-->*/
    /*<!--margin: 0.2em;-->*/
  /*<!--}-->*/

  .image {
    width: 4em;
  }

  .selection {
    width: 3em;
  }

  .noPhone {
    @media @small-tablet-down {
      display: none;
    }
  }

  .noTablet {
    @media @tablet-down {
      display: none;
    }
  }
</style>
