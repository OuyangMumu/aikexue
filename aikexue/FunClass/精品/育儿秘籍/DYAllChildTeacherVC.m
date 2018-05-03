//
//  DYAllChildTeacherVC.m
//  aikexue
//
//  Created by Ray on 2017/9/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYAllChildTeacherVC.h"
#import <WebKit/WebKit.h>

@interface DYAllChildTeacherVC ()<WKUIDelegate,WKNavigationDelegate>

@property(strong,nonatomic)WKWebView *webView;
@property (strong, nonatomic)  UIView *loading;
@end

@implementation DYAllChildTeacherVC


- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"育儿秘籍";
    [self.view addSubview:self.webView];
    [self.view bringSubviewToFront:self.loading];

}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
    if (self.url.length == 0) {
        self.loading.hidden =   NO;
    }
    
}


-(WKWebView *)webView{

    if (!_webView) {
        WKWebViewConfiguration *config = [WKWebViewConfiguration new];
        _webView = [[WKWebView alloc]initWithFrame:self.view.bounds configuration:config];
        _webView.autoresizesSubviews = YES;
        _webView.UIDelegate = self;
        _webView.navigationDelegate = self;

       [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:self.url]]];
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
    }
    return _loading;
}

-(WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures
{
    if (!navigationAction.targetFrame.isMainFrame) {
        [webView loadRequest:navigationAction.request];
    }
    return nil;
}

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation{
    
    
}
- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(null_unspecified WKNavigation *)navigation{

    
}
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error{
    
}
- (void)webView:(WKWebView *)webView didCommitNavigation:(null_unspecified WKNavigation *)navigatio{
    
}
- (void)webView:(WKWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation{
}

- (void)webView:(WKWebView *)webView didFailNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error{
    
    self.loading.hidden = NO;
    
}

@end
