
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){

        });
        this.expCtor()
        this.initUI()
        this.initPeople()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"tishi",
                })
            })
        }
    },
    reEnter:function(){
        //for(var i in this.allnode.getChildren())
        //    this.allnode.getChildren()[i].setOpacity(255);
    },

    initUI:function(){
        var self = this;
        var uinamelist = [
            "jielunbtn",
            "tip1",
            "tip2",
            "xrui",
            "crui",
            "cxrui"
        ]
        var node = loadNode(res.hdgc_see1,uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

        fun1 = function(){
            self.nodebs.say({
                key:"danxing",
                force:true
            })
        }
        fun2 = function(){
            self.nodebs.say({
                key:"double",
                force:true
            })
        }
        var cruiDraw = new cc.DrawNode()
        node.crui.addChild(cruiDraw)
        cruiDraw.drawSegment(cc.p(85,54),cc.p(116,91),2,cc.color(250,0,0))
        var xruiDraw = new cc.DrawNode()
        node.xrui.addChild(xruiDraw)
        xruiDraw.drawSegment(cc.p(204,59),cc.p(156,102),2,cc.color(250,0,0))
        var cxruiDraw = new cc.DrawNode()
        node.cxrui.addChild(cxruiDraw)
        cxruiDraw.drawSegment(cc.p(77,155),cc.p(108,193),2,cc.color(250,0,0))
        cxruiDraw.drawSegment(cc.p(247,125),cc.p(242,180),2,cc.color(250,0,0))

        var dataControl = [
            [node.crui,node.tip1,node.tip2,fun1,1],
            [node.xrui,node.tip1,node.tip2,fun1,1],
            [node.cxrui,node.tip2,node.tip1,fun2,2],
            [node.cxrui,node.tip2,node.tip1,fun2,2],
        ]

        var curEventindex = 10

        node.jielunbtn.addClickEventListener(function(){
            self.nodebs.say({
                key:"jielun"
            })
        })

        for(var i = 1;i<=4;i++){
            var tmpnode = node.getChildByName("touchsp"+i)
            cc.log(tmpnode)
            tmpnode.tagnum = i-1
            createTouchEvent({
               item:tmpnode,
               beginfail:function(data){
                   for(var k in dataControl)
                       if(data.item.tagnum!=k)
                       dataControl[k][0].setVisible(false)

                   return false
               },
               begin:function(data){
                   for(var k in dataControl)
                       dataControl[k][0].setVisible(false)
                   dataControl[data.item.tagnum][0].setVisible(true)
                   dataControl[data.item.tagnum][0].setOpacity(100);
                   dataControl[data.item.tagnum][0].y = dataControl[data.item.tagnum][0].y-10
                   dataControl[data.item.tagnum][0].runAction(cc.sequence(
                       cc.moveBy(0.1,0,10),
                       cc.callFunc(function(){
                           dataControl[data.item.tagnum][0].setOpacity(255);
                       })
                   ))
                   dataControl[data.item.tagnum][1].setVisible(true)
                   dataControl[data.item.tagnum][2].setVisible(false)
                   
                   if(curEventindex == dataControl[data.item.tagnum][4]){
                       if(judgeMusic()) {
                           dataControl[data.item.tagnum][3]()
                       }
                   }else{
                       if(dataControl[data.item.tagnum][3])
                           dataControl[data.item.tagnum][3]()
                   }
                   curEventindex = dataControl[data.item.tagnum][4]

                   return true
               }
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "tishi",
            img:res.wenzi1,
            sound: res.ngh,
        })
        addContent({
            people: this.nodebs,
            key: "danxing",
            sound: res.danxing,
        })
        addContent({
            people: this.nodebs,
            key: "double",
            sound: res.doublexing,
        })
        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.wenzi5,
            id:"result",
            sound: res.jielun1,
            offset: cc.p(25, 20),
            offbg: cc.p(30,30),
        })
    }
})

