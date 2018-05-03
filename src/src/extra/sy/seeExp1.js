var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.sy_tableNode_json,
                            scale: 0.9,
                            inputNum:24,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("see1_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"see1_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        createSp("#tip.png", cc.p(630,600), self)
        var child = createSp("#tasteChild.png", cc.p(640,-350), self)
        child.setLocalZOrder(10)
        child.hand = createSp("#huishou01.png", cc.p(75,83), child)
        child.tip = createSp("#tasteBg.png", cc.p(-118,208), child)
        child.taste = createSp("#taste1.png", cc.p(-140,211), child)
        var btn_close = new ccui.Button(res.btn_tipclose_normal,res.btn_tipclose_select)
        btn_close.setPosition(-35,235)
        child.addChild(btn_close)
        btn_close.setScale(0.5)
        btn_close.addClickEventListener(function(){
            child.setPositionY(-350)
        })
        var curCup = null
        var toolbtn = createTool({
            pos: cc.p(280, 510),
            nums: 4,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4,
                    res.do_tools5,res.do_tools6,res.do_tools7,res.do_tools8],
            gets: ["#tools_1.png","#tools_2.png","#tools_3.png","#tools_4.png",
                    "#tools_5.png","#tools_6.png","#tools_7.png","#tools_8.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                item.gai = createSp(inf[index].gaiImg, inf[index].gaiPos, item)
                if(curCup){
                    curCup.forceBack(false)
                }
                curCup = item
                curCup.index = index
                item.gai.index = index
                gaiFun(item.gai)
                item.noMove = false
                child.setPositionY(-350)
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(!item.gai.in)
                    return false

                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                item.setPosition(550,150)

            },
            backfun:function(data){
                curCup = null
                return true
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var gaiFun = function(gai){
            gai.in = true
            gai.touch = true
            createTouchEvent({
                item:gai,
                begin:function(data){
                    var item = data.item
                    if(!item.touch)     return false
                    item.touch = false
                    if(item.in){
                        item.runAction(cc.sequence(
                            cc.moveTo(0.3,item.x,item.y+80),
                            cc.delayTime(0.2),
                            cc.rotateTo(0.2,180),
                            cc.delayTime(0.1),
                            cc.moveTo(0.3,300,30),
                            cc.callFunc(function(){
                                item.touch = true
                                item.in = false
                                child.setPositionY(350)
                                playMusic(inf[item.index].sound)
                                child.hand.runAction(cc.sequence(
                                    ani(),
                                    ani(),
                                    ani()
                                ))
                                child.taste.setSpriteFrame(inf[item.index].taste)
                            })
                        ))
                    }else{
                        item.runAction(cc.sequence(
                            cc.moveTo(0.3,inf[item.index].gaiPos.x,inf[item.index].gaiPos.y+80),
                            cc.delayTime(0.1),
                            cc.rotateTo(0.2,0),
                            cc.delayTime(0.2),
                            cc.moveTo(0.2,inf[item.index].gaiPos.x,inf[item.index].gaiPos.y),
                            cc.callFunc(function(){
                                child.setPositionY(-350)
                                item.touch = true
                                item.in = true
                            })
                        ))
                    }
                    return true
                }
            })
        }

        var ani = function() {
            return cc.sequence(createAnimation({
                frame: "huishou%02d.png",
                start: 1,
                end: 4,
                time:0.15,
            }))
        }

        var inf = [
            {gaiImg: "#gai1.png",gaiPos: cc.p(74,225),taste: "taste1.png",sound: res.see1_sound1},
            {gaiImg: "#gai1.png",gaiPos: cc.p(74,225),taste: "taste2.png",sound: res.see1_sound2},
            {gaiImg: "#gai1.png",gaiPos: cc.p(74,225),taste: "taste3.png",sound: res.see1_sound3},
            {gaiImg: "#gai1.png",gaiPos: cc.p(74,225),taste: "taste4.png",sound: res.see1_sound4},
            {gaiImg: "#gai3.png",gaiPos: cc.p(75,260),taste: "taste5.png",sound: res.see1_sound5},
            {gaiImg: "#gai2.png",gaiPos: cc.p(74,225),taste: "taste6.png",sound: res.see1_sound6},
            {gaiImg: "#gai2.png",gaiPos: cc.p(74,225),taste: "taste7.png",sound: res.see1_sound7},
            {gaiImg: "#gai2.png",gaiPos: cc.p(74,225),taste: "taste8.png",sound: res.see1_sound8},
        ]
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_tip1",img: res.do_tools9,sound:res.see1_sound9},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})