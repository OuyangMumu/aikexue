//
//  DYFeedBackListCell.h
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYFeedBackModel.h"


typedef void(^cellClick)(NSInteger type);

@interface DYFeedBackListCell : UITableViewCell<UITableViewDataSource,UITableViewDelegate>
@property (weak, nonatomic) IBOutlet UITableView *mainTable;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *subTableH;


@property (weak, nonatomic) IBOutlet UIImageView *iconimage;

@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UILabel *contentLabel;
@property (weak, nonatomic) IBOutlet UIButton *delectButton;

@property (weak, nonatomic) IBOutlet UILabel *timeLabel;
@property (weak, nonatomic) IBOutlet UIButton *praiseButton;

@property (nonatomic,copy)cellClick cellCall;

@property (nonatomic,strong)DYFeedBackModel *model;

- (IBAction)praiseClick:(UIButton *)sender;
- (IBAction)delectClick:(UIButton *)sender;


@end
