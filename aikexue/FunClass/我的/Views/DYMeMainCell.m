//
//  DYMeMainCell.m
//  aikexue
//
//  Created by Ray on 2017/7/31.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYMeMainCell.h"

@implementation DYMeMainCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
    self.switchOn.transform = CGAffineTransformMakeScale(0.75, 0.75);

}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

- (IBAction)switchClick:(UISwitch *)sender {
    
    GM_User.wifiOnly = sender.on;
    if (self.cellCall) {
        self.cellCall(sender);
    }
}
@end
