//
//  MBProgressHUD+DYHUD.h
//  rcpi
//
//  Created by Ray on 2017/6/22.
//  Copyright © 2017年 itdayang. All rights reserved.
//


#import "MBProgressHUD.h"

@interface MBProgressHUD (DYHUD)


/**
 文字提示,全屏遮盖 屏蔽点击事件 不自动消失

 @param message
 */
+ (void)showTipMessageInWindow:(NSString*)message;

/**
 文字提示,遮盖具体视图 屏蔽点击事件 不自动消失
 
 @param message
 */
+ (void)showTipMessageInView:(UIView *)view  message:(NSString*)message;
/**
 文字提示,全屏遮盖 屏蔽点击事件 time时间后消失
 
 @param message
 */
+ (void)showTipMessageInWindow:(NSString*)message timer:(NSTimeInterval)aTimer;

/**
 文字提示,

 @param view 遮盖的视图
 @param message 提示消息文字
 @param aTimer 消失的时间间隔
 */
+ (void)showTipMessageInView:(UIView *)view  message:(NSString*)message timer:(NSTimeInterval)aTimer;

/**
 全屏上的 菊花提示

 @param message 提示文字
 */
+ (void)showActivityMessageInWindow:(NSString*)message;

/**
 视图上的 菊花提示

 @param view 父视图
 @param message 提示文字
 */
+ (void)showActivityMessageInView:(UIView *)view  message:(NSString*)message;

/**
 全屏的菊花提示

 @param message 提示文字
 @param aTimer 展示的时间
 */
+ (void)showActivityMessageInWindow:(NSString*)message timer:(NSTimeInterval)aTimer;

/**
 视图上的菊花提示

 @param view 父视图
 @param message 提示文字
 @param aTimer 提示时间长度
 */
+ (void)showActivityMessageInView:(UIView *)view  message:(NSString*)message timer:(NSTimeInterval)aTimer;

/**
 自定义的图片提示框 全屏

 @param iconName 图片名
 @param message 提示文字
 */
+ (void)showCustomIconInWindow:(NSString *)iconName message:(NSString *)message;

/**
 自定义的图片提示框   视图上

 @param view 父视图
 @param iconName 图片名
 @param message 提示文字
 */
+ (void)showCustomIconInView:(UIView *)view  icon:(NSString *)iconName message:(NSString*)message;

/**
 全屏的 图片提示框

 @param iconName 图片名
 @param message 提示文字
 @param aTimer 提示时间
 */
+ (void)showCustomIconInWindow:(NSString *)iconName message:(NSString *)message timer:(NSTimeInterval)aTimer;


/**
 视图上的 自定义图片提示框

 @param view 父视图
 @param iconName 图片名
 @param message 提示文字
 @param aTimer 提示时间
 */
+ (void)showCustomIconInView:(UIView *)view  icon:(NSString *)iconName message:(NSString*)message timer:(NSTimeInterval)aTimer;


+ (void)showSuccessMessage:(NSString *)Message;
+ (void)showErrorMessage:(NSString *)Message;
+ (void)showInfoMessage:(NSString *)Message;
+ (void)showWarnMessage:(NSString *)Message;



/**
 隐藏提示框
 */
+ (void)hideHUDFromView:(UIView *)supView;


@end
