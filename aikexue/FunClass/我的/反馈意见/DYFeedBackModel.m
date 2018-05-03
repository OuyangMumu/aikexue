//
//  DYFeedBackModel.m
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYFeedBackModel.h"

@implementation DYFeedBackModel


-(NSArray *)thumpUp{
    if (!_thumpUp) {
        _thumpUp = [NSArray new];
    }
    return _thumpUp;
}

+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    return @{
             @"phone":@"contact.phone",
                 @"qq":@"contact.qq",
                 @"weixin":@"contact.weixin"
             };
}

+(NSDictionary<NSString *,id> *)modelContainerPropertyGenericClass{
    
  return  @{
            @"reply":[DYFeedBackModel class]
            };
}
@end
