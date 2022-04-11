import '@testing-library/jest-dom'
import nodeCrypto from 'crypto'

// @ts-ignore
global.crypto = {
  getRandomValues: function (buffer: any) {
    return nodeCrypto.randomFillSync(buffer)
  },
}

// Jest environment not contains DataTransfer object, so mock a DataTransfer class
// @ts-ignore
global.DataTransfer = class DataTransfer {
  clearData() {}
  getData(type: string) {
    if (type === 'text/plain') return ''
    return []
  }
  setData() {}
  get files() {
    return [new File(['124'], 'test.jpg')]
  }
}
