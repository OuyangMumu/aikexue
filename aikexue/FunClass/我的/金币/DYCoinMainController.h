//
//  DYCoinMainController.h
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DYCoinMainController : DYBaseViewController<UITableViewDelegate,UITableViewDataSource>
@property (weak, nonatomic) IBOutlet UIButton *taskButton;
@property (weak, nonatomic) IBOutlet UIButton *exchangeButton;

@end

@interface DYCoinRecodeModel:NSObject

@property (nonatomic,copy)NSString *coin;//":10,
@property (nonatomic,strong)NSNumber *createTime;//":1511333115000,
@property (nonatomic,strong)NSNumber *flowType;//":10,
@property (nonatomic,copy)NSString *title;//":"游戏收入"

@end
