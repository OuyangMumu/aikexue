//
//  DYQualityGoodsTableCell.m
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsTableCell.h"

@implementation DYQualityGoodsTableCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
    OYViewBorderRadius(self.iconImage, 3, 1, [UIColor lightGrayColor])
}

-(void)setEssayModel:(DYQualityGoodsEssaysModel *)essayModel{
    
    self.titleLab.text = essayModel.title;
    [self.iconImage sd_setImageWithURL:[NSURL URLWithString:essayModel.image] placeholderImage:PlaceholderImage];
    
    if (essayModel.tags.count>0) {
        self.writerLab.text = [NSString stringWithFormat:@"%@",essayModel.tags[0]];
    }else{
        self.writerLab.text = @"";
    }
    
}

@end
