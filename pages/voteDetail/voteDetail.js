// pages/voteDetail/voteDetail.js
Page({
  data: {
    current: 0,
    pause: true,
    item:{
      type: 2,
      imgList: [],
      author: '曾',
      videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      title: '中国特色大国外交中国特色大国外嗷嗷待食ad按时',
      content: '今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民今年是中华人民'
    }
  },
  changeIndex(e){
    console.log(e)
    this.setData({
      current: e.detail.current
    })
  },
  videoplay(e){ //播放时触发
    console.log(e)
    this.setData({
      pause: false
    })
    
  },
  videopause(e){  //暂停时触发
    console.log(222)
    this.setData({
      pause: true
    })
    console.log(e)
  }
})