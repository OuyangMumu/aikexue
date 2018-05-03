//
//  DYConfirmOrderController.m
//  aikexue
//
//  Created by Ray on 2017/8/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYConfirmOrderController.h"
#import "DYUserCouponController.h"
#import "DYExperimentFootView.h"
#import "DY_RechargeController.h"

@interface DYConfirmOrderController ()<CouponDidSelectDelegate>
@property (weak, nonatomic) IBOutlet UIImageView *icon;
@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UILabel *sizeLab;
@property (weak, nonatomic) IBOutlet UILabel *countLab;
@property (weak, nonatomic) IBOutlet UIView *tipView;
@property (weak, nonatomic) IBOutlet UILabel *couponLab;
@property (weak, nonatomic) IBOutlet DYExperimentFootView *footView;
@property (weak, nonatomic) IBOutlet UILabel *payDesLab;
@property (weak, nonatomic) IBOutlet UIButton *selectButton;

@property (nonatomic,strong)DYUserCouponModel *couponModel;


- (IBAction)bindClick:(UIButton *)sender;

- (IBAction)couponClick:(UIButton *)sender;

@end

@implementation DYConfirmOrderController

- (void)viewDidLoad {
    [super viewDidLoad];
    //
    self.navigationItem.title = @"订单确认";
    
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(buySuccess:) name:N_PURCHASED object:nil];
    
    [self buildUI];
    [self  startNetworking:nil];
    
    
    OYWeakObj(self)
    [GM_User getInfoInGame:^{
        [weakself refreshUI];
    }];
    [GM_User listMyCoupon:^{
        [weakself refreshUI];
    }];
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
    [self refreshUI];
}

-(void)refreshUI{

    
    if (GM_User.privated.phone.length>0) {
        self.tipView.hidden = YES;
    }
    
    NSString *desLabStr = nil;
    self.payDesLab.textColor = [UIColor darkGrayColor];

    if (self.couponModel) {
        if ([DYCoinPersonInfo sharedCoin].coinNum.floatValue >= (self.model.price.floatValue -self.couponModel.price.floatValue)*10) {
            
            desLabStr  = [NSString stringWithFormat:@"金币余额:%.2f金币",[DYCoinPersonInfo sharedCoin].coinNum.floatValue];
            self.footView.canPay = self.selectButton.selected = YES;
        }else{
            CGFloat count =   (self.model.price.floatValue-self.couponModel.price.floatValue)*10 - [DYCoinPersonInfo sharedCoin].coinNum.floatValue;
            desLabStr  = [NSString stringWithFormat:@"余额不足,需充值%.2f金币!",count];
            self.payDesLab.textColor = [UIColor redColor];
             self.footView.canPay = self.selectButton.selected =  NO;
        }
    }else{
        if ([DYCoinPersonInfo sharedCoin].coinNum.floatValue>=(self.model.price.floatValue * 10)) {
            desLabStr  = [NSString stringWithFormat:@"金币余额:%.2f金币",[DYCoinPersonInfo sharedCoin].coinNum.floatValue];
             self.footView.canPay = self.selectButton.selected =  YES;
        }else{
            CGFloat count =   self.model.price.floatValue * 10 - [DYCoinPersonInfo sharedCoin].coinNum.floatValue;
            desLabStr  = [NSString stringWithFormat:@"余额不足,需充值%.2f金币!",count];
            self.payDesLab.textColor = [UIColor redColor];
             self.footView.canPay = self.selectButton.selected = NO;
        }
    }
    self.payDesLab.text = desLabStr;
   
    
    if (GM_User.coupons.count==0) {
        self.couponLab.text = @"0张优惠券可用";
    }
}


-(void)buildUI{
    
    OYViewBorderRadius(self.icon, 5, 2, [UIColor darkGrayColor]);
    
    [self.icon sd_setImageWithURL:[NSURL URLWithString:self.model.image] placeholderImage:PlaceholderImage];
    self.titleLab.text = self.model.title;
    
    if ([self.model.type isEqualToString:EXAM_TYPE_PACKAGE]) {
        self.sizeLab.text = [NSString stringWithFormat:@"%@个实验 / %@",self.model.examCount,sizeString([self.model.size longValue])];
    }else{
        self.sizeLab.text = [NSString stringWithFormat:@"1个实验 / %@",sizeString([self.model.size longValue])];
    }
    
    if (self.model.showingTags.count>0) {
        self.countLab.text = [NSString stringWithFormat:@"适合年龄:%@", self.model.showingTags[0]];
    }else{
        self.countLab.text = @"";
    }
    
    if (GM_User.privated.phone.length>0) {
        self.tipView.hidden = YES;
    }else{
        NSString* bined=GM_User.privated.phone;
        NSString* wxBined=GM_User.privated.unionId;
        
        if((bined==nil||bined.length<1)&&(wxBined==nil||wxBined.length<1)){
            
            OYWeakObj(self);
            UIAlertController *alertCtl = [UIAlertController alertControllerWithTitle:@"警告" message:@"您没有绑定手机号，切换账号后将无法找回现在的用户信息，请绑定" preferredStyle:UIAlertControllerStyleAlert];
            
            UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"朕知道了" style:UIAlertActionStyleCancel handler:nil];
            
            
            UIAlertAction *sure = [UIAlertAction actionWithTitle:@"去绑定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                
                [weakself bindClick:nil];
                
            }];
            
            [alertCtl addAction:cancel];
            [alertCtl addAction:sure];
            
            [self.navCtl presentViewController:alertCtl animated:YES completion:nil];
        }
    }
    self.footView.model = self.model;
}

-(void)couponDidSelect:(DYUserCouponModel *)couponModel{
    
    if (couponModel) {
        
        self.couponLab.text = [NSString stringWithFormat:@"%.2f金币优惠券", [couponModel.price floatValue]*10];
    }else{
        self.couponLab.text = @"不使用优惠券";
    }
    self.couponModel = couponModel;
    [self refreshUI];
    self.footView.couponModel = couponModel;
    
}


-(void)buySuccess:(NSNotification *)notice{
    
    if ([notice.object[@"exam_id"] isEqualToString:self.model._id]) {
        self.footView.model = self.model;
        OYWeakObj(self)
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [weakself.navCtl popViewControllerAnimated:YES];
        });
    }
}

- (IBAction)bindClick:(UIButton *)sender {
    
//    DYChangeUserController *VC = [DYChangeUserController new];
//    VC.type=PhoneTypeBind;
//    [self.navCtl pushViewController:VC animated:YES];

    OYWeakObj(self)
    [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
        [weakself refreshUI];
    }];
    
}

- (IBAction)couponClick:(UIButton *)sender {
    
    if (sender.tag==1 && GM_User.coupons.count>0) {
        DYUserCouponController *VC = [DYUserCouponController new];
        VC.vcType = CouponsTypeSelect;
        VC.couponDelegate = self;
        VC.selectedCoupon = self.couponModel;
        [self.navCtl pushViewController:VC animated:YES];
    }
}
@end
