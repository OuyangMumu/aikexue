//关卡坐标
var passIconPos = [
	cc.p(270,380),
	cc.p(200,280),
	cc.p(240,150),
	cc.p(405,115),
	cc.p(550,150),
	cc.p(645,260),
	cc.p(660,400),
	cc.p(800,460),
	cc.p(1010,440),
	cc.p(995,300),
	cc.p(915,250),
	cc.p(925,125),
	cc.p(1090,115),
	cc.p(1245,150),
	cc.p(1335,240),
	cc.p(1275,325),
	cc.p(1370,465),
	cc.p(1620,475),
	cc.p(1745,425),
	cc.p(1680,340),
	cc.p(1610,220),
	cc.p(1770,135),
	cc.p(1930,190),
	cc.p(2060,320),
	cc.p(2180,400),
	cc.p(2280,430),
	cc.p(2440,450),
	cc.p(2580,400),
	cc.p(2510,310),
	cc.p(2260,260)
]


//初始化每一关的数据
//构造形如
// guanQiaData = [
// 	{
// 		clock:0,
// 		timuData:[],
// 		pos:cc.p(0,0)
// 	},
// 	{
// 		clock:0,
// 		timuData:[],
// 		pos:cc.p(0,0)
// 	},
// 	{
// 		clock:0,
// 		timuData:[],
// 		pos:cc.p(0,0)
// 	},
// 	...
// ]
var guanQiaData = []
var UNCLOCKNUM = 3 //当前开启的关卡，应该是本地数据或者是服务器数据
var initGuanqia =function(){

	UNCLOCKNUM = Person.censorship[baseData.curSubject]

	for (var i = 0; i < passIconPos.length; i++) {
		var temp = {}
		if(i<UNCLOCKNUM){
			temp.clock = 1
		}else{
			temp.clock = 0
		}
		temp.pos = passIconPos[i]
		guanQiaData[i] = temp
	}
	return guanQiaData
}