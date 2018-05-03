//
//  OY_LimitTextField.m
//  gaojun2017031501
//
//  Created by Ray on 2017/3/15.
//  Copyright © 2017年 Ray. All rights reserved.
//

#import "OY_LimitTextField.h"

@implementation OY_LimitTextField

-(void)setLimitText:(NSString *)LimitText{
    if (LimitText.length > self.limitCount)
    {
        
        NSRange rangeIndex = [LimitText rangeOfComposedCharacterSequenceAtIndex:self.limitCount];
        if (rangeIndex.length == 1)
        {
            LimitText = [LimitText substringToIndex:self.limitCount];
        }
        else
        {
            NSRange rangeRange = [LimitText rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, self.limitCount)];
            LimitText = [LimitText substringWithRange:rangeRange];
        }
    }

    self.text = LimitText;
    
}


-(void)setLimitCount:(NSInteger)limitCount{

    _limitCount = limitCount;
    
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(textFieldEditChanged:) name:@"UITextFieldTextDidChangeNotification" object:self];
}

-(void)dealloc{
    [[NSNotificationCenter defaultCenter]removeObserver:self];
}

-(void)textFieldEditChanged:(NSNotification *)obj{

    UITextField *textField = (UITextField *)obj.object;
    NSString *toBeString = textField.text;
    NSLog(@"toBeString.length = %ld",toBeString.length);

    //获取高亮部分
    UITextRange *selectedRange = [textField markedTextRange];
    UITextPosition *position = [textField positionFromPosition:selectedRange.start offset:0];
    
    // 没有高亮选择的字，则对已输入的文字进行字数统计和限制
    if (!position)
    {
        
        if (toBeString.length > self.limitCount)
        {
            NSRange rangeIndex = [toBeString rangeOfComposedCharacterSequenceAtIndex:self.limitCount];
            if (rangeIndex.length == 1)
            {
                textField.text = [toBeString substringToIndex:self.limitCount];
            }
            else
            {
                NSRange rangeRange = [toBeString rangeOfComposedCharacterSequencesForRange:NSMakeRange(0, self.limitCount)];
                textField.text = [toBeString substringWithRange:rangeRange];
            }
        }
    }
    [[NSNotificationCenter defaultCenter]postNotificationName:@"OY_LimitTextField" object:nil];

}
@end
