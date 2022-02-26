import { genUploadImageConfig } from '../src/module/menu/config'

describe('Upload image default config', () => {
  test('Upload image invoke genUploadImageConfig should generate default config', () => {
    expect(typeof genUploadImageConfig()).toBe('object')
  })

  test('The option server is "" in default config', () => {
    expect(genUploadImageConfig().server).toBe('')
  })

  test('The option fieldName is "wangeditor-uploaded-image" in default config', () => {
    expect(genUploadImageConfig().fieldName).toBe('wangeditor-uploaded-image')
  })

  test('The option maxFileSize is "2M" in default config', () => {
    expect(genUploadImageConfig().maxFileSize).toBe(2 * 1024 * 1024)
  })

  test('The option maxNumberOfFiles is "100" in default config', () => {
    expect(genUploadImageConfig().maxNumberOfFiles).toBe(100)
  })

  test('The option allowedFileTypes is "[image/*"]" in default config', () => {
    expect(genUploadImageConfig().allowedFileTypes).toEqual(['image/*'])
  })

  test('The option metaWithUrl is "false" in default config', () => {
    expect(genUploadImageConfig().metaWithUrl).toBe(false)
  })

  test('The option withCredentials is "false" in default config', () => {
    expect(genUploadImageConfig().withCredentials).toBe(false)
  })

  test('The option timeout is "10s" in default config', () => {
    expect(genUploadImageConfig().timeout).toBe(10 * 1000)
  })

  test('The option base64LimitSize is "0" in default config', () => {
    expect(genUploadImageConfig().base64LimitSize).toBe(0)
  })
})
