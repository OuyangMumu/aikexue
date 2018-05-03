var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        //this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        var uiList = [
            "left_dot1","left_dot2","left_dot3","left_dot4",
            "right_dot1","right_dot2","right_dot3","right_dot4",

            "right_wenzi1","right_wenzi2","right_wenzi3","right_wenzi4",
            "left_wenzi1","left_wenzi2","left_wenzi3","left_wenzi4",

            "child_right_shou","child_right_shou",
            "child_right_tui","child_right_shoubi",
            "child_left_shou","child_left_shou",
            "child_left_tui","child_left_shoubi",

            "child"
        ]
        var node = loadNode(res.rndgn_doExp1_json,uiList)
        self.inside_node.addChild(node)

        var lastPart = null //判断上一个是那个
        var curIndex = 10  //判断当前那一部分在动
        var judgeRun = false //判断正在播放当前动画
        loadPlist("child_plist")
        for(var i = 0 ; i < 8 ; i++){
            var dot = node[uiList[i]]
            dot.index = i
            createTouchEvent({
                item:dot,
                begin:function(data){
                    var index = data.item.index
                    dotCallFun(index)
                    return true
                }
            })
        }
        
        var dotCallFun = function(index){
            if(curIndex == index && judgeRun)   return 
            curIndex = index
            for(var i = 0 ; i < 8 ; i++){
                var wenzi = node[uiList[8+i]]
                if(index == i){
                    wenzi.setVisible(true)
                    if(lastPart){
                        lastPart.getChildren()[0].stopAllActions()
                        lastPart.setPositionX(1300)
                    }
                    node[uiList[index+16]].setPosition(aniData[index].pos)
                    node.child.setPositionX(1300)
                    lastPart = node[uiList[index+16]]
                    var childPart = node[uiList[index+16]].getChildren()[0]
                    childPart.stopAllActions()
                    if(aniData[index].partPos)
                        childPart.setPosition(aniData[index].partPos)
                    judgeRun = true 
                    childPart.runAction(cc.sequence(
                        aniFun(aniData[index].frame,aniData[index].end),
                        aniFun(aniData[index].frame,aniData[index].end),
                        cc.callFunc(function(){
                            node.child.setPosition(950, 250)
                            node[uiList[index+16]].setPositionX(1300)
                            judgeRun = false
                        })
                    ))
                }else{
                    wenzi.setVisible(false)
                }
            }
        }

        var aniFun = function(frame,end){
            return cc.sequence(createAnimation({
                frame: frame,
                end: end,
                time: 0.15
            }))
        }

        var aniData = [{
            frame:"right_shou%02d.png", //此处手和手指写反写反
            end:10,
            pos:cc.p(950, 250),
            partPos:cc.p(29,173),
        },{
            frame:"right_shouzhi%02d.png",
            end:3,
            pos:cc.p(950, 250),
            partPos:cc.p(32,168),
        },{
            frame:"right_tui%02d.png",
            end:5,
            pos:cc.p(950, 330),
            partPos: null,
        },{
            frame:"right_shoubi%02d.png",
            end:4,
            pos:cc.p(950, 250),
            partPos: null,
        },{
            frame:"left_shouzhi%02d.png",
            end:9,
            pos:cc.p(950, 250),
            partPos:cc.p(247,170),
        },{
            frame:"left_shou%02d.png",
            end:6,
            pos:cc.p(950, 250),
            partPos:cc.p(242,168),
        },{
            frame:"left_tui%02d.png",
            end:6,
            pos:cc.p(950, 330),
            partPos: null,
        },{
            frame:"left_shoubi%02d.png",
            end:6,
            pos:cc.p(950, 250),
            partPos: null,
        }]

    }
})