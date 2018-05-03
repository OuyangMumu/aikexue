//
//  DYPersonInfoController.m
//  aikexue
//
//  Created by Ray on 2017/8/21.
//  Copyright © 2017年 io. All rights reserved.
//

#import "DYPersonInfoController.h"
#import "DYPersonInfoCell.h"
#import <AVFoundation/AVCaptureDevice.h>
#import <AVFoundation/AVMediaFormat.h>

@interface DYPersonInfoController ()<UINavigationControllerDelegate, UIImagePickerControllerDelegate
>

@property(strong,nonatomic)NSArray *titleArray;
@property (nonatomic,strong)NSMutableArray *subTitleArray;
@property (nonatomic,strong)UIAlertController  *sexAlert;
@property (nonatomic,strong)UIAlertController *imageSelectAlert;

@property (nonatomic,strong)NSMutableDictionary *basicDic;

@property (nonatomic,strong)NSMutableDictionary *extra;

@end

@implementation DYPersonInfoController

- (void)viewDidLoad {
    [super viewDidLoad];
    //
    [self buildUI];
    
}

-(void)buildUI{
    
    self.navigationItem.title = @"个人资料";
    [self.mainTable registerNib:[UINib nibWithNibName:@"DYPersonInfoCell" bundle:nil] forCellReuseIdentifier:@"DYPersonInfoCell"];
    
    self.mainTable.tableFooterView = [UIView new];
    
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    self.subTitleArray = nil;
    [self.mainTable reloadData];
}


#pragma mark==========UITableViewDataSource==========

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    
    return self.titleArray.count;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (indexPath.row==0) {
        return 60;
    }
    return 50;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    DYPersonInfoCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DYPersonInfoCell"];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    
    switch (indexPath.row) {
        case 0:
            [cell fillWithrowTtitl:self.titleArray[indexPath.row] iconImg:self.subTitleArray[indexPath.row] subTwoTitle:nil];
            
            break;
            
        default:
            [cell fillWithrowTtitl:self.titleArray[indexPath.row] iconImg:nil subTwoTitle:self.subTitleArray[indexPath.row]];
            
            break;
    }
    
    
    return  cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    if (indexPath.row==0) {
        DYPersonInfoCell *cell  = [tableView cellForRowAtIndexPath:indexPath];
        
        [self imageSelect:cell];
    }
    if (indexPath.row == 1) {
        if (GM_User.privated.phone.length>0) {
            [Utils alert:@"已绑定" msg:@"你已绑定手机,不需要再绑定"];
            return;
        }
        
        OYWeakObj(self)
        [[DYBindLoginView shareLoginView] showTo:self.view complete:^{
            weakself.subTitleArray = nil;
            [weakself.mainTable reloadData];
        }];
    }
    
    if (indexPath.row==2) {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"修改昵称" message:nil preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        OYWeakObj(self)
        UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [alert  dismissViewControllerAnimated:YES completion:nil];
            UITextField *editTextField = alert.textFields[0];
            
            [weakself.basicDic setValue:editTextField.text forKey:@"nickName"];
            if (!editTextField.text || [editTextField.text isEmpty]) {
                [MBProgressHUD showTipMessageInWindow:@"名字不能为空"];
            }else{
                [weakself saveBasicInfo:weakself.basicDic];
            }
        }];
        [alert addAction:cancel];
        [alert addAction:defaultAction];
        [alert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.placeholder = @"请输入新昵称!";
            textField.text = GM_User.userName;
        }];
        [self presentViewController:alert animated:YES completion:nil];
    }
    
  
}

-(void)imageSelect:(UITableViewCell *)cell{
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (authStatus == AVAuthorizationStatusRestricted || authStatus ==AVAuthorizationStatusDenied)
    {
        //无权限 做一个友好的提示
        UIAlertView * alart = [[UIAlertView alloc]initWithTitle:@"温馨提示" message:@"请您设置允许APP访问您的相机\n设置>隐私>相机" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
        [alart show];
        return ;
    } else {
        //调用相机
        
        if(ISPAD){
            
            UIPopoverPresentationController *popPresenter = [self.imageSelectAlert popoverPresentationController];
            
            popPresenter.sourceView = cell;
            popPresenter.sourceRect = cell.bounds;
            
            [self presentViewController:self.imageSelectAlert animated:YES completion:nil];
            
        }else{
            [self presentViewController:self.imageSelectAlert animated:YES completion:nil];
        }
    }
}

// 拍照完成回调
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo NS_DEPRECATED_IOS(2_0, 3_0){
    
    
    OYWeakObj(self);
    NSString  * url = [FS_url stringByAppendingFormat:@"/usr/api/uload?token=%@&pub=1",GM_User.userToken];
    [DYNetworking uploadWithImage:image url:url filename:@".jpeg" name:@"file" params:nil progress:^(int64_t bytesProgress, int64_t totalBytesProgress) {
        
    } success:^(id response) {
        if([response[@"code"] integerValue]==0){
            [weakself.basicDic setValue:response[@"data"] forKey:@"avatar"];
            [weakself saveBasicInfo:weakself.basicDic];
        }
    } fail:^(NSError *error) {
        
    } showHUD:self.view];
    
    [picker dismissViewControllerAnimated:YES completion:nil];
}

//进入拍摄页面点击取消按钮
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
    [picker dismissViewControllerAnimated:YES completion:nil];
}

-(void)saveBasicInfo:(NSDictionary *)params{
    
    OYWeakObj(self)
    NSDictionary *paramsDic = nil;
    if ([params.allKeys containsObject:@"avatar"] || [params.allKeys containsObject:@"gender"] || [params.allKeys containsObject:@"nickName"]) {
        paramsDic = @{@"attrs":@{@"basic":params}};
    }else if ([params.allKeys containsObject:@"birthday"]){
        paramsDic = @{@"attrs":@{@"extra":params}};
    }
    if (IsNilOrNull(paramsDic)) {
        return;
    }
    

    //创建URL对象
    NSURL *reqUrl =[NSURL URLWithString:OYStringFormat(@"%@/usr/api/update?token=%@",SSO_SRV,GM_User.userToken)];
    //创建请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:reqUrl];
    [request setHTTPMethod:@"POST"];
    [request setAllHTTPHeaderFields:@{@"Content-Type":@"application/octet-stream"}];
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:paramsDic options:kNilOptions error:nil];
    [request setHTTPBody:jsonData];
    
    // 3 建立会话 session支持三种类型的任务
    NSURLSession *session =[NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (data) {
                NSDictionary *dic =[NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
                if(dic){
                    int code=[[dic valueForKey:@"code"]intValue];
                    if(code==0){
                        if ([params.allKeys containsObject:@"nickName"]) {
                            GM_User.userName = params[@"nickName"];
                        }
                        if ([params.allKeys containsObject:@"avatar"]) {
                            GM_User.usrImg = params[@"avatar"];
                        }
                        if([params.allKeys containsObject:@"gender"]){
                            GM_User.basic.gender =  params[@"gender"];
                        }
                        if ([params.allKeys containsObject:@"birthday"]){
                            GM_User.extra.birthday = params[@"birthday"];
                        }
                        weakself.subTitleArray = nil;
                        [weakself.mainTable reloadData];
                    }
                }
            }
        });
    }];
    [dataTask resume];
}




#pragma mark =============懒加载===================

-(NSArray *)titleArray{
    if (!_titleArray) {
        _titleArray = @[@"头像",@"手机号码",@"昵称"];
    }
    return _titleArray;
}


-(UIAlertController *)sexAlert{
    
    if (!_sexAlert) {
        _sexAlert = [UIAlertController  alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
        
        OYWeakObj(self)
        UIAlertAction *first = [UIAlertAction actionWithTitle:@"男" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [weakself.basicDic setValue:@1 forKey:@"gender"];
            [weakself saveBasicInfo:weakself.basicDic];
        }];
        
        
        UIAlertAction * two = [UIAlertAction actionWithTitle:@"女" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [weakself.basicDic setValue:@0 forKey:@"gender"];
            [weakself saveBasicInfo:weakself.basicDic];
        }];
        UIAlertAction * three = [UIAlertAction actionWithTitle:@"保密" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [weakself.basicDic setValue:@2 forKey:@"gender"];
            [weakself saveBasicInfo:weakself.basicDic];
        }];
        
        
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
            
        }];
        
        [_sexAlert addAction:first];
        [_sexAlert addAction:two];
        [_sexAlert addAction:three];
        [_sexAlert addAction:cancel];
        
    }
    return _sexAlert;
}

-(UIAlertController *)imageSelectAlert{
    if (!_imageSelectAlert) {
        
        _imageSelectAlert =  [UIAlertController alertControllerWithTitle:nil message:nil  preferredStyle:UIAlertControllerStyleActionSheet];
        UIAlertAction *a1=[UIAlertAction actionWithTitle:@"使用照相机" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            UIImagePickerController *picker = [[UIImagePickerController alloc] init];
            picker.delegate = self;
            picker.allowsEditing = YES; //可编辑
            //判断是否可以打开照相机
            if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]){
                //摄像头
                picker.sourceType = UIImagePickerControllerSourceTypeCamera;
                [self presentViewController:picker animated:YES completion:nil];
            }
            else{
                NSLog(@"没有摄像头");
            }
        }];
        UIAlertAction *a2=[UIAlertAction actionWithTitle:@"使用相册" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
            // 获取支持的媒体格式
            NSArray *mediaTypes = [UIImagePickerController availableMediaTypesForSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
            // 判断是否支持需要设置的sourceType
            if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
                UIImagePickerController *_imagePickerController=[[UIImagePickerController alloc] init];
                _imagePickerController.delegate=self;
                // 1、设置图片拾取器上的sourceType
                _imagePickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
                // 2、设置支持的媒体格式
                _imagePickerController.mediaTypes = @[mediaTypes[0]];
                // 3、其他设置
                _imagePickerController.allowsEditing = YES; // 如果设置为NO，当用户选择了图片之后不会进入图像编辑界面。
                // 4、推送图片拾取器控制器
                [self presentViewController:_imagePickerController animated:YES completion:^{
                    NSLog(@"打开相机");
                }];
            }
        }];
        
        UIAlertAction *a3=[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }];
        
        [_imageSelectAlert addAction:a1];
        [_imageSelectAlert addAction:a2];
        [_imageSelectAlert addAction:a3];
        
    }
    return  _imageSelectAlert;
}

-(NSMutableArray *)subTitleArray{
    
    if (!_subTitleArray) {
        _subTitleArray  = [NSMutableArray new];
        if (notNilOrNull(GM_User.usrImg)) {
            [_subTitleArray addObject:GM_User.usrImg];
        }else{
            [_subTitleArray addObject:@""];
        }
        
        if (notNilOrNull(GM_User.privated.phone)) {
            [_subTitleArray addObject:GM_User.privated.phone];
        }else{
            [_subTitleArray addObject:@"未填写"];
        }
        
        if (notNilOrNull(GM_User.userName)) {
            [_subTitleArray addObject:GM_User.userName];
        }else{
            [_subTitleArray addObject:@""];
        }
      
    }
    return _subTitleArray;
}

-(NSMutableDictionary *)basicDic{
    if (!_basicDic) {
        _basicDic = [NSMutableDictionary new];
    }
    return _basicDic;
}

-(NSMutableDictionary *)extra{
    if (!_extra) {
        _extra = [NSMutableDictionary new];
    }
    return _extra;
}





@end
