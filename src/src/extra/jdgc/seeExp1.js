/**
 * Created by Administrator on 2016/7/24.
 */
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI: function () {
        var self = this
        var node = loadNode(res.jdgc_see1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"see1_tip1"})
        })
        var fxBtn = node.getChildByName("fxbtn");
        var faxian = node.getChildByName("faxian");

        var tipList = ["see1_sound1","see1_sound2","see1_sound3","see1_sound4"]
        var tog = [res.bsw00, res.psh00, res.s00, res.xg00];

        var noTog = [res.bsw01, res.psh01, res.s01, res.xg01];

        fxBtn.addClickEventListener(function () {
            self.nodebs.say({key:"see1_faxian"})
        })
        var jsAy = [];
        var nodeAy = [];
        for(var i = 1; i<5;i++){
            var jsName = "js0"+i;
            var jsSp = node.getChildByName(jsName);
            jsAy.push(jsSp);
            var nName = "Node"+i;
            var nSp = node.getChildByName(nName);
            nodeAy.push(nSp);
        }

        var bsw = new ccui.Button(tog[0],noTog[0])
        nodeAy[0].addChild(bsw)
        bsw.addClickEventListener(function () {
            getSound(0)
        })
        var psh = new ccui.Button(tog[1],noTog[1])
        nodeAy[1].addChild(psh)
        psh.addClickEventListener(function () {
            getSound(1)
        })
        var s = new ccui.Button(tog[2],noTog[2])
        nodeAy[2].addChild(s)
        s.addClickEventListener(function () {
            getSound(2)
        })
        var xg = new ccui.Button(tog[3],noTog[3])
        nodeAy[3].addChild(xg)
        xg.addClickEventListener(function () {
            getSound(3)
        })
        var btAy = [bsw,psh,s,xg]
        var getSound = function (index) {
            for(var i = 0;i<4;i++){
                if(i != index){
                    jsAy[i].setVisible(false);
                    btAy[i].loadTextures(tog[i],noTog[i])
                }else{
                    jsAy[i].setVisible(true);
                    btAy[i].loadTextures(noTog[i],tog[i])
                    self.nodebs.say({key:tipList[i],force:true})
                }
            }
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_sound1",sound:res.see1_sound1},
            {key:"see1_sound2",sound:res.see1_sound2},
            {key:"see1_sound3",sound:res.see1_sound3},
            {key:"see1_sound4",sound:res.see1_sound4},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
            people: this.nodebs,
            key: addList[i].key,
            sound: addList[i].sound,
        })
        }
        addContent({
            people: this.nodebs,
            key: "see1_tip1",
            img: res.see1_tip1,
            sound: res.see1_tipSound1,
        })
        addContent({
            people: this.nodebs,
            key: "see1_faxian",
            img: res.see1_faxian,
            sound: res.see1_faxian_sound,
            id:"result"
        })
    },
})