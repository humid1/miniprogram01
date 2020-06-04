/**
 * 单击 + 触发 tap 点击事件
 *    调用小程序内置选择图片 api 
 *    获取到图片的路径 数组
 *    把图片路径存到 data 的变量中
 *    页面就可以根据 图片数组 进行循环显示，自定义组件
 * 点击 自定义图片 组件
 *    获取被点击的元素索引
 *    获取 data 中的图片数组
 *    根据索引数组中删除对应的元素，然后查询设置到元素中
 * 点击 “提交” 按钮
 *    获取文本域内容
 *      data 中定义变量，表示要输入的内容
 *      文本域绑定 输入事件，事件触发的时候，把输入框的值，存入到变量
 *    对这些内容进行合法校验
 *    验证通过，用户选择的图片，上传到专门的图片服务器，返回图片外网的链接
 *      变量图片数组
 *      一个一个的上传，上传成功后，返回外网地址
 *    文本域 和 外网的图片路径 一起提交的服务器中，（模拟）
 *    清空当前页面，返回上一页
 *   
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 被选中图片数组
    chooseImages: [],
    // 文本域的内容
    textVal: ''
  },
  // 外网的图片路径
  UploadImgs: [],
  // 修改 isActive 状态
  handleItemChange(e) {
    // console.log(e);
    // 1.获取标签索引
    const {index} = e.detail;
    // 修改源数据
    let {tabs} = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive=true : v.isActive=false)
    this.setData({
      tabs
    })
  },
  // 点击 + 选择图片
  handleChooseImg() {
    // 调用小程序内置选择图片 api 
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数
      sizeType: ['original','compressed'], // 所选的图片的尺寸
      sourceType: ['album','camera'],  // 选择图片的来源 
      success: (res)=>{
        // console.log(res);
        this.setData({
          // 图片数组，进行拼接
          chooseImages: [...this.data.chooseImages, ...res.tempFilePaths]
        })
      }
    });
  },
  // 删除图片
  handleDelImg(imgUrl) {
    // 获取源数据
    const {chooseImages} = this.data;
    // 根据图片url地址，获取索引值
    const index = chooseImages.findIndex(v => v === imgUrl);
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })
  },
  // 文本域输入的事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的事件
  handleFormSubmit() {
    // 获取文本内容
    const {textVal,chooseImages} = this.data;
    // 合法性校验
    if(!textVal.trim()) {
      // 输入的值为空
      wx.showToast({
        title: '输入不合法！',
        mask: true,
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在提交数据...',
      mask: true
    })
    // 判断有没有需要上传的图片数据
    if(chooseImages.length == 0) {
      console.log("只提交文本信息！");
      wx.hideLoading();
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    } else {
      chooseImages.forEach( (v, i) => {
        // 准备上传图片到专门的图片服务器
       wx.uploadFile({
         // 被上传的文件的路径
         filePath: v,
         // 上传文件的名称
         name: 'image',
         // 图片要上传的 url 地址
         url: 'https://images.ac.cn/api/upload/upload',
         // 携带的文本信息
         formData: {apiType: 'xiaomi', token: 'e1e735ed8ade3e92f8be6393440a'},
         success: (res) => {
           console.log(res);
           let {url} = JSON.parse(res.data);
           this.UploadImgs.push(url);
           console.log(this.UploadImgs);
           // 所有图片都上传完毕
           if(i === chooseImages.length - 1) {
             // 关闭loading
             wx.hideLoading();
             console.log("把文本的内容和外网的图片数组，提交到后台中");
             // 提交成功了
             // 重置页面
             this.setData({
               textVal: '',
               chooseImages: []
             })
             // 返回上一页
             wx.navigateBack({
               delta: 1
             })
           }
         }
       })
     })
    }
  }
})