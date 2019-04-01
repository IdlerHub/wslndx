//index.js
//获取应用实例
const app = getApp();
var ald = require('../../utils/ald-stat.js');
Page({
    data: {
        IMG_URL: app.IMG_URL,
        nav: [{ name: '推荐', class: '.recommend' }, { name: '分类', class: '.category' }],
        height: 0
    },
    onShow() {
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
        this.setData({
            userInfo: userInfo,
            navigateTo: false
        })
        this.historyParam = { page: 1, pageSize: 10 };
        this.getHistory([]);
    },
    onLoad(options) {
        var that = this;
        this.param = { page: 1, pageSize: 10 };
        let reg = /ios/i;
        let pt = 20; //导航状态栏上内边距
        let h = 44; //导航状态栏高度
        let systemInfo = wx.getSystemInfoSync();
        pt = systemInfo.statusBarHeight;
        if (!reg.test(systemInfo.system)) {
            h = 48
        };
        that.setData({
            top: pt + h,
        })
        let windowHeight = systemInfo.windowHeight;
        let query = wx.createSelectorQuery().in(that);
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
        })
        this.getRecommend();
        this.getCategory();
    },
    setHeight() {
        var that = this;
        var nav = this.data.nav;
        var currentTab = this.data.currentTab;
        let query = wx.createSelectorQuery().in(that);
        query.select(nav[currentTab].class).boundingClientRect();
        query.exec((res) => {
            let height = res[0].height;
            that.setData({
                height: height
            });
        });
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
        this.setHeight()
    },
    switchTab(event) {
        var cur = event.detail.current;
        this.setData({
            currentTab: cur,
        })
        this.setHeight()
    },
    getUserInfo(e) {
        var that = this;
        if (e.detail.errMsg != 'getUserInfo:ok') return
        var param = {
            userInfo: JSON.stringify(e.detail.userInfo),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
        }
        app.user.profile(param, function(msg) {
            if (msg.code == 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo)
                wx.setStorageSync('visitedNum', [])
                var userInfo = wx.getStorageSync('userInfo');
                if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
                that.setData({
                    userInfo: userInfo,
                })
            }
        }, function() {})
    },
    getRecommend(list, callback) {
        var that = this;
        var recommend = list ? list : that.data.recommend;
        wx.showNavigationBarLoading()
        app.classroom.recommend(this.param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    item.bw = app.util.tow(item.browse);
                    recommend.push(item);
                })
                that.setData({
                    recommend: recommend
                })
            }
            that.setHeight()
            if (callback) {
                callback();
            }
        }, function() {})
    },
    getCategory(list, callback) {
        var that = this;
        var category = list ? list : that.data.category;
        wx.showNavigationBarLoading()
        app.classroom.category(function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    category.push(item);
                })
                that.setData({
                    category: category
                })
            }
            that.setHeight()
            if (callback) {
                callback();
            }
        }, function() {})
    },
    getHistory(list, callback) {
        var that = this;
        var history = that.data.history;
        var list = list ? list : that.data.history.history;
        wx.showNavigationBarLoading()
        app.user.history(this.historyParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                for (let i in msg.data.history) {
                    msg.data.history[i].forEach(function(item) {
                        item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
                    })
                    list.push({ date: i, data: msg.data.history[i] });
                }
                that.setData({
                    'history.history': list,
                    'history.last_lesson': msg.data.last_lesson
                })
            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    toUser() {
        if (!this.data.navigateTo) {
            wx.navigateTo({
                url: '../user/user',
            })
        }
    },
    toInfo() {
        this.setData({
            navigateTo: true
        })
        wx.navigateTo({
            url: '../info/info',
        })
    },
    toVideo() {
        if (!this.data.userInfo.nickname) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '您还没有授权，请先授权',
                success: function(res) {
                    if (res.confirm) {

                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '../video/video',
            })
        }
    },
    toPost() {
        if (!this.data.userInfo.nickname) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '您还没有授权，请先授权',
                success: function(res) {
                    if (res.confirm) {

                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '../post/post',
            })
        }
    },
    onPageScroll(e) {
        if (e.scrollTop >= this.headerHeight - this.navHeight) {
            this.setData({
                scroll: true
            })
        } else {
            this.setData({
                scroll: false
            })
        }
    },
    //下拉刷新
    onPullDownRefresh() {
        this.param.page = 1;
        this.getRecommend([], function() {
            wx.stopPullDownRefresh();
        });
        this.getCategory([]);
    },
    //上拉加载
    onReachBottom() {
        var that = this;
        var currentTab = this.data.currentTab;
        switch (currentTab) {
            case 0:
                that.param.page++;
                that.getRecommend();
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
    onShareAppMessage: function(res) {
        return {
            path: 'pages/index/index'
        }
    },
})