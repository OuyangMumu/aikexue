var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
            loadPlist("gx")
        })
        this._super()
        this.expCtor() 
        this.initUI()
        this.initData()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = ["sdb","sgdb","gdb","db","text1","text2","FnBtn",
        "coin1","coin2","coin3","coinTest","exp1"]
        self.seeNode = loadNode(res.seeJson,uiName)
        self.addChild(self.seeNode)
    },
    initData:function(){
        var self = this
        var node = self.seeNode
        var setVis1 = function(type){
            if(type==1){
                node.text1.setColor(cc.color(255,255,0))
                node.sgdb.setOpacity(100)
                node.db.setVisible(true)
                self.speakeBykey("wenzi5")

                node.text2.setColor(cc.color(255,255,255))
                node.sdb.setOpacity(255)
                node.gdb.setVisible(false)

            }else{
                node.text2.setColor(cc.color(255,255,0))
                node.sdb.setOpacity(100)
                node.gdb.setVisible(true)
                self.speakeBykey("wenzi6")

                node.text1.setColor(cc.color(255,255,255))
                node.sgdb.setOpacity(255)
                node.db.setVisible(false)
            }
        }
        self.canChose = true
        createTouchEvent({
            item:node.text1,
            begin:function(data){
                if(self.canChose){
                   self.canChose = false
                   setVis1(1)
                }
                return true
            },
            end:function(){
                self.canChose = true
            }
        })
        createTouchEvent({
            item:node.sdb,
            begin:function(data){
                var result = judgeOpInPos(data)
                if(result){
                   if(self.canChose){
                       self.canChose = false
                       setVis1(1)
                    }
                }
                return result
            },
            end:function(){
                self.canChose = true
            }
        })

        createTouchEvent({
            item:node.text2,
            begin:function(data){
                if(self.canChose){
                   self.canChose = false
                   setVis1(2)
                }
                return true
            },
            end:function(){
                self.canChose = true
            }
        })
        createTouchEvent({
            item:node.sgdb,
            begin:function(data){
                var result = judgeOpInPos(data)
                if(result){
                   if(self.canChose){
                       self.canChose = false
                       setVis1(2)
                    }
                }
                return result
            },
            end:function(){
                self.canChose = true
            }
        })

        node.FnBtn.addClickEventListener(function(){
            if(!self.fnTip){
                self.fnTip = createShowImg({
                                img:res.fntip,
                            })
                self.addChild(self.fnTip)
            }
            self.fnTip.show()
        })
        
        var coinList = [node.coin1,node.coin2,node.coin3]
        self.coinCose = true
        self.coinCount = 0
        for (var i = 0; i < coinList.length; i++) {
            coinList[i].initPos = coinList[i].getPosition()
            createTouchEvent({
                item:coinList[i],
                begin:function(data){
                    var item = data.item
                    if(self.coinCose){
                        self.coinCose = false
                        item.setLocalZOrder(LOCAL_ORDER++)
                        return true
                    }
                },
                autoMove:true,
                end:function(data){
                    var item = data.item
                    self.coinCose = true
                    if(judgeItemCrash({item1:item,item2:node.coinTest}))
                    {
                        if(node.exp1){
                           node.exp1.removeFromParent()
                           node.exp1 = null
                        }
                        if(!node.exp2){
                           node.exp2 = new cc.Sprite("#gx00.png")
                           node.exp2.setPosition(530.74,306.51)
                           node.exp2.setScale(0.9891,1)
                           node.addChild(node.exp2,1)
                           node.exp2.playSelf = function(num){
                                var frames = [{s:0,e:5},{s:6,e:10},{s:11,e:15}]
                                var ac = createAnimation({
                                          frame:"gx%02d.png",
                                          start:frames[num].s,
                                          end:frames[num].e,
                                          time: 0.03,
                                        })
                                this.runAction(ac)
                           }
                        }
                        self.nodebs.stopSay()
                        node.exp2.playSelf(self.coinCount++)
                        node.coinTest.y = node.coinTest.y - self.coinCount*20
                        item.removeFromParent()
                    }else{
                        item.setPosition(item.initPos)
                    }
                }
            })
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi4")
            })
        }
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            this.nodebs.say({
                key: key,
                force: true
            })  
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }    
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 110)
        })
        this.addChild(this.nodebs,500)
        
        addContent({
            people: this.nodebs,
            key:"wenzi4",
            img:res.wenzi4,
            sound:res.zimp4
          })

        addContent({
            people: this.nodebs,
            key:"wenzi5",
            sound:res.zimp5
          })

        addContent({
            people: this.nodebs,
            key:"wenzi6",
            sound:res.zimp6
          })
    }
})