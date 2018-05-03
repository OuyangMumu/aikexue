//
//  DYExperimentMainCell.h
//  aikexue
//
//  Created by Ray on 2017/7/28.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYExperimentModel.h"
#import "DYExperimentActionView.h"

@interface DYExperimentMainCell : UICollectionViewCell

@property (weak, nonatomic) IBOutlet UIImageView *icon;

@property (weak, nonatomic) IBOutlet UILabel *title;

@property (weak, nonatomic) IBOutlet UILabel *descLab;
@property (weak, nonatomic) IBOutlet DYExperimentActionView *actionView;
@property (weak, nonatomic) IBOutlet UIButton *suitBtn;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *actionViewW;

@property (nonatomic,strong)DYExperimentModel *experimentModel;

@end
