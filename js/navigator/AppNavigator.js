import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PurchaseByCoinModal from "../util/pay/PurchaseByCoinModal";
import TtsTips from '../component/ttsTips'
import RewardCoin from "../component/rewardCoin";
import * as actionMath from "../action/math/bag";
// import PurchaseModal from "../util/pay/PurchaseModal";
import NavigationUtil from "./NavigationUtil";

import { connect } from "react-redux";
import * as actionCreators from "../action/purchase/index";
import * as actionUserInfo from "../action/userInfo/index";
import * as actionDeviceInfo from "../action/deviceInfo/index";
import * as actionTts from '../action/tts/index'
import { touristInfo } from "../util/tools";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import YuwenCanvas from "../page/yuwen/YuwenCanvas";
import YuwenHomePage from "../page/yuwen/YuwenHomepage";
import ChineseSchoolHome from "../page/yuwen/schoolBag/flow/home";
import ChineseBagExercise from "../page/yuwen/schoolBag/flow/doExercise";
import wordAccumulation from "../page/yuwen/schoolBag/wordAccumulation";
import HomePage from "../page/homePage";
import SpecialDiagnosis from "../page/yuwen/schoolBag/specialDiagnosis";
import ChooseText from "../page/yuwen/schoolBag/chooseText";
import SynchronizeDiagnosisEn from "../page/english/schoolBag/bagExercise";
import EnglishSchoolHome from "../page/english/schoolBag/EnglishSchoolHome";
import SelectUnitEn from "../page/english/schoolBag/words/home";
import EnglishChooseKnowledge from "../page/english/schoolBag/EnglishChooseKnowledgeNew";
import EnglishSchoolHomeUnit0 from "../page/english/schoolBag/EnglishSchoolHomeUnit0";
import ChooseWrongExercise from "../page/yuwen/schoolBag/wrongExercise/chooseWrongType";
import FlowTextbookList from "../page/yuwen/schoolBag/wrongExercise/flowWrongExercise/flowTexkbookList";
import FlowWrongExerciseList from "../page/yuwen/schoolBag/wrongExercise/flowWrongExercise/flowWrongExerciseList";
// import DoWrongExercise from "../page/yuwen/schoolBag/wrongExercise/flowWrongExercise/doWrongExercise";
import DoWrongExercise from "../page/yuwen/schoolBag/flow/doExercise/dowrong";

import SpeWrongExerciseErapList from "../page/yuwen/schoolBag/wrongExercise/speWrongExercise/speWrongExerciseWrapList";
import SpeWrongExerciseList from "../page/yuwen/schoolBag/wrongExercise/speWrongExercise/speWrongExerciseList";
import MathDeskHomepage from "../page/math/desk/Homepage";
import EnglishDeskHomepage from "../page/english/desk/Homepage";
import EnglishDeskCanvas from "../page/english/desk/EnglishCanvas";
import SpeWrongExerciseListSmart from "../page/yuwen/schoolBag/wrongExercise/speWrongExercise/speWrongExerciseListSmart";
import DoWrongExerciseSmart from "../page/yuwen/schoolBag/sentenceNew/doExercise/doWrongExercise";

import Reading from "../page/yuwen/schoolBag/newReading/home";

import SpeWrongExerciseListRead from "../page/yuwen/schoolBag/wrongExercise/speWrongExercise/speWrongExerciseListRead";
import DoWrongExerciseRead from "../page/yuwen/schoolBag/newReading/doExercise/dowrong";
import DoWrongExerciseDrag from "../page/yuwen/schoolBag/wrongExercise/flowWrongExercise/doWrongExerciseDrag";
import EnglishStatisticsHome from "../page/english/schoolBag/statistics/home";
import MatchDoExercise from "../page/english/schoolBag/Match/DoExercise";
import EnglishStatisticsItem from "../page/english/schoolBag/statistics/statisticsItem";
import ChineseStatisticsHome from "../page/yuwen/schoolBag/statistics/home";
import ChineseStatisticsItem from "../page/yuwen/schoolBag/statistics/statisticsItem";
import DoWriteEn from "../page/english/schoolBag/Write/DoWrite";
import ChineseDailyHome from "../page/yuwen/schoolBag/dailyPractice/dailyHome";
import ChineseDailyBagExercise from "../page/yuwen/schoolBag/dailyPractice/dailyBagExercise";
import ChineseDailySpeReadingStatics from "../page/yuwen/schoolBag/dailyPractice/speReadingStatics";
import ChineseDailySpeReadingExplain from "../page/yuwen/schoolBag/dailyPractice/speReadingExplain";
import ChineseDailySpeReadingExercise from "../page/yuwen/schoolBag/dailyPractice/speReadingExercise";
import MathSpecailImproveSchoolHome from "../page/math/bag/specialImprove/MathSpecailImproveSchoolHome";
import SpecailImprovePage from "../page/math/bag/specialImprove/SpecailImprovePage";
import SpeSentenceStatics from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceStatics";
import SpeSentenceTree from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceTree";
import SpeSentenceExplain from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceExplain";
import SpeSentenceExercise from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceExercise";
import ChineseDidExercise from "../page/yuwen/schoolBag/didExercise";
import MathStudyDiary from "../page/math/bag/pai/StudyDiary";
import SpeSentenceExerciseOne from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceExercise/indexTypeOne";
import SpeSentenceExerciseTwo from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceExercise/indexTypeTwo";
import MathStudyDiaryPlanB from "../page/math/bag/pai/StudyDiaryPlanB";
import SpeSentenceDailyExercise from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceDailyExercise";
import SpeSentenceExerciseRecord from "../page/yuwen/schoolBag/dailyPractice/speSentenceExerciseRecord";
import SpeSentenceExerciseSpeLevel from "../page/yuwen/schoolBag/dailyPractice/SpeSentenceExercise/indexSpeLevel";
import DoExerciseMath from "../page/math/bag/DoExercise";
import WordsHomepage from "../page/yuwen/schoolBag/words/index";
import WordsStudy from '../page/yuwen/schoolBag/words/study'
import WordsWordStudy from '../page/yuwen/schoolBag/words/wordStudy'
import WordsWriting from '../page/yuwen/schoolBag/words/writing'
import EnglishChooseType from "../page/english/schoolBag/englishChooseType";
import MixSelectUnit from "../page/english/schoolBag/Match/home";
import EnglishChooseKnowledgeSentence from "../page/english/schoolBag/EnglishChooseKnowledgeSentence";
import ChineseSpeReadingExerciseDaily from "../page/yuwen/schoolBag/dailyPractice/speReadingExerciseDaily";
import ChineseListenExercise from "../page/yuwen/schoolBag/listen/doExercise";
import ChineseListenExerciseRecord from "../page/yuwen/schoolBag/listen/doExerciseRecord";
import EnglishAbcsHome from "../page/english/schoolBag/ABCs/home";
import EnglishAbcsTree from "../page/english/schoolBag/ABCs/abcsTree";
import SpeSentenceSpeExerciseRecord from "../page/yuwen/schoolBag/dailyPractice/speSentenceExerciseRecord/speExerciseRecord";
import SpeSentenceDoWrongExerciseOne from "../page/yuwen/schoolBag/dailyPractice/speSentenceDowrongExercise/indexTypeOne";
import SpeSentenceDoWrongExerciseTwo from "../page/yuwen/schoolBag/dailyPractice/speSentenceDowrongExercise/indexTypeTwo";
import MathEasyCalculationHomePage from "../page/math/bag/EasyCalculation/HomePage";

import EnglishTestMeRecordList from "../page/english/schoolBag/record/testMeRecordList";
import EnglishTestMeRecordListDetail from "../page/english/schoolBag/record/testMeRecordDetail";
import MathExpandApplicationHomePage from "../page/math/bag/ExpandApplication/HomePage";
import MathExpandApplicationDoExercise from "../page/math/bag/ExpandApplication/DoExercise";
import MathExpandApplicationWrongExercise from "../page/math/bag/ExpandApplication/WrongExercise";
import MathExpandApplicationWrongDoWrongExercise from "../page/math/bag/ExpandApplication/DoWrongExercise";
import EasyCalculationStudyPage from "../page/math/bag/EasyCalculation/StudyPage";
import EasyCalculationDoExercise from "../page/math/bag/EasyCalculation/DoExercise";
import EasyCalculationWrongExercise from "../page/math/bag/EasyCalculation/WrongExercise";
import EasyCalculationDoWrongExercise from "../page/math/bag/EasyCalculation/DoWrongExercise";
import ChineseSentenceStatics from "../page/yuwen/schoolBag/statistics/speSentenceStatics";
import ChineseCompositionCheckType from "../page/yuwen/schoolBag/chineseComposition/compositionCheckType";
import CompositionWriteHome from "../page/yuwen/schoolBag/chineseComposition/compositionWriteHome";
import CompositionWriteCheckTitle from "../page/yuwen/schoolBag/chineseComposition/compositionWriteCheckTitle";
import CompositionWriteChecCenter from "../page/yuwen/schoolBag/chineseComposition/compositionWriteCheckCenter";
import CompositionWriteMindMap from "../page/yuwen/schoolBag/chineseComposition/compositionWriteMindMap";
import CompositionMindMapExplanation from "../page/yuwen/schoolBag/chineseComposition/compositionMindMapExplanation";
import CompositionMindMapDoexercise from "../page/yuwen/schoolBag/chineseComposition/compositionMindMapDoexercise";
import CompositionLookMindmap from "../page/yuwen/schoolBag/chineseComposition/compositionLookMindmap";
import CompositionModelArticle from "../page/yuwen/schoolBag/chineseComposition/compositionModelArticle";
import CompositionLookKnowDetail from "../page/yuwen/schoolBag/chineseComposition/compositionLookKnowDetail";

import EnSentencesHomePage from "../page/english/schoolBag/Sentences/HomePage";
import EnSentencesLearnTodayHomePage from "../page/english/schoolBag/Sentences/LearnToday/HomePage";
import EnSentencesLearnTodayDoExercise from "../page/english/schoolBag/Sentences/LearnToday/DoExercise";
import MathExpandApplicationStudyPage from "../page/math/bag/ExpandApplication/StudyPage";
import EnSentencesLearnTodayRecordList from "../page/english/schoolBag/Sentences/RecordList";
import EnSentencesLearnTodayRecordDoExercise from "../page/english/schoolBag/Sentences/LearnToday/RecordDoExercise";
import EnSentencesLearnWidthFriendsHomePage from "../page/english/schoolBag/Sentences/LearnWithFriends/HomePage";
import EnSentencesLearnWidthFriendsElement from "../page/english/schoolBag/Sentences/LearnWithFriends/Element";
import EnSentencesLearnWidthFriendsDoExercise from "../page/english/schoolBag/Sentences/LearnWithFriends/DoExercise";

import ThinkingTraining from "../page/math/bag/ThinkingTraining";
import ExecisePage from "../page/math/bag/ThinkingTraining/execriseTrainingPage";
import ABCSelectTitle from "../page/math/bag/ThinkingTraining/ABCSelectTitle";
import QtyRelationshipPage from "../page/math/bag/ThinkingTraining/qtyRelationshipPage";
import MindTrainingPage from "../page/math/bag/ThinkingTraining/mindTrainingPage";
import QuestionKindPage from "../page/math/bag/ThinkingTraining/questionKindPage";
import DoExercisePage from "../page/math/bag/ThinkingTraining/doExercisePage";
import ChineseDiaryHome from "../page/yuwen/schoolBag/chineseDiary/chineseDiaryHome";
import ChineseDiaryCompositionType from "../page/yuwen/schoolBag/chineseDiary/chineseDiaryCompositionType";
import ChineseDiaryCompositionList from "../page/yuwen/schoolBag/chineseDiary/chineseDiaryCompositionList";
import ChineseUploadArticle from "../page/yuwen/schoolBag/chineseDiary/chineseUploadArticle";
import ThinkingTrainingErrTaskPage from "../page/math/bag/ThinkingTraining/errTaskPage";
import ReDoExercisePage from "../page/math/bag/ThinkingTraining/reDoExercisePage";
import MathTTComprehensiveHomePage from "../page/math/bag/ThinkingTraining/Comprehensive/HomePage";
import MathTTComprehensiveDoExercise from "../page/math/bag/ThinkingTraining/Comprehensive/DoExercise";
import ChineseDiaryAllExerciseRecord from "../page/yuwen/schoolBag/chineseDiary/chineseAllExerciseRecord";
import ChineseCompositionStaticsHome from "../page/yuwen/schoolBag/statistics/chineseCompositionHome";
import ChineseCompositionStaticsItem from "../page/yuwen/schoolBag/statistics/chineseCompositionItem";

import EnglishTestMeCheckType from "../page/english/schoolBag/testMe";
import ChineseReadingHelp from "../page/yuwen/schoolBag/helpPage/ReadingHelp";

import Vector from "../page/math/bag/MathAndVector/Vector";
import VectorOperator from "../page/math/bag/MathAndVector/Vector/operator";
import VectorDoexercise from "../page/math/bag/MathAndVector/Vector/CurrentDoExercise";

import ChineseLookAllExerciseHome from "../page/yuwen/schoolBag/LookAllExercise/home";
import ChineseLookFlowExerciseHome from "../page/yuwen/schoolBag/LookAllExercise/flow/flowHome";
import ChineseLookAllFlowExerciseList from "../page/yuwen/schoolBag/LookAllExercise/flow/exerciseList";
import NavigationService from "./NavigationService";
import ChineseLookAllFlowExerciseDetail from "../page/yuwen/schoolBag/LookAllExercise/flow/exercise";
import ChineseLookAllReadingExerciseCheckType from "../page/yuwen/schoolBag/LookAllExercise/reading/readingCheckType";
import ChineseLookAllReadingExerciseCheckArticle from "../page/yuwen/schoolBag/LookAllExercise/reading/readignCheckArticle";
import ChineseLookAllReadingExerciseList from "../page/yuwen/schoolBag/LookAllExercise/reading/readingExerciseList";
import ChineseLookAllReadingExercise from "../page/yuwen/schoolBag/LookAllExercise/reading/readingExercise";
import ChineseLookAllSentenceExerciseCheckType from "../page/yuwen/schoolBag/LookAllExercise/sentence/checkype";
import ChineseLookAllSentenceExerciseList from "../page/yuwen/schoolBag/LookAllExercise/sentence/exerciseList";
import ChineseLookAllSentenceNormalExercise from "../page/yuwen/schoolBag/LookAllExercise/sentence/normalExecise";
import ChineseLookAllSentenceSpeExercise from "../page/yuwen/schoolBag/LookAllExercise/sentence/speExercise";

import ChinesePinyinHome from "../page/yuwen/schoolBag/pinyin/home";
import ChinesePinyinCheckType from "../page/yuwen/schoolBag/pinyin/checkType";
import ChinesePinyinStudy from "../page/yuwen/schoolBag/pinyin/study";
import ChinesePinyinLookAllWord from "../page/yuwen/schoolBag/pinyin/lookAllWord";
import ChinesePinyinLookWordDetail from "../page/yuwen/schoolBag/pinyin/lookWordDetail";
import ChinesePinyinLookTwoWordDetail from "../page/yuwen/schoolBag/pinyin/lookTTwoWordDetail";
import ChinesePinyinDoExercise from "../page/yuwen/schoolBag/pinyin/doExercise";
import ChinesePinyinWrite from "../page/yuwen/schoolBag/pinyin/write";
import ChinesePinyinExerciseRecord from "../page/yuwen/schoolBag/pinyin/exerciseRecord";
import ChinesePinyinDoWrongExercise from "../page/yuwen/schoolBag/pinyin/doExercise/doWrongExercise";
import ChineseUnitComposition from "../page/yuwen/schoolBag/chineseComposition/unitComposition";
import ChineseCompisitionModelHome from "../page/yuwen/schoolBag/chineseComposition/modelArticle/Articlehome";
import ChineseCompisitionModelArticle from "../page/yuwen/schoolBag/chineseComposition/modelArticle/articleDetail";
import ChineseCompisitionModelDoExercise from "../page/yuwen/schoolBag/chineseComposition/modelArticle/doExercise";
import ChineseCompisitionModelRecord from "../page/yuwen/schoolBag/chineseComposition/modelArticle/articleRecord";
import ChineseCompisitionModelExerciseList from "../page/yuwen/schoolBag/chineseComposition/modelArticle/exerciselist";
import ChineseCompisitionWrite from "../page/yuwen/schoolBag/chineseComposition/compositionWrite";

import { Platform, BackHandler } from "react-native";
import Protocol from "../util/iosLogin/protocol";
import SignIn from "../component/square/signIn";

import MtahAbilityDiagnosisHomePage from "../page/math/bag/AbilityDiagnosis/HomePage";
import MtahAbilityDiagnosisDoexercise from "../page/math/bag/AbilityDiagnosis/DoExercise";
import MtahAbilityDiagnosisHis from "../page/math/bag/AbilityDiagnosis/TopicHisList";

import MtahUnitDiagnosisHomePage from "../page/math/bag/UnitDiagnosis/HomePage";
import MtahUnitDiagnosisDoExercise from "../page/math/bag/UnitDiagnosis/DoExercise";
import SkillMtahUnitDiagnosisDoExercise from "../page/math/bag/UnitDiagnosis/SkillDoExercise";
import MathVectorComprehensiveDoExercise from "../page/math/bag/MathAndVector/Vector/ComprehensiveDoExercise";

import LookAllPinyinExerciseHome from "../page/yuwen/schoolBag/LookAllExercise/pinyin/list";
import LookAllPinyinExerciseList from "../page/yuwen/schoolBag/LookAllExercise/pinyin/exerciselist";
import MathDeskDoExercise from "../page/math/desk/DoExercise";
import MathDeskDoWrongExercise from "../page/math/desk/DoWrongExercise";
import StudentRoleHomePageAndroid from "../page/role/studentRoleHomePageAndroid";

// 数学新同步
import SyncDiagnosisHomepage from "../page/math/bag/SyncDiagnosis/HomePage";
import SyncDiagnosisDoExercise from "../page/math/bag/SyncDiagnosis/DoExercise";
// 数学新知识图谱
import KnowledgeGraphExplainPage from "../page/math/bag/KnowledgeGraph/ExplainPage";
import KnowledgeGraphExplainHomepage from "../page/math/bag/KnowledgeGraph/Homepage";
import KnowledgeGraphExplainDoExercise from "../page/math/bag/KnowledgeGraph/DoExercise";
// 智能学习计划
import MathAIGiveExerciseHome from "../page/math/bag/aiGiveExercise/home";
import MathAIGiveExerciseDoExercise from "../page/math/bag/aiGiveExercise/doExercise";
// 编程题
import MathProgramExercise from "../page/math/bag/KnowledgeGraph/program";
import MathAIGiveExerciseLookExercise from "../page/math/bag/aiGiveExercise/lookExercise";
import Welcome from "../page/welcome";
// 幼小衔接字学树首页
import ChildrenStudyCharacterHomePage from "../page/children/studyCharacter/HomePage";
import ChildrenStudyCharacter from "../page/children/studyCharacter/Study";
// abc
import EnglishAbcsDoexercise from "../page/english/schoolBag/ABCs/doExercise";
import EnglishAbcsExerciseRrecord from "../page/english/schoolBag/ABCs/record";
import EnglishAbcsExerciseDoWrong from "../page/english/schoolBag/ABCs/doExercise/doWrong";
import AbcsStudy from "../page/english/schoolBag/ABCs/study";

// 幼小衔接  数学知识图谱首页
import MyChildrenMathKnowHome from "../page/children/mathKnow/HomepageChildren";
import MyChildrenMathKnowExplain from "../page/children/mathKnow/homwExplain";
// 智能句
import NewSentence from "../page/yuwen/schoolBag/sentenceNew";
import NewSentenceFlowList from "../page/yuwen/schoolBag/sentenceNew/flowList";
import NewSentenceSpeList from "../page/yuwen/schoolBag/sentenceNew/spe";
import NewSentenceExerciseRercord from "../page/yuwen/schoolBag/sentenceNew/exerciseRecord";
import NewSentenceDoExercise from "../page/yuwen/schoolBag/sentenceNew/doExercise";
import NewSentenceStudyExercise from "../page/yuwen/schoolBag/sentenceNew/doExercise/study";
// 数学编程
import MathProgramHomePage from "../page/math/bag/Program/HomePage";
import MathProgramThinking from "../page/math/bag/Program/Thinking";
import MathProgramDoExercise from "../page/math/bag/Program/DoExercise";
import MathProgramSyntaxQuery from "../page/math/bag/Program/SyntaxQuery";
import MathProgramSyncOrExpand from "../page/math/bag/Program/SyncOrExpand";
import MathProgramResolving from "../page/math/bag/Program/Resolving";
import MathProgramStudy from "../page/math/bag/Program/Study";

// 智能学习计划购买页面
import AIPlanShoppingCartModal from "../util/pay/aiPlanShoppingCartModal";

// 阅读理解
import NewReadingFlowList from "../page/yuwen/schoolBag/newReading/flow";
import NewReadingExplain from "../page/yuwen/schoolBag/newReading/explain";
import NewReadingRecord from "../page/yuwen/schoolBag/newReading/record";
import NewReadingSpeExercise from "../page/yuwen/schoolBag/newReading/doExercise/speExercise";
import NewReadingDailyExercise from "../page/yuwen/schoolBag/newReading/doExercise/dailyExercise";
import NewReadingFlowExercise from "../page/yuwen/schoolBag/newReading/doExercise/flowExercise";

import EnglishDescRecord from "../page/english/desk/record";
import EnglishDescDoWrong from "../page/english/desk/doWrong";

import ChineseCompositionWriteRecord from "../page/yuwen/schoolBag/chineseComposition/compositionWriteRecord";
import ChineseCompositionWriteDoExercise from "../page/yuwen/schoolBag/chineseComposition/compositionWriteDoexercise";
import ChineseCompositionRecord from "../page/yuwen/schoolBag/chineseComposition/compositionRecord";

import EnExamineSentenceHomePage from "../page/english/schoolBag/examine/sentence";
import EnExamineSentenceTopicList from "../page/english/schoolBag/examine/sentence/topicList";

// test me
import EnglishTestMeHome from "../page/english/schoolBag/testMe/home";
import EnglishTextMeRecord from "../page/english/schoolBag/testMe/record";
import EnglishTextMeWrong from "../page/english/schoolBag/bagExercise/dowrong";

// 广场
import SquareHistory from "../page/square/lookHistory";
import SquareDetail from "../page/square/detail";
import SquareDoexercise from "../page/square/doExercise";
import SquareCheckWords from "../page/square/checkWords";
import SquareCreateTalk from "../page/square/createTalk";
import SquareCheckStoryType from "../page/square/checkStoryType";
import SquareHomeList from "../page/square/homeList";
import SquareCheckCreateType from "../page/square/checkCreateType";
import SquareCheckQuestion from "../page/square/checkQuestion";
import ExpensiveCalendar from "../page/square/expenseCalendar";

import PayCoin from "../util/pay/payCoin";

// 隐私
import Privacy from "../page/privacy";

// 数学知识图谱 图
import MathKnowCharts from "../page/math/bag/KnowledgeGraph/chart";
import MathKnowProgress from "../page/math/bag/KnowledgeGraph/knowProgress";
import MathKnowChartsAiExercise from "../page/math/bag/KnowledgeGraph/aiExercise";

// 数学错题集
import MathWrongExercise from "../page/math/bag/WrongExercise";
import MathSyncDiagnosisDoWrong from "../page/math/bag/SyncDiagnosis/DoWrongExercise";

import DailyTaskIndex from "../page/dailyTask";

// 数学练习
import MathPracticeHomePage from "../page/math/bag/practice/index";
import MathPracticeDoExercise from "../page/math/bag/practice/doExercise";

import ChineseReadingAiHelp from "../page/yuwen/schoolBag/newReading/aiTalk";
import ChineseSyncReadingAiHelp from "../page/yuwen/schoolBag/newReading/syncAiTalk";
import EnglishGrammarAiHelp from "../page/english/schoolBag/Sentences/LearnWithFriends/grammarAiTalk";
import ChineseCompAIHelp from "../page/yuwen/schoolBag/chineseComposition/compositionAiTalk";
import EnglishWordsAIHelp from "../page/english/schoolBag/words/wordsAiTalk";
import ChineseAbSenAIHelp from "../page/yuwen/schoolBag/sentenceNew/spe/abAiTalk";

import CenterHomePage from '../page/center'
import CenterInfo from '../page/center/info'
import CenterCoinDetails from '../page/center/coinDetails'

import ChineseQuickDoExercise from "../page/yuwen/schoolBag/quickDoExercise";
import WordTreeIndex from '../page/yuwen/schoolBag/wordTree'
import WordTreeUnitWord from '../page/yuwen/schoolBag/wordTree/unitWord'
import WordTreeCharactersDetails from '../page/yuwen/schoolBag/wordTree/charactersDetails'
import WordTreeWordDetails from '../page/yuwen/schoolBag/wordTree/wordDetails'
import WordTreeDoExercise from '../page/yuwen/schoolBag/wordTree/doExercise'

import CustomHomePage from "../page/custom/HomePage";
import EnglishWrongExercise from '../page/english/schoolBag/WrongExercise/index'
import MixDoWrongExercise from '../page/english/schoolBag/WrongExercise/mixMatch'
import EnglishAiGiveExercise from '../page/english/schoolBag/aiGiveExercise'
import StudyRoute from '../page/studyRoute'
import DoExerciseRecord from '../page/math/bag/UnitDiagnosis/DoExerciseRecord'
import YuwenAIGiveExerciseDoExercise from '../page/yuwen/schoolBag/sentenceNew/YuwenAIGiveExerciseDoExercise'



const CommonMainNavigator = {
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null,
        },
    },
    YuwenCanvas: {
        screen: YuwenCanvas,
        navigationOptions: {
            header: null,
        },
    },
    YuwenHomePage: {
        screen: YuwenHomePage,
        navigationOptions: {
            header: null,
        },
    },
    ChineseSchoolHome: {
        screen: ChineseSchoolHome,
        navigationOptions: {
            header: null,
        },
    },
    ChineseBagExercise: {
        screen: ChineseBagExercise,
        navigationOptions: {
            header: null,
        },
    },
    SpecialDiagnosis: {
        screen: SpecialDiagnosis,
        navigationOptions: {
            header: null,
        },
    },
    wordAccumulation: {
        screen: wordAccumulation,
        navigationOptions: {
            header: null,
        },
    },
    ChooseText: {
        screen: ChooseText,
        navigationOptions: {
            header: null,
        },
    },
    SynchronizeDiagnosisEn: {
        screen: SynchronizeDiagnosisEn,
        navigationOptions: {
            header: null,
        },
    },
    EnglishSchoolHome: {
        screen: EnglishSchoolHome,
        navigationOptions: {
            header: null,
        },
    },
    EnglishSchoolHomeUnit0: {
        screen: EnglishSchoolHomeUnit0,
        navigationOptions: {
            header: null,
        },
    },
    SelectUnitEn: {
        screen: SelectUnitEn,
        navigationOptions: {
            header: null,
        },
    },
    EnglishChooseKnowledge: {
        screen: EnglishChooseKnowledge,
        navigationOptions: {
            header: null,
        },
    },
    ChooseWrongExercise: {
        screen: ChooseWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    FlowTextbookList: {
        screen: FlowTextbookList,
        navigationOptions: {
            header: null,
        },
    },
    FlowWrongExerciseList: {
        screen: FlowWrongExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    DoWrongExercise: {
        screen: DoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    SpeWrongExerciseErapList: {
        screen: SpeWrongExerciseErapList,
        navigationOptions: {
            header: null,
        },
    },
    SpeWrongExerciseList: {
        screen: SpeWrongExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    MathDeskHomepage: {
        screen: MathDeskHomepage,
        navigationOptions: {
            header: null,
        },
    },
    EnglishDeskHomepage: {
        screen: EnglishDeskHomepage,
        navigationOptions: {
            header: null,
        },
    },
    EnglishDeskCanvas: {
        screen: EnglishDeskCanvas,
        navigationOptions: {
            header: null,
        },
    },

    SpeWrongExerciseListSmart: {
        screen: SpeWrongExerciseListSmart,
        navigationOptions: {
            header: null,
        },
    },
    DoWrongExerciseSmart: {
        screen: DoWrongExerciseSmart,
        navigationOptions: {
            header: null,
        },
    },
    Reading: {
        screen: Reading,
        navigationOptions: {
            header: null,
        },
    },

    SpeWrongExerciseListRead: {
        screen: SpeWrongExerciseListRead,
        navigationOptions: {
            header: null,
        },
    },
    DoWrongExerciseRead: {
        screen: DoWrongExerciseRead,
        navigationOptions: {
            header: null,
        },
    },
    DoWrongExerciseDrag: {
        screen: DoWrongExerciseDrag,
        navigationOptions: {
            header: null,
        },
    },
    MatchDoExercise: {
        screen: MatchDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    EnglishStatisticsHome: {
        screen: EnglishStatisticsHome,
        navigationOptions: {
            header: null,
        },
    },
    EnglishStatisticsItem: {
        screen: EnglishStatisticsItem,
        navigationOptions: {
            header: null,
        },
    },
    DoWriteEn: {
        screen: DoWriteEn,
        navigationOptions: {
            header: null,
        },
    },
    ChineseStatisticsHome: {
        screen: ChineseStatisticsHome,
        navigationOptions: {
            header: null,
        },
    },
    ChineseStatisticsItem: {
        screen: ChineseStatisticsItem,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDailyHome: {
        screen: ChineseDailyHome,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDailyBagExercise: {
        screen: ChineseDailyBagExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDailySpeReadingStatics: {
        screen: ChineseDailySpeReadingStatics,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDailySpeReadingExplain: {
        screen: ChineseDailySpeReadingExplain,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDailySpeReadingExercise: {
        screen: ChineseDailySpeReadingExercise,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceStatics: {
        screen: SpeSentenceStatics,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceTree: {
        screen: SpeSentenceTree,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExplain: {
        screen: SpeSentenceExplain,
        navigationOptions: {
            header: null,
        },
    },
    MathSpecailImproveSchoolHome: {
        screen: MathSpecailImproveSchoolHome,
        navigationOptions: {
            header: null,
        },
    },
    SpecailImprovePage: {
        screen: SpecailImprovePage,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExercise: {
        screen: SpeSentenceExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseDidExercise: {
        screen: ChineseDidExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathStudyDiary: {
        screen: MathStudyDiary,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExerciseOne: {
        screen: SpeSentenceExerciseOne,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExerciseTwo: {
        screen: SpeSentenceExerciseTwo,
        navigationOptions: {
            header: null,
        },
    },
    MathStudyDiaryPlanB: {
        screen: MathStudyDiaryPlanB,
        navigationOptions: {
            header: null,
        },
    },

    DoExerciseMath: {
        screen: DoExerciseMath,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceDailyExercise: {
        screen: SpeSentenceDailyExercise,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExerciseRecord: {
        screen: SpeSentenceExerciseRecord,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceExerciseSpeLevel: {
        screen: SpeSentenceExerciseSpeLevel,
        navigationOptions: {
            header: null,
        },
    },
    WordsHomepage: {
        screen: WordsHomepage,
        navigationOptions: {
            header: null,
        },
    },
    WordsStudy: {
        screen: WordsStudy,
        navigationOptions: {
            header: null,
        },
    },
    WordsWordStudy: {
        screen: WordsWordStudy,
        navigationOptions: {
            header: null,
        },
    },
    WordsWriting: {
        screen: WordsWriting,
        navigationOptions: {
            header: null,
        },
    },
    EnglishChooseType: {
        screen: EnglishChooseType,
        navigationOptions: {
            header: null,
        },
    },
    MixSelectUnit: {
        screen: MixSelectUnit,
        navigationOptions: {
            header: null,
        },
    },
    EnglishChooseKnowledgeSentence: {
        screen: EnglishChooseKnowledgeSentence,
        navigationOptions: {
            header: null,
        },
    },

    ChineseSpeReadingExerciseDaily: {
        screen: ChineseSpeReadingExerciseDaily,
        navigationOptions: {
            header: null,
        },
    },
    ChineseListenExercise: {
        screen: ChineseListenExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseListenExerciseRecord: {
        screen: ChineseListenExerciseRecord,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAbcsHome: {
        screen: EnglishAbcsHome,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAbcsTree: {
        screen: EnglishAbcsTree,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceSpeExerciseRecord: {
        screen: SpeSentenceSpeExerciseRecord,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceDoWrongExerciseOne: {
        screen: SpeSentenceDoWrongExerciseOne,
        navigationOptions: {
            header: null,
        },
    },
    SpeSentenceDoWrongExerciseTwo: {
        screen: SpeSentenceDoWrongExerciseTwo,
        navigationOptions: {
            header: null,
        },
    },
    MathEasyCalculationHomePage: {
        screen: MathEasyCalculationHomePage,
        navigationOptions: {
            header: null,
        },
    },
    EnglishTestMeRecordList: {
        screen: EnglishTestMeRecordList,
        navigationOptions: {
            header: null,
        },
    },
    EnglishTestMeRecordListDetail: {
        screen: EnglishTestMeRecordListDetail,
        navigationOptions: {
            header: null,
        },
    },
    MathExpandApplicationHomePage: {
        screen: MathExpandApplicationHomePage,
        navigationOptions: {
            header: null,
        },
    },
    ChineseSentenceStatics: {
        screen: ChineseSentenceStatics,
        navigationOptions: {
            header: null,
        },
    },
    EasyCalculationStudyPage: {
        screen: EasyCalculationStudyPage,
        navigationOptions: {
            header: null,
        },
    },
    EasyCalculationDoExercise: {
        screen: EasyCalculationDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    EasyCalculationWrongExercise: {
        screen: EasyCalculationWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    EasyCalculationDoWrongExercise: {
        screen: EasyCalculationDoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseCompositionCheckType: {
        screen: ChineseCompositionCheckType,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesHomePage: {
        screen: EnSentencesHomePage,
        navigationOptions: {
            header: null,
        },
    },
    ChineseCompAIHelp: {
        screen: ChineseCompAIHelp,
        navigationOptions: {
            header: null,
        },
    },
    ChineseAbSenAIHelp: {
        screen: ChineseAbSenAIHelp,
        navigationOptions: {
            header: null,
        },
    },
    EnglishWordsAIHelp: {
        screen: EnglishWordsAIHelp,
        navigationOptions: {
            header: null,
        },
    },
    CompositionWriteHome: {
        screen: CompositionWriteHome,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnTodayHomePage: {
        screen: EnSentencesLearnTodayHomePage,
        navigationOptions: {
            header: null,
        },
    },
    CompositionWriteCheckTitle: {
        screen: CompositionWriteCheckTitle,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnTodayDoExercise: {
        screen: EnSentencesLearnTodayDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    CompositionWriteChecCenter: {
        screen: CompositionWriteChecCenter,
        navigationOptions: {
            header: null,
        },
    },
    MathExpandApplicationStudyPage: {
        screen: MathExpandApplicationStudyPage,
        navigationOptions: {
            header: null,
        },
    },
    CompositionWriteMindMap: {
        screen: CompositionWriteMindMap,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnTodayRecordList: {
        screen: EnSentencesLearnTodayRecordList,
        navigationOptions: {
            header: null,
        },
    },
    CompositionMindMapExplanation: {
        screen: CompositionMindMapExplanation,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnTodayRecordDoExercise: {
        screen: EnSentencesLearnTodayRecordDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    CompositionMindMapDoexercise: {
        screen: CompositionMindMapDoexercise,
        navigationOptions: {
            header: null,
        },
    },
    CompositionLookMindmap: {
        screen: CompositionLookMindmap,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnWidthFriendsHomePage: {
        screen: EnSentencesLearnWidthFriendsHomePage,
        navigationOptions: {
            header: null,
        },
    },
    CompositionModelArticle: {
        screen: CompositionModelArticle,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnWidthFriendsElement: {
        screen: EnSentencesLearnWidthFriendsElement,
        navigationOptions: {
            header: null,
        },
    },
    CompositionLookKnowDetail: {
        screen: CompositionLookKnowDetail,
        navigationOptions: {
            header: null,
        },
    },
    EnSentencesLearnWidthFriendsDoExercise: {
        screen: EnSentencesLearnWidthFriendsDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathThinkingTrainingPage: {
        screen: ThinkingTraining,
        navigationOptions: {
            header: null,
        },
    },
    MathThinkingTrainingExercisePage: {
        screen: ExecisePage,
        navigationOptions: {
            header: null,
        },
    },
    // 测试点选题页面
    MathSelectTitlePage: {
        screen: ABCSelectTitle,
        navigationOptions: {
            header: null,
        },
    },
    // 题目说明页面
    MathQuestionKindPage: {
        screen: QuestionKindPage,
        navigationOptions: {
            header: null,
        },
    },
    // 数量关系训练主页
    MathThinkingQtyRelationshipPage: {
        screen: QtyRelationshipPage,
        navigationOptions: {
            header: null,
        },
    },
    // 思路训练主页
    MathThinkingMindTrainingPage: {
        screen: MindTrainingPage,
        navigationOptions: {
            header: null,
        },
    },
    // 思维训练，做练习主页
    MathThinkingDoExercisePage: {
        screen: DoExercisePage,
        navigationOptions: {
            header: null,
        },
    },
    MathExpandApplicationDoExercise: {
        screen: MathExpandApplicationDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文学习日记
    ChineseDiaryHome: {
        screen: ChineseDiaryHome,
        navigationOptions: {
            header: null,
        },
    },
    MathExpandApplicationWrongExercise: {
        screen: MathExpandApplicationWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文学习日记
    ChineseDiaryCompositionType: {
        screen: ChineseDiaryCompositionType,
        navigationOptions: {
            header: null,
        },
    },
    MathExpandApplicationWrongDoWrongExercise: {
        screen: MathExpandApplicationWrongDoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文学习日记
    ChineseDiaryCompositionList: {
        screen: ChineseDiaryCompositionList,
        navigationOptions: {
            header: null,
        },
    },
    // 语文学习日记 上传作文
    ChineseUploadArticle: {
        screen: ChineseUploadArticle,
        navigationOptions: {
            header: null,
        },
    },
    // 数学思维训练错题集
    MathThinkingTrainingErrTaskPage: {
        screen: ThinkingTrainingErrTaskPage,
        navigationOptions: {
            header: null,
        },
    },
    // 数学思维训练重新做题页面
    MathThinkingTrainingReDoExercisePage: {
        screen: ReDoExercisePage,
        navigationOptions: {
            header: null,
        },
    },
    // 数学思维训练综合练习
    MathTTComprehensiveHomePage: {
        screen: MathTTComprehensiveHomePage,
        navigationOptions: {
            header: null,
        },
    },
    // 语文学习日记答题记录列表
    ChineseDiaryAllExerciseRecord: {
        screen: ChineseDiaryAllExerciseRecord,
        navigationOptions: {
            header: null,
        },
    },
    // 数学思维训练综合练习做题
    MathTTComprehensiveDoExercise: {
        screen: MathTTComprehensiveDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文习作统计信息
    ChineseCompositionStaticsHome: {
        screen: ChineseCompositionStaticsHome,
        navigationOptions: {
            header: null,
        },
    },
    // 语文习作统计信息 详情
    ChineseCompositionStaticsItem: {
        screen: ChineseCompositionStaticsItem,
        navigationOptions: {
            header: null,
        },
    },
    // 英语test Me选择模块
    EnglishTestMeCheckType: {
        screen: EnglishTestMeCheckType,
        navigationOptions: {
            header: null,
        },
    },
    // 语文阅读理解帮助页面
    ChineseReadingHelp: {
        screen: ChineseReadingHelp,
        navigationOptions: {
            header: null,
        },
    },

    // 数学图与数，图界面
    MathVector: {
        screen: Vector,
        navigationOptions: {
            header: null,
        },
    },
    // 数学图与数，答题界面
    MathVectorOperator: {
        screen: VectorOperator,
        navigationOptions: {
            header: null,
        },
    },
    VectorDoexercise: {
        screen: VectorDoexercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题
    ChineseLookAllExerciseHome: {
        screen: ChineseLookAllExerciseHome,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 同步选择课文
    ChineseLookFlowExerciseHome: {
        screen: ChineseLookFlowExerciseHome,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 同步查看所有习题
    ChineseLookAllFlowExerciseList: {
        screen: ChineseLookAllFlowExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 同步查看所有习题
    ChineseLookAllFlowExerciseDetail: {
        screen: ChineseLookAllFlowExerciseDetail,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 阅读理解获取类型
    ChineseLookAllReadingExerciseCheckType: {
        screen: ChineseLookAllReadingExerciseCheckType,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 阅读理解获取文章
    ChineseLookAllReadingExerciseCheckArticle: {
        screen: ChineseLookAllReadingExerciseCheckArticle,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 阅读理解获取习题列表
    ChineseLookAllReadingExerciseList: {
        screen: ChineseLookAllReadingExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 阅读理解获取习题
    ChineseLookAllReadingExercise: {
        screen: ChineseLookAllReadingExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 智能句 选择类型
    ChineseLookAllSentenceExerciseCheckType: {
        screen: ChineseLookAllSentenceExerciseCheckType,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 智能句 习题列表
    ChineseLookAllSentenceExerciseList: {
        screen: ChineseLookAllSentenceExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 智能句 一般习题
    ChineseLookAllSentenceNormalExercise: {
        screen: ChineseLookAllSentenceNormalExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有习题 智能句 文化积累，句型训练习题
    ChineseLookAllSentenceSpeExercise: {
        screen: ChineseLookAllSentenceSpeExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文 拼音 首页
    ChinesePinyinHome: {
        screen: ChinesePinyinHome,
        navigationOptions: {
            header: null,
        },
    },
    // 语文 拼音 选择操作
    ChinesePinyinCheckType: {
        screen: ChinesePinyinCheckType,
        navigationOptions: {
            header: null,
        },
    },
    // 语文 拼音 学一学
    ChinesePinyinStudy: {
        screen: ChinesePinyinStudy,
        navigationOptions: {
            header: null,
        },
    },
    // 语文 拼音 拼一拼
    ChinesePinyinLookAllWord: {
        screen: ChinesePinyinLookAllWord,
        navigationOptions: {
            header: null,
        },
    },
    // 拼音查看字的详情
    ChinesePinyinLookWordDetail: {
        screen: ChinesePinyinLookWordDetail,
        navigationOptions: {
            header: null,
        },
    },
    // 拼音查看 词语的详情
    ChinesePinyinLookTwoWordDetail: {
        screen: ChinesePinyinLookTwoWordDetail,
        navigationOptions: {
            header: null,
        },
    },
    // 拼音查看 做题
    ChinesePinyinDoExercise: {
        screen: ChinesePinyinDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 拼音查看 写一些
    ChinesePinyinWrite: {
        screen: ChinesePinyinWrite,
        navigationOptions: {
            header: null,
        },
    },
    // 答题记录
    ChinesePinyinExerciseRecord: {
        screen: ChinesePinyinExerciseRecord,
        navigationOptions: {
            header: null,
        },
    },
    // 拼音 在做一次
    ChinesePinyinDoWrongExercise: {
        screen: ChinesePinyinDoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 单元习作
    ChineseUnitComposition: {
        screen: ChineseUnitComposition,
        navigationOptions: {
            header: null,
        },
    },
    // 范文练手  选择范文
    ChineseCompisitionModelHome: {
        screen: ChineseCompisitionModelHome,
        navigationOptions: {
            header: null,
        },
    },
    // 范文练手  范文做题
    ChineseCompisitionModelArticle: {
        screen: ChineseCompisitionModelArticle,
        navigationOptions: {
            header: null,
        },
    },
    // 范文练手  思维导图做题
    ChineseCompisitionModelDoExercise: {
        screen: ChineseCompisitionModelDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 展示协议
    ProtocolPage: {
        screen: Protocol,
        navigationOptions: {
            header: null,
        },
    },
    // 范文练手  范文答题记录
    ChineseCompisitionModelRecord: {
        screen: ChineseCompisitionModelRecord,
        navigationOptions: {
            header: null,
        },
    },
    // 范文练手  思维导图 习题列表
    ChineseCompisitionModelExerciseList: {
        screen: ChineseCompisitionModelExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    // 习作  写法点拨详情
    ChineseCompisitionWrite: {
        screen: ChineseCompisitionWrite,
        navigationOptions: {
            header: null,
        },
    },
    // 能力诊断主页
    MtahAbilityDiagnosisHomePage: {
        screen: MtahAbilityDiagnosisHomePage,
        navigationOptions: {
            header: null,
        },
    },
    // 能力诊断做题
    MtahAbilityDiagnosisDoexercise: {
        screen: MtahAbilityDiagnosisDoexercise,
        navigationOptions: {
            header: null,
        },
    },
    // 能力诊断做题记录
    MtahAbilityDiagnosisHis: {
        screen: MtahAbilityDiagnosisHis,
        navigationOptions: {
            header: null,
        },
    },
    // 单元诊断主页
    MtahUnitDiagnosisHomePage: {
        screen: MtahUnitDiagnosisHomePage,
        navigationOptions: {
            header: null,
        },
    },
    // 单元诊断做题
    MtahUnitDiagnosisDoExercise: {
        screen: MtahUnitDiagnosisDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 单元诊断做题--能力法
    SkillMtahUnitDiagnosisDoExercise: {
        screen: SkillMtahUnitDiagnosisDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 数学图综合测试
    MathVectorComprehensiveDoExercise: {
        screen: MathVectorComprehensiveDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有拼音知识点
    LookAllPinyinExerciseHome: {
        screen: LookAllPinyinExerciseHome,
        navigationOptions: {
            header: null,
        },
    },
    // 语文查看所有拼音知识点
    LookAllPinyinExerciseList: {
        screen: LookAllPinyinExerciseList,
        navigationOptions: {
            header: null,
        },
    },
    // 数学课桌做题
    MathDeskDoExercise: {
        screen: MathDeskDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 数学课桌在练一次
    MathDeskDoWrongExercise: {
        screen: MathDeskDoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    SyncDiagnosisHomepage: {
        screen: SyncDiagnosisHomepage,
        navigationOptions: {
            header: null,
        },
    },
    SyncDiagnosisDoExercise: {
        screen: SyncDiagnosisDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 数学知识图谱要素讲解
    KnowledgeGraphExplainPage: {
        screen: KnowledgeGraphExplainPage,
        navigationOptions: {
            header: null,
        },
    },
    // 数学知识图谱主页
    KnowledgeGraphExplainHomepage: {
        screen: KnowledgeGraphExplainHomepage,
        navigationOptions: {
            header: null,
        },
    },
    // 数学知识图谱答题
    KnowledgeGraphExplainDoExercise: {
        screen: KnowledgeGraphExplainDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 智能学习计划答题
    MathAIGiveExerciseDoExercise: {
        screen: MathAIGiveExerciseDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 中文句法答题
    YuwenAIGiveExerciseDoExercise: {
        screen: YuwenAIGiveExerciseDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    // 智能学习计划首页
    MathAIGiveExerciseHome: {
        screen: MathAIGiveExerciseHome,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramExercise: {
        screen: MathProgramExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathAIGiveExerciseLookExercise: {
        screen: MathAIGiveExerciseLookExercise,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAbcsDoexercise: {
        screen: EnglishAbcsDoexercise,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAbcsExerciseRrecord: {
        screen: EnglishAbcsExerciseRrecord,
        navigationOptions: {
            header: null,
        },
    },
    ChildrenStudyCharacterHomePage: {
        screen: ChildrenStudyCharacterHomePage,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAbcsExerciseDoWrong: {
        screen: EnglishAbcsExerciseDoWrong,
        navigationOptions: {
            header: null,
        },
    },
    ChildrenStudyCharacter: {
        screen: ChildrenStudyCharacter,
        navigationOptions: {
            header: null,
        },
    },
    MyChildrenMathKnowHome: {
        screen: MyChildrenMathKnowHome,
        navigationOptions: {
            header: null,
        },
    },
    MyChildrenMathKnowExplain: {
        screen: MyChildrenMathKnowExplain,
        navigationOptions: {
            header: null,
        },
    },
    NewSentence: {
        screen: NewSentence,
        navigationOptions: {
            header: null,
        },
    },
    NewSentenceFlowList: {
        screen: NewSentenceFlowList,
        navigationOptions: {
            header: null,
        },
    },
    NewSentenceSpeList: {
        screen: NewSentenceSpeList,
        navigationOptions: {
            header: null,
        },
    },
    NewSentenceExerciseRercord: {
        screen: NewSentenceExerciseRercord,
        navigationOptions: {
            header: null,
        },
    },
    NewSentenceDoExercise: {
        screen: NewSentenceDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramHomePage: {
        screen: MathProgramHomePage,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingFlowList: {
        screen: NewReadingFlowList,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramThinking: {
        screen: MathProgramThinking,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingExplain: {
        screen: NewReadingExplain,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramDoExercise: {
        screen: MathProgramDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingRecord: {
        screen: NewReadingRecord,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramSyntaxQuery: {
        screen: MathProgramSyntaxQuery,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingSpeExercise: {
        screen: NewReadingSpeExercise,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingDailyExercise: {
        screen: NewReadingDailyExercise,
        navigationOptions: {
            header: null,
        },
    },
    NewReadingFlowExercise: {
        screen: NewReadingFlowExercise,
        navigationOptions: {
            header: null,
        },
    },
    EnglishDescRecord: {
        screen: EnglishDescRecord,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramSyncOrExpand: {
        screen: MathProgramSyncOrExpand,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramResolving: {
        screen: MathProgramResolving,
        navigationOptions: {
            header: null,
        },
    },
    MathProgramStudy: {
        screen: MathProgramStudy,
        navigationOptions: {
            header: null,
        },
    },
    EnglishDescDoWrong: {
        screen: EnglishDescDoWrong,
        navigationOptions: {
            header: null,
        },
    },
    ChineseCompositionWriteRecord: {
        screen: ChineseCompositionWriteRecord,
        navigationOptions: {
            header: null,
        },
    },
    ChineseCompositionWriteDoExercise: {
        screen: ChineseCompositionWriteDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseCompositionRecord: {
        screen: ChineseCompositionRecord,
        navigationOptions: {
            header: null,
        },
    },
    EnExamineSentenceHomePage: {
        screen: EnExamineSentenceHomePage,
        navigationOptions: {
            header: null,
        },
    },
    EnExamineSentenceTopicList: {
        screen: EnExamineSentenceTopicList,
        navigationOptions: {
            header: null,
        },
    },
    EnglishTestMeHome: {
        screen: EnglishTestMeHome,
        navigationOptions: {
            header: null,
        },
    },
    EnglishTextMeRecord: {
        screen: EnglishTextMeRecord,
        navigationOptions: {
            header: null,
        },
    },
    EnglishTextMeWrong: {
        screen: EnglishTextMeWrong,
        navigationOptions: {
            header: null,
        },
    },
    NewSentenceStudyExercise: {
        screen: NewSentenceStudyExercise,
        navigationOptions: {
            header: null,
        },
    },
    SquareHistory: {
        screen: SquareHistory,
        navigationOptions: {
            header: null,
        },
    },
    SquareDetail: {
        screen: SquareDetail,
        navigationOptions: {
            header: null,
        },
    },
    SquareDoexercise: {
        screen: SquareDoexercise,
        navigationOptions: {
            header: null,
        },
    },
    SquareCheckWords: {
        screen: SquareCheckWords,
        navigationOptions: {
            header: null,
        },
    },
    SquareCreateTalk: {
        screen: SquareCreateTalk,
        navigationOptions: {
            header: null,
        },
    },
    SquareCheckStoryType: {
        screen: SquareCheckStoryType,
        navigationOptions: {
            header: null,
        },
    },
    SquareHomeList: {
        screen: SquareHomeList,
        navigationOptions: {
            header: null,
        },
    },
    SquareCheckCreateType: {
        screen: SquareCheckCreateType,
        navigationOptions: {
            header: null,
        },
    },
    SquareCheckQuestion: {
        screen: SquareCheckQuestion,
        navigationOptions: {
            header: null,
        },
    },
    ExpensiveCalendar: {
        screen: ExpensiveCalendar,
        navigationOptions: {
            header: null,
        },
    },
    Privacy: {
        screen: Privacy,
        navigationOptions: {
            header: null,
        },
    },
    MathKnowCharts: {
        screen: MathKnowCharts,
        navigationOptions: {
            header: null,
        },
    },
    MathKnowProgress: {
        screen: MathKnowProgress,
        navigationOptions: {
            header: null,
        },
    },
    MathKnowChartsAiExercise: {
        screen: MathKnowChartsAiExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathWrongExercise: {
        screen: MathWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    MathSyncDiagnosisDoWrong: {
        screen: MathSyncDiagnosisDoWrong,
        navigationOptions: {
            header: null,
        },
    },
    MathPracticeHomePage: {
        screen: MathPracticeHomePage,
        navigationOptions: {
            header: null,
        },
    },
    MathPracticeDoExercise: {
        screen: MathPracticeDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    ChineseReadingAiHelp: {
        screen: ChineseReadingAiHelp,
        navigationOptions: {
            header: null,
        },
    },
    ChineseSyncReadingAiHelp: {
        screen: ChineseSyncReadingAiHelp,
        navigationOptions: {
            header: null,
        },
    },
    EnglishGrammarAiHelp: {
        screen: EnglishGrammarAiHelp,
        navigationOptions: {
            header: null,
        },
    },
    DailyTaskIndex: {
        screen: DailyTaskIndex,
        navigationOptions: {
            header: null,
        },
    },
    CenterHomePage: {
        screen: CenterHomePage,
        navigationOptions: {
            header: null,
        },
    },
    ChineseQuickDoExercise: {
        screen: ChineseQuickDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    CenterInfo: {
        screen: CenterInfo,
        navigationOptions: {
            header: null,
        },
    },
    CenterCoinDetails: {
        screen: CenterCoinDetails,
        navigationOptions: {
            header: null,
        },
    },
    AbcsStudy: {
        screen: AbcsStudy,
        navigationOptions: {
            header: null,
        },
    },
    WordTreeIndex: {
        screen: WordTreeIndex,
        navigationOptions: {
            header: null,
        },
    },
    WordTreeUnitWord: {
        screen: WordTreeUnitWord,
        navigationOptions: {
            header: null,
        },
    },
    WordTreeCharactersDetails: {
        screen: WordTreeCharactersDetails,
        navigationOptions: {
            header: null,
        },
    },
    WordTreeWordDetails: {
        screen: WordTreeWordDetails,
        navigationOptions: {
            header: null,
        },
    },
    WordTreeDoExercise: {
        screen: WordTreeDoExercise,
        navigationOptions: {
            header: null,
        },
    },
    CustomHomePage: {
        screen: CustomHomePage,
        navigationOptions: {
            header: null,
        },
    },
    EnglishWrongExercise: {
        screen: EnglishWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    MixDoWrongExercise: {
        screen: MixDoWrongExercise,
        navigationOptions: {
            header: null,
        },
    },
    EnglishAiGiveExercise: {
        screen: EnglishAiGiveExercise,
        navigationOptions: {
            header: null,
        },
    },
    StudyRoute: {
        screen: StudyRoute,
        navigationOptions: {
            header: null,
        },
    },
    DoExerciseRecord: {
        screen: DoExerciseRecord,
        navigationOptions: {
            header: null,
        },
    }


};

const isIOS = () => {
    return Platform.OS === "ios";
};

const AndroidMainNavigator = createStackNavigator(
    Object.assign(CommonMainNavigator, {
        StudentRoleHomePageAndroid: {
            screen: StudentRoleHomePageAndroid,
            navigationOptions: {
                header: null,
            },
        },
    })
);
const WelcomeNavigaor = createStackNavigator({
    Welcome: {
        screen: Welcome,
        navigationOptions: {
            header: null,
        },
    },
});
const IOSMainNavigator = createStackNavigator(
    Object.assign(CommonMainNavigator, {
        StudentRoleHomePageAndroid: {
            screen: StudentRoleHomePageAndroid,
            navigationOptions: {
                header: null,
            },
        },
    })
);

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            Init: WelcomeNavigaor,
            Main: isIOS() ? IOSMainNavigator : AndroidMainNavigator,
        },
        {
            navigationOptions: {
                header: null,
            },
        }
    )
);

export class App extends React.Component {
    constructor(props) {
        super();
        this.backBtnListener = undefined
    }
    componentDidMount() {
        this.props.setHasNotch(); //存储设备是否有刘海屏
        this.props.setTtsStatus() //存储Tts状态信息
        AsyncStorage.getItem("token").then((resToken) => {
            AsyncStorage.getItem("userInfo")
                .then((resInfo) => {
                    resInfo = JSON.parse(resInfo);
                    console.log("本地Token:::::::", resToken, resInfo);
                    let token = "";
                    let info = {};
                    const bookMap = {
                        '10': '人教版',
                        '11': '北师版',
                        '12': '苏教版',
                        '13': '西师版',
                        '14': '北师版2024',
                    }
                    if (
                        !resInfo ||
                        !resToken ||
                        (resToken && resInfo && !Object.keys(resInfo).length) ||
                        resInfo.name === "游客"
                    ) {
                        // 游客，写死游客信息  没有token， 有token没有用户信息的
                        // token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTU1ODcxNDMsIm5hbWUiOiJcdTZlMzhcdTViYTIiLCJjbGFzc19jb2RlIjoxOCwic2V4IjoiMCIsImlkIjo3NTAsImFjY291bnRfaWQiOjkwNSwiZ3JhZGVfY29kZSI6IiIsInRlcm1fY29kZSI6IiIsInJvbGUiOiJzdHVkZW50In0.fa5ibyHQ2TddoWD-t264RtFo-vbhEUZolw8H3-ShwgE'
                        info = touristInfo;
                        info.textBook = '11';
                        info.textbookname = '北师版';
                        this.props.setUserInfoNow(info);
                        this.props.setMathTextBook('11') //默认北师

                    } else {
                        // 账号手机号登录过，没有手动退出
                        token = resToken;
                        AsyncStorage.getItem("userInfo")
                            .then((resInfo) => {
                                info = JSON.parse(resInfo);
                                info.isGrade = true; //没退出登录直接进，重置为小学阶段
                                AsyncStorage.getItem(`${info.name}_textbook`).then((value) => {
                                    if (value) {
                                        info.textBook = value;
                                        info.textbookname = bookMap[value];
                                        this.props.setMathTextBook(value)
                                    } else {
                                        info.textBook = '11';
                                        info.textbookname = '北师版';
                                        this.props.setMathTextBook('11') //默认北师
                                    }
                                    console.log('oooooo', info)
                                    this.props.setUserInfoNow(info);
                                });
                            })
                            .catch((err) => { });
                    }
                    AsyncStorage.setItem("token", token);
                    this.props.setToken(token);
                })
                .catch((err) => { });
        });
    }
    render() {
        const userInfo = this.props.userInfo.toJS();
        return (
            <>
                <AppContainer
                    ref={(navigatorRef) => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
                {/* {isIOS() || !userInfo.isGrade ? ( //ios端，或者是幼小 */}
                <PurchaseByCoinModal
                    visible={this.props.visible}
                    onClose={() => {
                        this.props.setVisible(false);
                    }}
                />
                {/* ) : (
          <AIPlanShoppingCartModal
            visible={this.props.visible}
            onClose={() => {
              const { modules } = this.props;
              modules.forEach((i) => {
                i.module.forEach((ii) => {
                  ii.check = 0;
                });
              });
              this.props.setModules(modules); //初始化模块选择
              this.props.setVisible(false);
            }}
          />
        )} */}
                <PayCoin visible={this.props.payCoinVisible}></PayCoin>
                <RewardCoin></RewardCoin>
                <TtsTips visible={this.props.showTips} close={() => {
                    this.props.setShowTips(false)
                }}></TtsTips>
                <SignIn />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        visible: state.getIn(["purchase", "visible"]),
        payCoinVisible: state.getIn(["purchase", "payCoinVisible"]),
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        modules: state.getIn(["purchase", "modules"]),
        showTips: state.getIn(["tts", "showTips"]),
    };
};

const mapDispatchToProps = (dispatch) => {
    // 存数据
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(actionCreators.setModules(data));
        },
        setToken(data) {
            dispatch(actionUserInfo.setToken(data));
        },
        setUserInfoNow(data) {
            dispatch(actionUserInfo.setUserInfoNow(data));
        },
        setHasNotch() {
            dispatch(actionDeviceInfo.setHasNotch());
        },
        setTtsStatus() {
            dispatch(actionTts.setTtsStatus());
        },
        setShowTips() {
            dispatch(actionTts.setShowTips());
        },
        setMathTextBook(data) {
            dispatch(actionMath.setMathTextBook(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
