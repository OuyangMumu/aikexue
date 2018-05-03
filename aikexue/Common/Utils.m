//
//  Utils.m
//  aikexue
//
//  Created by Centny on 03/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import "Utils.h"
#import "DYCommonWebViewController.h"
#import "DYExperimentDetaileVC.h"
#import <sys/utsname.h>
#import "UIImage+DY_Resize.h"
static NSString* gRid;//推送 rid

@implementation Utils

+(NSDecimalNumber*)price:(DYExperimentModel*)item{
    return [Utils price:item coupon:nil];
}

+(NSDecimalNumber*)price:(DYExperimentModel*)item coupon:(DYUserCouponModel*)coupon{
    NSDecimalNumber* srcPrice=[NSDecimalNumber decimalNumberWithDecimal:[item.price decimalValue]];
    NSDecimalNumber* favorPrice=[NSDecimalNumber decimalNumberWithDecimal:[item.favor decimalValue]];
    NSDecimalNumber* real=[srcPrice decimalNumberBySubtracting:favorPrice];
    if(coupon){
        NSDecimalNumber* couponPrice=[NSDecimalNumber decimalNumberWithDecimal:[coupon.price decimalValue]];
        
        real=[real decimalNumberBySubtracting:couponPrice];
    }
    if([real compare:[NSDecimalNumber zero]]==NSOrderedAscending){
        real=[NSDecimalNumber zero];
    }
    
    return real;
}

+(bool)iszero:(NSDecimalNumber*)val{
    return [val compare:[NSDecimalNumber zero]]==NSOrderedSame;
}

+(void)alert:(NSString*)title msg:(NSString*)msg{
    [Utils alert:title msg:msg delegate:nil];
}

+(void)alert:(NSString*)title msg:(NSString*)msg delegate:(id)delegate{
    UIAlertView* alert=[[UIAlertView alloc]initWithTitle:title message:msg delegate:delegate cancelButtonTitle:@"确定" otherButtonTitles:nil];
    [alert show];
}


+(BOOL)iszeroOrHasDowned:(DYExperimentModel*)item{

    //已购买  价格为免费
    if ([[GM_User userExperiment] valueForKey:item._id] || [item.price isEqualToNumber:@0]) {
        return YES;
    }
    return NO;
}

+(void)buySuccess:(DYExperimentModel *)item{

    if ([item.type isEqualToString:EXAM_TYPE_EXAM]) {
        [GM_User.userExperiment setValue:[item modelToJSONObject] forKey:item._id];
        [GM_User saveExperiments];
        
        [[Downloader shared]download:item];
        
        if([item.price floatValue]!=0){
            NSNotification* notice = [NSNotification notificationWithName:N_PURCHASED object:@{@"exam_id":item._id}];
            [[NSNotificationCenter defaultCenter] postNotification:notice];
        }
    }else  if ([item.type isEqualToString:EXAM_TYPE_PACKAGE]){
        [GM_User.userExperiment setValue:[item modelToJSONObject] forKey:item._id];

        // 实验包 子实验保存
        if (item.examIds.count>0) {
            for (NSString  *subID in item.examIds) {
                [GM_User.userExperiment setValue:@{subID:subID} forKey:subID];
            }
            [GM_User saveExperiments];
        }
        
        NSNotification* notice = [NSNotification notificationWithName:N_PURCHASED object:@{@"exam_id":item._id}];
        [[NSNotificationCenter defaultCenter] postNotification:notice];
    }
}

+(NSString *)timeStringWith:(NSString *)timeInterval formatter:(NSString *)dateFormat{
    
    if (![timeInterval isKindOfClass:[NSString class]]) {
        timeInterval = [NSString stringWithFormat:@"%@",timeInterval];
    }
    if (!notNilOrNull(timeInterval)) {
        return nil;
    }
    if ([timeInterval isEqualToString:@"0"]||[timeInterval isEqualToString:@"(null)"]) {
        return nil;
    }
    
    NSTimeInterval interval=[timeInterval doubleValue] / 1000.0;
    
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:interval];
    NSDateFormatter  *formatter = [[NSDateFormatter alloc] init];
    formatter.dateFormat = dateFormat;
    return [formatter stringFromDate: date];
    
}
+(NSDictionary *)jsonStrToDictnry:(NSString *)jsonString {
    
    if (jsonString == nil)
        return nil;
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
    
    if(err) {
        NSLog(@"json解析失败：%@",err);
        return nil;
    }
    return dic;
    
}
+(void)storeMain:(NSString*)rid{
    NSUserDefaults* def=[NSUserDefaults standardUserDefaults];
    [def setValue:rid forKey:@"_g_rid"];
    [def synchronize];
}

+(NSString*)loadRid{
    if(gRid) {
        return gRid;
    }
    NSUserDefaults* def=[NSUserDefaults standardUserDefaults];
    gRid=[def valueForKey:@"_g_rid"];
    if(gRid==nil){
        return nil;
    }
    return gRid;
    
}


NSString* sizeString(long size){
    double tsize=size;
    tsize=tsize/1024;
    if(tsize<1024){
        return [NSString stringWithFormat:@"%.1fKB",tsize];
    }
    tsize=tsize/1024;
    if(tsize<1024){
        return [NSString stringWithFormat:@"%.1fMB",tsize];
    }
    return [NSString stringWithFormat:@"%.1fGB",tsize];
}

+(UIImage *)imageWithColor:(UIColor *)color {
    CGRect rect = CGRectMake(0.0f,0.0f, 1.0f,1.0f);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context =UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    UIImage *image =UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

+ (id)colorWithString:(NSString *)hex
{
    if (![@"#" isEqualToString :[hex substringToIndex:1]]) {
        return NULL;
    }
    unsigned int r, g, b, a = 255;
    switch (hex.length) {
        case 4:
        {
            char val;
            val = [hex characterAtIndex:1];
            r	= strtoul(&val, 0, 16);
            r	= (r / 15.0 * 255.0);
            val = [hex characterAtIndex:2];
            g	= strtoul(&val, 0, 16);
            g	= (g / 15.0 * 255.0);
            val = [hex characterAtIndex:3];
            b	= strtoul(&val, 0, 16);
            g	= (g / 15.0 * 255.0);
        }
            break;
            
        case 5:
        {
            char val;
            val = [hex characterAtIndex:1];
            r	= strtoul(&val, 0, 16);
            r	= (r / 15.0 * 255.0);
            val = [hex characterAtIndex:2];
            g	= strtoul(&val, 0, 16);
            g	= (g / 15.0 * 255.0);
            val = [hex characterAtIndex:3];
            b	= strtoul(&val, 0, 16);
            b	= (b / 15.0 * 255.0);
            val = [hex characterAtIndex:4];
            a	= strtoul(&val, 0, 16);
            a	= (a / 15.0 * 255.0);
        }
            break;
            
        case 7:
        {
            [[NSScanner scannerWithString:[hex substringWithRange:NSMakeRange(1,2)]] scanHexInt:&r];
            [[NSScanner scannerWithString:[hex substringWithRange:NSMakeRange(3,2)]] scanHexInt:&g];
            [[NSScanner scannerWithString:[hex substringWithRange:NSMakeRange(5,2)]] scanHexInt:&b];
        }
            break;
            
        case 9:
        {
            char val[2];
            val[0]	= [hex characterAtIndex:1];
            val[1]	= [hex characterAtIndex:2];
            r		= strtoul(val, 0, 16);
            val[0]	= [hex characterAtIndex:3];
            val[1]	= [hex characterAtIndex:4];
            g		= strtoul(val, 0, 16);
            val[0]	= [hex characterAtIndex:5];
            val[1]	= [hex characterAtIndex:6];
            b		= strtoul(val, 0, 16);
            val[0]	= [hex characterAtIndex:7];
            val[1]	= [hex characterAtIndex:8];
            a		= strtoul(val, 0, 16);
        }
            break;
            
        default:
            return nil;
    }
    return OYRGBAColor(r, g, b, a);
}


/**
 点击进入实验详情，  可能是实验exam   可能是实验包package   
 后续可能是第三方链接webView   跳转到对应的页面
 去掉实验id的空格

 @param nav <#nav description#>
 @param expModel <#expModel description#>
 */
+(void)toExpDetail:(UINavigationController*)nav expModel:(DYExperimentModel *)expModel{
    if(nav==nil||expModel==nil)return;
    expModel._id=[expModel._id stringByReplacingOccurrencesOfString:@" " withString:@""];
    //去掉空格   可能通知推送时候ID带有空格
 
        DYExperimentDetaileVC *VC = [DYExperimentDetaileVC  new];
        VC.model = expModel;
        [nav pushViewController:VC animated:YES];
    
}

/**
 打开一个webView

 @param nav <#nav description#>
 @param model <#url description#>
 */
+(void)toWebView:(UINavigationController*)nav url:(DYUserNotifiModel*)model{
    DYCommonWebViewController *webView=[DYCommonWebViewController new];
    webView.model=model;
    [nav pushViewController:webView animated:YES];
}



+(NSString*)iphoneType{
    
    //需要导入头文件：#import <sys/utsname.h>
    
    struct utsname systemInfo;
    
    uname(&systemInfo);
    
    NSString*platform = [NSString stringWithCString: systemInfo.machine encoding:NSASCIIStringEncoding];
    
    if([platform isEqualToString:@"iPhone1,1"]) return@"iPhone 2G";
    
    if([platform isEqualToString:@"iPhone1,2"]) return@"iPhone 3G";
    
    if([platform isEqualToString:@"iPhone2,1"]) return@"iPhone 3GS";
    
    if([platform isEqualToString:@"iPhone3,1"]) return@"iPhone 4";
    
    if([platform isEqualToString:@"iPhone3,2"]) return@"iPhone 4";
    
    if([platform isEqualToString:@"iPhone3,3"]) return@"iPhone 4";
    
    if([platform isEqualToString:@"iPhone4,1"]) return@"iPhone 4S";
    
    if([platform isEqualToString:@"iPhone5,1"]) return@"iPhone 5";
    
    if([platform isEqualToString:@"iPhone5,2"]) return@"iPhone 5";
    
    if([platform isEqualToString:@"iPhone5,3"]) return@"iPhone 5c";
    
    if([platform isEqualToString:@"iPhone5,4"]) return@"iPhone 5c";
    
    if([platform isEqualToString:@"iPhone6,1"]) return@"iPhone 5s";
    
    if([platform isEqualToString:@"iPhone6,2"]) return@"iPhone 5s";
    
    if([platform isEqualToString:@"iPhone7,1"]) return@"iPhone 6 Plus";
    
    if([platform isEqualToString:@"iPhone7,2"]) return@"iPhone 6";
    
    if([platform isEqualToString:@"iPhone8,1"]) return@"iPhone 6s";
    
    if([platform isEqualToString:@"iPhone8,2"]) return@"iPhone 6s Plus";
    
    if([platform isEqualToString:@"iPhone8,4"]) return@"iPhone SE";
    
    if([platform isEqualToString:@"iPhone9,1"]) return@"iPhone 7";
    
    if([platform isEqualToString:@"iPhone9,2"]) return@"iPhone 7 Plus";
    
    if([platform isEqualToString:@"iPhone10,1"]) return@"iPhone 8";
    
    if([platform isEqualToString:@"iPhone10,4"]) return@"iPhone 8";
    
    if([platform isEqualToString:@"iPhone10,2"]) return@"iPhone 8 Plus";
    
    if([platform isEqualToString:@"iPhone10,5"]) return@"iPhone 8 Plus";
    
    if([platform isEqualToString:@"iPhone10,3"]) return@"iPhone X";
    
    if([platform isEqualToString:@"iPhone10,6"]) return@"iPhone X";
    
    if([platform isEqualToString:@"iPod1,1"]) return@"iPod Touch 1G";
    
    if([platform isEqualToString:@"iPod2,1"]) return@"iPod Touch 2G";
    
    if([platform isEqualToString:@"iPod3,1"]) return@"iPod Touch 3G";
    
    if([platform isEqualToString:@"iPod4,1"]) return@"iPod Touch 4G";
    
    if([platform isEqualToString:@"iPod5,1"]) return@"iPod Touch 5G";
    
    if([platform isEqualToString:@"iPad1,1"]) return@"iPad 1G";
    
    if([platform isEqualToString:@"iPad2,1"]) return@"iPad 2";
    
    if([platform isEqualToString:@"iPad2,2"]) return@"iPad 2";
    
    if([platform isEqualToString:@"iPad2,3"]) return@"iPad 2";
    
    if([platform isEqualToString:@"iPad2,4"]) return@"iPad 2";
    
    if([platform isEqualToString:@"iPad2,5"]) return@"iPad Mini 1G";
    
    if([platform isEqualToString:@"iPad2,6"]) return@"iPad Mini 1G";
    
    if([platform isEqualToString:@"iPad2,7"]) return@"iPad Mini 1G";
    
    if([platform isEqualToString:@"iPad3,1"]) return@"iPad 3";
    
    if([platform isEqualToString:@"iPad3,2"]) return@"iPad 3";
    
    if([platform isEqualToString:@"iPad3,3"]) return@"iPad 3";
    
    if([platform isEqualToString:@"iPad3,4"]) return@"iPad 4";
    
    if([platform isEqualToString:@"iPad3,5"]) return@"iPad 4";
    
    if([platform isEqualToString:@"iPad3,6"]) return@"iPad 4";
    
    if([platform isEqualToString:@"iPad4,1"]) return@"iPad Air";
    
    if([platform isEqualToString:@"iPad4,2"]) return@"iPad Air";
    
    if([platform isEqualToString:@"iPad4,3"]) return@"iPad Air";
    
    if([platform isEqualToString:@"iPad4,4"]) return@"iPad Mini 2G";
    
    if([platform isEqualToString:@"iPad4,5"]) return@"iPad Mini 2G";
    
    if([platform isEqualToString:@"iPad4,6"]) return@"iPad Mini 2G";
    
    if([platform isEqualToString:@"iPad4,7"]) return@"iPad Mini 3";
    
    if([platform isEqualToString:@"iPad4,8"]) return@"iPad Mini 3";
    
    if([platform isEqualToString:@"iPad4,9"]) return@"iPad Mini 3";
    
    if([platform isEqualToString:@"iPad5,1"]) return@"iPad Mini 4";
    
    if([platform isEqualToString:@"iPad5,2"]) return@"iPad Mini 4";
    
    if([platform isEqualToString:@"iPad5,3"]) return@"iPad Air 2";
    
    if([platform isEqualToString:@"iPad5,4"]) return@"iPad Air 2";
    
    if([platform isEqualToString:@"iPad6,3"]) return@"iPad Pro 9.7";
    
    if([platform isEqualToString:@"iPad6,4"]) return@"iPad Pro 9.7";
    
    if([platform isEqualToString:@"iPad6,7"]) return@"iPad Pro 12.9";
    
    if([platform isEqualToString:@"iPad6,8"]) return@"iPad Pro 12.9";
    
    if([platform isEqualToString:@"i386"]) return@"iPhone Simulator";
    
    if([platform isEqualToString:@"x86_64"]) return@"iPhone Simulator";
    
    return platform;
    
}

///对图片压缩处理完成
+ (NSData *)imageCompressWithOldImages:(UIImage *)oldImage{
    
    
    CGSize  oldSize = oldImage.size;
    CGSize newSize;
    newSize.width = oldSize.width / 2;
    newSize.height = oldSize.height / 2;
    
    NSData *photoOldData = UIImageJPEGRepresentation(oldImage, 1);
    
    if (!photoOldData) {//图片有损,重新图片.
        
        oldImage = [oldImage resizedImage:newSize interpolationQuality:kCGInterpolationHigh];
        photoOldData = UIImageJPEGRepresentation(oldImage, 1);
        
    }
    
    
    UIImage* resizedImage;
    
    if ([photoOldData length]>500*1024) {
        
        resizedImage = [oldImage resizedImage:newSize interpolationQuality:kCGInterpolationHigh];
    }else{
        resizedImage=oldImage;
    }
    
    
    NSData *photoData;
    if ([photoOldData length]<50*1024) {
        
        photoData = UIImageJPEGRepresentation(resizedImage, 1);
        
    }else if([photoOldData length]<200*1024){
        
        photoData = UIImageJPEGRepresentation(resizedImage, 0.8);
        
    }else{
        
        photoData = UIImageJPEGRepresentation(resizedImage, 0.5);
        
    }
    
    NSLog(@"photoData length == %lu",[photoData length]);
    
    return photoData;
    
}



@end



@implementation NSString(Util)

-(NSMutableAttributedString *)attributeStringWithsubString:(NSString *)subString attributes:(NSDictionary *)attributes{
    
    NSMutableAttributedString *mutString = [[NSMutableAttributedString  alloc]initWithString:self];
    
    NSRange range = [self rangeOfString:subString];
    
    [mutString addAttributes:attributes range:range];
    
    return  mutString;
}

-(NSString *)fileSize{
    // 总大小
    unsigned long long size = 0;
    NSString *sizeText = nil;
    // 文件管理者
    NSFileManager *mgr = [NSFileManager defaultManager];
    
    // 文件属性
    NSDictionary *attrs = [mgr attributesOfItemAtPath:self error:nil];
    // 如果这个文件或者文件夹不存在,或者路径不正确直接返回0;
    if (attrs == nil) return @"0M";
    if ([attrs.fileType isEqualToString:NSFileTypeDirectory]) { // 如果是文件夹
        // 获得文件夹的大小  == 获得文件夹中所有文件的总大小
        NSDirectoryEnumerator *enumerator = [mgr enumeratorAtPath:self];
        for (NSString *subpath in enumerator) {
            // 全路径
            NSString *fullSubpath = [self stringByAppendingPathComponent:subpath];
            // 累加文件大小
            size += [mgr attributesOfItemAtPath:fullSubpath error:nil].fileSize;
            
            if (size >= pow(10, 9)) { // size >= 1GB
                sizeText = [NSString stringWithFormat:@"%.2fGB", size / pow(10, 9)];
            } else if (size >= pow(10, 6)) { // 1GB > size >= 1MB
                sizeText = [NSString stringWithFormat:@"%.2fMB", size / pow(10, 6)];
            } else if (size >= pow(10, 3)) { // 1MB > size >= 1KB
                sizeText = [NSString stringWithFormat:@"%.2fKB", size / pow(10, 3)];
            } else { // 1KB > size
                sizeText = [NSString stringWithFormat:@"%zdB", size];
            }
            
        }
        return sizeText;
    } else { // 如果是文件
        size = attrs.fileSize;
        if (size >= pow(10, 9)) { // size >= 1GB
            sizeText = [NSString stringWithFormat:@"%.2fGB", size / pow(10, 9)];
        } else if (size >= pow(10, 6)) { // 1GB > size >= 1MB
            sizeText = [NSString stringWithFormat:@"%.2fMB", size / pow(10, 6)];
        } else if (size >= pow(10, 3)) { // 1MB > size >= 1KB
            sizeText = [NSString stringWithFormat:@"%.2fKB", size / pow(10, 3)];
        } else { // 1KB > size
            sizeText = [NSString stringWithFormat:@"%zdB", size];
        }
        
    }
    return sizeText;
}


-(BOOL)isEmpty{
    if(!self) {
        return true;
    }else {
        
        NSCharacterSet *set = [NSCharacterSet whitespaceAndNewlineCharacterSet];
        
        NSString *trimedString = [self stringByTrimmingCharactersInSet:set];
        
        if([trimedString length] == 0) {
            return true;
        }else {
            return false;
        }
    }
}

@end
