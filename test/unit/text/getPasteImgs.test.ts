/**
 * @description text utils getPasteImgs test
 * @author luochao
 */
import { getPasteImgs } from '../../../src/text/paste/paste-event'
import mockFile from '../../helpers/mock-file'

window.ClipboardEvent = jest.fn().mockImplementation(() => {
    return {
        clipboardData: {
            getData: jest.fn(),
            items: [
                {
                    type: 'image/png',
                    getAsFile: jest.fn(() =>
                        mockFile({ name: '1.png', size: 1024, mimeType: 'image/png' })
                    ),
                },
                {
                    type: 'image/png',
                    getAsFile: jest.fn(() =>
                        mockFile({ name: '2.png', size: 1024, mimeType: 'image/png' })
                    ),
                },
            ],
        },
    }
})

// @ts-ignore
window.clipboardData = {
    getData: jest.fn(),
}

describe('text utils getPasteImgs test', () => {
    test('能从 clipboradEvent 获取到图片文件', () => {
        const clipboradEvent = new ClipboardEvent('')

        const mockGetData = jest.fn(() => '')
        // @ts-ignore
        jest.spyOn(clipboradEvent.clipboardData, 'getData').mockImplementation(mockGetData)

        const results = getPasteImgs(clipboradEvent)
        expect(results.length).toBe(2)
    })

    test('能从 clipboradEvent 有text内容，直接返回空数组', () => {
        const clipboradEvent = new ClipboardEvent('')
        const mockGetData = jest.fn(() => 'test123')
        // @ts-ignore
        jest.spyOn(clipboradEvent.clipboardData, 'getData').mockImplementation(mockGetData)

        const result = getPasteImgs(clipboradEvent)

        expect(result.length).toBe(0)
        expect(mockGetData).toBeCalledWith('text/plain')
    })
})
