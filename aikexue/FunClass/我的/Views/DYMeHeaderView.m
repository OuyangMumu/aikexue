//
//  DYMeHeaderView.m
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYMeHeaderView.h"

@implementation DYMeHeaderView

+(instancetype)loadFromNibWithFrame:(CGRect)frame{
    
    DYMeHeaderView *view = [[[NSBundle mainBundle]loadNibNamed:@"DYMeHeaderView" owner:nil options:nil]lastObject];
    
    view.frame  = frame;
    OYViewBorderRadius(view.iconImg, 40, 2, [UIColor whiteColor]);
    return view;
}

-(void)refreshHeader{
    
    [self.iconImg sd_setImageWithURL:[NSURL URLWithString:GM_User.usrImg] placeholderImage:IconPlaceholderImage];

    self.nameLab.text = GM_User.userName;
    [self createCurvedLine:self.frame];//画狐线
    
    if ([[DYCoinPersonInfo sharedCoin].gender isEqualToString:@"BOY"]) {
        [self.sexImage setImage:[UIImage imageNamed:@"男孩"]];
        [self.addImage setImage:[UIImage imageNamed:@"形状-1"]];
        [self.addBodyButton setTitle:[DYCoinPersonInfo sharedCoin].babyName forState:UIControlStateNormal];
    }else if([[DYCoinPersonInfo sharedCoin].gender isEqualToString:@"GIRL"]){
        [self.sexImage setImage:[UIImage imageNamed:@"女孩"]];
        [self.addImage setImage:[UIImage imageNamed:@"形状-1"]];
        [self.addBodyButton setTitle:[DYCoinPersonInfo sharedCoin].babyName forState:UIControlStateNormal];
    }else{
        [self.sexImage setImage:[UIImage imageNamed:@"兔子"]];
        [self.addImage setImage:[UIImage imageNamed:@"添加"]];
        [self.addBodyButton setTitle:@"点击添加宝宝信息" forState:UIControlStateNormal];
    }
}

//画一个弧线
-(void)createCurvedLine:(CGRect)frame{
    UIBezierPath* aPath = [UIBezierPath bezierPath];
    aPath.lineWidth = 1.0;
    aPath.lineCapStyle = kCGLineCapRound; //线条拐角
    aPath.lineJoinStyle = kCGLineCapRound; //终点处理
    [aPath moveToPoint:CGPointMake(0, 20)];
    [aPath addQuadCurveToPoint:CGPointMake(GM_SCREEN_S.width, 20) controlPoint:CGPointMake(GM_SCREEN_S.width/2, 0)];
    
    CAShapeLayer *shape =[CAShapeLayer layer];
    shape.path=aPath.CGPath;
    shape.fillColor = [UIColor whiteColor].CGColor;
    
    [self.huxian.layer addSublayer:shape];
}
- (IBAction)userInfoClick:(UIButton *)sender {
    
    if (self.headClick) {
        self.headClick(1);
    }
}

- (IBAction)addBabyInfo:(UIButton *)sender {
    if (self.headClick) {
        self.headClick(2);
    }
}
- (IBAction)settingClick:(UIButton *)sender {
    if (self.headClick) {
        self.headClick(3);
    }
}

@end
