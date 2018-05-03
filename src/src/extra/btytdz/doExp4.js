/**
 * Created by Administrator on 2016/5/31.
 */
var doExp4 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp4",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        var exp4Table = true
        tableFlag = true
        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    var child = getMyTable()
                    self.biaoge = child
                    if(exp4Table) {
                        exp4Table = false
                        if (child.getParent()) {
                            child.retain()
                            child.removeFromParent(false)
                            self.addChild(child, 1000)
                            child.release()
                        } else {
                            self.addChild(child, 1000)
                            child.showIn()
                        }
                    }else{
                        if(tableFlag){
                            child.showIn()
                            tableFlag = false
                        }else{
                            child.showOut()
                            tableFlag = true
                        }
                    }
                },
                pos: cc.p(1080, 580),
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },
    dataControl: {},
    myDelete: function() {
        var self = this
        stopMusic()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
    },
    initUI: function () {
        var self = this
        var dataControl = self.dataControl
        var doLayer = ccs.load(res.btytdz_do4).node;
        this.inside_node.addChild(doLayer);
        self.createTool()

        this.nodebs.show(function() {
            self.nodebs.say({
                key: "do4"
            })
        })

        self.bg = doLayer.getChildByName("bg")
        var offpic = doLayer.getChildByName("offPic")
        var nopic = doLayer.getChildByName("noPic")
        var off = doLayer.getChildByName("off")
        var arrow = doLayer.getChildByName("arrow")
        var botSpot = doLayer.getChildByName("botSpot")
        var upSpot = new cc.Sprite(res.upSpot)
        upSpot.setPosition(cc.p(569,238.66))
        self.addChild(upSpot,100)
        var upSpotSel = new cc.Sprite(res.upSpotSel)
        upSpotSel.setPosition(cc.p(569,253.72))
        self.addChild(upSpotSel,100)
        upSpot.setVisible(false)
        upSpotSel.setVisible(false)
        dataControl.offPic = offpic
        dataControl.noPic = nopic
        dataControl.botSpot = botSpot
        dataControl.upSpot = upSpot
        dataControl.upSpotSel = upSpotSel
        dataControl.index = 0

        off.setTag(11)
        arrow.setTag(12)
        dataControl.off = false
        dataControl.no = true
        dataControl.havePaper = false

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if(target.getTag() == 11){
                        if(dataControl.off){
                            offpic.setVisible(true)
                            nopic.setVisible(false)
                            dataControl.off = false
                            dataControl.no = true
                            botSpot.setVisible(false)
                            upSpot.setVisible(false)
                            upSpotSel.setVisible(false)
                        }else{
                            self.offDisappear()
                        }
                    }else  if(target.getTag() == 12){
                        if(dataControl.no) {
                            self.offDisappear()
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
            },
            onTouchEnded: function(touch, event) {
            }
        })
        cc.eventManager.addListener(listener.clone(), off)
        cc.eventManager.addListener(listener.clone(), arrow)
    },

    setSpot:function(){
        var self = this
        var dataControl = self.dataControl
        var opacity = 255
        if(!dataControl.off)    return
        dataControl.upSpotSel.setVisible(true)
        dataControl.upSpot.setVisible(false)
        switch (dataControl.index){
            case 0:
                opacity = 0
                break
            case 1:
                opacity = 130
                break
            case 2:
                opacity = 80
                break
            case 3:
                opacity = 40
                break
        }
        dataControl.botSpot.setOpacity(opacity)
    },

    offDisappear:function(){
        var self = this
        var dataControl = self.dataControl
        dataControl.off = true
        dataControl.no = false
        dataControl.botSpot.setVisible(true)
        dataControl.upSpot.setVisible(true)
        dataControl.offPic.setVisible(false)
        dataControl.noPic.setVisible(true)
        if(dataControl.havePaper)
            self.setSpot()
    },

    createTool:function(){
        var self = this
        self.node = new cc.Node();
        this.addChild(self.node,10)
        var dataControl = self.dataControl;
        dataControl.Gets = []
        dataControl.canMove = true

        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self.node,
            counts: [999, 999, 999, 999],
            swallow: [true, true, true, true],
            files: [res.btytdz_tool_1, res.btytdz_tool_2, res.btytdz_tool_3, res.btytdz_tool_4],
            gets: [null, null, null, null],
            reTouch:function(data){
                var item = data.sp
                var pos = data.pos
                item.setPosition(pos)
                return item
            },
            firstClick: function(data) {
                var index = data.index
                var pos = data.pos
                var item = data.sp
                if(self.node.getChildrenCount() == 1){
                    self.node.removeAllChildren()
                    dataControl.Gets[0] = null
                    dataControl.canMove = true
                    dataControl.havePaper = false
                    if(dataControl.off){
                        dataControl.upSpot.setVisible(true)
                        dataControl.upSpotSel.setVisible(false)
                        dataControl.botSpot.setOpacity(255)
                    }

                }
                var judge = function(key, pos){
                    if(dataControl.Gets[0]){
                        if(dataControl.Gets[0].judge == key)
                        {
                            dataControl.Gets[0].setPosition(pos)
                            return dataControl.Gets[0]
                        }
                    }else{
                        dataControl.Gets[0] = item
                        item.judge = key
                    }
                }
                switch (index){
                    case indexList.niuPaper:
                        item = new cc.Sprite(res.do4_nz)
                        var temp = judge("niuPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.canPaper:
                        item = new cc.Sprite(res.do4_cz)
                        var temp = judge("canPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.daPaper:
                        item = new cc.Sprite(res.do4_dz)
                        var temp = judge("daPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                    case indexList.baoPaper:
                        item = new cc.Sprite(res.do4_bz)
                        var temp = judge("baoPaper", pos)
                        if(temp){
                            return temp
                        }
                        break
                }
                return item
            },
            movefun:function(data){
                var delta = data.delta
                var sp = data.sp
                if(!dataControl.canMove)      return
                sp.x += delta.x
                sp.y += delta.y
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(cc.rectIntersectsRect(item,self.bg)){
                    item.setPosition(cc.p(568,250))
                    item.setLocalZOrder(2)
                    dataControl.canMove = false
                    dataControl.index = index
                    self.setSpot()
                    dataControl.havePaper = true
                }
            },
            backfun:function(){
            return false
        }
        });
        this.addChild(toolbtn,5)
        toolbtn.show()
    },

    initPeople: function () {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,100);

        addContent({
            people: this.nodebs,
            key: "do4",
            sound: res.btytdz_do4_sound,
            img: res.do4_tip
        })
    }
})