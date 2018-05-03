
//
//  DYGameViewCell.m
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYGameViewCell.h"
#import "DYConfirmOrderController.h"

@implementation DYGameViewCell

- (void)awakeFromNib {
    [super awakeFromNib];

    OYViewBorderRadius(self.iconImage, 3, 0, OYClearColor);
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDownloaded:) name:N_DOWNLOADED object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDownloaded:) name:N_DOWNProcess object:nil];
    
    //已购买
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPurchased:) name:N_PURCHASED object:nil];
        
    [self addObserver:self forKeyPath:@"buttonStatus" options:NSKeyValueObservingOptionNew context:nil];
    
    [self.progressView buildUI];
    [self.progressView addGestureRecognizer:[[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(buttonClick)]];
    self.progressView.maxValue = 200;
    self.progressView.leftimg.backgroundColor = NAV_BAR_COLOR;
    self.progressView.presentlab.textColor = [UIColor whiteColor];
}


//购买成功通知
-(void)onPurchased:(NSNotification *)notice{
    
    if ([notice.object[@"exam_id"] isEqualToString:self.model._id]) {
        
        self.model = self.model;
    }
}

- (void)onDownloaded:(NSNotification*)notice{
  
    NSDictionary* item=notice.object;
    if ([item[@"exam_id"] isEqualToString:self.model._id]) {
        
    if([N_DOWNLOADED isEqualToString:notice.name]){
        
        self.model = self.model;
        
    }else if([N_DOWNProcess isEqualToString:notice.name]){
        NSDictionary* item=notice.object;
        NSNumber* rate=item[@"progress"];
        if(rate){
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.progressView setPresent:[rate floatValue]];
            });
        }
    }
    }
}




-(void)setModel:(DYExperimentModel *)model{
    _model = model;
    
//    self.titleLab.text = model.title;
//    self.sizeLab.text=sizeString([model.size longValue]);
    self.desLab.text =  @"《开心答题》题目内容丰富新颖，自然科学、天文地理、安全知识、生活常识，海量趣味题目等你来挑战！不断答题闯关，获得成就游戏币，即可兑换平台课程。希望小伙伴在这里能开开心心学习，快快乐乐成长！";   // model.desc;
//    self.iconImage =
//    [self.headBg sd_setImageWithURL:[NSURL URLWithString:model.image] placeholderImage:OYGetImage(@"")];
    
    model.screenshots = @[@"游戏截图1",@"游戏截图2"];
    
    self.ImageScrollH.constant = GM_SCREEN_S.width/16 * 7;
    
    if (model.screenshots) {
        CGFloat spaceH = 10;
        CGFloat heigt = (GM_SCREEN_S.width/16 * 7 - 20);
        CGFloat width = heigt/9*16;
        CGFloat spaceW = 10;
        
        self.ImagesScroll.contentSize = CGSizeMake(spaceW+(spaceW+width) * model.screenshots.count, heigt+spaceH*2);
        
        OYWeakObj(self)
        [model.screenshots enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            
            UIImageView *imageV = [[UIImageView alloc]initWithFrame:CGRectMake(spaceW+(spaceW+width)*idx, spaceH, width, heigt)];
//            [imageV sd_setImageWithURL:[NSURL URLWithString:@""] placeholderImage:OYGetImage(model.screenshots[idx])];
            
            imageV.image = OYGetImage(model.screenshots[idx]);
            [weakself.ImagesScroll addSubview:imageV];
        }];
    }
    
    
    NSString* eid = model._id;
    NSDictionary* purchared=[GM_User userExperiment];
    NSDictionary* downloaded=[[Downloader shared] downloaded];
    
    NSDecimalNumber* price=[Utils price:model coupon:nil];
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
        
        //未购买    可能是限时免费   可能是未购买
        if([Utils iszero:price]){
            
            if ([[Downloader shared]isDownloading:self.model]) {
                self.buttonStatus = ActionTypeLoading;
            }else{
                //显示”下载”状态
                self.buttonStatus = ActionTypeDown;
            }
        }else{
            //显示”购买”状态
            self.buttonStatus = ActionTypeBuy;
        }
    }
}


-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSString *,id> *)change context:(void *)context{
    
    //    这里需要将NSNumber类型转换为字符串类型
    NSNumberFormatter* numberFormatter = [[NSNumberFormatter alloc] init];
    
    NSString *statusStr = [numberFormatter stringFromNumber:[change objectForKey:@"new"]];
    
    
    self.progressView.bgimg.backgroundColor = NAV_BAR_COLOR;
    switch ([statusStr integerValue]) {
        case ActionTypeBuy:
            self.progressView.presentlab.text = [NSString stringWithFormat:@"%.0f金币",[self.model.price floatValue]*10];
            break;
            
        case ActionTypeDown:
          self.progressView.presentlab.text = @"下载";
            break;
            
        case ActionTypeLook:
            self.progressView.presentlab.text = @"查看";
            break;
            
            
        case ActionTypeUpdate:
            self.progressView.presentlab.text = @"更新";
            
            
        case ActionTypePause:
        {
           self.progressView.presentlab.text = @"继续";
                self.progressView.bgimg.backgroundColor =[UIColor colorWithRed:188/255.0 green:188/255.0 blue:188/255.0 alpha:1];

        }
            break;
            
            
        case ActionTypeLoading:{
            self.progressView.presentlab.text = @"暂停";
            self.progressView.bgimg.backgroundColor =[UIColor colorWithRed:188/255.0 green:188/255.0 blue:188/255.0 alpha:1];


            OYWeakObj(self)
            [[[Downloader shared]pending]enumerateObjectsUsingBlock:^(OYDownloadModel *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                
                if ([obj.downID isEqualToString:self.model._id]) {
                    
                    [weakself.progressView setPresent:obj.progress.progress];
                    
                    *stop = YES;
                }
            }];
        }
            break;
            
            
        case ActionTypeOpen:
            self.progressView.presentlab.text =  @"打开";
            break;
            
        default:
            break;
    }
    
}



- (IBAction)buttonClick{
    NSString* eid=self.model._id;
    
    if(self.buttonStatus==ActionTypeDown||self.buttonStatus==ActionTypeUpdate){
                
        if([[GM_User userExperiment] valueForKey:eid]) {
            [[Downloader shared]download:self.model];
        }else{
            Puerchaser* pr=[Puerchaser new];
            pr.item=self.model;
            pr.couponModel=nil;
            [pr purchase];
        }
        self.buttonStatus = ActionTypeLoading;
        
    }else if(self.buttonStatus==ActionTypeBuy){
        
        DYConfirmOrderController *VC = [DYConfirmOrderController new];
        VC.model = self.model;
        [[GM_APP rootNav] pushViewController:VC animated:YES];
        
    }else if(self.buttonStatus==ActionTypeOpen){
        
        [[Downloader shared]open:self.model];
        
    }else if(self.buttonStatus==ActionTypePause){
        
        [[Downloader shared]download:self.model];
        self.buttonStatus = ActionTypeLoading;

    }else if(self.buttonStatus==ActionTypeLoading){
        
//        if ( [@[@"iPhone 4",@"iPhone 4S",@"iPhone 5",@"iPhone 5c"]containsObject: [Utils iphoneType]]) {
//            return;
//        }
        
        [[Downloader shared]pauseDown:self.model];
        self.buttonStatus = ActionTypePause;
        
    }else if(self.buttonStatus==ActionTypeLook){
        [Utils toExpDetail:[GM_APP rootNav] expModel:self.model];
    }
}


- (IBAction)backClick:(UIButton *)sender {
    if (self.backClick) {
        self.backClick();
    }
}


-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeObserver:self forKeyPath:@"buttonStatus"];
}


@end
