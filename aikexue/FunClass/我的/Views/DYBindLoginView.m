//
//  DYBindLoginView.m
//  aikexue
//
//  Created by Ray on 2017/12/11.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBindLoginView.h"
#import <CommonCrypto/CommonDigest.h>
#import "DYExperimentMainCtl.h"
#import "ServeUrlModel.h"
#import "ThirdtyTool.h"
#import "DYResetPasswordController.h"

static DYBindLoginView *loginView=nil;

@implementation DYBindLoginView

OYSingleton_m(LoginView)

+(instancetype)shareLoginView{
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        loginView =  [[[NSBundle mainBundle]loadNibNamed:@"DYBindLoginView" owner:self options:nil]lastObject];
        
        OYSysAlpha(loginView);
        OYViewBorderRadius(loginView.comfireBtn, 3, 0, OYClearColor)
        loginView.frame = [UIScreen mainScreen].bounds;
        [[NSNotificationCenter defaultCenter]addObserver:loginView selector:@selector(textFieldsDidChange:) name:UITextFieldTextDidChangeNotification object:nil];
    });
    return loginView;
}


-(void)textFieldsDidChange:(NSNotification *)info{
    
    UITextField *textField = info.object;
    if (textField == self.phoneTF) {
        if (textField.text.length==11) {
            self.SecurityButton.enabled = YES;
        }else{
            self.SecurityButton.enabled = NO;
        }
    }
    self.comfireBtn.enabled = NO;
    
    if (self.type == PhoneTypeBind || self.type == PhoneTypePhoneLogin) {
        
        if(self.phoneTF.text.length==11 && self.codeTF.text.length>=4){
            self.comfireBtn.enabled = YES;
        }
        
    }else  if (self.type == PhoneTypeCountLogin) {
        if (self.countTF.text.length>0 && self.passwordTF.text.length>0) {
            self.comfireBtn.enabled = YES;
        }
    }
}


- (IBAction)getSecurityCode:(UIButton *)sender{
    [self endEditing:YES];
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
        if(code==0 || code==7){
            [weakself.timer fire];
        }else{
            [Utils alert:@"发送失败" msg:response[@"dmsg"]];
            [weakself.timer fire];
            weakself.countdown = 1;
        }
    } fail:^(NSError *error) {
        [Utils alert:@"发送失败" msg:[NSString stringWithFormat:@"发送验证码失败"]];
        weakself.SecurityButton.enabled=YES;
    } showHUD:self];
}

- (IBAction)loginClick:(UIButton *)sender {
    
    [self endEditing:YES];

    OYWeakObj(self);
    NSString* ph=self.phoneTF.text;
    NSString* pc=self.codeTF.text;
    [MBProgressHUD showActivityMessageInWindow:@""];
    if(self.type == PhoneTypeBind){//绑定
        [DYNetworking getWithUrl:OYStringFormat(@"%@/tlogin/api/bindPhone?source=IOS&phone=%@&pcode=%@&t=Bind",SSO_SRV,ph,pc) params:nil success:^(id response) {
            [MBProgressHUD hideHUDFromView:[GM_APP window]];
            if ([response[@"code"] integerValue]==0) {
                [GM_User refreshUserInfo:^(BOOL success, id data) {
                }];
                GM_User.privated.phone = ph;
                [MBProgressHUD showTipMessageInWindow:@"绑定成功"];
                [weakself CheckReward];
     
            }else{
                [MBProgressHUD showTipMessageInWindow:OYStringFormat(@"%@",response[@"msg"])];
            }

        } fail:^(NSError *error) {
            [MBProgressHUD hideHUDFromView:[GM_APP window]];
            [Utils alert:@"绑定失败" msg:@"绑定失败"];
        } showHUD:nil];
    }else if(self.type == PhoneTypeCountLogin){//账号登录
        [self loginClickByCount];
    } else if(self.type == PhoneTypePhoneLogin){//手机登录
        [DYNetworking getWithUrl:OYStringFormat(@"%@/sso/api/loginByCode?source=IOS&phone=%@&pcode=%@&selector=basic,privated",SSO_SRV,ph,pc) params:nil success:^(id response) {
            [MBProgressHUD hideHUDFromView:[GM_APP window]];

            int code=[[response valueForKey:@"code"]intValue];
            switch (code) {
                case 0:{
                    [GM_User loginSuccess:response];
                    [weakself dismiss:nil];

                }
                    break;
                default:
                    [Utils alert:@"登录失败" msg:response[@"dmsg"]];
                    break;
            }

        } fail:^(NSError *error) {
            [MBProgressHUD hideHUDFromView:[GM_APP window]];
            [Utils alert:@"登录失败" msg:DYTipMessageNetErr];
        } showHUD:nil];
    }
}


- (void)loginClickByCount{
    
    [self endEditing:YES];
    NSString *acount = self.countTF.text;
    NSString *password = self.passwordTF.text;

    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/sso/api/login?source=IOS&usr=%@&pwd=%@&selector=basic,privated",SSO_SRV,acount,password) params:nil success:^(id response) {
        [MBProgressHUD hideHUDFromView:[GM_APP window]];

        int code=[[response valueForKey:@"code"]intValue];
        switch (code) {
            case 0:{
                [GM_User loginSuccess:response];
                [weakself dismiss:nil];
            }
                break;
            default:
                [Utils alert:@"登录失败" msg:response[@"dmsg"]];
                break;
        }

    } fail:^(NSError *error) {
        [MBProgressHUD hideHUDFromView:[GM_APP window]];
        [Utils alert:@"登录失败" msg:DYTipMessageNetErr];
    } showHUD:nil];
}

//绑定手机获取金币
-(void)CheckReward{
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/CheckReward?type=0&coin=10",MAIN_SRV) params:nil success:^(id response) {
        [weakself dismiss:nil];
    } fail:^(NSError *error) {
        [weakself dismiss:nil];
    } showHUD:nil];
}

-(NSTimer *)timer{
    if (!_timer) {
        _timer=[NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(onCountDown:) userInfo:nil repeats:YES];
        [[NSRunLoop mainRunLoop]addTimer:_timer forMode:NSDefaultRunLoopMode];
        self.countdown=60;
    }
    return _timer;
}

- (void)onCountDown:(id)sender{
    self.countdown--;
    if(self.countdown<1){
        [self.timer invalidate];
        self.timer = nil;
        self.SecurityButton.enabled = YES;
    }else{
        self.SecurityButton.enabled = NO;
        [self.SecurityButton setTitle:[NSString stringWithFormat:@"%lds",self.countdown] forState:UIControlStateDisabled];
    }
}


- (IBAction)weixiClick:(UIButton *)sender {
    
    [MBProgressHUD showHUDAddedTo:self animated:YES];
    OYWeakObj(self)
    [[ThirdtyTool sharedTool] onClickWXLogin:^(BOOL success , id obj) {
        
        [MBProgressHUD hideHUDForView:weakself animated:YES];
        
        if (success) {
            [weakself dismiss:nil];
        }
    } controller:[GM_APP getCurrentViewController] login:@"login"];
    
}
- (IBAction)countLoginClick:(UIButton *)sender {
    sender.selected = !sender.selected;

    self.loginView.hidden = self.bindView.hidden = YES;
    self.countdown = 1;
    if (sender.selected) {
        self.type = PhoneTypeCountLogin;
        self.loginView.hidden = NO;
    }else{
        self.type = PhoneTypePhoneLogin;
        self.bindView.hidden = NO;
    }
}

- (IBAction)forgetPassword:(UIButton *)sender {
    
    [self dismiss:nil];
    
    DYResetPasswordController *VC = [DYResetPasswordController new];
    [[GM_APP rootNav] pushViewController:VC animated:YES];
}

- (IBAction)bindOrLogin:(UIButton *)sender {
    self.type = sender.tag-10;
    self.bindButton.selected = self.loginButton.selected= NO;
    sender.selected = YES;
    self.bindView.hidden = NO;
    self.phoneCountExchangeBtn.hidden = YES;
    self.phoneCountExchangeBtn.selected = NO;
    self.typeString=@"bind";
    self.codeTF.text = self.passwordTF.text = self.countTF.text = nil;
    
    self.SecurityButton.enabled = YES;
    [self.timer invalidate];
    self.timer = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [MBProgressHUD showTipMessageInWindow:@"当前游客的实验包数据将不保存"];
    });

    if (self.type) {
        self.phoneCountExchangeBtn.hidden = NO;
        self.typeString=@"login";
    }
    
    OYWeakObj(self)
    [UIView animateWithDuration:0.25 animations:^{
        weakself.sliderView.center = CGPointMake((300/4)*(self.type*2+1), 43);
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

-(void)showTo:(UIView *)supView complete:(completeCall)finish{
    [[GM_APP window] addSubview:self];

    self.typeString = @"bind";
    if (finish) {
        self.finish = finish;
    }
    
}
- (IBAction)dismiss:(UIButton *)sender {
    self.phoneTF.text = self.codeTF.text = self.countTF.text = self.passwordTF.text = nil;
    [self bindOrLogin:self.bindButton];
    self.timer = nil;
    [self removeFromSuperview];
    if (self.finish) {
        self.finish();
    }
}





@end
