import { DomElement } from '../../src/utils/dom-core'

const EventType = {
    Event: Event,
    KeyBoardEvent: KeyboardEvent,
    MouseEvent: MouseEvent,
    // jest dom 没有ClipboardEvent，使用Event替代
    ClipboardEvent: Event,
}

type EventTypeKey = keyof typeof EventType

export default function mockEventTrigger(
    $el: DomElement,
    type: string,
    eventType: EventTypeKey = 'Event',
    option?: any
) {
    const EventConstruct = EventType[eventType]

    const event = new EventConstruct(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        ...option,
    })
    $el.elems[0].dispatchEvent(event)
}
