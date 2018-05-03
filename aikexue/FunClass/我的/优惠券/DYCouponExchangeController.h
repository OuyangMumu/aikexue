//
//  DYCouponExchangeController.h
//  aikexue
//
//  Created by Ray on 2017/8/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "AddCouponProtocol.h"

@interface DYCouponExchangeController : DYBaseViewController
@property (weak, nonatomic) IBOutlet UIView *couponExchange;
@property (weak, nonatomic) IBOutlet UITextField *couponTf;
@property(nonatomic,copy)NSString* QR;

@property(weak, nonatomic)IBOutlet UIView *viewPreview;
@property(weak,nonatomic)IBOutlet UIView* input;

-(IBAction)onQrcode:(id)sender;
-(IBAction)onExchange:(id)sender;


@property(nonatomic, weak) id<AddCouponProtocol> delegate;
@end
