// pages/voteWinner/voteWinner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankType: 1, //默认显示的标签
    topTitle1: ["排名","学校","投票总数"],  //表头
    topTitle2: ["排名","学校","作品数"],
    rankLeft1: [{ "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "海淀老龄大学", "numbers": 218127 }, { "school": "大庆油田老年大学", "numbers": 212028 }], //排名列表
    rankLeft2: [{ "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "青岛市老年大学", "numbers": 374017 }, { "school": "海淀老龄大学", "numbers": 218127 }, { "school": "大庆油田老年大学", "numbers": 212028 }], //排名列表
    rankRight: [ //个人奖
      {
          "id": 8,
          "name": "孙天良孙天良孙天良",
          "prize": "一等奖",
          "opus_id": 11943,
          "numbers": 99999,
          "type": 3
      },
      {
          "id": 4,
          "name": "吴长山",
          "prize": "一等奖",
          "opus_id": 11940,
          "numbers": 13612,
          "type": 3
      },
      {
          "id": 15,
          "name": "宋大安",
          "prize": "一等奖",
          "opus_id": 11929,
          "numbers": 11281,
          "type": 3
      },
      {
          "id": 17,
          "name": "任树明",
          "prize": "二等奖",
          "opus_id": 11918,
          "numbers": 11059,
          "type": 3
      },
      {
          "id": 3,
          "name": "刘燕明",
          "prize": "二等奖",
          "opus_id": 11440,
          "numbers": 8941,
          "type": 3
      },
      {
          "id": 9,
          "name": "张燕书",
          "prize": "二等奖",
          "opus_id": 16564,
          "numbers": 8000,
          "type": 3
      },
      {
          "id": 2,
          "name": "翼向天开",
          "prize": "三等奖",
          "opus_id": 1576,
          "numbers": 7802,
          "type": 3
      },
      {
          "id": 19,
          "name": "蒋引丝",
          "prize": "三等奖",
          "opus_id": 8777,
          "numbers": 6111,
          "type": 3
      },
      {
          "id": 16,
          "name": "HY8399qjR0",
          "prize": "三等奖",
          "opus_id": 10475,
          "numbers": 5496,
          "type": 3
      },
      {
          "id": 5,
          "name": "沛文",
          "prize": "优秀奖",
          "opus_id": 541,
          "numbers": 5292,
          "type": 3
      },
      {
          "id": 11,
          "name": "左鸣",
          "prize": "优秀奖",
          "opus_id": 12336,
          "numbers": 5179,
          "type": 3
      }
  ],
  categoryIndex: 0,
  category:[{"id":1,"name":"书法","type":1},{"id":2,"name":"绘画","type":1},{"id":3,"name":"诗词","type":1},{"id":5,"name":"剪纸","type":1},{"id":8,"name":"先进事迹","type":1},{"id":9,"name":"散文","type":1},{"id":10,"name":"素描","type":1},{"id":12,"name":"声乐创作","type":2}]
  },

  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type,
      scollTop: 0
    })
    // 获取当前数据,分类表的显示略有不同
    console.log(e.currentTarget.dataset.type)
  },
  openRule(){
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    });
  },
  classifyChange(e){
    this.setData({
      categoryIndex:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      title:"获奖排行",
      path: `pages/voteWinner/voteWinner`,
    };
  }
})