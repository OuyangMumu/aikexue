var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           
        })
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
        var bindParent = function(node){
            var len = node.getChildrenCount()
            var children = node.getChildren()
            for(var i=0; i<len; i++){
                var childname = children[i].getName()
                node[childname] = children[i]
                bindParent(children[i])
            }
        } 
        this.node = ccs.load(res.see2).node
        bindParent(this.node)
        this.addChild(this.node)
    },
    initData:function(){
      var self = this
      var node = self.node
      this.dataInfo = [
          {
            tousp:[
              {sp:node.name1},
              {sp:node.it1}
            ],
            visi:[node.intro1,node.line1,node.name1,node.it1],
            sound:"see1"
          },
          {
            tousp:[
              {sp:node.name2},
              {sp:node.it2},
            ],
            visi:[node.intro2,node.line2,node.name2,node.it2],
            sound:"see2"
          },
          {
            tousp:[
              {sp:node.name3},
              {sp:node.sjt}
            ],
            visi:[node.intro3,node.line3,node.name3,node.it3],
            sound:"see3"
          },
          {
            tousp:[
              {sp:node.name4},
              {sp:node.it4}
            ],
            visi:[node.intro4,node.line4,node.name4,node.it4],
            sound:"see4"
          },
          {
            tousp:[
              {sp:node.name5},
              {sp:node.it5}
            ],
            visi:[node.intro5,node.line5,node.name5,node.it5],
            sound:"see5"
          },
          {
            tousp:[
              {sp:node.name6},
              {sp:node.tt}
            ],
            visi:[node.intro6,node.line6,node.name6,node.it6],
            sound:"see6"
          },
      ]


      for(var k=0;k<this.dataInfo.length;k++){
          var tousp = this.dataInfo[k].tousp
          cc.log("33")
          for(var n in tousp){
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
                self.nodebs.say({
                                key:"see7",
                                force:true
                            })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
      
        var soundlist = [res.smp1,res.smp2,res.smp3,res.smp4,res.smp5,res.smp6,res.smp7]
        for(var i = 1;i<=7;i++){
            keyname = "see"+i
            addContent({
                people: this.nodebs,
                key: keyname,
                sound:soundlist[i-1]
            })
        }
    }
})