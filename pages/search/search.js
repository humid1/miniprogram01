/**
 * 输入框绑定，值改变事件， input 事件
 *    获取到输入框的值
 *    合法性判断
 *    校验通过，把输入框的值，发送到后台请求，响应回来的数据，然后渲染到页面
 * 防抖功能（定时器），节流
 *    定义全局的定时器 id
 *    防抖，一般在输入框中，防止重复输入，重复发送请求
 *    节流，异步是在页面的下拉或上拉
 */
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ''
  },
  TimeId: -1,
  // 输入框的值改变，会触发的事件
  handleInput(e) {
    // console.log(e);
    const {value} = e.detail;
    // 检测合法性
    if(!value.trim()) {
      // 值不合法
      this.setData({
        isFocus: false,
        goods: [],
        inpValue: ''
      })
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 请求后台获取数据
      this.qSearch(value);
    },1000)
  },
  async qSearch(query) {
    const { data: res } = await request({
      url: '/goods/qsearch',
      data: {query}
    })
    // console.log(res.message);
    this.setData({
      goods: res.message
    })
  },
  // 点击取消按钮触发的事件
  handleCancel() {
    this.setData({
      isFocus: false,
      goods: [],
      inpValue: ''
    })
  }
})