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
    },
    top: {
      type: Number,
      value: 192
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
    }
  }
})