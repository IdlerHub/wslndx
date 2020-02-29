//Page Object
Page({
  data: {},
  //options(Object)
  pageName: '礼品兑换成功',
  onLoad: function(options) {
    this.setData({
      name: options.name,
      image: options.image
    })
    console.log(this.data.name, this.data.image)
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onReachBottom: function() {},
  handleContact(e) {
    // console.log(e.path)
    // console.log(e.query)
  }
})
