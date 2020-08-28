// page/vote/components/votecard/voteCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    voteItem: {
      type: Object,
      value: {},
    },
    voteIndex: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColor: "#E04000",
    height: 0, //卡片高度，用来做外部懒加载的占位
    showSlot: true, //控制是否显示当前的slot内容
    skeletonId: "",
  },
  lifetimes: {
    ready() {
      this.setData({
        skeletonId: this.randomString(8), //设置唯一标识
      });
      wx.nextTick(() => {
        // 修改了监听是否显示内容的方法，改为前后showNum屏高度渲染
        // 监听进入屏幕的范围relativeToViewport({top: xxx, bottom: xxx})
        // let info = SystemInfo.getInfo()
        let info = wx.getStorageSync("SystemInfo");
        if (!info) {
          info = this.fetchAllInfo();
        }
        let { windowHeight = 667 } = info.source.system;
        let showNum = 3; //超过屏幕的数量，目前这个设置是上下3屏
        try {
          this.extData.listItemContainer = this.createIntersectionObserver();
          this.extData.listItemContainer
            .relativeToViewport({
              top: showNum * windowHeight,
              bottom: showNum * windowHeight,
            })
            .observe(`#list-item-${this.data.skeletonId}`, (res) => {
              let { intersectionRatio } = res;
              if (intersectionRatio === 0) {
                // console.log('隐藏', this.data.skeletonId, '超过预定范围，从页面卸载')
                this.setData({
                  showSlot: false,
                });
              } else {
                // console.log('显示', this.data.skeletonId, '达到预定范围，渲染进页面')
                this.setData({
                  showSlot: true,
                  height: res.boundingClientRect.height,
                });
              }
            });
        } catch (error) {
          console.log(error);
        }
      });
    },
    created() {
      //设置一个走setData的数据池
      this.extData = {
        listItemContainer: null,
      };
    },
    detached() {
      try {
        this.extData.listItemContainer.disconnect();
      } catch (error) {
        console.log(error);
      }
      this.extData = null;
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchAllInfo() {
      //没有获取到系统信息的话
      const menuButton = wx.getMenuButtonBoundingClientRect();
      const systemInfo = wx.getSystemInfoSync();

      const statusBarHeight = systemInfo.statusBarHeight;
      const headerHeight =
        (menuButton.top - systemInfo.statusBarHeight) * 2 + menuButton.height;

      let data = {
        source: {
          menu: menuButton,
          system: systemInfo,
        },
        statusBarHeight: statusBarHeight,
        headerHeight: headerHeight,
        headerRight: systemInfo.windowWidth - menuButton.left,
      };

      wx.setStorageSync("SystemInfo", data);
      return data;
    },
    toDetail(e) {
      let item = this.data.voteItem;
      let index = this.data.voteIndex;
      //作品详情页
      wx.navigateTo({
        url:
          "/page/vote/pages/voteArticle/voteArticle?voteid=" +
          item.id +
          "&index=" +
          index,
      });
    },
    giveLike(e) {
      // let item = this.data.voteItem;
      let index = this.data.voteIndex;
      this.triggerEvent("giveLike", index);
    },
    randomString(len) {
      len = len || 32;
      var $chars =
        "abcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
  },
});
