//
//  DYBabyInfoController.m
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBabyInfoController.h"
#import "DYBabyTipView.h"

@interface DYBabyInfoController ()
@property(nonatomic,strong)DYBabyTipView *tipView;
@property (nonatomic,strong)UIButton *rightBtn;
@property (nonatomic,strong)NSMutableDictionary *infoDictionary;
@property (nonatomic,strong)NSMutableDictionary *oldInfoDictionary;

@end

@implementation DYBabyInfoController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"宝宝资料";

    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithCustomView:self.rightBtn];
    
    [self.saveButton setBackgroundImage:[UIImage imageWithColor:[UIColor darkGrayColor]] forState:UIControlStateDisabled];
    
    [self.saveButton setBackgroundImage:[UIImage imageWithColor:NAV_BAR_COLOR] forState:UIControlStateNormal];
    OYViewBorderRadius(self.nameBoderButton, 2, 1, [UIColor lightGrayColor])
    self.datePickerView.maximumDate = [NSDate date];
    
    if ([[DYCoinPersonInfo sharedCoin].gender isEqualToString:@"BOY"]){
        self.boySelectBtn.selected = YES;
        self.oldInfoDictionary[@"gender"] = @"BOY";
    }else if ([[DYCoinPersonInfo sharedCoin].gender isEqualToString:@"GIRL"]){
        self.girlSelectBtn.selected = YES;
        self.oldInfoDictionary[@"gender"] = @"GIRL";
    }else{
        self.boySelectBtn.selected = YES;
        self.oldInfoDictionary[@"gender"] = @"BOY";
    }
    
    NSDate *date = [NSDate new];
    if ([[DYCoinPersonInfo sharedCoin].birthday doubleValue]>0){
        date = [NSDate dateWithTimeIntervalSince1970:[[DYCoinPersonInfo sharedCoin].birthday doubleValue]/1000];
        self.oldInfoDictionary[@"birthday"] = [DYCoinPersonInfo sharedCoin].birthday;
    }else{
        date = [NSDate dateWithTimeIntervalSince1970:1262275200];
        self.oldInfoDictionary[@"birthday"] = @(1262275200000);
    }

    self.datePickerView.date = date;
    
    if ([DYCoinPersonInfo sharedCoin].babyName.length>0) {
        self.oldInfoDictionary[@"babyName"] = [DYCoinPersonInfo sharedCoin].babyName;
    }else{
        self.oldInfoDictionary[@"babyName"] = @"";
    }
    
    self.nameLabel.text = [DYCoinPersonInfo sharedCoin].babyName;

    
    self.infoDictionary = [NSMutableDictionary dictionaryWithDictionary:self.oldInfoDictionary];
}


- (IBAction)sexSelectClick:(UIButton *)sender {
    self.boySelectBtn.selected = self.girlSelectBtn.selected = NO;

    sender.selected = YES;
    self.infoDictionary[@"gender"] = sender.tag-10?@"GIRL":@"BOY";
    [self hasChangeInfo];
}

-(void)hasChangeInfo{
    self.saveButton.enabled = NO;
    if (![self.infoDictionary[@"gender"] isEqualToString:self.oldInfoDictionary[@"gender"]]) {
        self.saveButton.enabled = YES;
    }else if (![self.infoDictionary[@"babyName"] isEqualToString:self.oldInfoDictionary[@"babyName"]] ) {
        self.saveButton.enabled = YES;
        
    }else if (![self.infoDictionary[@"birthday"] isEqualToValue:self.oldInfoDictionary[@"birthday"]]) {
        self.saveButton.enabled = YES;
       
    }
    
    if ([self.infoDictionary[@"babyName"] isEqualToString:@""]) {
        self.saveButton.enabled = NO;
    }
    
    if ([self.infoDictionary[@"babyName"] isEmpty]) {
        self.saveButton.enabled = NO;
    }
    
    if ([self.infoDictionary[@"birthday"] longLongValue] < 86400000) {
        self.saveButton.enabled = NO;
    }
}



- (IBAction)selectBirthday:(UIButton *)sender {
    
    if (sender.tag==1) {
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"修改昵称" message:nil preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        OYWeakObj(self)
        UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [alert  dismissViewControllerAnimated:YES completion:nil];
            UITextField *editTextField = alert.textFields[0];
            weakself.nameLabel.text = editTextField.text;
            
            [weakself.infoDictionary setValue:editTextField.text forKey:@"babyName"];
            [weakself hasChangeInfo];
            
        }];
        
        
        [alert addAction:cancel];
        [alert addAction:defaultAction];
        [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(textFieldEditChanged:) name:UITextFieldTextDidChangeNotification object:nil];
            textField.placeholder = @"请输入新昵称!";
            textField.text = weakself.nameLabel.text;
        }];
        [self presentViewController:alert animated:YES completion:nil];
        
        
    }else{
        self.tipView.showDatePick = YES;
        [self.tipView show];
    }
}

-(void)textFieldEditChanged:(NSNotification *)obj{
    
    UITextField *textField = (UITextField *)obj.object;
    NSString *toBeString = textField.text;
    NSLog(@"toBeString.length = %ld",toBeString.length);
    
    //获取高亮部分
    UITextRange *selectedRange = [textField markedTextRange];
    UITextPosition *position = [textField positionFromPosition:selectedRange.start offset:0];
    
    // 没有高亮选择的字，则对已输入的文字进行字数统计和限制
    if (!position)
    {
        
        if (toBeString.length > 12)
        {
            [MBProgressHUD showTipMessageInWindow:@"昵称字数限制在12字内"];
            NSRange rangeIndex = [toBeString rangeOfComposedCharacterSequenceAtIndex:12];
            if (rangeIndex.length == 1)
            {
                textField.text = [toBeString substringToIndex:12];
            }
            else
            {
                NSRange rangeRange = [toBeString rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, 12)];
                textField.text = [toBeString substringWithRange:rangeRange];
            }
        }
    }
}

-(void)passClick{
    self.tipView.showDatePick = NO;
    [self.tipView show];
}

- (IBAction)saveClick:(UIButton *)sender {
    
    self.infoDictionary[@"token"] = GM_User.userToken;
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/saveBabyInfo",MAIN_SRV) params:self.infoDictionary success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            [MBProgressHUD showTipMessageInWindow:@"提交成功"];
            weakself.saveButton.enabled = NO;
            
            [DYCoinPersonInfo sharedCoin].babyName = weakself.infoDictionary[@"babyName"];
            [DYCoinPersonInfo sharedCoin].gender = weakself.infoDictionary[@"gender"];
            [DYCoinPersonInfo sharedCoin].birthday = weakself.infoDictionary[@"birthday"];

            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [weakself.navCtl popViewControllerAnimated:YES];
            });
        }else{
            [MBProgressHUD showTipMessageInWindow:@"提交失败,请稍后再试"];
        }
    } fail:^(NSError *error) {
            [MBProgressHUD showTipMessageInWindow:@"网络异常,请稍后再试"];
    } showHUD:self.view];
}


-(DYBabyTipView *)tipView{
    if(!_tipView){
        _tipView = [DYBabyTipView loadFromNib];
        OYWeakObj(self)
        [_tipView setDateCall:^(NSDate *date) {
            if (date) {
                
                [weakself hasChangeInfo];
                weakself.infoDictionary[@"birthday"] = @([date timeIntervalSince1970]*1000);
                NSDateFormatter  *formatter = [[NSDateFormatter alloc] init];
                formatter.dateFormat = @"yyyy-MM-dd";
            }else{
                [weakself.navCtl popViewControllerAnimated:YES];
            }
        }];
    }
    return _tipView;
}

- (IBAction)datePickerDidChanged:(UIDatePicker *)sender {
    self.infoDictionary[@"birthday"] = @([sender.date timeIntervalSince1970]*1000);
    
     [self hasChangeInfo];
}

-(UIButton *)rightBtn{
    
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_rightBtn setTitle:@"跳过" forState:UIControlStateNormal];
        [_rightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _rightBtn.titleLabel.font = OYSysFont(15);
        _rightBtn.frame = CGRectMake(0, 0, 100, 44);
        _rightBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
        [_rightBtn addTarget:self action:@selector(passClick) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}

-(NSMutableDictionary *)infoDictionary{
    if (!_infoDictionary) {
        _infoDictionary = [NSMutableDictionary new];
    }
    return _infoDictionary;
}

-(NSMutableDictionary *)oldInfoDictionary{
    if (!_oldInfoDictionary) {
        _oldInfoDictionary = [NSMutableDictionary new];
    }
    return _oldInfoDictionary;
}

@end



















