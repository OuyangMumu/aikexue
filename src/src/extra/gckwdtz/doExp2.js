//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("huahen")
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
                        var bglist = ["bg1","bg2","btn_bg1", "btn_bg2"]
                        var bufs = []
                        for(var i=0; i<21; i++){
                           bufs[i] = [null,res.chose1,res.chose2]
                           if(i>=6 && i<=8){
                             bufs[i] = [null,res.chose3,res.chose4,res.chose5]
                           }
                           if(i>=18 && i<=20){
                             bufs[i] = [null,res.chose3,res.chose5]
                           }
                        }
                        var bgg = createBiaoge({
                          json:res.bg_biao2,
                          scale: 0.9,
                          downData: {
                                    nums: 21,
                                    bufs:bufs,
                                    keys:[1,1,2,1,2,2,1,2,3,
                                          2,2,1,2,2,1,2,2,1,1,1,2]
                                },
                        })
                        loadList(bgg,bglist)
                        bgg.btn_bg1.addClickEventListener(function(){
                           bgg.bg1.setVisible(true)
                           bgg.bg2.setVisible(false)
                        })
                        bgg.btn_bg2.addClickEventListener(function(){
                           bgg.bg1.setVisible(false)
                           bgg.bg2.setVisible(true) 
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

        var info = [
          {
            isHua:[],
            offset:[cc.p(0,0),cc.p(20,100),cc.p(20,125),
                    cc.p(-10,60),cc.p(20,110),cc.p(104,140)],
            toOffset:[cc.p(0,0),cc.p(125,40),cc.p(140,70),
                      cc.p(100,26),cc.p(125,65),cc.p(185,85)],
            huahen:[],       
          },
          {
            isHua:[],
            offset:[cc.p(-75,33),cc.p(0,0),cc.p(-20,100),
                    cc.p(-50,60),cc.p(-35,120),cc.p(40,170)],
            toOffset:[cc.p(30,0),cc.p(0,0),cc.p(110,30),
                      cc.p(85,6),cc.p(120,50),cc.p(180,110)],
            huahen:[
               {scale:0.8,op:150,pos:cc.p(57,48)}
            ],
          },
          {
            isHua:[],
            offset:[cc.p(-67,82),cc.p(-15,138),cc.p(0,0),
                    cc.p(-50,112),cc.p(13,153),cc.p(114,182)],
            toOffset:[cc.p(28,20),cc.p(104,60),cc.p(0,0),
                    cc.p(50,50),cc.p(110,90),cc.p(205,123)],
            huahen:[
              {scale:0.9,op:255,pos:cc.p(53,83)},
              {scale:1,op:160,pos:cc.p(68,113)},
              null,
              {scale:0.8,op:130,pos:cc.p(91,135)},
              {scale:0.8,op:200,pos:cc.p(122,165)},
              {scale:1,op:255,pos:cc.p(155,190)}
            ],
          }
        ]
   
        var createHuahen = function(data){
           var data = data || {}
           var scale = data.scale || 1
           var op = data.op || 255
           var pos = data.pos || cc.p(0,0)
           var father = data.father
           var huahen = new cc.Sprite()
           huahen.setPosition(pos)
           huahen.setScale(scale)
           huahen.setOpacity(op)
           father.addChild(huahen)
           var spAction = createAnimation({
                                    frame:"huahen%02d.png",
                                    start:0,
                                    end: 10,
                                    time: 0.035
                                })
           huahen.runAction(spAction)
        }

        var files = []
        var gets = []
        var itempos = []
        for(var i = 1; i<=6; i++){
          files[i-1] = res[sprintf("item%d",i)]
          gets[i-1] = res[sprintf("ditem%d",i)]
          itempos[i-1] = cc.p(1, -14)
          if(i>=5){
            itempos[i-1] = cc.p(1, -20)
          }
        }
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.3),
            itempos:itempos,
            circlepos:cc.p(0,18),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                if(index<=2){
                   info[index].isHua = [false,false,false,false,false,false]
                   item.info = info[index]
                }
                var item3 = self.toolbtn.getindex(3)
                var item4 = self.toolbtn.getindex(4)
                var item5 = self.toolbtn.getindex(5)               
                if(item3){
                  item3.forceBack()
                }
                if(item4){
                  item4.forceBack()
                }
                if(item5){
                  item5.forceBack()
                }
                item.setLocalZOrder(LOCAL_ORDER++)           
                return true
            },
            clickfun:function(data){
                var item = data.sp
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               var allchild = toolnode.getChildren()
               for(var i in allchild){
                 var curSp = allchild[i]
                 if(curSp.index<=2 && curSp.index!=item.index){
                    var result = judgeItemCrash({
                        item1:item,
                        item2:curSp
                    })
                    var isHua = curSp.info.isHua
                    var offset = curSp.info.offset
                    var toOffset = curSp.info.toOffset
                    var huahen = curSp.info.huahen
                    if(result && ! isHua[index]){
                      item.disListen(true)
                      isHua[index] = true
                      var from =  cc.p(curSp.x + offset[index].x,curSp.y + offset[index].y)
                      var to = cc.p(curSp.x + toOffset[index].x,curSp.y + toOffset[index].y)
                      item.setPosition(from)
                      if(huahen[index]){
                         createHuahen({
                            scale:huahen[index].scale,
                            op:huahen[index].op,
                            pos:huahen[index].pos,
                            father:curSp
                         })
                      }
                      if(index<3){
                        item.runAction(cc.sequence(
                            cc.moveTo(0.2,to),
                            cc.callFunc(function(){
                               item.disListen(false)
                               self.checkTip()
                            })
                        ))
                      }else{
                        item.runAction(cc.sequence(
                            cc.rotateTo(0.1,-20),
                            cc.moveTo(0.3,to),
                            cc.rotateTo(0.1,0),
                            cc.callFunc(function(){
                               item.disListen(false)
                            })
                        ))
                      }
                      break 
                    }
                 }
               }
               return true
            },
            backfun:function(data){
                var item = data.sp
                return true
            },
            father:toolnode,
            files:files,
            gets:gets
        })
        this.addChild(this.toolbtn,3)
    },
    checkTip:function(){
        var allchild = this.toolnode.getChildren()
        var count = 0
        for(var i in allchild){
            var curSp = allchild[i]
            if(curSp.index<=2){
               var isHua = curSp.info.isHua
               for(var k=0; k<3; k++){
                 if(isHua[k]){
                    count++
                 }
               }
            }
        }
        cc.log("count",count)
        if(count==6){
            this.speakeBykey("wenzi3")
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
               self.speakeBykey("wenzi2")
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
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
    }  
})