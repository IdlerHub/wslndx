// pages/voteWinner/voteWinner.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankType: 0, //默认显示的标签
    topTitle1: ["排名","学校","投票总数"],  //表头
    topTitle2: ["排名","学校","作品数"],
    rankLeft1: [{ "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "海淀老龄大学", "numbers": 218127 }, { "school": "大庆油田老年大学", "numbers": 212028 }], //排名列表
    rankLeft2: [{ "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "海淀老龄大学", "numbers": 218127 }, { "school": "大庆油田老年大学", "numbers": 212028 }], //排名列表
    rankRight: [],  //个人奖
    categoryIndex: 0,
    category:[],  //分类
  },
  getCategory() {
    //获取分类数据
    app.vote.getCategory().then(res => {
      this.getPrize(res.data.data[0].id)
      this.setData({
        category: res.data.data,
      })
    });
  },
  getPrize(id){
    let params = {
      type: 2,
      hoc_id: id
    }
    app.vote.getPrize(params)//获取个人作品奖
    .then(data=>{
      this.setData({
        rankRight: data.data
      });
    })
    .catch(err=>{
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    })
  },
  checkTop(e) { //切换顶部标签
    this.setData({
      rankType: e.currentTarget.dataset.type,
      scollTop: 0
    })
  },
  openRule(){
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    });
  },
  classifyChange(e){  //切换分类
    let index = e.detail.value;
    let id = this.data.category[index].id
    this.setData({
      categoryIndex: index
    })
    this.getPrize(id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.vote.getPrize()//默认type=1,获取优秀组织奖
    .then(res=>{
      this.setData({
        rankLeft1: res.data.praise_numbers,
        rankLeft2: res.data.opus_numbers
      })
    }) 
    this.getCategory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // let title = this.data.title;
    return {
      title:"获奖排行榜",
      path: `pages/voteWinner/voteWinner`,
    };
  }
})