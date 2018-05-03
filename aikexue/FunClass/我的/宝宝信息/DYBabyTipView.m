//
//  DYBabyTipView.m
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBabyTipView.h"

@implementation DYBabyTipView


+(instancetype)loadFromNib{
    
    DYBabyTipView *view = [[[NSBundle mainBundle]loadNibNamed:@"DYBabyTipView" owner:self options:nil]lastObject];
    OYSysAlpha(view);
    
    view.frame = [UIScreen mainScreen].bounds;
    
    OYViewBorderRadius(view.tipView, 5, 0, OYClearColor)
    view.tipView.layer.masksToBounds = NO;
    OYViewBorderRadius(view.dataView, 5, 0, OYClearColor)
    view.datePick.maximumDate = [NSDate date];
    
    return view;
}

-(void)show{
    [[GM_APP window] addSubview:self];
    if (self.showDatePick) {
        self.dataView.hidden = NO;
    }else{
        self.tipView.hidden = NO;
    }
}

-(void)dismiss{
    
    self.dataView.hidden = YES;
    self.tipView.hidden = YES;
    [self removeFromSuperview];
    
}


- (IBAction)cancelClick:(UIButton *)sender {
    [self dismiss];

    if (self.showDatePick && self.dateCall) {
        
    }else{
        self.dateCall(nil);
    }
}

- (IBAction)sureClick:(id)sender {
    if (self.showDatePick && self.dateCall) {
        self.dateCall(self.datePick.date);
    }
    
    [self dismiss];
}
@end
