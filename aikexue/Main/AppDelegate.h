//
//  AppDelegate.h
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>
#import "CocosViewController.h"
#import "DYBaseNavController.h"
#import "DYBaseTabBarController.h"
#import "DYBaseViewController.h"
#import "DYExperimentMainCtl.h"
#import "DYMeMainCtl.h"
#import "DYChangeUserController.h"
#import <UserNotifications/UserNotifications.h>
#import <AudioToolbox/AudioToolbox.h>


typedef NS_ENUM(NSInteger , ThirdtyType){
    ThirdtyTypeDefault=1,
    ThirdtyTypeWeixin=2
    
};


@interface AppDelegate : UIResponder <UIApplicationDelegate,WXApiDelegate,JPUSHRegisterDelegate,UNUserNotificationCenterDelegate>
+(void)registNotice;
-(void)registerNotification;

@property (strong, nonatomic) UIWindow *window;

@property (nonatomic, strong) DYBaseNavController *rootNav;
@property (nonatomic, strong) DYBaseTabBarController *navTabBarCtl;
-(DYBaseViewController *)getCurrentViewController;

//跳转第三方类型
@property(nonatomic,assign) ThirdtyType thirdtyType;


//数据库
@property (readonly, strong) NSPersistentContainer *persistentContainer;
- (void)saveContext;


@property (nonatomic,copy)NSString *gameKey;

@property (nonatomic,assign)BOOL running;
+(AppDelegate*)shared;
-(void)openeid:(NSString*)eid;
-(void)CloseCocos2d;
@end

