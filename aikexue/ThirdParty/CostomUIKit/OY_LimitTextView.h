//
//  OY_LimitTextView.h
//  rcpi
//
//  Created by Ray on 2017/3/15.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface OY_LimitTextView : UITextView

@property (nonatomic,assign) NSInteger limitCount;//字数限制
@property (nonatomic,copy) NSString *LimitText;//超出长度字符剪切

@property (nonatomic,copy)NSString *placeholder;
@property (nonatomic,strong) UIColor * placeholderColor;

@end
