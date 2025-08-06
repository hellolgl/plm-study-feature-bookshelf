import _ from 'lodash';
// @ts-ignore
import CryptoJS from 'crypto-js';
import RNFS, { stat } from 'react-native-fs';
import { Buffer } from 'buffer';
// @ts-ignore
import Parser from 'react-xml-parser';

const log = console.log.bind(console);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

class Base64Tool {
    static btoa = (input) => {
        return Buffer.from(input).toString('base64');
    };

    static atob = (input) => {
        return Buffer.from(input, 'base64').toString();
    };
}

class Authorization {
    constructor() {
        // this.API_HOST = 'ise-api.xfyun.cn';
        this.API_HOST = 'ise-api.xfyun.cn/v2/open-ise';
        // company
        // this.APP_ID = 'c7c3b5f5';
        // this.API_SECRET = 'NWUxYTZhNDY3ODVjNWMwOTY4ZmU5ZTIx';
        // this.API_KEY = 'dc8b3c4126d3898cb06a86fdd8444feb';

        this.APP_ID = "7cfe4122"
        this.API_SECRET = "ZDY1M2UzODg1NjEyZWYyZTFiZWZmM2I2"
        this.API_KEY = "f1c3b375b7b3ddbb81a4916006785a88"
    }

    getSignature = (signatureOrigin) => {
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.API_SECRET);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        return signature;
    };

    getAuthorization = (signature) => {
        const algorithm = 'hmac-sha256';
        const authorizationOrigin = `api_key="${this.API_KEY}", algorithm="${algorithm}", headers="host date request-line", signature="${signature}"`;
        return Base64Tool.btoa(authorizationOrigin);
    };

    getUrl = () => {
        // const date = "Wed, 10 Jul 2019 07:35:43 GMT"
        // @ts-ignore
        const date = new Date().toGMTString();
        const signatureOrigin = `host: ${this.API_HOST}\ndate: ${date}\nGET /v2/open-ise HTTP/1.1`;
        const signature = this.getSignature(signatureOrigin);
        const authorization = this.getAuthorization(signature);
        const url = `wss://ise-api.xfyun.cn/v2/open-ise?authorization=${authorization}&date=${date}&host=${this.API_HOST}`;
        return url;
    };
}

class GeneratorTool {
    constructor(data) {
        this.data = data;
    }

    makeIterator(start = 0, end = Infinity, step = 1) {
        let nextIndex = start;
        let iterationCount = 0;
        const _this = this;

        return {
            next() {
                let result;
                if (nextIndex < end) {
                    result = {
                        value: _this.data.slice(nextIndex, nextIndex + step),
                        done: false,
                    };
                    nextIndex += step;
                    iterationCount++;
                    return result;
                }
                return { value: iterationCount, done: true };
            },
        };
    }
}

class Audio {
    static getData = (filePath) => {
        return new Promise(resolve => {
            RNFS.readFile(filePath, 'base64').then((r) => resolve(r));
        });
    };
}

class Ise {
    authorization = new Authorization();
    webSocket = new WebSocket(
        encodeURI(this.authorization.getUrl()),
    );
    score = {};
    audioData = '';
    handlerInterval;
    iseType;

    get url() {
        return this.authorization.getUrl();
    }

    webSocketSend = async (filePath, iseInfo) => {
        const { contentType, content } = iseInfo;
        let formatWord =
            '\uFEFF' + `[${contentType === 'word' ? 'word' : 'content'}]\n${content}`;
        console.log('formatWord', formatWord);
        console.log('iseType', this.iseType);
        // @ts-ignore
        Audio.getData(`${filePath}`).then((audioData) => {
            this.audioData = audioData;
            const audioIterator = new GeneratorTool(audioData);
            const step = 26000;
            const it = audioIterator.makeIterator(0, audioData.length, step);
            // 第一次发送时
            let result = it.next();
            let data = result.value;
            const params = {
                common: {
                    app_id: this.authorization.APP_ID,
                },
                business: {
                    sub: 'ise',
                    ent: 'en_vip',
                    category: this.iseType,
                    aus: 1,
                    cmd: 'ssb',
                    text: formatWord,
                    ttp_skip: true,
                    tte: 'utf-8',
                    rstcd: 'utf8',
                    group: 'pupil',
                    aue: 'raw',
                    rst: 'entirety',
                    ise_unite: '1',
                    extra_ability: 'multi_dimension',
                    // aue: 'lame',
                },
                data: {
                    status: 0,
                    data: data,
                },
            };

            this.webSocket.send(JSON.stringify(params));

            this.handlerInterval = setInterval(() => {
                // websocket未连接
                if (this.webSocket.readyState !== 1) {
                    this.audioData = '';
                    clearInterval(this.handlerInterval);
                    return;
                }
                result = it.next();
                // 最后一帧
                if (result.done) {
                    log('发送最后一帧数据');
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
                        }),
                    );
                    this.audioData = '';
                    clearInterval(this.handlerInterval);
                    return false;
                } else {
                    let data = result.value;
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
                        }),
                    );
                }
            }, 40);
        });
    };

    connectWebSocket = (filePath, iseInfo) => {
        // this.webSocket = new WebSocket(encodeURI(this.url));
        this.webSocket.onopen = () => {
            setTimeout(() => {
                this.webSocketSend(filePath, iseInfo);
            }, 200);
            // log("websocket onopen: ", e)
        };
        this.webSocket.onmessage = e => {
            const data = JSON.parse(e.data);
            if (_.isEmpty(data.data)) {
                this.score = {
                    dp_message: 0,
                    phone_score: 0,
                    tone_score: 0,
                    total_score: 0,
                };
            } else if (data.data.status === 2) {
                const xmlText = Base64Tool.atob(data.data.data);
                const xmlParser = new Parser().parseFromString(xmlText);
                if (_.isEqual(this.iseType, 'read_word')) {
                    const scoreInfo = xmlParser.getElementsByTagName(this.iseType)[1]
                        .attributes;
                    const { total_score } = scoreInfo;
                    this.score = {
                        total_score,
                    };
                } else if (_.isEqual(this.iseType, 'read_sentence')) {
                    const scoreInfo =
                        xmlParser.getElementsByTagName('read_chapter')[0].attributes;
                    const {
                        total_score,
                        accuracy_score,
                        fluency_score,
                        integrity_score,
                        standard_score,
                        word_count,
                    } = scoreInfo;

                    const words = xmlParser.getElementsByTagName('word');
                    const children = words.map(w => {
                        const a = w.attributes;
                        return {
                            content: a.content,
                            score: Math.trunc(a.total_score),
                        };
                    });
                    this.score = {
                        total_score: Math.trunc(total_score),
                        // total_score: 100,
                        accuracy_score: Math.trunc(accuracy_score),
                        fluency_score: Math.trunc(fluency_score),
                        integrity_score: Math.trunc(integrity_score),
                        standard_score: Math.trunc(standard_score),
                        word_count: Math.trunc(word_count),
                        children,
                    };
                } else if (_.isEqual(this.iseType, 'read_chapter')) {
                    const scoreInfo = xmlParser.getElementsByTagName(this.iseType)[1]
                        .attributes;
                    const {
                        total_score,
                        accuracy_score,
                        fluency_score,
                        integrity_score,
                        standard_score,
                        word_count,
                    } = scoreInfo;
                    const words = xmlParser.getElementsByTagName('word');
                    const children = words.map(w => {
                        const a = w.attributes;
                        return {
                            content: a.content,
                            score: Math.trunc(a.total_score),
                        };
                    });
                    this.score = {
                        total_score: Math.trunc(total_score),
                        // total_score: 100,
                        accuracy_score: Math.trunc(accuracy_score),
                        fluency_score: Math.trunc(fluency_score),
                        integrity_score: Math.trunc(integrity_score),
                        standard_score: Math.trunc(standard_score),
                        word_count: Math.trunc(word_count),
                        children,
                    };
                }
            }
        };
        this.webSocket.onerror = e => {
            log('websocket onerror: ', e);
        };
        this.webSocket.onclose = e => {
            log('websocket onclose: ', e);
        };
    };

    sendFile = async (filePath, iseInfo) => {
        log('send file here...', filePath);
        const statResult = await stat(filePath);
        log('sendfile statResult: ', statResult);
        const { contentType } = iseInfo;
        const iseTypeMap = {
            word: 'read_word',
            sentence: 'read_sentence',
            chapter: 'read_chapter',
        };
        // @ts-ignore
        const iseType = iseTypeMap[contentType];
        this.iseType = iseType;
        this.connectWebSocket(filePath, iseInfo);
        return await this.getScore();
    };

    getScore = async () => {
        while (Object.keys(this.score).length === 0) {
            await sleep(100);
        }
        return this.score;
    };

    closeIse = () => {
        this.webSocket.close();
    };
}

export default Ise;
