
import React, { ReactNode } from "react";
import {Text} from 'react-native'
import Markdown, { Renderer, MarkedTokenizer, MarkedLexer } from "react-native-marked";
import MathView from 'react-native-math-view';

class CustomTokenizer extends MarkedTokenizer{
  // Override
  codespan(src) {
    const match = src.match(/\$(.*?)\$/)
    if (match?.[1]) {
      const text = match[1].trim();
      const token = {
        type: 'custom',
        raw: match[0],
        identifier: "latex",
        tokens: MarkedLexer(text),
        args: { 
          text: text,
        }
      };
      return token;
    }
    return super.codespan(src)
  }
}

class CustomRenderer extends Renderer  {
  // Custom Token implementation
 
  constructor() {
    super();
  }

  custom(
    raw,
    args,
  ) {
    // console.log('custom:::::',raw,args)
    const latex = args.replaceAll('$','')
    // const latex = '132'
    // console.log('ooooo',latex)
    return (
      <MathView
      math={`${latex}`}
      style={{ flex: 1 }}
    />
    );
  }
  codespan(
    text
  ) {
    // console.log('codecodecode:::',text)
    return (
      <Markdown
      value={text}
      flatListProps={{
        initialNumToRender: 8,
      }}
    />
    );
  }

}

const renderer = new CustomRenderer();
const tokenizer = new CustomTokenizer();

const MarkdownView = ({value,textStyle}) => {
  // const value ="$2+3\\frac{1}{2}=\\frac{11}{2}$`## 你好`"
//   const value = `### 分解原则：
// 1. **等式原则**：等号两边的值相等。
// 2. **运算顺序**：先乘除，后加减。
// 3. **逆运算**：通过逆向操作来求解未知数。

// ### 分步解析：
// $2+3\\frac{1}{2}=\\frac{11}{2}$

// $\\frac{1}{2}$

// $\\frac{1}{\\sqrt{2}+\\frac{1}{\\sqrt{3}+\\frac{1}{\\sqrt{4}+\\frac{1}{\\dots}}}}$

// #### 步骤1：理解问题
// 原式是：6×△+3=□+3=45

// #### 步骤2：简化问题
// 由于□+3=45，让我们首先解决这个等式。

// **问题1**：如果□+3=45，那么□等于多少？
// - 第1步：□ = 45 - 3

// 请计算出□的值。

// #### 请回答问题1：□等于多少？`
  return (
    <Markdown
      value={value}
      styles={{
        text:textStyle,
        strong:textStyle,
        li:textStyle,
        h3:textStyle,
        h4:textStyle
      }}
      renderer={renderer}
      tokenizer={tokenizer}
    />
  );
};

export default MarkdownView