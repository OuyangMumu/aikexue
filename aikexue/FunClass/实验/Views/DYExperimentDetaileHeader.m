//
//  DYExperimentDetaileHeader.m
//  aikexue
//
//  Created by Ray on 2017/9/5.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentDetaileHeader.h"

@implementation DYExperimentDetaileHeader

+(instancetype)loadNib{

    DYExperimentDetaileHeader *head  =[[[NSBundle mainBundle]loadNibNamed:@"DYExperimentDetaileHeader" owner:self options:nil]lastObject];
    
    
    return head;
}


-(void)setModel:(DYExperimentModel *)model{
    _model = model;
    
    if ([model.type isEqualToString:EXAM_TYPE_PACKAGE]) {
        if ([[GM_User userExperiment]valueForKey:model._id]) {
            self.actionView.hidden = YES;
        }else{
            self.actionView.hidden = NO;
        }
    }else{

    }
    
    [self.bgImageView sd_setImageWithURL:[NSURL URLWithString:model.image] placeholderImage:PlaceholderImage];
    
    self.titleLab.text = model.title;
    
    if ([model.type isEqualToString:EXAM_TYPE_EXAM]) {
        self.sizeLab.text=sizeString([model.size longValue]);
    }else{
       
        self.sizeLab.text= [NSString stringWithFormat:@"%ld个实验 / %@", model.examModels.count ,sizeString([model.size longValue])];
    }

    self.actionView.model = model;
    self.actionView.backType = BackgroundTypeWhite;
}

@end
