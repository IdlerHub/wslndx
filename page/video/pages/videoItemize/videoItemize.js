/*
 * Page videoItemize
 * @Date: 2019-06-15 18:10:21
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:31:59
 */
const app = getApp();

Page({
  data: {
    list: [],
    category: {}
  },
  pageName: "短视频分类页（点击短视频头像进入页）",
  params: {
    page: 1,
    pageSize: 14
  },
  //options(Object)
  onLoad: function(ops) {
    this.setData({
      vistor: ops.share == "true"
    });
    this.params.categoryId = ops.categoryId;
    this.getSearch();
  },
  getSearch: function() {
    return app.video.search(this.params).then(res => {
      if (res.data.lists) {
        res.data.lists.forEach(item => {
          item.praise >= 10000
            ? (item.praise = (item.praise / 10000).toFixed(1) + "W")
            : null;
        });
        if (this.params.page == 1) {
          let desc_type = res.data.total;
          desc_type.total_num >= 10000
            ? (desc_type.total_num =
                (desc_type.total_num / 10000).toFixed(1) + "W")
            : null;
          desc_type.praise_num >= 10000
            ? (desc_type.praise_num =
                (desc_type.praise_num / 10000).toFixed(1) + "W")
            : null;
          this.setData({
            list: res.data.lists,
            category: res.data.total
          });
          wx.setNavigationBarTitle({
            title: res.data.total.category_name
          });
        } else {
          this.setData({
            list: this.data.list.concat(res.data.lists)
          });
        }
      }
    });
  },
  onShow: function() {},
  onPullDownRefresh: function() {
    this.params.page = 1;
    this.getSearch().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function() {
    this.params.page += 1;
    this.getSearch();
  },
  nav(e) {
    let id = e.currentTarget.dataset.id;
    let end = this.data.vistor ? "&home=true" : "";
    wx.navigateTo({
      url:
        "../videoTwo/videoTwo?id=" +
        id +
        "&categoryId=" +
        this.params.categoryId +
        end +
        "&title=" +
        this.data.category.category_name
    });
    wx.uma.trackEvent("sortVideo_classify", {
      ["categoryId_" + this.data.category.category_id]: e.currentTarget.dataset
        .name
    });
  },
  tohome: function() {
    wx.reLaunch({ url: "/pages/index/index" });
  }
});
