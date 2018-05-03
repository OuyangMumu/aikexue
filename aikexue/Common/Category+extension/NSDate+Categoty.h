//
//  NSDate+Categoty.h
//  rcpi
//
//  Created by Dyang on 16/5/6.
//  Copyright © 2016年 itdayang. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDate (Categoty)

+ (NSCalendar *) currentCalendar;

-(BOOL)isThisWeek;

-(NSString *)dayFromWeekday;

@end
