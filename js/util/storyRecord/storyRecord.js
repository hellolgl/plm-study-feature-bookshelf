import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {PermissionsAndroid, Platform} from 'react-native';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import EventRegister from '../../util/eventListener';

class StoryRecord {
    constructor() {
        this.wavFilePath = undefined;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
        this.audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        this.eventId = 0
    }

    getRecordFilePath = () => {
        const f = Platform.select({
            ios: `${new Date().getTime()}.m4a`,
            android: `${RNFS.CachesDirectoryPath}/${new Date().getTime()}.mp4`,
        });
        return f;
    };

    checkPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

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
        } else {
            const p = await Permissions.check(PERMISSIONS.IOS.MICROPHONE);
            if (p === 'granted') {
                return;
            } else {
                await Permissions.request(PERMISSIONS.IOS.MICROPHONE);
            }
        }
    };

    onStartRecord = async () => {
        await this.checkPermission();
        const meteringEnabled = false;
        const recordFilePath = this.getRecordFilePath();
        this.audioRecorderPlayer.startRecorder(
            recordFilePath,
            this.audioSet,
            meteringEnabled,
        );
        this.eventId = EventRegister.addEventListener('stopRecordEvent', () => {
            this.audioRecorderPlayer.stopRecorder();
        });
    };

    onStopRecord = async () => {
        const recordedAudioPath = await this.audioRecorderPlayer.stopRecorder();
        const wavFilePath = `${
            RNFS.DocumentDirectoryPath
        }/${Date.now()}recordedAudio.wav`;
        this.wavFilePath = wavFilePath;
        const command = Platform.select({
            // 单声道，采样率为 16000
            ios: `-i ${recordedAudioPath} -vn -acodec pcm_s16le -ar 16000 -ac 1 -b:a 256k ${wavFilePath}`,
            android: `-i ${recordedAudioPath} -vn -acodec pcm_s16le -ac 1 -ar 16000 -b:a 256k ${wavFilePath}`,
        });
        await FFmpegKit.execute(command);
        return wavFilePath;
    };

    destroy = () => {
        this.wavFilePath = undefined;
        this.audioRecorderPlayer.stopPlayer();
        if (this.eventId) {
            EventRegister.removeEventListener(this.eventId);
        }
    };

    getRecordPath = () => {
        return this.wavFilePath === undefined ? '' : this.wavFilePath;
    };
}

export default StoryRecord;
