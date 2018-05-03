//
//  DY_ApplePayManager.h
//  rcpi
//
//  Created by Ray on 2017/6/30.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "SandBoxHelper.h"

#import "MBProgressHUD+DYHUD.h"
#import "RMStore.h"


typedef void(^completCall)(BOOL success,id json);

@interface DY_ApplePayManager : NSObject

+(instancetype)shareManager;

-(void)checkIAPFilesComplete:(completCall)success;
-(void)payWithProductId:(NSString *)product complete:(completCall)success;


@end
