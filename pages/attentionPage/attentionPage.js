// pages/attentionPage/attentionPage.js
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = [
      {uid: 1487, name: 'o' , university:'中国网上老年大学', type:"舞蹈健身",avatar: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132",university_name:'网上老年大学',type:"舞蹈健身",status:'取消关注'},
      {uid: 820, name: '致晨' , uoniversity:'中国网上老年大学', avatar: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK27aiaK27euzIBs2AtqvjQsc4Imx3gCmge8V9PTSgzSNHxmxFbq4UAGskdsZy15TovjRkBIyYcc6Q/132", university_name:'网上老年大学',status:'取消关注'},
      {uid: 514, name: '习文' , uoniversity:'中国网上老年大学', avatar: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqt2q4GrGt6ezzukyg1OBI14LghpLHmWASnyXmxFDlVfmxia4xdUDCqyjO3GNjd9f7YWBuVwBPl1fA/132",university_name:'网上老年大学',type:"爱旅行",status:'取消关注'},
    ]
    // this.setData({
    //   list
    // })
  },
  closeattention(e) {
    let index = e.currentTarget.dataset.index
    let that = this
    wx.showModal({
      content: '是否取消关注？',
      confirmColor:'#DF2020',
      cancelColor:'#999999',
      confirmText:'是',
      cancelText:'否',
      success (res) {
        if (res.confirm) {
          that.data.list.forEach((item,i) => {
            i == index ? item.status = '关注' : ''
          })
          that.setData({
            list: that.data.list
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})