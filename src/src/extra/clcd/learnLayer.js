//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
    loadPlist("cl_aa")
    loadPlist("cl_bb")
  },
  ctor: function() {
    this._super();
    this.learnCtor()
    var self = this

    var createAcl = function(data){
      var frameName = data.frameName
      var start = data.start
      var end = data.end
      var pos = data.pos
      var father = data.father
      var tipImg = data.tipImg
      var sptip = new cc.Sprite(tipImg)

      var sp = new cc.Sprite()
      var ac = createAnimation({
                                frame:frameName,
                                start:start,
                                end: end,
                                time:0.08,
                            })
      sp.setPosition(pos)
      father.addChild(sp)

      sptip.setPosition(252,90)
      sp.addChild(sptip)
      sp.runAction(cc.repeatForever(ac))
    }

    var xue1_1 = new cc.Sprite(res.xue1_1)
    createAcl({
        father:xue1_1,
        pos:cc.p(60,315),
        frameName:"cl_aa%02d.png",
        start:0,
        end:22,
        tipImg:res.cl_word1,
    })
    createAcl({
        father:xue1_1,
        pos:cc.p(340,195),
        frameName:"cl_aa%02d.png",
        start:23,
        end:57,
        tipImg:res.cl_word2,
    })
    createAcl({
        father:xue1_1,
        pos:cc.p(60,95),
        frameName:"cl_aa%02d.png",
        start:58,
        end:80,
        tipImg:res.cl_word3,
    })
    

    var xue1_2 = new cc.Sprite(res.xue1_2)
    createAcl({
        father:xue1_2,
        pos:cc.p(60,315),
        frameName:"cl_bb%02d.png",
        start:0,
        end:19,
        tipImg:res.cl_word4,
    })
    createAcl({
        father:xue1_2,
        pos:cc.p(340,195),
        frameName:"cl_bb%02d.png",
        start:20,
        end:39,
        tipImg:res.cl_word5,
    })
    createAcl({
        father:xue1_2,
        pos:cc.p(60,95),
        frameName:"cl_bb%02d.png",
        start:40,
        end:69,
        tipImg:res.cl_word6,
    })

    self.initPagegsr({
              imgs: [
                [xue1_1,xue1_2],
                [res.xue2_1,res.xue2_2,res.xue2_3]
              ],
              pavedata: [{
                nodeX: 590,
                nodeY: 295,
                jdtpos:cc.p(230,80)
              }, {
                offsetx: 140,
                offsety: 25,
                jdtpos:cc.p(230,80)
              }],
              btns: [
                [res.xue1btn_nor, res.xue1btn_sel, res.xue1btn_dis],
                [res.xue2btn_nor, res.xue2btn_sel, res.xue2btn_dis]
              ],
              btnpos: [
                cc.p(430, 595),
                cc.p(752, 595)
              ]
            })
    
    return true
  }
})