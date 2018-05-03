//
//  DYResetPasswordController.m
//  aikexue
//
//  Created by Ray on 2017/9/25.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYResetPasswordController.h"

@interface DYResetPasswordController ()

@end

@implementation DYResetPasswordController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.navigationItem.title = @"修改密码";
    OYViewBorderRadius(self.comfireBtn, 20, 0, OYClearColor);

    
    
}

- (IBAction)resetPasswordClick:(UIButton *)sender {
    
    if (self.oldPW.text.length==0 || self.resetPW.text.length == 0 || self.resetPW2.text.length ==0 ) {
        
        [MBProgressHUD showTipMessageInWindow:@"密码不能为空!"];

        return;
    }
    
    
    if (![self.resetPW.text isEqualToString:self.resetPW2.text]) {
        [MBProgressHUD showTipMessageInWindow:@"两次输入的密码不一致!"];
        return;
    }
    
    if ([self.oldPW.text isEqualToString:self.resetPW.text]) {
        [MBProgressHUD showTipMessageInWindow:@"新密码不能跟旧密码一样!"];
        return;
    }
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/changePassword?token=%@&oldPwd=%@&newPwd=%@",SSO_SRV,GM_User.userToken,self.oldPW.text,self.resetPW.text) params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            [MBProgressHUD showTipMessageInWindow:@"密码修改成功!"];
            
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2), dispatch_get_main_queue(), ^{
                [weakself.navCtl popViewControllerAnimated:YES];
            });
        }else if ([response[@"code"] integerValue]==10){
            [MBProgressHUD showTipMessageInWindow:@"旧密码错误"];
        }else{
            [MBProgressHUD showTipMessageInWindow:OYStringFormat(@"%@",response[@"msg"])];
        }
        
    } fail:^(NSError *error) {
        [MBProgressHUD showTipMessageInWindow:@"密码修改失败!"];
    } showHUD:self.view];
    
}

@end
