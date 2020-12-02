const xhrMockClass = (config: any) => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    ontimeout: jest.fn(),
    upload: jest.fn(),
    onreadystatechange: jest.fn(),
    status: config.status,
    readyState: 4,
    responseText: config.res,
})

export default xhrMockClass
