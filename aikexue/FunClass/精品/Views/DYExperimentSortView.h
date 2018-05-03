//
//  DYExperimentSortView.h
//  aikexue
//
//  Created by Ray on 2017/8/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@class DYExperimentSortView;

@protocol CategoryViewDelegate <NSObject>

-(void)onSelectSort:(BOOL)sort index:(NSIndexPath*)index;

@end


@interface DYExperimentSortView : UIView<UITableViewDelegate,UITableViewDataSource>

@property (strong, nonatomic) IBOutlet UIView *contentView;
@property (weak, nonatomic) IBOutlet UITableView *tableOne;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *tableOneWidth;
@property (weak, nonatomic) IBOutlet UITableView *tableTwo;

@property (nonatomic,assign)NSIndexPath *sortSelected;//排序
@property (nonatomic,assign)NSIndexPath *categorySelected;//类别

@property(nonatomic,strong)NSArray* sortItems;

@property(nonatomic,strong)NSArray* categoryItems;

@property (nonatomic,strong)NSArray *rightItems;



@property(nonatomic,assign)IBOutlet id<CategoryViewDelegate> delegate;

-(void)showWithsortItems:(NSArray *)sortItems categoryItems:(NSArray *)categoryItems;

@end
