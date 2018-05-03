var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
    	loadPlist("see2_plist")
    	loadPlist("qiuxing_plist")
    	loadPlist("yuanxing_plist")
        var self = this
        var uiList = ["node1","item_gong","item_yuan","item_qiu",
        			"node_gong","node_yuan","node_qiu"
        			]
        var node = loadNode(res.zgx_seeExp1_json, uiList)
        self.inside_node.addChild(node)
        self.node = node

        self.nodebs.show(function(){
        	self.nodebs.say({key:"see_tip1"})
        })
        self.bg = null
        self.btn_xcs = new ccui.Button(res.btn_xcs_normal,res.btn_xcs_select)
        self.btn_xcs.setPosition(430,110)
        node.node1.addChild(self.btn_xcs)
        self.btn_xcs.addClickEventListener(function(){
            if(!self.bg){
        	   self.xcs()
            }else{
                self.bg.setPosition(getMiddle(0, 20))
            }
            self.nodebs.stopSay()
            node.node1.setPositionY(-1000)
            var btnOff = cc.p(140,0)
            setOff(self.btn_refresh, btnOff)
            setOff(self.btn_help, btnOff)
            setOff(self.btn_home, btnOff)
            self.nodebs.setVisible(false)
        })

        var aniRepeat = function(frame){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:name,
                end: 2,
                time: 0.15,
            })))
        }
        for(var i = 1 ; i < 14 ; i++){
        	var jiao = node.node_gong.getChildByName(sprintf("jiao%d",i))
        	var name = "jiao"+i+"_%d.png"
        	jiao.runAction(aniRepeat(name))
        }
        node.item_gong.setSpriteFrame("select1.png")
        var shapeList = [node.item_gong,node.item_yuan,node.item_qiu]//形状列表
        var aniList = [node.node_gong,node.node_yuan,node.node_qiu]
        self.curIndex = 0
        for(var i = 0 ; i < 3 ; i++){
        	var shape = shapeList[i]
        	shape.index = i
        	createTouchEvent({
        		item:shape,
        		begin:function(data){
        			var item = data.item 
        			var index = item.index
        			if(self.curIndex == index)	return false
        			self.curIndex = index
        			var key = sprintf("see_tip%d",index+1)
        			self.nodebs.say({key:key,force:true})
        			for(var j = 0 ; j < 3 ; j++){
        				if(index == j){
        					switch(j){
        						case 1:
        							aniList[j].stopAllActions()
        							aniList[j].setSpriteFrame("yuanxing01.png")
        							aniList[j].runAction(cc.sequence(
        								cc.delayTime(0.5),
        								ani("yuanxing%02d.png",12,0.15)
        							))
        						break
        						case 2:
        							aniList[j].stopAllActions()
        							aniList[j].setSpriteFrame("qiuxing01.png")
        							aniList[j].runAction(cc.sequence(
        								cc.delayTime(0.5),
        								ani("qiuxing%02d.png",12,0.15)
        							))
        						break
        					}
        					aniList[j].setPositionX(0)
        					item.setSpriteFrame(sprintf("select%d.png",j+1))
        				}else{
        					aniList[j].setPositionX(-1000)
        					shapeList[j].setSpriteFrame(sprintf("normal%d.png",j+1))
        				}
        			}
        			return true
        		}
        	})
        }

        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time:time,
            }))
        }
    },

    xcs:function(){
        var self = this
        // var btnOff = cc.p(140,0)
        // setOff(self.btn_refresh, btnOff)
        // setOff(self.btn_help, btnOff)
        // setOff(self.btn_home, btnOff)
        // self.nodebs.setVisible(false)
        var dataControl = self.dataControl
        var uiList = [
            "btn_answer", "btn_upload", "judge1", "judge2", "judge3","btn_back"
        ]
        var bg = loadNode(res.zgx_seeExp1_json, uiList, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self.inside_node, bg)
        self.bg = bg

        bg.btn_back.addClickEventListener(function(){
            self.bg.setPositionY(-1000)
            self.node.node1.setPosition(568,320)
            var btnOff = cc.p(-140,0)
            setOff(self.btn_refresh, btnOff)
            setOff(self.btn_help, btnOff)
            setOff(self.btn_home, btnOff)
            self.nodebs.setVisible(true)
            cc.log(self.curIndex)
            self.nodebs.say({key:self.addList[self.curIndex].key,force:true})
        })

        var judge1 = bg.judge1
        var judge2 = bg.judge2
        var judge3 = bg.judge3
        var wzdrj_Result = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ]
        var judgeAnswer = function() {
            var judge = this
            if (judge.list) {
                var list = judge.list
                var temp = []
                for (var i = 0; i < list.length; i++) {
                    temp.push(list[i].judgeIndex)
                }
                var contain = function(src) {
                    var answer = judge.answer
                    for (var i = 0; i < answer.length; i++) {
                        if (answer[i] == src) {
                            return true
                        }
                    }
                    return false
                }
                temp = listOrder(temp)
                if (temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        if (!contain(temp[i])) {
                            return false
                        }
                    }
                    return true
                } else {
                    return null
                }
            }
            return null
        }
        var judgeItem = function(data) {
            var judge = this
            var pos = data.pos
            var item = data.item
            var result = judgeInside({
                item: judge,
                pos: pos,
            })
            if (!result) {
                return false
            }
            var index = data.index
            if (!judge.list) {
                judge.list = []
            }
            if (result) {
                item.father = judge
                judge.list.push(item)
                judge.sort()
                return true
            }
        }
        var clear = function() {
            var judge = this
            if (judge.list) {
                var list = judge.list
                for (var i = 0; i < list.length; i++) {
                    list[i].removeFromParent(true)
                    list[i] = null
                }
                judge.list = null
            }
        }
        var del = function(item) {
            var judge = this
            if (judge.list) {
                var list = judge.list
                for (var i = 0; i < list.length; i++) {
                    if (list[i].index == item.index) {
                        list.splice(i, 1)
                        judge.sort()
                        return
                    }
                }
            }
        }
        var sort = function() {
            var judge = this
            var info = [{
                judge: 2,
                devidex: 160,
            }, {
                judge: 3,
                devidex: 160,
            }, {
                judge: 4,
                devidex: 100,
            }, {
                judge: 5,
                devidex: 80,
            }, {
                judge: 6,
                devidex: 65,
            }, {
                judge: 7,
                devidex: 55,
            }, {
                judge: 8,
                devidex: 45,
            }, {
                judge: 9,
                devidex: 40,
            }]
            if (judge.list) {
                var count = 0
                var list = judge.list
                var judgeInfo = null
                for (var i = 0; i < info.length; i++) {
                    if (list.length <= info[i].judge) {
                        judgeInfo = info[i]
                        break
                    }
                }
                if (judgeInfo) {
                    var devidex = judgeInfo.devidex
                    var nums = judgeInfo.judge
                    for (var i = 0; i < list.length; i++) {
                        if (list[i]) {
                            var item = list[i]
                            list[i].setPosition(cc.p(90 + count % nums * devidex, 75))
                            safeAdd(judge, item)
                            count++
                        }
                    }
                }
            } else {
                return
            }
        }
        
        judge1.judgeItem = judgeItem
        judge2.judgeItem = judgeItem
        judge3.judgeItem = judgeItem
        judge1.sort = sort
        judge2.sort = sort
        judge3.sort = sort
        judge1.del = del
        judge2.del = del
        judge3.del = del
        judge1.answer = wzdrj_Result[0]
        judge2.answer = wzdrj_Result[1]
        judge3.answer = wzdrj_Result[2]
        judge1.clear = clear
        judge2.clear = clear
        judge3.clear = clear
        judge1.judgeAnswer = judgeAnswer
        judge2.judgeAnswer = judgeAnswer
        judge3.judgeAnswer = judgeAnswer
        
        var judgeAll = function(data) {
            var pos = data.pos
            var item = data.item
            var index = data.index
            var judgeList = [judge1,judge2,judge3]
            var temp = false
            for (var i = 0; i < judgeList.length; i++) {
                var result = judgeList[i].judgeItem({
                    pos: pos,
                    item: item,
                    index: item.judgeIndex,
                })
                if (result) {
                    temp = true
                    //createBtnFun(item)
                    //cc.log("btn_add is created")
                    createTouchEvent({
                        item: item,
                        autoMove: true,
                        begin: function(data) {
                            var item = data.item
                            var pos = data.pos
                            if (item.father) {
                                item.father.del(item)
                            }
                            item.setPosition(bg.convertToNodeSpace(pos))
                            safeAdd(bg, item)
                            item.removeAllChildren(true)
                            cc.log("btn_add is remove")
                            return true
                        },
                        end: function(data) {
                            var item = data.item
                            var pos = data.pos
                            judgeAll({
                                item: item,
                                pos: pos,
                                index: item.index,
                            })
                        }
                    })
                    break
                }
            }
            if (!temp) {
                dataControl.showList.judgeIndex(index, false)
                item.removeFromParent(true)
                //removeBigItem(item.judgeIndex)
                //cc.log("item add bigItem isMove")
            }
        }
        var showList = createList({
            //scale: 0.9,
            list: self.getRand(),
            pos: getMiddle(345, -20),
            num: 3,
            size: cc.size(160, 530),
            mix: 20,
            arrow: "white",
            color: "yellow",
            pageScale:0.5,
            imgScale: 0.9,
            modify: cc.p(0, -30),
            arrOff: cc.p(35, -20),
            ifPage: true,
            getFun: function(data) {
                var index = data.index
                var pos = data.pos
                var tex = data.tex
                var sp = new cc.Sprite(tex)
                sp.setPosition(bg.convertToNodeSpace(pos))
                safeAdd(bg, sp)
                sp.index = index
                sp.judgeIndex = dataControl.curRand[index]
                return sp
            },
            outFun: function(data) {
                var item = data.item
                var pos = data.pos
                var index = data.index
                judgeAll({
                    item: item,
                    pos: pos,
                    index: index,
                })
            }
        })
        bg.addChild(showList)
        dataControl.showList = showList
        
        
        bg.btn_answer.addClickEventListener(function() {
            self.nodebs.say({key:"result"})
        })
      
        bg.btn_upload.addClickEventListener(function(){
            var one = judge1.judgeAnswer()
            var two = judge2.judgeAnswer()
            var three = judge3.judgeAnswer()

            var judgeList = [one,two,three]
            var result = true
            for(var i = 0 ; i < judgeList.length ; i++){
                if(!judgeList[i] && judgeList[i] != null){
                    result = false
                }
            }
            var count = 0
            for (var i = 0; i < judgeList.length; i++) {
                if(judgeList[i] == null)
                {
                    count++
                }
            }
            if(count == judgeList.length){
                result = false
            }
            self.nodebs.say({
                key: result ? "right" : "fault",
                force: true,
            })
            AddDialog("Judge", {
                judge: result,
                fun:function(){
                    if(judgeMusic()){
                        stopMusic()
                    }
                }
             })
        })
    },

    getRand: function() {
        loadPlist("seeJudge_plist")
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(9)
        dataControl.curRand = rand
        for (var i = 0; i < 9; i++) {
            cc.log(rand[i])
            list.push(sprintf("#see_judge%02d.png", rand[i]))
        }
        return list
    },

    dataControl:{},

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",sound:res.see_sound1},
            {key:"see_tip2",sound:res.see_sound2},
            {key:"see_tip3",sound:res.see_sound3},
        ]
        this.addList = addList
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
            key: "result",
            img: res.see_result,
            id: "result",
        })
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right_bs,
        })
        addContent({
            people: this.nodebs,
            key: "fault",
            sound: res.sound_fault_bs,
        })
    },
})