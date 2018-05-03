var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        var self = this
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.yjjdkj_tableNode_json,
                            scale: 0.9,
                            inputNum:8,
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("rubber_plist")

        var uiList = [
            "node_qian","node_hou","node_zuo","node_you","node_shang","node_xia",
            "rod_qian","rod_hou","rod_zuo","rod_you","rod_shang","rod_xia","rod"
        ]
        var node = loadNode(res.yjjdkj_doAni_json, uiList)
        node.setPosition(560,150)
        self.inside_node.addChild(node)
        // var rodMv = ccs.load(res.yjjdkj_doAni_json).action
        // rodMv.retain()
        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var rubberList = []
        for(var i = 1 ; i < 9 ; i++){
            var name = "rubber"+i
            var rubber = node.getChildByName(name)
            rubberList.push(rubber)
        }

        var qh_rod = [node.rod_qian,node.rod_hou,0,1]
        var zy_rod = [node.rod_zuo,node.rod_you,2,3]
        var sx_rod = [node.rod_shang,node.rod_xia,4,5]
        
        for(var i = 0 ; i < 2 ; i++){
            sx_rod[i].over = false 
            zy_rod[i].over = false 
            qh_rod[i].over = false
            qh_rod[i].judgeNode = node[uiList[i]]
            zy_rod[i].judgeNode = node[uiList[i+2]]
            sx_rod[i].judgeNode = node[uiList[i+4]]
            sx_rod[i].index = sx_rod[2+i]
            zy_rod[i].index = zy_rod[2+i]
            qh_rod[i].index = qh_rod[2+i]
        }
        //前后左右上下
        var inF = [
            {
                pot: [1,4],
            },{
                pot: [2,7],
            },{
                pot: [2,0],
            },{
                pot: [4,6],
            },{
                pot: [2,5],
            },{
                pot: [3,4],
            }
        ]

        var judgeList = []  //用于判断当前棍子是否已显示
        for(var i = 0 ; i < 6 ; i++){
            judgeList[i] = false
        }
        var bookList = []
        var curBook = null
        var toolbtn = createTool({
            pos: cc.p(270, 540),
            nums: 4,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [99, 1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, 
                res.do_tools5, res.do_tools6, res.do_tools7],
            gets: [res.tools_4,res.tools_3,res.tools_3,res.tools_2,res.tools_2,
                res.tools_1,res.tools_1],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                item.opJudge = true
                if(index == 0){
                    if(curBook){
                        cc.log(!curBook.noMove)
                        if(!curBook.noMove){
                            curBook.removeFromParent(true)
                            curBook = null
                        }
                    }
                curBook = item
                item.noMove = false
                }
                return item 
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos

                if(index != 0){
                    if(!justOver && !item.isVisible()){
                        item.setVisible(true)
                        item.rod.setVisible(false)
                        judgeList[item.rod.index] = false
                    }
                }else{
                    if(item.noMove)
                        return false
                }
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                if(justOver)    return false //已倒 ，不能再放
                if(index ==0){//x 550 y 260 /270
                    var p = cc.p(node.node_shang.convertToWorldSpace(item.getParent()).x,
                        node.node_shang.convertToWorldSpace(item.getParent()).y+bookList.length*10)
                    if(!item.noMove && checkdistans2(p,item)){
                        item.setPosition(550,p.y)
                        item.noMove = true
                        bookList.push(item)
                        judgeDownFun()
                    }
                }
                if(index == 1 || index == 2){
                    judgeFun(item,qh_rod)
                }else if(index == 3 || index == 4){
                    judgeFun(item,zy_rod)
                }else if(index == 5 || index == 6){
                    judgeFun(item,sx_rod)
                }
            },
            backfun: function(){
                return true
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var justOver = false
        var judgeDownFun = function(){
            var judge = true
            var count = 0
            //第一种情况 0本书
            for(var i = 0 ; i < 6 ; i++){
                if(judgeList[i])
                    count++
            }
            switch(count){
                case 0://无棍子情况
                    justOver = true
                    playMv({})
                break
                case 1://一根棍子的情况
                    if(judgeList[4] || judgeList[5]){
                        playMv({})
                        justOver = true
                    }
                    if(bookList.length == 2){//放两本书,倒
                        justOver = true
                        if(judgeList[2]){ ///左边一根棍子
                            playMv({index:1})
                        }else if(judgeList[3]){ ///右边一根棍子
                            playMv({index:2})
                        }else if(judgeList[0]){ ///前边一根棍子
                            playMv({index:4})
                        }else if(judgeList[1]){ ///后边一根棍子
                            playMv({index:3})
                        }
                    }  
                break
                case 2://两根棍子的情况
                    if(judgeList[4] && judgeList[5] && bookList.length == 2){//上下两根，特例
                        playMv({})
                        justOver = true
                    }
                    if(bookList.length == 3){//判断放了三本书的时候，倒的方向
                        var index = have_two_rod()
                        playMv({index:index})
                        justOver = true
                    }
                break
                case 3://三根棍子的情况
                    if(bookList.length == 5){
                        justOver = true
                        var index = have_three_rod()
                        playMv({index:index})
                    }
                break
                case 4://四根棍子的情况
                    if(bookList.length == 7){
                        justOver = true
                        var index = have_four_rod()
                        playMv({index:index})
                    }
                break
                case 5://五根棍子的情况
                    if(bookList.length == 10){
                        justOver = true
                        var index = have_five_rod()
                        playMv({index:index})
                    }
                break
                case 6: //六根棍子
                    if(bookList.length == 15){
                        justOver = true
                        playMv({})
                    }
                break
            } 
        }

        var have_two_rod = function(){//得到其中的两个以存放的
            var list = []
            var index = null
            for(var i = 0 ; i < 6 ; i++){
                if(judgeList[i]){
                    list.push(i)
                }
            }
            var table_rad = [//两根棍子的14种情况
                {rod1:0,rod2:1,index:1},{rod1:0,rod2:2,index:4},
                {rod1:0,rod2:3,index:2},{rod1:0,rod2:4,index:4},
                {rod1:0,rod2:5,index:4},
                {rod1:1,rod2:2,index:1},{rod1:1,rod2:3,index:2},
                {rod1:1,rod2:4,index:3},{rod1:1,rod2:5,index:3},
                {rod1:2,rod2:3,index:2},{rod1:2,rod2:4,index:3},
                {rod1:2,rod2:5,index:3},
                {rod1:3,rod2:4,index:2},{rod1:3,rod2:5,index:2},
            ]
            for(var i =0; i< table_rad.length; i++){
                var rod1 = table_rad[i].rod1
                var rod2 = table_rad[i].rod2
                if((rod1 == list[0] && rod2 == list[1]) || (rod1 == list[1] && rod2 == list[0])){
                    index = table_rad[i].index
                    break
                }
            }
            return index
        }
        var have_three_rod = function(){//三根棍子的20种情况
            var list = []
            var index = null
            for(var i = 0 ; i < 6 ; i++){
                if(judgeList[i]){
                    list.push(i)//得到其中的三个以存放的
                }
            }
            var table_rad = [
                {rod1:0,rod2:1,rod3:2,index:1},{rod1:0,rod2:1,rod3:3,index:2},
                {rod1:0,rod2:1,rod3:4,index:1},{rod1:0,rod2:1,rod3:5,index:1},
                {rod1:0,rod2:2,rod3:3,index:4},{rod1:0,rod2:2,rod3:4,index:1},
                {rod1:0,rod2:2,rod3:5,index:1},{rod1:0,rod2:3,rod3:4,index:2},
                {rod1:0,rod2:3,rod3:5,index:2},{rod1:0,rod2:4,rod3:5,index:2},
                {rod1:1,rod2:2,rod3:3,index:3},{rod1:1,rod2:2,rod3:4,index:1},
                {rod1:1,rod2:2,rod3:5,index:1},{rod1:1,rod2:3,rod3:4,index:2},
                {rod1:1,rod2:3,rod3:5,index:2},{rod1:1,rod2:4,rod3:5,index:3},
                {rod1:2,rod2:3,rod3:4,index:1},{rod1:2,rod2:3,rod3:5,index:1},
                {rod1:2,rod2:4,rod3:5,index:1},
                {rod1:3,rod2:4,index:2},
            ]
            var count = 0
            for(var i=0; i< table_rad.length; i++){
                var rod1 = table_rad[i].rod1
                var rod2 = table_rad[i].rod2
                var rod3 = table_rad[i].rod3
                var rod = [rod1,rod2,rod3]
                for(var j = 0 ; j < 3 ; j++){
                    for(var k=0;k<3;k++){
                        if(list[j] == rod[k])
                            count++
                    }
                }
                index = table_rad[i].index
                if(count == 3)
                    break
            }

            return index
        }
        var have_four_rod = function(){//四根棍子的15种情况
            var list = []
            var index = null
            for(var i = 0 ; i < 6 ; i++){
                if(judgeList[i]){
                    list.push(i)//得到其中的三个以存放的
                }
            }
            var table = [
                {rod1:0,rod2:1,rod3:2,rod4:3,index:1},{rod1:0,rod2:1,rod3:2,rod4:4,index:1},
                {rod1:0,rod2:1,rod3:2,rod4:5,index:1},{rod1:0,rod2:1,rod3:3,rod4:4,index:2},
                {rod1:0,rod2:1,rod3:2,rod4:5,index:2},{rod1:0,rod2:1,rod3:4,rod4:5,index:2},
                {rod1:0,rod2:2,rod3:3,rod4:4,index:4},{rod1:0,rod2:2,rod3:3,rod4:5,index:4},
                {rod1:0,rod2:2,rod3:4,rod4:5,index:4},
                {rod1:0,rod2:3,rod3:4,rod4:5,index:4},
                {rod1:1,rod2:2,rod3:3,rod4:4,index:3},{rod:11,rod2:2,rod3:3,rod4:5,index:3},
                {rod1:1,rod2:2,rod3:4,rod4:5,index:3},
                {rod1:1,rod2:3,rod3:4,rod4:5,index:2},
                {rod1:2,rod2:3,rod3:4,rod4:5,index:3},
            ]
            var count = 0
            for(var i=0; i< table.length; i++){
                var rod1 = table[i].rod1
                var rod2 = table[i].rod2
                var rod3 = table[i].rod3
                var rod4 = table[i].rod4
                var rod = [rod1,rod2,rod3,rod4]
                for(var j = 0 ; j < rod.length ; j++){
                    for(var k=0;k<rod.length;k++){
                        if(list[j] == rod[k])
                            count++
                    }
                }
                index = table[i].index
                if(count == 4)
                    break
            }

            return index
        }
        var have_five_rod = function(){//五根棍子的6种情况
            var list = []
            var index = null
            for(var i = 0 ; i < 6 ; i++){
                if(judgeList[i]){
                    list.push(i)
                }
            }
            var table = [
                {rod1:0,rod2:1,rod3:2,rod4:3,rod5:4,index:2},{rod1:0,rod2:1,rod3:2,rod4:3,rod5:5,index:2},
                {rod1:0,rod2:1,rod3:2,rod4:4,rod5:5,index:1},{rod1:0,rod2:1,rod3:3,rod4:4,rod5:5,index:2},
                {rod1:0,rod2:2,rod3:3,rod4:4,rod5:5,index:4},{rod1:1,rod2:2,rod3:3,rod4:4,rod5:5,index:1},
            ]
            var count = 0
            for(var i=0; i< table.length; i++){
                var rod1 = table[i].rod1
                var rod2 = table[i].rod2
                var rod3 = table[i].rod3
                var rod4 = table[i].rod4
                var rod5 = table[i].rod5
                var rod = [rod1,rod2,rod3,rod4,rod5]
                for(var j = 0 ; j < rod.length ; j++){
                    for(var k=0;k<rod.length;k++){
                        if(list[j] == rod[k])
                            count++
                    }
                }
                index = table[i].index
                if(count == 5)
                    break
            }

            return index
        }
        
        var rodMv = ccs.load(res.yjjdkj_doAni_json).action
        rodMv.retain()
        //播放棍子倒的动画
        var playMv = function(data){//倒的顺序 ---恢复 右 左 前 后
            var index = data.index
            if(index == null)
                index = getRand()
            var inf = mvInf[index]
            node.stopAllActions()
            rodMv.clearFrameEventCallFunc()
            rodMv.gotoFrameAndPlay(inf.frame[0],inf.frame[1],false)
            rodMv.clearFrameEventCallFunc()
            node.runAction(rodMv)
            if(index != 0){
                for(var i = 0 ; i < bookList.length ; i++){
                    var book = bookList[i]
                    book.runAction(cc.moveTo(0.15,book.x+inf.pos[0],book.y+inf.pos[1]))
                }
            }
        }

        var getRand = function(){
            var rand = 1+ Math.floor(Math.random() * 4)
            return rand
        }

        var btn_reset = new ccui.Button(res.btn_reset_1,res.btn_reset_2)
        btn_reset.setPosition(1000,400)
        safeAdd(self, btn_reset)
        btn_reset.setScale(1.4)
        btn_reset.addClickEventListener(function(){
            justOver = false
            playMv({index:0})
            for(var i = bookList.length-1 ; i>=0 ; i--){
                bookList[i].removeFromParent(true)
                bookList.splice(i,1)
            }
        })

        var mvInf = [
            {
                frame:[1,4]
            },{
                frame:[5,9],
                pos:[150,-150]
            },{
                frame:[10,14],
                pos:[-200,-150]
            },{
                frame:[15,19],
                pos:[-100,-200]
            },{
                frame:[20,24],
                pos:[50,-100]
            }
        ]

        var judgeFun = function(item,list){
            var judge = comparDis(item,list[0],list[1])
            var rod = null
            if(!judge)  return false
            rod = judge
            if(!rod.isVisible()){
                rod.setVisible(true)
                judgeList[rod.index] = true
                item.setVisible(false)
                var pos = rod.judgeNode.convertToWorldSpace(node.getParent())
                item.setPosition(pos)
                item.rod = rod
                rubberAni(rubberList[inF[rod.index].pot[0]])
                rubberAni(rubberList[inF[rod.index].pot[1]])
            }
        }

        var rubberAni = function(rubber){
            rubber.runAction(rubber_ani())
        }

        var comparDis = function(ra,rb,rc){
            var dx = ra.x - rb.judgeNode.convertToWorldSpace(ra.getParent()).x
            var dy = ra.y - rb.judgeNode.convertToWorldSpace(ra.getParent()).y
            var dz = ra.x - rc.judgeNode.convertToWorldSpace(ra.getParent()).x
            var dw = ra.y - rc.judgeNode.convertToWorldSpace(ra.getParent()).y
            var d1 = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            var d2 = Math.sqrt(Math.pow(dz,2) + Math.pow(dw,2))

            if((d1 < d2) && d1 < 80)
                return rb 
            else if((d2 < d1) && d2 < 80)
                return rc
            else 
                return null
        }

        var checkdistans = function(ra,rb){
            var dx = ra.convertToNodeSpace(node.getPosition()).x - rb.x
            var dy = ra.convertToNodeSpace(node.getPosition()).y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 80)
                return true
            else
                return false
        }

        var checkdistans2 = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 80)
                return true
            else
                return false
        }

        var rubber_ani = function(){
            return cc.sequence(createAnimation({
                frame: "rubber%02d.png",
                start: 1,
                end: 16,
                time:0.05
            }))
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})