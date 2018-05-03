//
//  DYUserCouponController.m
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYUserCouponController.h"
#import "DYUserCouponCell.h"
#import "DYCouponExchangeController.h"
#import "DYUserNotifiModel.h"
#import "DYNotificationCenterController.h"
#import "DYShareCouponController.h"
#import "DYUserCouponHeaderView.h"

@interface DYUserCouponController ()

@property (nonatomic,strong)UIButton *rightBtn;//

@property (nonatomic,strong)UIView *countHeadView;
@property (nonatomic,strong)DYUserCouponHeaderView *listHeadView;
@property (nonatomic,strong)UILabel *headLabel;

@end

@implementation DYUserCouponController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self buildUI];
    [self refresh:YES];
}

-(void)buildUI{
    self.scrollView = self.mainTable;
    OYWeakObj(self);
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYUserNotCouponCell" bundle:nil] forCellReuseIdentifier:@"DYUserNotCouponCell"];
    
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYUserCouponCell" bundle:nil] forCellReuseIdentifier:@"DYUserCouponCell"];
    
    [self.mainTable addEmptyViewWithImageName:ListEmptyImageString title:ListEmptyTipString buttonIcon:@"refresh-btn" action:^{
        [weakself refresh:YES];
    }];
    
    [self.mainTable addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself refresh:YES];
    }];
    
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakself refresh:NO];
    }];
    
}

-(void)refreshClick:(UIButton *)sender{
    OYWeakObj(self);
    [weakself refresh:YES];
}

-(void)refresh:(BOOL)tip{

    
    switch (self.vcType) {
        case CouponsTypeList:
            self.navigationItem.title = @"优惠券";
//            self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithCustomView:self.rightBtn];
            [self startNetworking:tip];
            
            break;
        case CouponsTypeNotification:
            self.navigationItem.title = @"优惠券通知";
            [self listUnReadCoupon:tip];
            break;
        case CouponsTypeSelect:
            self.navigationItem.title = @"优惠券选择";
            [self startNetworking:tip];
            
            break;
            
        default:
            break;
    }
    
}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return  self.vcType==CouponsTypeSelect ? 2 : 1;
}


-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if (self.vcType==CouponsTypeSelect && section==0) {
        return 1;
    }
    
    return self.dataArr.count;
}


-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (self.vcType==CouponsTypeSelect && indexPath.section==0) {
        return 60;
    }
    
    return ISPAD?120:90;
    
}

-(CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    
    if ((self.vcType==CouponsTypeSelect && section==1)||self.vcType==CouponsTypeNotification) {
        return 40;
    }else if(self.vcType==CouponsTypeList){
        return 0;
    }
    
    return 0;
}


-(UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{
    
    if ((self.vcType==CouponsTypeSelect && section==1) || self.vcType == CouponsTypeNotification ) {
        
        NSString *text = nil;
        if (self.dataArr.count>0) {
            if (self.vcType == CouponsTypeSelect) {
                text = [NSString stringWithFormat:@"有 %ld 张优惠券可用",self.dataArr.count];
            }else{
                text = [NSString stringWithFormat:@"有 %ld 张优惠券可领取",self.dataArr.count];
            }
            
        }else{
            if (self.vcType == CouponsTypeSelect) {
                text = @"暂无可用优惠券";
            }else{
                text = @"暂无优惠券通知";
            }
        }
        
        self.headLabel.text =  text;
        return self.countHeadView;
        
    }else if(self.vcType == CouponsTypeList ){
//        return self.listHeadView;
        return nil;
    }
    return  nil;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYUserCouponCell *cell = nil;
    
    if (self.vcType==CouponsTypeSelect && indexPath.section==0) {
        
        cell =  [tableView dequeueReusableCellWithIdentifier:@"DYUserNotCouponCell" forIndexPath:indexPath];
        
    }else{
        cell =  [tableView dequeueReusableCellWithIdentifier:@"DYUserCouponCell" forIndexPath:indexPath];
    }
    
    DYUserCouponModel *model = nil;
    if (self.vcType==CouponsTypeNotification) {//通知
        DYUserNotifiModel *item=self.dataArr[indexPath.row];
        if(item==nil&&item.coupon==nil)return cell;
        model = item.coupon;
    }
    
    if (self.vcType==CouponsTypeSelect){//购买选择
        if(indexPath.section==0) {
            if (self.selectedCoupon) {
                cell.selectButton.selected = NO;
            }else{
                cell.selectButton.selected = YES;
            }
        }else{
            model   =   self.dataArr[indexPath.row];
            if (self.selectedCoupon && [self.selectedCoupon._id isEqualToString: model._id]) {
                cell.selectButton.selected = YES;
            }else{
                cell.selectButton.selected = NO;
            }
        }
    }
    
    if (self.vcType==CouponsTypeList){//展示优惠券
        model   =   self.dataArr[indexPath.row];
    }
    
    if (self.vcType==CouponsTypeSelect) {
        cell.selectButton.hidden = NO;
    }else if (self.vcType==CouponsTypeList){
        cell.shareButton.hidden  = YES;
        if ([model.assignFor isEqualToString:@"PUBLIC"]) {
            cell.shareButton.hidden = NO;
        }
    }
    
    cell.model  =  model;
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    
    [cell setShareCall:^{
        
        DYShareCouponController *VC= [DYShareCouponController new];
        VC.cid = model._id;
        [self.navCtl pushViewController:VC animated:YES];
        
    }];
    
    return  cell;
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (self.vcType==1) {
        //点击该优惠券 领取 并且标记成已读
        DYUserNotifiModel *item=self.dataArr[indexPath.row];
        DYUserCouponModel *selected=item.coupon;
        [self doAddCoupon:selected._id  isRead:false];
        NSMutableArray *readeds=[NSMutableArray new];
        [readeds addObject:item];
        [DYNotificationCenterController markReaded:readeds];
        item.status=@2;
        [self.dataArr removeObjectAtIndex:indexPath.row];
        [tableView reloadData];
        
    }else{
        if (self.vcType==CouponsTypeSelect) {
            //选择模式
            if (indexPath.section==0) {
                self.selectedCoupon = nil;
            }else{
                self.selectedCoupon = self.dataArr[indexPath.row];
            }
            
            [tableView reloadData];
            
            //购买时选择优惠券
            if (self.couponDelegate && [self.couponDelegate conformsToProtocol:@protocol(CouponDidSelectDelegate)] && [self.couponDelegate respondsToSelector:@selector(couponDidSelect:)]) {
                
                [self.couponDelegate couponDidSelect:self.selectedCoupon];
                
                [self.navCtl popViewControllerAnimated:YES];
            }
        }
    }
}


-(BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (self.vcType==CouponsTypeSelect) {
        return  NO;
    }
    return YES;
}

- (UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (self.vcType!=2) {
        return  UITableViewCellEditingStyleDelete;
    }
    return UITableViewCellEditingStyleNone;
}


- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (self.vcType!=2) {
        
        if (editingStyle == UITableViewCellEditingStyleDelete) {
            
            [self.dataArr removeObjectAtIndex:indexPath.row];
            [tableView reloadData];
        }
    }
}





//
-(void)listUnReadCoupon:(BOOL)tip{
    
    OYWeakObj(self);
    [DYNetworking   getWithUrl:[NSString stringWithFormat:@"%@/usr/api/listMyNotices?token=%@&typeID=%d",MAIN_SRV,GM_User.userToken,COUPON_NOTICE_TYPE]  params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            weakself.unCoupons = nil;
            NSArray *noticeList = response[@"data"][@"noticeList"];
            if (notNilOrNull(noticeList)&&noticeList.count>0) {
                [noticeList enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    DYUserNotifiModel *item=[DYUserNotifiModel modelWithJSON:obj];
                    
                    if([item.status integerValue]==UNREAD)
                        [weakself.unCoupons addObject:item];
                }];
                weakself.dataArr  = weakself.unCoupons;
            }
        }
        [weakself.mainTable reloadData];
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];
    } showHUD:tip?self.view:nil];
}

-(void)startNetworking:(BOOL)tip{
    
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:[NSString stringWithFormat:@"%@/usr/api/listMyCoupon?token=%@&isOnlyValid=1",MAIN_SRV,GM_User.userToken] params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            GM_User.coupons = nil;
            NSArray *coupons = response[@"data"][@"coupons"];
            if (notNilOrNull(coupons)&&coupons.count>0) {
                
                [coupons enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    [GM_User.coupons addObject:[DYUserCouponModel modelWithJSON:obj]];
                }];
                
                weakself.dataArr  = GM_User.coupons;
            }
            
        }
        [weakself.mainTable reloadData];
        
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];
        
    } showHUD:tip?self.view:nil];
}

-(void)couponQRcode{
    
    
    DYCouponExchangeController *VC = [DYCouponExchangeController new];
    VC.delegate=self;
    [self.navCtl pushViewController:VC animated:YES];
    
    
}

-(void)doAddCoupon:(NSString*)cid  isRead:(bool)isRead{
    
    [DYNetworking getWithUrl:[NSString stringWithFormat:@"%@/usr/api/addMyCoupon?token=%@&cid=%@",MAIN_SRV,GM_User.userToken,cid] params:nil success:^(id response) {
        
        int code=[[response valueForKey:@"code"]intValue];
        
        switch (code) {
            case 0:
                if(!isRead){
                    [Utils alert:@"领取成功" msg:[NSString stringWithFormat:@"添加优惠券成功！你可以到\"优惠券\"界面查看"]];
                }else{
                    [Utils alert:@"领取成功" msg:[NSString stringWithFormat:@"添加优惠券成功！"]];
                    [self refresh:NO];
                }
                
                break;
            case 2:
                [Utils alert:@"添加失败" msg:@"无效优惠券"];
                break;
            case 10:
                [Utils alert:@"添加失败" msg:@"该优惠券id已被领取过"];
                break;
            default:
                [Utils alert:@"添加失败" msg:[response valueForKey:@"msg"]];
                break;
        }
    } fail:^(NSError *error) {
        [Utils alert:@"添加失败" msg:[NSString stringWithFormat:@"添加优惠券失败,网络异常"]];
        return;
        
    } showHUD:self.view];
    
}


-(void)addCoupon:(NSString *)QR{
    if(QR==nil||[QR isEqualToString:@""])
        return;
    [self doAddCoupon:QR isRead:YES];
    
}



#pragma mark ================================


-(NSMutableArray *)unCoupons{
    
    if (!_unCoupons) {
        _unCoupons = [NSMutableArray new];
    }
    return _unCoupons;
}



-(NSMutableArray *)dataArr{
    
    if (!_dataArr) {
        _dataArr =[NSMutableArray new];
    }
    return _dataArr;
}

-(UIView *)countHeadView{
    if (!_countHeadView) {
        _countHeadView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, GM_SCREEN_S.width, 40)];
        _countHeadView.backgroundColor = [UIColor groupTableViewBackgroundColor];
        
        [_countHeadView addSubview:self.headLabel];
        
    }
    return _countHeadView;
}

-(UILabel *)headLabel{
    if (!_headLabel) {
        _headLabel =   [[UILabel alloc]initWithFrame:CGRectMake(10, 0, GM_SCREEN_S.width-20, 40)];
        
        _headLabel.text = @"暂无优惠券";
        
        _headLabel.font = OYSysFont(14);
    }
    return _headLabel;
}

-(DYUserCouponHeaderView *)listHeadView{
    
    if (!_listHeadView) {
        
        _listHeadView = [[[NSBundle mainBundle]loadNibNamed:@"DYUserCouponHeaderView" owner:nil options:0]lastObject];
        OYWeakObj(self)
        [_listHeadView setCallBack:^(NSInteger index) {
            if (index==1) {//邀请
                NSLog(@"邀请");
//                DYShareCouponController *VC= [DYShareCouponController new];
////                VC.cid = model._id;
//                [weakself.navCtl pushViewController:VC animated:YES];
//
            }else{// 兑换
//                [weakself  couponQRcode];
            }
        }];
    }
    return _listHeadView;
}

-(UIButton *)rightBtn{
    
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];

        [_rightBtn setTitle:@"兑换优惠券" forState:UIControlStateNormal];
        [_rightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _rightBtn.titleLabel.font = OYSysFont(15);
        _rightBtn.frame = CGRectMake(0, 0, 100, 44);
        _rightBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
        [_rightBtn addTarget:self action:@selector(couponQRcode) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}


@end





@implementation DYUserCouponModel



@end
