//
//  DYSysNoteViewController.m
//  aikexue
//
//  Created by myj on 2017/8/16.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYSysNoteViewController.h"
#import "DYSysNoteCell.h"
#import "DYCommonWebViewController.h"
#import "DYNotificationCenterController.h"
@interface DYSysNoteViewController ()
@property (nonatomic,strong)NSString* url;
@property(nonatomic) NSMutableArray* items;

@end

@implementation DYSysNoteViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    [self buildUI];
    // Do any additional setup after loading the view from its nib.
}

-(void)buildUI{
    self.scrollView = self.mainTable;
    switch (self.type) {
        case SYSTEM_NOTICE_TYPE:
            self.navigationItem.title = @"系统通知";
            break;
            
        case EXAM_PACKAGE_NOTICE_TYPE:
            self.type=EXAM_NOTICE_TYPE;
            //这里不要break；
        case EXAM_NOTICE_TYPE:
            self.navigationItem.title = @"实验通知";
            break;
        default:
            break;
    }

    //
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYSysNoteCell" bundle:nil] forCellReuseIdentifier:@"DYSysNoteCell"];
//
    self.mainTable.estimatedRowHeight = 200;
    self.mainTable.rowHeight = UITableViewAutomaticDimension;

    OYWeakObj(self);
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        [weakself startNetworking:NO];
    }];
    
    [self.mainTable addEmptyViewWithImageName:ListEmptyImageString title:ListEmptyTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    
    [self.mainTable addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    self.mainTable.separatorStyle=UITableViewCellSeparatorStyleNone;
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:true];
    [self startNetworking:YES];
}

-(void)refreshClick:(UIButton *)sender{
    OYWeakObj(self);
    [weakself startNetworking:YES];
}
-(void)startNetworking:(BOOL)tip{
    OYWeakObj(self);
    
    
    switch (self.type) {
        case SYSTEM_NOTICE_TYPE:
            self.url=[NSString stringWithFormat:@"%@/usr/api/listMyNotices?token=%@&typeID=%d",MAIN_SRV,GM_User.userToken,SYSTEM_NOTICE_TYPE];
            break;
            
        case EXAM_PACKAGE_NOTICE_TYPE:
            self.type=EXAM_NOTICE_TYPE;
            //这里不要break；
        case EXAM_NOTICE_TYPE:
            self.url=[NSString stringWithFormat:@"%@/usr/api/listMyNotices?token=%@&typeID=12,13",MAIN_SRV,GM_User.userToken];
            break;
        default:
            break;
    }
    
    [DYNetworking   getWithUrl:self.url  params:nil success:^(id response) {
        [weakself.items removeAllObjects];
        NSArray *noticeList = response[@"data"][@"noticeList"];
        if (notNilOrNull(noticeList)&&noticeList.count>0) {
            
            [noticeList enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                [weakself.items addObject:[DYUserNotifiModel modelWithJSON:obj]];
            }];
            [weakself.mainTable reloadData];
            [DYNotificationCenterController markReaded:weakself.items];
        }
    } fail:^(NSError *error) {
        [weakself.mainTable reloadData];

    } showHUD:tip?self.view:nil];
    
    [self.mainTable.mj_header endRefreshing];
    
}

#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{

    if([self.items count])self.mainTable.hidden=NO;
    return self.items.count;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYSysNoteCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYSysNoteCell" forIndexPath:indexPath];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.model  = self.items[indexPath.row];
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    DYUserNotifiModel * item=self.items[indexPath.row];
    switch ([item.typeID integerValue]) {
        case SYSTEM_NOTICE_TYPE:{
            
            [Utils toWebView:self.navCtl url:item];
        }
            break;

            
        case EXAM_NOTICE_TYPE:{
            DYExperimentModel* model=[DYExperimentModel new];
            model._id=item.contentKey;
            model.type=EXAM_TYPE_EXAM;
            [Utils toExpDetail:self.navCtl expModel:model];
        }
            break;
        case EXAM_PACKAGE_NOTICE_TYPE:{
            DYExperimentModel* model=[DYExperimentModel new];
            model._id=item.contentKey;
            model.type=EXAM_TYPE_PACKAGE;
            [Utils toExpDetail:self.navCtl expModel:model];
        }
            break;
        default:
            break;
    }
    
}

-(NSMutableArray *)items{
    
    if(!_items){
        _items = [NSMutableArray new];
    }
    return _items;
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
