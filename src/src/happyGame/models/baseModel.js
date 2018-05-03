//全局数据控制
var Subject = ["biology", "physics", "chemistry", "geography"]
var baseData = {
    curSubject: null, //默认当前所选科目为0
    correctNum: 0, //每关所答对的正确的题目数量，每次置为0
    exchangeCount: 0, //每日兑换金币次数，次日归0
    tempCoin: 0, //计算当前关卡临时所赚金币数量
}
var Person = {
    name: "游客",
    level: 1,
    censorship: [6, 8, 10, 15],
    coinNum: 100
}
var OldPerson = {
    coinNum: 100
}

//获取用户信息
var userInfo_url = CURURL + "/usr/api/getInfoInGame?token="

//活动url
var activity_url = CURURL + "/usr/api/convertCoinToCoupons?price=6&token="

//获取题目数据
var gameData_url = CURURL + "/usr/api/startGame?token=" //&name=?&level=?
//name : [biology, physics, chemistry, geography]

//存储用户游戏信息
var saveUserInfo_url = CURURL + "/usr/api/storeInfoInGame?token="