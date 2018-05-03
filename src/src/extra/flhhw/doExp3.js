var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                    var bg = createBiaoge({
                        json: res.flhhw_tableNode3_json,
                        scale: 0.9,
                        downData: {
                            nums: 2,
                            scale: 1.5,
                            bufs: [
                                [null, res.table3_wz1, res.table3_wz2],
                                [null, res.table3_wz1, res.table3_wz2],
                            ],
                            keys: [
                                1, 2
                            ]
                        },
                    })
                    var that = bg
                    createBgMoveSp({
                        father:that,
                        imgs:[
                            [res.draw_1,2],
                            [res.draw_2,1],
                            [res.draw_3,0],
                        ],
                        pos:cc.p(170,200),
                        dis:200,
                        //itemScale:0.9,
                        resultfather:self,
                        rectlist:[
                           cc.rect(230,340,200,150),
                        ]
                    })
                    bg.upLoadFun = function(){
                        that.upResult(function(){
                            var down1 = bg.down1
                            var down2 = bg.down2
                            return down1 && down2 && down1.getAnswer() && down2.getAnswer()
                        })
                    }
                    bg.ClearFun = function(){
                        that.clearData()
                    }
                    self.addChild(bg)
                    self.bgg = bg
                   }
                   var bg = self.bgg
                   bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("diguan_plist")
        loadPlist("kuosan_plist")
        loadPlist("dishui_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })
        var createSp = function(sprite,pos){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            self.addChild(sp)
            return sp
        }
        var zhuozi = createSp(res.zhuozi, cc.p(568,250))
        zhuozi.setScale(1.15)
        var leftPaper = createSp("#paper.png", cc.p(350,350))
        var rightPaper = createSp("#paper.png", cc.p(650,350))
        rightPaper.setScaleX(-1)
        leftPaper.judge = true
        rightPaper.judge = true

        var paperList = [leftPaper,rightPaper]
        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        //黑墨水
        self.createDiguan({
            cupImg: "#heimo.png",
            cupPos: cc.p(350,60),
            fullDg: "heidiguan10.png",
            startDg: "heidiguan01.png",
            endDg: "heidiguan09.png",
            xmsImg: "heidiguan%02d.png",
            diguan: "#heidiguan01.png",
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                for(var i = 0 ; i < paperList.length ; i++){
                    if(dg.haveWater && paperList[i].judge && checkDistance(dg,paperList[i],80)){
                        var paper = paperList[i]
                        paper.judge = false
                        dg.haveWater = false
                        dg.noMove = true
                        self.call({
                            kuosanImg: "#hei_kuosan01.png",
                            diaoluoImg: "#heiluo01.png",
                            diaoluoPlist: "heiluo%02d.png",
                            dg: dg,
                            paper: paper,
                            diguanPlist: "heidiguan%02d.png",
                            firstDiguan: "heidiguan01.png",
                            digai: digai,
                            kuosanPlist: "hei_kuosan%02d.png",
                        })
                    }
                }   
            }
        })
        //绿墨水
        self.createDiguan({
            cupImg: "#lvmo.png",
            cupPos: cc.p(600,60),
            fullDg: "lvdiguan10.png",
            startDg: "lvdiguan01.png",
            endDg: "lvdiguan09.png",
            xmsImg: "lvdiguan%02d.png",
            diguan: "#lvdiguan01.png",
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                for(var i = 0 ; i < paperList.length ; i++){
                    if(dg.haveWater && paperList[i].judge && checkDistance(dg,paperList[i],80)){
                        var paper = paperList[i]
                        paper.judge = false
                        dg.haveWater = false
                        dg.noMove = true
                        self.call({
                            kuosanImg: "#lv_kuosan01.png",
                            diaoluoImg: "#lvluo01.png",
                            diaoluoPlist: "lvluo%02d.png",
                            dg: dg,
                            paper: paper,
                            diguanPlist: "lvdiguan%02d.png",
                            firstDiguan: "lvdiguan01.png",
                            digai: digai,
                            kuosanPlist: "lv_kuosan%02d.png",
                        })
                    }
                }   
            }
        })

        var fsAni = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: time,
                rever:true,
            }))
        }

        var checkDistance = function(r1,r2,dis){
            var pos = getWorldPos(r1)
            var dx = pos.x+r1.width/2 - r2.x
            var dy = pos.y-r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        self.call = function(data){
            var kuosanImg = data.kuosanImg
            var diaoluoImg = data.diaoluoImg
            var diaoluoPlist = data.diaoluoPlist
            var dg = data.dg
            var paper = data.paper
            var diguanPlist = data.diguanPlist
            var firstDiguan = data.firstDiguan
            var digai = data.digai
            var kuosanPlist = data.kuosanPlist

            var kuosan = new cc.Sprite(kuosanImg)
            kuosan.setPosition(137,90)
            paper.addChild(kuosan)
            var diaoluo = new cc.Sprite(diaoluoImg)
            diaoluo.setPosition(132, 126)
            paper.addChild(diaoluo)
            diaoluo.runAction(cc.repeatForever(ani(diaoluoPlist,1,5,0.2)))
            
            var father = dg.getParent()
            dg.setLocalZOrder(10)
            safeAdd(self, dg)
            dg.setPosition(paper.x-60,paper.y+160)
            dg.runAction(cc.sequence(
                fsAni(diguanPlist,2,9,0.3),
                cc.callFunc(function(){
                    dg.setLocalZOrder(-1)
                    safeAdd(father, dg)
                    dg.setPosition(-8,135)
                    dg.setSpriteFrame(firstDiguan)
                    digai.digai = false
                    diaoluo.stopAllActions()
                    diaoluo.setVisible(false)
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    var dishui = createSp("#dishui01.png",cc.p(paper.x+65,paper.y+180))
                    if(!self.wenzi)
                        self.wenzi = createSp("#do3_wenzi.png",cc.p(450,150))
                    self.wenzi.setVisible(true)
                    kuosan.runAction(cc.sequence(
                        cc.delayTime(1),
                        ani(kuosanPlist,1,13,0.25)
                    ))
                    dishui.runAction(cc.sequence(
                        ani("dishui%02d.png",1,11,0.3),
                        cc.callFunc(function(){
                            dishui.setPositionY(-300)
                            self.wenzi.setVisible(false)
                        })
                    ))
                })
            ))
        }
    },

    createDiguan : function(data){
        var self = this
        var dgMoveFun = data.dgMoveFun
        var cupPos = data.cupPos
        var diguan = data.diguan
        var cupImg = data.cupImg//"#waterCup.png"
        var fullDg = data.fullDg//"dgWater.png"
        var startDg = data.startDg//"diWater01.png"
        var endDg = data.endDg//"diWater06.png"
        var xmsImg = data.xmsImg//"diWater%02d.png"
        //var biaoqian = data.biaoqian

        var cup = new cc.Sprite(cupImg)
        cup.setPosition(cupPos)
        self.addChild(cup)
        // var biaoqian = new cc.Sprite(biaoqian)
        // biaoqian.setPosition(38,27)
        // cup.addChild(biaoqian)

        var dg = new cc.Sprite(diguan)
        dg.setPosition(-8,135)
        cup.addChild(dg)
        dg.setLocalZOrder(-1)
        var digai = new cc.Sprite("#digai.png")
        digai.setPosition(50,173)
        cup.addChild(digai)
        digai.setLocalZOrder(10)
        digai.setVisible(false)


        digai.digai = true
        dg.dg = true
        dg.dgOut = false  //判断滴管是否出了瓶子
        dg.haveWater = false //判断滴管是否有水
        dg.dgMove = true  //判断滴管在瓶内不能移动
        dg.noMove = false //判断滴管不能移动
        digai.noMove = false
        cup.noMove = false //判断玻璃瓶不能移动

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if(target.dg)
                    rect = cc.rect(0, s.height/2, s.width, s.height/2)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if(target.digai) {
                        //reAdd(cup)
                        if(!dg.dgOut && !dg.haveWater){
                            dg.dgMove = false
                            dg.runAction(anixms())
                        }else if(!dg.dgOut && dg.haveWater){
                            digai.noMove = false
                            dg.setSpriteFrame(endDg)
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                if(target.digai && !digai.noMove) {
                    if (!dg.dgOut) {
                        if (digai.y+delta.y < 170 || !dg.dgMove)   return
                            digai.y += delta.y
                            dg.y += delta.y
                            if (digai.y > 240){
                                dg.dgOut = true
                                cup.noMove = true
                                //reAdd(dg)
                            }
                    }else if(dg.dgOut && !dg.noMove){
                        digai.y += delta.y
                        digai.x += delta.x
                        dg.y += delta.y
                        dg.x += delta.x
                        //自定义滴管移动方法
                        if(dgMoveFun)
                            dgMoveFun({
                            dg:dg,
                            digai:digai,
                        })
                    }
                }

                if(target.dg && dg.dgOut && !dg.noMove){
                    dg.x += delta.x
                    dg.y += delta.y
                    if(dg.dgOut && checkDistance(dg,cup)) {
                        digai.setPosition(50,173)
                        dg.setPosition(-8,135)
                        dg.dgOut = false
                        cup.noMove = false
                        digai.noMove = false
                        dg.setLocalZOrder(-1)
                        if(!dg.haveWater)
                            dg.setSpriteFrame(startDg)
                        else if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                    }

                    //自定义滴管移动方法
                    if(dgMoveFun)
                        dgMoveFun({
                            dg:dg,
                            digai:digai,
                        })
                }
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.digai){
                    if(!dg.dgOut){
                        digai.setPosition(50,173)
                        dg.setPosition(-8,135)
                        dg.setLocalZOrder(-1)
                        if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                        else
                            dg.setSpriteFrame(startDg)
                        digai.noMove = false
                    }else if(dg.dgOut) {
                        digai.setPosition(50,173)
                        digai.noMove = true
                    }
                }
            }
        })
        cc.eventManager.addListener(listener, digai)
        cc.eventManager.addListener(listener.clone(), dg)

        var anixms = function() {
            return cc.sequence(createAnimation({
                frame: xmsImg,
                end: 9,
                time:0.01
            }), cc.callFunc(function() {
                dg.dgMove = true
                dg.haveWater = true
            }))
        }

        var checkDistance = function(ra,rb){
            var pos = rb.convertToWorldSpace(ra.getPosition())
            var dx = (pos.x+ra.width/2-10) - rb.x
            var dy = (pos.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
                return true
            }else{
                return false
            }
        }

        return cup
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do3_tip1",img:res.do3_tip1,sound:res.do3_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})