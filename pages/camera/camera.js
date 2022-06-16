// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    showImg: false,
    showCamera: true,
    devicePosition: "back"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 扫码功能
  takePhoto() {
    let that = this
    const ctr = wx.createCameraContext()
    ctr.takePhoto({
      quality:"normal",
      success(res) {
        that.setData({
          src: res.tempImagePath,
          showImg: true,
          showCamera: false
        })
      }
    })
  },

  // 转换摄像头
  changeCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === "back" ? "front" : "back"
    })
    wx.showToast({
      title:"使用前置摄像头",
    })
  },

  // 调用相册
  imgList() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: "compressed",
      sourceType: "album",
      success(res) {
        that.setData({
          src: res.tempFilePaths,
          showImg: true,
          showCamera: false
        })
      }
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