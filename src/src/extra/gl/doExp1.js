var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
    	var self = this
        self.createTool()
    },

    createTool:function(){
        loadPlist("toolPlist")
        loadPlist("waterRise")
        loadPlist("lzzk_Plist")
        loadPlist("xp_Plist")
        loadPlist("filter_nitu")
        loadPlist("fpOpen")
        var self = this
        var uiList = ["tj","tjq","wenzi","btn_operate"]
        var node = loadNode(res.gl_do1_json,uiList)
        self.inside_node.addChild(node)
        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })
        node.btn_operate.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })
        var tj = node.tj
        var tjq = node.tjq
        var tipJudge = [true,false,false,false,false]
        var toolbtn = createTool({
            pos: cc.p(140, 510),
            nums: 3,
            scale:0.8,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1,1,1],
            swallow: [true, true, true, true, true, true],
            files: [res.tools_1, res.tools_2, res.tools_3, res.tools_4, res.tools_5, res.tools_6],
            gets: ["#sb_1.png", "#ld_1.png", "#lzzk01.png", "#xp01.png","#blb.png","#nt.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                item.setScale(0.85)
                if(index != 0 && tipJudge[0]){
                    self.nodebs.say({key:"do1_tip_1",force:true})
                    return false
                }else if(index != 1 && tipJudge[1]){
                    self.nodebs.say({key:"do1_tip_2",force:true})
                    return false
                }else if(index != 2 && tipJudge[2]){
                    self.nodebs.say({key:"do1_tip_3",force:true})
                    return false
                }else if(index != 3 && tipJudge[3]){
                    self.nodebs.say({key:"do1_tip_4",force:true})
                    return false
                }else if(index != 4 && tipJudge[4]){
                    self.nodebs.say({key:"do1_tip_5",force:true})
                    return false
                }
                    
                if(index == 0){
                    var sb_water = new cc.Sprite("#waterRise01.png")
                    sb_water.setPosition(53.71,57)
                    item.addChild(sb_water)
                    sb_water.setName("sb_water")
                    var sb_2 = new cc.Sprite("#sb_2.png")
                    sb_2.setPosition(65.32,66)
                    item.addChild(sb_2)
                }else if(index == 1){
                    var ld_2 = new cc.Sprite("#ld_2.png")
                    ld_2.setPosition(54,110)
                    item.addChild(ld_2)
                }else if(index == 2){
                    item.setScale(1)
                    item.zk = false
                }else if(index == 3){
                    item.setScale(1)
                }
                return item
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
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
                if(index == 0){
                    if (checkDistans(item,tj,150)) {
                        item.disMove(true)
                        safeAdd(tj,item)
                        item.setPosition(124,100)
                        self.nodebs.say({key:"do1_tip2",force:true})
                        tipJudge[0] = false
                        tipJudge[1] = true
                    }
                }else if(index == 1){ //漏斗
                    if (cc.rectIntersectsRect(item,tj)) {
                        safeAdd(tj,item)
                        safeAdd(tj,tjq)
                        item.disMove(true)
                        item.setPosition(77,400)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.5,77,211),
                            cc.callFunc(function(){
                                self.nodebs.say({key:"do1_tip3",force:true})
                                tipJudge[1] = false
                                tipJudge[2] = true
                            })
                            ))
                    }
                }else if(index == 2 && !item.noMove){//滤纸
                    if(!item.zk){
                        item.disMove(true)
                        item.zk = true
                        item.runAction(anilz(item))
                    }else if(checkDistans2(item,tj,150)){ 
                        item.disMove(true)
                        safeAdd(tj,item)
                        safeAdd(tj,tjq)
                        item.setPosition(77,330)
                        item.runAction(cc.sequence(
                            cc.moveTo(0.4,77,280),
                            cc.callFunc(function(){
                                self.nodebs.say({key:"do1_tip4",force:true})
                                tipJudge[2] = false
                                tipJudge[3] = true
                            })
                        ))
                    }
                }else if(index == 3){  //洗瓶
                    if(checkDistans2(item,tj,150)){
                        item.disMove(true)
                        item.setPosition(640,340)
                        item.runAction(anixp(item))
                    }
                }else if(index == 4){  //玻璃棒
                    if(checkDistans2(item,tj,250)){
                        safeAdd(tj,item)
                        item.disMove(true)
                        item.setPosition(0,390)
                        self.nodebs.say({key:"do1_tip6",force:true})
                        tipJudge[4] = false
                    }
                }else if(index == 5){//泥土
                    if(checkDistans3(item,tj,150)){
                        item.disMove(true)
                        item.setPosition(633,410)
                        item.runAction(ani("filter_nitu%02d.png",16,item))
                        //水杯中的水开始上升
                        var sb_water = toolbtn.getindex(0).getChildByName("sb_water")
                        sb_water.runAction(ani("waterRise%02d.png",19))
                        toolbtn.getindex(2).runAction(anilznitu())
                    }
                }

            }
        });
    this.addChild(toolbtn)
    toolbtn.show()

    var anilz = function(item) {
        return cc.sequence(createAnimation({
            frame: "lzzk%02d.png",
            end: 12,
            time: 0.2
        }), cc.callFunc(function() {
            item.setScale(0.85)
            item.setSpriteFrame("lz.png")
            item.setPositionY(item.y+22)
            item.disMove(false)
        }))
    }

    var anixp = function(item) {
        return cc.sequence(createAnimation({
            frame: "xp%02d.png",
            end: 13,
            time: 0.15
        }), cc.callFunc(function() {
            item.removeFromParent(true)
            self.nodebs.say({key:"do1_tip5",force:true})
            tipJudge[3] = false
            tipJudge[4] = true
        }))
    }

    var ani = function(frame,end,item) {
        return cc.sequence(createAnimation({
            frame: frame,
            end: end,
            time: 0.23
        }), cc.callFunc(function() {
            if (end != 19)
                item.removeFromParent(true)
            if (end == 19) {
                toolbtn.getindex(4).setVisible(false)
                var lz = toolbtn.getindex(2)
                lz.runAction(cc.sequence(
                    cc.moveTo(0.3, cc.p(lz.x,lz.y + 100)),
                    cc.moveTo(0.7, cc.p(lz.x + 200,lz.y + 100)),
                    cc.callFunc(function () {  //最后将滤纸展开
                        lz.runAction(anilzzk(lz))
                    })
                ))
            }
            })
        )}

    var anilznitu = function(){
        return cc.sequence(createAnimation({
            frame: "fp_nitu%02d.png",
            end: 5,
            time: 0.3
        }))
    }

    var anilzzk = function(item) {
        return cc.sequence(createAnimation({
            frame: "fpOpen%02d.png",
            end: 11,
            time: 0.15
        }), cc.callFunc(function() {
            item.setSpriteFrame("last_nitu.png")
            node.wenzi.setVisible(true)
            node.wenzi.runAction(cc.sequence(
                cc.callFunc(function(){self.nodebs.say({key:"wenzi",force:true})}),
                cc.delayTime(6),
                cc.callFunc(function(){self.nodebs.say({key:"do1_tip7",force:true})})
                ))
        }))
    }

    var  checkDistans = function(item1,item2,dis) {
        var dx = item1.x - item1.x
        var dy = item1.y - (item2.y - item2.height/2)
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        if (distance <= dis)
            return true
        else
            return false
        }

    var  checkDistans2 = function(item1,item2,dis) {
        var dx = item1.x - item1.x
        var dy = item1.y - item2.y+30
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        if (distance <= dis)
            return true
        else
            return false
        }
    var  checkDistans3 = function(item1,item2,dis) {
        var dx = item1.x - item1.x
        var dy = item1.y - (item2.y+100)
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        if (distance <= dis)
            return true
        else
            return false
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
            {key:"do1_tip6",img:res.do1_tip6,sound:res.do1_sound6},
            {key:"do1_tip7",img:res.do1_tip7,sound:res.do1_sound7},
            {key:"do1_tip_1",img:res.do1_tip_1,sound:res.do1_sound_1},
            {key:"do1_tip_2",img:res.do1_tip_2,sound:res.do1_sound_2},
            {key:"do1_tip_3",img:res.do1_tip_3,sound:res.do1_sound_3},
            {key:"do1_tip_4",img:res.do1_tip_4,sound:res.do1_sound_4},
            {key:"do1_tip_5",img:res.do1_tip_5,sound:res.do1_sound_5},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "wenzi",
            sound: res.do1_sound_wenzi,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.result,
            sound: res.do1_result_sound,
            id:"result"
        })
        
    },
})