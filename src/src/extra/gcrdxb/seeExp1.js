var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor({
          setZ:800,
        }) 
        this.initUI() 
        this.initData()
        this.initPeople()

        return true
    },
    initUI:function(){
      var self = this
      //界面初始化
      var bindParent = function(node,parent){
          if(!parent){
             parent = node
          }
          var len = node.getChildrenCount()
          var children = node.getChildren()
          for(var i=0; i<len; i++){
              var childname = children[i].getName()
              parent[childname] = children[i]
              bindParent(children[i],parent)
          }
      } 
      this.node = ccs.load(res.see1).node
      bindParent(this.node)
      this.addChild(this.node)
    },
    initData:function(){
      var self = this
      var node = self.node
      this.dataInfo = [
          {
            tousp:[
              {sp:node.hxb_nor},
              {sp:node.xb_hxb}
            ],
            visi:[node.hxb_sel,node.hxb_zi,node.xb_hxb1],
            sound:"see1"
          },
          {
            tousp:[
              {sp:node.bxb_nor},
              {sp:node.xb_bxb},
            ],
            visi:[node.bxb_sel,node.bxb_zi,node.xb_bxb1],
            sound:"see2"
          },
          {
            tousp:[
              {sp:node.xxb_nor},
              {sp:node.xb_xxb}
            ],
            visi:[node.xxb_sel,node.xxb_zi,node.xb_xxb1],
            sound:"see3"
          }
      ]


      for(var k=0;k<this.dataInfo.length;k++){
          var tousp = this.dataInfo[k].tousp
          for(var n in tousp){
            cc.log(tousp[n].sp)
              tousp[n].sp.num = k
              createTouchEvent({
                  swallow:true,
                  item:tousp[n].sp,
                  begin:function(data){
                     var result = judgeOpInPos(data)
                     if(!result){
                       return false
                     }
                      //其他看不见
                      for(var k=0;k<self.dataInfo.length;k++){
                          if(k != data.item.num){
                              var visiall = self.dataInfo[k].visi
                              for(var d in visiall)
                                  visiall[d].setVisible(false)
                          }
                      }
                          
                      //被点击的看的见
                       var visi = self.dataInfo[data.item.num].visi
                       for(var m in visi)
                           visi[m].setVisible(true)
                       var value = self.dataInfo[data.item.num].sound
                       if(self.curMusic != value){
                            self.curMusic = value
                            self.nodebs.say({
                                key: value,
                                force:true,
                                fun:function(){
                                  self.curMusic = null
                                }
                            })
                       }
                  }
              })
          }
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
      
        var soundlist = [res.smp1,res.smp2,res.smp3]
        for(var i = 1;i<=3;i++){
            keyname = "see"+i
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:soundlist[i-1]
            })
        }
    }
})