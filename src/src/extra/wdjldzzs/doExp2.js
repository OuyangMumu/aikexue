//@author mu @16/5/11

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        this.load(function(){
            loadPlist("wd8")
            loadPlist("wd1")
            loadPlist("wd2")
            loadPlist("wd3")
            loadPlist("wd4")
            loadPlist("wd5")
            loadPlist("wd6")
            loadPlist("wd7")
            loadPlist("zz") 
        })
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                 var colors = []
                 for (var k = 0; k <= 7; k++)
                  colors.push(cc.color(255, 0, 0))
                  var bg = createBiaoge({
                       json: res.bg2,
                       isShowResult: true,
                       scale: 0.9,
                       inputNum: 8,
                       scale: 0.9,
                       rootColor:colors,
                       inputKeys:[
                       5,6,6,4,10,6,7,5
                       ]
                  })
                  self.biaogenode.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initPeople()
        this.createTool()
        this.initUI()

        self.biaogenode = new cc.Node()
        this.addChild(self.biaogenode,1000)

        return true
    },
    initUI: function() {
        var self = this
        this.anilist = [{frame:"wda%02d.png",end:15},
                        {frame:"wdb%02d.png",end:14},
                        {frame:"wdc%02d.png",end:19},
                        {frame:"wdd%02d.png",end:15},
                        {frame:"wde%02d.png",end:19},
                        {frame:"wdf%02d.png",end:18},
                        {frame:"wdg%02d.png",end:15},
                        {frame:"wdh%02d.png",end:16},
                        ]


        this.Endfun = function(){
            this.removeListen()
            var num1 = Math.floor(this.index/4) 
            var num2 = this.index%4
            this.setPosition(400 + 380 * num1,480 - 120*num2)
            var ani = createAnimation({
                frame:self.anilist[this.index].frame,
                start:0,
                end:self.anilist[this.index].end
            })
            this.runAction(ani)
        } 
    },
    createTool:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -30),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            itemScale:0.8,
            ifcircle: true,
            outfun:function(data){
               var item = data.sp
               var index = data.index
               item.data = data
               item.index = index
               item.excEndFun = self.Endfun
               if(item.excEndFun)
                 item.excEndFun()
               return true
            },
            father:toolnode,
            files:[res.wdj1,res.wdj2,res.wdj3,res.wdj4,
            res.wdj5,res.wdj6,res.wdj7,res.wdj8],
            gets:["#wda00.png","#wdb00.png","#wdc00.png","#wdd00.png",
            "#wde00.png","#wdf00.png","#wdg00.png","#wdh00.png"]
        })
        this.addChild(this.toolbtn,3);
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.toolbtn.show()
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi3",
                    force:true
                })
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,1000);

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3,
            img: res.wenzi3,
        })
    }
})