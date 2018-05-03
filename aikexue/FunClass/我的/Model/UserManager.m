//
//  UserManager.m
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "UserManager.h"


@implementation DYUserModelbasic


@end


@implementation DYUserModelextra


@end


@implementation DYUserModelprivated


+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    
    return @{
             @"unionId":@"weixin.unionId",
             @"openId":@"weixin.openId",
             @"template":@"templates"
             };
}

@end

@implementation UserManager

+(instancetype)shareUser{
    static id instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });

    return instance;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static id instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:zone];
    });
    return instance;
}

- (id)copyWithZone:(nullable NSZone *)zone{
    return self;
}

-(DYUserModelprivated *)privated{
    
    if (!_privated) {
        _privated = [DYUserModelprivated new];
    }
    return _privated;
}

-(DYUserModelbasic *)basic{
    if (!_basic) {
        _basic = [DYUserModelbasic new];
    }
    return  _basic;
}


-(DYUserModelextra *)extra{
    if (!_extra) {
        _extra = [DYUserModelextra new];
    }
    return _extra;
}

-(NSString *)usrImg{
    
    if ([_usrImg hasSuffix:@"/icon/user_head.png"]) {
        return @"";
    }
    return _usrImg;
}

-(BOOL)isLogin{
    if (self.privated.phone.length>0) {
        return YES;
    }
    return _isLogin;
}

-(NSMutableArray *)coupons{
    if (!_coupons) {
        _coupons = [NSMutableArray new];
    }
    return _coupons;
}

-(NSMutableDictionary *)userExperiment{
    
    if (!_userExperiment) {
        _userExperiment = [NSMutableDictionary new];
        
        [self loadLocalExperiment];
    }
    return _userExperiment;
}

-(void)saveExperiments{
    
    [[NSUserDefaults standardUserDefaults]setObject:GM_User.userExperiment forKey:[NSString stringWithFormat:@"%@Experiment",GM_User.userId]];
    
    [[NSUserDefaults standardUserDefaults] synchronize];
}

-(NSMutableDictionary*) downloaded{
    return [Downloader shared].downloaded;
}

-(void)setWifiOnly:(BOOL)wifiOnly{
    _wifiOnly = wifiOnly;
    NSUserDefaults* def=[NSUserDefaults standardUserDefaults];
    [def setBool:wifiOnly forKey:@"WIFIOnly"];
    [def synchronize];
}


-(bool)isUpdated:(NSString*)eid{
    
    NSDictionary* downloaded=[[[Downloader shared]downloaded]valueForKey:eid];
    NSDictionary* purchared=[GM_User.userExperiment valueForKey:eid];
    if(downloaded==nil||purchared==nil){
        return false;
    }
    int dver=[[[downloaded valueForKey:@"version"]valueForKey:@"ios"]intValue];
    int sver=[[[purchared valueForKey:@"version"]valueForKey:@"ios"]intValue];
    
    return dver>0&&sver>0&&sver>dver;
}

+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    
    return @{
             @"userId":@"id",
             @"usrImg":@"attrs.basic.avatar",
             @"userName":@"attrs.basic.nickName",
             @"basic":@"attrs.basic",
             @"certification":@"attrs.certification",
             @"extra":@"attrs.extra",
             @"pass":@"attrs.pass",
             @"role":@"attrs.role",
             @"tags":@"attrs.tags",
             @"privated":@"attrs.privated",
             @"orgPrivate":@"attrs.orgPrivate",
             @"orgInfo":@"attrs.orgInfo",
             @"org":@"attrs.org",
             @"third":@"attrs.third",
             @"archive":@"attrs.archive",
             @"experience":@"attrs.experience"
             };
}


+(NSDictionary<NSString *,id> *)modelContainerPropertyGenericClass{
    
    return @{
             @"basic":[DYUserModelbasic class],
             @"extra":[DYUserModelprivated class],
             @"privated":[DYUserModelprivated class]
             };
}

//登录成功
-(void)loginSuccess:(id)data{
    
    [self resetPropertyWithClass];
    [self initUserModel:data];
    self.wifiOnly =  [[NSUserDefaults standardUserDefaults]boolForKey:@"WIFIOnly"];
    [AppDelegate registNotice];
}


//获取属性名,清空属性值
-(void)resetPropertyWithClass{
    
    unsigned int numProperty = 0;
    objc_property_t *propertys = class_copyPropertyList([self class], &numProperty);
    for (int i = 0; i<numProperty; i++) {
        objc_property_t property = propertys[i];
        NSString *propretyStr = [NSString stringWithFormat:@"%s",property_getName(property)];
        
        //        [self setValue:nil forKey:propretyStr];
        
    }
    GM_User.privated = nil;
    GM_User.basic = nil;
    GM_User.extra = nil;
    GM_User.userExperiment = nil;
    GM_User.userToken = nil;
    GM_User.isLogin = YES;
    GM_User.hasRegNotic = NO;
    
}



/**
 初始化 用户信息
 
 @param data <#data description#>
 */
-(void)initUserModel:(id)data{
    
    [UserManager  modelWithJSON:data[@"data"][@"usr"]];
    GM_User.userToken = data[@"data"][@"token"];
    [[NSNotificationCenter defaultCenter]postNotificationName:LoginSuccessNotification object:nil];
    
    [[NSUserDefaults standardUserDefaults]setValue:GM_User.userToken forKey:loginToken];
    [[NSUserDefaults standardUserDefaults]synchronize];
    self.wifiOnly = YES;
    [self loadAllExperiment];
    [self listMyCoupon:NO];
}

//重启APP
-(void)restartApp{

    //重新信息
    NSString *token =   [[NSUserDefaults standardUserDefaults]valueForKey:loginToken];

    if(token){
        GM_User.userToken = token;
        [self refreshUserInfo:nil];
    }else {
        [self loadAutoUser:nil];
    }
}

-(void)loadAutoUser:(void(^)(BOOL success,id data))callBack{
    
    OYWeakObj(self);
    [DYNetworking  getWithUrl:[SSO_SRV stringByAppendingString:@"/sso/api/createAuto?login=1&source=IOS"] params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            [weakself loginSuccess:response];
            
            [[NSUserDefaults standardUserDefaults]setValue:weakself.userToken forKey:loginTokenAuto];
            [[NSUserDefaults standardUserDefaults]synchronize];

            GM_User.isLogin = NO;

            if (callBack) {
                callBack(YES,response);
            }
        }else{
            if (callBack) {
                callBack(NO,response);
            }
        }
    } fail:^(NSError *error) {
        if (callBack) {
            callBack(NO,nil);
        }
    } showHUD:nil];
}


//刷新用户信息
-(void)refreshUserInfo:(void(^)(BOOL success,id data))callBack{
    
    //重新信息
    NSString *token = [[NSUserDefaults standardUserDefaults]valueForKey:loginToken];
    NSString *autoToken =  [[NSUserDefaults standardUserDefaults]valueForKey:loginTokenAuto];
    BOOL isauto = NO;
    if ([token isEqualToString:autoToken]) {//游客
        isauto = YES;
    }
    
    NSString *url=@"/sso/api/uinfo";
    NSString *urlStr = [NSString stringWithFormat:@"%@%@?token=%@&selector=%@",SSO_SRV,url,GM_User.userToken,@"basic,extra,privated"];
    OYWeakObj(self);
    [DYNetworking  getWithUrl:urlStr params:nil success:^(id response) {
       
        if ([response[@"code"] integerValue]==0) {
            [weakself loginSuccess:response];
            
            if (isauto) {//游客
                [[NSUserDefaults standardUserDefaults] setValue:weakself.userToken forKey:loginTokenAuto];
                [[NSUserDefaults standardUserDefaults]synchronize];

            }
            GM_User.isLogin = !isauto;
            
            if (callBack) {
                callBack(YES,response);
            }
        }else{
            if (callBack) {
                callBack(NO,response);
            }
        }
    } fail:^(NSError *error) {
        if (callBack) {
            callBack(NO,nil);
        }
    } showHUD:nil];
    
}

-(void)loadAllExperiment{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/listMyExam?_hc_=NO&token=%@&time=%lu",MAIN_SRV,GM_User.userToken,(unsigned long)[[NSDate new]timeIntervalSince1970]) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            NSArray *exams = response[@"data"][@"exams"];
            NSDictionary *examsInPkg = response[@"data"][@"examsInPkg"];
            if (exams && exams.count > 0) {
                for (NSDictionary *dic in exams) {
                    //去除后台返回<null>的值
                    DYExperimentModel *model = [DYExperimentModel modelWithJSON:dic];
                    [[weakself userExperiment]setValue:[model modelToJSONObject] forKey:dic[@"_id"]];
                }
            }
            
            if (notNilOrNull(examsInPkg)) {
                
                [examsInPkg enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                    DYExperimentModel *model = [DYExperimentModel modelWithJSON:obj];
                    
                    [[weakself userExperiment]setValue:[model modelToJSONObject] forKey:key];
                    
                }];
            }
            
            [weakself saveExperiments];
        }else{
            [weakself loadLocalExperiment];
        }
    } fail:^(NSError *error) {
        
        [weakself loadLocalExperiment];
        
    } showHUD:nil];
    
}


-(void)loadLocalExperiment{
    
    //读取本地游戏信息
    NSDictionary *experiment = [[NSUserDefaults standardUserDefaults] valueForKey:[NSString stringWithFormat:@"%@Experiment",GM_User.userId]];
    
    if (notNilOrNull(experiment)) {
        _userExperiment = [NSMutableDictionary dictionaryWithDictionary:experiment];
    }
}

-(void)listMyCoupon:(void(^)(void))success{

    OYWeakObj(self);
    [DYNetworking getWithUrl:[NSString stringWithFormat:@"%@/usr/api/listMyCoupon?token=%@&isOnlyValid=1",MAIN_SRV,GM_User.userToken] params:nil success:^(id response) {

        weakself.coupons = nil;
        if ([response[@"code"] integerValue]==0) {
            NSArray *coupons = response[@"data"][@"coupons"];
            if (notNilOrNull(coupons)&&coupons.count>0) {
                [coupons enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    [weakself.coupons addObject:[DYUserCouponModel modelWithJSON:obj]];
                }];
            }
            if (success) {
                success();
            }
        }
    } fail:^(NSError *error) {
        
    } showHUD:nil];
}

-(void)getInfoInGame:(void(^)(void))success{
    
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/getInfoInGame?token=%@",MAIN_SRV,GM_User.userToken) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            
           [DYCoinPersonInfo modelWithJSON:response[@"data"][@"person"]];
            if (success) {
                success();
            }
        }
    } fail:^(NSError *error) {
    } showHUD:nil];
    
}



@end
