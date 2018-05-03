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

    var self = this
    var tipsp = new cc.Sprite(res.bizhongtip)
    tipsp.setPosition(851,480)
    self.addChild(tipsp)

    var jielunbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
    jielunbtn.setPosition(1054,360)
    self.addChild(jielunbtn)
    jielunbtn.addClickEventListener(function(){
        self.nodebs.say({
            key: "jielun"
        })
    })

    var tp = createTp({
               father: self,
               balancepos:"up",
               tppos:cc.p(440, 160),
               addFun: function(data) {
                   var item = data.item
                   item.setPosition(100, 60)
                   item.inTp = true
               },
           })
            var item = new cc.Sprite(res.tiek)
            item.setPosition(350,60)
            safeAdd(self, item)
            item.index = 0
            var item1 = new cc.Sprite(res.muk)
            item1.setPosition(550,60)
            safeAdd(self, item1)
            item1.index = 1

            var itemlist = [item,item1]
            for(var i in itemlist)
            createTouchEvent({
                item: itemlist[i],
                begin:function(data){
                    var item = data.item
                    var pos = data.pos
                    if(item.inTp){
                        item.inTp = false
                        tp.disWeight(item.curweight)
                        item.setPosition(pos)
                        safeAdd(self, item)
                    }
                    return true
                },
                move: function(data) {
                    var item = data.item
                    var delta = data.delta
                    item.x += delta.x
                    item.y += delta.y
                },
                end: function(data) {
                    if(data.item.index==0){
                        data.weight = 62
                        data.item.curweight = 62 
                    }else if(data.item.index==1){
                        data.weight = 6.4
                        data.item.curweight = 6.4
                    }  
                    tp.addItem(data)
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
           sound: res.zi5mp,
           img: res.wenzi5,
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