var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this

        var createSp = function(img,pos,father){
          var sp = new cc.Sprite(img)
          sp.setPosition(pos)
          father.addChild(sp)
          return sp
        }

        var study_1 = new cc.Sprite(res.study_1)
        var study_2 = new cc.Sprite(res.study_2)
        var study_3 = new cc.Sprite(res.study_3)
        study_1.setScale(0.95)
        study_2.setScale(0.95)
        study_3.setScale(0.95)

        //对于第二张图加点动画
        var layout = createLayout({
            pos:cc.p(560,25),
            size:cc.size(250,450),
            clip:true,
        })
        study_2.addChild(layout)

        var gaizi = createSp(res.study_4,cc.p(561,23),study_2)
        gaizi.setAnchorPoint(0,0)

        var img1 = createSp(res.study_5,cc.p(123,80),layout)
        var img2 = createSp(res.study_6,cc.p(123,-650),layout)
        img1.setScaleX(0.9)
        img2.setScaleX(0.9)

        gaizi.runAction(cc.sequence(
          cc.delayTime(0.3),
          cc.callFunc(function(){
            addTimer({
              fun:function(){
                  img1.y = img1.y + 1.5
                  img2.y = img2.y + 1.5
                  if(img1.y > 820)
                    img1.y = -650
                  else if(img2.y > 835)
                    img2.y = -650
              },
              time:0.02,
              repeat:1000000000000000000000,
              key:"key"
            })
          })
        ))

        self.initPagegsr({
          imgs:[
              [study_1,study_2,study_3]
          ],
          pavedata:[
              {nodeX:568,nodeY:300,jdtpos:cc.p(190, 80)}
          ],
        })
        return true
    },
})