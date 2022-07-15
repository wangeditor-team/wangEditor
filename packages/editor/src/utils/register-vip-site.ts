/**
 * @description 注册 vip site
 * @author wangfupeng
 */

interface IVipSiteInfo {
  hostname: string
  expire: string
  desc?: string
}

function main() {
  // nodejs 环境下不执行
  if (typeof global === 'object') return

  // @ts-ignore 标记是否是 vip    // 100 未知；   101 不是；    102 是；    103 已过期；    104 网络错误；
  window.__wangEditorVipSiteFlag = 100

  // @ts-ignore 注册 vip 回调函数
  window.__wangEditorRegisterVipSite = (vipSites: Array<IVipSiteInfo>) => {
    for (const siteInfo of vipSites) {
      const { hostname, expire } = siteInfo

      // hostname 不匹配，则继续下一个
      if (hostname !== location.hostname) continue

      // 判断有效期是否过期
      const now = Date.now()
      const expireDt = new Date(expire)
      // @ts-ignore 对比时间
      if (now - expireDt < 0) {
        // @ts-ignore 在有效期之内，设置为 vip
        window.__wangEditorVipSiteFlag = 102
        console.log(
          `wangEditor: 您是 VIP ，到期时间是 ${expire}，提前续费有优惠~\nhttps://www.wangeditor.com/v5/VIP.html`
        )
      } else {
        // @ts-ignore 过期了
        window.__wangEditorVipSiteFlag = 103
        console.log(
          `wangEditor: VIP 已过期，最后时间是 ${expire}，请续费~\nhttps://www.wangeditor.com/v5/VIP.html`
        )
      }
      break
    }
    // @ts-ignore
    if (window.__wangEditorVipSiteFlag === 100) {
      // @ts-ignore 未找到，设置标记 非 vip
      window.__wangEditorVipSiteFlag = 101
      console.log(
        `wangEditor: 您还不是 VIP 用户，新用户可免费试用~\nhttps://www.wangeditor.com/v5/VIP.html`
      )
    }
  }

  // 尝试注册 vip
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://www.wangeditor.com/vip/register-site.js' // 配置在 https://github.com/wangEditor/vip
  script.onerror = () => {
    // @ts-ignore 加载错误，可能是网络原因
    window.__wangEditorVipSiteFlag = 104
  }
  document.getElementsByTagName('head')[0].appendChild(script)
}

main()
