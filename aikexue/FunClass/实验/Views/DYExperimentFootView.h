//
//  DYExperimentFootView.h
//  aikexue
//
//  Created by Ray on 2017/8/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DYExperimentFootView : UIView

@property (nonatomic,strong)DYExperimentModel *model;

@property (nonatomic,strong)DYUserCouponModel *couponModel;

@property (nonatomic,assign)BOOL canPay;
@property (strong, nonatomic) IBOutlet UIView *contentView;
@property (weak, nonatomic) IBOutlet UIButton *payButton;
@property (weak, nonatomic) IBOutlet UILabel *priceLab;
@property (weak, nonatomic) IBOutlet UILabel *coupounLab;

- (IBAction)buyClick:(UIButton *)sender;

@end
