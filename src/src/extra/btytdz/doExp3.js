/**
 * Created by Administrator on 2016/5/31.
 */
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        var exp3Table = true
        tableFlag = true
        this.expCtor({
            settingData:{
                biaogeFun:function(){
                    var child = getMyTable()
                    self.biaoge = child
                    if(exp3Table) {
                        exp3Table = false
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
        this.cancreate = true
        this.initPeople();
        this.initUI();
        this.initData()
        return true;
    },
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
        loadPlist("do3Paper1")
        loadPlist("do3Paper2")
        self.createTool()

        this.nodebs.show(function() {
            self.nodebs.say({
                key: "do3"
            })
        })

        var bg = new cc.Sprite(res.do3_bg)
        bg.setPosition(cc.p(568,190))
        self.addChild(bg)
        var line = new cc.Sprite(res.do3_line)
        line.setPosition(cc.p(568,100))
        self.addChild(line,20)
        var dqNode = new cc.Node()
        dqNode.setPosition(cc.p(568,250))
        self.addChild(dqNode,25)

        dataControl.bg = bg
        //var gasketList = []
        dataControl.gasketList = []

        var canAdd = true
        dataControl.canAdd = canAdd
        var minY = 250
        dataControl.minY = minY

    },
    dataControl:{},
    createTool:function(){
        var self = this
        self.node = new cc.Node()
        this.addChild(self.node,10)
        var dataControl = self.dataControl;
        dataControl.Gets = []
        dataControl.noPaper = true
        dataControl.canAdd = true
        dataControl.canMove = true
        self.curFn = 0

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
            counts: [2,2,2,2,999],
            swallow: [true, true, true, true, true],
            files: [res.btytdz_tool_1, res.btytdz_tool_2, res.btytdz_tool_3, res.btytdz_tool_4, res.btytdz_tool_5],
            gets: ["#do3_nz01.png", "#do3_cz01.png", "#do3_dz01.png","#do3_bz01.png",null],
            firstClick: function(data) {
                var index = data.index

                if(index == 4 && !dataControl.canAdd){
                    dialogControl.AddDialog("Tips", {
                        res: res.do3_tip2,
                        face: 2,
                        confirmBtn:true
                    });
                    return
                }

                if(index!=4){
                    self.curFn = 0
                    var childs = self.node.getChildren()
                    for(var i=childs.length-1;i>=0;i--){
                        if(childs[i].index!=4)
                            childs[i].forceBack()
                    }

                    //回收已定型的线圈
                    if(self.toolbtn.getindex(4)){
                        var items = self.toolbtn.getindex(4)
                        var temp = items.length
                        for(var i=temp - 1;i>= 0;i--)
                            if(!items[i].canhuishou)
                                 items[i].forceBack()
                    }

                    dataControl.canMove = true
                    dataControl.canAdd = true
                    return true
                }

                //回收不符合要求的线圈
                for(var i in self.toolbtn.getindex(4))
                    if(self.toolbtn.getindex(4)[i].canhuishou)
                        self.toolbtn.getindex(4)[i].forceBack()

                var item = new cc.Sprite(res.do3_dq)
                item.setLocalZOrder(30)
                item.canhuishou = true

                return item
            },
            movefun:function(data){
                var delta = data.delta
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                if(index != 4 && dataControl.canMove){
                    sp.x += delta.x
                    sp.y += delta.y
                    sp.moved = true
                }

                if(index == 4) {
                    var tmppos = 250
                    if(self.toolbtn.getindex(4)){
                        var items = self.toolbtn.getindex(4)
                        if(items.length>=2)
                          tmppos = items[items.length-2].y+20
                    }


                    if (pos.x > 400 && pos.x < 700 && !dataControl.canMove) {
                        sp.x = 568
                        if(pos.y< tmppos&& pos.y>tmppos-150){
                            sp.y = tmppos
                            return
                        }

                        if(pos.y<tmppos-150 && pos.y>tmppos-200){
                            sp.y = tmppos-150
                            return
                        }
                        sp.y += delta.y

                    } else {
                        sp.x = pos.x
                        sp.y = pos.y
                    }
                }



            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(cc.rectIntersectsRect(item,dataControl.bg) && index != 4){
                    item.setPosition(cc.p(568,195))
                    dataControl.canMove = false
                    item.moved = false
                }
                if(index == 4){
                    self.changeSomeThing(data)
                }
            }
        });
        this.addChild(toolbtn,5)
        toolbtn.show()
        this.toolbtn = toolbtn
    },
    initData:function(){
        this.datacontrol = [
            {
                fw:[
                    [0,0.0104,"do3_nz01.png",250],
                    [0.0104,0.02024,"do3_nz02.png",225],
                    [0.02024,0.025,"do3_nz03.png",200],
                    [0.025,0.03,"do3_nz04.png",180],
                    [0.03,0.033,"do3_nz05.png",155],
                    [0.033,10,"do3_nz06.png",135],
                ],
                allFN:0.035
            },
            {
                fw:[
                    [0,10,"do3_cz02.png",130],
                ],
                allFN:0
            },
            {
                fw:[
                    [0,0.01,"do3_dz02.png",225],
                    [0.01,0.023,"do3_dz03.png",180],
                    [0.023,10,"do3_dz05.png",155],
                ],
                allFN:0.0231
            },
            {
                fw:[
                    [0,0.01,"do3_bz02.png",190],
                    [0.01,10,"do3_bz03.png",140],
                ],
                allFN:0.0104
            },
        ]
    },
    changeSomeThing:function(data){
        //当前纸张
        var tmpsp
        var self = this
        for(var i in this.node.getChildren()){
            if(this.node.getChildren()[i].index!=4)
                tmpsp = this.node.getChildren()[i]
        }

        if(!tmpsp)return
        if(tmpsp.moved)return
        if(data.sp.x != 568) return


        //读表数据，求高度算重力比较力给精灵换图片
        var allfw = this.datacontrol[tmpsp.index].fw
        var posy = 250
        if(this.toolbtn.getindex(4).length>=2)
            posy = this.toolbtn.getindex(4)[0].y

        var h = (data.sp.y - posy)/1000
        //var itemnum = this.toolbtn.getindex(4).length - 1

        if(h < 0)  return
        var tmpfn = 0.001 * Math.sqrt(19.6 * h) / 0.06  + self.curFn
        self.curFn = tmpfn


        if(tmpfn>=this.datacontrol[tmpsp.index].allFN)
            self.dataControl.canAdd = false

        var changenum;
        for(var i in allfw)
               if(allfw[i][0]<=tmpfn && allfw[i][1]>tmpfn){
                   changenum = i
                   for(var k in this.toolbtn.getindex(4)){
                       var itemposy = allfw[changenum][3] + 10*k
                       this.toolbtn.getindex(4)[k].canhuishou = false
                       this.toolbtn.getindex(4)[k].disMove(true)
                       this.toolbtn.getindex(4)[k].runAction(cc.sequence(
                           cc.moveTo(0.05,cc.p(568,itemposy)),
                           cc.callFunc(function(){
                               tmpsp.setSpriteFrame(allfw[changenum][2])
                           })
                       ))
                   }
               }
    },
    initPeople: function () {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,100);

        addContent({
            people: this.nodebs,
            key: "do3",
            sound: res.btytdz_do3_sound,
            img: res.do3_tip
        })
    }
})