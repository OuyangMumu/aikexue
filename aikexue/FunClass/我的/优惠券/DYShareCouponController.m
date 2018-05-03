//
//  DYShareCouponController.m
//  aikexue
//
//  Created by Ray on 2017/10/31.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYShareCouponController.h"

@interface DYShareCouponController ()<WKScriptMessageHandler,WKNavigationDelegate,WKUIDelegate>

@end

@implementation DYShareCouponController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"分享优惠券";
    [self.view addSubview:self.webView];
    
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    [self.webView reload];
}



-(WKWebView *)webView{
    if (!_webView) {
        
        WKUserContentController *userContentController = [[WKUserContentController alloc] init];
        [userContentController addScriptMessageHandler:self name:@"mobileObj"];
        
        // WKWebView的配置
        WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
        configuration.userContentController = userContentController;
  
        _webView = [[WKWebView alloc]initWithFrame:self.view.bounds configuration:configuration];
        _webView.autoresizesSubviews = YES;
        _webView.UIDelegate = self;
        _webView.navigationDelegate = self;
        
        NSURLRequest *request = [NSURLRequest requestWithURL: [NSURL URLWithString:OYStringFormat(@"%@/share/page/invited?token=%@&cid=%@&uid=%@",SHARE_url,GM_User.userToken,self.cid,GM_User.userId)]];
        
        [_webView loadRequest:request];
    }
    return _webView;
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message{
    NSLog(@"方法名:%@", message.name);
    NSLog(@"参数:%@", message.body);

    OYWeakObj(self)
    if (!IsNilOrNull(message.body[@"obj"][@"shareUrl"])) {
       
        //显示分享面板
        [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_WechatTimeLine),@(UMSocialPlatformType_WechatSession),@(UMSocialPlatformType_Sina),@(UMSocialPlatformType_QQ)]];
        [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
            // 根据获取的platformType确定所选平台进行下一步操作
            [weakself shareTextToPlatformType:platformType info:message.body[@"obj"][@"shareUrl"]];
        }];
    }
    
}


-(void)shareTextToPlatformType:(UMSocialPlatformType)platformType info:(id)info{
    //创建分享消息对象
    UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
    UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:info[@"title"] descr:info[@"des"] thumImage:[UIImage imageNamed:@"分享图片"]];
    
    //设置文本 
    shareObject.webpageUrl =info[@"url"];
    messageObject.shareObject = shareObject;
    //调用分享接口
    [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:self completion:^(id data, NSError *error) {
        if (error) {
            NSLog(@"************Share fail with error %@*********",error);
        }else{
            NSLog(@"response data is %@",data);
        }
    }];
}


-(WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures{
    if (!navigationAction.targetFrame.isMainFrame) {
        [webView loadRequest:navigationAction.request];
    }
    return nil;
}



- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation{
}

- (void)webView:(WKWebView *)webView a:(null_unspecified WKNavigation *)navigation{

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

}


@end
