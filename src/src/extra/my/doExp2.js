/**
 * Created by Administrator on 2016/6/21.
 */
var tableFlag = false
var curIndex = 20
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    diaLog:null,
    ctor: function () {
        var self = this
        var haveTable = false
        this._super();
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
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl:{},
    initUI: function () {
        var self = this
        self.nodebs.show(function() {
            self.nodebs.say({key:"do2_tip"})
        })
        this.createTool()
    },

    createTool:function(){
        var self = this
        var curLocal = 10
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(0, 0),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.tool_1, res.tool_2, res.tool_3, res.tool_4],
            gets: [res.big_yihou, res.big_xiongyi, res.big_gongyi, res.big_bingyi],
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                return item
            },
            clickfun : function(data){
                var item = data.sp
                item.setLocalZOrder(curLocal)
                curLocal++
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
            },
        });
        this.addChild(toolbtn)
        toolbtn.show()
    },

    table:function(){
        var self = this
        var uiList = [
            "yihou","xiongyi","gongyi","bingyi",
            "tableCloseBtn","submitBtn","resultBtn","clearBtn","tableBg","resultImg","resultCloseBtn"
        ]
        var num = [1,2,3,4]
        var curResult = [0,0,0,0]
        var resultList = [1,2,3,4]
        resultList.flag = false
        var posXList = [150,320,490,660]
        var posYList = [486,398,300,200]
        var node = loadNode(res.my_tableNode_json, uiList)
        node.setPosition(cc.p(568,320))
        self.addChild(node,1000)
        self.node = node
        self.node.resultImg.setScale(0)
        self.showImg(node.tableBg,1)
        node.resultCloseBtn.addClickEventListener(function(){
            self.showImg(self.node.resultImg,2)
        })
        node.clearBtn.addClickEventListener(function(){
           changePos()
            for(var i=0;i<4;i++){
                curResult[i] = 0
            }
            if(self.node.resultImg.getScale() != 0)
                self.showImg(self.node.resultImg,2)
        })
        node.resultBtn.addClickEventListener(function(){
            self.showImg(self.node.resultImg,1)
        })
        node.tableCloseBtn.addClickEventListener(function(){
            self.showImg(node.tableBg,2)
            if(self.node.resultImg.getScale() != 0)
                self.showImg(self.node.resultImg,2)
            tableFlag = true
            if(self.diaLog)
                self.diaLog.onOut()
        })
        node.submitBtn.addClickEventListener(function(){
            var flag = true
            for(var i=0;i<4;i++){
                if(curResult[i] != resultList[i] && curResult[i] != 0)
                    flag = false
            }
            if(curResult[0] == 0 && curResult[1] == 0 && curResult[2] == 0 && curResult[3] == 0){
                flag = false
            }
            if(flag){
                self.diaLog = AddDialog("Tips", {
                    res: res.doYes,
                    face: 1,
                    sound:res.sound_right,
                    confirmBtn:true,
                })
            }else{
                self.diaLog = AddDialog("Tips", {
                    res: res.zaixiangxiang,
                    face: 2,
                    sound:res.sound_fault,
                    confirmBtn:true,
                })
            }
            safeAdd(self.node,self.diaLog)
            self.diaLog.setPosition(0,0)
        })

        var judge = []
        for(var i=0;i<4;i++){
            node[uiList[i]].num = num[i]
            var mayi = node[uiList[i]]
            mayi.ros = mayi.getPosition()
            mayi.back = function(){
                var item = this
                item.setPosition(item.ros)
                item.index = null
            }
           createTouchEvent({
               item:mayi,
               begin:function(data){
                   var item = data.item
                   safeAdd(item.getParent(), item)
                   if(item.index != null){
                       curResult[item.index] = 0
                       judge[item.index] = null
                   }
                   item.index = null
                   return true
               },
               move:function(data){
                   var item = data.item
                   var delta = data.delta
                   item.x += delta.x
                   item.y += delta.y
               },
               end:function(data){
                   var item = data.item
                   var tempJudge = false
                   for(var i = 0;i < 4; i++){
                       if(checkDistans(item,posYList[i])) {
                           tempJudge = true
                           var temp = cc.p(664, posYList[i])
                            if(judge[i]){
                                var itemb = judge[i]
                                itemb.back()
                            }
                           item.setPosition(temp)
                           judge[i] = item
                           item.index = i
                           curResult[i] = item.num
                       }
                   }
                   if(!tempJudge){
                       if(item.index){
                           judge[item.index] = null
                       }
                       item.back()
                   }
               }
           })
        }


        var changePos = function (){
            var rand = getRand(4)
            for(var i=0;i<4;i++){
                node[uiList[rand[i]]].setPosition(cc.p(posXList[i],100))
            }
        }

        var checkDistans = function(target1,posY){
            var dx = target1.x - 664
            var dy = target1.y - posY
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 40)
                return true
            else
                return false
        }

    },
    tableShowIn:function(){
        var self = this
        self.showImg(self.node.tableBg,2)
        if(self.node.resultImg.getScale() != 0)
            self.showImg(self.node.resultImg,2)
        if(self.diaLog)
            self.diaLog.onOut()
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

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "do2_tip",
            img: res.do2_tip,
            sound: res.do2_tipSound,
        })
    },
})