//
//  DYChangeUserController.h
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "DYBindLoginView.h"


@interface DYChangeUserController : DYBaseViewController<UITextFieldDelegate>
@property (weak, nonatomic) IBOutlet UITextField *phoneTF;
@property (weak, nonatomic) IBOutlet UITextField *codeTF;
@property (weak, nonatomic) IBOutlet UIButton *SecurityButton;
@property (weak, nonatomic) IBOutlet UITextField *passwordTF;
@property (weak, nonatomic) IBOutlet UITextField *countTF;
@property (weak, nonatomic) IBOutlet UIButton *comfireBtn;
@property (weak, nonatomic) IBOutlet UIView *bindView;//绑定 View
@property (weak, nonatomic) IBOutlet UIView *loginView;//登录 View

@property (weak, nonatomic) IBOutlet UILabel *thirdLab;
@property (weak, nonatomic) IBOutlet UIView *thirdView;
@property (weak, nonatomic) IBOutlet UIButton *bindButton;
@property (weak, nonatomic) IBOutlet UIButton *loginButton;
@property (weak, nonatomic) IBOutlet UIView *sliderView;


@property (weak, nonatomic) IBOutlet UITextField *resetPW;
@property (weak, nonatomic) IBOutlet UITextField *resetPW2;
//类型
@property(nonatomic,assign) PhoneType type;


- (IBAction)getSecurityCode:(UIButton *)sender;
- (IBAction)loginClick:(UIButton *)sender;
- (IBAction)weixiClick:(UIButton *)sender;


@end
