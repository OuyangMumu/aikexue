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
        var uilist = [
        "danan","daanbtn","clearbtn","tipcolse",
        "boytiao"
        ]
        this.tiaonode = loadNode(res.gcst_tiaosheng,uilist)
        this.txtlist = []
        for(var i=1; i<=6;i++){
            var tmp = this.tiaonode.getChildByName("txt"+i)
            addInput({
              item:tmp,
              color:cc.color(200,50,7),
              size:28,
              strlen:2 
            })
            this.txtlist.push(tmp)
        }

        this.tiaofun()
        self.initPagegsr({
          imgs:[
              [res.xue1_1,self.tiaonode],
              [res.xue2_1,res.xue2_2,res.xue2_3,res.xue2_4],
              [res.xue3_1]
          ],
          pavedata:[
              {offsetx: 100, offsety:20},
              {offsetx: 100, offsety:40},
              {offsetx: 120, offsety:5}
          ],
          btns:[
              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
              [res.xue2btn_sel,res.xue2btn_dis,res.xue2btn_nor],
              [res.xue3btn_nor,res.xue3btn_dis,res.xue3btn_sel]
          ],
          btnpos:[
              cc.p(280,593),
              cc.p(565,593),
              cc.p(840,593)
          ]
          // func:function(data){
          //     var num = data.num
          //     if(num==1){
          //         if(self.tiaonode.danan.getScale()){
          //             var tibg = self.tiaonode.danan.getChildByName("tibg")
          //             tibg.removeListen()
          //             self.tiaonode.danan.runAction(cc.scaleTo(0.2,0))
          //         }
          //     }
          // }
        })

        return true
    },
    tiaofun:function(){
        var self = this
        this.tiaonode.danan.setScale(0)
        var boysc = ccs.load(res.gcst_tiao).action
        boysc.gotoFrameAndPlay(0,35,true)
        this.tiaonode.boytiao.runAction(boysc)
        var outInfun = function(){

             safeAdd(self,self.tiaonode.danan)
             self.tiaonode.danan.setPosition(cc.winSize.width/2,cc.winSize.height/2)

            var tibg = self.tiaonode.danan.getChildByName("tibg")
            if(self.tiaonode.danan.getScale()){
                tibg.removeListen()
                self.tiaonode.danan.runAction(cc.scaleTo(0.2,0))
            }else{
                createTouchEvent({
                    item:tibg,
                    beginfail:function(){
                       tibg.removeListen()
                       self.tiaonode.danan.runAction(cc.scaleTo(0.2,0))
                       return false
                    },
                    begin:function(data){
                        return true
                    },
                    move:function(data){
                        data.item.getParent().x += data.delta.x
                        data.item.getParent().y += data.delta.y
                    }
                })
                self.tiaonode.danan.runAction(cc.scaleTo(0.2,1))
            }
        }
        this.tiaonode.tipcolse.addClickEventListener(outInfun)
        this.tiaonode.daanbtn.addClickEventListener(outInfun)
        this.tiaonode.clearbtn.addClickEventListener(function(){
            var tibg = self.tiaonode.danan.getChildByName("tibg")
            if(self.tiaonode.danan.getScale()){
                tibg.removeListen()
                self.tiaonode.danan.runAction(cc.scaleTo(0.2,0))
            }

            for(var i in self.txtlist)
                self.txtlist[i].clear("")
        })
    }
})

