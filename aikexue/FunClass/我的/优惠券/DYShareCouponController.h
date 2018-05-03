//
//  DYShareCouponController.h
//  aikexue
//
//  Created by Ray on 2017/10/31.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import <WebKit/WebKit.h>

@interface DYShareCouponController : DYBaseViewController

@property(strong,nonatomic)WKWebView *webView;

@property (nonatomic,copy)NSString *cid;

@end
