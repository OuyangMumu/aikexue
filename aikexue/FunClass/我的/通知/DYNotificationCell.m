//
//  DYNotificationCell.m
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYNotificationCell.h"

@implementation DYNotificationCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}



-(void)setModel:(DYUserNotifiModel *)model{
    
//    typeID=10,12,13时存在，预览图地址
    
    self.timeLab.text = [Utils timeStringWith:[model.createTime stringValue] formatter:@"yyyy-MM-dd"];
    
    if([model.status integerValue]==UNREAD){
        _unReadTip.hidden=NO;
    }else{
        _unReadTip.hidden=YES;
    }
    
    switch ([model.typeID integerValue]) {//通知类型，10:文章，11:优惠券，12:实验，13:实验包
        case 10:
        {
            self.titleLab.text = @"文章";
            self.icon.image = [UIImage imageNamed:@"notification-icon"];
            self.subTitle.text = model.contentTitle;
        }
            break;
           
        case 11:
        {
            self.titleLab.text = @"优惠券";
            self.icon.image = [UIImage imageNamed:@"coupon-notice"];
            self.subTitle.text = [NSString stringWithFormat:@"%@ 元优惠券", model.coupon.price];
        }
            break;
            
        case 12:
        {
            self.titleLab.text = @"实验";
            self.icon.image = [UIImage imageNamed:@"experimental-notice"];
            self.subTitle.text = model.contentTitle;

        }
            break;
            
        case 13:
        {
            self.titleLab.text = @"实验包";
            self.icon.image = [UIImage imageNamed:@"experimental-notice"];
            self.subTitle.text = model.contentTitle;

        }
            
            break;
        default:
            break;
    }
}

@end
