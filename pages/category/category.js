// 导入用来发送请求的 封装代码，要把代码补全
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧菜单栏数据
    rightMenuList: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口返回数据（用于筛选数据）
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * web 中的本地存储和 小程序中的本地存储区别
     *  web
     *    localStorage.setItem('key','value')  localStorage.getItem('key')
     *    不管是什么类型，最终会调用 toString() , 把数据转换成字符串，在存入
     *  小程序
     *     wx.setStorageSync('key', data) wx.getStorageSync('key')
     *     不存在类型转换操作，支持原生类型、Date、及能够通过JSON.stringify序列化的对象
     * 
     * 判断本地缓存中是否有旧的数据
     *  { time: Date.new(),data: [...]}
     *  没有，就发送请求到后台
     *  有，同时旧数据也没有过期，就使用本地存储中的旧数据
     */
    // 1. 获取本地存储中的数据结构 (使用小程序官方提供的)
    const Cates = wx.getStorageSync('cates');
    // 2. 判断
    if(!Cates) {
      // 不存在后台获取数据
      this.getCates();
    } else {
      // 存在本地存储数据，定义过期时间 一天
      if(Date.now() - Cates.time > 1000 * 60 * 60 * 24) {
        // 重新查询后台数据消息
        this.getCates()
      } else {
        // 使用本地旧数据
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map( v => v.cat_name)
        // 构造右侧的商品数据
        let rightMenuList = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightMenuList
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then( result => {
    //   // console.log(result);
    //   if(result.data.meta.status === 200) {
    //     // 把数据存入到本地存储中
    //     wx.setStorageSync('cates', { time: Date.now(), data: result.data.message})
    //     this.Cates = result.data.message;
    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map( v => v.cat_name)
    //     // 构造右侧的商品数据
    //     let rightMenuList = this.Cates[0].children
    //     this.setData({
    //       leftMenuList,
    //       rightMenuList
    //     })
    //   }
    // })
    const { data: res } =  await request({ url: "/categories" });
    if(res.meta.status === 200) {
      // 把数据存入到本地存储中
      wx.setStorageSync('cates', { time: Date.now(), data: res.message})
      this.Cates = res.message;
      // 构造左侧的大菜单数据
      let leftMenuList = this.Cates.map( v => v.cat_name)
      // 构造右侧的商品数据
      let rightMenuList = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightMenuList
      })
    }
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e)
    /**
     * 获取点击的标题的索引
     * 给data中的currentIndex赋值
     * 根据不同的索引来渲染右侧商品内容
     */
    const {index} = e.currentTarget.dataset;
    let rightMenuList = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightMenuList,
      // 重新设置 右侧内容的scroll-view 标签的距离顶部的距离
      scrollTop: 0
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})