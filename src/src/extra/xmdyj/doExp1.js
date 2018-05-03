//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (this.nodebs) {
            this.nodebs.show()
        }
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.xm_bg,
                                inputNum: 6,
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var uilist = [
            "ruler",
            "rect",
            "item_mu",
            "item_line",
            "judge",
            "down",
            "arr_up",
            "arr_down",
            "item_xmk",
            "line_node",
        ]
        var node = loadNode(res.xm_do, uilist)
        node.setScale(1.2)
        node.setPosition(getMiddle(-80, -280))
        safeAdd(self, node)
        var item_mu = node.item_mu
        var item_line = node.item_line
        var worldY = getWorldPos(node.down)
        var ruler = node.ruler
        ruler.rootPos = ruler.getPosition()

        var start = cc.p(300, 580)

        var setXm = function(data) {
            var rotate = data.rotate
            var off = data.off || 0
            ruler.setRotation(-rotate)
            ruler.setPositionX(ruler.rootPos.x + off)
            item_mu.setPosition(item_mu.getParent().convertToNodeSpace(getWorldPos(node.judge)))
            item_line.setPositionY(item_line.getParent().convertToNodeSpace(worldY).y)
        }

        var data = [{
            rotate: 30,
            off: 40,
            radiu: 100,
            f: 3.8,
            radiuOff: 0,
            radiuAdd: 0,
        }, {
            rotate: 14.5,
            off: 20,
            radiu: 200,
            f: 2.7,
            radiuOff: 100,
            radiuAdd: 10,
        }, {
            rotate: 9.6,
            off: 15,
            radiu: 300,
            radiuOff: 200,
            f: 2.3,
            radiuAdd: 20,
        }, {
            rotate: 7.2,
            off: 10,
            radiu: 400,
            radiuOff: 350,
            radiuAdd: 30,
            f: 2.1,
        }, {
            rotate: 5.7,
            off: 5,
            radiu: 500,
            radiuOff: 450,
            f: 2.0,
            radiuAdd: 40,
        }]

        var btnList = []

        var drawNode = new cc.Node()
        drawNode.setPosition(ruler.getPosition())
        drawNode.setLocalZOrder(-1)
        safeAdd(node, drawNode)

        var arr_down = node.arr_down
        var arr_up = node.arr_up
        var item_xmk = node.item_xmk

        item_xmk._drawLine = function() {
            var item = this
            var line_node = node.line_node
            var th = ruler.th
            if (th && th.add_node && !item._drawNode) {
                var node2 = th.add_node
                if (!item._drawNode) {
                    var draw = new cc.DrawNode()
                    safeAdd(line_node, draw)
                    item._drawNode = draw
                }
            }
            var draw = item._drawNode
            draw.clear()
            draw.drawSegment(cc.p(0, 0), cc.p(line_node.convertToNodeSpace(getWorldPos(th.add_node))), 1.5, cc.color(0, 0, 0, 255))
        }

        for (var i = 0; i < 5; i++){
            var btn = createJudgeBtn({
                normal: "xm_normal.png",
                act: "xm_select.png",
                select: "xm_act.png",
                frame: true,
                fun: function(item) {
                    for (var i = 0; i < btnList.length; i++) {
                        if (btnList[i] != item) {
                            btnList[i].change(false, false)
                            if (btnList[i].myDraw) {
                                btnList[i].myDraw.setVisible(false)
                            }
                        }
                    }
                    var info = data[item.index]
                    setXm(info)
                    if (!item.myDraw) {
                        var draw = drawCircleCurve({
                            tris: [0, info.rotate - 2 + info.radiuAdd],
                            radiu: info.radiu - info.radiuOff,
                            segs: 20,
                        })

                        var font = new cc.LabelTTF(sprintf("%f°", info.rotate), null, 24)
                        font.setPosition(cc.p(info.radiu - info.radiuOff + 10, 0))
                        font.setAnchorPoint(0, 0)
                        safeAdd(draw, font)

                        draw.setPositionX(info.radiuOff)

                        safeAdd(drawNode, draw)
                        item.myDraw = draw
                    }
                    drawNode.setPosition(ruler.getPosition())
                    item.myDraw.setVisible(true)

                    var length = (getWorldPos(node.judge).y - worldY.y) / 1.2 - 36

                    arr_down.height = length / 2
                    arr_up.height = length / 2

                    arr_down.setPositionY(arr_down.getParent().convertToNodeSpace(worldY).y)

                    if (!item_mu.fontLm) {
                        var fontLm = new cc.LabelTTF("", null, 16)
                        safeAdd(item_mu, fontLm)
                        item_mu.fontLm = fontLm
                    }
                    var fontLm = item_mu.fontLm
                    fontLm.setString(sprintf("%s厘米", (Math.sin(info.rotate / 180 * Math.PI) * 60).toFixed(1)))
                    fontLm.setPosition(arr_up.x + 5, arr_up.y - arr_up.height - 18)

                    var upDis = 7

                    if (!ruler.th) {
                        var th = createThclj2({
                            touchFun: function(item) {
                                (item._rootY == null) && (item._rootY = item.getPositionY());
                                (item_xmk._rootY == null) && (item_xmk._rootY = item_xmk.getPositionY());
                                item.setPositionY(item._rootY + upDis)
                                item_xmk.setPositionY(item_xmk._rootY - upDis)
                                item_xmk._drawLine()
                            },
                            backFun: function(item) {
                                item._rootY != null && item.setPositionY(item._rootY);
                                item_xmk._rootY != null && item_xmk.setPositionY(item_xmk._rootY);
                                item_xmk._drawLine()
                                ruler.th && ruler.th.back();
                            },
                            limit: [-33, 450],
                        })
                        safeAdd(ruler, th)
                        ruler.th = th
                        th.showDrag(true)
                        var size = ruler.getContentSize()
                        th && th.setPosition(153, size.height);

                        th.addItem({
                            item: item_xmk,
                            keepPos: true,
                        })
                        item_xmk._drawLine()

                        var big = th.getBig()
                        big.setPosition(getMiddle(-400, 70))
                        safeAdd(self, big)
                        
                        createTouchEvent({
                            item:item_xmk,
                            begin:function(data){
                              th.itemBegan() 
                              return true
                            },
                            move:function(data){
                              var delta = data.delta
                              th.itemMove(delta)
                            },
                            end:function(){
                              //ruler.th && ruler.th.back(true);  
                            }
                        })
                    }
                    var th = ruler.th
                    var size = ruler.getContentSize()
                    th && th.reInit();
                    th && th.setPosition(153, size.height);
                    th && th.showDrag(true);
                    th && th.setMaxF(info.f);
                },
                onlyTrue: true,
            })
            btn.index = i
            btnList[i] = btn

            var sp = new cc.Sprite(sprintf("#xm_font%d.png", i + 1))
            var size = btn.getContentSize()
            sp.setPosition(size.width / 2, size.height / 2)
            safeAdd(btn, sp)

            btn.setPosition(start.x + i * 90, start.y)
            safeAdd(self, btn)
        }

        btnList[0].change(true, true)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
    }
})