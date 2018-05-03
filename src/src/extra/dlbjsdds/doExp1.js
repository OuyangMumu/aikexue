/**
 * Created by Administrator on 2016/6/24.
 */
var tableFlag = true
var curIndex = 100
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super()
        var self = this
        var haveTable = false
        this.expCtor({
            settingData: {
                biaogeFun: function () {
                    if (!haveTable) {
                        haveTable = true
                        self.table()
                    } else {
                        if (tableFlag) {
                            self.tableShowOut()
                            tableFlag = false
                        } else {
                            self.tableShowIn()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        })
        this.initPeople()
        loadPlist("Aconds")
        loadPlist("Bconds")
        this.createTool()
        this.initUI()
        return true
    },
    dataBag : {},
    initUI:function(){
        var self = this
        var dataBag = self.dataBag
        var uiList = [
            "liang", "jingmian", "eye", "upBtn", "downBtn", "bigCon",
            "smallBtn", "bigBtn", "jmCloseBtn", "dinwei", "Panel",
            "noEqual", "Equal", "equalNode" , "wayBg" , "wayCloseBtn",
            "wayNode", "item1",  "item2", "item3", "item4" ,  "item5" , "wayBtn"
        ]
        var node = loadNode(res.jsdds_doExp1,uiList)
        self.addChild(node)
        dataBag.node = node
        dataBag.liang = node.liang
        dataBag.dinwei = node.dinwei
        dataBag.jingmian = node.jingmian
        dataBag.jingmian.jm = true
        dataBag.dinwei.dw = true

        self.tablenode = new cc.Node()
        self.addChild(self.tablenode,1000)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip"})
        })

        dataBag.judgeCon = 2
        dataBag.dinwei.setPositionY(-300)
        dataBag.jingmian.setPositionY(-600)
        var angle = 0
        dataBag.bigCon = node.bigCon
        var eye = node.eye
        var high = dataBag.liang.y + dataBag.liang.height/2
        var low = dataBag.liang.y - dataBag.liang.height/2
        var panelHigh = node.Panel.y + node.Panel.height/2
        var panelLow = node.Panel.y - node.Panel.height/2
        var touchList = [dataBag.dinwei,dataBag.jingmian]
        dataBag.bigBeginPos = 0
        var eyeBeginPos = eye.getPosition()
        var dinweiBeginPos = 0
        for(var i=0;i<2;i++){
            createTouchEvent({
                item:touchList[i],
                begin:function(data){
                    var item = data.item
                    var pos = data.pos
                    dinweiBeginPos = item.getPosition()
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.jm){
                        if(!dataBag.jingmian.isVisible())   return false
                        item.x += delta.x
                        item.y += delta.y
                    }
                    if(item.dw) {
                        var temp = cc.p(item.x + delta.x, item.y + delta.y)
                        if (temp.x > dataBag.liang.x - 20 && temp.x < dataBag.liang.x + 20 && temp.y > low && temp.y < high) {
                            item.x += delta.x
                            item.y += delta.y
                            dataBag.bigCon.x -= delta.x * 3 * dataBag.num
                            dataBag.bigCon.y -= delta.y * 3 * dataBag.num
                            eye.x -= delta.x * 2.5 * dataBag.num
                            eye.y -= delta.y * 3 * dataBag.num
                            if(eye.y > panelHigh || eye.y < panelLow){
                                node.equalNode.setVisible(false)
                                eye.setVisible(false)
                            }else{
                                node.equalNode.setVisible(true)
                                eye.setVisible(true)
                            }
                        }
                    }
                },
                end:function(data){
                    var item = data.item
                    if(item.dw){
                        item.setPosition(dinweiBeginPos)
                        dataBag.bigCon.setPosition(dataBag.bigBeginPos)
                        eye.setPosition(eyeBeginPos)
                        if(!eye.isVisible()){
                            node.equalNode.setVisible(true)
                            eye.setVisible(true)
                        }
                        if(!dataBag.jingmian.isVisible())
                            dataBag.jingmian.setVisible(true)
                        changeAngel()
                        judgeEyeEqual()
                    }
                }
            })
        }

        var changeAngel = function(){
            var aangle = 0;
            var arand = Math.random() * 10
            if(arand < 4)
                aangle = -20
            else if(arand < 7 )
                aangle = 20;
            else
                aangle = -10
            eye.setRotation(aangle)
            angle = eye.getRotation()
        }

        var eyeAction = function(){
            changeAngel()
            var num = 1;
            dataBag.num = num
            dataBag.num2 = num
            var scal = 1.1
            var changeNum = 8.5
            var changeNum2 = 6
            node.smallBtn.addClickEventListener(function () {
                if (dataBag.num <= 0.9 || dataBag.num2 >= 1.2){
                    node.smallBtn.setOpacity(100)
                    node.smallBtn.setTouchEnabled(false)
                    return false
                }
                node.bigBtn.setOpacity(255)
                node.bigBtn.setTouchEnabled(true)
                dataBag.num = dataBag.num / scal;
                dataBag.num2 = dataBag.num2 * scal;
                dataBag.bigCon.setScale(dataBag.num);
                dataBag.dinwei.setScale(dataBag.num2);
                if(dataBag.judgeCon == 0)
                    dataBag.bigCon.setPositionY(dataBag.bigCon.y-changeNum)
                else
                    dataBag.bigCon.setPositionY(dataBag.bigCon.y+changeNum2)
                dataBag.bigBeginPos = cc.p(dataBag.bigCon.x,dataBag.bigCon.y)
            });
            node.bigBtn.addClickEventListener(function () {
                if (dataBag.num2 <= 0.9 || dataBag.num >= 1.2){
                    node.bigBtn.setOpacity(100)
                    node.bigBtn.setTouchEnabled(false)
                    return false
                }
                node.smallBtn.setOpacity(255)
                node.smallBtn.setTouchEnabled(true)
                dataBag.num = dataBag.num * scal;
                dataBag.num2 = dataBag.num2 / scal;
                dataBag.bigCon.setScale(dataBag.num);
                dataBag.dinwei.setScale(dataBag.num2);
                if(dataBag.judgeCon == 0)
                    dataBag.bigCon.setPositionY(dataBag.bigCon.y+changeNum)
                else
                    dataBag.bigCon.setPositionY(dataBag.bigCon.y-changeNum2)
                dataBag.bigBeginPos = cc.p(dataBag.bigCon.x,dataBag.bigCon.y)
            });
            node.jmCloseBtn.addClickEventListener(function () {
                dataBag.jingmian.setVisible(false)
            });
            node.upBtn.addClickEventListener(function () {
                if (angle >= 45)
                        angle = 45;
                angle += 5;
                eye.setRotation(angle);
                judgeEyeEqual()
            });
            node.downBtn.addClickEventListener(function () {
                if (angle <= -45)
                    angle = -45;
                angle -= 5;
                eye.setRotation(angle);
                judgeEyeEqual()
            });
        }
        eyeAction()
        var judgeEyeEqual = function(){
            if (angle == 0) {
                node.Equal.setVisible(true);
                node.noEqual.setVisible(false);
            } else {
                node.noEqual.setVisible(true);
                node.Equal.setVisible(false);
            }
        }

        var wayFirst = true
        dataBag.wayFlag = false
        node.wayBtn.addClickEventListener(function(){
            if (wayFirst) {
                wayFirst = false
                self.useWay()
            } else {
                if (dataBag.wayFlag) {
                    self.wayShowOut()
                    dataBag.wayFlag = false
                } else {
                    self.wayShowIn()
                    dataBag.wayFlag = true
                }
            }
        })
    },

    changeBack : function(){
        var self = this
        var dataBag = self.dataBag
        var node = dataBag.node
        node.bigBtn.setOpacity(255)
        node.bigBtn.setTouchEnabled(true)
        node.smallBtn.setOpacity(255)
        node.smallBtn.setTouchEnabled(true)
        dataBag.num = 1
        dataBag.num2 = 1
        dataBag.bigCon.setScale(dataBag.num);
        dataBag.dinwei.setScale(dataBag.num2);
        dataBag.liang.setPosition(400,250)
        dataBag.dinwei.setPositionY(-300)
        dataBag.jingmian.setPositionY(-600)
        dataBag.liang.stopAllActions()
    },

    createTool:function(){
        var self = this
        var dataBag = self.dataBag
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
            counts: [999, 999],
            swallow: [true, true],
            files: [res.do2_tool1, res.do2_tool2],
            gets: [res.do1_Acontainer, res.do1_Bcontainer],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                self.changeBack()
                if(toolbtn.getindex(0)){
                    toolbtn.getindex(0)[0].forceBack()
                    dataBag.liang.setTexture(res.liang)
                }
                if(toolbtn.getindex(1)){
                    toolbtn.getindex(1)[0].forceBack()
                    dataBag.liang.setTexture(res.liang)
                }
                dataBag.judgeCon = index
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                return true
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                var index = data.index
                item.x += delta.x
                item.y += delta.y
                if(cc.rectIntersectsRect(item,dataBag.liang)){
                    if(index == 0){
                        item.pause()
                        item.setVisible(false)
                        item.setPositionY(-300)
                        dataBag.liang.setPosition(414,339)
                        dataBag.liang.runAction(aniAconds())
                    }else if(index == 1){
                        item.pause()
                        item.setVisible(false)
                        item.setPositionY(-300)
                        dataBag.liang.setPosition(425,399)
                        dataBag.liang.runAction(aniBconds())
                    }
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                var weight = null
            },
        });
        this.addChild(toolbtn)
        toolbtn.show()

        var aniAconds = function () {
            return cc.sequence(createAnimation({
                frame: "Aconds%02d.png",
                end: 15,
                time: 0.25
            }), cc.callFunc(function () {
                dataBag.liang.setPosition(400,250)
                dataBag.liang.setSpriteFrame("Aconds16.png")
                dataBag.dinwei.setPosition(400,218)
                dataBag.bigCon.setPosition(70,205)
                dataBag.bigCon.setTexture(res.AconFull)
                dataBag.jingmian.setPosition(800,260)
                dataBag.bigBeginPos = cc.p(70,205)
            }))
        }
        var aniBconds = function () {
            return cc.sequence(createAnimation({
                frame: "Bconds%02d.png",
                end: 17,
                time: 0.25
            }), cc.callFunc(function () {
                dataBag.liang.setPosition(400,250)
                dataBag.liang.setSpriteFrame("Bconds18.png")
                dataBag.dinwei.setPosition(400,270)
                dataBag.bigCon.setTexture(res.BconFull)
                dataBag.bigCon.setPosition(70,48)
                dataBag.jingmian.setPosition(800,260)
                dataBag.bigBeginPos = cc.p(70,48)
            }))
        }
    },

    table:function(){
        var self = this
        var dataBag = self.dataBag
        var uiList = [
            "tableBg", "closeBtn", "submitBtn", "resultBtn", "clearBtn",
            "concluImg", "resultBg", "resultCloseBtn", "concluBtn"
        ]
        var node = loadNode(res.jsdds_do1table, uiList)
        node.setPosition(cc.p(568,320))
        node.setLocalZOrder(dataBag.node.wayBg.getLocalZOrder()+1)
        self.tablenode.addChild(node)
        var noList = []
        var yesList = []
        var textList = []
        var resultList = [100,150]
        for(var i=1;i<3;i++){
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
        node.tableBg.table = true
        self.node.resultBg.setScale(0)
        self.showImg(node.tableBg,1)
        node.resultCloseBtn.addClickEventListener(function(){
            self.showImg(self.node.resultBg,2)
        })
        node.concluBtn.addClickEventListener(function(){
            if(!node.concluImg.isVisible())
                node.concluImg.setVisible(true)
            else
                node.concluImg.setVisible(false)
        })
        node.clearBtn.addClickEventListener(function(){
            node.concluImg.setVisible(false)
            for(var i=0;i<2;i++) {
                noList[i].setVisible(false)
                yesList[i].setVisible(false)
                textList[i].clear()
            }
        })
        node.submitBtn.addClickEventListener(function(){
            for(var i=0;i<2;i++){
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
        var dataBag = self.dataBag
        self.node.tableBg.getParent().setLocalZOrder(dataBag.node.wayBg.getLocalZOrder()+1)
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
                            if(item.table){
                                item.getParent().setLocalZOrder(curIndex)
                            }
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

    useWay : function(){
        var self = this
        var dataBag = self.dataBag
        var node = dataBag.node
        var judgeList = [
            "item1",  "item2", "item3", "item4" ,  "item5"
        ]
        var way = [
            "way_1", "way_2", "way_3", "way_4", "way_5"
        ]
        node.addTouch = function(){
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        begin: function (data) {
                            var item = data.item
                            node.showIndex(item.index)
                            return true
                        }
                    })
                }
            }
        }

        node.showIndex = function(index) {
            var show = node.wayNode
            for (var i = 0; i < way.length; i++) {
                var child = show.getChildByName(way[i])
                var judge = node[judgeList[i]]
                if (index == i) {
                    child.setVisible(true)
                    judge.getChildByName("select").setVisible(true)
                    judge.getChildByName("normal").setVisible(false)
                } else {
                    child.setVisible(false)
                    if (judge) {
                        judge.getChildByName("select").setVisible(false)
                        judge.getChildByName("normal").setVisible(true)
                    }
                }
            }
        }

        node.addTouch()
        node.wayCloseBtn.addClickEventListener(function(){
            self.wayShowIn()
            dataBag.wayFlag = true
        })
        self.wayShowOut()
        safeAdd(self.tablenode,node.wayBg)
    },

    wayShowIn : function(){
        var dataBag = this.dataBag
        var node = dataBag.node
        this.showImg(node.wayBg,2)
    },
    wayShowOut : function(){
        var dataBag = this.dataBag
        var node = dataBag.node
        this.showImg(node.wayBg,1)
        node.wayBg.setPosition(568,320)
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,90)
        addContent({
            people: this.nodebs,
            key: "do1_tip",
            img: res.do1_tip,
            sound: res.do1_tipSound,
        })
    }
})