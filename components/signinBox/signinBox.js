// components/siginBox/signinBox.js
Component({
  properties: {
    state: {
      type: JSON,
      value: {}
    },
    isIndex: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    closesignBox: function(){
      this.triggerEvent('closesignBox');
    },
    showIntegral: function(){
      this.triggerEvent('showIntegral');
    },
    signin: function(){
      this.triggerEvent('sigin');
    },
  }
})