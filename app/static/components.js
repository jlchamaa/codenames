console.log("First");
Vue.component('codename',{
  props: ['id', 'selected', 'color', 'word'],
  delimiters: ['<%', '%>'],
  computed: {
     colorObject: function(){ 
		if (this.$root.spymaster || this.selected){
        	if ( this.color == "blue" ) return "primary";
        	if ( this.color == "red" ) return "error";
			if ( this.color == "neutral" ) return "grey darken-1";
        	if ( this.color == "death" ) return "black";
		}
    	return "";
    },
  },
  methods: {
      select: function(event){socket.emit("select", {"selection": this.id, "server": "tmgs"});}
  },
    template: `<v-btn class="codename" block v-bind:outlined="!selected" v-bind:color="colorObject" v-on:click="select" ><%word%></v-btn>`
})

console.log("second");

Vue.component('game', {
  delimiters: ['<%', '%>'],
  template: `
  <v-container>
  <v-row cols="5" justify="center" v-for="row in 5" :key="row">
    <v-col v-for="col in 5" class="pa-2 text-center" :key="col" outlined title>
      <codename
          v-bind:id="5*(row-1)+col-1"
          v-bind:selected="$root.game_state[5*(row-1)+col-1][0]"
          v-bind:color="$root.game_state[5*(row-1)+col-1][1]"
          v-bind:word="$root.game_state[5*(row-1)+col-1][2]"
      ></codename>
    </v-col>
  </v-row>
  </v-container>`
})

console.log("third");

var app = new Vue({
  el: '#app',
  data: {
    game_state: Array(25).fill([false, "neutral"]),
    room: null,
    username: null,
    spymaster: false,
  },
  delimiters: ['<%', '%>'],
  vuetify: new Vuetify(
  ),
})
console.log("finish");
