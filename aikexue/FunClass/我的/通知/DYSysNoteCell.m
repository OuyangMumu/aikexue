//
//  DYSysNoteCell.m
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYSysNoteCell.h"

@implementation DYSysNoteCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}


-(void)setModel:(DYUserNotifiModel *)model{
    self.time.text = [Utils timeStringWith:[model.createTime stringValue] formatter:@"yyyy-MM-dd HH:mm:ss"];
    
    switch ([model.typeID integerValue]) {//通知类型，10:文章，11:优惠券，12:实验，13:实验包
        case 10:
            self.gotoDetail.text = @"阅读全文";
            break;
        case 12:
        case 13:
            self.gotoDetail.text = @"查看实验";
            break;

        default:
            break;
    }

    //    self.img1.layer.borderColor=[[UIColor colorWithString:@"59493f"]CGColor];
    [self.img sd_setImageWithURL:[NSURL URLWithString:model.contentImage] placeholderImage:PlaceholderImage];
    self.img.contentMode=UIViewContentModeScaleToFill;
    self.title.text=model.contentTitle;
    NSString *desc=model.contentIntro;
    if(desc==nil||[desc isEqualToString:@""])
        desc=@"暂无介绍";
    self.desc.text=desc;
}

@end
