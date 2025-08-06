import { Platform } from "react-native";
import { NavigationActions } from "react-navigation";
export default class NavifationUtil {
    /**
     * 重置到登录页
     */
    static resetToLogin(params) {
        const { navigation, data } = params;
        navigation.navigate("StudentRoleHomePageAndroid");
    }

    /**
     * 根据选择，跳转到相应做题界面
     */
    static toYuwenOrMathOrEng(params, target) {
        const { navigation, exercise_origin, data } = params;
        navigation.navigate(target, { exercise_origin, data });
    }
    /**
     * 返回上一级
     */
    static goBack(params, route) {
        const { navigation } = params;
        //如果返回的页面需要刷新数据，则需要在进入界面之前传入相应函数，命名统一为updata
        if (
            navigation &&
            navigation.state &&
            navigation.state.params &&
            navigation.state.params.data &&
            navigation.state.params.data.updata
        ) {
            navigation.state.params.data.updata();
        }

        navigation.goBack();
    }

    /**
     * 根据选择，跳转到语文课桌作业
     */
    static toYuwenHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("YuwenHomePage", { data });
    }
    /**
     * 跳转到语文书包页面
     */
    static toChineseSchoolHome(params) {
        const { navigation } = params;
        navigation.navigate("ChineseSchoolHome");
    }
    /**
     * 跳转到语文活题做题页面
     */
    static toChineseBagExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseBagExercise", { data });
    }
    // 跳转到书包语文专项诊断字词
    static toWordAccumulation(params) {
        const { navigation, data } = params;
        navigation.navigate("wordAccumulation", { data });
    }
    // 跳转到首页
    static toHomePage(params, type) {
        const { navigation, data } = params;
        // console.log("route", type);
        navigation.navigate("HomePage", { data });
        return
    }
    // 语文书包专项诊断
    static toSpecialDiagnosis(params) {
        const { navigation } = params;
        navigation.navigate("SpecialDiagnosis");
    }
    // 字词积累跳课文选择
    static toChooseText(params) {
        const { navigation, data } = params;
        navigation.navigate("ChooseText", { data });
    }
    // 书包跳转到错题集选择模式页面
    static toChooseWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChooseWrongExercise", { data });
    }
    // 书包跳转到同步诊断错题集列表
    static toFlowTextbookList(params) {
        const { navigation, data } = params;
        navigation.navigate("FlowTextbookList", { data });
    }
    // 书包跳转到同步诊断错题集习题列表
    static toFlowWrongExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("FlowWrongExerciseList", { data });
    }
    // 书包跳转到同步诊断错题集习题列表 再做一次
    static toDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("DoWrongExercise", { data });
    }
    // 书包跳转到专项诊断
    static toSpeWrongExerciseErapList(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeWrongExerciseErapList", { data });
    }
    // 书包跳转到专项诊断 某个知识点的题目列表
    static toSpeWrongExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeWrongExerciseList", { data });
    }
    static toFlowTextbookList(params) {
        const { navigation } = params;
        navigation.navigate("FlowTextbookList");
    }
    //英语书包专项同步诊断
    static toSynchronizeDiagnosisEn(params) {
        const { navigation, data } = params;
        //console.log("toSynchronizeDiagnosisEn data", data);
        navigation.navigate("SynchronizeDiagnosisEn", { data });
    }

    //英语书包同步诊断选择自选知识点或者自推题目
    static toEnglishSchoolHome(params) {
        const { navigation, data } = params;
        //console.log("EnglishSchoolHome data", data);
        navigation.navigate("EnglishSchoolHome", { data });
    }

    //英语同步诊断字母单元
    static toEnglishSchoolHomeUnit0(params) {
        const { navigation, data } = params;
        //console.log("toEnglishSchoolHomeUnit0 data", data);
        navigation.navigate("EnglishSchoolHomeUnit0", { data });
    }

    //英语同步诊断选择unit界面
    static toSelectUnitEn(params) {
        const { navigation, data } = params;
        navigation.navigate("SelectUnitEn", { data });
    }

    //英语同步诊断自选知识点界面
    static toEnglishChooseKnowledge(params) {
        const { navigation, data } = params;
        //console.log("EnglishChooseKnowledge data", data);
        navigation.navigate("EnglishChooseKnowledge", { data });
    }
    // 英语课桌
    static toEnglishDeskHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishDeskHomepage", { data });
    }

    // 智能句错题列表
    static toSpeWrongExerciseListSmart(params) {
        console.log("props", params);

        const { navigation, data } = params;
        navigation.navigate("SpeWrongExerciseListSmart", { data });
    }
    // 智能句做错题
    static toDoWrongExerciseSmart(params) {
        const { navigation, data } = params;
        navigation.navigate("DoWrongExerciseSmart", { data });
    }
    // 阅读理解选类型
    static toReading(params) {
        const { navigation } = params;
        navigation.navigate("Reading");
    }

    // 阅读理解错题列表
    static toSpeWrongExerciseListRead(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeWrongExerciseListRead", { data });
    }
    // 阅读理解错题
    static toDoWrongExerciseRead(params) {
        const { navigation, data } = params;
        navigation.navigate("DoWrongExerciseRead", { data });
    }
    //拖拽题错题
    static toDoWrongExerciseDrag(params) {
        const { navigation, data } = params;
        navigation.navigate("DoWrongExerciseDrag", { data });
    }
    // 英语连线题
    static toMatchDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MatchDoExercise", { data });
    }
    // 英语统计总页面
    static toEnglishStatisticsHome(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishStatisticsHome", { data });
    }
    // 英语统计分别查看听说读写页面
    static toEnglishStatisticsItem(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishStatisticsItem", { data });
    }
    // 英语手写题
    static toDoWriteEn(params) {
        const { navigation, data } = params;
        navigation.navigate("DoWriteEn", { data });
    }
    // 语文统计总页面
    static toChineseStatisticsHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseStatisticsHome", { data });
    }
    // 语文统计分别查看听说读写页面
    static toChineseStatisticsItem(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseStatisticsItem", { data });
    }
    // 中文句法 答题页面
    static toYuwenAIGiveExerciseDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("YuwenAIGiveExerciseDoExercise", { data });
    }

    // π计划主页 ChineseDailyHome
    static toChineseDailyHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDailyHome", { data });
    }
    // π计划每日一练
    static toChineseDailyBagExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDailyBagExercise", { data });
    }

    // π计划阅读提升统计页面
    static toChineseDailySpeReadingStatics(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDailySpeReadingStatics", { data });
    }

    // π计划阅读提升文体讲解
    static toChineseDailySpeReadingExplain(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDailySpeReadingExplain", { data });
    }
    // π计划阅读提升做题
    static toChineseDailySpeReadingExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDailySpeReadingExercise", { data });
    }
    // 语文π计划提升句子专项
    static toSpeSentenceStatics(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceStatics", { data });
    }
    // 语文π计划句子专项图谱
    static toSpeSentenceTree(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceTree", { data });
    }
    // 语文π计划句子专项讲解
    static toSpeSentenceExplain(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExplain", { data });
    }
    // 语文π计划句子专项做题
    static toSpeSentenceExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExercise", { data });
    }
    // 语文做题记录
    static toChineseDidExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDidExercise", { data });
    }
    // 语文句子专项智能造句关联词运用，修辞手法做题页面
    static toSpeSentenceExerciseOne(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExerciseOne", { data });
    }
    // 语文句子专项智能造句句型训练，文化积累做题页面
    static toSpeSentenceExerciseTwo(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExerciseTwo", { data });
    }

    // 语文智能句每日一练
    static toSpeSentenceDailyExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceDailyExercise", { data });
    }
    // 语文智能句查看做题记录 SpeSentenceExerciseRecord
    static toSpeSentenceExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExerciseRecord", { data });
    }
    // 语文智能句综合提升做题
    static toSpeSentenceExerciseSpeLevel(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceExerciseSpeLevel", { data });
    }
    // 语文字词专项选择课文
    static toWordsHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("WordsHomepage", { data });
    }

    static toWordsStudy(params) {
        const { navigation, data } = params;
        navigation.navigate("WordsStudy", { data });
    }

    static toWordsWordStudy(params) {
        const { navigation, data } = params;
        navigation.navigate("WordsWordStudy", { data });
    }

    static toWordsWriting(params) {
        const { navigation, data } = params;
        navigation.navigate("WordsWriting", { data });
    }

    //英语选择单词短语还是句子
    static toEnglishChooseType(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishChooseType", { data });
    }

    //英语连线题选择单元
    static toMixSelectUnit(params) {
        const { navigation, data } = params;
        navigation.navigate("MixSelectUnit", { data });
    }

    // 英语选择知识点句子文章
    static toEnglishChooseKnowledgeSentence(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishChooseKnowledgeSentence", { data });
    }

    // 语文阅读理解每日一练
    static toChineseSpeReadingExerciseDaily(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseSpeReadingExerciseDaily", { data });
    }
    // 语文听写题
    static toChineseListenExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseListenExercise", { data });
    }
    // 语文听写题做题记录
    static toChineseListenExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseListenExerciseRecord", { data });
    }
    // 英语字母单元
    static toEnglishAbcsHome(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAbcsHome", { data });
    }
    // 英语字母单元字母泡泡
    static toEnglishAbcsTree(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAbcsTree", { data });
    }
    // 语文智能造句 答题记录
    static toSpeSentenceSpeExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceSpeExerciseRecord", { data });
    }
    // 语文智能造句 重做一次关联词，修辞
    static toSpeSentenceDoWrongExerciseOne(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceDoWrongExerciseOne", { data });
    }
    // 语文智能造句 重做一次 文化积累  句型训练
    static toSpeSentenceDoWrongExerciseTwo(params) {
        const { navigation, data } = params;
        navigation.navigate("SpeSentenceDoWrongExerciseTwo", { data });
    }
    // 英语答题记录列表
    static toEnglishTestMeRecordList(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTestMeRecordList", { data });
    }
    // 英语答题记录列表 详情
    static toEnglishTestMeRecordListDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTestMeRecordListDetail", { data });
    }
    //智能句统计详情
    static toChineseSentenceStatics(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseSentenceStatics", { data });
    }

    //语文习作提升选择文体
    static toChineseCompositionCheckType(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionCheckType", { data });
    }

    //  语文习作选择做题模式
    static toCompositionWriteHome(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionWriteHome", { data });
    }

    //  语文习作 大展身手 选择命题，中心思想等
    static toCompositionWriteCheckTitle(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionWriteCheckTitle", { data });
    }
    //  语文习作 大展身手 选择标题，中心思想等
    static toCompositionWriteChecCenter(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionWriteChecCenter", { data });
    }
    //  语文习作 思维导图
    static toCompositionWriteMindMap(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionWriteMindMap", { data });
    }
    //  语文习作 思维导图 思路提示
    static toCompositionMindMapExplanation(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionMindMapExplanation", { data });
    }
    //  语文习作 思维导图 思路提示
    static toCompositionMindMapDoexercise(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionMindMapDoexercise", { data });
    }
    //  语文习作 思维导图查看结果
    static toCompositionLookMindmap(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionLookMindmap", { data });
    }
    //  语文习作 思维导图查看范文
    static toCompositionModelArticle(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionModelArticle", { data });
    }
    //  语文习作 查看好词佳句
    static toCompositionLookKnowDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("CompositionLookKnowDetail", { data });
    }
    // 英语Sentences主页
    static toEnSentencesHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesHomePage", { data });
    }
    // 英语Sentences LearnToday
    static toEnSentencesLearnTodayHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnTodayHomePage", { data });
    }
    // 英语Sentences LearnToday做题
    static toEnSentencesLearnTodayDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnTodayDoExercise", { data });
    }
    // 英语Sentences LearnToday答题记录
    static toEnSentencesLearnTodayRecordList(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnTodayRecordList", { data });
    }
    //  英语Sentences LearnToday答题记录做题
    static toEnSentencesLearnTodayRecordDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnTodayRecordDoExercise", { data });
    }
    // 英语Sentences learn with friends 首页
    static toEnSentencesLearnWidthFriendsHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnWidthFriendsHomePage", { data });
    }
    // 英语Sentences learn with friends 要素讲解
    static toEnSentencesLearnWidthFriendsElement(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnWidthFriendsElement", { data });
    }
    // 英语Sentences learn with friends 做题
    static toEnSentencesLearnWidthFriendsDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnSentencesLearnWidthFriendsDoExercise", { data });
    }
    // 语文学习日记
    static toChineseDiaryHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDiaryHome", { data });
    }
    // 语文学习日记 我的创作文体选择
    static toChineseDiaryCompositionType(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDiaryCompositionType", { data });
    }
    // 语文学习日记 我的创作列表
    static toChineseDiaryCompositionList(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDiaryCompositionList", { data });
    }
    // 语文学习日记 作文批改
    static toChineseUploadArticle(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseUploadArticle", { data });
    }
    // 语文学习日记 答题记录列表
    static toChineseDiaryAllExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseDiaryAllExerciseRecord", { data });
    }
    // 语文统计 习作总页面
    static toChineseCompositionStaticsHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionStaticsHome", { data });
    }
    // 语文统计 习作详情
    static toChineseCompositionStaticsItem(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionStaticsItem", { data });
    }

    //英语test me选择模块
    static toEnglishTestMeCheckType(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTestMeCheckType", { data });
    }
    //语文阅读理解帮助页面
    static toChineseReadingHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseReadingHelp", { data });
    }
    static toChineseLookAllExerciseHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllExerciseHome", { data });
    }
    static toChineseLookFlowExerciseHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookFlowExerciseHome", { data });
    }
    static toChineseLookAllFlowExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllFlowExerciseList", { data });
    }
    static toChineseLookAllFlowExerciseDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllFlowExerciseDetail", { data });
    }
    static toChineseLookAllReadingExerciseCheckType(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllReadingExerciseCheckType", { data });
    }
    static toChineseLookAllReadingExerciseCheckArticle(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllReadingExerciseCheckArticle", { data });
    }
    static toChineseLookAllReadingExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllReadingExerciseList", { data });
    }
    static toChineseLookAllReadingExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllReadingExercise", { data });
    }
    static toChineseLookAllSentenceExerciseCheckType(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllSentenceExerciseCheckType", { data });
    }
    static toChineseLookAllSentenceExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllSentenceExerciseList", { data });
    }
    static toChineseLookAllSentenceNormalExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllSentenceNormalExercise", { data });
    }
    static toChineseLookAllSentenceSpeExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseLookAllSentenceSpeExercise", { data });
    }
    static toChinesePinyinHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinHome", { data });
    }
    static toChinesePinyinCheckType(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinCheckType", { data });
    }
    static toChinesePinyinStudy(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinStudy", { data });
    }
    static toChinesePinyinLookAllWord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinLookAllWord", { data });
    }
    static toChinesePinyinLookWordDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinLookWordDetail", { data });
    }
    static toChinesePinyinLookTwoWordDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinLookTwoWordDetail", { data });
    }
    static toChinesePinyinDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinDoExercise", { data });
    }
    static toChinesePinyinWrite(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinWrite", { data });
    }
    static toChinesePinyinExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinExerciseRecord", { data });
    }
    static toChinesePinyinDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChinesePinyinDoWrongExercise", { data });
    }
    static toChineseUnitComposition(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseUnitComposition", { data });
    }
    static toProtocolPage(params) {
        const { navigation, data } = params;
        navigation.navigate("ProtocolPage", { data });
    }
    static toChineseCompisitionModelHome(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionModelHome", { data });
    }
    static toChineseCompisitionModelArticle(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionModelArticle", { data });
    }
    static toChineseCompisitionModelDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionModelDoExercise", { data });
    }
    static toChineseCompisitionModelRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionModelRecord", { data });
    }
    static toChineseCompisitionModelExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionModelExerciseList", { data });
    }
    static toChineseCompisitionWrite(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompisitionWrite", { data });
    }
    static toLookAllPinyinExerciseHome(params) {
        const { navigation, data } = params;
        navigation.navigate("LookAllPinyinExerciseHome", { data });
    }
    static toLookAllPinyinExerciseList(params) {
        const { navigation, data } = params;
        navigation.navigate("LookAllPinyinExerciseList", { data });
    }
    static toStudentRoleHomePageAndroid(params) {
        const { navigation, data } = params;
        navigation.navigate("StudentRoleHomePageAndroid", { data });
    }
    // 幼小衔接字学树
    static toChildrenStudyCharacterHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("ChildrenStudyCharacterHomePage", { data });
    }
    // 幼小衔接字学树学习字
    static toChildrenStudyCharacter(params) {
        const { navigation, data } = params;
        navigation.navigate("ChildrenStudyCharacter", { data });
    }

    static toEnglishAbcsDoexercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAbcsDoexercise", { data });
    }
    static toEnglishAbcsExerciseRrecord(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAbcsExerciseRrecord", { data });
    }
    static toEnglishAbcsExerciseDoWrong(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAbcsExerciseDoWrong", { data });
    }
    static toAbcsStudy(params) {
        const { navigation, data } = params;
        navigation.navigate("AbcsStudy", { data });
    }
    static toMyChildrenMathKnowHome(params) {
        const { navigation, data } = params;
        navigation.navigate("MyChildrenMathKnowHome", { data });
    }
    static toMyChildrenMathKnowExplain(params) {
        const { navigation, data } = params;
        navigation.navigate("MyChildrenMathKnowExplain", { data });
    }

    static toMyChildrenMathKnowExplain(params) {
        const { navigation, data } = params;
        navigation.navigate("MyChildrenMathKnowExplain", { data });
    }
    static toNewSentence(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentence", { data });
    }
    static toNewSentenceFlowList(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentenceFlowList", { data });
    }
    static toNewSentenceSpeList(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentenceSpeList", { data });
    }
    static toNewSentenceExerciseRercord(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentenceExerciseRercord", { data });
    }
    static toNewSentenceDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentenceDoExercise", { data });
    }
    static toNewReadingFlowList(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingFlowList", { data });
    }
    static toNewReadingExplain(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingExplain", { data });
    }
    static toNewReadingRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingRecord", { data });
    }
    static toNewReadingSpeExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingSpeExercise", { data });
    }
    static toNewReadingDailyExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingDailyExercise", { data });
    }
    static toNewReadingFlowExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("NewReadingFlowExercise", { data });
    }
    static toEnglishDescRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishDescRecord", { data });
    }
    static toEnglishDescDoWrong(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishDescDoWrong", { data });
    }
    static toChineseCompositionWriteRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionWriteRecord", { data });
    }
    static toChineseCompositionWriteDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionWriteDoExercise", { data });
    }
    static toChineseCompositionRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompositionRecord", { data });
    }
    static toEnExamineSentenceHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("EnExamineSentenceHomePage", { data });
    }
    static toEnExamineSentenceTopicList(params) {
        const { navigation, data } = params;
        navigation.navigate("EnExamineSentenceTopicList", { data });
    }
    static toEnglishTestMeHome(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTestMeHome", { data });
    }
    static toEnglishTextMeRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTextMeRecord", { data });
    }
    static toEnglishTextMeWrong(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishTextMeWrong", { data });
    }
    static toNewSentenceStudyExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("NewSentenceStudyExercise", { data });
    }
    static toSquareHistory(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareHistory", { data });
    }
    static toSquareDetail(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareDetail", { data });
    }
    static toSquareDoexercise(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareDoexercise", { data });
    }
    static toSquareCheckWords(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareCheckWords", { data });
    }
    static toSquareCreateTalk(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareCreateTalk", { data });
    }
    static toSquareCheckStoryType(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareCheckStoryType", { data });
    }
    static toSquareHomeList(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareHomeList", { data });
    }
    static toSquareCheckCreateType(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareCheckCreateType", { data });
    }
    static toSquareCheckQuestion(params) {
        const { navigation, data } = params;
        navigation.navigate("SquareCheckQuestion", { data });
    }
    static toExpensiveCalendar(params) {
        const { navigation, data } = params;
        navigation.navigate("ExpensiveCalendar", { data });
    }
    static toPrivacy(params) {
        const { navigation, data } = params;
        navigation.navigate("Privacy", { data });
    }
    static toMathWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathWrongExercise", { data });
    }
    static toMathSyncDiagnosisDoWrong(params) {
        const { navigation, data } = params;
        navigation.navigate("MathSyncDiagnosisDoWrong", { data });
    }
    static toMathPracticeHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathPracticeHomePage", { data });
    }
    static toChineseReadingAiHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseReadingAiHelp", { data });
    }
    static toChineseSyncReadingAiHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseSyncReadingAiHelp", { data });
    }
    static toDailyTaskIndex(params) {
        const { navigation, data } = params;
        navigation.navigate("DailyTaskIndex", { data });
    }
    static toCenterHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("CenterHomePage", { data });
    }
    static toCenterInfo(params) {
        const { navigation, data } = params;
        navigation.navigate("CenterInfo", { data });
    }
    static toCenterCoinDetails(params) {
        const { navigation, data } = params;
        navigation.navigate("CenterCoinDetails", { data });
    }

    static toChineseQuickDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseQuickDoExercise", { data });
    }

    static toEnglishGrammarAiHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishGrammarAiHelp", { data });
    }

    static toWordTreeIndex(params) {
        const { navigation, data } = params;
        navigation.navigate("WordTreeIndex", { data });
    }

    static toWordTreeUnitWord(params) {
        const { navigation, data } = params;
        navigation.navigate("WordTreeUnitWord", { data });
    }

    static toWordTreeCharactersDetails(params) {
        const { navigation, data } = params;
        navigation.navigate("WordTreeCharactersDetails", { data });
    }

    static toWordTreeWordDetails(params) {
        const { navigation, data } = params;
        navigation.navigate("WordTreeWordDetails", { data });
    }

    static toWordTreeDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("WordTreeDoExercise", { data });
    }


    //语文习作提升页面
    static toChineseCompAIHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseCompAIHelp", { data });
    }
    //英语check/words ai_bot
    static toEnglishWordsAIHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishWordsAIHelp", { data });
    }
    //语文中文句法页面
    static toChineseAbSenAIHelp(params) {
        const { navigation, data } = params;
        navigation.navigate("ChineseAbSenAIHelp", { data });
    }
    static toCustomHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("CustomHomePage", { data });
    }
    static toEnglishWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishWrongExercise", { data });
    }
    static toMixDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MixDoWrongExercise", { data });
    }
    static toEnglishAiGiveExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EnglishAiGiveExercise", { data });
    }
    static toStudyRoute(params) {
        const { navigation, data } = params;
        navigation.navigate("StudyRoute", { data });
    }
}
