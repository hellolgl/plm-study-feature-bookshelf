import Record from './storyRecord';
import Ise from './storyIse';
import EventRegister from '../../util/eventListener';

export const RecordingStatus = {
    hang: 1,
    recording: 2,
    finish: 3,
}

class Microphone {
    constructor(props) {
        const {contentType, content} = props;
        this.contentType = contentType;
        this.content = content;
        this.record = new Record();
        this.scoreInfo = {}
    }

    startRecord = () => {
        EventRegister.emitEvent('pauseAudioEvent');
        // ImmediatelyPlay.startRecord();
        // Device.shakeDevice();
        this.record.onStartRecord();
    };

    endRecord = async () => {
        const f = await this.record.onStopRecord();
        const ise = new Ise();
        this.scoreInfo = await ise.sendFile(f, {
            contentType: this.contentType,
            content: this.content,
        });
        return this.scoreInfo;
    };

    getAudioPath = () => {
        return this.record.getRecordPath();
    };

    getScore = () => {
        return this.scoreInfo.total_score;
    };
}

export default Microphone;
