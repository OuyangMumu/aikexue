//
//  DY_TableView.h
//  rcpi
//
//  Created by Dyang on 2017/1/22.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MJRefresh.h"
#import "DYListUITipView.h"

typedef void(^tipClick)(void);

@interface DY_TableView : UITableView

@property (nonatomic,assign)BOOL notFirst;//


@property (nonatomic, strong) DYListUITipView *tipView;

@property (nonatomic,copy) tipClick tipClickCall;


/**
 tableView 数据为空提示
 
 @param imageName  提示图片
 @param title 提示文字
 @param call 点击刷新  不需要刷新 传 nil
 */
-(void)addEmptyViewWithImageName:(NSString*)imageName title:(NSString*)title action:(tipClick)call;


/**
 tableView 数据为空提示
 
 @param imageName  提示图片
 @param title 提示文字
 @param call 点击刷新  不需要刷新 传 nil
 */
-(void)addEmptyViewWithImageName:(NSString*)imageName title:(NSString*)title buttonIcon:(NSString *)butIcon action:(tipClick)call;

/**
 tableView  网路异常默认提示
 
 @param imageName 网路异常提示图片名字
 @param title 网路异常提示文字
 @param call 点击刷新  不需要刷新 传 nil
 */
-(void)addNetWorkErrorWithImageName:(NSString*)imageName title:(NSString*)title buttonIcon:(NSString *)butIcon action:(tipClick)call;

@end
