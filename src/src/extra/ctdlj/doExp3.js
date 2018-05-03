//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
        })
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){

        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:3,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:[cc.p(0, -28),cc.p(1, -22),cc.p(1, -27)],
            circlepos:cc.p(0,15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:0.9,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.setVisible(false)
                if(index==0){
                  self.createTieting(item.getTexture())
                }else if(index==1){
                  self.createHuiZhen(item.getTexture())
                }else if(index==2){
                  self.createCitie(item.getTexture())
                }
                self.resetInit()
                if(self.resetBtn && !self.resetBtn.isVisible()){
                    self.resetBtn.setVisible(true)
                }
                return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               item.setPosition(0,-700)
            },
            backfun:function(){
                return false
            },
            counts:[1,1,1],
            father:toolnode,
            files:[res.item2,res.item3,res.item1],
            gets:[res.bigitem2,res.bigitem3,res.bigitem1]
        })
        this.addChild(this.toolbtn,3)

        var resetBtn = new ccui.Button(res.fubtn_nor,res.fubtn_sel)
        resetBtn.setPosition(150,380)
        self.addChild(resetBtn)
        self.resetBtn = resetBtn
        resetBtn.setVisible(false)
        resetBtn.addClickEventListener(function(){
            self.resetInit()
        })

        var cibtn = new ccui.Button(res.cibtn_nor,res.cibtn_sel)
        cibtn.setPosition(160,300)
        self.addChild(cibtn)
        self.cibtn = cibtn
        cibtn.setVisible(false)
        cibtn.addClickEventListener(function(){
            cibtn.setVisible(false)

            self.citie.setVisible(false)
            self.citie.onMove = true
            self.huiZhen.onMove = true
            self.resetBtn.setVisible(false)

            var moca = self.createCihuaAc(function(){
                if(self.citie){
                    self.citie.setVisible(true)
                    self.citie.onMove = false
                    self.huiZhen.onMove = false
                    self.resetBtn.setVisible(true)
                    moca.removeFromParent()
                    self.tieTing.haveCixing = true
                    self.speakeBykey("wenzi4")
                }
            })
            moca.setPosition(520,200)
            self.addChild(moca)
        })


    },
    resetInit:function(){
        var self = this
        self.cibtn.setVisible(false)
        if(self.citie){
            safeAdd(self,self.citie)
            self.citie.removeListen()
            self.citie.setPosition(self.citie.initPos)
            self.createCitie(res.bigitem1)
            self.citie.haveHui = false
        }
        if(self.tieTing){
            safeAdd(self,self.tieTing)
            self.tieTing.setPosition(self.tieTing.initPos)
            self.createTieting(res.bigitem2)
        }
        if(self.huiZhen){
            safeAdd(self,self.huiZhen)
            self.huiZhen.setPosition(self.huiZhen.initPos)
            self.createHuiZhen(res.bigitem3)
        }
    },
    createCitie:function(img){
        var self = this
        if(!self.citie){
            self.citie = new cc.Sprite(img)
            self.citie.setPosition(750,120)
            self.addChild(self.citie,1)
            self.citie.initPos = self.citie.getPosition()
        }

        createTouchEvent({
            item:self.citie,
            begin:function(data){

               return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               if(!item.noMove)
               {
                  item.x += delta.x
                  item.y += delta.y

                  if(self.tieTing 
                    &&　judgeItemCrash({item1:item,item2:self.tieTing}) 
                    && !self.tieTing.noMove)
                  {     cc.log("11111111111111")
                        self.pauseCitie()
                  }else if(self.huiZhen 
                    &&　judgeItemCrash({item1:item,item2:self.huiZhen})
                    && !self.huiZhen.noMove){
                        cc.log("添加回形针")
                        safeAdd(item,self.huiZhen)
                        self.huiZhen.setPosition(150,10)
                        self.huiZhen.noMove = true
                        self.cibtn.setVisible(false)
                        self.citie.haveHui = true       
                  }
               }
            },
            end:function(data){
                var item = data.item
                var delta = data.delta

                if(self.tieTing&&self.tieTing.noMove){
                    //self.tieTing.noMove = false
                    self.tieTing.removeListen()
                }
                if(self.huiZhen&&self.huiZhen.noMove){
                    //self.huiZhen.noMove = false
                    self.huiZhen.removeListen()
                }
               //item.setPosition(item.initPos)
            }
        })
    },
    createTieting:function(img){
        var self = this
        if(!self.tieTing){
            self.tieTing = new cc.Sprite(img)
            self.tieTing.setPosition(420,120)
            self.addChild(self.tieTing,5)
            self.tieTing.initPos = self.tieTing.getPosition() 
        }
        self.tieTing.noMove = false
        createTouchEvent({
            item:self.tieTing,
            begin:function(data){
               return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               if(!item.noMove)
               {
                  item.x += delta.x
                  item.y += delta.y
                  if(self.citie && judgeItemCrash({item1:item,item2:self.citie}))
                  {
                    self.pauseCitie()
                  }else if(self.huiZhen && judgeItemCrash({item1:item,item2:self.huiZhen})){
                      if(item.haveCixing){
                            self.speakeBykey("wenzi5")
                            safeAdd(self.tieTing,self.huiZhen)
                            self.huiZhen.setPosition(60,30)
                            self.huiZhen.noMove = true
                      }else{
                            if(!self.wenzi2){
                                self.speakeBykey("wenzi2")
                                self.wenzi2 = true
                            }    
                      }
                  }
               }
            },
            end:function(data){
                var item = data.item
                var delta = data.delta
                if(self.huiZhen&&self.huiZhen.noMove){
                    //self.huiZhen.noMove = false
                    self.huiZhen.removeListen()
                }
                if(item.nnoMove){
                    item.removeListen()
                }
            }
        })
    },
    pauseCitie:function(){
        var self = this
        self.tieTing.noMove = true
        safeAdd(self.citie,self.tieTing)
        self.tieTing.setPosition(150,8)
        if(!self.citie.haveHui){
            self.speakeBykey("wenzi3")
            self.cibtn.setVisible(true)
        }
    },
    createHuiZhen:function(img){
        var self = this
        if(!self.huiZhen){
            self.huiZhen = new cc.Sprite(img)
            self.huiZhen.setPosition(220,120)
            self.huiZhen.initPos = self.huiZhen.getPosition()
            self.addChild(self.huiZhen,2)
        }
        self.huiZhen.noMove = false
        createTouchEvent({
            item:self.huiZhen,
            begin:function(data){
               return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               if(!item.noMove)
               {
                  item.x += delta.x
                  item.y += delta.y
                  if(self.citie && judgeItemCrash({item1:item,item2:self.citie}))
                  {
                    safeAdd(self.citie,item)
                    item.setPosition(150,10)
                    item.noMove = true
                    self.cibtn.setVisible(false)
                    self.citie.haveHui = true
                  }else if(self.tieTing && judgeItemCrash({item1:item,item2:self.tieTing})){
                      if(self.tieTing.haveCixing){
                            self.speakeBykey("wenzi5")
                            safeAdd(self.tieTing,self.huiZhen)
                            self.huiZhen.setPosition(60,30)
                            self.tieTing.noMove = true
                      }else{
                            if(!self.wenzi2){
                                self.speakeBykey("wenzi2")
                                self.wenzi2 = true
                            }    
                      }
                  }
               }
            },
            end:function(data){
                var item = data.item
                var delta = data.delta
                if(self.tieTing&&self.tieTing.noMove){
                    //self.tieTing.noMove = false
                    self.tieTing.removeListen()
                }
                if(item.nnoMove){
                    item.removeListen()
                }
            }
        })
    },
    createCihuaAc:function(fun){
        var cihua = new cc.Sprite(res.cihua2)

        var cihua1 = new cc.Sprite(res.cihua3)
        cihua1.setPosition(141.5,118)
        cihua.addChild(cihua1)

        var cihua2 = new cc.Sprite(res.cihua1)
        cihua2.setPosition(123.4,79)
        cihua.addChild(cihua2)

        var cihua3 = new cc.Sprite(res.cihua4)
        cihua3.setPosition(265.5,190)
        cihua.addChild(cihua3)

        cihua3.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.repeat(cc.sequence(cc.moveTo(0.25,cc.p(235,140)),cc.moveTo(0.25,cc.p(265.5,190))),4),
            cc.callFunc(function(){
                if(fun){
                    fun()
                }
            })
        ))

        return cihua
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
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
            sound: res.zimp1
        })
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
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })
    }  
})