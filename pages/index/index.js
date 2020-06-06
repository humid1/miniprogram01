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
      url: "/home/swiperdata"
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
      url: "/home/catitems"
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
      url: "/home/floordata"
    }).then( result => {
      // console.log(result);
      if(result.data.meta.status === 200) {
        // 格式化跳转 url 地址
        const floorList = result.data.message;
        floorList.forEach( v => {
          v.product_list.forEach( v2 => {
            v2.navigator_url = '/pages/goods_list/goods_list' + v2.navigator_url.substring(v2.navigator_url.lastIndexOf('?'));
          })
        })        
        this.setData({
          floorList
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
  