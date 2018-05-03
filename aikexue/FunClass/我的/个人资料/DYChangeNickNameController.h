//
//  DYChangeNickNameController.h
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYChangeNickNameController : DYBaseViewController
@property (weak, nonatomic) IBOutlet UIView *contentView;

@property (weak, nonatomic) IBOutlet UITextField *nickNameTF;
- (IBAction)comfireClick:(UIButton *)sender;
@end
