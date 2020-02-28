// pages/voteDetail/voteDetail.js
const app = getApp()
let videoCtx = null;
Page({
  data: {
    current: 0,
    pause: false,
    shareFlag: false,
    sharePoster: false,
    supportFlag: 0,
    imgUrl: '', //展示图片
    code: '', //二维码
    imgs: '', //下载图片
    item:{
      hoc_id: 2,
      type: 2,
      imgList: [],
      author: '曾',
      videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      title: '中国特色大国外交中国特色大国外嗷嗷待食ad按时',
      content: '今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民'
    },
    shareInfo: {
      "nickname": "致晨",
      "opus_name": "测试作品17",
      "opus_content": "一个测试作品17",
      "qrcode_url": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/qrcode/20200227/076a3d35ce7c5e2348db96f6364c4e793046e7aa_20200227.png"
    }
  },
  giveLike(){
    console.log('我给你点赞', this.data.supportFlag)
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if (this.data.supportFlag == 0) {
      //提示
      wx.showToast({
        title: "您今日已经点赞过了哦",
        icon: "none",
        duration: 1500
      })
    } else {
      let index = e.currentTarget.dataset.index
      let work = this.data.productionList[index]
      work.prise_numbers += 1
      let key = 'productionList[' + index + ']'
      this.setData({
        [key]: work,
        supportFlag: 0
      })
      let params = {
        id: e.currentTarget.dataset.id,
        type: this.data.selectedIndex
      }
      this.praiseOpus(params)
      console.log('点赞', params)
    }
  },
  praiseOpus(params) {
    app.vote.praiseOpus(params).then(res => {
      console.log(res)
      wx.showToast({
        title: "今日点赞成功,请明日再来",
        icon: "none",
        duration: 2500
      })
    }).catch(err => {
      console.log(err)
    })
  },
  unshare(){
    this.setData({
      sharePoster: false
    })
  },
  savePoster(){
    console.log('保存到本地')
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
        item: res.data,
        supportFlag: res.data.have_praise
      })
      wx.setNavigationBarTitle({
        title: this.data.item.name
      })
      //如果是视频就自动播放
    })
  },
  getPosterInfo(ho_id) {
    let params = { ho_id: ho_id }
    app.vote.getPosterInfo(params).then(res => {
      console.log("获取海报信息", res)
      this.setData({
        shareInfo: res.data
      })
    })
  },
  onLoad(options){
    this.getOpusInfo(options.id)
    videoCtx = wx.createVideoContext('videoWorks', this)
    videoCtx.play()
  },
  shareMode(){  //弹出样式
    this.setData({
      shareFlag: true
    })
  },
  shareImg(e){ //点击生成海报
    console.log("生成海报")
    this.setData({
      shareFlag: false,
      sharePoster: true
    })
    console.log(this.data.item)
    this.getPosterInfo(this.data.item.id);

    //这里需要下载对应的网络图片资源并且开始绘画canvas
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