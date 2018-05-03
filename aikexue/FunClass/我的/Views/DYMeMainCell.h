//
//  DYMeMainCell.h
//  aikexue
//
//  Created by Ray on 2017/7/31.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^cellBlock)(UISwitch *);

@interface DYMeMainCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UIImageView *icon;
@property (weak, nonatomic) IBOutlet UIImageView *redTip;
@property (weak, nonatomic) IBOutlet UILabel *title;
@property (weak, nonatomic) IBOutlet UIImageView *arrow;
@property (weak, nonatomic) IBOutlet UILabel *subTitle;
@property (weak, nonatomic) IBOutlet UISwitch *switchOn;

@property (nonatomic,copy)cellBlock cellCall;//

- (IBAction)switchClick:(UISwitch *)sender;

@end
