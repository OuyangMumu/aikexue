//  DYQualityGoodsModel.m
//  aikexue
//
//  Created by Ray on 2017/9/25.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsModel.h"
#import "DYExperimentModel.h"
@implementation DYQualityGoodsModel


+ (NSDictionary *)modelContainerPropertyGenericClass {
    
    return @{
             @"homeForces":[DYExperimentModel class],
             @"homePages":[DYQualityGoodsHomePageModel class],
             @"cms":@"DYQualityGoodsCmsModel"
             };
}

-(NSMutableArray *)extraExamsModels{
    
    if (!_extraExamsModels) {
        _extraExamsModels = [NSMutableArray new];
    }
    return _extraExamsModels;
}


@end


@implementation DYQualityGoodsHomePageModel

@end




@implementation DYQualityGoodsCmsModel

+ (NSDictionary *)modelContainerPropertyGenericClass {
    
    return @{
             @"essays":[DYQualityGoodsEssaysModel class],
             };
}


@end



@implementation DYQualityGoodsEssaysModel

@end
