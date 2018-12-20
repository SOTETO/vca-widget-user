<template>
  <div v-if="error() && errorCode === 404" class="user-infos" :class="type">
    <span class="error">{{ $vcaI18n.t('error.notFound') }}</span>
  </div>
  <div v-else-if="error() && errorCode === 401" class="user-infos" :class="type">
    <span class="error">{{ $vcaI18n.t('error.notAuthenticated') }}</span>
  </div>
  <div v-else-if="error() && errorCode === 403" class="user-infos" :class="type">
    <span class="error">{{ $vcaI18n.t('error.forbidden') }}</span>
  </div>
  <div v-else-if="defined()" class="user-infos" :class="type">
    <h2 class="name">
      <span class="firstName">{{ user.profiles[0].supporter.firstName }}</span>
      <span class="lastName">{{ user.profiles[0].supporter.lastName }}</span>
    </h2>
    <div class="details">
      <div class="personal details-column">
        <span v-if="type !== 'small'" class="age">{{ $vcaI18n.t('label.age') + $vcaI18n.t('label.separator') + getAge() }}</span>
        <div v-if="type !== 'small'" class="contact">
          <!--<span v-if="user.profiles[0].hasOwnProperty('email')" class="typcn typcn-mail"></span>-->
          <!--<span v-if="user.profiles[0].supporter.hasOwnProperty('mobilePhone') && user.profiles[0].supporter.mobilePhone !== null" class="typcn typcn-phone"></span>-->
          <div v-if="user.profiles[0].hasOwnProperty('email')" v-html="require('./images/mail.svg')" />
          <div v-if="user.profiles[0].supporter.hasOwnProperty('mobilePhone') && user.profiles[0].supporter.mobilePhone !== null" v-html="require('./images/phone.svg')" />
        </div>
      </div>
      <div class="vca details-column">
        <span v-if="type !== 'small'" class="since">{{ $vcaI18n.t('label.since') + $vcaI18n.t('label.separator') + getSince() }}</span>
        <span v-if="type !== 'small' && showCrew()" class="crew" :class="hasCrewRole() ? 'asp' : ''">
          <span>{{ getCrew() }}</span>
        </span>
        <span v-else-if="type !== 'small'" class="crew">{{ $vcaI18n.t('fallback.noCrew') }}</span>
      </div>
    </div>
  </div>
  <div v-else class="user-infos" :class="type">
    <span class="error">{{ $vcaI18n.t("error.unknown") }}</span>
  </div>
</template>

<script>
  export default {
    name: 'InfoField',
    props: ['type', 'user', 'errorCode'],
    methods: {
      empty: function () {
        return this.user == null || typeof this.user === 'undefined'
      },
      defined: function () {
        return !this.empty()
      },
      showCrew: function () {
        return this.defined() && this.user != null && typeof this.user !== 'undefined' &&
              this.user.profiles[0].supporter.hasOwnProperty('crew')
      },
      error: function () {
        return this.errorCode !== null
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
      getCrew: function () {
        var crew = this.user.profiles[0].supporter.crew
        var role = this.getCrewRole()
        var res = crew.name
        if(role !== null) {
          res = this.$vcaI18n.t('label.aspOfCrew', { 'crewName': res })
        }
        return res;
      },
      getCrewRole: function () {
        var crew = this.user.profiles[0].supporter.crew
        var res = null
        if((typeof crew !== "undefined") && crew !== null && crew.hasOwnProperty("name")) {
          var role = this.user.profiles[0].supporter.roles.find(function (role) {
            var result = false
            if (role.hasOwnProperty("crew")) {
              result = role.crew.name === crew.name
            }
            return result
          })
          if (typeof role !== "undefined" && role !== null) {
            res = role
          }
        }
        return res
      },
      hasCrewRole: function () {
        return this.getCrewRole() !== null
      }
    }
  }
</script>

<style scoped lang="less">
  @import "./assets/general.less";

  @padding: 0.3em;

  #fontSizes() {
    small: 0.8em;
    medium: 0.9em;
    large: 1.2em;
    details: 0.8em;
  }

  h2.name {
    margin: 0;
  }

  span.error {
    color: grey;
  }

  .small {
    font-style: italic;

    h2.name {
      font-size: #fontSizes[small];
      text-align: center;
    }

    span.error {
      font-size: #fontSizes[small];
    }
  }

  .medium {
    h2.name {
      font-size: #fontSizes[medium];
      font-weight: bold;

      .lastName {
        font-size: #fontSizes[medium] * 0.8;
      }
    }

    span.error {
      font-size: #fontSizes[medium];
    }
  }

  .large {
    h2.name {
      font-size: #fontSizes[large];
      font-weight: bolder;

      .lastName {
        font-size: #fontSizes[large] * 0.7;
      }
    }

    span.error {
      font-size: #fontSizes[large];
    }
  }

  .details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .details-column {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      span {
        font-style: italic;
        font-size: #fontSizes[details];
        padding: 0.1em;
      }

      &.vca span {
        padding-right: @padding;
      }

      .crew {

        span {
          font-size: 1em;
        }

        &.asp {
          .colorProfileThirdly();
          // background: linear-gradient(-60deg, #colors[thirdly] 30%, #colors[secundary] 70%);
          padding-right: 0;
          border-radius: 0.4em 0em 0em 0.4em;
          span {
            padding-right: @padding;
          }
        }
      }
    }

    .personal {
      text-align: left;

      .contact {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: #fontSizes[details];
        padding: 0.1em;

        div {
          height: #fontSizes[details];
          width: #fontSizes[details];
          &:not(:first-child) {
            margin-left: #fontSizes[details] * 0.5;
          }
        }

        div /deep/ svg #icon {
          fill: #colors[primary];
        }
      }
    }

    .vca {
      text-align: right;
    }
  }

  .user-infos {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.large {
      margin-top: @padding;
      /*height: (3* @padding) + #fontSizes[large] + (#fontSizes[details] * 2);*/
      padding-bottom: @padding;
    }

    &.large .details, &.medium .details {
      padding-top: @padding;
      padding-left: @padding;
      padding-bottom: @padding;
    }
  }
</style>
