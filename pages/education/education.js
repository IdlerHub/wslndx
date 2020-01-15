//Page Object
const app = getApp()
Page({
  data: {
    url: ""
  },
  onLoad: function(options) {
    if(!options.type) {
      let optsStr = decodeURIComponent(options.scene).split("&"), opstObj = {};
      optsStr.forEach((item, index) => {
        opstObj[item.split("=")[0]] = item.split("=")[1];
      });
      console.log(opstObj)
      this.setData({
        url: 'https://gqjydev.jinlingkeji.cn/' + "?uid=" + encodeURIComponent(this.data.$state.userInfo.id) + "&id=" + encodeURIComponent(opstObj.id)
      })
    } else {
      if (options.type === 'farm') {
        this.junmpOut('https://h5xyx.jinlingkeji.cn')
        app.aldstat.sendEvent("首页按钮点击",{
          name:'开心农场'
        })
      } else if (options.type === 'station') {
        this.junmpOut('https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5')
        app.aldstat.sendEvent("首页按钮点击",{
          name:'老年电台'
        })
      } else if(options.type === 'lottery') {
        console.log(options, 432423432)
        this.setData({
          url: 'https://gqjydev.jinlingkeji.cn/' + "?uid=" + encodeURIComponent(this.data.$state.userInfo.id) + "&id=" + encodeURIComponent(options.id)
        })
      } else  {
        if (options.login) {
          if (options.login == 0) {
            this.junmpOut(options.url)
          } else {
            this.setData({
              url: 'https://gqjydev.jinlingkeji.cn/' + "?uid=" + encodeURIComponent(this.data.$state.userInfo.id)
            })
          }
        }else {
          this.junmpOut(options.url)
        }
        
      }
    }
  
    
    // console.log(options.url)
    this.junmpOut()
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onPageScroll: function() {},
  junmpOut(url) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
     url
    })
  }
})
