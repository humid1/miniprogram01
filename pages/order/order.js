/**
 * 1.页面被打开的时候 onShow()
 *    onShow 不同于 onLoad 无法在形参中直接接收 options 参数
 *    判断缓存中有没有 token
 *      没有，直接跳转到授权页面
 *      有，直接往下进行
 *    获取 URL 上的参数 type
 *    根据 type 来决定页面标题的数组元素被选中
 *    根据 type 值去发送请求获取订单数据
 *    渲染页面
 * 2.点击不同的标题，重新发送请求来获取和渲染数据
 */
import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '待收款',
        isActive: false
      }
    ]
  },
  // 根据标题索引来激活选中，标题数组
  changeTitleByIndex(index) {
    // 修改源数据
    let {tabs} = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive=true : v.isActive=false)
    this.setData({
      tabs
    })
  },
  // 修改 isActive 状态
  handleItemChange(e) {
    // console.log(e);
    // 1.获取标签索引
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    // 2.重新发送请求
    this.getOrders(index + 1);
  },
  /**
   * 页面显示就触发的函数
   */
  onShow() {
    const token = wx.getStorageSync('token');
    if(!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return;
    }

    // 1.获取小程序的页面栈 - 数组，长度最大是 10 个页面
    let pages = getCurrentPages();
    // console.log(currentPages);
    // 2.数组中，索引最大的页面就是当前页面
    let currentPages = pages[pages.length - 1];
    // 3.获取 url 上的 type 参数
    const {type} = currentPages.options;
    // 4.激活页面选中标题 type=1 index=0
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const {data: res} = await request({
      url: '/my/orders/all',
      data: {
        type
      }
    })
    this.setData({
      orders: res.message.orders.map( v=> ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  }
})