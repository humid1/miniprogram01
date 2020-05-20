// 导入用来发送请求的 封装代码，要把代码补全
import { request } from "../../request/index.js";
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 类别数组
    cateList: [],
    // 楼层数据数组
    floorList: []
  },
  // 页面开始加载，就会触发
  onLoad: function(options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据的方法
  getSwiperList() {
    // 1.发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result)
    //     if(result.data.meta.status === 200) {
    //       this.setData({
    //         swiperList: result.data.message
    //       })
    //     }
    //   }
    // });

    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"
    }).then( result => {
      // console.log(result);
      if(result.data.meta.status === 200) {
        this.setData({
          swiperList: result.data.message
        })
      }
    })
  },
  // 获取分类导航数据
  getCateList() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems"
    }).then( result => {
      // console.log(result);
      if(result.data.meta.status === 200) {
        this.setData({
          cateList: result.data.message
        })
      }
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata"
    }).then( result => {
      // console.log(result);
      if(result.data.meta.status === 200) {
        this.setData({
          floorList: result.data.message
        })
      }
    })
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  