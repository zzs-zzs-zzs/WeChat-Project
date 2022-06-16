// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    addressFunctionList: [],
    from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取后台的地址
    let addressList = wx.getStorageSync('addressList') || []
    let addressFunctionList = []
    if ( addressList[0] !== "undefined") {
      addressList.forEach(element => {
        addressFunctionList.push(false)
      });
    }
    this.setData({
      addressList: addressList,
      addressFunctionList: addressFunctionList,
      from: options.from
    })
    
  },

  onShow () {
    // 获取后台的地址
    let addressList = wx.getStorageSync('addressList') || []
    let addressFunctionList = []
    if ( addressList[0] !== "undefined") {
       addressList.forEach(element => {
        addressFunctionList.push(false)
      });
    }
    this.setData({
      addressList: addressList,
      addressFunctionList: addressFunctionList
    })
  },

  // 点击编辑跳转编辑地址页面
  navigateToEditAddress(e) {
    let address = this.data.addressList[e.target.dataset.index]
    wx.navigateTo({
      url: "../../pages/addressEdit/addressEdit?name=" + address.name + "&phone=" + address.phone + "&province=" + address.province + "&city=" + address.city + "&tag=" + address.tag + "&detailedAddress=" +address.detailedAddress + "&default=" + address.default + "&index=" + e.target.dataset.index
    })
  },

  // 点击添加新的地址
  add() {
     wx.navigateTo({
      url: "../../pages/addressEdit/addressEdit"
    })
  },

  // 显示删除地址和设置默认地址按键
  shouFunctionList(e) {
    let addressFunctionList = this.data.addressFunctionList
    for (let i = 0; i < addressFunctionList.length; i++ ) {
      if ( addressFunctionList[i] ) 
        addressFunctionList[i] =false
    }
    addressFunctionList[e.target.dataset.index] = true
    this.setData({
      addressFunctionList: addressFunctionList
    })
  },

  // 隐藏遮罩层
  hideMask(e) {
    let addressFunctionList = this.data.addressFunctionList
    for (let i = 0; i < addressFunctionList.length; i++ ) {
      if ( addressFunctionList[i] ) 
        addressFunctionList[i] =false
    }
    this.setData({
      addressFunctionList: addressFunctionList
    })
    if ( e.target.dataset.checked !== "checked" && this.data.from === "pay") {
      let index =  e.target.dataset.index
      // getCurrentPages是获取页面栈
      let pages = getCurrentPages()
      // 获取上一界面的页面内容
      let perPage = pages[pages.length-2]

      let addressText = {}
      addressText.name = this.data.addressList[index].name
      addressText.phone = this.data.addressList[index].phone
      addressText.province = this.data.addressList[index].province
      addressText.city = this.data.addressList[index].city
      addressText.detailedAddress = this.data.addressList[index].detailedAddress
      addressText.default = this.data.addressList[index].default
      addressText.tag = this.data.addressList[index].tag
      // 相当于在上一步进行this.setData({})
      perPage.setData({
        adderssText: addressText,
        show: true
      })
      wx.navigateBack()
    }
  },

  // 点击删除地址
  removeAddress(e) {
    let addressFunctionList = this.data.addressFunctionList
    addressFunctionList[e.target.dataset.index] = false
    let addressList = this.data.addressList
    addressList.splice(e.target.dataset.index,1)
    wx.getStorageSync('addressList',addressList)
    addressList.forEach(element => {
      addressFunctionList.push(false)
    }) 
    this.setData({
      addressList: addressList,
      addressFunctionList: addressFunctionList
    })
    wx.setStorageSync('addressList',addressList)
  },

  // 点击设置默认地址或者取消默认地址
  changeDefault(e) {
    let addressList = this.data.addressList
    let addressFunctionList = this.data.addressFunctionList
    addressFunctionList[e.target.dataset.index] = false
    if ( e.target.dataset.default ) {
      addressList[0].default = false
      this.setData({
        addressList: addressList
      })
    } else {
      if ( addressList[0].default ) {
        addressList[0].default = false
      }
      let nowAddress = addressList[e.target.dataset.index]
      addressList.splice(e.target.dataset.index,1)
      nowAddress.default = true
      addressList.unshift(nowAddress)
    }
    wx.setStorageSync('addressList',addressList)
    this.setData({
      addressList: addressList,
      addressFunctionList: addressFunctionList
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