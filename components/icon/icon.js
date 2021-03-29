// components/icon/icon.js
import {svgIcon,iconClassName} from './base';

Component({
	externalClasses: ['mini-class'],
	properties: {
		icon:{
			type:String,
			value:'',
			observer:function(d){
				// svg
				if(d && !this.data.backgroundImage){
					this.setData({
						backgroundImage:svgIcon(d,this.data.color)
					})
				}
				// 不同icon命名
				if(d){
					let className = iconClassName(d);
					if(className){
						this.setData({
							iconClass:className
						})
					}
				}
			}
		},
		color:{
			type:String,
			value:'',
			observer:function(d){
				// svg
				if(d && this.data.icon){
					this.setData({
						backgroundImage:svgIcon(this.data.icon,d)
					})
				}
			}
		},
		miniStyle:{
			type:String,
			value:'',
			observer:function(e){
				//样式
			}
		}
	},
	data: {
		backgroundImage:'',
		iconClass:''
	},
	methods: {
		_tap(e){
			this.triggerEvent("minitap",e);
		}
	}
})

