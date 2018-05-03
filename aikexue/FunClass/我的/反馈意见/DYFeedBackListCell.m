//
//  DYFeedBackListCell.m
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYFeedBackListCell.h"
#import "DYFeedBackListSubCell.h"

@implementation DYFeedBackListCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYFeedBackListSubCell" bundle:nil] forCellReuseIdentifier:@"DYFeedBackListSubCell"];
    
    OYViewBorderRadius(self.iconimage, 20, 0, OYClearColor)
    
    self.mainTable.delegate =self;
    self.mainTable.dataSource = self;
    self.mainTable.estimatedRowHeight = 60;
    self.mainTable.rowHeight = UITableViewAutomaticDimension;
    self.mainTable.contentInset = UIEdgeInsetsZero;
}

-(void)setModel:(DYFeedBackModel *)model{
    _model = model;
    
    self.nameLabel.text = model.uidModel.nickName;
    [self.iconimage sd_setImageWithURL:[NSURL URLWithString:model.uidModel.avatar] placeholderImage:PlaceholderImage];
    self.contentLabel.text = model.context;
    
    if ([model.uid isEqualToString:GM_User.userId]) {
        self.delectButton.hidden = NO;
    }else{
        self.delectButton.hidden = YES;
    }
    
    [self.praiseButton setTitle:OYStringFormat(@"%ld",model.thumpUp.count) forState:UIControlStateNormal];
    
    if ([model.thumpUp containsObject:GM_User.userId]) {
        self.praiseButton.selected  = YES;
    }else{
        self.praiseButton.selected = NO;
    }
 
    if ([model.createTime doubleValue] > 0) {
        
        NSString *timeStr = [NSString stringWithFormat:@"%@",model.createTime];
        
        NSDate *date = [NSDate dateWithTimeIntervalSince1970:[model.createTime doubleValue]/1000.0];
        
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
    
    
 
   
    if (notNilOrNull(model.reply.uid)) {
        CGSize size = [_model.reply.context boundingRectWithSize:CGSizeMake(GM_SCREEN_S.width-55-20, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:15]} context:nil].size;
        [self.mainTable reloadData];

        self.subTableH.constant = 65+size.height;

    }else{
        self.subTableH.constant = 0;
        }
    
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return 1;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYFeedBackListSubCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYFeedBackListSubCell"];
    
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.subModel = self.model.reply;
    
    OYWeakObj(self);
    [cell setCellCall:^(NSInteger type) {
        if (weakself.cellCall) {
            weakself.cellCall(type);
        }
    }];
    
    return  cell;
    
}

- (IBAction)delectClick:(UIButton *)sender {
    
    if (self.cellCall) {
        self.cellCall(2);
    }
}

- (IBAction)praiseClick:(UIButton *)sender {
    
    if (self.cellCall) {
        self.cellCall(1);
    }
}



@end
