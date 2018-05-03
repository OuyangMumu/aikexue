//
//  DYQualityGoodsController.h
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYQualityGoodsController : DYBaseViewController<UITabBarDelegate,UITableViewDataSource>
@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;

@end
