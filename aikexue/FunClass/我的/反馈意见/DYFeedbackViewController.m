//
//  DYFeedbackViewController.m
//  aikexue
//
//  Created by Ray on 2017/8/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYFeedbackViewController.h"

@interface DYFeedbackViewController ()

@end

@implementation DYFeedbackViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.scrollView = self.input;
    self.navigationItem.title = @"意见反馈";
    self.input.limitCount = 300;
    
}
-(IBAction)onClickConfirm:(id)sender{

    NSString* text=self.input.text;
    if(text==nil||text.length<1 || [text isEmpty]){
        [Utils alert:@"提交失败" msg:@"请输入意见"];
        return;
    }
    
    NSMutableDictionary* args=[NSMutableDictionary new];
    [args setObject:text forKey:@"context"];
    NSMutableDictionary* contact=[NSMutableDictionary new];
    if(self.phone.text&&self.phone.text.length){
        [contact setObject:self.phone.text forKey:@"phone"];
    }
    if(self.qq.text&&self.qq.text.length){
        [contact setObject:self.qq.text forKey:@"qq"];
    }
    if(self.weixin.text&&self.weixin.text.length){
        [contact setObject:self.weixin.text forKey:@"weixin"];
    }
    [args setObject:contact forKey:@"contact"];

    [DYNetworking postWithUrl:[NSString stringWithFormat:@"%@/pub/api/addSuggestion?token=%@",MAIN_SRV,GM_User.userToken] params:args success:^(id response) {

        int code=[[response valueForKey:@"code"]intValue];
        
        switch (code) {
            case 0:{
                UIAlertView* alert=[[UIAlertView alloc]initWithTitle:@"反馈成功" message:@"感谢您的反馈" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil];
                [alert show];
                
                [DYCoinPersonInfo sharedCoin].coinNum = @([[DYCoinPersonInfo sharedCoin].coinNum integerValue] + 1);
                
            }
                break;
                
            case 13015:{
                [Utils alert:@"反馈失败" msg:@"反馈意见不能超过300个汉字哦~"];
            }
                break;
            default:
                [Utils alert:@"反馈失败" msg:[NSString stringWithFormat:@"意见反馈失败(%@,%@)",[response valueForKey:@"code"],[response valueForKey:@"msg"]]];
                break;
        }

    } fail:^(NSError *error) {

       [Utils alert:@"反馈失败" msg:@"网络异常"];
        
    } showHUD:self.view];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    [self.navigationController popViewControllerAnimated:YES];
}

@end
