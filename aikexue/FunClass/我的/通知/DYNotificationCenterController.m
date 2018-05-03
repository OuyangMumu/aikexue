//
//  DYNotificationCenterController.m
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYNotificationCenterController.h"
#import "DYNotificationCell.h"
#import "Utils.h"
#import "AppDelegate.h"
#import "DYSysNoteViewController.h"

@interface DYNotificationCenterController ()

@property(nonatomic,strong)NSMutableArray *notifications;

@property(nonatomic) NSMutableArray* couponItems;//优惠券通知数据
@property(nonatomic) NSMutableArray* sysItems;//系统通知数据
@property(nonatomic) NSMutableArray* examItems;//实验通知
@property (nonatomic,strong)NSMutableArray *notifiTypes;
@property(nonatomic)BOOL isNewCoupon;   //是否有新的优惠券通知   有的话会有个红点提示，下同
@property(nonatomic)BOOL isNewSys;
@property(nonatomic)BOOL isNewExam;

@end

@implementation DYNotificationCenterController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.scrollView = self.mainTable;
    [self buildUI];
    
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self startNetworking:YES];
}

-(void)buildUI{
    self.navigationItem.title = @"通知中心";
    //
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYNotificationCell" bundle:nil] forCellReuseIdentifier:@"DYNotificationCell"];
    
    OYWeakObj(self);
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakself startNetworking:NO];
    }];
    
    [self.mainTable addEmptyViewWithImageName:ListEmptyImageString title:ListEmptyTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    
    [self.mainTable addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];

    if (IOS8) { //iOS8以上包含iOS8
        if ([[UIApplication sharedApplication] currentUserNotificationSettings].types  == UIRemoteNotificationTypeNone) {
            [Utils alert:@"温馨提示" msg:[NSString stringWithFormat:@"你现在无法收到新消息通知。请到 设置->通知->爱科学 中开启"]];
        }else{
             NSString* registrationID=[Utils loadRid];
            if(registrationID==nil||[registrationID isEqualToString:@""]){
                [[AppDelegate shared]registerNotification];
                //[Utils alert:@"温馨提示" msg:[NSString stringWithFormat:@"你刚刚同意了推送功能，你需要重启应用才能正常接收到推送哦"]];
                return;
            }
        }
    }else{ // ios7 一下
        if ([[UIApplication sharedApplication] enabledRemoteNotificationTypes]  == UIRemoteNotificationTypeNone) {
            [Utils alert:@"温馨提示" msg:[NSString stringWithFormat:@"你现在无法收到新消息通知。请到 设置->通知->爱科学 中开启"]];
        }else{
             NSString* registrationID=[Utils loadRid];
            if(registrationID==nil||[registrationID isEqualToString:@""]){
                [[AppDelegate shared ]registerNotification];
                //                [Utils alert:@"温馨提示" msg:[NSString stringWithFormat:@"你刚刚同意了推送功能，你需要重启应用才能正常接收到推送哦"]];
                return;
            }
        }
    }
}

-(void)refreshClick:(UIButton *)sender{
    OYWeakObj(self);
    [weakself startNetworking:YES];
}

-(void)startNetworking:(BOOL)tip{

    OYWeakObj(self);

    [DYNetworking   getWithUrl:[NSString stringWithFormat:@"%@/usr/api/listMyNotices?token=%@&page=1&pageCount=40",MAIN_SRV,GM_User.userToken]  params:nil success:^(id response) {
        [weakself clearDatas];
        NSArray *noticeList = response[@"data"][@"noticeList"];
        if (notNilOrNull(noticeList)&&noticeList.count>0) {
            
            [noticeList enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                [weakself.notifications addObject:[DYUserNotifiModel modelWithJSON:obj]];
            }];
            [weakself rebuildNotifi];
        }
        [weakself.mainTable reloadData];

    } fail:^(NSError *error) {
        
        [weakself.mainTable reloadData];

    } showHUD:tip?self.view:nil];
    
}

-(void)rebuildNotifi{
    
    for (DYUserNotifiModel *item in self.notifications) {
        switch ([item.typeID integerValue]) {
            case SYSTEM_NOTICE_TYPE:
                [_sysItems addObject:item];
                if([item.status integerValue]==UNREAD)
                    _isNewSys=YES;
                break;
                
            case COUPON_NOTICE_TYPE:
                if([item.status integerValue]==UNREAD){
                    _isNewCoupon=YES;
                    [_couponItems addObject:item];
                }
                
                break;
                
            case EXAM_NOTICE_TYPE:
            case EXAM_PACKAGE_NOTICE_TYPE:
                [_examItems addObject:item];
                if([item.status integerValue]==UNREAD)
                    _isNewExam=YES;
                break;
            default:
                break;
        }
    }
    
    if(_sysItems.count>0){
        DYUserNotifiModel *first=_sysItems[0];
        if(_isNewSys)
            first.status=@1;
        [self.notifiTypes addObject:first];
    }
    
    if(_examItems.count>0){
        DYUserNotifiModel *first=_examItems[0];
        if(_isNewExam)
            first.status=@1;
        [self.notifiTypes addObject:first];
    }
    if(_couponItems.count>0){
        [self.notifiTypes addObject:_couponItems[0]];
    }
}

#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.notifiTypes.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    if(ISPAD)return 100;
    return 80;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYNotificationCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYNotificationCell"];
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    cell.model =self.notifiTypes[indexPath.row];
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYUserNotifiModel * item=self.notifiTypes[indexPath.row];
    switch ([item.typeID integerValue]) {
        case SYSTEM_NOTICE_TYPE:{
            DYSysNoteViewController *VC = [DYSysNoteViewController new];
            VC.type=SYSTEM_NOTICE_TYPE;
            [self.navCtl pushViewController:VC animated:YES];
            self.isNewSys=NO;
        }
            break;
            
        case COUPON_NOTICE_TYPE:{
            DYUserCouponController *VC = [DYUserCouponController new];
            VC.vcType = CouponsTypeNotification ;
            [self.navCtl pushViewController:VC animated:YES];
        }
            break;
        case EXAM_PACKAGE_NOTICE_TYPE:
        case EXAM_NOTICE_TYPE:{
            DYSysNoteViewController *VC = [DYSysNoteViewController new];
            VC.type=EXAM_NOTICE_TYPE;
            [self.navCtl pushViewController:VC animated:YES];
            self.isNewExam=NO;
        }
            break;

        default:
            break;
    }
    
}



-(NSMutableArray *)notifications{

    if(!_notifications){
        _notifications = [NSMutableArray new];
    }
    return _notifications;
}

-(NSMutableArray *)notifiTypes{
    if(!_notifiTypes){
        _notifiTypes = [NSMutableArray new];
    }
    return _notifiTypes;
}

-(NSMutableArray *)couponItems{
    if(!_couponItems){
        _couponItems = [NSMutableArray new];
    }
    return _couponItems;
}
-(NSMutableArray *)examItems{
    if(!_examItems){
        _examItems = [NSMutableArray new];
    }
    return _examItems;
}
-(NSMutableArray *)sysItems{
    if(!_sysItems){
        _sysItems = [NSMutableArray new];
    }
    return _sysItems;
}

-(void)clearDatas{
    OYWeakObj(self);
    [weakself.notifiTypes removeAllObjects];
    [weakself.notifications removeAllObjects];
    [weakself.examItems removeAllObjects];
    [weakself.sysItems removeAllObjects];
    [weakself.couponItems removeAllObjects];
}

+(void)markReaded:(NSMutableArray*)items{
    if(items==nil)return;
    NSMutableArray *unReadNotes=[NSMutableArray new];
    for(DYUserNotifiModel *item in items){
        if([item.status intValue]!=UNREAD)
            continue;
        [unReadNotes addObject:item._id];
    }
    
    if([unReadNotes count]<=0)
        return;//无未读消息 不发送
    
    NSMutableDictionary* args=[NSMutableDictionary dictionary];
    [args setObject:unReadNotes forKey:@"nids"];
    
    [DYNetworking postWithUrl:[NSString stringWithFormat:@"%@/usr/api/markNoticRead?token=%@",MAIN_SRV,GM_User.userToken]  params:args success:^(id response) {
        
        int code=[[response valueForKey:@"code"]intValue];
        
        NSLog(@"markReaded success");
    } fail:^(NSError *error) {
        
        NSLog(@"markReaded failed");
        
    } showHUD:nil];


}

@end



