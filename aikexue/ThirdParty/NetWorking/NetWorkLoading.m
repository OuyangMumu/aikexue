//
//  NetWorkLoading.m
//  aikexue
//
//  Created by Ray on 2017/8/23.
//  Copyright © 2017年 io. All rights reserved.
//

#import "NetWorkLoading.h"

static NetWorkLoading *managerLoading = nil;

@implementation NetWorkLoading


+(instancetype)shareManagerLoading{
  
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        managerLoading = [NetWorkLoading new];
        managerLoading.frame = [GM_APP window].bounds;
        [managerLoading  buildUI];
    });
    return managerLoading;
}

-(UIImageView *)bgImageView{

    if (!_bgImageView) {
        
        UIImage *bgimage = [UIImage imageNamed:@"动画帧1"];

        _bgImageView = [UIImageView new];
        _bgImageView.size = CGSizeMake(bgimage.size.width/2, bgimage.size.height/2);
        
        _bgImageView.center = self.center;
    }
    return _bgImageView;
}


-(UIImageView *)animationImage{

    if (!_animationImage) {
        UIImage *bgimage = [UIImage imageNamed:@"动画帧1"];
        _animationImage = [[UIImageView alloc]initWithImage:bgimage];
        _animationImage.size = CGSizeMake(bgimage.size.width/2, bgimage.size.height/2);

        _animationImage.frame = self.bgImageView.frame;
        
        _animationImage.animationImages=[NSArray arrayWithObjects:[UIImage imageNamed:@"动画帧1"],[UIImage imageNamed:@"动画帧2"],[UIImage imageNamed:@"动画帧3"], nil];
        _animationImage.animationDuration = 2.0;
        _animationImage.animationRepeatCount=0;
        [_animationImage startAnimating];
        
    }
    
    return _animationImage;
}


-(void)buildUI{

    [managerLoading addSubview:managerLoading.bgImageView];
    [managerLoading addSubview:managerLoading.animationImage];    
    
}


+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static NetWorkLoading *managerLoading = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        managerLoading = [super allocWithZone:zone];
        
    });
    return managerLoading;
}

- (id)copyWithZone:(nullable NSZone *)zone{
    return managerLoading;
}



-(void)showHUDAddedTo:(UIView *)view{
    
    managerLoading.hidden = NO;
    managerLoading.frame = view.bounds;
    
    if (managerLoading.superview) {
        [managerLoading removeFromSuperview];
    }
    
    [view addSubview:managerLoading];
}

-(void)hideHUDForView:(UIView *)view{
    
    [managerLoading removeFromSuperview];
    managerLoading.hidden = YES;
}

@end
