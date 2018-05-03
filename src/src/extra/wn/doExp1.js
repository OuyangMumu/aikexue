var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    self.table()
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })
        var str = "仔细观察不同蜗牛的壳，\n看看蜗牛的螺线圈数和螺线圈方向，\n并将你所观察到的填入表格中。"
        var label = new cc.LabelTTF(str,"",28)
        self.addChild(label)
        label.setPosition(280,400)

        label.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(){
                self.table()
            })
        ))

        var curLocal = 1
        var toolbtn = createTool({
            pos: cc.p(280, 530),
            nums: 4,
            scale:0.85,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4,
                    res.do_tools5,res.do_tools6,res.do_tools7,res.do_tools8],
            gets: ["#tools_1.png","#tools_2.png","#tools_3.png","#tools_4.png",
                    "#tools_5.png","#tools_6.png","#tools_7.png","#tools_8.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(judgeOpInPos({item:item,pos:pos})){
                    item.setLocalZOrder(curLocal++)
                    return true
                }
                return false 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                //if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                //}
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
            },
            backfun:function(data){
                return true
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()
    },

    table: function(){
        var self = this
        if (!self.bgg) {
            var bg = createBiaoge({
                json: res.wn_tableNode_json,
                scale: 0.9,
                judgeScale: 0.7,
                inputNum: 8,
                inputKeys: [3,2,3,2,3,5,3,3],
                downData: {
                    nums: 8,
                    scale: 1.5,
                    bufs: [
                        [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                        [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                        [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                        [null,res.table_wz1,res.table_wz2],[null,res.table_wz1,res.table_wz2],
                    ],
                    keys: [
                        1,2,2,2,1,2,2,1
                    ]
                },
            })
            self.addChild(bg)
            self.bgg = bg
            bg.setPositionY(-1000)
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do_tip1",
            img: res.do_tip1,
            sound: res.do_sound1,
        })
    },
})