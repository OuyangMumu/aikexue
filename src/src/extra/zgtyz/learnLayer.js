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
            modify: cc.p(30, 3),
            pics: [res.study_1],
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select,res.learn_btn2_act],
            modify: cc.p(10, 3),
            createFun: function(){
                var uiList = ["btn_next","fen","shi",
                            "amHand","pmHand","zhuan","bi",
                            "big_amHand","big_pmHand","big_zhuan","big_bi"]
                var node = loadNode(res.zgtyz_learnExp_json,uiList)
                node.shi.setRotation(180)
                var myScale = [135,130,125,120,110,100,90, 90,100,120,130,140,140]
                var myRotate = [190,200,210,220,240,250,270,  280,300,320,330,340,350]
                node.canRun = true
                var num = 0
                node.btn_next.addClickEventListener(function () {
                    if(node.canRun){
                        if(num == 6){//进入下午的转动
                            node.big_amHand.setVisible(false)
                            node.big_pmHand.setVisible(true)
                            node.big_zhuan.setPosition(290,86)
                            node.big_bi.setPosition(290,147)
                            node.amHand.setVisible(false)
                            node.pmHand.setVisible(true)
                            node.zhuan.setRotation(node.zhuan.getRotation()+30)
                        }else if(num == 12){//恢复到原来的位置
                            num = 0
                            node.big_amHand.setVisible(true)
                            node.big_pmHand.setVisible(false)
                            node.big_zhuan.setPosition(280,90)
                            node.big_bi.setPosition(284,147)
                            node.fen.setRotation(0)
                            node.shi.setRotation(180)
                            node.big_zhuan.setRotation(myRotate[num])
                            node.big_zhuan.setScaleX(myScale[num]*0.01)
                            node.amHand.setVisible(true)
                            node.pmHand.setVisible(false)
                            node.zhuan.setRotation(30)
                            return
                        }
                        num++
                        node.canRun = false
                        node.fen.runAction(cc.rotateBy(1,360))
                        node.shi.runAction(cc.sequence(
                            cc.rotateBy(1,30),
                            cc.callFunc(function(){
                                node.canRun = true
                        })))
                        node.big_zhuan.runAction(cc.rotateTo(1,myRotate[num]))
                        node.big_zhuan.runAction(cc.scaleTo(1,myScale[num]*0.01,1))
                        node.zhuan.runAction(cc.rotateBy(1,10))
                    } 
                })


                return node
            }
        }])
        return true
    },
})