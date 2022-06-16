
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    class:'icon-radio',
    totalPrice: 0,
    totalNum: 0,
    show: false,
    checkAll: false,
    cartFunctionList: [],
    collect: [],
    show: true,
    userInfo: [],
    showHeadPortrait: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    } if ( this.data.showHeadPortrait ) {
      wx.showLoading()
      let totalPrice = 0
      let totalNum = 0
      // 获取本地缓存的数据
      let cart = wx.getStorageSync("cart") || []
      // 因为非tabbar界面不能设置tabbar的角标，所以在跳转的时候设置角标
      wx.setTabBarBadge({
        index: 2,
        text: cart.length+''
      })
      this.setData({
        cart: cart
      })
      let all =true
      let cartFunctionList = []
      let collect = []
      for (let i = 0; i < cart.length; i++) {
        if ( cart[i].checked ) {
          totalPrice += cart[i].num * cart[i].goods_price
          totalNum += cart[i].num
        } else {
          all = false
        }
        // 长按收藏、删除列表
        cartFunctionList.push(false)
        collect.push('收藏')
      }
      // 一开始判断是否全部选中s
      if ( all ) {
        if ( cart.length > 0) {
          this.setData({
            checkAll: true
          })
        }
      }
      this.setData({
        totalPrice: totalPrice,
        totalNum: totalNum,
        cartFunctionList: cartFunctionList,
        collect: collect
      })
      wx.hideLoading()
      // 购物车为空的时候，显示图标
      if (this.data.cart.length === 0) {
        this.setData({
          show: false
        })
      }
    } else {
      wx.showToast({
        title: "请先登录，登录之后才可以查看购物车",
        icon: "none"
      })
    }
    
  },

  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    } if ( this.data.showHeadPortrait ) {
      let cart = wx.getStorageSync("cart") || []
      let cartFunctionList = []
      let all = 0
      let totalPrice = 0
      let totalNum = 0
      for (let i = 0; i < cart.length; i++) {
        cartFunctionList.push(false)
        if ( cart[i].checked ) {
          all++
          totalPrice += cart[i].num * cart[i].goods_price
          totalNum += cart[i].num
        }
      }
      // 在页面展示的时候，需要再次判断是否全部选中
      if ( all === cart.length && cart.length > 0) {
        this.setData({
          checkAll: true,
          totalPrice:totalPrice,
          totalNum:totalNum
        })
      } else {
        this.setData({
          checkAll: false,
          totalPrice:totalPrice,
          totalNum:totalNum
        })
      }
      this.setData({
        cart: cart,
        cartFunctionList: cartFunctionList
      })
      // 因为非tabbar界面不能设置tabbar的角标，所以在跳转的时候设置角标
      wx.setTabBarBadge({
        index: 2,
        text: cart.length+''
      })
      // 购物车为空的时候，显示图标
      if (this.data.cart.length === 0) {
        this.setData({
          show: false
        })
      } else {
        this.setData({
          show: true
        })
      }
    } else {
      wx.showToast({
        title: "请先登录，登录之后才可以查看购物车",
        icon: "none"
      })
    }
    
  },

  handleRadio(e) {
    let index = e.target.dataset.index
    let cart = this.data.cart
    cart[index].checked = !cart[index].checked
    // 选中之后存数据
    this.setData({
      cart: cart
    })
    wx.setStorageSync('cart', cart)
    // 计算总价
    if ( cart[index].checked ) {
      this.setData ({
        totalPrice: this.data.totalPrice + cart[index].num * cart[index].goods_price,
        totalNum: this.data.totalNum + cart[index].num
      })
      // 选中一个后，判断是否全部选中，如果全部选中，给全部选中按键更换icon
      let all = true
      for (let i = 0; i < cart.length; i++) {
        if ( !cart[i].checked ) {
          all = false
          break
        }
      }
      if ( all ) {
        this.setData({
          checkAll: true
        })
      }
    } else {
      this.setData ({
        totalPrice: this.data.totalPrice - cart[index].num * cart[index].goods_price,
        totalNum: this.data.totalNum - cart[index].num
      })
       // 去除一个后，判断是否全部不选中，如果全部不选中，给全部选中按键更换icon
        this.setData({
          checkAll: false
        })
    }
  },

  // 添加数量
  add(e) {
    let index = e.target.dataset.index
    let cart = this.data.cart
    // 判断数量是否大于库存
    if ( cart[index].num < cart[index].goods_number ) {
      cart[index].num += 1
      this.setData({
        cart: cart
      })
      // 更新本地缓存数据
      wx.setStorageSync('cart',cart)
      // 判断是否选中，重新计算总价
      if ( cart[index].checked) {
        this.setData({
          totalPrice: this.data.totalPrice + cart[index].goods_price,
          totalNum: this.data.totalNum + 1
        })
      }
    } else {
      wx.showToast({
        title:"数量不能大于库存量",
        icon:"none"
      })
    }
   
  },

  // 减少数量
  sub(e) {
    let index = e.target.dataset.index
    let cart = this.data.cart
    // num不能小于1
    if ( cart[index].num >1 ) {
      cart[index].num -= 1
      this.setData({
        cart: cart
      })
      // 更新本地缓存数据
      wx.setStorageSync('cart',cart)
      // 判断是否选中，重新计算总价
      if ( cart[index].checked) {
        this.setData({
          totalPrice: this.data.totalPrice - cart[index].goods_price,
          totalNum: this.data.totalNum - 1
        })
      }
    } else {
      // 小于1进行提示
      wx.showToast({
        title: "数量不能小于1",
        icon: "none"
      })
    }
   
  },

  // 全选
  handleAll() {
    let check = this.data.checkAll
    check = !check
    let totalPrice = this.data.totalPrice
    let totalNum = this.data.totalNum
    this.setData({
      checkAll: check
    })
    let cart = this.data.cart
    if ( check ) {
      for (let i = 0; i < cart.length; i++) {
        cart[i].checked = true
        totalPrice += cart[i].goods_price * cart[i].num,
        totalNum += cart[i].num
      }
      this.setData({
        cart: cart,
        totalPrice: totalPrice,
        totalNum: totalNum
      })
    } else {
      for (let i = 0; i < cart.length; i++) {
        cart[i].checked = false
      }
      this.setData({
        cart: cart,
        totalPrice: 0,
        totalNum: 0
      })
    }
    wx.setStorageSync('cart',cart)
  },

  // 判断是否收藏
  isCollect (e) {
    let collectList = wx.getStorageSync('collectList') || []
    let index = collectList.findIndex(v=>v.goods_id === this.data.cart[e.target.dataset.index].goods_id)
    return index
  },

  // 点击跳转具体页面
  navigateTo(e) {
    let index = this.isCollect(e)
    wx.navigateTo({
      url:"../../pages/goods_detail/goods_detail?goods_id=" + this.data.cart[e.target.dataset.index].goods_id + "&index=" + index
    })
  },

  // 跳转支付界面,将总额、总件数、地址传递过去
  pay() {
    if( this.data.totalNum > 0) {
      wx.navigateTo({
        url:"../../pages/pay/pay?totalPrice=" + this.data.totalPrice + "&totalNum=" + this.data.totalNum
      })
    } else {
      wx.showToast({
        title: "请先选择要购买的商品",
        icon: "none"
      })
    }
    
  },

  // 监听长按事件
  bindlongpress(e) {
    // 判断是否收藏，已经收藏则选择取消收藏
    let index = this.isCollect(e)
    let collect = this.data.collect
    if ( index > -1 ) {
      collect[e.target.dataset.index] = "取消收藏"
      this.setData({
        collect: collect
      })
    } else {
      collect[e.target.dataset.index] = "收藏"
      this.setData({
        collect: collect
      })
    }
    let cartFunctionList = this.data.cartFunctionList
    for ( let i = 0; i < cartFunctionList.length; i++) {
      if ( i === e.target.dataset.index ) {
        cartFunctionList[i] = true
      } else {
        cartFunctionList[i] = false
      }
    }
    this.setData({
      cartFunctionList: cartFunctionList
    })
  },

  hideMask() {
    let cartFunctionList = this.data.cartFunctionList
    for (let i = 0; i < cartFunctionList.length; i++) {
      cartFunctionList[i] = false
    }
    this.setData({
      cartFunctionList: cartFunctionList
    })
  },

  // 取消或添加收藏
  collect(e) {
    let collectList = wx.getStorageSync('collectList') || []
    let index = collectList.findIndex(v=> v.goods_id === e.target.dataset.id)
    if ( index > -1 ) {
      collectList.splice(index,1)
    } else {
      let index1 = this.data.cart.findIndex(v=> v.goods_id === e.target.dataset.id)
      collectList.push(this.data.cart[index1])
    }
    wx.setStorageSync('collectList',collectList)
    let cartFunctionList = this.data.cartFunctionList
    cartFunctionList[e.target.dataset.index] = false
    this.setData({
      cartFunctionList: cartFunctionList
    })
    this.hideMask()
  },

  // 点击删除
  remove(e) {
    let cart = this.data.cart
    cart.splice(e.target.dataset.index,1)
    this.setData({
      cart: cart
    })
    wx.setStorageSync('cart',cart)
    this.hideMask()
    // 删除之后重新计算总价和总件数
    // 同时判断删除一个之后是否是全部选中或者不选中
    let totalPrice = 0
    let totalNum = 0
    let all = 0
    let noAll = 0
    for (let i = 0; i < cart.length; i++) {
      if ( cart[i].checked ) {
        totalPrice += cart[i].num * cart[i].goods_price
        totalNum += cart[i].num
        all++
      } else {
        noAll++
      }
    }
    if ( all === cart.length && cart.length > 0) {
      this.setData({
        totalPrice: totalPrice,
        totalNum: totalNum,
        checkAll: true
      })
    } else {
      this.setData({
        totalPrice: totalPrice,
        totalNum: totalNum,
        checkAll: false
      })
    }
    if (this.data.cart.length === 0) {
      this.setData({
        show: false
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
 }


})