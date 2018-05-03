//
//  DYUserCouponCell.m
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYUserCouponCell.h"

@implementation DYUserCouponCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}


-(void)setModel:(DYUserCouponModel *)model{
//    self.icon = [];
    self.titleLab.text = @"可在全平台使用";
    self.priceLab.text = [NSString stringWithFormat:@"¥%.2f",[model.price floatValue]];

    NSNumber* start = model.startTime;
    NSNumber* end = model.endTime;
    if(end&&[end longLongValue]){
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"yyyy.MM.dd"];
        NSDate* startTime=[NSDate dateWithTimeIntervalSince1970:[start longLongValue]/1000];
        NSDate* endTime=[NSDate dateWithTimeIntervalSince1970:[end longLongValue]/1000];
        self.durationLab.text=[NSString stringWithFormat:@"有效期:%@-%@",[formatter stringFromDate:startTime],[formatter stringFromDate:endTime]];
    }else{
        self.durationLab.text=[NSString stringWithFormat:@"有效期：不限"];
    }
}


- (IBAction)shareClick:(UIButton *)sender {

    if (self.shareCall) {
        self.shareCall();
    }
}


@end
