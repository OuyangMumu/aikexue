//
//  SearchPhoneVC.h
//  aikexue
//
//  Created by Centny on 07/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import "DYBaseViewController.h"
#import "DY_CollectionView.h"

@interface DYSearchExperimentVC :DYBaseViewController<UICollectionViewDelegate,UICollectionViewDataSource,UITextFieldDelegate>
@property (weak, nonatomic) IBOutlet UITextField *searchTF;
@property (weak, nonatomic) IBOutlet UIView *historyView;
@property (weak, nonatomic) IBOutlet UIImageView *searchBg;

@property (weak, nonatomic) IBOutlet UITableView *searchHistoryTable;

@property (weak, nonatomic) IBOutlet DY_CollectionView *mainCollection;
- (IBAction)back:(UIButton *)sender;
- (IBAction)clearHistory:(UIButton *)sender;

@end
