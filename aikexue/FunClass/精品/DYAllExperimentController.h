//
//  DYAllExperimentController.h
//  aikexue
//
//  Created by Ray on 2017/8/3.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYBaseViewController.h"
#import "DYExperimentSortView.h"
#import "DYQualityGoodsModel.h"

@interface DYAllExperimentController : DYBaseViewController<UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>

@property (weak, nonatomic) IBOutlet DY_CollectionView *mainCollection;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *toTopH;

@property (nonatomic,copy)NSString *searchKey;//
@property (nonatomic,assign)NSInteger page;
@property (nonatomic,strong)DYQualityGoodsHomePageModel *model;//


@property (weak, nonatomic) IBOutlet DYExperimentSortView *sort;

@property(nonatomic)IBOutlet UILabel* sortLabel;//综合排序文字标签
@property(nonatomic)IBOutlet UIImageView* sortImg;//综合。。
@property(nonatomic)IBOutlet UIButton* sortBtn;//综合。。
//
@property(nonatomic)IBOutlet UILabel* categoryLabel;//所有列表文字标签。。
@property(nonatomic)IBOutlet UIImageView* categoryImg;//所有。。
@property(nonatomic)IBOutlet UIButton* categoryBtn;//所有。。

@property(nonatomic) NSIndexPath* categorySelected;
@property(nonatomic) NSIndexPath* sortSelected;

-(IBAction)onClickSort:(id)sender;
-(IBAction)onClickCategory:(id)sender;

@end
