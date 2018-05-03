//
//  DYFeedBackListSubCell.m
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYFeedBackListSubCell.h"

@implementation DYFeedBackListSubCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}
-(void)setSubModel:(DYFeedBackModel *)subModel{
    _subModel = subModel;
    
    self.nameLabel.text = @"管理员回复:";
    [self.iconimage sd_setImageWithURL:[NSURL URLWithString:subModel.uidModel.avatar] placeholderImage:PlaceholderImage];
    self.contentLabel.text = subModel.context;
    
    if ([subModel.uid isEqualToString:GM_User.userId]) {
        self.delectButton.hidden = NO;
    }else{
        self.delectButton.hidden = YES;
    }
    
    [self.praiseButton setTitle:OYStringFormat(@"%ld",subModel.thumpUp.count) forState:UIControlStateNormal];
    
    if ([subModel.thumpUp containsObject:GM_User.userId]) {
        self.praiseButton.selected  = YES;
    }else{
        self.praiseButton.selected = NO;
    }
    
    if ([subModel.createTime doubleValue] > 0) {
        
        NSString *timeStr = [NSString stringWithFormat:@"%@",subModel.createTime];
        
        NSDate *date = [NSDate dateWithTimeIntervalSince1970:[subModel.createTime doubleValue]/1000.0];
        
        if ([date isToday]) {
            self.timeLabel.text = GM_TIME_M(timeStr, @"HH:mm");
        }else if([date isYesterday]){
            self.timeLabel.text = [NSString stringWithFormat:@"昨天 %@", GM_TIME_M(timeStr, @"HH:mm")];
        }else{
            self.timeLabel.text = GM_TIME_M(timeStr, @"yyyy-MM-dd");
        }
        //        else if ([date isThisWeek]){
        //            self.timeLabel.text = [date dayFromWeekday];
        //        }
    }else{
        
        self.timeLabel.text = nil;
    }
    
    
    
    
    if (notNilOrNull(subModel.reply.uid)) {
        CGSize size = [subModel.reply.context boundingRectWithSize:CGSizeMake(GM_SCREEN_S.width-55-20, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:15]} context:nil].size;
        [self.mainTable reloadData];
        
        self.subTableH.constant = 65+size.height;
        
    }else{
        self.subTableH.constant = 0;
    }
}


-(void)praiseClick:(UIButton *)sender{
    
    if (self.cellCall) {
        self.cellCall(3);
    }
}

@end
