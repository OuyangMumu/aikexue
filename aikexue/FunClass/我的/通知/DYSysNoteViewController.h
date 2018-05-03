//
//  DYSysNoteViewController.h
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYUserNotifiModel.h"
@interface DYSysNoteViewController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource>

@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;
@property(nonatomic)int type;//显示的标题名字，用来标记 “实验通知”   “系统通知”
-(void)refreshClick:(UIButton *)sender;
@end
