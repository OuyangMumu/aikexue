var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {

        });
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()


        return true
    },
    initUI: function() {

        var self = this;
        var uinamelist = [
            "shao", "sb", "mk", "jielunbtn",
            "zbg", "fenz", "miaoz", "shiz", "threemin",
            "ranshao1","ranshao2","ranshao3"
        ]
        var node = loadNode(res.do3, uinamelist);
        this.addChild(node)
        node.jielunbtn.addClickEventListener(function() {
            self.nodebs.say({
                key: "jielun"
            })
        })

        var touchsplist = [node.shao, node.sb, node.mk]
        
        node.zbg.setVisible(false)
        node.zbg.runSelf = function(data) {
            var miao = data.miao
            var fen = data.fen
            var shi = data.shi
            var fun = data.fun
            this.setVisible(true)
            var inself = this
            this.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(1 / 60),
                cc.callFunc(function(){
                    miao.setRotation(miao.getRotationX() + 0.5)
                    fen.setRotation(fen.getRotationX() + 1 / 120)
                    shi.setRotation(shi.getRotationX() + 1 / 720)
                    if (fen.getRotationX() >= 18){
                        inself.stopSelf()
                        if (fun)
                            fun()
                    }    
                })
            )))
        }
        node.zbg.stopSelf = function() {
            this.stopAllActions()
            this.removeFromParent(true)
        }


        var yannode1 = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.yan,
        })
        yannode1.setCascadeOpacityEnabled(true)
        yannode1.setOpacity(100)
        yannode1.setScale(1,0.6)
        node.ranshao1.addChild(yannode1)

        var yannode2 = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.yan,
        })
        yannode2.setCascadeOpacityEnabled(true)
        yannode2.setOpacity(100)
        yannode2.setScale(1,0.6)
        node.ranshao2.addChild(yannode2)

        var yannode3 = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.yan,
        })
        yannode3.setCascadeOpacityEnabled(true)
        yannode3.setOpacity(100)
        yannode3.setScale(1,0.6)
        node.ranshao3.addChild(yannode3)


        for (var i in touchsplist) {
            touchsplist[i].getParent().y = 490
            createTouchEvent({
                item: touchsplist[i],
                begin: function() {
                    return true
                },
                move: function(data) {
                    for (var i in touchsplist)
                        touchsplist[i].getParent().y += data.delta.y

                    if (touchsplist[0].getParent().y <= 400) {
                        for (var i in touchsplist) {
                            touchsplist[i].removeListen()
                            touchsplist[i].getParent().y = 400
                            touchsplist[i].getParent().stopAllActions()
                            touchsplist[i].getParent().runAction(cc.sequence(
                                cc.moveBy(0.5, cc.p(0, -185)),
                                cc.callFunc(function() {
                                    node.zbg.runSelf({
                                        miao: node.miaoz,
                                        fen: node.fenz,
                                        shi: node.shiz,
                                        fun: function() {
                                            node.threemin.setVisible(true)
                                            var ac = ccs.load(res.do3).action
                                            ac.gotoFrameAndPlay(0, 80, false)
                                            node.runAction(ac)
                                        }
                                    })
                                })
                            ))
                        }
                    }
                }
            })
        }


    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "dr",
                    force: true
                })
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "dr",
            sound: res.zi3mp,
            img: res.wenzi3,
        })
        addContent({
            people: this.nodebs,
            key: "jielun",
            img: res.tip1,
            id: "result",
            sound: res.tip1mp,
            offset: cc.p(25, 20),
            offbg: cc.p(50, 50),
        })
    }
})