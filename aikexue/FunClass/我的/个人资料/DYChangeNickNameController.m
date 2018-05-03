//
//  DYChangeNickNameController.m
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYChangeNickNameController.h"

@interface DYChangeNickNameController ()

@end

@implementation DYChangeNickNameController

- (void)viewDidLoad {
    [super viewDidLoad];
    //
    
    [self buildUI];
}

-(void)buildUI{
    self.navigationItem.title = @"个人昵称";
    self.nickNameTF.text = GM_User.userName;
}

- (IBAction)comfireClick:(UIButton *)sender {
    
    
}
@end
