//
//  DYCoinMainCell.m
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYCoinMainCell.h"

@implementation DYCoinMainCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
    
    [self.getButton setBackgroundImage:[UIImage imageWithColor:NAV_BAR_COLOR] forState:UIControlStateNormal];
        
    [self.getButton setBackgroundImage:[UIImage imageWithColor:[UIColor lightGrayColor]] forState:UIControlStateDisabled];
    OYViewBorderRadius(self.coinButton, 5, 1, NAV_BAR_COLOR)
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

}



- (IBAction)getClick:(UIButton *)sender {
    if (self.cellCall) {
        self.cellCall();
    }
}

@end
