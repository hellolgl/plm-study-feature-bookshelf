import ExecisePage from "../../page/math/bag/ThinkingTraining/execriseTrainingPage";

export default {
    yuwenTopic: "/chinese_blue/handwriting_character_order_exercises",
    mathTopic: "/math_blue/practical_fixed",
    englishTopic: "/english_blue/query_basis_exercise",

    // 登录
    loginNow: "/auth_blue/login",

    //type 1：语文 2：数学，识别接口
    canvasDataToServe: "/math_blue/identify_data?type=",
    //语文获取一套题
    chineseHomeWork: "/student_blue/student_homework",
    // 语文提交完成的一道题
    finshOneHomeWork: "/student_blue/save_answer_info",
    // 语文书包，获取一套题
    getChineseBagExercise: "/student_blue/query_schoolbag_homework",
    // 语文获取要素题
    getChineseKeyExercise: "/student_blue/query_element_exercise",
    // 语文保存书包的一道题的做题结果
    saveChineseBagExercise: "/student_blue/save_schoolbag_exercise",
    // 语文获取对应的课程列表
    getChineseBagClassList: "/student_blue/query_textbook_lessons",
    // 语文获取当天有多少套题
    getChineseTodayExerciseList: "/student_blue/query_lesson_exercise_origin",
    // 语文词语诊断 post
    yuwenWordsDiag: "/student_blue/handle_identification_chinese",
    //语文课桌获取一套题做完结果记录 post
    yuwenResult: "/student_blue/query_desk_answer_info",
    //语文获取书包一套题昨晚结果记录 post
    yuwenBagResult: "/student_blue/query_schoolbag_answer_info",
    //语文获取错题课文列表
    chineseGetWrongTextbookList: "/student_error_blue/c_error_term",
    //获取课文下所有错题
    getTextbookWrongExerciseList: "/student_error_blue/c_error_origin",
    // 获取专项诊断的错题的字词
    getSpeWrongWord: "/student_error_blue/c_error_character_list",
    // 获取有智能句错题的知识点
    getSentenceWrongKno: "/student_blue/new_error_sentence_knowledge",
    // 获取专项诊断 某一个知识点下面的错题
    getSpeWrongExerciseList: "/student_error_blue/c_error_character_exercise",
    // 获取学生有错题信息的年级学期
    getHaveWrongErerciseGrade: "/student_error_blue/c_error_grade",

    // 语文智能句获取题
    originSentenceStemList: "/chinese_blue/origin_sentence_stem",
    // 语文智能句单题保存
    recordSingleStem: "/chinese_blue/record_single_stem",
    // 语文智能句套题保存,拿题（get，put）
    origin_sentence_stem: "/chinese_blue/origin_sentence_stem",
    // 语文智能句错题列表
    errorKnowledgeStem: "/student_blue/new_error_knowledge_stem",
    // 单个智能句错题
    errorSentenceStem: "/student_blue/error_new_sentence_stem",
    // 语文阅读理解题材文体
    availableReadCategory: "/chinese_blue/available_read_category",
    // 阅读理解获取题目
    studentReadStemGet: "/chinese_blue/student_read_stem",
    // 阅读理解单题保存
    recordSingleRead: "/chinese_blue/record_single_read",
    // 阅读理解套题保存
    studentReadStem: "/chinese_blue/student_read_stem",
    // 阅读理解错题文章列表
    errorReadArticle: "/chinese_blue/error_read_article",
    // 阅读理解文章下错题列表
    errorArticleStem: "/chinese_blue/error_article_stem",
    // 阅读理解错题
    readExerciseDetail: "/chinese_blue/read_exercise_detail",
    // 智慧树单元
    wisdomTreeUnit: "/student_blue/unit_info",
    // 智慧树单元树
    knowledgeTree: "/student_blue/knowledge_tree",
    // 智慧树单个知识点
    oneKnowledgeDetail: "/student_blue/knowledge_detail",
    // 单个字详情
    oneCharacterDetail: "/student_blue/character_knowledge_detail",
    // 词语详情
    wordDetail: "/student_blue/get_word_knowledge_detail",
    // 智慧树做题
    startExercise: "/student_blue/start_exercise",
    // 智慧树没做过的知识点拿题
    firstStartExercise: "/student_blue/first_start_exercise",
    //数学一套题
    mathTopics: "/math_blue/kinds_exercise",
    //数学诊断接口
    diagnoseFromServe: "/math_blue/diagnose_math_exp",
    //数学口算题诊断接口
    diagnoseKousuan: "/math_blue/identify_mental_arithmetic",
    //数学竖式计算诊断接口
    diagnoseVerticalExp: "/math_blue/diagnose_vertical_exp",
    // 语文字词题接口
    characterExercise: "/chinese_student_blue/character_exercise",
    courseCharacter: '/chinese_student_blue/course_character',
    courseCharacterDetail: '/chinese_student_blue/course_character_detail',
    courseWordDetail: '/chinese_student_blue/course_word_detail',
    // 语文字词解释
    knowledgeDetail: "/chinese_student_blue/knowledge_detail",
    // 语文字词题信息保存
    saveCharacterExercise: "/chinese_student_blue/character_exercise",
    // 保存一篇课文的答题信息
    recordExerciseSet: "/chinese_student_blue/record_exercise_set",
    // 课文选择
    lessonListDetail: "/chinese_blue/lesson_list_detail",
    //数学查询当前单元当天总共多少套作业
    getMathDeskHomework: "/student_blue/query_math_desk_homework_origin",
    //数学查询当前单元某套题作业
    queryHomeWorkList: "/student_blue/student_math_homework",
    //数学查找要素
    // knowledgeSystem:'/math_blue/student_element/040000/17?knowledge_code=',
    knowledgeSystem: "/math_blue/student_element/",
    //数学查询单元
    queryUnitMathBag: "/math_blue/query_unit?type=s&grade_term=",
    //数学书包查询当前单元某套题——解决问题
    queryBagWorkList: "/math_blue/student_element_exercise",
    //数学书包保存单个题
    recordSelfExercise: "/math_blue/record_self_exercise",
    //数学书包分布引导题目
    stepExercise: "/math_blue/step_exercise/",
    //数学书包保存一套题结果
    studentElementExercise: "/math_blue/student_element_exercise",
    //数学书包获取要素讲解
    elementDetail: "/math_blue/element_detail/",
    // 数学获取教材版本
    getCurriculum: "/math_blue/curriculum",
    //数学书包查询当前单元某套题——数与代数
    queryBagWorkListNumExercise: "/math_blue/student_element_num_exercise",
    //数学书包智能题
    queryBagWorkListAutoPractical: "/math_blue/student_auto_practical",
    //数学书包智能题分步引导题目
    queryAutoPraStepExercise: "/math_blue/auto_pra_step_exercise",
    //数学书包智能题新版
    queryBagWorkListAutoPracticalNew: "/math_blue/student_auto_practical2",
    //数学书包智能题新版分步引导
    queryAutoPraStepExerciseNew: "/math_blue/auto_pra_step_exercise2",
    //数学书包非应用题智能题获取单元
    getAutoUnitList: "/student_blue/math_unit_info",
    //数学书包非应用题智能题获取知识点要素 /student_blue/math_knowledge_explain
    getAutoKnowledgeList: "/student_blue/math_lesson_knowledge",
    //数学书包非应用题智能题获取知识点要素讲解
    getAutoKnowledgeExplainList: "/student_blue/math_knowledge_explain",
    //数学书包能力培养计算能力查询当前单元某套题
    queryBagWorkListSyncAutoCalExercise:
        "/student_blue/sync_calculation_exercise",
    //数学书包查询当前单元某套题——非应用题智能题
    queryBagWorkListAutoCalExercise: "/student_blue/make_non_practical_exercise",
    //数学书包非应用题智能题保存单个题
    savenonPracticalExercise: "/student_blue/save_non_practical_exercise",
    //数学书包非应用题智能题答题记录列表
    autoPracticalExerciseRecord: "/student_blue/auto_practical_exercise_record",
    //数学书包非应用题智能题答题记录详情
    autoPracticalExerciseDeatil: "/student_blue/auto_practical_record_detail",
    //数学书包能力培养，同步计算获取单元
    getTongbuCalUnitList: "/student_blue/sync_unit",
    //数学书包能力培养，同步应用获取单元
    getTongbuAolicationUnitList: "/student_blue/sync_practical_unit",
    //数学书包能力培养，同步应用获取题目列表
    getTongbuAolicationTopaicList: "/student_blue/sync_practical_exercise",
    //数学书包能力培养，拓展应用获取要素
    getPracticalType: "/student_blue/get_practical_type",
    //数学书包能力培养，拓展应用获取学习题目
    getExpandPracticalExercise: "/student_blue/expand_practical_exercise",
    //数学书包能力培养，拓展应用获取学习题目
    getExpandPracticalExercise2: "/student_blue/expand_practical_exercise2",
    //数学书包同步学习获取单元
    getSyncStudyUnit: "/student_blue/sync_study_unit",
    //数学书包同步学习获取题目
    getSyncStudyExercise: "/student_blue/sync_study_exercise",
    //数学书包基础学习获取单元
    getBasicCalUnitList: "/student_blue/basic_record_unit",
    //数学书包基础学习获取错题集
    getBasicWrongRecordList: "/student_blue/basic_wrong_exercise",
    //数学书包基础学习保存错题集答题
    saveBasicWrongRecord: "/student_blue/save_exercise_record",
    // 我的历史作业列表
    historyHomework: "/history_homework_blue/history_homework",
    // 历史作业详情
    historyHomeworkDetails: "/corrects_blue/single_student_homework",
    // 数学同步最近三套历史记录题
    // getHisListTB:'/student_blue/sync_expand_history',
    // 单套历史记录详情
    // hisListDetail:'/student_blue/single_sync_expand_history_exercise',
    // 同步错题集的基础学习拿题
    getElementexercise: "/student_blue/sync_study_element_exercise",
    // 书包能力培养获取错题
    getWrongExcAT: "/student_blue/sync_expand_wrong_exercise",
    // 书包能力专项诊断获取单元
    getSpecialUnitlist: "/student_blue/diagnose_unit",
    // 书包能力专项诊断获取题目
    getSpecialTopaiclist: "/student_blue/diagnose_exercise",
    // 书包能力专项诊断获取诊断报告记录
    getSpeciaDiagnoseReportlist: "/student_blue/diagnose_report",
    // 书包能力专项诊断获取诊断报告详情
    getSpeciaDiagnoseReportDetail: "/student_blue/diagnose_report_detail",
    // 书包能力能力提升详情
    getSpeciaImproveDetail: "/student_blue/distribution_statistic",
    // 书包能力能力提升详情
    getSpeciaImproveOtherDetail: "/student_blue/improve_statistic",
    // 专项提升拿题
    getImproveexercise: "/student_blue/improve_exercise",
    // 数学学习日记
    getDiaryLesson: "/student_blue/pai_score_home",
    // 数学学习日记拿题
    getDiaryLessonExc: "/student_blue/pai_score_exercise",
    // 学习日记A计划错题保存
    saveDiaryWrong: "/student_blue/save_wrong_exercise_detail",

    // 数学学习日记B计划
    getDiaryLessonPlanB: "/student_blue/pai_score_b_home",
    // B计划课时拿题
    getDiaryLessonExcPlanB: "/student_blue/pai_score_b_exercise",
    // B计划计算方向拿题
    getDiaryCalExcPlanB: "/student_blue/pai_score_b_exercise2",
    // B计划应用题方向拿题 （应用题拓展应用题拿题）
    getDiaryApplicaExcPlanB: "/student_blue/pai_score_b_exercise3",
    // B计划拓展应用题
    getDiaryExpandApplicaExcPlanB: "/student_blue/pai_score_b_exercise4",
    // 数学拓展计算题拿方向
    getSyncExpandType: "/student_blue/sync_expand_type",
    // 数学拓展题拿题
    getSyncExpandExercise: "/student_blue/sync_expand_exercise",
    // 数学拓展题保存
    saveExpandCal: "/student_blue/save_non_practical_exercise",
    // 数学单元知识点
    getUnitelement: "/math_blue/student_get_element",
    // 学期树
    getAllElement: "/math_blue/student_get_all_element",
    // 数学学习效能
    getBasicStatistical: "/student_blue/basic_statistical_data",
    // 数学拓展方向
    getExpandType: "/student_blue/get_expand_type",
    // 数学巧算学习
    getExpandStudy: "/student_blue/get_expand_study",
    // 数学巧算学习保存
    saveExpandStudyrecord: "/student_blue/save_expand_record",
    //数学巧算开始答题
    getExpandCalExercise: "/student_blue/get_expand_exercise",
    // 巧算错题列表
    getExpandCalWrongExerciseList: "/student_blue/get_expand_wrong_basics",
    // 错题答对保存
    saveExpandWrongRecord: "/student_blue/save_expand_again",
    // 拓展应用方向
    getExpandApplicationType: "/student_blue/get_exercise_type",
    // 拓展应用题学习
    getExpandApplicationStudy: "/student_blue/get_exercise_study",
    // 拓展应用学习题保存
    saveExpandApplicationStudyTopic: "/student_blue/save_exercise_notes",
    // 拓展应用题练习题
    getExpandApplicationDoTopic: "/student_blue/get_exercise_practice",
    // 获取拓展应用题错题id
    getExpandApplicationWrongTopicIds: "/student_blue/get_exercise_wrong_basics",
    // 获取错题详情
    getExpandApplicationWrongTopicDetails:
        "/student_blue/get_exercise_wrong_stem",
    // 保存做对的错题
    saveExpandApplicationWrongTopic: "/student_blue/save_exercise_again",
    // 结构训练
    getExecisePage: "/student_blue/get_thinking_type",
    // 结构训练具体训练主页
    getExeciseTaskMainPage: "/student_blue/get_thinking_stem",
    //英语书包同步诊断系统自动生成题目或者自选知识点
    SynchronizeDiagnosisEn: "/student_blue/query_en_exercise_or_knowledge",
    //英语书包专项诊断知识点内容获取 字母为1，单词为2（暂时不支持单词）
    SynchronizeDiagnosisEnKnowPoint: "/english_blue/english_knowledge_detail",
    //英语书包同步诊断获取教材单元
    QueryEnTextbookLesson: "/student_blue/query_en_textbook_lesson",
    //英语获取教材
    GetEnTextbook: "/student_blue/query_curriculum_data",
    // 英语保存书包的一道题的做题结果
    saveEnBagExercise: "/student_blue/save_en_schoolbag_exercise",
    //查询同步诊断英语字母单元知识点进展并获取相应知识点
    QueryEnSynchronizeProgressUnit0:
        "/student_blue/query_knowledgepoint_progress",
    //英语专项诊断自选知识点获取题目
    SynchronizeDiagnosisEnByKnowledgepoint:
        "/student_blue/query_en_exercise_by_knowledgepoint",
    //查询同步诊断英语单元知识点进展
    QueryEnSynchronizeProgress: "/student_blue/query_system_knowledge_progress",
    //英语获取书包一套题昨晚结果记录 post
    enBagResult: "/student_blue/query_en_schoolbag_summary_answer",
    // 获取英语课桌某套题
    enStudenthomework: "/student_blue/student_homework",
    // 英语课桌题保存题
    saveEnDeskExercise: "/student_blue/save_answer_info",
    // 英语上传录音
    uploadMp3: "/student_blue/upload_mp3_data",
    // 英语通过年级学期获取单元
    getUnitEn: "/english_blue/query_course",
    //英语智能句获取题
    originSentenceStemListEn: "/english_blue/origin_sentence_stem",
    // 英语智能句单题保存
    recordSingleStemEn: "/english_blue/record_single_stem",
    //英语智能句套题保存,拿题（get，put）
    origin_sentence_stemEn: "/english_blue/origin_sentence_stem",
    // 英语连线题拿题
    lineExerciseEn: "/student_blue/line_exercise",
    // 连线题保存
    saveLineexercise: "/student_blue/save_line_exercise",

    imageToBase64Info: "/student_blue/image_to_base64_info",
    // 英语获取统计结果
    englishGetStacisticsHome: "/student_blue/statistic",
    // 英语获取单独的统计结果
    englishGetStacisticsItem: "/student_blue/knowledge_statistic_rate",
    // 英语手写题获取题目
    handwritingExercise: "/student_blue/handwriting_exercise",
    // 英语手写题保存答题
    // 英语Sentences首页
    getSentencesStatistics: "/student_blue/learn_today/statistics",
    // 英语日记首页
    getEngSentencesDairy: "/student_blue/learn_today/info",
    // 英语日记拿题
    getEngTopicDairy: "/student_blue/learn_today/exercises",
    // 英语日记题目保存
    saveEngTopicDairy: "/student_blue/learn_today/ab_stu_sen_single",
    // 英语句子日记保存套题
    saveEngTopicAllDairy: "/student_blue/learn_today/exercises",
    // 英语句子日记答题记录
    getEngTopicDairyRcord: "/student_blue/learn_today/history_detail",
    // 英语句子日记拿题目详情
    getEngTopicDairyRcordDetail: "/student_blue/learn_today/exercise",
    // 英语获取卡通人物对应信息
    getEngCartoonInfo: "/student_blue/learn_friends/info",
    // 英语with friends拿题
    getEngCartoonExercise: "/student_blue/learn_friends/exercises",
    // 英语with friends题目保存
    saveEngCartoonExercise: "/student_blue/learn_friends/ab_stu_sen_single",
    // 英语with friends套题保存
    saveEngCartoonAllExercise: "/student_blue/learn_friends/exercises",
    // 英语with friends统计信息
    getEngCartoonStatistics: "/student_blue/learn_friends/statistics",
    // 英语with friends答题记录
    getEngCartoonRcordDetail: "/student_blue/learn_friends/history_detail",
    // 英语with friends分类统计
    getEngCartoonTypeStatistics: "/student_blue/learn_friends/detail_statistics",
    // 英语with friends记录状态
    getEngCartoonRecordStatus: "/student_blue/learn_friends/record_status",

    // 语文统计获取各个模块统计结果
    chineseGetStacisticsHome: "/chinese_blue/ch_statistics",
    // 语文统计获取雷达图信息
    chineseGetStacisticsRodar: "/chinese_blue/ch_radar_map",
    //语文获取各个能力统计
    chineseGetStacisticsItem: "/chinese_blue/ch_statistics_detail",
    // 语文统计获取折线图数据
    chineseGetStacisticsItemLineChart: "/chinese_blue/ch_stu_chart",
    //获取总派分
    getPaiNum: "/auth_blue/stu_pai_score",
    // π计划阅读理解获取各个文体统计信息
    chinesDailySpeReadingStatics: "/chinese_blue/read_category_statistics",
    // π计划阅读理解获取文体讲解
    chinesDailySpeReadingExplain: "/chinese_blue/read_category_explain",
    // π计划每日一练获取推送题目
    chinesDailyBagExercise: "/student_blue/stu_daily_push",
    // π计划每日一练保存做题结果并获取要素题
    chinesDailyBagExerciseSave: "/chinese_blue/stu_daily_push",
    // π计划阅读提升获取题目
    chinesDailySpeReadingGetExerciseList: "/student_blue/read_improve_exercise",
    // π计划阅读提升保存题目
    chinesDailySpeReadingSaveExerciseList: "/chinese_blue/stu_read_push",
    // 语文π计划句子专项考察类型
    getChinspect: "/student_blue/ab_stu_sen_inspect",
    // 语文句子专项统计
    getChinesSenstatistics: "/chinese_blue/ab_stu_sen_statistics",
    // 语文句子专项解析
    getinspect_explain: "/chinese_blue/ab_stu_inspect_explain",
    // 语文句子专项拿题
    getChinesSenTopic: "/chinese_blue/ab_stu_inspect_exercise",
    // 语文句子专项保存单个题
    saveChinesSenTopic: "/chinese_blue/ab_stu_sen_single",
    // 语文句子专项套题保存
    saveChinesSenTopicAll: "/chinese_blue/ab_stu_inspect_exercise",
    // 语文新版智能句准想训练获取单元下知识点
    chineseNewSentenceGetKnow: "/student_blue/intelligence_sen_knowledge",
    // 语文新版智能句准想训练获取单元下题目
    chineseNewSentenceGetExercise: "/student_blue/intelligence_sen_exercise",
    // 语文智能句 π计划每日一练
    chineseGetDailySentenceExercise: "/student_blue/ab_stu_sen_exercise",
    // 语文智能句 π计划每日一练获取习题列表
    chineseGetDailySentenceExerciseRecord: "/student_blue/history_detail",
    //语文智能句综合提升拿题
    chineseSpeSentenceLevelGetExercise:
        "/student_blue/ab_stu_sen_improve_exercise",
    // 语文智能句 综合提升查看做题记录 improve_history_detail
    chineseGetDailySentenceExerciseRecordLevel:
        "/student_blue/improve_history_detail",
    // 语文同步学习获取习题列表
    getChineseBagRecordList: "/student_blue/history_exercise_detail",
    // 语文根据题目变化获取题目详情
    getChineseExerciseDetail: "/student_blue/single_exercise_detail",
    // 语文获取单元
    getChineseUnitList: "/chinese_blue/grade_term_lesson",
    // 语文获取每日一练做题记录
    getChineseDailyRecord: "/student_blue/stu_daily_push_detail",
    // 语文获取阅读理解做题记录
    getChineseReadingRecord: "/chinese_blue/student_exercise_record_detail",
    // 语文获取阅读每日一练
    getChineseReadingDailyExercise: "/student_blue/read_daily_exercise",
    // 语文获取听写题
    getChineseListenExecise: "/student_blue/stu_spell_exercise",
    // 语文保存听写题
    saveChineseListenExecise: "/student_blue/stu_spell_exercise_record",
    // 语文获取听写题做题记录
    getChineseListenExeciseRecord: "/student_blue/stu_spell_exercise_record",
    // 语文获取智能造句做题记录
    getChineseSpeSentenceSpeExeciseRecord: "/student_blue/history_detail",
    // 语文获取智能造句做题记录单题重做
    getChineseSpeSentenceSpeExeciseRecordItem:
        "/student_blue/ab_stu_inspect_exercise",
    // 获取语文权限
    getchineseStudentGoods: "/student_blue/permission_module",
    // 英语获取做题记录
    getEnglishTestMeRecodList: "/student_blue/query_record_exercise",
    // 英语获取做题记录 题目
    getEnglishTestMeRecodListDetail: "/student_blue/single_exercise",
    // 智能句统计详情   总览
    getChineseSentenceAllStatics: "/chinese_blue/ch_sen_special_statistics",
    // 语文习作获得文体
    getchineseCompositionType: "/student_blue/composition_category",
    // 语文习作获得文体讲解
    getchineseCompositionTypeDetail: "/student_blue/comp_explanation_technology",
    // 语文习作获得命题
    getchineseCompositionTypeList: "/student_blue/comp_proposition",
    // 语文习作获得命题下的习作
    getchineseCompositionArticleTitle: "/student_blue/composition",
    // 语文习作获得命题下审题的习题
    getchineseCompositionArticleExercise:
        "/student_blue/comp_proposition_exercise",
    // 语文习作获得命题下审题的习题 保存做题结果
    savechineseCompositionArticleExercise: "/student_blue/record_comp_exercise",
    // 语文习作获得中心思想
    getchineseCompositionArticleCenter: "/student_blue/composition_theme",
    // 语文习作获得结构
    getchineseCompositionArticleStructure: "/student_blue/comp_first_mind_map",
    // 语文习作 保存选择的中心思想等
    svechineseCompositionArticleStructure: "/student_blue/comp_stu_new_mind_map",
    // 获取新的思维导图
    svechineseCompositionArticleStructureNew: "/student_blue/make_comp_mind_map",
    // 语文习作 获取思维导图的思路提示
    getChineseCompositionStructureExplanation: "/student_blue/mind_map_think_tip",
    // 语文习作 获取思维导图的习题
    getChineseCompositionStructureExercise:
        "/student_blue/comp_mind_map_exercise",
    // 语文习作 获取思维导图的习题保存答案
    saveChineseCompositionStructureExercise:
        "/student_blue/add_mind_map_exercise",
    // 语文习作 获取思维导图的习题单独题目
    getChineseCompositionStructureExerciseOne:
        "/student_blue/single_comp_exercise_detail",
    // 语文习作 获取思维导图所有数据
    getChineseCompositionStructureAll: "/student_blue/show_make_comp_mind_map",
    // 语文习作 获取思维导图 范文信息
    getChineseCompositionModelArticleDetail:
        "/student_blue/single_composition_article",
    // 语文习作 获取思维导图保存信息，表示完成
    saveCompositionAllMsg: "/student_blue/comp_mind_map_complete",
    // 语文习作 获取好词佳句详情
    getCompositionKnowDetail: "/student_blue/article_word_knowledge",
    // 语文习作 获取我的创作 文体列表
    getCompositionMyCreaterType: "/student_blue/history_article_category",
    // 语文习作 获取我的创作 列表
    getCompositionMyCreaterList: "/student_blue/history_composition",
    // 语文习作 获取我的作文批改 列表
    getCompositionMyUploadArticleList: "/student_blue/all_upload_composition",
    // 数学思维训练 获取错题集方向列表
    getMathThinkingErrTaskType: "/student_blue/get_thinking_wrong_type",
    // 数学思维训练，获取具体错题详情
    getMathThinkingErrTask: "/student_blue/get_thinking_wrong_stem",
    // 数学思维训练，主页
    getMathThinkingIndex: "/student_blue/get_thinking_type",
    // 数学思维训练，综合练习拿题
    getMathThinkingComprehensiveTopic: "/student_blue/get_thinking_last_stem",
    // 数学思维训练，综合练习题目保存
    saveMathThinkingComprehensiveTopic: "/student_blue/get_thinking_save",
    // 数学思维训练，综合练习正确率
    getMathThinkingComprehensiveStatistic: "/student_blue/get_thinking_last_rate",
    // 数学思维训练，综合练习错题保存
    saveMathThinkingWronfComprehensiveTopic:
        "/student_blue/get_thinking_wrong_again",
    // 语文学习日记获得答题类型
    getChineseDiaryHomelist: "/student_blue/diary_statistic",
    // 语文学习日记获得答题记录列表
    getChineseDiaryRecordList: "/student_blue/diary_statistic_records",
    // 语文学习日记获得答题记录 同步习题列表
    getChineseDiaryFlowRecordList: "/student_blue/diary_sync_history_exercise",
    // 语文学习日记获得答题记录 字词积累习题列表
    getChineseDiaryWordRecordList: "/student_blue/diary_module_exercise",
    // 语文获取习作总统计信息
    getChineseCompositionAllStatics: "/student_blue/composition_home_statistic",
    // 语文获取习作 π分排名
    getChineseCompositionPaiStatics: "/student_blue/composition_pai_score",
    // 英语获取test me的分模块情况
    getEnglishTestMeItem: "/student_blue/test_me/info",
    // 英语获取test me的获取习题
    getEnglishTestMeExercise: "/student_blue/test_me/exercises",
    // 英语test me 保存单个题目
    saveTestmeExercise: "/student_blue/test_me/stu_sen_single",
    // 英语test me 保存套题
    saveTestmeAllExercise: "/student_blue/test_me/exercises",
    // 英语test me 答题记录
    getTestMeExerciseRecord: "/student_blue/test_me/history_detail",
    // 英语获取test me的统计情况
    getEnglishTestMeStatics: "/student_blue/test_me/statistics",
    // 语文阅读理解 获取文章列表
    getChineseArticlelist: "/chinese_blue/available_read_article",
    //英语my study统计信息
    getEnglishMyStudyStatics: "/student_blue/my_study/statistics",
    //  语文 审核题目，获取同步的文章
    getChineseAllFlowExercisehome: "/platform_blue/sync/lesson",
    //  语文 审核题目，获取同步习题
    getChineseAllFlowExerciseList: "/platform_blue/sync/check_exercise",
    //  语文 审核题目，阅读理解 获取题材
    getChineseAllArticleType: "/platform_blue/read/category",
    //  语文 审核题目，阅读理解 获取文章
    getChineseAllArticleList: "/platform_blue/read/available_read_article",
    //  语文 审核题目，阅读理解 获取文章下的题目列表
    getChineseAllArticleExerciseList: "/platform_blue/read/student_read_stem",
    //  语文 审核题目，智能句  获取考察类型a
    getChineseSentenceAllType: "/platform_blue/ab/inspect",
    //  语文 审核题目，智能句  获取考察类型a
    getChineseSentenceAllExercise: "/platform_blue/ab/ab_exercise",
    //  语文 审核题目，智能句  获取考察类型a
    getChineseSentenceExerciseDetail: "/platform_blue/ab/single_exercise",
    //  英语获取知识点
    getEnglishKnowList: "/student_blue/mystudy/unit_knowledge",
    //  英语获取习题
    getEnglishKnowExerciseList: "/student_blue/mystudy/exercises",
    // 英语保存my study答题
    saveMystudyExercise: "/student_blue/mystudy/stu_sen_single",
    // 英语保存my study答题
    saveMystudyExerciseAll: "/student_blue/mystudy/exercises",
    // 语文拼音 获取所有知识点
    chinesePinyinGetAllKnow: "/student_blue/pinyin/all_knowledge",
    // 语文拼音 获取知识点的信息
    chinesePinyinGetKnowDetail: "/student_blue/pinyin/alphabet_voice",
    // 语文拼音 获取知识点的下的字
    chinesePinyinGetKnowWord: "/student_blue/pinyin/alphabet_relation_character",
    // 语文拼音 获取知识点的下的字详情
    chinesePinyinGetKnowWordDetail: "/student_blue/pinyin/single_character",
    // 语文拼音 获取知识点的下的词语详情
    chinesePinyinGetKnowTwoWordDetail: "/student_blue/pinyin/single_word",
    // 语文拼音 获取知识点的下的习题
    chinesePinyinGetKnowExercise: "/student_blue/pinyin/all_exercise",
    // 语文拼音 保存单题结果
    chinesePinyinSaveKnowExercise: "/student_blue/pinyin/save_exercise",
    // 语文拼音 获取答题记录
    chinesePinyinGetExerciserecord: "/student_blue/pinyin/exercise_record",
    // 英语保存my study答题记录
    getMyStudyRecord: "/student_blue/mystudy/history_detail",
    // 数学 图 获取type number
    getMathGraphNumberType: "/student_blue/get_graph_number_type",
    // 数学 图 获取类型下存在的按钮列表
    getMathGraphButtonInfoList: "/student_blue/get_graph_button_list",
    // 数学 图 获取具体按钮的信息
    getMathGraphButtonInfo: "/student_blue/get_graph_button_info",
    // 数学 图 获取死题(当前测试)
    getMathGraphCurrentTestExercise: "/student_blue/get_graph_current_test",
    //语文 获取单元习作列表
    // 数学同步学习答题记录列表
    getMathTongbuRecordList: "/student_blue/study_history_exercise",
    // 数学同步学习答题记录详情
    getMathTongbuRecordListDetail: "/student_blue/study_history_info",
    // 苹果客户端获取家长端token
    getParentToken: "/apple_blue/login",
    // 苹果客户端创建学生
    createStudent: "/apple_blue/student",
    getChineseUnitCompositionList: "/student_blue/unit_comp_proposition_stem",
    //语文 获取范文练手命题
    getChineseCompositionArticleTitleList:
        "/student_blue/comp_example/prop_article",
    //语文 获取范文练手文章详情
    getChineseCompositionArticleTitleDetail:
        "/student_blue/comp_example/article_exercise",
    //语文 获取范文练手文章 保存习题
    saveChineseCompositionArticleTitleDetail:
        "/student_blue/comp_example/record_example_exercise",
    // 数学 能力诊断单元获取课时
    getMathDiagnosisLesson: "/student_blue/get_diagnosis_lesson",
    // 数学 能力诊断拿题
    getMathDiagnosisTopic: "/student_blue/get_diagnosis_stem",
    // 数学 保存能力诊断题
    saveMathDiagnosisTopic: "/student_blue/get_diagnosis_save",
    // 数学 能力诊断做完推荐
    getMathDiagnosisRecommend: "/student_blue/get_sync_recommend",
    // 数学 能力诊断答题记录
    getMathDiagnosisRecordList: "/student_blue/get_diagnosis_history",
    // 数学 能力诊断获取题目详情
    getMathDiagnosisTopicDetails: "/student_blue/get_sync_stem",
    //语文 获取范文练手文章 获取思维导图
    getChineseCompositionArticleMindMap:
        "/student_blue/comp_example/comp_exam_stu_new_mind_map",
    //语文 获取范文练手文章 获取思维导图习题
    getChineseCompositionArticleMindMapExercise:
        "/student_blue/comp_example/comp_mind_map_exercise",
    //语文 获取范文练手文章 保存思维导图习题
    saveChineseCompositionArticleMindMapExercise:
        "/student_blue/comp_example/record_mind_map_exercise",
    //语文 获取范文练手文章 重新获取思维导图
    getChineseCompositionArticleMindMapNow:
        "/student_blue/comp_example/make_comp_mind_map",
    //语文 获取范文练手文章 获取完成后的思维导图
    getChineseCompositionArticleOverMindMapNow:
        "/student_blue/comp_example/show_example_mind_map",
    //语文 获取范文练手文章 获取完成后的思维导图
    saveChineseCompositionArticleOverMindMapNow:
        "/student_blue/comp_example/comp_mind_map_complete",
    //语文 获取范文练手文章 获取答题记录
    sgetChineseCompositionArticleRecord:
        "/student_blue/comp_example/article_mind_map_records",
    //语文 获取范文练手  答题记录拿单题
    getChineseCompositionArticleOneExercise:
        "/student_blue/comp_example/single_example_exercise_detail",
    //语文 获取范文练手  答题记录拿犀利列表
    getChineseCompositionArticleExerciseList:
        "/student_blue/comp_example/single_mind_map_exercise_records",
    //语文 获取写法点拨详情
    getChineseCompositionWrite: "/student_blue/single_explanation_technology",
    // 数学单元诊断获取单元
    getUnitDiagnosis: "/student_blue/get_testing_unit",
    //数学单元诊断获取单元套题
    getUnitDiagnosisSet: "/student_blue/get_testing_lesson",
    // 数学单元诊断套题拿题
    getUnitDiagnosisTopic: "/student_blue/get_testing_stem",
    // 数学单元诊断题目保存
    getUnitDiagnosisTopicSave: "/student_blue/set_testing_save",
    // 数学单元诊断答题记录
    getUnitDiagnosisTopicHis: "/student_blue/get_testing_history",
    // 数学单元诊断答题记录详情
    getUnitDiagnosisTopicHisDetail: "/student_blue/get_testing_history_info",
    // 数学单元诊断答题记录题目详情
    getUnitDiagnosisTopicDetail: "/student_blue/get_testing_stem_info",
    //语文 获取我的课桌答题记录
    getChineseMyDescHistory: "/student_blue/desk/exercise_records",
    //语文 获取我的课桌答题记录 一套题
    getChineseMyDescHistoryExerciselist: "/student_blue/desk/single_records",
    //语文 获取我的课桌答题记录 一套题
    getChineseMyDescHistoryWrong: "/student_blue/desk/wrong_exercises",
    //英语 获取我的课桌答题记录 一套题
    getEnglishMyDescHistoryWrong: "/student_blue/desk/en_wrong_exercises",
    //英语 获取我的课桌答题记录
    getEnglishMyDescHistory: "/student_blue/desk/en_exercise_records",
    //英语 获取我的课桌答题记录 习题列表
    getEnglishMyDescHistorylist: "/student_blue/desk/en_single_records",
    //语文 获取拼音答题记录 统计
    getChinesePinyinRecordTotal: "/student_blue/pinyin/right_rate",
    // 数学 图综合测试拿题
    getMathVectorComprehensiveTopic: "/student_blue/get_graph_integral_dead",
    // 数字 图综合测试拿活题
    getMathVectorComprehensiveTopicOperat:
        "/student_blue/get_graph_integral_live",
    // 数学 图综合测试题目状态
    getMathVectorComprehensiveTopicStatus:
        "/student_blue/get_graph_integral_status",
    //语文 获取拼音所有知识点
    getChinesePinyinKnowAll: "/chinese_blue/pinyin/knowledge",
    //语文 获取拼音 知识点所有习题
    getChinesePinyinAllExercise: "/student_blue/pinyin/test_all_exercise",
    // 获取购买商品列表信息
    getPurchaseProductsList: "/student_blue/module_products",
    // 数学 图当前测试题目状态
    getMathVectorCurrentTopicStatus: "/student_blue/get_graph_current_status",
    // 数学 图当前测试拿死题
    getMathVectorCurrentTopic: "/student_blue/get_graph_current_test",
    // 数学 图当前测试拿活题
    getMathVectorCurrentTopicOperat: "/student_blue/get_graph_current_live",
    // 数学课桌题目保存
    saveMathDeskTopic: "/student_blue/save_math_info",
    // 数学课桌获取错题
    getMathDeskWrongTopic: "/student_blue/get_desk_error",
    // 数学课桌答题记录时间轴
    getMathDeskRecordTime: "/student_blue/get_desk_history_time",
    // 课桌获取历史记录
    getMathDeskRecord: "/student_blue/get_desk_history",
    // 数学课桌历史记录套题详情
    getMathDeskRecordDetails: "/student_blue/get_desk_history_stem",
    // 数学同步诊断获取单元
    getMathSyncDiagnosisUnit: "/student_blue/get_study_unit",
    // 数学同步诊断获取课时
    getMathSyncDiagnosisLesson: "/student_blue/get_lesson_code",
    // 数学同步诊断拿题目数量
    getMathSyncDiagnosisTopicNum: "/student_blue/get_study_exercise",
    // 数学同步诊断题目详情
    getMathSyncDiagnosisTopic: "/student_blue/get_study_exercise_info",
    // 数学同步诊断保存题目
    saveMathSyncDiagnosisTopic: "/student_blue/save_study_exercise_answer",
    // 发送验证码
    // getCodeByEmail: "/parents_blue/send_msg_api",
    getCodeByEmail: "/auth_blue/mobile/code",
    // 验证码登录
    // loginBtyTel: "/parents_blue/parents_login",
    loginBtyTel: "/auth_blue/mobile_account",

    // 获取学生列表
    getMyStudentList: "/parents_blue/student",
    // 验证账号
    sureStudnetName: "/parents_blue/check_account",
    // 删除学生
    delStudent: "/parents_blue/student_delete",
    // 用户管理登录
    loginNoPwd: "/parents_blue/student_login",
    // 修改昵称
    editMyNickName: "/auth_blue/update",
    // 数学课桌拿题目序号
    getMathDeskTopicNums: "/student_blue/get_math_homework_steam_index",
    // 数学课桌拿题
    getMathDeskTopic: "/student_blue/student_math_homework",
    // 获取付款二维码
    getPayCode: "/payment_blue/payment_launch_native",
    // 课桌错题保存
    saveMathDeskWrongTopic: "/student_blue/save_desk_error",
    // 课桌查看徽章详情
    getMathDeckMedal: "/student_blue/get_medal",
    // 数学知识图谱获取要素讲解
    getMathKGElementExplain: "/student_blue/get_element_explain",
    // 数学知识图谱要素时间线
    getMathKGElementTimeLine: "/student_blue/get_element_time",
    // 数学知识图谱获取单元
    getMathKGUnit: "/student_blue/get_element_unit",
    // 数学知识图谱要素题序号
    getMathKGIndex: "/student_blue/get_element_index",
    // 数学知识图谱获取要素题
    getMathKGTopic: "/student_blue/get_element_stem",
    // 数学知识图谱获取知识点上下游关系
    getMathKnowledgePointFlow: "/student_blue/get_unit_element",
    // 数学知识图谱要素题保存
    saveMathKGTopic: "/student_blue/save_element_answer",
    // 语文拼音保存读音的分数
    savePinyinSpeakScore: "/student_blue/pinyin/voice_score",
    // 语文拼音保存听，写状态
    savePinyinListenAndWRiteStatus: "/student_blue/pinyin/knowledge_study",
    // 语文拼音获取答题窗台
    getPinyinExerciseStatus: "/student_blue/pinyin/is_answer_record",
    // 数学 智能学习计划  获取当前单元要素
    getMathAiGiveExerciseHomeList: "/student_blue/mind_plan/home",
    // 数学 智能学习计划  获取当前推送题目的要素
    getMathAiGiveExerciseKnow: "/student_blue/mind_plan/push_exercise_knowledge",
    // 数学 智能学习计划  获取题目
    getMathAiGiveExerciseKnowExerciseList: "/student_blue/mind_plan/exercise",
    // 数学 智能学习计划  获取题目详情
    getMathAiGiveExerciseKnowExercise: "/student_blue/mind_plan/single_exercise",
    // 数学 智能学习计划  保存答题结果
    saveMathAiGiveExerciseKnowExercise:
        "/student_blue/mind_plan/save_sync_element_record",
    // 数学 智能学习计划  获取单元提升题目
    getMathAiGiveExerciseUnitExerciseList:
        "/student_blue/mind_plan/unit_improve_exercise",
    // 数学 智能学习计划  获取单元提升题目
    getMathAiGiveExerciseUnitExercise:
        "/student_blue/mind_plan/improve_single_exercise",
    // 数学 智能学习计划  保存单元提升题目
    saveMathAiGiveExerciseUnitExercise:
        "/student_blue/mind_plan/save_unit_improve",
    // 数学 智能学习计划  保存单元提升题目
    getMathAiGiveExerciseRodar: "/student_blue/mind_plan/radar_map",
    // 获取编程题
    getMathProgramExercise: "/student_blue/program/exercise",
    // 获取时间线知识点
    getMathAiGiveHistoryKnow: "/student_blue/mind_plan/time_element_rate",
    // 获取历史答题记录
    getMathAiGiveHistoryHistoryExercise:
        "/student_blue/mind_plan/time_exercise_set_detail",
    // 字学树首页字列表
    getChildAllChar: "/student_blue/young/get_all_char",
    // 字学树单个字学习
    getChildSingleChar: "/student_blue/young/single_character",
    // 字学树单个字保存
    saveChildSingleChar: "/student_blue/young/save_single_char",
    // 字学树单个字相关句子
    getChildSingleSentence: "/student_blue/young/single_sentence",
    // 字学树词语保存
    saveChildSingleWord: "/student_blue/young/save_single_word",
    // 字学树获取字笔顺
    getChildCharStruck: "/student_blue/young/single_char_struck",
    // 字学树写字保存
    saveChildCharStruck: "/student_blue/young/save_single_char",
    // 获取ios家长绑定手机号
    getIosParentTel: "/apple_blue/mobile",
    // 获取智能句专项列表
    getSentenceSpeList: "/student_blue/ab_stu_sen_revision",
    // 获取智能句同步答题记录
    getSentenceFlowRecord: "/student_blue/intelligence_exercise_records",
    // 或取首页配置
    getHomepageConfig: "/student_blue/get_all_module",
    // 获取商品
    getGoodsList: "/payment_blue/goods",
    // 获取二维码url
    getQRcode: "/payment_blue/native",
    // 获取编程能力
    getProgramAbility: "/student_blue/program/ability",
    // 获取编程能力题号
    getProgramTopicIndex: "/student_blue/program/ability/stem/index",
    // 获取编程能力题目
    getProgramTopic: "/student_blue/program/ability/stem",
    // 编程能力题目保存
    saveProgramTopic: "/student_blue/program/ability/stem/save",
    // 编程语法查询左侧导航
    getProgramRouter: "/student_blue/program/tool/router",
    // 编程语法知识点序号
    getProgramPointIndex: "/student_blue/program/tool/point/index",
    // 编程语法获取知识点详情
    getProgramPointDetail: "/student_blue/program/tool/point",
    // 编程运行
    runProgramCode: "/student_blue/program/stem/run_code",
    // 获取二维码url
    getFlowReadingRecordList: "/chinese_blue/read_article/records",
    // 编程 获取单元或者方向
    getProgramOrigin: "/student_blue/program/stem/origin",
    // 编程 方向或单元下的题目
    getProgramOriginTopic: "/student_blue/program/stem",
    // 编程 题目code
    getProgramOriginTopicCode: "/student_blue/program/stem/code_info",
    // 编程 保存状态
    saveProgramStatus: "/student_blue/program/stem/status",
    // 编程 英语知识点
    getProgramEnglishDetails: "/student_blue/program/stem/translate",
    // 编程 编程知识点详情
    getProgramKnowledgeDetails: "/student_blue/program/stem/find_point",
    // 编程首页徽章
    getProgramHomePageBadge: "/student_blue/program/index",
    // 智能学习计划
    getCustomExercise: "/student_blue/customized/get_stu_exercise",
    // 智能学习计划保存心里题目
    saveCustomHeartRecords: "/student_blue/customized/save_heart_records",
    // 智能学习计划保存学生题目
    saveCustomStudentRecords: "/student_blue/customized/save_student_records",
    // 智能学习计划保存家长题目
    saveCustomParentRecords: "/student_blue/customized/save_parent_records",
    // 智能学习计划保存套题
    saveExerciseRecords: "/student_blue/customized/update_exercise_set_status",
    // 智能学习计划获取tag
    getCustomTags: "/student_blue/customized/get_all_tag",
    // 是否做过智能学期计划套题
    getCustomIsFinish: "/student_blue/customized/finish_exercise_set",
    // 编程一年级知识点
    getGradeOneKNow: "/student_blue/get_unit_program",
    // 语文习作 文化常识积累 拿题
    getChineseCompositionWriteExercise:
        "/student_blue/single_technology_exercises",
    // 语文习作 保存文化常识积累题目
    saveChineseCompositionWriteExercise: "/student_blue/add_technology_exercise",
    // 语文习作 保存文化常识积累答题记录
    getChineseCompositionWriteExerciseRecord: "/student_blue/technology_records",
    // 购买解锁推荐模块, 获取二维码url
    purchaseAIPlanModules: "/payment_blue/module_native",
    // 获取已购买服务的详细信息
    getServiceInfo: "/student_blue/get_all_service",
    // 获取订单信息
    getOrderInfo: "/student_blue/get_all_order",
    // 获取所有推荐模块信息
    getAIPlanAllModules: "/student_blue/get_module",
    // 英语智能句审核一级菜单
    getEnExamineType: "/student_blue/ab_sen_inspect",
    // 英语智能句审核一级菜单下的单元
    getEnExamineUnit: "/student_blue/ab_sen_unit",
    // 英语智能句审核题目列表
    getEnExamineTopicList: "/student_blue/check/ab_sen_exercises",
    // 英语智能句审核题目
    getEnExamineTopic: "/student_blue/check_single_en_ab_exercise",
    // 智能学习计划跳过当前
    aiPlanJumpThis: "/student_blue/customized/skip_customized_code",
    // 获取教材版本
    mathGetTextbook: "/student_blue/math/textbook",
    // 获得 AI 讲解
    aiChatAnswer: "/student_blue/mind_plan/ai_explain_exercise",
    // 获得知识点下面的智能句题目
    getKnowSentenceExercise: "/student_blue/intelligence_knowledge_sen_exercise",
    // 要素题AI升级
    getImproveElementTopic: "/student_blue/sync_to_improve_element",
    // 要素题AI升级
    getChildrenStar: "/student_blue/young/get_all_statistics",
    // 拼音获取单个字
    getPinyinOneWord: "/student_blue/young_pinyin/single_character",
    // 拼音获写字
    getPinyinOneWordStruck: "/student_blue/young_pinyin/single_struck",
    // 拼音获句子
    getPinyinOneWordSentence: "/student_blue/young_pinyin/single_sentence",
    // 广场首页
    getSquareHome: "/student_blue/card/get_all_data",
    // story 简介
    getStoryDesc: "/student_blue/card/paistory_desc",
    // 古诗词 简介
    getReadingDesc: "/student_blue/card/reading_detail",
    // 数学知识点 简介
    getMathKnowDesc: "/student_blue/card/math_knowledge_detail",
    // 古诗词 拿题目
    getReadingExercise: "/student_blue/card/reading_exercise",
    // 知识图谱 拿题目
    getMathKnowExercise: "/student_blue/card/element_exercise",
    // 广场历史记录
    getSquareHistory: "/student_blue/card/foot_data",
    // 广场story 详情
    getStoryArticle: "/student_blue/card/paistory_detail",
    // 保存广场读文章
    saveStoryPart: "/student_blue/card/save_article_part",
    // 巧算，思维训练b面
    getCardMathTopic: "/student_blue/card/thinking_exercise",
    // 数学巧算，思维训练 简介
    getMathThinkingAndCal: "/student_blue/card/thinking_detail",
    // 广场共创故事
    getSquareStoryChat: "/student_blue/card/common_words_story",
    // 发布共创故事
    postSquareStoryChat: "/student_blue/card/common_story_publish",
    // 获取创作文章的词语
    getSquareWords: "/student_blue/card/query_common_words",
    // 保存创作文章的词语
    saveSquareCheckedWords: "/student_blue/card/save_common_words",
    // 获取我的创作
    getMyCreateStory: "/student_blue/card/published_story",
    // 共创故事详情
    getCommonStoryDetail: "/student_blue/card/common_story_detail",
    // 共创故事单个词语意思
    getStoryWordDetail: "/student_blue/card/single_story_words",
    // 生成故事音频
    getSquareStoryAudio: "/student_blue/card/article_audio",
    // 获取问题
    getSquareScienceQuestion: "/student_blue/card/common_problem",
    // 创作百科故事
    postSquareScienceQuestion: "/student_blue/card/common_create_story_v2",
    // 获取百科故事重点句
    getSquareScienceStorySentences: "/student_blue/card/common_story_sentence",
    // 百科故事读词保存
    saveSquareScienceWord: "/student_blue/card/save_word_flow",
    // 点赞
    saveLike: "/student_blue/card/like",
    // 获得币
    getPaiCoinNow: "/student_blue/card/gold",
    // 百科故事对话
    getSquareScienceTalk: "/student_blue/card/common_story_spoken",
    // 打赏
    saveMyCoin: "/student_blue/card/tips_gold",
    // 搭上
    getMyCoinAndFire: "/student_blue/card/total_gold",
    // 购买派币微信
    getPayCoinWx: "/payment_blue/pay_card",
    // 购买派币苹果
    savePayCoinApple: "/payment_blue/card_apple_pay",
    // 冲销
    getMyExpenseCalendar: "/student_blue/card/square_gold",
    // 冲销统计
    getMyExpenseCalendarNum: "/student_blue/card/total_gold_detail",
    // 家长故事
    createStoryParent: "/student_blue/card/common_create_story_v3",
    // 冲销统计
    getSquareParentQuestion: "/student_blue/card/parent_problem",
    // 扣币
    costPaiCoin: "/student_blue/card/cost_read_gold",
    // 生成故事扣币
    costPaiCreateTalk: "/student_blue/card/cost_create_gold",
    // 是否需要扣币买模块
    getIsNeedCoin: "/student_blue/card/show_module_coins",
    // 派币支付
    purchaseCoin: "/student_blue/card/module_cost_coins",
    // 获取单个模块权限
    getModuleAuth: "/student_blue/card/judge_spent_coin",
    // 获取百科故事分类
    getQuestionType: "/student_blue/card/common_tag",
    // 注销账号
    closeAnAccount: "/auth_blue/account_logout",
    // 保存计划单元
    saveAiPlanUnit: "/student_blue/customized/save_unit_position",
    // 保存选择的计划
    saveCheckPlan: "/student_blue/customized/person_customized_plans",
    // 计划扣币
    planSplitCoin: "/student_blue/card/customized_cost_coins",
    // 计划 知识图谱拿题
    planMathKnowGetExercise: "/student_blue/customized/knowledge_graph_exercise",
    // 计划 知识图谱升级
    planMathKnowGetNextLevelExercise:
        "/student_blue/customized/person_element_exercise",
    // 获取背景头像
    planGetTitleImg: "/student_blue/customized/person_customized_background",
    // 每日签到
    everydaySignIn: "/student_blue/customized/customized_daily_clock",
    // 获取主题
    getAllTHemeList: "/student_blue/customized/all_customized_background",
    // 获取知识图谱
    getMathGraphKnow: "/student_blue/get_element_graph",
    // 获取知识图谱讲解
    getMathGraphKnowExplain: "/student_blue/get_element_graph_explain",
    // 获取知识图谱讲解
    getMathGraphKnowAiTalk: "/student_blue/get_element_graph_stem",
    // 获取知识图谱讲解
    getMathGraphKnowRecord: "/student_blue/get_element_graph_history",
    // 获取语文智能句ai题目
    getChineseSentenceAiExerciseFirst: "/student_blue/card/ab_bot_exercise",
    // 获取语文智能句ai题目
    getChineseSentenceAiExercise: "/student_blue/card/next_ab_bot_exercise",
    // 获取语文智能句ai题目
    getChineseSentenceAiExerciseRecord: "/student_blue/card/bot_record_exercise",
    // 获取模块今日获得派币数量
    getModuleTodayCoin: "/student_blue/card/module_coin",
    // 数学同步错题
    getMathSyncDiagnosisErr: "/student_blue/get_study_exercise_error_list",
    // 数学AI推题错题
    getMathAIErr: "/student_blue/mind_plan/get_wrong",
    // 数学智能计划错题
    getMathAIPracticeErr: "/student_blue/mind_plan/get_wrongs",
    // 数学知识图谱错题
    getMathElementErr: "/student_blue/get_element_error_list",
    // 数学巧算错题
    getMathExpandErr: "/student_blue/get_expand_wrong_basics",
    // 数学错题集思维训练类型
    getThinkingType: "/student_blue/get_thinking_wrong_type",
    // 数学思维训练错题
    getThinkingErr: "/student_blue/get_thinking_wrong_list",
    // 数学同步错题详情
    getMathSyncDiagnosisErrDetails: "/student_blue/get_study_exercise_info",
    //数学同步错题保存
    saveMathSyncDiagnosisErr: "/student_blue/save_study_exercise_again",
    // 数学知识图谱错题详情
    getMathElementErrDetails: "/student_blue/get_element_stem",
    // 数学知识图谱错题保存
    saveMathElementErr: "/student_blue/save_element_stem_again",
    //数学AI推题错题保存
    saveMathAIErr: "/student_blue/mind_plan/save_element_sync_again",
    //数学智能学习计划错题保存
    saveMathAIPracticeErr: "/student_blue/mind_plan/save_element_sync_agains",
    getPracticeElementDetails: "/student_blue/mind_plan/get_kms_element",
    getPracticeElementExercise: "/student_blue/mind_plan/get_all_unit_element",
    savePracticeElementExercise: "/student_blue/mind_plan/save_kms_stem",
    getReadAIBotHistory: "/student_blue/ai_bot/read_bot_history",
    getChineseReadingAIHelp: "/student_blue/ai_bot/read_exercise",
    //获得同步ai_bot历史记录
    getSyncAIBotHistory: "/student_blue/ai_bot/sync_ai_history",
    //获得同步ai_bot
    getSyncReadingAIHelp: "/student_blue/ai_bot/sync_exercise",
    //英语语法ai_bot历史
    getGrammarAIBotHistory: "/student_blue/ai_bot/grammar_bot_history",
    //英语语法ai_bot
    getGrammarAIHelp: "/student_blue/ai_bot/grammar_explain",
    //语文习作历史ai_bot
    getCompositionAiBotHisotry: "/student_blue/ai_bot/comp_explain_history",
    //语文习作ai_bot
    getCompositionAiHelp: "/student_blue/ai_bot/comp_explain",
    //获得中文句法ai_bot历史记录
    getAbSenAIBotHistory: "/student_blue/ai_bot/ab_sen_history",
    //获得语文中文句法ai_bot
    getAbSentenceAiHelp: "/student_blue/ai_bot/ab_sen_inspect",
    //英语语法ai_bot历史
    getCheckWordsAIBotHistory: "/student_blue/ai_bot/words_article_history",
    //英语check/words ai_bot
    getCheckWordsAiHelp: "/student_blue/ai_bot/words_article",
    getDayTask: "/student_blue/get_day_task",
    getTaskGold: "/student_blue/get_task_gold",
    getQuickPinyin: "/student_blue/chinese_fast_exercise",

    getEnglishNewStatistics: "/student_blue/english_module_statistics",
    getEnglishNewStatisticsLine: "/student_blue/english_ability_statistics",
    getWordTreeData: "/student_blue/word_knowledge_tree",
    getConnectWord: '/student_blue/words_data',
    getHasExercises: '/student_blue/has_word_exercises',
    getEnglishWrongRecords: '/student_blue/english_statistic/wrong_exercise_records',
    getEnglishAIExercise: '/student_blue/mystudy/intelligence_plan',
    getRecommendModule: '/chinese_blue/statistics_recommend_module',
    subjectClock: '/chinese_blue/subject_clock',

    //能力法
    //获取单元
    getStudyUnit: '/student_blue/get_study_unit',
    //获取单元能力详情
    getAbilityIndex: '/student_blue/ability/index',
    //获取要素题目
    getAbilityStem: '/student_blue/ability/get_stem',

    //保存答题
    save_answer: '/student_blue/ability/save_answer',
    //获取答题页面能力情况
    abilityInfo: '/student_blue/ability/info',
    //ai 讲解
    AIExplainExercise: '/student_blue/mind_plan/ai_explain_exercise',
    //统计
    abilityScore: '/student_blue/ability/score',
    //正态分布
    abilityZ: '/student_blue/ability/z',
    //ai出题拿题接口
    intelligenceAiExercises: '/student_blue/intelligence_ai_exercises'





};
