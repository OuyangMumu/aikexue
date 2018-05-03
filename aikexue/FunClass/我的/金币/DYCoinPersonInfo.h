//
//  DYCoinPersonInfo.h
//  aikexue
//
//  Created by Ray on 2017/10/23.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DYCoinPersonInfo : NSObject

+(instancetype)sharedCoin;

@property (nonatomic,copy)NSString *_id;// "u287382",
@property (nonatomic,copy)NSString *name;// "酷粉287382",
@property (nonatomic,copy)NSString *babyName;//小孩名字
@property (nonatomic,strong)NSNumber *level;// 0,
@property (nonatomic,strong)NSArray *censorship;// [
@property (nonatomic,strong)NSNumber *coinNum;// 0,
@property (nonatomic,strong)NSNumber *remainConvert;// 1,
@property (nonatomic,strong)NSNumber *maxConvert;// 1,
@property (nonatomic,strong)NSNumber *lastConvert;// 0,
@property (nonatomic,strong)NSNumber *createTime;// 0,
@property (nonatomic,strong)NSNumber *lastTime;// 1508743446969,
@property (nonatomic,copy)NSString *gender;// "",
@property (nonatomic,strong)NSNumber *birthday;// 0,
@property (nonatomic,strong)NSNumber *lastSign;// 0,
@property (nonatomic,strong)NSNumber *alreadySign;// 0,
@property (nonatomic,strong)NSNumber *lastSuggAward;// 0,
@property (nonatomic,strong)NSNumber *suggAwards;// 0,
@property (nonatomic,strong)NSNumber *lastGameAward;// 0,
@property (nonatomic,strong)NSNumber *gameAwards;// 0
@property (nonatomic,strong)NSNumber *lastGetCoin;//": 0,
@property (nonatomic,strong)NSNumber *todayGetCoin;//": 0,
@property (nonatomic,strong)NSNumber *bindPhoneReword;//": 0


@end
