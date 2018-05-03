//
//  UserManager.h
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DYUserModelbasic : NSObject

@property (nonatomic,copy)NSString *email;// "x@itdayang.com",          //用户email
@property (nonatomic,copy)NSString *avatar;// "",                       //用户头像
@property (nonatomic,copy)NSString *desc;// "none",                     //用户简介/签名
@property (nonatomic,copy)NSString *nickName;// "昵称",                 //用户昵称
@property (nonatomic,strong)NSNumber *gender;// 1

@end


@interface DYUserModelextra : NSObject

@property (nonatomic,copy)NSString *country;// "China",                 //国家
@property (nonatomic,copy)NSString *province;// "GD",                   //省份
@property (nonatomic,copy)NSString *city;// "Gz",                       //城市
@property (nonatomic,copy)NSString *district;// "Gz",                   //地区
@property (nonatomic,strong)NSArray *hobby;// ["java", "c++"],           //兴趣爱好
@property (nonatomic,strong)NSArray *specialty;// ["java", "oricle"],    //特长
@property (nonatomic,strong)NSNumber *age;// 20,                          //年龄
@property (nonatomic,strong)NSNumber *birthday;// 1435348465566,          //生日
@property (nonatomic,copy)NSString *job;// "student"                    //职业
@property (nonatomic,copy)NSString *school;//"北京大学",                 //学校
@property (nonatomic,strong)NSArray *profession;//["软件工程","兽医"]      //专业

@end



@interface DYUserModelprivated : NSObject <YYModel>

@property (nonatomic,copy)NSString *phone;// "13413413413"          //用户真正绑定的手机号码
@property (nonatomic,assign)BOOL *phonePending;// true            //用户绑定手机未验证,需要验证后才能使用验证手机登录
@property (nonatomic,strong)NSNumber *start;//1435348465566,          //用户有效期
@property (nonatomic,strong)NSNumber *end;//1435348465566             //用户有效期
@property (nonatomic,copy)NSString *no;//"201230989898"             //用户绑定工号/学号
@property (nonatomic,copy)NSString *unionId;//"usjnfekbfke",
@property (nonatomic,copy)NSString *openId;//"xxx"
@property (nonatomic,strong)NSArray *templates;// []                  //导入的用户在完善资料时必须要填写的模板；该字段存在且为空数组时，用户已完善资料，不为空数组时表示用户未完善资料


@end


@interface UserManager : NSObject <YYModel>

@property (nonatomic,assign)BOOL isLogin;//是否登录
@property (nonatomic,copy)NSString *userToken;
@property (nonatomic,copy)NSString *userId;//"u76046",
@property (nonatomic,strong)NSNumber *account;//"1310613",
@property (nonatomic,strong)NSArray *usr;
@property (nonatomic,copy)NSString *status;
@property (nonatomic,strong)NSNumber *time;// 1482204432576
@property (nonatomic,copy)NSString *usrImg;
@property (nonatomic,copy)NSString *userName;
@property (nonatomic,assign)BOOL hasRegNotic;//是否已经注册通知
@property (nonatomic,assign)BOOL wifiOnly;

//用户已有优惠券
@property (nonatomic,strong)NSMutableArray *coupons;


@property (nonatomic,strong)DYUserModelbasic *basic;
@property (nonatomic,strong)DYUserModelextra *extra;
@property (nonatomic,strong)DYUserModelprivated *privated;

@property (nonatomic,strong)NSDictionary *certification;
@property (nonatomic,strong)NSDictionary *pass;
@property (nonatomic,strong)NSDictionary *role;
@property (nonatomic,strong)NSDictionary *tags;
@property (nonatomic,strong)NSDictionary *orgPrivate;
@property (nonatomic,strong)NSDictionary *orgInfo;
@property (nonatomic,strong)NSDictionary *org;
@property (nonatomic,strong)NSDictionary *third;
@property (nonatomic,strong)NSDictionary *archive;
@property (nonatomic,strong)NSDictionary *experience;

//用户的所有游戏信息
@property (nonatomic,strong)NSMutableDictionary *userExperiment;

-(NSDictionary*) downloaded;
-(bool)isUpdated:(NSString*)eid;

/**
 保存用户游戏
 */
-(void)saveExperiments;

#define EXAM_NAME(eid) [[[[self userExperiment] allKeys]containsObject:eid]valueForKey:@"title"]

+(instancetype)shareUser;

-(void)loginSuccess:(id)data;

-(void)restartApp;

-(void)loadAutoUser:(void(^)(BOOL success,id data))callBack;

-(void)refreshUserInfo:(void(^)(BOOL success,id data))callBack;


//列出用户优惠券
-(void)listMyCoupon:(void(^)(void))success;

//获取金币信息
-(void)getInfoInGame:(void(^)(void))success;

@end
