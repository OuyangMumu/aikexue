//
//  Puerchaser.h
//  aikexue
//
//  Created by Centny on 04/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#import "SandBoxHelper.h"
#import "DYUserCouponController.h"
#import "DY_OrderTipView.h"


@protocol BuySuccessDelegate

-(void)buySuccessDelegate:(id)object;

@end


typedef void (^ PurchaseDone)(int code);
typedef void (^ CommonDone)(NSError *err);

@interface Puerchaser : NSObject<AFURLRequestSerialization>



@property(nonatomic)PurchaseDone ondone;

@property (nonatomic,strong)DY_OrderModel *orderModel;
@property (nonatomic,copy)NSString  *pwd;

@property(nonatomic,strong) DYExperimentModel* item;
@property(nonatomic,strong)DYUserCouponModel *couponModel;
@property (nonatomic,weak)id <BuySuccessDelegate> buyDelegate;//
@property (nonatomic,strong)DY_OrderTipView *tipView;


+(instancetype)sharedPuer;
-(bool)purchase;
-(void)joinFreeExam:(NSString*)eid;
-(void)joinFreeExam:(NSString*)eid coupon:(NSString*)cid;

@end
