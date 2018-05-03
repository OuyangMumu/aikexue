var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        this.load()
        var self = this
        loadPlist("learn3_plist")
        loadPlist("learn2_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select, res.learn_btn1_act],
            pics: [res.study_1,res.study_2,res.study_3,res.study_4],
        },{
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            againIf:true,
            createFun: function(){

                var ani = function(frame,end) {
                    return cc.sequence(createAnimation({
                        frame: frame,
                        end: end,
                        time:0.2
                    }))
                }

                var aniRever = function(frame,end) {
                    return cc.sequence(createAnimation({
                        frame: frame,
                        end: end,
                        time:0.2,
                        rever:true,
                    }))
                }

                var call = function(){
                    var node = self.node1
                    node.ye_xia.setVisible(false)
                    node.ye_qiu.setVisible(false)
                    node.dong.setVisible(false)
                    node.luo.setVisible(false)
                    node.snow.setVisible(false)
                    node.ye_chun.setVisible(true)
                    node.luoye.setVisible(true)

                    node.shugan.stopAllActions()
                    node.ye_chun.stopAllActions()
                    node.luo.stopAllActions()
                    node.ye_xia.stopAllActions()
                    node.ye_qiu.stopAllActions()
                    node.snow.stopAllActions()
                    node.wz.setSpriteFrame("learn2_wz1.png")
                    node.luoye.setSpriteFrame("learn2_shuye1.png")


                    node.shugan.runAction(cc.sequence(
                        cc.callFunc(function(){
                            node.ye_chun.runAction(ani("learn2_chun%02d.png",7))
                            node.luo.setVisible(true)
                            node.luo.setSpriteFrame("learn2_hua.png")
                            node.luo.setPosition(110,180)
                            node.luo.runAction(cc.sequence(
                                cc.moveTo(2,100,10),
                                cc.callFunc(function(){
                                    node.luo.setVisible(false)
                                })
                            ))
                        }),
                        cc.delayTime(3),
                        cc.callFunc(function(){
                            node.ye_xia.runAction(ani("learn2_xia%02d.png",8))
                            node.ye_xia.setVisible(true)
                            node.wz.setSpriteFrame("learn2_wz2.png")
                            node.luoye.setSpriteFrame("learn2_shuye2.png")
                            node.luoye.setVisible(true)
                        }),
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            node.ye_chun.setVisible(false)
                        }),
                        cc.delayTime(3),
                        cc.callFunc(function(){
                            node.ye_qiu.runAction(cc.sequence(
                                ani("learn2_qiu%02d.png",5)
                            ))
                            node.ye_qiu.setVisible(true)
                            node.wz.setSpriteFrame("learn2_wz3.png")
                            node.luoye.setSpriteFrame("learn2_shuye3.png")
                        }),
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            node.ye_xia.setVisible(false)
                        }),
                        cc.delayTime(4),
                        cc.callFunc(function(){
                            node.wz.setSpriteFrame("learn2_wz4.png")
                            node.luo.setVisible(true)
                            node.luo.setPosition(110,180)
                            node.luo.setSpriteFrame("learn2_ye.png")
                            node.luo.runAction(cc.sequence(
                                cc.moveTo(2,100,10),
                                cc.callFunc(function(){
                                    node.luo.setVisible(false)
                                })
                            ))
                            node.ye_qiu.runAction(cc.sequence(
                                aniRever("learn2_qiu%02d.png",5),
                                cc.delayTime(0.2),
                                cc.callFunc(function(){
                                    node.luoye.setVisible(false)
                                    node.ye_qiu.setVisible(false)
                                    node.dong.setVisible(true)
                                    //此处冬天
                                    node.snow.setVisible(true)
                                    node.snow.runAction(cc.repeatForever(ani("learn2_snow%02d.png",4)))
                                }),
                                cc.delayTime(5),
                                cc.callFunc(function(){
                                    node.snow.stopAllActions()
                                    node.snow.setVisible(false)
                                })
                            ))
                        })
                    ))
                }

                if(!self.node1){
                    var node = new cc.Node()
                    self.node1 = node
                    node.setPosition(0,0)
                    node.shugan = createSp("#learn2_shugan.png",cc.p(450,300),node)
                    node.ye_chun = createSp("#learn2_chun01.png",cc.p(110,175),node.shugan)
                    node.ye_xia = createSp("#learn2_xia01.png",cc.p(110,175),node.shugan)
                    node.ye_qiu = createSp("#learn2_qiu01.png",cc.p(110,175),node.shugan)
                    node.luoye = createSp("#learn2_shuye1.png",cc.p(100,0),node.shugan)
                    node.wz = createSp("#learn2_wz1.png",cc.p(350,120),node.shugan)
                    node.dong = createSp("#learn2_dong.png",cc.p(110,120),node.shugan)
                    node.luo = createSp("#learn2_hua.png",cc.p(110,180),node.shugan)
                    node.snow = createSp("#learn2_snow01.png",cc.p(100,160),node.shugan)
                    node.shugan.setScale(1.5)
                    node.wz.setScale(1.5)

                    call()
                    return node
                }

                call()

            },
        },{
            btn: [res.learn_btn3_normal, res.learn_btn3_select, res.learn_btn3_act],
            againIf:true,
            createFun: function(){
                if(!self.node2){
                    var node = new cc.Node()
                    self.node2 = node
                    node.setPosition(0,0)
                    createSp("#learn3_wenzi.png",cc.p(390,300),node)
                    var layout = createLayout({
                        pos:cc.p(790,60),
                        size:cc.size(297,446),
                        clip:true,
                    })
                    node.addChild(layout)
                    var list = []
                    createSp("#learn3_bg.png",cc.p(148,223),layout)

                    node.node1 = new cc.Node()
                    layout.addChild(node.node1)
                    node.node1.setPosition(0,0)//-450
                    //150,350   190   最高850  -90
                    for(var i = 0 ; i < 5 ; i++){
                        list[i] = createSp(sprintf("#learn3_img_%02d.png",i+1),cc.p(150,350-i*190),node.node1)
                    }

                    return node
                }
                self.node2.node1.stopAllActions()
                self.node2.node1.setPositionY(0)
                self.node2.node1.runAction(cc.moveTo(8,0,520))
            }
        }])
        return true
    },
})