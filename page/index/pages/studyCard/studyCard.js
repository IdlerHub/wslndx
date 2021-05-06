const app = getApp()
const env = app.store.process //如果修改环境,注意studyCard.js里也要修改
const STUDY_CARD_URL = {
  dev: 'https://globalh5dev.jinlingkeji.cn/studycard/giveCard',
  test: 'https://globalh5test.jinlingkeji.cn/studycard/giveCard',
  pro: 'https://globalh5pro.jinlingkeji.cn/studycard/giveCard',
}
const HTTP_BASE = {
  dev: 'https://activitygwdev.jinlingkeji.cn',
  test: 'https://activitygwtest.jinlingkeji.cn',
  pro: 'https://activitygwpro.jinlingkeji.cn',
}
Page({
  data: {
    webURL: '',
  },
  onLoad(options){
    let referenceId = 0
    if(options.scene){
      const scene = decodeURIComponent(options.scene)
      referenceId = scene.split('=')[1]
    }
    // let url = options.url ? options.url : STUDY_CARD_URL[env]
    // console.log(url)
    this.getOpenId(referenceId)
  },
  getOpenId(referenceId){
    let _this = this,
    token = wx.getStorageSync("token");
    if(wx.getStorageSync('openId') == ''){
      wx.login({
        success: function(res) {
          if(res.code) {
            wx.request({
              url: HTTP_BASE[env] + '/weixin-mp/wx/mini/miniLogin',
              method: 'post',
              data: {
                code: res.code,
                appId: 'wx8dc9e7f55fe1f3ff'
              },
              success(res) {
                wx.setStorageSync('openId', res.data.data.openid)
                _this.setData({
                  webURL: STUDY_CARD_URL[env] + `?openId=${wx.getStorageSync('openId')}&terminal=miniprogram&referenceId=${referenceId}&token=${token}`
                })
              }
            })
          }
        }
      })
    }else {
      this.setData({
        webURL: STUDY_CARD_URL[env] + `?openId=${wx.getStorageSync('openId')}&terminal=miniprogram&referenceId=${referenceId}&token=${token}`
      })
    }
  },
  onShareAppMessage(options) {
    // let url = 'https://globalh5dev.jinlingkeji.cn/studycard/giveCard'
    return {
      title: '赠送您一张网上老年大学学习卡,点击领取',
      path: `/page/index/pages/studyCard/studyCard`,
      imageUrl: "https://lndxappcdn.jinlingkeji.cn/common/share-mp.png"
    }
  }
})