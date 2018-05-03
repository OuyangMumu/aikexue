/**
 * Created by Administrator on 2016/7/25.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({})
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI : function(){
    	var self = this
    	var tmpThis = this
    	var node = loadNode(res.wdhwdj_do1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_sound0"})
        })

        var doExpLayer = node

        var text7 = doExpLayer.getChildByName("wenzi0007");
        tmpThis.lineay = [];
        tmpThis.textay = [];
        tmpThis.nodeay = [];
        tmpThis.togay = [];
        for(var i = 1;i<=6;i++){
            var lineName = "line"+i;
            var linesp = doExpLayer.getChildByName(lineName);
            tmpThis.lineay.push(linesp);
            linesp.setTag(40+i);
            var textName = "wenzi000"+i;
            var textsp = doExpLayer.getChildByName(textName);
            tmpThis.textay.push(textsp);
            var nodeName = "Node"+i;
            var nodesp = doExpLayer.getChildByName(nodeName);
            tmpThis.nodeay.push(nodesp);

            self.sixTog = [
			    res.text1,res.text2,res.text3,res.text4,res.text5,res.text6,
			    res.MC10001,res.MC20001,res.MC30001,res.MC40001,res.MC50001,
			];

			self.sixNoTog = [
			    res.notext1,res.notext2,res.notext3,res.notext4,res.notext5,res.notext6,
			    res.MC10002,res.MC20002,res.MC30002,res.MC40002,res.MC50002,
			];

            var toggle = new ccui.Button(self.sixTog[i-1],self.sixNoTog[i-1])
            nodesp.addChild(toggle);
            toggle.setTag(30+i);
            tmpThis.togay.push(toggle);

            toggle.addClickEventListener(function(selector,type){
                if(text7.isVisible())
                    text7.setVisible(false);
                tmpThis.setToggle(selector.getTag()-31);
            });
        }

        var Listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if(touch.getLocationX() > 390 && touch.getLocationX() < 420){
                        var curTag = target.getTag()-41;
                        if(text7.isVisible())
                            text7.setVisible(false);
                        tmpThis.setToggle(curTag);

                        return true;
                    }
                }
                return false;
            },
            onTouchMoved:function(touch,event){
            },
            onTouchEnded:function(touch,event){}
        });
        for(var i = 0;i<6;i++){
            cc.eventManager.addListener(Listener.clone(),tmpThis.lineay[i]);
        }     
    },

    setToggle:function(index){
        var tmpThis = this;
        var addList = [
            "do1_sound1",
            "do1_sound2",
            "do1_sound3",
            "do1_sound4",
            "do1_sound5",
            "do1_sound6",
        ]
        for(var i = 0;i<=5;i++){
            if(i != (index)){
                tmpThis.lineay[i].setVisible(false);
                tmpThis.textay[i].setVisible(false);
                tmpThis.togay[i].loadTextures(tmpThis.sixTog[i],tmpThis.sixNoTog[i])
            }else{
                tmpThis.lineay[i].setVisible(true);
                tmpThis.textay[i].setVisible(true);
                tmpThis.togay[i].loadTextures(tmpThis.sixNoTog[i],tmpThis.sixTog[i])
                tmpThis.nodebs.say({key:addList[i],force:true})
            }
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_sound0",sound:res.do1_sound0},
            {key:"do1_sound1",sound:res.do1_sound1},
            {key:"do1_sound2",sound:res.do1_sound2},
            {key:"do1_sound3",sound:res.do1_sound3},
            {key:"do1_sound4",sound:res.do1_sound4},
            {key:"do1_sound5",sound:res.do1_sound5},
            {key:"do1_sound6",sound:res.do1_sound6},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
        	addContent({
            people: this.nodebs,
            key: addList[i].key,
            sound: addList[i].sound,
        	})
        }
	},
})