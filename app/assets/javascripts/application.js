// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require vue
//= require vue-router
//= require vue-resource
//= require_tree .





  
Vue.http.interceptors.push({
  request: function (request) {
    Vue.http.headers.common['X-CSRF-Token'] = $('[pedido="csrf-token"]').attr('content');
    return request;
  },
  response: function (response) {
    return response;
  }
});

var orderResource = Vue.resource('/orders{/id}.json')
const Orders = {
  template: '#orders-template',
  props: ['ds'],
  data () {
    return {
      ordersReceived: [],
      pedido: '',
      persona: '',
     order: {
     	id :'',
      		pedido: '',
      		persona: '',
    	},
    };
  },
  mounted: function() {
    var that;
    that = this;
    orderResource.get().then(
      function (response) {
        that.ordersReceived = response.data
      }
    )
  },
  created () {
    this.event = this.ds.event;
    this.event.subscribe('test-order', value => {
      this.ordersReceived.push(value)
    })
  },
  methods: {
    handleClick () {
    	that = this;
    	this.order.pedido = this.pedido
    		this.order.persona = this.persona
    		//this.order.id = response.data.id
     	 this.event.emit('test-order', this.order)
       orderResource.save({order: this.order}).then(
        function(response) {
          console.log(response.data.id)
          
        },
        function(response) {
        }
      )
    },
    deleteOrder(orde){
      var that = this;
      console.log(orde.id)
      orderResource.delete({id: orde.id}).then(
        function (response) {
          that.ordersReceived.splice(that.ordersReceived.indexOf(orde), 1);
        }
      )
    }
  }
}

new Vue({
  el: '#app',
  components: {
    'my-orders': Orders,
  },
  data: {
    connectionState: 'INITIAL'
  },
  created () {
    this.ds = deepstream('wss://013.deepstreamhub.com?apiKey=38ff9f70-dc0f-48e0-b1e4-747bcf976cc8')
      .login()
      .on('connectionStateChanged', connectionState => {
        this.$data.connectionState =  connectionState
      })
  }
})