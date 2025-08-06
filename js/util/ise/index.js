import _ from "lodash"
import CryptoJS from 'crypto-js'
import RNFS, { stat } from 'react-native-fs'
import { Buffer } from 'buffer'
import XMLParser from 'react-xml-parser'
import { Toast } from "antd-mobile-rn";

// let testMp3 = ""
// let testMp3_1 = ""

/*
usage:
    const filePath = "file:///data/user/0/com.my_app/files/quick_audio_1660544205976.aac"
    const word = "猫"
    const ise = new Ise()
    ise.sendFile(filePath, word)
         // {"phone_score": "100.000000", "tone_score": "100.000000", "total_score": "100.000000"}
         // phone_score：声韵分
         // tone_score：调型分
         // total_score：总分 【（phone_score + tone_score）/2】
        .then(score => console.log("appJS score: ", score))
* */

const log = console.log.bind(console)

const sleep = ms => new Promise(r => setTimeout(r, ms))

class Base64Tool {
    static btoa = (input) => {
        return Buffer.from(input).toString('base64')
    }

    static atob = (input) => {
        return Buffer.from(input, 'base64').toString()
    }
}

class Authorization {
    constructor() {
        this.API_HOST = "ise-api.xfyun.cn"
        // company
        // this.API_ID = "c7c3b5f5"
        // this.API_SECRET = "NWUxYTZhNDY3ODVjNWMwOTY4ZmU5ZTIx"
        // this.API_KEY = "dc8b3c4126d3898cb06a86fdd8444feb"

        // personal
        // this.APP_ID = "5441f5f4"
        // this.API_SECRET = "YjUyMDNjNmM0YTFmNTkzNjk5NDk0OGIx"
        // this.API_KEY = "11781e39a717a585f739f10f67becc48"

        this.APP_ID = "7cfe4122"
        this.API_SECRET = "ZDY1M2UzODg1NjEyZWYyZTFiZWZmM2I2"
        this.API_KEY = "f1c3b375b7b3ddbb81a4916006785a88"
    }

    _getSignature = (signatureOrigin) => {
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.API_SECRET)
        const signature = CryptoJS.enc.Base64.stringify(signatureSha)
        return signature
    }

    _getAuthorization = (signature, headers) => {
        const algorithm = 'hmac-sha256'
        const authorizationOrigin = `api_key="${this.API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        const authorization = Base64Tool.btoa(authorizationOrigin)
        return authorization
    }

    getUrl = () => {
        // const date = "Wed, 10 Jul 2019 07:35:43 GMT"
        const date = new Date().toGMTString()
        const signatureOrigin = `host: ${this.API_HOST}\ndate: ${date}\nGET /v2/open-ise HTTP/1.1`
        const signature = this._getSignature(signatureOrigin)
        const headers = 'host date request-line'
        const authorization = this._getAuthorization(signature, headers)
        const url = `wss://ise-api.xfyun.cn/v2/open-ise?authorization=${authorization}&date=${date}&host=${this.API_HOST}`
        return (url)
    }
}

class GeneratorTool {
    constructor(data) {
        this.data = data
    }

    makeIterator(start = 0, end = Infinity, step = 1) {
        let nextIndex = start
        let iterationCount = 0
        const _this = this

        const rangeIterator = {
            next() {
                let result
                if (nextIndex < end) {
                    // testMp3 += _this.data.slice(nextIndex, nextIndex + step)
                    result = { value: _this.data.slice(nextIndex, nextIndex + step), done: false }
                    nextIndex += step
                    iterationCount++
                    return result
                }
                return { value: iterationCount, done: true }
            }
        };
        return rangeIterator
    }
}

class Audio {
    static getData = (filePath) => {
        return new Promise((resolve, reject) => {
            RNFS.readFile(filePath, 'base64').then(r => resolve(r))
        })
    }

    static getDataInfo(filePath) {
        return RNFS.stat(filePath).then(r => r)
    }
}

class Ise {
    constructor() {
        this.webSocket = null
        this.authorization = new Authorization()
        this.audioData = null
        // phone_score: 声韵分
        // tone_score: 调型分
        // total_score: 总分 【（phone_score + tone_score）/2 】
        this.score = {}
        this.isWrong = false
    }

    get url() {
        return this.authorization.getUrl()
    }

    webSocketSend = async (filePath, word) => {
        word = word.replaceAll("&nbsp;", " ")
        const words = word.split("\n")
        const w = word.replaceAll("/", "|")
        let iseType
        if (words.length > 4) {
            iseType = "read_sentence"
        } else {
            iseType = words[1].length > 1 ? "read_word" : 'read_syllable'
        }
        let formatWord = w
        let isEnglish = false
        if (words[1] === "english_read_sentence") {
            isEnglish = true
            const contentType = words[0].split(" ").length === 1 ? "word" : "content"
            iseType = contentType === "word" ? "read_word" : "read_sentence"
            const content = _.trim(words[0].toString()).replaceAll(" ", " ")
            formatWord = `\uFEFF[${contentType}]\n${`${content}`}`
            if (iseType === 'read_word') {
                formatWord = formatWord.replaceAll('!', '').replaceAll('.', '')
            }
        } else if (iseType === "read_sentence") {
            let t = (words.length - 1) / 2
            const r = []
            r.push(words[0])
            for (let i = 1; i <= t; i++) {
                r.push(words[i])
                r.push(words[i + t])
            }
            formatWord = r.join("\n")
        }
        Audio.getData(`${filePath}`).then(audioData => {
            this.audioData = audioData
            const audioIterator = new GeneratorTool(audioData)
            const step = 26000
            const it = audioIterator.makeIterator(0, audioData.length, step)
            // 第一次发送时

            const params = {
                common: {
                    app_id: this.authorization.APP_ID,
                },
                business: {
                    sub: 'ise',
                    ent: isEnglish ? 'en_vip' : "cn_vip",
                    category: iseType,     // 单字朗读，汉语专有
                    // category: "read_word",     // 单字朗读，汉语专有
                    aus: 1,
                    cmd: 'ssb',
                    text: formatWord,
                    ttp_skip: true,
                    tte: 'utf-8',
                    rstcd: 'utf8',
                    group: 'pupil',
                    aue: 'raw',
                    // aue: 'lame',
                    check_type: "easy",
                },
                data: {
                    status: 0,
                    // data: data,
                },
            }
            // console.log('*****************', params)
            this.webSocket.send(JSON.stringify(params))

            this.handlerInterval = setInterval(() => {
                // websocket未连接
                if (this.webSocket.readyState !== 1) {
                    this.audioData = []
                    clearInterval(this.handlerInterval)
                    return
                }
                let result = it.next()
                // log("data length: ", data.length, result.done)
                // 最后一帧
                if (result.done) {
                    this.webSocket.send(
                        JSON.stringify({
                            business: {
                                cmd: 'auw',
                                aus: 4,
                            },
                            data: {
                                status: 2,
                                data: '',
                            },
                        })
                    )
                    this.audioData = []
                    clearInterval(this.handlerInterval)
                    return false
                } else {
                    let data = result["value"]
                    // testMp3_1 += data
                    this.webSocket.send(
                        JSON.stringify({
                            business: {
                                cmd: 'auw',
                                aus: 2,
                            },
                            data: {
                                status: 1,
                                data: data,
                            },
                        })
                    )
                }
                // log("final s: ", s === audioData)
            }, 40)
        })
    }

    connectWebSocket = (filePath, word) => {
        // this.webSocketSend()
        this.webSocket = new WebSocket(encodeURI(this.url))
        this.webSocket.onopen = e => {
            setTimeout(() => {
                this.webSocketSend(filePath, word)
            }, 200)
            // log("websocket onopen: ", e)
        }
        this.webSocket.onmessage = e => {
            const data = JSON.parse(e.data)
            // console.log('sssssssss', data)
            if (_.isEmpty(data.data)) {
                this.score = {
                    dp_message: 16,
                    phone_score: 0,
                    tone_score: 0,
                    total_score: 0,
                }
                if (data.code !== 0) {
                    this.isWrong = data.code
                }
            } else if (data.data.status === 2) {
                const xmlText = Base64Tool.atob(data.data.data)
                var xml = new XMLParser().parseFromString(xmlText)   // Assume xmlText contains the example XML
                const scoreInfo = xml['children'][0]['children'][0]['children'][0]['attributes']
                const syll = xml['children'][0]['children'][0]['children'][0]['children'][0]['children'][0]['children'][0]['attributes']
                let { dp_message } = syll
                // log("RAW: ", scoreInfo)
                let { phone_score, tone_score, total_score } = scoreInfo
                if (parseInt(total_score) < 5) {
                    total_score = parseInt(total_score * 20)
                    dp_message = "0"
                }
                let showScore = "0"
                if (dp_message === "0") {
                    let n = Math.floor(Math.random() * 10)
                    if (parseInt(total_score) == 0) {
                        dp_message = "1"
                    } else if (total_score <= 60) {
                        showScore = total_score
                    } else if (total_score <= 75) {
                        showScore = 75 + n
                    } else if (total_score <= 85) {
                        showScore = 85 + n
                    } else {
                        showScore = total_score
                    }
                }
                this.score = {
                    phone_score,
                    tone_score,
                    total_score: showScore,
                    dp_message,
                }
            }
        }
        this.webSocket.onerror = e => {
            log("websocket onerror: ", e)
            Toast.info(
                '网络出错，请稍后再试。',
                2,
            )
            this.score = {
                phone_score: undefined,
                tone_score: undefined,
                total_score: '0',
                dp_message: "0",
            }
        }
        this.webSocket.onclose = e => {
            log("websocket onclose: ", e, this.isWrong)
            if (this.isWrong) {
                Toast.info(
                    `err:${this.isWrong}\n评分出错。`,
                    2,
                )
                this.score = {
                    phone_score: undefined,
                    tone_score: undefined,
                    total_score: '0',
                    dp_message: "0",
                }
                this.isWrong = ''
            }
        }
    }

    sendFile = async (filePath, word) => {
        log("send file here...")
        const statResult = await stat(filePath)
        log("sendfile statResult: ", statResult)
        this.connectWebSocket(filePath, word)
        return await this.getScore()
    }

    getScore = async () => {
        while (!_.isEqual(Object.keys(this.score), ["phone_score", "tone_score", "total_score", "dp_message"])) {
            await sleep(100)
        }
        // const fp = "/sdcard/testMp3.mp3"

        // log("testMp3_1: ", testMp3_1)
        // RNFS.writeFile(fp, testMp3_1, 'base64')
        // log("~~~ debug: ", testMp3_1.length, testMp3.length)
        // RNFS.writeFile(fp, testMp3_1, 'base64')

        // RNFS.unlink(fp).then(() => {
        //     console.log('FILE DELETED')
        //     RNFS.writeFile(fp, testMp3_1, 'base64').catch((err) => {
        //         log("write file err: ", err)
        //     })
        // })
        return this.score
    }

    closeIse = () => {
        this.webSocket.close()
    }
}

export default Ise
