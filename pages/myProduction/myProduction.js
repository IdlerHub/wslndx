// pages/myProduction/myProduction.js
const app = getApp()
Page({
  data: {
    state: [
      { id: 2, title: '已通过' },
      { id: 0, title: '待审核' },
      { id: 1, title: '未通过' }
    ],
    type: 2,  //状态值
    stateIndex: 0,  //选中的sate下标
    stateNum: [1,2,3],
    productionList: [
      {
        "id": 1,
        "name": "风景风景风景风景风景风景风景风景",
        "prise_numbers": 888,
        "type": 1,
        "createtime": "2020-02-24 14:05:51"
      },
      {
        "id": 2,
        "name": "名胜",
        "prise_numbers": 888,
        "type": 2,
        "createtime": "2020-02-24 14:05:51"
      }
    ],    //作品列表

  },
  toWorks(){
    wx.redirectTo({ 
      url: '/pages/voteProduction/voteProduction'
    })
  },
  toVoteFail(e){
    console.log(this.data.type)
    if(this.data.type == 1){
      wx.redirectTo({ //去未通过的缺省页
        url: '/pages/voteFail/voteFail'
      })
    }else{
      console.log(this.data.type)
      console.log('传去详情页的id',e.currentTarget.dataset.flag)
      wx.navigateTo({ //去详情页
        url: `/pages/voteDetail/voteDetail?voteid=${e.currentTarget.dataset.id}&flag=${e.currentTarget.dataset.flag}`
      })
    }
  },
  changeState(e){
    console.log(e)
    this.setData({
      stateIndex: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.type
    })
    let type = this.data.type
    console.log("状态",this.data.type)
    this.getMyOpus(type)
  },
  getMyOpus(type){
    let params = { type: type }
    app.vote.getMyOpus(params).then(res=>{
      let stateNum = [res.data.success, res.data.waitting, res.data.failed]
      this.setData({
        productionList: res.data.info,
        stateNum: stateNum
      })
    })
  },
  onLoad(){
    //考虑改成this.data.type
    this.getMyOpus(2) //默认初始获取已通过状态 type=2
  }
})