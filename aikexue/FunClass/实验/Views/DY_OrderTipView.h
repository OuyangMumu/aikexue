//
//  DY_OrderTipView.h
//  aikexue
//
//  Created by Ray on 2017/11/20.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DY_OrderModel.h"
#import "ALLoadingView.h"

typedef NS_ENUM(NSInteger,tipStatus) {
    tipStatusPay=1,
    tipStatusNetError=20,
    tipStatusLoading=30,
    tipStatusSuccess=40,
    tipStatusFail=50,
};
typedef void(^tipViewCall)(tipStatus status);

@interface DY_OrderTipView : UIView <CAAnimationDelegate>


@property (nonatomic,strong)DYExperimentModel *model;
@property (nonatomic,strong)DY_OrderModel *orderModel;

@property (nonatomic,assign)tipStatus status;

@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *desLabel;
@property (weak, nonatomic) IBOutlet UIButton *payButton;
@property (weak, nonatomic) IBOutlet UILabel *priceLabel;
@property (weak, nonatomic) IBOutlet UIView *priceView;
@property (weak, nonatomic) IBOutlet UILabel *tipLabel;
@property (weak, nonatomic) IBOutlet ALLoadingView *loadingView;



@property (nonatomic,copy)tipViewCall tipCall;

+(instancetype)loadFromNib;

-(void)show;

-(void)dismiss;
@end
