//
//  DYPersonInfoCell.m
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYPersonInfoCell.h"

@implementation DYPersonInfoCell

- (void)awakeFromNib {
    [super awakeFromNib];

    OYViewBorderRadius(self.iconImg, 25, 0, OYClearColor);
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}
-(void)fillWithrowTtitl:(NSString *)rowTtitl iconImg:(NSString *)iconImg subTwoTitle:(NSString *)subTwoTitle{

    self.iconImg.hidden = self.arrowIcon.hidden = self.subTitle.hidden = self.subTwoTitle.hidden = YES;
    
    self.rowTtitl.text = rowTtitl;
    
    if (iconImg) {
        self.iconImg.hidden = NO;
        [self.iconImg sd_setImageWithURL:[NSURL URLWithString:iconImg] placeholderImage:IconPlaceholderImage];
    }

    if (subTwoTitle) {
        self.arrowIcon.hidden = NO;
        self.subTwoTitle.hidden = NO;
        self.subTwoTitle.text = subTwoTitle;
      
    }
    
    
    
}
@end
