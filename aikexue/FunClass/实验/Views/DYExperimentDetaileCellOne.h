//
//  DYExperimentDetaileCellOne.h
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYExperimentMainCell.h"


@interface DYExperimentDetaileCellOne : UITableViewCell<UIScrollViewDelegate,UICollectionViewDelegate,UICollectionViewDataSource>

@property (weak, nonatomic) IBOutlet UILabel *desLab;
@property (weak, nonatomic) IBOutlet UIScrollView *imagesScroll;

@property (weak, nonatomic) IBOutlet NSLayoutConstraint *imageScrollH;
@property (nonatomic,strong)DYExperimentModel *model;

@property (weak, nonatomic) IBOutlet UICollectionView *mainCollection;


+(CGFloat)heightWithModel:(DYExperimentModel*)model;

@end
