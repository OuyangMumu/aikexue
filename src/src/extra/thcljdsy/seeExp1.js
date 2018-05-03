var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
          loadPlist("zi")
        })
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      var uiName = []
      var ThNode = loadNode(res.ThNode,uiName)
      ThNode.setPosition(getMiddle(-70,20))
      self.addChild(ThNode)

      var nors = []
      var sels = []
      var zis = []
      var tous = []
      var pos = [cc.p(638,540),cc.p(636,460),cc.p(643,380),cc.p(677,355),cc.p(664,224),cc.p(648,110)]
      var selpos =[cc.p(500,583),cc.p(499,439.5),cc.p(499,410),cc.p(499,271),cc.p(490,48),cc.p(500,506.5)]
      var reds = []
      for (var i = 0; i < 6; i++) {
          nors[i] = new cc.Sprite(sprintf("#zi_nor%d.png",i+1))
          nors[i].setPosition(pos[i])
          self.addChild(nors[i])

          sels[i] = new cc.Sprite(sprintf("#zi_sel%d.png",i+1))
          sels[i].setPosition(pos[i])
          sels[i].setVisible(false)
          self.addChild(sels[i])

          zis[i] = new cc.Sprite(sprintf("#zi%d.png",i+1))
          zis[i].setPosition(235,315)
          zis[i].setVisible(false)
          self.addChild(zis[i])

          reds[i] = new cc.Sprite(res[sprintf("wu_sel%d",i+1)])
          reds[i].setPosition(selpos[i])
          reds[i].setVisible(false)
          self.addChild(reds[i])
          reds[i].setLocalZOrder(3)
          if(i == 2){
            reds[i].setLocalZOrder(10)
          }

          tous[i] = new cc.Sprite(res.tou_img)
          tous[i].setPosition(760,510 - 72*i)
          tous[i].setOpacity(0)
          self.addChild(tous[i])   
      }

      //配置参数
      var dataInfo = [
            {
                tousp:[
                  {sp:tous[0]},
                  {sp:reds[0]}
                ],
                visi:[zis[0],sels[0],reds[0]],
                sound:"see1"
            },
            {
                tousp:[
                   {sp:tous[1]},
                   {sp:reds[5]}
                ],
                visi:[zis[1],sels[1],reds[5]],
                sound:"see2"
            },
            {
                tousp:[
                   {sp:tous[2]},
                   {sp:reds[2]}
                ],
                visi:[zis[2],sels[2],reds[2]],
                sound:"see3"
            },
            {
                tousp:[
                   {sp:tous[3]},
                   {sp:reds[1]}
                ],
                visi:[zis[3],sels[3],reds[1]],
                sound:"see4"
            },
            {
                tousp:[
                   {sp:tous[4]},
                   {sp:reds[3]}
                ],
                visi:[zis[4],sels[4],reds[3]],
                sound:"see5"
            },
            {
                tousp:[
                   {sp:tous[5]},
                   {sp:reds[4]}
                ],
                visi:[zis[5],sels[5],reds[4]],
                sound:"see6"
            }
        ]

      //通用点击方法
      var touchs = true
      for(var k=0;k<dataInfo.length;k++){
          var tousp = dataInfo[k].tousp
          for(var n in tousp){
              cc.log(tousp[n].sp.getName())
              tousp[n].sp.num = k

              createTouchEvent({
                  swallow:true,
                  item:tousp[n].sp,
                  begin:function(data){
                      if(touchs){
                          touchs = false
                          //其他看不见
                          var result = true//judgeOpInPos(data)
                          if(result){
                              for(var k=0;k<dataInfo.length;k++)
                                  if(k != data.item.num){
                                      var visiall = dataInfo[k].visi
                                      for(var d in visiall)
                                          visiall[d].setVisible(false)
                                  }
                              //被点击的看的见
                              var visi = dataInfo[data.item.num].visi
                              for(var m in visi)
                                 visi[m].setVisible(true)
                              var value = dataInfo[data.item.num].sound
                              if(curMusic != value){
                                  curMusic = value
                                  self.nodebs.say({
                                      key: value,
                                      force:true,
                                      fun:function(){
                                         curMusic = null
                                      }
                                  })
                              }
                          }
                      }
                      return true
                  },
                  end:function(){
                      touchs = true
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
    speakeBykey:function(key){
        this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
        for(var i = 1; i <= 6; i++){
            addContent({
                people: this.nodebs,
                key: sprintf("see%d",i),
                sound: res[sprintf("seemp%d",i)]
            })
        }
    }
})