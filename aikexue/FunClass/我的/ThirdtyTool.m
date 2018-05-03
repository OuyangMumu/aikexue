//
//  ThirdtyTool.m
//  aikexue
//
//  Created by Ray on 2017/9/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "ThirdtyTool.h"

static NSString* accessToken;
static NSString* openID;

@implementation ThirdtyTool


OYSingleton_m(Tool)


-(void)sendAuthRequest{
    //构造SendAuthReq结构体
    SendAuthReq* req =[[SendAuthReq alloc]init];
    req.scope = @"snsapi_userinfo" ;
    req.state = @"126857" ;
    //第三方向微信终端发送一个SendAuthReq消息结构
    [WXApi sendReq:req];
}


-(void)onClickWXLogin:(CallBack)back controller:(UIViewController *)vc login:(NSString *)type{


    NSLog(@"tag %@",@"press wxlogin btn");
    if (![WXApi isWXAppInstalled]) {
        back(NO,nil);
        [Utils alert:@"微信登录失败" msg:[NSString stringWithFormat:@"请先安装微信"]];
        return;
    }
    
    self.back = back;
    self.type = type;
    
    [GM_APP setThirdtyType:ThirdtyTypeWeixin];
    [self sendAuthRequest];
}


//取消绑定第三方账号
-(void)onClickUnBind:(CallBack)back   controller:(UIViewController *)vc{

    self.back = back;
    
    NSString *thirdUnbind=@"/usr/api/thirdUnbind";
    NSString *urlStr=[NSString stringWithFormat:@"%@%@?token=%@",SSO_SRV,thirdUnbind,GM_User.userToken];
    
    OYWeakObj(self);
    
    
    [DYNetworking getWithUrl:urlStr params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {//解绑成功
            
            if (weakself.back) {
                weakself.back(YES, response);
            }
        }else {
            if (weakself.back) {
                weakself.back(NO, response);
            }
        }

    } fail:^(NSError *error) {
        if (weakself.back) {
            weakself.back(NO, nil);
        }
    } showHUD:nil];

    
}


// 授权后回调
// AppDelegate.m
-(void)onResp:(BaseResp *)resp {
    // 向微信请求授权后,得到响应结果
    NSLog(@"onResp %@",@"resp");
    if (![resp isKindOfClass:[SendAuthResp class]]) {
        [self onWXLofinToast:[NSString stringWithFormat:@"微信登录失败，系统错误"]];
        return;
    }
    [GM_APP setThirdtyType:ThirdtyTypeDefault];
    
    SendAuthResp *temp = (SendAuthResp *)resp;
    
    switch (resp.errCode) {
        case 0://授权成功
            break;
            
        case -2:
            [self onWXLofinToast:[NSString stringWithFormat:@"你取消了微信授权"]];
            return;
            
        case -3:
            [self onWXLofinToast:[NSString stringWithFormat:@"微信请求超时"]];
            return;
        default:
            [self onWXLofinToast:[NSString stringWithFormat:@"微信授权失败，系统错误"]];
            return;
    };
    
    OYWeakObj(self)

    [DYNetworking getWithUrl:[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/oauth2/access_token?appid=%@&secret=%@&code=%@&grant_type=authorization_code",@"wx7359e589d604be47",@"5f7470181f7a1b0dbfd0ded584ea715f",temp.code] params:nil success:^(id response) {
        
        accessToken=[response valueForKey:@"access_token"];
        openID=[response valueForKey:@"openid"];
        
        if(accessToken.length<=0||openID.length<=0){
            [weakself onWXLofinToast:[NSString stringWithFormat:@"微信授权失败，系统错误"]];
            return;
        }
        
        [weakself loginByAccessToken:YES];
        
    } fail:^(NSError *error) {
        [weakself onWXLofinToast:[NSString stringWithFormat:@"微信授权失败，系统错误"]];
    } showHUD:nil];
}

-(void)loginByAccessToken:(BOOL)tryAgain{
    NSString* url=@"";
    if([self.type isEqual:@"bind"]){
        url=[[NSString alloc] initWithString:[NSString stringWithFormat:@"%@/pub/api/thirdLogin?access_token=%@&source=IOS&openid=%@&bind=1&token=%@",SSO_SRV,accessToken,openID,GM_User.userToken]];
    }
    else {
        url=[[NSString alloc] initWithString:[NSString stringWithFormat:@"%@/pub/api/thirdLogin?access_token=%@&source=IOS&openid=%@&",SSO_SRV,accessToken,openID]];
    }
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:url params:nil success:^(id response) {
        
        NSDictionary* sdata=[response valueForKey:@"data"];
        
        if ([response[@"code"] integerValue]!=0) {
            
            [weakself onWXLofinToast:response[@"msg"]];
            
            return;
            
        }else if(sdata==NULL){
            [weakself onWXLofinToast:[NSString stringWithFormat:@"系统错误"]];
            return;
        }
        
        if ([self.type isEqualToString:@"bind"]) {
            [GM_User refreshUserInfo:^(BOOL success, id data) {
                if (success) {
                    [weakself performSelector:@selector(onWXLoginSucces) withObject:nil afterDelay:0.5f];
                }else{
                    GM_User.privated.unionId = @"绑定成功";
                }
            }];
        }else{
            [GM_User loginSuccess:response];
            
            [weakself performSelector:@selector(onWXLoginSucces) withObject:nil afterDelay:0.5f];
        }
        
    } fail:^(NSError *error) {

        if (tryAgain) {
            [weakself loginByAccessToken:NO];
        }else{
            [weakself onWXLofinToast:[NSString stringWithFormat:@"网络连接超时"]];
        }
        
    } showHUD:nil];
}

-(void)onWXLoginSucces{
    if (self.back) {
        self.back(YES,nil);
    }
}





-(void)onWXLofinToast:(NSString*)Msg{
    NSString *title=@"";
    if([self.type isEqualToString:@"bind"]){
        title=@"绑定微信失败";
    }else{
        title=@"微信登录失败";
    }
    if(Msg==nil||[Msg isEqualToString:@""])Msg=@"未知错误！";
    [Utils alert:title msg:Msg];
    NSLog(@"onWXlogin toast %@",Msg);
    [GM_APP setThirdtyType:ThirdtyTypeDefault];

    if (self.back) {
        self.back(NO, nil);
    }
    
    return;
}

-(void)onWXLoginTimeOut{
    if([self.type isEqualToString:@"bind"]){
        [Utils alert:@"绑定微信失败" msg:[NSString stringWithFormat:@"绑定超时，绑定微信失败"]];
    }else{
        [Utils alert:@"微信登录失败" msg:[NSString stringWithFormat:@"登录超时，微信登录失败"]];
    }
    [GM_APP setThirdtyType:ThirdtyTypeDefault];

    return;
}
@end
