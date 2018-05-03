//
//  DYListUITipView.h
//  aikexue
//
//  Created by Ray on 2017/8/15.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol ListUITipDelegate < NSObject >

-(void)listUITipClick;

@end

@interface DYListUITipView : UIView
@property (weak, nonatomic) IBOutlet UIView *content;
@property (weak, nonatomic) IBOutlet UIImageView *icon;
@property (weak, nonatomic) IBOutlet UILabel *tipLab;
@property (weak, nonatomic) IBOutlet UIButton *tipButton;

@property (nonatomic,weak)id <ListUITipDelegate> tipDelegate;//

-(void)resetUI:(NSString *)icon and:(NSString *)tipLab and:(NSString *)tipButton;

- (IBAction)tipClick:(UIButton *)sender;

@end
