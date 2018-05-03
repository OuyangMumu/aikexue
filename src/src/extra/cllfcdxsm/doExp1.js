var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    self.biaogeFun()
                    self.bgg.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        createSp("#do_bg.png",cc.p(270,400),self)
        var btn_next = createSp("#btn_next_1.png",cc.p(240,240),self)
        var canke = createSp("#canke01.png",cc.p(570,300),self)
        var ruler = createSp("#ruler.png",cc.p(560,130),self)

        ruler.runAction(cc.sequence(
            cc.delayTime(4),
            cc.callFunc(function(){
                self.biaogeFun()
            })
        ))

        var data = {}
        data.wendu = new cc.LabelTTF("","",30)
        self.addChild(data.wendu)
        data.wendu.setPosition(305,470)
        data.shidu = new cc.LabelTTF("","",30)
        self.addChild(data.shidu)
        data.shidu.setPosition(315,390)
        data.shijian = new cc.LabelTTF("","",30)
        self.addChild(data.shijian)
        data.shijian.setPosition(335,320)
        data.labelList = [data.wendu,data.shidu,data.shijian]
        data.time = 0
        data.lastTime = Math.floor(13 + Math.random() * 5)

        //直径 1.3-1.5  80-100 1-4天 23℃-25℃  70%-80%    5-12  25℃-28℃   75%-85%
        canke.myScaleX = 8 + Math.random() * 2
        canke.setScaleX(canke.myScaleX / 10)

        var ani = function(frame,start,end) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: 0.2
            }))
        }

        data.change = function(){
            var curNum = {}
            curNum.wd = 0
            curNum.sd = 0
            if(data.time <= 4){
                curNum.wd = Math.floor((23 + Math.random() * 2) * 10)
                curNum.sd = Math.floor((23 + Math.random() * 2) * 10)
            }else{
                curNum.wd = Math.floor((25 + Math.random() * 3) * 10)
                curNum.sd = Math.floor((75 + Math.random() * 10) * 10)
            }
            data.time++
            curNum.wd = curNum.wd / 10
            curNum.sd = curNum.sd / 10
            if(data.time == 4)
                self.nodebs.say({key:"do_tip2",force:true})
            
            data.wendu.setString(curNum.wd)
            data.shidu.setString(curNum.sd + "%")
            data.shijian.setString(data.time)
            canke.runAction(ani("canke%02d.png",data.time,data.time+1))
            if(data.time == data.lastTime){
                canke.runAction(cc.sequence(
                    ani("canke%02d.png",17,21),
                    cc.callFunc(function(){
                        data.can = createSp("#can01.png",cc.p(590,300),self)
                        safeAdd(self, canke)
                        safeAdd(self, ruler)
                        data.can.setScale(0.5)
                        data.can.runAction(aniRepeat())
                        data.can.runAction(cc.moveTo(4,710,300))
                        data.can.runAction(cc.sequence(
                            cc.scaleTo(4,1),
                            cc.callFunc(function(){
                                data.can.stopAllActions()
                            })
                        ))
                    })
                ))
                btn_next.setVisible(false)
                
            }
        }
        data.change()

        
        var aniRepeat = function(){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:"can%02d.png",
                end: 6,
                time: 0.15
            })))
        }

        createTouchEvent({
            item:btn_next,
            begin:function(){
                if(!btn_next.isVisible())   return false 
                btn_next.setSpriteFrame("btn_next_2.png")
                data.change()
                return true
            },
            end:function(data){
                btn_next.setSpriteFrame("btn_next_1.png")
            }
        })

        createTouchEvent({
            item:ruler,
            begin:function(data){
                return true 
            },
            autoMove:true,
        })
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img: res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img: res.do_tip2,sound:res.do_sound2},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },

    biaogeFun:function() {
        var self = this
        if (!self.bgg) {
            var bg = createBiaoge({
                json: res.cllfcdxsm_tableNode_json,
                inputNum: 14,
                scale: 0.9,
            })
            bg.biao1 = bg.getChildByName("biao1")
            bg.biao2 = bg.getChildByName("biao2")
            bg.btn_biao1 = bg.getChildByName("btn_biao1")
            bg.btn_biao2 = bg.getChildByName("btn_biao2")

            var biaoList = [bg.biao1,bg.biao2]
            var btn_biaoList = [bg.btn_biao1,bg.btn_biao2]
            
            bg.curIndex = 0
            bg.btn_biao1.addClickEventListener(function(){
                bg.biaoCall(0)
            })
            bg.btn_biao2.addClickEventListener(function(){
                bg.biaoCall(1)
            })
            bg.biaoCall = function(index){
                for(var i = 0 ; i < 2 ; i++){
                    biaoList[i].setVisible(false)
                    biaoList[i].setPositionY(-1000)
                    btn_biaoList[i].setBright(true)
                    btn_biaoList[i].setTouchEnabled(true)
                }
                btn_biaoList[index].setBright(false)
                btn_biaoList[index].setTouchEnabled(false)
                biaoList[index].setVisible(true)
                biaoList[index].setPositionY(400)
                bg.curIndex = index
            }
            bg.biaoCall(0)
            bg.setPositionY(-1000)
            self.addChild(bg)
            self.bgg = bg
        }
    },
})