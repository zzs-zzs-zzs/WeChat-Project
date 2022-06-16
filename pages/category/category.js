import {request} from "../../lib/request"
Page({
  data: {
    leftList: [],
    currentIndex: 0,
    rightContent: [],
    scrollTop: 0
  },
  onLoad: function () {
    let that = this
    let index = this.data.currentIndex
    let list = wx.getStorageSync('list')
    if (wx.getStorageSync('list')) {
      if(Date.now()-list.time > 1000*10) { 
        request({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
        .then(res=> {
           that.setData({
              leftList:res.data.message.map(v => v.cat_name),
              rightContent: res.data.message[0]
            })
            wx.setStorageSync('list',{time:Date.now(),data:res.data.message})
        })
      } else {
        that.setData({
          leftList:list.data.map(v => v.cat_name),
          rightContent: list.data[index]
        })
      }
    }
    else {
      request({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
      .then(res =>{
          that.setData({
            list:res.data.message
          })
          wx.setStorageSync('list',{time:Date.now(),data:res.data.message})
      })
    }
    
    
  },

  onShow(options) {
    if ( wx.getStorageSync('userInfo').avatarUrl !== undefined ) {
      // 设置tabbar的角标
     let cart = wx.getStorageSync('cart')
     wx.setTabBarBadge({
       index: 2,
       text: cart.length + ''
     })
   }
  },

  handleItemTap (e) {
    let index = e.target.dataset.index
    this.setData({
      currentIndex: index
    }) 
    this.setData({
      rightContent: wx.getStorageSync('list').data[index],
      scrollTop: 0
    })
  },
  onShareAppMessage() {
    
  },
  // 分享到朋友圈
 onShareTimeline() {
   return {
     title: '优品优购',
     code: "123456",
     imgUrl: "../../img/mao.jpg"
   }
 }
 
})
