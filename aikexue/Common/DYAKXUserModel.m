//
//  DYAKXUserModel.m
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYAKXUserModel.h"

@implementation DYAKXUserModel


+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    
    return @{
             @"_id":@"id",
             @"avatar":@"attrs.basic.avatar",
             @"gender":@"attrs.basic.gender",
             @"nickName":@"attrs.basic.nickName"
             };
    
}
@end
