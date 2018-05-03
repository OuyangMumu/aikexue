var doExp4 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp4",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("change")
        })
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()

        return true
    },
    initUI: function(){
      var self = this
      var huazhi =  new cc.Sprite(res.huazhi)
      huazhi.setPosition(730,200)
      this.addChild(huazhi)

      var fabtn = new ccui.Button(res.btn_get_normal, res.btn_get_select)
      fabtn.setPosition(1040,380)
      this.addChild(fabtn)
      fabtn.addClickEventListener(function(){
          self.nodebs.say({
              key: "jielun"
          })
      })

      var diguan = createDiWater({
                       rect:cc.rect(650,420,200,100),
                       father:self,
                       sp:huazhi,
                       offsetX:100,
                       offsetY:200,
                       pullMidFun:function(){
                        diguan.setGaiClick(false,function(){
                            dialogControl.AddDialog("Tips", {
                                res: res.waterpass,
                                face: 2,
                                father: self
                            }) 
                        })
                        var hei = new cc.Sprite()
                        var ani = createAnimation({
                            start: 0,
                            frame: "changehei%02d.png",
                            end: 22,
                            time: 0.15,
                          })
                          hei.setPosition(huazhi.width/2+30,huazhi.height/2)
                          hei.runAction(ani)
                          huazhi.addChild(hei)
                       }
                   })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi6",
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
       this.addChild(this.nodebs,1000);

       addContent({
           people: this.nodebs,
           key: "wenzi6",
           sound: res.zimp6,
           img: res.wenzi6,
       })
       addContent({
           people: this.nodebs,
           key: "jielun",
           img:res.jielun,
           id:"result",
           sound: res.jielunmp,
           offset: cc.p(35, 30),
           offbg: cc.p(70,70),
       })
   }
})