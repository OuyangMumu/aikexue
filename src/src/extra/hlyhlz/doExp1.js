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
                      inputNum:4,
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
        var canshow = false
        var tjt = self.createTjt({
            fun:function(data){
                var pos = data.pos
                if(pos.y<=470){
                    if(canshow){
                        canshow = false
                        tjt.initLine()
                    }        
                }
            }
        })
        tjt.setPosition(getMiddle(-140,-10))
        self.addChild(tjt)

        var tjtToBalance = function(data){
            var obj = data.obj
            var weight = data.weight
            obj.FN = weight
            tjt.toChange()
            if(tjt.right_gou.FN==0 && tjt.left_gou.FN==0)
            {
                self.speakeBykey("wenzi2")
                canshow = true
            }
        }

        var famaBox = createFamaBox({
                        famaFater:self,
                        pos:getMiddle(200,-100),
                        guaFamaposList:[cc.p(4.5,-14),cc.p(4.5,-14)],
                        sprites:[tjt.right_gou,tjt.left_gou],
                        addWidgetFun:tjtToBalance,
                        removeWidgetFun:tjtToBalance
                    })       
        tjt.outBackFun(function(judge){
            famaBox.setAllFamaListen(judge)
        })
    },
    createTjt:function(data){
        var data = data || {}
        var fun = data.fun
        var tjt = new cc.Sprite(res.hl_tjt)
        tjt.setCascadeOpacityEnabled(true)

        var lineNode = createLayout({
            size:cc.size(80,800),
            pos:cc.p(46,-410),
            clip:true
        })
        tjt.addChild(lineNode)

        var hl = new cc.Sprite(res.hl)
        hl.setPosition(85,387)
        tjt.addChild(hl)
        var createLine = function(data){
            var pos = data.pos
            var father = data.father
            var fun = data.fun
            var line = new cc.Sprite(res.hl_line)
            line.setAnchorPoint(0.5,0)
            line.setPosition(pos)
            father.addChild(line)

            var gou = new cc.Sprite(res.hl_tou)
            gou.setPosition(7,7)
            line.addChild(gou,5)
            line.gou = gou
            gou.setOpacity(0)

            var gou_hide = new cc.Sprite(res.hl_gou)
            gou_hide.setPosition(3.6,7.2)
            line.addChild(gou_hide,10)

            line.gou.FN = 0
            line.gou.FS = 5

            createTouchEvent({
                item:line,
                rect:cc.rect(-10,0,line.width+20,line.height),
                begin:function(data){
                    if(fun)fun(data)
                }
            })
            return line
        }
        var line_right = createLine({
                            pos:cc.p(69,620),
                            father:lineNode,
                            fun:fun
                        })
        var line_left = createLine({
                            pos:cc.p(10,620),
                            father:lineNode,
                            fun:fun
                        })
        tjt.right_gou = line_right.gou
        tjt.left_gou = line_left.gou

        var zuaHand = new cc.Sprite(res.zuahand1)
        zuaHand.setPosition(137,452)
        tjt.addChild(zuaHand)

        tjt.type = 1
        tjt.anohter = null
        tjt.closehd = false
        tjt.outBack = null
        tjt.outBackFun = function(backfun){
            if(backfun){
                tjt.outBack = backfun
            }
        }
        tjt.initLine = function(){
            line_right.setPosition(69,620)
            line_left.setPosition(10,620)
            tjt.type = 1
            tjt.anohter = null
        }
        tjt.toChange = function(){
            if(tjt.closehd)
                return false
            var rightFn = tjt.right_gou.FN * tjt.right_gou.FS
            var leftFn = tjt.left_gou.FN * tjt.left_gou.FS
            var disTance = 130*tjt.type
            var time = 0.5
            if(tjt.type==1){
                tjt.type = 2
            }
            if(rightFn>leftFn){
                tjt.setTouchJudge(true)
                if(tjt.anohter=="right" || tjt.anohter==null){
                    line_right.runAction(cc.sequence(
                        cc.moveBy(time,cc.p(0,-disTance)),
                        cc.callFunc(function(){
                           tjt.setTouchJudge(false)
                        })
                    ))
                    line_left.runAction(cc.moveBy(time,cc.p(0,disTance)))
                    tjt.anohter="left"
                }else{
                    tjt.setTouchJudge(false)
                }
            }else if(rightFn<leftFn){
                tjt.setTouchJudge(true)
                if(tjt.anohter=="left"|| tjt.anohter==null){
                    line_right.runAction(cc.sequence(
                        cc.moveBy(time,cc.p(0,disTance)),
                        cc.callFunc(function(){
                            tjt.setTouchJudge(false)
                        })
                    ))
                    line_left.runAction(cc.moveBy(time,cc.p(0,-disTance)))
                    tjt.anohter = "right"
                }else{
                    tjt.setTouchJudge(false)
                }  
            }
        }
        tjt.setTouchJudge = function(judge){
            zuaHand.disListen(judge)
            if(tjt.outBack)tjt.outBack(judge)
        }
        createTouchEvent({
            item:zuaHand,
            begin:function(data){
                var item = data.item
                if(!item.zhua){
                    item.zhua = true
                    item.setTexture(res.zuahand2)
                    tjt.closehd = true
                }else{
                    item.zhua = false
                    item.setTexture(res.zuahand1)
                    tjt.closehd = false
                    tjt.toChange()
                }
                return false
            }
        })

        return tjt
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
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
    }  
})