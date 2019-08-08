// pages/commentDetail/commentDetail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: "",
    opts: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.navParams = options
    this.getData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 获取评论详情
   */
  getData() {
    return app.circle.replyDetail(this.navParams).then(res => {
      if (res.code == 1) {
        res.data.reply_array.forEach(v => {
          v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`
        })
        this.setData({
          detail: res.data
        })
      }
    })
  },
  showModal(e) {
    wx.showModal({
      content: "确定删除该评论?",
      success: res => {
        if (res.confirm) {
          if (e.currentTarget.dataset.item) {
            this.delReply(e)
          } else {
            this.delComment()
          }
        }
      }
    })
  },
  /**
   * 删除评论
   * */
  delComment() {
    let param = { blog_id: this.data.detail.blog_id, id: this.data.detail.id }
    app.circle.delComment(param).then(msg => {
      if (msg.code == 1) {
        this.toast("删除成功")
        this.emitEvent()
        setTimeout(() => {
          wx.navigateBack({ delta: 1 })
        }, 1500)
      } else {
        this.toast("删除失败，请稍后重试")
      }
    })
  },
  delReply(e) {
    let params = { blog_id: this.data.detail.blog_id, comment_id: this.data.detail.id, id: e.currentTarget.dataset.item.reply_id }
    app.circle.replydel(params).then(msg => {
      if (msg.code == 1) {
        this.toast("删除成功")
        this.emitEvent()
        this.getData()
      } else {
        this.toast("删除失败，请稍后重试")
      }
    })
  },
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
      duration: 1500
    })
  },
  /* 刷新路由中前一个页面的评论列表 */
  emitEvent() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit("refreshComments")
  },
  /* 打开输入框 */
  show(e) {
    this.replyInfo = e.target.dataset.reply
    this.setData({
      write: true
    })
  },
  /* 关闭输出框 */
  hide() {
    this.setData({
      write: false,
      content: null
    })
  },
  /* 输入的内容 */
  input(e) {
    this.setData({
      content: e.detail.value
    })
  },
  /* 发送回复 */
  release() {
    if (!!this.data.content.trim()) {
      /* 回复别人的回复 reply_type=2   /  回复评论主体 reply_type=1   */
      let params = {
        blog_id: this.data.detail.blog_id,
        comment_id: this.data.detail.id,
        reply_content: this.data.content,
        reply_type: this.replyInfo ? 2 : 1,
        reply_id: this.replyInfo ? this.replyInfo.reply_id : -1,
        to_user: this.replyInfo ? this.replyInfo.reply_user_id : this.data.detail.uid
      }
      this.reply(params)
    }
  },
  /* 回复评论 */
  reply(params) {
    this.hide()
    wx.showLoading({
      title: "发布中"
    })
    app.circle.reply(params).then(msg => {
      if (msg.code == 1) {
        this.toast("发布成功")
        this.emitEvent()
        this.getData()
      } else {
        this.toast("发布失败")
      }
    })
  },
  /**
   * 页面卸载
   */
  onUnload() {
    wx.hideToast()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  toComment() {
    let vm = this
    this.setData({
      write: false
    })
    wx.navigateTo({
      url: "../comment/comment?content=" + this.data.content,
      events: {
        commentContent: res => {
          vm.setData({
            content: res.data
          })
          vm.release()
        }
      }
    })
  }
})
