//
//  ServeUrlModel.m
//  rcpi
//
//  Created by Ray on 2017/7/15.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "ServeUrlModel.h"

static ServeUrlModel *manager;


@implementation ServeUrlModel

+(instancetype)sharedServeUrlModel{

    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[ServeUrlModel alloc] init];
    });
    return manager;
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

-(NSDictionary *)serveDic{

    if (!_serveDic) {
        id path =  [[NSBundle mainBundle]pathForResource:@"ServerUrl" ofType:@"plist"];
        _serveDic  = [[NSDictionary alloc]initWithContentsOfFile:path];
        
    }
    return _serveDic;
}


-(void)setSelfWith:(NSString *)serve{
    
    
    [ServeUrlModel modelWithJSON:self.serveDic[serve]];
    
    self.serviceType = serve;
    
}

@end

