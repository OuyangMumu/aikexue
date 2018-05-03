//@author mu @16/5/11
//创建平板弹簧测力计
//创建弹簧
var createSpring = function(data){
    var data = data || {}
    var num = data.num || 10
    var scale = data.scale || 0.5
    var behandimg1 = data.behandimg1
    var behandimg2 = data.behandimg2
    var thTouch_endFun = data.endFun
    var thTouch_beginFun = data.beginFun
    var thTouch_moveFun = data.moveFun
    var xishu = data.xishu
    var behPos = data.behPos || cc.p(0,0)
    var prePos = data.prePos || cc.p(0,0)
    var startPos = data.startPos || cc.p(0,0)
    var segDis = data.segDis || -20
    var showstart = data.showstart
    if(showstart==null){
        showstart = true
    }

    var preforimg1 = data.preforimg1 
    var preforimg2 = data.preforimg2 

    var spring = new cc.Node()
    spring.xishu = xishu
    spring.prefor = []
    spring.behand = []

    var GG = new cc.Sprite(res.tangou1)
    GG.setPosition(-40,31)
    spring.addChild(GG,1)
    GG.initPos = GG.getPosition()
    spring.GG = GG

    var hideGou = new cc.Sprite(res.guaGou3)
    hideGou.setPosition(4.1,67.16)
    GG.addChild(hideGou)
    hideGou.setVisible(false)
    spring.hideGou = hideGou

    var startBeh = new cc.Sprite(behandimg1)
    startBeh.setPosition(-48+startPos.x,1+startPos.y)
    startBeh.setAnchorPoint(0,0.75)
    spring.addChild(startBeh,3)
    startBeh.setVisible(showstart)

    for (var i = 0; i < num; i++) {
        var beh = new cc.Sprite(behandimg2)
        beh.setAnchorPoint(0,1)
        beh.initPos = cc.p(behPos.x-95,segDis * i - 4  + behPos.y)
        beh.setPosition(beh.initPos)
        spring.addChild(beh,3)
        beh.setScale(0.95,0.8)
        spring.behand[i] = beh

        var pre = new cc.Sprite(preforimg2)
        pre.setAnchorPoint(1,1)
        pre.initPos = cc.p(prePos.x+0,segDis * i + prePos.y)
        pre.setPosition(pre.initPos)
        pre.setScale(1,0.8)
        spring.addChild(pre,5)
        spring.prefor[i] = pre
    }

    var endPre = new cc.Sprite(preforimg1)
    endPre.setAnchorPoint(1,1)
    endPre.initPos = cc.p(0,segDis * num)
    endPre.setPosition(endPre.initPos)
    spring.addChild(endPre,5)

    var downGou = new cc.Sprite(res.tangou2)
    downGou.setAnchorPoint(0.8,1)
    downGou.initPos = cc.p(-50,endPre.y-6)
    downGou.setPosition(downGou.initPos)
    spring.addChild(downGou,2)

    var gua = new cc.Sprite(res.tangou3)
    gua.setPosition(113,30)
    downGou.addChild(gua)
    gua.setScale(0.77)
    gua.initPos = gua.getPosition()
    gua.setVisible(false)
    spring.gua = gua

    var guaFather = new cc.Node()
    guaFather.setPosition(115,0)
    downGou.addChild(guaFather)
    guaFather.setScale(2.5)
    spring.guaFather = guaFather
    guaFather.childCount = 0
    guaFather.endSp = null

    var famaGouHide = new cc.Sprite(res.guaGou3)
    famaGouHide.setPosition(101.2,12.06)
    downGou.addChild(famaGouHide)
    famaGouHide.setScale(0.6458)
    //力和系数
    spring.FntoChange = function(Fn,cv){
        var cv = cv || 20
        var angle = Fn / cv

        startBeh.setRotation(angle)
        for (var i = 0; i < spring.prefor.length; i++) {
            spring.prefor[i].setRotation(-angle) 
            spring.behand[i].setRotation(angle)
            if(i>=1){
                spring.prefor[i].y = spring.prefor[i-1].y + segDis - angle/5*14
                spring.behand[i].y = spring.behand[i-1].y + segDis - angle/5*14
                spring.behand[i].x = spring.behand[i-1].x
            }else{
                spring.prefor[i].y = spring.prefor[i].initPos.y - angle
                spring.behand[i].y = -4 - angle*1.4 - angle
                spring.behand[i].x = spring.behand[i].initPos.x + angle//+ Math.pow(2,angle/5)
            }
        }
        endPre.setRotation(-angle)
        endPre.y = spring.prefor[spring.prefor.length-1].y + segDis - angle/5*14
    }
    spring.FntoChange1 = function(Fn,cv){
        var cv = cv || 20
        var angle = Fn / cv

        startBeh.setRotation(angle)
        for (var i = 0; i < spring.prefor.length; i++) {
            spring.prefor[i].setRotation(-angle) 
            spring.behand[i].setRotation(angle)
            if(i>=1){
                spring.prefor[i].y = spring.prefor[i-1].y + segDis - angle/8*12
                spring.behand[i].y = spring.behand[i-1].y + segDis - angle/8*12
                spring.behand[i].x = spring.behand[i-1].x
            }else{
                spring.prefor[i].y = spring.prefor[i].initPos.y - angle
                spring.behand[i].y = -4 - angle*1.7
                spring.behand[i].x = spring.behand[i].initPos.x +angle/3.5//angle//+ Math.pow(2,angle/5)
            }
        }
        endPre.setRotation(-angle)
        endPre.y = spring.prefor[spring.prefor.length-1].y + segDis - angle/8*12
    }
    spring.setScale(scale)
    return spring
}
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
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
                      json: res.biao2,
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

        if(!self.drawN){
            self.drawN = new cc.DrawNode()
            self.addChild(self.drawN)
            self.drawN.drawMyLine = function(data){
                var myDraw = this
                var pos1 = data.pos1
                var pos2 = data.pos2
                var pos3 = data.pos3
                var pos4 = data.pos4
                myDraw.clear()
                myDraw.drawSegment(pos1,pos2,1,cc.color(255,255,255))
                myDraw.drawSegment(pos3,pos4,1,cc.color(255,255,255))
                myDraw.drawDot(pos3,2,cc.color(255,255,255))
            }
        }

        var tht1 = new cc.Sprite(res.tht)
        tht1.setPosition(230,250)
        self.addChild(tht1)

        var th1 = self.createTanHuang()
        th1.setPosition(280,422)
        th1.setScale(0.25)
        self.addChild(th1)

        var cover1 = new cc.Sprite(res.cover)
        cover1.setPosition(275,443)
        self.addChild(cover1)

        var Fdj1 = self.createFdj()
        Fdj1.setPosition(120,430)
        self.addChild(Fdj1)

        var gou1 = new cc.Sprite(res.hl_tou)
        gou1.setPosition(280,335)
        self.addChild(gou1)
        gou1.setOpacity(0)
        gou1.toChange = function(weight){
            var num = weight/100
            th1.addWeightToChange(num)
            Fdj1.addWeightToChange(num)
        }


        var tht2 = new cc.Sprite(res.tht1)
        tht2.setPosition(460,250)
        self.addChild(tht2)

        var hls1 = new cc.Sprite(res.hls1)
        hls1.setPosition(493,320)
        self.addChild(hls1)
        hls1.initY = hls1.getPositionY()

        var th2 = self.createTanHuang({
            showHand:true,
            showTouch:true,
            moveFun:function(data){
                var item = data.item
                var delta = data.delta
                var tempy = item.baba.y + delta.y
                if(tempy>=560){
                    tempy = 560
                }else if(tempy<=380){
                    tempy = 380
                }
                item.baba.y = tempy
                var del = tempy - item.baba.initY
                hls1.y = hls1.initY + del/2
                self.drawN.drawMyLine({
                    pos1:cc.p(475,441),
                    pos2:cc.p(hls1.x-hls1.width/2+4,hls1.y),
                    pos3:cc.p(th2.x,th2.y-90),
                    pos4:cc.p(hls1.x+hls1.width/2-4,hls1.y)
                })
            }
        })
        th2.setPosition(512,480)
        th2.setScale(0.25)
        self.addChild(th2)
        th2.initY = th2.getPositionY()

        var Fdj2 = self.createFdj()
        Fdj2.setPosition(750,430)
        self.addChild(Fdj2)

        var gou2 = new cc.Sprite(res.hl_tou)
        gou2.setPosition(21,8)
        hls1.addChild(gou2)
        gou2.setOpacity(0)

        gou2.toChange = function(weight){
            var num = weight/200
            th2.addWeightToChange(num)
            Fdj2.addWeightToChange(num)
        }

        var tjtToBalance = function(data){
            var obj = data.obj
            var weight = data.weight
            obj.toChange(weight)
        }
        var famaBox = createFamaBox({
                        famaFater:self,
                        pos:getMiddle(250,-200),
                        guaFamaposList:[cc.p(4.5,-9),cc.p(4.5,-11.5)],
                        maxFn:[5,10],
                        sprites:[gou1,gou2],
                        addWidgetFun:tjtToBalance,
                        removeWidgetFun:tjtToBalance,
                        overFnBack:function(){
                            self.speakeBykey("tips1",1)
                        }
                    })

        self.drawN.drawMyLine({
                pos1:cc.p(475,441),
                pos2:cc.p(hls1.x-hls1.width/2+4,hls1.y),
                pos3:cc.p(th2.x,th2.y-90),
                pos4:cc.p(hls1.x+hls1.width/2-4,hls1.y)
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
            thz.y = -53*weight
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