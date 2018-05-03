//
//  DYBindLoginView.h
//  aikexue
//
//  Created by Ray on 2017/12/11.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>


typedef NS_ENUM(NSInteger,PhoneType) {
    PhoneTypeBind=0,
    PhoneTypePhoneLogin=1,
    PhoneTypeCountLogin=2,
    PhoneTypePassword=3,
};

typedef void(^completeCall)(void);

@interface DYBindLoginView : UIView <UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UIView *loginView;
@property (weak, nonatomic) IBOutlet UIView *bindView;
@property (weak, nonatomic) IBOutlet UITextField *countTF;
@property (weak, nonatomic) IBOutlet UITextField *passwordTF;
@property (weak, nonatomic) IBOutlet UITextField *phoneTF;
@property (weak, nonatomic) IBOutlet UITextField *codeTF;
@property (weak, nonatomic) IBOutlet UIButton *SecurityButton;
@property (weak, nonatomic) IBOutlet UIButton *comfireBtn;
@property (weak, nonatomic) IBOutlet UIButton *bindButton;
@property (weak, nonatomic) IBOutlet UIButton *loginButton;
@property (weak, nonatomic) IBOutlet UIView *sliderView;
@property (weak, nonatomic) IBOutlet UIButton *phoneCountExchangeBtn;
//类型
@property(nonatomic,assign) PhoneType type;
@property (nonatomic,copy)completeCall finish;

@property(nonatomic,assign) NSInteger countdown;
@property(nonatomic,strong) NSTimer* timer;
@property (nonatomic,copy)NSString *typeString;//


- (IBAction)getSecurityCode:(UIButton *)sender;
- (IBAction)loginClick:(UIButton *)sender;
- (IBAction)weixiClick:(UIButton *)sender;


+(instancetype)shareLoginView;

-(void)showTo:(UIView *)supView complete:(completeCall)finish;

@end
