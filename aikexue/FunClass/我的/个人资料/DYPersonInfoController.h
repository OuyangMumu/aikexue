//
//  DYPersonInfoController.h
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYPersonInfoController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource>
@property (weak, nonatomic) IBOutlet UITableView *mainTable;


@end
