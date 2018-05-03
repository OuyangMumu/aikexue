//@author mu @16/5/11

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("defferhua")
        })
        var self = this
        this._super()
        this.expCtor({
          vis: false,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.gcych_bg,
                      isShowResult: false,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        ["#a1.png",0],
                        ["#a2.png",1],
                        ["#a3.png",2],
                        ["#a4.png",3],
                        ["#a5.png",4],
                        ["#a6.png",5],
                        ["#a7.png",6],
                    ],
                    pos:cc.p(60,-100),
                    dis:105,
                    itemScale:0.9,
                    resultfather:self,
                    rectlist:[
                       cc.rect(9,201,174,91),
                       cc.rect(195,201,174,91),
                       cc.rect(378,201,174,91),
                       cc.rect(565,201,174,91),
                       cc.rect(9,9,232,87),
                       cc.rect(253,9,232,87),
                       cc.rect(504,9,232,87)
                    ]
                  })
                  bg.upLoadFun = function(){
                      that.upResult()
                  }
                  bg.ClearFun = function(){
                      that.clearData()
                  }
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI()
        this.initPeople()
        
        return true
    },
    initUI: function(){
        var self = this
        var huati = new cc.Sprite(res.huati)
        huati.setPosition(getMiddle(-50,0))
        this.addChild(huati)

        var fabtn =  new ccui.Button(res.btn_get_normal,res.btn_get_select)
        fabtn.setPosition(1030,380)
        this.addChild(fabtn)
        fabtn.addClickEventListener(function(){
              self.nodebs.say({
                    key: "jielun",
                })
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.nodebs.say({
                    key: "wenzi2",
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
        this.addChild(this.nodebs,900);
      
        addContent({
          people: this.nodebs,
          key: "wenzi2",
          img:res.wenzi2,
          sound: res.zimp2,
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