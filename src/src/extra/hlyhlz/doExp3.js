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
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.biao3,
                      inputNum:7,
                      inputSize:26,
                      scale: 0.8
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
        var uiname = ["hls_z1","hls_z2"]
        if(!self.drawN1){
            self.drawN1 = new cc.DrawNode()
            self.addChild(self.drawN1)

            self.drawN2 = new cc.DrawNode()
            self.addChild(self.drawN2)
        }

        var node = loadNode(res.doJson,uiname)
        self.addChild(node)
        node.hls_z1.initY = node.hls_z1.getPositionY()
        node.hls_z2.initY = node.hls_z2.getPositionY()

        var th1node = new cc.Node()
        th1node.setPosition(350,370)
        th1node.setRotation(-145)
        self.addChild(th1node)

        var th1 = self.createTanHuang({
            showHand:true,
            showTouch:true,
            moveFun:function(data){
                var item = data.item
                var delta = data.delta
                var tempy = item.baba.y - delta.y*1.3
                if(tempy<=0){
                    tempy = 0
                }else if(tempy>=95){
                    tempy = 95
                }
                item.baba.y = tempy
                var del = tempy - item.baba.initY
                node.hls_z1.y = node.hls_z1.initY + del
                if(self.drawN1&&self.drawN1.drawMyLine)
                    self.drawN1.drawMyLine()
            }
        })
        th1.setScale(0.25)
        th1node.addChild(th1)
        th1.initY = th1.getPositionY()

        var Fdj1 = self.createFdj()
        Fdj1.setPosition(150,410)
        self.addChild(Fdj1)

        var gou1 = new cc.Sprite(res.hl_tou)
        gou1.setPosition(22,6)
        node.hls_z1.addChild(gou1)
        gou1.setOpacity(0)

        gou1.toChange = function(weight){
            var num = weight/200
            th1.addWeightToChange(num)
            Fdj1.addWeightToChange(num)
        }
        self.drawN1.drawMyLine = function(){
            var myDraw = this
            var pos1 = cc.p(450,517)
            var pos2 = getWorldPos(th1)//cc.p(th1node.x + th1.x,(th1node.y + th1.y-90)*Math.sin(55*Math.PI/180))
            var pos3 = cc.p(466,473)
            var pos4 = cc.p(node.hls_z1.x - node.hls_z1.width/2+4,node.hls_z1.y)
            var pos5 = cc.p(485,514)
            var pos6 = cc.p(node.hls_z1.x + node.hls_z1.width/2-4,node.hls_z1.y)
            myDraw.clear()
            myDraw.drawSegment(pos1,pos2,1,cc.color(255,255,255))
            myDraw.drawSegment(pos3,pos4,1,cc.color(255,255,255))
            myDraw.drawDot(pos3,2,cc.color(255,255,255))
            myDraw.drawSegment(pos5,pos6,1,cc.color(255,255,255))
        }
        self.drawN1.drawMyLine()

        var th2node = new cc.Node()
        th2node.setPosition(650,352)
        th2node.setRotation(-145)
        self.addChild(th2node)

        var th2 = self.createTanHuang({
            showHand:true,
            showTouch:true,
            moveFun:function(data){
                var item = data.item
                var delta = data.delta
                var tempy = item.baba.y - delta.y*1.3
                if(tempy<=0){
                    tempy = 0
                }else if(tempy>=83){
                    tempy = 83
                }
                item.baba.y = tempy
                var del = tempy - item.baba.initY
                node.hls_z2.y = node.hls_z2.initY + del/2
                if(self.drawN2&&self.drawN2.drawMyLine)
                    self.drawN2.drawMyLine()
            }
        })
        th2.setScale(0.25)
        th2node.addChild(th2)
        th2.initY = th2.getPositionY()

        var Fdj2 = self.createFdj()
        Fdj2.setPosition(950,410)
        self.addChild(Fdj2)

        var gou2 = new cc.Sprite(res.hl_tou)
        gou2.setPosition(23,4)
        node.hls_z2.addChild(gou2)
        gou2.setOpacity(0)

        gou2.toChange = function(weight){
            var num = weight/400
            th2.addWeightToChange(num)
            Fdj2.addWeightToChange(num)
        }

        self.drawN2.drawMyLine = function(){
            var myDraw = this
            var pos1 = cc.p(760,510)
            var pos2 = getWorldPos(th2)//cc.p(th1node.x + th1.x,(th1node.y + th1.y-90)*Math.sin(55*Math.PI/180))
            var pos3 = cc.p(793,510)
            var pos4 = cc.p(node.hls_z2.x + node.hls_z2.width/2-4,node.hls_z2.y-16)
            var pos5 = cc.p(node.hls_z2.x - node.hls_z2.width/2+4,node.hls_z2.y-16)
            var pos6 = cc.p(764,472)
            var pos7 = cc.p(790,472)
            var pos8 = cc.p(node.hls_z2.x + node.hls_z2.width/2-8,node.hls_z2.y+24)
            var pos9 = cc.p(node.hls_z2.x - node.hls_z2.width/2+8,node.hls_z2.y+24)
            var pos10 = cc.p(776,442)

            myDraw.clear()
            myDraw.drawSegment(pos1,pos2,1,cc.color(255,255,255))
            myDraw.drawSegment(pos3,pos4,1,cc.color(255,255,255))
            //myDraw.drawDot(pos3,2,cc.color(255,255,255))
            myDraw.drawSegment(pos5,pos6,1,cc.color(255,255,255))
            myDraw.drawSegment(pos7,pos8,1,cc.color(255,255,255))
            myDraw.drawSegment(pos9,pos10,1,cc.color(255,255,255))
        }
        self.drawN2.drawMyLine()

        var tjtToBalance = function(data){
            var obj = data.obj
            var weight = data.weight
            obj.toChange(weight)
        }
        var famaBox = createFamaBox({
                        famaFater:self,
                        pos:getMiddle(-400,-190),
                        guaFamaposList:[cc.p(4.5,-12),cc.p(4.5,-11.5)],
                        maxFn:[10,20],
                        sprites:[gou1,gou2],
                        addWidgetFun:tjtToBalance,
                        removeWidgetFun:tjtToBalance,
                        overFnBack:function(){
                            self.speakeBykey("tips1",1)
                        }
                    })
    },
    createTanHuang:function(data){
        var self = this
        var data = data || {}
        var showHand = data.showHand || false
        var showTouch = data.showTouch || false
        var moveFun = data.moveFun
        var node = new cc.Node()
        var thgz = new cc.Sprite(res.thgz)
        thgz.setPosition(0,-165)
        node.addChild(thgz)

        var spring = createSpring({
                    num:15,
                    behPos:cc.p(51,0),
                    segDis:-12,
                    startPos:cc.p(23,2),
                    behandimg1:res.tanbeh4,
                    behandimg2:res.tanbeh3,
                    preforimg1:res.tanpre4,
                    preforimg2:res.tanpre3
                 })
        spring.setScale(0.6,0.28)
        spring.setPosition(12,51)
        spring.startX = spring.x
        node.addChild(spring)
        
        var thc = new cc.Sprite(res.thc)
        thc.setPosition(0,-101)
        node.addChild(thc)

        var thcs = new cc.Sprite(res.thcs)
        thcs.setPosition(-11.7,179.5)
        node.addChild(thcs)
        thcs.setVisible(showHand)
        thcs.baba = node
        if(showTouch){
            createTouchEvent({
                item:thcs,
                begin:function(){
                    return true
                },
                move:function(data){
                    if(moveFun)moveFun(data)
                },
                end:function(){}
            })
        }

        var thz = new cc.Sprite(res.thz)
        thz.setPosition(0,0)
        node.addChild(thz)
        node.addWeightToChange = function(weight){
            thz.y = -52*weight
            if (weight>=1) {
                spring.setScale(0.6,0.5)
                spring.setPosition(12,45)
                spring.FntoChange1((weight-1)*137,30)
            }else{
                spring.setScale(0.6,0.28+0.22*weight)
                spring.setPosition(12,51-6*weight)
                spring.FntoChange1(0,30)
            }
        }

        return node
    },
    createFdj:function(){
        var self = this
        var node = new cc.Node()
        var drawSp = createClip({
                       toShowimg:res.fdjbg,
                       ShowimgPos:cc.p(0,0),
                       toSencilimg:res.fdjbg,
                       sencilPos:cc.p(0,0),
                       father:node,
                    })
        drawSp.setOpacity(0)
        var th = self.createTanHuang()
        th.setPosition(drawSp.width/2,drawSp.height/2+70)
        drawSp.addChild(th)
        th.initY = th.getPositionY()

        var dingfdj = new cc.Sprite(res.dingfdj)
        node.addChild(dingfdj)

        node.addWeightToChange = function(num){
            th.addWeightToChange(num)
            if(num<=1){
               th.y = th.initY 
           }else{
               th.y = th.initY + (num-1)*50 
           }
        }
        node.setScale(0.8)
        return  node
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
    }  
})