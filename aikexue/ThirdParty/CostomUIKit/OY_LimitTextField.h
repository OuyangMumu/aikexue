//
//  OY_LimitTextField.h
//  gaojun2017031501
//
//  Created by Ray on 2017/3/15.
//  Copyright © 2017年 Ray. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface OY_LimitTextField : UITextField

@property (nonatomic,assign) NSInteger limitCount;//字数限制

@property (nonatomic,copy) NSString *LimitText;//超出长度字符剪切

@end
