//
//  DY_OrderModel.h
//  aikexue
//
//  Created by Ray on 2017/11/20.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DY_OrderModel : NSObject <YYModel>

@property (nonatomic,copy)NSString *SOURCE;// "",
@property (nonatomic,copy)NSString *buyer;// "u279953",
@property (nonatomic,strong)NSNumber *cancel_time;// 0,
@property (nonatomic,strong)NSNumber *create_time;// 1511165713000,
@property (nonatomic,copy)NSString *host;// "akxs.dev.gdy.io",
@property (nonatomic,strong)NSArray *items;// [
@property (nonatomic,copy)NSString *ono;// "201711201615130000000060",
@property (nonatomic,copy)NSString *pay_ono;// null,
@property (nonatomic,strong)NSNumber *pay_time;// 0,
@property (nonatomic,strong)NSNumber *pay_type;// 0,
@property (nonatomic,strong)NSNumber *price;// 0.01,
@property (nonatomic,strong)NSNumber *refund_time;// 0,
@property (nonatomic,copy)NSString *return_url;// "http://akxs.dev.gdy.io",
@property (nonatomic,copy)NSString *seller;// "u0",
@property (nonatomic,strong)NSNumber *status;// 100,
@property (nonatomic,strong)NSNumber *tid;// 4059,
@property (nonatomic,strong)NSNumber *time;// 1511165713000,
@property (nonatomic,strong)NSNumber *type;// 10


@end
