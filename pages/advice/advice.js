// pages/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: ['体验问题','商品/商家投诉'],
    show: true,
    textLength: 0,
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindinput(e) {
    this.setData({
      textLength: e.detail.cursor
    })
  },

  handleEvent(e) {
    if ( e.detail.currentIndex ) {
      this.setData ({
        show: false
      })
    } else {
       this.setData ({
        show: true
      })
    }
  },

  // 访问相册
  cameraList() {
    let that = this
    let imgList = this.data.imgList
    let length = imgList.length
    if ( length < 5 ) {
      wx.chooseImage({
        count: 5 - this.data.imgList.length,
        sizeType: "compressed",
        sourceType: "album",
        success(res) {
          if ( res.tempFilePaths.length > 1) {
            res.tempFilePaths.forEach(element => {
              imgList.push(element)
            });
          } else {
            imgList.push(res.tempFilePaths[0])
          }
          that.setData({
            imgList: imgList
          })
        }
      })
    } else {
      wx.showToast({
        title: "最多上传五个照片",
        icon: "none"
      })
    }
  },

  // 实现点击图片放大
  handleClick(e) {
    let urls = this.data.imgList
    wx.previewImage({
      current: urls[e.target.dataset.index],
      urls: urls
    })
  },

  // 删除照片
  closeImage(e) {
    let imgList = this.data.imgList
    imgList.splice(e.target.dataset.index,1)
    this.setData({
      imgList: imgList
    })
  },

   // 提交意见
   submit() {
     wx.showToast({
       title: "点击提交按键",
       icon: "none"
     })
   },

   // 功能列表点击
   handleFunctionBtn() {
     wx.showToast({
       title: "功能暂未开通",
       icon: "none"
     })
   },
   // 分享给朋友
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





