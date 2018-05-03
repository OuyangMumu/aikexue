//
//  DYGameViewCell.h
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CustomProgress.h"

typedef void(^BackBlock)(void);

@interface DYGameViewCell : UITableViewCell

@property (nonatomic,strong)DYExperimentModel *model;
@property (weak, nonatomic) IBOutlet UIImageView *iconImage;
@property (weak, nonatomic) IBOutlet UIImageView *headBg;
@property (weak, nonatomic) IBOutlet UIButton *backButton;

@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UILabel *sizeLab;
@property (weak, nonatomic) IBOutlet UIScrollView *ImagesScroll;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *ImageScrollH;
@property (weak, nonatomic) IBOutlet UILabel *desLab;
//@property (weak, nonatomic) IBOutlet UIButton *actionButton;

@property (nonatomic,assign)NSInteger buttonStatus;
//@property (weak, nonatomic) IBOutlet UIProgressView *progressView;
@property (weak, nonatomic) IBOutlet CustomProgress *progressView;

@property (nonatomic,copy)BackBlock backClick;


//- (IBAction)buttonClick:(UIButton *)sender;




@end
