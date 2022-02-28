/**
 * @description uploader test
 * @author wangfupeng
 */

import createUploader from '../../../packages/core/src/upload/createUploader'

describe('uploader', () => {
  it('uploader', () => {
    const uppy = createUploader({
      server: '/upload',
      fieldName: 'file1',
      metaWithUrl: false,
      onSuccess: (file, res) => {},
      onFailed: (file, res) => {},
      onError: (file, err, res) => {},
    })
    expect(uppy).not.toBeNull()

    // TODO 测试上传功能
  })
})
