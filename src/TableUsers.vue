<template>
  <div class="users-table-wrapper">
    <table class="users-table">
      <thead>
        <TableRow type="header" :showOption="showOptions" />
      </thead>
      <tbody>
        <TableRow v-for="(user, i) of users" type="row" :className="(i % 2 == 0) ? 'even' : 'odd'" :user="user" :key="user.id" :selected="checkUsers(user.id)" :showOption="showOptions" />
      </tbody>
    </table>
  </div>
</template>

<script>
    import TableRow from './TableRow'
    export default {
      name: 'TableUsers',
      components: { TableRow },
      props: ['users', 'showOptions'],
      data () {
        return {
	  selectedUsers: []
        }
      },
      mounted() {
	this.$root.$on('doSelectUser', (userId) => { this.selectUser(userId); }),
	this.$root.$on('doSelectAllUser', () => { this.selectAllUsers(); }),
	this.$root.$on('doUnSelectAllUser', () => { this.unselectAllUsers(); })
      },
      methods: {
	checkUsers: function(userId) {
	  return this.selectedUsers.some(( current ) => (current == userId)) ? "checked" : ""
	},
	selectUser: function(userId) {
	  var found = this.selectedUsers.includes(userId);
    	  if (found) {
	    // Element was found, remove it.
	    this.selectedUsers.splice(this.selectedUsers.indexOf(userId), 1);
	  } else {
	    // Element was not found, add it.
	    this.selectedUsers.push(userId);
	  }
	  this.$root.$emit('setSelectedUsers', this.selectedUsers);
	},
	unselectAllUsers: function() {
	  this.selectedUsers = [];
	  this.$root.$emit('setSelectedUsers', this.selectedUsers);
	},
	selectAllUsers: function() {
	  this.selectedUsers = [];
	  for(var i = 0; i < this.users.length; i++) {
	    this.selectedUsers.push(this.users[i].id);
	  }
	  this.$root.$emit('setSelectedUsers', this.selectedUsers);
	}
      }
    }
</script>

<style scoped lang="less">
  @import "./assets/general.less";

  .users-table {
    border: 0.3em;
    border-color: #colors[primary];
    border-spacing: 0.5rem;
    border-collapse: collapse;
    overflow-y: auto;
    width: 100%;
  }
</style>
