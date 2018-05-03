//
//  Puerchaser.m
//  aikexue
//
//  Created by Centny on 04/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import "Puerchaser.h"
#import "Utils.h"
#import "Downloader.h"
#import "MBProgressHUD+DYHUD.h"
#import "DY_OrderModel.h"


@implementation Puerchaser

OYSingleton_m(Puer)
- (bool)purchase{
    
    NSMutableDictionary* args=[NSMutableDictionary new];
    [args setValue:self.couponModel._id forKey:@"coupon_id"];
    [args setValue:self.item._id forKey:@"exam_id"];
    NSNotification* notice = [NSNotification notificationWithName:N_PURCHASING object:args];
    [[NSNotificationCenter defaultCenter] postNotification:notice];
    NSDecimalNumber* price=[Utils price:self.item coupon:self.couponModel];
    if([Utils iszero:price]){
        [self joinFreeExam:self.item._id coupon:self.couponModel._id];
    }else{
        
        [self createExamOrder:self.item._id coupon:self.couponModel._id];
    }
    
    return true;
}

-(void)alert:(NSString*)title msg:(NSString*)msg{
    
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [MBProgressHUD hideHUDFromView:[GM_APP window]];
    });
    
    UIAlertView* alert=[[UIAlertView alloc]initWithTitle:title message:msg delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil];
    [alert show];
    if(self.ondone){
        self.ondone(-1);
    }
    NSMutableDictionary* args=[NSMutableDictionary new];
    [args setValue:self.item._id forKey:@"exam_id"];
    NSNotification* notice = [NSNotification notificationWithName:N_PURCHASFail object:args];
    [[NSNotificationCenter defaultCenter] postNotification:notice];
    
}

-(void)joinFreeExam:(NSString*)eid{
    [self joinFreeExam:eid coupon:@""];
}


-(void)joinFreeExam:(NSString*)eid coupon:(NSString*)cid{
    if(cid==nil){
        cid=@"";
    }
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/joinExam?token=%@&eid=%@&couponId=%@&ret_down=1",MAIN_SRV,GM_User.userToken,eid,cid) params:nil success:^(id response) {
        
        if([response[@"code"] integerValue]==0 || [response[@"code"] integerValue]==20){
          
            [Utils buySuccess:weakself.item];
            
        }else{
            [weakself alert:@"添加失败" msg:@"添加实验失败"];
            
        }
        
    } fail:^(NSError *error) {
        
        [weakself alert:@"添加失败" msg:@"添加实验失败"];
        
    } showHUD:[GM_APP window]];
}


-(void)createExamOrder:(NSString*)eid coupon:(NSString*)cid{
    
    NSMutableDictionary *dic = [NSMutableDictionary new];
    if (cid) {
        dic[@"cid"]=cid;
    }
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/createExamOrder?token=%@&eid=%@&host=%@&pay=32",MAIN_SRV,GM_User.userToken,eid,MAIN_SRV) params:dic success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            NSLog(@"成功创建订单");
            
           weakself.orderModel = [DY_OrderModel modelWithJSON:response[@"data"][@"order"]];
            weakself.tipView.model = weakself.item;
            weakself.tipView.orderModel = weakself.orderModel;
            weakself.tipView.status = tipStatusPay;
            [weakself.tipView show];
            
        }
    } fail:^(NSError *error) {
        NSLog(@"创建订单失败");
    } showHUD:[GM_APP window]];
    
}

-(void)walletPay:(NSString*)ono{
    
    NSMutableDictionary *dic = [NSMutableDictionary new];
    if (self.pwd) {
        dic[@"pwd"] = self.pwd;
    }
    self.tipView.status = tipStatusLoading;
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/walletPay?token=%@&ono=%@",MAIN_SRV,GM_User.userToken,ono) params:dic success:^(id response) {
        
        if ([response[@"code"] integerValue]==0 || [response[@"code"] integerValue]==2) {
            NSLog(@"订单支付成功");            
            [Utils buySuccess:weakself.item];
            weakself.tipView.status = tipStatusSuccess;
        }else{
            weakself.tipView.status = tipStatusFail;
        }
    } fail:^(NSError *error) {
        NSLog(@"订单支付失败");
        weakself.tipView.status = tipStatusNetError;
    } showHUD:nil];
}


-(DY_OrderTipView *)tipView{
    
    if (!_tipView) {
        _tipView = [DY_OrderTipView loadFromNib];
        OYWeakObj(self)
        [_tipView setTipCall:^(tipStatus status) {
            switch (status) {
                case tipStatusPay://购买                    

                    [weakself walletPay:weakself.orderModel.ono];

                    break;
                    
                case tipStatusSuccess://确定
                    break;
                    
                case tipStatusFail://重试
                    [weakself walletPay:weakself.orderModel.ono];
                    break;
                    
                case tipStatusNetError://重试
                    [weakself walletPay:weakself.orderModel.ono];
                    break;
                    
                default:
                    break;
            }
        }];
    }
    return _tipView;
}

@end
