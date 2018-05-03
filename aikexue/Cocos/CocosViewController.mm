//
//  CocosViewController.m
//  rcpi
//
//  Created by Centny on 11/05/2017.
//  Copyright © 2017 itdayang. All rights reserved.
//

#import "CocosViewController.h"

#import "cocos2d.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "manual/ScriptingCore.h"


static bool _running_x;

@interface CocosViewController ()

@property (nonatomic,assign)BOOL pushOther;//push出去

@end

@implementation CocosViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.wantsFullScreenLayout = YES;
    [self performSelector:@selector(start) withObject:nil afterDelay:0.5];
}


-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [GM_APP setRunning:YES];
    self.pushOther = NO;
    if (self.bg.superview) {
        [self.view bringSubviewToFront:self.bg];
    }

    [[UIApplication sharedApplication] setStatusBarHidden: YES];
    [self.navigationController setNavigationBarHidden:YES animated:YES];

    if([[UIDevice currentDevice]respondsToSelector:@selector(setOrientation:)]){
        SEL selector = NSSelectorFromString(@"setOrientation:");
        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice instanceMethodSignatureForSelector:selector]];
        [invocation setSelector:selector];
        [invocation setTarget:[UIDevice currentDevice]];
        int val = UIInterfaceOrientationLandscapeLeft;//横屏
        [invocation setArgument:&val atIndex:2];
        [invocation invoke];
    }
    
}


-(void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.pushOther = YES;
    [[UIApplication sharedApplication] setStatusBarHidden: NO];
    [self.navigationController setNavigationBarHidden:NO animated:YES];
    
        if([[UIDevice currentDevice]respondsToSelector:@selector(setOrientation:)]){
            SEL selector = NSSelectorFromString(@"setOrientation:");
            NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice instanceMethodSignatureForSelector:selector]];
            [invocation setSelector:selector];
            [invocation setTarget:[UIDevice currentDevice]];
            int val = UIInterfaceOrientationPortrait;//竖屏
            [invocation setArgument:&val atIndex:2];
            [invocation invoke];
        }
}


//
-(void)start{
    [GM_APP setGameKey:self.eid];
    cocos2d::Director* dir = cocos2d::Director::getInstance();
    if(dir && !dir->getOpenGLView()){
        CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [self.view bounds]
                                             pixelFormat: kEAGLColorFormatRGBA8
                                             depthFormat: GL_DEPTH24_STENCIL8_OES
                                      preserveBackbuffer: NO
                                              sharegroup: nil
                                           multiSampling: NO
                                         numberOfSamples: 0 ];
        [eaglView setMultipleTouchEnabled:YES];
        [self.view addSubview:eaglView];
        cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void*)eaglView);
        cocos2d::Director::getInstance()->setOpenGLView(glview);
    }
    cocos2d::Application::getInstance()->run();
    _running_x=true;
    [self performSelector:@selector(show) withObject:nil afterDelay:0.3];
}

-(void)show{
    [self.bg removeFromSuperview];
    NSNotification* notice = [NSNotification notificationWithName:N_COCOS_OPEN object:self.eid];
    [[NSNotificationCenter defaultCenter] postNotification:notice];
}

+(bool)dounzip:(NSString*)zip dir:(NSString*)dir{
    const char *dirzipchar = [dir UTF8String];
    const char *zippathchar = [zip UTF8String];
    return cocos2d::FileUtils::getInstance()->unzip(zippathchar, dirzipchar, "");
}


-(void)dealloc{

    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->cleanup();
    
    NSLog(@"CocosViewController delloc");
}

+(void)stop{

    cocos2d::Director* d=cocos2d::Director::getInstance();
    d->closeGame();
    
}

//横竖屏控制
- (BOOL)shouldAutorotate{
    
    return [GM_APP running];
    
}
- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscapeRight;
}

-(UIInterfaceOrientation)preferredInterfaceOrientationForPresentation{
    return UIInterfaceOrientationLandscapeRight;
}


//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden
{
    return YES;
}


@end
