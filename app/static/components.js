var socket = io();

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
      select: function(event){
		socket.emit(
			"select", {
				"selection": this.id,
				"server": this.$root.room,
				"clicker": this.$root.initials,
			}
		);
	  }
  },
    template: `<v-btn class="codename" block v-bind:outlined="!selected" v-bind:color="colorObject" v-on:click="select" ><%word%></v-btn>`
})

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

Vue.component('scoreboard', {
  delimiters: ['<%', '%>'],
  props: ["room", "color", "red", "blue", "red_scores", "blue_scores"],
  template: `
    <v-container>
	<v-row>
		<v-col cols="2"><login :room="room"></login></v-col>
        <v-col>
          <v-row>
            <v-col cols="12" class="float-right">
              <v-avatar size="36" color="blue" v-for="scorer in blue_scores">
                <span class="white--text headline"><% scorer %></span>
              </v-avatar>
              <v-avatar size="36" color="blue" v-for="n in blue" :key="n">
                <v-icon large color="white">mdi-checkbox-blank-circle</v-icon>
              </v-avatar>
              <v-icon large color="blue">mdi-numeric-<% blue %>-circle-outline </v-icon>
            </v-col>
            <v-col cols="12">
              <v-avatar size="36" color="red" v-for="scorer in red_scores">
                <span class="white--text headline"><% scorer %></span>
              </v-avatar>
              <v-avatar size="36" color="red" v-for="n in red" :key="n"> 
                <v-icon large color="white">mdi-checkbox-blank-circle</v-icon>
              </v-avatar>
              <v-icon large color="red">mdi-numeric-<% red %>-circle-outline </v-icon>
            </v-col>
          </v-row>
        </v-col>
	</v-row>
    </v-container>
`
})
Vue.component('login', {
  delimiters: ['<%', '%>'],
  props: ["room"],
  computed: {
      button_text: function(){
          if (this.room == ""){
              return "Join a room";
          }
          else {
              return this.room;
          }
      }
  },
  methods: {
	cancel: function(){
		this.dialog = false;
	},
	enter: function(){
		this.sending = true;
		result = this.$root.validate(this.temp_room);
        console.log(result);
		this.sending = false;
		this.dialog = false;
	}
  },
  data: () => ({
	dialog: false,
	sending: false,
    temp_room: "",
  }),
  template: `
  <v-row >
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" text x-large v-on="on"><% button_text %></v-btn> </template>
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Initials" v-model="$root.initials" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Server Name" required v-model="temp_room"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="['Red', 'Blue']"
                  label="Color"
				  v-model="$root.color"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel()">Close</v-btn>
          <v-btn color="blue darken-1" :loading="sending" text @click="enter()">Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
`
})


var app = new Vue({
  el: '#app',
  computed: {
	getBlue: function(){
		if (this.color == "Blue"){return true;}
		if (this.color == "Red"){return false;}
		return null;
	},	
  },
  data: {
	color: null,
    game_state: Array(25).fill([false, "neutral"]),
    room: "",
    spymaster: false,
    initials: null,
	red: 0,
    red_scores: [],
    blue_scores: [],
	blue: 0,
	winner: null,
  },
  delimiters: ['<%', '%>'],
  methods: {
	validate: function(room){
        if(room != ""){
            this.room = room.toLowerCase();
            console.log("validated");
            socket.emit('join', {'server': this.room, 'spymaster': this.spymaster});
        }
	},
  },
  vuetify: new Vuetify(
  ),
})

socket.on("refresh", function(updated_data){
	if (updated_data.name == app.room){
		app.game_state = updated_data.squares;
		app.red = updated_data.red;
		app.blue = updated_data.blue;
		app.winner = updated_data.winner;
		app.red_scores = updated_data.scores.red;
		app.blue_scores = updated_data.scores.blue;
	}
	else{
		console.log("Got data for" + updated_data.name + ", but the current board is" + app.room);
        socket.emit('leave', {'server': updated_data.name});
    }

});
