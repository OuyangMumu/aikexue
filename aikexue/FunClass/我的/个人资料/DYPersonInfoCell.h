//
//  DYPersonInfoCell.h
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DYPersonInfoCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *rowTtitl;
@property (weak, nonatomic) IBOutlet UIImageView *arrowIcon;
@property (weak, nonatomic) IBOutlet UIImageView *iconImg;
@property (weak, nonatomic) IBOutlet UILabel *subTitle;
@property (weak, nonatomic) IBOutlet UILabel *subTwoTitle;


-(void)fillWithrowTtitl:(NSString *)rowTtitl iconImg:(NSString *)iconImg subTwoTitle:(NSString *)subTwoTitle;

@end
