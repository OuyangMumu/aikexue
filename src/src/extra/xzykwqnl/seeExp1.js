var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this.load(function(){
           loadPlist("squre")
        })
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = []
        for(var i = 1; i<=5; i++){
            uiName[i] = sprintf("squre%d_nor",i)
        }
        var node = loadNode(res.see1,uiName)
        this.inside_node.addChild(node)
        
        for(var i = 1; i<=5; i++){
            node[uiName[i]].nor = sprintf("squre%d_nor.png",i)
            node[uiName[i]].sel = sprintf("squre%d_sel.png",i)
            if(!cc.sys.isNative){
                addMouseHover({
                   item:node[uiName[i]],
                   disOp:true,
                   infun:function(item){
                    item.setSpriteFrame(item.sel)
                   },
                   outfun:function(item){
                    item.setSpriteFrame(item.nor) 
                   }
                })
            }else{
                createTouchEvent({
                    item:node[uiName[i]],
                    begin:function(data){
                      var item = data.item
                      item.setSpriteFrame(item.sel)
                      return true
                    },
                    end:function(data){
                      var item = data.item
                      item.setSpriteFrame(item.nor)
                    }
                })
            }
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                //self.node.sartAc()
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
         img:res.jielun1,
         id:"result",
         sound: res.jielunmp1,
         offset: cc.p(20, 25),
         offbg: cc.p(25,50),
         btnModify:cc.p(4,2)
        })
    }
})