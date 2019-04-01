//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        nav: [{ name: '评论', class: '.comment' }, { name: '点赞', class: '.praise' }, ],
    },
    onLoad(options) {
        var that = this;
        this.id = options.id;
        this.comParam = this.praParam = { blog_id: this.id, page: 1, pageSize: 10 }
        if (options.comment) {
            this.show();
        }
        this.setData({
            detail: [],
            comment: [],
            praise: [],
            currentTab: 0,
            navScrollLeft: 0,
            userInfo: wx.getStorageSync('userInfo')
        })
        this.getDetail()
        this.getComment()
        this.getPraise()
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
        this.setHeight();
    },
    switchTab(event) {
        var cur = event.detail.current;
        this.setData({
            currentTab: cur,
        });
        this.setHeight();
    },
    getDetail(callback) {
        var that = this;
        var param = { blog_id: this.id }
        wx.showNavigationBarLoading()
        app.circle.detail(param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                var detail = msg.data[0];
                detail.lw = app.util.tow(detail.likes);
                detail.cw = app.util.tow(detail.comments);
                var arr = [];
                detail.images.forEach(function(i) {
                    arr.push(i.image)
                });
                detail.images = arr;
                detail.auditing = ((new Date()).getTime() - new Date(detail.createtime * 1000)) < 7000 ? true : false;
                detail.pause = true;
                that.setData({
                    detail: detail,
                })
            }
            if (callback) {
                callback();
            }
        }, function() {})
    },
    praise() {
        var that = this;
        var detail = that.data.detail;
        var param = {
            blog_id: detail.id
        }
        if (detail.likestatus == 1) {
            // 取消点赞
            app.circle.delPraise(param, function(msg) {
                if (msg.code == 1) {
                    that.getDetail();
                    that.praParam.page = 1;
                    that.getPraise([]);
                }
            }, function() {})
        } else {
            // 点赞
            app.circle.praise(param, function(msg) {
                if (msg.code == 1) {
                    detail.praising = true;
                    that.setData({
                        detail: detail
                    })
                }
            }, function() {})
        }
    },
    aniend(e) {
        var that = this;
        that.getDetail();
        that.praParam.page = 1;
        that.getPraise([]);
    },
    play() {
        var detail = this.data.detail;
        var videoContext = wx.createVideoContext(String(detail.id));
        videoContext.play();
        this.setData({
            "detail.pause": false
        })
    },
    ended(e) {
        var detail = this.data.detail;
        this.setData({
            "detail.pause": true
        })
    },
    show() {
        this.setData({
            write: true
        })
    },
    hide() {
        this.setData({
            write: false,
            content: null
        })
    },
    input(e) {
        this.setData({
            content: e.detail.value
        })
    },
    // 发布评论
    release() {
        var param = { blog_id: this.id, content: this.data.content }
        if (this.data.content) this.post(param)
    },
    post(param) {
        var that = this;
        that.setData({
            write: false,
            content: null
        })
        wx.showLoading({
            title: '发布中',
        })
        app.circle.comment(param, function(msg) {
            wx.hideLoading()
            if (msg.code == 1) {
                setTimeout(function() {
                    wx.showToast({
                        title: '发布成功',
                        icon: 'none',
                        duration: 1500
                    })
                    that.setData({
                        ['detail.comments']: ++that.data.detail.comments
                    })
                    that.comParam.page = 1;
                    that.getComment([]);
                }, 500)
            } else {
                wx.showToast({
                    title: '发布失败',
                    icon: 'none',
                    duration: 1500
                })
            }
        }, function() {})
    },
    navigator() {
        this.setData({
            write: false,
            content: null
        })
        this.setData({
            write: false
        })
        wx.navigateTo({
            url: '../comment/comment?id=' + this.data.detail.id,
        })
    },
    getComment(list, callback) {
        var that = this;
        var comment = list ? list : that.data.comment;
        wx.showNavigationBarLoading()
        app.circle.getComment(this.comParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    comment.push(item);
                })
                that.setData({
                    comment: comment
                })
            }
            that.setHeight()
            if (callback) {
                callback();
            }
        }, function() {})
    },
    getPraise(list, callback) {
        var that = this;
        var praise = list ? list : that.data.praise;
        wx.showNavigationBarLoading()
        app.circle.getPraise(this.praParam, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    praise.push(item);
                })
                that.setData({
                    praise: praise
                })
            }
            that.setHeight()
            if (callback) {
                callback();
            }
        }, function() {})
    },
    //下拉刷新
    onPullDownRefresh() {
        var that = this;
        var currentTab = this.data.currentTab;
        switch (currentTab) {
            case 0:
                that.comParam.page = 1;
                that.getComment([], function() {
                    wx.stopPullDownRefresh();
                });
                break;
            case 1:
                that.praParam.page = 1;
                that.getPraise([], function() {
                    wx.stopPullDownRefresh();
                });
                break;
        }
    },
    //上拉加载
    onReachBottom() {
        var that = this;
        var currentTab = this.data.currentTab;
        switch (currentTab) {
            case 0:
                that.comParam.page++;
                that.getComment();
                break;
            case 1:
                that.praParam.page++;
                that.getPraise();
                break;
        }
    },
    //图片预览
    previewImage(e) {
        var that = this;
        var urls = [];
        var current = {};
        var urls = e.currentTarget.dataset.urls;
        var current = e.currentTarget.dataset.current;
        wx.previewImage({
            current: current,
            urls: urls // 需要预览的图片http链接列表
        })
    },
    //删除评论
    delComment: function(e) {
        var that = this;
        var param = { blog_id: e.currentTarget.dataset.item.blog_id, id: e.currentTarget.dataset.item.id }
        app.circle.delComment(param, function(msg) {
            wx.hideLoading()
            if (msg.code == 1) {
                setTimeout(function() {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none',
                        duration: 1500
                    })
                    that.setData({
                        ['detail.comments']: --that.data.detail.comments
                    })
                    that.comParam.page = 1;
                    that.getComment([]);
                }, 500)
            } else {
                wx.showToast({
                    title: '删除失败，请稍后重试',
                    icon: 'none',
                    duration: 1500
                })
            }
        }, function() {})
    }
})