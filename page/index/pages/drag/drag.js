// drag/drag.js

/*
 * @Date: 2019-11-25 13:52:25
 * @LastEditors: hxz
 * @LastEditTime: 2019-11-29 17:44:00
 */
const app = getApp()
Page({
  data: {
    sortList: [] /* 排序列表 */,
    currentItem: -1 /* 拖动目标 */,
    touch: false /* 排序列表是否在编辑状态中  */,
    /* 备选 */
    moldY: 0,
    altList: [] /* 备选列表 */,
    guideNum: 1
  },
  pageName: '分类配置页面',
  private: {
    startX: 0 /* 拖动目标标准坐标(计算偏移的基准点)  */,
    startY: 0,
    startSort: 0 /* 拖动目标开始sort值 */,
    flyId: -1 /* 飞动目标 */,
    sortState: false /* 是否当前选中目标是否可拖动 */,
    ratio: 1 /* 适配比率 */,
    curX: 0,
    curY: 0,
    move: false, /* 判断目标元素是否移动过 : 没移动过则不执行touchend(否则会闪动)   */
    anime: false,
    queue: []
  },
  guide: 0,
  onLoad: function (ops) {
    this.currentTab = ops.index
    let pages = getCurrentPages();
    this.beforePage = pages[0];
    this.getCategory()
  },
  onShow() {
  },
  onUnload() {
  },
  getCategory() {
    app.user.getLessonCategory().then(msg => {
      let arr1 = [
        { id: 1, name: "推荐", unMove: true }
      ];
      msg.data.user_lesson_category.forEach((i, index) => {
        arr1.push(i)
      })
      arr1[this.currentTab]['class'] = true
      const res = wx.getSystemInfoSync();
      this.private.ratio = Math.floor((res.windowWidth * 100) / 375) / 100;

      let sortArr = arr1;
      sortArr.forEach((v, i) => {
        v.sort = i;
        let { x, y } = this.getPosition(i);
        v.x = x;
        v.y = y;
      });
      let arr2 = msg.data.user_define_lesson_category;;
      let altArr = arr2;
      let originY = this.getMoldStart(sortArr.length);
      altArr.forEach((v, i) => {
        let { x, y } = this.getPosition(i);
        v.x = x;
        v.y = y + originY;
      });
      this.setData({
        sortList: sortArr,
        altList: altArr
      });
    })
  },
  edit() {
    if (this.data.touch) {
      let arr = JSON.parse(JSON.stringify(this.data.sortList)), num = '', number = 0
      arr.sort((a, b) => {
        return a.sort - b.sort
      })
      arr.forEach((i, index) => {
        index != 0 ? num = `${num},${i.id}` : ''
        i['class'] ? number = i.id : ''
      })
      let param = {
        category_str: num.substring(1)
      }
      this.addCategory(param).then(() => {
        this.beforePage.getCategory().then(() => {
          this.beforePage.lastswitchTab(number)
        })
      })
    }
    this.setData({
      touch: !this.data.touch
    });

  },
  /* 开启拖动排序状态 */
  longpress(e) {
    if (this.data.touch) return;
    this.setData({
      touch: true
    });
    this.touchstart(e);
  },
  /* 获取拖动目标及其初始位置 */
  touchstart(e) {
    let id = e.currentTarget.dataset.id;
    if (!this.data.touch || id == undefined || this.private.anime) return;
    let block = this.data.sortList.find(v => v.id == id);
    this.private.startX = block.x;
    this.private.startY = block.y;
    this.private.startSort = block.sort;
    this.private.sortState = !block.unMove;
    this.setData({
      currentItem: id
    });
  },
  /* 拖动是否改变排序   ||  删减目标飞动是否结束   */
  change(e) {
    /* sort */
    if (e.detail.source == "touch" && this.private.sortState) {
      let { x, y } = e.detail;
      this.private.move = true;
      this.private.curX = x;
      this.private.curY = y;
      let targetId =
        Math.round((x - this.private.startX) / (120 * this.private.ratio)) +
        Math.round((y - this.private.startY) / (60 * this.private.ratio)) * 3 +
        this.private.startSort;
      /* 拖动范围(1  ~  this.sortList.length - 1) */
      if (targetId < 1) targetId = 1;
      if (targetId > this.data.sortList.length - 1)
        targetId = this.data.sortList.length - 1;
      this.compare(targetId);
      return false;
    }
    /* fly */
    let id = e.currentTarget.dataset.id;
    if (id && id == this.private.flyId) {
      let index = this.data.sortList.findIndex(v => v.id == id);
      let block = this.data.sortList[index];
      let { x, y } = e.detail;
      if (
        block.x.toFixed(1) == x.toFixed(1) &&
        block.y.toFixed(1) == y.toFixed(1)
      ) {
        let temp1 = this.data.sortList;
        temp1.splice(index, 1);
        block.fly = false;
        this.private.flyId = -1;

        this.setData({
          sortList: temp1,
          "altList[0]": block
        });
        console.log("fly end");
      }
    }
  },
  compare(val) {
    if (val == this.private.startSort) return;
    if (val > this.private.startSort) {
      this.private.queue.unshift({
        start: this.private.startSort + 1,
        end: val,
        arrow: -1
      });
    } else {
      this.private.queue.unshift({
        start: val,
        end: this.private.startSort - 1,
        arrow: +1
      });
    }
    let { x, y } = this.getPosition(val);
    this.private.startX = x;
    this.private.startY = y;
    this.private.startSort = val;
    if (!this.private.anime && this.private.queue) {
      this.private.anime = true;
      this.sortMove("start");
    }
  },
  /* 停止拖动 */
  touchend(e) {
    if (!this.private.sortState) return;
    this.private.sortState = false;
    /* 若当前目标在飞动状态则不执行 */
    if (
      e.target.dataset.id == e.currentTarget.dataset.id &&
      this.private.move &&
      !this.private.anime

    ) {
      this.targetStop()
    }
  },
  targetStop() {
    let index = this.data.sortList.findIndex(
      v => v.id == this.data.currentItem
    );
    let curBlock = this.data.sortList[index];
    curBlock.x = this.private.curX;
    curBlock.y = this.private.curY;
    let key = "sortList[" + index + "]";
    this.private.move = false;
    console.log("touchend");
    this.setData({
      [key]: curBlock
    });
    /* 确保最后一次change的值已修改完成 ，否则可能touchend先修改，change在这之后又修改回去 */
    setTimeout(() => {
      curBlock.x = this.private.startX;
      curBlock.y = this.private.startY;
      let key = "sortList[" + index + "]";
      this.setData({
        currentItem: -1,
        [key]: curBlock
      });
    }, 50);
  },
  /* 拖动重新排序 */
  sortMove(way) {
    let { start, end, arrow } = this.private.queue.pop();
    let arr = this.data.sortList;
    if (arrow > 0) {
      for (let i = end; i >= start; i--) {
        let index = arr.findIndex(v => v.sort == i);
        let Block = arr[index];
        Block.sort += arrow;
        let { x, y } = this.getPosition(Block.sort);
        Block.x = x;
        Block.y = y;
        let key = "sortList[" + index + "]";
        this.setData({
          [key]: Block
        });
      }
    } else {
      for (let i = start; i <= end; i++) {
        let index = arr.findIndex(v => v.sort == i);
        let Block = arr[index];
        Block.sort += arrow;
        let { x, y } = this.getPosition(Block.sort);
        Block.x = x;
        Block.y = y;
        let key = "sortList[" + index + "]";
        this.setData({
          [key]: Block
        });
      }
    }
    let curIndex = arr.findIndex(v => v.id == this.data.currentItem);
    let curBlock = arr[curIndex];
    curBlock.sort = arrow > 0 ? start : end;
    setTimeout(() => {
      if (this.private.queue.length) {
        this.sortMove("iteration");
      } else {
        console.log("anime end");
        this.private.anime = false;
        !this.private.sortState && this.targetStop();
      }
    }, 50);
  },
  /* 计算位置 */
  getPosition(sort) {
    let x = Math.floor((sort % 3) * 120 * this.private.ratio * 10) / 10;
    let y =
      Math.floor(Math.floor(sort / 3) * 60 * this.private.ratio * 10) / 10;
    return { x, y };
  },
  /* 从备选列表往排序列表添加元素 */
  add(e) {
    if (this.private.flyId > 0) return;
    let i = e.currentTarget.dataset.index;
    let { x, y } = this.getPosition(this.data.sortList.length);
    let block = this.data.altList[i];
    block.sort = this.data.sortList.length;
    block.x = x;
    block.y = y;
    block.fly = true;
    let arr = this.data.altList;
    arr.splice(i, 1, block);
    let originY = this.getMoldStart(+1);
    /* 目标元素之前的模块考虑originY是否会改变 */
    for (let m = 0; m < i; m++) {
      let { x, y } = this.getPosition(m);
      let temp = arr[m];
      temp.x = x;
      temp.y = y + originY;
    }
    /* 目标元素之后的模块前进一位 */
    for (let s = i + 1; s < arr.length; s++) {
      let { x, y } = this.getPosition(s - 1);
      let temp = arr[s];
      temp.x = x;
      temp.y = y + originY;
    }
    this.private.flyId = block.id;
    this.setData({
      altList: arr
    });
    let num = ''
    setTimeout(() => {
      this.data.sortList.forEach((i, index) => {
        index != 0 ? num = `${num},${i.id}` : ''
      })
      let param = {
        category_str: num.substring(1)
      }
      this.addCategory(param).then(() => {
        this.beforePage.getCategory()
      })
    }, 500)
  },
  /* 收藏分类 */
  addCategory(param) {
    return app.user.collectLessonCategory(param).then()
  },
  /* 排序列表删除元素 */
  remove(e) {
    if (this.private.flyId > 0) return;
    let i = e.target.dataset.index;
    i == (this.data.sortList.length - 1) ? this.sorIndex = true : ''
    let arr1 = this.data.sortList;
    let originY = this.getMoldStart(-1);
    let block = arr1[i];
    block.x = 0;
    block.y = originY;
    block.fly = true;
    arr1.splice(i, 1, block);
    arr1.forEach((v, i) => {
      if (v.sort > block.sort) {
        let { x, y } = this.getPosition(v.sort - 1);
        v.sort -= 1;
        v.x = x;
        v.y = y;
      }
    });

    let arr2 = this.data.altList;
    arr2.unshift({});
    arr2.forEach((v, i) => {
      let { x, y } = this.getPosition(i);
      v.x = x;
      v.y = y + originY;
    });

    this.private.flyId = block.id;

    this.setData({
      sortList: arr1,
      altList: arr2,
      currentItem: -1
    });
    setTimeout(() => {
      let num = ''
      this.data.sortList.forEach((i, index) => {
        index != 0 ? num = `${num},${i.id}` : ''
      })
      let param = {
        category_str: num.substring(1)
      }
      this.addCategory(param).then(() => {
        this.beforePage.getCategory()
      })
    }, 500)
  },
  /* 备选列表元素飞动停止 */
  addfly(e) {
    let id = e.currentTarget.dataset.id;
    if (id && id == this.private.flyId) {
      let index = this.data.altList.findIndex(v => v.id == id);
      let block = this.data.altList[index];
      let { x, y } = e.detail;
      if (
        Math.round(block.x) == Math.round(x) &&
        Math.round(block.y) == Math.round(y)
      ) {
        let arr1 = this.data.altList;
        arr1.splice(index, 1);
        block.fly = false;
        let key = "sortList[" + this.data.sortList.length + "]";
        this.private.flyId = -1;
        this.setData({
          altList: arr1,
          [key]: block
        });
        console.log("fly end");
      }
    }
  },
  getMoldStart(offset = 0) {
    let moldStartY =
      Math.ceil((this.data.sortList.length + offset) / 3) *
      60 *
      this.private.ratio;
    this.setData({
      moldY: moldStartY
    });
    return Math.floor((moldStartY + 45 * this.private.ratio) * 10) / 10;
  },
  moveontab(e) {
    if (!this.data.touch) {
      this.beforePage.lastswitchTab(e.currentTarget.dataset.id)
      wx.navigateBack()
    }
  },
  nextguid() {
    if (this.data.guideNum == 1) {
      this.setData({
        guideNum: 2,
        touch: !this.data.touch
      })
    } else {
      if (this.guide) return
      this.guide = true
      this.setData({
        guideNum: 3,
        touch: !this.data.touch
      })
      let param = {
        guide_name: 'lesson_category'
      }
      app.user.guideRecordAdd(param).then(res => {
        app.getGuide()
      }).catch(() => {
        this.guide = 0
        err.msg == '记录已增加' ? app.setState({ 'newGuide.lesson_category': 1 }) : ''
      })
    }
  }
});
