//
//  DYQualityGoodsBanner.h
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "CardCollectionViewCell.h"

@implementation CardCollectionViewCell



-(instancetype)initWithFrame:(CGRect)frame{
    if (self = [super initWithFrame:frame]) {
        [self addSubviews];
    }
    return self;
}

-(void)addSubviews{
    
    self.layer.cornerRadius = 10;
    self.layer.masksToBounds=YES;
    
    self.imageIV = [[UIImageView alloc]initWithFrame:self.bounds];
    [self.contentView addSubview:self.imageIV];
    
    
}

@end
