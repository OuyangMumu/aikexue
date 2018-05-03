//
//  OYDownloadDelegate.h
//  OYDownloadManagerDemo
//
//  Created by tany on 16/6/24.
//  Copyright © 2016年 Dyang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OYDownloadModel.h"

// 下载代理
@protocol OYDownloadDelegate <NSObject>

// 更新下载进度
- (void)downloadModel:(OYDownloadModel *)downloadModel didUpdateProgress:(OYDownloadProgress *)progress;

// 更新下载状态
- (void)downloadModel:(OYDownloadModel *)downloadModel didChangeState:(OYDownloadState)state filePath:(NSString *)filePath error:(NSError *)error;

@end
