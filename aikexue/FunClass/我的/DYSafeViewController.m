//
//  DYSafeViewController.m
//  aikexue
//
//  Created by Ray on 2017/9/25.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYSafeViewController.h"
#import "ThirdtyTool.h"
#import "DYResetPasswordController.h"

@interface DYSafeViewController ()<UITableViewDelegate,UITableViewDataSource>

@property (nonatomic,strong)NSArray *rowTitles;

@property (nonatomic,strong)UIButton *logoutButton;


@end

@implementation DYSafeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"账号安全";

}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    [self.mainTable reloadData];
    
}

#pragma mark==========UITableViewDataSource==========


-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 2;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if (section==0) {
        if ( GM_User.isLogin) {
            return self.rowTitles.count;
        }
    }
    return 1;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    return 44;
}

-(CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
    
    return 10;
    
}
-(CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    
    return 10;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"UITableViewCell"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    if (!cell) {
        cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:@"UITableViewCell"];
    }
    [self.logoutButton removeFromSuperview];
    
    if (indexPath.section == 0) {
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
        cell.textLabel.text = self.rowTitles[indexPath.row];
        cell.detailTextLabel.font = [UIFont systemFontOfSize:13];
        
        switch (indexPath.row) {
            case 0:
            {
                if (GM_User.privated.phone) {
                    cell.detailTextLabel.text = GM_User.privated.phone;
                }else{
                    cell.detailTextLabel.text = @"未绑定";
                }
            }
                break;
                
            case 10:
            {
                if (GM_User.privated.unionId) {
                    cell.detailTextLabel.text = @"解绑";
                }else{
                    cell.detailTextLabel.text = @"未绑定";
                }
            }
                break;
                
            case 1:
                
                break;
                
            default:
                break;
        }
    }else{
        cell.accessoryType = UITableViewCellAccessoryNone;
        
        if (!self.logoutButton.superview) {
            [cell.contentView addSubview:self.logoutButton];
        }
        
        self.logoutButton.selected = GM_User.isLogin;
        
    }
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    if (indexPath.section==0) {
        
        switch (indexPath.row) {
            case 0:
            {
                if (GM_User.privated.phone.length>0) {
                    [Utils alert:@"已绑定" msg:@"你已绑定手机,不需要再绑定"];
                    return;
                }
 
                OYWeakObj(self)
                [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
                    [weakself.mainTable reloadData];
                }];
            }
                break;
                
            case 10:
            {
                OYWeakObj(self)
                if (GM_User.privated.unionId) {
                    
                    UIAlertController *alert =  [UIAlertController alertControllerWithTitle:@"解绑微信" message:@"确定解除绑定微信吗?" preferredStyle: UIAlertControllerStyleAlert];
                    
                    UIAlertAction *sure = [UIAlertAction actionWithTitle:@"是" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                        
                        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
                        [[ThirdtyTool sharedTool] onClickUnBind:^(BOOL success, id obj) {
                            [MBProgressHUD hideHUDForView:weakself.view animated:YES];
                            if (success) {
                                GM_User.privated.unionId = nil;
                                [weakself.mainTable reloadData];
                            }else{
                                if (obj) {
                                    [MBProgressHUD showTipMessageInWindow:[NSString stringWithFormat:@"%@",obj[@"msg"]]];
                                }else{
                                    [MBProgressHUD showTipMessageInWindow:DYTipMessageNetErr];
                                }
                            }
                        } controller:weakself];
                        
                    }];
                    
                    UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"否" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                        
                    }];
                    
                    [alert addAction:sure];
                    [alert addAction:cancel];
                    [self.navCtl presentViewController:alert animated:YES completion:nil];
                    
                }else{
                    
                    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
                    [[ThirdtyTool sharedTool] onClickWXLogin:^(BOOL success , id obj) {
                        
                        [MBProgressHUD hideHUDForView:weakself.view animated:YES];
                        if (success) {
                            [MBProgressHUD showTipMessageInWindow:@"绑定成功"];
                            [weakself.mainTable reloadData];
                        }
                    } controller:self login:@"bind"];
                }
            }
                break;
                
            case 1:
            {
                if (GM_User.isLogin) {
                    DYResetPasswordController *VC = [DYResetPasswordController new];
                    [self.navCtl pushViewController:VC animated:YES];
                }else{
                    [MBProgressHUD showTipMessageInWindow:@"您还未登录,无法修改密码!"];
                }
            }
                break;
            default:
                break;
        }
    }
}


-(void)loginButtonClick:(UIButton *)sender{
    
    OYWeakObj(self);
    if (GM_User.isLogin) {
        
        UIAlertController *alertCtl = [UIAlertController alertControllerWithTitle:@"是否退出账号" message:nil preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *sure = [UIAlertAction actionWithTitle:@"退出" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
            [MBProgressHUD showActivityMessageInWindow:@""];
            //申请游客
            [GM_User loadAutoUser:^(BOOL success, id data) {
                
                [MBProgressHUD hideHUDFromView:[GM_APP window]];
                if (success) {
                    [weakself.mainTable reloadData];
                    [weakself.navCtl popViewControllerAnimated:YES];
                }
            }];
        }];
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        [alertCtl addAction:sure];
        [alertCtl addAction:cancel];
        
        [self presentViewController:alertCtl animated:YES completion:nil];
        
    }else{
//        DYChangeUserController *VC = [DYChangeUserController new];
//        VC.type = PhoneTypeCountLogin;
//        [self.navCtl pushViewController:VC animated:YES];
        
        OYWeakObj(self)
        [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
            [weakself.mainTable reloadData];
        }];
    }
}


-(void)didResetPassword:(NSString *)account password:(NSString *)password{
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/sso/api/login?source=IOS&usr=%@&pwd=%@&selector=basic,privated",SSO_SRV,account,password) params:nil success:^(id response) {
        int code=[[response valueForKey:@"code"]intValue];
        switch (code) {
            case 0:{
                
                [GM_User loginSuccess:response];
                
                [weakself.mainTable reloadData];
            }
                break;
                
            default:
                
                break;
        }
        
    } fail:^(NSError *error) {
        [Utils alert:@"登录失败" msg:DYTipMessageNetErr];
    } showHUD:self.view];
    
}

#pragma mark =============懒加载===================

-(NSArray *)rowTitles{
    
    if (!_rowTitles) {
        _rowTitles = @[@"手机号码",@"修改密码"];
    }
    return  _rowTitles;
}

-(UIButton *)logoutButton{
    if (!_logoutButton) {
        _logoutButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [_logoutButton setTitle:@"退出登录" forState:UIControlStateSelected];
        [_logoutButton setTitle:@"登录" forState:UIControlStateNormal];
        _logoutButton.highlighted = NO;
        _logoutButton.reversesTitleShadowWhenHighlighted = NO;
        
        if (GM_User.isLogin) {
            _logoutButton.selected = YES;
        }else{
            _logoutButton.selected = NO;
        }
        
        [_logoutButton  addTarget:self action:@selector(loginButtonClick:) forControlEvents:UIControlEventTouchUpInside];
        
        [_logoutButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        
        _logoutButton.frame = CGRectMake(0, 0, GM_SCREEN_S.width, 44);
        
    }
    return _logoutButton;
}

@end

