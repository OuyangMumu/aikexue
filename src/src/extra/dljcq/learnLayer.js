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
        var img1 = new cc.Sprite(res.studytip1)
        img1.setPosition(568,593)
        self.addChild(img1)

        var img2 = new cc.Sprite(res.studytip2)
        img2.setPosition(568,593)
        self.addChild(img2)
        img2.setVisible(false)

        var list = self.initPagegsr({
			          imgs:[
			              [res.xue1_1,res.xue1_2],
			          ],
			          pavedata:[
			              {offsetx:100,offsety:43,jdtpos:cc.p(190, 80)},
			          
			          ],
			          func:function(data){
			          	var index = data.num
			          	if(index==1){
			          		img1.setVisible(true)
                            img2.setVisible(false)
			          	}else if(index==2){
                            img1.setVisible(false)
                            img2.setVisible(true)
			          	}
			          }
			        })
        return true
    }
})

