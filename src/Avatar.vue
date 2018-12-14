<template>

  <div v-if="error() && show() && errorCode === 404" :class="type" class="wrapper error">
    <div v-html="require('./images/question_mark.svg')"/>
  </div>
  <div v-else-if="error() && show()" :class="type" class="wrapper error">
    <div v-html="require('./images/exclamation_mark.svg')"/>
  </div>
  <div v-else-if="!hasImage() && show()" :class="type" class="wrapper">
    <div v-html="require('./images/default.svg')"/>
  </div>
  <div v-else-if="hasImage() && show()" class="wrapper">
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
        var imageSize = 200
        if(this.type === "profile") {
          imageSize = 400
        }
        return {
          has: false,
          imageSize: imageSize
        }
      },
      created () {
        this.exists()
      },
      methods: {
        exists: function () {
          axios.get('/drops/webapp/avatar/has/me/' + this.user.id + '/' + this.imageSize + '/' + this.imageSize)
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
        hasImage() {
          return this.has
        },
        show: function () {
          return this.type !== 'small'
        },
        getURL: function () {
          return '/drops/webapp/avatar/get/me/' + this.user.id + '/' + this.imageSize + '/' + this.imageSize
        }
      }
    }
</script>
a
<style scoped lang="less">
  @import "./assets/general.less";
  @import "./assets/responsive.less";

  @small-bg: "./images/avatar_bg_stripes_32x32.png";
  @medium-bg: "./images/avatar_bg_stripes_32x32.png";
  @large-bg: "./images/avatar_bg_200x162.png";
  @profile-bg: "./images/avatar_bg_400x324.png";

  #sizes() {
    small: 3em;
    medium: 4em;
    large: 10em;
    profile: 20em;
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

    &.profile {
      background-image: url(@profile-bg);
      width: #sizes[profile];
      height: #sizes[profile];

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

  .profile /deep/ svg {
    height: #sizes[profile] - 1;
  }

  img.profile {
    width: #sizes[profile];
    height: #sizes[profile];
  }

  .medium.error /deep/ svg {
    margin-top: #sizes[medium] * 0.125;
    height: #sizes[medium] * 0.75;;
  }

  .large.error /deep/ svg {
    margin-top:#sizes[large] * 0.2;
    height: #sizes[large] * 0.6;
  }

  .profile.error /deep/ svg {
    margin-top:#sizes[profile] * 0.2;
    height: #sizes[profile] * 0.6;
  }

</style>
