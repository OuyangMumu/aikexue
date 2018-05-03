//
//  DYExperimentModel.m
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentModel.h"

@implementation DYExperimentModel

+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{

    return @{
             @"android":@"version.android",
             @"ios":@"version.ios",
             @"win":@"version.win",
             };
}

-(NSMutableArray *)examModels{

    if (!_examModels) {
        _examModels = [NSMutableArray new];
    }
    return _examModels;
}

-(NSNumber *)price{
    if ([self.type isEqualToString:EXAM_TYPE_PACKAGE]) {
        return self.packNeedPayCOmmon;
    }else{
        return self.priceCommon;
    }
}
@end
