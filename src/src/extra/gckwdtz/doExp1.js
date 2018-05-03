//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
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
                      for(var i=0; i<20; i++){
                        colors[i] = cc.color(230,15,240)
                      }
                      var bgg = createBiaoge({
                          json:res.bg_biao1,
                          scale: 0.9,
                          inputNum:20,
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

        var files = []
        var gets = []
        var kwh = []
        for(var i = 1; i<=10; i++){
          files[i-1] = res[sprintf("kws%d",i)]
          gets[i-1] = res[sprintf("dkws%d",i)]
          kwh[i-1] = res[sprintf("kwh%d",i)]
        }
        var kwPosOffset = [cc.p(-50,0),cc.p(0,0),cc.p(-80,0),cc.p(-120,0),cc.p(0,0),
                           cc.p(0,0),cc.p(0,0),cc.p(0,0),cc.p(-120,0),cc.p(0,0)]

        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.3),
            itempos:cc.p(1, -10),
            circlepos:cc.p(0,18),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.opJudge = true
                if(toolnode.getChildren()[0]){
                   self.ciban.deleteImg()
                   toolnode.getChildren()[0].forceBack()
                }               
                return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               var result = judgeItemCrash({
                 item1:item,
                 item2:self.ciban
               })
               if(result && !item.haveHua){
                 item.disListen(true)
                 var offset = kwPosOffset[index]
                 item.setPosition(524+offset.x,300+offset.y)
                 self.ciban.playAc(kwh[index])
                 item.runAction(cc.sequence(
                   cc.moveTo(1,cc.p(748,134)),
                   cc.callFunc(function(){
                      item.haveHua = true
                      item.disListen(false)
                   })
                 ))
               }
               return true
            },
            father:toolnode,
            files:files,
            gets:gets
        })
        this.addChild(this.toolbtn,3)


        self.createCiban()
    },
    createCiban:function(){
        var ciban = new cc.Sprite(res.ciban)
        ciban.setPosition(568,123)
        this.addChild(ciban)
        this.ciban = ciban

        var lay = createLayout({
            op: 0,
            size: cc.size(500, 250),
            clip: true
        })
        lay.setPosition(0,256)
        ciban.addChild(lay)
        ciban.lay = lay
        
        ciban.deleteImg = function(){
          var ciban = this
          ciban.lay.setPosition(0,256)
          ciban.lay.removeAllChildren()
        }

        ciban.playAc = function(img){
          var ciban = this
          var sp = new cc.Sprite(img)
          sp.setPosition(240,-115)
          ciban.lay.addChild(sp)

          var child = ciban.lay.getChildren()[0]
          ciban.lay.runAction(cc.moveBy(1,cc.p(0,-240)))
          if(child){
             child.runAction(cc.moveBy(1,cc.p(0,240)))
          }
        }
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
               self.speakeBykey("wenzi1")
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })
    }  
})