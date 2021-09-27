import '@testing-library/jest-dom'
import nodeCrypto from 'crypto'

// @ts-ignore
global.crypto = {
  getRandomValues: function (buffer: any) {
    return nodeCrypto.randomFillSync(buffer)
  },
}
