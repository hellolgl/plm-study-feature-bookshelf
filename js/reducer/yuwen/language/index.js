import { fromJS } from 'immutable';
import chinese from "../../../util/languageConfig/chinese/chinese";
import english from "../../../util/languageConfig/chinese/english";

const defaultState = fromJS({
    // 默认中
    language_data: {
        show_main: true,
        show_translate: true,
        main_language_map: chinese,
        other_language_map: english,
        show_type: '1',    //例： 1以中文为主  2以其他外语为主  用来控制主次文字交换
        type: 2,    //  1 主要语言为主 2次要语言为主 3主要 4次要
        main_language: 'zh',
        other_language: 'en',
        trans_language: 'en',  //翻译成某种语言（接口要用的）
        label:'中英双语', //中文回显   
    }
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_CHINESE_LANGUAGE':
            return state.merge({
                language_data: action.language_data
            });
        default:
            return state;
    }
}