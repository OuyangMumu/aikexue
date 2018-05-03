//
//  DYExperimentDetaileCellOne.m
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentDetaileCellOne.h"

@implementation DYExperimentDetaileCellOne

- (void)awakeFromNib {
    [super awakeFromNib];
    
    
    [self.mainCollection registerNib:[UINib nibWithNibName:@"DYExperimentMainCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainCell"];
    self.mainCollection.delegate = self;
    self.mainCollection.dataSource = self;
    
    
    
}

-(void)setModel:(DYExperimentModel *)model{
    
    _model = model;
    
    NSString *desText =  [NSString stringWithFormat:@"简介 : %@",model.desc];
    NSMutableAttributedString * attributedString = [[NSMutableAttributedString alloc] initWithString:desText attributes:nil];
    NSMutableParagraphStyle * paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:8];//行间距
    
    [attributedString addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [desText length])];
    
    [self.desLab setAttributedText:attributedString];
    
    if (model.screenshots.count>0) {
        self.imageScrollH.constant = GM_SCREEN_S.width/16*(ISPAD?4:6);
        CGFloat spaceH = 10;
        CGFloat heigt = (GM_SCREEN_S.width/16*(ISPAD?4:6) - 20);
        CGFloat width = heigt/9*16;
        CGFloat spaceW = 10;
        
        self.imagesScroll.contentSize = CGSizeMake(spaceW+(spaceW+width) * model.screenshots.count, heigt+spaceH*2);
        
        OYWeakObj(self)
        [model.screenshots enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            
            UIImageView *imageV = [[UIImageView alloc]initWithFrame:CGRectMake(spaceW+(spaceW+width)*idx, spaceH, width, heigt)];
            [imageV sd_setImageWithURL:[NSURL URLWithString:obj] placeholderImage:PlaceholderImage];
            [weakself.imagesScroll addSubview:imageV];
        }];
    }
    
    [self.mainCollection reloadData];
    
}



#pragma mark =============UICollectionViewDelegate===================
-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    return self.model.examModels.count;
}

-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    
    CGFloat width = GM_SCREEN_S.width;
    if (ISPAD) {
        width = (width)/2;
    }
    
    return CGSizeMake(width, width/3);
    
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout insetForSectionAtIndex:(NSInteger)section{
    
    return UIEdgeInsetsZero;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section{
    
    return 0;
}


- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section{
    
    return 0;
}


-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    DYExperimentMainCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"DYExperimentMainCell" forIndexPath:indexPath];
    cell.highlighted = NO;
    
    cell.experimentModel = self.model.examModels[indexPath.item];
    
    if ([[GM_User userExperiment]valueForKey:self.model._id]) {
        cell.actionViewW.constant = 60;
    }else{
        cell.actionViewW.constant = 0;
        
    }
    
    return  cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    
    [Utils toExpDetail:[GM_APP rootNav] expModel:self.model.examModels[indexPath.item]];
}


+(CGFloat)heightWithModel:(DYExperimentModel*)model{
    
    CGFloat height = 0;
    
    //简介
    NSMutableParagraphStyle * paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:8];//行间距
    height += [[NSString stringWithFormat:@"简介 : %@",model.desc] boundingRectWithSize:CGSizeMake(GM_SCREEN_S.width-20, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSParagraphStyleAttributeName:paragraphStyle,NSFontAttributeName:[UIFont systemFontOfSize:14]} context:nil].size.height+20;
    
    //轮播图
    if (model.screenshots.count>0) {
        height += GM_SCREEN_S.width/16*(ISPAD?4:6);;
    }
    
    CGFloat width = GM_SCREEN_S.width;
    if (ISPAD) {
        width = (width)/2;
    }
    
    CGFloat heith = width/3;
    
    NSInteger line = ISPAD?(model.examModels.count/2 + (model.examModels.count%2)):model.examModels.count;
    height += line * heith  ;
    
    return height;
    
}


@end

