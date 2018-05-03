//
//  DYQualityGoodsCollectionCell.m
//  aikexue
//
//  Created by Ray on 2017/8/1.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsCollectionCell.h"

@implementation DYQualityGoodsCollectionCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}


-(void)setExamModel:(DYExperimentModel *)examModel{
    
    OYViewBorderRadius(self.icon, 5, 2, [UIColor darkGrayColor]);
    [self.icon sd_setImageWithURL:[NSURL URLWithString:examModel.image] placeholderImage:PlaceholderImage];
    self.title.text = examModel.title;
    
    if ([examModel.price integerValue]) {
        self.price.text = [NSString stringWithFormat:@"%.2f金币",[examModel.price floatValue]*10];
        self.price.textColor = NAV_BAR_COLOR;
    }else{
        self.price.text = @"免费";
        self.price.textColor = price_Free_color;
    }
    
    if (examModel.showingTags.count>0) {
        [self.suitBtn setTitle:examModel.showingTags[0] forState:UIControlStateNormal];
    }else{
        [self.suitBtn setTitle:@"" forState:UIControlStateNormal];
    }
}

@end
