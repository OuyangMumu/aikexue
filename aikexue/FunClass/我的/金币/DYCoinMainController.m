//
//  DYCoinMainController.m
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYCoinMainController.h"
#import "DYCoinMainCell.h"
#import "DYFeedbackViewController.h"
#import "DYGameViewController.h"
#import "DY_RechargeController.h"


@interface DYCoinMainController ()
@property (nonatomic,strong)UIButton *rightBtn;

@property (weak, nonatomic) IBOutlet UIImageView *iconImg;
@property (weak, nonatomic) IBOutlet UILabel *nameLab;
@property (weak, nonatomic) IBOutlet UILabel *allCoinCount;
@property (weak, nonatomic) IBOutlet UILabel *todayCoinCount;
@property (weak, nonatomic) IBOutlet UIView *sliderView;

@property (weak, nonatomic) IBOutlet UIButton *signButton;
@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;
@property (nonatomic,assign)BOOL isExchange;//金币任务 or  金币兑换
@property (nonatomic,strong)DYCoinPersonInfo *coinPersonInfo;
@property (nonatomic,assign)BOOL hasSign;//是否已经签到
@property (nonatomic,assign)BOOL hasPlayGame;//是否已经答题按时
@property (nonatomic,assign)BOOL hasSuggAward;

@property (nonatomic,strong)NSArray *tableInfo;
@property (nonatomic,strong)NSMutableArray *recordArray;

@property (nonatomic,assign)NSInteger page;

@end

@implementation DYCoinMainController

- (void)viewDidLoad {
    [super viewDidLoad];
    

    self.navigationItem.title = @"我的金币";
//    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithCustomView:self.rightBtn];
    self.page = 1;
    [self buildUI];
    [self listCoinRecord];
    
 
    
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    
    [self startNetworking:YES];
    
}


-(void)buildUI{
    
    [self.iconImg sd_setImageWithURL:[NSURL URLWithString:GM_User.usrImg] placeholderImage:IconPlaceholderImage];
    self.nameLab.text = GM_User.userName;
    
    OYViewBorderRadius(self.iconImg, 3, 0, OYClearColor);
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYCoinMainCell" bundle:nil] forCellReuseIdentifier:@"DYCoinMainCell"];
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYCoinMainCell2" bundle:nil] forCellReuseIdentifier:@"DYCoinMainCell2"];
    
    self.mainTable.tableFooterView = [UIView new];
    
}


-(void)refreshHeader{
    
    if (self.hasSign) {
        self.signButton.enabled = NO;
    }else{
        self.signButton.enabled = YES;
    }
    
    self.allCoinCount.text = OYStringFormat(@"%.2f",[self.coinPersonInfo.coinNum floatValue]);
    self.todayCoinCount.text = OYStringFormat(@"%.2f",[self.coinPersonInfo.todayGetCoin floatValue]);
    [self.mainTable reloadData];

}

-(void)listCoinRecord{
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/listCoinRecord?token=%@&pageCount=100&page=%ld&begin=1509469200000&end=%f",MAIN_SRV,GM_User.userToken,self.page,([[NSDate new] timeIntervalSince1970]*1000)) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            NSArray *records = response[@"data"][@"records"];
            if (weakself.page == 1) {
                weakself.recordArray = nil;
            }
            if (!IsNilOrNull(records)&&records.count>0) {
    
                [records enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    [weakself.recordArray addObject:[DYCoinRecodeModel modelWithJSON:obj]];
                }];
            }
            [weakself.mainTable reloadData];
        }
    } fail:^(NSError *error) {
        
    } showHUD:nil];
}

-(void)startNetworking:(BOOL)tip{
    
    OYWeakObj(self)
    
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/getInfoInGame?token=%@",MAIN_SRV,GM_User.userToken) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            
            weakself.coinPersonInfo = [DYCoinPersonInfo modelWithJSON:response[@"data"][@"person"]];
        }
        
        [weakself refreshHeader];
    } fail:^(NSError *error) {
        [MBProgressHUD showTipMessageInWindow:@"网络异常,请稍后再试"];
        
    } showHUD:tip?self.view:nil];
    
}


- (IBAction)signClick:(UIButton *)sender {
    
    NSMutableDictionary *parma = [NSMutableDictionary new];
    parma[@"coin"] = @10;
    
    OYWeakObj(self)
    [DYNetworking postWithUrl:OYStringFormat(@"%@/usr/api/dailySignIn?token=%@",MAIN_SRV,GM_User.userToken) params:parma success:^(id response) {
        
        if ([response[@"code"] integerValue] == 0) {
            weakself.signButton.enabled = NO;
            weakself.coinPersonInfo.alreadySign = @(1);
            [MBProgressHUD showTipMessageInWindow:@"签到成功!"];
            [weakself startNetworking:NO];
        }else{
            if ([response[@"code"] integerValue] == 2) {
                weakself.signButton.enabled = NO;
                weakself.coinPersonInfo.alreadySign = @(1);
                [MBProgressHUD showTipMessageInWindow:@"今日已签到!"];
            }else{
                [MBProgressHUD showTipMessageInWindow:@"签到失败!"];
            }
        }
        [weakself refreshHeader];
    } fail:^(NSError *error) {
        [MBProgressHUD showTipMessageInWindow:@"网络异常,请稍后再试"];
        
    } showHUD:self.view];
}

//规则
-(void)ruleClick{
 
}

- (IBAction)rechargeClick:(UIButton *)sender {
    
    DY_RechargeController *VC =[DY_RechargeController new];
    [self.navCtl pushViewController:VC animated:YES];
}


- (IBAction)taskOrExchange:(UIButton *)sender {
    
    OYWeakObj(self)
    [UIView animateWithDuration:0.2 animations:^{
        weakself.sliderView.center = CGPointMake(sender.centerX, CGRectGetMaxY(sender.frame)-1);
    }];
    
    self.isExchange = sender.tag-1;
    self.taskButton.selected = self.exchangeButton.selected = NO;
    sender.selected = YES;
    if (self.isExchange) {
        weakself.page=1;
        [weakself listCoinRecord];
//
//        self.mainTable.mj_footer = [MJRefreshBackNormalFooter footerWithRefreshingBlock:^{
//            weakself.page++;
//            [weakself listCoinRecord];
//        }];
        
    }else{
//        self.mainTable.mj_footer = [UIView new];
    }
    [self.mainTable reloadData];
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if (self.isExchange) {
        
        return self.recordArray.count;
    }
    return self.tableInfo.count;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    

    return 70;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYCoinMainCell *cell = nil;
    NSString *title = nil;
    NSString *subTitle = nil;
    if(self.isExchange) {
        cell  = [tableView dequeueReusableCellWithIdentifier:@"DYCoinMainCell2"];
        DYCoinRecodeModel   *model = self.recordArray[indexPath.row];

        title = model.title;
        subTitle = [Utils timeStringWith:OYStringFormat(@"%@",model.createTime) formatter:@"yyyy-MM-dd hh:mm"];
        cell.countLabel.text = model.coin;
        
        if ([model.flowType integerValue]==10) {
            cell.countLabel.text = OYStringFormat(@"+%.2f",[model.coin floatValue]);
            cell.countLabel.textColor = NAV_BAR_COLOR;
        }else{
            cell.countLabel.text = OYStringFormat(@"-%.2f",[model.coin floatValue]);
            cell.countLabel.textColor = [UIColor redColor];
        }
        
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:@"DYCoinMainCell"];
        
        title = [self.tableInfo[indexPath.row] valueForKey:@"title"];
        subTitle = [self.tableInfo[indexPath.row]
                    valueForKey:@"subTitle"];
        [cell.coinButton setTitle:[self.tableInfo[indexPath.row]
                                   valueForKey:@"coin"]forState:UIControlStateNormal];
    }
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.titleLab.text = title;
    cell.subTitleLab.text = subTitle;
    
    cell.getButton.enabled = YES;
    if(self.isExchange) {
        if ([self.coinPersonInfo.coinNum integerValue]<[subTitle integerValue]) {
            cell.getButton.enabled = NO;
        }
    }else{
        switch (indexPath.row) {
            case 0:
                if (self.hasSign) {
                    cell.getButton.enabled = NO;
                }
                break;
            case 1:
                if (self.hasSuggAward) {
                    cell.getButton.enabled = NO;
                }
                break;
            case 2:
                if (self.hasPlayGame) {
                    cell.getButton.enabled = NO;
                }
                break;
            case 3:
                if (GM_User.privated.phone.length>0) {
                    cell.getButton.enabled = NO;
                }
                break;
            default:
                break;
        }
    }
    OYWeakObj(self);
    [cell setCellCall:^{
        if (weakself.isExchange) {
            NSLog(@"兑换");
            [weakself convertCoinToCoupons:[subTitle numberValue] price:@([subTitle integerValue]/100*6)];
        }else{
            switch (indexPath.row) {
                case 0:
                    NSLog(@"签到");
                    [weakself signClick:weakself.signButton];
                    break;
                case 1:
                    NSLog(@"反馈");
                {
                    DYFeedbackViewController *VC =[DYFeedbackViewController new];
                    [weakself.navCtl pushViewController:VC animated:YES];
                }
                    break;
                case 2:
                    NSLog(@"答题");
                {
                    DYGameViewController *VC = [DYGameViewController new];
                    VC.isPushLoad = YES;
                    [weakself.navCtl pushViewController:VC animated:YES];
                }
                    break;
                case 3:
                    NSLog(@"绑定手机");
                {
//                    DYChangeUserController *VC = [DYChangeUserController new];
//                    VC.type=PhoneTypeBind;
//                    [weakself.navCtl pushViewController:VC animated:YES];
                    
                    OYWeakObj(self)
                    [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
                        [weakself  startNetworking:YES];
                    }];
                }
                    break;
                    
                default:
                    break;
            }
        }
    }];
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
 
}



#pragma  marks ===== 自定义事件  =====

-(void)convertCoinToCoupons:(NSNumber *)coin price:(NSNumber *)price{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/convertCoinToCoupons?coin=%@&price=%@&token=%@",MAIN_SRV,coin,price,GM_User.userToken) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            [MBProgressHUD showTipMessageInWindow:@"兑换成功"];
            weakself.coinPersonInfo.coinNum = @([weakself.coinPersonInfo.coinNum integerValue]-[coin integerValue]);
        }else{
            [MBProgressHUD showTipMessageInWindow:response[@"msg"]];
        }
        [weakself refreshHeader];
    } fail:^(NSError *error) {
        [MBProgressHUD showTipMessageInWindow:@"网络异常,请稍后再试"];
    } showHUD:self.view];
    
}


#pragma  marks ===== 懒加载  =====

-(BOOL)hasSign{
    if (self.coinPersonInfo) {
        NSDate *date = [NSDate dateWithTimeIntervalSince1970:[self.coinPersonInfo.lastSign longLongValue]/1000.0];
        
        if ([date isToday]) {
            return  YES;
        }
    }
    return NO;
}

-(BOOL)hasPlayGame{
    if (self.coinPersonInfo) {
        NSDate *date = [NSDate dateWithTimeIntervalSince1970:[self.coinPersonInfo.lastGameAward longLongValue]/1000.0];
        
        if ([date isToday]) {
            return  YES;
        }
    }
    return NO;
}

-(BOOL)hasSuggAward{
    if (self.coinPersonInfo) {
        NSDate *date = [NSDate dateWithTimeIntervalSince1970:[self.coinPersonInfo.lastSuggAward longLongValue]/1000.0];
        
        if ([date isToday]) {
            return  YES;
        }
    }
    return NO;
}

-(UIButton *)rightBtn{
    
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_rightBtn setTitle:@"充值" forState:UIControlStateNormal];
        [_rightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _rightBtn.titleLabel.font = OYSysFont(15);
        _rightBtn.frame = CGRectMake(0, 0, 100, 44);
        _rightBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
        [_rightBtn addTarget:self action:@selector(ruleClick) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}


-(NSArray *)tableInfo{
    if (!_tableInfo) {
        _tableInfo = @[
                       @{@"title":@"【每日签到】",@"subTitle":@"  坚持每日签到，金币领不停。",@"coin":@"+5"},
                       @{@"title":@"【反馈意见】",@"subTitle":@"  有您的反馈，我们会做得更好。",@"coin":@"+10"},
                       @{@"title":@"【答题游戏】",@"subTitle":@"  开心答题，奖励不断。",@"coin":@"+5"},
                       @{@"title":@"【绑定手机】",@"subTitle":@"  数据漫游轻松搞定，换机无忧。",@"coin":@"+10"}];
    }
    return _tableInfo;
}

-(NSMutableArray *)recordArray{
    if (!_recordArray) {
        _recordArray = [NSMutableArray new];
    }
    return _recordArray;
}

@end

@implementation DYCoinRecodeModel

@end
