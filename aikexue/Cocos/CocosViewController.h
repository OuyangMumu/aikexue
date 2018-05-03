//
//  CocosViewController.h
//  rcpi
//
//  Created by Centny on 11/05/2017.
//  Copyright © 2017 itdayang. All rights reserved.
//

#import "DYBaseViewController.h"
#define N_COCOS_OPEN @"cocos_open"
#define N_COCOS_CLOSED @"cocos_closed"

@interface CocosViewController : DYBaseViewController
@property(nonatomic)NSString* eid;
@property(nonatomic)IBOutlet UIView* bg;
+(void)stop;
+(bool)dounzip:(NSString*)zip dir:(NSString*)dir;
@end
