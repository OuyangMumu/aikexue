//
//  SearchPhoneVC.m
//  aikexue
//
//  Created by Centny on 07/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import "DYSearchExperimentVC.h"
#import "DYExperimentMainCell.h"


@interface DYSearchExperimentVC ()

@property(strong,nonatomic)NSMutableArray *allExperiments;
@property(strong,nonatomic)NSMutableDictionary *parmaDic;

@property (nonatomic,strong)NSMutableArray *searchHistory;


@property (nonatomic,assign)NSInteger page;
@property (nonatomic,copy)NSString *homePageId;//

@end

@implementation DYSearchExperimentVC

- (void)viewDidLoad {
    [super viewDidLoad];
    
    //
    self.mainCollection.hidden = YES;
    OYViewBorderRadius(self.searchTF, 15, 2, [UIColor darkGrayColor]);
    
    self.searchTF.leftView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, 20, 25)];
    self.searchTF.leftViewMode = UITextFieldViewModeAlways;
    
    [self.searchTF becomeFirstResponder];
    self.historyView.hidden = NO;
    
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(textFieldEditChanged:) name:@"UITextFieldTextDidChangeNotification" object:self.searchTF];

    
    [self.mainCollection  registerNib:[UINib nibWithNibName:@"DYExperimentMainCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainCell"];
    [self.mainCollection  registerNib:[UINib nibWithNibName:@"DYExperimentMainIpadCell" bundle:nil] forCellWithReuseIdentifier:@"DYExperimentMainIpadCell"];

    
    OYWeakObj(self);
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

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:YES];
 
}


-(void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:YES];

}



-(void)startNetworking:(BOOL)tip{
    
    NSString *url = [NSString stringWithFormat:@"%@/pub/api/searchExam?pageCount=300",MAIN_SRV];

    self.parmaDic[@"key"] = self.searchTF.text;
    self.parmaDic[@"token"] = GM_User.userToken;
    self.parmaDic[@"page"] = @(self.page);
    
    OYWeakObj(self);
    [DYNetworking getWithUrl:url params:self.parmaDic success:^(id response) {
        
        if (self.page == 1) {
            self.allExperiments = nil;
        }
        NSArray *list = response[@"data"][@"list"];

        if (notNilOrNull(list)){
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
        weakself.mainCollection.hidden = NO;

    } fail:^(NSError *error) {
        
        [weakself.mainCollection reloadData];
        weakself.mainCollection.hidden = NO;

    } showHUD:tip?self.view:nil];
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


#pragma mark =============uitableviewDelegate===================


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.searchHistory.count;
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    UITableViewCell *cell = [[UITableViewCell alloc]initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:@"cell"];
    cell.backgroundColor = OYClearColor;
    cell.textLabel.font = [UIFont systemFontOfSize:15];
    cell.textLabel.text = self.searchHistory[indexPath.row];
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    self.searchTF.text = self.searchHistory[indexPath.row];
    
}


- (IBAction)back:(UIButton *)sender {
    
    [self.navCtl popViewControllerAnimated:YES];
}

- (IBAction)clearHistory:(UIButton *)sender {
    
    [self storeHistory:[NSArray new]];
    self.searchHistory=[NSMutableArray new];
    [self.searchHistoryTable reloadData];
}

-(BOOL)textFieldShouldReturn:(UITextField *)textField{

    //保存
    if ([self.searchHistory containsObject:textField.text]) {
        [self.searchHistory removeObject:textField.text];
    }
    
    if (textField.text.length>0) {
        [self.searchHistory addObject:textField.text];
        [self storeHistory:[NSArray arrayWithArray:self.searchHistory]];
        [self.searchHistoryTable reloadData];
    }
   
    self.historyView.hidden = YES;
    [self.view endEditing:YES];
    self.page = 1;
    [self startNetworking:YES];
    
    return  YES;
}

-(void)textFieldEditChanged:(NSNotification *)obj{
    
    UITextField *textField = (UITextField *)obj.object;
    if (textField.text.length == 0) {
        self.historyView.hidden = NO;
    }
}

-(BOOL)textFieldShouldBeginEditing:(UITextField *)textField{
    self.historyView.hidden = NO;
    return YES;
}


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

-(NSMutableArray *)searchHistory{
    if (!_searchHistory) {
        _searchHistory = [NSMutableArray new];
        NSArray *defaults =[[NSUserDefaults standardUserDefaults]valueForKey:@"search_history"];
        if (notNilOrNull(defaults)) {
            _searchHistory = [NSMutableArray arrayWithArray:defaults];
        }
    }
    return _searchHistory;
}

-(void)storeHistory:(NSArray *)array{
    NSUserDefaults *defaults =[NSUserDefaults standardUserDefaults];
    [defaults setValue:array forKey:@"search_history"];
    [defaults synchronize];
}


@end
