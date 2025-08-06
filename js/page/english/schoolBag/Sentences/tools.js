export function haveNbsp(v) {
  if (v !== "," && v !== "." && v !== "?" && v !== "!") return " ";
}
export function changeCurrentTopic(value, isExamine) {
  value.sentence_stem.forEach((item, i) => {
    value.change_word.forEach((child, j) => {
      if (child.position === i) {
        item.contentSelect = [];
        item.slectValue = "";
        child.word.forEach((select, z) => {
          item.contentSelect.push({
            content: select,
            label: select,
            position: i,
          });
        });
      }
    });
  });
  value.sentence_stem.forEach((item, i) => {
    if (value.center_word) {
      value.center_word.forEach((child, j) => {
        if (child.position === i) {
          item.isCenter = true;
        }
      });
    }
  });
  if (value.best_answer && value.best_answer.length > 3) {
    let best_answer_three = [];
    let arr = [];
    for (var i = 0; i < value.best_answer.length; i++) {
      arr[i] = i;
    }
    arr.sort(function () {
      return 0.5 - Math.random();
    });
    value.best_answer.forEach((i, index) => {
      for (let j = 0; j < arr.slice(0, 3).length; j++) {
        if (index === arr.slice(0, 3)[j]) {
          best_answer_three.push(i);
          break;
        }
      }
    });
    value.best_answer = best_answer_three;
  }
  value.type = 1; //下拉
  if (value.save_phase === "1" || value.save_phase === "2") {
    //   点选类型
    value.type = 2; //点选
    let arr = JSON.parse(JSON.stringify(value.sentence_stem));
    if (!isExamine) value.sentence_stem_change = shuffle(arr);
    value.sentence_stem_change = unique(value.sentence_stem_change);
    let answer = "";
    value.sentence_stem.forEach((item, index) => {
      answer += item.content;
    });
    value.diag_sentence = {};
    value.diag_sentence[answer] = {
      diagnose: "",
      ranking: "0",
    };
  }
  // value.audio = 'chinese/10/03/01/01/03/exercise/audio/53a740d4d8a84e19acafe58374237a6d.mp3'
  // value.inspect_template.inspect_audio = 'chinese/10/03/01/01/03/exercise/audio/53a740d4d8a84e19acafe58374237a6d.mp3'
  // value.explanation_audio = 'chinese/10/03/01/01/02/exercise/audio/a72fd2af318c4b47adc8bcb581e3208f.mp3'
  return value;
}

//打乱数组
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

// 数组去重
const unique = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].content === arr[j].content) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
};
