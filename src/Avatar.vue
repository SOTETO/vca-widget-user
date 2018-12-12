<template>

  <div v-if="error() && show() && errorCode === 404" :class="type" class="wrapper error">
    <div v-html="require('./images/question_mark.svg')"/>
  </div>
  <div v-else-if="error() && show()" :class="type" class="wrapper error">
    <div v-html="require('./images/exclamation_mark.svg')"/>
  </div>
  <div v-else-if="!has && show()" :class="type" class="wrapper">
    <div v-html="require('./images/default.svg')"/>
  </div>
  <div v-else-if="show()" class="wrapper">
    <img :src="getURL()" :class="type" :alt="user.profiles[0].supporter.fullName" />
  </div>
  <div v-else class="wrapper"></div>
</template>

<script>
    import axios from 'axios'
    export default {
      name: 'Avatar',
      props: ['user', 'type', 'errorCode'],
      data () {
        return {
          has: false
        }
      },
      created () {
        this.exists()
      },
      methods: {
        exists: function () {
          axios.get('/drops/webapp/avatar/has/me/' + this.user.id + '/' + 200 + '/' + 200)
            .then((response) => {
              if(response.status === 200) {
                this.has = true
              }
            })
            .catch(err => {
              switch(err.response.status) {
                case 404:
                  this.has = false
                  break;
              }
            })
        },
        error: function () {
          return this.errorCode !== null && (typeof this.errorCode !== 'undefined')
        },
        show: function () {
          return this.type !== 'small'
        },
        getURL: function () {
          console.log(this.user)
          return '/drops/webapp/avatar/get/me/' + this.user.id + '/' + 200 + '/' + 200
        }
      }
    }
</script>

<style scoped lang="less">
  @import "./assets/general.less";
  @import "./assets/responsive.less";

  @small-bg: "./images/avatar_bg_stripes_32x32.png";
  @medium-bg: "./images/avatar_bg_stripes_32x32.png";
  @large-bg: "./images/avatar_bg_200x162.png";

  #sizes() {
    small: 3em;
    medium: 4em;
    large: 10em;
  }

  .wrapper {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;

    &.small {
      background-image: url(@small-bg);
      width: #sizes[small];
      height: #sizes[small];
    }

    &.medium {
      background-image: url(@medium-bg);
      width: #sizes[medium];
      height: #sizes[medium];
    }

    &.large {
      background-image: url(@large-bg);
      width: #sizes[large];
      height: #sizes[large];

      @media @phone-down {
        width: 100%;
        height: auto;
      }
    }

    &.error {
      filter: grayscale(100%);
    }
  }

  .wrapper /deep/ svg #freak,
  .wrapper /deep/ svg #questionMark,
  .wrapper /deep/ svg #exclamationMark {
    fill: #colors[secundary];
  }

  .small /deep/ svg {
    height: #sizes[small] - 1;
  }

  img.small {
    width: #sizes[small];
    height: #sizes[small];
  }

  img.medium {
    width: #sizes[medium];
    height: #sizes[medium];
  }

  .large /deep/ svg {
    height: #sizes[large] - 1;
  }

  img.large {
    width: #sizes[large];
    height: #sizes[large];
  }

  .medium.error /deep/ svg {
    margin-top: #sizes[medium] * 0.125;
    height: #sizes[medium] * 0.75;;
  }

  .large.error /deep/ svg {
    margin-top:#sizes[large] * 0.2;
    height: #sizes[large] * 0.6;
  }

</style>
