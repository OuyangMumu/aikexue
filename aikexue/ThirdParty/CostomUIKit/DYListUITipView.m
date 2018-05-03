//
//  DYListUITipView.m
//  aikexue
//
//  Created by Ray on 2017/8/15.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYListUITipView.h"

@implementation DYListUITipView

-(instancetype)initWithFrame:(CGRect)frame{
   self =  [[[NSBundle mainBundle]loadNibNamed:@"DYListUITipView" owner:self options:nil]lastObject];
    
    self.frame = frame;
    self.hidden = YES;
    return self;
}

- (IBAction)tipClick:(UIButton *)sender {
    
    if ([self.tipDelegate conformsToProtocol:@protocol(ListUITipDelegate)]) {
        if ([self.tipDelegate respondsToSelector:@selector(listUITipClick)] ){
            [self.tipDelegate listUITipClick];
        }
    }
}

-(void)resetUI:(NSString *)icon and:(NSString *)tipLab and:(NSString *)tipButton{
    self.icon.image = [UIImage imageNamed:icon];
    self.tipLab.text = tipLab;
    [self.tipButton setBackgroundImage:[UIImage imageNamed:tipButton] forState:UIControlStateNormal];
}
@end
