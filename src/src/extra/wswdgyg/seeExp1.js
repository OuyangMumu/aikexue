var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = [
          "wsw","xj","zj","bd","sameBtn",
          "word1","word2","word3","word4"
        ]
        var node = loadNode(res.see1,uiName)
        this.addChild(node)
        this.node = node

        var openOther = function(index){
          cc.log(index)
          for(var i=0; i<4; i++){
             var item = node[uiName[i]]
             if(index != i){
                item.disListen(false)
                item.setTexture(item.nor)
                item.tishi.setVisible(false)
             }
          }
        }
        for(var i=0; i<4; i++){
           var item = node[uiName[i]]
           item.nor = item.getTexture()
           item.sel = res[sprintf("selImg%d",i+1)]
           item.tishi = node[sprintf("word%d",i+1)]
           item.index = i
           createTouchEvent({
              item:item,
              begin:function(){
                 return true
              },
              end:function(data){
                var item = data.item
                item.setTexture(item.sel)
                item.disListen(true)
                item.tishi.setVisible(true)
                self.speakeBykey(item.index)
                openOther(item.index)
              }
           })
        }

        node.sameBtn.addClickEventListener(function(){
            self.nodebs.say({
                  key:"jielun1",
              })
        })
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key:sprintf("wenzi%d",key+1),
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
               self.speakeBykey(0)
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
            key: "wenzi1",
            sound: res.zimp1
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zimp4
        })
        addContent({
          people: this.nodebs,
          key: "jielun1",
          img:res.jielun1,
          id:"result",
          sound: res.jielunmp1,
          offset: cc.p(50, 30),
          offbg: cc.p(70,40),
        })
    }
})