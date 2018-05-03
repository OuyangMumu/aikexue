//
//  DYBaseViewController.m
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYBaseViewController ()


@end

@implementation DYBaseViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.navCtl = [GM_APP rootNav];
    self.xibToTop.constant = OYNavBarHeight;
    
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(loginSuccessRefresh) name:LoginSuccessNotification object:nil];
}

-(void)setScrollView:(UIScrollView *)scrollView{
    _scrollView = scrollView;
    
    if (@available(iOS 11.0, *)) {
        _scrollView.contentInsetAdjustmentBehavior =UIScrollViewContentInsetAdjustmentNever;
    } else {
        self.automaticallyAdjustsScrollViewInsets = NO;
    }
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [MBProgressHUD hideHUDForView:self.view animated:YES];
}


-(void)loginSuccessRefresh{

}

-(void)startNetworking:(BOOL)tip{

}

-(void)buildUI{

}

//横竖屏控制
- (BOOL)shouldAutorotate{
    return NO;
}
- (UIInterfaceOrientationMask) supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskPortrait;
}

-(UIInterfaceOrientation)preferredInterfaceOrientationForPresentation{
    return UIInterfaceOrientationPortrait;
}

-(void)dealloc{
    [[NSNotificationCenter defaultCenter]removeObserver:self];
    NSLog(@"%@ - dealloc",self.class);
}
@end
