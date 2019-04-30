<template>
    <span class="vca-crew-name">{{ name }}</span>
</template>

<script>
  import axios from 'axios'

    export default {
      name: "CrewPlainName",
      props: {
          "id": {
            "type": String,
            "required": true
          }
      },
      data () {
        return {
          "crew": null,
          "error": null
        }
      },
      computed: {
        name () {
          var res = this.$t("error.notFound") // Todo: Use i18n!
          if(this.error === null && this.crew !== null && this.crew.hasOwnProperty("name")) {
            res = this.crew.name
          }
          return res
        }
      },
      created () {
        axios.get('/drops/webapp/crew/' + this.id)
          .then(response => {
            if(response.status == 200) {
              this.crew = response.data.additional_information
            }
          }).catch(error => this.error = error)
      }
    }
</script>

<style scoped>

</style>
