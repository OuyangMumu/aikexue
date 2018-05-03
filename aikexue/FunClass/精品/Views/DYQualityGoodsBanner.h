//
//  DYQualityGoodsBanner.h
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>


@protocol QualityGoodsBannerDelegate <NSObject>

-(void)qualityGoodsBannerDidClick:(id)object;

@end


@interface DYQualityGoodsBanner : UIView

@property (nonatomic,strong)NSArray *dataArr;
@property (weak, nonatomic) IBOutlet UIPageControl *pageCtl;

@property (weak, nonatomic) IBOutlet UICollectionView *collectionVIew;
@property (weak, nonatomic) IBOutlet UISearchBar *searchBar;

@property (weak, nonatomic) IBOutlet UIImageView *bookImageView;

@property (weak, nonatomic) IBOutlet UIImageView *bgImageV;
@property (weak, nonatomic) IBOutlet UIVisualEffectView *bgVisual;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *toTopH;

@property (nonatomic,weak)id<QualityGoodsBannerDelegate> bannerDelegate;//

+(instancetype)loadNib;

-(void)refresh;

@end
