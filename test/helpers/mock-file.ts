export default function mockFile(option: any) {
    const name = option.name ?? 'mock.txt'
    const size = option.size ?? 1024
    const mimeType = option.mimeType || 'plain/txt'

    function range(count: number) {
        let output = ''
        for (var i = 0; i < count; i++) {
            output += 'a'
        }
        return output
    }

    const blob = new Blob([range(size)], { type: mimeType })

    return new File([blob], name)
}
