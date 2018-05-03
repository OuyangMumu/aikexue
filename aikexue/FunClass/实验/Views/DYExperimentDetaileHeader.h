//
//  DYExperimentDetaileHeader.h
//  aikexue
//
//  Created by Ray on 2017/9/5.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DYExperimentDetaileHeader : UICollectionReusableView
@property (weak, nonatomic) IBOutlet UIImageView *bgImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UILabel *sizeLab;
@property (weak, nonatomic) IBOutlet DYExperimentActionView *actionView;

@property (nonatomic,strong)DYExperimentModel *model;


+(instancetype)loadNib;


@end
