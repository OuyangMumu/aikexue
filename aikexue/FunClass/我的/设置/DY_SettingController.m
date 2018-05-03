//
//  DY_SettingController.m
//  aikexue
//
//  Created by Ray on 2017/12/5.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DY_SettingController.h"
#import "DY_SettingCell.h"
#import "DYSafeViewController.h"
#import "DYAboutAKXController.h"

@interface DY_SettingController ()<UITableViewDataSource,UITableViewDelegate>

@property (nonatomic,strong)UITableView *mainTable;
@property (nonatomic,strong)NSArray *titleArray;


@property (nonatomic,strong)UISegmentedControl *segment;
@property (nonatomic,strong)UIView *foodView;
@property (nonatomic,strong)UIView *hiddenView;
@end

@implementation DY_SettingController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title  = @"设置";
    [self.view addSubview:self.mainTable];
    
    
    [self setUpSeverParameter];
    //切换服务器手势
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(openServerBtn)];
    tap.numberOfTapsRequired = 8;
    [self.foodView addGestureRecognizer:tap];

}



-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return  self.titleArray.count;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 44;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    DY_SettingCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DY_SettingCell"];

    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.title.text = self.titleArray[indexPath.row];
    cell.arrow.hidden = NO;
    cell.subTitle.text = @"";
    cell.switchOn.hidden = YES;
    
    if([self.titleArray[indexPath.row] isEqualToString:@"清除缓存"]){
        cell.arrow.hidden = YES;
        cell.subTitle.text = [NSString stringWithFormat:@"%@/res/extra",UnZipPath].fileSize;
    }

    if([self.titleArray[indexPath.row] isEqualToString:@"仅 WIFI 下载"]){
        cell.arrow.hidden = YES;
        cell.switchOn.hidden = NO;
        cell.switchOn.on = GM_User.wifiOnly;
    }
    

    return cell;
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    NSString *title = self.titleArray[indexPath.row];
    
    if ([title isEqualToString:@"账号安全"]) {
        DYSafeViewController *VC = [DYSafeViewController  new];
        [self.navCtl pushViewController:VC animated:YES];
    }else if ([title isEqualToString:@"仅 WIFI 下载"]) {


    }else if ([title isEqualToString:@"清除缓存"]) {
        
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"支付清除缓存" message:@"清除后,再次打开游戏需重新下载!" preferredStyle:UIAlertControllerStyleAlert];
        
        UIAlertAction *sure  = [UIAlertAction actionWithTitle:@"清除" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
            [[Downloader shared]clearDowned:^{
                [tableView reloadData];
            }];
        }];
        
        UIAlertAction *cancel  = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        
        [alertController addAction:sure];
        [alertController addAction:cancel];
        
        [self presentViewController:alertController animated:YES completion:nil];
  
    }else if ([title isEqualToString:@"关于爱科学"]) {
        DYAboutAKXController *VC = [DYAboutAKXController  new];
        [self.navCtl pushViewController:VC animated:YES];
    }
}


//APP初始化的服务器配置
-(void)setUpSeverParameter{
    
    NSInteger switchIndex = APP_Version ;
    if ([[NSUserDefaults standardUserDefaults] valueForKey:@"SWITCH"]) {
        switchIndex  = [[[NSUserDefaults standardUserDefaults] valueForKey:@"SWITCH"] integerValue];
    }
    self.segment.selectedSegmentIndex = switchIndex;
}


-(void)openServerBtn{
    self.hiddenView.hidden = NO;
}


- (void)changeServer:(UISegmentedControl *)sender {
    
    //抹掉旧用户信息
    [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginToken];
    [[NSUserDefaults standardUserDefaults]removeObjectForKey:loginTokenAuto];
    
    switch (sender.selectedSegmentIndex) {
        case 0:
            //dev
        {
            [[NSUserDefaults standardUserDefaults] setObject:@0 forKey:@"SWITCH"];
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"dev"];
            [[NSUserDefaults standardUserDefaults] synchronize];
        }
            
            break;
            
        case 1:
            //chk
        {
            [[NSUserDefaults standardUserDefaults] setObject:@1 forKey:@"SWITCH"];
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"chk"];
            [[NSUserDefaults standardUserDefaults] synchronize];
        }
            
            break;
            
        case 2:
        {
            //chk2
            [[NSUserDefaults standardUserDefaults] setObject:@2 forKey:@"SWITCH"];
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"chk2"];
            [[NSUserDefaults standardUserDefaults] synchronize];
        }
            break;
        case 3:
        {
            //================ ser kuxiao
            [[NSUserDefaults standardUserDefaults] setObject:@3 forKey:@"SWITCH"];
            [[ServeUrlModel sharedServeUrlModel]setSelfWith:@"kuxiao"];
            [[NSUserDefaults standardUserDefaults] synchronize];
        }
            break;
            
        default:
            
            break;
    }
    
    //申请游客
    [GM_User loadAutoUser:nil];
}


-(UIView *)foodView{
    if (!_foodView) {
        _foodView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 250)];
        
        self.hiddenView = [[UIView alloc]initWithFrame:_foodView.bounds];
        self.hiddenView.hidden = YES;
        
        //服务器切换
        self.segment   = [[UISegmentedControl alloc]initWithItems:@[@"dev",@"chk",@"chk2",@"kuxiao"]];
        self.segment.frame =  CGRectMake(20, 40, GM_SCREEN_S.width-40, 30);
        [self.segment addTarget:self action:@selector(changeServer:) forControlEvents:UIControlEventValueChanged];
        
        
        //附加信息
        UILabel *tipLab = [[UILabel alloc]initWithFrame:CGRectMake(0, CGRectGetMaxY(self.segment.frame), GM_SCREEN_S.width, 250 - CGRectGetMaxY(self.segment.frame))];
        tipLab.numberOfLines = 0;
        tipLab.font = [UIFont systemFontOfSize:13];
        tipLab.textColor = [UIColor blackColor];
        
        
        NSString* registrationID=[Utils loadRid];
        BOOL  iResCode  =  [[NSUserDefaults standardUserDefaults]boolForKey:@"iResCode"];
        NSString *Rescode = @"NO";
        if (iResCode) {
            Rescode = @"YES";
        }
        tipLab.text = [NSString stringWithFormat:@"pushID = %@  tag success %@",registrationID,Rescode];
        
        [self.hiddenView addSubview:tipLab];
        [self.hiddenView addSubview:self.segment];
        
        [_foodView addSubview:self.hiddenView];
    }
    return  _foodView;
}






#pragma  marks ===== 属性加载  =====

-(UITableView *)mainTable{
    if (!_mainTable) {
        _mainTable = [[UITableView alloc]initWithFrame:CGRectMake(0, OYNavBarHeight, GM_SCREEN_S.width, GM_SCREEN_S.height-OYNavBarHeight) style:UITableViewStylePlain];
        _mainTable.delegate = self;
        _mainTable.dataSource = self;
        _mainTable.scrollEnabled =  NO;
        _mainTable.tableFooterView = self.foodView;
        self.scrollView = _mainTable;
        _mainTable.separatorStyle = UITableViewCellSeparatorStyleNone;
        _mainTable.backgroundColor = [UIColor groupTableViewBackgroundColor];
        [_mainTable registerNib:[UINib nibWithNibName:@"DY_SettingCell" bundle:nil] forCellReuseIdentifier:@"DY_SettingCell"];

    }
    
    return _mainTable;
}
-(NSArray *)titleArray{
    if (!_titleArray) {
        _titleArray = @[@"账号安全",@"仅 WIFI 下载",@"清除缓存",@"关于爱科学"];
    }
    return  _titleArray;
}


@end
