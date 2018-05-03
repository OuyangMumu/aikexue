var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("pics")
           loadPlist("daTu")
        })
        this.expCtor({
          setZ:800,
        }) 
        this.initUI() 
        this.initPeople()

        return true
    },
    initUI:function(){
        var self = this
        //界面初始化
        var bindParent = function(node){
            var len = node.getChildrenCount()
            var children = node.getChildren()
            for(var i=0; i<len; i++){
                var childname = children[i].getName()
                node[childname] = children[i]
                bindParent(children[i])
            }
        }
        this.node = ccs.load(res.see1).node
        bindParent(this.node)
        this.addChild(this.node)
        var piaAll = this.node.piaAll

        var setCanClick = function(judge){
          for(var i=1; i<=13; i++){
             var curItem = piaAll[sprintf("pic%d",i)]
             curItem.disListen(judge)
          }
        }         
        var createImg = function(imgFrame){
           if(self.img){
             return
           }
           self.img = new cc.Sprite()
           self.img.setSpriteFrame(imgFrame)
           self.img.setPosition(getMiddle())
           self.addChild(self.img)

           var closebtn = new ccui.Button(res.btn_chacha_nor,res.btn_chacha_sel)
           closebtn.setPosition(self.img.width-28,self.img.height-25)
           self.img.addChild(closebtn)
           closebtn.addClickEventListener(function(){
              self.img.setCascadeOpacityEnabled(true)
              self.img.runAction(cc.sequence(
                 cc.fadeOut(0.2),
                 cc.callFunc(function(){
                    self.img.removeFromParent()
                    self.img = null
                    setCanClick(false)
                 })
              ))
           })
           setCanClick(true)
           addShowType({
                        item:self.img ,
                        show:"scale",
                        time:0.3
                  })
        }

        for(var i=1; i<=13; i++){
           var curItem = piaAll[sprintf("pic%d",i)]
           curItem.index = i
           curItem.norImg = sprintf("pic%d.png",i)
           curItem.selImg = sprintf("pic%d_sel.png",i)
           curItem.datuImg = sprintf("datu%d.png",i)
           createTouchEvent({
              item:curItem,
              begin:function(data){
                var item = data.item
                item.setSpriteFrame(item.selImg)
                return true
              },
              end:function(data){
                var item = data.item
                item.setSpriteFrame(item.norImg)
                createImg(item.datuImg)
              },
           })
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
              people: this.nodebs,
              key: "jielun1",
              sound:res.jielunmp1,
        })

        addContent({
           people: this.nodebs,
           key: "jielun2",
           img:res.jielun2,
           id:"result",
           sound: res.jielunmp2,
           offset: cc.p(40, 30),
           offbg: cc.p(40,50),
        })
    }
})