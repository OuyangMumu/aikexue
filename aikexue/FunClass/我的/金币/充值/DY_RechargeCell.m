//
//  DY_RechargeCell.m
//  rcpi
//
//  Created by Ray on 2017/6/19.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "DY_RechargeCell.h"

@implementation DY_RechargeCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}


- (IBAction)payButtonClick:(UIButton *)sender{
 
    if (self.cellCall) {
        self.cellCall(sender);
    }
}
@end
