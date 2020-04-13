Vue.use(VueMaterial.default);
Vue.component('codename',{
  props: ['id', 'selected', 'color', 'word'],
  delimiters: ['${', '}'],
  computed: {
    classObject: function(){ return {
        "md-primary": this.color == "blue" && (this.$root.spymaster || this.selected),
        "md-accent": this.color == "red" && (this.$root.spymaster || this.selected),
        "md-button": this.color == "neutral" && (this.$root.spymaster || this.selected),
        "md-black": this.color == "death" && (this.$root.spymaster || this.selected),
        "md-raised": this.selected,
    };},
    myO: function(){return "btn-primary";}
  },
  methods: {
      select: function(event){socket.emit("select", {"selection": this.id, "server": "tmgs"});}
  },
    template: '<md-button v-bind:class=this.classObject class="md-layout-item md-button md-elevation-5" v-on:click="select" >${ word }</md-button>'
})

Vue.component('game', {
  delimiters: ['${', '}'],
  template: `
  <div>
  <div v-for="row in 5" class="md-layout md-alignment-top-center md-gutter button-row">
      <codename
          v-for="col in 5"
          v-bind:id="5*(row-1)+col-1"
          v-bind:selected="$root.game_state[5*(row-1)+col-1][0]"
          v-bind:color="$root.game_state[5*(row-1)+col-1][1]"
          v-bind:word="$root.game_state[5*(row-1)+col-1][2]"
      ></codename>
  </div>
  <hr/>
  </div>`
})
var app = new Vue({
  el: '#app',
  data: {
    game_state: Array(25).fill([false, "neutral"]),
    room: null,
    username: null,
    spymaster: false,
  },
  delimiters: ['${', '}'],
})

