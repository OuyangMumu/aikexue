//
//  OYDownLoadDataManager.h
//  OYDownloadManagerDemo
//
//  Created by tany on 16/6/12.
//  Copyright © 2016年 Dyang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OYDownloadModel.h"
#import "OYDownloadDelegate.h"

/**
 *  下载管理类 封装NSURLSessionDataTask
 */
@interface OYDownLoadDataManager : NSObject <NSURLSessionDataDelegate>

// 下载代理
@property (nonatomic,weak) id<OYDownloadDelegate> delegate;

// 下载中的模型 只读
@property (nonatomic, strong,readonly) NSMutableArray *waitingDownloadModels;

// 等待中的模型 只读
@property (nonatomic, strong,readonly) NSMutableArray *downloadingModels;

// 最大下载数
@property (nonatomic, assign) NSInteger maxDownloadCount;

// 等待下载队列 先进先出 默认YES， 当NO时，先进后出
@property (nonatomic, assign) BOOL resumeDownloadFIFO;

// 全部并发 默认NO, 当YES时，忽略maxDownloadCount
@property (nonatomic, assign) BOOL isBatchDownload;

// 单例
+ (OYDownLoadDataManager *)manager;

// 开始下载
- (OYDownloadModel *)startDownloadURLString:(NSString *)URLString toDestinationPath:(NSString *)destinationPath progress:(OYDownloadProgressBlock)progress state:(OYDownloadStateBlock)state;

// 开始下载
- (void)startWithDownloadModel:(OYDownloadModel *)downloadModel progress:(OYDownloadProgressBlock)progress state:(OYDownloadStateBlock)state;

// 开始下载
- (void)startWithDownloadModel:(OYDownloadModel *)downloadModel;

// 恢复下载（除非确定对这个model进行了suspend，否则使用start）
- (void)resumeWithDownloadModel:(OYDownloadModel *)downloadModel;

// 暂停下载
- (void)suspendWithDownloadModel:(OYDownloadModel *)downloadModel;

// 取消下载
- (void)cancleWithDownloadModel:(OYDownloadModel *)downloadModel;

// 删除下载
- (void)deleteFileWithDownloadModel:(OYDownloadModel *)downloadModel;

// 删除下载
- (void)deleteAllFileWithDownloadDirectory:(NSString *)downloadDirectory;

// 获取正在下载模型
- (OYDownloadModel *)downLoadingModelForURLString:(NSString *)URLString;

// 获取本地下载模型的进度
- (OYDownloadProgress *)progessWithDownloadModel:(OYDownloadModel *)downloadModel;

// 是否已经下载
- (BOOL)isDownloadCompletedWithDownloadModel:(OYDownloadModel *)downloadModel;

// 下载代理

@end

