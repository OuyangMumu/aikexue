/**
 * Created by Administrator on 2016/5/31.
 */
var indexList = {
    niuPaper:0,
    canPaper:1,
    daPaper:2,
    baoPaper:3,
    gasket:4,
}
var tableFlag = true
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        var exp1Table = true
        tableFlag = true
        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    var child = getMyTable()
                    self.biaoge = child
                    if(exp1Table) {
                        exp1Table = false
                        if (child.getParent()) {
                            child.retain()
                            child.removeFromParent(false)
                            self.addChild(child, 1000)
                            child.release()
                        } else {
                            self.addChild(child, 1000)
                            child.showIn()
                        }
                    }else{
                        if(tableFlag){
                            child.showIn()
                            tableFlag = false
                        }else{
                            child.showOut()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl:{},
    myDelete: function() {
        var self = this
        stopMusic()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
    },

    initUI:function(){
        var self = this
        var dataControl = self.dataControl
        self.createTool()

        this.nodebs.show(function() {
            self.nodebs.say({
                key: "do1"
            })
        })

        var bottle = new cc.Sprite(res.btytdz_do1_bottle)
        bottle.setPosition(cc.p(250,100))
        self.addChild(bottle,10)

        loadPlist("xms")
        loadPlist("fms")
        loadPlist("water")
        loadPlist("nzWater")
        loadPlist("czWater")
        loadPlist("dzWater")
        loadPlist("bzWater")

        var dg = new cc.Sprite("#dg0001.png")
        dg.setPosition(cc.p(303,155))
        self.addChild(dg,9)

        var digai = new cc.Sprite(res.digai)
        digai.setPosition(cc.p(250,190))
        self.addChild(digai,9)
        digai.setVisible(false)

        var aniNode = new cc.Sprite()
        aniNode.setPosition(cc.p(17,0))
        self.addChild(aniNode,8)

        var nzNode = new cc.Sprite()
        nzNode.setPosition(cc.p(500,300))
        self.addChild(nzNode,8)
        var czNode = new cc.Sprite()
        czNode.setPosition(cc.p(800,300))
        self.addChild(czNode,8)
        var dzNode = new cc.Sprite()
        dzNode.setPosition(cc.p(500,100))
        self.addChild(dzNode,8)
        var bzNode = new cc.Sprite()
        bzNode.setPosition(cc.p(800,100))
        self.addChild(bzNode,8)

        digai.setTag(11)
        dg.setTag(12)
        var dgOut = false
        var haveWater = false
        var dgMove = true
        dataControl.paperPosX = 0
        dataControl.paperPosY = 0
        dataControl.haveWater = haveWater
        dataControl.dgOut = dgOut
        dataControl.dg = dg
        dataControl.nzNode = nzNode
        dataControl.czNode = czNode
        dataControl.dzNode = dzNode
        dataControl.bzNode = bzNode
        self.paperWater = [false,false,false,false]
        self.havePaper = [false,false,false,false]

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if(target.getTag() == 12)
                    rect = cc.rect(0, s.height/2, s.width, s.height/2)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if(target.getTag() == 11) {
                        if(!dgOut && !haveWater){
                            dgMove = false
                            dg.runAction(anixms())
                        }else if(!dgOut && haveWater){
                            dg.setSpriteFrame("dg0010.png")
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                if(target.getTag() == 11) {
                    if (!dgOut) {
                        if (digai.y < 190 || !dgMove)   return
                        digai.y += delta.y
                        dg.y += delta.y
                        if (digai.y > 275)
                            dgOut = true
                    }else if(dgOut){
                        digai.y += delta.y
                        digai.x += delta.x
                        dg.y += delta.y
                        dg.x += delta.x
                    }
                }


                if(target.getTag() == 12 && dgOut){
                    dg.x += delta.x
                    dg.y += delta.y
                    if(dgOut && self.checkdistans(dg,250,150,50)) {
                        digai.setPosition(cc.p(250, 190))
                        dg.setPosition(cc.p(303, 155))
                        dgOut = false
                        if(haveWater)
                            dg.setSpriteFrame("dg0011.png")
                        else if(!haveWater)
                            dg.setSpriteFrame("dg0001.png")
                    }
                }
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.getTag() == 11){
                    if(!dgOut){
                        digai.setPosition(cc.p(250,190))
                        dg.setPosition(cc.p(303,155))
                        dg.setSpriteFrame("dg0001.png")
                    }else if(dgOut) {//self.checkdistans(dg,250,150,50)
                        digai.setPosition(cc.p(250, 190))
                        //dg.setPosition(cc.p(303, 155))
                        //dgOut = false
                    }
                    if(!dgOut && haveWater){
                        dg.setSpriteFrame("dg0011.png")
                    }
                }else if(target.getTag() == 12){
                    if(self.havePaper[0] && haveWater && self.checkdistans(dg,500,300,130)){
                        if(!self.paperWater[0]){
                           self.dialogTip()
                            return
                        }
                        dgOut = false
                        dg.setPosition(cc.p(550,420))
                        dg.runAction(anifms())
                        aniNode.setPosition(cc.p(dg.x-54,dg.y-95))
                        aniNode.runAction(aniWater())
                        dataControl.nzNode.runAction(aninzWater())
                        self.paperWater[0] = false
                        haveWater = false
                    }else if(self.havePaper[1] &&haveWater && self.checkdistans(dg,800,300,130)){
                        if(!self.paperWater[1]){
                            self.dialogTip()
                            return
                        }
                        dgOut = false
                        dg.setPosition(cc.p(850,410))
                        dg.runAction(anifms())
                        aniNode.setPosition(cc.p(dg.x-54,dg.y-95))
                        aniNode.runAction(aniWater())
                        dataControl.czNode.runAction(aniczWater())

                        self.paperWater[1] = false
                        haveWater = false
                    }else if(self.havePaper[2] &&haveWater && self.checkdistans(dg,500,100,130)){
                        if(!self.paperWater[2]){
                            self.dialogTip()
                            return
                        }
                        dgOut = false
                        dg.setPosition(cc.p(550,210))
                        dg.runAction(anifms())
                        aniNode.setPosition(cc.p(dg.x-54,dg.y-95))
                        aniNode.runAction(aniWater())
                        dataControl.dzNode.runAction(anidzWater())

                        self.paperWater[2] = false
                        haveWater = false
                    }else if(self.havePaper[3] &&haveWater && self.checkdistans(dg,800,100,130)){
                        if(!self.paperWater[3]){
                            self.dialogTip()
                            return
                        }
                        dgOut = false
                        dg.setPosition(cc.p(852.82,217.61))
                        dg.runAction(anifms())
                        aniNode.setPosition(cc.p(dg.x-54,dg.y-95))
                        aniNode.runAction(aniWater())
                        dataControl.bzNode.runAction(anibzWater())

                        self.paperWater[3] = false
                        haveWater = false
                    }
                }
            }
        })
        cc.eventManager.addListener(listener, digai)
        cc.eventManager.addListener(listener.clone(), dg)

        var anixms = function() {
            return cc.sequence(createAnimation({
                frame: "dg%04d.png",
                end: 10,
                time:0.01
            }), cc.callFunc(function() {
                dg.stopAllActions()
                dg.setSpriteFrame("dg0010.png")
                dgMove = true
                haveWater = true
            }))
        }
        var anifms = function() {
            return cc.sequence(createAnimation({
                frame: "dg%02d.png",
                end: 8,
            }), cc.callFunc(function() {
                dg.stopAllActions()
                dg.setSpriteFrame("dg08.png")
                haveWater = false
                dgOut = true
            }))
        }
        var aniWater = function() {
            return cc.sequence(createAnimation({
                frame: "water%02d.png",
                end: 10,
            }), cc.callFunc(function() {
                aniNode.stopAllActions()
                aniNode.setSpriteFrame("water11.png")
            }))
        }
        var aninzWater = function() {
            return cc.sequence(createAnimation({
                frame: "nzWater%02d.png",
                time:0.3,
                end: 35,
            }), cc.callFunc(function() {
                dataControl.nzNode.stopAllActions()
                dataControl.nzNode.setSpriteFrame("nzWater35.png")
            }))
        }
        var aniczWater = function() {
            return cc.sequence(createAnimation({
                frame: "czWater%02d.png",
                time:0.3,
                end: 20,
            }), cc.callFunc(function() {
                dataControl.czNode.stopAllActions()
                dataControl.czNode.setSpriteFrame("czWater20.png")
            }))
        }
        var anidzWater = function() {
            return cc.sequence(createAnimation({
                frame: "dzWater%02d.png",
                time:0.3,
                end: 17,
            }), cc.callFunc(function() {
                dataControl.dzNode.stopAllActions()
                dataControl.dzNode.setSpriteFrame("dzWater17.png")
            }))
        }
        var anibzWater = function() {
            return cc.sequence(createAnimation({
                frame: "bzWater%02d.png",
                time:0.3,
                end: 15,
            }), cc.callFunc(function() {
                dataControl.bzNode.stopAllActions()
                dataControl.bzNode.setSpriteFrame("bzWater15.png")
            }))
        }

    },

    dialogTip:function(){
        dialogControl.AddDialog("Tips", {
            res: res.do1_tip2,
            face: 2,
            confirmBtn:true
        });
    },

    createTool:function(){
        var self = this
        var dataControl = self.dataControl;
        var paperMove = [true,true,true,true]
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.btytdz_tool_1, res.btytdz_tool_2, res.btytdz_tool_3, res.btytdz_tool_4],
            //gets: [res.btytdz_tool_nz, res.btytdz_tool_cz, res.btytdz_tool_dz, res.btytdz_tool_bz],
            gets: [null, null, null, null],
            reTouch:function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                item.setPosition(pos)
                paperMove[index] = true
                self.paperWater[index] = true
                self.removeWater(index)
                self.havePaper[index] = true
                return item
            },
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                self.paperWater[index] = true
                self.havePaper[index] = true
                switch (index){
                    case indexList.niuPaper:
                        item = new cc.Sprite(res.btytdz_do1_nz)
                        break
                    case indexList.canPaper:
                        item = new cc.Sprite(res.btytdz_do1_cz)
                        break
                    case indexList.daPaper:
                        item = new cc.Sprite(res.btytdz_do1_dz)
                        break
                    case indexList.baoPaper:
                        item = new cc.Sprite(res.btytdz_do1_bz)
                        break
                }
                return item
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(!paperMove[index])      return
                item.x += delta.x
                item.y += delta.y
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                self.getPaperPosition(index)
                item.setPosition(cc.p(dataControl.paperPosX,dataControl.paperPosY))
                paperMove[index] = false
            },
            backfun:function(){
                return false
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
    },

    initPeople: function () {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,100);

        addContent({
            people: this.nodebs,
            key: "do1",
            sound: res.btytdz_do1_sound,
            img: res.do1_tip
        })
    },

    checkdistans:function(target1,pos_x,pos_y,dis){
        var dx = (target1.x-50) - pos_x
        var dy = (target1.y-93) - pos_y
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        if(distance <= dis){
            return true
        }else
            return false
    },

    getPaperPosition:function(index) {
        var dataControl = this.dataControl
        var positionData = [
            {index:0,posX:500,posY:300},
            {index:1,posX:800,posY:300},
            {index:2,posX:500,posY:100},
            {index:3,posX:800,posY:100},
        ]

        for(var i =0; i< positionData.length; i++){
            var temp = positionData[i]
            if(index == temp.index){
                dataControl.paperPosX = temp.posX
                dataControl.paperPosY = temp.posY
            }
        }
    },

    removeWater:function(index){
        var dataControl = this.dataControl
        switch (index){
            case 0:
                dataControl.nzNode.stopAllActions()
                dataControl.nzNode.setSpriteFrame("nzWater36.png")
                break
            case 1:
                dataControl.czNode.stopAllActions()
                dataControl.czNode.setSpriteFrame("nzWater36.png")
                break
            case 2:
                dataControl.dzNode.stopAllActions()
                dataControl.dzNode.setSpriteFrame("nzWater36.png")
                break
            case 3:
                dataControl.bzNode.stopAllActions()
                dataControl.bzNode.setSpriteFrame("nzWater36.png")
                break
        }
    }
})