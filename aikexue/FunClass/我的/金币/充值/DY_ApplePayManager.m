//
//  DY_ApplePayManager.m
//  rcpi
//
//  Created by Ray on 2017/6/30.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "DY_ApplePayManager.h"



static NSString * const receiptKey = @"receipt_key";//票据
static NSString * const dateKey = @"date_key";//时间
static NSString * const userIdKey = @"userId_key";//用户 id
static NSString * const updateKey = @"update_key";//是否提交服务器


static DY_ApplePayManager *manager;

@interface DY_ApplePayManager()
@property(strong ,nonatomic)NSData *receipt;
@property (nonatomic,copy)completCall success;//
@end


@implementation DY_ApplePayManager

+(instancetype)shareManager{

    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [DY_ApplePayManager new];
        [RMStore defaultStore];
    });
    return manager;
}

#pragma mark  持久化存储用户购买凭证(这里最好还要存储当前日期，用户id等信息，用于区分不同的凭证)


-(void)payWithProductId:(NSString *)product complete:(completCall)success{
    
    if (success) {
        self.success = success;
    }
    
    if (![RMStore canMakePayments]){
        [MBProgressHUD  showActivityMessageInWindow:@"你的手机不支持支付功能" timer:2];
        return;
    }
    NSLog(@"--------------开始请求商品信息------------------");
    
     OYWeakObj(self);
   
    [MBProgressHUD showActivityMessageInWindow:@"请稍后..."];
    [[RMStore defaultStore] requestProducts:[NSSet setWithArray:@[product]] success:^(NSArray *products, NSArray *invalidProductIdentifiers) {
        
        if([products count] == 0){
            NSLog(@"--------------没有找到商品------------------");
            [MBProgressHUD hideHUDFromView:[GM_APP window]];
            [MBProgressHUD  showActivityMessageInWindow:@"支付失败!" timer:2];
            return;
        }else{
            NSLog(@"--------------开始支付------------------");
            [weakself addPayment:product];
        }
    } failure:^(NSError *error) {
        NSLog(@"--------------请求商品失败------------------");
        [MBProgressHUD hideHUDFromView:[GM_APP window]];
        [MBProgressHUD  showActivityMessageInWindow:@"支付失败!" timer:2];
    }];
}

-(void)addPayment:(NSString *)productId{
    
    [[RMStore defaultStore] addPayment:productId user:GM_User.userId success:^(SKPaymentTransaction *transaction) {
        [MBProgressHUD hideHUDFromView:[GM_APP window]];

        [self getReceipt]; //获取交易成功后的购买凭证
        [self saveReceipt]; //存储交易凭证
        [self checkIAPFilesComplete:self.success];//把self.receipt发送到服务器验证是否有效
        
    } failure:^(SKPaymentTransaction *transaction, NSError *error) {
        
        NSString *detail = nil;
        if (transaction.error != nil) {
            switch (transaction.error.code) {
                    
                case SKErrorUnknown:
                    
                    NSLog(@"SKErrorUnknown");
                    detail = @"未知的错误，您可能正在使用越狱手机";
                    break;
                    
                case SKErrorClientInvalid:
                    
                    NSLog(@"SKErrorClientInvalid");
                    detail = @"当前苹果账户无法购买商品(如有疑问，可以询问苹果客服)";
                    break;
                    
                case SKErrorPaymentCancelled:
                    
                    NSLog(@"SKErrorPaymentCancelled");
                    detail = @"订单已取消";
                    break;
                case SKErrorPaymentInvalid:
                    NSLog(@"SKErrorPaymentInvalid");
                    detail = @"订单无效(如有疑问，可以询问苹果客服)";
                    break;
                    
                case SKErrorPaymentNotAllowed:
                    NSLog(@"SKErrorPaymentNotAllowed");
                    detail = @"当前苹果设备无法购买商品(如有疑问，可以询问苹果客服)";
                    break;
                    
                case SKErrorStoreProductNotAvailable:
                    NSLog(@"SKErrorStoreProductNotAvailable");
                    detail = @"当前商品不可用";
                    break;
                    
                default:
                    
                    NSLog(@"No Match Found for error");
                    detail = @"未知错误";
                    break;
            }
        }
        [MBProgressHUD hideHUDFromView:[GM_APP window]];
        [MBProgressHUD  showActivityMessageInWindow:@"支付失败!" timer:2];
        NSLog(@"-----%@----",detail);
    }];
}



-(void)getReceipt{
    NSURL *receiptUrl = [[NSBundle mainBundle] appStoreReceiptURL];
     self.receipt  = [NSData dataWithContentsOfURL:receiptUrl];
}


-(void)saveReceipt{
    
    NSString *date  = [NSString stringWithFormat:@"%.f",[[NSDate date] timeIntervalSince1970]*1000];
    NSString *fileName = [[[UIDevice currentDevice]identifierForVendor] UUIDString];
    
    //uuid + 时间戳
    NSString *savedPath = [NSString stringWithFormat:@"%@/%@%@.plist", [SandBoxHelper iapReceiptPath], fileName,date];
    
    NSDictionary *dic =[NSDictionary dictionaryWithObjectsAndKeys:
                        GM_User.userId,   userIdKey,
                        date,            dateKey,
                        self.receipt,    receiptKey,
                        nil];
    
    [dic writeToFile:savedPath atomically:YES];
}


-(void)checkIAPFilesComplete:(completCall)success{
    
    if (success) {
        self.success = success;
    }
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error = nil;
    //搜索该目录下的所有文件和目录
    NSArray *cacheFileNameArray = [fileManager contentsOfDirectoryAtPath:[SandBoxHelper iapReceiptPath] error:&error];
    
    if (error == nil) {
        for (NSString *name in cacheFileNameArray) {
            if ([name hasSuffix:@".plist"]){ //如果有plist后缀的文件，说明就是存储的购买凭证
                
                NSString *filePath = [NSString stringWithFormat:@"%@/%@", [SandBoxHelper iapReceiptPath], name];
                
                [self sendAppStoreRequestBuyPlist:filePath];
            }
        }
    } else {
        NSLog(@"AppStoreInfoLocalFilePath error:%@", [error domain]);
    }
}



-(void)sendAppStoreRequestBuyPlist:(NSString *)plistPath {
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithContentsOfFile:plistPath];
    
    NSLog(@"票据验证 票据信息 dic = %@",dic);

    BOOL update = [dic[updateKey] boolValue];
    if (update || IsNilOrNull(dic)) {//已同步
        return;
    }
    
    if (![dic[userIdKey] isEqualToString:GM_User.userId]) {//非此用户票据
        return;
    }
    
    NSData *data = dic[receiptKey];
    
    NSString *url = [NSString stringWithFormat:@"%@/usr/api/verifyOrder?type=%@&token=%@&payType=700",ORDER,VerifyType,GM_User.userToken];
    
     OYWeakObj(self);
    [MBProgressHUD showTipMessageInWindow:@"验证中..."];
    //创建URL对象
    NSURL *reqUrl =[NSURL URLWithString:url];
    //创建请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:reqUrl];
    [request setHTTPMethod:@"post"];
    [request setAllHTTPHeaderFields:@{@"Content-Type":@"application/octet-stream"}];
    [request setHTTPBody:data];
    // 3 建立会话 session支持三种类型的任务
    NSURLSession *session =[NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [MBProgressHUD hideHUDFromView:[GM_APP window]];
            if (data) {
                NSDictionary *json =[NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
                if([json[@"code"] integerValue] == 0){
                    NSLog(@"dic == %@",dic);
                    dic[updateKey] = @(1);
                    [[NSDictionary dictionaryWithDictionary:dic] writeToFile:plistPath atomically:YES];
                    
                    if (weakself) {
                        weakself.success(YES,json);
                        NSLog(@"票据验证成功");
                    }
                    [weakself removeReceipt:plistPath];
                }else if([json[@"code"] integerValue] == 100){
                    [MBProgressHUD showTipMessageInWindow:@"服务器未找到该商品信息" timer:2.0];
                }else{
                    [MBProgressHUD showTipMessageInWindow:@"服务器验证失败" timer:2.0];
                }
            }
        });
    }];
    [dataTask resume];
    
}

//验证成功就从plist中移除凭证
-(void)removeReceipt:(NSString *)plistStr{
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    if ([fileManager fileExistsAtPath:[SandBoxHelper iapReceiptPath]]) {
        
        [fileManager removeItemAtPath:[SandBoxHelper iapReceiptPath] error:nil];
    }
}



@end
