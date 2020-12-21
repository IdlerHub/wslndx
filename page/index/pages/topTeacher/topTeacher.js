const { list } = require("../../../../data/Video")

// page/index/pages/topTeacher/topTeacher.js
Page({
  data: {
    list: []
  },
  isTopteacher: 1,
  onLoad: function (options) {
    this.setData({
      list: [
        {id: 1, name: '秋海棠', avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Kk8UYpvxciaDAphxnujSO9wEKRQ42B369uE7EawOtT0GMnFkbyaTvPNxIWxnibVm5tNEwluxFGdX7tUiaFY09lGRw/132', isChage: 0, chageYou: 0, inro: '数据来看的话发货了发快递师傅和'},
        {id: 2, name: '金铭心语', avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epBW5TAxeFNiaXVRZJRUl8DDgLErdkx0dUQs2BczGjm3p65Sliajd1ctPCnib89Fur1LiaYlzHSDKibOsw/132', isChage: 1, chageYou: 0, inro: '数据来看的话发货了发快递师傅和'},
        {id: 3, name: '金铭心语', avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epBW5TAxeFNiaXVRZJRUl8DDgLErdkx0dUQs2BczGjm3p65Sliajd1ctPCnib89Fur1LiaYlzHSDKibOsw/132', isChage: 1, chageYou: 1, inro: '数据来看的话发货了发快递师傅和'},
      ]
    })
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (e) {
    if (e.from === "button") {
      let id = e.target.dataset.id
      return {
        title: "一起来学习网上老年大学讲师的课程吧!",
        imageUrl:  this.data.$state.shareImgurl || "/images/sharemessage.jpg",
        path: "/page/index/pages/tearcherDetail/tearcherDetail?id=" +
          id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    } else {
      return this.menuAppShare()
    }
  },
  checkAttention(e) {
    let item = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index
    if(!item.isChage) {
      this.setData({
        [`list[${index}].isChage`]: 1
      })
    } else {
      wx.navigateTo({
        url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + item.id,
      })
    }
  }
})