//
//  DY_RechargeCell.h
//  rcpi
//
//  Created by Ray on 2017/6/19.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import <UIKit/UIKit.h>


typedef void(^lessOrAddCall)(UIButton *);

@interface DY_RechargeCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *priceLab;

@property (weak, nonatomic) IBOutlet UIButton *payButton;

@property (nonatomic,copy)lessOrAddCall cellCall;//

- (IBAction)payButtonClick:(UIButton *)sender;


@end
