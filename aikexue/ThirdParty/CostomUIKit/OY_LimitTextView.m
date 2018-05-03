//
//  OY_LimitTextView.m
//  rcpi
//
//  Created by Ray on 2017/3/15.
//  Copyright © 2017年 itdayang. All rights reserved.
//

#import "OY_LimitTextView.h"

@implementation OY_LimitTextView


//xib初始化
- (void)awakeFromNib{
    [self ezCustom];
}
- (instancetype)initWithCoder:(NSCoder *)aDecoder{
    if (self = [super initWithCoder:aDecoder]) {
        [self ezCustom];
    }
    return self;
}
- (instancetype)initWithFrame:(CGRect)frame textContainer:(NSTextContainer *)textContainer{
    if (self = [super initWithFrame:frame textContainer:textContainer]) {
        [self ezCustom];
    }
    return self;
}
- (instancetype)init{
    if (self = [super init]) {
        [self ezCustom];
    }
    return self;
}
-(instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self ezCustom];
    }
    return self;
}
- (void)ezCustom{
    self.layer.cornerRadius = 8;
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(textFieldEditChanged:) name:UITextViewTextDidChangeNotification object:self];
}
-(void)setPlaceholder:(NSString *)placeholder
{
    _placeholder = [placeholder copy];
    [self setNeedsDisplay];
}

-(void)setPlaceholderColor:(UIColor *)placeholderColor
{
    _placeholderColor = placeholderColor;
    [self setNeedsDisplay];
}

-(void)setFont:(UIFont *)font
{
    [super setFont:font];
    [self setNeedsDisplay];
}

-(void)setText:(NSString *)text
{
    [super setText:text];
    [self setNeedsDisplay];
}


-(void)drawRect:(CGRect)rect
{
    if ([self hasText]) return;
    NSMutableDictionary * attrs = [NSMutableDictionary dictionary];
    attrs[NSForegroundColorAttributeName] = self.placeholderColor ? self.placeholderColor : [UIColor grayColor];
    attrs[NSFontAttributeName] = self.font ? self.font : [UIFont systemFontOfSize:12];
    
    CGFloat x = 5;
    CGFloat y = 5;
    CGFloat w = self.frame.size.width - 2 * x;
    CGFloat h = self.frame.size.height - 2 * y;
    CGRect placeholderRect = CGRectMake(x, y, w, h);
    [self.placeholder drawInRect:placeholderRect withAttributes:attrs];
}

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
    [self ezCustom];
}

-(void)dealloc{
    [[NSNotificationCenter defaultCenter]removeObserver:self];
}

-(void)textFieldEditChanged:(NSNotification *)obj{
    
    UITextView *textField = (UITextView *)obj.object;
    NSString *toBeString = textField.text;
    NSLog(@"toBeString.length = %ld",toBeString.length);
    
    //获取高亮部分
    UITextRange *selectedRange = [textField markedTextRange];
    UITextPosition *position = [textField positionFromPosition:selectedRange.start offset:0];
    
    // 没有高亮选择的字，则对已输入的文字进行字数统计和限制
    if (!position)
    {
        if (toBeString.length > self.limitCount){
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
    
    [self setNeedsDisplay];
    
    [[NSNotificationCenter defaultCenter]postNotificationName:@"OY_LimitTextView" object:nil];
}


@end
