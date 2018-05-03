//
//  DYExperimentMainCtl.m
//  aikexue
//
//  Created by Ray on 2017/7/27.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentMainCtl.h"
#import "DYExperimentMainCell.h"
#import "DYExperimentModel.h"

static NSMutableDictionary* _purchared=nil;
static NSDictionary* _my_exams;

@interface DYExperimentMainCtl ()<UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>

@property (nonatomic,strong)UIView *titleView;

@property (weak, nonatomic) IBOutlet DY_CollectionView *mainCollection;

@property (nonatomic,strong)NSMutableArray *dataSource;

@end

@implementation DYExperimentMainCtl

- (void)viewDidLoad {
    [super viewDidLoad];
    self.scrollView = self.mainCollection;
    [self buildUI];
    [self startNetworking:YES];
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.mainCollection reloadData];
}

-(void)loginSuccessRefresh{
    
    [self startNetworking:YES];
    
}

-(void)buildUI{
    self.navigationItem.title = @"我的实验";

    [self.mainCollection registerNib:[UINib nibWithNibName:@"DYExperimentMainCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainCell"];
    [self.mainCollection  registerNib:[UINib nibWithNibName:@"DYExperimentMainIpadCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainIpadCell"];

    OYWeakObj(self);
    self.mainCollection.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{

        [weakself startNetworking:NO];
    }];
    
    [self.mainCollection addEmptyViewWithImageName:ListEmptyImageString title:@"你还没用参与学习哦" buttonIcon:@"refresh-btn" action:^{

        [weakself startNetworking:YES];
    }];
    
    [self.mainCollection addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
}

-(void)startNetworking:(BOOL)tip{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/listMyExam?_hc_=NO&token=%@&time=%lu",MAIN_SRV,GM_User.userToken,(unsigned long)[[NSDate new]timeIntervalSince1970]) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            NSArray *exams = response[@"data"][@"exams"];
            weakself.dataSource = nil;
            if (exams && exams.count > 0) {
                for (NSDictionary *dic in exams) {
                    DYExperimentModel *model =  [DYExperimentModel modelWithJSON:dic];
                    if (![model.abbrTitle isEqualToString:@"HappyGameRes"]) {
                        [weakself.dataSource addObject:model];
                    }
                }
            }
        }
        [weakself.mainCollection reloadData];
    } fail:^(NSError *error) {
        [weakself.mainCollection reloadData];
    } showHUD:tip?self.view:nil];
    
}

#pragma mark =============UICollectionViewDelegate===================

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    return  self.dataSource.count;
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

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section{
    
    return CGSizeMake(GM_SCREEN_S.width, 5);
}


-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    DYExperimentMainCell *cell = nil;
    if (ISPAD) {
        cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"DYExperimentMainIpadCell" forIndexPath:indexPath];
    }else{
        cell =  [collectionView dequeueReusableCellWithReuseIdentifier:@"DYExperimentMainCell" forIndexPath:indexPath];
    }
    
    
    cell.experimentModel = self.dataSource[indexPath.item];
    
    return  cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    DYExperimentModel *model =  self.dataSource[indexPath.item];
    
    [Utils toExpDetail:self.navCtl expModel:model];
}
-(NSMutableArray *)dataSource{
    if (!_dataSource) {
        _dataSource = [NSMutableArray new];
    }
    return _dataSource;
}
@end
