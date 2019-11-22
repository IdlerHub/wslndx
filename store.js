/*
 * @Date: 2019-06-11 14:24:48
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-14 16:58:22
 */
import Store from "wxministore"
const app = getApp()
let env = "producton"
let imgHost
let activityUrl
let API_URL
let mpVersion
let socket_host
if (env == "develop"){
  /* 测试环境 */
  imgHost = "https://hwcdn.jinlingkeji.cn/images/dev" /* 图片等静态资源服务器 */
  activityUrl = "https://gqjydev.jinlingkeji.cn/?" /* 国情教育链接 */
  mpVersion = "v16" /* 版本管理 */
  API_URL = "https://develop.jinlingkeji.cn/api/v16/" /* 数据服务器 */
  socket_host = "develop.jinlingkeji.cn:8182"
} else {
  /* 发布环境 */
  imgHost = "https://hwcdn.jinlingkeji.cn/images/pro"
  activityUrl = "https://gqjy.jinlingkeji.cn/?"
  mpVersion = "v16"
  API_URL = "https://apielb.jinlingkeji.cn/api/v16/"
  socket_host = "api.jinlingkeji.cn:8182"
}

Store.prototype.process = env
Store.prototype.API_URL = API_URL
Store.prototype.mpVersion = mpVersion
Store.prototype.socket_host = socket_host

let store = new Store({
  state: {
    userInfo: {} /* 用户信息 */,
    authUserInfo: false /* （微信用户信息）授权状态 */,
    visitedNum: [] /* 最多10个未授权视频 */,
    baseInfo: false /* 提示已超过10个视频，要求授权 */,
    authKey: "" /* 小程序进入h5的身份标识 */,
    activityUrl: activityUrl,
    signStatus: {} /* 签到状态及弹窗 */,
    imgHost: imgHost,
    title:'',
    path:'',
    imageUrl:'',
    shareImgurl: '',
    shareTitle:'',
    recommend:'',
    playVedio: false
  },
  pageLisener: {
    onLoad(opts) {
      this.pramas = {
        uid: this.data.$state.userInfo.id,
      }
      if (!this.onShareAppMessage) {
        wx.showShareMenu()
        this.onShareAppMessage = function(ops) {
          if (ops.from === "menu") {
            return this.menuAppShare()
          }
        }
      }
    }
    /*  onUnload() {} */
  },
  methods: {
    menuAppShare() {
        return {
          title: this.data.$state.shareTitle || "福利！老年大学十万集免费课程在线学习",
          path: "/pages/loading/loading?uid=" + this.data.$state.userInfo.id + "&type=invite",
          imageUrl: this.data.$state.shareImgurl || "../../images/sharemessage.jpg"
        }
    },

  }
})

module.exports = store
