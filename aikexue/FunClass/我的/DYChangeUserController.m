//
//  DYChangeUserController.m
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYChangeUserController.h"
#import <CommonCrypto/CommonDigest.h>
#import "DYExperimentMainCtl.h"
#import "ServeUrlModel.h"
#import "ThirdtyTool.h"
#import "DYResetPasswordController.h"



@interface DYChangeUserController ()

@property(nonatomic,assign) NSInteger countdown;
@property(nonatomic,strong) NSTimer* timer;
@property (nonatomic,copy)NSString *typeString;//


@end

@implementation DYChangeUserController

- (void)viewDidLoad {
    [super viewDidLoad];
    //
    
    OYViewBorderRadius(self.SecurityButton, 5, 0.5, [UIColor lightGrayColor]);
    OYViewBorderRadius(self.comfireBtn, 5, 0, OYClearColor);

    self.navigationItem.title = @"绑定/登录";
    if (self.type == PhoneTypeBind) {
        self.typeString = @"bind";
    }else{
        self.typeString=@"login";
    }
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(textFieldsDidChange:) name:UITextFieldTextDidChangeNotification object:nil];
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
}

-(void)textFieldsDidChange:(NSNotification *)info{
    
    UITextField *textField = info.object;
    if (textField == self.phoneTF) {
        if (textField.text.length>=11) {
            self.SecurityButton.enabled = YES;
        }else{
            self.SecurityButton.enabled = NO;
        }
    }
    self.comfireBtn.enabled = NO;

    if (self.type == PhoneTypeBind) {
       
        if(self.phoneTF.text.length>=11 && self.codeTF.text.length>=4){
            self.comfireBtn.enabled = YES;
        }
        
    }else  if (self.type == PhoneTypeCountLogin) {
        
        if (self.countTF.text.length>0 && self.passwordTF.text.length>0) {
            self.comfireBtn.enabled = YES;
        }

    }else  if (self.type == PhoneTypePassword) {
        if(self.phoneTF.text.length>=11 && self.codeTF.text.length>=4 && self.resetPW.text.length>0&&self.resetPW2.text.length>0){
            self.comfireBtn.enabled = YES;
        }
    }

}


- (IBAction)getSecurityCode:(UIButton *)sender{
    
    NSString* ph=self.phoneTF.text;
    if(ph&&ph.length!=11){
        [Utils alert:@"请输入" msg:@"请输入正确手机号码"];
        return;
    }
    NSString* key=@"338d98dccd1a2685b5715c69f064de6c";
    NSString* base=[NSString stringWithFormat:@"key=%@&mobile=%@&types=%@",key,ph,self.typeString];
    NSString* sign=[self md5:base];
    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/tlogin/api/sendMessage?mobile=%@&types=%@&sign=%@",SSO_SRV,ph,self.typeString,sign) params:nil success:^(id response) {
        int code=[[response valueForKey:@"code"]intValue];
        weakself.SecurityButton.enabled=NO;
        
        if(code==0){
            [weakself startCountdown];
        }else if(code==3){
            if([@"bind" isEqualToString:weakself.typeString]){
                [Utils alert:@"绑定失败" msg:@"手机号已绑定其它用户，请直接登录"];
            }else if([@"login" isEqualToString:weakself.typeString]){
                [Utils alert:@"登录失败" msg:@"该手机号未注册"];
            }
            weakself.SecurityButton.enabled=YES;
        }else{
            [Utils alert:@"发送失败" msg:[NSString stringWithFormat:@"发送验证码失败(%@)",[response valueForKey:@"code"]]];
            weakself.SecurityButton.enabled=YES;
        }
    } fail:^(NSError *error) {
        [Utils alert:@"发送失败" msg:[NSString stringWithFormat:@"发送验证码失败"]];
        weakself.SecurityButton.enabled=YES;
    } showHUD:self.view];
}

- (IBAction)loginClick:(UIButton *)sender {
    
    [self.view endEditing:YES];
    OYWeakObj(self);
    NSString* ph=self.phoneTF.text;
    NSString* pc=self.codeTF.text;
    
    if(self.type == PhoneTypeBind){//绑定
        
        [DYNetworking getWithUrl:OYStringFormat(@"%@/tlogin/api/bindPhone?source=IOS&phone=%@&pcode=%@&t=Bind",SSO_SRV,ph,pc) params:nil success:^(id response) {
            
            if ([response[@"code"] integerValue]==0) {
                [GM_User refreshUserInfo:nil];
                GM_User.privated.phone = ph;
                [MBProgressHUD showTipMessageInWindow:@"绑定成功"];
                [weakself CheckReward];
            }else{
                [MBProgressHUD showTipMessageInWindow:OYStringFormat(@"%@",response[@"msg"])];
            }
        } fail:^(NSError *error) {
            [Utils alert:@"绑定失败" msg:@"绑定失败"];
        } showHUD:nil];
        
    }else if(self.type == PhoneTypeCountLogin){//登录
        [self loginClickByCount];
    } else if(self.type == PhoneTypePassword){
        
        if ([self.resetPW.text isEqualToString:self.resetPW2.text]) {
            NSString *pw = self.resetPW.text;
            
            [DYNetworking getWithUrl:OYStringFormat(@"%@/tlogin/api/resetPwd?source=IOS&phone=%@&pcode=%@&selector=basic,privated&pwd=%@",SSO_SRV,ph,pc,pw) params:nil success:^(id response) {
                int code=[[response valueForKey:@"code"]intValue];
                switch (code) {
                    case 0:{
                        [MBProgressHUD showTipMessageInWindow:@"修改成功"];
                        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                            [weakself.navCtl popViewControllerAnimated:YES];
                        });
                    }
                        break;
                        
                    default:
                        [Utils alert:@"修改失败" msg:[NSString stringWithFormat:@"%@",[weakself errMsg:[[ response valueForKey:@"code"]intValue]]]];
                        break;
                }
            } fail:^(NSError *error) {
                [Utils alert:@"密码修改失败" msg:DYTipMessageNetErr];
            } showHUD:self.view];
        }else{
            [MBProgressHUD showTipMessageInWindow:@"两次密码输入不一致"];
        }
    }
}


- (void)loginClickByCount{
    
    [self.view endEditing:YES];
    NSString *acount = self.countTF.text;
    NSString *password = self.passwordTF.text;
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/sso/api/login?source=IOS&usr=%@&pwd=%@&selector=basic,privated",SSO_SRV,acount,password) params:nil success:^(id response) {
        int code=[[response valueForKey:@"code"]intValue];
        switch (code) {
            case 0:{
                [GM_User loginSuccess:response];
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2), dispatch_get_main_queue(), ^{
                    [weakself.navCtl popViewControllerAnimated:YES];
                });
            }
                break;
            default:
                [Utils alert:@"登录失败" msg:[NSString stringWithFormat:@"%@",[weakself errMsg:[[ response valueForKey:@"code"]intValue]]]];
                break;
        }
    } fail:^(NSError *error) {
        [Utils alert:@"登录失败" msg:DYTipMessageNetErr];
    } showHUD:self.view];
}


-(NSString*)errMsg:(int)code{
    switch (code) {
        case 0:
            return @"登录成功";
        case 1:
            return @"参数错误";
        case 2:
            return @"用户名或密码错误";
        case 3:
            return @"登录失败";
        case 4:
            return @"服务器错误";
        case 405:
            return @"验证码错误";
        case 406:
            return @"需要验证码";
        case 10:
            return @"用户被禁用";
        case 11:
            return @"用户被删除";
        case 12:
            return @"用户有效期已过";
        case 13:
            return @"需要先验证登陆手机";
        case 14:
            return @"需要完善用户资料";
        case 15:
            return @"频繁登录失败";
        default:
            return [NSString stringWithFormat:@"未知%d",code];
    }
}





//绑定手机获取金币
-(void)CheckReward{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/CheckReward?type=0&coin=10",MAIN_SRV) params:nil success:^(id response) {
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2), dispatch_get_main_queue(), ^{
            [weakself.navCtl popViewControllerAnimated:YES];
            
        });
        
    } fail:^(NSError *error) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2), dispatch_get_main_queue(), ^{
            [weakself.navCtl popViewControllerAnimated:YES];
        });
    } showHUD:nil];
}


- (void)startCountdown{
    self.countdown=60;
    [self.SecurityButton setTitle:[NSString stringWithFormat:@"%lds",self.countdown] forState:UIControlStateDisabled];
    self.timer=[NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(onCountDown:) userInfo:nil repeats:YES];
}

- (void)stopCountDown{
    if(self.timer){
        [self.timer invalidate];
    }
    [self.SecurityButton setTitle:@"获取验证码" forState:UIControlStateNormal];
    self.SecurityButton.enabled=YES;
}

- (void)onCountDown:(id)sender{
    self.countdown--;
    if(self.countdown<1){
        [self stopCountDown];
    }else{
        [self.SecurityButton setTitle:[NSString stringWithFormat:@"%lds",self.countdown] forState:UIControlStateDisabled];
    }
}


- (IBAction)weixiClick:(UIButton *)sender {
    
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    OYWeakObj(self)
    [[ThirdtyTool sharedTool] onClickWXLogin:^(BOOL success , id obj) {
        
        [MBProgressHUD hideHUDForView:weakself.view animated:YES];
        
        if (success) {
            [weakself.navCtl popViewControllerAnimated:YES];
        }
    } controller:self login:@"login"];
    
}

- (IBAction)forgetPassword:(UIButton *)sender {
    
    DYResetPasswordController *VC = [DYResetPasswordController new];
    [self.navCtl pushViewController:VC animated:YES];
}

- (IBAction)bindOrLogin:(UIButton *)sender {
    
    self.type = sender.tag-10;
    self.bindButton.selected = self.loginButton.selected= NO;
    sender.selected = YES;
    
    if (self.type) {
        self.loginView.hidden = NO;
        self.bindView.hidden = YES;
    }else{
        self.loginView.hidden = YES;
        self.bindView.hidden = NO;
    }
    
    OYWeakObj(self)
    [UIView animateWithDuration:0.25 animations:^{
        weakself.sliderView.center = CGPointMake((GM_SCREEN_S.width/4)*(self.type*2+1), 43);
    }];
}

- (NSString *) md5:(NSString *) input {
    const char *cStr = [input UTF8String];
    unsigned char digest[CC_MD5_DIGEST_LENGTH];
    CC_MD5( cStr, strlen(cStr), digest ); // This is the md5 call
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x", digest[i]];
    return  output;
}




@end

