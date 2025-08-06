
import { Toast } from 'antd-mobile-rn';
import Sound from 'react-native-sound'

class ImmediatelyPlay {

    static playSuccessSound(url) {

        Sound.setCategory('Playback')
        // const url = "https://pailaimi-finnland-static.oss-accelerate.aliyuncs.com/notice-audio/success.wav"
        // const url = require('../../res/data/good.mp3')
        // const url = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/chinese/10/01/00/01/01/exercise/audio/56f9c7d0e41c46749b90a1b18e1399f8.mp3'

        // const whoosh = new Sound(`${url}`, null, (error) => {
        console.log('播放器路径', url)
        // Toast.info(url)
        const whoosh = new Sound(`${url}`, null, (error) => {

            console.log('播放器', error)
            if (error) {
                console.log('failed to load the sound', error);
                return;
            } else {
                console.log('audio   success')
            }
            whoosh.play((success) => {
                if (success) {
                    whoosh.release()
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        // console.log('结尾', whoosh)
        // whoosh.play((success) => {
        //     if (success) {
        //         console.log('successfully finished playing');
        //     } else {
        //         console.log('playback failed due to audio decoding errors', success);
        //     }
        // });
    }

    static playInitSound() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/paixiaoxue/sentence/kaiji.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            whoosh.setNumberOfLoops(-1)
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()

                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }

    //
    static playCodeSuccess() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/run_success.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()
                    whoosh.release()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }

    static playCodeFailed() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/run_failed.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()
                    whoosh.release()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }

    static playCodeFinish() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/preview.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()
                    whoosh.release()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }

    static playAnswerFinish() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/test_me_finish.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()
                    whoosh.release()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }

    static playFailGold() {
        Sound.setCategory('Playback')
        const url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/fail_gold.mp3"
        const whoosh = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing', whoosh);
                    // whoosh.loop()
                    whoosh.release()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        return whoosh
    }
}

export default ImmediatelyPlay
