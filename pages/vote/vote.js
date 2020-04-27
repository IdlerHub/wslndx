// pages/vote/vote.js
import { wxp } from "../../utils/service.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [{ id: "0", name: "全部" }],
    selectedIndex: 0,
    type: 0, //分类的id
    newProduction: [],
    productionList: [],
    infoFlag: {}, //活动时间以及弹窗提示信息
    page: 1,
    total_page: 1
    // supportFlag: 1 //今日点赞权限 0=无, 1=有
  },
  toRule() {
    //跳转到活动规则
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    });
  },
  toClassify() {
    //分类页
    wx.navigateTo({
      url: "/pages/voteClassify/voteClassify"
    });
  },
  toDetail(e) {
    //作品详情页
    wx.navigateTo({
      url:
        "/pages/voteDetail/voteDetail?voteid=" +
        e.currentTarget.dataset.id +
        "&index=" +
        e.currentTarget.dataset.index
    });
  },
  toSearch() {
    wx.navigateTo({
      url: "/pages/voteSearch/voteSearch"
    });
  },
  setLikeData(index) {
    wx.showToast({
      title: "点赞成功",
      icon: "none",
      duration: 2500
    });
    let work = this.data.productionList[index];
    if (work.prise_numbers < 10000) work.prise_numbers += 1;
    work.is_praise = 1;
    let key = "productionList[" + index + "]";
    this.setData({
      [key]: work,
      // supportFlag: 0
    });
  },
  giveLike(e) {
    //点赞
    //step 活动是否过期
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if (this.data.infoFlag.flag == 0) {
      wx.showToast({
        title: this.data.infoFlag.msg,
        icon: "none",
        duration: 1500
      });
    } else {
      // let index = e.currentTarget.dataset.index;
      let index = e.detail;
      let work = this.data.productionList[index];
      console.log("点赞",index)
      if (work.is_praise == 1) {
        //提示
        wx.showToast({
          title: "您今日已点赞,去看看其他作品~",
          icon: "none",
          duration: 1500
        });
      } else {
        // let index = e.currentTarget.dataset.index;
        // let work = this.data.productionList[index];
        let params = {
          id: work.id,
          type: work.hoc_id //需要作品带的type
        };
        this.praiseOpus(params,index);
      }
    }
  },
  changeclassify(e) {
    //切换分类
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    if (index != this.data.selectedIndex) {
      this.getCategory();
      this.setData({
        selectedIndex: index,
        type: type
      });
      this.getdata(1);
    }
  },

  join() {
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    });
  },
  works() {
    wx.navigateTo({
      url: "/pages/myProduction/myProduction"
    });
  },
  getNewestOpus() {
    //获取最新作品
    app.vote.getNewestOpus().then(res => {
      this.setData({
        newProduction: res.data
      });
    });
  },
  getdata(page) {
    // 请求作品列表数据
    var params = {
      type: this.data.type,
      page: page
    };
    let data = [];
    let total_page = 1;
    app.vote.getOpusList(params).then(res => {
      if (page == 1) {
        data = res.data.data;
      } else {
        var oldData = this.data.productionList;
        data = oldData.concat(res.data.data);
      }
      total_page = res.data.total_page;
      this.setData({
        productionList: data,
        page: page,
        // supportFlag: res.data.have_praise,
        infoFlag: res.data.info,
        total_page: total_page
      });
    });
    //xhr (selectedIndex , page)
    //  setData ({  selectedIndex , page  })
  },
  getCategory() {
    //获取分类数据
    let data = [{ id: "0", name: "全部" }];
    app.vote.getCategory().then(res => {
      data = data.concat(res.data.data);
      this.setData({
        classifyList: data
      });
    });
  },
  praiseOpus(params,index) {
    app.vote
      .praiseOpus(params)
      .then(res => {
        console.log("点赞",res)
        this.setLikeData(index);
      })
      .catch(err => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500
        });
      });
  },
  changeData(index, type) {
    this.setData({
      selectedIndex: index,
      type: type
    });
    this.getdata(1);
  },
  init() {
    return Promise.all([
      this.getCategory(),
      this.getdata(1),
      this.getNewestOpus()
    ]);
  },
  onLoad() {
    this.init();
    
  },
  onPullDownRefresh() {
    this.init().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    let page = this.data.page;
    if(page < this.data.total_page){
      this.getdata(page + 1);
    }else{
      wx.showToast({
        icon: "none",
        title: "已经没有数据了哦",
        duration: 1000
      });
    }
  }
});
