//
//  DYNetworking.h
//  DYNetworkingDemo
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "MBProgressHUD.h"
#import "FDAlertView.h"


typedef void( ^ DYResponseSuccess)(id response);
typedef void( ^ DYResponseFail)(NSError *error);

typedef void( ^ DYUploadProgress)(int64_t bytesProgress,
                                  int64_t totalBytesProgress);

typedef void( ^ DYDownloadProgress)(int64_t bytesProgress,
                                   int64_t totalBytesProgress);

/**
 *  方便管理请求任务。执行取消，暂停，继续等任务.
 *  - (void)cancel，取消任务
 *  - (void)suspend，暂停任务
 *  - (void)resume，继续任务
 */
typedef NSURLSessionTask DYURLSessionTask;




@interface DYNetworking : NSObject<FDAlertViewDelegate>


@property (nonatomic,strong)FDAlertView *alertView;

+(MBProgressHUD *)showGifToView:(UIView *)view;

/**
 *  单例
 *
 *  @return DYNetworking
 */
+ (DYNetworking *)sharedDYNetworking;

/**
 *  获取网络
 */
@property (nonatomic,assign)NetworkStatus networkStats;

/**
 *  开启网络监测
 */
+ (void)startMonitoring;

/**
 *  get请求方法,block回调
 *
 *  @param url     请求连接，根路径
 *  @param params  参数
 *  @param success 请求成功返回数据
 *  @param fail    请求失败
 *  @param showHUD 是否显示HUD
 */
+(DYURLSessionTask *)getWithUrl:(NSString *)url
           params:(NSDictionary *)params
          success:(DYResponseSuccess)success
             fail:(DYResponseFail)fail
          showHUD:(id)showHUD;

/**
 *  post请求方法,block回调
 *
 *  @param url     请求连接，根路径
 *  @param params  参数
 *  @param success 请求成功返回数据
 *  @param fail    请求失败
 *  @param showHUD 是否显示HUD
 */
+(DYURLSessionTask *)postWithUrl:(NSString *)url
           params:(NSDictionary *)params
          success:(DYResponseSuccess)success
              fail:(DYResponseFail)fail
           showHUD:(id)showHUD;

/**
 *  上传图片方法
 *
 *  @param image      上传的图片
 *  @param url        请求连接，根路径
 *  @param filename   图片的名称(如果不传则以当时间命名)
 *  @param name       上传图片时填写的图片对应的参数
 *  @param params     参数
 *  @param progress   上传进度
 *  @param success    请求成功返回数据
 *  @param fail       请求失败
 *  @param showHUD    是否显示HUD
 */
+ (DYURLSessionTask *)uploadWithImage:(UIImage *)image
                    url:(NSString *)url
               filename:(NSString *)filename
                   name:(NSString *)name
                 params:(NSDictionary *)params
               progress:(DYUploadProgress)progress
                success:(DYResponseSuccess)success
                   fail:(DYResponseFail)fail
                showHUD:(id)showHUD;


/**
 *  下载文件方法
 *
 *  @param url           下载地址
 *  @param saveToPath    文件保存的路径,如果不传则保存到Documents目录下，以文件本来的名字命名
 *  @param progressBlock 下载进度回调
 *  @param success       下载完成
 *  @param fail          失败
 *  @param showHUD       是否显示HUD
 *  @return 返回请求任务对象，便于操作
 */
+ (DYURLSessionTask *)downloadWithUrl:(NSString *)url
                           saveToPath:(NSString *)saveToPath
                             progress:(DYDownloadProgress )progressBlock
                              success:(DYResponseSuccess )success
                              failure:(DYResponseFail )fail
                              showHUD:(id)showHUD;

@end
