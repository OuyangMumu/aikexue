//
//  DY_CollectionView.m
//  rcpi
//
//  Created by Ray on 2017/5/10.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "DY_CollectionView.h"


@interface DY_CollectionView()<ListUITipDelegate>

@property (nonatomic,assign) BOOL showEmptyView;//是否提示空数据
@property (nonatomic, copy) NSString *emptyTipString;     // 空提示文字
@property (nonatomic, copy) NSString *emptyTipImageName;  // 空提示图片
@property (nonatomic, copy) NSString *emptyTipButtonName;  // 按钮图片

@property (nonatomic,assign) BOOL showErrorView;//是否提示网络异常
@property (nonatomic, copy) NSString *errorTipString;     // 网络提示文字
@property (nonatomic, copy) NSString *errorTipImageName;  // 网络提示图片
@property (nonatomic, copy) NSString *errorTipButtonName;  // 按钮图片

@end

@implementation DY_CollectionView

-(void)reloadData{
    [super reloadData];
    [self.mj_footer endRefreshing];
    [self.mj_header endRefreshing];
    
    if (self.notFirst) {
        if (self.showEmptyView){// 显示空数据提示
            NSInteger count = 0;
            for (NSInteger i=0; i<[self numberOfSections]; i++) {
                count +=[self numberOfItemsInSection:i];
            }
            if (!count) {
                self.tipView.hidden = NO;
                
                [_tipView resetUI:self.emptyTipImageName and:self.emptyTipString and: self.emptyTipButtonName];
            }else{
                self.tipView.hidden = YES;
            }
        }
        
        if (!GM_NetWorkStatus && self.showErrorView) {//显示网络异常
            [_tipView resetUI:self.errorTipImageName and:self.errorTipString and: self.errorTipButtonName];
        }
    }else{
        self.notFirst = YES;
    }
    
}

-(DYListUITipView *)tipView{
    if (!_tipView) {
        CGRect frame = self.bounds;
        _tipView = [[DYListUITipView alloc] initWithFrame:frame];
        _tipView.tipDelegate = self;
        [self  addSubview:_tipView];
    }
    return _tipView;
}


-(void)addEmptyViewWithImageName:(NSString*)imageName title:(NSString*)title action:(tipClick)call
{
    
    [self addEmptyViewWithImageName:imageName title:imageName buttonIcon:nil action:call];
}


-(void)addEmptyViewWithImageName:(NSString*)imageName title:(NSString*)title buttonIcon:(NSString *)butIcon action:(tipClick)call{
    
    self.emptyTipString = title;
    self.emptyTipImageName = imageName;
    self.emptyTipButtonName = butIcon;
    self.showEmptyView = YES;
    self.tipClickCall = call;
    
}


-(void)addNetWorkErrorWithImageName:(NSString*)imageName title:(NSString*)title buttonIcon:(NSString *)butIcon action:(tipClick)call{
    
    self.errorTipString = title;
    self.errorTipImageName = imageName;
    self.errorTipButtonName = butIcon;
    self.showErrorView = YES;
    self.tipClickCall = call;
}



-(void)listUITipClick{
    if (self.tipClickCall) {
        self.tipView.hidden = YES;
        self.tipClickCall();
    }
}



@end
