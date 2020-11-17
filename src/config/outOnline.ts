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
    onHeadChange: (list: TOutOnline) => {},
}
