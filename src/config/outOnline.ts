/**
 * @description 提取大纲配置
 * @author zhengwenjian
 */

export type TOutOnline = {
    tag: string
    id: string
    text: string
}

export default {
    outOnline: false, // 默认关闭大纲功能
    outOnlineChange: (list: TOutOnline) => {},
}
