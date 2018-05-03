//
//  DYBaseNavController.m
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseNavController.h"
#import "UINavigationBar+Awesome.h"


@interface DYBaseNavController ()

@end

@implementation DYBaseNavController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.navigationBar.barTintColor = NAV_BAR_COLOR;

    [self.navigationBar setTitleTextAttributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont  systemFontOfSize:20]}];
    
        self.interactivePopGestureRecognizer.delegate = (id<UIGestureRecognizerDelegate>)self;

}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    
}

-(void)viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    
}


- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated{
    
    if (self.viewControllers.count > 0) {
        /* 自动显示和隐藏tabbar */
        viewController.hidesBottomBarWhenPushed = YES;
        
        // 统一设置左边的返回按钮        
        UIImage *backImg = [UIImage imageNamed:@"back"];
        UIButton *backBtn = [[UIButton alloc] initWithFrame:CGRectMake(0.f, 0.f, backImg.size.width+40, backImg.size.height+20)];
        [backBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [backBtn addTarget:self action:@selector(leftbtnClick) forControlEvents:UIControlEventTouchUpInside];

        [backBtn setImage:backImg forState:UIControlStateNormal];
        UIView *backBtnView = [[UIView alloc] initWithFrame:backBtn.bounds];
        backBtnView.bounds = CGRectOffset(backBtnView.bounds, 15, 0);
        [backBtnView addSubview:backBtn];
        UIBarButtonItem *backBarBtn = [[UIBarButtonItem alloc] initWithCustomView:backBtnView];
        viewController.navigationItem.leftBarButtonItem = backBarBtn;
  
    }
    
    [super pushViewController:viewController animated:animated];
}

-(void)leftbtnClick{

    [self popViewControllerAnimated:YES];
}


//横竖屏控制
- (BOOL)shouldAutorotate{
    return self.topViewController.shouldAutorotate;
}
- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return self.topViewController.supportedInterfaceOrientations;
}

-(UIInterfaceOrientation)preferredInterfaceOrientationForPresentation{
    return self.topViewController.preferredInterfaceOrientationForPresentation;
}

@end
