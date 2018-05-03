//
//  Downloader2.m
//  aikexue
//
//  Created by Ray on 2017/9/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import "Downloader.h"

@implementation Downloader

OYSingleton_m()


-(OYDownLoadDataManager *)manager{
    
    if (!_manager) {
        _manager = [OYDownLoadDataManager manager];
        _manager.maxDownloadCount = 100;
        _manager.delegate = self;
    }
    
    return _manager;
}


-(NSMutableDictionary *)downloaded{
    
    if (!_downloaded) {
        
        NSUserDefaults* def=[NSUserDefaults standardUserDefaults];
        NSDictionary* ts=[def valueForKey:@"_downloaded"];
        if(ts){
            _downloaded = [NSMutableDictionary dictionaryWithDictionary:ts];
        }else{
            _downloaded = [NSMutableDictionary new];
        }
    }
    return _downloaded;
}

-(void)clearDowned:(void(^)(void))call{
    
    NSDictionary *dic = self.downloaded[@"common"];
    self.downloaded  = [NSMutableDictionary dictionaryWithDictionary:@{@"common":dic}];
    [self saveDownloaded];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    [fileManager removeItemAtPath:[NSString stringWithFormat:@"%@/res/extra",UnZipPath] error:nil];

    call();
}

-(void)saveDownloaded{
    
    NSUserDefaults* def=[NSUserDefaults standardUserDefaults];
    [def setValue:self.downloaded forKey:@"_downloaded"];
    [def synchronize];
}

-(NSMutableArray *)pending{
    
    if (!_pending ) {
        _pending = [NSMutableArray new];
    }
    
    return _pending;
}


-(BOOL)isDownloading:(DYExperimentModel*)model{
    
    for (OYDownloadModel *obj in self.pending) {
        
        if ([obj.downID isEqualToString:model._id]) {
            return YES;
        }
        
    }
    
    return NO;
}

-(NSDictionary *)baseJson{
    
    if (!_baseJson) {
        _baseJson = [[NSUserDefaults standardUserDefaults]valueForKey:@"baseJson"];
    }
    return _baseJson;
}

-(BOOL)isPauseing:(DYExperimentModel*)model{
    
    if (self.manager.downloadingModels.count > 0) {
        for (OYDownloadModel *obj in self.manager.downloadingModels) {
            if ([obj.downID isEqualToString:model._id] && obj.state == OYDownloadStateSuspended) {
                return YES;
            }
        }
    }
    return NO;
}

-(void)pauseDown:(DYExperimentModel*)model{
    
    OYWeakObj(self);
    [self.pending enumerateObjectsUsingBlock:^(OYDownloadModel *obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj.downID isEqualToString:model._id]) {
            
            [weakself.manager suspendWithDownloadModel:obj];
            NSLog(@"suspendWithDownloadModel 暂停 : %@",obj);
            *stop = YES;
        }
    }];
}


-(BOOL)download:(DYExperimentModel*)model{
    
    Reachability* reach = [Reachability reachabilityForInternetConnection];
    NetworkStatus status = [reach currentReachabilityStatus];
    
    if(status==NotReachable){
        [self alert:@"网络异常" msg:@"请稍后再试!" examID:model._id];
        return NO;
    }
    
    NSDictionary* purchased=[[GM_User  userExperiment]valueForKey:model._id];
    if(purchased==nil){
        [self alert:@"下载失败" msg:@"实验未购买" examID:model._id];
        return NO;
    }
    
    
    if(GM_User.wifiOnly&&status!=ReachableViaWiFi){
        OYWeakObj(self);
        UIAlertController *alterCtl = [UIAlertController alertControllerWithTitle:@"下载确认" message:@"Wifi未连接，是否继续下载?" preferredStyle:UIAlertControllerStyleAlert];
        
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"否" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            weakself.continued=NO;
            NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":model._id}];
            [[NSNotificationCenter defaultCenter] postNotification:notice];
        }];
        
        UIAlertAction *sure = [UIAlertAction actionWithTitle:@"是" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            weakself.continued=YES;
            [weakself startDownload:model];
        }];
        
        [alterCtl addAction:cancel];
        [alterCtl addAction:sure];
        
        if (self.continued) {
            return    [self startDownload:model];
        }else{
            [[GM_APP rootNav].viewControllers.lastObject presentViewController:alterCtl animated:YES completion:nil];
            
            return NO;
        }
    }else{
        return    [self startDownload:model];
    }
    return YES;
}



-(BOOL)startDownload:(DYExperimentModel*)model{
    
    OYWeakObj(self)
    if ([self isDownloading:model]) {
        [self.pending enumerateObjectsUsingBlock:^(OYDownloadModel *obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([obj.downID isEqualToString:model._id]) {
                
                [weakself.manager resumeWithDownloadModel:obj];
                
                NSLog(@"resumeWithDownloadModel 继续 : %@",obj);
                
                *stop = YES;
            }
        }];
        return  YES;
    }
    
    //暂时 处理游戏 下载
    if ([model.abbrTitle isEqualToString:@"HappyGameRes"]) {
        [weakself.manager startWithDownloadModel:[weakself downModelWith:[NSString stringWithFormat:@"%@/res/%@/1/%@1.zip",COCOS_SRV,@"HappyGameRes",@"HappyGameRes"] andID:model._id version:[model.ios intValue]]];
        return YES ;
    }
    
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/getExamUrl?token=%@&eid=%@",MAIN_SRV,GM_User.userToken,model._id) params:nil success:^(id response) {
        
        if([[response valueForKey:@"code"]intValue]!=0){
            [self alert:@"获取下载地址失败" msg:@"获取下载地址失败" examID:model._id];
            return;
        }
        
        NSDictionary* sdata=[response valueForKey:@"data"];
        //实验
        if([EXAM_TYPE_EXAM isEqualToString:[sdata valueForKey:@"type"]]){
            NSString* url=[[sdata valueForKey:@"resUrl"]valueForKey:@"ios"];
            if(url==nil||url.length<1){
                [self alert:@"获取下载地址失败" msg:@"获取下载地址失败" examID:model._id];
            }else{
                [weakself.manager startWithDownloadModel:[weakself downModelWith:url andID:model._id version:[model.ios intValue]]];
            }
        }
    } fail:^(NSError *error) {
        
    } showHUD:nil];
    
    return NO;
}

-(BOOL)open:(DYExperimentModel*)model{
    //[self alert:@"打开失败" msg:@"打开实验失败"];
    NSDictionary* item=[[GM_User  userExperiment]valueForKey:model._id];
    if(item==nil){
        [self alert:@"打开失败" msg:@"实验未在已购列表中" examID:model._id];
        return false;
    }
    
    NSString* abbr=model.abbrTitle;
    if(abbr==nil||abbr.length<1){
        [self alert:@"打开失败" msg:@"实验ID(abbr)为空" examID:model._id];
        return false;
    }
    
    [GM_APP openeid:abbr];
    return true;
}




-(void)checkCommon{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:[NSString stringWithFormat:@"%@/base.json",COCOS_SRV]   params:nil success:^(id response) {
        
        if (response) {
            self.baseJson = response;
            [[NSUserDefaults standardUserDefaults]setValue:self.baseJson forKey:@"baseJson"];
        }
        
        NSDictionary* common=[self.downloaded valueForKey:@"common"];
        id comversion = common[@"version"];
        int locver = 0;
        
        if ([comversion isKindOfClass:[NSDictionary class]]) {
            locver = [comversion[@"ios"] intValue];
        }else{
            locver = [comversion intValue];
        }
        
        
        NSNumber* ver=[[response valueForKey:@"common"]valueForKey:@"version"];
        int version=[ver intValue];
        
        if(common==nil || locver <1){//首次下载
            NSString* url=[NSString stringWithFormat:@"%@/res/common/%d/common%d.zip",COCOS_SRV,1,1];
            
            [weakself.manager startWithDownloadModel:[weakself downModelWith:url andID:@"common" version:version]];
            
        }else if(locver>=version){//无需更新
            
        }else{
            //更新
            NSString* url=[NSString stringWithFormat:@"%@/res/common/%d/common%d.zip",COCOS_SRV,1,1];
            
            [weakself.manager startWithDownloadModel:[weakself downModelWith:url andID:@"common" version:version]];
            
        }
        
    } fail:^(NSError *error) {
        
        
    } showHUD:nil];
}

-(OYDownloadModel *)downModelWith:(NSString *)urlString andID:(NSString *)downID version:(int)version{
    
    if (urlString) {
        OYDownloadModel *model = [[OYDownloadModel alloc]initWithURLString:urlString];
        model.downID = downID;
        model.version = version;
        
        if ([self.manager isDownloadCompletedWithDownloadModel:model]) {
            
            [self downloadModel:model didChangeState:OYDownloadStateCompleted filePath:model.filePath error:nil];
            
        }else{
            return model;
        }
    }
    
    return nil;
}


// 更新下载进度
- (void)downloadModel:(OYDownloadModel *)downloadModel didUpdateProgress:(OYDownloadProgress *)progress{
    
    NSMutableDictionary* state=[NSMutableDictionary new];
    [state setValue:[NSNumber numberWithDouble:progress.progress] forKey:@"progress"];
    [state setValue:[NSNumber numberWithDouble:progress.speed] forKey:@"speed"];
    [state setValue:downloadModel.downID forKey:@"exam_id"];
    
    NSLog(@"downloadModel %@ rate = %f",downloadModel.downID,progress.progress);
    
    NSNotification* notice = [NSNotification notificationWithName:N_DOWNProcess object:state];
    [[NSNotificationCenter defaultCenter]postNotification:notice];
    
}



// 更新下载状态
- (void)downloadModel:(OYDownloadModel *)downloadModel didChangeState:(OYDownloadState)state filePath:(NSString *)filePath error:(NSError *)error{
    
    switch (state) {
        case OYDownloadStateCompleted:{
            
            NSFileManager* fm=[NSFileManager defaultManager];
            NSString *path = UnZipPath;
            if(![fm fileExistsAtPath:path]){
                [fm createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:nil];
            }
            
            dispatch_queue_t concurrentQueue =
            dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
            dispatch_async(concurrentQueue, ^{
                __block BOOL success = NO;
                dispatch_sync(concurrentQueue, ^{
                    success = [CocosViewController dounzip:filePath dir:path];
                });
                dispatch_sync(dispatch_get_main_queue(), ^{
                    
                    if (!success) {
                        dispatch_async(dispatch_get_main_queue(), ^{
                            [fm removeItemAtPath:filePath error:nil];
                            [self.pending removeObject:downloadModel];
                            NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":downloadModel.downID}];
                            [[NSNotificationCenter defaultCenter] postNotification:notice];
                        });
                    }else{
                        
                        //删除文件
                        [fm removeItemAtPath:filePath error:nil];
                        
                        [self.pending removeObject:downloadModel];
                        [self.downloaded setValue:@{@"version":@{@"ios":@(downloadModel.version)},@"url":downloadModel.downloadURL,@"status":@"done"} forKey:downloadModel.downID];
                        [self saveDownloaded];
                        
                        NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":downloadModel.downID}];
                        [[NSNotificationCenter defaultCenter] postNotification:notice];
                    }
                    
                });
            });
        }
            break;
        case OYDownloadStateFailed:
        {
            [MBProgressHUD showTipMessageInWindow:@"下载失败,稍后重试!"];
            [self.pending removeObject:downloadModel];
            NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":downloadModel.downID}];
            [[NSNotificationCenter defaultCenter] postNotification:notice];
        }
            break;
        case OYDownloadStateReadying:
            
            break;
        case OYDownloadStateSuspended:
        {
            NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":downloadModel.downID}];
            [[NSNotificationCenter defaultCenter] postNotification:notice];
        }
            break;
            
            
        case OYDownloadStateRunning:
        {
            
            [self.pending addObject:downloadModel];
        }
            
            break;
        case OYDownloadStateNone:
            
            break;
            
            
        default:
            break;
    }
}


-(void)alert:(NSString*)title msg:(NSString*)msg examID:(NSString *)examId{
    UIAlertView* alert=[[UIAlertView alloc]initWithTitle:title message:msg delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil];
    [alert show];
    
    NSNotification* notice = [NSNotification notificationWithName:N_DOWNLOADED object:@{@"exam_id":examId}];
    [[NSNotificationCenter defaultCenter] postNotification:notice];
    
}


@end
