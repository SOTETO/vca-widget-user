<template>
  <vue-scrollbar classes="tags-scroll" ref="VueScrollbar" :key="rerender">
    <div class="tags" ref="tags" :style="'width: ' + tagsWidth + 'px'">
      <template v-for="(q,k) in queries">
        <div ref="tagQueries" class="tagQueries">
          <SearchTagQuery :query="q" :index="k" :key="k" v-on:changeQuery="updateFilter" />
          <div v-if="k !== (queries.length - 1)" class="divider" v-html="require('../images/plus.svg')" />
        </div>
      </template>
    </div>
  </vue-scrollbar>
</template>

<script>
  import SearchTagQuery from '../SearchTagQuery'
  import VueScrollbar from 'vue2-scrollbar'
  export default {
    name: "SearchTagSet",
    components: {
      'SearchTagQuery': SearchTagQuery,
      VueScrollbar
    },
    props: {
      "queries": {
        "type": Array,
        "required": true
      }
    },
    data () {
      return {
        "rerender": false,
        "tagsWidth": 0
      }
    },
    created() {
      this.calculateTagsWidth()
    },
    methods: {
      updateFilter (event) {
        this.$emit("removeFilter", event)
      },
      calculateTagsWidth () {
        if(this.$refs.hasOwnProperty("tagQueries")) {
          this.tagsWidth = this.$refs.tagQueries.reduce((acc, div) => acc + div.clientWidth, 0)
          this.$refs.tags.style.width = this.tagsWidth + "px"
          this.rerender = !(this.rerender)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/general.less';
  @import '../assets/vue2-scrollbar.css';

  .tags-scroll {
    width: 100%;
    min-width: 100%;
    max-height: 4em;
  }

  .tags, .tagQueries {
    display: flex;
    flex-direction: row;
  }

  .tags {
    min-width: 100%;
  }

  .divider {
    margin: 0.2em;
    padding: 0.5em 0.8em;

  & /deep/ svg {
      width: 1.5em;
      fill: #colors[primaryDeactivated];
    }
  }
</style>
