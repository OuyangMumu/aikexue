//
//  DYAllExperimentController.m
//  aikexue
//
//  Created by Ray on 2017/8/3.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYAllExperimentController.h"
#import "DYExperimentMainCell.h"

@interface DYAllExperimentController ()<CategoryViewDelegate>
@property (nonatomic,strong)NSMutableArray *allExperiments;

@property (nonatomic,strong)NSMutableDictionary *parmaDic;

@property(nonatomic,strong) NSArray* sortData;
@property(nonatomic,strong) NSArray* categoryData;



@end

@implementation DYAllExperimentController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self buildUI];
    self.page = 1;
    [self startNetworking:YES];
    [self loadCategory];

}

-(void)buildUI{

    if (self.model) {
        self.navigationItem.title = self.model.name;
    }else{
        self.navigationItem.title = @"全部实验";
    }
    
    self.sortSelected = [NSIndexPath indexPathForRow:0 inSection:0];
    self.categorySelected = [NSIndexPath indexPathForRow:0 inSection:0];
    self.sort.delegate = self;
    
    [self.mainCollection  registerNib:[UINib nibWithNibName:@"DYExperimentMainCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainCell"];
    [self.mainCollection  registerNib:[UINib nibWithNibName:@"DYExperimentMainIpadCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainIpadCell"];

    OYWeakObj(self);
    self.mainCollection.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        weakself.page = 1;
        [weakself startNetworking:NO];
    }];

    self.mainCollection.mj_footer = [MJRefreshBackNormalFooter footerWithRefreshingBlock:^{
        weakself.page++;
        [weakself startNetworking:NO];
    }];
    
    [self.mainCollection addEmptyViewWithImageName:ListEmptyImageString title:ListEmptyTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    
    [self.mainCollection addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
}

-(void)startNetworking:(BOOL)tip{

    
    NSString *url = [NSString stringWithFormat:@"%@/pub/api/searchExam?pageCount=300",MAIN_SRV];
    
    [self.parmaDic removeObjectForKey:@"sort"];
    [self.parmaDic removeObjectForKey:@"tags"];

    if(self.sortData.count>self.sortSelected.row){
        self.parmaDic[@"sort"] = [self.sortData[self.sortSelected.row] valueForKey:@"value"];
    }
    if(self.categorySelected.section>0&&self.categoryData.count>=self.categorySelected.section){
        NSArray* tags=[self.categoryData[self.categorySelected.section-1]valueForKey:@"tags"];
        if(tags.count>self.categorySelected.row){
            self.parmaDic[@"tags"] = tags[self.categorySelected.row];
        }
    }
    
    if (self.model) {
        self.parmaDic[@"homePageId"] = self.model._id;
    }
  
    self.parmaDic[@"key"] = self.searchKey;
    self.parmaDic[@"token"] = GM_User.userToken;
    self.parmaDic[@"page"] = @(self.page);

    OYWeakObj(self);
    [DYNetworking getWithUrl:url params:self.parmaDic success:^(id response) {
      
        NSArray *list = response[@"data"][@"list"];
        if (notNilOrNull(list)){
            if (self.page == 1) {
                self.allExperiments = nil;
            }
            [list enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                DYExperimentModel *model =  [DYExperimentModel modelWithJSON:obj];
                
                if ([model.type isEqualToString:EXAM_TYPE_PACKAGE] && response[@"data"][@"packPay"]) {
                    NSDictionary *priceDic = response[@"data"][@"packPay"][model._id];
                    if (priceDic) {
                        model.packNeedPayCOmmon = priceDic[@"packNeedPayCOmmon"];
                        model.packNeedPay = priceDic[@"packNeedPay"];
                    }
                }
                [weakself.allExperiments addObject:model];
                
            }];
        }
        [weakself.mainCollection reloadData];
    } fail:^(NSError *error) {
        [weakself.mainCollection reloadData];
    } showHUD:tip?self.view:nil];
}


- (void)loadCategory{
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:[MAIN_SRV stringByAppendingString:@"/pub/api/getCategories"] params:nil success:^(id response) {
        
        NSDictionary* sdata=[response valueForKey:@"data"];
        weakself.categoryData=[sdata valueForKey:@"list"];
        
    } fail:^(NSError *error) {
        
    } showHUD:nil];
}

#pragma mark==========UITableViewDataSource==========

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{

    return self.allExperiments.count;
    
}

-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    
    CGFloat width = GM_SCREEN_S.width;
    if (ISPAD) {
        width = (width)/2;
        return CGSizeMake(width, width/16*9+60);
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
    
    DYExperimentMainCell *cell = nil;
    if (ISPAD) {
        cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"DYExperimentMainIpadCell" forIndexPath:indexPath];
    }else{
        cell =  [collectionView dequeueReusableCellWithReuseIdentifier:@"DYExperimentMainCell" forIndexPath:indexPath];
    }
    
    cell.highlighted = NO;
    
    
    cell.experimentModel = self.allExperiments[indexPath.item];
    
    return  cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    
    [Utils toExpDetail:self.navCtl expModel:self.allExperiments[indexPath.item]];
    
}


-(IBAction)onClickSort:(id)sender{
    self.sort.sortSelected=self.sortSelected;
    [self.sort showWithsortItems:self.sortData categoryItems:nil];
    self.categoryImg.image=[UIImage imageNamed:@"putaway-btn"];
    self.sortImg.image=[UIImage imageNamed:@"putaway-btn_s"];
}

-(IBAction)onClickCategory:(id)sender{
    self.sort.categorySelected=self.categorySelected;
    [self.sort showWithsortItems:nil categoryItems:self.categoryData];
    self.sortImg.image=[UIImage imageNamed:@"putaway-btn"];
    self.categoryImg.image=[UIImage imageNamed:@"putaway-btn_s"];
}

-(void)onSelectSort:(BOOL)sort index:(NSIndexPath *)index{

    self.categoryImg.image=[UIImage imageNamed:@"putaway-btn"];
    self.sortImg.image=[UIImage imageNamed:@"putaway-btn"];
    if (sort) {//排序
        self.sortSelected = index;
        self.sortLabel.text =  [self.sortData[index.row] valueForKey:@"name"];
    }else{//分类
        self.categorySelected = index;
        if (index.section==0) {
            self.categoryLabel.text =  @"所有类别" ;
        }else{
            self.categoryLabel.text = [self.categoryData[index.section-1] valueForKey:@"tags"][index.row];
        }
    }
    
    self.page = 1;
    [self startNetworking:YES];
}


#pragma mark ================================
-(NSMutableArray *)allExperiments{
    
    if (!_allExperiments) {
        _allExperiments = [NSMutableArray new];
    }
    return _allExperiments;
}
-(NSMutableDictionary *)parmaDic{

    if (!_parmaDic) {
        _parmaDic = [NSMutableDictionary new];
    }
    return  _parmaDic;
}

-(NSArray *)sortData{

    if (!_sortData) {
        _sortData = @[@{@"name":@"综合排序",@"value":@"1"},@{@"name":@"按人气排序",@"value":@"100"},@{@"name":@"按发布时间",@"value":@"200"},@{@"name":@"价格从高到低",@"value":@"300"},@{@"name":@"价格从低到高",@"value":@"-300"}];
    }
    return _sortData;
}
-(NSArray *)categoryData{

    if (!_categoryData) {
        _categoryData = [NSArray new];
    }
    return _categoryData;
}

@end
