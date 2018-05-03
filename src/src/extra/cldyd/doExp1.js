//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        var self = this
        this.load(function() {
        
        });
        this._super()
        this.expCtor({
            vis: false,
            setZ:800,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                   if(!self.bggg) {
                       var buf = []
                       for (var i = 1; i <= 16; i++)
                           buf.push([null, res.have, res.none])
                       var bgg = createBiaoge({
                           json:res.bgnode,
                           inputNum: 0,
                           scale: 0.9,
                           rootColor: [
                               cc.color(255, 0, 0, 255),
                               cc.color(255, 0, 0, 255)
                           ],
                           downData: {
                               nums: 16,
                               bufs: buf,
                               scale:1.2,
                               keys: [
                                   2, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2
                               ]
                           }
                       })
                       self.biaogenode.addChild(bgg)
                       self.bggg = bgg
                   }

                    var bgg = self.bggg
                    bgg.show()
                },
            }
        }) //实验模板
        this.initUI()
        this.initPeople()
        this.initData()
       

        return true
    },
    initData:function(){
        var self = this
        self.datainfo = {
           gesture:[self.node.dmp,self.node.dkz,self.node.dtp,self.node.dcz],
           ks:[self.node.ksq,self.node.ksh],
           area:[
                {
                 rect:cc.rect(75,254,384,121) ,
                 drawlines:[
                       [cc.p(277,433),cc.p(358,365)],
                       [cc.p(322,445),cc.p(405,363)],
                       [cc.p(375,440),cc.p(436,373),self.node.mx2],
                       [cc.p(422,436),cc.p(499,366),self.node.mx1]
                      ],
                 lines:[
                     [false],
                     [false],
                     [false],
                     [false]
                 ]
               },
                {
                   rect:cc.rect(540,262,368,125) ,
                   drawlines:[
                       [cc.p(722,424),cc.p(821,350)],
                       [cc.p(778,442),cc.p(900,368)],
                       [cc.p(830,431),cc.p(930,357)],
                       [cc.p(880,431),cc.p(966,368)]
                   ],
                   lines:[
                       [false],
                       [false],
                       [false],
                       [false]
                   ]
                },
                {
                   rect:cc.rect(50,56,385,140) ,
                   drawlines:[
                       [cc.p(232,230),cc.p(310,164),self.node.kx1],
                       [cc.p(304,242),cc.p(374,162)],
                       [cc.p(357,240),cc.p(431,169),self.node.kx2],
                       [cc.p(396,240),cc.p(468,177),self.node.kx3]
                   ],
                   lines:[
                       [false],
                       [false],
                       [false],
                       [false]
                   ]
                },
                {
                   rect:cc.rect(526,34,393,86) ,
                   drawlines:[
                       [cc.p(722,206),cc.p(769,135)],
                       [cc.p(760,206),cc.p(800,135)],
                       [cc.p(820,206),cc.p(901,133),self.node.cx1],
                       [cc.p(888,209),cc.p(952,134)]
                   ],
                   lines:[
                       [false],
                       [false],
                       [false],
                       [false]
                   ]
                },
           ]
        }

    },
    initUI: function(){
        var self = this 

        var toolnode = new cc.Node();
        toolnode.x = 0; toolnode.y =0;
        this.addChild(toolnode,5);

        self.biaogenode = new cc.Node();
        self.biaogenode.x = 0 ; self.biaogenode.y =0;
        this.addChild(self.biaogenode,1000);

        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:3,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -8),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){
                if(toolnode.getChildren()[0])
                    toolnode.getChildren()[0].forceBack()
                return true;
            },
            outfun:function(data){
                var datainfo = self.datainfo
                var index = data.index
                var sp = data.sp
                var area = datainfo.area

                for(var k in area)
                   if(cc.rectContainsPoint(area[k].rect,cc.p(sp.x-sp.width/2-10,sp.y-sp.height/2-10))){
                       if(area[k].lines[index][0])
                           return

                       sp.setVisible(false)
                       sp.pause()
                       var parent = datainfo.gesture[index].getParent()
                       parent.setVisible(true)
                       for(var i in parent.getChildren())
                           parent.getChildren()[i].setVisible(false)
                       datainfo.gesture[index].setVisible(true)
                       for(var i in datainfo.ks)
                           datainfo.ks[i].setVisible(true)

                       parent.setPosition(area[k].drawlines[index][0])
                       area[k].lines[index][0] = true
                       if(area[k].drawlines[index][2])
                       area[k].drawlines[index][2].runAction(cc.scaleTo(2,1))
                       parent.runAction(cc.sequence(
                           cc.moveTo(2,cc.p(area[k].drawlines[index][1])),
                           cc.callFunc(function(){
                               parent.setVisible(false)
                               sp.setVisible(true)
                               sp.resume()
                           })
                       ))
                       return
                   }

            },
            backfun:function(data){
                return true
            },
            father:toolnode,
            files:[res.qmp,res.qkz,res.qtp,res.qslc],
            gets:[res.dmp,res.dkz,res.dtp,res.dcz],
            grays:[res.qmp,res.qkz,res.qtp,res.qslc],
        });
        this.addChild(this.toolbtn,3);

        var uinamelist = [
            "dmp","dkz","dcz","dtp",
            "ksh","ksq","cx1",
            "mx1","mx2","kx1","kx2","kx3"
        ]
        this.node = loadNode(res.do1,uinamelist);
        this.addChild(this.node) 
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "st",
                    force:true  
                })
            })
        }
    },
    initPeople:function(){

        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,200);

        addContent({
            people: this.nodebs,
            key: "st",
            sound: res.zi1mp,
            img: res.wenzi1,
        })
        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.tip1,
            id:"result",
            sound: res.tip1mp,
            offset: cc.p(25, 20),
            offbg: cc.p(50,50),
        })
    }
})