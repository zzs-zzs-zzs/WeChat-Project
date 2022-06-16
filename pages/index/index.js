import {request} from "../../lib/request"

Page({
  data: {
    imgList:[],
    navigaterBar:[],
    Clothes:[]
  },

  onShow() {
    if ( wx.getStorageSync('userInfo').avatarUrl !== undefined ) {
      // 设置tabbar的角标
     let cart = wx.getStorageSync('cart')
     wx.setTabBarBadge({
       index: 2,
       text: cart.length + ''
     })
   }
  },

  onReady() {
    let that = this
    // 轮播图
    request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"})
     
    .then(res=> {
        for (let i = 0; i < res.data.message.length; i++ ) {
          res.data.message[i].navigator_url = res.data.message[i].navigator_url.replace('main','goods_detail')
        }
        that.setData({
          imgList:res.data.message
        })
    })

    // 导航栏
    request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/catitems"})
    .then(res=> {
        that.setData({
        navigaterBar: res.data.message
      })
    })
      

    // 时尚女装
    request({ url:"https://api-hmugo-web.itheima.net/api/public/v1/home/floordata"})
    .then(res=> {
      for (let i = 0; i < res.data.message.length; i++ ) {
        for (let j = 0; j < res.data.message[i].product_list.length; j++ ) {
          let index = res.data.message[i].product_list[j].navigator_url.indexOf("?")
          res.data.message[i].product_list[j].navigator_url = res.data.message[i].product_list[j].navigator_url.substring(0,index) + "/goods_list" + res.data.message[i].product_list[j].navigator_url.substring(index)
        }
      }
      that.setData({
        Clothes: res.data.message
      })
    })
  },
    // 应用推荐
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
