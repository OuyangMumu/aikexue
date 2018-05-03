//
//  Downloader2.h
//  aikexue
//
//  Created by Ray on 2017/9/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OYDownLoadDataManager.h"

@class Downloader;


@interface Downloader : NSObject<OYDownloadDelegate,UIAlertViewDelegate>

+(instancetype)shared;

@property(nonatomic,strong)OYDownLoadDataManager *manager;
@property(nonatomic,strong)NSMutableArray* pending;
@property(nonatomic,strong)NSMutableDictionary* downloaded;
@property(nonatomic,assign)BOOL continued;
@property(nonatomic,strong)NSDictionary *baseJson;

-(void)checkCommon;
-(void)pauseDown:(DYExperimentModel*)model;
-(BOOL)download:(DYExperimentModel*)model;
-(BOOL)open:(DYExperimentModel*)model;
-(BOOL)isDownloading:(DYExperimentModel*)model;
-(BOOL)isPauseing:(DYExperimentModel*)model;

-(void)clearDowned:(void(^)(void))call;

@end
