//
//  DYAboutAKXController.m
//  aikexue
//
//  Created by Ray on 2017/8/14.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYAboutAKXController.h"

@interface DYAboutAKXController ()

@property (nonatomic,strong)NSDictionary *version;//


@end

@implementation DYAboutAKXController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.navigationItem.title = @"关于爱科学";
    //

    self.versionLab.text=[NSString stringWithFormat:@"V%@",[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];

    [self checkVersion];
    

}

- (void)viewDidLayoutSubviews {
    [self.detailTView setContentOffset:CGPointZero animated:NO];
}




-(void)checkVersion{
    NSString *urlStr = @"https://itunes.apple.com/lookup?id=1145313570&country=cn";
    OYWeakObj(self)
    weakself.lastVersion.text = @"无新版本";
    [DYNetworking getWithUrl:urlStr params:nil success:^(id response) {
        
        if([[response valueForKey:@"resultCount"]intValue]<1){
            return;
        }
        NSArray* results=[response valueForKey:@"results"];
      _version=results[0];
        
        if([self isUpdated]){
            [Utils alert:@"新版本" msg:[_version valueForKey:@"releaseNotes"] delegate:self];
            weakself.lastVersion.text = @"请前往App Store更新";

        }
        
    } fail:^(NSError *error) {
        
    } showHUD:nil];
}


-(BOOL)isUpdated{

    NSString *cverison = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    
    NSComparisonResult result = [cverison compare:[_version valueForKey:@"version"]];
    
    return result == NSOrderedAscending;
}

@end
