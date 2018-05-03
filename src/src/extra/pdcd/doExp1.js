//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("ding")
            loadPlist("dai")
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

        self.dlleft = null
        self.dlright = null

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(320, 540),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.3),
            itempos:[cc.p(1, -10),cc.p(1, -15),cc.p(1, -11),cc.p(1, -23)],
            circlepos:cc.p(0,20),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                if(index<=1){
                    item.pre = new cc.Sprite(item.getTexture())
                    item.pre.setPosition(item.width/2+8,item.height/2-8)
                    item.addChild(item.pre)
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            clickfun:function(data){
                var item = data.sp
                if(item.IsMove){
                  return false
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                if(item.index<=1){
                  if(item.x<=568){
                    self.dlleft = null
                  }else{
                    self.dlright = null
                  }
                }
                return true
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                var index = data.index
                if(!item.IsMove){
                    var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                    item.setPosition(temppos)
                    if(index==2){
                        if((self.dlleft && !self.dlleft.haveIn) && 
                            judgeItemCrash({
                            item1:item,
                            item2:self.dlleft.testSp
                        })){
                            item.IsMove = true
                            self.dlleft.haveIn = true
                            item.removeListen()
                            self.dlleft.removeListen()
                            safeAdd(self.dlleft,item)
                            item.setPosition(self.dlleft.width/2+9.7,self.dlleft.height/2-10.2)
                            if((self.dlright && self.dlright.haveIn) && 
                               (self.dlleft && self.dlleft.haveIn)){
                                self.speakeBykey("wenzi2") 
                            }
                            var ac = createAnimation({
                              frame:"ding%d.png",
                              start:0,
                              end: 7,
                              time: 0.1,
                            })
                            item.runAction(ac)
                        }
                        if((self.dlright && !self.dlright.haveIn) && 
                            judgeItemCrash({
                            item1:item,
                            item2:self.dlright.testSp
                        })){
                            item.IsMove = true
                            self.dlright.haveIn = true
                            item.removeListen()
                            self.dlright.removeListen()
                            safeAdd(self.dlright,item)
                            item.setPosition(self.dlright.width/2+9.7,self.dlright.height/2-10.2)
                            if((self.dlright && self.dlright.haveIn) && 
                               (self.dlleft && self.dlleft.haveIn)){
                                self.speakeBykey("wenzi2") 
                            }
                            var ac = createAnimation({
                              frame:"ding%d.png",
                              start:0,
                              end: 7,
                              time: 0.1,
                            })
                            item.runAction(ac)
                        }
                    }else if(index==3){
                        if(self.dlleft && 
                            judgeItemCrash({
                            item1:item,
                            item2:self.dlleft.testSp
                        })){
                            item.IsMove = true
                            item.trueIn = true
                            if((self.dlright && self.dlright.haveIn) && self.dlleft.haveIn){
                               self.createChoseLayer()
                            }else{
                               self.speakeBykey("wenzi5","tip")
                            }
                        }
                        if(self.dlright && 
                            judgeItemCrash({
                            item1:item,
                            item2:self.dlright.testSp
                        })){
                            item.IsMove = true
                            item.trueIn = true
                            if(self.dlright.haveIn && (self.dlleft&&self.dlleft.haveIn)){
                               self.createChoseLayer()
                            }else{
                              self.speakeBykey("wenzi5","tip")
                            }                      
                        }
                        if(item.trueIn){
                            item.forceBack()
                        }
                    }
                }
            },
            outfun:function(data){
               var item = data.sp
               var index = item.index
               if(self.curNode && index<2){
                   item.forceBack()
                   return true
               }
               if(item.index<=1){
                  if(item.x <= 568){
                    item.setLocalZOrder(1)
                    item.setPosition(358,200)
                    if(self.dlleft && self.dlleft.haveIn){
                        item.forceBack()
                    }else{
                        if(self.dlleft){
                          self.dlleft.forceBack()
                        }
                        if(!item.testSp){
                          item.testSp = new cc.Sprite(res.testImg)
                          item.testSp.setPosition(item.width/2,item.height/2)
                          item.testSp.setOpacity(0)
                          item.addChild(item.testSp)
                        }
                        self.dlleft = item 
                    }
                    
                  }else{
                    item.setPosition(748,200)
                    item.setLocalZOrder(1)
                    if(self.dlright && self.dlright.haveIn){
                        item.forceBack()
                    }else{
                        if(self.dlright){
                          self.dlright.forceBack()
                        }
                        if(!item.testSp){
                          item.testSp = new cc.Sprite(res.testImg)
                          item.testSp.setPosition(item.width/2,item.height/2)
                          item.testSp.setOpacity(0)
                          item.addChild(item.testSp)
                        }
                        self.dlright = item
                    }
                  }
               }
            },
            counts:[99,99,2,999],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4],
            gets:[res.item6,res.item9,res.item8,res.item7]
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
    showDai:function(type){
        var self = this
        var listSp = ["dai1","dai2","dai3","dai4"]
        var tempJson = res.choseNode
        var biaoJson = res.biao1
        var curnum = 1
        var jude_num = 1
        var speed = 1
        var radius_zhu = 3
        var radius_cho = 3
        switch(type){
            case "fir":
              listSp = ["dai3","dai4","dai1","dai2"]
              jude_num = 1
            break
            case "sec":
              listSp = ["dai1","dai2","dai3","dai4"]
              jude_num = -1
            break
        }
        var templist = ["dapan","dapan1","xpan","xpan1","jt1","jt2"]
        for (var i = 0; i < templist.length; i++) {
            listSp[listSp.length] = templist[i]
        }
        if(self.dlleft && self.dlright){
            if(self.dlleft.index == self.dlright.index){
               if(self.dlleft.index==0){
                  tempJson = res.choseNode1
                  radius_zhu = 2
                  radius_cho = 2 
               }else{
                  tempJson = res.choseNode2
                  radius_zhu = 1
                  radius_cho = 1
               } 
            }else{
                biaoJson = res.biao2
                curnum = 2
               if(self.dlleft.index==0){
                  tempJson = res.choseNode
                  speed = 2
                  radius_zhu = 2
                  radius_cho = 1
               }else{
                  tempJson = res.choseNode3
                  speed = 1/2
                  radius_zhu = 1
                  radius_cho = 2
               } 
            }
        }
        if(self.curNode){
            self.curNode.removeFromParent()
            self.curNode = null
        }
        self.curNode = loadNode(tempJson,listSp)
        for (var i = 0; i < 4; i++) {
            if(i<=1){
                self.curNode[listSp[i]].setVisible(true)
            }else{
                self.curNode[listSp[i]].setVisible(false)
            }
        }
        if(self.dlleft && self.dlright){
            self.dlleft.setVisible(false)
            self.dlright.setVisible(false)
        }
        self.curNode.setPosition(568,200)
        self.addChild(self.curNode)
        self.curNode.jude_num = jude_num
        self.curNode.speed = speed
        self.speakeBykey("wenzi3")

        self.createAset({
            biaoJson:biaoJson,
            curnum:curnum,
            keys:[3,3,3,3,3,3]
        })
        
        var getMygel = function(node,pos){
            var nodepos = node.convertToNodeSpace(pos)
            var topos = cc.p(nodepos.x - node.width/2,nodepos.y - node.height/2)
            var tempAngel = 180*(1+Math.atan2(topos.x,topos.y)/Math.PI)
            return tempAngel
        }

        self.curNode.show_jt = function(angel,node,angle1,node1){
            var curNode = this
            if(!curNode.jt1.isVisible()){
               curNode.jt1.setVisible(true)
            }
            if(!curNode.jt2.isVisible()){
               curNode.jt2.setVisible(true)
            }
            var SY = angel<=0 ? -1:1
            node.setScale(1,SY)

            var SY1 = angle1<=0 ? -1:1
            node1.setScale(1,SY1)
        }

        self.curNode.dlPlayAc = function(node,angel,node1,node2){
            var curNode = this
            var jude_num = this.jude_num
            var curAngel = angel * jude_num
            node.setRotation(node.getRotationX() + curAngel)
            curNode.show_jt(curAngel,node1,angel,node2)
        }
        self.curNode.changeImg = function(angel){
            var mod_angel = Math.floor((angel%360)/18)
            if(mod_angel>=0 && mod_angel<=19){
               var img = sprintf("dai%02d.png",mod_angel)
               self.curNode[listSp[0]].setSpriteFrame(img)
               self.curNode[listSp[1]].setSpriteFrame(img)
            }
        }


        self.curNode.dl_word1 = new cc.Sprite(res.zdl_word)
        self.curNode.dl_word1.setPosition(-210,-150)
        self.curNode.addChild(self.curNode.dl_word1)
        self.curNode.dl_word1.setVisible(false)

        self.curNode.dl_word2 = new cc.Sprite(res.cdl_word)
        self.curNode.dl_word2.setPosition(180,-150)
        self.curNode.addChild(self.curNode.dl_word2)
        self.curNode.dl_word2.setVisible(false)
        self.upList = [3,3,3,3,3,3]
        createTouchEvent({
            item:self.curNode.dapan1,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                item.startAngel = getMygel(item,pos)
                self.curNode.dl_word1.setVisible(true)
                self.curNode.dl_word2.setVisible(true)
                self.curNode.dl_word1.setTexture(res.zdl_word)
                self.curNode.dl_word2.setTexture(res.cdl_word)
                return true
            },
            move:function(data){
                var pos = data.pos
                var item = data.item
                var angel = getMygel(item,pos)
                var cha_angel = angel - item.startAngel
                item.setRotation(item.getRotationX() + cha_angel)
                self.curNode.changeImg(item.getRotationX())
                self.curNode.dlPlayAc(self.curNode.xpan1,cha_angel * self.curNode.speed,self.curNode.jt2,self.curNode.jt1)
            },
            end:function(){
               if(self.bggg){
                    var s1 = self.curNode.jt1.getScaleY()
                    var s2 = self.curNode.jt2.getScaleY()
                    var num1 = s1 >= 0? 1:2
                    var num2 = s2 >= 0? 1:2
                   if(radius_zhu == radius_cho){
                        self.upList = [radius_zhu,num1,1,radius_cho,num2,1]
                   }else{
                        if(radius_zhu > radius_cho){
                            self.upList = [radius_zhu,num1,2,radius_cho,num2,1]
                        }else{
                            self.upList = [radius_zhu,num2,1,radius_cho,num1,2]
                        }
                   }
                   self.bggg.resetItemKey(self.upList) 
               }
            }
        })
        createTouchEvent({
            item:self.curNode.xpan1,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                item.startAngel = getMygel(item,pos)
                self.curNode.dl_word1.setVisible(true)
                self.curNode.dl_word2.setVisible(true)
                self.curNode.dl_word1.setTexture(res.cdl_word)
                self.curNode.dl_word2.setTexture(res.zdl_word)
                return true
            },
            move:function(data){
                var pos = data.pos
                var item = data.item
                var angel = getMygel(item,pos)
                var cha_angel = angel - item.startAngel
                item.setRotation(item.getRotationX() + cha_angel)
                self.curNode.changeImg(item.getRotationX())
                self.curNode.dlPlayAc(self.curNode.dapan1,cha_angel*1/self.curNode.speed,self.curNode.jt1,self.curNode.jt2)
            },
            end:function(){
                if(self.bggg){
                    var s1 = self.curNode.jt1.getScaleY()
                    var s2 = self.curNode.jt2.getScaleY()
                    var num1 = s1 >= 0? 1:2
                    var num2 = s2 >= 0? 1:2
                    if(radius_zhu == radius_cho){
                        self.upList = [radius_zhu,num2,1,radius_cho,num1,1]
                    }else{
                        if(radius_zhu > radius_cho){
                            self.upList = [radius_cho,num2,1,radius_zhu,num1,2]
                        }else{
                            self.upList = [radius_cho,num2,2,radius_zhu,num1,1]
                           
                        }
                    }
                    self.bggg.resetItemKey(self.upList) 
                }
            }
        })
    },
    createAset:function(data){
        var biaoJson = data.biaoJson
        var keys = data.keys
        var curnum = data.curnum
        var bufs = []
        if(curnum==2){
            bufs = [
                   [null,res.bg_word1,res.bg_word2],
                   [null,res.bg_word3,res.bg_word4],
                   [null,res.bg_word5,res.bg_word6],

                   [null,res.bg_word1,res.bg_word2],
                   [null,res.bg_word3,res.bg_word4],
                   [null,res.bg_word5,res.bg_word6],
                ]
        }else{
            bufs = [
                   [null,res.bg_word1,res.bg_word2],
                   [null,res.bg_word3,res.bg_word4],
                   [null,res.bg_word7,res.bg_word8],

                   [null,res.bg_word1,res.bg_word2],
                   [null,res.bg_word3,res.bg_word4],
                   [null,res.bg_word7,res.bg_word8],
                ]        
        }

        var self = this
        if(self.setting){
           self.setting.removeFromParent()
           self.setting = null 
        }
        if (!self.bggg) {
            var bgg = createBiaoge({
              json: biaoJson,
              scale: 0.9,
              downData:{
                nums:6,
                bufs:bufs,
                keys:self.upList,
              }
            })
            self.addChild(bgg)
            bgg.setPosition(-1000,0)
            bgg.setScale(0)
            //bgg.show()
            self.bggg = bgg
        }
        self.setting = createSetting({
                            pos: cc.p(1080, 580),
                            biaogeFun: function() {
                              var bgg = self.bggg
                              bgg.show()
                            },
                          })
        self.addChild(self.setting,800)
    },
    createChoseLayer:function(){
        var self = this
        var layer = new cc.LayerColor(cc.color(0,0,0,100))
        createTouchEvent({
            item:layer,
            swallow:true,
            begin:function(){
                return true
            }
        })

        var chosebg = new cc.Sprite(res.chosebg)
        chosebg.setPosition(getMiddle())
        layer.addChild(chosebg)


        var one = new ccui.Button(res.one_nor,res.one_sel)
        one.setPosition(chosebg.width/4+16,chosebg.height/2-10)
        chosebg.addChild(one)
        one.addClickEventListener(function(){
           layer.removeFromParent()
           self.showDai("fir")
        })
        
        var two = new ccui.Button(res.two_nor,res.two_sel)
        two.setPosition(3*chosebg.width/4-16,chosebg.height/2-10)
        chosebg.addChild(two)
        two.addClickEventListener(function(){
           layer.removeFromParent()
           self.showDai("sec")
        })

        self.addChild(layer,10000)
        return layer
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
    }  
})