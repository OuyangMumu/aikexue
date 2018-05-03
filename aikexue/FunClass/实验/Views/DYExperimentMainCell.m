//
//  DYExperimentMainCell.m
//  aikexue
//
//  Created by Ray on 2017/7/28.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentMainCell.h"

@implementation DYExperimentMainCell

- (void)awakeFromNib {
    [super awakeFromNib];

    OYViewBorderRadius(self.icon, 5, 2, [UIColor darkGrayColor]);
}


-(void)setExperimentModel:(DYExperimentModel *)experimentModel{

    [self.icon sd_setImageWithURL:[NSURL URLWithString:experimentModel.image] placeholderImage:PlaceholderImage];
    
    self.title.text = experimentModel.title;
    self.descLab.text = experimentModel.desc;
    self.actionView.model = experimentModel;
    
    
    if (experimentModel.showingTags.count>0) {
        [self.suitBtn setTitle:experimentModel.showingTags[0] forState:UIControlStateNormal];
    }else{
        [self.suitBtn setTitle:@"" forState:UIControlStateNormal];
    }
    
}



@end
