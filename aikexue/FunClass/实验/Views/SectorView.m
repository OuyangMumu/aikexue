//
//  SectorView.m
//  aikexue
//
//  Created by Centny on 06/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import "SectorView.h"
#import <UIKit/UIKit.h>

@implementation SectorView

-(void)setRate:(CGFloat)rate{
    _rate=rate;
    
    [self setNeedsDisplay];
}
-(void)setSpeed:(float)speed{
    _speed = speed;
    CGFloat mb = speed/1024/1024;
    if (mb>0) {
        self.kbLabel.text =OYStringFormat(@"%.2fM/s",mb);
    }else{
        self.kbLabel.text =OYStringFormat(@"%.2fkb/s",speed/1024);
    }
}


+(instancetype)buttonWithType:(UIButtonType)buttonType{
 
    SectorView *button =   [super buttonWithType:buttonType];
    [button addSubview:button.kbLabel];
    button.titleEdgeInsets = UIEdgeInsetsMake(0, 0, 20, 0);
    return button;
}


// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    [super drawRect:rect];
    CGFloat x=FRAM_W(self)/2,y=FRAM_H(self)/2-10;
    self.kbLabel.frame = CGRectMake(0, 30, FRAM_W(self), 20);
    CGContextRef ctx= UIGraphicsGetCurrentContext();
    //
    CGContextSetLineWidth(ctx, self.strokeWidth);
    [self.bcolor set];
    CGContextAddArc(ctx, x, y, 15-self.strokeWidth, 0, 2*M_PI, 0);
    CGContextStrokePath(ctx);
    //
    //ctx = UIGraphicsGetCurrentContext();
    CGContextSetLineWidth(ctx, self.strokeWidth);
    [self.color set];
    CGContextAddArc(ctx, x, y, 15-self.strokeWidth, -0.5*M_PI, self.rate*2*M_PI-0.5*M_PI, 0);
    CGContextStrokePath(ctx);
}

-(UILabel *)kbLabel{
    if (!_kbLabel) {
        _kbLabel = [[UILabel alloc]initWithFrame:CGRectMake(0, 30, FRAM_W(self), 20)];
        _kbLabel.textColor = [UIColor lightGrayColor];
        _kbLabel.font = [UIFont systemFontOfSize:11];
        _kbLabel.text = @"继续下载";
        _kbLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _kbLabel;
}


@end
