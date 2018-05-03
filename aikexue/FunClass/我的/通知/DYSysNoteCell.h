//
//  DYSysNoteCell.h
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYUserNotifiModel.h"

@interface DYSysNoteCell : UITableViewCell
@property(nonatomic) IBOutlet UIImageView* img;
@property(nonatomic) IBOutlet UILabel* title;
@property(nonatomic) IBOutlet UILabel* desc;
@property(nonatomic) IBOutlet UILabel* time;
@property(nonatomic) IBOutlet UILabel* gotoDetail;

@property (nonatomic,strong)DYUserNotifiModel *model;

@end
