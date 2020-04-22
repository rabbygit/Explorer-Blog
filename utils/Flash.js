class Flash {
    constructor(req) {
        this.req = req
        this.success = this.extraxtFlashMessage('success')
        this.fail = this.extraxtFlashMessage('fail')
    }

    extraxtFlashMessage(name) {
        let message = this.req.flash(name)

        return message.length > 0 ? message[0] : false
    }

    hasMessage() {
        return !this.success && !this.fail ? false : true
    }

    static getMessage(req) {
        let flash = new Flash(req)

        return {
            success: flash.success,
            fail: flash.fail,
            hasMessage: flash.hasMessage()
        }
    }
}

module.exports = Flash