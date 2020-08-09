class codeItem {
    constructor(id: string, type: string, text: string, code: string) {
        this.id = id
        this.type = type
        this.text = text
        this.code = code
    }

    public id: string | undefined

    public type: string | undefined

    public text: string | undefined

    public code: string | undefined
}

export default codeItem
