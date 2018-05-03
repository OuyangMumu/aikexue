//
//  DYResetPasswordController.h
//  aikexue
//
//  Created by Ray on 2017/9/25.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYResetPasswordController : DYBaseViewController <UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UITextField *oldPW;
@property (weak, nonatomic) IBOutlet UITextField *resetPW;
@property (weak, nonatomic) IBOutlet UITextField *resetPW2;
@property (weak, nonatomic) IBOutlet UIButton *comfireBtn;
- (IBAction)resetPasswordClick:(UIButton *)sender;
@end
