Component({
  methods: {
    saveFormId(v) {
      let formId = v.detail.formId
      console.log(formId)
      if (formId != "the formId is a mock one") {
        // getApp().user.addFormId({ form_id: v.detail.formId })
      }
      this.callback()
    },

    callback: function() {
      this.triggerEvent("handler", {}, { bubbles: true, composed: true })
    }
  }
})
