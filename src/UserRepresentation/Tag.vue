<template>
    <a class="tag" :class="classes" v-bind:href="url()" @focus="focus" @blur="blur">
      <UserName :user="userData" />
      <button class="remove" v-if="removable" @click.stop.prevent="remove" @focus="focus" @blur="blur">X</button>
    </a>
</template>

<script>
  import axios from 'axios'
  import UserName from './UserName'

  export default {
    name: "Tag",
    components: { UserName },
    props: {
      "uuid": {
        "type": String,
        "required": false
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
    computed: {
      classes () {
        var classes = ""
        if(this.removable) {
          classes = "removable"
        }
      }
    },
    data () {
      return {
        "userData": this.user,
        "errorState": null
      }
    },
    created () {
      if (this.userData == null) {
        axios.get('/drops/widgets/user/' + this.uuid)
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
      url () {
        return '/arise/#/user/' + this.userData.id
      },
      remove () {
        this.$emit('vca-user-remove', this.user)
      },
      focus () {
        this.$emit('vca-user-focus', this.user)
      },
      blur () {
        this.$emit('vca-user-blur', this.user)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/general.less";

  #sizes() {
    removable: 1em;
    small: 6em;
  }

  #heights() {
    small: 2em;
  }

  .tag {
    display: flex;
    .colorProfileThirdly();
    min-width: #sizes[small];
    height: #heights[small];
    border-radius: @radius;
    padding: 0 0 0 0.2em;
    justify-content: space-between;
    line-height: 1.2em;
    font-size: 1em;
    text-decoration: none;

    & /deep/ h2 {
      font-size: 0.8em;
      text-align: center;
      padding: 0.1em;
    }

    &.removable {
      padding: 0 0 0 0.5em;
      margin-left: 0.2em;
      min-width: #sizes[small] + #sizes[removable];
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    &:hover {
      background-color: #colors[thirdlyHover];
    }
  }

  .remove {
    width: #sizes[removable];
    background-color: #colors[warn-inactive];
    border: 0;
    border-radius: 0 @radius @radius 0;
    padding: 0.2em 0.2em;

    &:hover {
      background-color: #colors[warn];
    }
  }
</style>
