//
//  Utils.h
//  aikexue
//
//  Created by Centny on 03/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "DYExperimentModel.h"
#import "DYUserNotifiModel.h"


@interface Utils : NSObject

#define IOS8 ([[[UIDevice currentDevice] systemVersion] doubleValue] >=8.0 ? YES : NO)
#define SYSTEM_NOTICE_TYPE 10
#define COUPON_NOTICE_TYPE 11
#define EXAM_NOTICE_TYPE 12
#define EXAM_PACKAGE_NOTICE_TYPE 13
#define UNREAD 1

+(NSDecimalNumber*)price:(DYExperimentModel *)item;

+(NSDecimalNumber*)price:(DYExperimentModel*)item coupon:(DYUserCouponModel*)coupon;
+(bool)iszero:(NSDecimalNumber*)val;
+(void)alert:(NSString*)title msg:(NSString*)msg;
+(void)alert:(NSString*)title msg:(NSString*)msg delegate:(id)delegate;
+(NSString *)timeStringWith:(NSString *)timeInterval formatter:(NSString *)dateFormat;
+(NSDictionary *)jsonStrToDictnry:(NSString *)jsonString;
+(BOOL)iszeroOrHasDowned:(DYExperimentModel*)item;
+(NSString *)timeStringWith:(NSString *)timeInterval formatter:(NSString *)dateFormat;

+(NSString*)iphoneType;

+(void)buySuccess:(DYExperimentModel *)item;

+(NSString*)loadRid;//推送的id
+(void)storeMain:(NSString*)rid;

+(UIImage *)imageWithColor:(UIColor *)color ;
+ (id)colorWithString:(NSString *)hex;

NSString* sizeString(long size);

//点击进入实验详情，  可能是实验exam   可能是实验包package   后续可能是第三方链接webView   跳转到对应的页面
//去掉实验id的空格
+(void)toExpDetail:(UINavigationController*)nav expModel:(DYExperimentModel *)expModel;


//打开一个webView
+(void)toWebView:(UINavigationController*)nav url:(DYUserNotifiModel*)model;
+ (NSData *)imageCompressWithOldImages:(UIImage *)oldImage;

@end

@interface NSString(Util)

-(NSMutableAttributedString *)attributeStringWithsubString:(NSString *)subString attributes:(NSDictionary *)attributes;
-(NSString *)fileSize;

-(BOOL)isEmpty;

@end


