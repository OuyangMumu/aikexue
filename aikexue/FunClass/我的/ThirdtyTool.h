//
//  ThirdtyTool.h
//  aikexue
//
//  Created by Ray on 2017/9/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

//
typedef void(^CallBack)(BOOL success,id obj);


@interface ThirdtyTool : NSObject <WXApiDelegate>


+(instancetype)sharedTool;

@property (nonatomic,copy)CallBack back;//

@property (nonatomic,copy)NSString *type;//




-(void)onClickWXLogin:(CallBack)back controller:(UIViewController *)vc login:(NSString *)type;

-(void)onClickUnBind:(CallBack)back controller:(UIViewController *)vc;

@end
