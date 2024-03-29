const app = getApp()
Component({
	properties: {
		// 数据源
		listData: {
			type: Array,
			value: []
		},
		columns: {
			type: Number,
			value: 1,
			observer: 'dataChange'
		},
		// 顶部高度
		topSize: {
			type: Number,
			value: 0,
			observer: 'dataChange'
		},
		// 底部高度
		bottomSize: {
			type: Number,
			value: 0,
			observer: 'dataChange'
		}
	},
	data: {
		/* 渲染数据 */
		windowHeight: 0, // 视窗高度
		platform: '', // 平台信息
		realTopSize: 0, // 计算后顶部高度实际值
		realBottomSize: 0, // 计算后底部高度实际值
		itemDom: { // 每一项 item 的 dom 信息, 由于大小一样所以只存储一个
			width: 0,
			height: 0,
			left: 0,
			top: 0
		},
		itemWrapDom: { // 整个拖拽区域的 dom 信息
			width: 0,
			height: 0,
			left: 0,
			top: 0
		},
		startTouch: { // 初始触摸点信息
			pageX: 0,
			pageY: 0,
			identifier: 0
		},
		startTranX: 0, // 当前激活元素的初始 X轴 偏移量
		startTranY: 0, // 当前激活元素的初始 Y轴 偏移量
		preOriginKey: -1, // 前一次排序时候的起始 key 值

		/* 未渲染数据 */
		list: [],
		cur: -1, // 当前激活的元素
		curZ: -1, // 当前激活的元素, 用于控制激活元素z轴显示
		tranX: 0, // 当前激活元素的 X轴 偏移量
		tranY: 0, // 当前激活元素的 Y轴 偏移量
		itemWrapHeight: 0, // 动态计算父级元素高度
		dragging: false, // 是否在拖拽中
		overOnePage: false, // 整个区域是否超过一个屏幕
		itemTransition: false, // item 变换是否需要过渡动画, 首次渲染不需要
		isEdit: false
	},
	methods: {
		itemClick(e) {
			let { index } = e.currentTarget.dataset, id = e.currentTarget.dataset.id
			let item = this.data.list[index];
			this.triggerEvent('click', {
				oldKey: index,
				newKey: item.key,
				data: item.data
			});
		},
		gotoCdetail(e) {
			wx.navigateTo({
				url: "/pages/cDetail/cDetail?id=" + e.currentTarget.dataset.id
			})
		},
		longPress(e) {
			// 获取触摸点信息
			let startTouch = e.changedTouches[0];
			if (!startTouch) return;
			// 如果是固定项则返回
			let index = e.currentTarget.dataset.index;
			if (this.isFixed(index)) return;
			// 防止多指触发 drag 动作, 如果已经在 drag 中则返回, touchstart 事件中有效果
			if (this.data.dragging) return;
			this.setData({ dragging: true });
			let {
				pageX: startPageX,
				pageY: startPageY
			} = startTouch,
				{
					itemDom,
					itemWrapDom
				} = this.data,
				startTranX = 0,
				startTranY = 0;
			if (this.data.columns > 1) {
				// 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
				startTranX = startPageX - itemDom.width / 2 - itemWrapDom.left;
			}
			// 计算Y轴初始位移, 使 item 垂直中心移动到点击处
			startTranY = startPageY - itemDom.height / 2 - itemWrapDom.top;
			this.setData({
				startTouch: startTouch,
				startTranX: startTranX,
				startTranY: startTranY,
				cur: index,
				curZ: index,
				tranX: startTranX,
				tranY: startTranY
			});
			// wx.vibrateShort();
		},
		touchMove(e) {
			// 获取触摸点信息
			let currentTouch = e.changedTouches[0];
			if (!currentTouch) return;
			if (!this.data.dragging) return;
			let {
				windowHeight,
				realTopSize,
				realBottomSize,
				itemDom,
				startTouch,
				startTranX,
				startTranY,
				preOriginKey
			} = this.data,
				{
					pageX: startPageX,
					pageY: startPageY,
					identifier: startId
				} = startTouch,
				{
					pageX: currentPageX,
					pageY: currentPageY,
					identifier: currentId,
					clientY: currentClientY
				} = currentTouch;
			// 如果不是同一个触发点则返回
			if (startId !== currentId) return;
			// 通过 当前坐标点, 初始坐标点, 初始偏移量 来计算当前偏移量
			let tranX = currentPageX - startPageX + startTranX,
				tranY = currentPageY - startPageY + startTranY;
			// 单列时候X轴初始不做位移
			if (this.data.columns === 1) tranX = 0;
			// 判断是否超过一屏幕, 超过则需要判断当前位置动态滚动page的位置
			if (this.data.overOnePage) {
				if (currentClientY > windowHeight - itemDom.height - realBottomSize) {
					// 当前触摸点pageY + item高度 - (屏幕高度 - 底部固定区域高度)
					wx.pageScrollTo({
						scrollTop: currentPageY + itemDom.height - (windowHeight - realBottomSize),
						duration: 300
					});
				} else if (currentClientY < itemDom.height + realTopSize) {
					// 当前触摸点pageY - item高度 - 顶部固定区域高度
					wx.pageScrollTo({
						scrollTop: currentPageY - itemDom.height - realTopSize,
						duration: 300
					});
				}
			}
			// 设置当前激活元素偏移量
			this.setData({
				tranX: tranX,
				tranY: tranY
			});
			// 获取 originKey 和 endKey
			let originKey = parseInt(e.currentTarget.dataset.key),
				endKey = this.calculateMoving(tranX, tranY);
			// 如果是固定 item 则 return
			if (this.isFixed(endKey)) return;
			// 防止拖拽过程中发生乱序问题
			if (originKey === endKey || preOriginKey === originKey) return;
			this.setData({ preOriginKey: originKey });
			// 触发排序
			this.insert(originKey, endKey);
		},
		touchEnd() {
			if (!this.data.dragging) return;
			let arr = JSON.parse(JSON.stringify(this.data.list)), brr = [], param = {}, num = ''
			arr.sort((a, b) => {
				return a.key - b.key
			})
			arr.forEach(item => {
				brr[item.key] = item.data
			})
			this.setData({
				listData: brr
			})
			this.data.listData.forEach((i, index) => {
				num = `${num},${i.id}`
			})
			param = {
				fs_id: num.substring(1)
			}
			app.circle.join(param).then(res => { })
			this.clearData();
		},
		calculateMoving(tranX, tranY) {
			let { itemDom } = this.data;
			let rows = Math.ceil(this.data.list.length / this.data.columns) - 1,
				i = Math.round(tranX / itemDom.width),
				j = Math.round(tranY / itemDom.height);
			i = i > (this.data.columns - 1) ? (this.data.columns - 1) : i;
			i = i < 0 ? 0 : i;
			j = j < 0 ? 0 : j;
			j = j > rows ? rows : j;
			let endKey = i + this.data.columns * j;
			endKey = endKey >= this.data.list.length ? this.data.list.length - 1 : endKey;
			return endKey
		},
		insert(origin, end) {
			this.setData({ itemTransition: true });
			let list;
			if (origin < end) { // 正序拖动
				list = this.data.list.map((item) => {
					if (item.fixed) return item;
					if (item.key > origin && item.key <= end) {
						item.key = this.l2r(item.key - 1, origin);
					} else if (item.key === origin) {
						item.key = end;
					}
					return item;
				});
				this.getPosition(list);
			} else if (origin > end) { // 倒序拖动
				list = this.data.list.map((item) => {
					if (item.fixed) return item;
					if (item.key >= end && item.key < origin) {
						item.key = this.r2l(item.key + 1, origin);
					} else if (item.key === origin) {
						item.key = end;
					}
					return item;
				});
				this.getPosition(list);
			}
		},
		l2r(key, origin) {
			if (key === origin) return origin;
			if (this.data.list[key].fixed) {
				return this.l2r(key - 1, origin);
			} else {
				return key;
			}
		},
		r2l(key, origin) {
			if (key === origin) return origin;
			if (this.data.list[key].fixed) {
				return this.r2l(key + 1, origin);
			} else {
				return key;
			}
		},
		getPosition(data, vibrate = true) {
			let { platform } = this.data;
			let list = data.map((item, index) => {
				item.x = item.key % this.data.columns;
				item.y = Math.floor(item.key / this.data.columns);
				return item;
			});
			this.setData({ list: list });
			if (!vibrate) return;
			// if (platform !== "devtools") wx.vibrateShort();
			let listData = [];
			list.forEach((item) => {
				listData[item.key] = item.data
			});
			this.triggerEvent('change', { listData: listData });
		},
		isFixed(key) {
			let list = this.data.list;
			if (list && list[key] && list[key].fixed) return 1;
			return 0;
		},
		clearData() {
			this.setData({
				preOriginKey: -1,
				dragging: false,
				cur: -1,
				tranX: 0,
				tranY: 0
			});
			// 延迟清空
			setTimeout(() => {
				this.setData({
					curZ: -1,
				})
			}, 300)
		},
		dataChange(newVal, oldVal) {
			this.init();
		},
		initDom() {
			wx.pageScrollTo({ scrollTop: 0, duration: 0 });
			let { windowWidth, windowHeight, platform } = wx.getSystemInfoSync();
			let remScale = (windowWidth || 375) / 375,
				realTopSize = this.data.topSize * remScale / 2,
				realBottomSize = this.data.bottomSize * remScale / 2;
			this.setData({
				windowHeight: windowHeight,
				platform: platform,
				realTopSize: realTopSize,
				realBottomSize: realBottomSize
			});
			this.createSelectorQuery().select(".item").boundingClientRect((res) => {
				let rows = Math.ceil(this.data.list.length / this.data.columns);
				this.setData({
					itemDom: res,
					itemWrapHeight: rows * res.height
				});
				this.createSelectorQuery().select(".item-wrap").boundingClientRect((res) => {
					// (列表的底部到页面顶部距离 > 屏幕高度 - 底部固定区域高度) 用该公式来计算是否超过一页
					let overOnePage = res.bottom > windowHeight - realBottomSize;
					this.setData({
						itemWrapDom: res,
						overOnePage: overOnePage
					});
				}).exec();
			}).exec();
		},
		init() {
			this.clearData();
			this.setData({ itemTransition: false });
			// 避免获取不到节点信息报错问题
			if (this.data.listData.length === 0) {
				this.setData({ list: [], itemWrapHeight: 0 });
				return;
			}
			// 遍历数据源增加扩展项, 以用作排序使用
			let list = this.data.listData.map((item, index) => {
				return {
					fixed: item.fixed,
					key: index,
					x: 0,
					y: 0,
					data: item
				};
			});
			this.getPosition(list, false);
			// 异步加载数据时候, 延迟执行 initDom 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息
			setTimeout(() => this.initDom(), 10);
		},
		getList() {
			//获取没有加入的圈子list
			app.circle.noJoinCircles().then(msg => {
				this.setData({
					noJoinList: msg.data
				})
			})
		},
		edit() {
			if (this.data.isEdit) {
				this.setData({
					isEdit: false
				})
			} else {
				this.setData({
					isEdit: true
				})
			}
		},
		//加入加圈
		fnJoin(e) {
			if (this.addaction) return
			this.addaction = true
			let curItem = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index, num1 = '', num2 = '', arr = JSON.parse(JSON.stringify(this.data.list)), brr = []
			this.setData({
				addItem: curItem,
				addIndex: index,
				addaction: true
			})
			this.data.listData.splice(0, 0, curItem)
			this.init()
			this.settiome = setTimeout(() => {
				this.data.listData.forEach((i, index) => {
					num2 = `${num2},${i.id}`
				})
				let param = {
					fs_id: num2.substring(1)
				}
				app.circle.join(param).then(res => {
					wx.showToast({
						title: "您已成功加入\r\n【" + curItem.title + "】学友圈",
						icon: "none",
						duration: 1500
					})
					this.data.noJoinList.splice(index, 1)
					this.setData({
						noJoinList: this.data.noJoinList,
						addaction: false,
						addItem: {}
					})
					this.addaction = false
					this.init()
				})
			}, 150);
		},
		//取消加圈
		fnCancelJoin(e) {
			if (this.delaction) return
			this.delaction = true
			let curItem = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index, arr = JSON.parse(JSON.stringify(this.data.list)), brr = [], num = ''
			this.setData({
				delItem: curItem,
				delIndex: index,
				delaction: true
			})
			this.data.noJoinList.splice(0, 0, curItem)
			arr.sort((a, b) => {
				return a.key - b.key
			})
			arr.forEach(item => {
				brr[item.key] = item.data
			})
			brr.splice(index, 1)
			// this.data.listData.splice(index,1)
			this.setData({
				noJoinList: this.data.noJoinList,
				listData: brr
			})
			setTimeout(() => {
				this.init()
				brr.forEach((i, index) => {
					num = `${num},${i.id}`
				})
				let param = {
					fs_id: num.substring(1)
				}
				app.circle.join(param).then(res => {
					wx.showToast({
						title: "您已成功取消\r\n【" + curItem.title + "】学友圈",
						icon: "none",
						duration: 1500
					})
					this.delaction = false
				})
				this.setData({
					delItem: {},
					delaction: false
				})
			}, 150);
		},
	},
	ready() {
		this.init();
		this.getList()
	},
});
