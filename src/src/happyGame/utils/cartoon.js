//2017/8/17
//控制游戏人物的创建及调用

var cartoonFunc = {
	myInit: false,
	mouseInit: false,
}
//四个人物的调用,添加切换
var addCartoon = function(data){
	var id = data.id || 0//kexue naojin shijie tonghua
	var pos = data.pos
	var father = data.father
	var layer = data.layer || "answer"

	var node = new cc.Node()
	node.setPosition(pos)
	father.addChild(node)
	if(!cartoonFunc.myInit){  //控制外界只调用一次
		cartoonFunc.myInit = true
		loadPlist("select_cartoon_plist")
	}
	switch(id){
		case 0:
			id = "kexue"
			node.bodyPos = cc.p(0,110)
			node.facePos = cc.p(6,133)
		break
		case 1:
			id = "naojin"
			node.bodyPos = cc.p(0,120)
			node.facePos = cc.p(-15,133)
		break
		case 2:
			id = "shijie"
			node.bodyPos = cc.p(0,120)
			node.facePos = cc.p(-19,133)
		break
		case 3:
			id = "tonghua"
			node.bodyPos = cc.p(0,150)
			node.facePos = cc.p(-10,184)
			node.setScale(0.85)
		break
		default:
			cc.log("wrong id was call in addCartoon")
		break
	}

	node.bodyFrame = sprintf("#cartoon_%s_body01.png",id)
	node.body = new cc.Sprite(node.bodyFrame)
	node.body.setPosition(node.bodyPos)
	node.addChild(node.body)
	node.faceFrame = sprintf("#cartoon_%s_face01.png",id)
	node.face = new cc.Sprite(node.faceFrame)
	node.face.setPosition(node.facePos)
	node.addChild(node.face)

	node.repeatFun = function(item,frame,time,end,delayTime){
		item.runAction(cc.repeatForever(cc.sequence(
			aniPlay({
				frame: frame,
				end: end,
				time:time,
			}),
			aniPlay({
				frame: frame,
				end: end,
				time: time,
				rever:true,
			}),
			cc.delayTime(delayTime)
		)))
	}

	//body动画
	node.frame = sprintf("cartoon_%s_body%s.png",id,"%02d")
	node.repeatFun(node.body,node.frame,0.15,4,0.1)
	node.setScaleX(-(node.getScaleX()))

	//脸部表情
	node.faceAction = function(myAction){
		switch(myAction){
			case "normal":
				node.frameFace = sprintf("cartoon_%s_face%s.png",id,"%02d")
				node.face.stopAllActions()
				node.repeatFun(node.face,node.frameFace,0.15,3,3)
			break
			case "happy":
				node.frameHappy = sprintf("cartoon_%s_xiao%s.png",id,"%02d")
				node.face.stopAllActions()
				node.face.runAction(cc.sequence(
					cc.callFunc(function(){
						node.repeatFun(node.face,node.frameHappy,0.1,2,0.1)
					}),
					cc.delayTime(1),
					cc.callFunc(function(){
						node.face.stopAllActions()
						node.face.setSpriteFrame(sprintf("cartoon_%s_face01.png",id))
					})
				))
			break
			case "unhappy":
				node.frameunHappy = sprintf("cartoon_%s_ku%s.png",id,"%02d")
				node.face.stopAllActions()
				node.face.runAction(cc.sequence(
					cc.callFunc(function(){
						node.repeatFun(node.face,node.frameunHappy,0.1,3,0.1)
					}),
					cc.delayTime(2),
					cc.callFunc(function(){
						node.face.stopAllActions()
						node.face.setSpriteFrame(sprintf("cartoon_%s_face01.png",id))
					})
				))
			break
			default:
				cc.log("wrong action")
			break
		}
	}
	//判断是否是在选择层，调用脸部动画
	if(layer != "answer"){
		node.faceAction("normal")
	}
	return node
}

//主界面两个人物动画
var cartoon_main_action = function(father){
	var self = father
	loadPlist("main_cartoon_plist")
	var dataBase = {}
	dataBase.cartoon_1 = createSp({
		img: "#cartoon_1_body01.png",
		pos: cc.p(910,150),
		father: self
	})
	dataBase.cartoon_1_face = createSp({
		img: "#cartoon_1_face01.png",
		pos: cc.p(86,143),
		father: dataBase.cartoon_1,
	})
	dataBase.cartoon_2 = createSp({
		img: "#cartoon_2_body01.png",
		pos: cc.p(1030,185),
		father: self
	})
	dataBase.cartoon_2_face = createSp({
		img: "#cartoon_2_face01.png",
		pos: cc.p(80,157),
		father: dataBase.cartoon_2,
	})

	//播放动画
	dataBase.actionFun = function(item,frame,end,time,delayTime){
		item.runAction(cc.repeatForever(cc.sequence(
			aniPlay({
				frame: frame,
				end: 3,
				time:time,
			}),
			aniPlay({
				frame: frame,
				end: 3,
				time: time,
				rever:true,
			}),
			cc.delayTime(delayTime)
		)))
	}
	
	dataBase.actionFun(dataBase.cartoon_1,"cartoon_1_body%02d.png",4,0.15,0.1)
	dataBase.actionFun(dataBase.cartoon_2,"cartoon_2_body%02d.png",3,0.15,0.1)
	dataBase.actionFun(dataBase.cartoon_1_face,"cartoon_1_face%02d.png",3,0.15,1.5)
	dataBase.actionFun(dataBase.cartoon_2_face,"cartoon_2_face%02d.png",3,0.15,1)
}

//创建地鼠
var createMouse = function(){
	var mouse = new cc.Node()
	if(!cartoonFunc.mouseInit){
		cartoonFunc.mouseInit = true 
		loadPlist("mouse_plist")
	}
	var land1 = createSp({
		img:"#mouse_land01.png",
		pos:cc.p(8.5,-32),
		father:mouse
	})
	mouse.body = createSp({
		img:"#mouse_body02.png",
		pos:cc.p(0,0),
		father:mouse
	})
	mouse.head = createSp({
		img:"#mouse_head.png",
		pos:cc.p(4,47),
		father:mouse
	})
	mouse.face = createSp({
		img:"#mouse_face01.png",
		pos:cc.p(4,45),
		father:mouse
	})

	var land2 = createSp({
		img:"#mouse_land02.png",
		pos:cc.p(7,-53),
		father:mouse
	})

	mouse.ban = createSp({
		img:"#mouse_ban.png",
		pos:cc.p(4,-18),
		father:mouse
	})

	return mouse
}
//地鼠管理类
var MouseManger = {
	mouseList:[],
	addMouse:function(mouse){
		if(MouseManger.mouseList){
			MouseManger.mouseList.push(mouse)
		}
	},
	createMousesBynum:function(num,parent){
		for (var i = 0; i < num; i++) {
			var temp = createMouse()
			parent.addChild(temp)
			MouseManger.addMouse(temp)
		}
	},
	mouseByData:function(dataList){
		if(MouseManger.mouseList){
			for (var i = 0; i < dataList.length; i++) {
				var amouse = MouseManger.mouseList[i]
				amouse.data = dataList[i]
				amouse.setPosition(amouse.data.pos)
			}
		}
	}
}
//创建金币
var coinManger = {}
coinManger.coinList = []
coinManger.father = null
coinManger.topos = cc.p(1020,620)
coinManger.newCoinAndAdd = function(num){
	if(!cartoonFunc.mouseInit){
		cartoonFunc.mouseInit = true 
		loadPlist("mouse_plist")
	}
	if(coinManger.father){
		for (var i = 0; i < num; i++) {
			var gold = createSp({
				img:"#goldImg01.png",
				pos:cc.p(200,100),
				father:coinManger.father
			})
			gold.setScale(0.8)
			gold.setVisible(false)
			coinManger.coinList.push(gold)
			gold.playself = function(delay,pos){
				var gold = this
				gold.setScale(0)
				gold.setVisible(true)
				gold.runAction(cc.sequence(
					cc.delayTime(delay),
					cc.scaleTo(0.3,0.8),
					cc.moveTo(0.4,pos).easing(cc.easeOut(0.5)),
					cc.callFunc(function(){
					    if(gameNodes.coin){
					    	gameNodes.coin.addCoin(1)
					    }
						gold.setVisible(false)
						gold.stopAllActions()
					})
				))
			}
		}
	}
}

coinManger.showAll = function(pos){
	if(coinManger.coinList){
		for (var i = 0; i < coinManger.coinList.length; i++){
			var coin = coinManger.coinList[i]
			coin.setPosition(pos)
			coin.playself(i*0.4+(0.23-i*0.05),coinManger.topos)
		}
	}
}

//创建地鼠及其动作
var createMouseFun = function(data){
	var father = data.father
	var mouseList = []
	var mouseFunc = {}  //返回到外部，进行调用方法

	//此处调用卡通人物，从外部传入，判断是哪一个科目调用哪一个人物
	var cartoon = addCartoon({
		id:baseData.curSubject,
		pos:cc.p(100,50),
		father:father,
		layer:"answer"
	})

	if(!cartoonFunc.mouseInit){
		cartoonFunc.mouseInit = true 
		loadPlist("mouse_plist")
	}

	//需要先读取地鼠，才可以创建锤子，锤子的资源和地鼠在一块
	var hammer = createSp({
		img:"#hammer01.png",
		pos:cc.p(200,200),
		father:father,
	})
	hammer.setLocalZOrder(100)
	hammer.setVisible(false)

	hammer.tears = createSp({
		img:"#yanlei01.png",
		pos:cc.p(200,150),
		father:father,
	})
	hammer.tears.setScale(1.5)
	hammer.tears.setVisible(false)
	hammer.tears.setLocalZOrder(98)
	hammer.tears.actionPlay = function(pos){
		var tears = this
		tears.setPosition(pos)
		tears.setVisible(true)
		var ac = cc.sequence(
			cc.repeat(aniPlay({
					frame:"yanlei%02d.png",
					end:3
				}),3),
			cc.callFunc(function(){
				tears.setVisible(false)
			}))
		tears.runAction(ac)
	}

	hammer.baozha = createSp({
		img:"#baozha01.png",
		pos:cc.p(200,200),
		father:father,
	})
	hammer.baozha.setVisible(false)
	hammer.baozha.setLocalZOrder(99)
	hammer.baozha.actionPlay = function(pos){
		var baozha = this
		baozha.setPosition(pos)
		var ac = cc.sequence(
			cc.delayTime(0.25),
			cc.callFunc(function(){
				baozha.setVisible(true)
			}),
			cc.repeat(aniPlay({
					frame:"baozha%02d.png",
					time:0.06,
					end:3
				}),2),
			cc.callFunc(function(){
				baozha.setVisible(false)
				baozha.setSpriteFrame("baozha01.png")
			}))
		baozha.runAction(ac)
	}

	hammer.action = function(pos){
		hammer.setVisible(true)
		hammer.setPosition(pos)
		hammer.baozha.actionPlay(cc.p(pos.x-30,pos.y-75))
		hammer.runAction(cc.sequence(
				aniPlay({
					frame:"hammer%02d.png",
					time:0.05,
					end:6,
					fun:function(){
						hammer.tears.actionPlay(cc.p(pos.x-25,pos.y-89))
						hammer.setSpriteFrame("hammer01.png")
					}
				}),
				aniPlay({
					frame:"hammer%02d.png",
					time:0.05,
					end:6,
					fun:function(){
						hammer.setVisible(false)
					}
				})
			))
	}
	hammer.playAndShow = function(pos){
		var hammer = this
		hammer.setPosition(pos)
	}
	mouseFunc.hammer = hammer

	for(var i = 0 ; i < 4 ; i ++){
		//默认地鼠类型
		var mouse = {}
		//Y坐标 100-170
		mouse.posY = 100 + Math.floor(Math.random() * 70)
		mouse.bodyImg = "#mouse_body01.png"
		mouse.mousePos = cc.p(300,mouse.posY)


		mouse.headPos = cc.p(59,115)
		mouse.banPos = cc.p(109/2,60)
		mouse.option = "#option_a.png"

		switch(i){
			case 0:

			break
			case 1:
				// mouse.bodyImg = "#mouse_body02.png"
				mouse.mousePos = cc.p(450,mouse.posY)
				// mouse.headPos = cc.p(60,108)
				// mouse.banPos = cc.p(60,60)
				mouse.option = "#option_b.png"
				mouse.bodyImg = "#mouse_body03.png"
				mouse.headPos = cc.p(57,110)
				mouse.banPos = cc.p(7,135)
			break
			case 2:
				mouse.bodyImg = "#mouse_body03.png"
				mouse.mousePos = cc.p(600,mouse.posY)
				mouse.headPos = cc.p(57,110)
				mouse.banPos = cc.p(7,135)
				mouse.option = "#option_c.png"
			break
			case 3:
				mouse.mousePos = cc.p(750,mouse.posY)
				mouse.option = "#option_d.png"
			break
			default:
				cc.log("no this type")
			break
		}

		mouse.body = createSp({
			img:mouse.bodyImg,
			pos:mouse.mousePos,
			father:father
		})

		mouse.head = createSp({
			img:"#mouse_head.png",
			pos:mouse.headPos,
			father:mouse.body
		})

		mouse.face = createSp({
			img:"#mouse_face01.png",
			pos:mouse.headPos,
			father:mouse.body
		})

		mouse.ban = createSp({
			img:"#mouse_ban.png",
			pos:mouse.banPos,
			father:mouse.body
		})

		mouse.option = createSp({
			img:mouse.option,
			pos:mouse.banPos,
			father:mouse.body
		})

		mouse.land1 = createSp({
			img:"#mouse_land01.png",
			pos:cc.p(55,25),
			father:mouse.body
		})
		mouse.land1.setLocalZOrder(-1)
		mouse.land2 = createSp({
			img:"#mouse_land02.png",
			pos:cc.p(55,5),
			father:mouse.body
		})

		mouse.head.setLocalZOrder(-1)
		mouse.face.setLocalZOrder(-1)

		// mouse.correct = function(){
		// 	mouse.face.setSpriteFrame("mouse_face02.png")
		// }
		// mouse.wrong = function(){
		// 	mouse.face.setSpriteFrame("mouse_face03.png")
		// 	mouse.body.setSpriteFrame("mouse_body04.png")
		// }

		mouseList[i] = mouse
	}

	mouseFunc.banDislisten = function(){
		for(var j = 0 ; j < 4 ; j++){
			mouseList[j].ban.disListen(true)
		}
	}

	//此处判断所点击的黑板，答案是否正确
	for(var i = 0 ; i < 4 ; i ++){
		//黑板写监听函数,判断是否正确
		var ban = mouseList[i].ban
		ban.index = i
        var curMouse = ban.getParent()
		var wopos = getWorldPos(curMouse)
		var to = ban.convertToNodeSpace(wopos)
		createTouchEvent({
			item:ban,
			rect:cc.rect(to.x-curMouse.width/2,to.y-curMouse.height/3,ban.width*1.6,ban.height*2.3),
			begin:function(data){
				var item = data.item
				var index = item.index
				mouseFunc.next()
				mouseFunc.banDislisten()
				if(item.answer){
					mouseList[index].face.setSpriteFrame("mouse_face02.png")
					var hammerPos = cc.p(item.getParent().x+30,item.getParent().y+160)
					mouseFunc.hammer.action(hammerPos)
					cartoon.faceAction("happy")
					//答题正确，获得金币，更改答题正确数
					baseData.correctNum ++
					var pos = item.getParent().getPosition()
					coinManger.showAll(cc.p(pos.x,pos.y+100))
					playEffect(res.sound_correct)
				}else{
					playEffect(res.sound_fail)
					var face = mouseList[index].face
					var body = mouseList[index].body
					body.setSpriteFrame("mouse_body04.png")
					face.setSpriteFrame("mouse_face03.png")
					mouseList[index].ban.setVisible(false)
					mouseList[index].option.setVisible(false)
					cartoon.faceAction("unhappy")
				}
				return true 
			}
		})
	}

	//此处方法封装用于外部调用
	//地鼠恢复到原状，位置改变
	mouseFunc.mousePos = [[500],[400,700],[300,500,700],[300,450,600,750]]
	mouseFunc.reset = function(answer,len){
		mouseFunc.nextNode.stopAllActions()
		mouseFunc.judgeNext = false

		for(var i = 0 ; i < 4 ; i++){
			var mouse = mouseList[i]
			mouse.ban.answer = false
			mouse.ban.setVisible(true)
			mouse.option.setVisible(true)
			mouse.body.setVisible(false)
			mouse.face.setSpriteFrame("mouse_face01.png")
			if(i == 0 || i == 3){
				mouse.body.setSpriteFrame("mouse_body01.png")
			}else{
				mouse.body.setSpriteFrame("mouse_body03.png")
			}
		}

		for(var i = 0 ; i < len ; i++){
			var mouse = mouseList[i]
			if(answer==(i+1)){
				mouse.ban.answer = true
			}
			mouse.body.setVisible(true)
			mouse.ban.disListen(false)
			mouse.body.setPosition(mouseFunc.mousePos[len-1][i],100 + Math.floor(Math.random() * 70))
		}
		
	}

	mouseFunc.nextNode = new cc.Node()//控制答题切换
	father.addChild(mouseFunc.nextNode)
	//判断可切换到下一题
	mouseFunc.next = function(){
		mouseFunc.nextNode.runAction(cc.sequence(
			cc.delayTime(2),
			cc.callFunc(function(){
				mouseFunc.judgeNext = true
			})
		))
	}

	return mouseFunc
}

