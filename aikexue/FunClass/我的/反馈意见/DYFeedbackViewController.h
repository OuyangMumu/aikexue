//
//  DYFeedbackViewController.h
//  aikexue
//
//  Created by Ray on 2017/8/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "OY_LimitTextView.h"

@interface DYFeedbackViewController : DYBaseViewController<UIAlertViewDelegate>
@property (weak, nonatomic) IBOutlet OY_LimitTextView *input;
@property (weak, nonatomic) IBOutlet UITextField *phone;
@property (weak, nonatomic) IBOutlet UITextField *qq;
@property (weak, nonatomic) IBOutlet UITextField *weixin;
-(IBAction)onClickConfirm:(id)sender;
@end
