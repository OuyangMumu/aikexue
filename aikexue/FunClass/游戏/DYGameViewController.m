//
//  DYGameViewController.m
//  aikexue
//
//  Created by Ray on 2017/9/6.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYGameViewController.h"
#import "DYGameViewCell.h"

@interface DYGameViewController ()

@property(nonatomic,strong)DYExperimentModel *model;

@end

@implementation DYGameViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYGameViewCell" bundle:nil] forCellReuseIdentifier:@"DYGameViewCell"];
    
    self.mainTable.estimatedRowHeight = GM_SCREEN_S.height;
    self.mainTable.rowHeight = UITableViewAutomaticDimension;
    self.scrollView = self.mainTable;
    
    
    OYWeakObj(self);
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        
        [weakself startNetworking:NO];
        
    }];
    
    [self startNetworking:YES];

    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(startNetworking:) name:LoginSuccessNotification object:nil];
    
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:YES];
    [self.mainTable reloadData];
}

-(void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:YES];

}

-(void)startNetworking:(BOOL)tip{
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:[MAIN_SRV stringByAppendingFormat:@"/pub/api/loadExam?_hc_=NC&eid=%@",@"59b3bbaad624d36e0b6c9f34"] params:nil success:^(id response) {
        
        NSDictionary *examInfo = @{
                               @"_id" : @"59b3bbaad624d36e0b6c9f34",
                               @"abbrTitle" : @"HappyGameRes",
                               @"createTime" : @1504951210433,
                               @"desc" : @"",
                               @"favor" : @0,
                               @"favorCommon" : @0,
                               @"image" : @"",
                               @"md5" :   @{
                                       @"android" :@"e6335b0d71ae4560e2beef89995fbf25",
                                       @"ios" :@"ab545e6fc5b90ff82321e909dc5b0912",
                                       },
                               @"price" : @0,
                               @"priceCommon" : @0,
                               @"screenshots" :  @[
                                       ],
                               @"size" :@6668943.36,
                               @"tags" :@[],
                               @"title" :@"开心答题游戏",
                               @"type" :@"exam",
                               @"version" : @{
                                       @"android" : @5,
                                       @"ios" :@5,
                                       @"win" :@1,
                                       }
                               };

        weakself.model = [DYExperimentModel modelWithJSON:examInfo];

//        if (weakself.model.examIds && weakself.model.examIds.count>0) {
//            for (NSString *ids in weakself.model.examIds) {
//
//                DYExperimentModel *model = [DYExperimentModel modelWithJSON:exam[ids]];
//                if (model) {
//                    [weakself.model.examModels  addObject:model];
//                }
//            }
//        }
        
        [[GM_User userExperiment]setValue:[self.model modelToJSONObject] forKey:self.model._id];
        [GM_User saveExperiments];
        [weakself.mainTable reloadData];
        
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];
    } showHUD:tip?self.view:nil];
    
}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return 1;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYGameViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYGameViewCell" forIndexPath:indexPath];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.model = self.model;
    if (self.isPushLoad) {
        cell.backButton.hidden = NO;
    }
    OYWeakObj(self)
    [cell setBackClick:^{
        [weakself.navCtl popViewControllerAnimated:YES];
    }];

    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    
}


@end
