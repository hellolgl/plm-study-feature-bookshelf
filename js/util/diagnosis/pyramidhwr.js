// plm-handwriting recognition

// import {fs} from 'fs'
// let fs = require('fs')
import {letter_modle_mat,multi_letter_single_mat} from './pyramidLetterChoice'
import {math_char_judge_num,
        math_strokes_code,
        math_char_combine} 
        // from './MathBaseData'
        from './MathBaseDataSabrina'
import * as mathchndata from './mathunits'
import {chn_base_data, chn_fuzzy_combine_data} from './ChnBaseData'
// import {Buffer} from "buffer"
// global.Buffer = global.Buffer || require('buffer').Buffer
// import XLSX from 'xlsx'
// import xlsx from 'node-xlsx'
// import { all } from 'lodash/fp';
// import { cos } from 'react-native-reanimated';
import {eng_stroke_code25_data,
        standard_letter_mat,
        EngOneMat,
        EngRecognizeMat,
        eng_fuzzy_strokes_mat,
        EngBaseCombine} from './EngBaseData'
import { cos } from 'react-native-reanimated'
// import { sin } from 'react-native/Libraries/Animated/src/Easing';
// import { writeFile, readFile, DocumentDirectoryPath, RNFS } from 'react-native-fs';
// import RNFS from 'react-native-fs';
// import {Alert} from 'react-native';
// const DDP = DocumentDirectoryPath + "/";
const input = res => res;
const output = str => str;
var idx_arange_mat = []
let fuzzy_num_4 = [[4,1],[23,1],[4,11],[4,12],[4,19],[2,1],[2,12],[23,11],[23,12],[23,19],[2,11],[2,19]]
let fuzzy_num_5 = [[5,10],[3,10],[5,14],[3,14]]
let fuzzy_num_add = [[10,1],[10,11],[10,12],[14,1],[14,11],[14,12],[10,15],[10,16],[10,17]]
let fuzzy_num_multi = [[12,1],[11,1],[12,11],[10,10]]
let fuzzy_num_equal = [[10,10],[10,11],[10,12],[11,12],[11,11],[12,12]]
let fuzzy_num_approximat = [[14,14]]
let fuzzy_div_mat=['---','--.','-.-','.--','-..','.-.','..-','...']

export class MathBaseCaculateFunc{
	isOperator=(value)=>{
		let operatorString = "+-*/()";
		return operatorString.indexOf(value) > -1
	}

	getPrioraty=(value)=>{
		switch(value){
			case '+':
			case '-':
				return 1;
			case '*':
			case '/':
				return 2;
			default:
				return 0;
		}
	}

	splitstr=(str)=>{
		// 字符串分离
		let strnum=str.match(/\d+(\.\d+)?/g);  //提取数字
		let strsymbol=str.replace(/\d+(\.\d+)?/g,' '); //替换数字 
		let strmat=[];
		let numint=0;
		for(let ii=0;ii<strsymbol.length;ii++){
			//console.log(strsymbol[ii])
			if (strsymbol[ii]==' '){
				strmat[ii]=strnum[numint];
				numint +=1;
			}
			else{
				strmat[ii]=strsymbol[ii];					
			}
		}
		return strmat;
	}

	prioraty=(o1, o2)=>{
		return this.getPrioraty(o1) <= this.getPrioraty(o2);
	}

	instr2suffixmat=(exp0)=>{	
		let inputStack = [];
		let outputStack = [];
		let outputQueue = [];
		let exp=this.standardstr(exp0);
		inputStack=this.splitstr(exp);
		while(inputStack.length > 0){
			let cur = inputStack.shift();
			if(this.isOperator(cur)){
				if(cur == '('){
					outputStack.push(cur);
				}else if(cur == ')'){
					let po = outputStack.pop();
					while(po != '(' && outputStack.length > 0){
						outputQueue.push(po);
						po = outputStack.pop();
					}
					if(po != '('){
						throw "error: unmatched ()";
					}
				}else{
					while(this.prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0){
						outputQueue.push(outputStack.pop());
					}
					outputStack.push(cur);
				}
			}else{
				outputQueue.push(new Number(cur));
			}
		}
		//console.log('step two');
		if(outputStack.length > 0){
			if(outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '('){
				throw "error: unmatched ()";
			}
			while(outputStack.length > 0){
				outputQueue.push(outputStack.pop());
			}
		}
		//console.log('step three');
		//console.log(outputQueue)
		return outputQueue;
		//return outputStack;
	}

	caculateSuffixstr= (suffixstr)=>{
		//计算后缀表达式的值
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum;
		let strsize=str.length;
		while(strsize>1){
			for(let ii=0;ii<strsize;ii++){
				matchstr=str[ii];
				//str.indexOf("3") != -1；str.search("3") != -1
				if (symbols.indexOf(matchstr) != -1){
					num1=str[ii-2];
					num2=str[ii-1];
					switch(matchstr){
						case '+':
							sumnum=this.formatNum(num1+num2, 5);
							break;
						case '-':
							sumnum=this.formatNum(num1-num2, 5);
							break;
						case '*':
							sumnum=this.formatNum(num1*num2, 5);
							break;
						case '/':
							sumnum=this.formatNum(num1/num2, 5);
							break;	
					}
					//sumnum=math.eval(sumstr);
					str.splice(ii-2,3,sumnum);
					strsize=str.length;
					//console.log(str);
					break;
				}			
			}
			strsize=str.length;
			//console.log(strsize)
			//console.log(str.indexOf("3") != -1 );
		}//while
		return str;
	}

	standardstr=(str)=>{
		//转换标准可计算字符串
		str=str.replace(/\s*/g,""); //去除空格
		str=str.replace(/\[/g,"(");
		str=str.replace(/\{/g,"(");
		str=str.replace(/\]/g,")");
		str=str.replace(/\}/g,")");   			
		str=str.replace(/x/g,"*");
		str=str.replace(/\÷/g,"/");
		//str=str.replace(/\(/g,"[");
		//console.log(str);
		//console.log(math.eval(str));
		return str;    			
	}

	standardsymbol=(strmat0)=>{
		strmat0=strmat0.replace(/\*/g,"x");
		strmat0=strmat0.replace(/\//g,"÷");
		return strmat0;
	}

	caculateSuffixOne=(suffixstr)=>{
		//计算后缀表达式的值
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum;
		let strsize=str.length;
		for(let ii=0;ii<strsize;ii++){
			matchstr=str[ii];
			//str.indexOf("3") != -1；str.search("3") != -1
			if (symbols.indexOf(matchstr) != -1){
				num1=str[ii-2];
				num2=str[ii-1];
				//sumstr=num1+matchstr+num2;
				//console.log(typeof sumstr)
				//console.log(sumstr)
				//sumnum=math.eval(sumstr);
				switch(matchstr){
					case '+':
						sumnum=this.formatNum(num1+num2, 5);
						break;
					case '-':
						sumnum=this.formatNum(num1-num2, 5);
						break;
					case '*':
						sumnum=this.formatNum(num1*num2, 5);
						break;
					case '/':
						sumnum=this.formatNum(num1/num2, 5);
						break;	
				}
				str.splice(ii-2,3,sumnum);
				strsize=str.length;
				//console.log(str);
				break;
			}			
		}
		strsize=str.length;
		//console.log(strsize)
		//console.log(str.indexOf("3") != -1 );
		return str;
	}

	extractSuffixOne=(suffixstr)=>{
		//提取一步后缀表达式矩阵
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum,symbolestr;
		let strsize=str.length;
		for(let ii=0;ii<strsize;ii++){
			matchstr=str[ii];
			//str.indexOf("3") != -1；str.search("3") != -1
			if (symbols.indexOf(matchstr) != -1){
				num1=str[ii-2];
				num2=str[ii-1];
				symbolestr=str[ii-0];
				break;
			}			
		}
		//strsize=str.length;
		let stronestepmat=new Array(3);
		stronestepmat[0]=num1;
		stronestepmat[1]=num2;
		stronestepmat[2]=symbolestr;
		return stronestepmat;
	}

    suffix2infix=(strmat)=>{
		//后缀表达式转中缀表达式，对应中括号等，一般书写格式
		let symbols='+-*/';
		let symbols2='*/';
		let matsize=strmat.length;
		let strmat0=this.copyArr(strmat); //深拷贝
		let objstr=new Array(matsize);
		for(let ii=0;ii<matsize;ii++){
			objstr[ii]=new Array(5);
			objstr[ii]['mathstr0']=strmat0[ii];
			objstr[ii]['combtag']=0;
			objstr[ii]['resymbol']='';
			objstr[ii]['bracket']=0;
			if (symbols2.indexOf(strmat0[ii])!=-1){
				//+-号标记为0，*/号标记为1
				objstr[ii]['symbollevel']=1;
			}
			else{
				objstr[ii]['symbollevel']=0;
			}
		}
		
		while(matsize>1){    				
			for(let ii=0;ii<strmat0.length;ii++){
				let part0=strmat0[ii];
				if (symbols.indexOf(part0) != -1){
					let combstr='';
					if ((objstr[ii-1]['combtag']===0)&&(objstr[ii-2]['combtag']===0)){
						//前面两项都没有操作标记，直接组合字符串
						combstr=strmat0[ii-2]+part0+strmat0[ii-1];
						strmat0.splice(ii-2,3,combstr);
						objstr.splice(ii-1,2)
						objstr[ii-2]['mathstr0']=combstr;
						objstr[ii-2]['combtag']=1;
						objstr[ii-2]['resymbol']=part0;
						objstr[ii-2]['bracket']=0;
						if (symbols2.indexOf(part0)!=-1){
                        // if (symbols2.indexOf(strmat0[ii])!=-1){
                            // 修改 2020-11-04
                                //+-号标记为0，*/号标记为1
							objstr[ii-2]['symbollevel']=1;
						}
						else{
							objstr[ii-2]['symbollevel']=0;
						}
					}
					else{
						// 如果出现组合标记,比较两种符号的优先级是否添加括号，再判断添加括号的情况
						if (symbols2.indexOf(part0)!=-1){
							// 出现乘除号，考虑前后可能添加括号的情况
							//console.log(objstr[1]['bracket']);
							//console.log(objstr[2]['bracket']);
							//console.log(objstr[2]['bracket'])
							if ((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===1)){
								//同时出现组合情况---分别判定各自存在括号的情况
								let str001='',str002='';
								let num001=0,num002=0;
								if (objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04
                                    if (objstr[ii-2]['bracket']===0){
                                        str001='('+objstr[ii-2]['mathstr0']+')';
                                        num001=1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        str001='['+objstr[ii-2]['mathstr0']+']';
                                        num001=2;
                                    }
                                    else{
                                        str001='{'+objstr[ii-2]['mathstr0']+'}';
                                        num001=3;
                                    }
                                }
                                else{
                                    // 新增2020-11-04
                                    str001=objstr[ii-2]['mathstr0']
                                }		
								
											
								if (objstr[ii-1]['bracket']===0){
									str002='('+objstr[ii-1]['mathstr0']+')';
									num002=1;
								}
								else if(objstr[ii-1]['bracket']===1){
									str002='['+objstr[ii-1]['mathstr0']+']';
									num002=2;
								}
								else{
									str002='{'+objstr[ii-1]['mathstr0']+'}';
									num002=3;
								}
								combstr=str001+part0+str002;
								strmat0.splice(ii-2,3,combstr);
								objstr.splice(ii-1,2)
								objstr[ii-2]['mathstr0']=combstr;
								objstr[ii-2]['combtag']=1;
								objstr[ii-2]['resymbol']=part0;
								objstr[ii-2]['symbollevel']=1;    				      
								objstr[ii-2]['bracket']=Math.max(num001,num002); //保留大值				    							     				
							}
							else if((objstr[ii-2]['combtag']===0)&&(objstr[ii-1]['combtag']===1)){
								//第二个字符串是组合情况
								//var objstr0=objstr[ii-1].mathstr0;
								let bracketnum = objstr[ii-1]['bracket'];
								if (objstr[ii-1]['bracket']>=2){
									//出现中括号添加大括号
									combstr=strmat0[ii-2]+part0+'{'+strmat0[ii-1]+'}';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else if(objstr[ii-1]['bracket']===1){
									combstr=strmat0[ii-2]+part0+'['+strmat0[ii-1]+']';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else{
									combstr=strmat0[ii-2]+part0+'('+strmat0[ii-1]+')';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
									}
							}
							else if((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===0)){
								//第一个字符串是组合情况
                                let bracketnum = objstr[ii-1]['bracket'];
                                if(objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    if (objstr[ii-2]['bracket']>=2){
                                        //出现中括号添加大括号
                                        combstr='{'+strmat0[ii-2]+'}'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        combstr='['+strmat0[ii-2]+']'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else{
                                        combstr='('+strmat0[ii-2]+')'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                        //console.log(objstr[2]['bracket'])
                                    }
								}
                                else{
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    combstr=strmat0[ii-2]+part0+strmat0[ii-1];
                                    strmat0.splice(ii-2,3,combstr);
                                    objstr.splice(ii-1,2)
                                    objstr[ii-2]['mathstr0']=combstr;
                                    objstr[ii-2]['combtag']=1;
                                    objstr[ii-2]['resymbol']=part0;
                                    objstr[ii-2]['symbollevel']=1;
                                    objstr[ii-2]['bracket']=bracketnum;
                                }			
							}
                        }
                        else if (symbols.indexOf(part0)!=-1){
							// 出现加减号，考虑前后可能添加括号的情况
							//console.log(objstr[1]['bracket']);
							//console.log(objstr[2]['bracket']);
							//console.log(objstr[2]['bracket'])
							if ((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===1)){
								//同时出现组合情况---分别判定各自存在括号的情况
								let str001='',str002='';
								let num001=0,num002=0;
								if (objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04
                                    if (objstr[ii-2]['bracket']===0){
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=0;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=1;
                                    }
                                    else{
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=2;
                                    }
                                }
                                else{
                                    // 新增2020-11-04
                                    str001=objstr[ii-2]['mathstr0']
                                }		
								
								if (objstr[ii-1]['symbollevel']==1){
                                    str002=objstr[ii-1]['mathstr0'];
									num002=objstr[ii-1]['bracket'];
                                }			
								else if (objstr[ii-1]['bracket']===0){
									str002='('+objstr[ii-1]['mathstr0']+')';
									num002=1;
								}
								else if(objstr[ii-1]['bracket']===1){
									str002='['+objstr[ii-1]['mathstr0']+']';
									num002=2;
								}
								else{
									str002='{'+objstr[ii-1]['mathstr0']+'}';
									num002=3;
								}
								combstr=str001+part0+str002;
								strmat0.splice(ii-2,3,combstr);
								objstr.splice(ii-1,2)
								objstr[ii-2]['mathstr0']=combstr;
								objstr[ii-2]['combtag']=1;
								objstr[ii-2]['resymbol']=part0;
								objstr[ii-2]['symbollevel']=1;    				      
								objstr[ii-2]['bracket']=Math.max(num001,num002); //保留大值				    							     				
							}
							else if((objstr[ii-2]['combtag']===0)&&(objstr[ii-1]['combtag']===1)){
								//第二个字符串是组合情况
								//var objstr0=objstr[ii-1].mathstr0;
                                let bracketnum = objstr[ii-1]['bracket'];
                                if (objstr[ii-1]['symbollevel']==1){
									//出现中括号添加大括号 新增计算符号等级更高
									combstr=strmat0[ii-2]+part0+strmat0[ii-1];
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=0;
									objstr[ii-2]['bracket']=bracketnum;
								}
								else if (objstr[ii-1]['bracket']>=2){
									//出现中括号添加大括号
									combstr=strmat0[ii-2]+part0+'{'+strmat0[ii-1]+'}';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=0;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else if(objstr[ii-1]['bracket']===1){
									combstr=strmat0[ii-2]+part0+'['+strmat0[ii-1]+']';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=0;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else{
									combstr=strmat0[ii-2]+part0+'('+strmat0[ii-1]+')';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=0;
									objstr[ii-2]['bracket']=bracketnum+1;
									}
							}
							else if((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===0)){
								//第一个字符串是组合情况
                                let bracketnum = objstr[ii-1]['bracket'];
                                console.log("objstr[ii-2]['symbollevel']",objstr[ii-2]['symbollevel'])
                                if(objstr[ii-2]['symbollevel']==2){
                                    // 新增2020-11-04：组合时的同级加减法不添加，其他需要添加
                                    if (objstr[ii-2]['bracket']>=2){
                                        //出现中括号添加大括号
                                        combstr='{'+strmat0[ii-2]+'}'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        combstr='['+strmat0[ii-2]+']'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else{
                                        combstr='('+strmat0[ii-2]+')'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                        //console.log(objstr[2]['bracket'])
                                    }
								}
                                else{
                                    // 新增2020-11-04：组合时的同级加减法不添加，其他需要添加
                                    combstr=strmat0[ii-2]+part0+strmat0[ii-1];
                                    strmat0.splice(ii-2,3,combstr);
                                    objstr.splice(ii-1,2)
                                    objstr[ii-2]['mathstr0']=combstr;
                                    objstr[ii-2]['combtag']=1;
                                    objstr[ii-2]['resymbol']=part0;
                                    objstr[ii-2]['symbollevel']=0;
                                    objstr[ii-2]['bracket']=bracketnum;
                                }			
							}
						}
						else{
							// 如果是加减号直接组合字符串，部分其他情况
							let num1=objstr[ii-2]['bracket'];
							let num2=objstr[ii-1]['bracket'];
							combstr=strmat0[ii-2]+part0+strmat0[ii-1];
							strmat0.splice(ii-2,3,combstr);
							objstr.splice(ii-1,2)
							objstr[ii-2]['mathstr0']=combstr;
							objstr[ii-2]['combtag']=1;
							objstr[ii-2]['resymbol']=part0;
							objstr[ii-2]['symbollevel']=0;    				      
							objstr[ii-2]['bracket']=Math.max(num1,num2); //保留大值
						}
					}
					//console.log(strmat0)
					break;
					//console.log('s')
				}    					
			}
			matsize=strmat0.length;
		}
		//console.log(matsize)
		let infixstr=strmat0[0];
		//console.log(infixstr)
		infixstr=infixstr.replace(/\*/g,"x");
		infixstr=infixstr.replace(/\//g,"÷");
		return infixstr;
	}
	copyArr=(father)=>{
		let res = []
		for (let i = 0; i < father.length; i++) {
			res.push(father[i])
		}
		return res
	}    		
	formatNum = (f, digit)=>{
		let m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	}

	CaculateStepStr=(str)=>{
		//var str1=copyArr(str);
		let stepstr=[],infixstr=[],ii=0;
		let suffixstr=this.instr2suffixmat(str); // 中缀转后缀
		console.log('suffixstr后缀表达式', suffixstr)
		let stepstr0=this.suffix2infix(suffixstr)
		stepstr[ii]='  '+stepstr0;
		console.log(stepstr[0])
		while(suffixstr.length>2){
			ii +=1;
			suffixstr=this.caculateSuffixOne(suffixstr);
			// console.log(suffixstr)
			if(suffixstr.length>1){
				infixstr=this.suffix2infix(suffixstr);
			}
			else{
				infixstr=suffixstr
			}
			stepstr[ii]='='+infixstr;
			//console.log(stepstr[ii])
			//分步计算
		}
		return stepstr;
    }
    
    integerGCDfunc=(num1,num2)=>{
        //求两个整数的最大公约:扩展到小数
        let max_idx;
        for(let ii=0;ii<100;ii++){
            // console.log('gcd:ii',num1*Math.pow(10,ii), num2*Math.pow(10,ii)%1)
            if((num1*Math.pow(10,ii)%1==0)&&(num2*Math.pow(10,ii)%1==0)){
                // 同时为整，记录扩大次数
                max_idx = ii
                break;
            }
        }
        // console.log('公约数次幂', max_idx)
        let gcdnum1=num1*Math.pow(10,max_idx);
        let gcdnum2=num2*Math.pow(10,max_idx);
        let gcdnum3=0;
        //判断整数
        if((Math.floor(gcdnum1) === gcdnum1)&&(Math.floor(gcdnum2) === gcdnum2)){
            while(1){
                gcdnum3=gcdnum1%gcdnum2;
                gcdnum1=gcdnum2;
                gcdnum2=gcdnum3;
                if(gcdnum3==0){
                    gcdnum3=gcdnum1;
                    break;
                }
            }
        }
        else{
            gcdnum3=1;
        }
        return gcdnum3/Math.pow(10,max_idx);
    }

    integerLCMfunc=(num1,num2)=>{
        //求两个整数的最小公倍数
        let lcmnum1=num1;
        let lcmnum2=num2;
        //先求最大公约数再求最小公倍数
        let lcmnum3=this.integerGCDfunc(lcmnum1,lcmnum2);
        let lcmnum4=parseInt(lcmnum1*lcmnum2/lcmnum3);
        return lcmnum4;
        
    }
    integerFactorsfunc=(num1)=>{
        //寻找因数
        let factornum1=num1;
        let factormat=new Array(1);
        factormat[0]=1;
        if(Math.floor(factornum1) === factornum1){
            for(let ii=2;ii<=factornum1;ii++){
                if(factornum1%ii==0){
                    factormat.push(ii);
                }
            }
        }
        return factormat;
    }
    
    integerPrimeFactorsfunc=(num1)=>{
        //寻找质因数
        let factornum1=num1;
        let factormat=new Array;
        //factormat[0]=1;
        if(Math.floor(factornum1) === factornum1){
            for(let ii=2;ii<=factornum1;ii++){
                if(factornum1%ii==0){
                    factornum1=factornum1/ii;
                    factormat.push(ii);
                    ii=2;
                }
            }
        }
        return factormat;
    }

    findPrimenumfunc=(num1)=>{
        //寻找num1以内的质数
        let maxnum1=num1;
        let primenummat=[];
        if(maxnum1>1){
            for(var jj=2;jj<=maxnum1;jj++){
                var partnummat=this.integerPrimeFactorsfunc(jj);
                //console.log(partnummat)
                //console.log(partnummat.length)
                if(partnummat.length==1){
                    primenummat.push(jj);
                }
            }
        }
        else{
            primenummat=1;
        }
        return primenummat;
    }

    FractionCaculate=(num_mat1,num_mat2,caculate_mode)=>{
        // 根据加减乘除选用不同的计算模块, 根据需求转换结果样式，默认保存为最简分数样式，不用带分数
        // 后续还需考虑分数情况
        console.log('计算', caculate_mode)
        let answer_mat
        if (caculate_mode == 0||caculate_mode == '+'){
            console.log('计算2',num_mat1,num_mat2, caculate_mode)
            answer_mat = this.FractionAdd(num_mat1,num_mat2)
        }
        else if (caculate_mode == 1||caculate_mode == '-'){
            answer_mat = this.FractionSubtract(num_mat1,num_mat2)

        }
        else if (caculate_mode == 2||caculate_mode == 'x'||caculate_mode == '*'||caculate_mode == 'X'){
            console.log('乘法计算',num_mat1,num_mat2)

            answer_mat = this.FractionMultiply(num_mat1,num_mat2)

        }
        else if (caculate_mode == 3||caculate_mode == '/'||caculate_mode == '÷'){
            answer_mat = this.FractionDivide(num_mat1,num_mat2)

        }
        else {
            console.log('计算模式有错误')
            answer_mat = []
        }
        return answer_mat
    }

    FractionAdd=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), num_mat1[1], this.standardstr(num_mat1[2])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else{
                caculate_num2 = [this.standardstr(num_mat2[0]), num_mat2[1], this.standardstr(num_mat2[2])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[2])+eval(caculate_num1[2])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[2])*eval(caculate_num2[2]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(),'-',denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])+eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
            console.log('加法结果', answer_num, answer_mat)

        }
        return answer_mat;
    }

    FractionSubtract=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), num_mat1[1], this.standardstr(num_mat1[2])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else{
                caculate_num2 = [this.standardstr(num_mat2[0]), num_mat2[1], this.standardstr(num_mat2[2])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[2])-eval(caculate_num1[2])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[2])*eval(caculate_num2[2]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            // console.log('add_numerator',add_numerator,add_denominator,max_gcd,numerator_num,denominator_num)
            answer_mat=[numerator_num.toString(),'-',denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])-eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    FractionMultiply=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        console.log('乘法模块', num_mat1.length,num_mat2.length)
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            console.log('乘法模块2', num_mat1.length,num_mat2.length)
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else{

                caculate_num1 = [this.standardstr(num_mat1[0]), num_mat1[1], this.standardstr(num_mat1[2])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
                console.log('分数', caculate_num2)
            }
            else{

                caculate_num2 = [this.standardstr(num_mat2[0]), num_mat2[1], this.standardstr(num_mat2[2])]
            }
            console.log('乘法', caculate_num1, caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[2])*eval(caculate_num2[2]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(),'-',denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])*eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }
    
    FractionDivide=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), num_mat1[1], this.standardstr(num_mat1[2])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else{
                caculate_num2 = [this.standardstr(num_mat2[0]), num_mat2[1], this.standardstr(num_mat2[2])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[2]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[2])*eval(caculate_num2[0]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(),'-',denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])/eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    NumberTurnFraction=(num_mat)=>{
        // 将数字转换为最简分数，如果是整数，分母为1
        let num_num;
        // 转换标准数字计算
        if (typeof(num_mat)=='object'){
            num_num = eval(num_mat[0])
        }
        else{
            num_num=eval(num_mat)
        }
        // 分子分母转换
        let numerator_num,denominator_num;
        if (num_num%1==0){
            numerator_num = parseInt(num_num)
            denominator_num = 1
        }
        else{
            let ii_mi = 0
            for(let ii =1;ii<100;ii++){
                let num_num_1 = num_num * Math.pow(10,ii);
                if(num_num_1%1==0){
                    ii_mi = ii;
                    break
                }
            }
            console.log('次方', ii_mi)
            let numerator_num0 = num_num*Math.pow(10, ii_mi)
            let denominator_num0 = Math.pow(10, ii_mi)
            // 找最大公约数
            let max_gcd = this.integerGCDfunc(numerator_num0,denominator_num0)
            if(max_gcd<0){
                numerator_num = parseInt(-numerator_num0/max_gcd)
                denominator_num = parseInt(-denominator_num0/max_gcd)
            }
            else{
                numerator_num = parseInt(numerator_num0/max_gcd)
                denominator_num = parseInt(denominator_num0/max_gcd)
            }
        }
        // console.log('numerator_num',numerator_num, 'denominator_num',denominator_num)
        return [numerator_num.toString(), '-', denominator_num.toString()]
    }

    RecognizeMatTurnStandardMat=(rec_mat)=>{
		// model_mat 包含初始数字编码，和统一表达式字母，后续插入：真实值、数值类型、真实字母代码
		let model_mat =[[1,'A'],[2,'B'],[3,'C'],[4,'D'],[5,'E'],[6,'F'],[7,'G'],[8,'H'],[9,'I'],[10,'J'],[11,'K'],[12,'L'],[13,'M'],[14,'N'],[15,'O']]
		// console.log(model_mat)
		let replace_mat = []
		let idx_a = -1
		for (let ii=0;ii<rec_mat.length;ii++){
			// 主要判断数据为数字字符串
			if (rec_mat[ii].length==3){
				idx_a +=1
				model_mat[idx_a].push(rec_mat[ii])
				replace_mat.push([model_mat[idx_a][0].toString()])
			}
			else{
				if(['+','-','x','/','*','X','÷','(',')','[',']','{','}'].indexOf(rec_mat[ii][0])<0){
					// 如果不是计算符号
					idx_a +=1
					model_mat[idx_a].push(rec_mat[ii])
					replace_mat.push([model_mat[idx_a][0].toString()])
				}
				else{
					replace_mat.push(rec_mat[ii])
				}
			}
		}
		// console.log('变量替换',model_mat)
		// console.log('原始', rec_mat)
		// console.log('替换', replace_mat)
		let replace_str =''
		for (let ii=0;ii<replace_mat.length;ii++){
			replace_str +=replace_mat[ii][0]
		}
		let infix_str_mat = []
		infix_str_mat.push(replace_str)
		// console.log('数组组合字符串', replace_str)
		let suffix_mat = this.instr2suffixmat(replace_str)
		// console.log('字符串转后缀表达式', suffix_mat, typeof(suffix_mat[0]))
		// console.log(suffix_mat.length, suffix_mat[0]+0)
		while(suffix_mat.length>=3){
			for (let ii=0;ii<suffix_mat.length;ii++){
				// console.log(['+','-','x','/','*','X','÷'].indexOf(suffix_mat[ii])>=0)
				if(['+','-','x','/','*','X','÷'].indexOf(suffix_mat[ii])>=0){
					let num_1 = model_mat[suffix_mat[ii-2]+0-1][2]
					let num_2 = model_mat[suffix_mat[ii-1]+0-1][2]
					let caculate_mode = suffix_mat[ii]
					// console.log('计算过程', num_1, num_2, caculate_mode)
					idx_a +=1
					// 替换计算方案
					let caculate_mat = this.FractionCaculate(num_1,num_2,caculate_mode)
					model_mat[idx_a].push(caculate_mat)

					suffix_mat.splice(ii-2,3,Number(model_mat[idx_a][0]))
					// console.log('后缀表达式', suffix_mat)
					let infix_str;
					if (suffix_mat.length==1){
						infix_str = suffix_mat[0].toString()
					}
					else{
						infix_str = this.suffix2infix(suffix_mat)
					}
					// console.log('中缀表达式', infix_str)
					infix_str_mat.push(infix_str)
					break
				}
			}
		}
		// console.log('代数式计算', model_mat)
		// console.log('中缀表达式', infix_str_mat)
		// 提取每步中缀字符串，转换表达式、代数式、根据每个字母的要求存储对应的数字类型
		let infix_letter_mat=[];
        let infix_value_mat=[];
        let infix_fraction_mat=[];
		for(let ii=0;ii<infix_str_mat.length;ii++){
			let part_infix_str = infix_str_mat[ii]
			// 提取数字=>替代字母和标准算式
			let str_num_mat=part_infix_str.match(/\d+(\.\d+)?/g);  //提取数字
			let str_symbol_mat=part_infix_str.replace(/\d+(\.\d+)?/g,'_'); //替换数字 
			// console.log('提取数字矩阵', str_num_mat,str_symbol_mat)
			let idx_num = -1
			let new_value_str=''
            let new_letter_str=''
            let part_infix_fraction_mat = []
			for(let jj=0;jj<str_symbol_mat.length;jj++){
				if (str_symbol_mat[jj]=='_'){
					idx_num +=1
					let a_mat_idx = parseInt(str_num_mat[idx_num])-1
                    let a_mat_value = model_mat[a_mat_idx][2]
                    part_infix_fraction_mat.push(a_mat_value)
					// 此处添加转换格式：目前默认样式，长度为1直接引用、长度为3转为？/?格式
					new_letter_str += model_mat[a_mat_idx][1]
					if (a_mat_value.length==1){
						new_value_str += a_mat_value[0]
					}
					else if(a_mat_value.length==3){
                        // 分数时需考虑添加括号，以示区别
                        // new_value_str += '('+a_mat_value[0]+')'+'/'+'('+a_mat_value[2]+')'
                        // 可视情况而定，如果内部存在符号"添加括号
                        if  (a_mat_value[0].indexOf('+')!=-1||a_mat_value[0].indexOf('-')!=-1||a_mat_value[0].indexOf('x')!=-1||
                             a_mat_value[0].indexOf('X')!=-1||a_mat_value[0].indexOf('*')!=-1||a_mat_value[0].indexOf('/')!=-1||a_mat_value[0].indexOf('÷')!=-1){
                            // 找到任意一种符号，添加括号
                            new_value_str += '('+a_mat_value[0]+')'+'/'
                        }
                        else{
                            new_value_str += a_mat_value[0]+'/'
                        }
                        if  (a_mat_value[2].indexOf('+')!=-1||a_mat_value[2].indexOf('-')!=-1||a_mat_value[2].indexOf('x')!=-1||
                             a_mat_value[2].indexOf('X')!=-1||a_mat_value[2].indexOf('*')!=-1||a_mat_value[2].indexOf('/')!=-1||a_mat_value[2].indexOf('÷')!=-1){
                            // 找到任意一种符号，添加括号
                            new_value_str += '('+a_mat_value[2]+')'
                        }
                        else{
                            new_value_str += a_mat_value[2]
                        }
					}
				}
				else{
					new_value_str += str_symbol_mat[jj]
                    new_letter_str += str_symbol_mat[jj]
                    part_infix_fraction_mat.push([str_symbol_mat[jj]])
				}

			}
			// console.log ('value转换', new_value_str)
			// console.log ('letter转换', new_letter_str)
			infix_letter_mat.push(new_letter_str)
            infix_value_mat.push(new_value_str)
            infix_fraction_mat.push(part_infix_fraction_mat)
		}
		console.log ('value转换', infix_value_mat)
		console.log ('letter转换', infix_letter_mat)
        console.log ('标准单组矩阵', infix_fraction_mat)
        let turn_fraction_mat = this.FractionTurnMat(infix_fraction_mat)
		return [infix_value_mat, infix_letter_mat,infix_fraction_mat, turn_fraction_mat[0], turn_fraction_mat[1]]
    }
    
    FractionTurnMat=(infix_fraction_mat)=>{
        // 转换为多行和单行的显示等式格式
        console.log('infix_fraction_mat',infix_fraction_mat)
        let one_fraction_mat=[]
        let multiple_fraction_mat=[]
        for (let ii=0;ii<infix_fraction_mat.length;ii++){
            let part_multiple_mat = []
            console.log('infix_fraction_mat[ii]',infix_fraction_mat[ii])
            for(let jj =0;jj<infix_fraction_mat[ii].length;jj++){
                console.log('infix_fraction_mat[ii][jj]', infix_fraction_mat[ii][jj])
                if(ii!=0 && jj==0){
                    one_fraction_mat.push(['='])
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['='])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else if(ii==0 && jj==0){
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['  '])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else{
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                // console.log('one_fraction_mat', one_fraction_mat)
            }
            multiple_fraction_mat.push(part_multiple_mat)
        }
        return [one_fraction_mat, multiple_fraction_mat]
    }
}

export class BasicProcessingFunc{
    // 基础处理函数
    deepClone = (obj, newObj) => {
        // 深度复制
        var newObj = newObj || {};
        for (let key in obj) {
            if (typeof obj[key] == 'object') {
                newObj[key] = (obj[key].constructor === Array) ? [] : {}
                this.deepClone(obj[key], newObj[key]);
            }
            else {
                newObj[key] = obj[key]
            }
        }
        return newObj;
    }
    
    DirectionCode = (point_a, point_b)=>{
        // 两点方向编码、顺时针、x+为0; 8个方向
        let length_x = point_b[0]-point_a[0];
        let length_y = point_b[1]-point_a[1];
        var DirectNum; // 方向编码
        // 新增角度
        var DirectAngle; // 方向角度
        if (length_y>=0){
            if (point_a[0]==point_b[0]){
                DirectNum = 6
                DirectAngle = 90
                // console.log('x轴相同')
            }
            else{
                let Line_K = length_y/length_x
                if (length_x>0){
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100 //保留两位小数
                }
                else{
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100+180 //保留两位小数
                }
                if ((Line_K>=0)&&(Line_K<=Math.tan(22.5/180*Math.PI))){
                    DirectNum = 0
                }
                else if((Line_K>Math.tan(22.5/180*Math.PI))&&(Line_K<=Math.tan(67.5/180*Math.PI))){
                    DirectNum = 7
                }
                else if((Line_K>Math.tan(67.5/180*Math.PI))||(Line_K<=Math.tan(112.5/180*Math.PI))){
                    DirectNum = 6
                }
                else if((Line_K>Math.tan(112.5/180*Math.PI))&&(Line_K<=Math.tan(157.5/180*Math.PI))){
                    DirectNum = 5
                }
                else if((Line_K>Math.tan(157.5/180*Math.PI))&&(Line_K<=0)){
                    DirectNum = 4
                }
            }
        }
        else{
            if (point_a[0]==point_b[0]){
                DirectNum = 2
                DirectAngle = -90
                // console.log('x轴相同')
            }
            else{
                let Line_K = length_y/length_x;
                if (length_x>0){
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100 //保留两位小数
                }
                else{
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100-180 //保留两位小数
                }            // 可以添加方向
                if ((Line_K>=0)&&(Line_K<=Math.tan(22.5/180*Math.PI))){
                    DirectNum = 4
                }
                else if((Line_K>Math.tan(22.5/180*Math.PI))&&(Line_K<=Math.tan(67.5/180*Math.PI))){
                    DirectNum = 3
                }
                else if((Line_K>Math.tan(67.5/180*Math.PI))||(Line_K<=Math.tan(112.5/180*Math.PI))){
                    DirectNum = 2
                }
                else if((Line_K>Math.tan(112.5/180*Math.PI))&&(Line_K<=Math.tan(157.5/180*Math.PI))){
                    DirectNum = 1
                }
                else if((Line_K>Math.tan(157.5/180*Math.PI))&&(Line_K<=0)){
                    DirectNum = 0
                }
            }
        }
        // console.log('方向编码', point_a, point_b, length_x, length_y, DirectNum)
        return [DirectNum, DirectAngle]
    }
    
    VectorialAngle = (vector_a, vector_b)=>{
        let ab_dot = vector_a[0]*vector_b[0]+vector_a[1]*vector_b[1];   // 点积
        let ab_length = Math.sqrt(vector_a[0]*vector_a[0]+vector_a[1]*vector_a[1])*
                        Math.sqrt(vector_b[0]*vector_b[0]+vector_b[1]*vector_b[1]);// ab 模长乘积
        let cos_theta = ab_dot/ab_length;
        let cos_angle = Math.acos(cos_theta)/Math.PI*180;
        // console.log('向量夹角', cos_angle)
        return Math.round(cos_angle*100)/100;
    }
    
    LineABC=(point_a, point_b)=>{
        // 两点求直线ABC值: Ax+By+C=0
        if (JSON.stringify(point_a) == JSON.stringify(point_b)){
            console.log('两点相同')
            return false;
        }
        else{
            console.log('可求直线', point_a[0]==point_b[0])
            let line_A = 0;
            let line_B = 0;
            let line_C = 0;
            if (point_a[0]==point_b[0]){
                // x值相等，直线方程为Bx+C=0
                line_A = 1;
                line_B = 0;
                line_C = -point_a[0];
            }
            else{
                line_A = -(point_a[1]-point_b[1])/(point_a[0]-point_b[0]);
                line_B = 1;
                line_C = -line_A*point_a[0]-point_a[1]
            }
            // console.log('直线ABC求解', line_A, line_B, line_C)
            return [line_A, line_B, line_C]
        }
    }
    
    PointToLineDistance=(line_data, point_c)=>{
        // 求解点到直线的距离:
        let length_AB = Math.sqrt(line_data[0]*line_data[0]+line_data[1]*line_data[1]);
        let length_point = line_data[0]*point_c[0]+line_data[1]*point_c[1]+line_data[2];
        let point_distance_abs = Math.abs(length_point/length_AB);
        let point_distance = length_point/length_AB;
        return point_distance_abs;
    }
    
    ArrayDistance = (part_line_data0)=>{
        // 数组求端点直线其余点距离
        let part_line_data=[];
        part_line_data = this.deepClone(part_line_data0, part_line_data)
        let point_a = [part_line_data[0].shift(),part_line_data[1].shift()];   //弹出第一个
        let point_b = [part_line_data[0].pop(),part_line_data[1].pop()];     //弹出最后一个
        console.log('端点数据', point_a, point_b, part_line_data)
        // 求端点直线ABC:Ax+By+C=0
        let line_data = this.LineABC(point_a, point_b)
        // console.log('直线ABC求解', line_data)
        var part_distance_mat = []
        for (let ii=0;ii<part_line_data[0].length;ii++){
            let point_c = [part_line_data[0][ii], part_line_data[1][ii]]
            // console.log('求值距离点', point_c)
            let dis_p = this.PointToLineDistance(line_data, point_c)
            part_distance_mat.push(dis_p)
    
        }
        // console.log('各点距离', part_distance_mat)
        return part_line_data;
    }
    
    ArrayAngle = (part_line_data0)=>{
        // 获得数据点连续三个点的方向向量夹角
        // console.log('初始数据', part_line_data0, part_line_data0[0].length)
        let part_angle_mat = []
        for (let ii=1; ii<part_line_data0[0].length-1; ii++){
            // 修改方向
            let vector_a = [part_line_data0[0][ii]-part_line_data0[0][ii-1],-(part_line_data0[1][ii]-part_line_data0[1][ii-1])];
            let vector_b = [part_line_data0[0][ii+1]-part_line_data0[0][ii],-(part_line_data0[1][ii+1]-part_line_data0[1][ii])];
            let part_angle = this.VectorialAngle(vector_a, vector_b);
            // console.log('索引ii:', ii, '角度：', part_angle)
            part_angle_mat[ii-1] = part_angle;
        }
        return part_angle_mat;
    }
    
    ArrayDirection = ()=>{
        // 数据点前后方向向量数组
        let Direction_mat =[]
        // var num_idx =0
        for (let ii=0; ii<part_line_data0[0].length-1; ii++){
            // 修改方向，y值
            let point_a = [part_line_data0[0][ii],-part_line_data0[1][ii]];
            let point_b = [part_line_data0[0][ii+1],-part_line_data0[1][ii+1]];
            if (JSON.stringify(point_a)!=JSON.stringify(point_b)){
                // 已经去重，不存在
                let DirectionNum = this.DirectionCode(point_a, point_b);
                // Direction_mat[num_idx] = DirectionNum;
                // num_idx += 1
                Direction_mat.push(DirectionNum[0]);
            }
        }
        return Direction_mat;
    }
    
    DataToHeavy = (part_line_data0) =>{
        // 连续两点去重
        let part_x_to_heavy = []
        let part_y_to_heavy = []
        part_x_to_heavy.push(part_line_data0[0][0]);
        part_y_to_heavy.push(part_line_data0[1][0]);
        let part_xy_data = []
        for(let ii=1; ii<part_line_data0[0].length;ii++){
            if((part_line_data0[0][ii]==part_line_data0[0][ii-1])&&(part_line_data0[1][ii]==part_line_data0[1][ii-1])){
                continue;
            }
            else{
                part_x_to_heavy.push(part_line_data0[0][ii]);
                // 实际像素点坐标系与标准坐标系相反，y值取负
                part_y_to_heavy.push(part_line_data0[1][ii]);
            }
        }
        part_xy_data.push(part_x_to_heavy);
        part_xy_data.push(part_y_to_heavy);
        return part_xy_data;
    }
    
    matInterpolation = (Mat_data0) => {
        // 多数据点连续插值
        //	Mat_data =[[1,5,9],[5,3,8]]
        // 数据扩大倍数：根据行列区域26的大小:新增2020-12-02
        let part_region_mat = this.partLineRegion(Mat_data0)
        // console.log('插值区域', part_region_mat)
        // 
        let Mat_data = []
        if((part_region_mat[1]-part_region_mat[0])<=25 && (part_region_mat[3]-part_region_mat[2])<=25){
            let data_x_mat = []
            let data_y_mat = []
            if((part_region_mat[1]-part_region_mat[0])>(part_region_mat[3]-part_region_mat[2])){
                for(let ii=0;ii<Mat_data0[0].length;ii++){
                    let point_x0 = Mat_data0[0][ii]-part_region_mat[0]
                    let point_y0 = Mat_data0[1][ii]-part_region_mat[2]
                    let new_point_x = parseInt(point_x0/(part_region_mat[1]-part_region_mat[0]+1)*50)+part_region_mat[0]
                    let new_point_y = parseInt(point_y0/(part_region_mat[1]-part_region_mat[0]+1)*50)+part_region_mat[2]
                    data_x_mat.push(new_point_x)
                    data_y_mat.push(new_point_y)
                }
            }
            else{
                for(let ii=0;ii<Mat_data0[0].length;ii++){
                    let point_x0 = Mat_data0[0][ii]-part_region_mat[0]
                    let point_y0 = Mat_data0[1][ii]-part_region_mat[2]
                    let new_point_x = parseInt(point_x0/(part_region_mat[3]-part_region_mat[2]+1)*50)+part_region_mat[0]
                    let new_point_y = parseInt(point_y0/(part_region_mat[3]-part_region_mat[2]+1)*50)+part_region_mat[2]
                    data_x_mat.push(new_point_x)
                    data_y_mat.push(new_point_y)
                }
            }
            Mat_data.push(data_x_mat)
            Mat_data.push(data_y_mat)
        }
        else{
            Mat_data = Mat_data0
        }
        let part_region_mat2 = this.partLineRegion(Mat_data)
        // console.log('插值区域2', part_region_mat2)
        // console.log('原始数据', Mat_data0)
        // console.log('修改数据', Mat_data)
        // 查看斜率
        // for (let iii=0;iii<Mat_data0[0].length-1;iii++){
        //     console.log('原始', (Mat_data0[1][iii]-Mat_data0[1][iii+1])/(Mat_data0[0][iii]-Mat_data0[0][iii+1]))
        //     console.log('修改', (Mat_data[1][iii]-Mat_data[1][iii+1])/(Mat_data[0][iii]-Mat_data[0][iii+1]))
        // }

        let new_mat_data = [[], []]
        for (let ii = 0; ii < Mat_data[0].length - 1; ii++) {
            let point_1 = [Mat_data[0][ii], Mat_data[1][ii]]
            let point_2 = [Mat_data[0][ii + 1], Mat_data[1][ii + 1]]
            let part_mat = this.InterpolationPoint(point_1, point_2)
            //		new_mat_data[0].push(part_mat[0].slice(0,part_mat[0].length-1))
            //		new_mat_data[1].push(part_mat[1].slice(0,part_mat[0].length-1))
            for (let jj = 0; jj < part_mat[0].length - 1; jj++) {
                new_mat_data[0].push(part_mat[0][jj])
                new_mat_data[1].push(part_mat[1][jj])
            }
        }
        new_mat_data[0].push(Mat_data[0][Mat_data[0].length - 1])
        new_mat_data[1].push(Mat_data[1][Mat_data[1].length - 1])
        return new_mat_data
    }
    
    matInterpolation2 = (Mat_data) => {
        // 多数据点连续插值：不考虑code编码时，直接插值，相交线位置绝对一致
        let new_mat_data = [[], []]
        for (let ii = 0; ii < Mat_data[0].length - 1; ii++) {
            let point_1 = [Mat_data[0][ii], Mat_data[1][ii]]
            let point_2 = [Mat_data[0][ii + 1], Mat_data[1][ii + 1]]
            let part_mat = this.InterpolationPoint(point_1, point_2)
            //		new_mat_data[0].push(part_mat[0].slice(0,part_mat[0].length-1))
            //		new_mat_data[1].push(part_mat[1].slice(0,part_mat[0].length-1))
            for (let jj = 0; jj < part_mat[0].length - 1; jj++) {
                new_mat_data[0].push(part_mat[0][jj])
                new_mat_data[1].push(part_mat[1][jj])
            }
        }
        new_mat_data[0].push(Mat_data[0][Mat_data[0].length - 1])
        new_mat_data[1].push(Mat_data[1][Mat_data[1].length - 1])
        return new_mat_data
    }

    InterpolationPoint = (point_1, point_2) => {
        // 两点线性插值
        let point_a = [parseInt(point_1[0]), parseInt(point_1[1])]
        let point_b = [parseInt(point_2[0]), parseInt(point_2[1])]
        let inter_x = []
        let inter_y = []
        if ((point_a[0] == point_b[0]) && (point_a[1] == point_b[1])) {
            inter_x[0] = point_a[0]
            inter_y[0] = point_a[1]
        }
        else if (Math.abs(point_a[0] - point_b[0]) >= Math.abs(point_a[1] - point_b[1])) {
            inter_x = this.JsArange(point_a[0], point_b[0], 1)
            if (point_a[1] != point_b[1]) {
                let line_k = (point_a[1] - point_b[1]) / (point_a[0] - point_b[0])
                for (let jj = 0; jj < inter_x.length; jj++) {
                    // inter_y[jj] = parseInt(line_k * (inter_x[jj] - point_a[0]) + point_a[1])
                    inter_y[jj] = Math.round(line_k * (inter_x[jj] - point_a[0]) + point_a[1])
                }
            }
            else {
                for (let jj = 0; jj < inter_x.length; jj++) {
                    inter_y[jj] = point_b[1]
                }
            }
        }
        else {
            inter_y = this.JsArange(point_a[1], point_b[1], 1)
            if (point_a[0] != point_b[0]) {
                let r_line_k = (point_a[0] - point_b[0]) / (point_a[1] - point_b[1])
                for (let jj = 0; jj < inter_y.length; jj++) {
                    // inter_x[jj] = parseInt(r_line_k * (inter_y[jj] - point_a[1]) + point_a[0])
                    inter_x[jj] = Math.round(r_line_k * (inter_y[jj] - point_a[1]) + point_a[0])
                }
            }
            else {
                for (let jj = 0; jj < inter_y.length; jj++) {
                    inter_x[jj] = point_b[0]
                }
            }
        }
        let inter_line_mat = []
        inter_line_mat[0] = inter_x
        inter_line_mat[1] = inter_y
        return inter_line_mat
    }
    
    JsArange = (start_num, end_num, stepnum) => {
        // 产生标准等差数组、stepnum：间隔
        var arange_mat = []
        if (start_num == end_num) {
            arange_mat[0] = start_num
        }
        else {
            if (start_num > end_num) {
                //			var start_ii = 0
                for (var start_ii = 0; start_ii < ((start_num - end_num + 1) / stepnum); start_ii++) {
                    arange_mat[start_ii] = start_num - stepnum * start_ii
                }
                if (arange_mat[start_ii - 1] > end_num) {
                    arange_mat[start_ii] = end_num
                }
            }
            else {
                for (var start_ii = 0; start_ii < ((end_num - start_num + 1) / stepnum); start_ii++) {
                    arange_mat[start_ii] = start_num + stepnum * start_ii
                }
                if (arange_mat[start_ii - 1] < end_num) {
                    arange_mat[start_ii] = end_num
                }
            }
        }
        return arange_mat
    }
    
    DataScale = (line_mat_001, parScale) => {
        // 数据缩放
        var new_line_mat = []
        var new_line_mat_x = []
        var new_line_mat_y = []
        for (var ii = 0; ii < line_mat_001[0].length; ii++) {
            new_line_mat_x[ii] = parseInt(Math.round(line_mat_001[0][ii] * parScale[0]))
            new_line_mat_y[ii] = parseInt(Math.round(line_mat_001[1][ii] * parScale[1]))
        }
        new_line_mat[0] = new_line_mat_x
        new_line_mat[1] = new_line_mat_y
        return new_line_mat
    }
    
    UniformSplit = (start_stop_mat, split_num)=>{
        // 根据起止数据值start_stop_mat, 等间隔划分split_num个点，split_num-1个数据段，取整；split_num第一次设计16;
        let step_num = (start_stop_mat[1]-start_stop_mat[0])/(split_num-1);
        let step_mat = []
        for (let ii=0;ii<split_num;ii++){
            step_mat.push(parseInt(Math.round(start_stop_mat[0]+step_num*ii)));
        }
        return step_mat;
    }
    
    UniformDirection = (line_data, idx_mat)=>{
        // 直线多段求方向
        let uniform_direction_data = [];
        let uniform_direction_angle_data = [];
        for (let ii=0;ii<idx_mat.length-1;ii++){
            let point_a = [line_data[0][idx_mat[ii]], -line_data[1][idx_mat[ii]]]
            let point_b = [line_data[0][idx_mat[ii+1]], -line_data[1][idx_mat[ii+1]]]
            // let [DirectionNum, DirectAngle] = DirectionCode(point_a, point_b);
            let [DirectionNum, DirectAngle] = this.DirectionCodeMode(point_a, point_b, 16); //选择模式
            uniform_direction_data.push(DirectionNum)
            uniform_direction_angle_data.push(DirectAngle)
        }
        // console.log('方向', uniform_direction_data)
        // console.log('角度', uniform_direction_angle_data)
        return [uniform_direction_data,uniform_direction_angle_data]
    }
    
    AllLineRegion = (line_region_mat) => {
        // 书写区域的全局坐标
        let region_mat = []
        let x_min = 1000000
        let x_max = -10
        let y_min = 1000000
        let y_max = -10
        // 这么写效率不高
        for (let ii = 0; ii < line_region_mat.length; ii++) {
            if (line_region_mat[ii][0] < x_min) {
                x_min = line_region_mat[ii][0];
            }
            if (line_region_mat[ii][1] > x_max) {
                x_max = line_region_mat[ii][1];
            }
            if (line_region_mat[ii][2] < y_min) {
                y_min = line_region_mat[ii][2];
            }
            if (line_region_mat[ii][3] > y_max) {
                y_max = line_region_mat[ii][3];
            }
        }
        region_mat[0] = x_min;
        region_mat[1] = x_max;
        region_mat[2] = y_min;
        region_mat[3] = y_max;
        return region_mat;
    }
    
    partLineRegion = (line_mat) => {
        // 获取一条线段的基础数据值：最小、最大、起始、结束端点
        let mouse_x = line_mat[0]
        let mouse_y = line_mat[1]
        let x_min = Math.min.apply(null, mouse_x)
        let x_max = Math.max.apply(null, mouse_x)
        let y_min = Math.min.apply(null, mouse_y)
        let y_max = Math.max.apply(null, mouse_y)
        let x_start = mouse_x[0]
        let x_end = mouse_x[mouse_x.length - 1]
        let y_start = mouse_y[0]
        let y_end = mouse_y[mouse_y.length - 1]
        return [x_min, x_max, y_min, y_max, x_start, x_end, y_start, y_end]
    }
    
    reverseCode=(uniform_data)=>{
        // 反向编码，以8为周期
        let reverse_code = []
        for(let ii=0;ii<uniform_data.length;ii++){
            let part_code = uniform_data[ii]>=4 ? uniform_data[ii]-4:uniform_data[ii]+4;
            reverse_code.push(part_code);
        }
        return reverse_code;
    }
    
    EuclidDistance=(codemat_a,codemat_b)=>{
        // 欧几里得距离
        let euclid_sim=1;
        if (codemat_a.length == codemat_b.length){
            let distance_square = 0;
            for(let ii=0;ii<codemat_a.length;ii++){
                distance_square += Math.pow(codemat_a[ii]-codemat_b[ii],2);
            }
            let distance_sqrt = Math.sqrt(distance_square);
            euclid_sim = 1/(1+distance_sqrt);
        }
        else{
            console.log('两组数据维度不同')
            euclid_sim = false;
        }
        return euclid_sim;
    }
    
    RecursiveSum=(arr)=>{
        // 递归求和
        let len = arr.length;
        if(len == 0){
            return 0;
        } else if (len == 1){
            return arr[0];
        } else {
            return arr[0] + this.RecursiveSum(arr.slice(1));
        }
    }
    
    GenerakSum=(arr)=>{
        // 常规求和
        let arr_sum = 0;
        for (let ii=arr.length-1; ii>=0; ii--) {
            arr_sum += arr[ii];
        }
        return arr_sum;
    }
    
    PearsonCoefficient=(codemat_a, codemat_b)=>{
        // 皮尔逊系数：单个向量的所有元素不能相同
        let dot_ab = this.ArrayDot(codemat_a, codemat_b);
        let sum_a = this.RecursiveSum(codemat_a);
        let sum_b = this.RecursiveSum(codemat_b);
        let dot_aa = this.ArrayDot(codemat_a, codemat_a);
        let dot_bb = this.ArrayDot(codemat_b, codemat_b);
        let len_a = codemat_a.length;
        let pearson_coe = (len_a*dot_ab-sum_a*sum_b)/(Math.sqrt(len_a*dot_aa-Math.pow(sum_a,2))*Math.sqrt(len_a*dot_bb-Math.pow(sum_b,2)));
        return pearson_coe;
    }
    
    ArrayDot=(codemat_a,codemat_b)=>{
        // 向量点积
        let arr_dot = 0
        if (codemat_a.length == codemat_b.length){
            for (let ii=0;ii<codemat_b.length;ii++){
                arr_dot += codemat_a[ii]*codemat_b[ii]
            }
        }
        else{
            console.log('向量维度不同')
            arr_dot = false
        }
        return arr_dot;
    }
    
    CosineSimilarity=(codemat_a, codemat_b)=>{
        // Cosine 相似度;向量关系一致，归一化之后如果相同，存在bug
        let dot_ab = this.ArrayDot(codemat_a, codemat_b);
        let dot_aa = this.ArrayDot(codemat_a,codemat_a);
        let dot_bb = this.ArrayDot(codemat_b,codemat_b);
        let cosine_par = dot_ab/(Math.sqrt(dot_aa)*Math.sqrt(dot_bb));
        return cosine_par;
    }
    
    TanimotoCoefficient=(codemat_a,codemat_b)=>{
        // Tanimoto系数
        let dot_ab = this.ArrayDot(codemat_a,codemat_b)
        let dot_aa = this.ArrayDot(codemat_a,codemat_a)
        let dot_bb = this.ArrayDot(codemat_b,codemat_b)
        // let tanimoto_coe = dot_ab/(Math.sqrt(dot_aa)+Math.sqrt(dot_bb)-dot_ab)
        let tanimoto_coe = dot_ab/(dot_aa+dot_bb-dot_ab)
        return tanimoto_coe
    
    }
    
    newArray2d = (rows, cols) => {
        // 创建指定大小的二维数组
        let newarray2d = new Array();
        for (let ii = 0; ii < rows; ii++) {
            newarray2d[ii] = new Array();
            for (let jj = 0; jj < cols; jj++) {
                newarray2d[ii][jj] = 0;
            }
        }
        return newarray2d;
    }
    
    minDTWDistance = (codemat_a, codemat_b, diagonal_factor) => {
        //	DTW 模板之间的最小距离
        let Mat_ab_dis = new Array(codemat_a.length)
        for (let ii=0;ii<codemat_a.length;ii++) {
            let Mat_ab_row = new Array(codemat_b.length)
            for (let jj=0;jj<codemat_b.length;jj++) {
                // console.log('单点距离', dis_ab)
                let dis_ab = Math.abs(codemat_a[ii]-codemat_b[jj])
                Mat_ab_row[jj] = dis_ab
            }
            Mat_ab_dis[ii] = Mat_ab_row
        }
        console.log('向量对应距离矩阵值', Mat_ab_dis)
        // 距离矩阵
        //	Mat_ab_dis=[[3,1,2,3],[2,3,6,2],[3,1,6,4],[4,5,3,3],[2,1,2,1]]
        // 求取最小值
        //	dwt_mat = []
        let dwt_mat = this.newArray2d(Mat_ab_dis.length, Mat_ab_dis[0].length)
        for (let ii=0;ii<Mat_ab_dis.length;ii++) {
            for (let jj=0;jj<Mat_ab_dis[0].length;jj++) {
                if (ii == 0 && jj == 0) {
                    dwt_mat[ii][jj] = Mat_ab_dis[ii][jj] * diagonal_factor
                }
                else if (ii == 0 && jj > 0) {
                    dwt_mat[ii][jj] = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
                }
                else if (ii > 0 && jj == 0) {
                    dwt_mat[ii][jj] = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
                }
                else {
                    let dwt_num1 = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
                    let dwt_num2 = dwt_mat[ii - 1][jj - 1] + Mat_ab_dis[ii][jj] * diagonal_factor
                    let dwt_num3 = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
                    let min_dwt_num = Math.min.apply(null, [dwt_num1, dwt_num2, dwt_num3])
                    dwt_mat[ii][jj] = min_dwt_num;
                }
            }
        }
        // console.log('累积最小距离矩阵', dwt_mat)
        return dwt_mat[codemat_a.length - 1][codemat_b.length - 1]
    }
    
    HausdorffDistance=(codemat_a,codemat_b)=>{
        // 豪斯多夫距离：描述点集之间相似程度的一种度量，
    }
    
    VectorAngleGet=(uniform_angle)=>{
        // 连续向量之间的角度偏转，逆时针为负，顺时针为正shào
        let vector_angle_mat = [];
        let part_turn_angle;
        for (let ii=0;ii<uniform_angle.length-1;ii++){
            if ((uniform_angle[ii]-uniform_angle[ii+1])>180){
                part_turn_angle = (uniform_angle[ii]-uniform_angle[ii+1])-360
            }
            else if ((uniform_angle[ii]-uniform_angle[ii+1])<-180){
                part_turn_angle = (uniform_angle[ii]-uniform_angle[ii+1])+360
            }
            else{
                part_turn_angle = (uniform_angle[ii]-uniform_angle[ii+1])
            }
            vector_angle_mat.push(Math.round(part_turn_angle*100)/100)
        }
        return vector_angle_mat;
    }
    
    DirectionCodeMode = (point_a, point_b, Modenum)=>{
        // 两点方向编码、顺时针、x+为0; Modenum为4的整数倍
        let length_x = point_b[0]-point_a[0];
        let length_y = point_b[1]-point_a[1];
        let half_angle = 360/(Modenum*2);
        // console.log('测试', point_a, point_b)
        var DirectNum; // 方向编码
        // 新增角度
        var DirectAngle; // 方向角度
        if (length_y>=0){
            if (point_a[0]==point_b[0]){
                DirectNum = Modenum/4*3
                DirectAngle = 90
                // console.log('x轴相同')
            }
            else{
                let Line_K = length_y/length_x
                if (length_x>0){
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100 //保留两位小数
                    for(let ii=0;ii<(Modenum/4+1);ii++){
                        if (ii==0){
                            if ((Line_K>=0)&&(Line_K<=Math.tan(half_angle/180*Math.PI))){
                                DirectNum = 0
                                break
                            }
                        }
                        else if(ii==(Modenum/4)){
                            if(Line_K>Math.tan((half_angle*(ii*2-1))/180*Math.PI)){
                                DirectNum = Modenum-ii
                                break
                            }
                        }
                        else{
                            if((Line_K>Math.tan((half_angle*(ii*2-1))/180*Math.PI))&&(Line_K<=Math.tan((half_angle*(ii*2+1))/180*Math.PI))){
                                DirectNum = Modenum-ii
                                break
                            }
                        }
                    }
                }
                else{
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100+180 //保留两位小数
                    for(let ii=0;ii<(Modenum/4+1);ii++){
                        if (ii==0){
                            if ((Line_K<=0)&&(Line_K>=Math.tan(-half_angle/180*Math.PI))){
                                DirectNum = Modenum/2
                                break
                            }
                        }
                        else if(ii==(Modenum/4)){
                            if(Line_K<Math.tan((-half_angle*(ii*2-1))/180*Math.PI)){
                                DirectNum = Modenum/2+ii
                                break
                            }
                        }
                        else{
                            if((Line_K<Math.tan((-half_angle*(ii*2-1))/180*Math.PI))&&(Line_K>=Math.tan((-half_angle*(ii*2+1))/180*Math.PI))){
                                DirectNum = Modenum/2+ii
                                break
                            }
                        }
                    }
                }         
            }
        }
        else{
            if (point_a[0]==point_b[0]){
                DirectNum = Modenum/4
                DirectAngle = -90
                // console.log('x轴相同')
            }
            else{
                let Line_K = length_y/length_x;
                if (length_x>0){
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100 //保留两位小数
                    // console.log('IV象限', DirectAngle)
                    // 分区求解
                    for(let ii=0;ii<(Modenum/4+1);ii++){
                        if (ii==0){
                            if ((Line_K<=0)&&(Line_K>=Math.tan(-half_angle/180*Math.PI))){
                                DirectNum = ii
                                break
                            }
                        }
                        else if(ii==(Modenum/4)){
                            if(Line_K<Math.tan((-half_angle*(ii*2-1))/180*Math.PI)){
                                DirectNum = ii
                                break
                            }
                        }
                        else{
                            if((Line_K<Math.tan((-half_angle*(ii*2-1))/180*Math.PI))&&(Line_K>=Math.tan((-half_angle*(ii*2+1))/180*Math.PI))){
                                DirectNum = ii
                                break
                            }
                        }
                    }
                }
                else{
                    DirectAngle = Math.round(Math.atan(Line_K)/Math.PI*180*100)/100-180 //保留两位小数
                    // 分区求解
                    // console.log('III象限', DirectAngle, Math.tan(DirectAngle/180*Math.PI))
                    for(let ii=0;ii<(Modenum/4+1);ii++){
                        if (ii==0){
                            if ((Line_K>=0)&&(Line_K<=Math.tan(half_angle/180*Math.PI))){
                                DirectNum = Modenum/2
                                break
                            }
                        }
                        else if(ii==(Modenum/4)){
                            if(Line_K>Math.tan((half_angle*(ii*2-1))/180*Math.PI)){
                                DirectNum = Modenum/2-ii
                                break
                            }
                        }
                        else{
                            if((Line_K>Math.tan((half_angle*(ii*2-1))/180*Math.PI))&&(Line_K<=Math.tan((half_angle*(ii*2+1))/180*Math.PI))){
                                DirectNum = Modenum/2-ii
                                break
                            }
                        }
                    }
                }            // 可以添加方向
            }
        }
        // console.log('方向编码', point_a, point_b, length_x, length_y, DirectNum)
        return [DirectNum, DirectAngle]
    }
    
    OneLineMatch=(letter_mat0, one_idx)=>{
        let new_mat = []
        let letter_mat = letter_mat0[1]
        if (letter_mat.indexOf(one_idx)>-1){
            // console.log('匹配索引', letter_mat.indexOf(one_idx))
            for (let ii=0;ii<letter_mat.length;ii++){
                if (ii !=letter_mat.indexOf(one_idx)){
                    new_mat.push(letter_mat[ii])
                }
            }
            return [letter_mat0[0],new_mat]
        }
        else{
            return [-1,new_mat]
        }
    }
    
    MoreLineMatch=(more_line_mat, one_idx)=>{
        let new_mat =[]
        let confirm_idx = []
        for (let ii=0;ii<more_line_mat.length;ii++){
            if (more_line_mat[ii][1].length==0){
                confirm_idx.push(more_line_mat[ii][0])
                // console.log('初步确定值', confirm_idx)
            }
            else{
                let new_mat_part = this.OneLineMatch(more_line_mat[ii],one_idx)
                // console.log('新索引及其新矩阵', new_mat_part)
                if (new_mat_part[0]>=0){
                    new_mat.push(new_mat_part)
                }
            }
        }
        // console.log('初步确定值', confirm_idx, '新索引及其新矩阵', new_mat)
        return[confirm_idx, new_mat]
    }
    
    StatusJudge=(confirm_num, more_match_mat)=>{
        // 判断是否继续进行下一个编码匹配:状态判定
        let status_flag = -1
        if (confirm_num.length>=1){
            // 已存在字母或数字判定
            // console.log('存在匹配判定，依次判断后续是否继续')
            if(more_match_mat.length<1){
                // console.log('存在判定，没有后续判定需要')
                status_flag = 1
            }
            else{
                // console.log('存在判定，继续后续判定')
                status_flag = 2
            }
        }
        else{
            // 不存在字母或数字判定
            if (more_match_mat.length<1){
                // 数据为空
                // console.log('数据为空，需要对后面的编码进行区域筛选，如果找不到，证明有漏写')
                status_flag = 3
            }
            else{
                // 继续进行二次判定
                // console.log('继续进行二次判定，直到出现confirm')
                status_flag = 4
            }
        }
        return status_flag
    }
    
    ArraySortMat=(combine_center)=>{
        // 排序及索引
        // let combine_center = [1,3,2,7,3,3]
        let combine_center2 = this.deepClone(combine_center, [])
        let center_sort = combine_center2.sort(function (x,y) {return x-y;})
        // console.log(['中心坐标x排序', center_sort])
        let index_sort = []
        for (let sort_ii=0;sort_ii<center_sort.length;sort_ii++){
            //	console.log([combine_center, center_sort[sort_ii]])
            for(let sort_jj=0; sort_jj<combine_center.length; sort_jj++){
                // console.log(typeof(sort_jj), combine_center[sort_jj])
                if (index_sort.indexOf(sort_jj)>=0){
                    continue
                }
                else{
                    if (center_sort[sort_ii] == combine_center[sort_jj]){
                        index_sort.push(sort_jj)
                    }
                }
            }
        }
        // console.log('索引', index_sort, typeof(index_sort[0]))
        // 返回小大排序及对应索引，相同坐标情况下，根据初始书写顺序计算序号索引
        return [center_sort, index_sort]
    }
    
    LimitedArraySort = (data_mat, limited_num)=>{
        // 原始数据，限定提取排序数目
        let data_value_mat = []
        let data_idx_mat = []
        if(data_mat.length<limited_num){
            for(let ii=0;ii<data_mat.length;ii++){
                data_value_mat.push(data_mat[ii])
                data_idx_mat.push(ii)
            }
        }
        else{
            for(let ii=0;ii<limited_num;ii++){
                data_value_mat.push(data_mat[ii])
                data_idx_mat.push(ii)
            }
            for(let ii=limited_num;ii<data_mat.length;ii++){
                let max_data_value=Math.max.apply(null,data_value_mat)
                if(data_mat[ii]<max_data_value){
                    let mat_dat_idx = data_value_mat.indexOf(max_data_value)
                    data_value_mat[mat_dat_idx] = data_mat[ii]
                    data_idx_mat[mat_dat_idx] = ii
                }
            }
        }
        let sort_data_value_mat = this.ArraySortMat(data_value_mat)
        let sort_data_idx_mat=[]
        for(let ii=0;ii<sort_data_value_mat[1].length;ii++){
            sort_data_idx_mat.push(data_idx_mat[sort_data_value_mat[1][ii]])
        }
        console.log('限定排序', JSON.stringify([sort_data_value_mat[0],sort_data_idx_mat]))
        return[sort_data_value_mat[0],sort_data_idx_mat]
    }

    minDTWDistance16 = (codemat_a, codemat_b, diagonal_factor) => {
        //	DTW 模板之间的最小距离
        let fast_num=3 // 快速？只取中间主要部分
        let Mat_ab_dis = new Array(codemat_a.length)
        for (let ii=0;ii<codemat_a.length;ii++) {
            let Mat_ab_row = new Array(codemat_b.length)
            for (let jj=0;jj<codemat_b.length;jj++) {
                // console.log('单点距离', dis_ab)
                if ((jj>(ii+fast_num)) || (jj<(ii-fast_num))){
                    //对边缘值取加大值
                    Mat_ab_row[jj] = 20
                }
                else {
                    let dis_ab = Math.abs(codemat_a[ii]-codemat_b[jj])
                    // 修改两点间的距离，保持周期性，以16为周期，绝对差距不超过8
                    if (dis_ab<=8){
                        Mat_ab_row[jj] = dis_ab
                    }
                    else{
                        Mat_ab_row[jj] = 16-dis_ab
                    }
                }
                
            }
            Mat_ab_dis[ii] = Mat_ab_row
        }
        // console.log('向量对应距离矩阵值', Mat_ab_dis)
        // 距离矩阵
        //	Mat_ab_dis=[[3,1,2,3],[2,3,6,2],[3,1,6,4],[4,5,3,3],[2,1,2,1]]
        // 求取最小值
        //	dwt_mat = []
        let dwt_mat = this.newArray2d(Mat_ab_dis.length, Mat_ab_dis[0].length)
        // console.log('dwt_mat', JSON.stringify(dwt_mat))
        for (let ii=0;ii<Mat_ab_dis.length;ii++) {
            for (let jj=0;jj<Mat_ab_dis[ii].length;jj++) {
                if (ii == 0 && jj == 0) {
                    dwt_mat[ii][jj] = Mat_ab_dis[ii][jj] * diagonal_factor
                }
                else if (ii == 0 && jj > 0) {
                    dwt_mat[ii][jj] = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
                }
                else if (ii > 0 && jj == 0) {
                    dwt_mat[ii][jj] = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
                }
                else {
                    let dwt_num1 = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
                    let dwt_num2 = dwt_mat[ii - 1][jj - 1] + Mat_ab_dis[ii][jj] * diagonal_factor
                    let dwt_num3 = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
                    let min_dwt_num = Math.min.apply(null, [dwt_num1, dwt_num2, dwt_num3])
                    dwt_mat[ii][jj] = min_dwt_num;
                }
            }
        }
        // console.log('累积最小距离矩阵', JSON.stringify(dwt_mat))
        return dwt_mat[codemat_a.length - 1][codemat_b.length - 1]
    }

    minDistance16 = (codemat_a, codemat_b) => {
        //	模板之间的最小距离:直接点对点
        let Mat_ab_dis = 0
        let Mat_ab_mat = []
        for (let ii=0;ii<codemat_a.length;ii++) {
            let dis_ab = Math.abs(codemat_a[ii]-codemat_b[ii])
            // 修改两点间的距离，保持周期性，以16为周期，绝对差距不超过8
            if (dis_ab<=8){
                if (dis_ab>8){
                    Mat_ab_dis += 1000
                }
                else{
                    Mat_ab_dis += dis_ab
                }
                Mat_ab_mat.push(dis_ab)
            }
            else{
                if ((16-dis_ab)>8){
                    Mat_ab_dis += 1000
                }
                else{
                    Mat_ab_dis += 16-dis_ab
                }
                
                Mat_ab_mat.push(16-dis_ab)
            }
        }
        return [Mat_ab_dis,Mat_ab_mat]
    }

    minAngle360 = (codemat_a, codemat_b)=>{
        //	模板之间角度的最小距离:直接点对点
        let Mat_ab_dis = 0
        let Mat_ab_mat = []
        for (let ii=0;ii<codemat_a.length;ii++) {
            let dis_ab = Math.abs(codemat_a[ii]-codemat_b[ii])
            // 修改两点间的距离，保持周期性，以16为周期，绝对差距不超过8
            if (dis_ab<=180){
                if (dis_ab>180){
                    Mat_ab_dis += 1000
                }
                else{
                    Mat_ab_dis += dis_ab
                }
                Mat_ab_mat.push(dis_ab)
            }
            else{
                if ((360-dis_ab)>180){
                    Mat_ab_dis += 1000
                }
                else{
                    Mat_ab_dis += 360-dis_ab
                }
                
                Mat_ab_mat.push(360-dis_ab)
            }
        }
        return [Mat_ab_dis,Mat_ab_mat]
    }

    RegionCombine=(part_region_mat)=>{
        let part_combine_region = []
        for (let ii=0;ii<part_region_mat.length-1;ii++){
            for(let jj=ii+1;jj<part_region_mat.length;jj++){
                let part_all_region = []
                part_all_region.push(part_region_mat[ii])
                part_all_region.push(part_region_mat[jj])
                let all_region_mat001 = this.AllLineRegion(part_all_region)
                part_combine_region.push(all_region_mat001)
            }
        }
        // console.log('组合区域combine', part_combine_region)
        return part_combine_region
    }
    
    CompareRegion=(all_region,part_region)=>{
        let all_region_y = all_region[3]-all_region[2]+1
        let judg_num = 0
        for (let ii=0;ii<part_region.length;ii++){
            let part_region_y = part_region[ii][3]-part_region[ii][2]+1
            // console.log('区域比对',part_region.length, all_region_y, part_region_y)
            if (part_region_y>all_region_y*0.7){
                judg_num +=1
            }
        }
        if (judg_num< part_region.length){
            return 0
        }
        else{
            return 1
        }
    }
    
    StatisticsPoints=(part_line_mat)=>{
        // 统计x方向和y方向的数据点
        // console.log(part_line_mat)
        let x_min = Math.min.apply(null, part_line_mat[0])
        let x_max = Math.max.apply(null, part_line_mat[0])
        let y_min = Math.min.apply(null, part_line_mat[1])
        let y_max = Math.max.apply(null, part_line_mat[1])
        let x_stat_mat = new Array(x_max-x_min+1).fill(0)
        let y_stat_mat = new Array(y_max-y_min+1).fill(0)
        let statics_xy_mat = [] //已统计数据点
        for (let ii=0;ii<part_line_mat[0].length;ii++){
            // 添加重复点数据
            let statics_flag = 0
            for(let jj=0;jj<statics_xy_mat.length;jj++){
                if ((Math.pow(statics_xy_mat[jj][0]-part_line_mat[0][ii],2)+
                     Math.pow(statics_xy_mat[jj][1]-part_line_mat[1][ii],2))<1){
                    statics_flag = 1
                    break
                }
            }
            if (statics_flag==0){
                x_stat_mat[part_line_mat[0][ii]-x_min] +=1 
                y_stat_mat[part_line_mat[1][ii]-y_min] +=1 
                statics_xy_mat.push([part_line_mat[0][ii], part_line_mat[1][ii]])
            }
        }
        return [x_stat_mat, y_stat_mat]
    }
    
    DirectionTransform=(line_direct_mat,Max_num)=>{
        // 方向转换
        let line_t_mat = []
        for (let ii=0;ii<line_direct_mat.length;ii++){
            if(line_direct_mat[ii]<=8){
                line_t_mat.push(line_direct_mat[ii])
            }
            else{
                line_t_mat.push(line_direct_mat[ii]-Max_num)
            }
        }
        return line_t_mat
    }
    
    StdAndVariance = (num_mat)=>{
        // 统计均值和方差
        let mat_mean = 0;  
        let sum = 0;  
        for(let ii=0;ii<num_mat.length;ii++){  
            sum +=num_mat[ii];  
        }  
        mat_mean = sum /num_mat.length; 
        mat_mean = Math.round(mat_mean *100)/100
        sum = 0;  
        for(let ii=0;ii<num_mat.length;ii++){  
            sum += Math.pow(num_mat[ii] - mat_mean , 2);  
        }
        let mat_var = Math.sqrt(sum / (num_mat.length-1))
        return [mat_mean, Math.round(mat_var*100)/100]
    }
    
    JudgeTwoLineRelation=(line_data0, line_data1)=>{
        let part_line0_1 = this.DataToHeavy(line_data0)
        let part_line0_2 = this.matInterpolation2(part_line0_1)
        let part_line1_1 = this.DataToHeavy(line_data1)
        let part_line1_2 = this.matInterpolation2(part_line1_1)
        let line_idx = []
        // console.log('处理数据', part_line0_2.length, part_line1_2.length)
        for(let ii=0;ii<part_line0_2[0].length-1;ii++){
            let point_a1 = [part_line0_2[0][ii],part_line0_2[1][ii]]
            let point_a2 = [part_line0_2[0][ii+1],part_line0_2[1][ii+1]]
            // console.log('point_a1',point_a1, ii)
                for(let jj=0;jj<part_line1_2[0].length-1;jj++){
                let point_b1 = [part_line1_2[0][jj],part_line1_2[1][jj]]
                let point_b2 = [part_line1_2[0][jj+1],part_line1_2[1][jj+1]]
                let min_x = Math.min(point_a1[0], point_a2[0], point_b1[0], point_b2[0])
                let max_x = Math.max(point_a1[0], point_a2[0], point_b1[0], point_b2[0])
                let min_y = Math.min(point_a1[1], point_a2[1], point_b1[1], point_b2[1])
                let max_y = Math.max(point_a1[1], point_a2[1], point_b1[1], point_b2[1])
                if((max_x-min_x)<=1 && (max_y-min_y)<=1){
                    // console.log('找到相交点', ii, jj)
                    line_idx.push([ii,jj])
                    // console.log('a1',point_a1,point_a2)
                    // console.log('b1',point_b1,point_b2)
                }
                else if((point_a1[0]==point_b1[0])&&(point_a1[1]==point_b1[1])){
                    line_idx.push([ii,jj])
                    // console.log('a2',point_a1,point_a2)
                    // console.log('b2',point_b1,point_b2)
                }
                else if((point_a1[0]==point_b2[0])&&(point_a1[1]==point_b2[1])){
                    line_idx.push([ii,jj])
                    // console.log('a3',point_a1,point_a2)
                    // console.log('b3',point_b1,point_b2)
                }
                else if((point_a2[0]==point_b1[0])&&(point_a2[1]==point_b1[1])){
                    line_idx.push([ii,jj])
                    // console.log('a4',point_a1,point_a2)
                    // console.log('b4',point_b1,point_b2)
                }
                else if((point_a2[0]==point_b2[0])&&(point_a2[1]==point_b2[1])){
                    line_idx.push([ii,jj])
                    // console.log('a5',point_a1,point_a2)
                    // console.log('b5',point_b1,point_b2)
                }
            }
        }
        // 判断两笔相交区间确定
        // let line0_ratio = (line_idx[0]+1)/part_line0_2[0].length
        // let line1_ratio = (line_idx[1]+1)/part_line1_2[0].length
        // let cross_flag = 0
        // if ((line0_ratio>0.1 && line0_ratio <0.9)&&(line1_ratio>0.1 && line1_ratio <0.9)){
        // 	// console.log('判定为×')
        // 	cross_flag = 1
        // }
        // return cross_flag
        // console.log('相交点索引矩阵', line_idx)
        let threshold_dis = 3 //距离在这个范围以内的值认为是相切
        let cross_code, ratio_line0, ratio_line1,point_cross_num;
        if (line_idx.length<1){
            // 直接求解各点线之间的最小距离并返回对应索引
            let dis_mat = []
            let dis_idx = []
            for(let ii=0;ii<part_line0_2[0].length-1;ii++){
                let point_a1 = [part_line0_2[0][ii],part_line0_2[1][ii]]
                let part_dis_mat = []
                for(let jj=0;jj<part_line1_2[0].length-1;jj++){
                    let point_b1 = [part_line1_2[0][jj],part_line1_2[1][jj]]
                    let point_dis = Math.round(Math.sqrt(Math.pow(point_a1[0]-point_b1[0],2)+Math.pow(point_a1[1]-point_b1[1],2))*1000)/1000
                    part_dis_mat.push(point_dis)
                }
                let dis_min = Math.min(...part_dis_mat);
                // console.log('最小值', dis_min); //6
                let minIndex = part_dis_mat.findIndex((item, index) => {
                    return item == dis_min;
                });
                // console.log('索引', minIndex);//2
                dis_mat.push(dis_min)
                dis_idx.push(minIndex)
            }
            let all_dis_min = Math.min(...dis_mat)
            // console.log('全局最小值', all_dis_min); //6
            let allminIndex = dis_mat.findIndex((item, index) => {
                return item == all_dis_min;
                // 提取最小值索引，只找一个索引：细化分类很多
            });
            // console.log('全局索引', 'line0', allminIndex, 'line1', dis_idx[allminIndex]);//2
            if (all_dis_min<=threshold_dis){
                // 相切判断
                // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值
                cross_code=0
                point_cross_num = 1
            }
            else{
                cross_code=-1
                point_cross_num = 0
            }
            ratio_line0 = (allminIndex+1)/part_line0_2[0].length
            ratio_line1 = (allminIndex+1)/part_line1_2[0].length
            return [cross_code, ratio_line0, ratio_line1, all_dis_min,point_cross_num]
        }
        else{
            // 对索引分组 相差为1范围内
            let group_mat = []
            let part_group = []
            part_group.push(line_idx[0])
            for(let ii=1;ii<line_idx.length;ii++){
                let part_idx = line_idx[ii]
                // console.log(ii, part_group, part_idx, Math.abs(part_group[part_group.length-1][0]-part_idx[0])<=1, Math.abs(part_group[part_group.length-1][1]-part_idx[1])<=1)
                if (Math.abs(part_group[part_group.length-1][0]-part_idx[0])<=1 && Math.abs(part_group[part_group.length-1][1]-part_idx[1])<=1){
                    part_group.push(part_idx) 
                }
                else{
                    group_mat.push(part_group)
                    part_group = []
                    part_group.push(part_idx)
                    // console.log(part_group)
                }
                if (ii == line_idx.length-1){
                    group_mat.push(part_group)
                }
            }
            // console.log(group_mat)
            let cross_idx_mat = []
            for(let ii=0;ii<group_mat.length;ii++){
                let sum_line0_idx = 0
                let sum_line1_idx = 0
                for (let jj=0;jj<group_mat[ii].length;jj++){
                    sum_line0_idx +=group_mat[ii][jj][0]
                    sum_line1_idx +=group_mat[ii][jj][1]
                }
                let sub_line0_ixd = Math.round(sum_line0_idx/group_mat[ii].length)
                let sub_line1_ixd = Math.round(sum_line1_idx/group_mat[ii].length)
                cross_idx_mat.push([sub_line0_ixd, sub_line1_ixd])
            }
            // console.log('交点索引矩阵', cross_idx_mat)
            if (cross_idx_mat.length==1){
                // 只存在一组交点
                ratio_line0 = (cross_idx_mat[0][0]+1)/part_line0_2[0].length
                ratio_line1 = (cross_idx_mat[0][1]+1)/part_line1_2[0].length
                if (ratio_line0<0.95 && ratio_line0>0.05 && ratio_line1<0.95 && ratio_line1>0.05){
                    // 判断相交
                    cross_code = 1
                }
                else{
                    cross_code = 0
                }
                return [cross_code, ratio_line0, ratio_line1, 0, cross_idx_mat.length]
            }
            else{
                // 存在多个交点直接直接判定相交
                cross_code = 1
                return [cross_code, 2, 2, 0, cross_idx_mat.length]
    
            }
        }
    } 
    
    CommonAreaRatio = (mat_m,mat_s)=>{
        // 第一组为母、第二组为子
        let common_ratio
        let common_direction // -1,0,1;左、中、右
        if(mat_m[1]<mat_s[0]){
            // 两侧、横向无相交
            // console.log('横向判断无相交')
            common_ratio = 0 
            common_direction = -1
        }
        else if(mat_s[1]<mat_m[0]){
            // 两侧、横向无相交
            // console.log('横向判断无相交')
            common_ratio = 0
            common_direction = -1 
        }
        else{
            // 有相交
            if(mat_m[0]<=mat_s[0]&&mat_s[1]<=mat_m[1]){
                // console.log("全相交")
                common_ratio = 1
                common_direction=0
            }
            else if(mat_m[0]<=mat_s[0]&&mat_s[1]>mat_m[1]){
                // 子左区域在内
                common_ratio = (mat_m[1] - mat_s[0] +1)/(mat_s[1] - mat_s[0]+1)
                common_direction = 1
            }
            else{
                // 子右区域在内
                common_ratio = ( mat_s[1] - mat_m[0]+1)/(mat_s[1] - mat_s[0]+1)
                common_direction =-1
            }
        }
        return [common_ratio, common_direction]
    }

    TwoRegionRatio=(mat_a, mat_b)=>{
        // 确定主次/
        let compare_mat;
        if ((mat_a[1]-mat_a[0])>=(mat_b[1]-mat_b[0])){
            compare_mat = this.TwoRegionMainSubRatio(mat_a, mat_b)
        }
        else{
            compare_mat = this.TwoRegionMainSubRatio(mat_b, mat_a)
        }
        return compare_mat
    }

    TwoRegionMainSubRatio = (mat_m,mat_s)=>{
        // 第一组为母(横向较大)、第二组为子(横向较小)
        let common_ratio
        let common_direction // -1,0,1;左、中、右
        if(mat_m[1]<mat_s[0]){
            // 两侧、横向无相交
            // 次在右
            // console.log('横向判断无相交')
            common_ratio = 0 
            common_direction = 1
        }
        else if(mat_s[1]<mat_m[0]){
            // 两侧、横向无相交
            // 次在左
            // console.log('横向判断无相交')
            common_ratio = 0
            common_direction = -1 
        }
        else{
            // 有相交
            if(mat_m[0]<=mat_s[0]&&mat_m[1]>=mat_s[1]){
                // console.log("全相交")
                // 次在中
                common_ratio = 1
                common_direction=0
            }
            else if(mat_m[0]<=mat_s[0]&&mat_m[1]<mat_s[1]){
                // 子右区域在内
                common_ratio = (mat_m[1] - mat_s[0] +1)/(mat_s[1] - mat_s[0]+1)
                common_direction = 1
            }
            else if(mat_m[0]>=mat_s[0]&&mat_m[1]>mat_s[1]){
                // 子左区域在内
                common_ratio = ( mat_s[1] - mat_m[0]+1)/(mat_s[1] - mat_s[0]+1)
                common_direction =-1
            }
            else{
                // 有误
                common_ratio = 0
                common_direction = 0
            }
        }
        return [common_ratio, common_direction]
    }

    TwoRegionDistanceMat=(mat_a, mat_b)=>{
        let dis_mat =[]
        dis_mat.push(Math.abs(mat_a[0]-mat_b[0]))
        dis_mat.push(Math.abs(mat_a[0]-mat_b[1]))
        dis_mat.push(Math.abs(mat_a[1]-mat_b[0]))
        dis_mat.push(Math.abs(mat_a[1]-mat_b[1]))
        let min_dis = Math.min.apply(null,dis_mat)
        return [min_dis, dis_mat]
    }

    PartLineCode = (part_line_mat,split_num)=>{
        let part_line_heavy_mat = this.DataToHeavy(part_line_mat);
        let part_line_interpolation_mat = this.matInterpolation(part_line_heavy_mat)
        let part_line_idx_mat = this.UniformSplit([0, part_line_interpolation_mat[0].length-1], split_num)
        let [uniform_direct, uniform_angle]=this.UniformDirection(part_line_interpolation_mat, part_line_idx_mat)
        return uniform_direct;
    }

    BaseSingleStrokeProcess=(base_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        console.log('单笔code', part_line_code)
        let min_model_mat = []
        for (let ii=0;ii<base_strokes_code.length;ii++){
            // 每笔不同写法下判定
            let part_model_mat = base_strokes_code[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_code = part_model_mat[jj]
                    let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        return dis_idx[0]
    }

    SingleChoiceABCD = (all_line_mat)=>{
        // 单选ABCD识别
        // 求解每笔的方向编码
        // console.log('class', all_line_mat)
        let all_line_code = []
        for (let ii=0;ii<all_line_mat.length;ii++){
            let part_line_mat = all_line_mat[ii];
            let part_line_code = this.PartLineCode(part_line_mat, 26)
            all_line_code.push(part_line_code)
        }
        console.log('all_line_mat方向统计', all_line_code.length)
        // 模型数据对比
        let choice_model_mat;
        if (all_line_code.length>=3){
            choice_model_mat = letter_modle_mat[2]
        }
        else{
            choice_model_mat = letter_modle_mat[all_line_code.length-1]
        }
        // 对比
        let min_model_mat = []
        for (let ii=0;ii<choice_model_mat.length;ii++){
            // 每个字母
            let part_model_mat = choice_model_mat[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_dis_mat = 0
                    let part_code_mat = part_model_mat[jj]
                    for (let kk=0;kk<part_code_mat.length;kk++){
                        // 对应笔画顺序
                        let test_line_code = all_line_code[kk]
                        let model_line_code = part_code_mat[kk]
                        let part_dwt_dis = this.minDTWDistance16(test_line_code,model_line_code,1)
                        part_model_dis_mat += part_dwt_dis
                    }
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        let abcd_str
        if (dis_idx[0]==0){
            // console.log('手写单个字母为：A')
            abcd_str = '手写单个字母为：A'
        }
        else if (dis_idx[0]==1){
            // console.log('手写单个字母为：B')
            abcd_str = '手写单个字母为：B'

        }
        else if (dis_idx[0]==2){
            // console.log('手写单个字母为：C')
            abcd_str = '手写单个字母为：C'

        }
        else if (dis_idx[0]==3){
            // console.log('手写单个字母为：D')
            abcd_str = '手写单个字母为：D'
        }
        return abcd_str;
    }

    MultiChoiceABCD = (all_line_mat)=>{
        // 多选ABCD识别/、删除
        // 求解每笔的方向编码
        console.log('多选题', all_line_mat)
        let all_line_idx = []
        let all_line_str = []
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let base_height=0
        for (let ii=0;ii<all_line_mat.length;ii++){
            let part_line_mat = all_line_mat[ii];
            let part_line_idx = this.BaseSingleStrokeProcess(multi_letter_single_mat[1], part_line_mat)
            all_line_idx.push(part_line_idx)
            // console.log('单线方向统计', part_line_idx)
            all_line_str.push(multi_letter_single_mat[0][part_line_idx])
            let part_line_region = this.partLineRegion(part_line_mat)
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            if ((part_line_region[3]-part_line_region[2])>base_height){
                base_height = (part_line_region[3]-part_line_region[2])
            }
        }
        console.log('all_line_mat匹配索引', all_line_idx)
        console.log('基准高度', base_height)
        // multi_letter_single_mat
        // 找到单笔最佳匹配
        let center_x_sort_mat = this.ArraySortMat(part_line_center_x_mat)
        let all_line_idx_sort = []
        let all_line_str_sort = []
        let part_line_region_mat_sort = []
        for (let ii=0;ii<center_x_sort_mat[1].length;ii++){
            all_line_idx_sort.push(all_line_idx[center_x_sort_mat[1][ii]])
            all_line_str_sort.push(all_line_str[center_x_sort_mat[1][ii]])
            part_line_region_mat_sort.push(part_line_region_mat[center_x_sort_mat[1][ii]])
        }
        // 如果没有删除考虑：直接根据排序生成
        let combine_str_mat = []
        for (let ii=0;ii<all_line_idx_sort.length;ii++){
            console.log('ii', ii)
            if(all_line_idx_sort[ii]<=3){
                // 直接判断1笔的字符
                combine_str_mat.push(all_line_str_sort[ii])
            }
            else{
                // 分别考虑连续3笔/连续两笔/单笔的字符串识别
                if(ii<all_line_idx_sort.length-2){
                    // 连续三笔/两笔/一笔
                    let rec_idx_1 = all_line_idx_sort[ii]
                    let rec_idx_2 = all_line_idx_sort[ii+1]
                    let rec_idx_3 = all_line_idx_sort[ii+2]
                    let tansverse_num = 0
                    if (rec_idx_1==6){
                        tansverse_num +=1
                    }
                    if (rec_idx_2==6){
                        tansverse_num +=1
                    }
                    if (rec_idx_3==6){
                        tansverse_num +=1
                    }
                    if([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(6)>=0 &&
                        ([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(4)>=0||[rec_idx_1, rec_idx_2, rec_idx_3].indexOf(5)>=0||[rec_idx_1, rec_idx_2, rec_idx_3].indexOf(7)>=0)&&
                        ([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(8)<0 && [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(9)<0 &&
                         [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(10)<0 && [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(11)<0)&&
                         tansverse_num==1){
                        combine_str_mat.push('A')
                        ii = ii+2
                        }
                    // 只看前两笔:A
                    else if((([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(11)>=0)||
                             ([rec_idx_1, rec_idx_2].indexOf(10)>=0&&[rec_idx_1, rec_idx_2].indexOf(6)>=0)){
                        combine_str_mat.push('A')
                        ii = ii+1
                    }
                    // 只看两笔：B
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(8)>=0){
                        combine_str_mat.push('B')
                        ii = ii+1
                    }
                    // 只看两笔：D
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(9)>=0){
                        combine_str_mat.push('D')
                        ii = ii+1
                    }
                    else{
                        combine_str_mat.push(all_line_str_sort[ii])
                        // ii = ii+1
                    }              
                }
                else if(ii<all_line_idx_sort.length-1){
                    // 连续两笔/一笔
                    // 只看前两笔:A
                    let rec_idx_1 = all_line_idx_sort[ii]
                    let rec_idx_2 = all_line_idx_sort[ii+1]
                    console.log('连续两组索引', rec_idx_1, rec_idx_2)
                    if((([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(11)>=0)||
                             ([rec_idx_1, rec_idx_2].indexOf(10)>=0&&[rec_idx_1, rec_idx_2].indexOf(6)>=0)){
                        console.log('识别两笔A')
                        combine_str_mat.push('A')
                        ii = ii+1
                    }
                    // 只看两笔：B
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(8)>=0){
                        console.log('识别两笔B')
                        combine_str_mat.push('B')
                        ii = ii+1
                    }
                    // 只看两笔：D
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(9)>=0){
                        console.log('识别两笔D')
                        combine_str_mat.push('D')
                        ii = ii+1
                    }
                    else{
                        combine_str_mat.push(all_line_str_sort[ii])
                        // ii = ii+1
                    } 
                }
                else{
                    // 最后一笔
                    combine_str_mat.push(all_line_str_sort[ii])
                    // ii = ii+1
                }
            }
        }
        // 考虑删除修改因素，根据横向区域的重叠
        let combine_region_mat = []
        let combine_idx_mat = []
        for (let ii=0;ii<part_line_region_mat_sort.length;ii++){
            if(ii==0){
                combine_region_mat.push(part_line_region_mat_sort[ii])
                combine_idx_mat.push([all_line_idx_sort[ii]])
            }
            else{
                let common_region_mat = []
                let common_idx_mat = []
                let start_idx = -1
                for(let jj=0;jj<combine_region_mat.length;jj++){
                    let common_region_ratio = this.TwoRegionRatio([part_line_region_mat_sort[ii][0],part_line_region_mat_sort[ii][1]],
                                                                  [combine_region_mat[jj][0],combine_region_mat[jj][1]])
                    let common_region_ratio_y = this.TwoRegionRatio([part_line_region_mat_sort[ii][2],part_line_region_mat_sort[ii][3]],
                                                                  [combine_region_mat[jj][2],combine_region_mat[jj][3]])
                                                                                                                
                    if (common_region_ratio[0]>0 && common_region_ratio_y[0]>0){
                        // 横向有公共区域
                        if(common_region_mat.length<1){
                            start_idx = jj
                        }
                        common_region_mat.push(combine_region_mat[jj])
                        common_idx_mat.push(combine_idx_mat[jj])

                    }
                }
                if(common_region_mat.length>0){
                    // 存在相交
                    common_region_mat.push(part_line_region_mat_sort[ii])
                    common_idx_mat.push(all_line_idx_sort[ii])
                    let new_region_mat = this.AllLineRegion(common_region_mat)
                    let new_idx_mat = common_idx_mat.flat()
                    combine_region_mat.splice(start_idx,common_region_mat.length-1,new_region_mat)
                    combine_idx_mat.splice(start_idx,common_region_mat.length-1,new_idx_mat)
                }
                else{
                    // 直接添加
                    combine_region_mat.push(part_line_region_mat_sort[ii])
                    combine_idx_mat.push([all_line_idx_sort[ii]])
                }
            }
            console.log('组合combine_region_mat、combine_idx_mat', combine_region_mat, combine_idx_mat)
        }
        // 筛选
        let filter_flag=1
        while(filter_flag>0){
            filter_flag = 0
            for(let ii=0;ii<combine_idx_mat.length;ii++){
                console.log('combine_region_mat[ii]', JSON.stringify(combine_idx_mat[ii]))
                if(combine_idx_mat[ii].length>3){
                    console.log('数据超阈值')
                    combine_region_mat.splice(ii,1,)
                    combine_idx_mat.splice(ii,1,)
                    filter_flag=1
                    break
                }
                else if(combine_idx_mat[ii].length==3){
                    // 考虑两笔数据里删除的情况:A、B、D
                    if(combine_idx_mat[ii].indexOf(8)>=0||combine_idx_mat[ii].indexOf(9)>=0||
                       combine_idx_mat[ii].indexOf(10)>=0||combine_idx_mat[ii].indexOf(11)>=0){
                        console.log('数据ABD')  
                        combine_region_mat.splice(ii,1,)
                        combine_idx_mat.splice(ii,1,)
                        filter_flag=1
                        break
                       }
                }
                else if(combine_idx_mat[ii].length==2){
                   // 考虑1笔数据里删除的情况:A、B、D
                   if(combine_idx_mat[ii].indexOf(0)>=0||combine_idx_mat[ii].indexOf(1)>=0||
                      combine_idx_mat[ii].indexOf(2)>=0||combine_idx_mat[ii].indexOf(3)>=0){
                        console.log('数据ABCD单笔')
                        combine_region_mat.splice(ii,1,)
                        combine_idx_mat.splice(ii,1,)
                        filter_flag=1
                        break
                    } 
                }
            }
            console.log('筛选', JSON.stringify(combine_region_mat), JSON.stringify(combine_idx_mat) )
        }
        // 重组 
        let recombine_str_mat = []
        let recombine_num_mat = []
        for(let ii=0;ii<combine_idx_mat.length;ii++){
            if (combine_idx_mat[ii].length==3){
                // 直接A；可以考虑A的筛选
                recombine_str_mat.push('A')
                recombine_num_mat.push(0)
            }
            else if(combine_idx_mat[ii].length==2){
                // 直接A；可以考虑A的筛选
                let rec_idx_1 = combine_idx_mat[ii][0]
                let rec_idx_2 = combine_idx_mat[ii][1]
                console.log('连续两组索引', rec_idx_1, rec_idx_2)
                if((([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                     [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(11)>=0)||
                    ([rec_idx_1, rec_idx_2].indexOf(10)>=0&&[rec_idx_1, rec_idx_2].indexOf(6)>=0)){
                    console.log('识别两笔A')
                    recombine_str_mat.push('A')
                    recombine_num_mat.push(0)
                }
                // 只看两笔：B
                else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                         [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(8)>=0){
                    console.log('识别两笔B')
                    recombine_str_mat.push('B')
                    recombine_num_mat.push(1)
                }
                // 只看两笔：D
                else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                        [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(9)>=0){
                    console.log('识别两笔D')
                    recombine_str_mat.push('D')
                    recombine_num_mat.push(3)
                }
                else{
                    recombine_str_mat.push(multi_letter_single_mat[0][combine_idx_mat[ii][0]])
                    recombine_str_mat.push(multi_letter_single_mat[0][combine_idx_mat[ii][1]])                    // ii = ii+1
                    recombine_num_mat.push(combine_idx_mat[ii][0])
                    recombine_num_mat.push(combine_idx_mat[ii][1])
                }
            }
            else{
                recombine_num_mat.push(combine_idx_mat[ii][0])
                if (combine_idx_mat[ii][0]==0){
                    recombine_str_mat.push('A')
                }
                else if(combine_idx_mat[ii][0]==1){
                    recombine_str_mat.push('B')
                }
                else if(combine_idx_mat[ii][0]==2){
                    recombine_str_mat.push('C')
                }
                else if(combine_idx_mat[ii][0]==3){
                    recombine_str_mat.push('D')
                }
                else{
                    recombine_str_mat.push(multi_letter_single_mat[0][combine_idx_mat[ii][0]])
                }
            }
        }
        let recombine_str_mat_2nd = this.LetterABCDIdxCombine(recombine_num_mat, recombine_str_mat)

        return [all_line_idx_sort, '\n', all_line_str_sort,'\n',combine_str_mat,'\n',recombine_str_mat,'\n',recombine_num_mat, '\n', recombine_str_mat_2nd]
    }

    LetterABCDIdxCombine=(all_line_idx_sort,all_line_str_sort)=>{
        // 根据索引重组/识别
        let combine_str_mat = []
        for (let ii=0;ii<all_line_idx_sort.length;ii++){
            console.log('ii', ii)
            if(all_line_idx_sort[ii]<=3){
                // 直接判断1笔的字符
                combine_str_mat.push(all_line_str_sort[ii])
            }
            else{
                // 分别考虑连续3笔/连续两笔/单笔的字符串识别
                if(ii<all_line_idx_sort.length-2){
                    // 连续三笔/两笔/一笔
                    let rec_idx_1 = all_line_idx_sort[ii]
                    let rec_idx_2 = all_line_idx_sort[ii+1]
                    let rec_idx_3 = all_line_idx_sort[ii+2]
                    let tansverse_num = 0
                    if (rec_idx_1==6){
                        tansverse_num +=1
                    }
                    if (rec_idx_2==6){
                        tansverse_num +=1
                    }
                    if (rec_idx_3==6){
                        tansverse_num +=1
                    }
                    if([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(6)>=0 &&
                        ([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(4)>=0||[rec_idx_1, rec_idx_2, rec_idx_3].indexOf(5)>=0||[rec_idx_1, rec_idx_2, rec_idx_3].indexOf(7)>=0)&&
                        ([rec_idx_1, rec_idx_2, rec_idx_3].indexOf(8)<0 && [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(9)<0 &&
                         [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(10)<0 && [rec_idx_1, rec_idx_2, rec_idx_3].indexOf(11)<0)&&
                         tansverse_num==1){
                        combine_str_mat.push('A')
                        ii = ii+2
                        }
                    // 只看前两笔:A
                    else if((([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(11)>=0)||
                             ([rec_idx_1, rec_idx_2].indexOf(10)>=0&&[rec_idx_1, rec_idx_2].indexOf(6)>=0)){
                        combine_str_mat.push('A')
                        ii = ii+1
                    }
                    // 只看两笔：B
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(8)>=0){
                        combine_str_mat.push('B')
                        ii = ii+1
                    }
                    // 只看两笔：D
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(9)>=0){
                        combine_str_mat.push('D')
                        ii = ii+1
                    }
                    else{
                        combine_str_mat.push(all_line_str_sort[ii])
                        // ii = ii+1
                    }              
                }
                else if(ii<all_line_idx_sort.length-1){
                    // 连续两笔/一笔
                    // 只看前两笔:A
                    let rec_idx_1 = all_line_idx_sort[ii]
                    let rec_idx_2 = all_line_idx_sort[ii+1]
                    console.log('连续两组索引', rec_idx_1, rec_idx_2)
                    if((([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(11)>=0)||
                             ([rec_idx_1, rec_idx_2].indexOf(10)>=0&&[rec_idx_1, rec_idx_2].indexOf(6)>=0)){
                        console.log('识别两笔A')
                        combine_str_mat.push('A')
                        ii = ii+1
                    }
                    // 只看两笔：B
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(8)>=0){
                        console.log('识别两笔B')
                        combine_str_mat.push('B')
                        ii = ii+1
                    }
                    // 只看两笔：D
                    else if(([rec_idx_1, rec_idx_2].indexOf(4)>=0||[rec_idx_1, rec_idx_2].indexOf(5)>=0||
                             [rec_idx_1, rec_idx_2].indexOf(7)>=0)&&[rec_idx_1, rec_idx_2].indexOf(9)>=0){
                        console.log('识别两笔D')
                        combine_str_mat.push('D')
                        ii = ii+1
                    }
                    else{
                        combine_str_mat.push(all_line_str_sort[ii])
                        // ii = ii+1
                    } 
                }
                else{
                    // 最后一笔
                    combine_str_mat.push(all_line_str_sort[ii])
                    // ii = ii+1
                }
            }
        }
        return combine_str_mat
    }

    PartQuadraticUniformBsplineCurve=(start_point, medium_point, end_point, data_num)=>{
        // 起点/中点/终点/数量
        let part_x_mat = []
        let part_y_mat = []
        if (data_num<3){
            // 点数过少直接存储返回第一个点
            part_x_mat.push(start_point[0])
            part_y_mat.push(start_point[1])
        }
        else{
            for(let ii=0;ii<data_num-1;ii++){
                let ratio_t = ii/(data_num-1)
                // console.log('单点', ratio_t, start_point[0]*(1-ratio_t)*(1-ratio_t), medium_point[0]*ratio_t*(1-ratio_t), end_point[0]*ratio_t*ratio_t)
                // console.log('单点', ratio_t, start_point[0], (1-ratio_t)*(1-ratio_t), medium_point[0], ratio_t*(1-ratio_t), end_point[0], ratio_t*ratio_t)
                // let part_x = parseInt(start_point[0]*(1-ratio_t)*(1-ratio_t)+medium_point[0]*ratio_t*(1-ratio_t)+end_point[0]*ratio_t*ratio_t) 
                // let part_y = parseInt(start_point[1]*(1-ratio_t)*(1-ratio_t)+medium_point[1]*ratio_t*(1-ratio_t)+end_point[1]*ratio_t*ratio_t)

                let part_x = (start_point[0]*(1-ratio_t)*(1-ratio_t)+medium_point[0]*(1+2*ratio_t-2*ratio_t*ratio_t)+end_point[0]*ratio_t*ratio_t)*0.5 
                let part_y = (start_point[1]*(1-ratio_t)*(1-ratio_t)+medium_point[1]*(1+2*ratio_t-2*ratio_t*ratio_t)+end_point[1]*ratio_t*ratio_t)*0.5

                // let part_x = (start_point[0]*(1-ratio_t)*(1-ratio_t)+medium_point[0]*(2*ratio_t-2*ratio_t*ratio_t)+end_point[0]*ratio_t*ratio_t)
                // let part_y = (start_point[1]*(1-ratio_t)*(1-ratio_t)+medium_point[1]*(2*ratio_t-2*ratio_t*ratio_t)+end_point[1]*ratio_t*ratio_t)

                part_x_mat.push(part_x)
                part_y_mat.push(part_y)
            }
        }
        return [part_x_mat, part_y_mat]
    }

    MediumControlPoint=(part_line_data)=>{
        // 中间控制点生成
        let control_x_mat = []
        let control_y_mat = []
        let control_x_d1 = (part_line_data[0][0]+part_line_data[0][1])*0.5
        let control_y_d1 = (part_line_data[1][0]+part_line_data[1][1])*0.5
        let control_x_d0 = 2*part_line_data[0][0] - control_x_d1
        let control_y_d0 = 2*part_line_data[1][0] - control_y_d1
        control_x_mat.push(control_x_d0)
        control_y_mat.push(control_y_d0)
        for(let ii=0;ii<part_line_data[0].length-1;ii++){
            // 叠加中点
            // let control_x_d = 2*part_line_data[0][ii]-control_x_mat[ii]
            // let control_y_d = 2*part_line_data[1][ii]-control_y_mat[ii]
            // 中点
            let control_x_d = 0.5*(part_line_data[0][ii]+part_line_data[0][ii+1])
            let control_y_d = 0.5*(part_line_data[1][ii]+part_line_data[1][ii+1]) 

            control_x_mat.push(control_x_d)
            control_y_mat.push(control_y_d)
        }
        return [control_x_mat, control_y_mat]
    }
    QuadraticUniformBsplieCurve=(part_line_data)=>{
        // 先生成控制点
        let control_point_mat = this.MediumControlPoint(part_line_data)
        console.log('初始数据点', part_line_data)
        console.log('控制点生成', control_point_mat)
        // 根据基础点和控制点生成插值数据
        let part_line_spline_x_mat = []
        let part_line_spline_y_mat = []
        for (let ii=1;ii<part_line_data[0].length;ii++){
            // 叠加
            // let start_point = [part_line_data[0][ii-1],part_line_data[1][ii-1]]
            // let medium_point = [control_point_mat[0][ii],control_point_mat[1][ii]]
            // let end_point = [part_line_data[0][ii],part_line_data[1][ii]]
            // 中点
            let start_point = [control_point_mat[0][ii-1],control_point_mat[1][ii-1]]
            let medium_point = [part_line_data[0][ii],part_line_data[1][ii]]
            let end_point = [control_point_mat[0][ii],control_point_mat[1][ii]]

            let part_bspline_mat = this.PartQuadraticUniformBsplineCurve(start_point, medium_point, end_point, 5)
            // console.log('局部数据点', part_bspline_mat)
            for(let jj=0;jj<part_bspline_mat[0].length;jj++){
                if(part_line_spline_x_mat.length<1){
                    part_line_spline_x_mat.push(part_bspline_mat[0][jj])
                    part_line_spline_y_mat.push(part_bspline_mat[1][jj])
                }
                else if((part_line_spline_x_mat[part_line_spline_x_mat.length-1]!=part_bspline_mat[0][jj])||
                        (part_line_spline_y_mat[part_line_spline_y_mat.length-1]!=part_bspline_mat[1][jj])){
                    part_line_spline_x_mat.push(part_bspline_mat[0][jj])
                    part_line_spline_y_mat.push(part_bspline_mat[1][jj])
                }
            }
            console.log('插值点', part_line_spline_x_mat, part_line_spline_y_mat)
        }
        return [part_line_spline_x_mat, part_line_spline_y_mat]
    }

    JudgeTwoMatEqual=(mat_a,mat_b)=>{
        // 判断两个数组内容是否相等1*2
        if(JSON.stringify(mat_a)==JSON.stringify([mat_b[0],mat_b[1]])||JSON.stringify(mat_a)==JSON.stringify([mat_b[1],mat_b[0]])){
            return true
        }
        else{
            return false
        }
    }

    MultiJudgeTwoMatEqual=(mat_a,mat_b_mat)=>{
        // 多组比较
        // console.log('多组模糊', mat_b_mat)
        for (let ii=0;ii<mat_b_mat.length;ii++){
            let part_mat_b = mat_b_mat[ii]
            if(this.JudgeTwoMatEqual(mat_a, part_mat_b)){
                return true
            }
            else if(ii==mat_b_mat.length){
                return false
            }
        }
    }



    AllRegionAndPartRegion=(all_line_mat)=>{
        let part_line_region_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_region = this.partLineRegion(all_line_mat[ii])
            part_line_region_mat.push(part_line_region)
        }
        let all_region_mat = this.AllLineRegion(part_line_region_mat)
        return [part_line_region_mat, all_region_mat]
    }

    StatisticsXYMat=(all_line_mat, all_line_region,caculate_mode)=>{
        // 统计x/y方向值，可选择行列方向
        let statistics_x_data_mat,statistics_y_data_mat
        if (caculate_mode==0){
            // x方向统计
            statistics_x_data_mat = new Array(all_line_region[1]-all_line_region[0]+1).fill(0)
            for(let ii=0;ii<all_line_mat.length;ii++){
                let part_line_data = all_line_mat[ii]
                let part_line_data_heavy = this.DataToHeavy(part_line_data)
                let part_line_data_interpolation = this.matInterpolation2(part_line_data_heavy)
                for (let jj=0;jj<part_line_data_interpolation[0].length;jj++){
                    let point_loc_x_zero_idx = part_line_data_interpolation[0][jj]-all_line_region[0]
                    statistics_x_data_mat[point_loc_x_zero_idx] +=1
                }
            }
        }
        else if(caculate_mode==1){
            // y方向统计
            statistics_y_data_mat = new Array(all_line_region[3]-all_line_region[2]+1).fill(0)
            for(let ii=0;ii<all_line_mat.length;ii++){
                let part_line_data = all_line_mat[ii]
                let part_line_data_heavy = this.DataToHeavy(part_line_data)
                let part_line_data_interpolation = this.matInterpolation2(part_line_data_heavy)
                for (let jj=0;jj<part_line_data_interpolation[1].length;jj++){
                    let point_loc_y_zero_idx = part_line_data_interpolation[1][jj]-all_line_region[2]
                    statistics_y_data_mat[point_loc_y_zero_idx] +=1
                }
            }
        }
        else if(caculate_mode==2){
            // x\y方向统计
            statistics_x_data_mat = new Array(all_line_region[1]-all_line_region[0]+1).fill(0)
            statistics_y_data_mat = new Array(all_line_region[3]-all_line_region[2]+1).fill(0)
            for(let ii=0;ii<all_line_mat.length;ii++){
                let part_line_data = all_line_mat[ii]
                let part_line_data_heavy = this.DataToHeavy(part_line_data)
                let part_line_data_interpolation = this.matInterpolation2(part_line_data_heavy)
                for (let jj=0;jj<part_line_data_interpolation[0].length;jj++){
                    let point_loc_x_zero_idx = part_line_data_interpolation[0][jj]-all_line_region[0]
                    let point_loc_y_zero_idx = part_line_data_interpolation[1][jj]-all_line_region[2]
                    statistics_x_data_mat[point_loc_x_zero_idx] +=1
                    statistics_y_data_mat[point_loc_y_zero_idx] +=1
                }
            }
        }
        return [statistics_x_data_mat, statistics_y_data_mat]

    }

    SubZoneXMat=(statistics_x_data,base_height)=>{
        console.log('基准高度', statistics_x_data, base_height)
        let sub_x_region_mat = []
        let sub_x_start = 0
        let sub_x_end = 0
        let char_x_start_flag = 1
        statistics_x_data.push(0)
        for (let ii=0;ii<statistics_x_data.length-1;ii++){
            if(statistics_x_data[ii]>0 && statistics_x_data[ii+1]==0 && char_x_start_flag == 1){
                // 此处出现断点，进行判定
                console.log('分区结点', sub_x_start, sub_x_end,char_x_start_flag)
                if((ii-sub_x_start+1)<=base_height){
                    // 小于高度继续赋值
                    sub_x_end = ii
                }
                else{
                    // 大于的情况下判定，一次出现
                    if(sub_x_start == sub_x_end){
                        // 连续区域大于高度直接保存
                        sub_x_region_mat.push(ii+1)
                        char_x_start_flag=0
                    }
                    else if((ii-sub_x_start+1)<=base_height*1.2){
                        // 限定一种最大长宽比
                        sub_x_region_mat.push(ii+1)
                        char_x_start_flag=0
                    }
                    else{
                        // 保存前一组值end
                        sub_x_region_mat.push(sub_x_end+1)
                        char_x_start_flag=0
                        ii = sub_x_end+1
                    }
                }
            }
            else if(statistics_x_data[ii]==0 && statistics_x_data[ii+1]>0 && char_x_start_flag == 0){
                // 找到新的起点
                console.log('分区起点1', sub_x_start, sub_x_end,char_x_start_flag)
                char_x_start_flag =1
                sub_x_start = ii+1
                sub_x_end = ii+1
                console.log('分区起点2', sub_x_start, sub_x_end,char_x_start_flag)
            }
        }
        if(sub_x_region_mat.length<1||sub_x_region_mat[sub_x_region_mat.length-1]!=statistics_x_data.length-1){
           sub_x_region_mat.push(statistics_x_data.length) 
        }
        return sub_x_region_mat
    }

    SubIdxXMat=(region_data,sub_x_region_mat)=>{
        // 分区索引
        let sub_idx_x_mat =[]
        for (let ii=0;ii<sub_x_region_mat.length;ii++){
            sub_idx_x_mat.push([])
        }
        for(let ii=0;ii<region_data[0].length;ii++){
            let region_x_max_zero = region_data[0][ii][1]-region_data[1][0]
            // console.log('单笔区域', region_x_max_zero, sub_x_region_mat)
            for(let jj=0;jj<sub_x_region_mat.length;jj++){
                if(jj==0 && region_x_max_zero<=sub_x_region_mat[jj]){
                    // console.log('分区索引', ii, jj, JSON.stringify(sub_idx_x_mat))
                    sub_idx_x_mat[0].push(ii)
                }
                else if (region_x_max_zero<=sub_x_region_mat[jj] && region_x_max_zero>sub_x_region_mat[jj-1]){
                    // console.log('分区索引', ii, jj, JSON.stringify(sub_idx_x_mat))
                    sub_idx_x_mat[jj].push(ii)
                }
            }
        }
        console.log('分区索引end', sub_idx_x_mat)
        return sub_idx_x_mat
    }

    SubLineXMat=(all_line_mat,sub_idx_x_mat)=>{
        // 笔画数据分区
        let sub_line_data_mat = []
        for(let ii=0;ii<sub_idx_x_mat.length;ii++){
            let part_sub_line_data_mat = []
            for(let jj=0;jj<sub_idx_x_mat[ii].length;jj++){
                let part_line_idx = sub_idx_x_mat[ii][jj]
                console.log('line_idx', part_line_idx)
                part_sub_line_data_mat.push(all_line_mat[part_line_idx])
            }
            sub_line_data_mat.push(part_sub_line_data_mat)
        }
        return sub_line_data_mat
    }

    NewArrayMat=(arr_len,data_mat)=>{
        // 新建预定义data_mat，数据
        let new_arry_mat = []
        for(let ii=0;ii<arr_len;ii++){
            new_arry_mat.push(data_mat)
        }
        return new_arry_mat
    }

    StatisticsIdxXYMat=(part_line_region_mat, all_line_region,caculate_mode)=>{
        // 统计索引值，可选择行列方向
        let statistics_x_data_mat=[]
        let statistics_y_data_mat=[]
        if (caculate_mode==0){
            // x方向统计
            // statistics_x_data_mat = this.NewArrayMat(all_line_region[1]-all_line_region[0]+1, [])
            for (let ii=0;ii<(all_line_region[1]-all_line_region[0]+1);ii++){
                statistics_x_data_mat.push([])
            }
            // console.log('初始矩阵', JSON.stringify(statistics_x_data_mat))
            for(let ii=0;ii<part_line_region_mat.length;ii++){
                let part_line_data = part_line_region_mat[ii]
                for (let jj=part_line_data[0];jj<=part_line_data[1];jj++){
                    let point_loc_x_zero_idx = jj-all_line_region[0]
                    // console.log('idx', point_loc_x_zero_idx)
                    statistics_x_data_mat[point_loc_x_zero_idx].push(ii)
                    // console.log('初始矩阵2', JSON.stringify(statistics_x_data_mat[point_loc_x_zero_idx]))
                }
            }
        }
        else if(caculate_mode==1){
            // y方向统计
            // statistics_y_data_mat = this.NewArrayMat(all_line_region[3]-all_line_region[2]+1, [])
            for (let ii=0;ii<(all_line_region[3]-all_line_region[2]+1);ii++){
                statistics_y_data_mat.push([])
            }
            for(let ii=0;ii<part_line_region_mat.length;ii++){
                let part_line_data = part_line_region_mat[ii]
                for (let jj=part_line_data[2];jj<=part_line_data[3];jj++){
                    let point_loc_y_zero_idx = jj-all_line_region[2]
                    statistics_y_data_mat[point_loc_y_zero_idx].push(ii)
                }
            }
        }
        else if(caculate_mode==2){
            // x\y方向统计
            // statistics_x_data_mat = this.NewArrayMat(all_line_region[1]-all_line_region[0]+1, [])
            // statistics_y_data_mat = this.NewArrayMat(all_line_region[3]-all_line_region[2]+1, [])
            for (let ii=0;ii<(all_line_region[1]-all_line_region[0]+1);ii++){
                statistics_x_data_mat.push([])
            }
            for (let ii=0;ii<(all_line_region[3]-all_line_region[2]+1);ii++){
                statistics_y_data_mat.push([])
            }
            for(let ii=0;ii<part_line_region_mat.length;ii++){
                let part_line_data = part_line_region_mat[ii]
                for (let jj=part_line_data[0];jj<=part_line_data[1];jj++){
                    let point_loc_x_zero_idx = jj-all_line_region[0]
                    statistics_x_data_mat[point_loc_x_zero_idx].push(ii)
                }
                for (let jj=part_line_data[2];jj<=part_line_data[3];jj++){
                    let point_loc_y_zero_idx = jj-all_line_region[2]
                    statistics_y_data_mat[point_loc_y_zero_idx].push(ii)
                }
            }
        }
        return [statistics_x_data_mat, statistics_y_data_mat]

    }

    CombineIdxMat=(statistics_x_idx_data)=>{
        // 索引分组
        let combine_idx_mat = []
        let part_combine_idx_mat = []
        let start_locx = 0
        let locx_flag = 0  // 转换标志
        for(let ii=0;ii<statistics_x_idx_data.length;ii++){
            if(statistics_x_idx_data[ii].length>0){
                if(locx_flag==0){
                    locx_flag = 1
                    start_locx=ii
                }
                for(let jj=0;jj<statistics_x_idx_data[ii].length;jj++){
                    if (part_combine_idx_mat.indexOf(statistics_x_idx_data[ii][jj])<0){
                        part_combine_idx_mat.push(statistics_x_idx_data[ii][jj])
                    }
                }
                if(ii==(statistics_x_idx_data.length-1)){
                    combine_idx_mat.push([part_combine_idx_mat,[start_locx, ii]])

                }
            }
            else if(part_combine_idx_mat.length>=1){
                combine_idx_mat.push([part_combine_idx_mat,[start_locx, ii-1]])
                part_combine_idx_mat = []
                locx_flag = 0
            }
        }
        return combine_idx_mat
    }

    CutAllLineHeadMat =(all_line_data)=>{
        // 去头部数据,插值后删除数据
        console.log('删数据')
        let new_all_line_data = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_data = all_line_data[ii]
            // 去重
            let part_line_data_heavy = this.DataToHeavy(part_line_data)
            let part_line_data_interpolation= this.matInterpolation2(part_line_data_heavy)
            let line_length = part_line_data_interpolation[0].length
            // console.log('旧长度',part_line_data, part_line_data_heavy, JSON.stringify(part_line_data_interpolation))
            // part_line_data_interpolation[0].splice(0,parseInt(line_length*0.1))
            // part_line_data_interpolation[1].splice(0,parseInt(line_length*0.1))
            let sample_x = [], sample_y =[]
            for (let jj=parseInt(line_length*0.05);jj<part_line_data_interpolation[0].length;jj = jj+2){
                sample_x.push(part_line_data_interpolation[0][jj])
                sample_y.push(part_line_data_interpolation[1][jj])
            }
            // console.log('新长度', sample_x, sample_y)
            new_all_line_data.push([sample_x, sample_y])
        }
        return new_all_line_data
    }

    SingleStrokeProcessMat=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        console.log('单笔code', part_line_code)
        let min_model_mat = []
        for (let ii=0;ii<math_strokes_code.length;ii++){
            // 每笔不同写法下判定
            let part_model_mat = math_strokes_code[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_code = part_model_mat[jj]
                    let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                // console.log('单笔多种书写', part_min_model_mat)
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        // console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        return [dis_idx[0],dis_sort[0]]
    }

    AllLineRelationMat=(all_line_mat)=>{
        // 统计所有线条中两两线条之间的关系：相交/相离/相切
        // 先建立一个nXn的初始矩阵
        let all_relation_flag_mat = this.newArray2d(all_line_mat.length, all_line_mat.length)
        // console.log('相交矩阵start', JSON.stringify(all_relation_flag_mat))
        for(let ii=0;ii<all_line_mat.length;ii++){
            for(let jj=ii;jj<all_line_mat.length;jj++){
                if(ii==jj){
                    // console.log('同一条线', ii, jj)
                    all_relation_flag_mat[ii][jj]=2
                    // console.log('相交矩阵', JSON.stringify(all_relation_flag_mat))
                }
                else{
                    let relation_mat = this.JudgeTwoLineRelation(all_line_mat[ii],all_line_mat[jj])
                    // console.log('非同一条线相交情况',   ii, jj, relation_mat)
                    all_relation_flag_mat[ii][jj] = relation_mat[0]
                    all_relation_flag_mat[jj][ii] = relation_mat[0]
                    // console.log('相交矩阵', JSON.stringify(all_relation_flag_mat))
                }
            }
        }
        // console.log('相交矩阵end', JSON.stringify(all_relation_flag_mat))
        return all_relation_flag_mat
    }

    StatisticsRelationMat=(all_relation_mat)=>{
        // 统计相离/相切/相交情况
        let statics_mat=[0, 0, 0]   //
        for (let ii=0;ii<all_relation_mat.length;ii++){
            for(let jj=0;jj<all_relation_mat[ii].length;jj++){
                if(all_relation_mat[ii][jj]==-1){
                    statics_mat[0] +=1
                }
                else if(all_relation_mat[ii][jj]==0){
                    statics_mat[1] +=1
                }
                else if(all_relation_mat[ii][jj]==1){
                    statics_mat[2] +=1
                }
            }
        }
        return statics_mat
    }

    NormalSizeChnMat=(all_line_mat,normal_size)=>{
        // 转换标准字体大小，统计起点和终点位置
        let part_line_region_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_region = this.partLineRegion(all_line_mat[ii])
            part_line_region_mat.push(part_line_region)
        }
        let all_region_mat = this.AllLineRegion(part_line_region_mat)
        // console.log('区域', part_line_region_mat, all_region_mat)
        let region_zero_start_mat = [] // 归零
        let region_zero_end_mat = [] // 归零
        for(let ii=0;ii<all_line_mat.length;ii++){
            let x_start = all_line_mat[ii][0][0]
            let y_start = all_line_mat[ii][1][0]
            let x_end = all_line_mat[ii][0][all_line_mat[ii][0].length-1]
            let y_end = all_line_mat[ii][1][all_line_mat[ii][1].length-1]
            region_zero_start_mat.push([x_start-all_region_mat[0],y_start-all_region_mat[2]])
            region_zero_end_mat.push([x_end-all_region_mat[0],y_end-all_region_mat[2]])
        }
        // console.log('归一化端点统计', region_zero_start_mat, region_zero_end_mat)
        // 分类伸缩比例
        let ratio_xy = 1
        let decenter_locx = 0
        let decenter_locy = 0
        if((all_region_mat[1]-all_region_mat[0])>=(all_region_mat[3]-all_region_mat[2])){
            // x>y
            ratio_xy = normal_size/(all_region_mat[1]-all_region_mat[0]+1)
            decenter_locx = 0 
            decenter_locy = parseInt((500-(all_region_mat[3]-all_region_mat[2]+1)*ratio_xy)/2)
            // console.log('y偏离', (all_region_mat[3]-all_region_mat[2]+1)*ratio_xy, (500-(all_region_mat[3]-all_region_mat[2]+1)*ratio_xy))
        }
        else{
            ratio_xy = normal_size/(all_region_mat[3]-all_region_mat[2]+1)
            decenter_locx = parseInt((500-(all_region_mat[1]-all_region_mat[0]+1)*ratio_xy)/2)
            decenter_locy = 0
        }
        // console.log('比例偏移量', ratio_xy, decenter_locx, decenter_locy)
        let region_zero_start_mat_2nd = [] // 归零
        let region_zero_end_mat_2nd = [] // 归零
        for(let ii=0;ii<region_zero_start_mat.length;ii++){

            let x_start_2nd,y_start_2nd,x_end_2nd,y_end_2nd
            if (region_zero_start_mat[ii][0]==0){
                x_start_2nd=decenter_locx
            }
            else{
                x_start_2nd = parseInt((region_zero_start_mat[ii][0]+1)*ratio_xy+decenter_locx-1)
            }
            if (region_zero_start_mat[ii][1]==0){
                y_start_2nd=decenter_locy
            }
            else{
                y_start_2nd = parseInt((region_zero_start_mat[ii][1]+1)*ratio_xy+decenter_locy-1)
            }
            if (region_zero_end_mat[ii][0]==0){
                x_end_2nd = decenter_locx
            }
            else{
                x_end_2nd = parseInt((region_zero_end_mat[ii][0]+1)*ratio_xy+decenter_locx-1)
            }
            if (region_zero_end_mat[ii][1]==0){
                y_end_2nd = decenter_locy
            }
            else{
                y_end_2nd = parseInt((region_zero_end_mat[ii][1]+1)*ratio_xy+decenter_locy-1)
            }
            region_zero_start_mat_2nd.push([x_start_2nd, y_start_2nd])
            region_zero_end_mat_2nd.push([x_end_2nd, y_end_2nd])
        }
        // console.log('标准大小端点', region_zero_start_mat_2nd, region_zero_end_mat_2nd)
        return [region_zero_start_mat_2nd, region_zero_end_mat_2nd]
    }

    
    TwoPointDistance=(point_a,point_b)=>{
        // 两点距离
        let distance_pp = Math.sqrt((point_a[0]-point_b[0])*(point_a[0]-point_b[0])+(point_a[1]-point_b[1])*(point_a[1]-point_b[1]))
        return Math.round(distance_pp*100)/100
    }

    JudgeTwoCharMat=(model_str_mat, model_start_mat, test_str_mat, test_start_mat, fuzzy_str_mat)=>{
        // 计算两个字符的最小距离且匹配字符编码
        let two_char_dis_mat = []
        let two_char_idx_mat = []
        for(let ii=0;ii<test_str_mat.length;ii++){
            let part_test_row_mat = [] // 测试匹配全模型
            for(let jj=0;jj<model_str_mat.length;jj++){
                if(this.JudgeMatIndexOf([model_str_mat[jj],test_str_mat[ii]],fuzzy_str_mat)>=0||
                                        model_str_mat[jj]==test_str_mat[ii]){
                    let two_point_distance = this.TwoPointDistance(test_start_mat[ii], model_start_mat[jj])
                    part_test_row_mat.push(two_point_distance)
                }
                else{
                    part_test_row_mat.push(500)
                }
            }
            // console.log('单行匹配', part_test_row_mat)
            let part_test_row_mat_sort = this.ArraySortMat(part_test_row_mat)
            two_char_dis_mat.push(part_test_row_mat_sort[0])
            two_char_idx_mat.push(part_test_row_mat_sort[0])
        }
        // 先简单求和
        let min_dis_add = 0
        for(let ii=0;ii<two_char_dis_mat.length;ii++){
            min_dis_add += two_char_dis_mat[ii][0]
        }
        return min_dis_add
    }

    JudgeTwoCharSortMat=(model_str_mat, model_start_mat, test_str_mat, test_start_mat, fuzzy_str_mat)=>{
        // 计算两个字符的最小距离且匹配字符编码
        let two_char_dis_mat = []
        let two_char_idx_mat = []
        let two_char_all_dis_mat = []
        let two_char_all_idx_mat = []
        for(let ii=0;ii<test_str_mat.length;ii++){
            let part_test_row_mat = [] // 测试匹配全模型
            for(let jj=0;jj<model_str_mat.length;jj++){
                if(this.JudgeMatIndexOf([model_str_mat[jj],test_str_mat[ii]],fuzzy_str_mat)>=0||
                                        model_str_mat[jj]==test_str_mat[ii]){
                    let two_point_distance = this.TwoPointDistance(test_start_mat[ii], model_start_mat[jj])
                    part_test_row_mat.push(two_point_distance)
                }
                else{
                    part_test_row_mat.push(500)
                }
            }
            // console.log('单行匹配', part_test_row_mat)
            let part_test_row_mat_sort = this.ArraySortMat(part_test_row_mat)
            two_char_dis_mat.push(part_test_row_mat_sort[0])
            two_char_idx_mat.push(part_test_row_mat_sort[0])
            two_char_all_dis_mat.push(part_test_row_mat_sort[0])
            two_char_all_idx_mat.push(part_test_row_mat_sort[1])
        }
        // 先简单求和
        let min_dis_add = 0
        for(let ii=0;ii<two_char_dis_mat.length;ii++){
            min_dis_add += two_char_dis_mat[ii][0]
        }
        return [min_dis_add,two_char_all_dis_mat,two_char_all_idx_mat]
    }

    JudgeMatIndexOf=(test_mat,all_mat)=>{
        // test_mat:一维/all_mat:二维
        let index_num=-1
        for(let ii=0;ii<all_mat.length;ii++){
            // console.log(test_mat, all_mat[ii])
            if(this.JudgeTwoMatEqual(test_mat, all_mat[ii])){
                index_num=ii
            }
        }
        return index_num
    }
    
    CompareStrokesFuzzyMat = (part_model_str,test_str_mat, fuzzy_str_mat)=>{
        // 模型数据编码/测试数据编码/模糊数据编码矩阵
        // 判断具有多少相同的笔画编码，不考虑位置关系
        // console.log('比较书写编码', part_model_str,test_str_mat)
        let common_idx_mat = []
        for(let ii=0;ii<part_model_str.length;ii++){
            for(let jj=0;jj<test_str_mat.length;jj++){
                // console.log('比较书写编码:单笔', part_model_str[ii],test_str_mat[jj], common_idx_mat, common_idx_mat.indexOf(jj))
                if(common_idx_mat.indexOf(jj)<0){
                    // 没有比对标准模板的情况下进行比较
                    // console.log('编码比较', ii, jj, part_model_str[ii], test_str_mat[jj])
                    if(this.JudgeMatIndexOf([part_model_str[ii],test_str_mat[jj]],fuzzy_str_mat)>=0||
                        part_model_str[ii]==test_str_mat[jj]){
                        common_idx_mat.push(jj)
                        break
                    }
                }
            }
        }
        return common_idx_mat
    }

    BaseAllLineRelationMat=(all_line_mat)=>{
        // 统计所有线条中两两线条之间的关系：相交/相离/相切
        // 先建立一个nXn的初始矩阵
        let all_relation_flag_mat = this.newArray2d(all_line_mat.length, all_line_mat.length)
        let all_relation_ratio_mat = this.newArray2d(all_line_mat.length, all_line_mat.length)
        // console.log('相交矩阵start', JSON.stringify(all_relation_flag_mat))
        for(let ii=0;ii<all_line_mat.length;ii++){
            for(let jj=ii;jj<all_line_mat.length;jj++){
                if(ii==jj){
                    // console.log('同一条线', ii, jj)
                    all_relation_flag_mat[ii][jj] = 2
                    all_relation_ratio_mat[ii][jj] = 0.5
                    // console.log('相交矩阵', JSON.stringify(all_relation_flag_mat))
                }
                else{
                    let relation_ii_mat = this.JudgeTwoLineRelation(all_line_mat[ii],all_line_mat[jj])
                    // console.log('非同一条线相交情况ii',   ii, jj, JSON.stringify(relation_ii_mat))
                    let relation_jj_mat = this.JudgeTwoLineRelation(all_line_mat[jj],all_line_mat[ii])
                    // console.log('非同一条线相交情况jj',   ii, jj, JSON.stringify(relation_jj_mat))
                    all_relation_flag_mat[ii][jj] = Math.round(relation_ii_mat[0]*100)/100
                    all_relation_flag_mat[jj][ii] = Math.round(relation_jj_mat[0]*100)/100
                    all_relation_ratio_mat[ii][jj] = Math.round(relation_ii_mat[1]*100)/100
                    all_relation_ratio_mat[jj][ii] = Math.round(relation_jj_mat[1]*100)/100
                    // console.log('相交矩阵', JSON.stringify(all_relation_flag_mat))
                }
            }
        }
        // console.log('相交矩阵end', JSON.stringify(all_relation_flag_mat), JSON.stringify(all_relation_ratio_mat))
        return [all_relation_flag_mat, all_relation_ratio_mat]
    }

    BaseChnSingleStrokeProcess=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        let part_line_region_mat = this.partLineRegion(part_line_data)
        console.log('单笔code_region', part_line_code, part_line_region_mat)
        let min_model_mat = []
        for (let ii=0;ii<math_strokes_code.length;ii++){
            // 每笔不同写法下判定
            let part_model_mat = math_strokes_code[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_code = part_model_mat[jj]
                    let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        // console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        return [dis_idx[0], part_line_code, part_line_region_mat]
    }

    BaseChnSingleCharProcess=(all_line_mat)=>{
        // 单汉字基础笔画数据处理，用于存储基础数据库
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_strokes_mat = []
        let all_line_code_mat = []
        let all_line_str = ''
        for (let ii=0;ii<all_line_mat.length;ii++){
            // let part_line_data = all_line_mat[ii]
            // 单笔编码
            let part_line_mat = this.BaseChnSingleStrokeProcess(mathchndata.chn_stroke_code, all_line_mat[ii])
            // console.log('单笔识别', part_line_num)
            all_line_code_mat.push(part_line_mat[1])   
            all_line_num_mat.push(part_line_mat[0])
            all_line_str_mat.push(mathchndata.chn_stroke_str[part_line_mat[0]])
            all_line_strokes_mat.push(mathchndata.chn_stroke_judge_mat[part_line_mat[0]])
            all_line_str += mathchndata.chn_stroke_str[part_line_mat[0]]
        }
        console.log('单笔编码base', all_line_str, all_line_strokes_mat, all_line_code_mat)
        // 根据二次筛选得到相同或相似的笔画，判定长度，进行第三次筛选，
        let test_relation_mat = this.BaseAllLineRelationMat(all_line_mat)
        console.log('测试笔画数据相交情况', test_relation_mat)
        // 根据3次筛选将数据转换到500*500;依次计算对应端点的距离
        let normal_endpoint_mat = this.NormalSizeChnMat(all_line_mat,500)
        console.log('标准端点', normal_endpoint_mat)
        return [all_line_str, all_line_code_mat, test_relation_mat[0], test_relation_mat[1], normal_endpoint_mat]
    }

    BaseChnSingleCharProcessMat=(char_str, all_line_mat0)=>{
        console.log('笔画处理start')
        let all_line_mat = this.CutAllLineHeadMat(all_line_mat0)
        let single_char_mat = this.BaseChnSingleCharProcess(all_line_mat)
        console.log('笔画处理end', JSON.stringify(single_char_mat))
        console.log('字unicode处理start')
        let chn_unicode_str = this.FindChnCharUnicode(char_str)
        console.log('字unicode处理end',char_str, chn_unicode_str, '\\u'+chn_unicode_str)
        console.log('全局完整信息', JSON.stringify([chn_unicode_str, '\\u'+chn_unicode_str, single_char_mat]))
        // test_data[1]=1000
        // console.log('test_data',test_data)
    }

    OpenExcelFile=()=>{
        // console.log('读取excel文件')
        // 读取本地excel文件
        // const workSheetsFromFile = xlsx.parse(`hz_unicode_part2.xlsx`);
        // console.log('workSheetsFromFile', workSheetsFromFile)
        // console.log('workSheetsFromFile[0]', workSheetsFromFile[0])
        // console.log('workSheetsFromFile[0].data', workSheetsFromFile[0].data)
        // console.log('workSheetsFromFile[0].data', workSheetsFromFile[0].data[0])
        // const workbook = XLSX.readFile('hz_unicode_part2.xlsx');
        // console.log('workbook', workbook)
        // const path = RNFS.DocumentDirectoryPath + '/hz_unicode_part2.xlsx';
        // const path = '/data/com.my_app/files'+ '/hz_unicode_part2.xlsx';
        
        // let rnfsPath = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath
        // console.log('rnfsPath',rnfsPath)
        // const path = rnfsPath + '/hz_unicode_part2.xlsx';
        // const path = 'hz_unicode_part2.xlsx';
        // const path = RNFS.DocumentDirectoryPath + '/test.txt';
        // alert('path',path)
        // console.log('MainBundlePath=' + RNFS.MainBundlePath)
        // console.log('CachesDirectoryPath=' + RNFS.CachesDirectoryPath)
        // console.log('DocumentDirectoryPath=' + RNFS.DocumentDirectoryPath)
        // console.log('TemporaryDirectoryPath=' + RNFS.TemporaryDirectoryPath)
        // console.log('LibraryDirectoryPath=' + RNFS.LibraryDirectoryPath)
        // console.log('ExternalDirectoryPath=' + RNFS.ExternalDirectoryPath)
        // console.log('ExternalStorageDirectoryPath=' + RNFS.ExternalStorageDirectoryPath)
        // let data_mat = RNFS.readFile(path)
        // console.log('path',path)
        // console.log('data_mat', data_mat)
        // console.log('data_mat[0]', data_mat[0])
        // console.log('data_mat[1]', data_mat[1])
        // alert('data_mat0')
        // alert(data_mat)
        // alert('data_mat[0]')
        // alert(data_mat[0])
        // alert('data_mat[1]')
        // alert(data_mat[1])
        // alert('data_mat1', data_mat[1])
        console.log('chn_base_data',chn_base_data[1][0])
        return [chn_base_data[1]]
    }
    
    FindChnCharStr = (unicode_str)=>{
        // 找到汉字数据库对应汉字
        let chn_str
        for (let ii=1;ii<chn_base_data.length;ii++){
            let part_unicode_str = chn_base_data[ii][4].substr(2,4)
            if(part_unicode_str == unicode_str){
                chn_str = chn_base_data[ii][1]
                break
            }
        }
        return chn_str
    }

    FindChnCharUnicode = (chn_str)=>{
        // 找到汉字数据库对应unicod
        let part_unicode_str
        for (let ii=1;ii<chn_base_data.length;ii++){
            let part_chn_str = chn_base_data[ii][1]
            if(part_chn_str == chn_str){
                part_unicode_str = chn_base_data[ii][4].substr(2,4)
                break
            }
        }
        return part_unicode_str
    }

    ChnCharCombineMat=(combine_str_mat002)=>{
        console.log('汉字字符组合',  combine_str_mat002)
        let combine_chn_char_mat =this.deepClone(combine_str_mat002,[])
        let combine_judge_flag=1
        while(combine_judge_flag>0){
            for(let ii=0;ii<combine_chn_char_mat.length;ii++){
                // console.log('combine_chn_char_mat[ii]',  combine_chn_char_mat[ii])
                let part_combine_str = combine_chn_char_mat[ii]
                let flag_row = 0
                if (part_combine_str.length>1){
                    for(let jj=0;jj<part_combine_str.length-1;jj++){
                        let combine_char_str_mat = this.ChnFuzzyCombineMat(part_combine_str[jj],part_combine_str[jj+1])
                        if (combine_char_str_mat[0]==1){
                            // 找到组合
                            // console.log('组合start', part_combine_str,combine_char_str_mat)
                            let new_combine_str = this.GetNewStr(jj,jj+1,part_combine_str, combine_char_str_mat[1])
                            // console.log('组合end', new_combine_str)
                            combine_chn_char_mat[ii]= new_combine_str
                            // console.log('combine_chn_char_mat[ii]2',  combine_chn_char_mat[ii])
                            flag_row =1
                            break
                        }
                    }
                }
                if (flag_row==1){
                    break
                }
                if(ii==combine_chn_char_mat.length-1){
                   combine_judge_flag=0 
                }
            }
        }
        console.log('汉字字符组合end',  combine_chn_char_mat)
        return combine_chn_char_mat
    }

    GetNewStr=(start_ii,end_ii,old_value_mat,new_value)=>{
        let new_value_mat=''
        let flag_new = 0
        for(let ii=0;ii<old_value_mat.length;ii++){
            if(ii<start_ii||ii>end_ii){
                new_value_mat +=old_value_mat[ii]
            }
            else if(flag_new==0){
                new_value_mat +=new_value
                flag_new=1
            }
        }
        return new_value_mat
    }

    ChnFuzzyCombineMat=(chn_char1,chn_char2)=>{
        let combine_char_flag = 0
        for(let ii=0;ii<chn_fuzzy_combine_data.length;ii++){
            if(chn_fuzzy_combine_data[ii][0]==chn_char1 && chn_fuzzy_combine_data[ii][1]==chn_char2){
                return [1,chn_fuzzy_combine_data[ii][2]]
            }
        }
        if(combine_char_flag==0){
            return[0,[chn_char1,chn_char2]]
        }
    }

    StaticsLineCode = (part_line_code)=>{
        // 统计横向和纵向的编码数据
        let part_line_0 = 0 //横
        let part_line_1 = 0 //竖
        for (let ii=0;ii<part_line_code.length;ii++){
            if(part_line_code[ii]<=1 || part_line_code[ii]>=15){
                part_line_0 +=1
            }

            if(part_line_code[ii]<=5 && part_line_code[ii]>=4){
                part_line_1 +=1
            }
        }
        console.log('横向和纵向统计', part_line_0, part_line_1)
        return [part_line_0, part_line_1]
    }

    BaseLocDataProcess = (base_loc_data_str)=>{
        // 基础坐标数据处理
        // 1，#号分割
        let base_loc_data_1st = base_loc_data_str.split('#')
        console.log('base_loc_data_1st', base_loc_data_1st)
        let base_loc_data_2nd = []
        let part_loc_xy_str = base_loc_data_1st[0]
        let part_loc_xy_str_mat = part_loc_xy_str.split(';')
        let part_loc_x_mat = []
        let part_loc_y_mat = []
        for(let ii=0;ii<part_loc_xy_str_mat.length;ii++){
            let part_point_xy_str = part_loc_xy_str_mat[ii]
            let part_point_xy_mat = part_point_xy_str.split(',')
            part_loc_x_mat.push(parseInt(part_point_xy_mat[0]))
            part_loc_y_mat.push(parseInt(part_point_xy_mat[1]))
        }
        let base_region_xy_str = base_loc_data_1st[1]
        let base_region_xy_mat = base_region_xy_str.split(',')
        base_loc_data_2nd.push([part_loc_x_mat, part_loc_y_mat])
        base_loc_data_2nd.push([parseInt(base_region_xy_mat[0]), parseInt(base_region_xy_mat[1])])
        console.log('base_loc_data_2nd', base_loc_data_2nd)
        return base_loc_data_2nd
    }

    EndPointProcess=(all_line_data)=>{
        // 端点数据处理
        let hand_loc_data_x = []
        let hand_loc_data_y = []
        let all_line_region_mat = []
        console.log('all_line_data.length',all_line_data.length)
        for(let ii=0;ii<all_line_data.length;ii++){
            let part_line_region_mat = this.partLineRegion(all_line_data[ii])
            hand_loc_data_x.push(part_line_region_mat[4])
            hand_loc_data_x.push(part_line_region_mat[5])
            hand_loc_data_y.push(part_line_region_mat[6])
            hand_loc_data_y.push(part_line_region_mat[7])
            all_line_region_mat.push(part_line_region_mat)
        }
        let all_region_data = this.AllLineRegion(all_line_region_mat)
        return [[hand_loc_data_x, hand_loc_data_y],all_region_data]
    }

    LocMatCodeProcess=(loc_data_mat)=>{
        // 相邻两点之间的方向编码
        let loc_data_code = []
        let loc_data_angle = []
        for(let ii=0;ii<loc_data_mat[0].length-1;ii++){
            let point_a=[loc_data_mat[0][ii],-loc_data_mat[1][ii]]
            let point_b=[loc_data_mat[0][ii+1],-loc_data_mat[1][ii+1]]
            let code_mat = this.DirectionCodeMode(point_a, point_b, 16)
            loc_data_code.push(code_mat[0])
            loc_data_angle.push(code_mat[1])
        }
        return [loc_data_code,loc_data_angle]
    }

    GenerateIdxMat=(data_length)=>{
        // 生成序号索引数组
        idx_arange_mat = []
        let base_idx_mat = this.JsArange(0,data_length-1,1)
        console.log('base_idx_mat',base_idx_mat)
        let stop_length = data_length/2
        // let iter_num = this.IterativeFactorial(data_length)
        // console.log('迭代次数', iter_num)
        idx_arange_mat = []
        this.ArrangeIdxMat([], base_idx_mat);
        console.log('初始排布索引', idx_arange_mat)
    }

    IterativeFactorial=(data_num)=>{
        if (data_num>1){
            return data_num*this.IterativeFactorial(data_num-1)
        }
        else{
            return 1
        }
    }

    // var str = [1,2,3,4,5];
    ArrangeIdxMat=(s_mat,idx_mat)=>{
        for(let ii=0,length=idx_mat.length; ii<length; ii++) {
            // console.log('s',s)
            if(s_mat.length == length - 1) {
                if(s_mat.indexOf(idx_mat[ii]) < 0
                    &&((idx_mat[ii]>(s_mat.length-length/2))&&(idx_mat[ii]<(s_mat.length+length/2)))) {
                    // console.log("组合=", [s, str[i]].flat())
                    let part_idx_combine = [s_mat, idx_mat[ii]].flat()
                    if (part_idx_combine.length==length){
                        // console.log("组合=", part_idx_combine)
                        idx_arange_mat.push(part_idx_combine)
                    }
                }
                continue;
            }
            if(s_mat.indexOf(idx_mat[ii]) < 0 
                &&((idx_mat[ii]>(s_mat.length-length/2))&&(idx_mat[ii]<(s_mat.length+length/2)))) {
                // console.log('位置限定', idx_mat[ii], s_mat.length, length/2)
                this.ArrangeIdxMat([s_mat, idx_mat[ii]].flat(),idx_mat);
            }
        }
   }
   
   BaseXDirectionPartition=(statistics_x_mat_idx)=>{
        // 行分区统计
        let idx_flag = 0
        let part_idx_mat
        let line_start_loc = [],line_end_loc = []
        let null_start_loc = [],null_end_loc = []
        let all_x_partition_mat = []
        for (let ii=0;ii<statistics_x_mat_idx.length;ii++){
            console.log('statistics_y_mat_idx[ii].length',statistics_x_mat_idx[ii].length)
            if(idx_flag==0 && statistics_x_mat_idx[ii].length>0){
                // 出现索引
                line_start_loc.push(ii)
                idx_flag = 1
                part_idx_mat = statistics_x_mat_idx[ii]
                if (null_start_loc.length>0){
                    null_end_loc.push(ii-1)
                }
            }
            else if(idx_flag==1 && statistics_x_mat_idx[ii].length<1){
                // 出现空白区域
                null_start_loc.push(ii)
                line_end_loc.push(ii-1)
                idx_flag = 0
                all_x_partition_mat.push(part_idx_mat)
            }
            else if(idx_flag==1 && statistics_x_mat_idx[ii].length>0){
                // 统计索引
                let part_idx_mat_set = new Set([part_idx_mat,statistics_x_mat_idx[ii]].flat())
                part_idx_mat = Array.from(part_idx_mat_set)
            }
            if(ii==statistics_x_mat_idx.length-1){
                all_x_partition_mat.push(part_idx_mat)
                line_end_loc.push(ii)
            }
        }
        console.log('列分区', JSON.stringify(all_x_partition_mat), JSON.stringify([line_start_loc,line_end_loc]),JSON.stringify([null_start_loc, null_end_loc]))
        return [all_x_partition_mat,[line_start_loc,line_end_loc],[null_start_loc, null_end_loc]]
    }
}

export class ChnProcessingFunc extends BasicProcessingFunc{
    // 语文专项处理
    ChnCompletionPartition = (all_line_mat)=>{
        // 语文填空题分区：只行列分区，返回组合区域，及行列分组排序
        let [part_line_region_mat, all_region_mat] = this.AllRegionAndPartRegion(all_line_mat)
        console.log('笔画区域统计', part_line_region_mat, all_region_mat)
        let [statistics_x_mat_idx, statistics_y_mat_idx] = this.StatisticsIdxXYMat(part_line_region_mat, all_region_mat, 1)
        console.log('y统计索引', JSON.stringify(statistics_y_mat_idx))
        let [statistics_x_mat, statistics_y_mat] = this.StatisticsXYMat(all_line_mat, all_region_mat, 1)
        console.log('y统计', JSON.stringify(statistics_y_mat))
        // let new_set = new Set([[1,2,3,3],[3,4]].flat())
        // let new_array = Array.from(new_set)
        // console.log('new_set', new_set, typeof(new_set),new_set[0])
        // console.log('new_array', new_array, typeof(new_array),new_array[0])
        // 行分区统计
        let idx_flag = 0
        let part_idx_mat
        let line_start_loc = [],line_end_loc = []
        let null_start_loc = [],null_end_loc = []
        let all_y_partition_mat = []
        for (let ii=0;ii<statistics_y_mat_idx.length;ii++){
            console.log('statistics_y_mat_idx[ii].length',statistics_y_mat_idx[ii].length)
            if(idx_flag==0 && statistics_y_mat_idx[ii].length>0){
                // 出现索引
                line_start_loc.push(ii)
                idx_flag = 1
                part_idx_mat = statistics_y_mat_idx[ii]
                if (null_start_loc.length>0){
                    null_end_loc.push(ii-1)
                }
            }
            else if(idx_flag==1 && statistics_y_mat_idx[ii].length<1){
                // 出现空白区域
                null_start_loc.push(ii)
                line_end_loc.push(ii-1)
                idx_flag = 0
                all_y_partition_mat.push(part_idx_mat)
            }
            else if(idx_flag==1 && statistics_y_mat_idx[ii].length>0){
                // 统计索引
                let part_idx_mat_set = new Set([part_idx_mat,statistics_y_mat_idx[ii]].flat())
                part_idx_mat = Array.from(part_idx_mat_set)
            }
            if(ii==statistics_y_mat_idx.length-1){
                all_y_partition_mat.push(part_idx_mat)
                line_end_loc.push(ii)
            }
        }
        console.log('行分区', JSON.stringify(all_y_partition_mat), JSON.stringify([line_start_loc,line_end_loc]),JSON.stringify([null_start_loc, null_end_loc]))
        // 计算基准高度----该过程比较复杂，预先简单统计
        let base_height = 0
        let height_mat = []
        for(let ii=0;ii<line_start_loc.length;ii++){
            height_mat.push(line_end_loc[ii]-line_start_loc[ii])
            base_height =Math.round((base_height*ii+line_end_loc[ii]-line_start_loc[ii])/(ii+1)*100)/100
        }
        console.log('高度统计', JSON.stringify(height_mat), base_height)
        // 每行列分区
        // 行数据统计
        let all_combine_region_mat = []
        let all_combine_idx_mat = []
        let region_idx = -1
        for(let ii=0;ii<all_y_partition_mat.length;ii++){
            // 单行数据流统计
            let part_all_line_data = []
            let part_combine_idx_mat = []
            for(let jj=0;jj<all_y_partition_mat[ii].length;jj++){
                console.log('索引all_y_partition_mat[ii][jj]', all_y_partition_mat[ii][jj])
                part_all_line_data.push(all_line_mat[all_y_partition_mat[ii][jj]])
                // part_all_line_region_data.push(part_line_region_mat[all_y_partition_mat[ii][jj]])
            }
            let [part_all_line_region_data, part_all_region_mat] = this.AllRegionAndPartRegion(part_all_line_data)
            // 单行数据流处理
            // 统计x方向
            let [part_statistics_x_mat_idx, part_statistics_y_mat_idx] = this.StatisticsIdxXYMat(part_all_line_region_data, part_all_region_mat, 0)
            let [part_all_x_partition_mat,[part_line_start_loc,part_line_end_loc],[part_null_start_loc, part_null_end_loc]] = 
                                            this.BaseXDirectionPartition(part_statistics_x_mat_idx)
            // 根据行高进行行组合
            let part_idx_x_mat = []
            if(part_all_x_partition_mat.length<2){
                // 直接存储
                region_idx += 1
                part_idx_x_mat.push(part_all_x_partition_mat[0])
                all_combine_region_mat.push(part_all_region_mat)
                part_combine_idx_mat.push(region_idx)
            }
            else{
                // 根据高度判别组合
                let combine_part_idx_x_mat = []
                combine_part_idx_x_mat.push(part_all_x_partition_mat[0])
                for(let kk=0;kk<part_all_x_partition_mat.length-1;kk++){
                    if((part_null_end_loc[kk]-part_null_start_loc[kk]+1)>base_height*1.0){
                        // 大于高度分离
                        let combine_idx_flat_mat = this.deepClone(combine_part_idx_x_mat,[])
                        part_idx_x_mat.push(combine_idx_flat_mat.flat())
                        combine_part_idx_x_mat = []
                        combine_part_idx_x_mat.push(part_all_x_partition_mat[kk+1])
                    }
                    else{
                        // 组合索引
                        combine_part_idx_x_mat.push(part_all_x_partition_mat[kk+1])
                    }
                    if(kk==part_null_start_loc.length-1){
                        part_idx_x_mat.push(combine_part_idx_x_mat.flat())
                    }
                }
                console.log('索引组合', JSON.stringify(part_idx_x_mat))
                // 原始笔画组合
                for(let ll=0;ll<part_idx_x_mat.length;ll++){
                    let part_row_idx_mat = []
                    for(let mm=0;mm<part_idx_x_mat[ll].length;mm++){
                        part_row_idx_mat.push(all_y_partition_mat[ii][part_idx_x_mat[ll][mm]])
                    }
                    console.log('单组组合线条索引====', JSON.stringify(part_row_idx_mat))
                    let part_line_data_2nd = []
                    for(let nn=0;nn<part_row_idx_mat.length;nn++){
                        part_line_data_2nd.push(all_line_mat[part_row_idx_mat[nn]])
                    }
                    region_idx += 1
                    let [part_line_region_mat_2nd, all_region_mat_2nd] = this.AllRegionAndPartRegion(part_line_data_2nd)
                    all_combine_region_mat.push(all_region_mat_2nd)
                    part_combine_idx_mat.push(region_idx)
                }
            }
            all_combine_idx_mat.push(part_combine_idx_mat)
        }
        console.log('最终组合', JSON.stringify(all_combine_region_mat), JSON.stringify(all_combine_idx_mat))
        return [all_combine_region_mat, all_combine_idx_mat]
    }

    ChnXDirectionPartition=(statistics_x_mat_idx)=>{
        // 行分区统计
        let idx_flag = 0
        let part_idx_mat
        let line_start_loc = [],line_end_loc = []
        let null_start_loc = [],null_end_loc = []
        let all_x_partition_mat = []
        for (let ii=0;ii<statistics_x_mat_idx.length;ii++){
            console.log('statistics_y_mat_idx[ii].length',statistics_x_mat_idx[ii].length)
            if(idx_flag==0 && statistics_x_mat_idx[ii].length>0){
                // 出现索引
                line_start_loc.push(ii)
                idx_flag = 1
                part_idx_mat = statistics_x_mat_idx[ii]
                if (null_start_loc.length>0){
                    null_end_loc.push(ii-1)
                }
            }
            else if(idx_flag==1 && statistics_x_mat_idx[ii].length<1){
                // 出现空白区域
                null_start_loc.push(ii)
                line_end_loc.push(ii-1)
                idx_flag = 0
                all_x_partition_mat.push(part_idx_mat)
            }
            else if(idx_flag==1 && statistics_x_mat_idx[ii].length>0){
                // 统计索引
                let part_idx_mat_set = new Set([part_idx_mat,statistics_x_mat_idx[ii]].flat())
                part_idx_mat = Array.from(part_idx_mat_set)
            }
            if(ii==statistics_x_mat_idx.length-1){
                all_x_partition_mat.push(part_idx_mat)
                line_end_loc.push(ii)
            }
        }
        console.log('列分区', JSON.stringify(all_x_partition_mat), JSON.stringify([line_start_loc,line_end_loc]),JSON.stringify([null_start_loc, null_end_loc]))
        return [all_x_partition_mat,[line_start_loc,line_end_loc],[null_start_loc, null_end_loc]]
    }
}

let mathstrcaculate = new MathBaseCaculateFunc()
export class MathProcessingFunc extends BasicProcessingFunc{
    // 数学专项处理 //语文另写
    MathSingleStrokeProcess=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        let part_line_region_mat = this.partLineRegion(part_line_data)
        let statics_mat = this.StaticsLineCode(part_line_code)
        console.log('单笔code_region', part_line_code, part_line_region_mat)
        // 统计横向和纵向的编码数
        let min_model_mat = []
        // 新增单笔：1和-的比例
        if((part_line_region_mat[3]-part_line_region_mat[2]+1)/(part_line_region_mat[1]-part_line_region_mat[0]+1)>=6||
            statics_mat[1]>=20){
            // 1
            console.log('特殊比例1')
            return 1
        }
        else if((part_line_region_mat[1]-part_line_region_mat[0]+1)/(part_line_region_mat[3]-part_line_region_mat[2]+1)>=6||
            statics_mat[0]>=20){
            // -
            console.log('特殊比例-')
            return 10
        }
        else{
            for (let ii=0;ii<math_strokes_code.length;ii++){
                // 每笔不同写法下判定
                let part_model_mat = math_strokes_code[ii]
                if (part_model_mat.length<1){
                    min_model_mat.push(1000)
                }
                else{
                    let part_min_model_mat=[];
                    for(let jj=0;jj<part_model_mat.length;jj++){
                        // 一个字母下的每种写法
                        let part_model_code = part_model_mat[jj]
                        let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                        part_min_model_mat.push(part_model_dis_mat)
                        // console.log('统计', part_min_model_mat)
                    }
                    // let min_dis = Math.min.apply(null, part_min_model_mat)
                    // min_model_mat.push(min_dis)
                    // 在这里添加识别每笔多种写法的数据统计
                    let [model_dis_sort, model_idx_length]=this.ArraySortMat(part_min_model_mat)
                    let model_length = Math.ceil(part_min_model_mat.length/4)
                    let model_dis_static = 0
                    for (let model_ii =0;model_ii<model_length;model_ii++){
                        model_dis_static +=model_dis_sort[model_ii]
                    }
                    // console.log('统计, part_min_model_mat, model_dis_sort, model_length, model_dis_static,model_dis_static/model_length')
                    // console.log(part_min_model_mat, model_dis_sort, model_length, model_dis_static,model_dis_static/model_length)
                    min_model_mat.push(model_dis_static/model_length)
                }
            }
            let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
            // console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
            if([0,6].indexOf(dis_idx[0])>-1){
                // 0和6的特殊处理
                // 统计x方向和y方向的数据点
                let part_line_heavy_mat = this.DataToHeavy(part_line_data);
                let part_line_region_mat = this.partLineRegion(part_line_data);
                let part_line_interpolation_mat = this.matInterpolation2(part_line_heavy_mat)
                let [x_statics_mat,y_statics_mat] = this.StatisticsPoints(part_line_interpolation_mat)
                // 统计<2
                console.log('x/y统计', x_statics_mat, y_statics_mat)
                let statics_1 = 0
                for(let sii=0;sii<y_statics_mat.length;sii++){
                    if(y_statics_mat[sii]<2){
                        statics_1 +=1
                    }
                }
                if(statics_1/y_statics_mat.length>0.15 && part_line_region_mat[6]<part_line_region_mat[7]){
                    return 6
                }
                else{
                    return 0
                }
            }
            else{
                return dis_idx[0]
            }
        } 
    }

    // 数学专项处理 //语文另写
    ChnSingleStrokeProcess=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        // let part_line_code = [4, 4, 4, 4, 4, 4, 3, 14, 0, 0, 0, 15, 0, 15, 15, 0, 15, 15, 0, 15, 15, 0, 0, 0, 0]
        let part_line_region_mat = this.partLineRegion(part_line_data)
        console.log('单笔code_region', part_line_code, part_line_region_mat)
        let min_model_mat = []
        for (let ii=0;ii<math_strokes_code.length;ii++){
            // 每笔不同写法下判定
            let part_model_mat = math_strokes_code[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_code = part_model_mat[jj]
                    let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                // console.log('统计', part_min_model_mat)
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        return dis_idx[0]
    }

    MathSingleStrokeProcessMat=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        let part_line_region_mat = this.partLineRegion(part_line_data)
        let statics_mat = this.StaticsLineCode(part_line_code)
        console.log('单笔code_region', part_line_code, part_line_region_mat)
        let min_model_mat = []
        // 新增单笔：1和-的比例
        if((part_line_region_mat[3]-part_line_region_mat[2]+1)/(part_line_region_mat[1]-part_line_region_mat[0]+1)>=6||
            statics_mat[1]>=20){
            // 1
            console.log('特殊比例1')
            return [1,0]
        }
        else if((part_line_region_mat[1]-part_line_region_mat[0]+1)/(part_line_region_mat[3]-part_line_region_mat[2]+1)>=6||
            statics_mat[0]>=20){
            // -
            console.log('特殊比例-')
            return [10,0]
        }
        else{
            for (let ii=0;ii<math_strokes_code.length;ii++){
                // 每笔不同写法下判定
                let part_model_mat = math_strokes_code[ii]
                if (part_model_mat.length<1){
                    min_model_mat.push(1000)
                }
                else{
                    let part_min_model_mat=[];
                    for(let jj=0;jj<part_model_mat.length;jj++){
                        // 一个字母下的每种写法
                        let part_model_code = part_model_mat[jj]
                        let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                        part_min_model_mat.push(part_model_dis_mat)
                        // console.log('统计', part_min_model_mat)
                    }
                    // let min_dis = Math.min.apply(null, part_min_model_mat)
                    // min_model_mat.push(min_dis)
                    // 在这里添加识别每笔多种写法的数据统计
                    let [model_dis_sort, model_idx_length]=this.ArraySortMat(part_min_model_mat)
                    let model_length = Math.ceil(part_min_model_mat.length/4)
                    let model_dis_static = 0
                    for (let model_ii =0;model_ii<model_length;model_ii++){
                        model_dis_static +=model_dis_sort[model_ii]
                    }
                    // console.log('统计, part_min_model_mat, model_dis_sort, model_length, model_dis_static,model_dis_static/model_length')
                    // console.log(part_min_model_mat, model_dis_sort, model_length, model_dis_static,model_dis_static/model_length)
                    min_model_mat.push(model_dis_static/model_length)
                }
            }
            let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
            // console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
            if([0,6].indexOf(dis_idx[0])>-1){
                // 0和6的特殊处理
                // 统计x方向和y方向的数据点
                let part_line_heavy_mat = this.DataToHeavy(part_line_data);
                let part_line_region_mat = this.partLineRegion(part_line_data);
                let part_line_interpolation_mat = this.matInterpolation2(part_line_heavy_mat)
                let [x_statics_mat,y_statics_mat] = this.StatisticsPoints(part_line_interpolation_mat)
                // 统计<2
                console.log('x/y统计', x_statics_mat, y_statics_mat)
                let statics_1 = 0
                for(let sii=0;sii<y_statics_mat.length;sii++){
                    if(y_statics_mat[sii]<2){
                        statics_1 +=1
                    }
                }
                if(statics_1/y_statics_mat.length>0.15 && part_line_region_mat[6]<part_line_region_mat[7]){
                    return [6,dis_sort[0]]
                }
                else{
                    return [0,dis_sort[0]]
                }
            }
            else{
                return [dis_idx[0],dis_sort[0]]
            }
        }
        // return [dis_idx[0],dis_sort[0]]
    }

    ChnSingleStrokeProcessMat=(math_strokes_code,part_line_data)=>{
        // 单笔数据凑得编码
        let part_line_code = this.PartLineCode(part_line_data, 26);
        console.log('单笔code', part_line_code)
        let min_model_mat = []
        for (let ii=0;ii<math_strokes_code.length;ii++){
            // 每笔不同写法下判定
            let part_model_mat = math_strokes_code[ii]
            if (part_model_mat.length<1){
                min_model_mat.push(1000)
            }
            else{
                let part_min_model_mat=[];
                for(let jj=0;jj<part_model_mat.length;jj++){
                    // 一个字母下的每种写法
                    let part_model_code = part_model_mat[jj]
                    let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_code,1)
                    part_min_model_mat.push(part_model_dis_mat)
                    // console.log('统计', part_min_model_mat)
                }
                let min_dis = Math.min.apply(null, part_min_model_mat)
                min_model_mat.push(min_dis)
            }
        }
        let [dis_sort, dis_idx] = this.ArraySortMat(min_model_mat)
        // console.log('模型对比排序', min_model_mat, dis_sort, dis_idx)
        return [dis_idx[0],dis_sort[0]]
    }

    MathAllStrokesProcess = (all_line_data)=>{
        // 全部单笔数据处理---单笔识别
        // console.log('测试', mathstrcaculate.CaculateStepStr('107-7x8'))
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
        }
        console.log('单笔数据区域', part_line_region_mat)
        // 计算基准高度
        let base_height = 0;
        let base_width =0;
        for (let ii =0;ii<part_line_region_mat.length;ii++){
            if (ii==0){
                base_height=part_line_region_mat[ii][3]-part_line_region_mat[ii][2]+1
            }
            else{
                let part_height_000 = part_line_region_mat[ii][3]-part_line_region_mat[ii][2]+1
                if (part_height_000>=base_height*2){
                    base_height = part_height_000
                }
            }
        }
        // 修正识别字符串和数字
        // for (let ii=0;ii<part_line_region_mat.length;ii++){
        //     let part_width_000 = part_line_region_mat[ii][1]-part_line_region_mat[ii][0]+1
        //     let part_height_000 = part_line_region_mat[ii][3]-part_line_region_mat[ii][2]+1
        //     if((part_width_000<base_height*0.4)&&(part_height_000<base_height*0.4)){
        //         all_line_num[ii] = 13
        //         all_line_str[ii] = math_char_judge_num[13]
        //     }
        // }

        // 根据行分区，存储分行矩阵，提供全局单字符的高度和宽度统计：非1、/、\、-外，其余数字的标准高度和宽度，避免小数点
        let row_region_mat=[]  // 行分布的统计
        let all_combine_idx_mat = []  // 所有组合的统计
        let all_combine_region_mat = []  // 所有组合的区域统计
        // 先处理单行分区数据处理组合，在处理多行数据，下一阶段再做分行处理，主要是分数/书写倾斜导致的识别误差
        // 单行的处理可以考虑分数的处理情况，横线上下分组在处理，可根据函数迭代二次调用；横线居中
        for (let ii=0; ii<all_line_idx.length;ii++){
            let part_line_idx = all_line_idx[ii]  // 提取对应分区线条索引
            let part_line_num = all_line_num[part_line_idx] // 提取线条数字
            let part_line_region = part_line_region_mat[part_line_idx]  // 提取线条区域
            if (ii == 0){
                all_combine_idx_mat.push([part_line_idx])
                all_combine_region_mat.push([part_line_region[0],part_line_region[1], part_line_region[2],part_line_region[3]])
                console.log('分区', all_combine_idx_mat)

            }
            else{
                // 查找当前的笔画区域在列方向的相交情况
                let row_overlap_flag = 0
                let row_overlap_idx = 0
                console.log('笔画idx', part_line_idx)
                for (let jj=0;jj<all_combine_region_mat.length;jj++){
                    let compare_ratio_mat = this.TwoRegionRatio(all_combine_region_mat[jj], part_line_region)
                    if (compare_ratio_mat[0]>0.4){
                        row_overlap_flag = 1
                        row_overlap_idx = jj
                        break
                    }
                }
                if (row_overlap_flag == 1){
                    // 发现有相交的横向区域，添加索引到对应组合区域
                    console.log('相交区域row_overlap_idx：', row_overlap_idx)
                    all_combine_idx_mat[row_overlap_idx].push(part_line_idx)
                    let compart_region = this.AllLineRegion([all_combine_region_mat[row_overlap_idx],part_line_region])  //二次重组
                    all_combine_region_mat[row_overlap_idx] = compart_region
                }
                else{
                    // 找到区间中心所处位置
                    console.log('未找到横向相交区域')
                    let part_region_center_x = (part_line_region[0]+part_line_region[1])/2
                    for (let kk=0;kk<all_combine_region_mat.length;kk++){
                        let part_main_center_x0 =(all_combine_region_mat[kk][0]+all_combine_region_mat[kk][1])/2
                        if((kk==0)&&(part_region_center_x<=part_main_center_x0)){
                            console.log('在前')
                            all_combine_idx_mat.splice(0,0,[part_line_idx])
                            all_combine_region_mat.splice(0,0,[part_line_region[0],part_line_region[1], part_line_region[2],part_line_region[3]])
                            break
                        }
                        else if((kk==(all_combine_region_mat.length-1))&&(part_region_center_x>=part_main_center_x0)){
                            console.log('在后')
                            all_combine_region_mat.push([part_line_region[0],part_line_region[1], part_line_region[2],part_line_region[3]])
                            all_combine_idx_mat.push([part_line_idx])
                            break
                        }
                        else if(kk>=1){
                            let part_main_center_x1 =(all_combine_region_mat[kk-1][0]+all_combine_region_mat[kk-1][1])/2;
                            if ((part_region_center_x<=part_main_center_x0) && (part_region_center_x>=part_main_center_x1)){
                                console.log('在中')
                                all_combine_region_mat.splice(kk,0,[part_line_region[0],part_line_region[1], part_line_region[2],part_line_region[3]])
                                all_combine_idx_mat.splice(kk,0,[part_line_idx])
                                break
                            }
                        }
                    }
                }
            }
        }
        console.log('分区', all_combine_idx_mat, all_combine_region_mat)
        // 二次分区组合：多个公共区域
        let all_combine_idx_mat_2nd = []  // 所有组合的统计
        let all_combine_region_mat_2nd = []  // 所有组合的区域统计
        for (let ii=0;ii<all_combine_region_mat.length;ii++){
            if(ii==0){
                all_combine_idx_mat_2nd.push(all_combine_idx_mat[0])
                all_combine_region_mat_2nd.push(all_combine_region_mat[0])
            }
            else{
                let part_region_2nd = all_combine_region_mat[ii]
                let row_overlap_flag = 0
                let row_overlap_idx = 0
                for (let jj=0;jj<all_combine_region_mat_2nd.length;jj++){
                    let part_region_00 = all_combine_region_mat_2nd[jj]
                    // console.log('all_combine_region_mat', ii, jj, part_region_2nd, part_region_00)
                    let compare_ratio_mat = this.TwoRegionRatio(part_region_2nd, part_region_00)
                    if (compare_ratio_mat[0]>0.4){
                        row_overlap_flag = 1
                        row_overlap_idx = jj
                        break
                    }
                }
                // console.log('all_combine_region_mat', ii, row_overlap_flag, row_overlap_idx)
                if (row_overlap_flag == 1){
                    // 合并区域
                    console.log('合并区域', all_combine_region_mat_2nd[row_overlap_idx], part_region_2nd)
                    let region_combine_mat = this.AllLineRegion([all_combine_region_mat_2nd[row_overlap_idx], part_region_2nd])
                    console.log('合并区域', region_combine_mat)
                    all_combine_region_mat_2nd[row_overlap_idx] = region_combine_mat
                    let idx_combine_mat = [all_combine_idx_mat_2nd[row_overlap_idx],all_combine_idx_mat[ii]].flat() //平铺
                    all_combine_idx_mat_2nd[row_overlap_idx]=idx_combine_mat
                }
                else{
                    all_combine_idx_mat_2nd.push(all_combine_idx_mat[ii])
                    all_combine_region_mat_2nd.push(all_combine_region_mat[ii])
                }
            }
        }
        console.log('二次分区', all_combine_idx_mat_2nd)
        // 根据2次分区，依次判定迭代计算出组合字符串
        let end_recognize_mat = []
        for (let ii=0;ii<all_combine_region_mat_2nd.length;ii++){
            let part_combine_idx_2nd = all_combine_idx_mat_2nd[ii]
            let part_combine_region_2nd = all_combine_region_mat_2nd[ii]
            if(part_combine_idx_2nd.length==1){
                // 单笔识别：需要右基准高度/原始字符识别/数字
                let turn_str = this.SingleStrokeTurnStr(part_combine_region_2nd, base_height, all_line_num[part_combine_idx_2nd[0]], all_line_str[part_combine_idx_2nd[0]])
                end_recognize_mat.push(turn_str)
            }
            else if(part_combine_idx_2nd.length==2){
                // 两笔识别
                let part_line1= all_line_data[part_combine_idx_2nd[0]]
                let part_line2 = all_line_data[part_combine_idx_2nd[1]]
                let part_line_mat = [part_line_region_mat[part_combine_idx_2nd[0]],part_line_region_mat[part_combine_idx_2nd[1]]]
                let turn_str = this.DoubleStrokesTurnStr(part_line1,part_line2, part_line_mat, base_height,
                                                        [all_line_num[part_combine_idx_2nd[0]],all_line_num[part_combine_idx_2nd[1]]],
                                                        [all_line_str[part_combine_idx_2nd[0]],all_line_str[part_combine_idx_2nd[1]]])
                if (turn_str!=''){
                    end_recognize_mat.push(turn_str)
                }
            }
            else if(part_combine_idx_2nd.length==3){
                // 多笔识别
                console.log('三笔')
                let line_data_mat0 = []
                let line_num_mat = []
                let line_str_mat = []
                for (let three_ii=0;three_ii<part_combine_idx_2nd.length;three_ii++){
                    line_data_mat0.push(all_line_data[part_combine_idx_2nd[three_ii]])
                    line_num_mat.push(all_line_num[part_combine_idx_2nd[three_ii]])
                    line_str_mat.push(all_line_str[part_combine_idx_2nd[three_ii]])
                }
                let three_turn_mat = this.ThreeStrokesTurnStr(line_data_mat0,base_height,line_num_mat,line_str_mat)
                if(three_turn_mat[0]!=''){
                    end_recognize_mat.push(three_turn_mat[0])
                }
                else{
                    // 新增默认为"÷"
                    end_recognize_mat.push('÷')
                }
            }
            else if(part_combine_idx_2nd.length>3){
                // 多笔识别
                console.log('多笔')
                let line_data_mat0 = []
                let line_num_mat0 = []
                let line_str_mat0 = []
                let line_region_mat0 = []
                for (let three_ii=0;three_ii<part_combine_idx_2nd.length;three_ii++){
                    line_data_mat0.push(all_line_data[part_combine_idx_2nd[three_ii]])
                    line_num_mat0.push(all_line_num[part_combine_idx_2nd[three_ii]])
                    line_str_mat0.push(all_line_str[part_combine_idx_2nd[three_ii]])
                    line_region_mat0.push(part_line_region_mat[part_combine_idx_2nd[three_ii]])
                }
                let multiple_turn_mat = this.MultipleStrokesTurnStr(line_data_mat0,line_num_mat0,line_str_mat0,line_region_mat0)
                if(multiple_turn_mat[0]!=''){
                    end_recognize_mat.push(multiple_turn_mat[0])
                }
            }
            else{
                console.log('数据有误')
                end_recognize_mat.push('')
            }
        }
        console.log('组合数据', end_recognize_mat)
        // 组合字符串
        let all_str =  ''
        for (let ii=0;ii<end_recognize_mat.length;ii++){
            all_str +=end_recognize_mat[ii]
        }
        // 转换显示字符
        let turn_view_mat0=[]
        for (let ii=0;ii<end_recognize_mat.length;ii++){
            let part_split = end_recognize_mat[ii].split('/')
            if (part_split.length == 1){
                turn_view_mat0.push(part_split)
            }
            else if(part_split.length == 2){
                part_split.splice(1,0,'-')
                turn_view_mat0.push(part_split)
            }
        }
        console.log('分解', turn_view_mat0)
        let turn_view_mat1=[] //组合
        let math_combine_str = ''
        for(let ii=0;ii<turn_view_mat0.length;ii++){
            console.log('数据',turn_view_mat0[ii], turn_view_mat0[ii].length,math_combine_str.length)
            if (turn_view_mat0[ii].length==3){
                // 还需进一步处理，分数之间的运算会导致分子分母的运算算式
                if (math_combine_str.length>0){
                    turn_view_mat1.push([math_combine_str])
                    turn_view_mat1.push(turn_view_mat0[ii])
                    math_combine_str =''
                }
                else{
                    turn_view_mat1.push(turn_view_mat0[ii])
                }
            }
            else if(turn_view_mat0[ii].length==1){
                console.log('查询位置', ['0','1','2','3','4','5','6','7','8','9','.'].indexOf(turn_view_mat0[ii][0]))
                if (['0','1','2','3','4','5','6','7','8','9','.'].indexOf(turn_view_mat0[ii][0])>-1||
                    ['+','-','x','/','*','X','÷','(',')','[',']','{','}'].indexOf(turn_view_mat0[ii][0])==-1){
                    // 是数字或小数点组合/两种判别方式
                    math_combine_str += turn_view_mat0[ii][0]
                    console.log('组合字符串', math_combine_str)
                    if(ii==turn_view_mat0.length-1){
                        turn_view_mat1.push([math_combine_str])
                    }
                }
                else{
                    if(math_combine_str.length>0){
                        if (turn_view_mat0[ii][0].length>0){
                            // 非空计算符号
                            turn_view_mat1.push([math_combine_str])
                            turn_view_mat1.push(turn_view_mat0[ii])
                            math_combine_str =''
                        }
                    }
                    else{
                        turn_view_mat1.push(turn_view_mat0[ii])
                    }
                }
            }
        }

        console.log('组合数组2', turn_view_mat1, all_str)
        //  标准字符串
        let all_str2 = mathstrcaculate.standardstr(all_str)
        let error_flag=0
        try {
            console.log('算式结果',eval(all_str2))
            mathstrcaculate.RecognizeMatTurnStandardMat(turn_view_mat1)
        }
        catch(exception){
            error_flag = -1
        }
        let standard_str_mat= []
        if (error_flag==-1){
            // 错误算式，不执行分步计算
            standard_str_mat.push([turn_view_mat1])
            standard_str_mat.push([turn_view_mat1])
            standard_str_mat.push([turn_view_mat1])
            standard_str_mat.push([turn_view_mat1])
            standard_str_mat.push([turn_view_mat1])
        }
        else{
            console.log('有效')
            standard_str_mat = mathstrcaculate.RecognizeMatTurnStandardMat(turn_view_mat1)
        }
        // let num_001 = ['5','-','4']
        // let num_002 = ['2','-','5']
        // let fraction_mat1 = mathstrcaculate.FractionAdd(num_001, num_002)
        // let fraction_mat2 = mathstrcaculate.FractionSubtract(num_001, num_002)
        // let fraction_mat3 = mathstrcaculate.FractionMultiply(num_001, num_002)
        // let fraction_mat4 = mathstrcaculate.FractionDivide(num_001, num_002)
        // console.log('数字转分数', fraction_mat1,fraction_mat2,fraction_mat3,fraction_mat4)
        return [all_line_str.toString()+'\n'+end_recognize_mat.toString()+'\n'+all_str, all_str,turn_view_mat1,standard_str_mat]
    }

    MathMultiRowProcess = (all_line_data)=>{
        // 多行处理
        // 单笔区域
        let part_line_region_mat = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
        }
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        let [statics_x_mat,statics_y_mat]=this.StatisticsXYMat(all_line_data, all_line_region,1)
        console.log('统计x', statics_x_mat)
        console.log('统计y', statics_y_mat)
        // 统计1-0和0-1变化
        let mat_1_0 = []
        let mat_0_1 = []
        for(let ii=0;ii<statics_y_mat.length-1;ii++){
            if(statics_y_mat[ii]>0&&statics_y_mat[ii+1]==0){
                mat_1_0.push(ii+all_line_region[2])
            }
            else if(statics_y_mat[ii]==0&&statics_y_mat[ii+1]>0){
                mat_0_1.push(ii+all_line_region[2])
            }
        }
        mat_1_0.push(all_line_region[3])
        console.log('1_0和0_1统计',all_line_region, mat_1_0,mat_0_1)
        // 分线条索引
        let sub_line_idx_mat = []
        for (let ii=0;ii<mat_1_0.length;ii++){
            sub_line_idx_mat.push([])
        }
        for(let ii=0;ii<part_line_region_mat.length;ii++){
            let part_y_center = (part_line_region_mat[ii][2]+part_line_region_mat[ii][3])/2
            // console.log('单笔y中心', part_y_center)
            for(let jj=0;jj<mat_1_0.length;jj++){
                if(jj==0 && part_y_center<=mat_1_0[jj]){
                    sub_line_idx_mat[jj].push(ii)
                }
                else if(part_y_center>mat_1_0[jj-1]&&part_y_center<=mat_1_0[jj]){
                    sub_line_idx_mat[jj].push(ii)
                }
            }
        }
        console.log('索引分区', sub_line_idx_mat)
        // 分行处理
        let all_str_mat = []
        let all_str_mat2 = []
        for(let ii=0;ii<sub_line_idx_mat.length;ii++){
            let part_all_line_data = []
            for(let jj=0;jj<sub_line_idx_mat[ii].length;jj++){
                part_all_line_data.push(all_line_data[sub_line_idx_mat[ii][jj]])
            }
            let part_all_line_rec_mat = this.MathAllStrokesProcess(part_all_line_data)
            console.log('单行处理', part_all_line_rec_mat[1])
            all_str_mat.push(part_all_line_rec_mat[1])
            all_str_mat2.push(part_all_line_rec_mat[1])
            all_str_mat2.push('\n')
        }
        console.log('多行处理', all_str_mat)
        return [all_str_mat,all_str_mat2]
    }


    SingleStrokeTurnStr=(part_region_mat,base_height,base_num,base_str)=>{
        // 单笔识别
        let single_str;
        if ((part_region_mat[1]-part_region_mat[0]+1)<=base_height*0.3 &&(part_region_mat[3]-part_region_mat[2]+1)<=base_height*0.3){
            single_str = '.';
        }
        else if (base_num==4){
            single_str = '2';
        }
        else if (base_num==5){
            single_str = '5';
        }
        else if (base_num==13){
            single_str = '-';
        }
        else{
            single_str = base_str;
        }
        return single_str;
    }

    DoubleStrokesTurnStr = (line_data1,line_data2, part_line_mat, base_height,line_num_mat,line_str_mat)=>{
        // 两笔组合识别：+45x≈= 一笔数字和小数点等其他数字的组合
        // 先判断两条线是否相交
        let single_str;
        let two_line_cross_mat = this.JudgeTwoLineRelation(line_data1,line_data2)
        let vector_line1 = [line_data1[0][line_data1[0].length-1]-line_data1[0][0],line_data1[1][line_data1[1].length-1]-line_data1[1][0]]
        let vector_line2 = [line_data2[0][line_data2[0].length-1]-line_data2[0][0],line_data2[1][line_data2[1].length-1]-line_data2[1][0]]
        let vector_angle = this.CosineSimilarity(vector_line1,vector_line2)
        if(two_line_cross_mat[0]==1){
            // 两条线相交
            console.log('两条相交', line_num_mat, Math.abs(vector_angle))
            if (this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_add)){
                if (Math.abs(vector_angle)<=0.6){
                    single_str = '+' 
                }
                else{
                    single_str = 'x' 
                }
            }
            else if(this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_multi)){
                single_str = 'x' 
            }
            else if (this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_4)){
                single_str = '4' 
            }
            else if(this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_5)){
                single_str = '5' 
            }
            else{
                console.log('其他情况，可能考虑删除该次书写的数字')
                single_str = ''
            }
        }
        else{
            // 两条直线不相交：=、≈、5，其他数据不相交的
            if  (this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_equal)){
                // 需要添加角度限制？
                let angle_line1 = vector_line1[1]/vector_line1[0]
                let angle_line2 = vector_line2[1]/vector_line2[0]
                if (Math.abs(angle_line1)<0.5 && Math.abs(angle_line2)<0.5){
                    single_str = '='
                }
                else{
                    single_str = ''
                }
            }
            else if(this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_approximat)){
                single_str = '≈'
            }
            else if (this.MultiJudgeTwoMatEqual(line_num_mat,fuzzy_num_5)){
                single_str = '5'
            }
            // 新增判定：2020-12-14
            else if(line_num_mat.indexOf(14)>=0){
                single_str = '≈'
            }
            else if(line_num_mat.indexOf(10)>=0){
                single_str = '='
            }
            else{
                // 两个不存在组合的单笔，先判断两个中心的前后顺序
                let line_center1 = (part_line_mat[0][0]+part_line_mat[0][1])/2
                let line_center2 = (part_line_mat[1][0]+part_line_mat[1][1])/2
                if(line_center1<=line_center2){
                    if ((part_line_mat[0][1]-part_line_mat[0][0]+1)<base_height*0.4 && (part_line_mat[0][3]-part_line_mat[0][2]+1)<base_height*0.4){
                        single_str = '.'
                    }
                    else{
                        single_str = line_str_mat[0]
                    }
                    if ((part_line_mat[1][1]-part_line_mat[1][0]+1)<base_height*0.4 && (part_line_mat[1][3]-part_line_mat[1][2]+1)<base_height*0.4){
                        single_str = single_str + '.'
                    }
                    else{
                        single_str = single_str + line_str_mat[1]
                    }
                }
                else{
                    if ((part_line_mat[1][1]-part_line_mat[1][0]+1)<base_height*0.4 && (part_line_mat[1][3]-part_line_mat[1][2]+1)<base_height*0.4){
                        single_str = '.'
                    }
                    else{
                        single_str = line_str_mat[1]
                    }
                    if ((part_line_mat[0][1]-part_line_mat[0][0]+1)<base_height*0.4 && (part_line_mat[0][3]-part_line_mat[0][2]+1)<base_height*0.4){
                        single_str = single_str + '.'
                    }
                    else{
                        single_str = single_str + line_str_mat[0]
                    }
                }
            }
        }
        return single_str;
    }

    ThreeStrokesTurnStr = (line_data_mat,base_height,line_num_mat,line_str_mat)=>{
        // 先计算分笔画和整体的局域
        console.log('3组', line_num_mat,line_str_mat)
        let single_str
        let single_mat=[]
        let part_region_mat0 =[]
        for(let ii=0;ii<line_data_mat.length;ii++){
            let single_line_region = this.partLineRegion(line_data_mat[ii])
            part_region_mat0.push(single_line_region)
        }
        let all_region_mat0 = this.AllLineRegion(part_region_mat0)
        let fraction_mode = 0  // 分数模式判定
        let up_num,down_num,midlle_num
        for (let ii=0;ii<line_num_mat.length;ii++){
            up_num = -10
            down_num = -10
            midlle_num = -10
            if (line_num_mat[ii]==10){
                // 横线，判定其余两组线段是否与其相交，及其相对位置关系
                for(let jj=0;jj<line_num_mat.length;jj++){
                    if (ii!=jj){
                        let two_line_relation_mat = this.JudgeTwoLineRelation(line_data_mat[ii],line_data_mat[jj])
                        if (two_line_relation_mat[2]*two_line_relation_mat[0]<0.1||(1-two_line_relation_mat[2])*two_line_relation_mat[0]<0.1){
                            // 与横线相离：判断上下
                            if((part_region_mat0[ii][2]+part_region_mat0[ii][3])>(part_region_mat0[jj][2]+part_region_mat0[jj][3])){
                                // 在上
                                up_num = jj
                            }
                            else if ((part_region_mat0[ii][2]+part_region_mat0[ii][3])<(part_region_mat0[jj][2]+part_region_mat0[jj][3])){
                                // 在下
                                down_num = jj
                            }
                        }
                    }
                }
                if((up_num+down_num)>0){
                    midlle_num = ii
                    fraction_mode = 1
                    break
                }
            }
        }
        console.log('上下idx', up_num, down_num, midlle_num)
        if(fraction_mode==1){
            // 分数 除法 模型
            console.log('标号', line_num_mat[up_num], line_num_mat[down_num])
            console.log('查找', [0,2,3,6,7,8,9].indexOf(line_num_mat[up_num])>-1, [0,2,3,6,7,8,9].indexOf(line_num_mat[down_num]))
            if(([0,2,3,6,7,8,9].indexOf(line_num_mat[up_num]))>-1||([0,2,3,6,7,8,9].indexOf(line_num_mat[down_num]))>-1){
                if ([1,10,11,12].indexOf(line_num_mat[up_num])>-1){
                    single_str = '1'
                    single_mat.push(single_str)
                }
                else{
                    single_str = line_str_mat[up_num]
                    single_mat.push(single_str)

                }
                single_mat.push('-')
                if ([1,10,11,12].indexOf(line_num_mat[down_num])>-1){
                    single_str = single_str+ '/1'
                    single_mat.push('1')
                }
                else{
                    single_str = single_str + '/'+ line_str_mat[down_num]
                    single_mat.push(line_str_mat[down_num])
                }
            }
            else{
                single_str = '÷'
                single_mat = ['÷']
            }
        }
        else{
            console.log('其他模式')
            // 先找到小数点的特征
            let decimal_num = -1
            let decimal_region_mat
            for (let ii=0;ii<3;ii++){
                decimal_region_mat = part_region_mat0[ii]
                if ((decimal_region_mat[1]-decimal_region_mat[0]+1)<(all_region_mat0[1]-all_region_mat0[0]+1)*0.4&&
                    (decimal_region_mat[3]-decimal_region_mat[2]+1)<(all_region_mat0[3]-all_region_mat0[2]+1)*0.4&&
                    (decimal_region_mat[3]+decimal_region_mat[2])>(all_region_mat0[3]+all_region_mat0[2])){
                        decimal_num = ii
                        break
                    }
            }
            if (decimal_num>-1){
                let line_num_mat_2=[]
                let line_str_mat_2=[]
                let part_line_mat_2=[]
                let all_line_data_2 = []
                for (let ii =0;ii<3;ii++){
                    if (ii!=decimal_num){
                        line_num_mat_2.push(line_num_mat[ii])
                        line_str_mat_2.push(line_str_mat[ii])
                        part_line_mat_2.push(part_region_mat0[ii])
                        all_line_data_2.push(line_data_mat[ii])
                    }
                }
                let base_height_2 = all_region_mat0[3]-all_region_mat0[2]+1
                if((decimal_region_mat[1]+decimal_region_mat[0])<(all_region_mat0[1]+all_region_mat0[0])){
                    // 小数点在前
                    single_str = '.'
                    let three_str = this.DoubleStrokesTurnStr(all_line_data_2[0],all_line_data_2[1], part_line_mat_2, base_height_2,line_num_mat_2,line_str_mat_2)
                    single_str = single_str+three_str
                }
                else{
                    // 小数点在后
                    let three_str = this.DoubleStrokesTurnStr(all_line_data_2[0],all_line_data_2[1], part_line_mat_2, base_height_2,line_num_mat_2,line_str_mat_2)
                    single_str = three_str
                    single_str = single_str +'.'
                }
            }
            else{
                // 未找到 直接判删除
                console.log('未找到')
                single_str = '÷'   // 2021-05-11 修改
            }
        }
        return [single_str, single_mat]
    }

    MultipleStrokesTurnStr=(line_data_mat0,line_num_mat0,line_str_mat0,line_region_mat0)=>{
        // 先粗略判断是分数还是多笔相交区域（剔除该部分数据）
        console.log('多笔数据处理', line_num_mat0)
        // 全局有效区域
        let line_all_region = this.AllLineRegion(line_region_mat0)
        // 判断全局区域是否是部件的全局区域的两倍左右
        let line_height_mat = []
        for(let ii=0;ii<line_region_mat0.length;ii++){
            line_height_mat.push(line_region_mat0[ii][3]-line_region_mat0[ii][2]+1)
        }
        let line_height_max = Math.max.apply(null,line_height_mat)
        let fraction_mode = 0
        if(1.8*line_height_max<(line_all_region[3]-line_all_region[2]+1)){
            fraction_mode = 1
            console.log('分数模式', line_height_max, (line_all_region[3]-line_all_region[2]+1))
        }
        // 再去找长横线，剧中，‘-’
        let fraction_mode2 = 0
        let fraction_line_idx = -1
        for(let ii=0;ii<line_num_mat0.length;ii++){
            if (line_num_mat0[ii]==10){
                let all_line_region_up = line_all_region[2]+(line_all_region[3]-line_all_region[2]+1)*1/3
                let all_line_region_down = line_all_region[2]+(line_all_region[3]-line_all_region[2]+1)*2/3
                let single_line_center_y = (line_region_mat0[ii][2]+line_region_mat0[ii][3])/2
                if((line_region_mat0[ii][1]-line_region_mat0[ii][0]+1)>(line_all_region[1]-line_all_region[0]+1)*0.8&&
                    single_line_center_y>all_line_region_up&&single_line_center_y<all_line_region_down){
                    fraction_mode2 = 1
                    fraction_line_idx = ii
                    console.log('找到分数线位置', fraction_line_idx)
                    break
                }
            }
        }
        // 上下分区
        let fraction_str
        let fraction_mat
        if (fraction_mode*fraction_mode2==1){
            // 综合考虑分数模式，分子分母分区
            let fraction_numerator_num =[]
            let fraction_denominator_num =[]
            let fraction_numerator_line_data =[]
            let fraction_denominator_line_data =[]
            let fraction_line_center_y = (line_region_mat0[fraction_line_idx][2]+line_region_mat0[fraction_line_idx][3])/2
            for (let ii =0; ii<line_num_mat0.length;ii++){
                if (ii!=fraction_line_idx){
                    let part_line_center_y = (line_region_mat0[ii][2]+line_region_mat0[ii][3])/2
                    if(part_line_center_y<fraction_line_center_y){
                        // 分子
                        fraction_numerator_num.push(line_num_mat0[ii])
                        fraction_numerator_line_data.push(line_data_mat0[ii])
                    }
                    else{
                        // 分母
                        fraction_denominator_num.push(line_num_mat0[ii])
                        fraction_denominator_line_data.push(line_data_mat0[ii])
                    }
                }
            }
            console.log('分子', fraction_numerator_num)
            console.log('分母', fraction_denominator_num)
            // 再回调 全局处理函数
            let fraction_numerator_str_mat = this.MathAllStrokesProcess(fraction_numerator_line_data)
            let fraction_denominator_str_mat = this.MathAllStrokesProcess(fraction_denominator_line_data)
            console.log('分子识别组合', fraction_numerator_str_mat)
            console.log('分母识别组合', fraction_denominator_str_mat)
            fraction_str = fraction_numerator_str_mat[1]+'/'+ fraction_denominator_str_mat[1]
            fraction_mat = [fraction_numerator_str_mat[2],'-', fraction_denominator_str_mat[2]]
        }
        else{
            fraction_str = ''
            fraction_mat = []
        }

        return [fraction_str, fraction_mat]
    }


    MathCaculateEnd=(math_str)=>{
        // let math_end = eval(math_str)
        console.log('算式', math_str)
        let math_end = mathstrcaculate.CaculateStepStr(math_str)
        let math_end_str = ''
        for(let ii=0;ii<math_end.length;ii++){
            math_end_str += math_end[ii]+'\n'
        }
        return math_end_str 

    }

    MathStandardStrTurn=(standard_str_mat)=>{
        let standard_str = ''
        for(let ii=0;ii<standard_str_mat.length;ii++){
            if(ii==0){
                standard_str +='  '+standard_str_mat[ii]
            }
            else{
                standard_str += '\n='+standard_str_mat[ii]
            }
        }
        return standard_str
    }

    MathNumCompletion=(all_line_data)=>{
        console.log('数字填空题')
        // 全部单笔数据处理---单笔识别
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        console.log('基准高度', base_height1)
        // console.log('单笔数据区域', part_line_center_x_mat)
        // 计算基准高度
        let sort_height_idx_mat = this.ArraySortMat(part_height_mat)
        if (part_height_mat.length>=10){
            console.log('重新计算基准高度')
        }
        // 根据基准高度重新识别小数点
        for(let ii=0;ii<all_line_num.length;ii++){
            if (part_width_mat[ii]<=base_height1*0.3 && part_height_mat[ii]<=base_height1*0.4){
                all_line_num[ii]=13
                all_line_str[ii]='.'
            }
        }
        console.log('修正单笔识别', all_line_str)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                    combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){// 新增3和-的组合, 2020-12-03
                    combine_str_mat.push('5')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_str_mat = []
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_str_mat.push(part_combine_str_3rd)
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    if(y_region_ratio_mat[0]>0.1 && (x_region_ratio_mat[0]>0.1 || min_dis_x_mat[0]<base_height1*1.5)){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        nums_combine_str_mat[jj] +=part_combine_str_3rd
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_str_mat.push(part_combine_str_3rd)
                }
            }
        }
        console.log('分区数字组合', nums_combine_str_mat, nums_combine_region_mat)
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+'#'
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        console.log('return_mat', return_mat, col_nums_mat,[nums_combine_region_mat,col_idx_mat])
        return [return_mat,col_nums_mat,[nums_combine_region_mat,col_idx_mat]]
    }


    MathMixCompletion=(all_line_data)=>{
        console.log('数字符号混合填空题')
        // 全部单笔数据处理---单笔识别
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        console.log('基准高度', base_height1)
        // console.log('单笔数据区域', part_line_center_x_mat)
        // 计算基准高度
        let sort_height_idx_mat = this.ArraySortMat(part_height_mat)
        if (part_height_mat.length>=10){
            console.log('重新计算基准高度')
        }
        // 根据基准高度重新识别小数点
        for(let ii=0;ii<all_line_num.length;ii++){
            if (part_width_mat[ii]<=base_height1*0.3 && part_height_mat[ii]<=base_height1*0.4){
                all_line_num[ii]=13
                all_line_str[ii]='.'
            }
        }
        console.log('修正单笔识别', all_line_str)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                    combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){// 新增3和-的组合, 2020-12-03
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                console.log('3笔处理', JSON.stringify([part_combine_num, part_combine_str, part_combine_center]))
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_str_mat = []
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_str_mat.push(part_combine_str_3rd)
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*0.5)){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        nums_combine_str_mat[jj] +=part_combine_str_3rd
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_str_mat.push(part_combine_str_3rd)
                }
            }
        }
        console.log('分区数字组合', nums_combine_str_mat, nums_combine_region_mat)
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+'#'
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        console.log('return_mat', return_mat, col_nums_mat,[nums_combine_region_mat,col_idx_mat])
        // 筛选字符串内除号
        for (let jj=0;jj<col_nums_mat.length;jj++){
            for(let kk=0;kk<col_nums_mat[jj].length;kk++){
                let flag_div =0
                if(col_nums_mat[jj][kk].length>=3){
                    for(let mm=0;mm<col_nums_mat[jj][kk].length-2;mm++){
                        let part_str = col_nums_mat[jj][kk][mm]+col_nums_mat[jj][kk][mm+1]+col_nums_mat[jj][kk][mm+2]
                        // console.log('组合符号',part_str)
                        if(fuzzy_div_mat.indexOf(part_str)>=0){
                            // console.log('找到除号0',col_nums_mat[jj][kk])
                            col_nums_mat[jj][kk] = col_nums_mat[jj][kk].replace(part_str, '÷')
                            // console.log('找到除号1',col_nums_mat[jj][kk])
                            mm=0
                            // break
                        }
                    }
                }
                else{
                    flag_div = 1 
                }                
            }
        }
        // console.log('return_mat1', return_mat, col_nums_mat,JSON.stringify([nums_combine_region_mat,col_idx_mat]))
        // 重新排序区域和索引
        let new_col_idx_mat = []
        let new_nums_combine_region_mat = []
        let new_idx_num =-1
        for (let jj=0;jj<col_idx_mat.length;jj++){
            let part_new_col_idx_mat = []
            let part_new_nums_combine_region_mat = []
            for (let kk=0;kk<col_idx_mat[jj].length;kk++){
                new_idx_num +=1
                part_new_col_idx_mat.push(new_idx_num)
                new_nums_combine_region_mat.push(nums_combine_region_mat[col_idx_mat[jj][kk]])
            }
            new_col_idx_mat.push(part_new_col_idx_mat)
        }
        // console.log('新组合：上下左右排序1111', JSON.stringify([new_nums_combine_region_mat, new_col_idx_mat]))
        // 筛选数组内的除号
        let idx_div_num = -1
        for(let jj=0;jj<col_nums_mat.length;jj++){
            if(col_nums_mat[jj].length<3){
                idx_div_num +=col_nums_mat[jj].length
            }
            else{
                for(let kk=0;kk<col_nums_mat[jj].length;kk++){
                    idx_div_num +=1
                    if(kk<col_nums_mat[jj].length-2){
                        let part_str = col_nums_mat[jj][kk]+col_nums_mat[jj][kk+1]+col_nums_mat[jj][kk+2]
                        // console.log('组合符号',part_str)
                        if(fuzzy_div_mat.indexOf(part_str)>=0){
                            // console.log('找到除号0',col_nums_mat[jj])
                            col_nums_mat[jj].splice(kk, 3, '÷')
                            // console.log('找到除号1',col_nums_mat[jj])
                            // 区域组合
                            let part_all_region_div = this.AllLineRegion([new_nums_combine_region_mat[idx_div_num],
                                                                          new_nums_combine_region_mat[idx_div_num+1],
                                                                          new_nums_combine_region_mat[idx_div_num+2]])
                            new_nums_combine_region_mat.splice(idx_div_num, 3, part_all_region_div)
                            // break
                            new_col_idx_mat[jj].splice(kk,3,idx_div_num)
                            // console.log('新组合：上下左右排序-----', JSON.stringify([new_nums_combine_region_mat, new_col_idx_mat]))
                            for (let pp=0;pp<new_col_idx_mat.length;pp++){
                                for(let qq=0;qq<new_col_idx_mat[pp].length;qq++){
                                    if(new_col_idx_mat[pp][qq]>idx_div_num){
                                        new_col_idx_mat[pp][qq] = new_col_idx_mat[pp][qq]-2
                                    }
                                }
                            }
                            // console.log('新组合：上下左右排序:::::', JSON.stringify([new_nums_combine_region_mat, new_col_idx_mat]))
                        }
                    }

                }
            }
            
        }
        // console.log('新组合：上下左右排序22222', JSON.stringify([new_nums_combine_region_mat, new_col_idx_mat]))
        console.log('return_mat2', return_mat, col_nums_mat,JSON.stringify([new_nums_combine_region_mat, new_col_idx_mat]))
        return [return_mat,col_nums_mat,[new_nums_combine_region_mat, new_col_idx_mat]]
    }


    MathJudgementCompletion=(all_line_data)=>{
        console.log('判断题')
        // 全部单笔数据处理---调用填空题
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        console.log('基准高度', base_height1)
        // console.log('单笔数据区域', part_line_center_x_mat)
        // 根据基准高度重新识别小数点
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                    combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){// 新增3和-的组合, 2020-12-03
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    // console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    // let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    // combine_str_mat.push(combine_str001)
                    combine_str_mat.push('x')
                }
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_str_mat = []
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_str_mat.push(part_combine_str_3rd)
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*0.1)){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        nums_combine_str_mat[jj] +=part_combine_str_3rd
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_str_mat.push(part_combine_str_3rd)
                }
            }
        }
        console.log('分区数字组合', nums_combine_str_mat, nums_combine_region_mat)
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+'#'
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        console.log('return_mat', return_mat, col_nums_mat,[nums_combine_region_mat,col_idx_mat])

        // let math_recon_mat = this.MathMixCompletion(all_line_data)
        let symboles_mat = col_nums_mat
        let remind_judgement_mat = []
        for(let ii=0;ii<symboles_mat.length;ii++){
            let part_remind_mat = []
            for(let jj=0;jj<symboles_mat[ii].length;jj++){
                if(symboles_mat[ii][jj]=='\\' || symboles_mat[ii][jj]=='/'){
                    part_remind_mat.push(symboles_mat[ii][jj])
                }
                else if(symboles_mat[ii][jj] == 'x'){
                    part_remind_mat.push(symboles_mat[ii][jj])
                }
                else{
                    part_remind_mat.push('√')
                }
            }
            remind_judgement_mat.push(part_remind_mat)
        }
        console.log(JSON.stringify(remind_judgement_mat))
        return [remind_judgement_mat]
    }


    MathVerticalCalculation=(all_line_data)=>{
        console.log('竖式计算题000')
        // 全部单笔数据处理---单笔识别
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        console.log('基准高度', base_height1)
        // console.log('单笔数据区域', part_line_center_x_mat)
        // 计算基准高度
        let sort_height_idx_mat = this.ArraySortMat(part_height_mat)
        if (part_height_mat.length>=10){
            console.log('重新计算基准高度')
            // 修改高度 新增哪里，可以在识别后再重组大小 2020-11-30
        }
        // 根据基准高度重新识别小数点
        for(let ii=0;ii<all_line_num.length;ii++){
            if (part_width_mat[ii]<=base_height1*0.2 && part_height_mat[ii]<=base_height1*0.2){// 修改标准高度0.2,新增：2020-11-30
                all_line_num[ii]=13
                all_line_str[ii]='.'
            }
        }
        console.log('修正单笔识别', all_line_str)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else if(all_line_num[part_idx_mat[0]]==11 || all_line_num[part_idx_mat[0]]==12){
                    // 修正斜杠\/
                    let part_slash_data = all_line_data[part_idx_mat[0]]
                    let slash_y = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_x = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_k = Math.abs(slash_y/slash_x)
                    console.log('单笔斜杠竖式计算处理', slash_k)
                    if (slash_k>=1){
                        combine_str_mat.push('1')
                    }
                    else{
                        combine_str_mat.push('-')
                    }
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                        combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){ //新增3和-组合, 2020-12-03
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_mat_mat = []
        let all_part_region_mat = [] // 存储每个字符的区域
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_mat_mat.push([part_combine_str_3rd])
                all_part_region_mat.push([part_combine_region_3rd])
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    console.log('计算符号', part_combine_str_3rd, ['+','-','X','x'].indexOf(part_combine_str_3rd))
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*1)
                        // &&['+','-','X','x'].indexOf(part_combine_str_3rd)==-1
                        // &&['+','-','X','x'].indexOf(nums_combine_str_mat[jj][0])==-1
                        ){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        // 对于竖式计算加减乘法符号组后再单独分析一次,计算符号的位置
                        nums_combine_mat_mat[jj].push(part_combine_str_3rd)
                        all_part_region_mat[jj].push(part_combine_region_3rd)
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_mat_mat.push([part_combine_str_3rd])
                    all_part_region_mat.push([part_combine_region_3rd])
                }
            }
        }
        console.log('分区数字组合000', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        // 二次行列组合:可以单设一种处理函数,用于处理行列分区,找到行方向的分布组合
        // 组合等号和除号的区域
        let while_flag = 1
        while(while_flag>0){
            if(nums_combine_region_mat.length>=2){
                for (let ii=0;ii<nums_combine_region_mat.length;ii++){
                    let ii_flag = 1
                    console.log('ii',ii)
                    for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                        if(ii!=jj){
                            // 判断两组区域的y方向交叉
                            // console.log('ii',ii,'jj',jj)
                            let y_region_ratio_mat = this.TwoRegionRatio([nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]],
                                                                        [nums_combine_region_mat[jj][2],nums_combine_region_mat[jj][3]])
                            if(y_region_ratio_mat[0]>0.3){
                                console.log('存在相交区域ii/jj',ii,jj)
                                // 组合两组区域：所有数据：字符串、全局区域、单区域
                                let part_single_region_ii = all_part_region_mat[ii]
                                let part_single_region_jj = all_part_region_mat[jj]
                                let part_single_str_ii = nums_combine_mat_mat[ii]
                                let part_single_str_jj = nums_combine_mat_mat[jj]
                                let part_ii_jj_all_region = this.AllLineRegion([nums_combine_region_mat[ii], nums_combine_region_mat[jj]])  //重新组合的全局区域
                                let recombine_mat = this.TwoRegionMatCombine(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)
                                if (ii<jj){
                                    // 删减位置不同:其实不用，先替换后删除
                                    nums_combine_region_mat.splice(jj,1,)
                                    nums_combine_region_mat.splice(ii,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(jj,1)
                                    nums_combine_mat_mat.splice(ii,1,recombine_mat[1])
                                    all_part_region_mat.splice(jj,1)
                                    all_part_region_mat.splice(ii,1,recombine_mat[0])               
                                }
                                else if(ii>jj){
                                    nums_combine_region_mat.splice(ii,1,)
                                    nums_combine_region_mat.splice(jj,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(ii,1)
                                    nums_combine_mat_mat.splice(jj,1,recombine_mat[1])
                                    all_part_region_mat.splice(ii,1)
                                    all_part_region_mat.splice(jj,1,recombine_mat[0])
                                }
                                ii_flag = 0
                                break
                            }
                            // else if(jj == nums_combine_region_mat.length-1){
                            //     ii_flag = 0
                            // }
                        }     
                    }
                    if(ii_flag==0){
                        break
                    }
                    // 遍历完重组所有的区域
                    if(ii == nums_combine_region_mat.length-1){
                        while_flag = 0
                        break
                    }
                }
                if (while_flag==0){
                    break
                }
            }
            else{
                break
            }
        }
        
        console.log('分区数字组合001', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            if(nums_combine_mat_mat[ii].length>1){
                let equal_flag =1
                console.log('组合处理00',JSON.stringify(nums_combine_mat_mat))
                while(equal_flag>0){
                    console.log('组合处理1',nums_combine_mat_mat[ii])
                    equal_flag = 0
                    for(let jj=0; jj<nums_combine_mat_mat[ii].length-1;jj++){
                        // 连续判断出现等号的情况
                        let part_str1 = nums_combine_mat_mat[ii][jj]
                        let part_str2 = nums_combine_mat_mat[ii][jj+1]
                        if ((part_str1=='-'&&part_str2=='-')||(part_str1=='-'&&part_str2=='.')||(part_str1=='.'&&part_str2=='-')){
                            // 连续出现两横,判断组合区域的大小比
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj][1]-all_part_region_mat[ii][jj][0])*1.5||
                                (part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj+1][1]-all_part_region_mat[ii][jj+1][0])*1.5){
                                // 组合区域小于一个比例
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if(part_str1=='.'&&part_str2=='.'){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[3]-part_str_all_region[2]+1)/(part_str_all_region[1]-part_str_all_region[0]+1)>1){
                                nums_combine_mat_mat[ii].splice(jj,2,':')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                            else{
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if((part_str1==':'&&part_str2=='-')||(part_str1=='-'&&part_str2==':')||
                                (part_str1=='='&&part_str2=='.')||(part_str1=='.'&&part_str2=='=')){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            nums_combine_mat_mat[ii].splice(jj,2,'÷')
                            all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                            equal_flag = 1
                            break
                        }
                    }
                }   
            }
        }
        console.log('分区数字组合等号', nums_combine_mat_mat, nums_combine_region_mat,all_part_region_mat)
        let nums_combine_str_mat = []
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            let part_str_str = ''
            for(let jj=0;jj<nums_combine_mat_mat[ii].length;jj++){
                part_str_str +=nums_combine_mat_mat[ii][jj]
            }
            nums_combine_str_mat.push(part_str_str)
        }
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        let new_single_combine_mat = []
        let new_single_str_mat = []
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            new_single_combine_mat.push(all_part_region_mat[row_idx_sort_mat[1][ii]])
            new_single_str_mat.push(nums_combine_mat_mat[row_idx_sort_mat[1][ii]])
            // 单行多组处理
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat,new_single_combine_mat, new_single_str_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+' '
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        // 分解:考虑单行单组，和多组数字组合，现只分离计算符号
        let combine_str_row_col_mat = []
        for(let ii=0;ii<col_nums_mat.length;ii++){
            combine_str_row_col_mat.push([])
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii][0].length;jj++){
                // console.log('前',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)
                if(['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(col_nums_mat[ii][0][jj])!=-1){
                    // console.log('符号出现', part_nums_str, col_nums_mat[ii][0][jj])
                    if (part_nums_str.length<1){
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                    }
                    else{
                        combine_str_row_col_mat[ii].push(part_nums_str)
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                        part_nums_str = '' 
                    }
                    
                }
                else if(jj==col_nums_mat[ii][0].length-1){
                    part_nums_str +=col_nums_mat[ii][0][jj]
                    combine_str_row_col_mat[ii].push(part_nums_str)
                }
                else{
                   part_nums_str +=col_nums_mat[ii][0][jj]
                }
                // console.log('后',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)                
            }
        }
        console.log('数字组合/计算符号分离', combine_str_row_col_mat)
        // new_single_combine_mat\combine_str_row_col_mat\
        return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat]
    }

    CutLongLineData = (all_line_data)=>{
        // 预处理剔除长横线数据
        console.log('数字填空题')
        // 全部单笔数据处理---单笔识别
        let all_line_str=[]
        // 单笔区域
        let part_line_region_mat = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_str.push(math_char_judge_num[part_line_num])
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
        }
        console.log('单笔识别', all_line_str)
        console.log('单笔数据区域', part_line_region_mat)
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        let cut_line_idx_mat = []
        for(let ii=0;ii<part_line_region_mat.length;ii++){
            if (all_line_str[ii]=='-'&&
            ((part_line_region_mat[ii][1]-part_line_region_mat[ii][0]+1)>(all_line_region[1]-all_line_region[0])*0.6)){
                // cut_line_idx = ii
                cut_line_idx_mat.push(ii)
                // 只考虑多条
                // break
            }
        }
        // 删除长横线
        console.log('长横线索引', cut_line_idx_mat)
        let cut_line_data=[]
        let new_all_line_data = []
        if (cut_line_idx_mat.length>=1){
            // 删除所有数据的该条索引数据
            for(let ii=0;ii<all_line_data.length;ii++){
                if(cut_line_idx_mat.indexOf(ii)<0){
                    new_all_line_data.push(all_line_data[ii])
                }
                else{
                    cut_line_data.push(all_line_data[ii])
                }
            }
        }
        else{
            new_all_line_data = all_line_data
        }
        return [new_all_line_data, cut_line_data, cut_line_idx_mat]
    }

    CutDivLineData = (all_line_data)=>{
        // 预处理剔除长横线数据
        console.log('除法长横线及符号处理')
        // 全部单笔数据处理---单笔识别
        let all_line_str=[]
        // 单笔区域
        let part_line_region_mat = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_str.push(math_char_judge_num[part_line_num])
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
        }
        console.log('单笔识别', all_line_str)
        console.log('单笔数据区域', part_line_region_mat)
        // 获取全局基准宽度/高度:2020-01-25
        let all_line_height = 0, all_line_height_mat = []
        let all_line_width = 0, all_line_width_mat = []
        let need_num_height = 0
        let need_num_width = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            if(all_line_str[ii]!='-'){
                // 不是横线：统计高度
                need_num_height += 1
                let part_line_height = part_line_region_mat[ii][3]-part_line_region_mat[ii][2]+1
                all_line_height_mat.push(part_line_height)
                all_line_height = Math.round((all_line_height*(need_num_height-1)+part_line_height)/need_num_height*100)/100
            }
            // console.log('all_line_str[ii]', all_line_str[ii]!='-', all_line_str[ii]!='1', all_line_str[ii]!='-' && all_line_str[ii]!='1')
            if(all_line_str[ii]!='-' && all_line_str[ii]!='1'){
                // 不是横线和1：统计宽度
                need_num_width += 1
                let part_line_width = part_line_region_mat[ii][1]-part_line_region_mat[ii][0]+1
                all_line_width_mat.push(part_line_width)
                all_line_width = Math.round((all_line_width*(need_num_width-1)+part_line_width)/need_num_width*100)/100
            }
        }
        let limited_base_width = 0
        if(all_line_width.length<1){
            limited_base_width = all_line_height*1.3
        }
        else{
            limited_base_width = all_line_width*2.3
        }
        console.log('高度', all_line_height)
        console.log('宽度', all_line_width)
        console.log('限宽', limited_base_width)
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        let cut_line_idx_mat = []
        let used_idx_mat = [] //已使用索引
        for(let ii=0;ii<part_line_region_mat.length;ii++){
            console.log('宽度', (part_line_region_mat[ii][1]-part_line_region_mat[ii][0]+1))
            if (all_line_str[ii]=='-'&&
            ((part_line_region_mat[ii][1]-part_line_region_mat[ii][0]+1)>limited_base_width)){
                // cut_line_idx = ii
                cut_line_idx_mat.push(ii)
                used_idx_mat.push(ii)
                // 只考虑多条
                // break
            }
        }
        // 删除长横线
        console.log('长横线索引', cut_line_idx_mat)
        if (cut_line_idx_mat.length>=1){
            // 找到 长横线索引中最上面一根，且找出对应除号丿
            let lone_line_region_mat = []
            for (let ii=0;ii<cut_line_idx_mat.length;ii++){
                lone_line_region_mat.push((part_line_region_mat[cut_line_idx_mat[ii]][2]+
                                            part_line_region_mat[cut_line_idx_mat[ii]][3])/2)
            }
            // 长横线排序
            let lone_line_region_mat_sort = this.ArraySortMat(lone_line_region_mat)
            console.log('长横线排序', lone_line_region_mat_sort)
            let div_line_idx = cut_line_idx_mat[lone_line_region_mat_sort[1][0]] // 除号横线索引
            console.log('除号横线索引', div_line_idx)
            // 找到丿
            let div_line_region = part_line_region_mat[div_line_idx]
            let div_x_dis_mat = []
            for (let ii=0;ii<all_line_data.length;ii++){
                // 匹配所有线条的x方向距离
                let part_line_region_data = part_line_region_mat[ii]
                if(ii==div_line_idx){
                    div_x_dis_mat.push(1000)
                }
                else if((part_line_region_data[2]+part_line_region_data[3])<(div_line_region[2]+div_line_region[3])){
                    // 除号线上
                    div_x_dis_mat.push(1000)
                }
                else if((part_line_region_data[2]+part_line_region_data[3]-all_line_height*2)>(div_line_region[2]+div_line_region[3])){
                    // 除号线下多基准高度
                    div_x_dis_mat.push(1000)
                }
                else if(all_line_str[ii]=='1' || all_line_str[ii]==')' ||all_line_str[ii]=='/'){
                    let dis_left = Math.abs(part_line_region_data[0]-div_line_region[0])
                    let dis_center = Math.abs((part_line_region_data[0]+part_line_region_data[1])/2-div_line_region[0])
                    let dis_right = Math.abs(part_line_region_data[1]-div_line_region[0])
                    let part_line_min_dis = Math.min.apply(null,[dis_left, dis_center, dis_right])
                    console.log('最新距离值', ii, dis_left, dis_center, dis_right,'----',part_line_min_dis)
                    div_x_dis_mat.push(part_line_min_dis)
                }
                else{
                    div_x_dis_mat.push(1000)
                }
            }
            let div_x_dis_mat_sort = this.ArraySortMat(div_x_dis_mat)
            console.log('除号距离排序', div_x_dis_mat_sort)
            let div_apos_idx = div_x_dis_mat_sort[1][0]
            let div_apos_region = part_line_region_mat[div_apos_idx]
            used_idx_mat.push(div_apos_idx)
            // 分区存储数据：商/除数/被除数计算过程
            let quotient_idx_mat = []   //商
            let divisor_idx_mat = []    //除数
            let dividend_idx_mat = []   //被除数计算过程
            let quotient_line_mat = []   //商:手写数据
            let divisor_line_mat = []    //除数:手写数据
            let dividend_line_mat = []   //被除数计算过程:手写数据
            for (let ii=0;ii<all_line_data.length;ii++){
                let part_line_region_data = part_line_region_mat[ii]
                if (used_idx_mat.indexOf(ii)<0 && 
                    ((part_line_region_data[2]+part_line_region_data[3])<(div_line_region[2]+div_line_region[3]))){
                    //  商：未使用索引/在上方 
                    quotient_idx_mat.push(ii)
                    quotient_line_mat.push(all_line_data[ii])
                    used_idx_mat.push(ii)
                }
            }

            for (let ii=0;ii<all_line_data.length;ii++){
                let part_line_region_data = part_line_region_mat[ii]
                if (used_idx_mat.indexOf(ii)<0 && 
                    ((part_line_region_data[0]+part_line_region_data[1])<(div_apos_region[0]+div_apos_region[1]))){
                    //  除数：未使用索引/在左方 
                    divisor_idx_mat.push(ii)
                    divisor_line_mat.push(all_line_data[ii])
                    used_idx_mat.push(ii)
                }
            }

            for (let ii=0;ii<all_line_data.length;ii++){
                if (used_idx_mat.indexOf(ii)<0){
                    //  被除数过程：未使用索引
                    dividend_idx_mat.push(ii)
                    dividend_line_mat.push(all_line_data[ii])
                    used_idx_mat.push(ii)
                }
            }
            return [[quotient_line_mat, divisor_line_mat, dividend_line_mat],[],[]]
        }
        else{
            return[[all_line_data],[],[]]
        }
        // let cut_line_data=[]
        // let new_all_line_data = []
        // if (cut_line_idx_mat.length>=1){
        //     // 删除所有数据的该条索引数据
        //     for(let ii=0;ii<all_line_data.length;ii++){
        //         if(cut_line_idx_mat.indexOf(ii)<0){
        //             new_all_line_data.push(all_line_data[ii])
        //         }
        //         else{
        //             cut_line_data.push(all_line_data[ii])
        //         }
        //     }
        // }
        // else{
        //     new_all_line_data = all_line_data
        // }
        // return [new_all_line_data, cut_line_data, cut_line_idx_mat]
    }


    MathVerticalIntAdd=(all_line_data0)=>{
        console.log('竖式计算题:整数加法')
        // 全部单笔数据处理---单笔识别
        let [all_line_data, cut_line_data, cut_line_idx]=this.CutLongLineData(all_line_data0)
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        // 此处剔除长横线2020-12-1
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        console.log('基准高度', base_height1)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else if(all_line_num[part_idx_mat[0]]==11 || all_line_num[part_idx_mat[0]]==12){
                    // 修正斜杠\/
                    let part_slash_data = all_line_data[part_idx_mat[0]]
                    let slash_y = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_x = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_k = Math.abs(slash_y/slash_x)
                    console.log('单笔斜杠竖式计算处理', slash_k)
                    if (slash_k>=1){
                        combine_str_mat.push('1')
                    }
                    else{
                        combine_str_mat.push('-')
                    }
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                        combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_mat_mat = []
        let all_part_region_mat = [] // 存储每个字符的区域
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_mat_mat.push([part_combine_str_3rd])
                all_part_region_mat.push([part_combine_region_3rd])
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    console.log('计算符号', part_combine_str_3rd, ['+','-','X','x'].indexOf(part_combine_str_3rd))
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*1)
                        // &&['+','-','X','x'].indexOf(part_combine_str_3rd)==-1
                        // &&['+','-','X','x'].indexOf(nums_combine_str_mat[jj][0])==-1
                        ){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        // 对于竖式计算加减乘法符号组后再单独分析一次,计算符号的位置
                        nums_combine_mat_mat[jj].push(part_combine_str_3rd)
                        all_part_region_mat[jj].push(part_combine_region_3rd)
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_mat_mat.push([part_combine_str_3rd])
                    all_part_region_mat.push([part_combine_region_3rd])
                }
            }
        }
        console.log('分区数字组合000', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        // 二次行列组合:可以单设一种处理函数,用于处理行列分区,找到行方向的分布组合
        // 组合等号和除号的区域
        let while_flag = 1
        while(while_flag>0){
            if(nums_combine_region_mat.length>=2){
                for (let ii=0;ii<nums_combine_region_mat.length;ii++){
                    let ii_flag = 1
                    console.log('ii',ii)
                    for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                        if(ii!=jj){
                            // 判断两组区域的y方向交叉
                            // console.log('ii',ii,'jj',jj)
                            let y_region_ratio_mat = this.TwoRegionRatio([nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]],
                                                                        [nums_combine_region_mat[jj][2],nums_combine_region_mat[jj][3]])
                            if(y_region_ratio_mat[0]>0.3){
                                console.log('存在相交区域ii/jj',ii,jj)
                                // 组合两组区域：所有数据：字符串、全局区域、单区域
                                let part_single_region_ii = all_part_region_mat[ii]
                                let part_single_region_jj = all_part_region_mat[jj]
                                let part_single_str_ii = nums_combine_mat_mat[ii]
                                let part_single_str_jj = nums_combine_mat_mat[jj]
                                let part_ii_jj_all_region = this.AllLineRegion([nums_combine_region_mat[ii], nums_combine_region_mat[jj]])  //重新组合的全局区域
                                let recombine_mat = this.TwoRegionMatCombine(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)
                                if (ii<jj){
                                    // 删减位置不同:其实不用，先替换后删除
                                    nums_combine_region_mat.splice(jj,1,)
                                    nums_combine_region_mat.splice(ii,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(jj,1)
                                    nums_combine_mat_mat.splice(ii,1,recombine_mat[1])
                                    all_part_region_mat.splice(jj,1)
                                    all_part_region_mat.splice(ii,1,recombine_mat[0])               
                                }
                                else if(ii>jj){
                                    nums_combine_region_mat.splice(ii,1,)
                                    nums_combine_region_mat.splice(jj,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(ii,1)
                                    nums_combine_mat_mat.splice(jj,1,recombine_mat[1])
                                    all_part_region_mat.splice(ii,1)
                                    all_part_region_mat.splice(jj,1,recombine_mat[0])
                                }
                                ii_flag = 0
                                break
                            }
                            // else if(jj == nums_combine_region_mat.length-1){
                            //     ii_flag = 0
                            // }
                        }     
                    }
                    if(ii_flag==0){
                        break
                    }
                    // 遍历完重组所有的区域
                    if(ii == nums_combine_region_mat.length-1){
                        while_flag = 0
                        break
                    }
                }
                if (while_flag==0){
                    break
                }
            }
            else{
                break
            }
        }
        
        console.log('分区数字组合001', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            if(nums_combine_mat_mat[ii].length>1){
                let equal_flag =1
                console.log('组合处理00',JSON.stringify(nums_combine_mat_mat))
                while(equal_flag>0){
                    console.log('组合处理1',nums_combine_mat_mat[ii])
                    equal_flag = 0
                    for(let jj=0; jj<nums_combine_mat_mat[ii].length-1;jj++){
                        // 连续判断出现等号的情况
                        let part_str1 = nums_combine_mat_mat[ii][jj]
                        let part_str2 = nums_combine_mat_mat[ii][jj+1]
                        if ((part_str1=='-'&&part_str2=='-')||(part_str1=='-'&&part_str2=='.')||(part_str1=='.'&&part_str2=='-')){
                            // 连续出现两横,判断组合区域的大小比
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj][1]-all_part_region_mat[ii][jj][0])*1.5||
                                (part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj+1][1]-all_part_region_mat[ii][jj+1][0])*1.5){
                                // 组合区域小于一个比例
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if(part_str1=='.'&&part_str2=='.'){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[3]-part_str_all_region[2]+1)/(part_str_all_region[1]-part_str_all_region[0]+1)>1){
                                nums_combine_mat_mat[ii].splice(jj,2,':')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                            else{
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if((part_str1==':'&&part_str2=='-')||(part_str1=='-'&&part_str2==':')||
                                (part_str1=='='&&part_str2=='.')||(part_str1=='.'&&part_str2=='=')){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            nums_combine_mat_mat[ii].splice(jj,2,'÷')
                            all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                            equal_flag = 1
                            break
                        }
                    }
                }   
            }
        }
        console.log('分区数字组合等号', nums_combine_mat_mat, nums_combine_region_mat,all_part_region_mat)
        let nums_combine_str_mat = []
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            let part_str_str = ''
            for(let jj=0;jj<nums_combine_mat_mat[ii].length;jj++){
                part_str_str +=nums_combine_mat_mat[ii][jj]
            }
            nums_combine_str_mat.push(part_str_str)
        }
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        let new_single_combine_mat = []
        let new_single_str_mat = []
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            new_single_combine_mat.push(all_part_region_mat[row_idx_sort_mat[1][ii]])
            new_single_str_mat.push(nums_combine_mat_mat[row_idx_sort_mat[1][ii]])
            // 单行多组处理
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat,new_single_combine_mat, new_single_str_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+' '
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        // 分解:考虑单行单组，和多组数字组合，现只分离计算符号
        let combine_str_row_col_mat = []
        for(let ii=0;ii<col_nums_mat.length;ii++){
            combine_str_row_col_mat.push([])
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii][0].length;jj++){
                // console.log('前',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)
                if(['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(col_nums_mat[ii][0][jj])!=-1){
                    // console.log('符号出现', part_nums_str, col_nums_mat[ii][0][jj])
                    if (part_nums_str.length<1){
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                    }
                    else{
                        combine_str_row_col_mat[ii].push(part_nums_str)
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                        part_nums_str = '' 
                    }
                    
                }
                else if(jj==col_nums_mat[ii][0].length-1){
                    part_nums_str +=col_nums_mat[ii][0][jj]
                    combine_str_row_col_mat[ii].push(part_nums_str)
                }
                else{
                   part_nums_str +=col_nums_mat[ii][0][jj]
                }
                // console.log('后',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)                
            }
        }
        console.log('数字组合/计算符号分离', combine_str_row_col_mat)
        // new_single_combine_mat\combine_str_row_col_mat\
        // 提取组合后的加法字符高度:2020-12-1
        console.log('单字符组合区域',new_single_combine_mat)
        console.log('单字符组合字符',new_single_str_mat)
        console.log('全局组合区域',all_line_region)
        let statics_height_mat = []
        // let long_line_idx
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                console.log('单字符组合区域',new_single_combine_mat[ii][jj])
                console.log('单字符组合字符',new_single_str_mat[ii][jj])
                if (new_single_str_mat[ii][jj]!="-"){
                    // 非减号统计高度
                    console.log('非减号', new_single_str_mat[ii][jj])
                    statics_height_mat.push(new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)
                }
                // 找到长横线区域
                // if (new_single_str_mat[ii][jj]=="-"&&
                //     ((new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)>(all_line_region[1]-all_line_region[0])*0.8)){
                //     // 
                //     long_line_idx = [ii, jj]
                // }
            }
        }
        console.log('高度统计', statics_height_mat)
        let sort_statics_height_mat = this.ArraySortMat(statics_height_mat)
        console.log('高度排序', sort_statics_height_mat)
        // console.log('长横线', long_line_idx)
        // 设定基准高度:中位数/均值/
        let median_idx = parseInt(statics_height_mat.length/2)
        let median_height = sort_statics_height_mat[0][median_idx]
        console.log('中位Idx/Height', median_idx, median_height)
        // 提取进位索引
        let carry_bit_mat = []
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                if((new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)<median_height*0.6){
                    // 小于1标准高度一般
                    carry_bit_mat.push([ii,jj])
                }
            }
        }
        console.log('进位索引', carry_bit_mat)
        let new_str_num_mat = []
        let new_str_carry_mat = []
        for (let ii=0;ii<new_single_str_mat.length;ii++){
            let part_new_str_num_mat = []
            for(let jj=0;jj<new_single_str_mat[ii].length;jj++){
                if(this.FindArrayIdx([ii,jj],carry_bit_mat)>=0){
                    // 进位 
                    new_str_carry_mat.push(new_single_str_mat[ii][jj])
                }
                else{
                    part_new_str_num_mat.push(new_single_str_mat[ii][jj])
                }
            }
            if(part_new_str_num_mat.length>0){
                new_str_num_mat.push(part_new_str_num_mat)
            }
        }
        console.log('筛选进位组合', [new_str_num_mat, new_str_carry_mat])
        // return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat]
        return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat,[new_str_num_mat, new_str_carry_mat]]
    }

    MathVerticalIntSub=(all_line_data0)=>{
        console.log('竖式计算题:整数减法')
        // 全部单笔数据处理---单笔识别
        let [all_line_data, cut_line_data, cut_line_idx]=this.CutLongLineData(all_line_data0)
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        // 此处剔除长横线2020-12-1
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        console.log('基准高度', base_height1)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else if(all_line_num[part_idx_mat[0]]==11 || all_line_num[part_idx_mat[0]]==12){
                    // 修正斜杠\/
                    let part_slash_data = all_line_data[part_idx_mat[0]]
                    let slash_y = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_x = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_k = Math.abs(slash_y/slash_x)
                    console.log('单笔斜杠竖式计算处理', slash_k)
                    if (slash_k>=1){
                        combine_str_mat.push('1')
                    }
                    else{
                        combine_str_mat.push('-')
                    }
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                        combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_mat_mat = []
        let all_part_region_mat = [] // 存储每个字符的区域
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_mat_mat.push([part_combine_str_3rd])
                all_part_region_mat.push([part_combine_region_3rd])
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    console.log('计算符号', part_combine_str_3rd, ['+','-','X','x'].indexOf(part_combine_str_3rd))
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*1)
                        // &&['+','-','X','x'].indexOf(part_combine_str_3rd)==-1
                        // &&['+','-','X','x'].indexOf(nums_combine_str_mat[jj][0])==-1
                        ){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        // 对于竖式计算加减乘法符号组后再单独分析一次,计算符号的位置
                        nums_combine_mat_mat[jj].push(part_combine_str_3rd)
                        all_part_region_mat[jj].push(part_combine_region_3rd)
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_mat_mat.push([part_combine_str_3rd])
                    all_part_region_mat.push([part_combine_region_3rd])
                }
            }
        }
        console.log('分区数字组合000', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        // 二次行列组合:可以单设一种处理函数,用于处理行列分区,找到行方向的分布组合
        // 组合等号和除号的区域
        let while_flag = 1
        while(while_flag>0){
            if(nums_combine_region_mat.length>=2){
                for (let ii=0;ii<nums_combine_region_mat.length;ii++){
                    let ii_flag = 1
                    console.log('ii',ii)
                    for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                        if(ii!=jj){
                            // 判断两组区域的y方向交叉
                            // console.log('ii',ii,'jj',jj)
                            let y_region_ratio_mat = this.TwoRegionRatio([nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]],
                                                                        [nums_combine_region_mat[jj][2],nums_combine_region_mat[jj][3]])
                            if(y_region_ratio_mat[0]>0.3){
                                console.log('存在相交区域ii/jj',ii,jj)
                                // 组合两组区域：所有数据：字符串、全局区域、单区域
                                let part_single_region_ii = all_part_region_mat[ii]
                                let part_single_region_jj = all_part_region_mat[jj]
                                let part_single_str_ii = nums_combine_mat_mat[ii]
                                let part_single_str_jj = nums_combine_mat_mat[jj]
                                let part_ii_jj_all_region = this.AllLineRegion([nums_combine_region_mat[ii], nums_combine_region_mat[jj]])  //重新组合的全局区域
                                let recombine_mat = this.TwoRegionMatCombine(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)
                                if (ii<jj){
                                    // 删减位置不同:其实不用，先替换后删除
                                    nums_combine_region_mat.splice(jj,1,)
                                    nums_combine_region_mat.splice(ii,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(jj,1)
                                    nums_combine_mat_mat.splice(ii,1,recombine_mat[1])
                                    all_part_region_mat.splice(jj,1)
                                    all_part_region_mat.splice(ii,1,recombine_mat[0])               
                                }
                                else if(ii>jj){
                                    nums_combine_region_mat.splice(ii,1,)
                                    nums_combine_region_mat.splice(jj,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(ii,1)
                                    nums_combine_mat_mat.splice(jj,1,recombine_mat[1])
                                    all_part_region_mat.splice(ii,1)
                                    all_part_region_mat.splice(jj,1,recombine_mat[0])
                                }
                                ii_flag = 0
                                break
                            }
                            // else if(jj == nums_combine_region_mat.length-1){
                            //     ii_flag = 0
                            // }
                        }     
                    }
                    if(ii_flag==0){
                        break
                    }
                    // 遍历完重组所有的区域
                    if(ii == nums_combine_region_mat.length-1){
                        while_flag = 0
                        break
                    }
                }
                if (while_flag==0){
                    break
                }
            }
            else{
                break
            }
        }
        
        console.log('分区数字组合001', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            if(nums_combine_mat_mat[ii].length>1){
                let equal_flag =1
                console.log('组合处理00',JSON.stringify(nums_combine_mat_mat))
                while(equal_flag>0){
                    console.log('组合处理1',nums_combine_mat_mat[ii])
                    equal_flag = 0
                    for(let jj=0; jj<nums_combine_mat_mat[ii].length-1;jj++){
                        // 连续判断出现等号的情况
                        let part_str1 = nums_combine_mat_mat[ii][jj]
                        let part_str2 = nums_combine_mat_mat[ii][jj+1]
                        if ((part_str1=='-'&&part_str2=='-')||(part_str1=='-'&&part_str2=='.')||(part_str1=='.'&&part_str2=='-')){
                            // 连续出现两横,判断组合区域的大小比
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj][1]-all_part_region_mat[ii][jj][0])*1.5||
                                (part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj+1][1]-all_part_region_mat[ii][jj+1][0])*1.5){
                                // 组合区域小于一个比例
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if(part_str1=='.'&&part_str2=='.'){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[3]-part_str_all_region[2]+1)/(part_str_all_region[1]-part_str_all_region[0]+1)>1){
                                nums_combine_mat_mat[ii].splice(jj,2,':')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                            else{
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if((part_str1==':'&&part_str2=='-')||(part_str1=='-'&&part_str2==':')||
                                (part_str1=='='&&part_str2=='.')||(part_str1=='.'&&part_str2=='=')){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            nums_combine_mat_mat[ii].splice(jj,2,'÷')
                            all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                            equal_flag = 1
                            break
                        }
                    }
                }   
            }
        }
        console.log('分区数字组合等号', nums_combine_mat_mat, nums_combine_region_mat,all_part_region_mat)
        let nums_combine_str_mat = []
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            let part_str_str = ''
            for(let jj=0;jj<nums_combine_mat_mat[ii].length;jj++){
                part_str_str +=nums_combine_mat_mat[ii][jj]
            }
            nums_combine_str_mat.push(part_str_str)
        }
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        let new_single_combine_mat = []
        let new_single_str_mat = []
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            new_single_combine_mat.push(all_part_region_mat[row_idx_sort_mat[1][ii]])
            new_single_str_mat.push(nums_combine_mat_mat[row_idx_sort_mat[1][ii]])
            // 单行多组处理
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat,new_single_combine_mat, new_single_str_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+' '
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        // 分解:考虑单行单组，和多组数字组合，现只分离计算符号
        let combine_str_row_col_mat = []
        for(let ii=0;ii<col_nums_mat.length;ii++){
            combine_str_row_col_mat.push([])
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii][0].length;jj++){
                // console.log('前',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)
                if(['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(col_nums_mat[ii][0][jj])!=-1){
                    // console.log('符号出现', part_nums_str, col_nums_mat[ii][0][jj])
                    if (part_nums_str.length<1){
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                    }
                    else{
                        combine_str_row_col_mat[ii].push(part_nums_str)
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                        part_nums_str = '' 
                    }
                    
                }
                else if(jj==col_nums_mat[ii][0].length-1){
                    part_nums_str +=col_nums_mat[ii][0][jj]
                    combine_str_row_col_mat[ii].push(part_nums_str)
                }
                else{
                   part_nums_str +=col_nums_mat[ii][0][jj]
                }
                // console.log('后',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)                
            }
        }
        // console.log('数字组合/计算符号分离', combine_str_row_col_mat)
        // // new_single_combine_mat\combine_str_row_col_mat\
        // // 提取组合后的加法字符高度:2020-12-1
        // console.log('单字符组合区域',new_single_combine_mat)
        // console.log('单字符组合字符',new_single_str_mat)
        // console.log('全局组合区域',all_line_region)
        let statics_height_mat = []
        // let long_line_idx
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                // console.log('单字符组合区域',new_single_combine_mat[ii][jj])
                // console.log('单字符组合字符',new_single_str_mat[ii][jj])
                if (new_single_str_mat[ii][jj]!="-"){
                    // 非减号统计高度
                    // console.log('非减号', new_single_str_mat[ii][jj])
                    statics_height_mat.push(new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)
                }
                // 找到长横线区域
                // if (new_single_str_mat[ii][jj]=="-"&&
                //     ((new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)>(all_line_region[1]-all_line_region[0])*0.8)){
                //     // 
                //     long_line_idx = [ii, jj]
                // }
            }
        }
        // console.log('高度统计', statics_height_mat)
        let sort_statics_height_mat = this.ArraySortMat(statics_height_mat)
        // console.log('高度排序', sort_statics_height_mat)
        // console.log('长横线', long_line_idx)
        // 设定基准高度:中位数/均值/
        let median_idx = parseInt(statics_height_mat.length/2)
        let median_height = sort_statics_height_mat[0][median_idx]
        // console.log('中位Idx/Height', median_idx, median_height)
        // 提取退位索引
        let borrow_bit_mat = []
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                if((new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)<median_height*0.4&&
                    (new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)<median_height*0.4){
                    // 小于1标准高度一般
                    borrow_bit_mat.push([ii,jj])
                    new_single_str_mat[ii][jj]='.'
                }
            }
        }
        // console.log('退位索引', borrow_bit_mat)
        let new_str_num_mat = []
        let new_str_borrow_mat = []
        let new_region_num_mat = []
        let new_region_borrow_mat = []
        for (let ii=0;ii<new_single_str_mat.length;ii++){
            let part_new_str_num_mat = []
            let part_new_region_num_mat = []
            for(let jj=0;jj<new_single_str_mat[ii].length;jj++){
                if(this.FindArrayIdx([ii,jj],borrow_bit_mat)>=0){
                    // 借位 
                    new_str_borrow_mat.push(new_single_str_mat[ii][jj])
                    new_region_borrow_mat.push(new_single_combine_mat[ii][jj])
                }
                else{
                    part_new_str_num_mat.push(new_single_str_mat[ii][jj])
                    part_new_region_num_mat.push(new_single_combine_mat[ii][jj])
                }
            }
            if(part_new_str_num_mat.length>0){
                new_str_num_mat.push(part_new_str_num_mat)
                new_region_num_mat.push(part_new_region_num_mat)
            }
        }
        console.log('筛选进位组合', [new_str_num_mat, new_str_borrow_mat])
        // return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat]
        return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat,[new_str_num_mat, new_str_borrow_mat],[new_region_num_mat, new_region_borrow_mat]]
    }

    MathVerticalIntMulti=(all_line_data0)=>{
        console.log('竖式计算题:整数乘法')
        // 全部单笔数据处理---单笔识别
        let [all_line_data, cut_line_data, cut_line_idx]=this.CutLongLineData(all_line_data0)
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        // 此处剔除长横线2020-12-1
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        console.log('基准高度', base_height1)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else if(all_line_num[part_idx_mat[0]]==11 || all_line_num[part_idx_mat[0]]==12){
                    // 修正斜杠\/
                    let part_slash_data = all_line_data[part_idx_mat[0]]
                    let slash_y = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_x = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_k = Math.abs(slash_y/slash_x)
                    console.log('单笔斜杠竖式计算处理', slash_k)
                    if (slash_k>=1){
                        combine_str_mat.push('1')
                    }
                    else{
                        combine_str_mat.push('-')
                    }
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                        combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_mat_mat = []
        let all_part_region_mat = [] // 存储每个字符的区域
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_mat_mat.push([part_combine_str_3rd])
                all_part_region_mat.push([part_combine_region_3rd])
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    console.log('计算符号', part_combine_str_3rd, ['+','-','X','x'].indexOf(part_combine_str_3rd))
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*1)
                        // &&['+','-','X','x'].indexOf(part_combine_str_3rd)==-1
                        // &&['+','-','X','x'].indexOf(nums_combine_str_mat[jj][0])==-1
                        ){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        // 对于竖式计算加减乘法符号组后再单独分析一次,计算符号的位置
                        nums_combine_mat_mat[jj].push(part_combine_str_3rd)
                        all_part_region_mat[jj].push(part_combine_region_3rd)
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_mat_mat.push([part_combine_str_3rd])
                    all_part_region_mat.push([part_combine_region_3rd])
                }
            }
        }
        console.log('分区数字组合000', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        // 二次行列组合:可以单设一种处理函数,用于处理行列分区,找到行方向的分布组合
        // 组合等号和除号的区域
        let while_flag = 1
        while(while_flag>0){
            if(nums_combine_region_mat.length>=2){
                for (let ii=0;ii<nums_combine_region_mat.length;ii++){
                    let ii_flag = 1
                    console.log('ii',ii)
                    for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                        if(ii!=jj){
                            // 判断两组区域的y方向交叉
                            // console.log('ii',ii,'jj',jj)
                            let y_region_ratio_mat = this.TwoRegionRatio([nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]],
                                                                        [nums_combine_region_mat[jj][2],nums_combine_region_mat[jj][3]])
                            if(y_region_ratio_mat[0]>0.3){
                                console.log('存在相交区域ii/jj',ii,jj)
                                // 组合两组区域：所有数据：字符串、全局区域、单区域
                                let part_single_region_ii = all_part_region_mat[ii]
                                let part_single_region_jj = all_part_region_mat[jj]
                                let part_single_str_ii = nums_combine_mat_mat[ii]
                                let part_single_str_jj = nums_combine_mat_mat[jj]
                                let part_ii_jj_all_region = this.AllLineRegion([nums_combine_region_mat[ii], nums_combine_region_mat[jj]])  //重新组合的全局区域
                                let recombine_mat = this.TwoRegionMatCombine(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)
                                if (ii<jj){
                                    // 删减位置不同:其实不用，先替换后删除
                                    nums_combine_region_mat.splice(jj,1,)
                                    nums_combine_region_mat.splice(ii,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(jj,1)
                                    nums_combine_mat_mat.splice(ii,1,recombine_mat[1])
                                    all_part_region_mat.splice(jj,1)
                                    all_part_region_mat.splice(ii,1,recombine_mat[0])               
                                }
                                else if(ii>jj){
                                    nums_combine_region_mat.splice(ii,1,)
                                    nums_combine_region_mat.splice(jj,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(ii,1)
                                    nums_combine_mat_mat.splice(jj,1,recombine_mat[1])
                                    all_part_region_mat.splice(ii,1)
                                    all_part_region_mat.splice(jj,1,recombine_mat[0])
                                }
                                ii_flag = 0
                                break
                            }
                            // else if(jj == nums_combine_region_mat.length-1){
                            //     ii_flag = 0
                            // }
                        }     
                    }
                    if(ii_flag==0){
                        break
                    }
                    // 遍历完重组所有的区域
                    if(ii == nums_combine_region_mat.length-1){
                        while_flag = 0
                        break
                    }
                }
                if (while_flag==0){
                    break
                }
            }
            else{
                break
            }
        }
        
        console.log('分区数字组合001', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            if(nums_combine_mat_mat[ii].length>1){
                let equal_flag =1
                console.log('组合处理00',JSON.stringify(nums_combine_mat_mat))
                while(equal_flag>0){
                    console.log('组合处理1',nums_combine_mat_mat[ii])
                    equal_flag = 0
                    for(let jj=0; jj<nums_combine_mat_mat[ii].length-1;jj++){
                        // 连续判断出现等号的情况
                        let part_str1 = nums_combine_mat_mat[ii][jj]
                        let part_str2 = nums_combine_mat_mat[ii][jj+1]
                        if ((part_str1=='-'&&part_str2=='-')||(part_str1=='-'&&part_str2=='.')||(part_str1=='.'&&part_str2=='-')){
                            // 连续出现两横,判断组合区域的大小比
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj][1]-all_part_region_mat[ii][jj][0])*1.5||
                                (part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj+1][1]-all_part_region_mat[ii][jj+1][0])*1.5){
                                // 组合区域小于一个比例
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if(part_str1=='.'&&part_str2=='.'){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[3]-part_str_all_region[2]+1)/(part_str_all_region[1]-part_str_all_region[0]+1)>1){
                                nums_combine_mat_mat[ii].splice(jj,2,':')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                            else{
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if((part_str1==':'&&part_str2=='-')||(part_str1=='-'&&part_str2==':')||
                                (part_str1=='='&&part_str2=='.')||(part_str1=='.'&&part_str2=='=')){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            nums_combine_mat_mat[ii].splice(jj,2,'÷')
                            all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                            equal_flag = 1
                            break
                        }
                    }
                }   
            }
        }
        console.log('分区数字组合等号', nums_combine_mat_mat, nums_combine_region_mat,all_part_region_mat)
        let nums_combine_str_mat = []
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            let part_str_str = ''
            for(let jj=0;jj<nums_combine_mat_mat[ii].length;jj++){
                part_str_str +=nums_combine_mat_mat[ii][jj]
            }
            nums_combine_str_mat.push(part_str_str)
        }
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        let new_single_combine_mat = []
        let new_single_str_mat = []
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            new_single_combine_mat.push(all_part_region_mat[row_idx_sort_mat[1][ii]])
            new_single_str_mat.push(nums_combine_mat_mat[row_idx_sort_mat[1][ii]])
            // 单行多组处理
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat,new_single_combine_mat, new_single_str_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+' '
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        // 分解:考虑单行单组，和多组数字组合，现只分离计算符号
        let combine_str_row_col_mat = []
        for(let ii=0;ii<col_nums_mat.length;ii++){
            combine_str_row_col_mat.push([])
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii][0].length;jj++){
                // console.log('前',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)
                if(['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(col_nums_mat[ii][0][jj])!=-1){
                    // console.log('符号出现', part_nums_str, col_nums_mat[ii][0][jj])
                    if (part_nums_str.length<1){
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                    }
                    else{
                        combine_str_row_col_mat[ii].push(part_nums_str)
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                        part_nums_str = '' 
                    }
                    
                }
                else if(jj==col_nums_mat[ii][0].length-1){
                    part_nums_str +=col_nums_mat[ii][0][jj]
                    combine_str_row_col_mat[ii].push(part_nums_str)
                }
                else{
                   part_nums_str +=col_nums_mat[ii][0][jj]
                }
                // console.log('后',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)                
            }
        }
        // console.log('数字组合/计算符号分离', combine_str_row_col_mat)
        // // new_single_combine_mat\combine_str_row_col_mat\
        // // 提取组合后的加法字符高度:2020-12-1
        // console.log('单字符组合区域',new_single_combine_mat)
        // console.log('单字符组合字符',new_single_str_mat)
        // console.log('全局组合区域',all_line_region)
        let statics_height_mat = []
        // let long_line_idx
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                // console.log('单字符组合区域',new_single_combine_mat[ii][jj])
                // console.log('单字符组合字符',new_single_str_mat[ii][jj])
                if (new_single_str_mat[ii][jj]!="-"){
                    // 非减号统计高度
                    // console.log('非减号', new_single_str_mat[ii][jj])
                    statics_height_mat.push(new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)
                }
                // 找到长横线区域
                // if (new_single_str_mat[ii][jj]=="-"&&
                //     ((new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)>(all_line_region[1]-all_line_region[0])*0.8)){
                //     // 
                //     long_line_idx = [ii, jj]
                // }
            }
        }
        // console.log('高度统计', statics_height_mat)
        let sort_statics_height_mat = this.ArraySortMat(statics_height_mat)
        // console.log('高度排序', sort_statics_height_mat)
        // console.log('长横线', long_line_idx)
        // 设定基准高度:中位数/均值/
        let median_idx = parseInt(statics_height_mat.length/2)
        let median_height = sort_statics_height_mat[0][median_idx]
        // console.log('中位Idx/Height', median_idx, median_height)
        // 提取退位索引
        let borrow_bit_mat = []
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                if((new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)<median_height*0.4&&
                    (new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)<median_height*0.4){
                    // 小于1标准高度一般
                    borrow_bit_mat.push([ii,jj])
                    new_single_str_mat[ii][jj]='.'
                }
            }
        }
        // console.log('退位索引', borrow_bit_mat)
        let new_str_num_mat = []
        let new_str_borrow_mat = []
        let new_region_num_mat = []
        let new_region_borrow_mat = []
        for (let ii=0;ii<new_single_str_mat.length;ii++){
            let part_new_str_num_mat = []
            let part_new_region_num_mat = []
            for(let jj=0;jj<new_single_str_mat[ii].length;jj++){
                if(this.FindArrayIdx([ii,jj],borrow_bit_mat)>=0){
                    // 借位 
                    new_str_borrow_mat.push(new_single_str_mat[ii][jj])
                    new_region_borrow_mat.push(new_single_combine_mat[ii][jj])
                }
                else{
                    part_new_str_num_mat.push(new_single_str_mat[ii][jj])
                    part_new_region_num_mat.push(new_single_combine_mat[ii][jj])
                }
            }
            if(part_new_str_num_mat.length>0){
                new_str_num_mat.push(part_new_str_num_mat)
                new_region_num_mat.push(part_new_region_num_mat)
            }
        }
        console.log('筛选进位组合', [new_str_num_mat, new_str_borrow_mat])
        // return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat]
        return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat,[new_str_num_mat, new_str_borrow_mat],[new_region_num_mat, new_region_borrow_mat]]
    }

    MathVerticalIntDiv=(all_line_data0)=>{
        console.log('竖式计算题:整数除法')
        // 全部单笔数据处理---单笔识别
        let [all_line_data_mat, cut_line_data, cut_line_idx]=this.CutDivLineData(all_line_data0)
        if (all_line_data_mat.length>1){
            let quotient_num_mat = this.MathStandardNumProcess(all_line_data_mat[0])   //商
            let divisor_num_mat = this.MathStandardNumProcess(all_line_data_mat[1])    //除数
            let dividend_num_mat = this.MathStandardNumProcess(all_line_data_mat[2])   //被除数计算过程
            console.log('商', JSON.stringify(quotient_num_mat))
            console.log('除数', JSON.stringify(divisor_num_mat))
            console.log('被除数计算过程', JSON.stringify(dividend_num_mat))
            let show_answer_mat = []
            let part_quotient_num_mat = quotient_num_mat[0]
            part_quotient_num_mat[0] = '商：'
            part_quotient_num_mat.splice(1,1)
            show_answer_mat.push(part_quotient_num_mat)
            show_answer_mat.push('\n')
            let part_divisor_num_mat = divisor_num_mat[0]
            part_divisor_num_mat[0] = '除数：'
            part_divisor_num_mat.splice(1,1)
            show_answer_mat.push(part_divisor_num_mat)
            show_answer_mat.push('\n')
            let part_dividend_num_mat = dividend_num_mat[0]
            part_dividend_num_mat[0] = '被除数计算过程：'
            part_dividend_num_mat.splice(1,1)
            show_answer_mat.push(part_dividend_num_mat)
            let answer_str_mat = []
            answer_str_mat.push(quotient_num_mat[2])
            answer_str_mat.push(divisor_num_mat[2])
            answer_str_mat.push(dividend_num_mat[2])
            console.log('识别结果', JSON.stringify(answer_str_mat))
            return [quotient_num_mat,divisor_num_mat,dividend_num_mat,show_answer_mat, answer_str_mat]
        }
        else{
            let all_num_mat = this.MathStandardNumProcess(all_line_data_mat[0])
            return [all_num_mat]
        }        
    }
    MathStandardNumProcess=(all_line_data)=>{
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_num = this.MathSingleStrokeProcess(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
        }
        console.log('单笔识别', all_line_num, all_line_str)
        // 单笔区域
        let part_line_region_mat = []
        let part_line_center_x_mat = []
        let part_line_center_y_mat = []
        let part_height_mat = []
        let part_width_mat = []
        let base_height1 = 0
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region)
            part_line_center_x_mat.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y_mat.push((part_line_region[2]+part_line_region[3])/2)
            part_width_mat.push(part_line_region[1]-part_line_region[0]+1)
            let part_line_height = part_line_region[3]-part_line_region[2]+1
            part_height_mat.push(part_line_height)
            if(part_line_height>=base_height1*2){
                base_height1 = part_line_height
            }
        }
        console.log('单笔数据区域', part_line_region_mat)
        // 此处剔除长横线2020-12-1
        let all_line_region = this.AllLineRegion(part_line_region_mat)
        console.log('基准高度', base_height1)
        let sort_center_x_mat = this.ArraySortMat(part_line_center_x_mat)
        // console.log('排序：x方向', sort_center_x_mat)
        let sort_str_mat = []
        for(let ii=0;ii<all_line_str.length;ii++){
            sort_str_mat.push(all_line_str[sort_center_x_mat[1][ii]])
        }
        // 组合字符串：考虑删除/无效字符的情况
        let combine_idx_mat = []
        let combine_region_mat = []
        for (let ii=0;ii<all_line_str.length;ii++){
            if(ii==0){
                // 第一组数据直接保存
                let part_combine_idx = []
                part_combine_idx.push(ii)
                combine_idx_mat.push(part_combine_idx)
                combine_region_mat.push(part_line_region_mat[ii])
            }
            else{
                // 遍历所有数据、无中断
                let find_combine_flag =0
                let part_line_region_data = [all_line_data[ii], part_line_region_mat[ii],all_line_num[ii]]
                for(let jj=0;jj<combine_idx_mat.length;jj++){
                    // 此处组合线条数据
                    let part_region_data = []
                    let part_region_mat = []
                    for(let kk=0;kk<combine_idx_mat[jj].length;kk++){
                        part_region_mat.push(part_line_region_mat[combine_idx_mat[jj][kk]])
                        part_region_data.push([all_line_data[combine_idx_mat[jj][kk]], part_line_region_mat[combine_idx_mat[jj][kk]],all_line_num[combine_idx_mat[jj][kk]]])
                    }
                    let part_all_region_mat = this.AllLineRegion(part_region_mat)
                    let part_all_data = [part_region_data, part_region_mat]
                    // console.log('单组组合区域', part_all_data,part_region_mat)
                    let part_cross_flag = this.JudgeLineAndRegionRelation(part_line_region_data, part_all_data)
                    if(part_cross_flag==1){
                        // 相交区域，添加到对应区域
                        combine_idx_mat[jj].push(ii)
                        find_combine_flag =1
                        part_region_mat.push(part_line_region_mat[ii])
                        combine_region_mat[jj]=this.AllLineRegion(part_region_mat)
                    }
                }
                if(find_combine_flag==0){
                    combine_idx_mat.push([ii])
                    combine_region_mat.push(part_line_region_mat[ii])
                }
            }
        }
        console.log('数字组合', combine_idx_mat,combine_region_mat)
        let combine_center_x_mat = []
        let combine_center_y_mat = []
        for(let ii=0;ii<combine_region_mat.length;ii++){
            combine_center_x_mat.push((combine_region_mat[ii][0]+combine_region_mat[ii][1])/2)
            combine_center_y_mat.push((combine_region_mat[ii][2]+combine_region_mat[ii][3])/2)
        }
        let combine_sort_idx_mat = this.ArraySortMat(combine_center_x_mat)
        console.log('combine_sort_idx_mat', combine_sort_idx_mat, combine_center_x_mat)
        let combine_str_mat = []
        // 目前处理整数
        // 后期处理小数，先化分小数
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_idx_mat = combine_idx_mat[combine_sort_idx_mat[1][ii]]
            console.log('part_idx_mat',part_idx_mat)
            if (part_idx_mat.length==1){
                if(all_line_num[part_idx_mat[0]]==5){
                    combine_str_mat.push('5')
                }
                else if(all_line_num[part_idx_mat[0]]==4){
                    combine_str_mat.push('2')
                }
                else if(all_line_num[part_idx_mat[0]]==11 || all_line_num[part_idx_mat[0]]==12){
                    // 修正斜杠\/
                    let part_slash_data = all_line_data[part_idx_mat[0]]
                    let slash_y = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_x = part_slash_data[1][0]-part_slash_data[1][part_slash_data[1].length-1]
                    let slash_k = Math.abs(slash_y/slash_x)
                    console.log('单笔斜杠竖式计算处理', slash_k)
                    if (slash_k>=1){
                        combine_str_mat.push('1')
                    }
                    else{
                        combine_str_mat.push('-')
                    }
                }
                else{
                    combine_str_mat.push(all_line_str[part_idx_mat[0]])
                }
            }
            else if(part_idx_mat.length==2){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]]]
                if (this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_4)){//新增2和1组合4, 2020-11-30
                        combine_str_mat.push('4')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_5)){
                    combine_str_mat.push('5')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_add)){
                    combine_str_mat.push('+')
                }
                else if(this.MultiJudgeTwoMatEqual(part_combine_num,fuzzy_num_multi)){
                    combine_str_mat.push('x')
                }
                else{
                    console.log('无效/小数分析', part_combine_num, part_combine_str, part_combine_center)
                    console.log('part_combine_num', part_combine_num)
                    let combine_str001 = this.TwoLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                    combine_str_mat.push(combine_str001)
                }
            }
            else if(part_idx_mat.length==3){
                let part_combine_num = [all_line_num[part_idx_mat[0]], all_line_num[part_idx_mat[1]], all_line_num[part_idx_mat[2]]]
                let part_combine_str = [all_line_str[part_idx_mat[0]], all_line_str[part_idx_mat[1]], all_line_str[part_idx_mat[2]]]
                let part_combine_center = [part_line_center_x_mat[part_idx_mat[0]], part_line_center_x_mat[part_idx_mat[1]], part_line_center_x_mat[part_idx_mat[2]]]
                let combine_str001 = this.ThreeLineNumStr(part_combine_num, part_combine_str, part_combine_center)
                combine_str_mat.push(combine_str001)
            }
            else{
                console.log('数据无效')
                combine_str_mat.push('')
            }
        }
        // 分区
        let nums_combine_region_mat=[]
        let nums_combine_mat_mat = []
        let all_part_region_mat = [] // 存储每个字符的区域
        for (let ii=0;ii<combine_sort_idx_mat[1].length;ii++){
            let part_combine_region_3rd = combine_region_mat[combine_sort_idx_mat[1][ii]]
            let part_combine_str_3rd = combine_str_mat[ii]
            let mat_a_x = [part_combine_region_3rd[0], part_combine_region_3rd[1]]
            let mat_a_y = [part_combine_region_3rd[2], part_combine_region_3rd[3]]
            console.log('单组', part_combine_region_3rd, part_combine_str_3rd)
            if (ii==0){
                nums_combine_region_mat.push(part_combine_region_3rd)
                nums_combine_mat_mat.push([part_combine_str_3rd])
                all_part_region_mat.push([part_combine_region_3rd])
            }
            else{
                // 区域划分处理
                let find_region_flag = 0
                for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                    // 对比每一组区间，找到则插入值，否则重新建立添加
                    // 分为横向和纵向的区域对比情况
                    // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
                    let mat_b_x = [nums_combine_region_mat[jj][0], nums_combine_region_mat[jj][1]]
                    let mat_b_y = [nums_combine_region_mat[jj][2], nums_combine_region_mat[jj][3]]
                    let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
                    let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
                    // console.log('区域比较', x_region_ratio_mat, y_region_ratio_mat)
                    let min_dis_x_mat = this.TwoRegionDistanceMat(mat_a_x, mat_b_x)
                    let min_dis_y_mat = this.TwoRegionDistanceMat(mat_a_y, mat_b_y)
                    // console.log('间距大小', min_dis_x_mat, min_dis_y_mat)
                    console.log('计算符号', part_combine_str_3rd, ['+','-','X','x'].indexOf(part_combine_str_3rd))
                    if(y_region_ratio_mat[0]>0.6 && (x_region_ratio_mat[0]>0.6 || min_dis_x_mat[0]<base_height1*1)
                        // &&['+','-','X','x'].indexOf(part_combine_str_3rd)==-1
                        // &&['+','-','X','x'].indexOf(nums_combine_str_mat[jj][0])==-1
                        ){
                        // xy区域相交或y相交且间距小于基准高度权重
                        // nums_combine_str_mat[jj].push(part_combine_str_3rd)
                        // 对于竖式计算加减乘法符号组后再单独分析一次,计算符号的位置
                        nums_combine_mat_mat[jj].push(part_combine_str_3rd)
                        all_part_region_mat[jj].push(part_combine_region_3rd)
                        let new_combine_region = this.AllLineRegion([nums_combine_region_mat[jj], part_combine_region_3rd])
                        nums_combine_region_mat[jj] = new_combine_region
                        find_region_flag=1
                        break
                    }
                }
                if(find_region_flag==0){
                    nums_combine_region_mat.push(part_combine_region_3rd)
                    nums_combine_mat_mat.push([part_combine_str_3rd])
                    all_part_region_mat.push([part_combine_region_3rd])
                }
            }
        }
        console.log('分区数字组合000', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        // 二次行列组合:可以单设一种处理函数,用于处理行列分区,找到行方向的分布组合
        // 组合等号和除号的区域
        let while_flag = 1
        while(while_flag>0){
            if(nums_combine_region_mat.length>=2){
                for (let ii=0;ii<nums_combine_region_mat.length;ii++){
                    let ii_flag = 1
                    console.log('ii',ii)
                    for(let jj=0;jj<nums_combine_region_mat.length;jj++){
                        if(ii!=jj){
                            // 判断两组区域的y方向交叉
                            // console.log('ii',ii,'jj',jj)
                            let y_region_ratio_mat = this.TwoRegionRatio([nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]],
                                                                        [nums_combine_region_mat[jj][2],nums_combine_region_mat[jj][3]])
                            if(y_region_ratio_mat[0]>0.3){
                                console.log('存在相交区域ii/jj',ii,jj)
                                // 组合两组区域：所有数据：字符串、全局区域、单区域
                                let part_single_region_ii = all_part_region_mat[ii]
                                let part_single_region_jj = all_part_region_mat[jj]
                                let part_single_str_ii = nums_combine_mat_mat[ii]
                                let part_single_str_jj = nums_combine_mat_mat[jj]
                                let part_ii_jj_all_region = this.AllLineRegion([nums_combine_region_mat[ii], nums_combine_region_mat[jj]])  //重新组合的全局区域
                                let recombine_mat = this.TwoRegionMatCombine(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)
                                if (ii<jj){
                                    // 删减位置不同:其实不用，先替换后删除
                                    nums_combine_region_mat.splice(jj,1,)
                                    nums_combine_region_mat.splice(ii,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(jj,1)
                                    nums_combine_mat_mat.splice(ii,1,recombine_mat[1])
                                    all_part_region_mat.splice(jj,1)
                                    all_part_region_mat.splice(ii,1,recombine_mat[0])               
                                }
                                else if(ii>jj){
                                    nums_combine_region_mat.splice(ii,1,)
                                    nums_combine_region_mat.splice(jj,1,part_ii_jj_all_region)
                                    nums_combine_mat_mat.splice(ii,1)
                                    nums_combine_mat_mat.splice(jj,1,recombine_mat[1])
                                    all_part_region_mat.splice(ii,1)
                                    all_part_region_mat.splice(jj,1,recombine_mat[0])
                                }
                                ii_flag = 0
                                break
                            }
                            // else if(jj == nums_combine_region_mat.length-1){
                            //     ii_flag = 0
                            // }
                        }     
                    }
                    if(ii_flag==0){
                        break
                    }
                    // 遍历完重组所有的区域
                    if(ii == nums_combine_region_mat.length-1){
                        while_flag = 0
                        break
                    }
                }
                if (while_flag==0){
                    break
                }
            }
            else{
                break
            }
        }
        
        console.log('分区数字组合001', JSON.stringify(nums_combine_mat_mat), JSON.stringify(nums_combine_region_mat),JSON.stringify(all_part_region_mat))
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            if(nums_combine_mat_mat[ii].length>1){
                let equal_flag =1
                console.log('组合处理00',JSON.stringify(nums_combine_mat_mat))
                while(equal_flag>0){
                    console.log('组合处理1',nums_combine_mat_mat[ii])
                    equal_flag = 0
                    for(let jj=0; jj<nums_combine_mat_mat[ii].length-1;jj++){
                        // 连续判断出现等号的情况
                        let part_str1 = nums_combine_mat_mat[ii][jj]
                        let part_str2 = nums_combine_mat_mat[ii][jj+1]
                        if ((part_str1=='-'&&part_str2=='-')||(part_str1=='-'&&part_str2=='.')||(part_str1=='.'&&part_str2=='-')){
                            // 连续出现两横,判断组合区域的大小比
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj][1]-all_part_region_mat[ii][jj][0])*1.5||
                                (part_str_all_region[1]-part_str_all_region[0])<(all_part_region_mat[ii][jj+1][1]-all_part_region_mat[ii][jj+1][0])*1.5){
                                // 组合区域小于一个比例
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if(part_str1=='.'&&part_str2=='.'){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            if ((part_str_all_region[3]-part_str_all_region[2]+1)/(part_str_all_region[1]-part_str_all_region[0]+1)>1){
                                nums_combine_mat_mat[ii].splice(jj,2,':')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                            else{
                                nums_combine_mat_mat[ii].splice(jj,2,'=')
                                all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                                equal_flag = 1
                                break
                            }
                        }
                        else if((part_str1==':'&&part_str2=='-')||(part_str1=='-'&&part_str2==':')||
                                (part_str1=='='&&part_str2=='.')||(part_str1=='.'&&part_str2=='=')){
                            let part_str_all_region = this.AllLineRegion([all_part_region_mat[ii][jj],all_part_region_mat[ii][jj+1]])
                            nums_combine_mat_mat[ii].splice(jj,2,'÷')
                            all_part_region_mat[ii].splice(jj,2, part_str_all_region)
                            equal_flag = 1
                            break
                        }
                    }
                }   
            }
        }
        console.log('分区数字组合等号', nums_combine_mat_mat, nums_combine_region_mat,all_part_region_mat)
        let nums_combine_str_mat = []
        for(let ii=0;ii<nums_combine_mat_mat.length;ii++){
            let part_str_str = ''
            for(let jj=0;jj<nums_combine_mat_mat[ii].length;jj++){
                part_str_str +=nums_combine_mat_mat[ii][jj]
            }
            nums_combine_str_mat.push(part_str_str)
        }
        // 可以考虑按照从上往下，从左往右排序
        let row_region_combine_mat=[]
        let row_idx_combine_mat = []
        for (let ii=0;ii<nums_combine_region_mat.length;ii++){
            if(ii==0){
                row_region_combine_mat.push(nums_combine_region_mat[ii])
                row_idx_combine_mat.push([ii])
            }
            else{
                let row_flag = 0
                for(let jj=0;jj<row_region_combine_mat.length;jj++){
                    let min_dis_y_mat = this.TwoRegionRatio([row_region_combine_mat[jj][2],row_region_combine_mat[jj][3]],
                                                                  [nums_combine_region_mat[ii][2],nums_combine_region_mat[ii][3]])
                    // console.log('min_dis_y_mat',min_dis_y_mat)
                    if(min_dis_y_mat[0]>0.7){
                        row_idx_combine_mat[jj].push(ii)
                        let pp_region=this.AllLineRegion([row_region_combine_mat[jj], nums_combine_region_mat[ii]])
                        row_region_combine_mat[jj] = pp_region
                        row_flag=1
                    }
                }
                if(row_flag==0){
                    row_region_combine_mat.push(nums_combine_region_mat[ii])
                    row_idx_combine_mat.push([ii])
                }
            }
        }
        console.log('行分区', row_idx_combine_mat,row_region_combine_mat)
        let row_center_mat = []
        for (let ii=0;ii<row_region_combine_mat.length;ii++){
            row_center_mat.push((row_region_combine_mat[ii][2]+row_region_combine_mat[ii][3])/2)
        }
        let row_idx_sort_mat = this.ArraySortMat(row_center_mat)
        console.log('行排序', row_idx_sort_mat)
        // 分行列排序
        let col_idx_mat=[]
        let col_nums_mat=[]
        let new_single_combine_mat = []
        let new_single_str_mat = []
        for(let ii=0;ii<row_idx_sort_mat[1].length;ii++){
            let part_col_center = []
            console.log('单行idx000', row_idx_sort_mat[1][ii],row_idx_combine_mat[row_idx_sort_mat[1][ii]])
            new_single_combine_mat.push(all_part_region_mat[row_idx_sort_mat[1][ii]])
            new_single_str_mat.push(nums_combine_mat_mat[row_idx_sort_mat[1][ii]])
            // 单行多组处理
            for (let jj=0;jj<row_idx_combine_mat[row_idx_sort_mat[1][ii]].length;jj++){
                let part_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][jj]
                // console.log('单行idx', row_idx_sort_mat[1][ii], part_combine_idx)
                part_col_center.push((nums_combine_region_mat[part_combine_idx][0]+nums_combine_region_mat[part_combine_idx][1])/2)
            }
            console.log('单行列中心',part_col_center)
            let part_col_idx_sort_mat = this.ArraySortMat(part_col_center)
            let part_nums_mat = []
            let part_nums_idx_mat = []
            for(let kk=0;kk<part_col_idx_sort_mat[1].length;kk++){
                let part_nums_combine_idx = row_idx_combine_mat[row_idx_sort_mat[1][ii]][part_col_idx_sort_mat[1][kk]]
                part_nums_mat.push(nums_combine_str_mat[part_nums_combine_idx])
                part_nums_idx_mat.push(part_nums_combine_idx)
            }
            col_idx_mat.push(part_nums_idx_mat)
            col_nums_mat.push(part_nums_mat)
        }
        console.log('行列组合', col_idx_mat, col_nums_mat,new_single_combine_mat, new_single_str_mat)
        let return_mat= []
        return_mat.push(sort_str_mat)
        // for (let ii=0;ii<nums_combine_str_mat.length;ii++){
        //     return_mat.push('\n')
        //     return_mat.push(nums_combine_str_mat[ii])
        // }
        for(let ii=0;ii<col_nums_mat.length;ii++){
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii].length;jj++){
                part_nums_str +=col_nums_mat[ii][jj]+' '
            }
            return_mat.push('\n')
            return_mat.push(part_nums_str)
        }
        // 分解:考虑单行单组，和多组数字组合，现只分离计算符号
        let combine_str_row_col_mat = []
        for(let ii=0;ii<col_nums_mat.length;ii++){
            combine_str_row_col_mat.push([])
            let part_nums_str = ''
            for(let jj=0;jj<col_nums_mat[ii][0].length;jj++){
                // console.log('前',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)
                if(['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(col_nums_mat[ii][0][jj])!=-1){
                    // console.log('符号出现', part_nums_str, col_nums_mat[ii][0][jj])
                    if (part_nums_str.length<1){
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                    }
                    else{
                        combine_str_row_col_mat[ii].push(part_nums_str)
                        combine_str_row_col_mat[ii].push(col_nums_mat[ii][0][jj])
                        part_nums_str = '' 
                    }
                    
                }
                else if(jj==col_nums_mat[ii][0].length-1){
                    part_nums_str +=col_nums_mat[ii][0][jj]
                    combine_str_row_col_mat[ii].push(part_nums_str)
                }
                else{
                   part_nums_str +=col_nums_mat[ii][0][jj]
                }
                // console.log('后',combine_str_row_col_mat, col_nums_mat[ii][0][jj],part_nums_str)                
            }
        }
        // console.log('数字组合/计算符号分离', combine_str_row_col_mat)
        // // new_single_combine_mat\combine_str_row_col_mat\
        // // 提取组合后的加法字符高度:2020-12-1
        // console.log('单字符组合区域',new_single_combine_mat)
        // console.log('单字符组合字符',new_single_str_mat)
        // console.log('全局组合区域',all_line_region)
        let statics_height_mat = []
        // let long_line_idx
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                // console.log('单字符组合区域',new_single_combine_mat[ii][jj])
                // console.log('单字符组合字符',new_single_str_mat[ii][jj])
                if (new_single_str_mat[ii][jj]!="-"){
                    // 非减号统计高度
                    // console.log('非减号', new_single_str_mat[ii][jj])
                    statics_height_mat.push(new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)
                }
                // 找到长横线区域
                // if (new_single_str_mat[ii][jj]=="-"&&
                //     ((new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)>(all_line_region[1]-all_line_region[0])*0.8)){
                //     // 
                //     long_line_idx = [ii, jj]
                // }
            }
        }
        // console.log('高度统计', statics_height_mat)
        let sort_statics_height_mat = this.ArraySortMat(statics_height_mat)
        // console.log('高度排序', sort_statics_height_mat)
        // console.log('长横线', long_line_idx)
        // 设定基准高度:中位数/均值/
        let median_idx = parseInt(statics_height_mat.length/2)
        let median_height = sort_statics_height_mat[0][median_idx]
        // console.log('中位Idx/Height', median_idx, median_height)
        // 提取退位索引
        let borrow_bit_mat = []
        for(let ii=0;ii<new_single_combine_mat.length;ii++){
            for(let jj=0;jj<new_single_combine_mat[ii].length;jj++){
                if((new_single_combine_mat[ii][jj][3]-new_single_combine_mat[ii][jj][2]+1)<median_height*0.4&&
                    (new_single_combine_mat[ii][jj][1]-new_single_combine_mat[ii][jj][0]+1)<median_height*0.4){
                    // 小于1标准高度一般
                    borrow_bit_mat.push([ii,jj])
                    new_single_str_mat[ii][jj]='.'
                }
            }
        }
        // console.log('退位索引', borrow_bit_mat)
        let new_str_num_mat = []
        let new_str_borrow_mat = []
        let new_region_num_mat = []
        let new_region_borrow_mat = []
        for (let ii=0;ii<new_single_str_mat.length;ii++){
            let part_new_str_num_mat = []
            let part_new_region_num_mat = []
            for(let jj=0;jj<new_single_str_mat[ii].length;jj++){
                if(this.FindArrayIdx([ii,jj],borrow_bit_mat)>=0){
                    // 借位 
                    new_str_borrow_mat.push(new_single_str_mat[ii][jj])
                    new_region_borrow_mat.push(new_single_combine_mat[ii][jj])
                }
                else{
                    part_new_str_num_mat.push(new_single_str_mat[ii][jj])
                    part_new_region_num_mat.push(new_single_combine_mat[ii][jj])
                }
            }
            if(part_new_str_num_mat.length>0){
                new_str_num_mat.push(part_new_str_num_mat)
                new_region_num_mat.push(part_new_region_num_mat)
            }
        }
        console.log('筛选进位组合', [new_str_num_mat, new_str_borrow_mat])
        // return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat]
        return [return_mat,col_nums_mat, combine_str_row_col_mat,new_single_combine_mat, new_single_str_mat,[new_str_num_mat, new_str_borrow_mat],[new_region_num_mat, new_region_borrow_mat]]
    }
    TwoRegionMatCombine=(part_single_region_ii, part_single_str_ii, part_single_region_jj, part_single_str_jj)=>{
        // 按行方向相对顺序添加字符和局部区域
        let new_part_region_mat = this.deepClone(part_single_region_ii, [])
        let new_part_str_mat = this.deepClone(part_single_str_ii, [])
        console.log('旧组合', new_part_region_mat, new_part_str_mat)
        for (let kk=0;kk<part_single_region_jj.length;kk++){
            let part_single_region_kk = part_single_region_jj[kk]
            let part_single_str_kk = part_single_str_jj[kk]
            let part_jj_center_x = (part_single_region_kk[0]+part_single_region_kk[1])/2
            for(let ll=0;ll<new_part_region_mat.length;ll++){
                if (ll==0&&
                    (part_jj_center_x<=(new_part_region_mat[ll][0]+new_part_region_mat[ll][1])/2)){
                    // 最前端插入
                    new_part_region_mat.splice(ll,0,part_single_region_kk)
                    new_part_str_mat.splice(ll,0,part_single_str_kk)
                    break
                }
                else if(ll==new_part_region_mat.length-1 && 
                        (part_jj_center_x>(new_part_region_mat[ll][0]+new_part_region_mat[ll][1])/2)){
                    // 最后端插入
                    new_part_region_mat.push(part_single_region_kk)
                    new_part_str_mat.push(part_single_str_kk)
                    break
                }
                else if(part_jj_center_x<=(new_part_region_mat[ll+1][0]+new_part_region_mat[ll+1][1])/2&&
                        part_jj_center_x>(new_part_region_mat[ll][0]+new_part_region_mat[ll][1])/2){
                    // 中间位置ll+1插入
                    new_part_region_mat.splice(ll+1,0,part_single_region_kk)
                    new_part_str_mat.splice(ll+1,0,part_single_str_kk)
                    break
                }
            }
        }
        console.log('新组合', new_part_region_mat, new_part_str_mat)
        return [new_part_region_mat, new_part_str_mat]
    }

    JudgeLineAndRegionRelation=(line_data, region_data)=>{
        // 判断一条线和一个区域内各直线的关系
        // line_data:数据包括线条数据和线条区域
        // region_data:内部[单条数据、区域]、[组合区域]
        // console.log('进入对比')
        let line_data0 = line_data[0]
        let line_data0_region = line_data[1]
        // console.log('字符num', line_data[2])
        let mat_a_x = [line_data0_region[0], line_data0_region[1]]
        let mat_a_y = [line_data0_region[2], line_data0_region[3]]
        let mat_a_y_center = (mat_a_y[0]+mat_a_y[1])/2
        let cross_flag=0
        for(let ii=0;ii<region_data[0].length;ii++){
            let line_data1 = region_data[0][ii][0]
            let line_data1_region = region_data[0][ii][1]
            // console.log('组合单笔', region_data[0][ii][2])
            let line_relation_mat = this.JudgeTwoLineRelation(line_data0, line_data1)
            // 所有返回,相交、相切、相离（1，0，-1），第一条线的索引比例、第二条线的索引比例，最小距离值    
            let mat_b_x = [line_data1_region[0], line_data1_region[1]]
            let mat_b_y = [line_data1_region[2], line_data1_region[3]]
            let mat_b_y_center = (mat_b_y[0]+mat_b_y[1])/2
            let x_region_ratio_mat = this.TwoRegionRatio(mat_a_x, mat_b_x)
            let y_region_ratio_mat = this.TwoRegionRatio(mat_a_y, mat_b_y)
            // console.log('单条对比结果', line_relation_mat,x_region_ratio_mat,y_region_ratio_mat,x_region_ratio_mat[0]+y_region_ratio_mat[0])
            // console.log('组合', [line_data[2], region_data[0][ii][2]], ((this.JudgeTwoMatEqual([line_data[2], region_data[0][ii][2]],[5,10])||
            // this.JudgeTwoMatEqual([line_data[2], region_data[0][ii][2]],[5,13]))&&(x_region_ratio_mat[0]+y_region_ratio_mat[0])>1.1))
            
            if ((x_region_ratio_mat[0]+y_region_ratio_mat[0])>1.5||
                ((this.JudgeTwoMatEqual([line_data[2], region_data[0][ii][2]],[5,10])||
                this.JudgeTwoMatEqual([line_data[2], region_data[0][ii][2]],[5,13]))&&
                (x_region_ratio_mat[0]+y_region_ratio_mat[0])>1.1&&
                (((mat_a_y[1]-mat_a_y[0])<(mat_b_y[1]-mat_b_y[0])&&mat_a_y_center<mat_b_y_center)||
                ((mat_a_y[1]-mat_a_y[0])>(mat_b_y[1]-mat_b_y[0])&&mat_a_y_center>mat_b_y_center)))){
                // 内部区域判定
                cross_flag =1
                break
            }
        }
        return cross_flag
    }
    OneLineNumStr = (line_num, line_str)=>{
        let comfirm_str
        if(line_num==5){
            comfirm_str = '5'
        }
        else if(line_num==4){
            comfirm_str = '2'
        }
        else{
            comfirm_str = line_str
        }
        return comfirm_str
    }
    TwoLineNumStr = (part_line_num_mat,part_line_str_mat,part_line_centerx_mat)=>{
        let two_line_str = ''
        console.log('part_combine_num',part_line_num_mat)
        if (part_line_num_mat[0]==part_line_num_mat[1]){
            two_line_str = part_line_str_mat[0]
        }
        else if (this.MultiJudgeTwoMatEqual(part_line_num_mat,fuzzy_num_4)){
            two_line_str = '4'
        }
        else if(this.MultiJudgeTwoMatEqual(part_line_num_mat,fuzzy_num_5)){
            two_line_str = '5'
        }
        else{
            if(part_line_num_mat.indexOf(13)!=-1){
                // 存在小数点
                let find_idx_1 = part_line_num_mat.indexOf(13)
                let str_1 = '.'
                let find_idx_2 = Math.abs(1-find_idx_1)
                let str_2 = this.OneLineNumStr(part_line_num_mat[find_idx_2],part_line_str_mat[find_idx_2])
                if (part_line_centerx_mat[find_idx_1]<part_line_centerx_mat[find_idx_2]){
                    two_line_str = str_1+str_2
                }
                else{
                    two_line_str = str_2+str_1
                }
            }
            else{
                two_line_str = ''
            }
        }
        return two_line_str
    }

    ThreeLineNumStr = (part_line_num_mat,part_line_str_mat,part_line_centerx_mat)=>{
        let two_line_str = ''
        if(part_line_num_mat.indexOf(13)!=-1){
            // 存在小数点
            let find_idx_1 = part_line_num_mat.indexOf(13)
            let str_1 = '.'
            let part_line_num_mat2=[]
            let part_line_str_mat2=[]
            let part_line_centerx_mat2 = []
            for (let ii=0;ii<part_line_num_mat.length;ii++){
                if(ii!=find_idx_1){
                    part_line_num_mat2.push(part_line_num_mat[ii])
                    part_line_str_mat2.push(part_line_str_mat[ii])
                    part_line_centerx_mat2.push(part_line_centerx_mat[ii])
                }
            }
            let str_2 = this.TwoLineNumStr(part_line_num_mat[find_idx_2],part_line_str_mat[find_idx_2])
            let str_2_center = (part_line_centerx_mat2[0]+part_line_centerx_mat2[1])/2
            if (part_line_centerx_mat[find_idx_1]<str_2_center){
                two_line_str = str_1+str_2
            }
            else{
                two_line_str = str_2+str_1
            }
        }
        else{
            two_line_str = ''
        }
        return two_line_str
    }

    CaculateRecMat=(row_rec_str)=>{
        // 计算诊断单组字符
        console.log('单排字符串', row_rec_str)
        let deep_rec_str = this.deepClone([row_rec_str],[])
        let rec_mat = deep_rec_str[0].split('=')
        let standard_str = mathstrcaculate.standardstr(row_rec_str)
        console.log('替换标准字符', standard_str)
        let standard_mat = standard_str.split('=')
        console.log('等号拆分', standard_mat)
        let answer_mat = []
        for(let ii=0;ii<standard_mat.length;ii++){
            let part_str = standard_mat[ii]
            let error_flag=0
            try {
                console.log('算式结果',eval(part_str))
            }
            catch(exception){
                error_flag = -1
            }
            if (error_flag==-1){
                answer_mat.push('error')
            }
            else{
                answer_mat.push(mathstrcaculate.formatNum(eval(part_str),5))    
            }
        }
        console.log('单步计算结果', answer_mat,standard_mat.length)
        let answer_str_mat = ''
        if(standard_mat.length<=1){
            // 单组列式
            if(answer_mat[0]=='error'){
                // 列式有误
                answer_str_mat += rec_mat[0]+':算式错误'+'\n'
            }
            else{
                answer_str_mat += '计算结果\n:'+rec_mat[0]+'='+ answer_mat[0]+'\n'
            }
        }
        else{
            // 多组间相互判定
            for(let ii=0;ii<standard_mat.length-1;ii++){
                console.log('answer_mat[ii]',answer_mat[ii])
                if(answer_mat[ii]=='error'){
                    // 算式错误，不做比较
                    answer_str_mat += rec_mat[ii]+':算式错误'+'\n'
                }
                else{
                    // 于下一组作比较
                    for(let jj=ii+1;jj<standard_mat.length;jj++){
                        console.log('answer_mat[jj]',answer_mat[jj])
                        if(answer_mat[ii]==answer_mat[jj]){
                            // 计算结果相等
                            answer_str_mat += '计算结果相等:\n'+rec_mat[ii]+'='+rec_mat[jj] +'='+ answer_mat[ii]+'\n'
                        }
                        else{
                            if(answer_mat[jj]=='error'){
                                answer_str_mat += '算式1：'+rec_mat[ii]+'='+ answer_mat[ii]+'\n算式2：'+rec_mat[jj] +'='+ answer_mat[jj]+'列式有误\n'
                            }
                            else{
                                answer_str_mat += '计算结果不相等:\n算式1：'+rec_mat[ii]+'='+ answer_mat[ii]+'\n算式2：'+rec_mat[jj]+'='+ answer_mat[jj] +'\n'
                            }
                        }
                    }
                }
                
            }

        }
        console.log('answer_str_mat',answer_str_mat)
        return answer_str_mat
    }
    LineConnectionMode5=(all_line_mat)=>{
        console.log('连线题：模式5')
        let endpoint_mat0 = []
        let endpoint_mat = []
        let endpoint_x_mat = []
        let endpoint_y_mat = []
        let all_line_idx_sort_mat
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_data = all_line_mat[ii]
            endpoint_mat.push([part_line_data[0][0],part_line_data[1][0]])
            endpoint_mat.push([part_line_data[0][part_line_data[0].length-1],part_line_data[1][part_line_data[1].length-1]])
            endpoint_mat0.push([[part_line_data[0][0],',',part_line_data[1][0]],[','],
                               [part_line_data[0][part_line_data[0].length-1],',',part_line_data[1][part_line_data[1].length-1]],['\n']])
            endpoint_x_mat.push(part_line_data[0][0])
            endpoint_y_mat.push(part_line_data[1][0])
            endpoint_x_mat.push(part_line_data[0][part_line_data[0].length-1])
            endpoint_y_mat.push(part_line_data[1][part_line_data[1].length-1])
        }
        console.log('初始端点统计', endpoint_mat)
        console.log('初始端点统计x', endpoint_x_mat)
        console.log('初始端点统计y', endpoint_y_mat)
        // 统计行列均值/方差/可初略判定横向分布还是纵向分布
        let statics_x_mean_variance = this.StdAndVariance(endpoint_x_mat)
        let statics_y_mean_variance = this.StdAndVariance(endpoint_y_mat)
        console.log('初始端点统计x均值方差一次', statics_x_mean_variance)
        console.log('初始端点统计y均值方差一次', statics_y_mean_variance)
        // 统计二次均值方差
        let endpoint_x_mean_sub_mat = []
        let endpoint_y_mean_sub_mat = []
        for (let ii=0;ii<endpoint_x_mat.length;ii++){
            endpoint_x_mean_sub_mat.push(Math.round(Math.abs(endpoint_x_mat[ii]-statics_x_mean_variance[0])*100)/100)
            endpoint_y_mean_sub_mat.push(Math.round(Math.abs(endpoint_y_mat[ii]-statics_y_mean_variance[0])*100)/100)
        }
        let statics_x_mean_variance_2nd = this.StdAndVariance(endpoint_x_mean_sub_mat)
        let statics_y_mean_variance_2nd = this.StdAndVariance(endpoint_y_mean_sub_mat)
        console.log('初始端点统计x均值方差2次', endpoint_x_mean_sub_mat, statics_x_mean_variance_2nd)
        console.log('初始端点统计y均值方差2次', endpoint_y_mean_sub_mat, statics_y_mean_variance_2nd)
        if(statics_x_mean_variance_2nd[1]<=statics_y_mean_variance_2nd[1]){
            console.log('纵向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
        }
        else{
            console.log('横向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
            // 上下分区，再左右排序，找到对应点的标准顺序；按1次y均值/再索引
            let up_y_mat = []
            let up_x_mat = []
            let up_idx_mat = []
            let down_y_mat = []
            let down_x_mat = []
            let down_idx_mat = []
            for(let jj=0;jj<endpoint_y_mat.length;jj++){
                if(endpoint_y_mat[jj]<=statics_y_mean_variance[0]){
                    up_y_mat.push(endpoint_y_mat[jj])
                    up_x_mat.push(endpoint_x_mat[jj])
                    up_idx_mat.push(jj)
                }
                else{
                    down_y_mat.push(endpoint_y_mat[jj])
                    down_x_mat.push(endpoint_x_mat[jj])
                    down_idx_mat.push(jj)
                }
            }
            console.log('上:ycenter、x、y、idx', statics_y_mean_variance[0], up_x_mat, up_y_mat, up_idx_mat)
            console.log('下:ycenter、x、y、idx', statics_y_mean_variance[0], down_x_mat, down_y_mat, down_idx_mat)
            let x_up_sort_mat = this.ArraySortMat(up_x_mat)
            let x_down_sort_mat = this.ArraySortMat(down_x_mat)
            console.log("x上排序", x_up_sort_mat)
            console.log("x下排序", x_down_sort_mat)
            let all_point_sort_mat = []
            for (let ii=0;ii<x_up_sort_mat[1].length;ii++){
                all_point_sort_mat.push([up_x_mat[x_up_sort_mat[1][ii]], up_y_mat[x_up_sort_mat[1][ii]]])
            }
            for (let ii=0;ii<x_down_sort_mat[1].length;ii++){
                all_point_sort_mat.push([down_x_mat[x_down_sort_mat[1][ii]], down_y_mat[x_down_sort_mat[1][ii]]])
            }
            console.log('端点行列排序', all_point_sort_mat) 
            // 对排序后的坐标点与初始线段进行比较计算
            let all_line_idx_mat = [] // 每条线的匹配标准索引
            for(let ii=0;ii<endpoint_mat.length;ii=ii+2){
                // 一条线段的起点终点值
                let point_start= endpoint_mat[ii]
                let point_end= endpoint_mat[ii+1]
                let point_start_idx = this.FindArrayIdx(point_start, all_point_sort_mat)
                let point_end_idx = this.FindArrayIdx(point_end, all_point_sort_mat)
                if(point_start_idx<point_end_idx){
                    all_line_idx_mat.push([point_start_idx, point_end_idx])
                }
                else{
                    all_line_idx_mat.push([point_end_idx, point_start_idx])
                }
            }
            console.log('排序后线条一次索引', all_line_idx_mat)
            all_line_idx_sort_mat = this.IdxSortMat(all_line_idx_mat)
            console.log('排序后线条一次索引排序', all_line_idx_sort_mat)
        }
        return all_line_idx_sort_mat
    }

    LineConnectionMode6=(all_line_mat)=>{
        console.log('连线题：模式6')
        // 先按照行统计，找到分线位置
        let endpoint_mat0 = []
        let endpoint_mat = []
        let endpoint_x_mat = []
        let endpoint_y_mat = []
        let all_line_idx_sort_mat
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_data = all_line_mat[ii]
            endpoint_mat.push([part_line_data[0][0],part_line_data[1][0]])
            endpoint_mat.push([part_line_data[0][part_line_data[0].length-1],part_line_data[1][part_line_data[1].length-1]])
            endpoint_mat0.push([[part_line_data[0][0],',',part_line_data[1][0]],[','],
                               [part_line_data[0][part_line_data[0].length-1],',',part_line_data[1][part_line_data[1].length-1]],['\n']])
            endpoint_x_mat.push(part_line_data[0][0])
            endpoint_y_mat.push(part_line_data[1][0])
            endpoint_x_mat.push(part_line_data[0][part_line_data[0].length-1])
            endpoint_y_mat.push(part_line_data[1][part_line_data[1].length-1])
        }
        console.log('初始端点统计', endpoint_mat)
        console.log('初始端点统计x', endpoint_x_mat)
        console.log('初始端点统计y', endpoint_y_mat)
        let min_x = Math.min.apply(null,endpoint_x_mat)
        let max_x = Math.max.apply(null,endpoint_x_mat)
        let min_y = Math.min.apply(null,endpoint_y_mat)
        let max_y = Math.max.apply(null,endpoint_y_mat)
        console.log('区间', min_x, max_x, min_y, max_y)
        let up_idx_mat = [[],[],[]]     //idx/x/y
        let down_idx_mat = [[],[],[]]
        for(let loc_ii=min_y;loc_ii<max_y;loc_ii++){
            for(let jj=0;jj<endpoint_y_mat.length;jj++){
                if(endpoint_y_mat[jj]<loc_ii){
                    up_idx_mat[0].push(jj)
                    up_idx_mat[1].push(endpoint_x_mat[jj])
                    up_idx_mat[2].push(endpoint_y_mat[jj])
                }
                else{
                    down_idx_mat[0].push(jj)
                    down_idx_mat[1].push(endpoint_x_mat[jj])
                    down_idx_mat[2].push(endpoint_y_mat[jj])
                }
            }
            if(up_idx_mat[0].length==down_idx_mat[0].length){
                break
            }
            else{
                up_idx_mat = [[],[],[]]
                down_idx_mat = [[],[],[]]
            }
        }
        console.log('分区序号', up_idx_mat, down_idx_mat)
        //  对上半区进行中间值分区
        let up_y_mean = 0
        for(let ii=0;ii<up_idx_mat[2].length;ii++){
            up_y_mean = (up_y_mean*ii+up_idx_mat[2][ii])/(ii+1)
        }
        console.log('上半区y均值', up_y_mean)
        let half_up_idx_mat1 = [[],[],[]]
        let half_up_idx_mat2 = [[],[],[]]
        for(let ii=0;ii<up_idx_mat[2].length;ii++){
            if(up_idx_mat[2][ii]<=up_y_mean){
                half_up_idx_mat1[0].push(up_idx_mat[0][ii])
                half_up_idx_mat1[1].push(up_idx_mat[1][ii])
                half_up_idx_mat1[2].push(up_idx_mat[2][ii])
            }
            else{
                half_up_idx_mat2[0].push(up_idx_mat[0][ii])
                half_up_idx_mat2[1].push(up_idx_mat[1][ii])
                half_up_idx_mat2[2].push(up_idx_mat[2][ii])
            }
        }
        console.log('上半区2次分区', half_up_idx_mat1, half_up_idx_mat2)
        let new_half_up_mat1 = this.LocXSortMat(half_up_idx_mat1)
        let new_half_up_mat2 = this.LocXSortMat(half_up_idx_mat2)
        let new_down_mat = this.LocXSortMat(down_idx_mat)
        console.log('分层', new_half_up_mat1, new_half_up_mat2, new_down_mat)
        return [new_half_up_mat1, new_half_up_mat2, new_down_mat]
    }

    LineConnectionMode7=(all_line_mat)=>{
        console.log('连线题：模式7,上下数据点相同')
        let endpoint_mat0 = []
        let endpoint_mat = []
        let endpoint_x_mat = []
        let endpoint_y_mat = []
        let all_line_idx_sort_mat
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_data = all_line_mat[ii]
            endpoint_mat.push([part_line_data[0][0],part_line_data[1][0]])
            endpoint_mat.push([part_line_data[0][part_line_data[0].length-1],part_line_data[1][part_line_data[1].length-1]])
            endpoint_mat0.push([[part_line_data[0][0],',',part_line_data[1][0]],[','],
                               [part_line_data[0][part_line_data[0].length-1],',',part_line_data[1][part_line_data[1].length-1]],['\n']])
            endpoint_x_mat.push(part_line_data[0][0])
            endpoint_y_mat.push(part_line_data[1][0])
            endpoint_x_mat.push(part_line_data[0][part_line_data[0].length-1])
            endpoint_y_mat.push(part_line_data[1][part_line_data[1].length-1])
        }
        console.log('初始端点统计', endpoint_mat)
        console.log('初始端点统计x', endpoint_x_mat)
        console.log('初始端点统计y', endpoint_y_mat)
        // 统计行列均值/方差/可初略判定横向分布还是纵向分布
        let statics_x_mean_variance = this.StdAndVariance(endpoint_x_mat)
        let statics_y_mean_variance = this.StdAndVariance(endpoint_y_mat)
        console.log('初始端点统计x均值方差一次', statics_x_mean_variance)
        console.log('初始端点统计y均值方差一次', statics_y_mean_variance)
        // 统计二次均值方差
        let endpoint_x_mean_sub_mat = []
        let endpoint_y_mean_sub_mat = []
        for (let ii=0;ii<endpoint_x_mat.length;ii++){
            endpoint_x_mean_sub_mat.push(Math.round(Math.abs(endpoint_x_mat[ii]-statics_x_mean_variance[0])*100)/100)
            endpoint_y_mean_sub_mat.push(Math.round(Math.abs(endpoint_y_mat[ii]-statics_y_mean_variance[0])*100)/100)
        }
        let statics_x_mean_variance_2nd = this.StdAndVariance(endpoint_x_mean_sub_mat)
        let statics_y_mean_variance_2nd = this.StdAndVariance(endpoint_y_mean_sub_mat)
        console.log('初始端点统计x均值方差2次', endpoint_x_mean_sub_mat, statics_x_mean_variance_2nd)
        console.log('初始端点统计y均值方差2次', endpoint_y_mean_sub_mat, statics_y_mean_variance_2nd)
        if(statics_x_mean_variance_2nd[1]<=statics_y_mean_variance_2nd[1]){
            console.log('纵向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
        }
        else{
            console.log('横向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
            // 上下分区，再左右排序，找到对应点的标准顺序；按1次y均值/再索引
            let up_y_mat = []
            let up_x_mat = []
            let up_idx_mat = []
            let down_y_mat = []
            let down_x_mat = []
            let down_idx_mat = []

            // for(let jj=0;jj<endpoint_y_mat.length;jj++){
            //     if(endpoint_y_mat[jj]<=statics_y_mean_variance[0]){
            //         up_y_mat.push(endpoint_y_mat[jj])
            //         up_x_mat.push(endpoint_x_mat[jj])
            //         up_idx_mat.push(jj)
            //     }
            //     else{
            //         down_y_mat.push(endpoint_y_mat[jj])
            //         down_x_mat.push(endpoint_x_mat[jj])
            //         down_idx_mat.push(jj)
            //     }
            // }
            // endpoint_y_mat上下排序
            let endpoint_y_mat_sort=this.ArraySortMat(endpoint_y_mat)
            for(let idx_ii=0;idx_ii<endpoint_y_mat.length;idx_ii++){
                if (idx_ii<endpoint_y_mat.length/2){
                    // up
                    up_y_mat.push(endpoint_y_mat[endpoint_y_mat_sort[1][idx_ii]])
                    up_x_mat.push(endpoint_x_mat[endpoint_y_mat_sort[1][idx_ii]])
                    up_idx_mat.push(endpoint_y_mat_sort[1][idx_ii])
                }
                else{
                    //down
                    down_y_mat.push(endpoint_y_mat[endpoint_y_mat_sort[1][idx_ii]])
                    down_x_mat.push(endpoint_x_mat[endpoint_y_mat_sort[1][idx_ii]])
                    down_idx_mat.push(endpoint_y_mat_sort[1][idx_ii])
                }
            }

            console.log('上:ycenter、x、y、idx', statics_y_mean_variance[0], up_x_mat, up_y_mat, up_idx_mat)
            console.log('下:ycenter、x、y、idx', statics_y_mean_variance[0], down_x_mat, down_y_mat, down_idx_mat)
            let x_up_sort_mat = this.ArraySortMat(up_x_mat)
            let x_down_sort_mat = this.ArraySortMat(down_x_mat)
            console.log("x上排序", x_up_sort_mat)
            console.log("x下排序", x_down_sort_mat)
            let all_point_sort_mat = []
            for (let ii=0;ii<x_up_sort_mat[1].length;ii++){
                all_point_sort_mat.push([up_x_mat[x_up_sort_mat[1][ii]], up_y_mat[x_up_sort_mat[1][ii]]])
            }
            for (let ii=0;ii<x_down_sort_mat[1].length;ii++){
                all_point_sort_mat.push([down_x_mat[x_down_sort_mat[1][ii]], down_y_mat[x_down_sort_mat[1][ii]]])
            }
            console.log('端点行列排序', all_point_sort_mat) 
            // 对排序后的坐标点与初始线段进行比较计算
            let all_line_idx_mat = [] // 每条线的匹配标准索引
            for(let ii=0;ii<endpoint_mat.length;ii=ii+2){
                // 一条线段的起点终点值
                let point_start= endpoint_mat[ii]
                let point_end= endpoint_mat[ii+1]
                let point_start_idx = this.FindArrayIdx(point_start, all_point_sort_mat)
                let point_end_idx = this.FindArrayIdx(point_end, all_point_sort_mat)
                if(point_start_idx<point_end_idx){
                    all_line_idx_mat.push([point_start_idx, point_end_idx])
                }
                else{
                    all_line_idx_mat.push([point_end_idx, point_start_idx])
                }
            }
            console.log('排序后线条一次索引', all_line_idx_mat)
            all_line_idx_sort_mat = this.IdxSortMat(all_line_idx_mat)
            console.log('排序后线条一次索引排序', all_line_idx_sort_mat)
        }
        return all_line_idx_sort_mat
    }

    LineConnectionMode8=(all_line_mat)=>{
        // console.log('连线题：模式8,112,缺失')
        let endpoint_mat0 = []
        let endpoint_mat = []
        let endpoint_x_mat = []
        let endpoint_y_mat = []
        let all_line_idx_sort_mat
        let half_idx_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_data = all_line_mat[ii]
            endpoint_mat.push([part_line_data[0][0],part_line_data[1][0]])
            endpoint_mat.push([part_line_data[0][part_line_data[0].length-1],part_line_data[1][part_line_data[1].length-1]])
            endpoint_mat0.push([[part_line_data[0][0],',',part_line_data[1][0]],[','],
                               [part_line_data[0][part_line_data[0].length-1],',',part_line_data[1][part_line_data[1].length-1]],['\n']])
            endpoint_x_mat.push(part_line_data[0][0])
            endpoint_y_mat.push(part_line_data[1][0])
            endpoint_x_mat.push(part_line_data[0][part_line_data[0].length-1])
            endpoint_y_mat.push(part_line_data[1][part_line_data[1].length-1])
        }
        console.log('初始端点统计', endpoint_mat)
        console.log('初始端点统计x', endpoint_x_mat)
        console.log('初始端点统计y', endpoint_y_mat)
        // 统计行列均值/方差/可初略判定横向分布还是纵向分布
        let statics_x_mean_variance = this.StdAndVariance(endpoint_x_mat)
        let statics_y_mean_variance = this.StdAndVariance(endpoint_y_mat)
        console.log('初始端点统计x均值方差一次', statics_x_mean_variance)
        console.log('初始端点统计y均值方差一次', statics_y_mean_variance)
        // 统计二次均值方差
        let endpoint_x_mean_sub_mat = []
        let endpoint_y_mean_sub_mat = []
        for (let ii=0;ii<endpoint_x_mat.length;ii++){
            endpoint_x_mean_sub_mat.push(Math.round(Math.abs(endpoint_x_mat[ii]-statics_x_mean_variance[0])*100)/100)
            endpoint_y_mean_sub_mat.push(Math.round(Math.abs(endpoint_y_mat[ii]-statics_y_mean_variance[0])*100)/100)
        }
        let statics_x_mean_variance_2nd = this.StdAndVariance(endpoint_x_mean_sub_mat)
        let statics_y_mean_variance_2nd = this.StdAndVariance(endpoint_y_mean_sub_mat)
        console.log('初始端点统计x均值方差2次', endpoint_x_mean_sub_mat, statics_x_mean_variance_2nd)
        console.log('初始端点统计y均值方差2次', endpoint_y_mean_sub_mat, statics_y_mean_variance_2nd)
        if(statics_x_mean_variance_2nd[1]<=statics_y_mean_variance_2nd[1]){
            console.log('纵向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
            // 上下分区，再左右排序，找到对应点的标准顺序；按1次y均值/再索引
            let right_y_mat = []
            let right_x_mat = []
            let right_idx_mat = []
            let left_y_mat = []
            let left_x_mat = []
            let left_idx_mat = []
            let endpoint_x_mat_sort=this.ArraySortMat(endpoint_x_mat)
            for(let idx_ii=0;idx_ii<endpoint_x_mat.length;idx_ii++){
                if (idx_ii<endpoint_x_mat.length/2){
                    // left
                    left_y_mat.push(endpoint_y_mat[endpoint_x_mat_sort[1][idx_ii]])
                    left_x_mat.push(endpoint_x_mat[endpoint_x_mat_sort[1][idx_ii]])
                    left_idx_mat.push(endpoint_x_mat_sort[1][idx_ii])
                }
                else{
                    //right
                    right_y_mat.push(endpoint_y_mat[endpoint_x_mat_sort[1][idx_ii]])
                    right_x_mat.push(endpoint_x_mat[endpoint_x_mat_sort[1][idx_ii]])
                    right_idx_mat.push(endpoint_x_mat_sort[1][idx_ii])
                }
            }

            console.log('左:ycenter、x、y、idx', statics_x_mean_variance[0], left_x_mat, left_y_mat, left_idx_mat)
            console.log('右:ycenter、x、y、idx', statics_x_mean_variance[0], right_x_mat, right_y_mat, right_idx_mat)
            let y_left_sort_mat = this.ArraySortMat(left_y_mat)
            let y_right_sort_mat = this.ArraySortMat(right_y_mat)
            console.log("y左排序", y_left_sort_mat)
            console.log("y右排序", y_right_sort_mat)
            let all_point_sort_mat = []
            for (let ii=0;ii<y_left_sort_mat[1].length;ii++){
                all_point_sort_mat.push([left_x_mat[y_left_sort_mat[1][ii]], left_y_mat[y_left_sort_mat[1][ii]]])
            }
            for (let ii=0;ii<y_right_sort_mat[1].length;ii++){
                all_point_sort_mat.push([right_x_mat[y_right_sort_mat[1][ii]], right_y_mat[y_right_sort_mat[1][ii]]])
            }
            console.log('端点行列排序', all_point_sort_mat) 
            // 对排序后的坐标点与初始线段进行比较计算
            let all_line_idx_mat = [] // 每条线的匹配标准索引
            for(let ii=0;ii<endpoint_mat.length;ii=ii+2){
                // 一条线段的起点终点值
                let point_start= endpoint_mat[ii]
                let point_end= endpoint_mat[ii+1]
                let point_start_idx = this.FindArrayIdx(point_start, all_point_sort_mat)
                let point_end_idx = this.FindArrayIdx(point_end, all_point_sort_mat)
                if(point_start_idx<point_end_idx){
                    all_line_idx_mat.push([point_start_idx, point_end_idx])
                }
                else{
                    all_line_idx_mat.push([point_end_idx, point_start_idx])
                }
            }
            console.log('排序后线条一次索引', all_line_idx_mat)
            all_line_idx_sort_mat = this.IdxSortMat(all_line_idx_mat)
            console.log('排序后线条一次索引排序', all_line_idx_sort_mat)
            for (let ii=0;ii<all_line_idx_sort_mat.length;ii++){
                half_idx_mat.push(all_line_idx_sort_mat[ii][1]-all_line_idx_sort_mat.length+1)
            }
        }
        else{
            console.log('横向分区', statics_x_mean_variance_2nd[1], statics_y_mean_variance_2nd[1])
            // 上下分区，再左右排序，找到对应点的标准顺序；按1次y均值/再索引
            let up_y_mat = []
            let up_x_mat = []
            let up_idx_mat = []
            let down_y_mat = []
            let down_x_mat = []
            let down_idx_mat = []
            let endpoint_y_mat_sort=this.ArraySortMat(endpoint_y_mat)
            for(let idx_ii=0;idx_ii<endpoint_y_mat.length;idx_ii++){
                if (idx_ii<endpoint_y_mat.length/2){
                    // up
                    up_y_mat.push(endpoint_y_mat[endpoint_y_mat_sort[1][idx_ii]])
                    up_x_mat.push(endpoint_x_mat[endpoint_y_mat_sort[1][idx_ii]])
                    up_idx_mat.push(endpoint_y_mat_sort[1][idx_ii])
                }
                else{
                    //down
                    down_y_mat.push(endpoint_y_mat[endpoint_y_mat_sort[1][idx_ii]])
                    down_x_mat.push(endpoint_x_mat[endpoint_y_mat_sort[1][idx_ii]])
                    down_idx_mat.push(endpoint_y_mat_sort[1][idx_ii])
                }
            }

            console.log('上:ycenter、x、y、idx', statics_y_mean_variance[0], up_x_mat, up_y_mat, up_idx_mat)
            console.log('下:ycenter、x、y、idx', statics_y_mean_variance[0], down_x_mat, down_y_mat, down_idx_mat)
            let x_up_sort_mat = this.ArraySortMat(up_x_mat)
            let x_down_sort_mat = this.ArraySortMat(down_x_mat)
            console.log("x上排序", x_up_sort_mat)
            console.log("x下排序", x_down_sort_mat)
            let all_point_sort_mat = []
            for (let ii=0;ii<x_up_sort_mat[1].length;ii++){
                all_point_sort_mat.push([up_x_mat[x_up_sort_mat[1][ii]], up_y_mat[x_up_sort_mat[1][ii]]])
            }
            for (let ii=0;ii<x_down_sort_mat[1].length;ii++){
                all_point_sort_mat.push([down_x_mat[x_down_sort_mat[1][ii]], down_y_mat[x_down_sort_mat[1][ii]]])
            }
            console.log('端点行列排序', all_point_sort_mat) 
            // 对排序后的坐标点与初始线段进行比较计算
            let all_line_idx_mat = [] // 每条线的匹配标准索引
            for(let ii=0;ii<endpoint_mat.length;ii=ii+2){
                // 一条线段的起点终点值
                let point_start= endpoint_mat[ii]
                let point_end= endpoint_mat[ii+1]
                let point_start_idx = this.FindArrayIdx(point_start, all_point_sort_mat)
                let point_end_idx = this.FindArrayIdx(point_end, all_point_sort_mat)
                if(point_start_idx<point_end_idx){
                    all_line_idx_mat.push([point_start_idx, point_end_idx])
                }
                else{
                    all_line_idx_mat.push([point_end_idx, point_start_idx])
                }
            }
            console.log('排序后线条一次索引', all_line_idx_mat)
            all_line_idx_sort_mat = this.IdxSortMat(all_line_idx_mat)
            console.log('排序后线条一次索引排序', all_line_idx_sort_mat)
            for (let ii=0;ii<all_line_idx_sort_mat.length;ii++){
                half_idx_mat.push(all_line_idx_sort_mat[ii][1]-all_line_idx_sort_mat.length+1)
            }
        }
        return half_idx_mat
    }

    LineConnectionMode9=(all_line_mat)=>{
        // 模式9上下模式：根据线条的上下关系
        return this.StandardUpDownConnection(all_line_mat)
        // return this.StandardLeftRightConnection(all_line_mat)
    }

    LineConnectionMode10=(all_line_mat)=>{
        // 模式10上下模式：根据线条的上下关系121;两边之和与中间相同
        let part_line_center_x=[],part_line_center_y=[]
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_region = this.partLineRegion(all_line_mat[ii])
            part_line_center_x.push((part_line_region[0]+part_line_region[1])/2)
            part_line_center_y.push((part_line_region[2]+part_line_region[3])/2)
        }
        console.log('线条中心', part_line_center_x, part_line_center_y)
        // 全局y中心
        let [all_y_center_mat, all_y_variance]= this.StdAndVariance(part_line_center_y)
        console.log('全局y中心', all_y_center_mat)
        // return this.StandardUpDownConnection(all_line_mat)
        // return this.StandardLeftRightConnection(all_line_mat)
        let up_line_mat = [], down_line_mat = []
        for(let ii=0;ii<part_line_center_y.length;ii++){
            if(part_line_center_y[ii]<all_y_center_mat){
                up_line_mat.push(all_line_mat[ii])
            }
            else{
                down_line_mat.push(all_line_mat[ii])
            }
        }
        let up_idx_sort_mat = this.StandardUpDownConnection(up_line_mat)
        let down_idx_sort_mat = this.StandardUpDownConnection(down_line_mat)
        console.log('上组排序', up_idx_sort_mat)
        console.log('下组排序', down_idx_sort_mat)
        let median_mat_x = [up_idx_sort_mat[6],down_idx_sort_mat[4]]
        let median_mat_x_flat = median_mat_x.flat()
        let sort_median_x = this.ArraySortMat(median_mat_x_flat)
        console.log('中间组数据及排序',median_mat_x_flat, sort_median_x[0],sort_median_x[1])
        let up_str_mat = []
        for(let ii=0;ii<sort_median_x[0].length;ii++){
            let judg_flag =-1
            for (let jj=0;jj<up_idx_sort_mat[6].length;jj++){
                if(sort_median_x[0][ii]==up_idx_sort_mat[6][jj]){
                    up_str_mat.push(up_idx_sort_mat[2][jj])
                    judg_flag=0
                    break;
                }
            }
            if(judg_flag==-1){
                up_str_mat.push('null')
            }

        }
        let down_str_mat = []
        for(let ii=0;ii<sort_median_x[0].length;ii++){
            let judg_flag =-1
            for (let jj=0;jj<down_idx_sort_mat[4].length;jj++){
                if(sort_median_x[0][ii]==down_idx_sort_mat[4][jj]){
                    down_str_mat.push(down_idx_sort_mat[0][jj])
                    judg_flag=0
                    break;
                }
            }
            if(judg_flag==-1){
                down_str_mat.push('null')
            }
        }
        console.log('上下组合排序', up_str_mat, down_str_mat)
        return [[up_str_mat, down_str_mat],[up_str_mat, '\n', down_str_mat]]
    }


    LineConnectionMode11=(all_line_mat)=>{
        // 模式11上下模式：根据线条的上下关系112;上两层与下层组合，缺少一层
        // 标准上下1对1处理：分两层
        let up_x_mat = [],up_y_mat = [],down_x_mat = [],down_y_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_region_mat = this.partLineRegion(all_line_mat[ii])
            if (part_region_mat[6]<part_region_mat[7]){
                // 起点y小于终点y，
                up_x_mat.push(part_region_mat[4])
                up_y_mat.push(part_region_mat[6])
                down_x_mat.push(part_region_mat[5])
                down_y_mat.push(part_region_mat[7])
            }
            else{
                up_x_mat.push(part_region_mat[5])
                up_y_mat.push(part_region_mat[7])
                down_x_mat.push(part_region_mat[4])
                down_y_mat.push(part_region_mat[6])
            }
        }
        console.log('上', up_x_mat,up_y_mat)
        console.log('下', down_x_mat,down_y_mat)
        let up_y_mean_mat = this.StdAndVariance(up_y_mat)
        console.log('上半部分y均值', up_y_mean_mat)
        // 上组再分区：需要再处理
        let up_x_half_mat1=[],up_x_half_mat2=[],up_y_half_mat1=[],up_y_half_mat2 = []
        for(let ii =0;ii<up_y_mat.length;ii++){
            if(up_y_mat[ii]<up_y_mean_mat[0]){
                up_x_half_mat1.push(up_x_mat[ii])
                up_y_half_mat1.push(up_y_mat[ii])
            }
            else{
                up_x_half_mat2.push(up_x_mat[ii])
                up_y_half_mat2.push(up_y_mat[ii])
            }
        }
        // 第一次链接排序
        let sort_up_x_half_mat1 = this.ArraySortMat(up_x_half_mat1)
        let sort_up_x_half_mat2 = this.ArraySortMat(up_x_half_mat2)
        let sort_down_x_mat = this.ArraySortMat(down_x_mat)
        let idx_mat1  = []
        for(let ii=0;ii<sort_up_x_half_mat1[1].length;ii++){
            let base_x = up_x_half_mat1[sort_up_x_half_mat1[1][ii]]
            let base_y = up_y_half_mat1[sort_up_x_half_mat1[1][ii]]
            for(let jj=0;jj<sort_down_x_mat[1].length;jj++){
                let down_up_x=up_x_mat[sort_down_x_mat[1][jj]]
                let down_up_y=up_y_mat[sort_down_x_mat[1][jj]]
                if(base_x==down_up_x && base_y==down_up_y){
                    idx_mat1.push(jj+1)  
                }
            }
        }
        for(let ii=0;ii<sort_up_x_half_mat2[1].length;ii++){
            let base_x = up_x_half_mat2[sort_up_x_half_mat2[1][ii]]
            let base_y = up_y_half_mat2[sort_up_x_half_mat2[1][ii]]
            for(let jj=0;jj<sort_down_x_mat[1].length;jj++){
                let down_up_x=up_x_mat[sort_down_x_mat[1][jj]]
                let down_up_y=up_y_mat[sort_down_x_mat[1][jj]]
                if(base_x==down_up_x && base_y==down_up_y){
                    idx_mat1.push(jj+1)  
                }
            }
        }
        // 根据上组分区长度设定基准长度
        console.log('排序', sort_up_x_half_mat1, sort_up_x_half_mat2)
        if(up_x_half_mat1.length==up_x_half_mat2.length+1){
            // 只判定相差1，在第二组中添加null
            if(sort_up_x_half_mat1[0][1]<sort_up_x_half_mat2[0][0]){
                console.log('前', parseInt(idx_mat1.length/2))
                idx_mat1.splice(parseInt(idx_mat1.length/2)+1,0,'null')
            }
            else if(sort_up_x_half_mat1[0][2]>sort_up_x_half_mat2[0][1]){
                console.log('后', idx_mat1.length-1)
                idx_mat1.push('null')
            }
            else{
                console.log('倒数第二个', idx_mat1.length-2)
                idx_mat1.splice(idx_mat1.length-1,0,'null')
            }
        }
        else if(up_x_half_mat1.length+1==up_x_half_mat2.length){
            // 只判定相差1，在第一组中添加null
            if(sort_up_x_half_mat1[0][0]>sort_up_x_half_mat2[0][0]){
                console.log('上前')
                idx_mat1.splice(0,0,'null')
            }
            else if(sort_up_x_half_mat1[0][1]<sort_up_x_half_mat2[0][1]){
                console.log('上后', idx_mat1.length-1)
                idx_mat1.splice(parseInt(idx_mat1.length/2),0,'null')
            }
            else{
                console.log('上中', idx_mat1.length-2)
                idx_mat1.splice(1,0,'null')
            }
        }
        else{
            // 组数相等考虑直接排序，通常不会出现上下同时缺少一组连线，有则特殊处理

        }
        // 分析下组x间隔均值
        let down_gap_mean = 0
        let gap_mat =[]
        for(let ii=1;ii<sort_down_x_mat[0].length;ii++){
            down_gap_mean = (down_gap_mean*(ii-1)+(sort_down_x_mat[0][ii]-sort_down_x_mat[0][ii-1]))/ii
            gap_mat.push(sort_down_x_mat[0][ii]-sort_down_x_mat[0][ii-1])
        }
        console.log('下组数据分析', sort_down_x_mat[0], down_gap_mean, gap_mat)
        // 间隔排序：
        let sort_gap_mat = this.ArraySortMat(gap_mat)
        let sort_gap_median = sort_gap_mat[0][1]
        let flag=0
        let add_idx = -1
        for(let ii=0;ii<gap_mat.length;ii++){
            if(gap_mat[ii]>sort_gap_median*1.7){
                // 中间添加
                flag = 1
                add_idx = ii
            }
        }
        let sort_up_x_mat = this.ArraySortMat(up_x_mat)

        if(flag>0){
            // 中间添加
            for(let ii=0;ii<idx_mat1.length;ii++){
                if(idx_mat1[ii]>add_idx+1){
                    idx_mat1[ii] = idx_mat1[ii]+1
                }
            }
        }
        else{
            if(sort_down_x_mat[0][sort_down_x_mat[0].length-1]>sort_up_x_mat[0][sort_up_x_mat[0].length-1]){
                // 最前插
                for(let ii=0;ii<idx_mat1.length;ii++){
                    if(idx_mat1[ii]>0){
                        idx_mat1[ii] = idx_mat1[ii]+1
                    }
                }
            }
        }
        return [idx_mat1]
    }

    LineConnectionMode12 = (all_line_data,base_loc_data_str)=>{
        // 基础坐标点顺序处理
        let base_loc_data_mat = this.BaseLocDataProcess(base_loc_data_str)
        console.log('基础坐标点数据处理', base_loc_data_mat[0],base_loc_data_mat[1])
        // 处理数据手写数据端点
        let hand_line_endpoint_mat = this.EndPointProcess(all_line_data)
        // let hand_line_endpoint_mat = base_loc_data_mat
        console.log('手写数据端点', hand_line_endpoint_mat)
        // 计算基础数据点的相邻两点编码
        let [base_loc_code,base_loc_angle] = this.LocMatCodeProcess(base_loc_data_mat[0])
        console.log('基础坐标数据连续编码', base_loc_code, base_loc_angle)
        let hand_y_data = hand_line_endpoint_mat[0][1]
        let hand_y_sort_mat = this.ArraySortMat(hand_y_data)
        console.log('手写y排序', hand_y_sort_mat)
        // 根据数据端点数生成组合索引序号
        this.GenerateIdxMat(hand_line_endpoint_mat[0][0].length)
        let arange_dis_mat = []
        let arange_code_mat = []
        let arange_angle_mat = []
        for(let ii=0;ii<idx_arange_mat.length;ii++){
            let part_idx_mat = idx_arange_mat[ii]
            let part_idx_line_endpoint_mat = this.LineEndpointProcess(part_idx_mat, hand_line_endpoint_mat[0], hand_y_sort_mat)
            // console.log('part_idx_line_endpoint_mat',part_idx_line_endpoint_mat)
            let [part_code,part_angle] = this.LocMatCodeProcess(part_idx_line_endpoint_mat)
            arange_code_mat.push(part_code)
            // let part_dis_mat = this.minDistance16(base_loc_code, part_code)
            let part_dis_mat = [0,0]
            let part_angle_mat = this.minAngle360(base_loc_angle, part_angle)
            // console.log('part_dis_mat',part_dis_mat)
            arange_dis_mat.push(part_dis_mat[0])
            arange_angle_mat.push(part_angle_mat[0])
        }
        // console.log('arange_code_mat', arange_code_mat)
        // let sort_arange_dis = this.ArraySortMat(arange_dis_mat)
        // console.log('sort_arange_dis', sort_arange_dis)
        // let sort_arange_angle = this.ArraySortMat(arange_angle_mat)
        // console.log('sort_arange_angle', sort_arange_angle)
        let sort_arange_angle=this.LimitedArraySort(arange_angle_mat,5)
        for(let ii=0;ii<1;ii++){
            let min_angle_idx_arange = idx_arange_mat[sort_arange_angle[1][ii]]
            console.log('最近似索引', min_angle_idx_arange,arange_angle_mat[sort_arange_angle[1][ii]])
            // 排序坐标
            let line_idx_check_mat = [] // 索引
            let part_idx_arange_loc_x = []
            let part_idx_arange_loc_y = []
            for (let jj=0;jj<min_angle_idx_arange.length;jj++){
                let loc_idx = hand_y_sort_mat[1][min_angle_idx_arange[jj]]
                line_idx_check_mat.push(loc_idx)
                part_idx_arange_loc_x.push(hand_line_endpoint_mat[0][0][loc_idx])
                part_idx_arange_loc_y.push(hand_line_endpoint_mat[0][1][loc_idx])
            }
            console.log('hand_line_endpoint_mat[0]',hand_line_endpoint_mat[0][0],hand_line_endpoint_mat[0][1])
            console.log('part_idx_arange_loc_x',part_idx_arange_loc_x)
            console.log('part_idx_arange_loc_y',part_idx_arange_loc_y)
            //  找到对应线条索引
            let find_idx_mat = []
            let combine_idx_mat = []
            for (let jj=0;jj<part_idx_arange_loc_x.length;jj++){
                if(find_idx_mat.indexOf(jj)<0){
                    // 未使用jj，
                    find_idx_mat.push(jj)
                    let part_loc_x_1st = part_idx_arange_loc_x[jj]
                    let part_loc_y_1st = part_idx_arange_loc_y[jj]
                    for(let kk=0;kk<part_idx_arange_loc_y.length;kk++){
                        if (find_idx_mat.indexOf(kk)<0){
                            // find_idx_mat.push(kk)
                            let part_loc_x_2nd = part_idx_arange_loc_x[kk]
                            let part_loc_y_2nd = part_idx_arange_loc_y[kk]
                            for(let ll=0;ll<hand_line_endpoint_mat[0][0].length/2;ll++){
                                let test_loc_start_x = hand_line_endpoint_mat[0][0][ll*2]
                                let test_loc_start_y = hand_line_endpoint_mat[0][1][ll*2]
                                let test_loc_end_x = hand_line_endpoint_mat[0][0][ll*2+1]
                                let test_loc_end_y = hand_line_endpoint_mat[0][1][ll*2+1]
                                if(((part_loc_x_1st==test_loc_start_x && part_loc_y_1st==test_loc_start_y)&&
                                    (part_loc_x_2nd==test_loc_end_x && part_loc_y_2nd==test_loc_end_y))||
                                    ((part_loc_x_1st==test_loc_end_x && part_loc_y_1st==test_loc_end_y)&&
                                    (part_loc_x_2nd==test_loc_start_x && part_loc_y_2nd==test_loc_start_y))){
                                    find_idx_mat.push(kk)
                                    combine_idx_mat.push([jj+1,kk+1])
                                    break
                                }
                            }

                        }
                    }
                }
            }
            console.log('线条索引匹配',JSON.stringify(combine_idx_mat))
            console.log('线条索引',JSON.stringify(line_idx_check_mat),JSON.stringify([hand_y_sort_mat[1], min_angle_idx_arange]))
            return [combine_idx_mat, hand_y_sort_mat[1], min_angle_idx_arange]
        }
    }


    LineConnectionMode13 = (all_line_data,base_loc_data_str)=>{
        // 基础坐标点顺序处理
        let base_loc_data_mat = this.BaseLocDataProcess(base_loc_data_str)
        console.log('基础坐标点数据处理', base_loc_data_mat[0],base_loc_data_mat[1])
        // 处理数据手写数据端点
        let hand_line_endpoint_mat = this.EndPointProcess(all_line_data)
        // let hand_line_endpoint_mat = base_loc_data_mat
        console.log('手写数据端点', hand_line_endpoint_mat)
        // 计算基础数据点的相邻两点编码
        let [base_loc_code,base_loc_angle] = this.LocMatCodeProcess(base_loc_data_mat[0])
        console.log('基础坐标数据连续编码', base_loc_code, base_loc_angle)
        let hand_x_data = hand_line_endpoint_mat[0][0]
        let hand_x_sort_mat = this.ArraySortMat(hand_x_data)
        console.log('手写x排序', hand_x_sort_mat)
        // 根据数据端点数生成组合索引序号
        this.GenerateIdxMat(hand_line_endpoint_mat[0][0].length)
        let arange_dis_mat = []
        let arange_code_mat = []
        let arange_angle_mat = []
        for(let ii=0;ii<idx_arange_mat.length;ii++){
            let part_idx_mat = idx_arange_mat[ii]
            let part_idx_line_endpoint_mat = this.LineEndpointProcess(part_idx_mat, hand_line_endpoint_mat[0], hand_x_sort_mat)
            // console.log('part_idx_line_endpoint_mat',part_idx_line_endpoint_mat)
            let [part_code,part_angle] = this.LocMatCodeProcess(part_idx_line_endpoint_mat)
            arange_code_mat.push(part_code)
            // let part_dis_mat = this.minDistance16(base_loc_code, part_code)
            let part_dis_mat = [0,0]
            let part_angle_mat = this.minAngle360(base_loc_angle, part_angle)
            // console.log('part_dis_mat',part_dis_mat)
            arange_dis_mat.push(part_dis_mat[0])
            arange_angle_mat.push(part_angle_mat[0])
        }
        // console.log('arange_code_mat', arange_code_mat)
        // let sort_arange_dis = this.ArraySortMat(arange_dis_mat)
        // console.log('sort_arange_dis', sort_arange_dis)
        // let sort_arange_angle = this.ArraySortMat(arange_angle_mat)
        // console.log('sort_arange_angle', sort_arange_angle)
        let sort_arange_angle=this.LimitedArraySort(arange_angle_mat,5)
        for(let ii=0;ii<1;ii++){
            let min_angle_idx_arange = idx_arange_mat[sort_arange_angle[1][ii]]
            console.log('最近似索引', min_angle_idx_arange,arange_angle_mat[sort_arange_angle[1][ii]])
            // 排序坐标
            let line_idx_check_mat = [] // 索引
            let part_idx_arange_loc_x = []
            let part_idx_arange_loc_y = []
            for (let jj=0;jj<min_angle_idx_arange.length;jj++){
                let loc_idx = hand_x_sort_mat[1][min_angle_idx_arange[jj]]
                line_idx_check_mat.push(loc_idx)
                part_idx_arange_loc_x.push(hand_line_endpoint_mat[0][0][loc_idx])
                part_idx_arange_loc_y.push(hand_line_endpoint_mat[0][1][loc_idx])
            }
            console.log('hand_line_endpoint_mat[0]',hand_line_endpoint_mat[0][0],hand_line_endpoint_mat[0][1])
            console.log('part_idx_arange_loc_x',part_idx_arange_loc_x)
            console.log('part_idx_arange_loc_y',part_idx_arange_loc_y)
            //  找到对应线条索引
            let find_idx_mat = []
            let combine_idx_mat = []
            for (let jj=0;jj<part_idx_arange_loc_x.length;jj++){
                if(find_idx_mat.indexOf(jj)<0){
                    // 未使用jj，
                    find_idx_mat.push(jj)
                    let part_loc_x_1st = part_idx_arange_loc_x[jj]
                    let part_loc_y_1st = part_idx_arange_loc_y[jj]
                    for(let kk=0;kk<part_idx_arange_loc_y.length;kk++){
                        if (find_idx_mat.indexOf(kk)<0){
                            // find_idx_mat.push(kk)
                            let part_loc_x_2nd = part_idx_arange_loc_x[kk]
                            let part_loc_y_2nd = part_idx_arange_loc_y[kk]
                            for(let ll=0;ll<hand_line_endpoint_mat[0][0].length/2;ll++){
                                let test_loc_start_x = hand_line_endpoint_mat[0][0][ll*2]
                                let test_loc_start_y = hand_line_endpoint_mat[0][1][ll*2]
                                let test_loc_end_x = hand_line_endpoint_mat[0][0][ll*2+1]
                                let test_loc_end_y = hand_line_endpoint_mat[0][1][ll*2+1]
                                if(((part_loc_x_1st==test_loc_start_x && part_loc_y_1st==test_loc_start_y)&&
                                    (part_loc_x_2nd==test_loc_end_x && part_loc_y_2nd==test_loc_end_y))||
                                    ((part_loc_x_1st==test_loc_end_x && part_loc_y_1st==test_loc_end_y)&&
                                    (part_loc_x_2nd==test_loc_start_x && part_loc_y_2nd==test_loc_start_y))){
                                    find_idx_mat.push(kk)
                                    combine_idx_mat.push([jj+1,kk+1])
                                    break
                                }
                            }

                        }
                    }
                }
            }
            console.log('线条索引匹配',JSON.stringify(combine_idx_mat))
            console.log('线条索引',JSON.stringify(line_idx_check_mat),JSON.stringify([hand_x_sort_mat[1], min_angle_idx_arange]))
            return [combine_idx_mat, hand_x_sort_mat[1], min_angle_idx_arange]
        }
    }


    LineEndpointProcess=(part_idx_mat,test_point_mat,test_y_sort_mat)=>{
        let x_idx_loc_mat = []
        let y_idx_loc_mat = []
        for (let ii=0;ii<part_idx_mat.length;ii++){
            let part_x = test_point_mat[0][test_y_sort_mat[1][part_idx_mat[ii]]]
            let part_y = test_point_mat[1][test_y_sort_mat[1][part_idx_mat[ii]]]
            x_idx_loc_mat.push(part_x)
            y_idx_loc_mat.push(part_y)
        }
        return [x_idx_loc_mat, y_idx_loc_mat]
    }

    StandardUpDownConnection=(all_line_mat)=>{
        // 标准上下1对1
        let up_x_mat = [],up_y_mat = [],down_x_mat = [],down_y_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_region_mat = this.partLineRegion(all_line_mat[ii])
            if (part_region_mat[6]<part_region_mat[7]){
                // 起点y小于终点y，
                up_x_mat.push(part_region_mat[4])
                up_y_mat.push(part_region_mat[6])
                down_x_mat.push(part_region_mat[5])
                down_y_mat.push(part_region_mat[7])
            }
            else{
                up_x_mat.push(part_region_mat[5])
                up_y_mat.push(part_region_mat[7])
                down_x_mat.push(part_region_mat[4])
                down_y_mat.push(part_region_mat[6])
            }
        }
        // console.log('上', up_x_mat,up_y_mat)
        // console.log('下', down_x_mat,down_y_mat)
        let sort_up_x_mat = this.ArraySortMat(up_x_mat)
        let sort_down_x_mat = this.ArraySortMat(down_x_mat)
        // console.log('排序', sort_up_x_mat, sort_down_x_mat)
        let idx_mat_up = []
        let idx_mat_down = []
        for(let ii=0;ii<sort_up_x_mat[1].length;ii++){
            for(let jj=0;jj<sort_down_x_mat[1].length;jj++){
                if (sort_up_x_mat[1][ii]==sort_down_x_mat[1][jj]){
                    idx_mat_up.push(jj+1)
                }
            }
        }
        for(let ii=0;ii<sort_down_x_mat[1].length;ii++){
            for(let jj=0;jj<sort_up_x_mat[1].length;jj++){
                if (sort_down_x_mat[1][ii]==sort_up_x_mat[1][jj]){
                    idx_mat_down.push(jj+1)
                }
            }
        }
        // console.log('索引', idx_mat)
        return [idx_mat_up,'\n',idx_mat_down,'\n',sort_up_x_mat[0],'\n',sort_down_x_mat[0]]
    }

    StandardLeftRightConnection=(all_line_mat)=>{
        // 标准左右1对1
        let left_x_mat = [],left_y_mat = [],right_x_mat = [],right_y_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_region_mat = this.partLineRegion(all_line_mat[ii])
            if (part_region_mat[4]<part_region_mat[5]){
                // 起点x小于终点x，
                left_x_mat.push(part_region_mat[4])
                left_y_mat.push(part_region_mat[6])
                right_x_mat.push(part_region_mat[5])
                right_y_mat.push(part_region_mat[7])
            }
            else{
                left_x_mat.push(part_region_mat[5])
                left_y_mat.push(part_region_mat[7])
                right_x_mat.push(part_region_mat[4])
                right_y_mat.push(part_region_mat[6])
            }
        }
        // console.log('上', up_x_mat,up_y_mat)
        // console.log('下', down_x_mat,down_y_mat)
        let sort_left_y_mat = this.ArraySortMat(left_y_mat)
        let sort_right_y_mat = this.ArraySortMat(right_y_mat)
        // console.log('排序', sort_up_x_mat, sort_down_x_mat)
        let left_idx_mat = []
        let right_idx_mat = []
        for(let ii=0;ii<sort_left_y_mat[1].length;ii++){
            for(let jj=0;jj<sort_right_y_mat[1].length;jj++){
                if (sort_left_y_mat[1][ii]==sort_right_y_mat[1][jj]){
                    left_idx_mat.push(jj+1)
                }
            }
        }
        for(let ii=0;ii<sort_right_y_mat[1].length;ii++){
            for(let jj=0;jj<sort_left_y_mat[1].length;jj++){
                if (sort_right_y_mat[1][ii]==sort_left_y_mat[1][jj]){
                    right_idx_mat.push(jj+1)
                }
            }
        }
        // console.log('索引', idx_mat)
        return [left_idx_mat,'\n',right_idx_mat]
    }

    LocXSortMat=(loc_idx_mat)=>{
        let sort_loc_mat = this.ArraySortMat(loc_idx_mat[1])
        let sort_idx_mat = [[],[],[]]
        for(let ii=0;ii<sort_loc_mat[1].length;ii++){
            sort_idx_mat[0].push(loc_idx_mat[0][sort_loc_mat[1][ii]])
            sort_idx_mat[1].push(loc_idx_mat[1][sort_loc_mat[1][ii]])
            sort_idx_mat[2].push(loc_idx_mat[2][sort_loc_mat[1][ii]])
        }
        return sort_idx_mat
    }

    FindArrayIdx=(target_point,base_point_mat)=>{
        // 查找一个数组存在某个点的位置：该函数为从属关系的查找
        // console.log('查找点位', target_point,base_point_mat)
        let find_idx = -1
        for(let ii=0;ii<base_point_mat.length;ii++){
            if((target_point[0]==base_point_mat[ii][0])&&
                (target_point[1]==base_point_mat[ii][1])){
                find_idx=ii
                break
            }
        }
        return find_idx
    }

    IdxSortMat=(all_line_idx_mat)=>{
        // 线条索引排序
        let line_idx_0 = []
        for (let ii=0;ii<all_line_idx_mat.length;ii++){
            line_idx_0.push(all_line_idx_mat[ii][0])
        }
        let line_idx_0_sort = this.ArraySortMat(line_idx_0)
        let all_line_idx_mat_sort = []
        for(let ii =0;ii<line_idx_0_sort[1].length;ii++){
            all_line_idx_mat_sort.push(all_line_idx_mat[line_idx_0_sort[1][ii]])
        }
        return all_line_idx_mat_sort
    }

    SingleCHNCharRecognition=(all_line_mat)=>{
        //单个中文字识别
        // let chn_stroke_str_mat = mathchndata.chn_stroke_str
        // console.log('笔画字母编码', chn_stroke_str_mat)
        // 单笔编码识别
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_strokes_mat = []
        for (let ii=0;ii<all_line_mat.length;ii++){
            // let part_line_data = all_line_mat[ii]
            // 单笔编码
            let part_line_num = this.ChnSingleStrokeProcess(mathchndata.chn_stroke_code, all_line_mat[ii])
            // console.log('单笔识别', part_line_num)   
            all_line_num_mat.push(part_line_num)
            all_line_str_mat.push(mathchndata.chn_stroke_str[part_line_num])
            all_line_strokes_mat.push(mathchndata.chn_stroke_judge_mat[part_line_num])
        }
        console.log('单笔编码001', all_line_str_mat, all_line_strokes_mat)
        // 与模板进行比较筛选，先预筛相邻笔画偏差一笔
        let len_bias = 1
        let filter_idx_mat_1st = []     // 只记录索引
        for (let ii=0;ii<mathchndata.chn_model_char_mat.length;ii++){
            // console.log(all_line_str_mat.length, mathchndata.chn_model_char_mat[ii][2][0].length)
            if(all_line_str_mat.length>=(mathchndata.chn_model_char_mat[ii][2][0].length-len_bias) && 
                all_line_str_mat.length<=(mathchndata.chn_model_char_mat[ii][2][0].length+len_bias)){
                    // console.log(mathchndata.chn_model_char_mat[ii][2][0].length)
                    filter_idx_mat_1st.push([ii, mathchndata.chn_model_char_mat[ii][1], mathchndata.chn_model_char_mat[ii][0]])
            }
        }
        console.log('1次筛选', filter_idx_mat_1st)
        // 根据1次筛选的相近笔画数进行2次确认；利用模糊匹配笔画，增加容错性
        let filter_idx_mat_2nd = []
        for (let ii=0;ii<filter_idx_mat_1st.length;ii++){
            // 从筛选出的汉字中筛选，一个汉字可能包含多种书写方式
            let part_model_char_mat = mathchndata.chn_model_char_mat[filter_idx_mat_1st[ii][0]]
            for (let jj=2;jj<part_model_char_mat.length;jj++){
                let part_model_char_mode = part_model_char_mat[jj]
                // console.log('part_model_char_mode',filter_idx_mat_1st[ii][0], part_model_char_mat[1], jj, part_model_char_mode[0])
                // 相同笔画/模糊笔画比较
                let common_strokes_mat = this.CompareStrokesFuzzyMat(part_model_char_mode[0],all_line_str_mat, mathchndata.chn_fuzzy_strokes_mat)
                if((common_strokes_mat.length>=part_model_char_mode[0].length*0.85)&&
                    (common_strokes_mat.length>=all_line_str_mat.length*0.85)){
                    filter_idx_mat_2nd.push(filter_idx_mat_1st[ii])
                    break
                }
            }
        }
        console.log('2次筛选', filter_idx_mat_2nd)
        // 根据二次筛选得到相同或相似的笔画，判定长度，进行第三次筛选，
        let test_relation_mat = this.AllLineRelationMat(all_line_mat)
        console.log('测试笔画数据相交情况', test_relation_mat)
        let test_statics_mat = this.StatisticsRelationMat(test_relation_mat)
        console.log('测试笔画数据相交情况统计', test_statics_mat)
        let filter_idx_mat_3rd = []
        for (let ii=0;ii<filter_idx_mat_2nd.length;ii++){
            // 从筛选出的汉字中筛选，一个汉字可能包含多种书写方式
            let part_model_char_mat = mathchndata.chn_model_char_mat[filter_idx_mat_2nd[ii][0]]
            for (let jj=2;jj<part_model_char_mat.length;jj++){
                let part_model_char_mode = part_model_char_mat[jj]
                // console.log('part_model_char_mode',filter_idx_mat_1st[ii][0], part_model_char_mat[1], jj, part_model_char_mode[0])
                // 统计模型的相离/相切/相交情况
                let model_statics_mat = this.StatisticsRelationMat(part_model_char_mode[2])
                console.log('统计模型相交情况', model_statics_mat)
                // if(model_statics_mat[2]>=(test_statics_mat[2]-2)){
                if(1==1){
                    filter_idx_mat_3rd.push(filter_idx_mat_2nd[ii])
                    break
                }
            }
        }
        console.log('3次筛选', filter_idx_mat_3rd)
        // 根据3次筛选将数据转换到500*500;依次计算对应端点的距离
        let normal_endpoint_mat = this.NormalSizeChnMat(all_line_mat,500)
        console.log('标准端点', normal_endpoint_mat)
        let all_min_dis_mat=[]
        for(let ii=0;ii<filter_idx_mat_3rd.length;ii++){
            // 从筛选出的汉字中筛选，一个汉字可能包含多种书写方式
            let part_model_char_mat = mathchndata.chn_model_char_mat[filter_idx_mat_3rd[ii][0]]
            let part_model_dis_mat = []
            // console.log('全', part_model_char_mat)
            for (let jj=2;jj<part_model_char_mat.length;jj++){
                let part_model_char_mode = part_model_char_mat[jj]
                // console.log('写法jj', jj, part_model_char_mode)
                // 计算两组端点距离，并要求对比笔画编码
                // console.log('模型数据', part_model_char_mat[1], part_model_char_mode[0], part_model_char_mode[4][0])
                // console.log('测试数据', all_line_str_mat, normal_endpoint_mat[0])
                // 判断两个字的坐标点
                let part_min_dis = this.JudgeTwoCharMat(part_model_char_mode[0], part_model_char_mode[4][0],all_line_str_mat, normal_endpoint_mat[0], mathchndata.chn_fuzzy_strokes_mat)
                part_model_dis_mat.push(part_min_dis)
                // console.log('单个', part_model_dis_mat, part_min_dis)
            }
            let part_model_dis_mat_sort = this.ArraySortMat(part_model_dis_mat)
            all_min_dis_mat.push(part_model_dis_mat_sort[0][0])
        }
        console.log('全局', all_min_dis_mat)
        let all_min_dis_mat_sort=this.ArraySortMat(all_min_dis_mat)
        let filter_idx_mat_4th = filter_idx_mat_3rd[all_min_dis_mat_sort[1][0]]
        // return [all_line_str_mat, '\n', filter_idx_mat_2nd, '\n', filter_idx_mat_3rd,'\n', filter_idx_mat_4th]
        console.log('读取', filter_idx_mat_4th)
        // console.log('读取1', filter_idx_mat_4th[2])
        if (all_min_dis_mat.length>0){
            console.log('FindChnCharStr', this.FindChnCharStr(filter_idx_mat_4th[2]))
            // console.log(filter_idx_mat_4th.push(this.FindChnCharStr(filter_idx_mat_4th[2])))

            return [filter_idx_mat_4th, this.FindChnCharStr(filter_idx_mat_4th[2])].flat()
        }
        else{
            return [-1, '', '','']
        }
    }

    MultiCHNCharRecognition=(all_line_mat)=>{
        // 多字识别——只考虑单行数据
        // 获得有效区域、统计行列值、归零位/单笔连续插值
        let region_data_mat = this.AllRegionAndPartRegion(all_line_mat)
        console.log('区域统计', region_data_mat)
        // 统计x\y值
        let statistics_xy_data  = this.StatisticsXYMat(all_line_mat,region_data_mat[1],0)
        console.log('xy统计信息', statistics_xy_data)
        // x分区
        let base_height=region_data_mat[1][3]-region_data_mat[1][2]+1
        let sub_region_data_x = this.SubZoneXMat(statistics_xy_data[0],base_height)
        console.log('x分区数据点', sub_region_data_x)
        // 索引分离
        let sub_idx_mat = this.SubIdxXMat(region_data_mat,sub_region_data_x)
        let sub_line_data_mat = this.SubLineXMat(all_line_mat,sub_idx_mat)
        let sub_chn_mat=[]
        for(let ii=0;ii<sub_line_data_mat.length;ii++){
            let part_sub_line_data = sub_line_data_mat[ii]
            let part_sub_chn = this.SingleCHNCharRecognition(part_sub_line_data)
            console.log('单字识别', part_sub_chn)
            if (part_sub_chn.length>=2){
                sub_chn_mat.push(part_sub_chn[3])
            }
            
        }
        console.log('多字识别', sub_chn_mat)
        return sub_chn_mat
    }

    MixedCharRecognition=(all_line_mat0)=>{
        // 混合识别识别——只考虑单行数据
        // 获得有效区域、统计行列值、归零位/单笔连续插值
        let all_line_mat = this.CutAllLineHeadMat(all_line_mat0)
        let region_data_mat = this.AllRegionAndPartRegion(all_line_mat)
        console.log('区域统计', region_data_mat)
        let statistics_xy_idx_data = this.StatisticsIdxXYMat(region_data_mat[0],region_data_mat[1],2)
        console.log('统计索引', JSON.stringify(statistics_xy_idx_data))
        // 统计分组索引
        let combine_idx_mat = this.CombineIdxMat(statistics_xy_idx_data[0])
        // 分析1次组合后的数字或汉字表记
        let combine_flag_mat = this.MixedFlagCombineMat(all_line_mat, combine_idx_mat)
        console.log('idx分组', JSON.stringify(combine_idx_mat))
        console.log('组合标记', JSON.stringify(combine_flag_mat))
        // 二次组合
        let combine_idx_mat_2nd = []
        let combine_flag_mat_2nd = []
        combine_idx_mat_2nd.push(combine_idx_mat)
        combine_flag_mat_2nd.push(combine_flag_mat)
        let combine_char_flg=1
        let idx_2nd = 0
        let caculate_flag = 0
        while(combine_char_flg>0 && combine_idx_mat_2nd[idx_2nd].length>1){
            console.log('组合while',idx_2nd, caculate_flag, JSON.stringify(combine_idx_mat_2nd), JSON.stringify(combine_flag_mat_2nd))
            let part_combine_idx_mat=[]
            let part_combine_flag_mat=[]
            combine_char_flg=1
            let sub_ii
            console.log('局部', JSON.stringify(part_combine_idx_mat), JSON.stringify(part_combine_flag_mat))
            for(let ii=0;ii<combine_idx_mat_2nd[idx_2nd].length;ii++){
                console.log('ii',ii,combine_idx_mat_2nd[idx_2nd].length)
                if (combine_flag_mat_2nd[idx_2nd][ii].length==1 &&
                    combine_flag_mat_2nd[idx_2nd][ii][0]==0){
                    // 纯数字，直接存储
                    console.log('数字ii',ii,combine_idx_mat_2nd[idx_2nd].length)
                    part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                    part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                }
                else if (ii<combine_idx_mat_2nd[idx_2nd].length-1){
                    console.log('组合测试ii',ii,combine_idx_mat_2nd[idx_2nd].length)
                    if((combine_flag_mat_2nd[idx_2nd][ii].length==1 && combine_flag_mat_2nd[idx_2nd][ii][0]==1)&&
                        (combine_flag_mat_2nd[idx_2nd][ii+1].length==1 && combine_flag_mat_2nd[idx_2nd][ii+1][0]==1)){
                        // 两个纯汉字的组合
                        let part_chn_idx_mat_idx= [combine_idx_mat_2nd[idx_2nd][ii][0],combine_idx_mat_2nd[idx_2nd][ii+1][0]]
                        let part_chn_idx_mat_locx= [combine_idx_mat_2nd[idx_2nd][ii][1][0],combine_idx_mat_2nd[idx_2nd][ii+1][1][1]]
                        part_combine_idx_mat.push([part_chn_idx_mat_idx.flat(),part_chn_idx_mat_locx])
                        part_combine_flag_mat.push([1])
                        // combine_char_flg = 0
                        sub_ii = ii+1
                        break
                        }
                    else if((combine_idx_mat_2nd[idx_2nd][ii][0].length==1 && combine_flag_mat_2nd[idx_2nd][ii].length==2)&&
                            (combine_idx_mat_2nd[idx_2nd][ii+1][0].length==1 && combine_flag_mat_2nd[idx_2nd][ii+1].indexOf(1)>=0)){
                        // 混合情况：八/立刀旁:包含中文字符，组合
                        // 计算单笔数据
                        let part_math_rec_mat1 = this.MathSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii][0][0]]])
                        let part_chn_rec_mat1 = this.ChnSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii][0][0]]])
                        let part_math_rec_mat2 = this.MathSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii+1][0][0]]])
                        let part_chn_rec_mat2 = this.ChnSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii+1][0][0]]])
                        console.log('数学单笔识别2', JSON.stringify(part_math_rec_mat1), JSON.stringify(part_math_rec_mat2))
                        console.log('语文单笔识别2', JSON.stringify(part_chn_rec_mat1), JSON.stringify(part_chn_rec_mat2))
                        if((part_chn_rec_mat1[0][0]==2||part_chn_rec_mat1[0][0]==22)&&(part_chn_rec_mat2[0][0]==3||part_chn_rec_mat2[0][0]==4)){
                            // 八
                            part_combine_idx_mat.push([[combine_idx_mat_2nd[idx_2nd][ii][0][0], combine_idx_mat_2nd[idx_2nd][ii+1][0][0]],
                                                        [combine_idx_mat_2nd[idx_2nd][ii][1][0],combine_idx_mat_2nd[idx_2nd][ii+1][1][1]]])
                            part_combine_flag_mat.push([1])
                            sub_ii = ii+1
                            break
                        }
                        else if((part_chn_rec_mat1[0][0]==1||part_chn_rec_mat1[0][0]==2||part_chn_rec_mat1[0][0]==4||part_chn_rec_mat1[0][0]==22)&&
                                (part_chn_rec_mat2[0][0]==12||part_chn_rec_mat2[0][0]==13||part_chn_rec_mat2[0][0]==2)){
                            // 立刀旁 最后是单独的立刀转换为11
                            console.log('立刀')
                            part_combine_idx_mat.push([[combine_idx_mat_2nd[idx_2nd][ii][0][0], combine_idx_mat_2nd[idx_2nd][ii+1][0][0]],
                                                        [combine_idx_mat_2nd[idx_2nd][ii][1][0],combine_idx_mat_2nd[idx_2nd][ii+1][1][1]]])
                            part_combine_flag_mat.push([1])
                            sub_ii = ii+1
                            break
                        }
                        else{
                            //  只插入第一组数据
                            console.log('组合测试ii未找到立刀',ii,combine_idx_mat_2nd[idx_2nd].length)
                            part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                            part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                        }

                    }
                    else if((combine_idx_mat_2nd[idx_2nd][ii][0].length==1 && combine_flag_mat_2nd[idx_2nd][ii].length==2)&&
                            (combine_idx_mat_2nd[idx_2nd][ii+1][0].length>1 && combine_flag_mat_2nd[idx_2nd][ii+1].indexOf(1)>=0)){
                        // 混合情况：日组合
                        // 计算单笔数据
                        // console.log('日')
                        let part_math_rec_mat1 = this.MathSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii][0][0]]])
                        let part_chn_rec_mat1 = this.ChnSingleStrokeRecognitionMat([all_line_mat[combine_idx_mat_2nd[idx_2nd][ii][0][0]]])
                        let part_math_chn_line_mat = []
                        // console.log('part_math_chn_line_mat',combine_idx_mat_2nd[idx_2nd][ii+1][0].length)
                        for(let chn_ii=0;chn_ii<combine_idx_mat_2nd[idx_2nd][ii+1][0].length;chn_ii++){
                            // console.log('combine_idx_mat_2nd[idx_2nd][ii+1][0]',combine_idx_mat_2nd[idx_2nd][ii+1][0].length, chn_ii)
                            part_math_chn_line_mat.push(all_line_mat[combine_idx_mat_2nd[idx_2nd][ii+1][0][chn_ii]])
                            // console.log('part_math_chn_line_mat',part_math_chn_line_mat )

                        }
                        let part_math_rec_mat2 = this.MathSingleStrokeRecognitionMat(part_math_chn_line_mat)
                        let part_chn_rec_mat2 = this.ChnSingleStrokeRecognitionMat(part_math_chn_line_mat)
                        console.log('数学单笔识别2', JSON.stringify(part_math_rec_mat1), JSON.stringify(part_math_rec_mat2))
                        console.log('语文单笔识别2', JSON.stringify(part_chn_rec_mat1), JSON.stringify(part_chn_rec_mat2))
                        if((part_chn_rec_mat1[0][0]==1||part_chn_rec_mat1[0][0]==2||part_chn_rec_mat1[0][0]==22)&&
                                (part_math_rec_mat2[0].indexOf(7)>=0 && part_math_rec_mat2[0].indexOf(10)>=0 && 
                                part_math_rec_mat2[0].indexOf(1)<0 && part_math_rec_mat2[0].length==3)){
                            // 日 [7,10]
                            console.log('组合日----')
                            let part_chn_idx_mat_idx= [combine_idx_mat_2nd[idx_2nd][ii][0],combine_idx_mat_2nd[idx_2nd][ii+1][0]]
                            let part_chn_idx_mat_locx= [combine_idx_mat_2nd[idx_2nd][ii][1][0],combine_idx_mat_2nd[idx_2nd][ii+1][1][1]]
                            part_combine_idx_mat.push([part_chn_idx_mat_idx.flat(),part_chn_idx_mat_locx])
                            part_combine_flag_mat.push([1])
                            sub_ii = ii+1
                            break
                        }
                        else if((part_chn_rec_mat1[0][0]==1||part_chn_rec_mat1[0][0]==2||part_chn_rec_mat1[0][0]==22)&&
                            (part_math_rec_mat2[0].indexOf(7)>=0&&part_math_rec_mat2[0].indexOf(10)>=0 && part_math_rec_mat2[0].length==2)){
                            // 口 [7,10]
                            console.log('组合口')
                            let part_chn_idx_mat_idx= [combine_idx_mat_2nd[idx_2nd][ii][0],combine_idx_mat_2nd[idx_2nd][ii+1][0]]
                            let part_chn_idx_mat_locx= [combine_idx_mat_2nd[idx_2nd][ii][1][0],combine_idx_mat_2nd[idx_2nd][ii+1][1][1]]
                            part_combine_idx_mat.push([part_chn_idx_mat_idx.flat(),part_chn_idx_mat_locx])
                            part_combine_flag_mat.push([1])
                            sub_ii = ii+1
                            break
                        }
                        else{
                            //  只插入第一组数据
                            console.log('组合测试ii未找到日或口',ii,combine_idx_mat_2nd[idx_2nd].length)
                            part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                            part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                        }
                    }
                    else{
                        // 直接插值：
                        console.log('组合测试ii未找到ss',ii,combine_idx_mat_2nd[idx_2nd].length)
                        part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                        part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                    }    
                }
                else if(ii==combine_idx_mat_2nd[idx_2nd].length-1){
                    // 最后一组，直接存储
                    console.log('最后',ii,combine_idx_mat_2nd[idx_2nd].length)
                    part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                    part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                    combine_char_flg = 0
                    sub_ii=ii
                    break
                }
                // else{
                //     // 直接插值：
                //     part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                //     part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
                // }
            }
            console.log('sub_ii',sub_ii)
            console.log('局部', JSON.stringify(part_combine_idx_mat), JSON.stringify(part_combine_flag_mat))
            // 直接添加剩余数据
            for(let ii=sub_ii+1;ii<combine_idx_mat_2nd[idx_2nd].length;ii++){
                // 直接存储
                console
                part_combine_idx_mat.push(combine_idx_mat_2nd[idx_2nd][ii])
                part_combine_flag_mat.push(combine_flag_mat_2nd[idx_2nd][ii])
            }
            console.log('局部', JSON.stringify(part_combine_idx_mat), JSON.stringify(part_combine_flag_mat))
            combine_idx_mat_2nd.push(part_combine_idx_mat)
            combine_flag_mat_2nd.push(part_combine_flag_mat)
            idx_2nd +=1
            caculate_flag +=1 
            if(caculate_flag>10){
                combine_char_flg = 0
            } 
        }
        console.log('组合end',JSON.stringify(combine_idx_mat_2nd), JSON.stringify(combine_flag_mat_2nd))
        // 先分析简单的混合式子 2020-11-25
        // 修改计算混合识别 2020-11-27
        let combine_idx_mat_3rd = combine_idx_mat_2nd[combine_idx_mat_2nd.length-1]
        let combine_flag_mat_3rd = combine_flag_mat_2nd[combine_flag_mat_2nd.length-1]
        console.log('最后索引组合', combine_idx_mat_3rd, combine_flag_mat_3rd)
        let combine_str_mat = []
        let num_rec_mat = []
        let chn_rec_mat = []
        let num_chn_region_mat = []
        for(let ii=0;ii<combine_idx_mat_3rd.length;ii++){
            let part_combine_idx_mat = combine_idx_mat_3rd[ii]
            let part_combine_line_data = []
            console.log('part组合索引', part_combine_idx_mat)
            for(let jj=0;jj<part_combine_idx_mat[0].length;jj++){
                part_combine_line_data.push(all_line_mat[part_combine_idx_mat[0][jj]])
            }
            let part_combine_line_region_mat = this.AllRegionAndPartRegion(part_combine_line_data)
            // console.log('单组区域', part_combine_line_region_mat)
            num_chn_region_mat.push(part_combine_line_region_mat[1])
            //后期考虑添加1笔/2笔/3笔的方差比较：数字/汉字
            let chn_part_combine_str_mat = []
            let math_part_combine_str_mat = []
            if(combine_flag_mat_3rd[ii].length==2){
                // 数字汉字识别
                math_part_combine_str_mat = this.MathAllStrokesProcess(part_combine_line_data)
                // console.log('数字识别',part_combine_str_mat)
                let error_flag=0
                try {
                    console.log('数字识别结果01',math_part_combine_str_mat[1])
                }
                catch(exception){
                    error_flag = -1
                }
                if(error_flag==0){
                   combine_str_mat.push(math_part_combine_str_mat[1]) 
                   num_rec_mat.push(math_part_combine_str_mat[1])
                }
                else{
                    num_rec_mat.push('')
                }
                // 文字识别 :比较简答的一笔数据或两笔数据
                let error_flag2=0
                try {
                    chn_part_combine_str_mat = this.SingleCHNCharRecognition(part_combine_line_data)
                    console.log('汉字识别',chn_part_combine_str_mat)
                    console.log('汉字识别结果01',chn_part_combine_str_mat[1])
                }
                catch(exception){
                    error_flag2 = -1
                }
                if(error_flag2==0){
                    combine_str_mat.push(chn_part_combine_str_mat[1]) 
                    chn_rec_mat.push(chn_part_combine_str_mat[1])
                }
                else{
                    chn_rec_mat.push('')
                }
            }
            else if(combine_flag_mat_3rd[ii][0]==0){
                // 数字识别
                math_part_combine_str_mat = this.MathAllStrokesProcess(part_combine_line_data)
                // console.log('汉字识别',part_combine_str_mat)
                let error_flag=0
                try {
                    console.log('数字识别结果0',math_part_combine_str_mat[1])
                }
                catch(exception){
                    error_flag = -1
                }
                if(error_flag==0){
                   combine_str_mat.push(math_part_combine_str_mat[1]) 
                   num_rec_mat.push(math_part_combine_str_mat[1])
                }
                else{
                    num_rec_mat.push('')
                }
                chn_rec_mat.push('')
            }
            else if(combine_flag_mat_3rd[ii][0]==1){
                // 文字识别
                
                let error_flag=0
                try {
                    chn_part_combine_str_mat = this.MultiCHNCharRecognition(part_combine_line_data)
                    console.log('汉字识别111',chn_part_combine_str_mat)
                    console.log('汉字识别结果1',chn_part_combine_str_mat[0])
                }
                catch(exception){
                    error_flag = -1
                }
                if(error_flag==0){
                    // 可能包含多个汉字
                    let str_mat = ''
                    for(let chn_kk=0;chn_kk<chn_part_combine_str_mat.length;chn_kk++){
                        str_mat += chn_part_combine_str_mat[chn_kk]
                    }
                   combine_str_mat.push(str_mat) 
                   chn_rec_mat.push(str_mat)
                }
                else{
                    chn_rec_mat.push('')
                }
                num_rec_mat.push('')
            }
        }
        console.log('数字组', num_rec_mat, '\n汉字组',  chn_rec_mat,'\n区域',num_chn_region_mat)
        // 组合方式根据实际题目要求更改
        let combine_math_chn_mat = []
        let combine_flag_mat002 = []
        for (let ii=0;ii<num_rec_mat.length;ii++){
            if (['+','-','x','/','*','X','÷','(',')','[',']','{','}','=','≈'].indexOf(num_rec_mat[ii])>-1){
                // 新增 2020-12-08：计算符号
                combine_math_chn_mat.push(num_rec_mat[ii])
                combine_flag_mat002.push(2)
            }
            else if(num_rec_mat[ii].length>0 && chn_rec_mat[ii].length>0){
                combine_math_chn_mat.push(num_rec_mat[ii])
                combine_flag_mat002.push(0)
            }
            else if(num_rec_mat[ii].length>0 && chn_rec_mat[ii].length==0){
                combine_math_chn_mat.push(num_rec_mat[ii])
                combine_flag_mat002.push(0)
            }
            else if(num_rec_mat[ii].length==0 && chn_rec_mat[ii].length>0){
                combine_math_chn_mat.push(chn_rec_mat[ii])
                combine_flag_mat002.push(1)
            }
            else{
                combine_math_chn_mat.push('')
                combine_flag_mat002.push(-1)
            }
        }
        // 组合识别汉字和数字：存在多种方式，遇见数字-汉字切换组合方式/遇见汉字-数字
        console.log('一次组合标签', combine_math_chn_mat, combine_flag_mat002)
        let base_height_1st = 0
        for(let ii=0;ii<num_chn_region_mat.length;ii++){
            // 计算基准高度
            if((num_chn_region_mat[ii][3]-num_chn_region_mat[ii][2]+1)>base_height_1st){
                base_height_1st = num_chn_region_mat[ii][3]-num_chn_region_mat[ii][2]+1
            }
        }
        let change_flag=-2
        let part_combine_str = ''
        let combine_str_mat002 = []
        let num_chn_region_mat_2nd = []
        let part_region_mat_2nd = []
        for(let ii=0;ii<combine_flag_mat002.length;ii++){
            console.log('过程', change_flag, part_combine_str)
            if(ii==0){
                // 原基础上相加
                change_flag=combine_flag_mat002[ii]
                part_combine_str += combine_math_chn_mat[ii]
                part_region_mat_2nd.push(num_chn_region_mat[ii])
            }
            else if (combine_flag_mat002[ii]==change_flag && (num_chn_region_mat[ii][0]-num_chn_region_mat[ii-1][1])<base_height_1st*0.8){
                // 原基础上相加
                part_combine_str += combine_math_chn_mat[ii]
                part_region_mat_2nd.push(num_chn_region_mat[ii])
            }
            else{
                // 保存，更新组合字符串
                change_flag=combine_flag_mat002[ii]
                if(part_combine_str.length>0){
                    combine_str_mat002.push(part_combine_str)
                    console.log('组合区域2nd', part_region_mat_2nd)
                    let part_all_region_2nd = this.AllLineRegion(part_region_mat_2nd)
                    num_chn_region_mat_2nd.push(part_all_region_2nd)
                }
                part_combine_str = combine_math_chn_mat[ii]
                part_region_mat_2nd =[]
                part_region_mat_2nd.push(num_chn_region_mat[ii])
            }
            if(ii==combine_flag_mat002.length-1){
                // 最后一组，组合
                if(part_combine_str.length>0){
                    combine_str_mat002.push(part_combine_str)
                    console.log('组合区域2nd', part_region_mat_2nd)
                    let part_all_region_2nd = this.AllLineRegion(part_region_mat_2nd)
                    num_chn_region_mat_2nd.push(part_all_region_2nd)
                }
            }
        }
        console.log('组合字符串', combine_str_mat002)
        console.log('组合字符串区域', num_chn_region_mat_2nd)
        // return [JSON.stringify(num_rec_mat),'\n',JSON.stringify(chn_rec_mat), '\n',combine_math_chn_mat]
        // 二次重组汉字字符
        let combine_str_mat003 = this.ChnCharCombineMat(combine_str_mat002)
        // 组合区域
        let base_height_2nd = 0
        for(let ii=0;ii<num_chn_region_mat_2nd.length;ii++){
            // 计算基准高度
            if((num_chn_region_mat_2nd[ii][3]-num_chn_region_mat_2nd[ii][2]+1)>base_height_2nd){
                base_height_2nd = num_chn_region_mat_2nd[ii][3]-num_chn_region_mat_2nd[ii][2]+1
            }
        }
        console.log('基准高度', base_height_2nd)
        let combine_idx_2nd = []
        let part_combine_idx_height_2nd = []
        for(let ii=0;ii<num_chn_region_mat_2nd.length;ii++){
            if(ii==0){
                part_combine_idx_height_2nd.push(0)
            }
            else if((num_chn_region_mat_2nd[ii][0]-num_chn_region_mat_2nd[ii-1][1])<base_height_2nd){
                // 同组
                part_combine_idx_height_2nd.push(ii)
            }
            else{
                // 不同组
                combine_idx_2nd.push(part_combine_idx_height_2nd)
                part_combine_idx_height_2nd = []
                part_combine_idx_height_2nd.push(ii)
            }
            if(ii==num_chn_region_mat_2nd.length-1){
                combine_idx_2nd.push(part_combine_idx_height_2nd)
            }
            console.log('part_combine_idx_height_2nd', part_combine_idx_height_2nd)
            console.log('combine_idx_2nd', combine_idx_2nd)
        }
        console.log('索引组合', combine_idx_2nd)
        let combine_str_mat_004 = []
        let combine_str_mat_005 = []
        for(let ii =0;ii<combine_idx_2nd.length;ii++){
            let part_combine_idx_mat_000 = combine_idx_2nd[ii]
            let part_str_000 = ''
            for(let jj=0;jj<part_combine_idx_mat_000.length;jj++){
                part_str_000 +=combine_str_mat003[part_combine_idx_mat_000[jj]]
            }
            combine_str_mat_004.push(part_str_000)
            combine_str_mat_005.push(part_str_000)
            combine_str_mat_005.push('\n')
        }
        return [combine_str_mat003,combine_str_mat_004,combine_str_mat_005]
    }

    MixedFlagCombineMat = (all_line_mat, combine_idx_mat)=>{
        let combine_flag_mat=[]
        for(let ii=0;ii<combine_idx_mat.length;ii++){
            let part_combine_idx_mat = combine_idx_mat[ii]
            let part_combine_line_data = []
            // let part_combine_line_region = []
            for(let jj=0;jj<part_combine_idx_mat[0].length;jj++){
                part_combine_line_data.push(all_line_mat[part_combine_idx_mat[0][jj]])
                // part_combine_line_region.push(region_data_mat[0][part_combine_idx_mat[0][jj]])
            }
            let part_region_data_mat = this.AllRegionAndPartRegion(part_combine_line_data)
            console.log('part_区域统计', part_region_data_mat)
            //后期考虑添加1笔/2笔/3笔的方差比较：数字/汉字
            let part_combine_str_mat = []
            if(part_combine_idx_mat[0].length==1){
                // 一笔的混合识别：'1'和'|','-'和'一';分别调用数学和语文的单笔识别
                let part_math_rec_mat = this.MathSingleStrokeRecognitionMat(part_combine_line_data)
                let part_chn_rec_mat = this.ChnSingleStrokeRecognitionMat(part_combine_line_data)
                console.log('数学单笔识别001', JSON.stringify(part_math_rec_mat))
                console.log('语文单笔识别001', JSON.stringify(part_chn_rec_mat))
                if(part_math_rec_mat[0][0]==1 && (part_chn_rec_mat[0][0]==1||part_chn_rec_mat[0][0]==2||part_chn_rec_mat[0][0]==22)){
                    // 1和|
                    combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                }
                else if(part_math_rec_mat[0][0]==2 && (part_chn_rec_mat[0][0]==26||part_chn_rec_mat[0][0]==20)){
                    // 2和乙
                    combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                }
                else if(part_math_rec_mat[0][0]==10 && part_chn_rec_mat[0][0]==0){
                    // -和一
                    combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                }
                // else if([0,3,6,7,8,9].indexOf(part_math_rec_mat[0][0])>=0){
                //     // 数字
                //     combine_flag_mat.push([0])  //数字、汉字同时标记
                // }
                else if (part_math_rec_mat[0][0]==11 && (part_chn_rec_mat[0][0]==2||part_chn_rec_mat[0][0]==22)){
                    // /和丿
                    combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                }
                else if (part_math_rec_mat[0][0]==12 && (part_chn_rec_mat[0][0]==3||part_chn_rec_mat[0][0]==4)){
                    // \和捺
                    combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                }
                else if(part_chn_rec_mat[0][0]==12 || part_chn_rec_mat[0][0]==13){
                    // 立刀旁
                    combine_flag_mat.push([1])  //汉字同时标记
                }
                else{
                    // 其余单笔保存数字模式
                    combine_flag_mat.push([0])  //数字标记
                }     
            }
            else if(part_combine_idx_mat[0].length==2){
                // 两笔的混合识别：'='和'二','+'和'十';'45x'分别调用数学和语文的单笔识别
                let part_math_rec_mat = this.MathSingleStrokeRecognitionMat(part_combine_line_data)
                let part_chn_rec_mat = this.ChnSingleStrokeRecognitionMat(part_combine_line_data)
                console.log('数学单笔识别002', JSON.stringify(part_math_rec_mat))
                console.log('语文单笔识别002', JSON.stringify(part_chn_rec_mat))
                let math_str=this.MathAllStrokesProcess(part_combine_line_data)
                console.log('数学2笔识别', math_str[1])
                let chn_str =[,]
                let error_flag=0
                try {
                    this.SingleCHNCharRecognition(part_combine_line_data)
                }
                catch(exception){
                    error_flag = -1
                }
                if(error_flag==0){
                    chn_str = this.SingleCHNCharRecognition(part_combine_line_data)
                }
                // let chn_str = this.SingleCHNCharRecognition(part_combine_line_data)
                console.log('汉字2笔识别',chn_str)
                // 按照条件判定
                if(math_str[1]=='+'){
                    if(chn_str[1]=='十'){
                        combine_flag_mat.push([0, 1])  //数字、汉字同时标记
                    }
                    else{
                        combine_flag_mat.push([1]) 
                    }
                }
                else if(math_str[1]=='4'){
                    combine_flag_mat.push([0]) 
                }
                else if(math_str[1]=='5'){
                    combine_flag_mat.push([0]) 
                }
                else if(math_str[1]=='='){
                    combine_flag_mat.push([0,1]) 
                }
                else if(math_str[1]=='≈'){  
                    // 新增≈：2020-12-08
                    combine_flag_mat.push([0,1]) 
                }
                else if(math_str[1]=='x'){
                    // 可能再汉字里面有相似的写法：乄
                    combine_flag_mat.push([0]) 
                }
                else{
                    combine_flag_mat.push([1]) 
                }
            }
            else if(part_combine_idx_mat[0].length==3){
                // 三笔的混合识别：''÷''和'三',分别调用数学和语文的单笔识别
                let part_math_rec_mat = this.MathSingleStrokeRecognitionMat(part_combine_line_data)
                let part_chn_rec_mat = this.ChnSingleStrokeRecognitionMat(part_combine_line_data)
                console.log('数学单笔识别003', JSON.stringify(part_math_rec_mat))
                console.log('语文单笔识别003', JSON.stringify(part_chn_rec_mat))
                let str_sss=this.MathAllStrokesProcess(part_combine_line_data)
                console.log('数学3笔识别', str_sss)
                console.log('数学3笔识别', str_sss[1])
                let part_statistics_y_idx_data = this.StatisticsIdxXYMat(part_region_data_mat[0],part_region_data_mat[1],1)
                console.log('统计索引', part_statistics_y_idx_data)
                // 统计分组索引:重新排序后，与最初all_idx数据不同
                // 换种方式分组，以中心位置排序y方向
                // let part_combine_idx_mat = this.CombineIdxMat(part_statistics_y_idx_data[1])           
                let part_combine_idx_mat = this.CombineCenterYSortMat(part_region_data_mat[0])
                console.log('part_idx分组', part_combine_idx_mat)
                if(str_sss[1]=='÷'){
                    // 是除号的情况下：判断是汉字三还是符号
                    console.log('除号1')
                    console.log('part_combine_idx_mat',part_combine_idx_mat)
                    console.log('除号2')
                    let stroke_len1= part_region_data_mat[0][part_combine_idx_mat[0][0]][1]-part_region_data_mat[0][part_combine_idx_mat[0][0]][0]+1
                    let stroke_len2= part_region_data_mat[0][part_combine_idx_mat[1][0]][1]-part_region_data_mat[0][part_combine_idx_mat[1][0]][0]+1
                    let stroke_len3= part_region_data_mat[0][part_combine_idx_mat[2][0]][1]-part_region_data_mat[0][part_combine_idx_mat[2][0]][0]+1
                    let stroke_len1_y= part_region_data_mat[0][part_combine_idx_mat[0][0]][3]-part_region_data_mat[0][part_combine_idx_mat[0][0]][2]+1
                    let stroke_len2_y= part_region_data_mat[0][part_combine_idx_mat[1][0]][3]-part_region_data_mat[0][part_combine_idx_mat[1][0]][2]+1
                    let stroke_len3_y= part_region_data_mat[0][part_combine_idx_mat[2][0]][3]-part_region_data_mat[0][part_combine_idx_mat[2][0]][2]+1
                    // console.log('长度',part_region_data_mat, stroke_len1, stroke_len2, stroke_len3)
                    if(stroke_len2>stroke_len1*2 && stroke_len2>stroke_len3*2&&
                        stroke_len2>stroke_len1_y*2 && stroke_len2>stroke_len3_y*2){
                        combine_flag_mat.push([0])  //数字标记
                    }
                    else{
                        combine_flag_mat.push([1])  //汉字标记
                    }
                }
                else{
                    combine_flag_mat.push([1])  //汉字标记
                }
            }
            else{
                // 长度大于3，直接标定为汉字
                combine_flag_mat.push([1])
            }
        }
        return combine_flag_mat
    }

    CombineCenterYSortMat = (part_region_data_mat)=>{
        // 按照引用规则排序
        let y_center_mat= []
        for(let idx_y=0;idx_y<part_region_data_mat.length;idx_y++){
            y_center_mat.push((part_region_data_mat[idx_y][2]+part_region_data_mat[idx_y][3])/2)
        }
        let y_center_sort_mat = this.ArraySortMat(y_center_mat)
        let sort_y_mat = []
        for (let ii=0;ii<y_center_sort_mat[1].length;ii++){
            sort_y_mat.push([y_center_sort_mat[1][ii]])
        }
        return sort_y_mat
    }

    MathSingleStrokeRecognitionMat=(all_line_data)=>{
        // 全部单笔数据处理---单笔识别
        let all_line_num=[]
        let all_line_str=[]
        let all_line_idx=[]
        let all_line_dis=[]
        for (let ii=0;ii<all_line_data.length;ii++){
            let [part_line_num, part_line_dis]= this.MathSingleStrokeProcessMat(math_strokes_code, all_line_data[ii])
            all_line_num.push(part_line_num)
            all_line_str.push(math_char_judge_num[part_line_num])
            all_line_idx.push(ii)
            all_line_dis.push(part_line_dis)
        }
        // console.log('单笔识别', all_line_num, all_line_str)
        return [all_line_num, all_line_str,all_line_idx,all_line_dis]
    }

    ChnSingleStrokeRecognitionMat=(all_line_mat)=>{
        // 单笔编码识别
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_strokes_mat = []
        let all_line_dis_mat=[]
        for (let ii=0;ii<all_line_mat.length;ii++){
            // let part_line_data = all_line_mat[ii]
            // 单笔编码
            let [part_line_num, part_line_dis] = this.ChnSingleStrokeProcessMat(mathchndata.chn_stroke_code, all_line_mat[ii])
            // console.log('单笔识别', part_line_num)   
            all_line_num_mat.push(part_line_num)
            all_line_str_mat.push(mathchndata.chn_stroke_str[part_line_num])
            all_line_strokes_mat.push(mathchndata.chn_stroke_judge_mat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
        }
        // console.log('单笔编码', all_line_str_mat, all_line_strokes_mat)
        return [all_line_num_mat, all_line_str_mat, all_line_strokes_mat, all_line_dis_mat]
    }

    testaddfunc = ()=>{
        let num001 = 178
        let num002 = 73
        let answer_end = mathstrcaculate.formatNum(num001+num002,5)
        console.log('计算结果', num001, num002, answer_end)
        let num001_mat = num001.toString().split('')
        let num002_mat = num002.toString().split('')
        let answer_mat = answer_end.toString().split('')
        let num001_str = '0'+num001.toString()
        let num002_str = '0'+num002.toString()
        if (num001_str.length!=num002_str.length){
            while(num001_str.length>num002_str.length){
                num002_str ='0'+ num002_str
            }
            while(num001_str.length<num002_str.length){
                num001_str ='0'+ num001_str
            }
        }
        console.log('补齐字符串', num001_str,num002_str)
        let carry_on_mat=new Array(num001_str.length).fill(0)
        for(let ii=num001_str.length-1;ii>=0;ii--){
            console.log('对应数位相加', num001_str[ii]+'+'+num002_str[ii]+'+'+carry_on_mat[ii]+'=',
            mathstrcaculate.formatNum(parseInt(num001_str[ii])+parseInt(num002_str[ii])+carry_on_mat[ii],5))
            if (mathstrcaculate.formatNum(parseInt(num001_str[ii])+parseInt(num002_str[ii])+carry_on_mat[ii],5)>9){
                console.log('进位')
                carry_on_mat[ii-1]=1
            }
        }
        console.log('进位', carry_on_mat)
        console.log('全', num001_mat, num002_mat, carry_on_mat, answer_mat)
    }

    MathCompletionPartition = (all_line_mat)=>{
        // 数学单数字填空题分区：只行列分区，返回组合区域，及行列分组排序
        let [part_line_region_mat, all_region_mat] = this.AllRegionAndPartRegion(all_line_mat)
        console.log('笔画区域统计', part_line_region_mat, all_region_mat)
        let [statistics_x_mat_idx, statistics_y_mat_idx] = this.StatisticsIdxXYMat(part_line_region_mat, all_region_mat, 1)
        console.log('y统计索引', JSON.stringify(statistics_y_mat_idx))
        let [statistics_x_mat, statistics_y_mat] = this.StatisticsXYMat(all_line_mat, all_region_mat, 1)
        console.log('y统计', JSON.stringify(statistics_y_mat))
        // let new_set = new Set([[1,2,3,3],[3,4]].flat())
        // let new_array = Array.from(new_set)
        // console.log('new_set', new_set, typeof(new_set),new_set[0])
        // console.log('new_array', new_array, typeof(new_array),new_array[0])
        // 行分区统计
        let idx_flag = 0
        let part_idx_mat
        let line_start_loc = [],line_end_loc = []
        let null_start_loc = [],null_end_loc = []
        let all_y_partition_mat = []
        for (let ii=0;ii<statistics_y_mat_idx.length;ii++){
            console.log('statistics_y_mat_idx[ii].length',statistics_y_mat_idx[ii].length)
            if(idx_flag==0 && statistics_y_mat_idx[ii].length>0){
                // 出现索引
                line_start_loc.push(ii)
                idx_flag = 1
                part_idx_mat = statistics_y_mat_idx[ii]
                if (null_start_loc.length>0){
                    null_end_loc.push(ii-1)
                }
            }
            else if(idx_flag==1 && statistics_y_mat_idx[ii].length<1){
                // 出现空白区域
                null_start_loc.push(ii)
                line_end_loc.push(ii-1)
                idx_flag = 0
                all_y_partition_mat.push(part_idx_mat)
            }
            else if(idx_flag==1 && statistics_y_mat_idx[ii].length>0){
                // 统计索引
                let part_idx_mat_set = new Set([part_idx_mat,statistics_y_mat_idx[ii]].flat())
                part_idx_mat = Array.from(part_idx_mat_set)
            }
            if(ii==statistics_y_mat_idx.length-1){
                all_y_partition_mat.push(part_idx_mat)
                line_end_loc.push(ii)
            }
        }
        console.log('行分区', JSON.stringify(all_y_partition_mat), JSON.stringify([line_start_loc,line_end_loc]),JSON.stringify([null_start_loc, null_end_loc]))
        // 计算基准高度----该过程比较复杂，预先简单统计
        let base_height = 0
        let height_mat = []
        for(let ii=0;ii<line_start_loc.length;ii++){
            height_mat.push(line_end_loc[ii]-line_start_loc[ii])
            base_height =Math.round((base_height*ii+line_end_loc[ii]-line_start_loc[ii])/(ii+1)*100)/100
        }
        console.log('高度统计', JSON.stringify(height_mat), base_height)
        // 每行列分区
        // 行数据统计
        let all_combine_region_mat = []
        let all_combine_idx_mat = []
        let region_idx = -1
        for(let ii=0;ii<all_y_partition_mat.length;ii++){
            // 单行数据流统计
            let part_all_line_data = []
            let part_combine_idx_mat = []
            for(let jj=0;jj<all_y_partition_mat[ii].length;jj++){
                console.log('索引all_y_partition_mat[ii][jj]', all_y_partition_mat[ii][jj])
                part_all_line_data.push(all_line_mat[all_y_partition_mat[ii][jj]])
                // part_all_line_region_data.push(part_line_region_mat[all_y_partition_mat[ii][jj]])
            }
            let [part_all_line_region_data, part_all_region_mat] = this.AllRegionAndPartRegion(part_all_line_data)
            // 单行数据流处理
            // 统计x方向
            let [part_statistics_x_mat_idx, part_statistics_y_mat_idx] = this.StatisticsIdxXYMat(part_all_line_region_data, part_all_region_mat, 0)
            let [part_all_x_partition_mat,[part_line_start_loc,part_line_end_loc],[part_null_start_loc, part_null_end_loc]] = 
                                            this.BaseXDirectionPartition(part_statistics_x_mat_idx)
            // 根据行高进行行组合
            let part_idx_x_mat = []
            if(part_all_x_partition_mat.length<2){
                // 直接存储
                region_idx += 1
                part_idx_x_mat.push(part_all_x_partition_mat[0])
                all_combine_region_mat.push(part_all_region_mat)
                part_combine_idx_mat.push(region_idx)
            }
            else{
                // 根据高度判别组合
                let combine_part_idx_x_mat = []
                combine_part_idx_x_mat.push(part_all_x_partition_mat[0])
                for(let kk=0;kk<part_all_x_partition_mat.length-1;kk++){
                    if((part_null_end_loc[kk]-part_null_start_loc[kk]+1)>base_height*0.05){
                        // 大于高度分离
                        let combine_idx_flat_mat = this.deepClone(combine_part_idx_x_mat,[])
                        part_idx_x_mat.push(combine_idx_flat_mat.flat())
                        combine_part_idx_x_mat = []
                        combine_part_idx_x_mat.push(part_all_x_partition_mat[kk+1])
                    }
                    else{
                        // 组合索引
                        combine_part_idx_x_mat.push(part_all_x_partition_mat[kk+1])
                    }
                    if(kk==part_null_start_loc.length-1){
                        part_idx_x_mat.push(combine_part_idx_x_mat.flat())
                    }
                }
                console.log('索引组合', JSON.stringify(part_idx_x_mat))
                // 原始笔画组合
                for(let ll=0;ll<part_idx_x_mat.length;ll++){
                    let part_row_idx_mat = []
                    for(let mm=0;mm<part_idx_x_mat[ll].length;mm++){
                        part_row_idx_mat.push(all_y_partition_mat[ii][part_idx_x_mat[ll][mm]])
                    }
                    console.log('单组组合线条索引====', JSON.stringify(part_row_idx_mat))
                    let part_line_data_2nd = []
                    for(let nn=0;nn<part_row_idx_mat.length;nn++){
                        part_line_data_2nd.push(all_line_mat[part_row_idx_mat[nn]])
                    }
                    region_idx += 1
                    let [part_line_region_mat_2nd, all_region_mat_2nd] = this.AllRegionAndPartRegion(part_line_data_2nd)
                    all_combine_region_mat.push(all_region_mat_2nd)
                    part_combine_idx_mat.push(region_idx)
                }
            }
            all_combine_idx_mat.push(part_combine_idx_mat)
        }
        console.log('最终组合', JSON.stringify(all_combine_region_mat), JSON.stringify(all_combine_idx_mat))
        return [all_combine_region_mat, all_combine_idx_mat]
    }
}

export class EngProcessingFunc extends BasicProcessingFunc{
    // 英语专项处理
    SingleLetterStrokeOder=(all_line_mat0)=>{
        // 单字母标准顺序识别
        // 每笔编码数据和相应的位置关系:先判断是哪个字母,再根据需要判断是否正确
        let all_line_mat =  this.CutAllLineHeadMat(all_line_mat0)
        let error_flag=1
        try{
            this.SingleLetterJudge(all_line_mat)
        }
        catch(exception){
            error_flag=0
        }
        if(error_flag==0){
            // alert('书写错误')
            return ['']
        }
        else{
            console.log('数据处理-----')
            let single_letter_mat_1st = this.SingleLetterJudge(all_line_mat)
            // 标准顺序分析
            if (single_letter_mat_1st.length>0){
                let judge_flag_mat =this.EngLetterCharOrderJudge(all_line_mat, single_letter_mat_1st[0])
                // console.log('single_letter_mat_1st', JSON.stringify(single_letter_mat_1st))
                // console.log('judge_flag_mat', JSON.stringify(judge_flag_mat))
                if (judge_flag_mat[0]){
                    return [single_letter_mat_1st[0][0],1, judge_flag_mat[1],'\n',judge_flag_mat[2]]
                }
                else{
                    return [single_letter_mat_1st[0][0],0, judge_flag_mat[1],'\n',judge_flag_mat[2]]
                } 
            }
            else{
                // alert('书写错误')
                return ['']
            }
            
        }
        
    }

    EngLetterCharOrderJudge=(all_line_mat,part_letter_data)=>{
        // 单字母识别:无序
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_str = ''
        let all_line_strokes_mat = []
        let all_line_dis_mat=[]
        for(let ii=0;ii<all_line_mat.length;ii++){
            // console.log(this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii]))
            // 单笔编码
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            all_line_num_mat.push(part_line_num)
            if(part_line_num<10){
                all_line_str_mat.push('0'+part_line_num.toString())
                all_line_str += '0'+part_line_num.toString()
            }
            else{
                all_line_str_mat.push(part_line_num.toString())
                all_line_str += part_line_num.toString()
            }
            all_line_strokes_mat.push(EngOneMat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
        }
        // console.log('组合笔画识别', all_line_num_mat, all_line_str_mat, all_line_str, all_line_strokes_mat)
        // 计算各测试各笔画之间的位置关系
        let test_relation_mat = this.AllLineRelationMat(all_line_mat)
        // console.log('测试笔画数据相交情况', test_relation_mat)
        let test_statics_mat = this.StatisticsRelationMat(test_relation_mat)
        // console.log('测试笔画数据相交情况统计', test_statics_mat)
        // 将数据转换到500*500;依次计算对应端点的距离
        let normal_endpoint_mat = this.NormalSizeChnMat(all_line_mat,500)
        // console.log('标准端点', normal_endpoint_mat)

        let part_start_dis_mat = []
        let part_end_dis_mat = []
        let part_idx_start_sort_mat = []
        let part_idx_end_sort_mat = []
        for(let jj=2;jj<part_letter_data.length;jj++){
            let part_letter_str = part_letter_data[jj][0]
            let part_letter_str_mat = this.StrSplitMat(part_letter_str,2)
            let model_start_mat = part_letter_data[jj][4][0]
            let model_end_mat = part_letter_data[jj][4][1]
            let endpoints_start_mat = this.JudgeTwoCharSortMat(part_letter_str_mat, model_start_mat, all_line_str_mat, normal_endpoint_mat[0], eng_fuzzy_strokes_mat)
            let endpoints_end_mat = this.JudgeTwoCharSortMat(part_letter_str_mat, model_end_mat, all_line_str_mat, normal_endpoint_mat[1], eng_fuzzy_strokes_mat)
            console.log('笔画顺序端点分析', endpoints_start_mat, endpoints_end_mat)
            part_start_dis_mat.push(endpoints_start_mat[0])
            part_end_dis_mat.push(endpoints_end_mat[0])
            part_idx_start_sort_mat.push(endpoints_start_mat)
            part_idx_end_sort_mat.push(endpoints_end_mat)
        }
        let sort_part_start_dis_mat =this.ArraySortMat(part_start_dis_mat)
        let part_model_data = part_letter_data[sort_part_start_dis_mat[1][0]+2]
        console.log('part_model_data', part_model_data)
        let min_dis_idx_mat = part_idx_start_sort_mat[sort_part_start_dis_mat[1][0]]
        console.log('最小距离', min_dis_idx_mat)
        let idx_mat = []
        for (let ii=0;ii<min_dis_idx_mat[2].length;ii++){
            idx_mat.push(min_dis_idx_mat[2][ii][0])
        }
        console.log('索引', idx_mat)
        let judge_idx_sum =0
        let idx_mat_2nd = []
        for(let ii=0;ii<idx_mat.length;ii++){
            if(ii==idx_mat[ii]){
                judge_idx_sum +=1
            }
            idx_mat_2nd.push(idx_mat[ii]+1)
        }
        // 根据笔顺编号计算统计每笔的计算值
        let part_code_dis_mat=[]
        for(let ii=0;ii<all_line_mat.length;ii++){
            let part_line_code = this.PartLineCode(all_line_mat[ii], 26);
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            let part_line_num_str = ''
            if(part_line_num<10){
                part_line_num_str += '0'+part_line_num.toString()
            }
            else{
                part_line_num_str += part_line_num.toString()
            }
            let part_model_dis_mat = this.minDTWDistance16(part_line_code,part_model_data[1][idx_mat[ii]],1)
            console.log('对应线条编码', part_line_code, part_model_data[1][idx_mat[ii]], part_model_dis_mat)
            part_code_dis_mat.push([part_model_dis_mat, EngOneMat[part_line_num], part_line_num_str,'\n'])
        }
        if (judge_idx_sum==idx_mat.length){
            return [true, idx_mat_2nd,part_code_dis_mat]
        }
        else{
            return [false, idx_mat_2nd,part_code_dis_mat]
        }
    }

    SingleLetterJudge = (all_line_mat)=>{
        // 单字母识别:无序
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_str = ''
        let all_line_strokes_mat = []
        let all_line_dis_mat=[]
        for(let ii=0;ii<all_line_mat.length;ii++){
            // console.log(this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii]))
            // 单笔编码
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            console.log('原始字符', part_line_num, EngOneMat[part_line_num])
            if (part_line_num==21 || part_line_num==35){
                //  a和q的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('a和q统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 35
                }
                else{
                    part_line_num = 21
                }
            }
            all_line_num_mat.push(part_line_num)
            if(part_line_num<10){
                all_line_str_mat.push('0'+part_line_num.toString())
                all_line_str += '0'+part_line_num.toString()
            }
            else{
                all_line_str_mat.push(part_line_num.toString())
                all_line_str += part_line_num.toString()
            }
            all_line_strokes_mat.push(EngOneMat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
        }
        console.log('组合笔画识别', all_line_num_mat, all_line_str_mat, all_line_str, all_line_strokes_mat)
        // 计算各测试各笔画之间的位置关系
        let test_relation_mat = this.AllLineRelationMat(all_line_mat)
        console.log('测试笔画数据相交情况', test_relation_mat)
        let test_statics_mat = this.StatisticsRelationMat(test_relation_mat)
        console.log('测试笔画数据相交情况统计', test_statics_mat)
        // 将数据转换到500*500;依次计算对应端点的距离
        let normal_endpoint_mat = this.NormalSizeChnMat(all_line_mat,500)
        console.log('标准端点', normal_endpoint_mat)
        // 一次筛选相同笔画数
        let eng_recognition_mat_1st = []
        for(let ii=0;ii<standard_letter_mat.length;ii++){
            let part_letter_data = standard_letter_mat[ii]
            for(let jj=2;jj<part_letter_data.length;jj++){
                if(all_line_str.length==part_letter_data[jj][0].length){
                    // 相同笔画数筛选
                    eng_recognition_mat_1st.push(part_letter_data)
                    break
                }
            }
        }
        console.log('一次筛选', eng_recognition_mat_1st)
        // 二次筛选：具有相同的笔画数据：包含模糊
        let eng_recognition_mat_2nd = []
        for(let ii=0;ii<eng_recognition_mat_1st.length;ii++){
            // 
            let part_letter_data = eng_recognition_mat_1st[ii]
            for(let jj=2;jj<part_letter_data.length;jj++){
                let part_letter_str = part_letter_data[jj][0]
                let part_letter_str_mat = this.StrSplitMat(part_letter_str,2)
                // console.log('分离字符串', part_letter_str, part_letter_str_mat)
                // 模糊对比笔画
                let common_strokes_mat = this.CompareStrokesFuzzyMat(part_letter_str_mat, all_line_str_mat, eng_fuzzy_strokes_mat)
                // console.log('近似字符编号', common_strokes_mat)
                if(common_strokes_mat.length==all_line_str_mat.length){
                    eng_recognition_mat_2nd.push(part_letter_data)
                    break
                }
            }
        }
        // console.log('eng_recognition_mat_2nd', eng_recognition_mat_2nd)
        // console.log('eng_recognition_mat_2nd', eng_recognition_mat_2nd.length)
        for(let ii=0;ii<eng_recognition_mat_2nd.length;ii++){
            console.log('二次筛选', eng_recognition_mat_2nd[ii])
        }
        // 三次统计筛选
        let eng_recognition_mat_3rd = []
        if(eng_recognition_mat_2nd.length>0){
            let all_dis_mat = []
            for(let ii=0;ii<eng_recognition_mat_2nd.length;ii++){
                let part_letter_data = eng_recognition_mat_2nd[ii]
                let part_start_dis_mat = []
                let part_end_dis_mat = []
                for(let jj=2;jj<part_letter_data.length;jj++){
                    let part_letter_str = part_letter_data[jj][0]
                    let part_letter_str_mat = this.StrSplitMat(part_letter_str,2)
                    let model_start_mat = part_letter_data[jj][4][0]
                    let model_end_mat = part_letter_data[jj][4][1]
                    let endpoints_start_mat = this.JudgeTwoCharSortMat(part_letter_str_mat, model_start_mat, all_line_str_mat, normal_endpoint_mat[0], eng_fuzzy_strokes_mat)
                    let endpoints_end_mat = this.JudgeTwoCharSortMat(part_letter_str_mat, model_end_mat, all_line_str_mat, normal_endpoint_mat[1], eng_fuzzy_strokes_mat)
                    console.log('端点分析', endpoints_start_mat, endpoints_end_mat)
                    part_start_dis_mat.push(endpoints_start_mat[0])
                    part_end_dis_mat.push(endpoints_end_mat[0])
                }
                let sort_part_start_dis_mat =this.ArraySortMat(part_start_dis_mat)
                all_dis_mat.push(sort_part_start_dis_mat[0][0])
            }
            let sort_all_dis_mat = this.ArraySortMat(all_dis_mat)
            for(let ii=0;ii<sort_all_dis_mat[1].length;ii++){
                eng_recognition_mat_3rd.push(eng_recognition_mat_2nd[sort_all_dis_mat[1][ii]])
            }
            return eng_recognition_mat_3rd
        }
        else{
            return eng_recognition_mat_3rd
        }
    }

    DisorderSingleLetterJudge = (all_line_mat0)=>{
        // 单字母识别:无序
        let all_line_mat = this.CutAllLineHeadMat(all_line_mat0)
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_str = ''
        let all_line_strokes_mat = []
        let all_line_dis_mat=[]
        for(let ii=0;ii<all_line_mat.length;ii++){
            // console.log(this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii]))
            // 单笔编码
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            console.log('原始字符', part_line_num, EngOneMat[part_line_num])
            if (part_line_num==21 || part_line_num==35){
                //  a和q的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('a和q统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 35
                }
                else{
                    part_line_num = 21
                }
            }
            all_line_num_mat.push(part_line_num)
            if(part_line_num<10){
                all_line_str_mat.push('0'+part_line_num.toString())
                all_line_str += '0'+part_line_num.toString()
            }
            else{
                all_line_str_mat.push(part_line_num.toString())
                all_line_str += part_line_num.toString()
            }
            all_line_strokes_mat.push(EngOneMat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
        }
        console.log('组合笔画识别', all_line_num_mat, all_line_str_mat, all_line_str, all_line_strokes_mat)
        return [all_line_strokes_mat]
    }

    BaseEngSingleCharProcessMat=(char_str, all_line_mat0)=>{
        console.log('笔画处理start')
        let all_line_mat = this.CutAllLineHeadMat(all_line_mat0)
        let single_char_mat = this.BaseEngSingleCharProcess(all_line_mat)
        console.log('笔画处理end', JSON.stringify(single_char_mat))
        // 根据二次筛选得到相同或相似的笔画，判定长度，进行第三次筛选，
        let test_relation_mat = this.BaseAllLineRelationMat(all_line_mat)
        console.log('测试笔画数据相交情况', test_relation_mat)
        // 根据3次筛选将数据转换到500*500;依次计算对应端点的距离
        let normal_endpoint_mat = this.NormalSizeChnMat(all_line_mat,500)
        console.log('标准端点', normal_endpoint_mat)
        // console.log('单字标准结构处理1', JSON.stringify(single_char_mat),JSON.stringify(test_relation_mat),JSON.stringify(normal_endpoint_mat))
        console.log('单字标准结构处理2', JSON.stringify([single_char_mat[0],single_char_mat[1],test_relation_mat[0],test_relation_mat[1],normal_endpoint_mat]))


    }
    
    DisorderMultiLetterJudge = (all_line_mat0)=>{
        // 基础数据处理
  
        let all_line_mat = this.CutAllLineHeadMat(all_line_mat0)
        // 单笔区域
        let line_region_mat = [],line_x_center_mat = []
        for (let ii=0;ii<all_line_mat.length;ii++){
            let part_line_region_data = this.partLineRegion(all_line_mat[ii])
            let part_line_x_center = (part_line_region_data[0]+part_line_region_data[1])/2
            line_region_mat.push(part_line_region_data)
            line_x_center_mat.push(part_line_x_center)
        }
        console.log('单笔区域', line_region_mat)
        let [x_center_sort, x_index_sort] = this.ArraySortMat(line_x_center_mat)
        console.log('x中心排序x_index_sort', x_center_sort, x_index_sort)
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_str = ''
        let all_line_strokes_mat = []
        let all_line_dis_mat = []
        let rec_idx_mat = [], line_statistics_mat = [], new_sort_region_mat = []
        for(let jj=0;jj<x_index_sort.length;jj++){
            // console.log(this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii]))
            // 单笔编码
            let ii = x_index_sort[jj]
            new_sort_region_mat.push(line_region_mat[ii])
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            // console.log('原始字符1', part_line_num, EngOneMat[part_line_num])
            if ((line_region_mat[ii][1]-line_region_mat[ii][0])<6 && (line_region_mat[ii][3]-line_region_mat[ii][2])<6){
                part_line_num=29
            }
            console.log('原始字符2', part_line_num, EngOneMat[part_line_num])
            if (part_line_num==21 || part_line_num==35){
                //  a和q的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('a和q统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 35
                }
                else{
                    part_line_num = 21
                }
            }
            else if (part_line_num==12 || part_line_num==25){
                //  a和q的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),2)
                console.log('e和o统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                let statics_num_3 = 0
                for (let jj=0;jj<statics_x.length;jj++){
                    if(statics_x[jj]>=3){
                        statics_num_3 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.1&&statics_num_3>statics_x.length*0.6){
                    part_line_num = 25
                }
                else{
                    part_line_num = 12
                }
            }
            else if(part_line_num==28 || part_line_num==34){
                //  h和n的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('h和n统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 28
                }
                else{
                    part_line_num = 34
                }
            }
            else if(part_line_num==8){
                //  G和a的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('G/a统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.2){
                    part_line_num = 8
                }
                else{
                    part_line_num = 21
                }
            }
            else if(part_line_num==62){
                //  d和a的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('d/a统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]<=2){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 62
                }
                else{
                    part_line_num = 21
                }
            }
            all_line_num_mat.push(part_line_num)
            if(part_line_num<10){
                all_line_str_mat.push('0'+part_line_num.toString())
                all_line_str += '0'+part_line_num.toString()
            }
            else{
                all_line_str_mat.push(part_line_num.toString())
                all_line_str += part_line_num.toString()
            }
            all_line_strokes_mat.push(EngOneMat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
            // 识别序号
            rec_idx_mat.push(part_line_num+1)
            // 数据统计
            let part_line_data00 = this.DataToHeavy(all_line_mat[ii])
            // console.log('数据去重', part_line_data00)
            let part_line_data0 = this.matInterpolation(part_line_data00)
            // console.log('x轴插值',part_line_data0)
            let part_line_statistics = this.StatisticsPoints(part_line_data0)
            line_statistics_mat.push(part_line_statistics)
        }
        // console.log('组合笔画识别', all_line_num_mat, all_line_str_mat, all_line_str, all_line_strokes_mat)
        console.log('组合笔画识别rec_idx_mat,line_region_mat,x_index_sort,line_statistics_mat\n', rec_idx_mat,line_region_mat,x_index_sort,line_statistics_mat)
        // 修正i和j的点数据
        let remind_rec_idx_mat = this.RemindEngIdxNum(rec_idx_mat,new_sort_region_mat)
        console.log('修正remind_rec_idx_mat', remind_rec_idx_mat)
        let  [judg_all,judg_idx_mat]  = this.EngStrokeCombine(remind_rec_idx_mat,line_region_mat,x_index_sort,line_statistics_mat)
        console.log('1次组合judg_all,judg_idx_mat',  judg_all, judg_idx_mat)
        // 初步修正大小写
        let new_judg_all = this.RemindCapitalAndSmallLetter(judg_all,judg_idx_mat,new_sort_region_mat)
        let judg_char_mat = []
        let region_idx_mat = [] //计算组合和单笔的区域索引排序
        for (let ii=0;ii<judg_all.length;ii++){
            if (judg_all[ii].length>0){
                console.log('判定组合', judg_all[ii], EngRecognizeMat[judg_all[ii][0]],judg_idx_mat[ii])
                judg_char_mat.push(EngRecognizeMat[new_judg_all[ii][0]])
                region_idx_mat.push(judg_idx_mat[ii])
            }
            else{
                // for (let jj=0;jj<judg_idx_mat[ii].length;jj++){
                //     let onelinerec = engonechar[reco_one_mat[judg_idx_mat[ii][jj]]-1]
                //     console.log('单笔编码',reco_one_mat[judg_idx_mat[ii][jj]],onelinerec,judg_idx_mat[ii][jj])
                //     region_idx_mat.push([judg_idx_mat[ii][jj]])
                //     judg_char_mat.push(onelinerec)
                // }
            }
        }
        return judg_char_mat
    }

    RemindCapitalAndSmallLetter = (judg_all,judg_idx_mat,new_sort_region_mat)=>{
        // judg_all:可能组合,judg_idx_mat：排序后索引,new_sort_region_mat：排序后区域
        // 先统计组合区域高度宽度
        let all_combine_region_mat = []
        let all_combine_height_mat = []
        for(let ii=0;ii<judg_idx_mat.length;ii++){
            let part_combine_region_mat = []
            for(let jj=0;jj<judg_idx_mat[ii].length;jj++){
                part_combine_region_mat.push(new_sort_region_mat[judg_idx_mat[ii][jj]])
            }
            let part_all_region_mat = this.AllLineRegion(part_combine_region_mat)
            all_combine_region_mat.push(part_all_region_mat)
            all_combine_height_mat.push(part_all_region_mat[3]-part_all_region_mat[2]+1)
        }
        let max_height = Math.max.apply(null,all_combine_height_mat)
        console.log('组合高度all_combine_height_mat/max_height',all_combine_height_mat, max_height)
        let new_judg_all = []
        for(let ii=0;ii<judg_all.length;ii++){
            if(judg_all[ii].length<2){
                new_judg_all.push(judg_all[ii])
            }
            else{
                // 分情况辨别大小写
                if(judg_all[ii].indexOf(14)>-1 || judg_all[ii].indexOf(40)>-1){
                    // 大小写O
                    if(all_combine_height_mat[ii]>max_height*0.8){
                        // 大写
                        new_judg_all.push([14]) 
                    }
                    else{
                        // 小写
                        new_judg_all.push([40]) 
                    }

                }
                else if(judg_all[ii].indexOf(2)>-1 || judg_all[ii].indexOf(28)>-1){
                    // 大小写O
                    if(all_combine_height_mat[ii]>max_height*0.8){
                        // 大写
                        new_judg_all.push([2]) 
                    }
                    else{
                        // 小写
                        new_judg_all.push([28]) 
                    }

                }
                else{
                    new_judg_all.push(judg_all[ii])
                }
            }
        }
        return new_judg_all
    }

    RemindEngIdxNum=(rec_idx_mat,new_sort_region_mat)=>{
        // 修正数据
        if(rec_idx_mat.length<=1){
            return rec_idx_mat
        }
        else{
            for(let ii=0;ii<rec_idx_mat.length;ii++){
                if(rec_idx_mat[ii]==31 || rec_idx_mat[ii]==32 || rec_idx_mat[ii]==46){
                    // 小写i、j
                    if(ii==0){
                        // 比较后：是否x方向相交/上下关系
                        let common_area_ratio = this.TwoRegionRatio(new_sort_region_mat[ii],new_sort_region_mat[ii+1])
                        console.log('model:::1',common_area_ratio)
                        let center_y_ii_0 = (new_sort_region_mat[ii][2]+new_sort_region_mat[ii][3])/2
                        let center_y_ii_1 = (new_sort_region_mat[ii+1][2]+new_sort_region_mat[ii+1][3])/2
                        if(common_area_ratio[0]>0.2&&center_y_ii_1<new_sort_region_mat[ii][2]){
                            // &&(center_y_ii_0>center_y_ii_1)
                            rec_idx_mat[ii+1]=30
                            if(rec_idx_mat[ii]!=32){
                                rec_idx_mat[ii]=31
                            }
                        }
                        else if(common_area_ratio[0]>0.2&&center_y_ii_1>new_sort_region_mat[ii][2]){
                            // ?
                            rec_idx_mat[ii+1]=30
                            rec_idx_mat[ii]==46
                        }
                    }
                    else if (ii==rec_idx_mat.length-1){
                        // 比较前：是否x方向相交/上下关系
                        let common_area_ratio = this.TwoRegionRatio(new_sort_region_mat[ii-1],new_sort_region_mat[ii])
                        console.log('model:::2',common_area_ratio)
                        let center_y_ii_0 = (new_sort_region_mat[ii][2]+new_sort_region_mat[ii][3])/2
                        let center_y_ii_1 = (new_sort_region_mat[ii-1][2]+new_sort_region_mat[ii-1][3])/2
                        if(common_area_ratio[0]>0.2&&center_y_ii_1<new_sort_region_mat[ii][2]){
                            // && (center_y_ii_0>center_y_ii_1)
                            rec_idx_mat[ii-1]=30
                            if(rec_idx_mat[ii]!=32){
                                rec_idx_mat[ii]=31
                            }
                        }
                        else if(common_area_ratio[0]>0.2&&center_y_ii_1>new_sort_region_mat[ii][2]){
                            // ?
                            rec_idx_mat[ii-1]=30
                            rec_idx_mat[ii]==46
                        }
                    }
                    else{
                        // 比较前后：是否x方向相交/上下关系
                        let common_area_ratio_q = this.TwoRegionRatio(new_sort_region_mat[ii-1],new_sort_region_mat[ii])
                        let common_area_ratio_h = this.TwoRegionRatio(new_sort_region_mat[ii],new_sort_region_mat[ii+1])
                        console.log('model:::3',common_area_ratio_q,common_area_ratio_h)
                        let center_y_ii_0 = (new_sort_region_mat[ii][2]+new_sort_region_mat[ii][3])/2
                        let center_y_ii_1 = (new_sort_region_mat[ii-1][2]+new_sort_region_mat[ii-1][3])/2
                        let center_y_ii_2 = (new_sort_region_mat[ii+1][2]+new_sort_region_mat[ii+1][3])/2
                        if(common_area_ratio_q[0]>0.2&&center_y_ii_1<new_sort_region_mat[ii][2]){
                            // && center_y_ii_0>center_y_ii_1
                            rec_idx_mat[ii-1]=30
                            if(rec_idx_mat[ii]!=32){
                                rec_idx_mat[ii]=31
                            }
                        }
                        else if(common_area_ratio_q[0]>0.2&&center_y_ii_1>new_sort_region_mat[ii][2]){
                            // ?
                            rec_idx_mat[ii-1]=30
                            rec_idx_mat[ii]==46
                        }
                        else if(common_area_ratio_h[0]>0.2&&center_y_ii_2<new_sort_region_mat[ii][2]){
                            // && center_y_ii_0>center_y_ii_2
                            rec_idx_mat[ii+1]=30
                            if(rec_idx_mat[ii]!=32){
                                rec_idx_mat[ii]=31
                            }
                        }
                        else if(common_area_ratio_h[0]>0.2&&center_y_ii_2>new_sort_region_mat[ii][2]){
                            // ?
                            rec_idx_mat[ii+1]=30
                            rec_idx_mat[ii]==46
                        }


                    }
                }
                // else if(rec_idx_mat[ii]==46){
                //     // 问号
                // }
            }
            return rec_idx_mat
        } 
    }

    BaseEngSingleCharProcess=(all_line_mat)=>{
        // 英语每笔数据处理
        let all_line_num_mat = []
        let all_line_str_mat = []
        let all_line_str = ''
        let all_line_strokes_mat = []
        let all_line_dis_mat=[]
        let all_line_code_mat = []
        for(let ii=0;ii<all_line_mat.length;ii++){
            // console.log(this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii]))
            // 单笔编码
            let [part_line_num, part_line_dis] = this.SingleStrokeProcessMat(eng_stroke_code25_data, all_line_mat[ii])
            let part_line_code = this.PartLineCode(all_line_mat[ii], 26);
            all_line_code_mat.push(part_line_code)
            // console.log('单笔code', part_line_code)
            console.log('原始字符', part_line_num, EngOneMat[part_line_num])
            if (part_line_num==21 || part_line_num==35){
                //  a和q的比较
                let [statics_x, statics_y]=this.StatisticsXYMat([all_line_mat[ii]],this.partLineRegion(all_line_mat[ii]),1)
                console.log('a和q统计', [statics_x, statics_y])
                let statics_num_1 = 0
                for (let jj=0;jj<statics_y.length;jj++){
                    if(statics_y[jj]==1){
                        statics_num_1 +=1
                    }
                }
                if (statics_num_1>=statics_y.length*0.3){
                    part_line_num = 35
                }
                else{
                    part_line_num = 21
                }
            }
            all_line_num_mat.push(part_line_num)
            if(part_line_num<10){
                all_line_str_mat.push('0'+part_line_num.toString())
                all_line_str += '0'+part_line_num.toString()
            }
            else{
                all_line_str_mat.push(part_line_num.toString())
                all_line_str += part_line_num.toString()
            }
            all_line_strokes_mat.push(EngOneMat[part_line_num])
            all_line_dis_mat.push(part_line_dis)
        }
        console.log('组合笔画识别', all_line_num_mat, all_line_str_mat, all_line_str, all_line_strokes_mat)
        return [all_line_str,all_line_code_mat]
    }


    StrSplitMat=(part_str, split_num)=>{
        // 字符串每几个分组
        let part_str_mat =[]
        
        for(let ii=0;ii<part_str.length;ii+=split_num){
            let pp_str = ''
            for (let jj=0;jj<split_num;jj++){
                if((ii+jj)<part_str.length){
                   pp_str += part_str[ii+jj] 
                }
            }
            part_str_mat.push(pp_str)
        }
        return part_str_mat
    }
    


    EngStrokeCombine=(test_mat0,line_region_mat,x_index_sort,line_stat_mat)=>{
        // test_mat0:单笔识别索引+1,line_region_mat：单笔区域,x_index_sort：x方向排列,line_stat_mat：统计
        var basedata = EngBaseCombine
        // 排序后的全局组合，加入区域排序比较
        let test_mat = this.deepClone(test_mat0,[])
        test_mat.push(1000)
        let judg_all = []
        let judg_idx = []
        let judg_ii =[]
        let judg_idx_mat =[]
        // let judg_confirm_mat = []
        for (let ii=0;ii<test_mat.length;ii++){
            // console.log('匹配ii',ii)
            if ((ii==test_mat.length-1)&&(judg_idx.length<1)){
                // 判断到最后添加的哪一个
                break
            }
            var [confirm_mat, more_match_mat] = this.MoreLineMatch(basedata, test_mat[ii])
            // console.log('确认num',confirm_mat, '多笔多次匹配', more_match_mat)
            var status_flag = this.StatusJudge(confirm_mat, more_match_mat)
            // console.log('执行状态标签', status_flag)
            if (status_flag==1){
                console.log('status_flag==1', judg_idx, confirm_mat,'judg_ii', judg_ii)
                // 多个备选：
                // judg_confirm_mat.push(confirm_mat)
                if (confirm_mat.length==1){
                    if (confirm_mat[0]==26){
                        // 判断a和d
                        // let part_region = line_region_mat[x_index_sort[judg_ii[0]]]
                        // console.log('part_region_ad', part_region,x_index_sort[judg_ii[0]])
                        let y_stat = line_stat_mat[judg_ii[0]][1]
                        let stat_2 = 0
                        for (let si=0;si<y_stat.length/2;si++){
                            if (y_stat[si]<=2){
                                stat_2 +=1
                            }
                        }
                        console.log('a/d', y_stat, '统计小于2点', stat_2, stat_2/y_stat.length)
                        if (stat_2/y_stat.length>0.4){
                            // 判定为d
                            judg_all.push([29])
                        }
                        else{
                            judg_all.push([26])
                        }
                        
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                    else if (confirm_mat[0]==33){
                        // 判断a和d
                        // let part_region = line_region_mat[x_index_sort[judg_ii[0]]]
                        // console.log('part_region_ad', part_region,x_index_sort[judg_ii[0]])
                        let y_stat = line_stat_mat[judg_ii[0]][1]
                        let stat_2 = 0
                        for (let si=0;si<y_stat.length;si++){
                            if (y_stat[si]<=2){
                                stat_2 +=1
                            }
                        }
                        // console.log('a/d', y_stat, '统计小于2点', stat_2)
                        if (stat_2/y_stat.length>0.3){
                            // 判定为d
                            judg_all.push([33])
                        }
                        else{
                            judg_all.push([39])
                        }
                        
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                    else{
                        judg_all.push(confirm_mat)
    
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                }
                else if(confirm_mat.length==2){
                    if ((JSON.stringify(confirm_mat) == JSON.stringify([5,8]))||(JSON.stringify(confirm_mat) == JSON.stringify([8,5]))){
                        // F和I具有相同的
                        // 读取全局组合区域
                        let part_region_mat = []
                        for (let pp=0;pp<judg_ii.length;pp++){
                            part_region_mat.push(line_region_mat[x_index_sort[judg_ii[pp]]])
                        }
                        // console.log('组合区域mat', part_region_mat)
                        let combine_mat = this.RegionCombine(part_region_mat)
                        let all_region= this.AllLineRegion(part_region_mat)
                        // console.log('全部组合区域',combine_mat)
                        let judg_num = this.CompareRegion(all_region,combine_mat)
                        // 数据初始
                        judg_all.push([confirm_mat[judg_num]])
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                    else if ((JSON.stringify(confirm_mat) == JSON.stringify([7,0]))||(JSON.stringify(confirm_mat) == JSON.stringify([0,7]))){
                        // A和H具有相同的
                        // 读取全局组合区域
                        // console.log('判断H和A的相似笔画', judg_idx)
                        let part_region_mat = []
                        for (let pp=0;pp<judg_ii.length;pp++){
                            if(judg_idx[pp]==1||judg_idx[pp]==4){
                                part_region_mat.push(line_region_mat[x_index_sort[judg_ii[pp]]])
                            }
                        }
                        // console.log('组合区域mat', part_region_mat)
                        let gap_up=0
                        let gap_down=0
                        if (part_region_mat[0][1]<part_region_mat[1][1]){
                            gap_up = part_region_mat[1][0]-part_region_mat[0][1]
                            gap_down = part_region_mat[1][1]-part_region_mat[0][0]
                        }
                        else{
                            gap_up = part_region_mat[0][0]-part_region_mat[1][1]
                            gap_down = part_region_mat[0][1]-part_region_mat[1][0]
                        }
                        if (gap_down/gap_up>2){
                            // 取A
                            judg_all.push([0])
                        }
                        else{
                            // 取H
                            judg_all.push([7])
                        }
                        // let combine_mat = RegionCombine(part_region_mat)
                        // let all_region= AllLineRegion(part_region_mat)
                        // // console.log('全部组合区域',combine_mat)
                        // let judg_num = CompareRegion(all_region,combine_mat)
                        // 数据初始
                        // judg_all.push(confirm_mat)
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                    else if ((JSON.stringify(confirm_mat) == JSON.stringify([3,15]))||(JSON.stringify(confirm_mat) == JSON.stringify([15,3]))){
                        // D和P具有相同的
                        // 读取全局组合区域
                        console.log('判断D和P的相似笔画', judg_idx)
                        let part_region_mat = []
                        for (let pp=0;pp<judg_ii.length;pp++){
                            part_region_mat.push(line_region_mat[x_index_sort[judg_ii[pp]]])
                        }
                        if(part_region_mat[0][1]<part_region_mat[1][1]){
                            // 先|
                            if ((part_region_mat[0][3]-part_region_mat[0][2]+1)>(part_region_mat[1][3]-part_region_mat[1][2]+1)*1.4){
                                judg_all.push([15])
                            }
                            else{
                                judg_all.push([3])
                            }
                        }
                        else{
                            if ((part_region_mat[1][3]-part_region_mat[1][2]+1)>(part_region_mat[0][3]-part_region_mat[0][2]+1)*1.4){
                                judg_all.push([15])
                            }
                            else{
                                judg_all.push([3])
                            }
                        }
                        // 数据初始
                        // judg_all.push(confirm_mat)
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                    else{
                        judg_all.push(confirm_mat)
                        judg_idx_mat.push(judg_ii)
                        var basedata= EngBaseCombine
                        judg_idx = []
                        judg_ii = []
                        ii = ii-1
                    }
                }
                else{
                    judg_all.push(confirm_mat)
                    judg_idx_mat.push(judg_ii)
                    var basedata= EngBaseCombine
                    judg_idx = []
                    judg_ii = []
                    ii = ii-1
                }
                // break
            }
            else if(status_flag==2){
                judg_idx.push(test_mat[ii])
                judg_ii.push(ii)
                var basedata=this.deepClone(more_match_mat,[])
                // continue
            }
            else if(status_flag==3){
                // 单笔没有组合匹配时
                console.log('status_flag==3', judg_idx, confirm_mat,'judg_ii',judg_ii)
                judg_all.push(confirm_mat)
                judg_idx_mat.push(judg_ii)
                if (ii == test_mat.length-1){
                    // judg_all.push(confirm_mat)
                    break
                }
                else{
                    var basedata= EngBaseCombine
                    judg_idx = []
                    judg_ii= []
                    ii = ii-1
                }
            }
            else if(status_flag==4){
                judg_idx.push(test_mat[ii])
                judg_ii.push(ii)
                var basedata=this.deepClone(more_match_mat,[])
                // continue
            }
        }
        return [judg_all, judg_idx_mat]
    }
}

export class PadProcessingFunc extends BasicProcessingFunc{
    PadChnCheckProcessMain=(all_line_data)=>{
        // 语文勾选题手写数据处理
        // 数据预定义
        let original_pic_size = [623,72]     // 原始图片大小
        let original_anwser_str = '159,39#560,38'     // 原始图片勾选的答案坐标数据字符串
        let original_pic_data = [original_pic_size,original_anwser_str]
        let pad_pic_loc_xy = [30,40]    // pad端图片端点位置
        let pad_pic_size = [740,80]    // pad端图片实际显示大小
        let pad_pic_data = [pad_pic_size, pad_pic_loc_xy]
        this.PadChnCheckProcessSub1(original_pic_data,pad_pic_data,all_line_data)        

    }

    PadChnCheckProcessSub1=(original_pic_data,pad_pic_data,all_line_data)=>{
        console.log('初始调用')
        // 标准答案数据坐标点处理
        let anwser_split_1st = original_pic_data[1].split('#')
        console.log('答案字符串分离#', anwser_split_1st)
        let answer_split_2nd = []
        for(let ii=0;ii<anwser_split_1st.length;ii++){
            let part_anwser_split_mat = anwser_split_1st[ii].split(',')
            answer_split_2nd.push([parseInt(part_anwser_split_mat[0]),parseInt(part_anwser_split_mat[1])])
        }
        console.log('答案字符串分离,', JSON.stringify(answer_split_2nd))
        // 计算缩放比例
        let ratio_x = Math.round(pad_pic_data[0][0]/original_pic_data[0][0]*100)/100
        let ratio_y = Math.round(pad_pic_data[0][1]/original_pic_data[0][1]*100)/100
        console.log('x和y值比较', JSON.stringify([pad_pic_data[0], original_pic_data[0], ratio_x, ratio_y]))
        let new_original_pic_loc_mat = []
        for(let ii=0;ii<answer_split_2nd.length;ii++){
            let new_loc_x = Math.round(answer_split_2nd[ii][0]*ratio_x*100)/100
            let new_loc_y = Math.round(answer_split_2nd[ii][1]*ratio_y*100)/100
            new_original_pic_loc_mat.push([new_loc_x, new_loc_y])
        }
        console.log('新坐标', JSON.stringify([answer_split_2nd, new_original_pic_loc_mat]))
        // 处理每笔区域
        let part_line_region_mat = []
        let normal_part_line_region_mat = []
        for (let ii=0;ii<all_line_data.length;ii++){
            let part_line_region_data = this.partLineRegion(all_line_data[ii])
            part_line_region_mat.push(part_line_region_data)
            normal_part_line_region_mat.push([part_line_region_data[0]-pad_pic_data[1][0], part_line_region_data[1]-pad_pic_data[1][0],
                                              part_line_region_data[2]-pad_pic_data[1][1], part_line_region_data[3]-pad_pic_data[1][1]])
        }
        console.log('手写数据归零', JSON.stringify([part_line_region_mat, normal_part_line_region_mat]))
        // 对比标准答案是否包含手写数据坐标；遍历
        let anwser_hand_idx_mat = []
        for(let ii=0;ii<new_original_pic_loc_mat.length;ii++){
            let part_hand_idx_mat = []
            for(let jj=0;jj<normal_part_line_region_mat.length;jj++){
                // 第一次只比较x方向的包含关系
                if(new_original_pic_loc_mat[ii][0]>=normal_part_line_region_mat[jj][0]&&
                    new_original_pic_loc_mat[ii][0]<=normal_part_line_region_mat[jj][1]
                    &&(new_original_pic_loc_mat[ii][1]>=(normal_part_line_region_mat[jj][2]-10)
                    && new_original_pic_loc_mat[ii][1]<=(normal_part_line_region_mat[jj][3]+10))//添加y方向判定
                    ){
                        part_hand_idx_mat.push(jj)
                    }
            }
            anwser_hand_idx_mat.push(part_hand_idx_mat)
        }
        console.log('第一次x方向统计', JSON.stringify(anwser_hand_idx_mat))
        // 找出没有存在的索引
        let hand_find_idx = []
        for(let ii=0;ii<anwser_hand_idx_mat.length;ii++){
            for(let jj=0;jj<anwser_hand_idx_mat[ii].length;jj++){
                if(hand_find_idx.indexOf(anwser_hand_idx_mat[ii][jj])<0){
                    hand_find_idx.push(anwser_hand_idx_mat[ii][jj])
                }
            }
        }
        let not_find_idx = []
        for(let ii=0;ii<normal_part_line_region_mat.length;ii++){
            if(hand_find_idx.indexOf(ii)<0){
                not_find_idx.push(ii)
            }
        }
        console.log('找到匹配和未找到匹配的索引',JSON.stringify(hand_find_idx), JSON.stringify(not_find_idx))
        // 对比未找到匹配的索引与找到的索引存在勾选相邻的多个选项：也需要判错
        for(let ii=0;ii<not_find_idx.length;ii++){
            // 未找到的索引的区域
            let part_not_find_region = normal_part_line_region_mat[not_find_idx[ii]]
            let part_not_center_x = (part_not_find_region[0]+part_not_find_region[1])/1
            for(let jj=0;jj<anwser_hand_idx_mat.length;jj++){
                for(let kk=0;kk<anwser_hand_idx_mat[jj].length;kk++){
                    let part_find_region = normal_part_line_region_mat[anwser_hand_idx_mat[jj][kk]]
                    // 比较两组区域
                    console.log('区域比较', JSON.stringify(part_not_find_region), JSON.stringify(part_find_region))
                    let part_center_x = (part_find_region[0]+part_find_region[1])/1
                    let center_distance = Math.abs(part_not_center_x-part_center_x)
                    if(center_distance<(part_not_find_region[1]-part_not_find_region[0]+
                                        part_find_region[1]-part_find_region[0])*2){
                        // 如果间隔小于测试的两个宽度
                        anwser_hand_idx_mat[jj] = []
                        break
                    }
                }
            }
        }
        console.log('新的索引匹配', JSON.stringify(anwser_hand_idx_mat))
        return [anwser_hand_idx_mat]
    }

    PadChnLineDrawProcess=(all_line_data)=>{
        // 语文画线题手写数据处理
        // 数据预定义
        let original_pic_size = [2135,421]     // 原始图片大小
        let original_anwser_str = '159,101;2090,119;63,211;795,215#2135,421'     // 原始图片勾选的答案坐标数据字符串
        let original_pic_data = original_anwser_str
        let pad_pic_loc_xy = [30,40]    // pad端图片端点位置
        let pad_pic_size = [800,140]    // pad端图片实际显示大小
        let pad_pic_data = [pad_pic_size, pad_pic_loc_xy]
        return this.PadCnLineDrawJudge(original_pic_data,pad_pic_data,all_line_data)    
    }

    PadCnLineDrawJudge=(original_pic_data,pad_pic_data,all_line_data)=>{
        // 语文划线题处理判断
        console.log('原图标注字符串', original_pic_data)
        // 原图数据处理
        let original_mat = original_pic_data.split('#')
        // 坐标
        let original_loc_mat = original_mat[0].split(';')
        let original_loc_xy_mat = []
        for (let ii=0;ii<original_loc_mat.length;ii++){
            let part_loc_xy_mat = original_loc_mat[ii].split(',')
            original_loc_xy_mat.push([Number(part_loc_xy_mat[0]),Number(part_loc_xy_mat[1])])
        }
        console.log('原图坐标转换', original_loc_xy_mat)
        let original_size_mat = original_mat[1].split(',')
        let original_size_mat1 = []
        original_size_mat1.push(Number(original_size_mat[0]))
        original_size_mat1.push(Number(original_size_mat[1]))
        console.log('原图大小', original_size_mat1)
        console.log('手写数据', all_line_data)
        // 计算标准高度
        let gap_y_mean = 0
        if (original_loc_xy_mat.length<3){
            gap_y_mean = 100
        }
        else{
            let mean_start=0,mean_end = 0
            for (let ii=0;ii<original_loc_xy_mat.length/2-1;ii++){
                mean_start += original_loc_xy_mat[(ii+1)*2][1]-original_loc_xy_mat[ii*2][1]
                mean_end += original_loc_xy_mat[(ii+1)*2+1][1]-original_loc_xy_mat[ii*2+1][1]
            }
            gap_y_mean = (mean_start+mean_end)/(original_loc_xy_mat.length-2)
        }
        console.log('标准均高', gap_y_mean)
        // 求画线的中心坐标点
        let all_line_region_mat = this.AllRegionAndPartRegion(all_line_data)
        let part_line_loc_mat = []
        for(let ii=0;ii<all_line_region_mat[0].length;ii++){
            part_line_loc_mat.push([all_line_region_mat[0][ii][0],(all_line_region_mat[0][ii][2]+all_line_region_mat[0][ii][3])/2])
            part_line_loc_mat.push([all_line_region_mat[0][ii][1],(all_line_region_mat[0][ii][2]+all_line_region_mat[0][ii][3])/2])
        }
        console.log('pad画线端点', part_line_loc_mat)
        // 图片换算
        let pic_ratio_x = Math.round(original_size_mat1[0]/pad_pic_data[0][0]*100)/100
        let pic_ratio_y = Math.round(original_size_mat1[1]/pad_pic_data[0][1]*100)/100
        console.log('图片比例换算', pic_ratio_x, pic_ratio_y)
        // pad 画线坐标点换算
        let conversion_pad_pic_loc_mat = []
        for (let ii=0;ii<part_line_loc_mat.length;ii++){
            let conver_x = (part_line_loc_mat[ii][0]-pad_pic_data[1][0])*pic_ratio_x
            let conver_y = (part_line_loc_mat[ii][1]-pad_pic_data[1][1])*pic_ratio_y
            conversion_pad_pic_loc_mat.push([conver_x, conver_y]) 
        }
        console.log('图片换算', conversion_pad_pic_loc_mat)
        // 坐标比对
        // 多线条合一
        let loc_num = 0  // 计数
        for (let ii=0;ii<conversion_pad_pic_loc_mat.length;ii++){
            for (let jj=0;jj<original_loc_xy_mat.length;jj++){
                // 比对 y方向在比对x方向
                let abs_y = Math.abs(conversion_pad_pic_loc_mat[ii][1]-original_loc_xy_mat[jj][1])
                if(abs_y<gap_y_mean*0.5){
                    let abs_x = Math.abs(conversion_pad_pic_loc_mat[ii][0]-original_loc_xy_mat[jj][0])
                    if(abs_x<gap_y_mean){
                        loc_num +=1
                    }
                }
            }
        }
        console.log('统计合理点', loc_num)
        if (loc_num==original_loc_xy_mat.length){
            return 'true'
        }
        else{
            return 'false'
        }
    }

}

