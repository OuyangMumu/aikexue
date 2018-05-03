//
//  ServeUrlModel.h
//  rcpi
//
//  Created by Ray on 2017/7/15.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import <UIKit/UIKit.h>



@interface ServeUrlModel : NSObject

+(instancetype)sharedServeUrlModel;

@property (nonatomic,copy)NSString *ver;//
@property (nonatomic,copy)NSString *main;//
@property (nonatomic,copy)NSString *sso;//
@property (nonatomic,copy)NSString *cocos;//
@property (nonatomic,copy)NSString *verifyType;//
@property (nonatomic,copy)NSString *pushTags;
@property (nonatomic,copy)NSString *fs_url;
@property (nonatomic,copy)NSString *share_url;
@property (nonatomic,copy)NSString *order;
// dev / chk / chk2 /kuxiao
@property (nonatomic,copy)NSString *serviceType;//

//不同服务器数据
@property (nonatomic,strong)NSDictionary *serveDic;


/**
 设置服务器

 @param serve dev / chk / chk2 /kuxiao
 */

-(void)setSelfWith:(NSString *)serve;

@end

