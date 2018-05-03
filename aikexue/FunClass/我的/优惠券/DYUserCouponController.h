//
//  DYUserCouponController.h
//  aikexue
//
//  Created by Ray on 2017/8/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "DYCouponExchangeController.h"
#import "DY_CollectionView.h"
#import "DY_TableView.h"

@class DYUserCouponModel;

@protocol CouponDidSelectDelegate <NSObject>

-(void)couponDidSelect:(DYUserCouponModel *)couponModel;

@end


typedef NS_ENUM(NSInteger,CouponsType) {
    CouponsTypeList=0,
    CouponsTypeNotification=1,
    CouponsTypeSelect=2
};


@interface DYUserCouponController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource,AddCouponProtocol>

@property (weak, nonatomic) IBOutlet DY_TableView *mainTable;

@property(weak,nonatomic) id <CouponDidSelectDelegate> couponDelegate;

@property (nonatomic,strong)DYUserCouponModel *selectedCoupon;

@property (nonatomic,assign)CouponsType vcType;//优惠券展示/通知展示/优惠券选择

@property (nonatomic,strong)NSMutableArray *unCoupons;

@property (nonatomic,strong)NSMutableArray *dataArr;
-(void)doAddCoupon:(NSString*)cid  isRead:(bool)isRead;
/**
 是否已读优惠券
 false未读  表示从优惠券通知进来的   显得是是优惠请通知，未领取的优惠券
 true 已读  表示显示的是我的优惠券
 */


-(void)refresh:(BOOL)tip;


@end




@interface DYUserCouponModel : NSObject<YYModel>

@property (nonatomic,copy)NSString *_id;//": "900249",
@property (nonatomic,copy)NSString *title;//": "6.0 元优惠券",
@property (nonatomic,strong)NSNumber *price;//": 6,
@property (nonatomic,strong)NSNumber *startTime;//": 1501088461000,
@property (nonatomic,strong)NSNumber *endTime;//": 1504195141000,
@property (nonatomic,copy)NSString *status;//": "NORMAL",
@property (nonatomic,copy)NSString *assignFor;
@property (nonatomic,strong)NSNumber *createTime;//": 1501149957980,
@property (nonatomic,strong)NSNumber *lastTime;//": 1501149957980
@end






