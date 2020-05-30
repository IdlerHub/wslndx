module.exports =
    /******/
    (function (modules) { // webpackBootstrap
        /******/ // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/ // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            /******/ // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            /******/
            /******/ // Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ // Flag the module as loaded
            /******/
            module.l = true;
            /******/
            /******/ // Return the exports of the module
            /******/
            return module.exports;
        }
        /******/
        /******/ // expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;
        /******/
        /******/ // expose the module cache
        /******/
        __webpack_require__.c = installedModules;
        /******/
        /******/ // define getter function for harmony exports
        /******/
        __webpack_require__.d = function (exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    enumerable: true,
                    get: getter
                });
            }
        };
        /******/
        /******/ // define __esModule on exports
        /******/
        __webpack_require__.r = function (exports) {
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module'
                });
            }
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
        };
        /******/
        /******/ // create a fake namespace object
        /******/ // mode & 1: value is a module id, require it
        /******/ // mode & 2: merge all properties of value into the ns
        /******/ // mode & 4: return value when already ns object
        /******/ // mode & 8|1: behave like require
        /******/
        __webpack_require__.t = function (value, mode) {
            if (mode & 1) value = __webpack_require__(value);
            if (mode & 8) return value;
            if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, 'default', {
                enumerable: true,
                value: value
            });
            if (mode & 2 && typeof value != 'string')
                for (var key in value) __webpack_require__.d(ns, key, function (key) {
                    return value[key];
                }.bind(null, key));
            return ns;
        };
        /******/
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/
        __webpack_require__.n = function (module) {
            var getter = module && module.__esModule ?
                function getDefault() {
                    return module['default'];
                } :
                function getModuleExports() {
                    return module;
                };
            __webpack_require__.d(getter, 'a', getter);
            return getter;
        };
        /******/
        /******/ // Object.prototype.hasOwnProperty.call
        /******/
        __webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/
        /******/ // __webpack_public_path__
        /******/
        __webpack_require__.p = "";
        /******/
        /******/
        /******/ // Load entry module and return exports
        /******/
        return __webpack_require__(__webpack_require__.s = 0);
        /******/
    })
([
    (function (module, exports, __webpack_require__) {
        "use strict";
        const app = getApp()
        Component({
            options: {
                addGlobalClass: true,
                pureDataPattern: /^_/
            },
            properties: {
                duration: {
                    type: Number,
                    value: 500
                },
                nextRtight: {
                    type: Number,
                    value: 6
                },
                easingFunction: {
                    type: String,
                    value: 'default'
                },
                loop: {
                    type: Boolean,
                    value: true
                },
                videoList: {
                    type: Array,
                    value: [],
                    observer: function observer() {
                        var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                        // this.data.videoTwo ? this.setData({ current: 1, _last: 1 }) :''
                        console.log(newVal)
                        this._videoListChanged(newVal);
                    }
                },
                // prevideoList: {
                //     type: Array,
                //     value: [],
                //     observer: function observer() {
                //         var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                //         this._prevideoListChanged(newVal);
                //     }
                // },
                pause: {
                    type: Boolean,
                    value: false,
                   observer: function observer(){
                        this.videoPause(arguments[0])
                   }
                },
                videoTwo: {
                    type: Boolean,
                    value: false
                }
            },
            data: {
                nextQueue: [],
                prevQueue: [],
                curQueue: [],
                circular: false,
                _last: 0,
                _change: -2,
                _invalidUp: 0,
                _invalidDown: 0,
                _videoContexts: [],
                index: 0,
                current: 0
            },
            param: {
                page: 1,
                pageSize: 10,
                type: "recommend"
            },
            lifetimes: {
                attached: function attached() {
                    this.data._videoContexts = [wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)];
                }
            },
            methods: {
                // _prevideoListChanged: function _videoListChanged(newVal) {
                //     var _this = this;
                //     var data = this.data;
                //     newVal.forEach(function (item) {
                //         data.prevQueue.push(item);
                //     });
                //     if (data.prevQueue.length === 0) {
                //         this.setData({
                //             prevQueue: data.prevQueue.splice(0, 3)
                //         })
                //     }
                // },
                _videoListChanged: function _videoListChanged(newVal) {
                    var _this = this;

                    var data = this.data;
                    newVal.forEach(function (item) {
                        data.nextQueue.push(item);
                    });
                    if (data.curQueue.length === 0 && newVal.length != 0) {
                        this.setData({
                            curQueue: data.nextQueue.splice(0, 3)
                        }, function () {
                            // _this.data.videoTwo ? _this.playCurrent(1, data, true) :
                            _this.playCurrent(0, data);
                        });
                    }  
                    // this.triggerEvent('getpreList', 1)
                },
                animationfinish: function animationfinish(e) {
                    var _data = this.data,
                        _last = _data._last,
                        _change = _data._change,
                        curQueue = _data.curQueue,
                        prevQueue = _data.prevQueue,
                        nextQueue = _data.nextQueue;
                    var current = e.detail.current;
                    var diff = current - _last;
                    if (diff === 0) return;
                    this.data._last = current;
                    this.playCurrent(current, _data);
                    this.triggerEvent('change', {
                        activeId: curQueue[current].id
                    });
                    var direction = diff === 1 || diff === -2 ? 'up' : 'down';
                    if (direction === 'up') {
                        if (this.data._invalidDown === 0) {
                            var change = (_change + 1) % 3;
                            var add = nextQueue.shift();
                            var remove = curQueue[change];
                            if (add) {
                                prevQueue.push(remove);
                                curQueue[change] = add;
                                this.data._change = change;
                            } else {
                                this.data._invalidUp += 1;
                            }
                        } else {
                            this.data._invalidDown -= 1;
                        }
                    }
                    if (direction === 'down') {
                        if (this.data._invalidUp === 0) {
                            var _change2 = _change;
                            var _remove = curQueue[_change2];
                            var _add = prevQueue.pop();
                            if (_add) {
                                curQueue[_change2] = _add;
                                nextQueue.unshift(_remove);
                                this.data._change = (_change2 - 1 + 3) % 3;
                            } else {
                                this.data._invalidDown += 1;
                            }
                        } else {
                            this.data._invalidUp -= 1;
                        }
                    }
                    var circular = true;
                    if (nextQueue.length <= 2) {
                        this.triggerEvent('morelist', 0)
                    }
                    if (nextQueue.length === 0 && current !== 0) {
                        circular = false;
                    }
                    if (prevQueue.length === 0 && current !== 2) {
                        circular = false;
                    }
                    console.log(nextQueue)
                    this.setData({
                        curQueue: curQueue,
                        circular: circular,
                        current
                    });
                    // this.data.videoTwo ? [this.triggerEvent('videoTwochange', curQueue[current]), this.setData({ _last: 0 })] : ''
                    this.triggerEvent('getCur', curQueue[current])
                },
                playCurrent: function playCurrent(current, data, type) {
                    wx.hideLoading()
                    this.data._videoContexts.forEach(function (ctx, index) {
                        index !== current ? ctx.pause() : data.pause ?  ctx.pause() : ctx.play();
                    });
                },
                onPlay: function onPlay(e) {
                    this.trigger(e, 'play');
                },
                onPause: function onPause(e) {
                    this.trigger(e, 'pause');
                },
                onEnded: function onEnded(e) {
                    this.trigger(e, 'ended');
                },
                onError: function onError(e) {
                    this.trigger(e, 'error');
                },
                onTimeUpdate: function onTimeUpdate(e) {
                    this.trigger(e, 'timeupdate');
                },
                onWaiting: function onWaiting(e) {
                    this.trigger(e, 'wait');
                },
                onProgress: function onProgress(e) {
                    this.trigger(e, 'progress');
                },
                onLoadedMetaData: function onLoadedMetaData(e) {
                    this.trigger(e, 'loadedmetadata');
                },
                trigger: function trigger(e, type) {
                    var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                    var detail = e.detail;
                    var activeId = e.target.dataset.id;
                    this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), {
                        activeId: activeId
                    }), ext));
                },
                praise(e) {
                    let list = this.data.curQueue;
                    let index = e.currentTarget.dataset.index;
                    let param1 = {
                        id: list[index].id
                    };
                    if (list[index].praised == 1) {
                        // 取消点赞
                        app.video.delPraise(param1).then(msg => {
                            list[index].praised = 0;
                            list[index].praise--;
                            this.setData({
                                [`curQueue[${index}]`]: list[index]
                            });
                        });
                    } else {
                        // 点赞
                        app.video.praise(param1).then(msg => {
                            if (msg.data.is_first == "first") {
                                let param = {
                                    num: 50,
                                    txt: "完成[短视频]首次点赞"
                                }
                                this.triggerEvent('showIntegral', param)
                            } else if (msg.data.is_first == "day") {
                                let param = {
                                    num: 20,
                                    txt: "完成每日[短视频]首赞"
                                }
                                this.triggerEvent('showIntegral', param)
                            }
                            list[index].praised = 1;
                            list[index].praise++;
                            list[index].praising = true;
                            this.setData({
                                index,
                                [`curQueue[${index}]`]: list[index]
                            });
                        });
                        wx.uma.trackEvent("sortVideo_praise", {
                            videoName: list[index].title
                        });
                    }
                },
                aniend(e) {
                    let list = this.data.curQueue;
                    let index = this.data.index;
                    list[index].praising = false;
                    this.setData({
                        [`curQueue[${index}]`]: list[index]
                    });
                },
                showred() {
                    console.log(34324234)
                },
                addShare(id) {
                    this.data.curQueue.forEach((item, index) => {
                        if (item.id == id) {
                            this.setData({
                                [`curQueue[${index}].forward`]: item.forward += 1
                            })
                        }
                    })
                },
                navigate() {
                    this.triggerEvent('navigate', 1)
                },
                // 获取用户的微信昵称头像
                onGotUserInfo: function (e) {
                    if (e.detail.errMsg == "getUserInfo:ok") {
                        app.updateBase(e);
                        e.currentTarget.dataset.type ?
                            wx.navigateTo({
                                url: "/pages/makeMoney/makeMoney"
                            }) :
                            "";
                    }
                },
                videoPause(pause) {
                    if(!this.data._videoContexts[0]) return
                    pause ? this.data._videoContexts[this.data.current].pause() : this.data._videoContexts[this.data.current].play()
                },
                tap() {
                    this.triggerEvent('tap', 1)
                }
            }
        });
    })
]);