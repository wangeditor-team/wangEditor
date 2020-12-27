import WrapListHandle from './WrapListHandle'
import JoinListHandle from './JoinListHandle'
import StartJoinListHandle from './StartJoinListHandle'
import EndJoinListHandle from './EndJoinListHandle'
import OtherListHandle from './OtherListHandle'

import { HandlerListOptions } from './ListHandle'

// 片段类型
export type ContainerFragment = HTMLElement | DocumentFragment

// 处理类
export type ListHandleClass =
    | WrapListHandle
    | JoinListHandle
    | StartJoinListHandle
    | EndJoinListHandle
    | OtherListHandle

export enum ClassType {
    wrap = 'WrapListHandle',
    join = 'JoinListHandle',
    startJoin = 'StartJoinListHandle',
    endJoin = 'EndJoinListHandle',
    other = 'OtherListHandle',
}

const handle = {
    WrapListHandle,
    JoinListHandle,
    StartJoinListHandle,
    EndJoinListHandle,
    OtherListHandle,
}

export function createListHandle(
    classType: ClassType,
    options: HandlerListOptions,
    range?: Range
): ListHandleClass {
    if (classType === ClassType.other && range === undefined) {
        throw new Error('other 类需要传入 range')
    }

    return classType !== ClassType.other
        ? new handle[classType](options)
        : new handle[classType](options, range as Range)
}

/**
 * 统一执行的接口
 */
export default class ListHandleCommand {
    private handle: ListHandleClass
    private containerFragment: ContainerFragment

    constructor(handle: ListHandleClass) {
        this.handle = handle
        this.containerFragment = this.handle.exec()
    }

    getContainerFragment(): ContainerFragment {
        return this.containerFragment
    }
}
