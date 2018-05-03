var doExp4 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp4",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        
        });
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()

        return true
    },
    initUI: function(){
        var self = this;
        var uinamelist = [
          "jielunbtn",
          "tousp", "tb"
        ]
        var node = loadNode(res.do4,uinamelist);
        this.addChild(node)
        
        node.jielunbtn.addClickEventListener(function(){
                self.nodebs.say({
                    key: "jielun"
                })
        })

        createTouchEvent({
            item:node.tousp,
            begin:function(){
                return true
            },
            move:function(data){
                data.item.getParent().x += data.delta.x
                data.item.getParent().y += data.delta.y
            },
            end:function(data){
                var parent = data.item.getParent()

                var tmprect = cc.rect(node.tb.x-node.tb.width/2,node.tb.y-node.tb.height/2,
                    node.tb.width,node.tb.height)
                var tmppos  = cc.p(parent.x-3/4*parent.width,parent.y+1/2*parent.height)

                if(cc.rectContainsPoint(tmprect,tmppos)){
                    data.item.pause()
                    data.item.removeFromParent()
                    parent.setAnchorPoint(cc.p(0.8,0.2))
                    parent.runAction(cc.sequence(
                        cc.moveTo(0.3,cc.p(618,410)),
                        cc.callFunc(function(){
                            parent.runAction(cc.repeatForever(cc.sequence(
                                cc.rotateTo(0.2,-29),
                                cc.rotateTo(0.3,0)
                            )))
                        })
                    ))
                    var ac = ccs.load(res.do4).action
                    ac.gotoFrameAndPlay(0,154,false)
                    ac.setLastFrameCallFunc(function(){
                        parent.stopAllActions()
                        parent.setRotation(0)
                    })
                    node.runAction(ac)
                }

            }
        })

    },
    myEnter: function() {
        this._super()
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
       this.addChild(this.nodebs);

       addContent({
           people: this.nodebs,
           key: "st",
           sound: res.zi4mp,
           img: res.wenzi4,
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