var seeExp1 = myLayer.extend({
    sprite: null,
    needSet: false,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        this.expCtor({
            btnOff:cc.p(140,0),
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        self.nodebs.show()
        var dataControl = self.dataControl
        var uiList = [
            "btn_answer", "btn_upload", "btn_result","judge1", "judge2", "judge3",
            "judge4"
        ]
        var bg = loadNode(res.zwhtqcq_seeExp1_json, uiList, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self.inside_node, bg)

        var localZOrder = 20  //对放大的图片设置显示优先级
        var curBigItem = []   //用于存放当前的大图片，用于关闭回收

        var judgeList = [bg.judge1,bg.judge2,bg.judge3,bg.judge4]

        var result = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [9, 10, 11]
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
                devidex: 100,
            }, {
                judge: 3,
                devidex: 100,
            }, {
                judge: 4,
                devidex: 100,
            }, {
                judge: 5,
                devidex: 100,
            }, {
                judge: 6,
                devidex: 85,
            }, {
                judge: 7,
                devidex: 70,
            }, {
                judge: 8,
                devidex: 60,
            }, {
                judge: 9,
                devidex: 50,
            }, {
                judge: 10,
                devidex: 45,
            }, {
                judge: 11,
                devidex: 43,
            }, {
                judge: 12,
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
                            list[i].setPosition(cc.p(50 + count % nums * devidex, 55))
                            safeAdd(judge, item)
                            count++
                        }
                    }
                }
            } else {
                return
            }
        }

        for(var i = 0 ; i < judgeList.length ; i++){
            var judge = judgeList[i]
            judge.judgeItem = judgeItem
            judge.sort = sort
            judge.del = del
            judge.answer = result[i]
            judge.clear = clear
            judge.judgeAnswer = judgeAnswer
        }
        
        var createBtnFun = function(item){
            var item = item 
            var judgeIndex = item.judgeIndex
            var btn_add = new ccui.Button(res.btn_add_normal,res.btn_add_select)
            btn_add.setPosition(item.width-40,40)
            btn_add.setScale(1.5)
            item.addChild(btn_add)
            btn_add.addClickEventListener(function(){
                if(!curBigItem[judgeIndex]){
                    var big_item = new cc.Sprite(dataControl.bigList[judgeIndex])
                    big_item.setPosition(getMiddle(0, 0))
                    self.addChild(big_item)
                    big_item.setOpacity(0)
                    addShowType({
                        item:big_item,
                        show:"fadeIn"
                    })
                    curBigItem[judgeIndex] = big_item  //将其存放在数组中，方便回收
                    //创建关闭按钮
                    var btn_close = new ccui.Button(res.btn_tipclose_normal,res.btn_tipclose_select)
                    btn_close.setPosition(big_item.width-30, big_item.height-30)
                    big_item.addChild(btn_close)

                    btn_close.addClickEventListener(function(){
                        removeBigItem(judgeIndex)
                    })

                    createTouchEvent({
                        item:big_item,
                        begin:function(data){
                            var item = data.item
                            item.setLocalZOrder(localZOrder)
                            localZOrder++
                            return true 
                        },
                        move:function(data){
                            var item = data.item 
                            var delta = data.delta 
                            item.x += delta.x 
                            item.y += delta.y
                        }
                    })
                }else{
                    removeBigItem(judgeIndex)
                }
                
            })
        }

        //回收当前已经存在的大图
        var removeBigItem = function(index){
            if(curBigItem[index]){
                addShowType({
                    item:curBigItem[index],
                    show:"fadeOut",
                    fun:function(){
                        curBigItem[index].removeFromParent(true)
                        curBigItem[index] = null
                        cc.log("bigItem is remove")
                    }
                })
            }
        }
        var judgeAll = function(data) {
            var pos = data.pos
            var item = data.item
            var index = data.index
            //var judgeList = [judge1,judge2,judge3]
            var temp = false
            for (var i = 0; i < judgeList.length; i++) {
                var result = judgeList[i].judgeItem({
                    pos: pos,
                    item: item,
                    index: item.judgeIndex,
                })
                if (result) {
                    temp = true
                    item.setScale(0.35)
                    createBtnFun(item)
                    cc.log("btn_add is created")
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
                removeBigItem(item.judgeIndex)
                cc.log("item add bigItem isMove")
            }
        }
        var showList = createList({
            //scale: 0.9,
            list: self.getRand(),
            pos: getMiddle(360, -20),
            num: 3,
            size: cc.size(140, 530),
            mix: 20,
            arrow: "white",
            color: "yellow",
            pageScale:0.5,
            imgScale: 0.5,
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
                sp.setScale(0.6)
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
            self.answerImg.show()
        })

        bg.btn_result.addClickEventListener(function() {
            self.nodebs.say({key:"result"})
        })

        bg.btn_upload.addClickEventListener(function(){
            var answerList = []
            for(var i = 0 ; i < judgeList.length ; i++){
                var fun = judgeList[i].judgeAnswer()
                answerList.push(fun)
            }
            var result = true
            for(var i = 0 ; i < answerList.length ; i++){
                if(!answerList[i] && answerList[i] != null){
                    result = false
                }
            }
            var count = 0
            for (var i = 0; i < answerList.length; i++) {
                if(answerList[i] == null)
                {
                    count++
                }
            }
            if(count == answerList.length){
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
        loadPlist("mater_plist")
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(12)
        dataControl.bigList = []
        dataControl.curRand = rand
        for (var i = 0; i < 12; i++) {
            cc.log(rand[i])
            list.push(sprintf("#bigMater_%02d.png", rand[i]))
            dataControl.bigList.push(sprintf("#bigMater_%02d.png", i))
        }
        return list
    },

    dataControl:{},

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.see_tip1,
            sound: res.see_sound1,
            id: "result",
        })
        this.answerImg = createShowImg({
            img:res.see_tip2,
        })
        safeAdd(this, this.answerImg)
        
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

        this.nodebs.setVisible(false)
    },
})