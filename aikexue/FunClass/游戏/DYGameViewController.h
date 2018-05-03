//
//  DYGameViewController.h
//  aikexue
//
//  Created by Ray on 2017/9/6.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"


@interface DYGameViewController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource>
@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;

@property (nonatomic,assign)BOOL isPushLoad;

@end
