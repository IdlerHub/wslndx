//Page Object
const app = getApp()
Page({
  data: {
    url: ""
  },
  pageName: '外链页（开心农场&amp;老年电台&amp;早报）',
  onLoad: function (options) {
    if (!options.type) {
      let optsStr = decodeURIComponent(options.scene).split("&"), opstObj = {};
      optsStr.forEach((item, index) => {
        opstObj[item.split("=")[0]] = item.split("=")[1];
      });
    } else {
      if (options.type === 'farm') {
        this.junmpOut('https://h5xyx.jinlingkeji.cn')
        wx.uma.trackEvent('index_btnClick', { 'btnName': '开心农场' });
      } else if (options.type === 'station') {
        this.junmpOut('https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5')
        wx.uma.trackEvent('index_btnClick', { 'btnName': '老年电台' });
      } else if(options.type === 'doudizhu') {
        let openID = ''
        wx.getStorage({
          key: 'openId',
          success: res => {
            this.junmpOut(`https://lnddz.293k.com/?openid=${res.data}`)
          }
        })
      } else if(options.type === 'lottery') {
        this.setData({
          url: 'https://gqjydev.jinlingkeji.cn/' + "?uid=" + encodeURIComponent(this.data.$state.userInfo.id) + "&id=" + encodeURIComponent(options.id)
        })
      } else {
        if (options.login) {
          if (options.login == 0) {
            this.junmpOut(options.url)
          } else {
            this.setData({
              url: 'https://gqjydev.jinlingkeji.cn/' + "?uid=" + encodeURIComponent(this.data.$state.userInfo.id) + "&id=" + encodeURIComponent(options.id)
            })
          }
        } else {
          this.junmpOut(options.url)
        }

      }
    }
  },
  junmpOut(url) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
      url
    })
  }
})
