//
//  DYQualityGoodsCellTwo.m
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsCellTwo.h"

@implementation DYQualityGoodsCellTwo

- (void)awakeFromNib {
    [super awakeFromNib];
    
    [self.sectionCollection registerNib:[UINib nibWithNibName:@"DYQualityGoodsCollectionCell" bundle:nil] forCellWithReuseIdentifier:@"DYQualityGoodsCollectionCell"];
    self.sectionCollection.delegate = self;
    self.sectionCollection.dataSource = self;

}




-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    return self.goodModel.extraExamsModels.count;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section{
    
    return  ISPAD ? 10 :0;
}
- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section{
    
    return  0;
}

-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    NSInteger maxCount = ISPAD?4:2;
    
    CGFloat width = (MIN(GM_SCREEN_S.width,GM_SCREEN_S.height))/maxCount;
    
    return  CGSizeMake(width, width/16 * 9 + 60);
    
}

-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    DYQualityGoodsCollectionCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"DYQualityGoodsCollectionCell" forIndexPath:indexPath];
    DYExperimentModel *examModel = self.goodModel.extraExamsModels[indexPath.item];
    cell.examModel = examModel;
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
   
    DYExperimentModel *examModel = self.goodModel.extraExamsModels[indexPath.item];
    
    if (self.cellDelegate && [self.cellDelegate conformsToProtocol:@protocol(DYQualityGoodsDelegate)] && [self.cellDelegate respondsToSelector:@selector(qualityGoodDidClick:object:)]) {
        
        [self.cellDelegate qualityGoodDidClick:QualityActionTypeExam object:examModel];
    }
}



@end
