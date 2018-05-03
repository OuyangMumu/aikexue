//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                   var bg = createBiaoge({
                      json: res.biao1,
                      scale: 0.9,
                      downNums:2,
                      downData:{
                        nums:2,
                        bufs:[
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2]
                        ],
                        keys:[
                           2,1
                        ]
                      }
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){

        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var jjd = createJJD({
                    pos:cc.p(350,80),
                    father:self,
                })

        self.fireSp = new cc.Sprite(res.item1)
        self.fireSp.setPosition(350,150)
        self.fireSp.setScale(0.8)
        self.addChild(self.fireSp)
        self.fireSp.setVisible(false)

        var pan = new cc.Sprite(res.panzi)
        pan.setPosition(750,100)
        self.addChild(pan)
        self.pan = pan

        self.panSp = new cc.Sprite(res.item1)
        self.panSp.setPosition(750,150)
        self.panSp.setScale(0.8,0.5)
        self.addChild(self.panSp)
        self.panSp.setVisible(false)

        pan.playAc = function(fun){
            var pan = this
            pan.removeAllChildren()
            var acNode = ccs.load(res.ruWater).node
            var ac = ccs.load(res.ruWater).action
            ac.gotoFrameAndPlay(0,90,false)
            ac.setLastFrameCallFunc(function(){
                if(fun){
                    fun()
                }
                acNode.setVisible(false)
                ac.clearLastFrameCallFunc()
            })
            acNode.stopAllActions()
            acNode.runAction(ac)
            acNode.setPosition(pan.width/2,pan.height/2)
            pan.addChild(acNode)
        }
    
        this.toolbtn = createTool({
            pos:cc.p(380, 540),
            nums:1,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.3),
            itempos:cc.p(1, -11),
            circlepos:cc.p(0,18),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1.1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index==0){
                    var sz = new cc.Sprite(res.sz00)
                    sz.setAnchorPoint(0.24,0.6)
                    sz.setPosition(14,-5)
                    item.addChild(sz)
                    item.sz = sz

                    var lsp = new cc.Sprite(res.item1)
                    lsp.setPosition(-75,-93)
                    lsp.setScale(0.61,1.15)
                    item.addChild(lsp)
                    lsp.setVisible(false)
                    item.lsp = lsp
                    lsp.fatherPos = cc.p(570,390)
                    lsp.playSelf = function(fun){
                        var item = this.getParent()
                        var ac = createAnimation({
                                ifFile:true,
                                frame:"sz%02d",
                                start:0,
                                end:52,
                                time: 0.1,
                                fun:fun
                              })
                        item.sz.runAction(ac)
                    }

                    var rsp = new cc.Sprite(res.item1)
                    rsp.setPosition(67,-94)
                    rsp.setScale(0.61,1.15)
                    item.addChild(rsp)
                    rsp.setVisible(false)
                    item.rsp = rsp
                    rsp.fatherPos = cc.p(383,388)
                    rsp.playSelf = function(fun){
                        var item = this.getParent()
                        var ac = createAnimation({
                                ifFile:true,
                                frame:"sz%02d",
                                start:0,
                                end:52,
                                time: 0.1,
                                fun:fun
                              })
                        item.sz.setScale(-1,1)
                        item.sz.runAction(ac)
                    }
                    rsp.playSelf1 = function(fun){
                        var item = this.getParent()
                        item.sz.setVisible(false)
                        var ssz = new cc.Sprite(res.ssz00)
                        ssz.setPosition(149,-95)
                        item.addChild(ssz)
                        var ac = createAnimation({
                                ifFile:true,
                                frame:"ssz%02d",
                                start:0,
                                end:23,
                                time: 0.1,
                                fun:fun
                              })
                        ssz.runAction(ac)
                    }

                    var qian2 = new cc.Sprite(res.qian2)
                    qian2.setPosition(88,70)
                    qian2.setRotation(17)
                    item.addChild(qian2)
                }
                return item
            },
            clickfun:function(data){
                var item = data.sp
                item.data = data
                data.item = item
                if(item.IsMove){
                  return false
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                var index = data.index
                if(!item.IsMove){
                    var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                    item.setPosition(temppos)
                    if(jjd.isFire){
                        var result = false
                        var testSp = null
                        if(judgeItemCrash({item1:self.fireSp,item2:item.lsp})){
                           result = true
                           testSp = item.lsp
                        }
                        if(judgeItemCrash({item1:self.fireSp,item2:item.rsp})){
                           result = true
                           testSp = item.rsp
                        }
                        if(result){
                            if(item.haveWater){
                                if(judgeItemCrash({item1:self.fireSp,item2:item.lsp})){
                                   self.speakeBykey("wenzi2")
                                }
                                if(judgeItemCrash({item1:self.fireSp,item2:item.rsp})){
                                   item.IsMove = true
                                   item.setPosition(item.rsp.fatherPos)
                                   item.rsp.playSelf1(function(){
                                        item.runAction(cc.sequence(
                                           cc.delayTime(1),
                                           cc.callFunc(function(){
                                              item.forceBack()
                                           })
                                        ))
                                   })
                                }
                            }else{
                               if(testSp){
                                   item.IsMove = true
                                   item.setPosition(testSp.fatherPos)
                                   testSp.playSelf(function(){
                                        item.runAction(cc.sequence(
                                           cc.delayTime(1),
                                           cc.callFunc(function(){
                                              item.forceBack()
                                           })
                                        ))
                                   })
                               }
                            }
                        }
                    }
                    if(!item.haveWater){
                        if(judgeItemCrash({item1:self.panSp,item2:item.lsp}) || 
                           judgeItemCrash({item1:self.panSp,item2:item.rsp})){
                            item.IsMove = true
                            item.setPosition(775,414)
                            item.setVisible(false)
                            item.perse = new cc.Sprite(res.perse3)
                            item.perse.setPosition(57.83,502.47)
                            item.sz.addChild(item.perse)
                            pan.playAc(function(){
                               item.setVisible(true)
                               item.IsMove = false
                               item.haveWater = true
                            })
                        }
                    }
                }
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(!item.IsMove){
                  item.setPosition(670,420)
               }
            },
            counts:[1],
            father:toolnode,
            files:[res.item1],
            gets:[res.qian1]
        })
        this.addChild(this.toolbtn,3)
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                this.nodebs.say({
                    key: key,
                    force: true
                })  
            } 
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }       
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                 self.speakeBykey("wenzi1")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp4
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp5
        })
    }  
})