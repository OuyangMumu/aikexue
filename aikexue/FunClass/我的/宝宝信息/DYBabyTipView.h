//
//  DYBabyTipView.h
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>


typedef void(^datePickClick)(NSDate *date);

@interface DYBabyTipView : UIView

+(instancetype)loadFromNib;

@property (weak, nonatomic) IBOutlet UIView *tipView;
@property (weak, nonatomic) IBOutlet UIView *dataView;
@property (weak, nonatomic) IBOutlet UIDatePicker *datePick;
@property (assign,nonatomic) BOOL showDatePick;
@property (nonatomic,copy)datePickClick dateCall;

-(void)show;

-(void)dismiss;

@end
