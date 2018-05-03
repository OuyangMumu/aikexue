//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var uiname = ["mainNode","learnbtn1","learnbtn2",
        "learnbtn3","learnbtn4"]
        var learnnode = loadNode(res.learn_csb,uiname)
        learnnode.setPosition(getMiddle()) 
        this.addChild(learnnode)
        this.learnnode = learnnode
        this.img_title.setVisible(false)
        self.curKey = null

        self.nodelist = self.initPagegsr({
                          imgs:[
                              [res.xue1_1,res.xue1_2],
                          ],
                          pavedata:[
                              {offsetx: 110, offsety:40,jdtpos:cc.p(230, 90)},
                          ],
                          titlepng:res.btntitle1
                        })
        
        learnnode.ListNodeShow = function(showbool){
            var disPos =  showbool ? 115 : -600
            self.nodelist[0].getPageViewNode().y = disPos
            self.nodelist[0].getPageViewNode().jdt.y = showbool ? 85:-600
            self.btnright.y = showbool ? 50: -400
            self.btnleft.y = showbool ? 50: -400
            self.img_page.setVisible(showbool)
            self.img_title.setVisible(showbool)
        }
        learnnode.ListNodeShow(false)
        
        var setOtherBtn = function(jude){
            var learnbtnList = [learnnode.learnbtn1,learnnode.learnbtn2,
            learnnode.learnbtn3,learnnode.learnbtn4]
            for(var i in learnbtnList){
              learnbtnList[i].setEnabled(jude)
            }
        }
        
        self.clockBtn = true
        learnnode.learnbtn1.addClickEventListener(function(){
            if(self.clockBtn){
                self.clockBtn = false
                learnnode.mainNode.setVisible(false)
                self.img_title.setVisible(true)
                self.gsrback.setVisible(true)
                self.curKey = "xue1"
                learnnode.ListNodeShow(true)
            } 
        })

        var btnInfo = [
         {
          key:"xue2",
          btn:learnnode.learnbtn2,
          showImg:res.xue2_1,
          btntitle:res.btntitle2
         },
         {
          key:"xue3",
          btn:learnnode.learnbtn3,
          showImg:res.xue3_1,
          btntitle:res.btntitle3
         },
         {
          key:"xue4",
          btn:learnnode.learnbtn4,
          showImg:res.xue4_1,
          btntitle:res.btntitle4
         }
        ]
        for (var i = btnInfo.length - 1; i >= 0; i--) {
          btnInfo[i].btn.index = i
          btnInfo[i].btn.addClickEventListener(function(){
              if(self.clockBtn){
                self.clockBtn = false
                var xue = new cc.Sprite(btnInfo[this.index].showImg)
                xue.setPosition(getMiddle(0,-20))
                self.addChild(xue)
                self.curKey = btnInfo[this.index].key
                self[self.curKey] = xue
                learnnode.mainNode.setVisible(false)
                self.img_title.setVisible(true)
                self.gsrback.setVisible(true)
                self.img_title.loadTexture(btnInfo[this.index].btntitle)
                self.img_title.setContentSize(getSize(btnInfo[this.index].btntitle))
              }
          })
        }

        self.gsrback = new ccui.Button(res.gsrback_nor, res.gsrback_sel)
        self.gsrback.setPosition(300,593)
        self.addChild(self.gsrback)
        self.gsrback.setVisible(false)
        self.gsrback.addClickEventListener(function(){
            learnnode.mainNode.setVisible(true)
            self.img_title.setVisible(false)
            this.setVisible(false)
            self.clockBtn = true
            if(self.curKey == "xue1"){
              learnnode.ListNodeShow(false)
              return
            }
            if(self.curKey && self[self.curKey]){
               self[self.curKey].removeFromParent()
               self[self.curKey] = null
            }
        })

        return true
    }
})

