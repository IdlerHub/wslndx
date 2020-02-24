// pages/strategy/strategy.js
const app = getApp();
var htmlparser = require("../../utils/htmlparser.js");
Page({
  data: {
    current:1
  },
  onLoad: function (options) {
    let content = '<p style="text-align: center;"><img src="https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/ad0b1238a18302a3d618d7fa3135c3b4.jpg" title="微信图片_20191204160639.jpg" width="200" height="200" alt="微信图片_20191204160639.jpg" style="width: 200px; height: 200px;"/></p>' ,
     rule = '<p style="text-align:center"><img src="https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/4ba48f07e4e1250714268861d5fa3bde.jpg" title="" alt="" width="353" height="319" style="width: 353px; height: 319px;"/></p><p style="line-height: 1.5em;"><span style="color: rgb(247, 150, 70);">辅导老师给对方留个是的立法机构和；是快乐的价格和看似简单更何况多少积分更何况技术的航空技术的韩国看电视剧h</span><br/></p>'
    content = htmlparser.default(content)
    rule = htmlparser.default(rule)
    this.setData({
      content,
      rule
    })
  },
  onShow: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  check(e) {
    e.currentTarget.dataset.type ? this.setData({
      current: 2
    }) : this.setData({
      current: 1
    })
  }
})