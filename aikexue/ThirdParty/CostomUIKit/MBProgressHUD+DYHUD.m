//
//  MBProgressHUD+DYHUD.m
//  rcpi
//
//  Created by Ray on 2017/6/22.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "MBProgressHUD+DYHUD.h"


@implementation MBProgressHUD (DYHUD)

+ (MBProgressHUD*)createMBProgressHUDviewWithView:(UIView *)view  Message:(NSString*)message isWindiw:(BOOL)isWindow
{
    UIView  *supView  = nil;

    if (isWindow) {
        supView =  [UIApplication sharedApplication].delegate.window;
    }else if(view){
        supView = view;
    }
    
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:supView animated:YES];
    hud.labelText=message?message:@"加载中.....";
    hud.labelFont=[UIFont systemFontOfSize:15];
    hud.removeFromSuperViewOnHide = YES;
    hud.dimBackground = NO;
    return hud;
}


#pragma mark-------------------- show Tip----------------------------

+ (void)showTipMessageInWindow:(NSString*)message
{
    [self showTipView:nil Message:message isWindow:true timer:DYMBProgressTimer];
}

+ (void)showTipMessageInWindow:(NSString*)message timer:(NSTimeInterval)aTimer
{
    [self showTipView:nil Message:message isWindow:true timer:aTimer];
}


+(void)showTipMessageInView:(UIView *)view message:(NSString *)message{
    [self showTipMessageInView:view message:message timer:DYMBProgressTimer];
}

+(void)showTipMessageInView:(UIView *)view message:(NSString *)message timer:(NSTimeInterval)aTimer{
    [self showTipView:view Message:message isWindow:false timer:aTimer];
}

+ (void)showTipView:(UIView *)view Message:(NSString*)message isWindow:(BOOL)isWindow timer:(int)aTimer
{
    MBProgressHUD *hud = [self createMBProgressHUDviewWithView:view Message:message isWindiw:isWindow];
    hud.mode = MBProgressHUDModeText;
    [hud hide:YES afterDelay:aTimer];
}



#pragma mark-------------------- show Activity----------------------------

+ (void)showActivityMessageInWindow:(NSString*)message
{
    [self showActivityView:nil Message:message isWindow:true timer:0];
}

+ (void)showActivityMessageInWindow:(NSString*)message timer:(NSTimeInterval)aTimer
{
    [self showActivityView:nil Message:message isWindow:true timer:aTimer];
}

+(void)showActivityMessageInView:(UIView *)view message:(NSString *)message{
    [self showActivityView:view Message:message isWindow:false timer:0];
}

+(void)showActivityMessageInView:(UIView *)view message:(NSString *)message timer:(NSTimeInterval)aTimer{
    [self showActivityView:view Message:message isWindow:false timer:aTimer];

}
+ (void)showActivityView:(UIView *)view Message:(NSString*)message isWindow:(BOOL)isWindow timer:(NSTimeInterval)aTimer
{
    MBProgressHUD *hud = [self createMBProgressHUDviewWithView:view Message:message isWindiw:isWindow];
    hud.mode = MBProgressHUDModeIndeterminate;
    if (aTimer>0) {
        [hud hide:YES afterDelay:aTimer];
    }
}


+ (void)showCustomIconInWindow:(NSString *)iconName message:(NSString *)message
{
    [self showCustomView:nil Icon:iconName message:message isWindow:true timer:DYMBProgressTimer];
    
}
+ (void)showCustomIconInView:(UIView *)view icon:(NSString *)iconName message:(NSString*)message;
{
    [self showCustomView:view Icon:iconName message:message isWindow:false timer:DYMBProgressTimer];

}
+ (void)showCustomIconInWindow:(NSString *)iconName message:(NSString *)message timer:(NSTimeInterval)aTimer{
    
    [self showCustomView:nil Icon:iconName message:message isWindow:true timer:aTimer];

}

+ (void)showCustomIconInView:(UIView *)view icon:(NSString *)iconName message:(NSString*)message timer:(NSTimeInterval)aTimer{
    [self showCustomView:view Icon:iconName message:message isWindow:false timer:aTimer];

}




+ (void)showCustomView:(UIView *)view Icon:(NSString *)iconName message:(NSString *)message isWindow:(BOOL)isWindow timer:(NSTimeInterval)aTimer
{
    MBProgressHUD *hud = [self createMBProgressHUDviewWithView:view Message:message isWindiw:isWindow];
    hud.customView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:iconName]];
    hud.mode = MBProgressHUDModeCustomView;
    [hud hide:YES afterDelay:aTimer];
}



#pragma mark-------------------- show Image----------------------------

+ (void)showSuccessMessage:(NSString *)Message
{
    [self showCustomIconInWindow:@"MBHUD_Success" message:Message];
}
+ (void)showErrorMessage:(NSString *)Message
{
    [self showCustomIconInWindow:@"MBHUD_Error" message:Message];
}
+ (void)showInfoMessage:(NSString *)Message
{
    [self showCustomIconInWindow:@"MBHUD_Info" message:Message];
}
+ (void)showWarnMessage:(NSString *)Message
{
    [self showCustomIconInWindow:@"MBHUD_Warn" message:Message];
}


/**
 隐藏提示框
 */
+ (void)hideHUDFromView:(UIView *)supView{
    
    [MBProgressHUD  hideHUDForView:supView animated:YES];

}



@end
