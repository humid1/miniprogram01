/**
 * Promise 形式的 getSetting
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * Promise 形式的 chooseAddress
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * Promise 形式的 openSetting
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * 显示弹框方法的封装
 *  Promise 形式的 showModal
 */
export const showModal = (content) => {
  return new Promise( (resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  }) 
}
/**
 * Promist 形式 showToast
 */
export const showToast = ({title}) => {
  return new Promise( (resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      success: (result)=>{
        resolve(result)
      },
      fail: (err) => { reject(err) }
    });
  })
}
/**
 * 使用 Promise 封装 wx.login()
 */
export const login = () => {
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}