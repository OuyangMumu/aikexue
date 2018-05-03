//
//  DYExperimentSortView.m
//  aikexue
//
//  Created by Ray on 2017/8/7.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYExperimentSortView.h"
#import "DYExperimentSortCell.h"
@interface DYExperimentSortView()


@property (nonatomic,assign)BOOL sort;//排序  类别

@property (nonatomic,assign)NSInteger categoryLeft;//

@property (nonatomic,assign)NSInteger categoryRight;//

@end


@implementation DYExperimentSortView


-(instancetype)initWithCoder:(NSCoder *)aDecoder {
    
    if (self = [super initWithCoder:aDecoder]) {
        UIView *view = [[[NSBundle mainBundle]loadNibNamed:@"DYExperimentSortView" owner:self options:nil]objectAtIndex:0];
        view.frame = self.bounds;
        [self addSubview:view];
        
        
        OYSysAlpha(self);
        
        [self.tableOne registerClass:[UITableViewCell class] forCellReuseIdentifier:@"UITableViewCell"];
        
        [self.tableTwo registerNib:[UINib nibWithNibName:@"DYExperimentSortCell" bundle:nil] forCellReuseIdentifier:@"DYExperimentSortCell"];
        
        self.categorySelected = [NSIndexPath indexPathForRow:0 inSection:0];
    }
    return self;
}



-(void)setCategoryItems:(NSArray *)categoryItems{
    
    _categoryItems=categoryItems;
    
    if(categoryItems.count){
        
        if(self.categoryLeft<1){
            self.rightItems=nil;
        }else{
            self.rightItems=[categoryItems[self.categoryLeft-1] valueForKey:@"tags"];
        }
        
        [self.tableOne reloadData];
    }
}
- (IBAction)hideSelf:(UIButton *)sender {
    self.hidden = YES;
}

-(void)setRightItems:(NSArray *)rightItems{
    _rightItems = rightItems;
    
    [self.tableTwo reloadData];
    
}

-(void)setSortItems:(NSArray *)sortItems{
    
    _sortItems = sortItems;
    [self.tableTwo reloadData];
}

-(void)setCategorySelected:(NSIndexPath *)categorySelected{
    
    if (categorySelected.section == 0) {
        _categorySelected = [NSIndexPath indexPathForRow:0 inSection:0];
    }else{
        _categorySelected = categorySelected;
    }
}


-(void)showWithsortItems:(NSArray *)sortItems categoryItems:(NSArray *)categoryItems{
    self.hidden = NO;
    
    if (sortItems) {
        self.tableOneWidth.constant = 0;
        self.sort = YES;
        
        self.sortItems = sortItems;
        
    }
    
    if (categoryItems){
        
        self.tableOneWidth.constant = 100;
        self.sort = NO;
        
        self.categoryItems = categoryItems;
    }
}



#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    if (tableView  == self.tableOne) {
        if (self.sort) {//排序
            return 0;
        }else{//类别
            return self.categoryItems.count+1;
        }
    }else{
        if (self.sort) {//排序
            return self.sortItems.count;
        }else{//类别
            return self.rightItems.count;
        }
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 36;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if(self.tableOne==tableView){
        UITableViewCell* cell=[tableView dequeueReusableCellWithIdentifier:@"UITableViewCell"];
        
        cell.backgroundColor=OYClearColor;
        cell.textLabel.font=[UIFont fontWithName:@"FZKaTong-M19S" size:15];
        cell.textLabel.textColor=OYcolorWith0xColor(0x59493F);
        if (indexPath.row == self.categoryLeft) {
            cell.backgroundColor =  OYcolorWith0xColor(0xf1fad9);
        }
        
        if(indexPath.row==0){
            cell.textLabel.text=@"所有类型";
        }else{
            
            NSDictionary* item=self.categoryItems[indexPath.row-1];
            cell.textLabel.text=[item valueForKey:@"name"];
        }
        return cell;
    }else{
        DYExperimentSortCell* cell=[tableView dequeueReusableCellWithIdentifier:@"DYExperimentSortCell"];
        
        cell.backgroundColor=OYClearColor;
        cell.selectBtn.selected = NO;
        
        if (self.sort) {
            cell.titleLab.text=[self.sortItems[indexPath.row] valueForKey:@"name"];
            
            if (indexPath.row == self.sortSelected.row) {
                cell.backgroundColor = OYcolorWith0xColor(0xf1fad9);
                cell.selectBtn.selected = YES;
            }
            
        }else{
            cell.titleLab.text=self.rightItems[indexPath.row];
            
            if (indexPath.row == self.categoryRight) {
                cell.backgroundColor = OYcolorWith0xColor(0xf1fad9);
                cell.selectBtn.selected = YES;
            }
        }
        return cell;
    }
    return nil;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    if(self.tableOne==tableView){
        self.categoryLeft =indexPath.row;
        self.categoryRight=-1;
        
        if(indexPath.row==0){
            self.hidden = YES;
            if ([self.delegate conformsToProtocol:@protocol(CategoryViewDelegate)]&&[self.delegate respondsToSelector:@selector(onSelectSort:index:)]) {
                [self.delegate onSelectSort:NO index:[NSIndexPath indexPathForRow:0 inSection:0]];
            }
            return;
        }
        self.categoryItems = self.categoryItems;
    }else{
        if (self.sort) {
            self.sortSelected = [NSIndexPath indexPathForRow:indexPath.row inSection:0];
            self.sortItems = self.sortItems;
        }else{
            self.categoryRight = indexPath.row;
            
            self.categorySelected = [NSIndexPath indexPathForRow:self.categoryRight inSection:self.categoryLeft];
            self.rightItems =  self.rightItems;
            
        }
        self.hidden = YES;
        
        if ([self.delegate conformsToProtocol:@protocol(CategoryViewDelegate)]&&[self.delegate respondsToSelector:@selector(onSelectSort:index:)]) {
            [self.delegate onSelectSort:self.sort index:self.sort?self.sortSelected:self.categorySelected];
        }
    }
}

#pragma mark ================================


@end
