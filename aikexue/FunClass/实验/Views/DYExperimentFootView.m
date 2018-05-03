//
//  DYExperimentFootView.m
//  aikexue
//
//  Created by Ray on 2017/8/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentFootView.h"
#import "DY_RechargeController.h"

@implementation DYExperimentFootView

-(void)awakeFromNib{
    [super awakeFromNib];
    self.layer.contents = OYImageLayer(@"grass-bg");
    
    [[[NSBundle mainBundle]loadNibNamed:@"DYExperimentFootView" owner:self options:nil]lastObject];
    
    [self addSubview:self.contentView];
        
}


-(void)setModel:(DYExperimentModel *)model{
    _model = model;
    self.payButton.enabled = YES;
    
    if ([[GM_User userExperiment]valueForKey:model._id]) {
        self.payButton.enabled = NO;
    }
    
    CGFloat coupon = 0.0;
    CGFloat price =  [model.price floatValue];
    if (self.couponModel) {
        coupon = [self.couponModel.price floatValue];
        if (coupon>=price) {
            coupon = price;
        }
        
        NSString *priceString = [NSString stringWithFormat:@"%.2f金币",coupon*10];
        NSString *allString = [NSString stringWithFormat:@"(已优惠:%@)",priceString];
        self.coupounLab.attributedText = [allString attributeStringWithsubString:priceString attributes:@{NSForegroundColorAttributeName:NAV_BAR_COLOR}];
    }else{
        self.coupounLab.attributedText = nil;
    }

    CGFloat needPay = price - coupon;
    
    NSString *priceString = [NSString stringWithFormat:@"%.2f金币",needPay*10];
    NSString *allString = [NSString stringWithFormat:@"待支付:%@",priceString];
    
    self.priceLab.attributedText = [allString attributeStringWithsubString:priceString attributes:@{NSForegroundColorAttributeName:NAV_BAR_COLOR}];
    
}

-(void)setCouponModel:(DYUserCouponModel *)couponModel{
    _couponModel =couponModel;
    self.model = self.model;
}

-(void)setCanPay:(BOOL)canPay{
    _canPay = canPay;
    if (canPay) {
        [self.payButton setTitle:@"购买" forState:UIControlStateNormal];
    }else{
        [self.payButton setTitle:@"充值" forState:UIControlStateNormal];
    }
}


- (IBAction)buyClick:(UIButton *)sender {
    if (self.canPay) {
        sender.enabled = NO;
        Puerchaser* pr=[Puerchaser new];
        pr.item=self.model;
        pr.couponModel=self.couponModel;
        [pr purchase];
    }else{
        DY_RechargeController *VC =[DY_RechargeController new];
        [[GM_APP rootNav] pushViewController:VC animated:YES];
    }
}
@end
