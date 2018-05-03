//
//  DYBaseTabBarController.m
//  aikexue
//
//  Created by Ray on 2017/9/28.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseTabBarController.h"

@interface DYBaseTabBarController ()

@end

@implementation DYBaseTabBarController

- (void)viewDidLoad {
    [super viewDidLoad];

}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:YES];
}


- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:YES];
}


@end
