//
//  DYQualityGoodsController.m
//  aikexue
//
//  Created by Ray on 2017/8/22.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYQualityGoodsController.h"
#import "DYQualityGoodsModel.h"
#import "DYQualityGoodsBanner.h"
#import "DYQualityGoodsCellOne.h"
#import "DYAllExperimentController.h"
#import "DYQualityGoodsCellTwo.h"
#import "DYSearchExperimentVC.h"
#import "DYAllChildTeacherVC.h"
#import "DYChildTeacherVC.h"

@interface DYQualityGoodsController ()<DYQualityGoodsDelegate,QualityGoodsBannerDelegate>

@property(nonatomic,strong)DYQualityGoodsBanner *bannerView;
@property (nonatomic,strong)UIButton *leftButtonItem;

@property (nonatomic,strong)DYQualityGoodsModel *goodsModel;

@end

@implementation DYQualityGoodsController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    [self buildUI];
    [self startNetworking:YES];
    
    [self.navigationController setNavigationBarHidden:YES animated:YES];
    self.scrollView = self.mainTable;
}


-(void)buildUI{
    
    self.navigationItem.title = @"精品推荐";
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYQualityGoodsCellOne" bundle:nil] forCellReuseIdentifier:@"DYQualityGoodsCellOne"];
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYQualityGoodsCellTwo" bundle:nil] forCellReuseIdentifier:@"DYQualityGoodsCellTwo"];
    
    
    self.mainTable.contentInset = UIEdgeInsetsMake(0, 0, OYTabBarHeight, 0);
    self.mainTable.tableHeaderView = self.bannerView;
    
    
    OYWeakObj(self);
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakself startNetworking:NO];
    }];
    
    
    UIButton *rightBt=[UIButton buttonWithType:UIButtonTypeCustom];
    rightBt.frame=CGRectMake(0, 0, 25, 25);
    
    [rightBt setImage:[UIImage imageNamed:@"search"] forState:UIControlStateNormal];
    [rightBt addTarget:self action:@selector(searchClick) forControlEvents:UIControlEventTouchUpInside];
    UIBarButtonItem *rightItem=[[UIBarButtonItem alloc]initWithCustomView:rightBt];
    self.navigationItem.rightBarButtonItem=rightItem;
}

-(void)startNetworking:(BOOL)tip{
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:[MAIN_SRV stringByAppendingString:@"/pub/api/getHome?version=2"] params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue] == 0) {
            weakself.goodsModel = nil;
            weakself.goodsModel = [DYQualityGoodsModel modelWithDictionary:response[@"data"]];
            NSDictionary *exams = response[@"data"][@"exams"];
            NSArray *extraExams = response[@"data"][@"extraExams"];
            
            if (notNilOrNull(extraExams)&&extraExams.count>0) {
                for (NSString *eid in extraExams) {
                    DYExperimentModel *examModel =  [DYExperimentModel modelWithDictionary:exams[eid]];
                    if (examModel) {
                        [weakself.goodsModel.extraExamsModels addObject:examModel];
                    }
                }
            }

            weakself.bannerView.dataArr = weakself.goodsModel.homeForces;
            [weakself.bannerView refresh];
        }
        [weakself.mainTable reloadData];
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];
    } showHUD:tip?self.view:nil];
}

-(void)searchClick{
    
    DYSearchExperimentVC *VC = [DYSearchExperimentVC new];
    
    [self.navCtl pushViewController:VC animated:YES];
    
}

-(void)leftButtonItemClick{
    
    DYAllExperimentController *VC = [DYAllExperimentController new];
    [self.navCtl pushViewController:VC animated:YES];
}

#pragma mark==========UITableViewDataSource==========

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    
    return 2;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return 1;
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    CGFloat width = GM_SCREEN_S.width;
    CGFloat sectionTitleH = 40;
    CGFloat sectionFootH = 20;
    
    if (indexPath.section==0) {
        return  sectionTitleH + self.goodsModel.cms.essays.count * width/(ISPAD?7:4) + 40 + width/(ISPAD?12:7)*2*(ISPAD?1:2)  + 10 + sectionFootH;
    }else{
        
        NSInteger maxCount = ISPAD?4:2;  //行数
        CGFloat width = (MIN(GM_SCREEN_S.width,GM_SCREEN_S.height))/maxCount;
        CGFloat height =  width/16 * 9 + 60;
        
        NSInteger hCount = 0;
        if (self.goodsModel.extraExamsModels.count%maxCount) {
            hCount =  self.goodsModel.extraExamsModels.count/maxCount +1;
        }else{
            hCount =  self.goodsModel.extraExamsModels.count/maxCount;
        }
        
        return sectionTitleH + hCount*height + sectionFootH + (ISPAD ? 20 :0);
    }
    
    return 0;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYQualityGoodsCellOne *cell = nil;
    
    if (indexPath.section==0) {
        cell = [tableView dequeueReusableCellWithIdentifier:@"DYQualityGoodsCellOne"];
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:@"DYQualityGoodsCellTwo"];
    }
    cell.goodModel = self.goodsModel;
    cell.cellDelegate = self;
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    return cell;
    
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
}

#pragma mark =============轮播图点击事件===================

-(void)qualityGoodsBannerDidClick:(id)object{
    if (object) {
        DYExperimentModel *model = object;
        if([model.type isEqualToString:@"web"]){
            DYChildTeacherVC *VC = [DYChildTeacherVC new];
            VC.url = model.eid;
            [self.navCtl pushViewController:VC animated:YES];
        }else{
            model._id = model.eid;
            [Utils toExpDetail:self.navCtl expModel:model];
        }
    }else{
        [self searchClick];
    }
}

#pragma mark =============cell 点击事件===================
-(void)qualityGoodDidClick:(QualityActionType)type object:(id)object{
    
    switch (type) {
        case QualityActionTypeMore:
            if ([object isEqual:@(1)]) {
                NSLog(@"更多文章");
                DYAllChildTeacherVC *VC= [DYAllChildTeacherVC new];
                VC.url = self.goodsModel.cms.home;
                [self.navCtl pushViewController:VC animated:YES];
            } else{
                NSLog(@"更多实验");
                DYAllExperimentController *VC = [DYAllExperimentController new];
                [self.navCtl pushViewController:VC animated:YES];
            }
            
            break;
            
        case QualityActionTypeArticle:
            NSLog(@"点击文章");
        {
            DYQualityGoodsEssaysModel *model = object;
            DYChildTeacherVC *VC= [DYChildTeacherVC new];
            VC.url = model.url;
            [self.navCtl pushViewController:VC animated:YES];
        }
            
            break;
            
        case QualityActionTypeList:
            //分类
        {
            DYQualityGoodsHomePageModel *model = object;
            DYAllExperimentController *VC = [DYAllExperimentController new];
            VC.model = model;
            [self.navCtl pushViewController:VC animated:YES];
            
            NSLog(@"name == %@",model.name);
        }
            break;
            
            
        case QualityActionTypeExam:
        {
            DYExperimentModel *model = object;
            
            [Utils toExpDetail:self.navCtl expModel:model];
        }
            break;
            
            
        default:
            break;
    }
}



#pragma mark =============懒加载===================
-(DYQualityGoodsBanner *)bannerView{
    
    if (!_bannerView) {
        
        _bannerView = [DYQualityGoodsBanner loadNib];
        
        if(ISPAD){
            _bannerView.frame =   CGRectMake(0, 0, MIN(GM_SCREEN_S.width, GM_SCREEN_S.height),MIN(GM_SCREEN_S.width, GM_SCREEN_S.height)/16 * 7 +64+40);
        }else{
            _bannerView.frame =   CGRectMake(0, 0, MIN(GM_SCREEN_S.width, GM_SCREEN_S.height), GM_SCREEN_S.width/5*4/16*9+OYNavBarHeight+40);
        }
        _bannerView.bannerDelegate = self;
    }
    return _bannerView;
}


-(UIButton *)leftButtonItem{
    
    if (!_leftButtonItem) {
        _leftButtonItem = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 44, 44)];
        [_leftButtonItem setImage:[UIImage imageNamed:@"h_All-experiments"] forState:UIControlStateNormal];
        [_leftButtonItem addTarget:self action:@selector(leftButtonItemClick) forControlEvents:UIControlEventTouchUpInside];
    }
    
    return _leftButtonItem;
}


@end
