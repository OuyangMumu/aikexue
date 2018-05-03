var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this

        var btn_result = new ccui.Button("res/btn/btn_jielun_normal.png","res/btn/btn_jielun_select.png")
        btn_result.setPosition(1060,460)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do2_tip3"})
        })

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        
        self.createTool()

        var paper = new cc.Sprite(res.paper)
        paper.setPosition(568,150)
        self.addChild(paper)
    },

    createTool:function(){
        var self = this
        loadPlist("huasheng_plist")
        loadPlist("feirou_plist")

        var hand = new cc.Sprite("#hand_huasheng01.png")
        hand.setPosition(568,-600)
        self.addChild(hand,20)

        var haveItem = false
        var curItem = null
        var judgeOver = [false,false]

        var toolbtn = createTool({
            pos: cc.p(380, 540),
            nums: 2,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1],
            swallow: [true, true],
            files: [res.do2_tools1, res.do2_tools2],
            gets: ["#huasheng01.png","#feirou01.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(!haveItem){
                    if(curItem)
                        curItem.setPositionY(-600)
                    item.index = index
                    curItem = null
                    curItem = item
                    haveItem = true
                    return item
                }   
                else
                    return false
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                itemCallFun(item,index)
            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                itemCallFun(item,index)
                return false
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
        self.toolbtn = toolbtn

        var itemCallFun = function(item,index){
            var item = item
            var index = index
            item.setPosition(568,150)
            item.noMove = true
            judgeOver[index] = true
            if(index == 0){
                item.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        hand.setPosition(600,290)
                        hand.runAction(ani("hand_huasheng%02d.png",14,0.3))
                    }),
                    cc.delayTime(0.5),
                    ani("huasheng%02d.png",8,0.5),
                    cc.callFunc(function(){
                        hand.setPositionY(-600)
                        haveItem = false
                        judgeSay()
                    })
                ))
            }else if(index == 1){
                item.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        hand.setPosition(600,290)
                        hand.runAction(ani("hand_feirou%02d.png",16,0.3))
                    }),
                    cc.delayTime(0.62),
                    ani("feirou%02d.png",10,0.42),
                    cc.callFunc(function(){
                        hand.setPositionY(-600)
                        haveItem = false
                        judgeSay()
                    })
                ))
            }
        }

        var judgeSay = function(){
            if(judgeOver[0] && judgeOver[1]){
                self.nodebs.say({key:"do2_tip2",force:true})
            }
        }

        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time:time
            }), cc.callFunc(function() {
                
            }))
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
            {key:"do2_tip2",img:res.do2_tip2,sound:res.do2_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do2_tip3",
            img: res.do2_tip3,
            sound: res.do2_sound3,
            id: "result",
        })
    },
})