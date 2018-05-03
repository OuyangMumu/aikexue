/**
 * Created by Administrator on 2016/6/24.
 */
var tableFlag = true
var curIndex = 20
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super()
        var self = this
        var haveTable = false
        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    if(!haveTable) {
                        haveTable = true
                        self.table()
                    }else{
                        if(tableFlag){
                            self.tableShowOut()
                            tableFlag = false
                        }else{
                            self.tableShowIn()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        })
        this.initPeople()
        this.createTool()
        this.initUI()
        return true
    },
    dataControl:{},
    initUI:function(){
        var self = this

    },

    createTool:function(){
        var self = this
        self.nodebs.show(function() {
            self.nodebs.say({key:"do2_tip"})
        })
        var tp = createTp({
            father: self,
            tppos:cc.p(480, 150),
            famapos:cc.p(840, 150),
            addFun: function(data) {
                var item = data.item
                if(item.num == 0)
                    item.setPosition(80, 80)
                else
                    item.setPosition(90, 110)
                item.inTp = true
            },
        })
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.4, 1.25),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1],
            swallow: [true, true],
            files: [res.do2_tool1, res.do2_tool2],
            gets: [res.Acontainer, res.Bcontainer],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                item.num = index
                if(toolbtn.getindex(0)){
                    var Acon = toolbtn.getindex(0)
                    Acon.forceBack()
                    if(Acon.inTp){
                        Acon.inTp = false
                        tp.disWeight(120)
                    }
                }else if(toolbtn.getindex(1)){
                    var Bcon = toolbtn.getindex(1)
                    Bcon.forceBack()
                    if(Bcon.inTp){
                        Bcon.inTp = false
                        tp.disWeight(190)
                    }
                }
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                if(item.inTp){
                    item.inTp = false
                    item.setPosition(pos)
                    if(index == 0)
                        tp.disWeight(120)
                    else
                        tp.disWeight(190)
                    safeAdd(self, item)
                }
                return true
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                var weight = null
                if(index == 0)
                    weight = 120
                else
                    weight = 190
                tp.addItem({
                    item:item,
                    weight:weight,
                    pos:data.pos,
                })
            },
        });
        this.addChild(toolbtn)
        toolbtn.show()
    },

    table:function(){
        var self = this
        var uiList = [
            "tableBg", "closeBtn", "submitBtn", "resultBtn", "clearBtn",
            "concluImg", "resultBg", "resultCloseBtn", "concluBtn"
        ]
        var node = loadNode(res.jsdds_do2table, uiList)
        node.setPosition(cc.p(568,320))
        self.addChild(node,1000)
        var noList = []
        var yesList = []
        var textList = []
        var resultList = [120,100,190,150]
        for(var i=1;i<5;i++){
            var noname = "no"+i
            var no = node.tableBg.getChildByName(noname)
            no.setVisible(false)
            noList.push(no)
            var yesname = "yes"+i
            var yes = node.tableBg.getChildByName(yesname)
            yes.setVisible(false)
            yesList.push(yes)
            var textname = "input"+i
            var text = node.tableBg.getChildByName(textname)
            textList.push(text)
            addInput({
                item:text,
                size:36,
                color:cc.color(210,10,30,255),
            })
        }
        self.node = node
        self.node.resultBg.setScale(0)
        self.showImg(node.tableBg,1)
        node.resultCloseBtn.addClickEventListener(function(){
            self.showImg(self.node.resultBg,2)
        })
        node.clearBtn.addClickEventListener(function(){
            node.concluImg.setVisible(false)
            for(var i=0;i<4;i++) {
                noList[i].setVisible(false)
                yesList[i].setVisible(false)
                textList[i].clear()
            }
        })
        node.concluBtn.addClickEventListener(function(){
            if(!node.concluImg.isVisible())
                node.concluImg.setVisible(true)
            else
                node.concluImg.setVisible(false)
        })
        node.submitBtn.addClickEventListener(function(){
            for(var i=0;i<4;i++){
                if(textList[i].getStr() == "")   continue
                if(textList[i].getStr() == resultList[i]){
                    yesList[i].setVisible(true)
                    noList[i].setVisible(false)
                } else{
                    noList[i].setVisible(true)
                    yesList[i].setVisible(false)
                }
            }
        })
        node.resultBtn.addClickEventListener(function(){
            self.showImg(self.node.resultBg,1)
        })
        node.closeBtn.addClickEventListener(function(){
            self.showImg(node.tableBg,2)
            if(self.node.resultBg.getScale() != 0)
                self.showImg(self.node.resultBg,2)
            tableFlag = true
        })
    },

    tableShowIn:function(){
        var self = this
        self.showImg(self.node.tableBg,2)
        if(self.node.resultBg.getScale() != 0)
            self.showImg(self.node.resultBg,2)
    },

    tableShowOut:function(){
        var self = this
        self.showImg(self.node.tableBg,1)
    },

    showImg : function(img,flag){
        if (flag == 1) {
            addShowType({
                item: img,
                show: "scale",
                time: 0.2,
                fun: function (img) {
                    createTouchEvent({
                        item:img,
                        begin:function(data){
                            var item = data.item
                            item.setLocalZOrder(curIndex)
                            curIndex = curIndex + 1
                            return true
                        },
                        move:function(data){
                            var item = data.item
                            var delta = data.delta
                            item.x += delta.x
                            item.y += delta.y
                        }
                    })
                }
            })
            img.setLocalZOrder(curIndex)
            curIndex = curIndex + 1
            img.setPosition(cc.p(0,0))
        } else {
            addShowType({
                item: img,
                show: "zoom",
                time: 0.2,
                fun: function (img) {
                    if(img.removeListen){
                        img.removeListen()
                        img.setPositionY(-800)
                    }
                }
            })
        }
    },

    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1020, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "do2_tip",
            img: res.do2_tip,
            sound: res.do2_tipSound,
        })
    }
})