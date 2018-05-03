//
//  DYExperimentActionView.h
//  aikexue

//  cocos实验按钮
//
//  Created by Ray on 2017/8/3.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYExperimentModel.h"
#import "SectorView.h"
#import "DYUserCouponController.h"

typedef NS_ENUM(NSInteger,ActionType){
    
    ActionTypeBuy=1,
    ActionTypeDown=2,
    ActionTypeOpen=3,
    ActionTypePause=4,
    ActionTypeLook=5,
    ActionTypeUpdate=6,
    ActionTypeLoading=7,
    ActionTypeDowned=8
};

typedef NS_ENUM(NSInteger,BackgroundType) {
    BackgroundTypeDefault=0,
    BackgroundTypeWhite=1,
};



@protocol ActionViewDelegate <NSObject>

-(void)actionViewDidClick;

@end


@interface DYExperimentActionView : UIView

@property (nonatomic,weak)id <ActionViewDelegate> delegate;//

@property (strong, nonatomic)  UIButton *actionButton;

@property (nonatomic,assign)ActionType buttonStatus;

@property (nonatomic,assign)BackgroundType backType;

@property (strong, nonatomic)  SectorView *loading;

@property (nonatomic,strong)DYExperimentModel *model;

@property(nonatomic,strong) DYUserCouponModel* couponModel;

@property (nonatomic,assign)BOOL confirmed;

-(void)setBackgroundColor:(UIColor *)backgroundColor andTitleColor:(UIColor *)titleColor title:(NSString *)title;


@end
