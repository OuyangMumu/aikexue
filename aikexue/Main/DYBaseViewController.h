//
//  DYBaseViewController.h
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYBaseNavController.h"

@interface DYBaseViewController : UIViewController

@property (weak, nonatomic) IBOutlet NSLayoutConstraint *xibToTop;


@property (nonatomic,strong)DYBaseNavController *navCtl;
@property(strong,nonatomic)UIScrollView *scrollView;


-(void)buildUI;
-(void)startNetworking:(BOOL)tip;
-(void)loginSuccessRefresh;


@end
