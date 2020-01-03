// pages/attentionPage/attentionPage.js
const app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
  },
  onShow(){
    app.user.userFollowing().then(res => {
      res.data.forEach(item => {
        item.status = '取消关注'
      })
      if(res.code == 1) {
        this.setData({
          list : res.data
        })
      }
    })
  },
  closeattention(e) {
    let index = e.currentTarget.dataset.index, status = e.currentTarget.dataset.status
    let that = this
    if(status == '取消关注') {
      wx.showModal({
        content: '是否取消关注？',
        confirmColor:'#DF2020',
        cancelColor:'#999999',
        confirmText:'是',
        cancelText:'否',
        success (res) {
          if (res.confirm) {
            let param  = { follower_uid: that.data.list[index].id }
            app.user.cancelFollowing(param).then(msg => {
              if(msg.code == 1) {
                that.data.list[index].status = '关注'
                that.setData({
                  list: that.data.list
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      let param  = { follower_uid: that.data.list[index].id }
      app.user.following(param).then(res=> {
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
      url: `/pages/personPage/personPage?uid=${this.data.list[index].id}&nickname=${this.data.list[index].nickname}&university_name=${this.data.list[index].university}&avatar=${this.data.list[index].avatar}&addressCity=${this.data.list[index].city}`
    })
  }
})