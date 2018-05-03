//
//  DYUserCouponHeaderView.h
//  aikexue
//
//  Created by Ray on 2017/11/6.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^HeaderCallBack)(NSInteger);

@interface DYUserCouponHeaderView : UIView


@property (nonatomic,copy)HeaderCallBack callBack;

@end
