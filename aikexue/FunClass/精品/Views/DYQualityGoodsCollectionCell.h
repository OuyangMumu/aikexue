//
//  DYQualityGoodsCollectionCell.h
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYExperimentModel.h"

@interface DYQualityGoodsCollectionCell : UICollectionViewCell

@property (weak, nonatomic) IBOutlet UIImageView *icon;
@property (weak, nonatomic) IBOutlet UILabel *title;
@property (weak, nonatomic) IBOutlet UILabel *price;
@property (weak, nonatomic) IBOutlet UIButton *suitBtn;

@property (nonatomic,strong)DYExperimentModel *examModel;


@end
