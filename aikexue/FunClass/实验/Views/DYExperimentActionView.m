//
//  DYExperimentActionView.m
//  aikexue
//
//  Created by Ray on 2017/8/3.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentActionView.h"
#import "DYConfirmOrderController.h"


@interface DYExperimentActionView()



@end

@implementation DYExperimentActionView



-(void)awakeFromNib{
    [super awakeFromNib];
    self.backgroundColor = OYClearColor;
    [self buildUI];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDownloaded:) name:N_DOWNLOADED object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDownloaded:) name:N_DOWNProcess object:nil];
    
    //已购买
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPurchased:) name:N_PURCHASED object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPurchased:) name:N_PURCHASFail object:nil];
    
    [self addObserver:self forKeyPath:@"buttonStatus" options:NSKeyValueObservingOptionNew context:nil];
    
}

-(void)buildUI{
    
    [self addSubview:self.actionButton];
    [self addSubview:self.loading];
    
    // 禁止将 AutoresizingMask 转换为 Constraints
    self.actionButton.translatesAutoresizingMaskIntoConstraints=NO;
    self.loading.translatesAutoresizingMaskIntoConstraints=NO;
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.actionButton attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterY multiplier:1.0 constant:0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.actionButton attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterX multiplier:1.0 constant:0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.actionButton attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:30]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.actionButton attribute:NSLayoutAttributeLeft relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeLeft multiplier:1.0 constant:0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.loading attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterY multiplier:1.0 constant:0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.loading attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterX multiplier:1.0 constant:0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.loading attribute:NSLayoutAttributeLeft relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeLeft multiplier:1.0 constant:0]];

    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.loading attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeTop multiplier:1.0 constant:0]];

    
}

-(UIButton *)actionButton{
    
    if (!_actionButton) {
        _actionButton = [UIButton buttonWithType:UIButtonTypeCustom];
        _actionButton.titleLabel.font = [UIFont systemFontOfSize:13];
        _actionButton.backgroundColor = NAV_BAR_COLOR;
        _actionButton.frame = CGRectMake(0, 0, 60, 50);
        OYViewBorderRadius(_actionButton, 15, 0, OYClearColor)
       [_actionButton addTarget:self action:@selector(onClick:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _actionButton;
}


-(SectorView *)loading{
    
    if (!_loading) {
        
        _loading = [SectorView buttonWithType:UIButtonTypeCustom];
        _loading.frame = CGRectMake(15, 19, 60, 60);
        
        _loading.rate = 0.0;
        _loading.strokeWidth =3;
        _loading.color = NAV_BAR_COLOR;
        _loading.bcolor = [UIColor groupTableViewBackgroundColor];
        
        [_loading setTitle:@"■" forState:UIControlStateNormal];
        [_loading setTitle:@"▶" forState:UIControlStateSelected];
        [_loading setTitleColor:NAV_BAR_COLOR forState:UIControlStateNormal];
        _loading.titleLabel.font = [UIFont systemFontOfSize:15];
        
        [_loading addTarget:self action:@selector(loadingClick:) forControlEvents:UIControlEventTouchUpInside];

    }
    return _loading;
}


-(void)setBackgroundColor:(UIColor *)backgroundColor andTitleColor:(UIColor *)titleColor title:(NSString *)title{
    
    [self.actionButton setBackgroundColor:backgroundColor];
    [self.actionButton setTitleColor:titleColor forState:UIControlStateNormal];
    
    if (title) {
        [self.actionButton setTitle:title forState:UIControlStateNormal];
    }
}


-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSString *,id> *)change context:(void *)context{
    
    //    这里需要将NSNumber类型转换为字符串类型
    NSNumberFormatter* numberFormatter = [[NSNumberFormatter alloc] init];
    
    NSString *statusStr = [numberFormatter stringFromNumber:[change objectForKey:@"new"]];
    
    
    self.actionButton.hidden = NO;
    self.actionButton.enabled = YES;
    self.loading.hidden = YES;
    
    if (self.backType == BackgroundTypeWhite) {
        [self setBackgroundColor:[UIColor whiteColor] andTitleColor:NAV_BAR_COLOR title:nil];
    }else{
        [self setBackgroundColor:NAV_BAR_COLOR andTitleColor:[UIColor whiteColor] title:nil];
    }
    
    switch ([statusStr integerValue]) {
        case ActionTypeBuy:
        {
            NSDecimalNumber* price=[Utils price:self.model coupon:nil];
            //免费 / 价格
            if([Utils iszero:price]){
                //显示”下载”状态
                [self.actionButton setTitle:@"下载" forState:UIControlStateNormal];
            }else{
                if (self.backType == BackgroundTypeWhite) {
                    [self setBackgroundColor:[UIColor whiteColor]  andTitleColor:NAV_BAR_COLOR title:[NSString stringWithFormat:@"%.2f金币|购买",[self.model.price floatValue]*10]];
                }else{
                    [self setBackgroundColor:NAV_BAR_COLOR andTitleColor:[UIColor whiteColor] title:@"购买"];
                }
            }
        }
            break;
            
        case ActionTypeDown:
            [self.actionButton setTitle:@"下载" forState:UIControlStateNormal];
            
            break;
            
        case ActionTypeLook:
            [self.actionButton setTitle:@"查看" forState:UIControlStateNormal];
            break;
            
            
        case ActionTypeUpdate:
            [self.actionButton setTitle:@"更新" forState:UIControlStateNormal];
            break;
            
            
        case ActionTypePause:
        {
            self.actionButton.hidden =  YES;
            self.loading.hidden = NO;
            self.loading.rate = 0.0;
            self.loading.selected = YES;
            self.loading.kbLabel.text = @"继续下载";
            OYWeakObj(self)
            [[[Downloader shared]pending]enumerateObjectsUsingBlock:^(OYDownloadModel *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                if ([obj.downID isEqualToString:self.model._id]) {
                    weakself.loading.rate =  obj.progress.progress;
                    *stop = YES;
                }
            }];
        }
            break;
            
            
        case ActionTypeLoading:
        {
            self.actionButton.hidden =  YES;
            self.loading.hidden = NO;
            self.loading.rate = 0.0;
            self.loading.selected = NO;

            OYWeakObj(self)
            [[[Downloader shared]pending]enumerateObjectsUsingBlock:^(OYDownloadModel *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                
                if ([obj.downID isEqualToString:self.model._id]) {
                    
                    weakself.loading.rate =  obj.progress.progress;
                    weakself.loading.speed =  obj.progress.speed;

                    *stop = YES;
                }
            }];
        }
            break;
            
            
        case ActionTypeOpen:
            [self.actionButton setTitle:@"打开" forState:UIControlStateNormal];
            break;
            
        case ActionTypeDowned:
            self.actionButton.enabled = NO;
            [self.actionButton setTitle:@"安装中" forState:UIControlStateNormal];
            
            break;
            
        default:
            break;
    }
}

//购买成功通知
-(void)onPurchased:(NSNotification *)notice{
    if ([notice.object[@"exam_id"] isEqualToString:self.model._id]) {
        if ([N_PURCHASFail isEqualToString:notice.name]) {
            self.model = self.model;
        }else{
            self.model = self.model;
        }
    }
}

- (void)onDownloaded:(NSNotification*)notice{
    
    NSDictionary* item=notice.object;
    if ([item[@"exam_id"] isEqualToString:self.model._id]) {
        
        if([N_DOWNLOADED isEqualToString:notice.name]){
            self.model = self.model;
        }else if([N_DOWNProcess isEqualToString:notice.name]){
            NSNumber *rate = item[@"progress"];
            NSNumber *speed =  item[@"speed"];
            if(rate){
                
                self.loading.rate=rate.floatValue;
                self.loading.speed = speed.floatValue;
                self.actionButton.hidden = YES;
                self.loading.hidden = NO;
                
                if ([rate integerValue] == 1) {//下载完成
                    self.buttonStatus = ActionTypeDowned;
                }
            }
        }
    }
}


-(void)setModel:(DYExperimentModel *)model{
    
    _model = model;
    
    NSString* eid = model._id;
    NSDictionary* purchared=[GM_User userExperiment];
    NSDictionary* downloaded=[[Downloader shared] downloaded];
    
    if([purchared valueForKey:eid]){
        //已经购买
        if([[Downloader shared]isDownloading:model]){
            
            if ([[Downloader shared]isPauseing:model]) {
                self.buttonStatus = ActionTypePause;
            }else{
                //下载中状态
                self.buttonStatus = ActionTypeLoading;
            }
        }else{
            if([downloaded valueForKey:eid]){
                if([GM_User isUpdated:eid]){
                    //显示”更新”状态
                    self.buttonStatus = ActionTypeUpdate;
                }else{
                    if([_model.type isEqualToString:EXAM_TYPE_EXAM]){
                        //实验，显示”打开“状态
                        self.buttonStatus = ActionTypeOpen;
                    }else{
                        //实验包，显示”查看”状态
                        self.buttonStatus = ActionTypeLook;
                    }
                }
            }else{
                if([_model.type isEqualToString:EXAM_TYPE_EXAM]){
                    self.buttonStatus = ActionTypeDown;
                }else{
                    //实验包，显示”查看”状态
                    self.buttonStatus = ActionTypeLook;
                }
            }
        }
    }else{
        //显示”购买”状态
        self.buttonStatus = ActionTypeBuy;
    }
}

-(IBAction)onClick:(UIButton*)sender{
    
    NSString* eid=self.model._id;
    
    if(self.buttonStatus==ActionTypeDown||self.buttonStatus==ActionTypeUpdate){
        
        self.buttonStatus = ActionTypeLoading;
        if([[GM_User userExperiment] valueForKey:eid]) {
            [[Downloader shared]download:self.model];
        }else{
            Puerchaser* pr=[Puerchaser new];
            pr.item=self.model;
            pr.couponModel=self.couponModel;
            [pr purchase];
        }
    }else if(self.buttonStatus==ActionTypeBuy){
        
        NSDecimalNumber* price=[Utils price:self.model coupon:nil];
        //免费 / 价格
        if([Utils iszero:price]){
            self.confirmed = YES;
            self.buttonStatus = ActionTypeLoading;
        }
        
        
        if(self.confirmed){
            Puerchaser* pr=[Puerchaser new];
            pr.item=self.model;
            pr.couponModel=self.couponModel;
            [pr purchase];
            return;
        }
        
        DYConfirmOrderController *VC = [DYConfirmOrderController new];
        VC.model = self.model;
        [[GM_APP rootNav] pushViewController:VC animated:YES];
        
    }else if(self.buttonStatus==ActionTypeOpen){
        [[Downloader shared]open:self.model];
    }else if(self.buttonStatus==ActionTypeLook){
        [Utils toExpDetail:[GM_APP rootNav] expModel:self.model];
    }
}


- (IBAction)loadingClick:(SectorView *)sender {
    
//    if ( [@[@"iPhone 4",@"iPhone 4S",@"iPhone 5",@"iPhone 5c"]containsObject: [Utils iphoneType]]) {
//        return;
//    }
    
    sender.selected = !sender.selected;
    if(sender.selected){//暂停
        self.buttonStatus = ActionTypePause;
        [[Downloader shared]pauseDown:self.model];
    }else{//继续下载
        
        self.buttonStatus = ActionTypeLoading;
        [[Downloader shared]download:self.model];
    }
}

-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeObserver:self forKeyPath:@"buttonStatus"];
}


@end
