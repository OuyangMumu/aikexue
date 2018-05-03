var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        this.load()
        var self = this
        self.initPageBtns([{
            btn: [res.learn_btn1_normal, res.learn_btn1_select, res.learn_btn1_act],
            createFun: function(){
                var bg = new cc.Sprite(res.study_1)
                bg.setPosition(568,320)
                bg.touch = new cc.Sprite(res.study_6)
                bg.touch.setPosition(66,338)
                bg.addChild(bg.touch)
                bg.result = new cc.Sprite(res.study_5)
                bg.result.setPosition(bg.width/2,bg.height/2)
                bg.addChild(bg.result)
                bg.result.setScale(0)
                bg.btn_close = new ccui.Button(res.btn_result_quit_normal,res.btn_result_quit_select)
                bg.btn_close.setPosition(bg.result.width-30,bg.result.height-30)
                bg.result.addChild(bg.btn_close)
                bg.btn_close.addClickEventListener(function(){
                    bg.result.runAction(cc.scaleTo(0.2,0))
                })
                createTouchEvent({
                    item:bg.touch,
                    begin:function(data){
                        if(bg.result.getScale() == 0){
                            bg.result.setPosition(bg.width/2,bg.height/2)
                            bg.result.runAction(cc.scaleTo(0.2,1))
                        }else{
                            bg.result.runAction(cc.scaleTo(0.2,0))
                        }
                        return true
                    },
                })
                return bg
            }
        }, {
            btn: [res.learn_btn2_normal, res.learn_btn2_select, res.learn_btn2_act],
            pics: [res.study_2,res.study_3,res.study_4],
        }])
        return true
    },
})