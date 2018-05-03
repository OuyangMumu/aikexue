//
//  DYUserCouponCell.h
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYUserCouponController.h"

typedef void(^shareCallBack)();

@interface DYUserCouponCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UIImageView *icon;
@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UILabel *durationLab;
@property (weak, nonatomic) IBOutlet UILabel *priceLab;
@property (weak, nonatomic) IBOutlet UIButton *selectButton;
@property (weak, nonatomic) IBOutlet UIButton *shareButton;
@property (nonatomic,copy)shareCallBack shareCall ;

@property (nonatomic,strong)DYUserCouponModel *model;

@end
