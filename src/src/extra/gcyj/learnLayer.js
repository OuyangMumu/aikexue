//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
        loadPlist("seeBook")
    },
    ctor: function() {
        this._super()
        this.learnCtor()
        var self = this
        var books = []
        for (var i = 0; i < 10; i++) {
        	var seeBookimg = new cc.Sprite("#mainimg.png")
        	var img = new cc.Sprite(sprintf("#imgs%d.png",i))
        	img.setPosition(830,235)
        	seeBookimg.addChild(img)
        	books[i] = seeBookimg
        }
        var curIndex = 0
        var list = self.initPagegsr({
			          imgs:[
			            books
			          ],
			          pavedata:[
			              {nodeX:410,nodeY:260,jdtpos:cc.p(190, 80)},
			          ],
			          titlepng:res.studytip,
			          titlepos:cc.p(0,10),
			          func:function(data){
			          	var index = data.num
                        if(curIndex!=index){
                            curIndex = index
                            playMusic(res[sprintf("studymp%d",index)])
                        }
			          }
			        })
        playMusic(res.studymp1)
        
        return true
    }
})

