//
//  DYQualityGoodsTableCell.h
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYQualityGoodsModel.h"

@interface DYQualityGoodsTableCell : UITableViewCell

@property (nonatomic,strong)DYQualityGoodsEssaysModel *essayModel;
@property (weak, nonatomic) IBOutlet UILabel *titleLab;
@property (weak, nonatomic) IBOutlet UIImageView *iconImage;
@property (weak, nonatomic) IBOutlet UILabel *writerLab;

@end
