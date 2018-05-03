var doExp5 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp5",
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
        var uiname = [
          "shoujia"
        ]
        var self = this
        this.allnode = loadNode(res.fire,uiname)
        this.allnode.setPosition(682,307)
        this.addChild(this.allnode)

        var fabtn = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        fabtn.setPosition(1040,380)
        this.addChild(fabtn)
        fabtn.addClickEventListener(function(){
          self.nodebs.say({
              key: "jielun1"
          })
        })

        self.jjd = createJJD({
                    pos:cc.p(450,180),
                    scale:0.9,
                    father:self
                })

        self.jjd.onlyFire()

        this.allnode.shoujia.playAc = function(){
           var shaoaction = ccs.load(res.fire).action
           shaoaction.gotoFrameAndPlay(0,71,false)
           this.getParent().runAction(shaoaction)
        }

        createTouchEvent({
          item:this.allnode.shoujia,
          begin:function(){
            return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            var tempx = item.getParent().x + delta.x
            if(tempx>=682)
              tempx = 682
            if(tempx<=520){
              tempx = 520
              item.removeListen()
              item.getParent().stopAllActions()
              item.playAc()
            }
            item.getParent().x = tempx
          }
        })
    },
    
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi7",
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
           key: "wenzi7",
           sound: res.zimp7,
           img: res.wenzi7,
       })
       addContent({
           people: this.nodebs,
           key: "jielun1",
           img:res.jielun1,
           id:"result",
           sound: res.jielunmp1,
           offset: cc.p(35, 30),
           offbg: cc.p(70,70),
       })
   }
    
})