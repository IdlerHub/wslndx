// pages/usermesseage/usermesseage.js
Page({
  data: {
    newsList:[]
  },
  onLoad: function (options) {
    let newsList = [
      {id:1, creattime:'昨天 15:06', title:'通知标题通知标', content:'通知正文通知正文，只显示4行只显示4行。查看详情直接跳转富文本，查看详情直接跳转富文本。只显示4行只显示4行，后台限制简介字数。'},
      {id:2, creattime:'昨天 15:06', title:'通知标题通知标', content:'通知正文通知正文，只显示4行只显示4行。查看详情直接跳转富文本。防洪评价恢复的很快看到感觉很快乐付好款放得开就会立刻多方了解后两款发动机和洛克的房价就会离开房间和库房管理考核京东方'},
      {id:3, creattime:'星期三 10:06', title:'通知标题通知标通知标题通知算了哈生拉活夫是德国', content:'通知缘由发布指示、安排工作的通知，这部分的写法跟决定、指示很接近，主要用来表述有关背景、根据、目的、意义等。晓谕性的通知，也可参照上述写法。如《国务院关于更改新华通讯社香港分社、澳门分社名称问题的通知》，采用了根据与目的相结合的开头方式；《国务院办公厅关于成立国家信息工作领导小组的通知》，采用的是以“为了”领起的“目的式”开头方式。批转、转发文件的通知，根据情况，可以在开头表述通知缘由，但多数以直接表达转发对象和转发决定为开头，无需说明缘由。发布规章的通知，多数情况下篇段合一，无明显的开头部分，一般也不交代缘由。'},
      {id:4, creattime:'2019年12月17日 10:06', title:'通知标题通知标', content:'通知正文通知正文，只显示4行只显示4行。查看详情直接跳转富文本。'},
    ]
    this.setData({
      newsList
    })
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  tomessage(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/messagePage/messagePage',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  }
})