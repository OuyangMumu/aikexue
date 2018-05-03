/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import "cocos2d.h"
#import "AppController.h"
#import "CAppDelegate.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "manual/ScriptingCore.h"

@interface AppController()

@end

@implementation AppController

+(NSString *)GetKey:(NSString *)msgName and:(NSString *)zipPath{
    //返回游戏名称
    if ([msgName isEqualToString:@"GAMEKEY"]) {
        return  [GM_APP gameKey];
        
    }
    
    if ([msgName isEqualToString:@"TOKEN"]) {
        return  GM_User.userToken;
    }
    
    if ([msgName isEqualToString:@"CURURL"]) {
        return  [ServeUrlModel sharedServeUrlModel].main;
    }
    
    //需要解压的文件(已自行解压)
    else if ([msgName isEqualToString:@"GET_ZIP"]){
        return @"";
    }
    //解压文件存放路径(已自行处理)
    else if([msgName isEqualToString:@"FINISH_UNZIP"]){
        return @"";
    }
    //
    else if ([msgName isEqualToString:@"GET_UNZIP_PATH"]){
        return [NSString stringWithFormat:@"%@/cocos/",[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]];
    }
    else if ([msgName isEqualToString:@"Testing"]){
//        return [Config loadTesting];
    }
    else{
        
        return nil;
    }
    return nil;
}

+(void)CloseCocos2d{
    [GM_APP CloseCocos2d];
}

@end

