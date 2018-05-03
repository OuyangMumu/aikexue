/**
 * Created by Administrator on 2016/6/29.
 */
var tableFlag = false
var curIndex = 20
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        var haveTable = false
        this._super();
        this.expCtor({
            setZ:99,
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
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl:{},
    initUI: function () {
        var self = this
        var yugang = new cc.Sprite(res.yugang)
        yugang.setPosition(568.8,180.36)
        self.addChild(yugang)
        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip"})
        })
        self.createTool()

        var shui = new cc.Sprite(res.gangshui2)
        shui.setPosition(567,152)
        self.addChild(shui,90)
        var shui2 = new cc.Sprite(res.gangshui)
        shui2.setPosition(565,174)
        self.addChild(shui2,90)
    },

    createTool:function(){
        var self = this
        loadPlist("normal")
        loadPlist("wubei")
        loadPlist("wufu")
        loadPlist("wutun")
        loadPlist("wuwei")
        loadPlist("wuxiong")
        var playBtn = null
        var fishList = []
        var playFlag = true
        for(var i=0;i<3;i++){
            fishList[i] = null
        }

        var toolbtn = createTool({
            pos: cc.p(250, 510),
            nums: 4,
            scale:0.9,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.2, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true],
            files: [res.tool_1, res.tool_2, res.tool_3, res.tool_4, res.tool_5, res.tool_6],
            gets: [res.normalYu, res.wubeiYu, res.wuxiongYu, res.wufuYu, res.wutunYu, res.wuweiYu],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                aniFish(index,item)
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var judgeCount = function(){
                    var count = 0
                    for(var i=0;i<fishList.length;i++){
                        if(!fishList[i] && playFlag){
                            count++
                            if(count == 3)  playBtn.setVisible(false)
                        }
                    }
                }
                if(playFlag){
                    judgeCount()
                    for(var i=0;i<fishList.length;i++){
                        if(item == fishList[i]){
                            fishList[i] = null
                        }
                    }
                }
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                var temp = cc.p(item.x + delta.x, item.y + delta.y)
                if(((temp.x < 400 || temp.x > 720) && temp.y > 340) ||
                    (temp.x > 400 && temp.x < 720 && temp.y > 50)){
                    if(item.y < 330 && !playFlag && !item.noMove){
                        item.setPositionY(400)
                        return true
                    }
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(item.y < 330 && !item.noMove){
                    for(var i=0;i<fishList.length;i++){
                        if(fishList[i] == null){
                            fishList[i] = item
                            item.runAction(cc.moveTo(0.2,400,20+(i+1)*60))
                            playBtn.setVisible(true)
                            return true
                        }
                    }
                }

                judgeDialog(item)    //创建对话框提示
            },
            backfun:function(data){
                var item = data.sp
                if(item.noMove){
                    return false
                }
                return true
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()

        var dialog = function(){
            AddDialog("Tips", {
                res: res.do1_tip2,
                face: 2,
                confirmBtn:true,
            })
        }
        var judgeDialog = function(item){
            if(playFlag && item.x > 400 && item.x < 720){
                var count = 0
                for(var i=0;i<fishList.length;i++){
                    if(fishList[i] && item != fishList[i]){
                        count++
                        if(count == 3){
                            item.setPositionY(400)
                            dialog()
                        }
                    }
                }
            }
        }

        var playFun = function(){
            playBtn = new ccui.Button(res.btn_play,res.btn_stop)
            playBtn.setPosition(180,70)
            self.addChild(playBtn)
            playBtn.addClickEventListener(function(){
                if(!playBtn.isVisible())  return false
                if(playFlag){
                    playBtn.loadTextures(res.btn_stop,res.btn_play)
                    playFlag = false
                    for(var i=0;i<fishList.length;i++){
                        if(fishList[i]){
                            fishList[i].setPosition(572,fishList[i].y+4)
                            fishList[i].runAction(fishList[i].ani())
                            fishList[i].disMove(true)
                        }
                    }
                }else{
                    playFlag = true
                    playBtn.loadTextures(res.btn_play,res.btn_stop)
                    for(var i=0;i<fishList.length;i++){
                        if(fishList[i]){
                            fishList[i].disMove(false)
                            fishList[i].back()
                        }
                    }
                }
            })
        }
        var aniFish = function(index,item){
            switch (index){
                case 0:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"normal%02d.png",
                            end: 46,
                            time: 0.15
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.normalYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
                case 1:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"wubei%02d.png",
                            end: 46,
                            time: 0.16
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.wubeiYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
                case 2:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"wuxiong%02d.png",
                            end: 51,
                            time: 0.19
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.wuxiongYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
                case 3:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"wufu%02d.png",
                            end: 46,
                            time: 0.22
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.wufuYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
                case 4:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"wutun%02d.png",
                            end: 46,
                            time: 0.2
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.wutunYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
                case 5:
                    item.ani = function(){
                        return cc.repeatForever(cc.sequence(createAnimation({
                            frame:"wuwei%02d.png",
                            end: 60,
                            time: 0.27
                        })))
                    }
                    item.back = function(){
                        item.stopAllActions()
                        item.setTexture(res.wuweiYu)
                        item.setPosition(400,item.y-4)
                    }
                    break
            }
        }
        playFun()
        playBtn.setVisible(false)
    },

    table:function(){
        var self = this
        var uiList = [
            "tableBg","closeBtn","resultBtn","clearBtn","resultImg","resultCloseBtn",
        ]

        var node = loadNode(res.jy_do1table_json, uiList)
        node.setPosition(cc.p(568,320))
        self.addChild(node,111111)
        var inputList = []
        for(var i=1;i<16;i++){
            var name = "input" + i
            var input = node.tableBg.getChildByName(name)
            inputList.push(input)
            addInput({
                item:input,
                size:26,
                color:cc.color(0,0,255,255),
            })
        }

        self.node = node
        self.node.resultImg.setScale(0)
        self.showImg(node.tableBg,1)
        node.resultCloseBtn.addClickEventListener(function(){
            self.showImg(self.node.resultImg,2)
        })
        node.clearBtn.addClickEventListener(function(){
            for(var i=0;i<inputList.length;i++){
                inputList[i].clear()
            }
            if(self.node.resultImg.getScale() != 0)
                self.showImg(self.node.resultImg,2)
        })
        node.resultBtn.addClickEventListener(function(){
            self.showImg(self.node.resultImg,1)
        })
        node.closeBtn.addClickEventListener(function(){
            self.showImg(node.tableBg,2)
            if(self.node.resultImg.getScale() != 0)
                self.showImg(self.node.resultImg,2)
            tableFlag = true
        })

    },
    tableShowIn:function(){
        var self = this
        self.showImg(self.node.tableBg,2)
        if(self.node.resultImg.getScale() != 0)
            self.showImg(self.node.resultImg,2)
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
                scale:0.9,
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

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "do1_tip",
            img: res.do1_tip1,
            sound: res.do1_sound1,
        })
    },
})