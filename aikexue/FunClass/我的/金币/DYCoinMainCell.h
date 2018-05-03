//
//  DYCoinMainCell.h
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^cellClick)(void);

@interface DYCoinMainCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UILabel *subTitleLab;
@property (weak, nonatomic) IBOutlet UIButton *getButton;
@property (nonatomic,copy)cellClick cellCall;
@property (weak, nonatomic) IBOutlet UIButton *coinButton;
@property (weak, nonatomic) IBOutlet UILabel *countLabel;

- (IBAction)getClick:(UIButton *)sender;
@end
