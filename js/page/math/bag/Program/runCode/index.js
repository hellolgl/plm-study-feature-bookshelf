import React, { PureComponent } from "react"
import {
	View,
} from "react-native"
import { WebView } from 'react-native-webview'

const log = console.log.bind(console)

export default class PyRuntime extends PureComponent {

	constructor() {
		super()
		this.webViewRef = React.createRef()
	}

	executePythonScript = () => {
		const jsCode = `run()`
		this.webViewRef.current.injectJavaScript(jsCode)
	}

	messageHandler(e) {
		let data = JSON.parse(e.nativeEvent.data)
		if (data["stdout"]) {
			this.props.getProgramResult({type: "stdout", msg: data["stdout"]})
		} else {
			this.props.getProgramResult({type: "stderr", msg: data["stderr"]})
		}
	}

	render() {
		const {code} = this.props
// 			const code = `
// import time
// for i in range(10):
//     print(i)
//     time.sleep(1)
// `
		const html = `
<!doctype html>
<html>
<head>
    <script src="https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/js-shell/brython-runner-bundle.js"></script>
</head>
<body>
    <script>
		const log = console.log.bind(console)
		const runner = new BrythonRunner({
            stdout: {
                write(content) {
					window.ReactNativeWebView.postMessage(JSON.stringify({"stdout": content}))
                },
                flush() { } 
            },
            stderr: {
                write(content) {
					window.ReactNativeWebView.postMessage(JSON.stringify({"stderr": content.split("main.py")[1]}))
                },
                flush() { }
            },
            stdin: {
                async readline() {
                    var data = prompt()
                    return data
                },
            }
        })

        function getCode() {
            return \`${code}\`
        }
        function run() {
            const code = getCode()
            runner.runCode(code)
        }
    </script>
    </body>
</html>
`
		return (
			<View>
				<WebView
					ref={this.webViewRef}
					onMessage={this.messageHandler.bind(this)}
					source={{ html: html }}
				/>
			</View>
		)
	}
}
