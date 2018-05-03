//
//  DYChildTeacherVC.m
//  aikexue
//
//  Created by Ray on 2017/9/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYChildTeacherVC.h"
#import <WebKit/WebKit.h>

@interface DYChildTeacherVC ()<WKUIDelegate,WKNavigationDelegate>

@property(strong,nonatomic)WKWebView *webView;
@property (strong, nonatomic)  UIView *loading;


@end

@implementation DYChildTeacherVC

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"详情";
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
        
        // 设置访问的URL
//        NSURL * url = [NSURL URLWithString:[self.url stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLFragmentAllowedCharacterSet]]];
        // 根据URL创建请求
        NSURLRequest *request = [NSURLRequest requestWithURL: [NSURL URLWithString:self.url]];
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

- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView{
    NSLog(@"webViewWebContentProcessDidTerminate");
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
