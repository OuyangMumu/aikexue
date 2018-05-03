//
//  DY_RechargeController.m
//  rcpi
//
//  Created by Ray on 2017/6/19.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "DY_RechargeController.h"
#import "DY_RechargeCell.h"
#import "DY_ApplePayManager.h"





@interface DY_RechargeController ()

@property (weak, nonatomic) IBOutlet NSLayoutConstraint *topTipViewH; // 游客情况下的提示View的高度
@property (weak, nonatomic) IBOutlet UILabel *topTipLabel;// 提示内容
@property (weak, nonatomic) IBOutlet UILabel *surplusLab;//剩余
@property (weak, nonatomic) IBOutlet UITableView *mainTable;

@property (nonatomic,strong)NSMutableDictionary *sendServerDic;//上传服务器订单

@property (nonatomic, strong) NSData *receipt; //交易成功后拿到的票据数据

@property (nonatomic,strong)NSMutableArray  *products;

@end

@implementation DY_RechargeController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.navigationItem.title = @"充值";
    [self.mainTable registerNib:[UINib nibWithNibName:@"DY_RechargeCell" bundle:nil] forCellReuseIdentifier:@"DY_RechargeCell"];
    
    [self buildUI];
    [self listProduct];
    
    [self  startNetworking:nil];
    
}

-(void)startNetworking:(BOOL)tip{
    
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/getInfoInGame?token=%@",MAIN_SRV,GM_User.userToken) params:nil success:^(id response) {
        if ([response[@"code"] integerValue]==0) {
            [DYCoinPersonInfo modelWithJSON:response[@"data"][@"person"]];
        }
    } fail:^(NSError *error) {
        [MBProgressHUD showTipMessageInWindow:@"金币获取失败!"];
    } showHUD:tip?self.view:nil];
}

-(void)buildUI{

    //剩余酷币
    NSString *surplusStr = [NSString stringWithFormat:@"剩余%.2f金币", [[DYCoinPersonInfo sharedCoin].coinNum floatValue]];
    NSMutableAttributedString *surplusAtt = [[NSMutableAttributedString alloc]initWithString:surplusStr];
    [surplusAtt addAttributes:@{NSForegroundColorAttributeName:NAV_BAR_COLOR} range:[surplusStr rangeOfString:[NSString stringWithFormat:@"%.2f",[[DYCoinPersonInfo sharedCoin].coinNum floatValue]]]];
    
    self.surplusLab.attributedText = surplusAtt;
    self.surplusLab.textAlignment = NSTextAlignmentCenter;
    
}

-(void)listProduct{
    OYWeakObj(self);
    [DYNetworking getWithUrl:OYStringFormat(@"%@/usr/api/listProduct?token=%@",ORDER,GM_User.userToken) params:nil success:^(id response) {
        NSArray *list = response[@"data"][@"list"];
        if (list && list.count>0) {
            [list enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                [weakself.products addObject:[WalletProduct modelWithJSON:obj]];
            }];
            
            //时间排序
            NSSortDescriptor *sort = [NSSortDescriptor sortDescriptorWithKey:@"id" ascending:YES];//时
            [weakself.products sortUsingDescriptors:@[sort]];
        }
    
        [weakself.mainTable reloadData];

    } fail:^(NSError *error) {
        
        NSArray *list =@[@{@"id":@"io.dyang.aikexue_06",@"money":@"60",@"price":@"6"}
                         ,@{@"id":@"io.dyang.aikexue_12",@"money":@"120",@"price":@"12"}
                         ,@{@"id":@"io.dyang.aikexue_18",@"money":@"180",@"price":@"18"}
                         ,@{@"id":@"io.dyang.aikexue_30",@"money":@"300",@"price":@"30"}
                         ];
        for (NSDictionary *dic in list) {
            [weakself.products addObject: [WalletProduct modelWithJSON:dic]];
        }
        [weakself.mainTable reloadData];
   
    } showHUD:self.view];

}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.products.count;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DY_RechargeCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DY_RechargeCell"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    WalletProduct   *model = self.products[indexPath.row];
    
    cell.priceLab.text = [NSString stringWithFormat:@"%.2f金币",[model.money floatValue]];

    [cell.payButton setTitle:[NSString stringWithFormat:@"¥%ld",[model.price integerValue]] forState:UIControlStateNormal];
    
    OYWeakObj(self);
    [cell setCellCall:^(UIButton *sender){
        model.count = 1;
        [weakself payWithProductModel:model];
    }];
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
}


- (void)payWithProductModel:(WalletProduct * )model{
    if (!GM_User.isLogin) {
        // 游客模式下, 先弹出警告框
        UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"确定现在充值?" message:@"当前个人信息不完善，数据可能会丢失哦，建议先完善个人信息再充值" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"否" style:UIAlertActionStyleCancel handler:nil];
        UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"是" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            OYWeakObj(self);
            [[DY_ApplePayManager shareManager]payWithProductId:model._id complete:^(BOOL success,id json) {
                if (success) {
                    [weakself paySuccess:json];
                }else{
                    [MBProgressHUD showTipMessageInWindow:@"充值失败!"];
                }
            }];
        }];
        [alertVC addAction:cancelAction];
        [alertVC addAction:confirmAction];
        [self presentViewController:alertVC animated:YES completion:nil];
    }
    else {
        OYWeakObj(self);
        [[DY_ApplePayManager shareManager]payWithProductId:model._id complete:^(BOOL success,id json) {
            if (success) {
                [weakself paySuccess:json];
            }else{
                [MBProgressHUD showTipMessageInWindow:@"充值失败!"];
            }
        }];
    }
}


-(void)paySuccess:(id)json{
    
    OYWeakObj(self)
    [GM_User getInfoInGame:^{
        [weakself buildUI];
    }];
    
}




#pragma mark =============懒加载===================
-(NSMutableDictionary *)sendServerDic{
    
    if (!_sendServerDic) {
        _sendServerDic = [NSMutableDictionary new];
        NSDictionary *payData  =  [[NSUserDefaults standardUserDefaults]valueForKey:@"applePayData"];
        if (!payData) {
            _sendServerDic = [NSMutableDictionary dictionaryWithDictionary:payData];
        }
    }
    return _sendServerDic;
}

-(NSMutableArray *)products{
    
    if (!_products) {
        _products = [NSMutableArray new];
    }
    return _products;
}



@end






@implementation WalletProduct


+(NSDictionary<NSString *,id> *)modelCustomPropertyMapper{
    return @{@"_id":@"id"};
    
}

@end




















