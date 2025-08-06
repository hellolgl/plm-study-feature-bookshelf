import React, { Component } from 'react'
import { View, Text, PermissionsAndroid } from 'react-native'
import { Buffer } from 'buffer'
import wav from 'node-wav'
import Permissions, { PERMISSIONS } from 'react-native-permissions'
import AudioRecord from 'react-native-audio-record'
import RNFS, { stat } from "react-native-fs"
import WebView from "react-native-webview"
// import {
//     // Toast,
//     // ActivityIndicator,
// } from '@ant-design/react-native'
import { Toast } from "antd-mobile-rn";

import { log, pxToDp } from "../tools"
import { appFont } from "../../theme"

import Ise from "../ise"

export default class Record extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recording: false,
            iseInfo: {},
            waitingIse: false,
        }
        this.loaded = false
        this.ise = null


    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false
    }

    async componentDidMount() {
        await this.checkPermission()
        const { recordIndex, iseInfo } = this.props
        this.setState({
            recordIndex,
            iseInfo,
        })
    }

    checkPermission = async () => {
        const p = await Permissions.check(PERMISSIONS.IOS.MICROPHONE)
        if (p === 'authorized') return
        return this.requestPermission()
    }

    requestPermission = async () => {
        await Permissions.request(PERMISSIONS.IOS.MICROPHONE)
    }

    start = async () => {

        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                console.log('write external stroage', grants);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Permissions granted');
                } else {
                    console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
        const { recordIndex } = this.state
        this.setState({ recording: true })
        const options = {
            sampleRate: 16000,
            channels: 1,
            bitsPerSample: 16,
            wavFile: `record_${recordIndex}.wav`
        }

        this.startTime = new Date()

        AudioRecord.init(options)

        AudioRecord.on('data', data => {
            const chunk = Buffer.from(data, "base64")
            const rawHeaderInfo = [82, 73, 70, 70, 228, 130, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 128, 62, 0, 0, 0, 232, 3, 0, 16, 0, 16, 0, 100, 97, 116, 97, 192, 130, 0, 0]
            const header = Buffer.from(new Uint8Array(rawHeaderInfo), "base64")
            const chunks = Buffer.concat([header, chunk])
            const pcm = wav.decode(chunks).channelData[0]
            const audioData = Object.values(pcm).filter(i => !isNaN(i))
            const renderData = JSON.stringify(audioData)
            if (this.loaded) {
                this.webviewRef.injectJavaScript(`
                  setTimeout(() => {
                    console.log('webviewnow 里面')
                  }, 600)
                `)
            }
        })

        AudioRecord.start()

    }

    getData = (filePath) => {
        return new Promise((resolve, reject) => {
            RNFS.readFile(filePath, 'base64').then(r => resolve(r))
        })
    }

    stop = async () => {
        if (!this.state.recording) return

        this.endTime = new Date()
        // if (this.endTime - this.startTime > 500) {
        console.log('stop11111 ', this.webviewRef)

        //     let audioPath = await AudioRecord.stop()
        //     console.log('stop2222')
        // const { iseInfo } = this.props
        // const word = iseInfo["xun_fei"] ?
        //     '\uFEFF' + `<customizer: interphonic>\n${iseInfo["xun_fei"]}\n${iseInfo["origin_tone"]}`
        //     :
        //     `\uFEFF${iseInfo.words[0]}`
        // await this.setState({
        //     waitingIse: true,
        // })
        // // console.log("INIT waiting ise: ", word)
        // // 进行讯飞评测
        // Toast.info(`Wating...`, 1)
        // const ise = new Ise()
        // const score = await ise.sendFile(audioPath, word)
        // console.log('score', score)
        // ise.closeIse()
        // if (score.dp_message !== "0") {
        //     Toast.info(
        //         // {
        //         //     content:
        //         //         <View style={{ width: pxToDp(300), height: pxToDp(80), alignItems: "center", justifyContent: "center" }}>
        //         //             <Text style={[{ color: "#FAF1E3", fontSize: pxToDp(40) }, appFont.syst_bold]}>Try Again!</Text></View>
        //         // },
        //         '再试一次',
        //         2,
        //     )
        // }
        // 清空 canvas 画布
        // this.webviewRef.injectJavaScript(
        //     `
        //   setTimeout(() => {
        //      clearCanvasLoop();
        //   }, 50)
        // `
        // )
        // await this.setState({
        //     waitingIse: false,
        // })
        // log("AFTER waiting ise: ", this.state.waitingIse)
        // else {
        //     Toast.info(`分数：${Number(score.total_score).toFixed(0)}`, 2)
        // }
        // 评分结束后删除录音文件
        // RNFS.unlink(audioPath).then(() => {
        //     console.log('FILE DELETED: ', audioPath)
        // })
        // return 0
        // } else {
        await AudioRecord.stop()
        // Toast.info(
        //     { content: <View style={{ width: pxToDp(400), height: pxToDp(80), justifyContent: "center", alignItems: "center" }}><Text style={[{ color: "#FAF1E3", fontSize: pxToDp(30) }, appFont.syst_bold, { color: 'white' }]}>Too short & try again!</Text></View> },
        //     2,
        // )
        // 清空 canvas 画布
        this.webviewRef.injectJavaScript(
            `
              setTimeout(() => {
                console.log('webviewnow 里面--------')
                 clearCanvasLoop();
              }, 50)
            `
        )
        return { "total_score": 0 }
        // }

    }


    wavWaveHTML = () => {
        const { backgroundColor } = this.props
        console.log('webview')
        const m = `
<!doctype html>
<meta name="viewport" content="width=device-width, user-scalable=no">
<style>
html {
  height: 100%;
  background-color: ${backgroundColor};
}
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background-color: ${backgroundColor};
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<canvas id="canvas"></canvas>
<script>
const log = console.log.bind(console)

const getCanvasAndContext = () => {

    const canvas = document.querySelector("#canvas")
    canvas.width = document.body.clientWidth * window.devicePixelRatio
    canvas.height = document.body.clientHeight * window.devicePixelRatio
    
    const context = this.canvas.getContext('2d')
    context.strokeStyle = '#34495e'
    return [canvas, context]
}

const getAudioCtx = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    return audioCtx
}

const [canvas, context] = getCanvasAndContext()

const audioCtx = getAudioCtx()

function buildWaveHeader() {
    const opts = {
        numFrames: 1024,
        numChannels: 1,
        sampleRate: 16000,
        bytesPerSample: 16,
    }
    const numFrames = opts.numFrames;
    const numChannels = opts.numChannels || 2;
    const sampleRate = opts.sampleRate || 44100;
    const bytesPerSample = opts.bytesPerSample || 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;

    const buffer = new ArrayBuffer(44);
    const dv = new DataView(buffer);

    let p = 0;

    function writeString(s) {
        for (let i = 0; i < s.length; i++) {
            dv.setUint8(p + i, s.charCodeAt(i));
        }
        p += s.length;
    }

    function writeUint32(d) {
        dv.setUint32(p, d, true);
        p += 4;
    }

    function writeUint16(d) {
        dv.setUint16(p, d, true);
        p += 2;
    }

    writeString('RIFF');              // ChunkID
    writeUint32(dataSize + 36);       // ChunkSize
    writeString('WAVE');              // Format
    writeString('fmt ');              // Subchunk1ID
    writeUint32(16);                  // Subchunk1Size
    writeUint16(1);                   // AudioFormat
    writeUint16(numChannels);         // NumChannels
    writeUint32(sampleRate);          // SampleRate
    writeUint32(byteRate);            // ByteRate
    writeUint16(blockAlign);          // BlockAlign
    writeUint16(bytesPerSample * 8);  // BitsPerSample
    writeString('data');              // Subchunk2ID
    writeUint32(dataSize);            // Subchunk2Size
    return buffer;
}

const sampleData = (originData) => { 
    // let data = [];
    let data = originData;
    // 存储所有的正数据
    let positives = [];
    // 存储所有的负数据
    let negatives = [];
    // 先每隔100条数据取1条
    // for (let i = 0; i < originData.length; i += 10) {
    //     data.push(originData[i]);
    // }
    // log("data len: ", data.length)
    // 再从data中每10条取一个最大值一个最小值
    const sample = 5
    const d = []
    for (let j = 0, len = parseInt(data.length / sample); j < len; j++) {
        let temp = data.slice(j * sample, (j + 1) * sample);
        // positives.push(Math.max.apply(null, temp));
        // negatives.push(Math.min.apply(null, temp));
        d.push(Math.max.apply(null, temp))
        d.push(Math.max.apply(null, temp))
    }
    // return [positives, negatives]
    return d
}

clearCanvas = () => {
    const ctx = context
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

clearCanvasLoop = () => {
    const ctx = context
    for (let i = 0; i < 10; i++) {
          setTimeout(() => {
             ctx.clearRect(0, 0, canvas.width, canvas.height)
          }, 10)
    }
}

updateEvent = (data) => {
    // const [positives, negatives] = sampleData(data)
    const ctx = context
    // 转换坐标系
    ctx.scale(1, -1)
    ctx.translate(0, -1 * canvas.height)
    console.log('')
    // 设置画图样式
    ctx.fillStyle = "#E6DBCF";
    ctx.strokeStyle = "#4C94FF"
    ctx.lineWidth = 5
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath();

    // const d = [...positives, ...negatives]
    const d = sampleData(data)

    const slice = canvas.width / (d.length - 1)
    d.reduce((x, value, index) => {
        let y = (0.5 + value) * canvas.height
        if (y < 0) {
            y = 20
        } else if (y > canvas.height) {
            y = canvas.height - 20
        }
        if (index > 0) {
          context.lineTo(x, y)
        } else {
          context.moveTo(x, y)
        }
        return x + slice
    })
    context.stroke()
}

window.waveform = {
    updateEvent
}

</script>
`
        return m
    }

    render() {
        const { soundWavePosition, waveStyle, backgroundColor } = this.props
        const { waitingIse } = this.state
        const { width, height } = waveStyle
        return (
            <View
                style={[
                    {
                        position: "absolute",
                        width: width,
                        height: height,
                        backgroundColor: 'transparent',
                        zIndex: 999,
                        // backgroundColor: 'pink'
                    },
                    soundWavePosition,
                ]}
            >
                {
                    waitingIse ?
                        <View>
                            {/* <ActivityIndicator size={"large"} text="Waiting..." /> */}
                            <Text>加载中</Text>
                        </View>
                        :
                        <WebView
                            ref={(ref) => {
                                this.webviewRef = ref
                            }}
                            javaScriptEnabled={true}
                            useWebKit={true}
                            originWhitelist={['*']}
                            style={{ backgroundColor: backgroundColor, zIndex: 999, }}
                            onLoad={() => (this.loaded = true)}
                            source={{
                                html: `${this.wavWaveHTML()}`,
                            }}
                        />
                }
            </View>
        );
    }
}
