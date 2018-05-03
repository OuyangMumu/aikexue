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
        self.img_title.setVisible(false)
        self.initPageBtns([{
            createFun: function(){
                loadPlist("learn_plist")
                var twoImg = ["img_dasuan","img_yangcong","img_qianwei",
                                "img_qiezi","img_doulei","img_haichan"]
                var twoBtn = ["btn_dasuan","btn_yangcong","btn_qianwei",
                                "btn_qiezi","btn_doulei","btn_haichan"]
                var threeImg = ["img_sanbu","img_tiaosheng","img_paobu",
                                "img_youyong","img_qiche"]
                var threeBtn = ["btn_sanbu","btn_tiaosheng","btn_paobu",
                                "btn_youyong","btn_qiche"]
                var uiList = ["btn_food","btn_run",
                                "oneNode","twoNode","threeNode",
                                "food_quan","btn_back_two","btn_back_three","child"]
                var node = loadNode(res.clxt_learnExp_json,uiList)
                node.btn_food.addClickEventListener(function(){
                    node.oneNode.setPositionX(-568)
                    node.twoNode.setPositionX(568)
                    foodVisible(0)
                })
                node.btn_run.addClickEventListener(function(){
                    node.oneNode.setPositionX(-568)
                    node.threeNode.setPositionX(568)
                    childAction(10)
                })
                node.btn_back_two.addClickEventListener(function () {
                    node.twoNode.setPositionX(-568)
                    node.oneNode.setPositionX(568)
                })
                node.btn_back_three.addClickEventListener(function () {
                    node.threeNode.setPositionX(-568)
                    node.oneNode.setPositionX(568)
                    node.child.stopAllActions()
                })

                //食物
                for(var i = 0 ; i < 6 ; i++){
                    node.twoNode.getChildByName(twoBtn[i]).setTag(i)
                    node.twoNode.getChildByName(twoBtn[i]).addClickEventListener(function(selector,type){
                        foodVisible(selector.getTag())
                    })
                }

                var foodVisible = function(index){
                    for(var j = 0 ; j < 6 ; j++){
                        if(index == j){
                            node.food_quan.getChildByName(twoImg[j]).setVisible(true)
                        }else{
                            node.food_quan.getChildByName(twoImg[j]).setVisible(false)
                        }
                    } 
                }

                //运动

                for(var i = 0 ; i < 5 ; i++){
                    node.threeNode.getChildByName(threeBtn[i]).setTag(10+i)
                    node.threeNode.getChildByName(threeBtn[i]).addClickEventListener(function(selector,type){
                         childAction(selector.getTag())
                    })
                }

                var curInde = 10
                var childAction = function (index) {
                    var index = index - 10
                    if(curInde == index)
                        return
                    curInde = index
                    for(var j = 0 ; j < 5 ; j++){
                        if(index == j){
                            node.threeNode.getChildByName(threeImg[index]).setVisible(true)
                        }else{
                            node.threeNode.getChildByName(threeImg[j]).setVisible(false)
                        }
                    }
                    node.child.stopAllActions()
                    node.child.setPosition(0,0)
                    switch(index){
                        case 0: node.child.runAction(ani("sanbu%02d.png",7))
                        break
                        case 1: node.child.runAction(ani("tiaosheng%02d.png",4))
                        break
                        case 2: node.child.runAction(ani("paobu%02d.png",8))
                        break
                        case 3: node.child.runAction(ani("youyong%02d.png",6))
                                node.child.setPosition(-50,11)
                        break
                        case 4: node.child.runAction(ani("qiche%02d.png",4))
                        break
                    }
                }

                var ani = function(frame,end) {
                    return cc.repeatForever(createAnimation({
                        frame: frame,
                        end: end,
                        time: 0.15
                    }))
                }
                return node
            }
        }])
        return true
    },
})