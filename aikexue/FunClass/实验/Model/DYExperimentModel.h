//
//  DYExperimentModel.h
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DYExperimentModel : NSObject <YYModel>

@property (nonatomic,copy)NSString *_id;// "59033ea0cfbf6a26d4127b6a",
@property (nonatomic,copy)NSString *title;// "声音的产生",
@property (nonatomic,copy)NSString *abbrTitle;// "sydcs",
@property (nonatomic,copy)NSString *image;// "http://fs.kuxiao.cn/ZenPl1==.jpg",
@property (nonatomic,strong)NSArray *screenshots;// [
//                "http://fs.kuxiao.cn/Jp07Nx==.jpg"
//                ],
@property (nonatomic,strong)NSNumber *size;// 7728005,
@property (nonatomic,strong)NSNumber *price;// 0,
@property (nonatomic,strong)NSNumber *realPrice;// 0,

@property (nonatomic,strong)NSNumber *favor;// 0,
@property (nonatomic,strong)NSNumber *priceCommon;// 0,
@property (nonatomic,strong)NSNumber *favorCommon;// 0,
@property(strong,nonatomic)NSArray *showingTags;
@property (nonatomic,copy)NSString *desc;// "敲动鼓面时，鼓面的小纸片也跟着跳动。说话时摸摸颈部喉咙处，你有什么发现？这些跟声音的产生有什么关系呢？动动手我们一起做实验来验证吧！",
@property (nonatomic,strong)NSArray *tags;// [
//         "四年级上",
//         "声音"
//         ],
@property (nonatomic,strong)NSNumber *android;// 1,
@property (nonatomic,strong)NSNumber *ios;// 1,
@property (nonatomic,strong)NSNumber *win;// 1

@property (nonatomic,copy)NSString *type;// "exam",
@property (nonatomic,copy)NSString *status;// "NORMAL",
@property (nonatomic,strong)NSNumber *createTime;// 1501577341139,
@property (nonatomic,strong)NSNumber *lastTime;// 1501577341139

//page  学习包

@property (nonatomic,strong)NSNumber *examCount;
@property (nonatomic,strong)NSArray *examIds;
@property (nonatomic,strong)NSMutableArray *examModels;


@property (nonatomic,copy)NSString *eid;//首页轮播 eid

@property (nonatomic,strong)NSNumber *packNeedPay;
@property (nonatomic,strong)NSNumber *packNeedPayCOmmon;

@end
