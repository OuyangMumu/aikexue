//
//  DYQualityGoodsCellOne.h
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DYQualityGoodsModel.h"
#import "DYQualityGoodsCollectionCell.h"
#import "DYQualityGoodsTableCell.h"
#import "DYQualityGoodsModel.h"



typedef NS_ENUM(NSInteger , QualityActionType) {
    
    QualityActionTypeMore=1,//更多事件
    QualityActionTypeArticle=2,//文章事件
    QualityActionTypeList=3,//限时免费/实验包事件
    QualityActionTypeExam=4//具体实验事件
    
};


@protocol DYQualityGoodsDelegate <NSObject>

-(void)qualityGoodDidClick:(QualityActionType)type object:(id)object;

@end



@interface DYQualityGoodsCellOne : UITableViewCell<UITableViewDataSource,UITableViewDelegate>


@property (weak, nonatomic) IBOutlet UIImageView *sectionIcon;
@property (weak, nonatomic) IBOutlet UILabel *sectionTitle;
@property (weak, nonatomic) IBOutlet UIButton *sectionMore;

@property (weak, nonatomic) IBOutlet UITableView *sectionTable;
@property (weak, nonatomic) IBOutlet UICollectionView *sectionCollection;

@property (weak, nonatomic) IBOutlet UIImageView *itemImageOne;

@property (weak, nonatomic) IBOutlet UIImageView *itemImageTwo;

@property (nonatomic,weak)id <DYQualityGoodsDelegate> cellDelegate;//

@property (nonatomic,strong)DYQualityGoodsModel *goodModel;

- (IBAction)moreClick:(UIButton *)sender;

- (IBAction)ListClick:(UIButton *)sender;


@end
