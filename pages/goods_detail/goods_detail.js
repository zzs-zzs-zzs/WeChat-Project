// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_info: {
      goods_id: '',
      num: 0
    },
    goods_id:'',
    list: [],
    collectImg:'../../icons/kong.png',
    count: '',
    show: false,
    userInfo: [],
    showHeadPortrait: false,
    num: 1
  },

  getData(id) {
    let that = this
    wx.request({
      url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
      data:{
        goods_id:id
      },
      success(res) {
        // 点击进来浏览则将数据存在本地缓存中,作为浏览历史的依据
        let history = wx.getStorageSync('history') || []
        if ( history.length === 0 && res.data.message ) {
          history.push(res.data.message)
        } else if (  history.length > 0 && res.data.message ) {
          history[0].goods_id
          let index =  history.findIndex(v=>v.goods_id ===  parseInt(id))
          if ( index !== -1 ) {
            history.splice(index,1)
          }
          history.unshift(res.data.message)
        }
        wx.setStorageSync('history',history)
        that.setData({
          list: res.data.message
        })
      },
      fail() {
        console.log('error')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cart = wx.getStorageSync('cart') || []
    if ( cart.length > 0 ) {
      this.setData({
        count: cart.length,
        show: true
      }) 
    } else {
      this.setData({
        show: false
      })
    }
    
    // 先判断是否收藏
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    }
    if ( this.data.showHeadPortrait ) {
      if ( options.index > -1) {
        this.setData({
          collectImg: "../../icons/shi.png"
        })
      }
    }
    this.setData({
      goods_id: options.goods_id
    })
    this.getData(options.goods_id)
  },

  
  collect() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    }
    if ( this.data.showHeadPortrait ) {
      let collectList = wx.getStorageSync('collectList') || []
      if( this.data.collectImg === "../../icons/kong.png") {
        // 点击收藏将数据添加到本地缓存中
        collectList.push(this.data.list)
        this.setData({
          collectImg: "../../icons/shi.png"
        })
      } else {
        // 将商品在收藏中去除
        let index = collectList.findIndex(v=>v.goods_id === this.data.list.goods_id)
        collectList.splice(index,1)
        this.setData({
          collectImg: "../../icons/kong.png"
        })
      }
      wx.setStorageSync('collectList',collectList)
    } else {
      wx.showToast({
        title: "请先登录再收藏",
        icon: "none"
      })
    }
  },
  // 点击图片放大
  handlePrevewImage(e) {
    let urls = this.data.list.pics.map(v=>v.pics_mid)
    wx.previewImage({
      // 
      current: urls[e.target.dataset.index],
      // 要预览的图片数组
      urls: urls
    });
  },
  // 加入购物车，购物车放在本地缓存中
  handleCartAdd() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    }
    if ( this.data.showHeadPortrait ) {
      this.data.goods_info.goods_id = this.data.goods_id
      let cart = wx.getStorageSync('cart') || []
      let index = cart.findIndex(v=>v.goods_id===this.data.list.goods_id)
      if ( index === -1 ) {
        // 第一次添加
        this.data.list.num = this.data.num
        this.data.list.checked = false
        cart.unshift(this.data.list)
        this.setData({
          count: cart.length,
          show: true
        })
      } else {
        // 已经存在，加一即可
        cart[index].num += this.data.num
      }
      wx.setStorageSync('cart', cart);
      wx.showToast({
        title: '加入成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: "请先登录再添加到购物车",
        icon: "none"
      })
    }
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
  },

  // 立即购买
  goToPay() {
   if( wx.getStorageSync('userInfo').avatarUrl !== undefined ) {
    wx.navigateTo({
      url: "../../pages/pay/pay?id=" + this.data.list.goods_id
    })
    let list = this.data.list
    list.num = this.data.num
    wx.setStorageSync('waitPay',list)
   } else {
     wx.showToast({
       title: "请先登录，再购买",
       icon: "none"
     })
   }
  },

  // 商品数量
  add() {
    if ( this.data.num < 10 ) {
      this.setData({
        num: (this.data.num + 1)
      })
    } else {
      wx.showToast({
        title: "该商品最多一次购买十件",
        icon: "none"
      })
    }
    
  },
  sub() {
    if ( this.data.num > 1) {
      this.setData({
        num: (this.data.num - 1)
      })
    } else {
      wx.showToast({
        title: "商品一件起购",
        icon: "none"
      })
    }
    
  }
})