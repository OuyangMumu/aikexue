//
//  DYNetworking.m
//  DYNetworkingDemo
//
//

#ifdef DEBUG
#   define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#else
#   define DLog(...)
#endif

#import "DYNetworking.h"
#import "MBProgressHUD.h"
#import "NetWorkLoading.h"


static NSMutableArray *tasks;
static UIAlertController *lossLoginAlert;

@implementation DYNetworking

+ (DYNetworking *)sharedDYNetworking
{
    static DYNetworking *handler = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        handler = [[DYNetworking alloc] init];
    });
    return handler;
}

+(NSMutableArray *)tasks{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        DLog(@"创建数组");
        tasks = [[NSMutableArray alloc] init];
    });
    return tasks;
}

+(UIAlertController *)lossLoginAlert{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        lossLoginAlert = [UIAlertController alertControllerWithTitle:@"下线通知" message:@"该账号在其他设备登录,是否重新登录?" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *cancel =  [UIAlertAction actionWithTitle:@"否" style:UIAlertActionStyleCancel handler:nil];
        UIAlertAction *sure =  [UIAlertAction actionWithTitle:@"是" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                        
        }];
        [lossLoginAlert addAction:cancel];
        [lossLoginAlert addAction:sure];
        
        
    });
        return lossLoginAlert;
        
}

+(DYURLSessionTask *)getWithUrl:(NSString *)url
                         params:(NSDictionary *)params
                        success:(DYResponseSuccess)success
                           fail:(DYResponseFail)fail
                        showHUD:(id)showHUD{
    
    return [self baseRequestType:1 url:url params:params success:success fail:fail showHUD:showHUD];
    
}

+(DYURLSessionTask *)postWithUrl:(NSString *)url
                          params:(NSDictionary *)params
                         success:(DYResponseSuccess)success
                            fail:(DYResponseFail)fail
                         showHUD:(id)showHUD{
    return [self baseRequestType:2 url:url params:params success:success fail:fail showHUD:showHUD];
}

+(DYURLSessionTask *)baseRequestType:(NSUInteger)type
                                 url:(NSString *)url
                              params:(NSDictionary *)params
                             success:(DYResponseSuccess)success
                                fail:(DYResponseFail)fail
                             showHUD:(id)showHUD{
    DLog(@"请求地址----%@\n    请求参数----%@",url,params);
    if (url==nil) {
        return nil;
    }
    
    if (showHUD) {
        [DYNetworking showGifToView:showHUD];
    }
    
    //检查地址中是否有中文
    
    NSString *urlStr=[NSURL URLWithString:url]?url:[self strUTF8Encoding:url];
    
    AFHTTPSessionManager *manager=[self getAFManager];
    
    DYURLSessionTask *sessionTask=nil;
        
    NSMutableString  *paramstr = [NSMutableString new];
    [params enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
        [paramstr appendFormat:@"&%@=%@",key,obj];
    }];
    
    NSLog(@"url = %@",[urlStr stringByAppendingString:paramstr]);
    
    if (type==1) {
        sessionTask = [manager GET:urlStr parameters:params progress:^(NSProgress * _Nonnull downloadProgress) {
            
        } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
            DLog(@"请求结果=%@",responseObject);
            if (success && !IsNilOrNull(responseObject)) {
                success(responseObject);
                
                if ([responseObject[@"code"] integerValue]==301) {
                    
                [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginToken];
                [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginTokenAuto];
                    
                    GM_User.userToken = nil;
                    [DYNetworking showNormalAlert];
            }
                
            }else{
                success(@{@"code":@(-1),@"msg":@"接口异常"});
            }
            
            [[self tasks] removeObject:sessionTask];
            
            if (showHUD) {
                [DYNetworking hideHUDForView:showHUD];
            }
            
        } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            DLog(@"error=%@",error);
            if (fail) {
                fail(error);
            }
            
            [[self tasks] removeObject:sessionTask];
            
            if (showHUD) {
                [DYNetworking hideHUDForView:showHUD];
            }
            
        }];
        
    }else{
        
        sessionTask = [manager POST:url parameters:params progress:^(NSProgress * _Nonnull uploadProgress) {
            
        } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
            DLog(@"请求成功=%@",responseObject);
            if (success && !IsNilOrNull(responseObject)){
                success(responseObject);

                if ([responseObject[@"code"] integerValue]==301) {
                    [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginToken];
                    [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginTokenAuto];
                    
                    GM_User.userToken = nil;
                    [DYNetworking showNormalAlert];
                }
                
            }else{
                success(@{@"code":@(-1),@"msg":@"接口异常"});
            }
            
            [[self tasks] removeObject:sessionTask];
            
            if (showHUD) {
                [DYNetworking hideHUDForView:showHUD];
            }
            
        } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            DLog(@"error=%@",error);
            if (fail) {
                fail(error);
            }
            
            [[self tasks] removeObject:sessionTask];
            
            if (showHUD) {
                [DYNetworking hideHUDForView:showHUD];
            }
        }];
        
        
    }
    
    if (sessionTask) {
        [[self tasks] addObject:sessionTask];
    }
    
    return sessionTask;
    
}

+(DYURLSessionTask *)uploadWithImage:(UIImage *)image
                                 url:(NSString *)url
                            filename:(NSString *)filename
                                name:(NSString *)name
                              params:(NSDictionary *)params
                            progress:(DYUploadProgress)progress
                             success:(DYResponseSuccess)success
                                fail:(DYResponseFail)fail
                             showHUD:(id)showHUD{
    
    DLog(@"请求地址----%@\n    请求参数----%@",url,params);
    if (url==nil) {
        return nil;
    }
    
    if (showHUD) {
        [DYNetworking showGifToView:showHUD];
    }
    
    //检查地址中是否有中文
    NSString *urlStr=[NSURL URLWithString:url]?url:[self strUTF8Encoding:url];
    
    AFHTTPSessionManager *manager=[self getAFManager];
    
    DYURLSessionTask *sessionTask = [manager POST:urlStr parameters:params constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        //压缩图片
        NSData *imageData = UIImageJPEGRepresentation(image, 1.0);
        
        NSString *imageFileName = filename;
        if (filename == nil || ![filename isKindOfClass:[NSString class]] || filename.length == 0) {
            NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
            formatter.dateFormat = @"yyyyMMddHHmmss";
            NSString *str = [formatter stringFromDate:[NSDate date]];
            imageFileName = [NSString stringWithFormat:@"%@.jpg", str];
        }
        
        // 上传图片，以文件流的格式
        [formData appendPartWithFileData:imageData name:name fileName:imageFileName mimeType:@"image/jpeg"];
    } progress:^(NSProgress * _Nonnull uploadProgress) {
        DLog(@"上传进度--%lld,总进度---%lld",uploadProgress.completedUnitCount,uploadProgress.totalUnitCount);
        if (progress) {
            progress(uploadProgress.completedUnitCount, uploadProgress.totalUnitCount);
        }
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        DLog(@"上传图片成功=%@",responseObject);
         if (success && !IsNilOrNull(responseObject)) {
            success(responseObject);
         }else{
             success(@{@"code":@(-1),@"msg":@"接口异常"});
         }
        [[self tasks] removeObject:sessionTask];
        
        if (showHUD) {
            [DYNetworking hideHUDForView:showHUD];
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        DLog(@"error=%@",error);
        if (fail) {
            fail(error);
        }
        
        [[self tasks] removeObject:sessionTask];
        
        if (showHUD) {
            [DYNetworking hideHUDForView:showHUD];
        }
        
    }];
    
    
    if (sessionTask) {
        [[self tasks] addObject:sessionTask];
    }
    
    return sessionTask;
    
    
}




+ (DYURLSessionTask *)downloadWithUrl:(NSString *)url
                           saveToPath:(NSString *)saveToPath
                             progress:(DYDownloadProgress)progressBlock
                              success:(DYResponseSuccess)success
                              failure:(DYResponseFail)fail
                              showHUD:(id)showHUD{
    
    
    DLog(@"请求地址----%@\n    ",url);
    if (url==nil) {
        return nil;
    }
    
    if (showHUD) {
        [DYNetworking showGifToView:showHUD];
    }
    
    NSURLRequest *downloadRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    AFHTTPSessionManager *manager = [self getAFManager];
    
    DYURLSessionTask *sessionTask = nil;
    
    sessionTask = [manager downloadTaskWithRequest:downloadRequest progress:^(NSProgress * _Nonnull downloadProgress) {
        DLog(@"下载进度--%.1f",1.0 * downloadProgress.completedUnitCount/downloadProgress.totalUnitCount);
        //回到主线程刷新UI
        dispatch_async(dispatch_get_main_queue(), ^{
            if (progressBlock) {
                progressBlock(downloadProgress.completedUnitCount, downloadProgress.totalUnitCount);
            }
        });
        
    } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        if (!saveToPath) {
            
            NSURL *downloadURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
            DLog(@"默认路径--%@",downloadURL);
            return [downloadURL URLByAppendingPathComponent:[response suggestedFilename]];
            
        }else{
            return [NSURL fileURLWithPath:saveToPath];
            
        }
        
    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
        DLog(@"下载文件成功");
        
        [[self tasks] removeObject:sessionTask];
        
        if (error == nil) {
            if (success) {
                success([filePath path]);//返回完整路径
            }
            
        } else {
            if (fail) {
                fail(error);
            }
        }
        
        if (showHUD) {
            [DYNetworking hideHUDForView:showHUD];
        }
        
    }];
    
    //开始启动任务
    [sessionTask resume];
    if (sessionTask) {
        [[self tasks] addObject:sessionTask];
    }
    
    return sessionTask;
    
    
}

+(AFHTTPSessionManager *)getAFManager{
    [AFNetworkActivityIndicatorManager sharedManager].enabled = YES;
    
    AFHTTPSessionManager *manager = manager = [AFHTTPSessionManager manager];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];//设置请求数据为json
    manager.responseSerializer = [AFJSONResponseSerializer serializer];//设置返回数据为json
    manager.requestSerializer.cachePolicy = NSURLRequestReloadIgnoringLocalCacheData;
//    manager.requestSerializer.stringEncoding = NSUTF8StringEncoding;
    manager.requestSerializer.timeoutInterval=10;
    manager.responseSerializer.acceptableContentTypes = [NSSet setWithArray:@[@"application/json",
                                                                              @"text/html",
                                                                              @"text/json",
                                                                              @"text/plain",
                                                                              @"text/javascript",
                                                                              @"text/xml",
                                                                              @"image/*"]];
    
    
    
    return manager;
    
}

#pragma makr - 开始监听网络连接

+ (void)startMonitoring
{
    // 1.获得网络监控的管理者
    AFNetworkReachabilityManager *mgr = [AFNetworkReachabilityManager sharedManager];
    // 2.设置网络状态改变后的处理
    [mgr setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        // 当网络状态改变了, 就会调用这个block
        switch (status)
        {
            case AFNetworkReachabilityStatusUnknown: // 未知网络
                DLog(@"未知网络");
                [DYNetworking sharedDYNetworking].networkStats=AFNetworkReachabilityStatusUnknown;
                
                break;
            case AFNetworkReachabilityStatusNotReachable: // 没有网络(断网)
                DLog(@"没有网络");
                [DYNetworking sharedDYNetworking].networkStats=AFNetworkReachabilityStatusNotReachable;
                break;
            case AFNetworkReachabilityStatusReachableViaWWAN: // 手机自带网络
                DLog(@"手机自带网络");
                [DYNetworking sharedDYNetworking].networkStats=AFNetworkReachabilityStatusReachableViaWWAN;
                break;
            case AFNetworkReachabilityStatusReachableViaWiFi: // WIFI
                
                [DYNetworking sharedDYNetworking].networkStats=AFNetworkReachabilityStatusReachableViaWiFi;
                DLog(@"WIFI--%d",[DYNetworking sharedDYNetworking].networkStats);
                break;
        }
    }];
    [mgr startMonitoring];
}

+(void)uploadImage:(UIImage *)image success:(DYResponseSuccess)success
           failure:(DYResponseFail)fail{
    /*
     此段代码如果需要修改，可以调整的位置
     1. 把upload.php改成网站开发人员告知的地址
     2. 把file改成网站开发人员告知的字段名
     */
    
    //AFN3.0+基于封住HTPPSession的句柄
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    
    
    //formData: 专门用于拼接需要上传的数据,在此位置生成一个要上传的数据体
    [manager POST:@"http://192.168.1.111:12345/upload.php" parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        
        NSData *data = UIImagePNGRepresentation(image);
        
        // 在网络开发中，上传文件时，是文件不允许被覆盖，文件重名
        // 要解决此问题，
        // 可以在上传时使用当前的系统事件作为文件名
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        // 设置时间格式
        formatter.dateFormat = @"yyyyMMddHHmmss";
        NSString *str = [formatter stringFromDate:[NSDate date]];
        NSString *fileName = [NSString stringWithFormat:@"%@.png", str];
        //上传
        /*
         此方法参数
         1. 要上传的[二进制数据]
         2. 对应网站上[upload.php中]处理文件的[字段"file"]
         3. 要保存在服务器上的[文件名]
         4. 上传文件的[mimeType]
         */
        [formData appendPartWithFileData:data name:@"file" fileName:fileName mimeType:@"image/png"];
        
    } progress:^(NSProgress * _Nonnull uploadProgress) {
        
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        success(responseObject);
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        fail(error);
        
    }];
}


+(void)showNormalAlert{

    [[DYNetworking sharedDYNetworking].alertView  hide];
    [[DYNetworking sharedDYNetworking].alertView  show];
}

- (void)alertView:(FDAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    NSLog(@"%ld", (long)buttonIndex);
    
    if (buttonIndex) {
        [[DYBindLoginView shareLoginView]showTo:nil complete:^{
            
            if (!GM_User.userToken) {//未登录
                //申请游客
                [GM_User loadAutoUser:^(BOOL success, id data) {
                    
                }];
            }
            
        }];
    }else if(buttonIndex==0){
        //申请游客
        [GM_User loadAutoUser:^(BOOL success, id data) {
            
        }];
    }
    
}

-(FDAlertView *)alertView{
    if (!_alertView) {
        _alertView =  [[FDAlertView alloc] initWithTitle:@"登录失效" icon:nil message:@"哦噢，您的账号在其他地方登录了，若不是本人操作，请注意账号安全哦。" delegate:[DYNetworking sharedDYNetworking] buttonTitles:@"取消",@"重连", nil];
        [_alertView setMessageColor:[UIColor darkGrayColor] fontSize:0];
    }
    return _alertView;
}

+(NSString *)strUTF8Encoding:(NSString *)str{
    //return [str stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLPathAllowedCharacterSet]];
    return [str stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
}


+(NetWorkLoading *)showGifToView:(UIView *)view{
    
    NetWorkLoading *load = [NetWorkLoading shareManagerLoading];
    
    [load showHUDAddedTo:view];
    
    return load;
    
}

+(void)hideHUDForView:(UIView *)view{
    [[NetWorkLoading shareManagerLoading]hideHUDForView:view];
}

@end
