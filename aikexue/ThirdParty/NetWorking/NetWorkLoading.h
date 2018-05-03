//
//  NetWorkLoading.h
//  aikexue
//
//  Created by Ray on 2017/8/23.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NetWorkLoading : UIView


@property (nonatomic,strong)UIImageView *bgImageView;

@property (nonatomic,strong)UIImageView *animationImage;

@property (nonatomic,strong)UILabel *tipLable;


-(void)showHUDAddedTo:(UIView *)view;

-(void)hideHUDForView:(UIView *)view;

+(instancetype)shareManagerLoading;
@end
