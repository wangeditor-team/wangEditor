import createEditor from '../../../tests/utils/create-editor'
import insertVideo from '../src/module/helper/insert-video'
import uploadVideos from '../src/module/helper/upload-videos'
import * as slate from 'slate'
import nock from 'nock'

const server = 'https://fake-endpoint.wangeditor-v5.com'

let editor: ReturnType<typeof createEditor>
describe('Video module helper', () => {
  beforeEach(() => {
    editor = createEditor()
  })

  describe('insert-video helper', () => {
    test('it should return if give empty src', async () => {
      expect(await insertVideo(editor, '', '')).toBeUndefined()
    })

    test('it should alert result if checkVideo return result that data type is string', async () => {
      const editor = createEditor({
        config: {
          MENU_CONF: {
            insertVideo: {
              checkVideo: (_src: string, _poster: string) => 'check result',
            },
          },
        },
      })
      const fn = jest.fn()
      editor.alert = fn

      await insertVideo(editor, 'test.mp4', 'xxx.png')

      expect(fn).toBeCalledWith('check result', 'error')
    })

    test('it should return if checkVideo return null', async () => {
      const editor = createEditor({
        config: {
          MENU_CONF: {
            insertVideo: {
              checkVideo: (_src: string, _poster: string) => null,
            },
          },
        },
      })

      expect(await insertVideo(editor, 'test.mp4', 'xxx.png')).toBeUndefined()
    })

    test('it should invoke slate insertNodes method if give right src', done => {
      const fn = jest.fn()
      jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(fn)

      insertVideo(editor, 'test.mp4', 'xxx.png').then(() => {
        setTimeout(() => {
          expect(fn).toBeCalled()
          done()
        })
      })
    })

    test('it should invoke onInsertedVideo callback if pass the option when create editor', done => {
      const fn = jest.fn()

      const editor = createEditor({
        config: {
          MENU_CONF: {
            insertVideo: {
              onInsertedVideo: fn,
            },
          },
        },
      })

      insertVideo(editor, 'test.mp4', 'xxx.png').then(() => {
        expect(fn).toBeCalled()
        done()
      })
    })

    test('it should parse iframe if give iframe element', done => {
      const fn = jest.fn()
      jest.spyOn(slate.Transforms, 'insertNodes').mockImplementation(fn)

      insertVideo(editor, '<iframe src="test.mp4"></iframe>').then(() => {
        setTimeout(() => {
          expect(fn).toBeCalled()
          done()
        })
      })
    })
  })

  describe('upload-video helper', () => {
    test('it should return if give null', async () => {
      expect(await uploadVideos(editor, null)).toBeUndefined()
    })

    test('it should invoke customUpload if give the option when create editor', async () => {
      const fn = jest.fn()
      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              customUpload: fn,
            },
          },
        },
      })

      await uploadVideos(editor, [new File(['123'], 'test.png')] as unknown as FileList)

      expect(fn).toBeCalled()
    })

    test('it should invoke onSuccess callback if give the option when create editor', async () => {
      const fn = jest.fn()
      nock(server)
        .defaultReplyHeaders({
          'access-control-allow-method': 'POST',
          'access-control-allow-origin': '*',
        })
        .options('/')
        .reply(200, {})
        .post('/')
        .reply(200, { errno: 0 })

      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              server,
              onSuccess: fn,
            },
          },
        },
      })

      await uploadVideos(editor, [new File(['test123'], 'foo.jpg')] as unknown as FileList)

      expect(fn).toBeCalled()
    })

    test('it should invoke onProgress callback and show progress bar if uploading', async () => {
      const mockOnProgress = jest.fn()
      nock(server)
        .defaultReplyHeaders({
          'access-control-allow-method': 'POST',
          'access-control-allow-origin': '*',
        })
        .options('/')
        .reply(200, {})
        .post('/')
        .reply(200, { errno: 0 })

      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              server,
              onProgress: mockOnProgress,
            },
          },
        },
      })

      const mockShowProgressBar = jest.fn()
      editor.showProgressBar = mockShowProgressBar

      await uploadVideos(editor, [new File(['test123'], 'foo.jpg')] as unknown as FileList)

      expect(mockOnProgress).toBeCalled()
      expect(mockShowProgressBar).toBeCalled()
    })

    test('it should invoke onError callback if upload failed', () => {
      const fn = jest.fn()
      nock(server)
        .defaultReplyHeaders({
          'access-control-allow-method': 'POST',
          'access-control-allow-origin': '*',
        })
        .options('/')
        .reply(200, {})
        .post('/')
        .reply(400, {})

      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              server,
              onError: fn,
            },
          },
        },
      })

      uploadVideos(editor, [new File(['test123'], 'foo.jpg')] as unknown as FileList).catch(() => {
        expect(fn).toBeCalled()
      })
    })

    test('it should invoke onFail callback if upload result with error', async () => {
      const fn = jest.fn()
      nock(server)
        .defaultReplyHeaders({
          'access-control-allow-method': 'POST',
          'access-control-allow-origin': '*',
        })
        .options('/')
        .reply(200, {})
        .post('/')
        .reply(200, { error: 1 })

      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              server,
              onFailed: fn,
            },
          },
        },
      })

      await uploadVideos(editor, [new File(['test123'], 'foo.jpg')] as unknown as FileList)

      expect(fn).toBeCalled()
    })

    test('it should invoke customInsert callback if upload successfully', async () => {
      const fn = jest.fn()
      nock(server)
        .defaultReplyHeaders({
          'access-control-allow-method': 'POST',
          'access-control-allow-origin': '*',
        })
        .options('/')
        .reply(200, {})
        .post('/')
        .reply(200, { error: 0 })

      const editor = createEditor({
        config: {
          MENU_CONF: {
            uploadVideo: {
              server,
              customInsert: fn,
            },
          },
        },
      })

      await uploadVideos(editor, [new File(['test123'], 'foo.jpg')] as unknown as FileList)

      expect(fn).toBeCalled()
    })
  })
})
