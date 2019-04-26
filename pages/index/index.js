//index.js
//获取应用实例
const app = getApp();
var ald = require('../../utils/ald-stat.js');
Page({
    data: {
        IMG_URL: app.IMG_URL,
        nav: [{ name: '推荐', class: '.recommend' }, { name: '分类', class: '.category' }],
        height: 0,
        isRefreshing: false
    },
    onLoad() {
        /*todo:考虑去掉that*/
        let that = this;
        this.param = { page: 1, pageSize: 10 };
        let reg = /ios/i;
        let pt = 20; //导航状态栏上内边距
        let h = 44; //导航状态栏高度
        let systemInfo = wx.getSystemInfoSync();
        pt = systemInfo.statusBarHeight;
        if (!reg.test(systemInfo.system)) {
            h = 48
        }
        this.setData({
            top: pt + h,
        });
        let windowHeight = systemInfo.windowHeight;
        let query = wx.createSelectorQuery().in(this);
        query.select('.top').boundingClientRect();
        query.select('.nav').boundingClientRect();
        query.exec((res) => {
            that.headerHeight = res[0].height;
            that.navHeight = res[1].height;
            that.scrollViewHeight = windowHeight - that.headerHeight - that.navHeight;
        });
        this.setData({
            recommend: [],
            category: [],
            history: {},
            currentTab: 0,
            navScrollLeft: 0,
        });
        this.getRecommend();
        this.getCategory();
    },
    onReady: function() {
        setTimeout(wx.hideLoading, 500);
    },
    onShow() {
        this.init();
    },
    init() {
        let userInfo = wx.getStorageSync('userInfo');
        /* 地区格式化 */
        userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
        /* 电话号码隐藏 */
        userInfo.telShow = userInfo.mobile.substr(0, 3) + '****' + userInfo.mobile.substr(7, 4);
        this.setData({
            userInfo: userInfo
        });
        if (userInfo.mobile) {
            this.historyParam = { page: 1, pageSize: 10 };
            this.getHistory([]);
        }
    },
    setHeight() {
        /*todo:考虑去掉that*/
        let that = this;
        let nav = this.data.nav;
        let currentTab = this.data.currentTab;
        let query = wx.createSelectorQuery().in(this);
        query.select(nav[currentTab].class).boundingClientRect();
        query.exec((res) => {
            let height = res[0].height;
            that.setData({
                height: height
            });
        });
    },
    switchNav(event) {
        let cur = event.currentTarget.dataset.current;
        if (this.data.currentTab !== cur) {
            this.setData({
                currentTab: cur
            })
        }
        this.setHeight();
    },
    switchTab(event) {
        let cur = event.detail.current;
        this.setData({
            currentTab: cur,
        });
        this.setHeight();
    },
    getRecommend(list) {
        let recommend = list || this.data.recommend;
        wx.showNavigationBarLoading();
        return app.classroom.recommend(this.param).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    item.bw = app.util.tow(item.browse);
                    recommend.push(item);
                });
                this.setData({
                    recommend: recommend
                })
            }
            this.setHeight();
        })
    },
    getCategory(list) {
        let category = list || this.data.category;
        wx.showNavigationBarLoading();
        return app.classroom.category().then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                this.setData({
                    category: category.concat(msg.data)
                })
            }
            this.setHeight();
        });
    },
    getHistory(list) {
        let temp = list || this.data.history.history;
        wx.showNavigationBarLoading();
        return app.user.history(this.historyParam).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                for (let i in msg.data.history) {
                    msg.data.history[i].forEach(function(item) {
                        item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
                    });
                    temp.push({ date: i, data: msg.data.history[i] });
                }
                this.setData({
                    'history.history': temp,
                    'history.last_lesson': msg.data.last_lesson
                })
            }
        })
    },
    toUser() {
        wx.navigateTo({
            url: '../user/user',
        })
    },
    toInfo() {
        wx.navigateTo({
            url: '../info/info',
        })
    },
    toVideo() {
        wx.navigateTo({
            url: '../video/video',
        })
    },
    toPost() {
        wx.navigateTo({
            url: '../post/post',
        })
    },
    onPageScroll(e) {
        if (e.scrollTop >= this.headerHeight - this.navHeight) {
            (!this.data.scroll) && this.setData({
                scroll: true
            })
        } else {
            (this.data.scroll) && this.setData({
                scroll: false
            })
        }
    },
    //下拉刷新
    onPullDownRefresh() {
        this.param.page = 1;
        this.setData({
            isRefreshing: true
        });
        this.getRecommend([]).then(() => {
            wx.stopPullDownRefresh();
            let timer = setTimeout(() => {
                this.setData({
                    isRefreshing: false
                }, () => {
                    clearTimeout(timer)
                })
            }, 1000)
        });
        this.getCategory([]);
    },
    //上拉加载
    onReachBottom() {
        let currentTab = this.data.currentTab;
        switch (currentTab) {
            case 0:
                this.param.page++;
                this.getRecommend();
                break;
        }
    },
    showAgain: function() {
        wx.showToast({
            title: '请先授权~',
            mask: true,
            icon: 'none',
            duration: 2000
        })
    },
    //继续播放
    historyTap: function(e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play`
        });
        //用于数据统计
        app.aldstat.sendEvent('继续播放', { "name": e.currentTarget.dataset.title })
    },
    //点击推荐课堂
    detailTap: function(e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&name=${e.currentTarget.dataset.item.title}`
        });
        //用于数据统计
        app.aldstat.sendEvent('推荐栏目课程点击', { "name": e.currentTarget.dataset.item.title })
    },
    //分类点击
    categoryTap: function(data) {
        wx.navigateTo({
            url: `../category/category?id=${data.currentTarget.dataset.item.id}&name=${data.currentTarget.dataset.item.name}&img=${data.currentTarget.dataset.item.top_image}`
        });
        //用于数据统计
        app.aldstat.sendEvent('点击分类按钮', { "name": "点击分类按钮" })
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "首页" })
    },
    // 转发
    onShareAppMessage: function() {
        return {
            path: 'pages/index/index'
        }
    },
    // 用户昵称等信息授权
    onGotUserInfo(e) {
        if (e.detail.errMsg === "getUserInfo:ok") {
            app.updateBase(e, this);
            if (e.currentTarget.dataset.role == 'user') {
                this.toUser();
            } else {
                this.toPost();
            }

        }
    }
})