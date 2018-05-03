//
//  DYUserNotifiModel.m
//  aikexue
//
//  Created by myj on 2017/8/17.
//  Copyright © 2017年 io. All rights reserved.
//
#import "DYUserNotifiModel.h"

@implementation DYUserNotifiModel


+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    
    return @{
             @"type":@"target.type",
             @"platform":@"target.platform",
             @"tags":@"target.tags",
             };
}



+(NSDictionary<NSString *,id> *)modelContainerPropertyGenericClass{
    
    
    return @{
             @"coupon":[DYUserCouponModel class]
             };
    
}
@end
