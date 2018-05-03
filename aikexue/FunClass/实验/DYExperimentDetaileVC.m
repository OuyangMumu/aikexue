//
//  DYExperimentDetaileVC.m
//  aikexue
//
//  Created by Ray on 2017/9/8.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentDetaileVC.h"
#import "DYExperimentDetaileHeader.h"
#import "DYExperimentDetaileCellOne.h"


@interface DYExperimentDetaileVC ()

@property(strong,nonatomic)DYExperimentDetaileHeader *headView;

@end

@implementation DYExperimentDetaileVC

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.mainTable.contentInset = UIEdgeInsetsMake(-(OYNavBarHeight) , 0, 0, 0);

 
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYExperimentDetaileCellOne" bundle:nil] forCellReuseIdentifier:@"DYExperimentDetaileCellOne"];
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYExperimentDetaileCellTwo" bundle:nil] forCellReuseIdentifier:@"DYExperimentDetaileCellTwo"];
    
    OYWeakObj(self);
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        
        [weakself startNetworking:NO];
        
    }];
    
    [self startNetworking:YES];
    
}


-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navCtl.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
    [self.navCtl.navigationBar setShadowImage:[UIImage new]];
    
    self.headView.model = self.model;
    [self.mainTable reloadData];
    
}

-(void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navCtl.navigationBar setBackgroundImage:nil forBarMetrics:UIBarMetricsDefault];
    [self.navCtl.navigationBar setShadowImage:nil];
    
}

-(void)startNetworking:(BOOL)tip{
    OYWeakObj(self);
    [DYNetworking getWithUrl:[MAIN_SRV stringByAppendingFormat:@"/pub/api/loadExam?_hc_=NC&eid=%@&token=%@",self.model._id,GM_User.userToken] params:nil success:^(id response) {
        
        weakself.model = [DYExperimentModel modelWithJSON:response[@"data"][@"exam"]];
        
        NSDictionary *examInfo = response[@"data"][@"examInfo"];
        
        if (weakself.model.examIds && weakself.model.examIds.count>0) {
            for (NSString *ids in weakself.model.examIds) {
                
                DYExperimentModel *model = [DYExperimentModel modelWithJSON:examInfo[ids]];
                if (model) {
                    [weakself.model.examModels  addObject:model];
                }
            }
        }
        
        if ([weakself.model.type isEqualToString:EXAM_TYPE_PACKAGE] && response[@"data"][@"packPay"]) {
            NSDictionary *priceDic = response[@"data"][@"packPay"][weakself.model._id];
            if (priceDic) {
                weakself.model.packNeedPayCOmmon = priceDic[@"packNeedPayCOmmon"];
                weakself.model.packNeedPay = priceDic[@"packNeedPay"];

            }
            
        }
        
        weakself.headView.model = self.model;
        [weakself.mainTable reloadData];
        
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];
        
    } showHUD:tip?self.view:nil];
    
}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{

    return 1;
}


- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{

    return MIN(GM_SCREEN_S.width, GM_SCREEN_S.height)/16*9 + 60 ;
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{

    return 0;
}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    return [DYExperimentDetaileCellOne heightWithModel:self.model];
    
}



- (nullable UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{

    return self.headView;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYExperimentDetaileCellOne *cell =[tableView dequeueReusableCellWithIdentifier:@"DYExperimentDetaileCellOne"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    cell.model = self.model;
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    
}



-(DYExperimentDetaileHeader *)headView{

    if (!_headView) {
        
        _headView = [DYExperimentDetaileHeader loadNib];
        _headView.frame = CGRectMake(0, 0, GM_SCREEN_S.width, MIN(GM_SCREEN_S.width, GM_SCREEN_S.height)/16*9 + 60);
        _headView.model = self.model;
    }
    return _headView;
}


@end
