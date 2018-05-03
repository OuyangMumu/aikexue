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
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){

        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        var pointList = [
                          {pos:cc.p(609.2,418.3),anPos:cc.p(0.47,0.23)},
                          {pos:cc.p(608.5,224),anPos:cc.p(0.5,0.5)},
                          {pos:cc.p(531.23,385.19 ),anPos:cc.p(0.57,0.26)},
                          {pos:cc.p(520.28,333.44),anPos:cc.p(0.61,0.77)},
                          {pos:cc.p(519.9,196.5),anPos:cc.p(0.42,0.57)},
                          {pos:cc.p(685.32,399.55),anPos:cc.p(0.52,0.31)},
                          {pos:cc.p(686.25,352.15),anPos:cc.p(0.43,0.53)},
                          {pos:cc.p(698.57,184.07),anPos:cc.p(0.54,0.56)}
                        ]
        var CountNum = 0 
        this.toolbtn = createTool({
            pos:cc.p(110, 510),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.2),
            itempos:cc.p(1, 12),
            circlepos:cc.p(0,10),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:[0.85,0.5,0.5,0.55,0.4,0.53,0.72,0.4],
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index    
                if(index==0){
                    item = new cc.Sprite(res.DPT0)
                    item.setAnchorPoint(pointList[index].anPos)
                    item.needCompare = pointList[index].pos
                    item.setLocalZOrder(100)
                    return item
                }else{
                    item.setAnchorPoint(pointList[index].anPos)
                    item.needCompare = pointList[index].pos
                    item.setLocalZOrder(100)
                }
                return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(getDis(item,item.needCompare)<= 50){
                  item.setPosition(item.needCompare)
                  item.removeListen()
                  if(index==1){
                    item.setLocalZOrder(5)
                  }else{
                    item.setLocalZOrder(1)
                  }
                  CountNum++
                  if(CountNum>=8){
                    playMusic(res.zswd_right)
                    dialogControl.AddDialog("Tips", {
                                res: res.tip1,
                                face: 1,
                                confirmBtn: true,
                                father: self,
                                ifCancle:true,
                                yesCall:function(){
                                    self.refreshCall()
                                }
                            })
                  }
               }else{
                  playMusic(res.zswd_wrong)
                  item.forceBack()
               }
            },
            counts:[1,1,1,1,1,1,1,1],
            father:toolnode,
            files:[res.head,res.DPT2,res.DPT3,res.DPT4,res.DPT5,res.DPT6,res.DPT7,res.DPT8],
            gets:[null,res.DPT2,res.DPT3,res.DPT4,res.DPT5,res.DPT6,res.DPT7,res.DPT8]
        })
        this.addChild(this.toolbtn,3)

        var vr = new cc.Sprite(res.DPT9)
        vr.setPosition(getMiddle(50,0))
        toolnode.addChild(vr,1)

        var xb = new cc.Sprite(res.DPT1)
        xb.setPosition(604,345)
        toolnode.addChild(xb,10)


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
            sound: res.seemp10
        })
    }  
})