/**
 * YYYY-MM-DD HH:MM:SS
 * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
 * 当天的返回时分，当年的返回月日，否则，返回年月日
 * @param {Object} date
 * @Time ： 2021/02/25 上午11:20
 * @Auth ： luo
 * @File ：formatData.js
 * @IDE ：vsCode
 */


 class FormatDate{
     constructor(fromDateString){
         this.fromDateString = fromDateString;
     };
     main() {
 
        if(this.fromDateString===undefined || this.fromDateString===''){
            return fromDateString;
        };
    
        //当前日期以及对应的年月日时分秒
       var nowDate = new Date();
       let nowDateYear = nowDate.getFullYear();// 年份，注意必须用getFullYear
       let nowDateMonth = nowDate.getMonth()+1;// 月份，注意是从0-11
       let nowDateDay = nowDate.getDate();// 日期
       let nowDateHours = nowDate.getHours();//24小时制
       let nowDateMinutes = nowDate.getMinutes(); // 分钟
       let nowDateSeconds =  nowDate.getSeconds(); // 秒
    
      
    
       //传过来的日期以及对应的年月日时分秒
       var formDateArray = this.fromDateString.split(" ")[0].split('-');
       var fromTimeArray = this.fromDateString.split(" ")[1].split(':');
       let fromDateYear = formDateArray[0];// 年份，注意必须用getFullYear
       let fromDateMonth = formDateArray[1];// 月份，注意是从0-11
       let fromDateDay = formDateArray[2];// 日期
       let fromDateHours =fromTimeArray[0];//24小时制
       let fromDateMinutes = fromTimeArray[1]; // 分钟
       let fromDateSeconds =  fromTimeArray[2]; // 秒
    
       //这部分是对05月01日 05时05分05秒这种进行格式化，判断的时候用这个
       let fromDateMonthTmp = fromDateMonth;
       if(fromDateMonth.substring(0,1) === '0'){
           fromDateMonthTmp = fromDateMonth.substring(1,2);
       };
       let fromDateDayTmp = fromDateDay;
       if(fromDateDay.substring(0,1) === '0'){
           fromDateDayTmp = fromDateDay.substring(1,2);
       };
       let fromDateHoursTmp = fromDateHours;
       if(fromDateHours.substring(0,1) === '0'){
           fromDateHoursTmp = fromDateHours.substring(1,2);
       };
       let fromDateMinutesTmp = fromDateMinutes;
       if(fromDateMinutes.substring(0,1) === '0'){
           fromDateMinutesTmp = fromDateMinutes.substring(1,2);
       };
       let fromDateSecondsTmp = fromDateSeconds;
       if(fromDateSeconds.substring(0,1) === '0'){
           fromDateSecondsTmp = fromDateSeconds.substring(1,2);
       };
       /******************* 一分钟之内 *******************/
       let nowDateYMDH = nowDateYear+'年'+nowDateMonth+'月'+nowDateDay+'日 '+nowDateHours;
       let fromDateYMDH = fromDateYear+'年'+fromDateMonthTmp+'月'+fromDateDayTmp+'日 '+fromDateHoursTmp;
       //需要比较的time, 1分钟以内视作“刚刚”
       if(nowDateYMDH === fromDateYMDH && nowDateMinutes-fromDateMinutesTmp<2){
           let remainMinuteSecond = (nowDateMinutes-fromDateMinutesTmp)*60;
           let remainSecond = nowDateSeconds-fromDateSecondsTmp;
           if (remainMinuteSecond + remainSecond < 60 * 1000) {
               return '刚刚';
           };
       };
    
       /*************** 今天：只显示时间，格式为 时分  **********/
    
       //需要比较的 日期yyyy年M月d
       let nowDateYMD = nowDateYear+'年'+nowDateMonth+'月'+nowDateDay+'日';
       let fromDateYMD = fromDateYear+'年'+fromDateMonthTmp+'月'+fromDateDayTmp+'日';
    
       //返回时分
       if (nowDateYMD === fromDateYMD){
           var getHour = nowDateHours * 3600 + nowDateMinutes * 60 - fromDateHours*3600 - fromDateMinutes*60;
           var getHour_ = parseInt(getHour/3600);
           if (getHour_ === 0){
                return parseInt(getHour/60).toString() + "分钟前";
           }else{
                return getHour_.toString() + "小时前";
           }
           
       };
    
       /*************** 昨天：不显示日期，显示“昨天”，格式为：“昨天” 时分； ***********/
       /*************** 前天：不显示日期，显示“前天”，格式为：“前天” 时分； ***********/
       let nowDateYM = nowDateYear+'年'+nowDateMonth+'月';
       let fromDateYM = fromDateYear+'年'+fromDateMonthTmp+'月';
       if (nowDateYM === fromDateYM ){
           if(nowDateDay-fromDateDayTmp===1){
               return '昨天 '+fromDateHours+':'+fromDateMinutes;
           }else if(nowDateDay-fromDateDayTmp===2){
               return '前天 '+fromDateHours+':'+fromDateMinutes;
           };
       };
    
       /******** 今年其他日期：不显示时间，仅显示月日，格式为：X月X日； ************/
       let nowDateY = nowDateYear+'年';
       let fromDateY = fromDateYear+'年';
       if (nowDateY === fromDateY){
           return fromDateMonth+'月'+fromDateDay+'日 '+fromDateHours+':'+fromDateMinutes;
       };
    
       /******* 其它年份：不显示时间，仅显示年月日，格式为：XXXX年XX月XX日； **********/
       return fromDateYear+'年'+fromDateMonth+'月'+fromDateDay+'日';
    };
 };
export { FormatDate}