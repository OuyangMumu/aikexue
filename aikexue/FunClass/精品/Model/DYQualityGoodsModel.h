//
//  DYQualityGoodsModel.h
//  aikexue
//
//  Created by Ray on 2017/9/25.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface DYQualityGoodsCmsModel :NSObject

@property (nonatomic,copy)NSString *_id;//  ": "HPID-V2-h1",

@property (nonatomic,strong)NSMutableArray *essays;

@property (nonatomic,copy)NSString *home;//  ": "限时免费"

@end

@interface DYQualityGoodsEssaysModel :NSObject

@property (nonatomic,copy)NSString *image;//  ": "HPID-V2-h1",

@property (nonatomic,strong)NSArray *tags;

@property (nonatomic,copy)NSString *title;//

@property (nonatomic,copy)NSString *url;//

@end



@interface DYQualityGoodsModel : NSObject<YYModel>

@property (nonatomic,strong)NSArray *exams;

@property (nonatomic,strong)NSMutableArray *extraExamsModels;

@property (nonatomic,strong)NSArray *homeForces;

@property (nonatomic,strong)NSArray *homePages;

@property (nonatomic,strong)DYQualityGoodsCmsModel *cms;

@end


@interface DYQualityGoodsHomePageModel :NSObject

@property (nonatomic,copy)NSString *_id;//  ": "HPID-V2-h1",
@property (nonatomic,strong)NSArray *examIds;// "": [

@property (nonatomic,copy)NSString *flag;// ": "https://fs.dev.

@property (nonatomic,copy)NSString *name;//  ": "限时免费"

@end





