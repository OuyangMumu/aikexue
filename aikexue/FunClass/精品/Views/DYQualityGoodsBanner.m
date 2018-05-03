//
//  DYQualityGoodsBanner.m
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsBanner.h"
#import "CardCollectionViewCell.h"
#import "CardCollectionVIewLayout.h"

#define ITEMCELLID  @"ITEMCELLID"
#define bigCount   1000


@interface DYQualityGoodsBanner ()<UICollectionViewDelegate,UICollectionViewDataSource,UISearchBarDelegate>
{

    CGFloat          startX;
    CGFloat          endX;
    NSInteger        currentIndex;
    
}


@property (nonatomic,strong)NSTimer *timer;



@end

@implementation DYQualityGoodsBanner


+(instancetype)loadNib{

    DYQualityGoodsBanner *banner = [[[NSBundle mainBundle] loadNibNamed:@"DYQualityGoodsBanner" owner:self options:0] firstObject];
    
    [banner  buildUI];
    
    return banner;
}

-(void)buildUI{

    CardCollectionVIewLayout *layout = [[CardCollectionVIewLayout alloc]init];
    
    self.toTopH.constant = OYStatusBarHeight;
    
    self.collectionVIew.collectionViewLayout =  layout;
    self.collectionVIew.delegate=self;
    self.collectionVIew.dataSource=self;
    self.collectionVIew.showsHorizontalScrollIndicator=NO;
    [self.collectionVIew registerClass:[CardCollectionViewCell class] forCellWithReuseIdentifier:ITEMCELLID];
    self.searchBar.backgroundImage = [UIImage imageWithColor:OYClearColor];
    self.searchBar.delegate = self;
    self.searchBar.placeholder = @"搜索更多有趣实验";
    
}



-(NSArray *)dataArr{
    if (!_dataArr) {
        _dataArr = [NSArray new];
    }
    return _dataArr;
}

-(NSTimer *)timer{

    if (!_timer) {
        _timer  = [NSTimer scheduledTimerWithTimeInterval:4.0f target:self selector:@selector(bannerImageChanger) userInfo:nil repeats:YES];
        
        [[NSRunLoop mainRunLoop]addTimer:_timer forMode:NSRunLoopCommonModes];
    }
    
    return _timer;
}

-(void)bannerImageChanger{

    currentIndex++;
    NSInteger maxIndex  = [self.collectionVIew numberOfItemsInSection:0] - 1;
    if (currentIndex>maxIndex) {
        currentIndex=0;
    }
    [self  imageScroll:currentIndex];
}


-(void)refresh{
    
    if (self.dataArr.count<=0) {
        
        [self.collectionVIew reloadData];
        return;
    }
    
    DYExperimentModel *model = self.dataArr[0];
    [self.bgImageV sd_setImageWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@",model.image]] placeholderImage: PlaceholderImage];
    [self.collectionVIew reloadData];
    
    [self.collectionVIew scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:(self.dataArr.count*bigCount/2) inSection:0] atScrollPosition:UICollectionViewScrollPositionCenteredHorizontally animated:YES];

    self.pageCtl.numberOfPages = self.dataArr.count;
    self.pageCtl.currentPage = (self.dataArr.count*bigCount/2)%self.dataArr.count;
    
    [self.timer  fire];
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    return self.dataArr.count * bigCount;
}


-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
     CardCollectionViewCell*cell =[collectionView dequeueReusableCellWithReuseIdentifier:ITEMCELLID forIndexPath:indexPath];
    
    DYExperimentModel *model =  self.dataArr[indexPath.row%self.dataArr.count];
    
    [cell.imageIV sd_setImageWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@",model.image]] placeholderImage:PlaceholderImage];
    
    return cell;
}



-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{

    if (self.bannerDelegate && [self.bannerDelegate conformsToProtocol:@protocol(QualityGoodsBannerDelegate)] && [self.bannerDelegate respondsToSelector:@selector(qualityGoodsBannerDidClick:)]) {
        
        DYExperimentModel *model = self.dataArr[indexPath.row%self.dataArr.count];;

        [self.bannerDelegate qualityGoodsBannerDidClick:model];
        
    }
}

-(void)searchBarTextDidBeginEditing:(UISearchBar *)searchBar{

    if (self.bannerDelegate && [self.bannerDelegate conformsToProtocol:@protocol(QualityGoodsBannerDelegate)] && [self.bannerDelegate respondsToSelector:@selector(qualityGoodsBannerDidClick:)]) {
        
        [self.bannerDelegate qualityGoodsBannerDidClick:nil];
    }
}



-(void)scrollViewWillBeginDragging:(UIScrollView *)scrollView{
    startX = scrollView.contentOffset.x;
    
}
-(void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate{
    endX = scrollView.contentOffset.x;
    dispatch_async(dispatch_get_main_queue(), ^{
        [self cellToCenter];
    });
}
-(void)cellToCenter{
    //最小滚动距离
    float  dragMinDistance =self.collectionVIew.bounds.size.width/20.0f;
    if (startX - endX >= dragMinDistance) {
        currentIndex -= 1; //向右
    }else if (endX - startX >= dragMinDistance){
        currentIndex += 1 ;//向左
    }
    

    [self  imageScroll:currentIndex];
}


-(void)imageScroll:(NSInteger)Index{
    
    if (self.dataArr.count<1) {
        return;
    }
    NSInteger maxIndex  = self.dataArr.count*bigCount - 1;
    Index = Index <= 0 ? 0 :Index;
    Index = Index >= maxIndex ? maxIndex : Index;
    
    NSInteger currentIndex = Index%self.dataArr.count;
    self.pageCtl.currentPage = currentIndex;
    DYExperimentModel *model = self.dataArr[currentIndex];
    
    [self.bgImageV sd_setImageWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@",model.image]] placeholderImage:PlaceholderImage];
    
    [self.collectionVIew scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:Index inSection:0] atScrollPosition:UICollectionViewScrollPositionCenteredHorizontally animated:YES];
}




@end
