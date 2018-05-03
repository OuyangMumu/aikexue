//
//  DY_RechargeController.h
//  rcpi
//
//  Created by Ray on 2017/6/19.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "DYBaseViewController.h"

@interface DY_RechargeController : DYBaseViewController

@end


@interface WalletProduct : NSObject<YYModel>

@property (nonatomic,copy)NSString  *_id ;//:"io.dyang.aikexue_01",
@property (nonatomic,copy)NSString  * money;//:1,
@property (nonatomic,copy)NSString  *price;//
@property (nonatomic,assign)NSInteger count;//
@end
