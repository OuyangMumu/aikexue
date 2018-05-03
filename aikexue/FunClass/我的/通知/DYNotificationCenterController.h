//
//  DYNotificationCenterController.h
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "DYUserCouponController.h"
#import "DY_TableView.h"
#import "DYUserNotifiModel.h"

@interface DYNotificationCenterController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource>
@property (weak, nonatomic) IBOutlet  DY_TableView *mainTable;
+(void)markReaded:(NSMutableArray*)items;
@end

