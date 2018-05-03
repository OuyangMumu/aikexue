//
//  DYCommonWebViewController.h
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "DYUserNotifiModel.h"

@interface DYCommonWebViewController : DYBaseViewController
@property(nonatomic)DYUserNotifiModel *model;

@property (strong, nonatomic)  UIView *loading;
@property (nonatomic,strong) WKWebView  *webView;
@end
