var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select,res.learn_btn1_act],
            modify: cc.p(30, 0),
            posOff: [cc.p(-10, -20)],
            pics: [res.study_1]
         },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(10, 0),
            createFun: function(){
                var uiList = ["result1","result2","result3","btn_submit",
                            "btn_result","btn_again",
                            "correct_1","correct_2","correct_3","error_1","error_2","error_3",
                            ]
                var node = loadNode(res.rszycdd_learnExp1_json,uiList)
                node.resultPos = [cc.p(440,390),cc.p(305,257),cc.p(442,252)] //放置答案位置
                node.firstPos = [250,400,550]  //Y值为100
                node.resultItem = [null,null,null]
                node.result1.num = 2   //热传导
                node.result2.num = 0   //热对流
                node.result3.num = 1   //热辐射
                for(var i = 0 ; i < 3 ; i++){
                    node[uiList[i]].index = i
                    node[uiList[i]].resultNum = 10
                    createTouchEvent({
                        item:node[uiList[i]],
                        begin:function(data){
                            return true
                        },
                        move:function(data){
                            var item = data.item 
                            var delta = data.delta 
                            item.x += delta.x 
                            item.y += delta.y
                        },
                        end:function(data){
                            var item = data.item 
                            if(item.resultNum < 3)
                                node.resultItem[item.resultNum] = null
                            for(var i = 0 ; i < 3 ; i++){
                                if(rectContainsPoint(item,node.resultPos[i])){
                                    item.setPosition(node.resultPos[i])
                                    item.resultNum = i
                                    if(node.resultItem[i]){
                                        node.resultItem[i].resultNum = 10
                                        node.resultItem[i].setPosition(node.firstPos[node.resultItem[i].index],100)
                                    }
                                    node.resultItem[i] = item 
                                    return
                                }
                            }
                            item.resultNum = 10
                            item.setPosition(node.firstPos[item.index],100)
                        }
                    })
                }

                
                node.btn_submit.addClickEventListener(function(){
                    for(var i = 0 ; i < 3 ; i++){
                        if(node.resultItem[i]){
                            if(i == node.resultItem[i].num){
                                node[uiList[6+i]].setVisible(true)
                                node[uiList[9+i]].setVisible(false)
                            }else{
                                node[uiList[6+i]].setVisible(false)
                                node[uiList[9+i]].setVisible(true)
                            }
                        }else{
                            node[uiList[6+i]].setVisible(false)
                            node[uiList[9+i]].setVisible(false)
                        }
                    }
                })
                node.resultImg = [2,0,1]
                node.aaaaaaa = [node.result2,node.result3,node.result1]
                node.btn_result.addClickEventListener(function(){
                    for(var i = 0 ; i < 3 ; i++){
                        node[uiList[6+i]].setVisible(false)
                        node[uiList[9+i]].setVisible(false)
                        node[uiList[i]].setPosition(node.resultPos[node.resultImg[i]])
                        node[uiList[i]].resultNum = 10
                        node.resultItem[i] = node.aaaaaaa[i]
                        node.resultItem[i].resultNum = i
                    }
                })
                node.btn_again.addClickEventListener(function(){
                    for(var i = 0 ; i < 3 ; i++){
                        node[uiList[6+i]].setVisible(false)
                        node[uiList[9+i]].setVisible(false)
                        node[uiList[i]].setPosition(node.firstPos[i],100)
                        node.resultItem[i] = null
                        node[uiList[i]].resultNum = 10
                    }
                })
                var rectContainsPoint = function (rect, point) {
                    var ret = false;
                    if (point.x >= rect.x - rect.width/2 && point.x <= rect.x + rect.width/2 &&
                        point.y >= rect.y - rect.height/2 && point.y <= rect.y + rect.height/2) {
                        ret = true;
                    }
                    return ret;
                }
                
                return node
            }
        }])
        return true
    },
})