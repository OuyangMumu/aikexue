//
//  DYFeedBackListController.m
//  aikexue
//
//  Created by Ray on 2017/10/18.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYFeedBackListController.h"
#import "DYFeedbackViewController.h"
#import "DYFeedBackListCell.h"
#import "DYFeedBackModel.h"

@interface DYFeedBackListController ()
@property (nonatomic,strong)UIButton *rightBtn;//
@property (nonatomic,assign)NSInteger page;
@property (nonatomic,strong)NSMutableArray *dataArr;

@end

@implementation DYFeedBackListController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"反馈意见";
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithCustomView:self.rightBtn];
    
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYFeedBackListCell" bundle:nil] forCellReuseIdentifier:@"DYFeedBackListCell"];
    self.page = 1;
    
    self.scrollView = self.mainTable;
        self.mainTable.estimatedRowHeight = 300;
    
    OYWeakObj(self)
    [self.mainTable addEmptyViewWithImageName:ListEmptyImageString title:ListEmptyTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    
    [self.mainTable addNetWorkErrorWithImageName:ListNetERROTImageString title:ListNetERROTTipString buttonIcon:@"refresh-btn" action:^{
        [weakself startNetworking:YES];
    }];
    
    self.mainTable.mj_header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
        weakself.page=1;
        [weakself startNetworking:NO];
    }];
    
    self.mainTable.mj_footer = [MJRefreshBackNormalFooter footerWithRefreshingBlock:^{
        weakself.page++;
        [weakself startNetworking:NO];
    }];
    
    [self startNetworking:YES];
}


-(void)startNetworking:(BOOL)tip{
    
    OYWeakObj(self)

    [DYNetworking getWithUrl:OYStringFormat(@"%@/pub/api/usrListSuggestions?token=%@&page=%ld&pageCount=20",MAIN_SRV,GM_User.userToken,self.page) params:nil success:^(id response) {
        
        if ([response[@"code"] integerValue]==0) {
            if (weakself.page==1) {
                weakself.dataArr = nil;
            }
            NSArray *list = response[@"data"][@"list"];
            NSDictionary *users = response[@"data"][@"users"];
            if (notNilOrNull(list)&&list.count>0) {
                [list enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    DYFeedBackModel *model = [DYFeedBackModel modelWithJSON:obj];
                    DYAKXUserModel *uidModel = [DYAKXUserModel modelWithJSON:users[model.uid]];
                    model.uidModel = uidModel;
                    
                    if (notNilOrNull(model.reply.uid)) {
                        DYAKXUserModel *uidModel = [DYAKXUserModel modelWithJSON:users[model.reply.uid]];
                        model.reply.uidModel = uidModel;
                    }
                    
                    [weakself.dataArr addObject:model];
                }];
            }
        }
        [weakself.mainTable reloadData];

    } fail:^(NSError *error) {
    
    } showHUD:tip?self.view:nil];
}



-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.dataArr.count;
}



-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYFeedBackListCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYFeedBackListCell"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;

    DYFeedBackModel *model = self.dataArr[indexPath.row];
    cell.model = model;
    
    OYWeakObj(self);
    [cell setCellCall:^(NSInteger type) {

        switch (type) {
            case 1://点赞
            {
                NSLog(@"点赞");
                [weakself thumpUpSuggestion:model._id target:nil index:indexPath.row cancel:[model.thumpUp containsObject:GM_User.userId]];
            }
                break;
            case 2://删除
            {
                NSLog(@"删除");
                [weakself  usrDeleteSuggestion:model._id index:indexPath.row];
            }
                break;
            case 3:// 评论点赞
            {
                NSLog(@"评论点赞");
                [weakself thumpUpSuggestion:model._id target:@"reply" index:indexPath.row cancel:[model.reply.thumpUp containsObject:GM_User.userId]];
                
            }
                break;
                
                
                
            default:
                break;
        }
        
        
    }];
    
    
    return cell;
}


#pragma  marks ===== 自定义方法=====

-(void)feedBack{
    
    DYFeedbackViewController *VC = [DYFeedbackViewController new];
    [self.navCtl pushViewController:VC animated:YES];
    
}

-(void)thumpUpSuggestion:(NSString *)targetId  target:(NSString *)target index:(NSInteger)index cancel:(BOOL)cancel{
   
    OYWeakObj(self)
    
    NSString *interfaceStr = @"thumpUpSuggestion";
    if (cancel) {
        interfaceStr = @"cancelThumpUp";
    }
    
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/%@?token=%@&id=%@&target=%@",MAIN_SRV,interfaceStr,GM_User.userToken,targetId,target) params:nil success:^(id response) {
   
        if ([response[@"code"] integerValue]==0) {
            NSDictionary *obj = response[@"data"];
            NSDictionary *users = response[@"user"];
            DYFeedBackModel *oldModel = weakself.dataArr[index];
            
            DYFeedBackModel *model = [DYFeedBackModel modelWithJSON:obj];
            DYAKXUserModel *uidModel = [DYAKXUserModel modelWithJSON:users[model.uid]];
            model.uidModel = uidModel;
            
            if (notNilOrNull(model.reply.uid)) {
                DYAKXUserModel *uidModel = [DYAKXUserModel modelWithJSON:users[model.reply.uid]];
                model.reply.uidModel = uidModel;
            }
            
//            [weakself.dataArr  replaceObjectAtIndex:index withObject:model];
            
            oldModel.thumpUp = model.thumpUp;
            oldModel.reply.thumpUp = model.reply.thumpUp;
            
            [weakself.mainTable reloadData];
        }
    } fail:^(NSError *error) {
        
        
    } showHUD:self.view];
    
}

-(void)usrDeleteSuggestion:(NSString *)targetId index:(NSInteger)index{
    
    OYWeakObj(self)
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/usrDeleteSuggestion?token=%@&id=%@",MAIN_SRV,GM_User.userToken,targetId) params:nil success:^(id response) {
        
        
        if ([response[@"code"] integerValue]==0) {
            [weakself.dataArr removeObjectAtIndex:index];
            [weakself.mainTable reloadData];
        }
        
    } fail:^(NSError *error) {
        
        
    } showHUD:self.view];
}


#pragma  marks =====懒加载=====

-(NSMutableArray *)dataArr{
    
    if (!_dataArr) {
        _dataArr = [NSMutableArray new];
    }
    return _dataArr;
}


-(UIButton *)rightBtn{
    
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        
        [_rightBtn setImage:[UIImage imageNamed:@"评论"] forState:UIControlStateNormal];
        [_rightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _rightBtn.titleLabel.font = OYSysFont(15);
        _rightBtn.frame = CGRectMake(0, 0, 100, 44);
        _rightBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
        [_rightBtn addTarget:self action:@selector(feedBack) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}


@end
