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
        var uiName = []
        for (var i = 0; i < 5; i++) {
        	uiName.push(sprintf("box%d",i+1))
        	uiName.push(sprintf("box%d_1",i+1))
        }
        var boyNode = loadNode(res.learncsb,uiName)
        boyNode.setScale(0.9)
        self.boyNode = boyNode

        self.registerSprite()

        var list = self.initPagegsr({
			          imgs:[
			              [boyNode],
			              [res.xue2_1,res.xue2_2,res.xue2_3,res.xue2_4,res.xue2_5]
			          ],
			          pavedata:[
			              {nodeX: 568, nodeY:135,jdtpos:cc.p(190, 80)},
			              {offsetx: 100,offsety:30,jdtpos:cc.p(150, 80)}
			          
			          ],
			          btns:[              
			              [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
			              [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis]
			          ],
			          btnpos:[
			              cc.p(400,594),
			              cc.p(750,594)
			          ],
			          btnSkipbackFun:function(tag){
                          if(tag==0){
                          	boyNode.stopAllActions()
                            var ac = ccs.load(res.learncsb).action
				    		ac.gotoFrameAndPlay(0,1,false)
				    		boyNode.runAction(ac)
				    		self.allCount = 0
                          }else if(tag==1){
                            boyNode.stopAllActions()
                          }
			          }
			        })
        list[0].setListnerlayerEnable(true)

        return true
    },
    registerSprite:function(){
        var self = this
        self.allCount = 0
        var boyNode = self.boyNode
        for (var i = 0; i < 5; i++){
        	var sp = boyNode[sprintf("box%d",i+1)]
        	sp.des = boyNode[sprintf("box%d_1",i+1)]
        	sp.initPos = sp.getPosition()
        	//sp.setVisible(false)
        	createTouchEvent({
        		item:sp,
        		begin:function(data){
        		   var item = data.item
        		   var result = judgeOpInPos(data)
        		   if(result)
        		   {
        		   	 item.setLocalZOrder(LOCAL_ORDER++)
        		   }
        		   return result
        		},
        		autoMove:true,
        		end:function(data){
        		   var item = data.item
        		   if(judgeItemCrash({item1:item,item2:item.des}))
        		   {
        		   		item.des.setVisible(true)
        		   		self.allCount++
        		   		item.setVisible(false)
        		   		item.setPosition(0,-300)
        		   		self.checkCanPlay()
        		   }else{
        		   	    item.setPosition(item.initPos)
        		   }
        		}
        	})
        }
    },
    checkCanPlay:function(){
    	var self = this
    	var boyNode = self.boyNode
    	if(self.allCount==5)
    	{
    		var ac = ccs.load(res.learncsb).action
    		ac.gotoFrameAndPlay(9,255,false)
    		boyNode.runAction(ac)
    	}
    }
})

