//
//  DYQualityGoodsCellOne.m
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsCellOne.h"


@implementation DYQualityGoodsCellOne

- (void)awakeFromNib {
    [super awakeFromNib];
    
    self.backgroundColor = OYClearColor;
    
    [self.sectionTable registerNib:[UINib nibWithNibName:@"DYQualityGoodsTableCell" bundle:nil] forCellReuseIdentifier:@"DYQualityGoodsTableCell"];
    
    self.sectionTable.delegate =self;
    self.sectionTable.dataSource = self;
    
    OYViewBorderRadius(self.sectionMore, 10, 0, OYClearColor);
    
}

-(void)setGoodModel:(DYQualityGoodsModel *)goodModel{
    _goodModel = goodModel;
    
    for (int i = 0;i<goodModel.homePages.count;i++) {
        DYQualityGoodsHomePageModel *model= goodModel.homePages[i];
        if (i==0) {
            [self.itemImageOne sd_setImageWithURL:[NSURL URLWithString:model.flag] placeholderImage:OYGetImage(@"组-1")];
            
        }
        if (i==1) {
            [self.itemImageTwo sd_setImageWithURL:[NSURL URLWithString:model.flag] placeholderImage:OYGetImage(@"组-2")];
        }
    }
    
    [self.sectionTable reloadData];
    [self.sectionCollection reloadData];
}

- (IBAction)moreClick:(UIButton *)sender {
    
    if (self.cellDelegate && [self.cellDelegate conformsToProtocol:@protocol(DYQualityGoodsDelegate)] && [self.cellDelegate respondsToSelector:@selector(qualityGoodDidClick:object:)]) {
        
        [self.cellDelegate qualityGoodDidClick:QualityActionTypeMore object:@(sender.tag)];
    }
}

//类别
- (IBAction)ListClick:(UIButton *)sender {
    
    DYQualityGoodsHomePageModel *model= self.goodModel.homePages[sender.tag-10];

    if (self.cellDelegate && [self.cellDelegate conformsToProtocol:@protocol(DYQualityGoodsDelegate)] && [self.cellDelegate respondsToSelector:@selector(qualityGoodDidClick:object:)]) {
        
        [self.cellDelegate qualityGoodDidClick:QualityActionTypeList object:model];
    }
}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.goodModel.cms.essays.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    CGFloat width = GM_SCREEN_S.width;

    return width/(ISPAD?7:4);
}



-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYQualityGoodsTableCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYQualityGoodsTableCell"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.essayModel = self.goodModel.cms.essays[indexPath.row];
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    
    if (self.cellDelegate && [self.cellDelegate conformsToProtocol:@protocol(DYQualityGoodsDelegate)] && [self.cellDelegate respondsToSelector:@selector(qualityGoodDidClick:object:)]) {

        [self.cellDelegate qualityGoodDidClick:QualityActionTypeArticle object:self.goodModel.cms.essays[indexPath.row]];
    }
}

@end
