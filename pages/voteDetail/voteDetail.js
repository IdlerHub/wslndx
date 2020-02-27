// pages/voteDetail/voteDetail.js
const app = getApp()
let videoCtx = null;
Page({
  data: {
    current: 0,
    pause: false,
    shareFlag: false,
    imgUrl: '', //展示图片
    code: '', //二维码
    imgs: '', //下载图片
    item:{
      type: 2,
      imgList: [],
      author: '曾',
      videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      title: '中国特色大国外交中国特色大国外嗷嗷待食ad按时',
      content: '今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民'
    }
  },
  toJoin(){
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    })
  },
  changeIndex(e){
    console.log(e)
    this.setData({
      current: e.detail.current
    })
  },
  controlVideo(){
    videoCtx = wx.createVideoContext('videoWorks', this)
    if(this.data.pause){
      videoCtx.play()
      this.setData({
        pause: false
      })
    console.log("开始播放了",this.data.pause)
    }else{
      videoCtx.pause()
      this.setData({
        pause: true
      })
      console.log("暂停视频",this.data.pause)
    }
  },
  videoplay(e){ //播放时触发
    console.log("自动播放")
    this.setData({
      pause: false
    })
  },
  // videopause(e){  //暂停时触发
  //   console.log(222)
    
  // },
  getOpusInfo(id){
    let params = { id: id }
    app.vote.getOpusInfo(params).then(res=>{
      console.log(res)
      this.setData({
        item: res.data
      })
      wx.setNavigationBarTitle({
        title: this.data.item.name
      })
    })
  },
  onLoad(options){
    this.getOpusInfo(options.id)
  },
  shareMode(){  //弹出样式
    this.setData({
      shareFlag: true
    })
  },
  shareImg(){
    console.log("生成海报")
    this.setData({
      shareFlag: false
    })

    //下载二维码
    wx.downloadFile({
      url: '/images/'
    })
  },
  shareOff(){ //取消分享
    this.setData({
      shareFlag: false
    })
  },
  onShareAppMessage(ops){
    let id = this.data.item.id
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '网上老年大学',
      path: 'pages/voteDetail/voteDetail?id=' + id,  // 路径，传递参数到指定页面。
     success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onHide(){
    videoCtx = wx.createVideoContext('videoWorks', this)
    videoCtx.stop()
    this.setData({
      pause: true
    })
    videoCtx = null;
  }
})