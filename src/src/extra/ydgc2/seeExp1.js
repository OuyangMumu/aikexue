var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()

        return true
    },
    initUI:function(){
        var self = this
        //界面初始化
        var bindParent = function(node){
            var len = node.getChildrenCount()
            var children = node.getChildren()
            for(var i=0; i<len; i++){
                var childname = children[i].getName()
                node[childname] = children[i]
                bindParent(children[i])
            }
        } 

        this.node = ccs.load(res.see1).node
        bindParent(this.node)
        this.addChild(this.node)
        
        var node = this.node
        node.tanjiuBtn.addClickEventListener(function(){
              self.nodebs.say({
                  key: "jielun2",
              })
        })
        createTouchEvent({
          item:node.discretion.tipbg,
          begin:function(){
            if(!self.tip1){
                var tip1 = createResult({
                    img:res.jielun1,
                    offset: cc.p(50,40),
                    offbg: cc.p(70,90),
                    btnfun:function(){
                        addShowType({
                            item: self.tip1,
                            show: "zoom",
                            time: 0.3,
                            fun: function() {
                              self.tip1.setPosition(getMiddle())
                              removeMoving(self.tip1)
                              self.nodebs.stopSay()
                            }
                        })
                    }
                })
                tip1.setScale(0)
                tip1.setPosition(getMiddle())
                tip1.setLocalZOrder(LOCAL_ORDER++)
                tip1.changeSelfLocalZero = function(){
                    this.setLocalZOrder(LOCAL_ORDER++)
                }
                self.tip1 = tip1
                self.addChild(self.tip1)
            }
            if(self.tip1.getScale()==1){
                addShowType({
                    item:self.tip1,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        self.tip1.setPosition(getMiddle())
                        removeMoving(self.tip1)
                        self.nodebs.stopSay()
                    }
                })      
            }else{
                self.tip1.stopAllActions()
                addShowType({
                    item:self.tip1,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        self.tip1.setLocalZOrder(LOCAL_ORDER++)
                        addMoving(self.tip1)
                        self.nodebs.say({
                            key: "jielun1",
                        })
                    }
                })    
            }
            return true
          }
        })

        var bingArg = function(cir){
          cir.initPos = cir.getPosition()
          cir.shanRoto = cir.shans.getRotationX()
          cir.spRoto = cir.shans.sp.getRotationX()
        }
        var setbingArg = function(cir){
          cir.setPosition(cir.initPos)
          cir.setVisible(false)
          cir.shans.setRotation(cir.shanRoto)
          cir.shans.sp.setRotation(cir.spRoto)
        }
        node.allCircle.init = function(){
          var cir = this.criclebg
          var cir1 = this.criclebg1
          var cir2 = this.criclebg2
          cir.blackLine1.setScaleX(0)
          cir.blackLine2.setScaleX(0)
          cir.blackLine1.runAction(cc.sequence(
            cc.scaleTo(1,0.86,0.5),
            cc.callFunc(function(){
                cir.blackLine2.runAction(cc.sequence(
                  cc.scaleTo(1,0.86,0.5),
                  cc.callFunc(function(){
                    self.initMyBtn()
                  })
               ))
            })
          ))
          bingArg(cir)
          bingArg(cir1)
          bingArg(cir2) 
        }
        node.allCircle.reset = function(){
           var cir = this.criclebg
           var cir1 = this.criclebg1
           var cir2 = this.criclebg2
           setbingArg(cir)
           setbingArg(cir1)
           setbingArg(cir2)
           cir.setVisible(true)
           this.tishi1.setOpacity(0)
           this.tishi2.setVisible(false)
           this.tishi3.setVisible(false)
           this.tishi4.setVisible(false)
        }
        node.allCircle.playAc = function(){
          var cir = this.criclebg
          var cir1 = this.criclebg1
          var cir2 = this.criclebg2
          var inself = this
          this.reset()
          cir.shans.runAction(cc.sequence(
              cc.rotateTo(1,90),
              cc.callFunc(function(){
                 cir1.setVisible(true)
                 inself.tishi1.runAction(cc.fadeIn(0.3))
                 cir.runAction(cc.sequence(
                    cc.moveBy(1,cc.p(-200,0)),
                    cc.callFunc(function(){
                       inself.tishi4.setVisible(true)
                    })
                  ))
              })    
          ))
          cir.shans.sp.runAction(cc.sequence(
              cc.rotateTo(1,-90),
              cc.delayTime(1.5),
              cc.callFunc(function(){
                    cir1.shans.runAction(cc.sequence(
                         cc.rotateTo(1,120),
                         cc.callFunc(function(){
                            cir2.setVisible(true)
                            inself.tishi3.setVisible(true)
                            cir2.runAction(cc.moveBy(1,cc.p(200,0)))
                         })    
                    ))

                    cir1.shans.sp.runAction(cc.sequence(
                       cc.rotateTo(1,-120),
                       cc.delayTime(1.5),
                       cc.callFunc(function(){
                           cir2.shans.runAction(cc.rotateTo(1,120))
                           cir2.shans.sp.runAction(cc.sequence(
                              cc.rotateTo(1,-120),
                              cc.callFunc(function(){
                                 self.playbtn.setVisible(true)
                                 inself.tishi2.setVisible(true)
                              })
                           ))
                       })
                    ))
              })
          ))   
        }
        node.allCircle.init()
    },
    initMyBtn:function(endFrame){
      var self = this
      var node = self.node
      if(!self.playbtn){
          self.playbtn = new ccui.Button(res.btn_play_normal,res.btn_play_select)
          self.playbtn.setPosition(835,190)
          self.playbtn.setScale(0.9)
          self.addChild(self.playbtn)
          self.playbtn.addClickEventListener(function(){
             self.playbtn.setVisible(false)
             node.allCircle.playAc()
             self.playbtn.loadTextureNormal(res.btn_restart_normal)
             self.playbtn.loadTexturePressed(res.btn_restart_select)
          })
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
              people: this.nodebs,
              key: "jielun1",
              sound:res.jielunmp1,
        })

        addContent({
           people: this.nodebs,
           key: "jielun2",
           img:res.jielun2,
           id:"result",
           sound: res.jielunmp2,
           offset: cc.p(40, 30),
           offbg: cc.p(40,50),
        })
    }
})