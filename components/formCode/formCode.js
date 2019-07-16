Component({
  methods: {
    saveFormId(v) {
      console.log(v.detail.formId)
      this.callback()
    },
    callback: function() {
      this.triggerEvent("handler", {}, { bubbles: true, composed: true })
    }
  }
})
