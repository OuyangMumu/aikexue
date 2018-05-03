//
//  DY_OrderTipView.m
//  aikexue
//
//  Created by Ray on 2017/11/20.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DY_OrderTipView.h"

static NSString * const kALAnimationKey = @"kALAnimationKey";

@implementation DY_OrderTipView


+(instancetype)loadFromNib{
    
    DY_OrderTipView *view = [[[NSBundle mainBundle]loadNibNamed:@"DY_OrderTipView" owner:self options:nil]lastObject];
    OYSysAlpha(view);
    
    view.frame = [UIScreen mainScreen].bounds;
    return view;
}

-(void)setModel:(DYExperimentModel *)model{
    _model = model;
    self.titleLabel.text = model.title;
    if ([model.type isEqualToString:EXAM_TYPE_PACKAGE]) {
        self.desLabel.text = [NSString stringWithFormat:@"%@个实验 / %@",model.examCount,sizeString([model.size longValue])];
    }else{
        self.desLabel.text = [NSString stringWithFormat:@"1个实验 / %@",sizeString([model.size longValue])];
    }
}

-(void)setOrderModel:(DY_OrderModel *)orderModel{
    _orderModel = orderModel;
    self.priceLabel.text = OYStringFormat(@"%.2f金币",[orderModel.price floatValue]*10);
}

-(void)setStatus:(tipStatus)status{
    
    _status = status;
    self.payButton.enabled = YES;
    self.priceView.hidden = YES;
    self.tipLabel.text = @"";
    self.loadingView.hidden = YES;
    self.payButton.userInteractionEnabled = YES;

    switch (status) {
        case tipStatusPay:
            [self.payButton setTitle:@"确认购买" forState:UIControlStateNormal];
            self.priceView.hidden = NO;
            break;
        case tipStatusLoading:
            self.payButton.enabled = NO;
            [self.loadingView start];
            self.loadingView.hidden = NO;

            break;
        case tipStatusSuccess:
            self.payButton.userInteractionEnabled = NO;
            [self.payButton setTitle:@"确定" forState:UIControlStateNormal];
            self.tipLabel.text = @"购买成功";
            break;
        case tipStatusFail:
            [self.payButton setTitle:@"重试" forState:UIControlStateNormal];
            self.tipLabel.text = @"购买失败";
            break;
        case tipStatusNetError:
            [self.payButton setTitle:@"重试" forState:UIControlStateNormal];
            self.tipLabel.text = @"网络打盹啦,稍后再试吧!";
            break;
        default:
            break;
    }
    
}

-(void)show{
    [[GM_APP rootNav].viewControllers.lastObject.view addSubview:self];
}

-(void)dismiss{
    [self removeFromSuperview];
}
- (IBAction)closeClick:(UIButton *)sender {
    [self dismiss];
}

- (IBAction)payButtonClick:(UIButton *)sender {
    
    switch (self.status) {
        case tipStatusPay:
            if (self.tipCall) {
                self.tipCall(self.status);
            }
            break;
        case tipStatusLoading:
            self.payButton.enabled = NO;
            break;
        case tipStatusSuccess:
            
            [self dismiss];
            
            break;
        case tipStatusFail:
            if (self.tipCall) {
                self.tipCall(self.status);
            }
            break;
        case tipStatusNetError:
            if (self.tipCall) {
                self.tipCall(self.status);
            }
            break;
        default:
            break;
    }
}


@end
