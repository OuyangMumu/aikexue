//
//  SectorView.h
//  aikexue
//
//  Created by Centny on 06/05/2017.
//  Copyright © 2017 Dayang. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SectorView : UIButton
@property(nonatomic) IBInspectable CGFloat rate;
@property (nonatomic, assign) float speed;
@property(nonatomic) IBInspectable UIColor* color;
@property(nonatomic) IBInspectable UIColor* bcolor;
@property(nonatomic) IBInspectable CGFloat strokeWidth;

@property (nonatomic,strong)UILabel *kbLabel;

@end
