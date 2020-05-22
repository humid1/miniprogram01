/**
 * 用户上滑页面，滚动条触底，开始加载下一页数据
 *    找到滚动条触底事件
 *    判断有没有下一页数据 (获取总页数 total、当前页码 pagenum)
 *      判断当前页码是否 >= 总页数
 *        向上取整
 *        总页数 = Math.ceil(总条数 total / 每页条数 pagesize)
 *      没有，弹出一个提示
 *      有，加载下一页数据
 *        当前的页码 +1
 *        重新发送数据
 *        对data中的数组 进行拼接，而不是全部替换
 */
import { request } from "../../request/index";

// pages/goods_list/goods_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    // 商品列表数据
    goodsList: []
  },
  // 获取商品列表的接口需要提供的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  // 修改 isActive 状态
  handleItemChange(e) {
    // console.log(e);
    // 获取标签索引
    const {index} = e.detail;
    // 修改源数据
    let {tabs} = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive=true : v.isActive=false)
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表数据
  getGoodsList() {
    request({url: '/goods/search', data: this.QueryParams}).then( result => {
      const goodsList = result.data.message.goods;
      // 获取总条数
      const total = result.data.message.total;
      // 计算总页数 （向上取整）
      this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
      this.setData({
        // 拼接数组
        goodsList: [...this.data.goodsList,...goodsList]
      })
    }, err => {
      console.log("请求失败"+ err);
      // 请求失败页数,判断是否为第一页，否则页数减 1
      if(this.QueryParams.pagenum > 1) {
        this.QueryParams.pagenum -- ;
      }
    })  
    // 关闭下拉刷新等待效果,如果没有使用下拉刷新的窗口，也不会报错
    wx.stopPullDownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 当前页码变为 1
    this.QueryParams.pagenum = 1;
    // 重新加载数据
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 1.判断是否有下一页
    if(this.QueryParams.pagenum >= this.totalPages) {
      // console.log('%c'+"没有下一页","color:red;font-size:50px;background-image:linear-gradient(to right, #0094ff,pink)");
      // 消息提示弹框
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      });
      
    } else {
      // console.log('%c'+"有下一页数据","color:red;font-size:50px;background-image:linear-gradient(to right, #0094ff,pink)");
      this.QueryParams.pagenum ++;
      this.getGoodsList();
    }
  }
})