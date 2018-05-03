//@author mu @16/5/11
var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                   var buf = []
                   for(var i=0; i<6; i++){
                        if(i%2==0){
                            buf.push([null,res.chose1,res.chose2,res.chose3])
                        }else{
                            buf.push([null,res.chose4,res.chose5,res.chose6])
                        }
                   }
                   var bg = createBiaoge({
                      json: res.biao1,
                      scale: 0.9,
                      downNums:6,
                      inputNum:3,
                      rootColor:[
                        cc.color(200,10,200),
                        cc.color(200,10,200),
                        cc.color(200,10,200)
                      ],
                      inputLineChange:[true,true,true],
                      downData:{
                        nums:6,
                        bufs:buf,
                        keys:[
                           1,2,3,1,2,3,
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
        return true
    },
    initUI:function(){
        var self = this
        self.curLayer = null
        var m_cha_btn = new ccui.Button(res.m_cha_nor,res.m_cha_sel,res.m_cha_sel)
        m_cha_btn.setPosition(90,340)
        this.addChild(m_cha_btn)
        var setBtnVis = function(btn,judg){
            btn.setEnabled(judg)
            btn.setBright(judg)
        }
        var m_shao_btn = new ccui.Button(res.m_shao_nor,res.m_shao_sel,res.m_shao_sel)
        m_shao_btn.setPosition(90,270)
        this.addChild(m_shao_btn)

        m_cha_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,false)
            setBtnVis(m_shao_btn,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp1()
            self.addChild(self.curLayer,10)
        })

        m_shao_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,true)
            setBtnVis(m_shao_btn,false)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp2()
            self.addChild(self.curLayer,10)
        })

        self.curLayer = new myExp1()
        self.addChild(self.curLayer)
        setBtnVis(m_cha_btn,false)
    }
})

var myExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp1",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        //this.expCtor() 
        this.initUI()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initUI:function(){
        var self = this
        
        
        var fdjnode = new cc.Node()
        this.addChild(fdjnode,4)

        var fdj = createFDJ({
                      father: fdjnode,
                      rootScale: 0.3,
                      type:3,
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(0, -500)],
                      getPos: [cc.p(0, -400)],
                    })
        self.fdj = fdj
        fdj.get[0].setVisible(false)
        fdj.see[0].setVisible(true)
        //fdj.actMove()
        
        var createRock = function(data){
            var pos = data.pos
            var img = data.img
            var rock = new cc.Sprite(img)
            rock.setScale(0.25)
            rock.setPosition(pos)
            return rock
        }
        
        self.rockCount = 0
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.3),
            itempos:[cc.p(1, -11),cc.p(1, -13),cc.p(1, -11),cc.p(1, -11)],
            circlepos:cc.p(0,24),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:0.9,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index!=3){
                    if(self.checkItem){
                        self.checkItem.forceBack()
                        fdj.getIn(self.checkItem.keyname).removeFromParent()
                    }
                    var curkey = sprintf("rock%d",self.rockCount++)
                    fdj.createNew({
                        key: curkey,
                        fun: createRock,
                        buf:{
                            pos:data.pos,
                            img:res[sprintf("bigItem%d",index+1)]
                        }
                    })

                    item = fdj.getOut(curkey)
                    item.nopos = true
                    item.keyname = curkey
                    self.checkItem = item
                }else{
                    fdj.setGet(pos)
                    self.jz = false
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
               if(index==3){
                    var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                    item.setPosition(temppos)
                    if(!self.jz){
                       var itemPos = getWorldPos(item)
                       fdj.setGet(cc.p(itemPos.x-10,itemPos.y+21))
                       self.jz = true
                    }
                    fdj.move(delta)

                    if(self.checkItem && judgeItemCrash({item1:item,item2:self.checkItem})){
                        fdj.see[0].setPosition(150,170)
                    }else{
                        fdj.see[0].setPosition(0,-500)
                    }
               }else{
                    fdj.runData({
                        key:item.keyname,
                        fun:function(data){
                            var item = data.item
                            data.delta = delta
                            if(!item.noMove){
                                item.x += delta.x
                                item.y += delta.y
                                cc.log("item:",item.getPosition())
                            }
                        }
                    })
               } 
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(index!=3){
                    fdj.runData({
                        key:item.keyname,
                        fun:function(data){
                            var item = data.item
                            item.setScale(0.4)
                            item.setPosition(560,140)
                        }
                    })
               }
            },
            backfun:function(data){
               var index = data.index
               if(index==3){
                  fdj.setGet(cc.p(0,-400))
               }else{
                  fdj.getIn(self.checkItem.keyname).removeFromParent()
                  self.checkItem = null
               }
               return true
            },
            counts:[99,99,99,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item5],
            gets:[null,null,null,res.bigItem4]
        })
        this.addChild(this.toolbtn,3)
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    expMyEnter: function() {
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
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })
    }  
})

var myExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp2",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("huo")
        })
        this._super()
        var self = this
       // this.expCtor() 
        this.initUI()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var jjd = createJJD({
                    pos:cc.p(250,80),
                    father:self,

                })
        var pan = self.createPan({
                    pos:cc.p(650,100),
                    father:self
                  })

        jjd.setCallBack({
            up:function(){
               
            }
        })
         

        self.fireSp = new cc.Sprite(res.item3)
        self.fireSp.setPosition(250,150)
        self.fireSp.setScale(0.6)
        self.addChild(self.fireSp)
        self.fireSp.setVisible(false)

        self.panSp = new cc.Sprite(res.item3)
        self.panSp.setPosition(650,220)
        self.addChild(self.panSp)
        self.panSp.setScale(1.2,0.7)
        self.panSp.setVisible(false)

        var playFire  = function(item,index){
            var stone = item.stones
            var list = [
                   {
                    pos:cc.p(250,210),
                    scale:cc.p(5.12,5.16),
                    op:200,
                    ro:0,
                    huoscale:cc.p(3.7,3.5),
                    time:3,
                    repeatCount:5
                   },
                   {
                    pos:cc.p(260,200),
                    scale:cc.p(5.25,5.30),
                    op:200,
                    ro:17,
                    huoscale:cc.p(3.4,3.7),
                    time:6,
                    repeatCount:10
                   },
                   {
                    pos:cc.p(340,235),
                    scale:cc.p(4,5.09),
                    op:150,
                    ro:0,
                    huoscale:cc.p(3.4,3.5),
                    time:10,
                    repeatCount:15
                   }
                ]
            var hong = new cc.Sprite(res.hongtong)
            stone.addChild(hong)
            hong.setPosition(list[index].pos)
            hong.setScale(list[index].scale.x,list[index].scale.y)
            hong.setOpacity(0)

            var huo = new cc.Sprite()
            stone.addChild(huo)
            huo.setAnchorPoint(0.5,0)
            huo.setPosition(210,-110)
            huo.setScale(list[index].huoscale.x,list[index].huoscale.y)
            
            var startTime = list[index].time
            var repeatCount = list[index].repeatCount
            jjd.setCanClick(false)
            hong.runAction(cc.sequence(
                cc.fadeIn(startTime),
                cc.callFunc(function(){
                    var ac = createAnimation({
                      frame:"huo%02d.png",
                      start:0,
                      end: 23,
                      time: 0.07,
                    })
                    huo.runAction(cc.sequence(
                        cc.repeat(ac,repeatCount),
                        cc.scaleTo(0.2,0),
                        cc.callFunc(function(){
                            item.IsMove = false
                            self.speakeBykey("wenzi3")
                            jjd.setCanClick(true)
                        })
                    ))
                })
            ))
        }
    
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.3),
            itempos:[cc.p(1, -11),cc.p(1, -13),cc.p(1, -11),cc.p(1, -11)],
            circlepos:cc.p(0,24),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:0.9,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index!=3){
                    if(self.backItem){
                        self.backItem.forceBack() 
                    }
                    item.setScale(0.15)
                    self.backItem = item
                    if(self.ganguo){
                       //self.ganguo.stones.setVisible(false)
                       self.ganguo.haveStone = false
                       self.ganguo.haveshao = false
                       self.ganguo.IsMove = false
                       self.ganguo.stones.stopAllActions()
                       self.ganguo.stones.removeAllChildren()
                       pan.stone.setVisible(false)
                    }
                }else{
                    item.stones = new cc.Sprite(res.bigItem1)
                    item.stones.setScale(0.15)
                    item.stones.setPosition(20,2)
                    item.addChild(item.stones)
                    //item.stones.setVisible(false)
                    item.stones.setOpacity(0)

                    var qian = new cc.Sprite(res.bigItem6)
                    qian.setPosition(94,76)
                    item.addChild(qian,5)
                    self.ganguo = item
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
                    if(index==3){
                        if(item.haveStone){
                            if(jjd.isFire){
                                if(!item.haveshao && judgeItemCrash({item1:self.fireSp,item2:item.stones})){
                                   item.IsMove = true
                                   item.haveshao = true
                                   item.setPosition(360,260)
                                   playFire(item,item.stones.index)
                                }
                            }
                            if(item.haveshao){
                                if(judgeItemCrash({item1:self.panSp,item2:item.stones})){
                                    item.IsMove = true
                                    item.setPosition(770,310)
                                    item.setVisible(false)
                                    pan.playAc(sprintf("item%d",item.stones.index+1),function(){
                                        item.IsMove = false
                                        item.haveshao = false
                                        item.haveStone = false
                                        item.setVisible(true)
                                        item.stones.stopAllActions()
                                        item.stones.removeAllChildren()
                                    })
                                }
                            }
                        }else{
                            if(self.backItem && judgeItemCrash({item1:self.backItem,item2:item.stones})){
                                //item.stones.setTexture(self.backItem.getTexture())
                                //item.stones.setContentSize(getSize(self.backItem.getTexture()))
                                var smallStone = new cc.Sprite(self.backItem.getTexture())
                                smallStone.setPosition(item.stones.width/2,item.stones.height/2)
                                item.stones.addChild(smallStone)

                                item.stones.index = self.backItem.index
                                //item.stones.setVisible(true)
                                self.backItem.setPosition(0,-600)
                                self.backItem.setVisible(false)
                                item.haveStone = true
                            }
                        }
                    }else{
                        if(judgeItemCrash({item1:self.fireSp,item2:item})){
                            item.IsMove = true
                            item.setPosition(250,300)
                            if(jjd.isFire){
                                self.speakeBykey("wenzi5",1)
                            }else{
                                self.speakeBykey("wenzi4",1)
                            }
                        }
                    }
                }
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(index!=3){
                  if(item.IsMove){
                     item.IsMove = false
                  }
               }
            },
            backfun:function(data){
               var index = data.index
               if(index!=3){
                  self.backItem = null
               }else{
                  self.ganguo = null
               }
               return true
            },
            counts:[99,99,99,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4],
            gets:[res.bigItem1,res.bigItem2,res.bigItem3,res.bigItem5]
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
    createPan:function(data){
        var father = data.father || this
        var pos = data.pos
        var pan1 = new cc.Sprite(res.pan1)
        pan1.setPosition(pos)
        father.addChild(pan1)

        pan1.stone = new cc.Sprite(res.bigItem1)
        pan1.stone.setPosition(154,44)
        pan1.stone.setScale(0.15)
        pan1.addChild(pan1.stone,2)
        pan1.stone.setVisible(false)
        pan1.stone.hong = new cc.Sprite(res.hongtong)
        pan1.stone.hong.setPosition(250,200)
        pan1.stone.hong.setScale(5.12,5.16)
        pan1.stone.addChild(pan1.stone.hong)

        var pan2 = new cc.Sprite(res.pan2)
        pan2.setPosition(142.55,80.75)
        pan1.addChild(pan2,10)

        
        var qian = new cc.Sprite(res.bigItem5)
        qian.setPosition(256,270)
        pan1.addChild(qian)
        pan1.qian = qian
        qian.setVisible(false)
        

        var item1 = new cc.Sprite(res.bigItem1)
        item1.setScale(0.15)
        item1.setPosition(20,2)
        qian.addChild(item1)
        pan1.item1 = item1
        item1.setVisible(false)
        item1.hong = new cc.Sprite(res.hongtong)
        item1.hong.setPosition(250,175)
        item1.hong.setScale(5.12,5.16)
        item1.addChild(item1.hong)

        var item2 = new cc.Sprite(res.bigItem2)
        item2.setScale(0.15)
        item2.setPosition(20,2)
        qian.addChild(item2)
        pan1.item2 = item2
        item2.setVisible(false)
        item2.hong = new cc.Sprite(res.hongtong)
        item2.hong.setPosition(282,187)
        item2.hong.setScale(5.34,5.34)
        item2.hong.setRotation(17)
        item2.hong.setOpacity(200)
        item2.addChild(item2.hong)

        var item3 = new cc.Sprite(res.bigItem3)
        item3.setScale(0.15)
        item3.setPosition(20,2)
        qian.addChild(item3)
        pan1.item3 = item3
        item3.setVisible(false)
        item3.hong = new cc.Sprite(res.hongtong)
        item3.hong.setPosition(348,219)
        item3.hong.setScale(5.09,5.09)
        item3.addChild(item3.hong)

        var qian1 = new cc.Sprite(res.bigItem6)
        qian1.setPosition(94,76)
        qian.addChild(qian1)
        
        loadPlist("maoyan")
        pan1.playAc = function(type,fun){
            var pan1 = this
            pan1.qian.setVisible(true)
            var curSp = pan1.item1
            if(type){
                curSp = pan1[type]
            }
            curSp.setVisible(true)
            if(!pan1.maoyan){
              pan1.maoyan = new cc.Sprite()
              pan1.maoyan.setPosition(145,180)
              pan1.addChild(pan1.maoyan,8)
              pan1.maoyan.playSelf = function(){
                var ac = createAnimation({
                  frame:"maoyan%02d.png",
                  start:0,
                  end: 54,
                  time: 0.07,
                })
                this.runAction(ac)
              }
            }
            pan1.qian.runAction(cc.sequence(
                cc.moveTo(0.7,cc.p(256,130)),
                cc.callFunc(function(){
                    if(pan1.maoyan){
                        pan1.maoyan.playSelf()
                    }
                }),
                cc.moveTo(0.3,cc.p(256,110)),
                cc.callFunc(function(){
                    pan1.stone.setTexture(curSp.getTexture())
                    pan1.stone.setVisible(true)
                    pan1.stone.hong.runAction(cc.fadeOut(2.5))
                    curSp.setVisible(false)
                }),
                cc.moveTo(1.1,cc.p(256,270)),
                cc.callFunc(function(){
                    pan1.qian.setVisible(false)
                    if(fun){
                        fun()
                    }
                })
            ))
        }
        return pan1
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi2")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
    }  
})