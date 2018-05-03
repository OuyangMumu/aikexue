//
//  DYUserCouponHeaderView.m
//  aikexue
//
//  Created by Ray on 2017/11/6.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYUserCouponHeaderView.h"

@implementation DYUserCouponHeaderView

- (IBAction)headClick:(UIButton *)sender {
    if (self.callBack) {
        self.callBack(sender.tag);
    }
}

@end
