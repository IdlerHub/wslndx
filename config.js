import Store from "wxministore"

let env = "/* @echo NODE_ENV */"
let imgHost
let activityUrl
let API_URL

if (env == "develop") {
  /* 测试环境 */
  imgHost = "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/dev" /* 图片等静态资源服务器 */
  activityUrl = "https://gqjydev.jinlingkeji.cn/?" /* 国情教育链接 */
  API_URL = "https://develop.jinlingkeji.cn/api/v3/" /* 数据服务器 */
} else {
  /* 发布环境 */
  imgHost = "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/pro"
  activityUrl = "https://gqjy.jinlingkeji.cn/?"
  API_URL = "https://apielb.jinlingkeji.cn/api/v3/"
}

Store.prototype.process = env
Store.prototype.API_URL = API_URL

let store = new Store({
  state: {
    userInfo: {} /* 用户信息 */,
    authUserInfo: false /* （微信用户信息）授权状态 */,
    visitedNum: [] /* 最多10个未授权视频 */,
    baseInfo: false /* 提示已超过10个视频，要求授权 */,
    authKey: "" /* 小程序进入h5的身份标识 */,
    activityUrl: activityUrl,
    signStatus: {} /* 签到状态及弹窗 */,
    imgHost: imgHost
  },
  pageLisener: {
    onLoad(opts) {},
    onShareAppMessage(ops) {
      if (ops.from === "menu") {
        console.log("ShareAppMessage  menu")
        return {
          title: "网上老年大学",
          path: "pages/loading/loading",
          imageUrl: ""
        }
      }
    },
    onUnload() {}
  },
  methods: {}
})

module.exports = store
