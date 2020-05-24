/**
 * 1.获取用户收货地址
 *    绑定点击事件
 *    调用小程序内置 api 获取用户收货地址 wx.chooseAddress()
 * 2.获取用户对小程序授权 获取地址 权限状态
 *    wx.getSetting()
 *    假设用户 点击获取收货地址的提示框 确定(可直接调用获取收货地址)
 *      scope.address 值 true
 *    假设用户 从未调用过 收货地址的 api  (可直接调用获取收货地址)  
 *      scope undefined
 *    假设用户 点击获取收货地址的提示框 取消
 *      scope.address 值 false
 *    打开设置界面，引导用户开启获取收货地址授权 wx.openSetting()
 * 3.页面加载完毕
 *    onShow()
 *    获取本地存储的地址数据
 *    把数据设置给 data 中的一个变量
 * 4.获取缓存中的商品数据
 *    商品详情页，添加购物车所需的额外值 num checked
 * 5.全选的实现，数据展示
 *    onShow 获取缓存中的购物车数据
 *    根据购物车中的商品数据，所有商品都被选中 checked=true   
 * 6.总价格和总数量
 *    都需要商品被选中，才需要计算
 *    获取购物车数组，遍历，判断商品是否选中
 *    总价格 += 商品单价 + 商品数量
 *    总数量 += 商品数量
 * 7.商品选中的功能
 *    绑定 change 事件
 *    获取到被修改的商品对象，对商品对象的选中状态进行取反
 *    重新填充回 data 和 缓存中
 * 8.商品全选和反选功能
 *    全选复选框绑定事件 change
 *    获取 data 中全选变量 allChecked
 *    直接取反 allChecked = !allChecked
 *    遍历购物车数组，让商品选中状态跟随 allChecked 改变
 *    重新计算 data 和 缓存中的 值
 * 9.商品数量的编辑
 *    "+","-" 按钮，绑定同一点击事件，区分的在于自定义属性
 *      "+","+1"   "-" "-1"
 *    传递被点击的商品 id, goods_id
 *    获取 data 中的 购物车数组,获取需要被修改的商品对象
 *    直接修改商品对象的数量 num
 *      当购物车的数量 =1 用户再次点击 "-",出现弹窗提示(wx.showModal)，询问用户是否要删除？
 *      确定：直接删除      取消：不做任何修改
 *    把 cart 数据查询设置
 * 10.点击结算的事件
 *       
 */
import { getSetting,openSetting,chooseAddress,showModal,showToast } from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取微信缓存中的数据（生产环境是获取后台数据） 
   */
  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    this.setData({ address })
    // 2.获取缓存中的商品数据
    const cart = wx.getStorageSync('cart') || [];
    // 3.把值设置到 data 中
    this.setCart(cart);
  },
  /**
   * 点击 获取收货地址 按钮
   */
  async handleChooseAddress(e) {
    // 1.获取 权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     // console.log(result)
    //     const scopeAddress = result.authSetting['scope.address'];
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       // 获取微信收货地址
    //       wx.chooseAddress({
    //         success: (result2)=>{
    //           console.log(result2)
    //         },
    //         fail: (err)=>{
    //           wx.showToast({
    //             title: '获取收货地址失败',
    //             icon: 'none'
    //           });
    //         }
    //       });
    //     } else {
    //       // 用户以前拒绝授权，引导用户打开权限页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           // 调用获取 收货地址代码
    //           wx.chooseAddress({
    //             success: (result2)=>{
    //               console.log(result2)
    //             },
    //             fail: (err)=>{
    //               wx.showToast({
    //                 title: '获取收货地址失败',
    //                 icon: 'none'
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });

    // 封装为 Promise 语法
    // getSetting().then((res) => {
    //   const scopeAddress = res.authSetting['scope.address'];
    //   if(scopeAddress === true || scopeAddress === undefined) {
    //     return true;
    //   } else {
    //     return openSetting();
    //   }
    // }).then( res2 => {
    //   return chooseAddress();
    // }).then( res3 => {
    //   console.log(res3);
    // }, err => {
    //   wx.showToast({
    //     title: '获取收货地址失败',
    //     icon: 'none'
    //   });
    // })

    // async-await语法 （需在方法前加上 async）
    // 1.获取 权限状态
    try{
      const res = await getSetting();
      // 2.判断权限状态
      if(res.authSetting['scope.address'] === false) {
        // 用户以前拒绝授权，引导用户打开权限页面
        await openSetting();
      }
      // 3.获取收货地址信息
      let address = await chooseAddress().catch(err => {
        wx.showToast({
          title: '获取收货地址失败',
          icon: 'none'
        });
      });
      // 4.存入到缓存中
      // console.log(address);
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync('address', address)

    } catch(err) {
      console.log(err);
    }
  },
  // 商品的复选框被改变的事件
  handleItemChecked(e) {
    // 获取被修改的商品的 ID
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数据
    let { cart } = this.data;
    // 找到被修改的对象
    let index = cart.findIndex( v => v.goods_id === goods_id )
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把购物车数据重新赋值到 data 和 缓存 中
    this.setCart(cart);
  },
  // 商品全选功能
  handleAllChecked() {
    // 获取 data 中的数据
    let {cart,allChecked} = this.data;
    // 值取反
    allChecked = !allChecked
    // 循环修改 cart 数组中的 checked 值 等于 allChecked 的值
    cart.forEach( v => v.checked = allChecked);
    // 把修改后的值，重新赋值
    this.setCart(cart);
  },
  // 商品数量编辑功能
  async handleItemNumEdit(e) {
    // console.log(e);
    // 1.获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset;
    // 2.获取购物车数组
    let {cart} = this.data;
    // 3.找到需要修改的商品索引
    let index = cart.findIndex( v => v.goods_id === id);
    // 4.是否要执行删除
    if(cart[index].num === 1 && operation === -1) {
      // 4.1弹窗提示
      const res = await showModal('是否要在购物车删除该商品？');
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 5.修改商品数量
      cart[index].num += operation;     
      // 6.设置 data 和 缓存
      this.setCart(cart);
    }
  },
  // 设置购物车状态，同时重新计算属性
  setCart(cart) {
    // 3.计算全选
    // every 数组方法，会遍历，会接收一个回调函数，那么每一个回调函数都返回 true，那么every 方法的返回值为 true
    // 只要有一个回调函数返回了 false，那么就不会在循环执行，直接返回 false
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false;
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart);
  },
  // 点击结算按钮的功能
  async handlePay() {
    // 1.判断收货地址
    const {address, totalNum} = this.data;
    if(!address.userName) {
      await showToast({
        title: '未选择收货地址！'
      })
      return;
    }
    // 2.判断用户有没有选购商品
    if(totalNum === 0) {
      await showToast({ title: '购物车中没有可结算的商品！' });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  }
})