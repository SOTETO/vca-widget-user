<template>
    <div class="searchTag" :class="notRemovable">
      <div class="content">
        <span class="fieldName">{{ getFieldName() }}</span>
        <span class="keyword">{{ getKeyword() }}</span>
      </div>
      <button v-if="isVisible" class="remove" :title="$vcaI18n.t('label.search.remove.tag')" v-on:click="fireRemove">
        <div v-html="require('./images/times-circle.svg')" />
      </button>
    </div>
</template>

<script>
    export default {
      name: "SearchTag",
      props: ['keywords', 'field', 'isVisible'],
      computed: {
	notRemovable() {
	  return (this.isVisible ? '' : 'notRemovable');
        }
      },
      methods: {
        getKeyword() {
          return this.field.getKeyword()
        },
        getFieldName() {
          return this.$vcaI18n.t('label.search.' + this.field.getName())
        },
        fireRemove(event) {
          this.$emit('removeField', this.field)
        }
      }
    }
</script>

<style scoped lang="less">
  @import './assets/general.less';

  .searchTag {
    margin: 0.2em;
    padding: 0.3em 0.8em;
    /*min-width: 5em;*/
    display: flex;
    flex-direction: row;
    align-items: center;

    border-radius: @radius;
    background-color: #colors[primaryDeactivated];
    color: #colors[secundary];

    .content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;
      flex-grow: 1;
    }

    .fieldName {
      font-size: 0.7em;
    }

    .keyword {
      flex-grow: 1;
      font-size: 1.2em;
      font-weight: bold;
    }

    .remove {
      display: none;
      fill: #colors[secundary];
      font-size: 1.5em;
      height: 1.5em;
      width: 1.5em;
      margin-left: 0.5em;

      background: none;
      border: none;

      & /deep/ div {
        pointer-events: none;
        display: flex;
        flex-direction: column;
      }

      & /deep/ svg {
        pointer-events: none;
        cursor: pointer;
      }

      &:hover {
        text-shadow: #shadow[secundary];
      }
    }

    &:hover {

      box-shadow: #shadow[primary];
      background-color: #colors[primary];
      padding: 0.3em 0.3em 0.3em 0.8em;

    &.notRemovable {
    background-color: #colors[primaryDeactivated];
    	padding: 0.3em 0.8em;
    }

      .remove {
        display: block;
      }
    }
  }
</style>
