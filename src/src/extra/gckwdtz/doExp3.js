//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {  
        })
        this._super()
        var self = this
        this.expCtor({
            vis: false,
            setZ:800,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bggg) {
                      var colors = []
                      for(var i=0; i<36; i++){
                        colors[i] = cc.color(230,15,240)
                      }
                      var bgg = createBiaoge({
                          json:res.bg_biao3,
                          scale: 0.9,
                          inputNum:36,
                          rootColor:colors
                    })
                    self.addChild(bgg)
                    self.bggg = bgg
                  }
                  var bgg = self.bggg
                  bgg.show()
                },
            }
        }) 
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var yingzi = new cc.Sprite(res.yingzi)
        yingzi.setPosition(550,100)
        self.addChild(yingzi,1)
        yingzi.setVisible(false)

        var yingziList = [
             {scale:cc.p(1,0.8),posOffset:cc.p(-5,-10)},
             {scale:cc.p(1.1,0.8),posOffset:cc.p(-20,90)},
             {scale:cc.p(1.32,0.96),posOffset:cc.p(0,11)},
             {scale:cc.p(1,1),posOffset:cc.p(-5,22)},
             {scale:cc.p(1.32,1),posOffset:cc.p(-5,82)},

             {scale:cc.p(1,0.8),posOffset:cc.p(-3,-8)},
             {scale:cc.p(1.3,0.66),posOffset:cc.p(3,-25)},
             {scale:cc.p(1.5,1),posOffset:cc.p(0,40)},
             {scale:cc.p(1.02,0.8),posOffset:cc.p(-15,45)},
             {scale:cc.p(1,0.8),posOffset:cc.p(-10,8)},

             {scale:cc.p(1.3,1),posOffset:cc.p(-10,20)},
             {scale:cc.p(0.7,0.5),posOffset:cc.p(-15,-32)},
            ]

        
        var files = []
        var gets = []
        for(var i = 1; i<=12; i++){
          files[i-1] = res[sprintf("kw%d",i)]
          gets[i-1] = res[sprintf("dkw%d",i)]
        }
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.3),
            itempos:cc.p(1, -14),
            circlepos:cc.p(0,18),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(toolnode.getChildren()[0]){
                   yingzi.setVisible(false)
                   yingzi.setPosition(550,100)
                   toolnode.getChildren()[0].forceBack()
                }               
                return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               item.removeListen()
               item.setPosition(550,220)
               var scale = yingziList[index].scale
               var offset = yingziList[index].posOffset
               yingzi.setScale(scale.x,scale.y)
               yingzi.setPosition(yingzi.x+offset.x,yingzi.y+offset.y)
               yingzi.setVisible(true)
               return true
            },
            father:toolnode,
            files:files,
            gets:gets
        })
        this.addChild(this.toolbtn,3)
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
               self.speakeBykey("wenzi4")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
    }  
})