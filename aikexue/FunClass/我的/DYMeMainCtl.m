//
//  DYMeMainCtl.m
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYMeMainCtl.h"
#import "DYMeMainCell.h"
#import "DYUserCouponController.h"
#import "DYNotificationCenterController.h"
#import "DYAboutAKXController.h"
#import "DYFeedbackViewController.h"
#import "DYPersonInfoController.h"
#import "DYSafeViewController.h"
#import "DYMeHeaderView.h"
#import "DYBabyInfoController.h"
#import "DY_SettingController.h"


@interface DYMeMainCtl ()
@property (weak, nonatomic) IBOutlet UITableView *mainTable;

@property (nonatomic,strong)DYMeHeaderView *tableHeadView;

@property (nonatomic,strong)UIView *tableFoodView;

@property (nonatomic,strong)UIImageView *iconImgv;

@property (nonatomic,strong)UILabel *nameLab;

@property (nonatomic,strong)NSArray *rowIcon;

@property (nonatomic,strong)NSArray *rowTitle;

@property (nonatomic,strong)NSArray *controllerArray;


@end

@implementation DYMeMainCtl

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYMeMainCell" bundle:nil] forCellReuseIdentifier:@"DYMeMainCell"];
    
    self.scrollView  = self.mainTable;
    
    self.mainTable.tableHeaderView = self.tableHeadView;
    
    self.mainTable.contentInset = UIEdgeInsetsMake(0, 0, 49, 0);
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(loginSuccessRefresh) name:LoginSuccessNotification object:nil];;
    
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    
    [self loginSuccessRefresh];

}


-(void)loginSuccessRefresh{
    
    if(GM_User.isLogin){
        self.mainTable.tableFooterView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 60)];
    }else{
        self.mainTable.tableFooterView = self.tableFoodView;
    }
    
    [self startNetworking:NO];
}

-(void)startNetworking:(BOOL)tip{
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/getInfoInGame?token=%@",MAIN_SRV,GM_User.userToken) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            [DYCoinPersonInfo modelWithJSON:response[@"data"][@"person"]];
        }
        [weakself.tableHeadView refreshHeader];
        [weakself.mainTable reloadData];

    } fail:^(NSError *error) {
        
    } showHUD:tip?self.view:nil];
}



#pragma mark==========UITableViewDataSource==========


-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.rowTitle.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    return ISPAD ? 50 : 45 ;
    
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYMeMainCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYMeMainCell"];
    
    
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.icon.image = [UIImage imageNamed:self.rowIcon[indexPath.row]];
    cell.title.text = self.rowTitle[indexPath.row];
    
    if([self.rowTitle[indexPath.row] isEqualToString:@"关于爱科学"]){
        cell.subTitle.text = [NSString stringWithFormat:@"v%@",[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
    }else{
        cell.subTitle.text = @"";
    }
    
    if([self.rowTitle[indexPath.row] isEqualToString:@"仅WiFi下载"]){
        cell.switchOn.hidden = NO;
    }else{
        cell.switchOn.hidden = YES;
    }
    
    
    [cell setCellCall:^(UISwitch *sender){
        
    }];
    
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    NSString *title =  self.rowTitle[indexPath.row];
    
    if ([title isEqualToString:@"给我们鼓励"]) {
        [self toStore];
    }else if ([title isEqualToString:@"分享"]){
        OYWeakObj(self)
        //显示分享面板
        [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_WechatTimeLine),@(UMSocialPlatformType_WechatSession),@(UMSocialPlatformType_Sina),@(UMSocialPlatformType_QQ)]];
        [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
            // 根据获取的platformType确定所选平台进行下一步操作
            [weakself shareTextToPlatformType:platformType];
        }];
    }else{
        
        id class = [NSClassFromString(self.controllerArray[indexPath.row]) new];
        DYBaseViewController *VC = (DYBaseViewController *)class;
        [self.navCtl pushViewController:VC animated:YES];
    }
    
}

- (void)shareTextToPlatformType:(UMSocialPlatformType)platformType{
    //创建分享消息对象
    UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
    UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:@"孩子太爱“折腾”，爱科学来相助" descr:@"教育达人经验分享，科学实验激发兴趣、启迪思维，陪伴孩子快乐成长。" thumImage:[UIImage imageNamed:@"分享图片"]];
    
    //设置文本
    shareObject.webpageUrl =@"http://sj.qq.com/myapp/detail.htm?apkName=com.dy.aikexue";
    messageObject.shareObject = shareObject;
    
    //调用分享接口
    [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:self completion:^(id data, NSError *error) {
        if (error) {
            NSLog(@"************Share fail with error %@*********",error);
        }else{
            NSLog(@"response data is %@",data);
        }
    }];
}

- (void)toStore{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://itunes.apple.com/cn/app/ai-yu/id1145313570?mt=8"]];
}

#pragma mark =============事件===================

-(void)changerUserClick{

    OYWeakObj(self)
    [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
        [weakself loginSuccessRefresh];
    }];
    
}

-(void)userInfoClick{
    
    DYPersonInfoController *VC = [DYPersonInfoController new];
    [self.navCtl pushViewController:VC animated:YES];
    
}

-(void)addBabyInfo{
    
    DYBabyInfoController *VC = [DYBabyInfoController  new];
    [self.navCtl pushViewController:VC animated:YES];
    
}

-(void)settingClick{
    DY_SettingController *VC = [DY_SettingController  new];
    [self.navCtl pushViewController:VC animated:YES];
}

#pragma mark =============懒加载===================

-(DYMeHeaderView *)tableHeadView{
    if (!_tableHeadView) {
        if(ISPAD){
            _tableHeadView = [DYMeHeaderView loadFromNibWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 250)];
            
        }else{
            _tableHeadView = [DYMeHeaderView loadFromNibWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 200)];
        }
        
        OYWeakObj(self)
        [_tableHeadView setHeadClick:^(NSInteger index) {
            if (index == 1) {
                [weakself userInfoClick];
            }else if (index==2){
                [weakself addBabyInfo];
            }else if(index==3){
                [weakself settingClick];
            }
        }];
        
    }
    return _tableHeadView;
}




-(UIView *)tableFoodView{
    
    if (!_tableFoodView) {
        _tableFoodView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 100)];
        
        UIButton *changeUser = [UIButton buttonWithType:UIButtonTypeCustom];
        changeUser.frame = CGRectMake(30, 30, GM_SCREEN_S.width-60, 40);
        [changeUser  setTitle:@"绑定/登录" forState: UIControlStateNormal];
        [changeUser setTitleColor:[UIColor orangeColor] forState:UIControlStateNormal];
        
        OYViewBorderRadius(changeUser, 20, 0.5, [UIColor orangeColor]);
        
        [changeUser addTarget:self action:@selector(changerUserClick) forControlEvents:UIControlEventTouchUpInside];
        [_tableFoodView addSubview:changeUser];
        
    }
    return _tableFoodView;
}


-(NSArray *)rowIcon{
    
    if (!_rowIcon) {
        _rowIcon = @[@"消息中心",
                     @"金币-1",
                     @"优惠券",
                     @"意见反馈",
                     @"给我们鼓励",
                     @"分享"];
    }
    return _rowIcon;
}

-(NSArray *)rowTitle{
    
    if (!_rowTitle) {
        _rowTitle = @[@"消息中心",@"我的金币",@"优惠券",@"意见反馈",@"给我们鼓励",@"分享"];
    }
    return _rowTitle;
}

-(NSArray *)controllerArray{
    
    if (!_controllerArray) {
        _controllerArray = @[@"DYNotificationCenterController",@"DYCoinMainController",@"DYUserCouponController",@"DYFeedBackListController",@"",@""];
    }
    return _controllerArray;
}

@end

