//
//  AppDelegate.m
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import "AppDelegate.h"
#import "UserManager.h"
#import "cocos2d.h"
#import "CAppDelegate.h"
#import "Utils.h"
#import "DYUserCouponController.h"
#import "DYSysNoteViewController.h"
#import "DYQualityGoodsController.h"
#import "DYGameViewController.h"
#import "ThirdtyTool.h"
#import <UMSocialCore/UMSocialCore.h>

static CAppDelegate s_sharedApplication;
static AppDelegate* _shared;

static NSDictionary* _version;
static NSDictionary* launchOpt;

#define SYSTEM_NOTICE_TYPE 10
#define EXAM_NOTICE_TYPE 12
#define EXAM_PACKAGE_NOTICE_TYPE 13
#define COUPON_NOTICE_TYPE 11

@interface AppDelegate ()

@end

@implementation AppDelegate

+(AppDelegate*)shared{
    return _shared;
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    launchOpt=launchOptions;
    //初始化服务器地址
    [self setUpSeverParameter];
    //获取用户信息
    [GM_User restartApp];
    
    //开启网络监视器；
    [DYNetworking startMonitoring];
    
    //检测版本
    [self checkVersion];
    
    
    [[Downloader shared]checkCommon];
    
    //注册通知
    [self registerNotification];
    
    /* 设置友盟appkey */
    /* 打开调试日志 */
    [[UMSocialManager defaultManager] openLog:YES];
    [[UMSocialManager defaultManager] setUmSocialAppkey:UMENG_APPKEY];
    [self configUSharePlatforms];

    
    //正式服务器 开启 bugly 日志
    if ([[[ServeUrlModel sharedServeUrlModel] serviceType] isEqualToString:@"kuxiao"]) {
        [Bugly startWithAppId:@"7c0608e127"];
    }
    
    self.window  = [[UIWindow alloc]initWithFrame:[UIScreen mainScreen].bounds];
    self.window.layer.contents = (__bridge id)[UIImage imageNamed:@"fb-bg01"].CGImage;
    self.window.rootViewController = self.rootNav;
    [self.window makeKeyAndVisible];
    
    return YES;
}


#pragma mark- JPUSHRegisterDelegate
-(void)registerNotification{
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    //必须写代理，不然无法监听通知的接收与点击事件
    OYWeakObj(self);
    center.delegate = weakself;
    
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (!error && granted) {
            //用户点击允许
            NSLog(@"注册成功");
            //Required
            //notice: 3.0.0及以后版本注册可以这样写，也可以继续用之前的注册方式
            JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
            entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
            if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
                // 可以添加自定义categories
                // NSSet<UNNotificationCategory *> *categories for iOS10 or later
                // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
            }
            dispatch_async(dispatch_get_main_queue(), ^{
                [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
            });
            
            // Required
            // init Push
            // notice: 2.1.5版本的SDK新增的注册方法，改成可上报IDFA，如果没有使用IDFA直接传nil
            // 如需继续使用pushConfig.plist文件声明appKey等配置内容，请依旧使用[JPUSHService setupWithOption:launchOptions]方式初始化。
            
            
            [JPUSHService setupWithOption:launchOpt
                                   appKey:@"6851230ba232fb0a717d459f"
                                  channel:[_version valueForKey:@"version"]
                         apsForProduction:jspush_Production];
            NSLog(@"jspush_Production == %d",jspush_Production);
            //launchOpt为空也没关系
            
            [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
                if(resCode == 0){
                    
                    NSLog(@"registrationID获取成功：%@",registrationID);
                    [Utils storeMain:registrationID];
                    
                    //服务器绑定 registrationID
                    [AppDelegate registNotice];
                    
                }else{
                    NSLog(@"registrationID获取失败，code：%d",resCode);
                }
            }];
        }else{
            //用户点击不允许
            NSLog(@"注册失败");
            [AppDelegate jsClearTags];
        }
    }];
}


// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
    // Required
    NSDictionary * userInfo = notification.request.content.userInfo;
    if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [self playSound];
        [JPUSHService handleRemoteNotification:userInfo];
    }
    completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}

// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
    // Required
    NSDictionary * userInfo = response.notification.request.content.userInfo;
    if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        [JPUSHService handleRemoteNotification:userInfo];
        NSLog(@" \n tag 3:%@",userInfo);
        [self handleNotice:userInfo];
    }
    completionHandler();  // 系统要求执行这个方法
}

// Required, iOS 7 Support
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    [JPUSHService handleRemoteNotification:userInfo];
    NSLog(@"tag 1:%@",userInfo);
    [self handleNotice:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
}

// Required,For systems with less than or equal to iOS6
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    
    [JPUSHService handleRemoteNotification:userInfo];
    NSLog(@"tag 2:%@",userInfo);
    [self handleNotice:userInfo];
}


-(void)playSound{
    
    SystemSoundID sound = 0;
    NSString *path = [NSString stringWithFormat:@"/System/Library/Audio/UISounds/%@.%@",@"sms-received1",@"caf"];
    
    if (path==nil||[path isEqualToString:@""]) return;
    OSStatus error = AudioServicesCreateSystemSoundID((__bridge CFURLRef)[NSURL fileURLWithPath:path],&sound);
    
    if (error != kAudioServicesNoError) //获取的声音的时候，出现错误
        sound = 0;
    AudioServicesPlaySystemSound(sound);
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);   //让手机震动
}

-(void)handleNotice:(NSDictionary *)userInfo{
    NSDictionary * detail =[Utils jsonStrToDictnry:[userInfo valueForKey:@"detail"]];
    if(detail==NULL)return;
    int typeID=[[detail  valueForKey:@"typeID"] intValue];
    
    switch (typeID) {
        case SYSTEM_NOTICE_TYPE:
        case EXAM_NOTICE_TYPE:
        case EXAM_PACKAGE_NOTICE_TYPE:{
            //                    //当前有其他页面在显示  采用push   push时候判断当前界面是不是在他通知界面，
            //                    //如果是的话直接刷新，滚动到第一个即可   不要重复出现2次这个界面
            //                    //如果现在在系统通知界面  点击实验推送   要进入到实验推送界面
            //                    // 当前在实验通知界面，如果推送来一个实验包，点击也是刷新
            //                    // 反之，当前在实验通知界面，如果推送来一个实验，点击也是刷新，
            //                    // 因为实验、实验包都在实验通知界面
            // iphone
            if([[_rootNav topViewController] isKindOfClass:[DYSysNoteViewController class] ]){
                DYSysNoteViewController* nowVC=[_rootNav topViewController];
                if(nowVC.type==typeID||(nowVC.type==EXAM_NOTICE_TYPE&&typeID==EXAM_PACKAGE_NOTICE_TYPE)||(nowVC.type==EXAM_PACKAGE_NOTICE_TYPE&&typeID==EXAM_NOTICE_TYPE)){
                    [nowVC refreshClick:nil];
                    break;
                }
            }
            DYSysNoteViewController* vc=[DYSysNoteViewController new];
            vc.type=typeID;
            [_rootNav pushViewController:vc animated:YES];
        }
            
            break;
        case COUPON_NOTICE_TYPE:{
            if([[_rootNav topViewController] isKindOfClass:[DYUserCouponController class] ]){
                DYUserCouponController* nowVC=[_rootNav topViewController];
                if(nowVC.vcType==CouponsTypeNotification){
                    [nowVC refresh:YES];
                    [nowVC.mainTable scrollsToTop];
                    break;
                }
            }
            
            DYUserCouponController* vc=[DYUserCouponController new];
            vc.vcType=CouponsTypeNotification;
            [_rootNav pushViewController:vc animated:YES];
        }
            break;
        default:
            return;
            
    }
}



//当极光推送注册完毕之后，向我们的服务器注册这个推送id与token绑定
//第三方推送平台初始化成功后必须调用 uid唯一，多次调用会覆盖上一次的rid、tags
+(void)registNotice{
    NSString* registrationID=[Utils loadRid];
    if(registrationID==nil||[registrationID isEqualToString:@""])return;
    [self doRegistNotice:registrationID];
}

//由于在子线程无法进行awf包的网络请求，所以只能使用  performSelectorOnMainThread
+(void)doRegistNotice:(NSString*)registrationID{
    NSString* tag = [ServeUrlModel sharedServeUrlModel].pushTags;
    
    [DYNetworking getWithUrl:[NSString stringWithFormat:@"%@/usr/api/regNoticRelation?rid=%@&token=%@&tags=%@&platform=2",MAIN_SRV,registrationID,GM_User.userToken,tag] params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            GM_User.hasRegNotic = YES;
        }
        
    } fail:^(NSError *error) {
        
    } showHUD:nil];
    
}

- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    
    [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidLoginNotification object:nil];
    
//    [MBProgressHUD showTipMessageInWindow:@"jspush 注册成功"];
    /// Required - 注册 DeviceToken
    [JPUSHService registerDeviceToken:deviceToken];
    
}

-(void)networkDidReceiveMessage:(NSNotification*)notification{
    
//    [MBProgressHUD showTipMessageInWindow:@"jspush 登录成功"];

    //极光绑定 tag
    [AppDelegate jsPushsetTags];
    
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    //Optional
    
    [MBProgressHUD showTipMessageInWindow:@"通知推送打开失败"];
}


+ (void)jsPushsetTags{
    
    NSString* tag =  [ServeUrlModel sharedServeUrlModel].pushTags;
    NSMutableSet *tags = [NSMutableSet set];
    [tags addObject:tag];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        [JPUSHService setTags:tags completion:^(NSInteger iResCode, NSSet *iTags, NSInteger seq) {
            if (iResCode) {
//                [MBProgressHUD showTipMessageInWindow:@"tag 设置失败"];
            }else{
//                [MBProgressHUD showTipMessageInWindow:@"tag 设置成功"];
                [[NSUserDefaults standardUserDefaults]setBool:YES forKey:@"iResCode"];
            }
            NSLog(@"iResCode = %ld , 推送 iTags= %@ 绑定 ,seq = %ld",iResCode,iTags,seq);
        } seq:1];
    });
    
}

+(void)jsClearTags{
    [JPUSHService cleanTags:nil seq:1];
}



-(void)checkVersion{
    NSString *urlStr = @"https://itunes.apple.com/lookup?id=1145313570&country=cn";
    [DYNetworking getWithUrl:urlStr params:nil success:^(id response) {
        
        if([[response valueForKey:@"resultCount"]intValue]<1){
            return;
        }
        NSArray* results=[response valueForKey:@"results"];
        _version=results[0];
        
    } fail:^(NSError *error) {
        
    } showHUD:nil];
    
}


- (DYBaseNavController *)rootNav {
    if (_rootNav == nil) {
        _rootNav = [[DYBaseNavController alloc] initWithRootViewController:self.navTabBarCtl];
    }
    return _rootNav;
}
-(DYBaseViewController *)getCurrentViewController{
    
    if ([[self.rootNav viewControllers] count]==0) {
        DYBaseNavController *nav = (DYBaseNavController*)self.navTabBarCtl.selectedViewController;
        return [nav.viewControllers firstObject];
    }else{
        return [[self.rootNav viewControllers] firstObject];
    }
    return nil;
}


- (DYBaseTabBarController *)navTabBarCtl {
    if (_navTabBarCtl == nil) {
        _navTabBarCtl = [[DYBaseTabBarController alloc] init];
        
        DYQualityGoodsController *mainframeViewController = ({
            DYQualityGoodsController *mainframeViewController = [[DYQualityGoodsController alloc] init];
            
            UIImage *mainframeImage   = [[UIImage imageNamed:@"tabbar_item_good"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            UIImage *mainframeHLImage = [[UIImage imageNamed:@"tabbar_item_good_s"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            
            mainframeViewController.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"精品" image:mainframeImage selectedImage:mainframeHLImage];
            mainframeViewController;
        });
        
        DYExperimentMainCtl *contactsViewController = ({
            DYExperimentMainCtl *contactsViewController = [[DYExperimentMainCtl alloc] init];
            
            UIImage *contactsImage   = [[UIImage imageNamed:@"tabbar_item_experience"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            UIImage *contactsHLImage = [[UIImage imageNamed:@"tabbar_item_experience_s"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            
            contactsViewController.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"实验" image:contactsImage selectedImage:contactsHLImage];
            
            
            contactsViewController;
        });
        
        
        
        DYGameViewController *gameViewController = ({
            DYGameViewController *gameViewController = [[DYGameViewController alloc] init];
            
            UIImage *discoverImage   = [[UIImage imageNamed:@"tabbar_item_game"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            UIImage *discoverHLImage = [[UIImage imageNamed:@"tabbar_item_game_s"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            
            gameViewController.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"游戏" image:discoverImage selectedImage:discoverHLImage];
            
            gameViewController;
        });
        
        
        DYMeMainCtl *discoverViewController = ({
            DYMeMainCtl *discoverViewController = [[DYMeMainCtl alloc] init];
            
            UIImage *discoverImage   = [[UIImage imageNamed:@"tabbar_item_me"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            UIImage *discoverHLImage = [[UIImage imageNamed:@"tabbar_item_me_s"]imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
            
            discoverViewController.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"我" image:discoverImage selectedImage:discoverHLImage];
            
            discoverViewController;
        });
        
        
        _navTabBarCtl.viewControllers = @[[[DYBaseNavController alloc] initWithRootViewController:mainframeViewController],
                                          [[DYBaseNavController alloc] initWithRootViewController:contactsViewController],
                                          [[DYBaseNavController alloc] initWithRootViewController:gameViewController],
                                          [[DYBaseNavController alloc] initWithRootViewController:discoverViewController],
                                          
                                          ];
        
        _navTabBarCtl.tabBar.tintColor =  NAV_BAR_COLOR;
    }
    return _navTabBarCtl;
}




#pragma mark - Core Data stack

@synthesize persistentContainer = _persistentContainer;

- (NSPersistentContainer *)persistentContainer {
    // The persistent container for the application. This implementation creates and returns a container, having loaded the store for the application to it.
    @synchronized (self) {
        if (_persistentContainer == nil) {
            _persistentContainer = [[NSPersistentContainer alloc] initWithName:@"aikexue"];
            [_persistentContainer loadPersistentStoresWithCompletionHandler:^(NSPersistentStoreDescription *storeDescription, NSError *error) {
                if (error != nil) {
                    // Replace this implementation with code to handle the error appropriately.
                    // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    
                    /*
                     Typical reasons for an error here include:
                     * The parent directory does not exist, cannot be created, or disallows writing.
                     * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                     * The device is out of space.
                     * The store could not be migrated to the current model version.
                     Check the error message to determine what the actual problem was.
                     */
                    NSLog(@"Unresolved error %@, %@", error, error.userInfo);
                    abort();
                }
            }];
        }
    }
    
    return _persistentContainer;
}

#pragma mark - Core Data Saving support

- (void)saveContext {
    NSManagedObjectContext *context = self.persistentContainer.viewContext;
    NSError *error = nil;
    if ([context hasChanges] && ![context save:&error]) {
        // Replace this implementation with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
        NSLog(@"Unresolved error %@, %@", error, error.userInfo);
        abort();
    }
}


#pragma mark =============游戏相关===================

-(NSString *)gameKey{
    
    if (!_gameKey) {
        _gameKey = [NSString new];
    }
    return _gameKey;
}



-(void)openeid:(NSString*)eid{
    
    CocosViewController  *cocosVC = [[CocosViewController alloc]initWithNibName:@"CocosLoadingView" bundle:nil];
    self.running = YES;
    self.gameKey = eid;
    cocosVC.eid=eid;
    
//    [self.rootNav presentViewController:self.cocosVC animated:YES completion:nil];
    
    [self.rootNav  pushViewController:cocosVC animated:NO];
}

-(void)CloseCocos2d{
    self.running = NO;
    
    [CocosViewController stop];
    
    [[GM_APP rootNav] popViewControllerAnimated:NO];
}



#pragma mark- cocos  游戏与后台事件
- (void)applicationWillResignActive:(UIApplication *)application {
    if(self.running){
        cocos2d::Director::getInstance()->pause();
    }
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    if(self.running){
        cocos2d::Director::getInstance()->resume();
    }
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    if(self.running){
        cocos2d::Application::getInstance()->applicationDidEnterBackground();
    }
    
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    [self registerNotification];
    
    if(self.running){
        cocos2d::Application::getInstance()->applicationWillEnterForeground();
    }
}

- (void)applicationWillTerminate:(UIApplication *)application {
    self.running=NO;
    [self saveContext];
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    if(self.running){
        cocos2d::Director::getInstance()->purgeCachedData();
    }
}

//游戏横竖屏事件
-(UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window{

    if(self.running){
        return UIInterfaceOrientationMaskLandscape;
    }else{
        return UIInterfaceOrientationMaskPortrait;
    }
}


#pragma mark- wxCallBack

//- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
//{
//    if (self.thirdtyType == ThirdtyTypeWeixin) {
//        return  [WXApi handleOpenURL:url delegate:[ThirdtyTool sharedTool]];
//    }
//    return YES;
//}
////仅支持iOS9以上系统，iOS8及以下系统不会回调
//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary*)options{
//
//    if (self.thirdtyType == ThirdtyTypeWeixin) {
//        return  [WXApi handleOpenURL:url delegate:[ThirdtyTool sharedTool]];
//    }
//    return YES;
//}


// 支持所有iOS系统
//建议使用的系统openURL回调，且 新浪（完整版） 平台仅支持以上回调。还有以下两种回调方式，如果开发者选取以下回调，也请补充相应的函数调用。
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    //6.3的新的API调用，是为了兼容国外平台(例如:新版facebookSDK,VK等)的调用[如果用6.2的api调用会没有回调],对国内平台没有影响

    if (self.thirdtyType == ThirdtyTypeWeixin) {
        return  [WXApi handleOpenURL:url delegate:[ThirdtyTool sharedTool]];
    }else{
        
        BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url sourceApplication:sourceApplication annotation:annotation];
        if (!result) {
            // 其他如支付等SDK的回调
        }
        return result;
    }
    
    return NO;
}


#pragma mark app服务器配置
//APP初始化的服务器配置
-(void)setUpSeverParameter{
    
    NSInteger switchIndex = APP_Version ;
    if ([[NSUserDefaults standardUserDefaults] valueForKey:@"SWITCH"]) {
       switchIndex  = [[[NSUserDefaults standardUserDefaults] valueForKey:@"SWITCH"] integerValue];
    }
    
    switch (switchIndex) {
        case 0:
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"dev"];
            break;
        case 1:
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"chk"];
            
            break;
        case 2:
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"chk2"];
            
            break;
        case 3:
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"kuxiao"];
            break;
        default:
            break;
    }
}

#pragma marks =  友盟
- (void)configUSharePlatforms
{
    /*
     设置微信的appKey和appSecret
     [微信平台从U-Share 4/5升级说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_1
     */
    //向微信注册
    [WXApi registerApp:WECHAT_APPKEY];
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:WECHAT_APPKEY appSecret:WECHAT_Secret redirectURL:nil];

    
    /* 设置分享到QQ互联的appID
     * U-Share SDK为了兼容大部分平台命名，统一用appKey和appSecret进行参数设置，而QQ平台仅需将appID作为U-Share的appKey参数传进即可。
     100424468.no permission of union id
     */
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:QQ_APPKEY /*设置QQ平台的appID*/  appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
    
    /*
     设置新浪的appKey和appSecret
     [新浪微博集成说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_2
     */
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina appKey:WEIBO_APPKEY appSecret:WEIBO_Secret redirectURL:@"https://sns.whalecloud.com/sina2/callback"];
    
    
}



@end

