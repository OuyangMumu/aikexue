//
//  DYFeedBackModel.h
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DYFeedBackModel : NSObject<YYModel>

@property (nonatomic,copy)NSString *_id;// "A59df347fd624d3638016283f",
@property (nonatomic,copy)NSString *uid;// "u104",
@property (nonatomic,strong)DYAKXUserModel *uidModel;
@property (nonatomic,copy)NSString *context;// "hhh",
@property (nonatomic,strong)NSArray *images;// [],
@property (nonatomic,strong)NSDictionary *contact;// {},
@property (nonatomic,copy)NSString *phone;//": "123456789",
@property (nonatomic,copy)NSString *qq;//": "87654321",
@property (nonatomic,copy)NSString *weixin;//": "qwertyui"
@property (nonatomic,strong)NSArray *thumpUp;//": []
@property (nonatomic,strong)DYFeedBackModel *reply;
@property (nonatomic,copy)NSString *ip;// "192.168.2.18",
@property (nonatomic,copy)NSString *status;// "NORMAL",
@property (nonatomic,strong)NSNumber *createTime;// 1507800191657,
@property (nonatomic,strong)NSNumber *lastTime;// 1507800214441






@end
