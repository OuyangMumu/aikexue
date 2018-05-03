//
//  DYExperimentDetaileVC.h
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYExperimentDetaileVC : DYBaseViewController
@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;
@property (nonatomic,strong)DYExperimentModel *model;
@end
