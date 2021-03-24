/*
 * @Date: 2020-02-29 18:58:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:27:15
 */
// pages/usermesseage/usermesseage.js
const app = getApp();
Page({
  data: {
    current: 0,
    newsList: [],
    list: []
  },
  pageName: "我的消息页",
  param: {
    pageNum: 1,
    pageSize: 15
  },
  onLoad: function(options) {},
  onShow: function() {
    this.getMessage();
    this.getList()
  },
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  getList(list) {
    let arr = list || []
    app.user.userFollowing().then(res => {
      res.data.forEach(item => {
        item.status = '取消关注'
      })
      arr.push(...res.data)
      this.setData({
        list: arr
      })
    })
  },
  bindscrolltolower() {
      this.param.pageNum += 1
      this.getList(this.data.list)
  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.current || e.detail.current
    })
  },
  tomessage(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/page/user/pages/messagePage/messagePage?id=" + id
    });
  },
  getMessage() {
    app.user.getMessage().then(res => {
      this.setData({
        newsList: res.data
      });
    });
  },
  closeattention(e) {
    let index = e.currentTarget.dataset.index, status = e.currentTarget.dataset.status
    let that = this
    if (status == '取消关注') {
      wx.showModal({
        content: '是否取消关注？',
        confirmColor: '#DF2020',
        cancelColor: '#999999',
        confirmText: '是',
        cancelText: '否',
        success(res) {
          if (res.confirm) {
            let param = { follower_uid: that.data.list[index].id }
            app.user.cancelFollowing(param).then(msg => {
              that.data.list[index].status = '关注'
              that.setData({
                list: that.data.list
              })
            })
          }
        }
      })
    } else {
      let param = { follower_uid: that.data.list[index].id }
      app.user.following(param).then(res => {
        that.data.list[index].status = '取消关注'
        that.setData({
          list: that.data.list
        })
      })
    }

  },
  touser(e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/page/post/pages/personPage/personPage?uid=${this.data.list[index].id}&nickname=${this.data.list[index].nickname}&university_name=${this.data.list[index].university}&avatar=${this.data.list[index].avatar}&addressCity=${this.data.list[index].city}&follow=${this.data.list[index].status == '关注' ? 0 : 1}`
    })
  }
});
