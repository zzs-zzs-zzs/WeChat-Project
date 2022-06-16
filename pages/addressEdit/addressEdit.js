// 导入腾讯地图js
import map from "../../lib/qqmap-wx-jssdk"

Page({
  // 

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    address: {
      province: "",
      city: "",
      district: "",
      street: '',
      street_number: ''
    },
    chooseHome: false,
    chooseConpany: false,
    chooseScholl: false,
    chooseOther: false,
    default: false,
    detailedAddress: '',
    tag: '',
    index: 'index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index
    })
    // 如果是在地址界面过来的，就是编辑地址，需要将带过来的地址及进行设置在界面中
      if (typeof(options.index) !== "undefined" ) {
        this.setData({
          name: options.name,
          phone: options.phone,
          address: {
            province: options.province,
            city: options.city,
          },
          detailedAddress: options.detailedAddress,
          tag: options.tag
        })
        if ( options.default === "false" ) {
          this.setData({
            default: false
          })
        } else {
          this.setData({
            default: true
          })
        }
        switch ( options.tag ) {
          case "家" :
            this.setData({
              chooseHome: true,
              chooseConpany: false,
              chooseScholl: false,
              chooseOther: false
            })
          break;
          case "公司":
            this.setData({
              chooseHome: false,
              chooseConpany: true,
              chooseScholl: false,
              chooseOther: false
            })
          break;
          case "学校":
            this.setData({
              chooseHome: false,
              chooseConpany: false,
              chooseScholl: true,
              chooseOther: false
            })
          break;
          case "其他":
            this.setData({
              chooseHome: false,
              chooseConpany: false,
              chooseScholl: false,
              chooseOther: true
            })
          break;
        }
      }
  },

  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  
  phoneInput(e) {
    this.setData({
    phone: e.detail.value
    })
  },


  // 获取用户所在地信息
  // 使用腾讯地图
  getAddress() {
    let that=this;
    let QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
    let qqmapsdk = new QQMapWX({
      key: '5XYBZ-5EECK-WOJJ3-AGQZV-INYTK-ZFBSS'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            let address = addressRes.result.address_component
            that.setData({
              address: {
                province: address.province,//省
                city: address.city,//市
                district:address.district,//区
                street:address.street,//街道
                street_number:address.street_number//门牌号
              }
            })
          },
          fail(err) {
            console.log(err);
          }
        })
      }
    })
  },

  // 详细地址 
  detailedAddressinput(e) {
    this.setData({
      detailedAddress: e.detail.value
    })
  },

  // 勾选地址标签
  chooseHome() {
    this.setData({
      chooseHome: true,
      chooseConpany: false,
      chooseScholl: false,
      chooseOther: false,
      tag: "家"
    })
  },
  chooseConpany() {
    this.setData({
      chooseHome: false,
      chooseConpany: true,
      chooseScholl: false,
      chooseOther: false,
      tag: "公司"
    })
  },
  chooseScholl() {
    this.setData({
      chooseHome: false,
      chooseConpany: false,
      chooseScholl: true,
      chooseOther: false,
      tag: "学校",
    })
  },
  chooseOther() {
    this.setData({
      chooseHome: false,
      chooseConpany: false,
      chooseScholl: false,
      chooseOther: true,
      tag: "其他"
    })
  },

  
  // 设置为默认地址
  bindchange(e) {
    this.setData({
      default: e.detail.value
    })
  },

  
  // 报存地址
  save() {
    if ( this.data.name.trim() === '') {
      wx.showToast({
        title: "名字不能为空",
        icon: "none"
      })
    } else {
      if( this.data.phone.length < 11) {
        wx.showToast({
          title: "手机号码必须为11位",
          icon: "none"
        })
      } else {
        if (this.data.address.province === '' ) {
          wx.showToast({
            title: "所在地区不能为空",
            icon: "none"
          })
        } else {
            if (this.data.detailedAddress === '' ) {
            wx.showToast({
              title: "详细地址不能为空",
              icon: "none"
            })
          } else {
              let addressList = wx.getStorageSync('addressList') || []
              let address = {
                name: this.data.name ,
                phone: this.data.phone,
                province: this.data.address.province,
                city: this.data.address.city,
                detailedAddress: this.data.detailedAddress,
                tag: this.data.tag,
                default: this.data.default
              }
              // 如果idnex是数字，说明这是修改不是添加地址
              if ( typeof(this.data.index) !== "undefined" ) {
                // 修改地址则删除已经存在的数据，点击保存时候，如果是默认的地址，放在第一位，如果不是默认的地址，且删除已经存在的那个地址之后还有地址的话放在第二位

                // 判断当前选中的地址是不是第一个地址，如果是默认地址，删除地址列表的第一个地址，再添加填写好的地址
                if ( parseInt(this.data.index) === 0 ) {
                  addressList.shift()
                  addressList.unshift(address)
                } else if ( parseInt(this.data.index) > 0 ) {
                  // 如果不是第一个，则判断是不是默认的地址，如果是默认的地址，将之前的默认地址修改为非默认地址
                  // 同时，不是默认地址则判断地址列表中是否有默认地址，没有默认地址则直接放第一位
                  if ( this.data.default || addressList[0].default === false) {
                    addressList[0].default = false
                    addressList.splice(parseInt(this.data.index),1)
                    addressList.unshift(address)
                  } else {
                    addressList.splice(parseInt(this.data.index),1)
                    // 不是默认地址且存在默认地址，则直接放在第二位
                    let first = addressList[0]
                    // 将第一位先移除，放入填写好的数据，再将第一位放回来
                    addressList.shift()
                    addressList.unshift(address)
                    addressList.unshift(first)
                  }
                }
              } else {
                if ( address.default ) {
                  if ( addressList[0] === "undefined")
                    addressList[0].default = false
                  addressList.unshift(address)
                } else {
                  if( typeof(addressList[0]) === "undefined" ) {
                    addressList.unshift(address)
                  } else {
                    if ( addressList[0].default ) {
                    // 将第一位先移除，放入填写好的数据，再将第一位放回来
                      let first = addressList[0]
                      addressList.shift()
                      addressList.unshift(address)
                      addressList.unshift(first)
                    } else {
                      addressList.unshift(address)
                    }
                  }
                  
                }
              }
              wx.setStorageSync('addressList',addressList)
              wx.navigateBack()
          }
        }
      }
    }
    
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