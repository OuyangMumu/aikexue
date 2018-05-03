/**
 * Created by Administrator on 2016/6/29.
 */
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor()
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl:{},
    initUI: function () {
        loadPlist("do2_jinyu")
        loadPlist("dms")
        loadPlist("xms")
        loadPlist("kms")
        loadPlist("tms")
        loadPlist("qipao")

        var self = this
        var resultBtn = new ccui.Button("res/btn/btn_get_normal.png","res/btn/btn_get_select.png")
        resultBtn.setPosition(1070,480)
        self.addChild(resultBtn)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do2_tip"})
        })
        resultBtn.addClickEventListener(function(){
            self.nodebs.say({key:"Result"})
        })
        var yugang = new cc.Sprite(res.yugang)
        yugang.setPosition(568.8,243.36)
        self.addChild(yugang)

        var kms = new cc.Sprite("#kms08.png")
        kms.setPosition(400,270)
        self.addChild(kms)

        var jinyu = new cc.Sprite("#do1_jinyu01.png")
        jinyu.setPosition(600,255)
        self.addChild(jinyu)
        var xms = new cc.Sprite("#xms12.png")
        xms.setPosition(410,250)
        self.addChild(xms)
        var tms = new cc.Sprite("#tms11.png")
        tms.setPosition(510,210)
        self.addChild(tms)
        var qipao = new cc.Sprite("#qipao01.png")
        qipao.setPosition(395,280)
        self.addChild(qipao)

        var shui = new cc.Sprite(res.gangshui2)
        shui.setPosition(567,215)
        self.addChild(shui)
        var shui2 = new cc.Sprite(res.gangshui)
        shui2.setPosition(565,237.91)
        self.addChild(shui2)

        var dg = new cc.Sprite("#dms17.png")
        dg.setPosition(cc.p(245,122))
        self.addChild(dg)

        var digai = new cc.Sprite(res.digai)
        digai.setPosition(cc.p(200,195))
        self.addChild(digai)
        digai.setVisible(false)

        var bottle = new cc.Sprite(res.moshui)
        bottle.setPosition(cc.p(200,100))
        self.addChild(bottle)

        var canmove = true
        dg.dg = true
        digai.digai = true

        var anijinyu = function () {
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: "do1_jinyu%02d.png",
                end: 12,
                time: 0.05
            })))
        }
        var aniqipao = function () {
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: "qipao%02d.png",
                end: 12,
                time: 0.2
            })))
        }
        jinyu.runAction(anijinyu())
        qipao.runAction(aniqipao())

        var dgOut = false
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var item = event.getCurrentTarget()
                var locationInNode = item.convertToNodeSpace(touch.getLocation())
                var s = item.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if(item.dg)
                    rect = cc.rect(0, s.height/2+ s.height/4, s.width, s.height/2)
                else
                    rect = cc.rect(0-s.width,0-s.height,s.width*4,s.height*4)
                if(item.digai && dgOut)
                    return false
                if (canmove && cc.rectContainsPoint(rect, locationInNode)) {
                    if(item.digai){
                        dg.setSpriteFrame("dms01.png")
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var item = event.getCurrentTarget()
                var delta = touch.getDelta()
                if(item.digai && !dgOut){
                    if ((digai.y+ delta.y) > 194){
                        digai.y += delta.y
                        dg.y += delta.y
                        if (digai.y > 245)
                            dgOut = true
                    }
                }
                if((item.dg || item.digai) && dgOut){
                    var temp = cc.p(dg.x + delta.x, dg.y + delta.y)
                    if(temp.x >0 && temp.y > 175 && temp.x < 360) {
                        if(dg.x > 300 && dg.y > 380){
                            canmove = false
                            //dg.pause()
                            dg.setPosition(440,470)
                            dg.runAction(anidms())
                        }
                        dg.x += delta.x
                        dg.y += delta.y
                        if (item.dg && checkdistans(bottle, dg, 30)) {
                            dg.setPosition(cc.p(245, 122))
                            dg.setSpriteFrame("dms17.png")
                            dgOut = false
                        }
                    }
                }
            },
            onTouchEnded: function(touch, event) {
                var item = event.getCurrentTarget()
                if(item.digai){
                    digai.setPosition(200,195)
                    if(!dgOut){
                        dg.setPosition(cc.p(245,122))
                        dg.setSpriteFrame("dms17.png")
                        dgOut = false
                    }
                }
            }
        })
        cc.eventManager.addListener(listener, digai)
        cc.eventManager.addListener(listener.clone(), dg)

        var anidms = function() {
            return cc.sequence(createAnimation({
                frame: "dms%02d.png",
                end: 16,
                time:0.1
            }), cc.callFunc(function() {
                //dg.resume()
                digai.setPosition(200,195)
                dg.setPosition(cc.p(245,122))
                dg.setSpriteFrame("dms17.png")
                dgOut = false
                kms.runAction(anikms())
            }))
        }
        var anikms = function() {
            return cc.sequence(createAnimation({
                frame: "kms%02d.png",
                end: 7,
                time:0.2
            }), cc.callFunc(function() {
                kms.setSpriteFrame("kms08.png")
                xms.runAction(anixms())
                kms.scheduleOnce(function(){
                    tms.runAction(anitms())
                },0.3)
            }))
        }

        var anixms = function() {
            return cc.sequence(createAnimation({
                frame: "xms%02d.png",
                end: 12,
                time:0.15
            }), cc.callFunc(function() {
                canmove = true
            }))
        }
        var anitms = function() {
            return cc.sequence(createAnimation({
                frame: "tms%02d.png",
                end: 11,
                time:0.15
            }), cc.callFunc(function() {
            }))
        }

        var checkdistans = function(target1,target2,dis){
            var dx =  target1.x - (target2.x-50)
            var dy = (target1.y+36) - (target2.y-36)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }
    },

    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "do2_tip",
            img: res.do2_tip,
            sound: res.do2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.do2_tip2,
            sound: res.do2_sound2,
            id: "result",
        })
    }
})