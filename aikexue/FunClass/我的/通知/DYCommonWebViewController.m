//
//  DYCommonWebViewController.m
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYCommonWebViewController.h"

@interface DYCommonWebViewController ()<WKUIDelegate,WKNavigationDelegate>

@end

@implementation DYCommonWebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = self.model.contentTitle;
    
    if(self.model.redirectURL==nil||[self.model.redirectURL isEqualToString:@""]){
        self.model.redirectURL=@"http://www.aikexue.com/";
    }
    
    [self.view addSubview:self.webView];
    [self.view bringSubviewToFront:self.loading];
  
  
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];

}


-(WKWebView *)webView{

    if (!_webView) {
        
        WKWebViewConfiguration *config = [WKWebViewConfiguration new];
        
        _webView = [[WKWebView alloc]initWithFrame:self.view.bounds configuration:config];
        _webView.autoresizesSubviews = YES;
   
        _webView.UIDelegate = self;
        _webView.navigationDelegate = self;

        // 设置访问的URL
        NSURL * url = [NSURL URLWithString:self.model.redirectURL];
        // 根据URL创建请求
        NSURLRequest *request = [NSURLRequest requestWithURL:url];
        // WKWebView加载请求
        [_webView loadRequest:request];
    }
    
    return _webView;
}


-(UIView *)loading{

    if (!_loading) {
        _loading  = [[UIView alloc]initWithFrame:self.view.bounds];
        
        UIImageView *imgV= [[UIImageView alloc]initWithImage:OYGetImage(@"搜索失败")];
        imgV.center = _loading.center;
        imgV.size = OYGetImage(@"搜索失败").size;
        
        [_loading addSubview:imgV];
        _loading.hidden = YES;
    }
    
    return _loading;
}


- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation{

    
}
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(null_unspecified WKNavigation *)navigation{

    
}
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error{
    [MBProgressHUD hideHUDForView:webView animated:YES];

}
- (void)webView:(WKWebView *)webView didCommitNavigation:(null_unspecified WKNavigation *)navigatio{

}
- (void)webView:(WKWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation{

}

- (void)webView:(WKWebView *)webView didFailNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error{

    self.loading.hidden = NO;

}

@end
