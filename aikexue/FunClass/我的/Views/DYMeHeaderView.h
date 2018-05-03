//
//  DYMeHeaderView.h
//  aikexue
//
//  Created by Ray on 2017/10/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^MeHeaderClick)(NSInteger);

@interface DYMeHeaderView : UIView
@property (weak, nonatomic) IBOutlet UIImageView *iconImg;
@property (weak, nonatomic) IBOutlet UILabel *nameLab;
@property (weak, nonatomic) IBOutlet UIButton *addBodyButton;
@property (weak, nonatomic) IBOutlet UIView *huxian;
@property (copy, nonatomic) MeHeaderClick headClick;
@property (weak, nonatomic) IBOutlet UIImageView *sexImage;
@property (weak, nonatomic) IBOutlet UIImageView *addImage;

+(instancetype)loadFromNibWithFrame:(CGRect)frame;

-(void)refreshHeader;


@end
