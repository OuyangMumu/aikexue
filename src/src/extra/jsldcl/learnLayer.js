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
            modify: cc.p(40, 3),
            pics: [res.study_1_1,res.study_1_2,res.study_1_3,
            res.study_1_4,res.study_1_5],
         },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            //modify: cc.p(30, 3),
            pics: [res.study_2_1,res.study_2_2,res.study_2_3,res.study_2_4],
         },
         {
            btn: [res.learn_btn3_normal, res.learn_btn3_select,res.learn_btn3_act],
            modify: cc.p(-30, 3),
            createFun: function(){
                var uiList = ["resultImg","btn_result","btn_clear","no_1",
                        "no_2","no_3","no_4","no_5","check1","check2","check3"]
                var node = loadNode(res.jsldcl_learn_json,uiList)
                
                loadPlist("learn_plist")
                var posList = [290,440,580,720,850]//260
                //var judgeList = [cc.p(510,385),cc.p(780,360),cc.p(448,337)]
                var judgeList = [node.check1,node.check2,node.check3]
                var imgList = ["no_1_1.png","no_2_1.png","no_3_1.png","no_4_1.png","no_5_1.png",
                        "no_1.png","no_2.png","no_3.png","no_4.png","no_5.png"]

                var spList = [node.no_1,node.no_2,node.no_3,node.no_4,node.no_5]
                for (var i = judgeList.length - 1; i >= 0; i--) {
                    judgeList[i].end = false
                }
                var curLocal = 20
                for(var i = 0 ; i < spList.length ; i ++){
                    spList[i].index = i
                    spList[i].noMove = false
                    createTouchEvent({
                        item:spList[i],
                        begin:function(data){
                            var item  = data.item
                            if(item.noMove)
                                return false
                            item.setLocalZOrder(curLocal++)
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
                            var index = item.index
                            for(var i = 0 ; i < 3 ; i++){
                                if(!judgeList[i].end && checkDistance(item,judgeList[i])){
                                    item.setSpriteFrame(imgList[index])
                                    item.setPosition(judgeList[i])
                                    item.noMove = true
                                    judgeList[i].end = true
                                    return true
                                }
                            }
                            if(!item.noMove)
                                item.setPosition(posList[index],260)
                        }
                    })
                }
                
                node.btn_clear.addClickEventListener(function(){
                    for(var i = 0 ; i < 5 ; i++){
                        spList[i].setPosition(posList[i],260)
                        if(spList[i].noMove){
                            spList[i].noMove = false
                            spList[i].setSpriteFrame(imgList[i+5])
                        }   
                    }
                    for(var i = 0 ; i < 3 ; i++){
                         judgeList[i].end = false
                    }
                })
                node.btn_result.addClickEventListener(function(){
                    if(!node.resultImg.isVisible()){
                        node.resultImg.setVisible(true)
                    }else{
                        node.resultImg.setVisible(false)
                    }
                })

                var checkDistance = function(ra,rb){
                    var dx = ra.x - rb.x 
                    var dy = ra.y - rb.y 
                    var dis = Math.sqrt(Math.pow(dx,2) , Math.pow(dy,2))
                    if(dis < 30)
                        return true 
                    else
                        return false
                }
                return node
            }
        }
        ])
        return true
    },
})