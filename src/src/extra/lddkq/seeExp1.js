var curMusic = null
var  createLazhu = function(){
    loadPlist("lazhu")
    var lazhu = new cc.Sprite("#lz.png")


    var fire = new cc.Sprite("#lzFire00.png")
    fire.setPosition(14.9,140.74)
    fire.setAnchorPoint(0.5,0)
    lazhu.addChild(fire)
    fire.setScale(1.4)

    var fireAc = createAnimation({
                            frame:"lzFire%02d.png",
                            start:0,
                            end:19,
                            time: 0.1,
                        })
    fire.runAction(cc.repeatForever(fireAc))

    return lazhu
}
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
            loadPlist("acPaper")
        })
        this._super()
        this.expCtor() 
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var lazhu = createLazhu()
        lazhu.setPosition(560,80)
        self.addChild(lazhu)

        var paper = new cc.Sprite("#acPer0.png")
        paper.setPosition(360,468)
        self.addChild(paper)
        paper.playSelf = function(){
            var paper = this
            var paperAc = createAnimation({
                            frame:"acPer%d.png",
                            start:0,
                            end:7,
                            time: 0.06,
                        })
            paper.stopAllActions()
            paper.runAction(cc.repeatForever(paperAc))
        }
        paper.playStop = function(){
            var paper = this
            paper.stopAllActions()
            paper.setSpriteFrame("acPer0.png")
        }

        var minDis = 360
        var maxDis = 760
        var midDis = 560
        self.isPlay = false
        createTouchEvent({
            item:paper,
            begin:function(){
                return true
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               var tempx = item.x + delta.x
               if(tempx>=maxDis){
                   tempx = maxDis
               }else if(tempx<=minDis){
                   tempx = minDis
               }
               item.x = tempx

               if(Math.abs(tempx - midDis)<=30){
                   if(!self.isPlay){
                      self.isPlay = true
                      paper.playSelf()
                   }
               }else{
                   self.isPlay = false
                   paper.playStop()
               }
            }
        })


        var disCoverBtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        disCoverBtn.setPosition(1010,380)
        self.addChild(disCoverBtn)
        disCoverBtn.addClickEventListener(function(){
            self.nodebs.say({
                key:"jielun1"
            })  
        })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi1")
            })
        }
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            this.nodebs.say({
                key: key,
                force: true
            })  
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }    
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 110)
        })
        this.addChild(this.nodebs,500)
        
        addContent({
            people: this.nodebs,
            key:"wenzi1",
            img:res.wenzi1,
            sound:res.zimp1
          })

        addContent({
           people: this.nodebs,
           key: "jielun1",
           img:res.jielun1,
           id:"result",
           sound: res.jielunmp1,
           offset: cc.p(35, 35),
           offbg: cc.p(50,50),
       })
    }
})