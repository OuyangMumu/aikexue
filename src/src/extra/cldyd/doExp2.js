var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
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
    initUI: function(){
        var self = this
        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);

        var jielunbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        jielunbtn.setPosition(1054,360)
        self.addChild(jielunbtn)
        jielunbtn.addClickEventListener(function(){
            self.nodebs.say({
                key: "jielun"   
            })
        })

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -10),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){
                data.sp.setRotation(30)
                data.sp.showsi = true
                return true;
            },
            backfun:function(data){
               return true
            },
            clickfun:function(data){
                if(!data.sp.showsi)
                    self.jinshusi.setVisible(false)

                return true
            },
            father:toolnode,
            files:[res.tiesi,res.lusi,res.tongsi],
            gets:[res.tie,res.lu,res.tong]
        });
        this.addChild(this.toolbtn,3);

        var shounode = new cc.Node()
        shounode.setPosition(850,200)
        this.addChild(shounode,6)
        shounode.setCascadeColorEnabled(true)
        var shoubeh = new cc.Sprite(res.shoubeh)
        shoubeh.setPosition(-23,-22)
        shounode.addChild(shoubeh,1)
        var shoupre = new cc.Sprite(res.shoupre)
        shounode.addChild(shoupre,3)
        shounode.setVisible(false)

        var cazhi = new cc.Sprite(res.cazhi)
        cazhi.setPosition(850,200)
        this.addChild(cazhi,10)
        self.isrun = true

        self.jinshusi = new cc.Sprite(res.jinshusi)
        this.addChild(self.jinshusi)
        self.jinshusi.setVisible(false)
        var resbian = [res.bian3,res.bian,res.bian2]

        createTouchEvent({
            item:cazhi,
            begin:function(data){
                data.item.setVisible(false)
                shounode.setVisible(true)
                return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               item.x += delta.x
               item.y += delta.y
                shounode.x = item.x
                shounode.y = item.y
            },
            end:function(data){
                var item = data.item
               item.left = item.x - item.width/2
               item.bottom = item.y - item.height/2
               item.right = item.x+item.width/2
               item.top = item.y + item.height/2


              for(var k = 0;k<3;k++){
                  var cursp = self.toolbtn.getindex(k)

                  if(cursp && !cursp.getChildrenCount()){
                      cursp.left = cursp.x - cursp.width/2
                      cursp.bottom = cursp.y - cursp.height/2
                      cursp.right = cursp.x + cursp.width/2
                      cursp.top = cursp.y + cursp.height/2

                      if(judgeCrash(item,cursp,true)){
                          if(self.isrun){
                              item.pause()
                              item.setVisible(false)
                              self.isrun = false
                              self.createAction({
                                  toolnode:toolnode,
                                  shounode:shounode,
                                  cursisp:cursp,
                                  item:item,
                                  resbian:resbian[k]
                              })
                          }
                          return
                      }
                  }
              }
              item.setVisible(true)
              shounode.setVisible(false)
            }
        })

    },

    createAction:function(data){
        var toolnode = data.toolnode
        var shounode = data.shounode
        var cursisp = data.cursisp
        var item = data.item
        var resbian = data.resbian
        var self = this
        cursisp.disMove(true)

        var moca = ccs.load(res.moca).node
        var spnode = moca.getChildByName("spnode")
        var zhuab = moca.getChildByName("zhuabeh")
        var zhuap = moca.getChildByName("zhuapre")
        var shoub = moca.getChildByName("shoubeh")
        var shoup = moca.getChildByName("shoupre")
        var qian1 = moca.getChildByName("qian1")
        var hou1 = moca.getChildByName("hou1")
        var bian = moca.getChildByName("bian")
        moca.setPosition(cursisp.getPosition())
        var initpos = cursisp.getPosition()
        var zhuanode = new cc.Node()
        zhuanode.setPosition(cursisp.x-200,cursisp.y-160)
        self.addChild(zhuanode,6)
        zhuanode.setCascadeOpacityEnabled(true)
        var shoubeh = new cc.Sprite(res.zhuabeh)
        shoubeh.setPosition(14.96,52.16)
        zhuanode.addChild(shoubeh,1)
        var shoupre = new cc.Sprite(res.zhuapre)
        zhuanode.addChild(shoupre,3)
        zhuanode.setOpacity(10)
        zhuanode.runAction( cc.sequence(
            cc.spawn(
                cc.fadeIn(0.3),
                cc.moveBy(0.2,cc.p(70,0))),
            cc.callFunc(function(){
                zhuanode.setVisible(false)
                zhuab.setVisible(true)
                zhuap.setVisible(true)
            })
        ))

        shounode.runAction(cc.sequence(
            cc.moveTo(0.3,cc.p(cursisp.x+119,cursisp.y+71)),
            cc.callFunc(function(){
                self.jinshusi.setVisible(false)
                shounode.setVisible(false)
                shoub.setVisible(true)
                shoup.setVisible(true)
                var seq1 = cc.sequence(
                    cc.repeat(cc.sequence(
                        cc.moveBy(0.4,cc.p(40,80)),
                        cc.moveBy(0.4,cc.p(-40,-80))
                    ), 3),
                    cc.spawn(
                        cc.moveBy(0.3,cc.p(50,0)),
                        cc.fadeOut(0.3)
                    )
                )
                shoub.runAction(seq1)
                var seq2 = cc.sequence(
                    cc.repeat(cc.sequence(
                        cc.moveBy(0.4,cc.p(40,80)),
                        cc.moveBy(0.4,cc.p(-40,-80))
                    ), 3),
                    cc.spawn(
                        cc.moveBy(0.3,cc.p(50,0)),
                        cc.fadeOut(0.3)
                    ),
                    cc.callFunc(function(){
                        zhuab.setVisible(false)
                        zhuap.setVisible(false)
                        zhuanode.setVisible(true)
                        qian1.setVisible(true)
                        hou1.setVisible(true)
                        zhuanode.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveBy(0.3,cc.p(-70,0)),
                                cc.fadeOut(0.3)),
                            cc.callFunc(function(){
                                var mocaAc = ccs.load(res.moca).action
                                mocaAc.gotoFrameAndPlay(0,50,false)
                                mocaAc.setLastFrameCallFunc(function(){
                                    cursisp.retain()
                                    cursisp.removeFromParent(false)
                                    cursisp.setPosition(initpos)
                                    toolnode.addChild(cursisp)
                                    cursisp.release()
                                    moca.removeFromParent()
                                    shounode.setVisible(false)
                                    shounode.setPosition(initpos.x+250,initpos.y+100)
                                    item.setPosition(shounode.getPosition())
                                    item.setVisible(true)
                                    item.resume()
                                    cursisp.disMove(false)
                                    self.isrun = true
                                    self.jinshusi.setPosition(initpos.x-80,initpos.y+120)
                                    self.jinshusi.setVisible(true)
                                    self.jinshusi.setLocalZOrder(100)
                                    cursisp.showsi = false
                                })
                                zhuanode.removeFromParent()
                                moca.runAction(mocaAc)
                            })
                        ))
                    })
                )
                shoup.runAction(seq2)
            })
        ))
        var curpos = spnode.convertToNodeSpace(cursisp.getPosition())
        cursisp.retain()
        cursisp.removeFromParent(false)
        cursisp.setPosition(curpos)
        spnode.addChild(cursisp)
        cursisp.release()
        toolnode.addChild(moca)

        var biansp = new cc.Sprite(resbian)
        biansp.setPosition(30.61,366.52)
        biansp.setOpacity(0)
        biansp.runAction(cc.fadeIn(3))
        biansp.setRotation(-37.44)
        cursisp.addChild(biansp)
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "st",
                    force:true
                })
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
            key: "st",
            sound: res.zi2mp,
            img: res.wenzi2,
        })
        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.tip1,
            id:"result",
            sound: res.tip1mp,
            offset: cc.p(25, 20),
            offbg: cc.p(50,50),
        })
    }
    
})