//
//  DYUserNotifiModel.h
//  aikexue
//
//  Created by myj on 2017/8/17.
//  Copyright © 2017年 io. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "DYUserCouponController.h"

@interface DYUserNotifiModel : NSObject<YYModel>

@property (nonatomic,copy)NSString *_id;// "598444bdd624d31e53db4f29",
@property (nonatomic,strong)NSNumber *typeID;// 通知类型，10:文章，11:优惠券，12:实验，13:实验包
@property (nonatomic,strong)NSNumber *createTime;// 通知创建时间
@property (nonatomic,copy)NSString *contentTitle;// "温度和温度计",
@property (nonatomic,copy)NSString *contentKey;// "59033ea0cfbf6a26d4127b6f",
//"target;// {
@property (nonatomic,strong)NSNumber *type;// 3,
@property (nonatomic,strong)NSNumber *platform;// 3,
@property (nonatomic,strong)NSArray *tags;// [
//             "test_dev"
//             ]
//},
@property (nonatomic,strong)NSNumber *status;//默认1，已读2

@property (nonatomic,strong)DYUserCouponModel *coupon;//	typeID=11时存在，优惠券详情，详见优惠券接口


@property (nonatomic,copy)NSString *redirectURL;//":typeID=10时存在，文章重定向的URL
@property (nonatomic,copy)NSString *contentIntro;//typeID=10,12,13时存在，摘要,
@property (nonatomic,copy)NSString *contentImage;//typeID=10,12,13时存在，预览图地址
@end
