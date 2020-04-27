// components/voteCard/voteCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    voteItem:{
      type: Object,
      value: {}
    },
    voteIndex: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColor: '#0071B3'
  },
  lifetimes:{
    created(){
      console.log("created");
      wx.createIntersectionObserver().relativeToViewport({ bottom: 50 }).observe('.vote-item', (res) => {
        this.data.bgColor = "red"
        console.log("可视区100px", this.data.bgColor)
        // res.intersectionRatio // 相交区域占目标节点的布局区域的比例
        // res.intersectionRect // 相交区域
        // res.intersectionRect.left // 相交区域的左边界坐标
        // res.intersectionRect.top // 相交区域的上边界坐标
        // res.intersectionRect.width // 相交区域的宽度
        // res.intersectionRect.height // 相交区域的高度
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(e) {
      let id = this.data.voteItem;
      let index = this.data.voteIndex;
      console.log("详情",id,index)
      //作品详情页
      wx.navigateTo({
        url:
          "/pages/voteDetail/voteDetail?voteid=" + id +
          "&index=" + index
      });
    },
    giveLike(e) {
      // let item = this.data.voteItem;
      let index = this.data.voteIndex;
      // console.log("对象", item)
      this.triggerEvent('giveLike', index)
    },
  }
})
