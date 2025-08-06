export default class NavigationMathUtil {
    /**
     * 重置到登录页
     */
    static resetToLogin(params) {
        const { navigation } = params;
        navigation.navigate("StudentRoleHomePageAndroid");
    }
    /**
     * 根据选择，跳转到数学课桌作业
     */
    static toMathDeskHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathDeskHomepage", { data });
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
    // 专项诊断报告页面
    static toMathSpecailImproveSchoolHome(params) {
        const { navigation, data } = params;
        navigation.navigate("MathSpecailImproveSchoolHome", { data });
    }
    // 专项诊断报告页面
    static toSpecailImprovePage(params) {
        const { navigation, data } = params;
        navigation.navigate("SpecailImprovePage", { data });
    }
    // π计划学习日记
    static toMathStudyDiary(params) {
        const { navigation, data } = params;
        navigation.navigate("MathStudyDiary", { data });
    }
    // 学习日记B计划
    static toMathStudyDiaryPlanB(params) {
        const { navigation, data } = params;
        navigation.navigate("MathStudyDiaryPlanB", { data });
    }
    //数学统一做题页面
    static toDoExerciseMath(params) {
        const { navigation, data } = params;
        navigation.navigate("DoExerciseMath", { data });
    }
    // 巧算主页
    static toMathEasyCalculationHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathEasyCalculationHomePage", { data });
    }
    // 拓展应用新主页
    static toMathExpandApplicationHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathExpandApplicationHomePage", { data });
    }
    // 拓展计算题学习
    static toEasyCalculationStudyPage(params) {
        const { navigation, data } = params;
        navigation.navigate("EasyCalculationStudyPage", { data });
    }
    // 拓展计算题做题
    static toEasyCalculationDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EasyCalculationDoExercise", { data });
    }
    // 拓展计算题错题
    static toEasyCalculationWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EasyCalculationWrongExercise", { data });
    }
    // 拓展计算题做错题
    static toEasyCalculationDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("EasyCalculationDoWrongExercise", { data });
    }
    // 拓展应用题学习
    static toMathExpandApplicationStudyPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathExpandApplicationStudyPage", { data });
    }
    // 思维训练主页
    static toMathThinkingTrainingPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingTrainingPage", { data });
    }
    // 思维训练迷宫地图页
    static toMathThinkingTrainingExercisePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingTrainingExercisePage", { data });
    }
    // 数量关系主页
    static toMathThinkingQtyRelationshipPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingQtyRelationshipPage", { data });
    }
    // 思路训练主页
    static toMathThinkingMindTrainingPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingMindTrainingPage", { data });
    }
    // 测试点选题页面
    static toMathSelectTitlePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathSelectTitlePage", { data });
    }
    // 题目类别页面
    static toMathQuestionKindPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathQuestionKindPage", { data });
    }
    // 开始训练页面
    static toMathDoExercisePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingDoExercisePage", { data });
    }
    // 拓展应用题答题
    static toMathExpandApplicationDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathExpandApplicationDoExercise", { data });
    }
    // 拓展应用题错题
    static toMathExpandApplicationWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathExpandApplicationWrongExercise", { data });
    }
    // 拓展应用题错题做题界面
    static toMathExpandApplicationWrongDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathExpandApplicationWrongDoWrongExercise", { data });
    }
    // 思维训练错题集主页
    static toMathThinkingTrainingErrTaskPage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingTrainingErrTaskPage", { data });
    }
    // 思维训练重新答题页面
    static toMathReDoExercisePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathThinkingTrainingReDoExercisePage", { data });
    }
    // 思维训练综合练习
    static toMathTTComprehensiveHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathTTComprehensiveHomePage", { data });
    }
    // 思维训练综合练习做题
    static toMathTTComprehensiveDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathTTComprehensiveDoExercise", { data });
    }
    // 图与数，图界面
    static toMathVector(params) {
        const { navigation, data } = params;
        navigation.navigate("MathVector", { data });
    }
    // 图与数，答题界面
    static toMathVectorOperator(params) {
        const { navigation, data } = params;
        navigation.navigate("MathVectorOperator", { data });
    }
    // 图与数，当前测试
    static toVectorDoexercise(params) {
        const { navigation, data } = params;
        navigation.navigate("VectorDoexercise", { data });
    }
    // 同步学习答题记录
    static toMathTongbuRecorList(params) {
        const { navigation, data } = params;
        navigation.navigate("MathTongbuRecorList", { data });
    }
    // 能力诊断主页
    static toMtahAbilityDiagnosisHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MtahAbilityDiagnosisHomePage", { data });
    }
    // 能力诊断做题
    static toMtahAbilityDiagnosisDoexercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MtahAbilityDiagnosisDoexercise", { data });
    }
    // 能力诊断做题记录
    static toMtahAbilityDiagnosisHis(params) {
        const { navigation, data } = params;
        navigation.navigate("MtahAbilityDiagnosisHis", { data });
    }
    // 单元诊断主页
    static toMtahUnitDiagnosisHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MtahUnitDiagnosisHomePage", { data });
    }
    // 单元诊断做题
    static toMtahUnitDiagnosisDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MtahUnitDiagnosisDoExercise", { data });
    }
    // 单元诊断做题--能力法记录
    static toDoExerciseRecord(params) {
        const { navigation, data } = params;
        navigation.navigate("DoExerciseRecord", { data });
    }


    // 单元诊断做题--能力法
    static toSkillMtahUnitDiagnosisDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("SkillMtahUnitDiagnosisDoExercise", { data });
    }
    // 图综合测试
    static toMathVectorComprehensiveDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathVectorComprehensiveDoExercise", { data });
    }
    // 课桌做题
    static toMathDeskDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathDeskDoExercise", { data });
    }
    // 课桌在练一次
    static toMathDeskDoWrongExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathDeskDoWrongExercise", { data });
    }
    // 同步诊断首页
    static toSyncDiagnosisHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("SyncDiagnosisHomepage", { data });
    }
    // 同步诊断答题
    static toSyncDiagnosisDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("SyncDiagnosisDoExercise", { data });
    }
    // 知识图谱要素讲解
    static toKnowledgeGraphExplainPage(params) {
        const { navigation, data } = params;
        navigation.navigate("KnowledgeGraphExplainPage", { data });
    }
    // 知识图谱首页
    static toKnowledgeGraphExplainHomepage(params) {
        const { navigation, data } = params;
        navigation.navigate("KnowledgeGraphExplainHomepage", { data });
    }
    // 知识图谱答题
    static toKnowledgeGraphExplainDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("KnowledgeGraphExplainDoExercise", { data });
    }
    // 智能学习计划首页
    static toMathAIGiveExerciseHome(params) {
        const { navigation, data } = params;
        navigation.navigate("MathAIGiveExerciseHome", { data });
    }
    // 智能学习计划 答题页面
    static toMathAIGiveExerciseDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathAIGiveExerciseDoExercise", { data });
    }


    // 编程题
    static toMathProgramExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramExercise", { data });
    }
    // 智能学习计划查看记录
    static toMathAIGiveExerciseLookExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathAIGiveExerciseLookExercise", { data });
    }

    // 数学编程首页
    static toMathProgramHomePage(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramHomePage", { data });
    }

    // 数学编程 编程思维
    static toMathProgramThinking(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramThinking", { data });
    }

    // 数学编程 编程思维答题
    static toMathProgramDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramDoExercise", { data });
    }

    // 数学编程 语法查询
    static toMathProgramSyntaxQuery(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramSyntaxQuery", { data });
    }
    // 数学编程 同步编程或拓展
    static toMathProgramSyncOrExpand(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramSyncOrExpand", { data });
    }
    // 数学编程 题目解析
    static toMathProgramResolving(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramResolving", { data });
    }
    // 数学编程 同步拓展编程学习
    static toMathProgramStudy(params) {
        const { navigation, data } = params;
        navigation.navigate("MathProgramStudy", { data });
    }

    // 精英计划 知识图谱 知识点展示
    static toMathKnowCharts(params) {
        const { navigation, data } = params;
        navigation.navigate("MathKnowCharts", { data });
    }

    // 精英计划 知识图谱 时间线展示
    static toMathKnowProgress(params) {
        const { navigation, data } = params;
        navigation.navigate("MathKnowProgress", { data });
    }
    // 精英计划 知识图谱 ai出题
    static toMathKnowChartsAiExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathKnowChartsAiExercise", { data });
    }
    static toMathPracticeDoExercise(params) {
        const { navigation, data } = params;
        navigation.navigate("MathPracticeDoExercise", { data });
    }
}
