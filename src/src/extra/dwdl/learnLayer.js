//@author mu @14/5/10
var IMG_ZERO = 100
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("luan")
    },
    ctor: function() {
        this._super();
        this.learnCtor()

        var uiname = [
           "fuhuabtn1","fuhuabtn2","liu1","liu2"
        ]

        var imglist = []
        var imglist1 = []
        for(var k=1;k<=9;k++){
            var str = "touch"+k
            var danstr = "#dandan"+k+".png"
            uiname.push(str)
            imglist.push(danstr)

            if(k<=6){
              var str1 = "touchtwo"+k
              var danstr1 = "#wa"+k+".png"
              uiname.push(str1)
              imglist1.push(danstr1)
            }
        }
        var node =loadNode(res.learn,uiname)
        var setBtnEnable = function(btn, btnbool) {
          btn.setEnabled(btnbool)
          btn.setBright(btnbool)
        }
        setBtnEnable(node.fuhuabtn1,false)

        var imgsnode = new cc.Node()
        imgsnode.setPosition(getMiddle())   
        this.addChild(imgsnode, 500)

        node.fuhuabtn1.addClickEventListener(function(){
            setBtnEnable(node.fuhuabtn1,false)
            setBtnEnable(node.fuhuabtn2,true)
            node.liu1.setVisible(true)
            node.liu2.setVisible(false)
            node.addTouch("fuhua1")
            node.removeTouch("fuhua2")
        })

        node.fuhuabtn2.addClickEventListener(function(){
            setBtnEnable(node.fuhuabtn1,true)
            setBtnEnable(node.fuhuabtn2,false)
            node.liu1.setVisible(false)
            node.liu2.setVisible(true)
            node.addTouch("fuhua2")
            node.removeTouch("fuhua1")   
        })

        node.addTouch = function(btnshow){

            var templen = 0
            var key = null
            var curimglist = null
              switch(btnshow){
                case "fuhua1":
                templen = 9
                key = "touch"
                curimglist = imglist
                break
                case "fuhua2":
                templen = 6
                key = "touchtwo"
                curimglist = imglist1
                break
              }

              for(var i = 1;i<=templen;i++){
                 var itemname = key + i
                 var item = node[itemname]
                 item.index = i
                 item.imglist = curimglist
                 createTouchEvent({
                   item:item,
                   begin:function(data){
                      cc.log("currentIndex:",data.item.index)
                      var index = data.item.index
                      var list = data.item.imglist

                       var scaleimg = new cc.Sprite(list[index-1])
                       scaleimg.setPosition(25 * imgsnode.getChildrenCount(), 0)
                       scaleimg.index = index
                       createTouchEvent({
                              item: scaleimg,
                              begin: function(data) {
                                    data.item.setLocalZOrder(IMG_ZERO++)
                                    return true
                              },
                              move: function(data) {
                                    data.item.x += data.delta.x
                                    data.item.y += data.delta.y
                              }
                        })
                        scaleimg.setOpacity(150)
                        scaleimg.runAction(cc.sequence(cc.moveBy(0.1, 0, 10),
                              cc.callFunc(function() {
                                    scaleimg.setOpacity(255);
                              })))
                        var closebtn = new ccui.Button(res.btn_answerclose_normal, res.btn_answerclose_select)
                        closebtn.setPosition(scaleimg.width - 27, scaleimg.height - 23)
                        closebtn.setScale(0.9)
                        scaleimg.addChild(closebtn)
                        closebtn.addClickEventListener(function() {
                              this.getParent().removeFromParent(true)
                        })
                        for (var i in imgsnode.getChildren())
                              if (imgsnode.getChildren()[i].index == index)
                                    imgsnode.getChildren()[i].removeFromParent(true)

                        imgsnode.addChild(scaleimg)
                        scaleimg.setLocalZOrder(IMG_ZERO++)
                      return true
                   }
                 })
              }

              imgsnode.removeAllChildren()
        }

        node.removeTouch = function(btnshow){
            var templen = 0
            var key = null
              switch(btnshow){
                case "fuhua1":
                templen = 9
                key = "touch"
                break
                case "fuhua2":
                templen = 6
                key = "touchtwo"
                break
              }

              for(var i = 1;i<=templen;i++){
                 var itemname = key + i
                node[itemname].removeListen()
              }

        }

        node.addTouch("fuhua1")
  
        this.initPagegsr({
          imgs:[
              [res.xue1_1,res.xue1_2,res.xue1_3,res.xue1_4],
              [node],
          ],
          pavedata:[
              {offsetx: 60, offsety:75},
              {offsetx: 0, offsety:0}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
          ],
          btnpos:[
              cc.p(410,593),
              cc.p(730,593)
          ],
          btnSkipbackFun:function(){
            if(imgsnode)
                imgsnode.removeAllChildren()
          }
        })

        return true
    }
})

