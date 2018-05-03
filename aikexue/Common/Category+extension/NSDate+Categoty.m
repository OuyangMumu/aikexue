//
//  NSDate+Categoty.m
//  rcpi
//
//  Created by Dyang on 16/5/6.
//  Copyright © 2016年 itdayang. All rights reserved.
//

#import "NSDate+Categoty.h"

#define D_MINUTE	60
#define D_HOUR	3600
#define D_DAY	86400
#define D_WEEK	604800
#define D_YEAR	31556926

#define DATE_COMPONENTS (NSCalendarUnitYear| NSCalendarUnitMonth | NSCalendarUnitDay | NSCalendarUnitWeekOfMonth | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond | NSCalendarUnitWeekday | NSCalendarUnitWeekdayOrdinal)

#define CURRENT_CALENDAR [NSCalendar currentCalendar]

@implementation NSDate (Categoty)


+(NSCalendar *)currentCalendar{
    static NSCalendar *sharedCalendar = nil;
    if (!sharedCalendar)
        sharedCalendar = [NSCalendar autoupdatingCurrentCalendar];
    return sharedCalendar;
}

-(BOOL)isToday{
    return [self isEqualToDateIgnoringTime:[NSDate date]];
}

-(BOOL)isYesterday{
    return [self isEqualToDateIgnoringTime:[NSDate dateYesterday]];
}

-(BOOL)isThisWeek{
    return [self isSameWeekAsDate:[NSDate date]];
}



-(BOOL)isEqualToDateIgnoringTime: (NSDate *)aDate{
    NSDateComponents *components1 = [CURRENT_CALENDAR components:DATE_COMPONENTS fromDate:self];
    NSDateComponents *components2 = [CURRENT_CALENDAR components:DATE_COMPONENTS fromDate:aDate];
    return ((components1.year == components2.year) &&
            (components1.month == components2.month) &&
            (components1.day == components2.day));
}

-(BOOL)isSameWeekAsDate:(NSDate *)aDate{
    NSDateComponents *components1 = [CURRENT_CALENDAR components:DATE_COMPONENTS fromDate:self];
    NSDateComponents *components2 = [CURRENT_CALENDAR components:DATE_COMPONENTS fromDate:aDate];
    // Must be same week. 12/31 and 1/1 will both be week "1" if they are in the same week
    if (components1.weekOfYear != components2.weekOfYear) return NO;
    // Must have a time interval under 1 week. Thanks @aclark
    return (fabs([self timeIntervalSinceDate:aDate]) < D_WEEK);
}

+(NSDate *)dateYesterday{
    return [NSDate dateWithDaysBeforeNow:1];
}

+(NSDate *)dateWithDaysBeforeNow:(NSInteger)days{
    // Thanks, Jim Morrison
    return [[NSDate date] dateBySubtractingDays:days];
}

-(NSDate *)dateBySubtractingDays:(NSInteger)dDays{
    return [self dateByAddingDays: (dDays * -1)];
}

-(NSDate *)dateByAddingDays:(NSInteger)dDays{
    NSTimeInterval aTimeInterval = [self timeIntervalSinceReferenceDate] + D_DAY * dDays;
    NSDate *newDate = [NSDate dateWithTimeIntervalSinceReferenceDate:aTimeInterval];
    return newDate;
}


-(NSString *)dayFromWeekday{
    return [NSDate dayFromWeekday:self];
}


+(NSString *)dayFromWeekday:(NSDate *)date{
    switch([date weekday]) {
        case 1:
            return @"星期天";
            break;
        case 2:
            return @"星期一";
            break;
        case 3:
            return @"星期二";
            break;
        case 4:
            return @"星期三";
            break;
        case 5:
            return @"星期四";
            break;
        case 6:
            return @"星期五";
            break;
        case 7:
            return @"星期六";
            break;
        default:
            break;
    }
    return @"";
}


-(NSInteger)weekday{
    return [NSDate weekday:self];
}

+(NSInteger)weekday:(NSDate *)date{
    NSCalendar *gregorian = [[NSCalendar alloc]
                             initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSDateComponents *comps = [gregorian components:(NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear | NSCalendarUnitWeekday) fromDate:date];
    NSInteger weekday = [comps weekday];
    
    return weekday;
}

@end
