/**
 * 
 * 基于webview的Canvas画布
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from "react-native-webview";
import { connect } from 'react-redux';

class KnowledgeTreeModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height || 0,
      width: this.props.width || 0,
    }
    this.webview = {};
    this.time = 0

  }
  componentDidMount() {
    //console.log('Webcanvas Dismount')
    //  this.props.onRef(this)
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    console.log('RichShowView componentWillUnmount')
  }

  render() {
    const { treeData } = this.props
    console.log('33333333333333333333', treeData)
    return (
      <View style={[styles.container, { width: 1270, height: 500, marginTop: 10 }]}>
        <WebView
          style={{ width: 1270, height: 500, backgroundColor: 'rgba(255,255,255,0)' }}
          ref={(w) => { this.webview = w }}
          source={{
            html:

              `<html>
                   <head>
                   <title>tree</title>
                   <meta name="viewport" content="width=device-width, initial-scale=1">
                   <script src="https://d3js.org/d3.v5.min.js"></script>
                   <style>
                   *{
                     margin: 0;
                     padding: 0;
                     backgroundColor:'rgba(255,255,255,0)';
                   }
                   div{
                    ${this.props.divStyle}
                   }  
                   p{
                    ${this.props.pStyle}
                   }
                   span{
                    ${this.props.spanStyle}
                   }  
                   img{
                    ${this.props.imgStyle}
                   }                 
                 </style>
                   </head> 
                   <body>
                    <svg width="3000" height="2000"></svg>
                   <script>

                    //数据
                    // var data = {"knowledge_name":"四年级上学期","children":[{"knowledge_code":"m-k-4NDywh7Uu3VoJ2eADPT5qS","knowledge_name":"数与代数","knowledge_parents":"null","children":[{"knowledge_code":"m-k-YZwVQci9mDxDvP3LS3oWFF","knowledge_name":"整数","knowledge_parents":"m-k-4NDywh7Uu3VoJ2eADPT5qS","children":[{"knowledge_code":"m-k-8cKmveXe5nrps8kwiknMeb","knowledge_name":"整数的认识和加减法","knowledge_parents":"m-k-YZwVQci9mDxDvP3LS3oWFF","children":[{"knowledge_code":"m-k-eUgHuLjLCvU3aCEhw6mu9h","knowledge_name":"大数的认识","knowledge_parents":"m-k-8cKmveXe5nrps8kwiknMeb","children":[{"knowledge_code":"m-k-XdV2rvNLbxDN6uFK8QdHpQ","knowledge_name":"认识计数单位“十万”","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"},{"knowledge_code":"m-k-Ro6tC7EJ659tTWLdwtspnP","knowledge_name":"认识数位顺序表","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"},{"knowledge_code":"m-k-ykrheSd9yXxJETSvLTEBjb","knowledge_name":"大数的读写","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"},{"knowledge_code":"m-k-pBEoBqGPNWGjKm2WiJnLwF","knowledge_name":"大数的比较","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"},{"knowledge_code":"m-k-HwmF4EcPnLTLfKvzBz2EHX","knowledge_name":"认识近似数","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"},{"knowledge_code":"m-k-2TAwx7hQpghxwc2h2YjYTF","knowledge_name":"数字找规律","knowledge_parents":"m-k-eUgHuLjLCvU3aCEhw6mu9h","status":"2"}]}]},{"knowledge_code":"m-k-WJ6qWWVQoif28ZrFayAdDW","knowledge_name":"整数的乘法","knowledge_parents":"m-k-YZwVQci9mDxDvP3LS3oWFF","children":[{"knowledge_code":"m-k-xFqkxKdK7h529i76QvEUeV","knowledge_name":"三位数乘两位数","knowledge_parents":"m-k-WJ6qWWVQoif28ZrFayAdDW","children":[{"knowledge_code":"m-k-q9UyyXcb3Qojc42upq6uyS","knowledge_name":"三位数乘两位数的笔算","knowledge_parents":"m-k-xFqkxKdK7h529i76QvEUeV","status":"2"},{"knowledge_code":"m-k-EG2zp3AUuKFnm2Wp3sHD98","knowledge_name":"用乘法估计大数","knowledge_parents":"m-k-xFqkxKdK7h529i76QvEUeV","status":"2"},{"knowledge_code":"m-k-bJfJcfUEuNaYV6nDBFoCPM","knowledge_name":"认识计算器","knowledge_parents":"m-k-xFqkxKdK7h529i76QvEUeV","status":"2"},{"knowledge_code":"m-k-xrssfEJtXTYqfdAC4Fzgid","knowledge_name":"用计算器探索有趣的乘法算式","knowledge_parents":"m-k-xFqkxKdK7h529i76QvEUeV","status":"2"}]}]},{"knowledge_code":"m-k-5zbAdSZeH9MHtBc4HwFRL8","knowledge_name":"整数的除法","knowledge_parents":"m-k-YZwVQci9mDxDvP3LS3oWFF","children":[{"knowledge_code":"m-k-qADx2svFvVvGEZ2eWDceoY","knowledge_name":"除数是两位数的除法","knowledge_parents":"m-k-5zbAdSZeH9MHtBc4HwFRL8","children":[{"knowledge_code":"m-k-P4kLYbU6ro9rartYquMEM7","knowledge_name":"除数是整十数的除法","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"},{"knowledge_code":"m-k-AfEhzSniTFos5SNdk4hmKQ","knowledge_name":"三位数除以两位数的除法（试商一次）","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"},{"knowledge_code":"m-k-f9P7eFrnVsrWo5NpUYZiri","knowledge_name":"三位数除以两位数的除法（试商多次）","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"},{"knowledge_code":"m-k-y8aWqEfAvHuXWZ47Kzukrn","knowledge_name":"商不变的规律","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"},{"knowledge_code":"m-k-xTBZQNzTYeXffqiv3Ucgsi","knowledge_name":"路程、时间与速度的关系","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"},{"knowledge_code":"m-k-fRg8YjTz4NkFG76AgHiGxb","knowledge_name":"总价、数量与单价的关系","knowledge_parents":"m-k-qADx2svFvVvGEZ2eWDceoY","status":"2"}]}]}]},{"knowledge_code":"m-k-YRWtA4KGSjFz5yi3wxj2eD","knowledge_name":"四则运算","knowledge_parents":"m-k-4NDywh7Uu3VoJ2eADPT5qS","children":[{"knowledge_code":"m-k-yharUQy5WFdFGaMYWXnwmP","knowledge_name":"运算顺序","knowledge_parents":"m-k-YRWtA4KGSjFz5yi3wxj2eD","children":[{"knowledge_code":"m-k-bRdeE3X97mMV69NsNBbfWQ","knowledge_name":"没有括号的混合运算的运算顺序","knowledge_parents":"m-k-yharUQy5WFdFGaMYWXnwmP","status":"2"},{"knowledge_code":"m-k-zuWN4pfzRMcumzrWgRPqHm","knowledge_name":"有中括号的混合运算的运算顺序","knowledge_parents":"m-k-yharUQy5WFdFGaMYWXnwmP","status":"2"}]},{"knowledge_code":"m-k-CTDA8NVDTqfu49UXMNutzL","knowledge_name":"运算定律","knowledge_parents":"m-k-YRWtA4KGSjFz5yi3wxj2eD","children":[{"knowledge_code":"m-k-PPahBHcCcPQbLU2FaPthvF","knowledge_name":"加法运算定律","knowledge_parents":"m-k-CTDA8NVDTqfu49UXMNutzL","children":[{"knowledge_code":"m-k-atQjHHESq3P554YkoBCFME","knowledge_name":"加法交换律","knowledge_parents":"m-k-PPahBHcCcPQbLU2FaPthvF","status":"2"},{"knowledge_code":"m-k-eGFWMo3RhSvssVAYpQfRmB","knowledge_name":"加法结合律","knowledge_parents":"m-k-PPahBHcCcPQbLU2FaPthvF","status":"2"}]},{"knowledge_code":"m-k-VVCcbQdtB2c36VoMZGn6vT","knowledge_name":"乘法运算定律","knowledge_parents":"m-k-CTDA8NVDTqfu49UXMNutzL","children":[{"knowledge_code":"m-k-dEvbcGWsfGSZTQhmLRK4RE","knowledge_name":"乘法交换律","knowledge_parents":"m-k-VVCcbQdtB2c36VoMZGn6vT","status":"2"},{"knowledge_code":"m-k-kovEPaMJ4C8iJjeTFHMUVN","knowledge_name":"乘法结合律","knowledge_parents":"m-k-VVCcbQdtB2c36VoMZGn6vT","status":"2"},{"knowledge_code":"m-k-gCBzEQaqmwysRCugxUD5Nf","knowledge_name":"乘法分配律","knowledge_parents":"m-k-VVCcbQdtB2c36VoMZGn6vT","status":"2"}]}]}]},{"knowledge_code":"m-k-Z76vvcksjZaCihZVkg8X3E","knowledge_name":"正数和负数","knowledge_parents":"m-k-4NDywh7Uu3VoJ2eADPT5qS","children":[{"knowledge_code":"m-k-ds5vVqJP4LzyvJYu6arBwY","knowledge_name":"直观认识正、负数","knowledge_parents":"m-k-Z76vvcksjZaCihZVkg8X3E","status":"2"},{"knowledge_code":"m-k-m4Q7rM6x5ETkT2zu4UL9Km","knowledge_name":"正、负数的意义","knowledge_parents":"m-k-Z76vvcksjZaCihZVkg8X3E","status":"2"}]}]},{"knowledge_code":"m-k-Ju3iHLgfhuAyQpZCsQAZPZ","knowledge_name":"图形与几何","knowledge_parents":"null","children":[{"knowledge_code":"m-k-SzstB46AjUNVdmfYm4CaSX","knowledge_name":"平面图形","knowledge_parents":"m-k-Ju3iHLgfhuAyQpZCsQAZPZ","children":[{"knowledge_code":"m-k-7YqLgbun6vvJ2KajxLKNH8","knowledge_name":"线","knowledge_parents":"m-k-SzstB46AjUNVdmfYm4CaSX","children":[{"knowledge_code":"m-k-EuFJXvQo4xkCdJpNGtmW6J","knowledge_name":"认识线段","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"},{"knowledge_code":"m-k-8soKfMqhmerWNLPg3GmhFR","knowledge_name":"认识射线","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"},{"knowledge_code":"m-k-k5tG4YvsAVzrzvszbGAEan","knowledge_name":"认识直线","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"},{"knowledge_code":"m-k-ci6CwbrmPjfZjNjbpiSmdb","knowledge_name":"认识相交","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"},{"knowledge_code":"m-k-DGCubezGF6HyuYYdR4bWGW","knowledge_name":"认识垂直","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"},{"knowledge_code":"m-k-WHQALAieK5Dap95wop9L23","knowledge_name":"认识平行线","knowledge_parents":"m-k-7YqLgbun6vvJ2KajxLKNH8","status":"2"}]},{"knowledge_code":"m-k-hgQDeWnxZa86dWrBbUuCXi","knowledge_name":"角","knowledge_parents":"m-k-SzstB46AjUNVdmfYm4CaSX","children":[{"knowledge_code":"m-k-wgnEfVjv8uPHrsjkHDiSnB","knowledge_name":"认识平角和周角","knowledge_parents":"m-k-hgQDeWnxZa86dWrBbUuCXi","status":"2"},{"knowledge_code":"m-k-nJ4VcQeJqekpAuSyhduQQC","knowledge_name":"认识角的度量单位","knowledge_parents":"m-k-hgQDeWnxZa86dWrBbUuCXi","status":"2"},{"knowledge_code":"m-k-vCf2GeZhmjgBo2E3LcBqwG","knowledge_name":"用量角器度量角的大小","knowledge_parents":"m-k-hgQDeWnxZa86dWrBbUuCXi","status":"2"}]}]},{"knowledge_code":"m-k-KvqrQk2m3LnnzxMa3eYmFf","knowledge_name":"图形的位置","knowledge_parents":"m-k-Ju3iHLgfhuAyQpZCsQAZPZ","children":[{"knowledge_code":"m-k-dJT7cLhMuVRkTR4j27s39Y","knowledge_name":"路线图","knowledge_parents":"m-k-KvqrQk2m3LnnzxMa3eYmFf","children":[{"knowledge_code":"m-k-DTu6CDBbGHwgGY6ynKo38H","knowledge_name":"描述简单的路线图","knowledge_parents":"m-k-dJT7cLhMuVRkTR4j27s39Y","status":"2"}]},{"knowledge_code":"m-k-k4uc2ZRVKjL69Yh7fcW9Ha","knowledge_name":"确定位置","knowledge_parents":"m-k-KvqrQk2m3LnnzxMa3eYmFf","children":[{"knowledge_code":"m-k-NYecWVU2Dnh9xbJaJ4ANGU","knowledge_name":"在方格纸上用数对确定位置","knowledge_parents":"m-k-k4uc2ZRVKjL69Yh7fcW9Ha","status":"2"}]}]}]},{"knowledge_code":"m-k-sQ32ny8sUUv7ACb6ZM4RR9","knowledge_name":"统计与概率","knowledge_parents":"null","children":[{"knowledge_code":"m-k-c5y5q3PEmffQyAvFSsxifK","knowledge_name":"概率","knowledge_parents":"m-k-sQ32ny8sUUv7ACb6ZM4RR9","children":[{"knowledge_code":"m-k-CLm8W2UQMsG5icHhpkwzSc","knowledge_name":"认识简单的随机现象","knowledge_parents":"m-k-c5y5q3PEmffQyAvFSsxifK","status":"2"},{"knowledge_code":"m-k-gh7Ai3k2fyUkZvZ6cs55nV","knowledge_name":"定性描述可能性的大小","knowledge_parents":"m-k-c5y5q3PEmffQyAvFSsxifK","status":"2"}]}]}]}
                  data = ${JSON.stringify(treeData)}

                    var margin = 60;
                    var svg = d3.select("svg");
                    var width = svg.attr("width");
                    var height = svg.attr("height");

                    //创建分组
    var g = svg.append("g")
                        .attr("transform","translate("+ margin +","+ margin +")");


                    //创建一个层级布局
                    var hierarchyData = d3.hierarchy(data)
                        .sum(function (d,i) {
                            return d.value;
                        });
                //    返回的节点和每一个后代会被附加如下属性:
                //        node.data - 关联的数据，由 constructor 指定.
                //        node.depth - 当前节点的深度, 根节点为 0.
                //        node.height - 当前节点的高度, 叶节点为 0.
                //        node.parent - 当前节点的父节点, 根节点为 null.
                //        node.children - 当前节点的孩子节点(如果有的话); 叶节点为 undefined.
                //        node.value - 当前节点以及 descendants(后代节点) 的总计值; 可以通过 node.sum 和 node.count 计算.
                    console.log(hierarchyData);

                    //创建一个树状图
                    var tree = d3.tree()
                        // .size([width-100,height-200])
                        .size([width-700,height-800])
                        .separation(function (a,b) {
                            return (a.parent==b.parent?1:2)/a.depth;//一种更适合于径向布局的变体，可以按比例缩小半径差距:
                        });

                    //初始化树状图数据
                    var treeData = tree(hierarchyData)
                    console.log(treeData);//这里的数据treeData与hierarchyData 相同

                    //获取边和节点
                    var nodes = treeData.descendants();
                    var links = treeData.links();
                    console.log('nodesnodesnodesnodesnodesnodes',nodes);
                    console.log(links);

                    //创建贝塞尔曲线生成器
                    var link = d3.linkHorizontal()
                        .x(function(d) { return d.y; })//生成的曲线在曲线的终点和起点处的切线是水平方向的
                        .y(function(d) { return d.x; });
                        


                    //绘制边
                    g.append('g')
                        .selectAll('path')
                        .data(links)
                        .enter()
                        .append('path')
                        .attr('d',function (d,i) {
                            var start = {x:d.source.x,y:d.source.y};
                            var end = {x:d.target.x,y:d.target.y};
                            return link({source:start,target:end});
                        })
                        .attr('stroke','#9C6004')
                        .attr('stroke-width',1)
                        .attr('fill','none');


                    //创建节点与文字分组
                    var gs = g.append('g')
                        .selectAll('.g')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('transform',function (d,i) {
                            return 'translate('+ d.y +','+ d.x +')';
                        })
                    //绘制文字和节点
                   

                    gs.append('circle')
                        .attr('r',function(d,i){
                                return d.data.status?7:0
                            })
                        .attr('fill',function(d,i){
                          return d.data.status === '0'?'#77D102': d.data.status === '1'?'#F26161':'#E2E2E2'
                        })
                        .attr('stroke-width',1)
                    

                gs.append('text')
                .attr('x',function (d,i) {
                    return d.children?-20:10;//有子元素的话  当前节点的文字前移40
                })
                .attr('fill',function(d,i){
                  if(!d.data.status) return '#333'
                    // return d.data.status === '0'?'#77D102': d.data.status === '1'?'#F26161':'#666666'
                })
                .attr('y',0)
                .text(function (d,i) {
                    return d.data.name;
                })



                </script>
                   </body>
               </html>
               ` }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  reset: {
    width: 120,
    height: 40,
    alignContent: 'center',
    marginEnd: 5
  }
});


const mapStateToProps = (state) => {
  return {
  }
}

const mapDispathToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispathToProps)(KnowledgeTreeModal)
