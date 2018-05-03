//@author mu @16/5/11

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
       var self = this;
        var uinamelist = [
           "biao","fen","shi","miao","lazhu",
           "ximie_btn","dianran_btn","faxian_btn",
           "dianrannode","hcg","denghuo","sphua1","rx",
           "sphua2","luosi","dengxin","duanxian","duanxian2"
        ]
        var node = loadNode(res.zglzz_do2,uinamelist);
        self.allnode = node
        self.addChild(node)

        var initSp = function(data){
            var  sp = data.sp
            var uppos = data.uppos || 405.1
            var downpos = data.downpos || 321.1
            var drawFunc = data.drawFunc
             createTouchEvent({
                item:sp,
                begin:function(){
                    return true
                },
                move:function(data){
                   var item = data.item
                   var delta = data.delta
                   var temp = item.y + delta.y
                   if(temp >= uppos){
                         temp = uppos
                    }      
                    if(temp <= downpos){
                         temp = downpos
                    }
                    item.y = temp
                    if(drawFunc)
                     drawFunc(data)              
                }
             })
        }
        
        initSp({
            sp:node.sphua1,
            drawFunc:function(data){
                var item = data.item
                if(self.drawLine)
                self.drawLine.drawLine({
                    startpos:cc.p(item.x-18.2,item.y-1),
                    endpos:cc.p(node.sphua2.x+15.9,node.sphua2.y-3.5)
                })
                var abs = Math.abs(node.sphua2.y-node.sphua1.y-2.5)
                var dy = node.sphua2.y - 469 + Math.sqrt(361*361+abs*abs)
             if(self.drawLine1)
                self.drawLine1.drawLine({
                    startpos:cc.p(node.sphua2.x+24.9,node.sphua2.y-6.5),
                    endpos:cc.p(737,dy)
                })
                node.luosi.y = dy
            }
        })
        initSp({
            sp:node.sphua2,
            drawFunc:function(data){
               var item = data.item
               if(self.drawLine)
                self.drawLine.drawLine({
                    startpos:cc.p(node.sphua1.x-18.2,node.sphua1.y-1),
                    endpos:cc.p(item.x+15.9,item.y-3)
                })
                var abs = Math.abs(node.sphua2.y-node.sphua1.y-2.5)
                var dy = node.sphua2.y - 469 + Math.sqrt(361*361+abs*abs)
                if(self.drawLine1)
                self.drawLine1.drawLine({
                    startpos:cc.p(item.x+24.5,item.y-7),
                    endpos:cc.p(737,dy)
                })
                node.luosi.y = dy
            }
        })
    
        var drawlines = function(data){
            var startpos = data.startpos
            var endpos = data.endpos
            if(this){
                this.clear()
                this.drawSegment(startpos,endpos,1,cc.color(250,0,0)) 
            }     
        }
        this.drawLine = new cc.DrawNode()
        self.addChild(this.drawLine)
        this.drawLine.drawLine = drawlines   
        this.drawLine.drawLine({
            startpos:cc.p(367,404),
            endpos:cc.p(728,404.5)
        })


        this.drawLine1 = new cc.DrawNode()
        self.addChild(this.drawLine1)
        this.drawLine1.drawLine = drawlines
        this.drawLine1.drawLine({
            startpos:cc.p(737,401),
            endpos:cc.p(737,296)
        })
      

        this.drawLine2 = new cc.DrawNode()
        node.sphua2.addChild(this.drawLine2)
        if(this.drawLine2)
        this.drawLine2.drawQuadBezier(cc.p(44,22),cc.p(55,23),cc.p(53,18),60,2,cc.color(250,0,0))

        node.biao.runSelf = function(data) {
            var miao = data.miao
            var fen = data.fen
            var shi = data.shi
            var fun = data.fun
            this.setVisible(true)
            this.schedule(function() {
                miao.setRotation(miao.getRotationX() + 0.5)
                fen.setRotation(fen.getRotationX() + 1 / 120)
                shi.setRotation(shi.getRotationX() + 1 / 720)
                if (fen.getRotationX() >= 18)
                    if (fun)
                        fun()
            }, 1 / 80);
        }
        node.biao.stopSelf = function() {
            this.unscheduleAllCallbacks()
            this.removeFromParent()
        }
        
        node.biao.runSelf({
            miao:node.miao,
            fen:node.fen,
            shi:node.shi
        })

        this.otherUI()

    },
    stopDraw:function(){
        var self = this
        self.drawLine.clear()
        self.drawLine1.clear()
        self.drawLine2.clear()
        self.drawLine.removeFromParent()
        self.drawLine  = null
        self.drawLine1.removeFromParent()
        self.drawLine1 = null
        self.drawLine2.removeFromParent()
        self.drawLine2 = null
    },
    getMidpos:function(pos1,pos2){
        var dx = (pos2.x+pos1.x)/2
        var dy = (pos2.y+pos1.y)/2
        return cc.p(dx,dy)
    },
    otherUI:function(){
        var self = this
        var node = this.allnode
        node.hcg.setVisible(false)
        node.denghuo.setVisible(false)
        var huoAc = ccs.load(res.zglzz_huoxin).action
        huoAc.gotoFrameAndPlay(0,38)
        node.denghuo.runAction(huoAc) 

        node.dianrannode.isFirst = true
        node.dianrannode.playDianran = function(){
            var inself = this
            var hcg = this.getChildByName("hcg")
            hcg.setVisible(true)
            this.setPosition(node.denghuo.x+45,node.denghuo.y-1)
            hcg.runAction(cc.sequence(
                cc.moveBy(0.3,cc.p(-53,0)),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                  node.denghuo.setVisible(true)
                  inself.addTimer()
                }),
                cc.moveBy(0.3,cc.p(53,0)),
                cc.callFunc(function(){
                    hcg.setVisible(false)
                })
            ))
        }

        node.dianrannode.xiMie = function(){
            var hcg = this.getChildByName("hcg")
            hcg.setVisible(false)
            this.setPosition(node.denghuo.x+45,node.denghuo.y-1)
            var ximeAc = ccs.load(res.zglzz_chuimie).action
            ximeAc.setCurrentFrame(0)
            ximeAc.gotoFrameAndPlay(0,25,false)
            ximeAc.setLastFrameCallFunc(function(){
                ximeAc.clearLastFrameCallFunc()
                node.denghuo.setVisible(false)
            })
            this.unscheduleAllCallbacks()
            this.runAction(ximeAc)
        }
        node.dianrannode.addTimer = function(){
            var inself = this
            node.dianrannode.schedule(function(){

                   var lazhuscale = node.lazhu.getScaleY()
                   node.lazhu.setScaleY(lazhuscale-0.00035)//0.00035
                   node.denghuo.y = node.denghuo.y - 0.053
                   node.dengxin.y = node.dengxin.y - 0.051
                   if(node.lazhu.getScaleY()<=0.06){
                       inself.unscheduleAllCallbacks()
                       node.denghuo.runAction(cc.scaleTo(1,0))
                       setBtnEnable(node.ximie_btn,false)
                       setBtnEnable(node.dianran_btn,false)
                   }

                   var midpos = self.getMidpos(node.sphua1,node.sphua2)
                   //----测试画点
                   //self.drawLine1.drawDot(midpos,5,cc.color(0,250,0))
                   if(midpos.y>= node.denghuo.y+10 && midpos.y <= node.denghuo.y+20){
                         if(inself.isFirst){
                            inself.isFirst = false
                            node.luosi.setVisible(false)
                            inself.playDuanxian()
                            self.stopDraw()
                         }    
                   }
            })
        }

        node.dianrannode.playDuanxian = function(){
            var lx = node.duanxian.getChildByName("lx00")
            lx.setVisible(true)
            var lxac = ccs.load(res.zglzz_duanxian).action
            lxac.gotoFrameAndPlay(0,32,false)
            node.duanxian.runAction(lxac)

            var rx = node.duanxian2.getChildByName("rx02")
            rx.setVisible(true)
            var rxac = ccs.load(res.zglzz_duanxian).action
            var  curFrame = Math.ceil(26-1/3*(405-node.sphua2.y))
            rxac.gotoFrameAndPlay(0,curFrame,false)
            rxac.setLastFrameCallFunc(function(){
                playMusic(res.hitmusic)
                node.duanxian2.y = 265-node.sphua2.y
                var rxacc = ccs.load(res.zglzz_duanxian).action
                rxacc.setLastFrameCallFunc(function(){
                    node.duanxian2.setVisible(false)
                    node.rx.setVisible(true)
                    rxacc.clearLastFrameCallFunc()
                })
                rxacc.gotoFrameAndPlay(curFrame,26,false)
                node.duanxian2.runAction(rxacc)
                rxac.clearLastFrameCallFunc()
            })
            node.duanxian2.runAction(rxac)
        }
       
        var setBtnEnable = function(btn,btnbool){
             btn.setEnabled(btnbool)
             btn.setBright(btnbool)
        }
        setBtnEnable(node.ximie_btn,false)
        node.dianran_btn.addClickEventListener(function(){
             setBtnEnable(this,false)
             setBtnEnable(node.ximie_btn,true)
             node.dianrannode.playDianran()
        })
        node.ximie_btn.addClickEventListener(function(){
             setBtnEnable(this,false)
             setBtnEnable(node.dianran_btn,true)
             node.dianrannode.xiMie()
        })
        node.faxian_btn.addClickEventListener(function(){
            self.nodebs.say({
                key: "jielun"   
            })
        })

    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "start",
                    force: true
                })
            self.nodebs.scheduleOnce(function(){
                    self.nodebs.say({
                        key: "next",
                        force: true
                    })
                },5)
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
            key: "start",
            sound: res.zi5mp,
            img: res.wenzi5,
        })
        addContent({
            people: this.nodebs,
            key: "next",
            sound: res.zi6mp,
            img: res.wenzi6,
        })
        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.tip1,
            id:"result",
            sound: res.famp,
            offset: cc.p(25, 30),
            offbg: cc.p(50,50),
        })
    }  
})