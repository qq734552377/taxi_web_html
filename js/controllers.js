/**
 * Created by pj on 2017/8/16.
 */
var appControllers = angular.module('appControllers', ["allservice"]);

appControllers.controller('appCtr', function ($scope,$state,$http, JIANCE, path, appContext,allUrl, logOut,getCurLocation) {
    JIANCE.init();//初始化是否已登录和token值
    appContext.getAll().isSidemenu = path.getResult().isSidemenu;//初始化isSidemenu
    $scope.appContext = appContext.getAll();

    $scope.isMain = function () {
        if(window.location.href.indexOf('main2') >= 0){
            return true;
        }
        return false;
    }

    $scope.logOut = function () {
        logOut.logOut();
    }
    $scope.back = function () {
        history.back();
    }

    $scope.$watch('appContext.isAut', function (newValue, oldValue, scope) {
        console.log('用户是否已登录： ' + newValue)
        if (newValue == false) {
            // window.location.replace('#/login');

        }
    });

    $scope.scrollToTop=function () {
        $("html, body").animate({
            scrollTop: $("#bodyHeader").offset().top }, {duration: 500,easing: "swing"});
    };


    $scope.scrollToMap=function () {
        $("html, body").animate({
            scrollTop: $("#adressMap").offset().top }, {duration: 500,easing: "swing"});
    };

    $scope.scrollToDivWithID=function (id) {
        $("html, body").animate({
            scrollTop: $("#"+id).offset().top }, {duration: 500,easing: "swing"});
    };

    $scope.motaiBox = appContext.getAll().motaiTishiBox;
    $scope.isAllWaitting = appContext.getAll().isAllWaitting;


    $scope.isDayOrNight=function (time) {
        var date = getDateByString(time);
        if(date.getHours() > 5 && date.getHours() < 18){
            return 'sun';
        }else{
            return 'moon';
        }
    };


    $scope.goToFaqWithId=function (id) {
        $state.go('faq', {
            id: id+''
        });
    };
    $scope.goToFleet_ratesWithId=function (id) {
        $state.go('fleet_rates', {
            id: id+''
        });
    };

    $scope.goToTopupWithHref =function () {
        $state.go('sidemenu.topup', {
            href: window.location.href
        });
    };
    $(window).scroll(function(){
        if($(window).scrollTop() >1600){
            $("#movetoTop").fadeIn(1000);//一秒渐入动画
        }else{
            $("#movetoTop").fadeOut(500);//一秒渐隐动画
        }
    });


    $scope.goToReportIssue = function () {
        appContext.getAll().fromBookingPage.goToReportIssue = true;
        $state.go('sidemenu.reportIssue', {
            id: appContext.getAll().lastBooking.list.LeaseNumber,
            url:allUrl.reportIssueUrl,
            title:'Report Issue',
            getReasonsUrl:allUrl.reportMainIssueReasonsUrl
        });
    };
    $scope.goToReportIssueWithLeaseNumber = function (LeaseNumber) {
        appContext.getAll().fromBookingPage.goToReportIssue = true;
        $state.go('sidemenu.reportIssue', {
            id:LeaseNumber,
            url:allUrl.reportIssueUrl,
            title:'Report Issue',
            getReasonsUrl:allUrl.reportMainIssueReasonsUrl
        });
    };

    $scope.goToReportIssueWithTitle=function (title) {
        appContext.getAll().fromBookingPage.goToReportIssue = true;
        $state.go('sidemenu.reportIssue', {
            id: appContext.getAll().lastBooking.list.LeaseNumber,
            url:allUrl.breakDownUrl,
            title:title,
            getReasonsUrl:allUrl.reportMainIssueReasonsUrl
        });
    }

    $scope.getHour = function (dateString) {
        var d = getDateByString(dateString);
        return d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
    };
    $scope.getMinutes = function (dateString) {
        var d = getDateByString(dateString);
        return d.getMinutes()> 9 ? d.getMinutes() : "0" + d.getMinutes();
    };
    
    
    $scope.getEnglishYearAppare = function (dataStrig) {
        var d = getDateByString(dataStrig);
        var day = d.getDate() > 9 ? (d.getDate()) : ('0' + d.getDate());
        var month = appContext.getAll().englishMonth[d.getMonth()];
        var year = d.getFullYear();

        return day + " " + month + " " + year ;

    }

    $scope.getFormatDateWithEnglishAppare = function (dateString) {
        return $scope.getEnglishYearAppare(dateString) + ' '+ $scope.getHour(dateString) + ":"+$scope.getMinutes(dateString);
    }

    $scope.islevelSelect = function(item){
      var url = window.location.href;
      if (url.indexOf(item) >= 0) {
          return "on";
      }
      return '';
    };

    $scope.getCanStartTrip = function () {
        appContext.getAll().isAllWaitting = true;

        $http({
            method: 'POST',
            url: allUrl.getCanStartTripUrl,
            data: {
                OpenClose: '1',
                LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Basic " + appContext.getAll().token
            }
        }).success(function (data) {
            console.log(data);
            appContext.getAll().isAllWaitting = false;
            if (data.MsgType == 'Success') {
                appContext.getAll().fromBookingPage.isFromBooking = true;
                window.location.replace("#/sidemenu/startTrip/" + appContext.getAll().lastBooking.list.LeaseNumber);
            } else {
                if (data.MsgType == 'TokenError') {
                    $scope.tokenErrorHandle();
                    return;
                }
                $scope.dataInfoErrorHandle(data);
            }
        }).error(function () {
            $scope.netErrorHandle();
        });

    };


    $scope.tokenErrorHandle = function () {
        appContext.getAll().isAut = false;
        localStorage.removeItem("Token");
        sessionStorage.removeItem("Token")
        window.location.replace("#/login");
    };
    $scope.netErrorHandle = function () {
        appContext.getAll().isAllWaitting = false;
        $scope.motaiBox.title = 'Message Alert:';
        $scope.motaiBox.msg = appContext.getAll().errorMsg.netError;
        $('#moTaiTishiBox').modal('show');
    };
    $scope.dataInfoErrorHandle = function (data) {
        appContext.getAll().isAllWaitting = false;
        appContext.getAll().motaiTishiBox.title = 'Message Alert:';
        appContext.getAll().motaiTishiBox.msg = data.Info;
        $('#moTaiTishiBox').modal('show');
    };
    $scope.errorMsgHandle = function (errorMsg) {
        appContext.getAll().isAllWaitting = false;
        appContext.getAll().motaiTishiBox.title = 'Message Alert:';
        appContext.getAll().motaiTishiBox.msg = errorMsg;
        $('#moTaiTishiBox').modal('show');
    };

    $scope.getGoodNumberShow = function (num) {
        return num > 9 ? num : '0' + num;
    }
    
    getCurLocation.get();

});

appControllers.controller('loginCtr', function ($scope, $http, $state,allUrl, JIANCE,jsToAndroid, appContext) {
    $scope.isRemeberMe = true;
    $scope.errorState = false;
    $scope.errorMsg = 'Incorrect account name or password!';

    $scope.loginMsg = {
        url: allUrl.loginUrl,
        email: '',
        password: '',
        loginSucessUrl: 'booking_search'
        // loginSucessUrl: 'main2'
    };

    function initLoginMsg() {
        if (angular.isDefined($scope.loginMsg.email) && $scope.loginMsg.email != '' && angular.isDefined($scope.loginMsg.password) && $scope.loginMsg.password != ''){
        }else {
            if($("#loginEmail").val()== '' || $("#loginPwd").val() == ''){
            }else {
                $scope.loginMsg.email = $("#loginEmail").val();
                $scope.loginMsg.password = $("#loginPwd").val();
            }
        }
    }


    $scope.login = function () {
        initLoginMsg();
        if (angular.isDefined($scope.loginMsg.email) && $scope.loginMsg.email != '' && angular.isDefined($scope.loginMsg.password) && $scope.loginMsg.password != '') {
            appContext.getAll().isAllWaitting = true;
            $scope.errorState = false;
            $http({
                method: "POST",
                url: $scope.loginMsg.url,
                data: {Email: $scope.loginMsg.email, Password: $scope.loginMsg.password},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.errorState = false;
                    $scope.errorMsg = 'Incorrect account name or password!';
                    localStorage.setItem('isRemeberMe', $scope.isRemeberMe);
                    if ($scope.isRemeberMe) {
                        localStorage.setItem('Token', data.Info);
                        sessionStorage.removeItem('Token');
                    } else {
                        sessionStorage.setItem('Token', data.Info);
                        localStorage.removeItem('Token');
                    }
                    // jsToAndroid.sendToken(data.Info);
                    appContext.getAll().isAut = true;
                    appContext.getAll().token = data.Info;

                    JIANCE.init();

                    if (appContext.getAll().fromBookingPage.isFromBooking) {
                        $state.go('booking' ,{
                            id : appContext.getAll().fromBookingPage.id
                        });
                    } else {
                        $state.go($scope.loginMsg.loginSucessUrl);
                    }
                } else {
                    $scope.errorState = true;
                    $scope.errorMsg = data.Info;
                }

            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                $scope.errorState = true;
                $scope.errorMsg = appContext.getAll().errorMsg.netError;
            });
        }else{
            $scope.errorState = true;
            $scope.errorMsg = appContext.getAll().errorMsg.uncompleteError;
        }

    }
})
    .controller('forgetPasswordCtr', function ($scope, $http,$timeout, allUrl, appContext) {
        initForgetPasswordCtr();

        function initForgetPasswordCtr() {
            $scope.Email = '';
            $scope.getVerificationBtn = {
                title:'Get verification',
                disable:'',
                msg:'Code cannot be empty'
            };
            $scope.verificationCode = '';
            $scope.newPassword = {
                password:'',
                msg:''
            };
            $scope.errorMsg = {
                emailMsg: '',
                emailSpan: ''
            };
            $scope.subBtnState = 'disabled';
        }



        $scope.$watch('Email', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length < 8) {
                $scope.errorMsg = {
                    emailMsg: '',
                    emailSpan: ''
                };
                $scope.getVerificationBtn = {
                    title:'Get verification',
                    disable:'disabled'
                };
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data: {Email: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                if (data.MsgType == 'Success') {
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan = 'success-span';
                    scope.errorMsg.emailMsg = 'Available';
                    $scope.getVerificationBtn = {
                        title:'Get verification',
                        disable:''
                    };
                    $('#verificationCode').val('');
                    $('#newPassword').val('');
                    $scope.verificationCode = '';
                    $scope.newPassword = {
                        password:'',
                        msg:''
                    };
                } else {
                    //没有注册过
                    scope.errorMsg.emailSpan = 'error-span';
                    scope.errorMsg.emailMsg = data.Info;
                    $scope.getVerificationBtn = {
                        title:'Get verification',
                        disable:'disabled'
                    };
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        });

        $scope.getVerification=function () {
            if($scope.errorMsg.emailSpan == 'success-span' && $scope.getVerificationBtn.disable != 'disabled'){
                appContext.getAll().isAllWaitting = true;
                $scope.getVerificationBtn = {
                    title:'Getting...',
                    disable:'disabled'
                };
                $http({
                    method: "POST",
                    url: allUrl.getVerificationUrl,
                    data: {Email: $scope.Email},
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data) {
                    console.log(data);
                    appContext.getAll().isAllWaitting = false;
                    if (data.MsgType == 'Success') {
                        $scope.getVerificationBtn.title = 'Input verification'
                    } else {
                        $scope.getVerificationBtn = {
                            title:'Get verification',
                            disable:''
                        };
                        $scope.dataInfoErrorHandle(data);
                    }
                }).error(function () {
                    $scope.getVerificationBtn = {
                        title:'Get verification',
                        disable:''
                    };
                    $scope.netErrorHandle();
                });
            }
        }

        $scope.sub = function () {


            if($scope.errorMsg.emailSpan != 'success-span'){
                return;
            }

            if(!$scope.verificationCode || $scope.verificationCode == ''){
                $scope.getVerificationBtn.msg='Code cannot be empty!';
                $('#verificationCode').popover('show');
                $timeout(function () {
                    $('#verificationCode').popover('hide');
                },5000);
                return;
            }

            if($scope.verificationCode.length != 6){
                $scope.getVerificationBtn.msg='Code is 6 bit!';
                $('#verificationCode').popover('show');
                $timeout(function () {
                    $('#verificationCode').popover('hide');
                },5000);
                return;
            }
            $scope.getVerificationBtn.msg = '';
            if(!$scope.newPassword.password || $scope.newPassword.password == ''){
                $scope.newPassword.msg='New password cannot be empty!';
                $('#newPassword').popover('show');
                $timeout(function () {
                    $('#newPassword').popover('hide');
                },5000);
                return;
            }

            if($scope.newPassword.password.length < 7){
                $scope.newPassword.msg='New password at least 7 bit!';
                $('#newPassword').popover('show');
                $timeout(function () {
                    $('#newPassword').popover('hide');
                },5000);
                return;
            }

            if(!(/[a-zA-Z]+/.test($scope.newPassword.password) && /\d+/.test($scope.newPassword.password))){
                $scope.newPassword.msg='Must include letters and Numbers!';
                $('#newPassword').popover('show');
                $timeout(function () {
                    $('#newPassword').popover('hide');
                },5000);
                return;
            }
            $scope.newPassword.msg = '';
            if($scope.errorMsg.emailSpan == 'success-span' && $scope.verificationCode && $scope.verificationCode.length == 6){
                appContext.getAll().isAllWaitting = true;
                $http({
                    method: "POST",
                    url: allUrl.getPasswordBackUrl,
                    data: {
                        Email: $scope.Email,
                        VerificationCode:$scope.verificationCode,
                        Password:$scope.newPassword.password
                    },
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data) {
                    appContext.getAll().isAllWaitting = false;
                    if (data.MsgType == 'Success') {
                        initForgetPasswordCtr();
                        $scope.dataInfoErrorHandle(data);
                        $timeout(function () {
                            $('#moTaiTishiBox').modal('hide');
                            $('#moTaiTishiBox').on('hidden.bs.modal', function (e) {
                                window.location.replace('#/login');
                            });
                        },5000);
                    } else {
                        $scope.dataInfoErrorHandle(data);
                    }
                }).error(function () {
                    $scope.netErrorHandle();
                });
            }
        }
    })
    .controller('signinCtr', function ($scope, $http, $state,$stateParams, allUrl, appContext) {

        $scope.signin_f = appContext.getAll().signinMsg;
        $scope.signin_f.ReferralCode = $stateParams.id;
        $scope.errorMsg = {
            emailMsg: '',
            emailSpan: '',
            passwordMsg: '',
            passwordSpan: '',
            passwordAgainMsg: '',
            passwordAgainSpan: '',
            NRICMsg: '',
            NRICSpan: '',
            PhoneMsg: '',
            PhoneSpan: '',
            ReferralCodeMsg: '',
            ReferralCodeSpan: '',
            NameMsg: '',
            NameSpan: ''
        };

        $scope.$watch('signin_f.Email', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length < 8) {
                scope.errorMsg.emailSpan = '';
                scope.errorMsg.emailMsg = '';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data: {Email: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan = 'error-span';
                    scope.errorMsg.emailMsg = 'Email already exist';
                } else {
                    //没有注册过
                    scope.errorMsg.emailSpan = 'success-span';
                    scope.errorMsg.emailMsg = 'Available';
                }
            });
        });
        $scope.$watch('signin_f.Password', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.passwordSpan = '';
                scope.errorMsg.passwordMsg = '';
                return;
            }
            if (newValue.length < 7) {
                scope.errorMsg.passwordSpan = 'error-span';
                scope.errorMsg.passwordMsg = 'Mininum 7 alphanumeric characters value required';
            } else {
                if (!(/[a-zA-Z]+/.test(newValue) && /\d+/.test(newValue))){
                    scope.errorMsg.passwordSpan = 'error-span';
                    scope.errorMsg.passwordMsg = 'Must include letters and Numbers';
                    return;
                }
                scope.errorMsg.passwordSpan = 'success-span';
                scope.errorMsg.passwordMsg = 'OK';
            }
        });

        $scope.$watch('signin_f.PasswordAgain', function (newValue, oldValue, scope) {
            if (newValue == undefined ||scope.signin_f.Password.length < 7) {
                return;
            }
            if (newValue == scope.signin_f.Password) {
                if (scope.signin_f.Password != '') {
                    scope.errorMsg.passwordAgainSpan = 'success-span';
                    scope.errorMsg.passwordAgainMsg = 'OK';
                } else {
                    scope.errorMsg.passwordAgainSpan = '';
                    scope.errorMsg.passwordAgainMsg = '';
                }
            } else {
                scope.errorMsg.passwordAgainSpan = 'error-span';
                scope.errorMsg.passwordAgainMsg = 'Mismatch';
            }
        });

        $scope.$watch('signin_f.NRIC', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.NRICSpan = '';
                scope.errorMsg.NRICMsg = '';
                return;
            }
            if (newValue.length < 9) {
                scope.errorMsg.NRICSpan = 'error-span';
                scope.errorMsg.NRICMsg = 'Unavailable';
                return;
            }else{
                if(/^[S|T]\d{7}\w{1}$/.test(newValue)) {
                    // scope.errorMsg.NRICSpan = 'success-span';
                    // scope.errorMsg.NRICMsg = 'OK';
                }else {
                    scope.errorMsg.NRICSpan = 'error-span';
                    scope.errorMsg.NRICMsg = 'Unavailable';
                    return;
                }
            }
            $http({
                method: "POST",
                url: allUrl.getHasNRICUrl,
                data: {NRIC: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    //Nric可用
                    scope.errorMsg.NRICSpan = 'success-span';
                    scope.errorMsg.NRICMsg = 'OK';
                } else {
                    //Nric不可用
                    scope.errorMsg.NRICSpan = 'error-span';
                    scope.errorMsg.NRICMsg = data.Info;
                }
            }).error(function () {
                scope.errorMsg.NRICSpan = 'success-span';
                scope.errorMsg.NRICMsg = 'OK?';
            });
        });

        $scope.$watch('signin_f.Phone', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.PhoneSpan = '';
                scope.errorMsg.PhoneMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.PhoneSpan = 'error-span';
                scope.errorMsg.PhoneMsg = '8 digits value required';
            } else {
                if(/^[8|9]\d{7}$/.test(newValue)) {
                    scope.errorMsg.PhoneSpan = 'success-span';
                    scope.errorMsg.PhoneMsg = 'OK';
                }else {
                    scope.errorMsg.PhoneSpan = 'error-span';
                    scope.errorMsg.PhoneMsg = 'Invalid handphone value';
                }
            }
        });

        $scope.$watch('signin_f.ReferralCode', function (newValue, oldValue, scope){
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.ReferralCodeSpan = '';
                scope.errorMsg.ReferralCodeMsg = '';
                return;
            }
            if (newValue.length != 8) {
                scope.errorMsg.ReferralCodeSpan = 'error-span';
                scope.errorMsg.ReferralCodeMsg = 'Invalid referral code';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getReferralCodeCanUseUrl,
                data: {
                    ReferralCode: scope.signin_f.ReferralCode
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    //Nric可用
                    scope.errorMsg.ReferralCodeSpan = 'success-span';
                    scope.errorMsg.ReferralCodeMsg = 'Available';
                } else {
                    //Nric不可用
                    scope.errorMsg.ReferralCodeSpan = 'error-span';
                    scope.errorMsg.ReferralCodeMsg = "Invalid";
                }
            }).error(function () {
                scope.errorMsg.ReferralCodeSpan = 'error-span';
                scope.errorMsg.ReferralCodeMsg = 'available?';
            });

        } );

        $scope.signIn = function () {


            if ($scope.signin_f.Email == undefined || $scope.signin_f.Email == '' ||
                $scope.signin_f.Password == undefined || $scope.signin_f.Password == '' ||
                $scope.signin_f.PasswordAgain == undefined || $scope.signin_f.PasswordAgain == '' ||
                $scope.signin_f.NRIC == undefined || $scope.signin_f.NRIC == '' ||
                $scope.signin_f.Phone == undefined || $scope.signin_f.Phone == ''
            ) {
                return;
            }

            if ($scope.signin_f.Password.length < 8 || $scope.signin_f.Password != $scope.signin_f.PasswordAgain) {
                return;
            }

            if ($scope.errorMsg.emailSpan != 'success-span' || $scope.errorMsg.NRICSpan != 'success-span' || $scope.errorMsg.PhoneSpan != 'success-span' || $scope.errorMsg.ReferralCodeSpan == 'error-span') {
                return;
            }
            if ($scope.signin_f.Name.replace(' ','') == ''){
                $scope.errorMsg.NameSpan = 'error-span';
                $scope.errorMsg.NameMsg = 'Please complete it';
                return;
            }else{
                $scope.errorMsg.NameSpan = '';
                $scope.errorMsg.NameMsg = '';
            }

            $scope.signin_f.firstSignUpCompete = true;
            $state.go('signin_second',{
                id : $scope.signin_f.ReferralCode
            });
        }


    })
    .controller('signin_secondCtr', function ($scope, $http, $state,$stateParams, appContext, allUrl,scrollToTop) {
        console.log(appContext.getAll().signinMsg)
        if (!appContext.getAll().signinMsg.firstSignUpCompete) {
            $state.go('signin_first');
            return;
        }
        $('#modalTdvlPhoto').modal('show');

        $scope.msgAboutPic = 'NRIC, Driving License, TDVL',
        $scope.picSrc = 'img/tpdv.jpg';
        $scope.isConfirmSub = false;

        $scope.errorState = false;
        $scope.errorMsg = '';

        $scope.signin_s = appContext.getAll().signinMsg;
        $scope.signin_s.ReferralCode = $stateParams.id;

        $scope.isConfirmToSubmit = function () {

            if (//$scope.signin_s.BlockNo == undefined || $scope.signin_s.BlockNo == '' ||
            //     $scope.signin_s.Storey == undefined || $scope.signin_s.Storey == '' ||
            //     $scope.signin_s.UnitNo == undefined || $scope.signin_s.UnitNo == '' ||
            //     $scope.signin_s.StreetName == undefined || $scope.signin_s.StreetName == '' ||
            $scope.signin_s.Address == undefined || $scope.signin_s.Address == '' ||
            $scope.signin_s.PostalCode == undefined || $scope.signin_s.PostalCode == ''
            ) {
                return;
            }
            if ($scope.signin_s.DateOfBirth == undefined || $scope.signin_s.DateOfBirth == '' ||
                $scope.signin_s.LicenseIssueDate == undefined || $scope.signin_s.LicenseIssueDate == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the Date of Birth and Driving License Issue Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }


            if ($scope.signin_s.TVDLIssue == undefined || $scope.signin_s.TVDLIssue == '' ||
                $scope.signin_s.TVDLExpiry == undefined || $scope.signin_s.TVDLExpiry == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the TDVL First Issue Date and TDVL Expiry Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }

            var pic1 = document.getElementById("signInFileFront").files[0];
            var pic2 = document.getElementById("signInFileBack").files[0];
            var pic3 = document.getElementById("signInMugShot").files[0];
            var pic4 = undefined;


            if ($scope.signin_s.LicenseType == 0) {
                pic4 = document.getElementById("PDVLLetter").files[0];
                if (pic4 == undefined) {
                    return;
                }
            }


            if (pic1 == undefined || pic2 == undefined || pic3 == undefined) {
                return;
            }

            if (!appContext.getAll().isAgreeMe) {
                $scope.motaiBox.title = 'Accept Terms and Conditions';
                $scope.motaiBox.msg = 'To proceed registration, you need to read and accept the Terms and Conditions.';
                $('#moTaiTishiBox').modal('show');
                return;
            }

            $scope.isConfirmSub = $scope.isConfirmSub ? false : true;
            scrollToTop.go();

        };

        $scope.sub = function () {
            if (//$scope.signin_s.BlockNo == undefined || $scope.signin_s.BlockNo == '' ||
            //     $scope.signin_s.Storey == undefined || $scope.signin_s.Storey == '' ||
            //     $scope.signin_s.UnitNo == undefined || $scope.signin_s.UnitNo == '' ||
            //     $scope.signin_s.StreetName == undefined || $scope.signin_s.StreetName == '' ||
            $scope.signin_s.Address == undefined || $scope.signin_s.Address == '' ||
            $scope.signin_s.PostalCode == undefined || $scope.signin_s.PostalCode == ''
            ) {
                return;
            }
            if ($scope.signin_s.DateOfBirth == undefined || $scope.signin_s.DateOfBirth == '' ||
                $scope.signin_s.LicenseIssueDate == undefined || $scope.signin_s.LicenseIssueDate == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the Date of Birth and Driving License Issue Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }


            if ($scope.signin_s.TVDLIssue == undefined || $scope.signin_s.TVDLIssue == '' ||
                $scope.signin_s.TVDLExpiry == undefined || $scope.signin_s.TVDLExpiry == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the TDVL First Issue Date and TDVL Expiry Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }

            var pic1 = document.getElementById("signInFileFront").files[0];
            var pic2 = document.getElementById("signInFileBack").files[0];
            var pic3 = document.getElementById("signInMugShot").files[0];
            var pic4 = undefined;


            if ($scope.signin_s.LicenseType == 0) {
                pic4 = document.getElementById("PDVLLetter").files[0];
                if (pic4 == undefined) {
                    return;
                }
            }


            if (pic1 == undefined || pic2 == undefined || pic3 == undefined) {
                return;
            }
            if (!appContext.getAll().isAgreeMe) {
                $scope.motaiBox.title = 'Accept Terms and Conditions';
                $scope.motaiBox.msg = 'To proceed registration, you need to read and accept the Terms and Conditions.';
                $('#moTaiTishiBox').modal('show');
                return;
            }
            appContext.getAll().isAllWaitting = true;
            // 提交图片
            postMultipart(appContext.getAll().userMsg.UserStatus =='Fail'? allUrl.registAgain : allUrl.signin_sUrl, $scope.signin_s, pic1, pic2, pic3, pic4).success(function (data) {
                console.log(data);

                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    appContext.getAll().fromBookingPage.isFromBooking = true;
                    window.location.replace('#/auditPage');
                    appContext.getAll().signinMsg=signinMsg={
                            Email:'',
                            Password:'',
                            PasswordAgain:'',
                            Name:'',
                            NRIC:'',
                            Phone:'',
                            firstSignUpCompete:false,

                            LicenseType:'0',
                            Salutation:'1',
                            Gender:'1',
                            Nationality:'1',
                            Race:'1',
                            MaritalStatus:'1',
                            EducationLevel:'1',
                            BlockNo:'',
                            Storey:'',
                            UnitNo:'',
                            StreetName:'',
                            PostalCode:'',
                            DateOfBirth:'',
                            LicenseIssueDate:'',
                            TVDLIssue:'',
                            TVDLExpiry:'',
                            PVDLIssue:'',
                            PVDLExpiry:'',
                            ReferralCode:''
                    };
                    $scope.isConfirmSub = false;
                    appContext.getAll().isAgreeMe = false;
                } else {
                    $scope.isConfirmSub = false;
                    $scope.errorState = true;
                    $scope.errorMsg = data.Info;
                }
            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                $scope.isConfirmSub = false;
                $scope.errorState = true;
                $scope.errorMsg = appContext.getAll().errorMsg.netError;
            });
        }

        function postMultipart(url, data, pic1, pic2, pic3, pic4) {
            var fd = new FormData();
            angular.forEach(data, function (val, key) {
                fd.append(key, val);
            });
            fd.append('VerifyFront', pic1);
            fd.append('VerifyBack', pic2);
            fd.append('MugShot', pic3);
            fd.append('PDVLLetter', pic4);
            var args = {
                method: 'POST',
                url: url,
                data: fd,
                timeout: 60 * 1000 * 10,
                headers: {
                    'Content-Type': undefined,
                    Authorization: "Basic " + appContext.getAll().token
                },
                transformRequest: angular.identity
            };
            return $http(args);
        }


    })
    .controller('auditPageCtr', function ($scope, $http, $state, appContext, allUrl) {
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/login');
            return;
        }
        if(appContext.getAll().userMsg.UserStatus == 'Fail'){
            window.location.replace('#/sidemenu/account');
            return;
        }
        $scope.waitObj = {
            isShowAll: true,
            isShowWaitImg: false,
            isShowlockBtn: true,
            title: appContext.getAll().tishiMsg.registSucess,
            msg: appContext.getAll().tishiMsg.registedMsg
        };
    });

appControllers.controller('searchCtr', function ($scope, $http,$stateParams ,appContext, allCarsMsg, allUrl) {

    $scope.searchMsg = appContext.getAll().searchMsg;


    if ($stateParams.id){
        $scope.searchMsg.location = $stateParams.id + '';
    }

    $scope.isWaitting = true;
    $scope.isNoCar = false;
    $scope.isOtherLocationCarViews = false;
    $scope.allCarsMsgs = allCarsMsg.all();

    if ($scope.searchMsg.startTime == '' || compareTimeWithCurrentTime($scope.searchMsg.startDate + " " + $scope.searchMsg.startTime)) {
        initsearchTime($scope.searchMsg);
    }
    if ($scope.searchMsg.durationType){
        $('#h').tab('show');
    }else{
        $('#d').tab('show');
    }

    $('#h').on('shown.bs.tab', function (e) {
        initSearchLocation($scope,true)
        $scope.search();
    })
    $('#d').on('shown.bs.tab', function (e) {
        initSearchLocation($scope,false)
        $scope.search();
    })

    $scope.$watch('searchMsg.location', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return

        $scope.search();
        scope.searchMsg.vehicleNumbers = [];

        if (newValue == 0) {
            scope.searchMsg.vehicleNumber = '0';
            return;
        }
        searchDuration = $scope.searchMsg.duration
        if(!$scope.searchMsg.durationType){
            searchDuration = computeWithHours($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00',$scope.searchMsg.endDate + ' ' + $scope.searchMsg.endTime + ':00')
        }

        $http({
            method: "POST",
            url: allUrl.getVehicleNumberBylocationUrl,
            data: {
                Address: newValue,
                StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                Duration: searchDuration
            }
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                appContext.getAll().searchMsg.vehicleNumbers = data.Data;
                if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, $scope.searchMsg.vehicleNumber)) {
                    scope.searchMsg.vehicleNumber = '0';
                }
            } else {
                scope.searchMsg.vehicleNumber = '0';
            }

        }).error(function () {
            scope.searchMsg.vehicleNumber = '0';
        });

    });

    $scope.$watch('searchMsg.startDate', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });
    $scope.$watch('searchMsg.startTime', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });
    $scope.$watch('searchMsg.endDate', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });
    $scope.$watch('searchMsg.endTime', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });
    $scope.$watch('searchMsg.duration', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        if(newValue > 24){
            $('#d').tab('show');
            initEndDateAndTime(scope.searchMsg)
        }
        $scope.search();
    });
    $scope.$watch('searchMsg.rentFor', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });
    $scope.$watch('searchMsg.vehicleNumber', function (newValue, oldValue, scope) {
        if (newValue == oldValue)
            return
        $scope.search();
    });


    $scope.$watch('searchMsg.locations', function (newValue, oldValue, scope) {
        if (newValue.length <= 0 )
            return
        $("#hourly_location").html("");
        $("#daily_location").html("");
        $("#hourly_location").append("<option value='0'>Select Location</option>");
        $("#daily_location").append("<option value='0'>Select Location</option>");
        for (var i = 0; i < newValue.length; i++) {
            $("#hourly_location").append("<option value='" + newValue[i].ID + "'>" + newValue[i].Address + "</option>");
            $("#daily_location").append("<option value='" + newValue[i].ID + "'>" + newValue[i].Address + "</option>");
        }
        $('#hourly_location').selectpicker('refresh');
        $('#hourly_location').selectpicker('render');
        $('#daily_location').selectpicker('refresh');
        $('#daily_location').selectpicker('render');
        for (var i = 0; i < newValue.length; i++){
            if (scope.searchMsg.location == newValue[i].ID){
                $('.filter-option-inner-inner').text(newValue[i].Address)
                break
            }
        }
    });



    $scope.search = function () {
        $scope.isWaitting = true;
        $scope.isNoCar = false;
        $scope.isOtherLocationCarViews = false;
        $scope.allCarsMsgs = allCarsMsg.clear();

        // if ($scope.searchMsg.location == 0) {
        //     $scope.isWaitting = false;
        //     $scope.isNoCar = true;
        //     return;
        // }
        searchDuration = $scope.searchMsg.duration
        if(!$scope.searchMsg.durationType){
            searchDuration = computeWithHours($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00',$scope.searchMsg.endDate + ' ' + $scope.searchMsg.endTime + ':00')
        }

        if(!isCanSearch($scope,searchDuration)){
            initsearchTime($scope.searchMsg);
            return;
        }
        //请求所有的车辆信息
        $http({
            method: "POST",
            url: $scope.searchMsg.searchUrl,
            data: {
                StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                Duration: searchDuration,
                LeaseType: $scope.searchMsg.rentFor,
                VehiceType: $scope.searchMsg.category,
                Address: $scope.searchMsg.location,
                PlateID: $scope.searchMsg.vehicleNumber
            },
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            console.log(data);
            $scope.isWaitting = false;
            if (data.MsgType == 'Success') {
                $scope.isNoCar = false;
                $scope.allCarsMsgs = allCarsMsg.setAllCars(data.Data);

                if($scope.allCarsMsgs[0].AddressID != $scope.searchMsg.location){
                    $scope.isOtherLocationCarViews = true;
                }
                localStorage.setItem('startTime',$scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00');
                localStorage.setItem('duration',searchDuration);

            } else {
                $scope.isNoCar = true;
            }

        }).error(function () {
            $scope.isWaitting = false;
            $scope.isNoCar = true;
        });

    }

    $scope.search();
})
    .controller('mainsearchCtr', function ($scope, $http, appContext, allUrl) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        if ($scope.searchMsg.startTime == '' || compareTimeWithCurrentTime($scope.searchMsg.startDate + " " + $scope.searchMsg.startTime)) {
            initsearchTime($scope.searchMsg);
        }

        $scope.mainsearch = function () {
            if ($scope.searchMsg.location == 0) {
                $scope.errorMsgHandle("Please select a location.");
                return;
            }
            window.location.href = '#/search/';
        }

        $scope.$watch('searchMsg.location', function (newValue, oldValue, scope) {

            scope.searchMsg.vehicleNumbers = [];
            if (newValue == 0) {
                scope.searchMsg.vehicleNumber = '0';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getVehicleNumberBylocationUrl,
                data: {
                    BindParking: newValue
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.vehicleNumbers = data.Data;
                    if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, $scope.searchMsg.vehicleNumber)) {
                        scope.searchMsg.vehicleNumber = '0';
                    }

                } else {
                    scope.searchMsg.vehicleNumber = '0';
                }
            }).error(function () {
                scope.searchMsg.vehicleNumber = '0';
            });

        });
    });

appControllers.controller('sidemenuCtr', function ($scope, $state, $location) {
    if ($location.path() == '/sidemenu') {
        $state.go('sidemenu.account');//默认显示第一个tab
        $scope.curpath = ''
    }
    if ($location.path() == '/sidemenu/account') {
        $scope.curpath = ''
    }
    $scope.$on('curPath', function (event, data) {
        $scope.curpath = data
    });
})
    .controller('accountCtr', function ($scope, $http, $interval,$timeout, $state ,allUrl, appContext, getWallet) {
        $scope.$emit('curPath', '');

        // $scope.motaiBox=appContext.getAll().motaiTishiBox;

        $scope.tishiBox = {
            isShow: true,
            title: 'Message Alert:',
            msg: ' You will not be able to start any trip or make any bookings until you do a top up.'
        };

        $scope.remainingTime = {
            isTimeout: false,
            day: '00',
            hour: '00',
            min: '00',
            second: '00'
        };
        $scope.timeBox={
            firstBackground:[
                {bgcClass: 'can-booking-bgc',string:'00'},
                {bgcClass: 'can-booking-bgc',string:'01'},
                {bgcClass: 'can-booking-bgc',string:'02'},
                {bgcClass: 'can-booking-bgc',string:'03'},
                {bgcClass: 'can-booking-bgc',string:'04'},
                {bgcClass: 'can-booking-bgc',string:'05'},
                {bgcClass: 'can-booking-bgc',string:'06'},
                {bgcClass: 'can-booking-bgc',string:'07'},
                {bgcClass: 'can-booking-bgc',string:'08'},
                {bgcClass: 'not-booking-bgc',string:'09'},
                {bgcClass: 'not-booking-bgc',string:'10'},
                {bgcClass: 'not-booking-bgc',string:'11'}
            ],
            secondBackground:[
                {bgcClass: 'can-booking-bgc',string:'12'},
                {bgcClass: 'can-booking-bgc',string:'13'},
                {bgcClass: 'can-booking-bgc',string:'14'},
                {bgcClass: 'can-booking-bgc',string:'15'},
                {bgcClass: 'can-booking-bgc',string:'16'},
                {bgcClass: 'can-booking-bgc',string:'17'},
                {bgcClass: 'can-booking-bgc',string:'18'},
                {bgcClass: 'can-booking-bgc',string:'19'},
                {bgcClass: 'can-booking-bgc',string:'20'},
                {bgcClass: 'not-booking-bgc',string:'21'},
                {bgcClass: 'not-booking-bgc',string:'22'},
                {bgcClass: 'not-booking-bgc',string:'23'}
            ],
        };

        $scope.goToSignin_second = function () {
            appContext.getAll().signinMsg.firstSignUpCompete = true;
            $state.go('signin_second',{
                id : ""
            });
        };

        getUserDetailMsg();
        getUserLastBookingMsg();
        getWallet.init();




        $scope.goToEndtrip = function () {
            $('#issuerEndTrip').modal('hide');
            appContext.getAll().isAllWaitting = true;
            $('#issuerEndTrip').on('hidden.bs.modal', function (e) {
                if (!appContext.getAll().isAllWaitting )
                    return;

                $http({
                    method: 'POST',
                    url: allUrl.getCanEndTripUrl,
                    data: {
                        OpenClose: '2',
                        LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + appContext.getAll().token
                    }
                }).success(function (data) {
                    console.log(data);
                    appContext.getAll().isAllWaitting = false;
                    if (data.MsgType == 'Success') {
                        appContext.getAll().fromBookingPage.isFromBooking = true;
                        window.location.href = '#/sidemenu/endtrip/' + appContext.getAll().lastBooking.list.LeaseNumber;
                    } else {
                        if (data.MsgType == 'TokenError') {
                            $scope.tokenErrorHandle();
                            return;
                        }

                        $scope.dataInfoErrorHandle(data);
                    }
                }).error(function () {
                    $scope.netErrorHandle();
                });
            });

        };

        function getUserDetailMsg() {
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getUserDetailUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    appContext.getAll().userMsg = data.Data;

                    if(data.Data.UserStatus != 'Success'){
                        $scope.tishiBox = {
                            isShow: true,
                            title: 'Message Alert:',
                            msg: data.Info
                        };
                        if(data.Data.UserStatus == 'Fail'){
                            appContext.getAll().signinMsg=data.Data;
                            appContext.getAll().signinMsg.LicenseType=data.Data.LicenseType + '';
                            appContext.getAll().signinMsg.Salutation=data.Data.Salutation + '';
                            appContext.getAll().signinMsg.Gender=data.Data.Gender + '';
                            appContext.getAll().signinMsg.Nationality=data.Data.Nationality + '';
                            appContext.getAll().signinMsg.Race=data.Data.Race + '';
                            appContext.getAll().signinMsg.MaritalStatus=data.Data.MaritalStatus + '';
                            appContext.getAll().signinMsg.MaritalStatus=data.Data.MaritalStatus + '';
                            appContext.getAll().signinMsg.Password= '123456789';
                            appContext.getAll().signinMsg.PasswordAgain= '123456789';
                        }
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.tishiBox = {
                        isShow: true,
                        title: 'Message Alert:',
                        msg: data.Info
                    };
                }

            }).error(function () {
                $scope.tishiBox = {
                    isShow: true,
                    title: 'Message Alert:',
                    msg: appContext.getAll().errorMsg.netError
                };
            });
        }

        function getUserLastBookingMsg() {
            $http({
                method: 'POST',
                url: allUrl.getUserLastBookingUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    appContext.getAll().lastBooking = data.Data;

                    var mapUrl='https://www.google.com/maps/embed/v1/place?key='+appContext.getAll().key+'&q='+data.Data.list.Latitude+','+data.Data.list.Longitude+'&zoom='+appContext.getAll().zoom;
                    $('#mapFrame').attr('src',mapUrl);

                    if (data.Data.list.LeaseStatus == 1) {
                        $scope.remainingTime.endtime = data.Data.list.LeaseEndTime;
                        $scope.remainingTime.timer = $interval(function () {
                            getRemainTime($scope.remainingTime);
                        }, 1000);
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    appContext.getAll().lastBooking = undefined;
                }

            }).error(function () {
                appContext.getAll().lastBooking = undefined;
            });
        }


        $scope.$on('$destroy', function () {
            if ($scope.remainingTime.timer) {
                $interval.cancel($scope.remainingTime.timer);
            }
        });
    })
    .controller('editprofileCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Edit Profile');
        if(appContext.getAll().userMsg.UserStatus =='Fail'){
            window.location.replace('#/sidemenu/account');
            return;
        }

        $scope.signin_f = {
            Phone:'',
            oldPassword:'',
            Password:'',
            PasswordAgain:'',
            Address:''
        }

        $scope.errorMsg = {
            emailMsg: '',
            emailSpan: '',
            oldPasswordMsg: '',
            oldPasswordSpan: '',
            passwordMsg: '',
            passwordSpan: '',
            passwordAgainMsg: '',
            passwordAgainSpan: '',
            PhoneMsg: '',
            PhoneSpan: '',
            AddressMsg: '',
            AddressSpan: ''
        };

        $scope.$watch('signin_f.oldPassword', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.oldPasswordSpan = '';
                scope.errorMsg.oldPasswordMsg = '';
                return;
            }
            if (newValue.length < 7) {
                scope.errorMsg.oldPasswordSpan = 'error-span';
                scope.errorMsg.oldPasswordMsg = 'At Least 7';
            } else {
                scope.errorMsg.oldPasswordSpan = '';
                scope.errorMsg.oldPasswordMsg = '';
            }
        });

        $scope.$watch('signin_f.Password', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.passwordSpan = '';
                scope.errorMsg.passwordMsg = '';
                return;
            }
            if (newValue.length < 7) {
                scope.errorMsg.passwordSpan = 'error-span';
                scope.errorMsg.passwordMsg = 'At Least 7';
            } else {
                if (!(/[a-zA-Z]+/.test(newValue) && /\d+/.test(newValue))){
                    scope.errorMsg.passwordSpan = 'error-span';
                    scope.errorMsg.passwordMsg = 'Must include letters and Numbers';
                    return;
                }
                scope.errorMsg.passwordSpan = 'success-span';
                scope.errorMsg.passwordMsg = 'OK';
            }
        });

        $scope.$watch('signin_f.PasswordAgain', function (newValue, oldValue, scope) {
            if (newValue == undefined ||scope.signin_f.Password.length < 7) {
                scope.errorMsg.passwordAgainSpan = '';
                scope.errorMsg.passwordAgainMsg = '';
                return;
            }
            if (newValue == scope.signin_f.Password) {
                if (scope.signin_f.Password != '') {
                    scope.errorMsg.passwordAgainSpan = 'success-span';
                    scope.errorMsg.passwordAgainMsg = 'OK';
                } else {
                    scope.errorMsg.passwordAgainSpan = '';
                    scope.errorMsg.passwordAgainMsg = '';
                }
            } else {
                scope.errorMsg.passwordAgainSpan = 'error-span';
                scope.errorMsg.passwordAgainMsg = 'Mismatch';
            }
        });

        $scope.$watch('signin_f.Address', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.AddressSpan = '';
                scope.errorMsg.AddressMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.AddressSpan = 'error-span';
                scope.errorMsg.AddressMsg = 'At Least 8';
            } else {
                scope.errorMsg.AddressSpan = 'success-span';
                scope.errorMsg.AddressMsg = 'OK';
            }
        });

        $scope.$watch('signin_f.Phone', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.PhoneSpan = '';
                scope.errorMsg.PhoneMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.PhoneSpan = 'error-span';
                scope.errorMsg.PhoneMsg = 'At Least 8';
            } else {
                if(/^[8|9]\d{7}$/.test(newValue)) {
                    scope.errorMsg.PhoneSpan = 'success-span';
                    scope.errorMsg.PhoneMsg = 'OK';
                }else {
                    scope.errorMsg.PhoneSpan = 'error-span';
                    scope.errorMsg.PhoneMsg = 'Miss Spelled';
                }
            }
        });

        $scope.showModal=function () {
            if($scope.errorMsg.oldPasswordSpan == 'error-span' ||
                $scope.errorMsg.passwordSpan == 'error-span' ||
                $scope.errorMsg.passwordAgainSpan == 'error-span'||
                $scope.errorMsg.PhoneSpan == 'error-span'||
                $scope.errorMsg.AddressSpan == 'error-span'
            ){
                    return;
            }

            if($scope.errorMsg.oldPasswordSpan == '' &&
                $scope.errorMsg.passwordSpan == '' &&
                $scope.errorMsg.passwordAgainSpan == ''&&
                $scope.errorMsg.PhoneSpan == ''&&
                $scope.errorMsg.AddressSpan == ''
            ){
                $scope.errorMsgHandle(appContext.getAll().errorMsg.noChange);
                return;
            }

            if($scope.signin_f.Password != $scope.signin_f.PasswordAgain){
                if($scope.signin_f.oldPassword ==undefined || $scope.signin_f.oldPassword.length < 7 ) {
                    $scope.errorMsgHandle(appContext.getAll().errorMsg.noOldPawordError);
                    return;
                }
                $scope.errorMsgHandle(appContext.getAll().errorMsg.dismatchError);
                return;
            }

            $('#isUpdateProfiles').modal('show')
        };

        $scope.editPro=function () {
            $('#isUpdateProfiles').modal('hide');
            appContext.getAll().isAllWaitting = true;

        }
        $('#isUpdateProfiles').on('hidden.bs.modal', function (e) {
            if(!appContext.getAll().isAllWaitting)
                return;

            $http({
                method: 'POST',
                url: allUrl.editProfileUrl,
                data: {
                    Contact : $scope.signin_f.Phone,
                    OldPassword  : $scope.signin_f.oldPassword,
                    Password   : $scope.signin_f.Password,
                    ConfimPassword    : $scope.signin_f.PasswordAgain,
                    Address    : $scope.signin_f.Address
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.dataInfoErrorHandle(data);
                    if($scope.signin_f.Phone != ''){
                        appContext.getAll().userMsg.Phone = new String($scope.signin_f.Phone).replace('"','').replace("'",'');
                    }
                    if($scope.signin_f.Address != ''){
                        appContext.getAll().userMsg.Address = new String($scope.signin_f.Address).replace('"','').replace("'",'');
                    }
                    $scope.signin_f.Phone='';
                    $scope.signin_f.Address='';
                    $scope.signin_f.oldPassword='';
                    $scope.signin_f.Password='';
                    $scope.signin_f.PasswordAgain='';
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }

                    $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        });

    })
    .controller('walletCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'E-wallet History');
        $scope.sourceBookings = [];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);


        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
            $scope.scrollToTop();
        };

        $scope.querry = querryAllWalletMsgs;

        $scope.querry();


        function querryAllWalletMsgs() {
            appContext.getAll().isAllWaitting=true;
            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllWalletMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting=false;
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }

                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        }


    })
    .controller('topupCtr', function ($scope, $http,$stateParams, allUrl, appContext,getTopUpAwaed) {
        $scope.$emit('curPath', 'Top Up');
        $scope.tishiBox = {
            isShow: true,
            color:'alert-info',
            title: 'Message Alert:'
        };
        // alert($stateParams.href);
        querryUserTopupMsg();
        getTopUpAwaed.get();

        function querryUserTopupMsg() {
            appContext.getAll().isAllWaitting = true;

            $http({
                method: 'POST',
                url: allUrl.getUserTopupMsgUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    appContext.getAll().userTopupMsg=data.Data;
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    if(data.Info == 'In the audit, please be patient'){
                        window.location.replace("#/sidemenu/account");
                        return;
                    }

                    if(data.Info == 'Audit failure'){
                        window.location.replace("#/sidemenu/account");
                        return;
                    }
                   $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        }

        $scope.isCanTopUp=function (price,type) {
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.isCanTopUpUrl,
                data: {
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {

                    topup(price,"2");

                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    if(data.Data.IsNeed == true){
                        appContext.getAll().depositMsg=data.Data;
                        $('#isCanTopUp').modal('show');
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        }

        $scope.topUpDeposite=function () {
            $('#isCanTopUp').modal('hide');
            $('#isCanTopUp').on('hidden.bs.modal', function (e) {
                topup(appContext.getAll().depositMsg.Amount,"1");
            })
        }

        function topup(price,type) {
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.topUpUrl,
                data: {
                    Amount: price,
                    Redirect_Url:allUrl.host+'/',
                    Whereabouts:type,
                    Current_Url:$stateParams.href =='' ? window.location.href : $stateParams.href
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    var requestedData = {
                        merchant_account_id: data.Data.MerchantAccountId,
                        request_id: data.Data.RequestId,
                        request_time_stamp: data.Data.UtcTime,
                        transaction_type: data.Data.TransactionType,
                        requested_amount: data.Data.RequestedAmount,
                        requested_amount_currency: data.Data.Currency,
                        redirect_url: data.Data.RedirectUrl,
                        ip_address: data.Data.IpAddress,
                        request_signature: data.Data.Key,
                        attempt_three_d:true,
                        cancel_redirect_url: data.Data.TopUpOnLineCanecl,
                        // fail_redirect_url: data.Data.TopUpOnLineFail,
                    }
                    WirecardPaymentPage.embeddedPay(requestedData);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        }

    })
    .controller('mybookingsCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Booking');
        $scope.sourceBookings = [];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);

        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
            $scope.scrollToTop();
        };


        $scope.querry = queryAllBookings;

        $scope.querry();

        function queryAllBookings() {
            appContext.getAll().isAllWaitting=true;
            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllMyBookingMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                appContext.getAll().isAllWaitting=false;
                console.log(data)
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        }

    })
    .controller('referCtr', function ($scope, $http, allUrl, appContext,getReferAwaed) {
        $scope.$emit('curPath', 'Refer a Friend');
        $scope.baseUrl=allUrl.referHost+'/%23/signup_f/';
        $scope.promoCode='';
        $scope.copyUrl=allUrl.referHost+'/#/signup_f/'+$scope.promoCode;
        $scope.promoUrl=$scope.baseUrl;
        $scope.promoPrice='49';

        getPromotionCode();
        getReferAwaed.get();

        function getPromotionCode() {
            appContext.getAll().isAllWaitting = true;

            $http({
                method: 'POST',
                url: allUrl.getPromotionCodeUrl,
                data: {

                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.promoCode = data.Data.PromotionCode;
                    $scope.promoUrl=$scope.baseUrl+data.Data.PromotionCode;
                    $scope.copyUrl=allUrl.referHost+'/#/signup_f/'+$scope.promoCode;
                    $scope.promoPrice=data.Data.Money/100;
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    if( data.MsgType == 'Error'){
                        window.location.replace("#/sidemenu/account");
                    }
                    $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });
        }

    })
    .controller('startTripCtr', function ($scope, $http,$state, allUrl, appContext) {
        $scope.$emit('curPath', 'Start Trip');
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/sidemenu/account');
            return;
        }

        $scope.waitObj = {
            isShowAll: true,
            isShowWaitImg: true,
            isShowlockBtn: false,
            title: 'Unlocking car, please wait',
            msg: 'Kindly inspect the vehicle for exterior damages/defects while we unlock the car for you.'
        };

        $scope.goToAccount = function () {
            if (!appContext.getAll().startTrip.startTripSure1 || !appContext.getAll().startTrip.startTripSure2 || !appContext.getAll().startTrip.startTripSure3 || !appContext.getAll().startTrip.startTripSure4 || !appContext.getAll().startTrip.startTripSure5) {
                return;
            }
            window.location.replace('#/sidemenu/account');
        };
        $scope.unlockCar = function () {
            startTrip();
        };

        startTrip();
        function startTrip() {

            $scope.waitObj = {
                isShowAll: true,
                isShowWaitImg: true,
                isShowlockBtn: false,
                title: 'Unlocking car, please wait',
                msg: 'Kindly inspect the vehicle for exterior damages/defects while we unlock the car for you.'
            };
            $http({
                method: 'POST',
                url: allUrl.StartTripUrl,
                data: {
                    OpenClose: '1',
                    LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);

                if (data.MsgType == 'Success') {
                    $scope.waitObj.isShowAll = false;

                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.isShowlockBtn = true;
                    $scope.waitObj.title = 'Unlock car failed ，please try agian ！'
                    $scope.waitObj.msg = data.Info;
                }
            }).error(function () {
                $scope.waitObj.isShowWaitImg = false;
                $scope.waitObj.title = 'Message Alert:'
                $scope.waitObj.msg = appContext.getAll().errorMsg.netError;
            });
        }
    })
    .controller('reportIssueCtr', function ($scope, $http, $stateParams, allUrl, appContext,initReportIssueReasons) {
        $scope.$emit('curPath', 'Report Issue');
        if (!appContext.getAll().fromBookingPage.goToReportIssue) {
            window.location.replace('#/sidemenu/account');
            return;
        }
        initReportIssueReasons.init($stateParams.getReasonsUrl);
        $scope.reportIssueObj = {
            LeaseNumber: $stateParams.id,
            CategoryID:'0',
            IssueTypeId: '0',
            Title: '',
            Remarks: '',
            mainTitle:$stateParams.title
        };

        $scope.$watch('reportIssueObj.CategoryID', function (newValue, oldValue, scope) {
            appContext.getAll().ReportIssueSubTitles = [];

            if (newValue == 0) {
                scope.reportIssueObj.IssueTypeId = '0';
                return;
            }

            $http({
                method: "POST",
                url: allUrl.reportSubIssueReasonsUrl,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                },
                data: {
                    ID: newValue
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().ReportIssueSubTitles = data.Data;
                    if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, scope.reportIssueObj.IssueTypeId )) {
                        scope.reportIssueObj.IssueTypeId = '0';
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    scope.reportIssueObj.IssueTypeId = '0';
                }

            }).error(function () {
                scope.reportIssueObj.IssueTypeId = '0';
            });
        });

        $scope.reportIssue = function () {

           var selectID = $scope.reportIssueObj.IssueTypeId;
           var cancelbooking = false;
           for ( var i = 0 ; i < appContext.getAll().ReportIssueSubTitles.length;i++){
               var one = appContext.getAll().ReportIssueSubTitles[i];
                if(selectID == one.ID){
                    cancelbooking = appContext.getAll().ReportIssueSubTitles[i].CancelBookings;
                    break;
                }
           }
            if(cancelbooking){
                $('#connectKeFu').modal('show');
               return;
            }

            var pic1 = document.getElementById("IssuePhoto1").files[0];

            if ($scope.reportIssueObj.IssueTypeId == 0) {
                return;
            }
            appContext.getAll().isAllWaitting = true;
            postMultipart($stateParams.url, $scope.reportIssueObj, pic1).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    window.location.replace('#/sidemenu/account');
                    $scope.errorMsgHandle('Thank you for your submission. We will look into it.');
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }
            }).error(function () {
                $scope.netErrorHandle();
            });


        }

        function postMultipart(url, data, pic1) {

            var fd = new FormData();
            angular.forEach(data, function (val, key) {
                fd.append(key, val);
            });
            fd.append('IssuePhoto1', pic1);
            var args = {
                method: 'POST',
                url: url,
                data: fd,
                headers: {
                    'Content-Type': undefined,
                    Authorization: "Basic " + appContext.getAll().token
                },
                transformRequest: angular.identity
            };
            return $http(args);
        }

    })
    .controller('issue_statusCtr', function ($scope, $http, $stateParams, allUrl, appContext,initReportIssueReasons) {
        $scope.$emit('curPath', 'Issue Status');


        queryIssueStatus();


        function queryIssueStatus() {

            appContext.getAll().isAllWaitting = true;

            $http({
                method: "POST",
                url: allUrl.queryIssueStatusUrl,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                },
                data: {
                    LeaseNumber: $stateParams.id
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    appContext.getAll().issueStausObj = data.Data;

                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    window.location.replace('#/sidemenu/mybookings');
                    appContext.getAll().motaiTishiBox.title = 'Warning:';
                    appContext.getAll().motaiTishiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show')
                }

            }).error(function () {
                window.location.replace('#/sidemenu/mybookings');
                $scope.netErrorHandle();
            });
        }
    })
    .controller('endtripCtr', function ($scope, $http,$state, allUrl, appContext) {
        $scope.$emit('curPath', 'End Trip');
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/sidemenu/account');
            return;
        }
        $scope.waitObj = {
            isShowAll: false,
            isShowWaitImg: true,
            isShowlockBtn: false,
            title: 'Locking car, please wait',
            msg: 'Please wait while we ending your trip. Do not press the BACK button.'
        };


        $scope.lockCar = lockCarById;

        function lockCarById() {
            if (!appContext.getAll().endTrip.endtripSure1 || !appContext.getAll().endTrip.endtripSure2 || !appContext.getAll().endTrip.endtripSure3 || !appContext.getAll().endTrip.endtripSure4 || !appContext.getAll().endTrip.endtripSure5) {
                return;
            }

            $scope.waitObj = {
                isShowAll: true,
                isShowWaitImg: true,
                isShowlockBtn: false,
                title: 'Locking car, please wait',
                msg: 'Please wait while we ending your trip. Do not press the BACK button.'
            };

            $http({
                method: 'POST',
                url: allUrl.endTripUrl,
                data: {
                    OpenClose: '2',
                    DesignatedLocation: appContext.getAll().endTrip.endtripSure1,
                    CarKeyBacked: appContext.getAll().endTrip.endtripSure2,
                    NoThingLeave: appContext.getAll().endTrip.endtripSure3,
                    TakePhotoWithCarCondition: appContext.getAll().endTrip.endtripSure4,
                    SwitchOffMDT: appContext.getAll().endTrip.endtripSure5,
                    NotDesignPosition: !appContext.getAll().endTrip.isDesignLocation,
                    Remark: appContext.getAll().endTrip.Remark,
                    LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);

                if (data.MsgType == 'Success') {
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.title = 'Thank you for using SMRT TAXI SHARE';
                    $scope.waitObj.msg = 'Please ensure that the taxi is locked before you leave, thank you.';
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.isShowlockBtn = true;
                    $scope.waitObj.title = 'Lock car failed ，please try agian ！';
                    $scope.waitObj.msg = data.Info;
                }
            }).error(function () {
                $scope.waitObj.isShowWaitImg = false;
                $scope.waitObj.title = 'Message Alert:';
                $scope.waitObj.msg = appContext.getAll().errorMsg.netError;
            });
        }


    })
    .controller('extendBookingCtr', function ($scope, $http, $stateParams, allUrl, appContext, getWallet) {
        $scope.$emit('curPath', 'Extend Booking');
        $scope.isWaitting = false;
        // $scope.motaiBox=appContext.getAll().motaiTishiBox;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Confirm 3 booking per week and get 50% off the 4th booking o!'
        };
        $scope.carPriceList = {};
        $scope.extensionTimes = '1';
        $scope.insuranceList = [];
        $scope.insuranceMsg={
            totalPriceEveryHour:0,
            sendValue:''
        };

        getWallet.init();
        $scope.$watch('extensionTimes', function (newValue, oldValue, scope) {
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.getExtensionPaiceListUrl,
                data: {
                    Duration: newValue,
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                $scope.carPriceList = data;

                if (data.MsgType == 'Error') {
                    window.location.replace('#/sidemenu/account');
                    $scope.dataInfoErrorHandle(data);
                }

                if (data.MsgType == 'TokenError') {
                    $scope.tokenErrorHandle();
                    return;
                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        });

        $scope.extend = function () {
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.ExtendBookingUrl,
                data: {
                    Duration: $scope.extensionTimes,
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    window.location.replace('#/sidemenu/account');
                    $scope.errorMsgHandle('Booking succesfully extended up to ' + data.Info)
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        };
        getDidHaveInsurance();

        function getDidHaveInsurance() {
            $scope.insuranceMsg.totalPriceEveryHour=0;
            $http({
                method: 'POST',
                url: allUrl.getInsuranceDetialByLeaseNumberUrl,
                data: {
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    $scope.insuranceList =data.Data;

                    for(var i=0;i< $scope.insuranceList.length;i++){
                        $scope.insuranceMsg.totalPriceEveryHour += $scope.insuranceList[i].Premium;
                    }
                }else{
                    $scope.insuranceList={};
                    $scope.insuranceMsg.totalPriceEveryHour=0;
                }

            }).error(function () {

            });
        }
    });

appControllers.controller('booking_deatilsCtr',function ($scope, $http, $stateParams, $timeout, appContext, allUrl, allCarsMsg, getWallet) {
    $scope.timeTable = {
        times: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        bgcolors: [{bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'}
        ]
    };
    var id = $stateParams.id;
    $scope.carMsg = allCarsMsg.getCarById(id);
    $scope.searchMsg = appContext.getAll().searchMsg;
    $scope.isGetCarStateWaitting = true;



    $scope.carPriceList = {};
    $scope.insuranceList = {};
    $scope.insuranceMsg={
        totalPrice:0,
        sendValue:''
    };
    $scope.totalFees=0;
    $scope.errorMsg={
        PromoCodeSpan:'',
        PromoCodeMsg:''
    };

    $scope.isWaitting = true;
    $scope.tishiBox = {
        isShow: true,
        msg: 'Confirm 3 booking per week and get 50% off the 4th booking!'
    };

    console.log($scope.carMsg);

    if (!$scope.carMsg || !$scope.carMsg.ID || !$scope.searchMsg.startTime) {
        window.location.replace("#/search/");
        return;
    }



    //地图的url
    $scope.mapUrl='https://www.google.com/maps/embed/v1/place?key='+appContext.getAll().key+'&q='+$scope.carMsg.Latitude+','+$scope.carMsg.Longitude+'&zoom='+appContext.getAll().zoom;
    $('#mapFrame').attr('src',$scope.mapUrl);
    $scope.currentDay = 0;


    $scope.isFavouriteCarById = function (id) {
        var favouriteCarIDS = appContext.getAll().favouriteCarID;
        for (var i = 0;i < favouriteCarIDS.length;i++){
            if (favouriteCarIDS[i] == id){
                return true;
            }
        }
        return false;
    }

    $scope.getIsFavouriteCarById = function (id) {
        $scope.isFavouriteCar = false;
        $http({
            method: 'POST',
            url: allUrl.getIsFavouriteCar,
            data: {
                VehicleID: id,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Basic " + appContext.getAll().token
            }
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                $scope.isFavouriteCar = data.Data.Collect;
            } else {
                appContext.getAll().isAllWaitting = false;
            }

        }).error(function () {
            appContext.getAll().isAllWaitting = false;
        });
    }
    $scope.getIsFavouriteCarById(id);

    $scope.setFavouriteCar = function () {
        appContext.getAll().isAllWaitting = true;
        $http({
            method: 'POST',
            url: allUrl.setFavouriteCar,
            data: {
                VehicleID: id,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Basic " + appContext.getAll().token
            }
        }).success(function (data) {
            console.log(data);
            appContext.getAll().isAllWaitting = false;
            if (data.MsgType == 'Success') {
                if(data.Info == 'Collect Success'){
                    $scope.isFavouriteCar = true;
                }else{
                    $scope.isFavouriteCar = false;
                }
            } else {
                if (data.MsgType == 'TokenError') {
                    $scope.tokenErrorHandle();
                    return;
                }
                $scope.dataInfoErrorHandle(data);
            }

        }).error(function () {
            $scope.netErrorHandle();
        });

    }

    var startDateTime = ($scope.searchMsg.startDate+ ' ' + $scope.searchMsg.startTime + ':00');
    $scope.currentDate = $scope.searchMsg.startDate;

    $scope.goToLogin = function () {
        appContext.getAll().fromBookingPage.isFromBooking = true;
        appContext.getAll().fromBookingPage.id = id;
        window.location.replace('#/login');
    }

    $scope.geToTopup = function () {
        appContext.getAll().fromBookingPage.isFromBooking = true;
        appContext.getAll().fromBookingPage.id = id;
        window.location.replace('#/sidemenu/topup');
    }
    $scope.getPriceList = getPriceList;
    $scope.getPriceList();
    function getPriceList() {
        $scope.isWaitting = true;
        $scope.carPriceList = {};
        $http({
            method: 'POST',
            url: allUrl.getPriceListUrl,
            data: {
                ID: $scope.carMsg.ID,
                StartTime: startDateTime,
                Duration: $scope.carMsg.Duration,
                VehiceType: $scope.carMsg.VehicleType,
                LeaseType: $scope.carMsg.LeaseType,
                VehicleModel: $scope.carMsg.VehicleModel,
            }
        }).success(function (data) {
            console.log(data)
            $scope.isWaitting = false;
            if(data.MsgType == 'Error'){
                if (data.Info == 'Start time less than current time'){
                    window.location.replace('#/search/');
                    $scope.dataInfoErrorHandle(data);
                    return;
                }
            }
            $scope.carPriceList = data;
        }).error(function () {

        });

        if (appContext.getAll().isAut) {
            getWallet.init();
        }

    }
    $scope.jumpDayCarState = getCarAvailableStateWithDays;
    $scope.jumpDayCarState(0);

    function getCarAvailableStateWithDays(days) {
        if (days < 0 || days > 28) {
            return;
        }

        $scope.currentDay = days;
        $scope.currentDate = addDayWithStringDateReturnFormatStringDate(startDateTime, days).split(' ')[0];

        $scope.isGetCarStateWaitting = true;

        $http({
            method: 'POST',
            url: allUrl.getCarAvailableStateUrl,
            data: {
                ID: $scope.carMsg.ID,
                StartTime: addDayWithStringDateReturnFormatStringDate(startDateTime, days),
                VehiceType: $scope.carMsg.VehicleType,
                LeaseType: $scope.carMsg.LeaseType,
                VehicleModel: $scope.carMsg.VehicleModel,
                Address: $scope.carMsg.Address,
            }
        }).success(function (data) {
            console.log(data)
            $scope.isGetCarStateWaitting = false;
            angular.forEach(data.Data, function (val, key) {
                if(val=='Limited Taxis'){
                    $scope.timeTable.bgcolors[key].bgcClass='may-booking-bgc';
                }else if(val=='Available'){
                    $scope.timeTable.bgcolors[key].bgcClass='can-booking-bgc';
                }else{
                    $scope.timeTable.bgcolors[key].bgcClass='not-booking-bgc';
                }
            });
        }).error(function () {
            $scope.isGetCarStateWaitting = false;
        });
    }
    })
    .controller('bookingCtr', function ($scope, $http, $stateParams, $timeout, appContext, allUrl, allCarsMsg, getWallet) {

        var id = $stateParams.id;
        $scope.carMsg = allCarsMsg.getCarById(id);
        if (!$scope.carMsg){
            var localDate = getDateByString(localStorage.getItem('startTime'));
            if(new Date().getTime() - localDate.getTime() > 0){
                var formatDate = getFormatTime(addByhours(new Date(),1));
                localStorage.setItem('startTime',formatDate.Date + ' ' + formatDate.Time + ":00" );
            }
            $.ajax({
                url: allUrl.searchUrl,
                async:false,
                type : "POST",
                dataType : "json",
                data: {
                    StartTime: localStorage.getItem('startTime'),
                    Duration: localStorage.getItem('duration'),
                    LeaseType: '0',
                    VehiceType: '0',
                    Address: '0',
                    PlateID: '0'
                },
                success: function(data){
                    allCarsMsg.setAllCars(data.Data);
                    $scope.carMsg = allCarsMsg.getCarById(id);
                }
            });
        }

        appContext.getAll().isAgreeMe = false;
        $scope.searchMsg = appContext.getAll().searchMsg;
        $scope.isGetCarStateWaitting = true;
        $scope.carPriceList = {};
        $scope.insuranceList = {};
        $scope.isKnowAER = false;
        $scope.insuranceMsg={
            totalPrice:0,
            sendValue:''
        };
        $scope.totalFees=0;
        $scope.AER=0;
        $scope.errorMsg={
            PromoCodeSpan:'',
            PromoCodeMsg:''
        };

        $scope.isWaitting = true;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Confirm 3 booking per week and get 50% off the 4th booking!'
        };

        console.log($scope.carMsg);

        if (!$scope.carMsg || !$scope.carMsg.ID ) {
            window.location.replace("#/search/");
            return;
        }

        //地图的url
        $scope.mapUrl='https://www.google.com/maps/embed/v1/place?key='+appContext.getAll().key+'&q='+$scope.carMsg.Latitude+','+$scope.carMsg.Longitude+'&zoom='+appContext.getAll().zoom;
        $('#mapFrame').attr('src',$scope.mapUrl);
        $scope.currentDay = 0;


        var startDateTime = localStorage.getItem('startTime');
        $scope.currentDate = $scope.searchMsg.startDate;

        $scope.goToLogin = function () {
            appContext.getAll().fromBookingPage.isFromBooking = true;
            appContext.getAll().fromBookingPage.id = id;
            window.location.replace('#/login');
        }

        $scope.geToTopup = function () {
            appContext.getAll().fromBookingPage.isFromBooking = true;
            appContext.getAll().fromBookingPage.id = id;
            window.location.replace('#/sidemenu/topup');
        }


        $scope.$watch('carMsg.PromoCode', function (newValue, oldValue, scope) {
            appContext.getAll().promoData={};
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.PromoCodeSpan = '';
                scope.errorMsg.PromoCodeMsg = '';
                return;
            }
            if (newValue.length != 6) {
                scope.errorMsg.PromoCodeSpan = 'error-span';
                scope.errorMsg.PromoCodeMsg = 'Unavailable';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getPromoCodeCanUseUrl,
                data: {
                    ID: scope.carMsg.ID,
                    StartTime: startDateTime,
                    Duration: scope.carMsg.Duration,
                    VehiceType: scope.carMsg.VehicleType,
                    LeaseType: scope.carMsg.LeaseType,
                    VehicleModel: scope.carMsg.VehicleModel,
                    PromoCode: scope.carMsg.PromoCode,
                    OriginalPrice:scope.carPriceList.BookingTotal
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    //Nric可用
                    scope.errorMsg.PromoCodeSpan = 'success-span';
                    scope.errorMsg.PromoCodeMsg = 'Available';
                    appContext.getAll().promoData=data.Data;
                    // appContext.getAll().promoData.TotalPreferential=$scope.carPriceList.BookingTotal - (data.Data.BookingTotal -data.Data.TotalPreferential);
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        $scope.goToLogin();
                        return;
                    }
                    //Nric不可用
                    scope.errorMsg.PromoCodeSpan = 'error-span';
                    scope.errorMsg.PromoCodeMsg = data.Info;
                }
            }).error(function () {
                scope.errorMsg.PromoCodeSpan = 'error-span';
                scope.errorMsg.PromoCodeMsg = 'available?';
            });
        });

        $scope.getPriceList = getPriceList;



        function getPriceList() {
            $scope.isWaitting = true;
            $scope.carPriceList = {};
            $http({
                method: 'POST',
                url: allUrl.getPriceListUrl,
                data: {
                    ID: $scope.carMsg.ID,
                    StartTime: startDateTime,
                    Duration: $scope.carMsg.Duration,
                    VehiceType: $scope.carMsg.VehicleType,
                    LeaseType: $scope.carMsg.LeaseType,
                    VehicleModel: $scope.carMsg.VehicleModel,
                    Insurance:getQuerryCarPriceInsuranceSendString($scope.insuranceList)
                }
            }).success(function (data) {
                console.log(data)
                $scope.isWaitting = false;
                if(data.MsgType == 'Error'){
                    if (data.Info == 'Start time less than current time'){
                        window.location.replace('#/search/');
                        $scope.dataInfoErrorHandle(data);
                        return;
                    }
                }
                $scope.carPriceList = data;
                checkBoxJianTing($scope.insuranceList);
            }).error(function () {

            });

            if (appContext.getAll().isAut) {
                getWallet.init();
            }

        }

        $scope.bookingTheCar = function () {
            if (!appContext.getAll().isAgreeMe) {
                $scope.motaiBox.title = 'Accept Terms and Conditions';
                $scope.motaiBox.msg = 'To proceed booking the vehicle, you need to read and accept the Terms and Conditions.';
                $('#moTaiTishiBox').modal('show');
                return;
            }
            if($scope.errorMsg.PromoCodeSpan == 'error-span'){
                $scope.motaiBox.title = 'Message Alert:';
                $scope.motaiBox.msg = 'Your promo code is not correct, please re-enter or empty!';
                $('#moTaiTishiBox').modal('show');
                return;
            }

            if($scope.AER> 0){
                $('#AERIssueDialog').modal('show');
                $scope.isKnowAER = false;
                return;
            }

            bookCarByHttp();
        }

        $scope.bookCarInModal = function () {
            $('#AERIssueDialog').modal('hide');
            $scope.isKnowAER = true;
        }

        $('#AERIssueDialog').on('hidden.bs.modal', function (e) {
            if(!$scope.isKnowAER)
                return;
            bookCarByHttp();
        });

        function bookCarByHttp() {
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.bookingTheCarUrl,
                data: {
                    ID: $scope.carMsg.ID,
                    StartTime: startDateTime,
                    Duration: $scope.carMsg.Duration,
                    VehiceType: $scope.carMsg.VehicleType,
                    LeaseType: $scope.carMsg.LeaseType,
                    VehicleModel: $scope.carMsg.VehicleModel,
                    PromoCode: $scope.carMsg.PromoCode,
                    Insurance:getInsuranceSendString($scope.insuranceList)
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    var bookingId = data.Info;
                    appContext.getAll().fromBookingPage.isFromBooking = true;
                    window.location.replace('#/bookingconfirm/' + bookingId);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        }
        getInsurance();

        function getInsurance() {
            $scope.isWaitting = true;
            $scope.carPriceList = {};
            $http({
                method: 'POST',
                url: allUrl.getInsuranceDetialUrl,
                data: {

                }
            }).success(function (data) {
                console.log(data)
                $scope.isWaitting = false;
                if(data.MsgType == 'Success'){
                    $scope.insuranceList=data.Data;
                    $scope.getPriceList();
                }
            }).error(function () {

            });
        }


        $scope.$watch('insuranceList', function (newValue, oldValue, scope) {
            $timeout(function () {
                checkBoxJianTing(newValue)
            },1000);
        });


        //监听checkBox
        function checkBoxJianTing(insuranceList) {
            if(insuranceList == null || insuranceList.length <= 0){
                return;
            }
            for(var total=0;total < insuranceList.length;total++){
                $scope.insuranceMsg.totalPrice +=insuranceList[total].Premium;
                // $scope.totalFees=$scope.insuranceMsg.totalPrice*$scope.carMsg.Duration +$scope.carPriceList.BookingTotal
                setSomePrice($scope,$scope.carPriceList.AER);
                $("#insuranceCheck"+insuranceList[total].ID).change(function(){
                    if($(this).get(0).checked){
                        // $scope.insuranceMsg.totalPrice += getPriceByID($(this).val());
                        setSomePrice($scope,$scope.carPriceList.AER);
                    }else{
                        // $scope.insuranceMsg.totalPrice -= getPriceByID($(this).val());
                        setSomePrice($scope,0);
                    }
                    // $scope.totalFees=$scope.insuranceMsg.totalPrice*$scope.carMsg.Duration +$scope.carPriceList.BookingTotal
                    $scope.$apply();
                });
            }
        }
        function setSomePrice(scope,aerval) {
            scope.AER = aerval;
            scope.totalFees = scope.AER + scope.carPriceList.BookingTotal;
        }

        function getPriceByID(id) {
            for (var start=0;start < $scope.insuranceList.length;start++){
                if($scope.insuranceList[start].ID == id){
                    return $scope.insuranceList[start].Premium;
                }
            }
        }


})
    .controller('bookingconfirmCtr', function ($scope, $http, $stateParams, appContext, allUrl) {
        $scope.timeTable = {
            times: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            bgcolors: [{bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'not-booking-bgc'},
                {bgcClass: 'not-booking-bgc'},
                {bgcClass: 'not-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'may-booking-bgc'},
                {bgcClass: 'can-booking-bgc'},
                {bgcClass: 'can-booking-bgc'}
            ]
        };
        $scope.lastBookingMsg = {};
        $scope.isWaitting = true;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Your booking is successful. You may proceed to unlock the taxi using your account when you are ready to start the trip.'
        };
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/search/');
            return;
        }


        getLastBookingMsg();

        function getLastBookingMsg() {
            $scope.isWaitting = true;
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getBookingMsgByIdUrl,
                data: {
                    LeaseNumber: $stateParams.id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;

                if (data.MsgType == 'Success') {
                    $scope.lastBookingMsg = data.Data;
                    $scope.tishiBox.isShow = true;
                    var mapUrl='https://www.google.com/maps/embed/v1/place?key='+appContext.getAll().key+'&q='+data.Data.list.Latitude+','+data.Data.list.Longitude+'&zoom='+appContext.getAll().zoom;
                    $('#mapFrame').attr('src',mapUrl);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = data.Info;
                }

            }).error(function () {
                $scope.isWaitting = false;
                $scope.tishiBox.isShow = true;
                $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
            });
        }

    })
    .controller('bookingdetailsCtr', function ($scope, $http, $stateParams,$state, $timeout,appContext, allUrl,initCancelReason) {
        $scope.bookingMsg = {};
        $scope.isWaitting = true;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Confirm 3 booking  !'
        };
        initCancelReason.init();

        $scope.goToEndtrip = function () {
            $('#issuerEndTrip').modal('hide');
            appContext.getAll().isAllWaitting = true;
            $('#issuerEndTrip').on('hidden.bs.modal', function (e) {
                if (!appContext.getAll().isAllWaitting )
                    return;

                $http({
                    method: 'POST',
                    url: allUrl.getCanEndTripUrl,
                    data: {
                        OpenClose: '2',
                        LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + appContext.getAll().token
                    }
                }).success(function (data) {
                    console.log(data);
                    appContext.getAll().isAllWaitting = false;
                    if (data.MsgType == 'Success') {
                        appContext.getAll().fromBookingPage.isFromBooking = true;
                        window.location.href = '#/sidemenu/endtrip/' + appContext.getAll().lastBooking.list.LeaseNumber;
                    } else {
                        if (data.MsgType == 'TokenError') {
                            $scope.tokenErrorHandle();
                            return;
                        }

                        $scope.dataInfoErrorHandle(data);
                    }
                }).error(function () {
                    $scope.netErrorHandle();
                });
            });

        };

        $scope.cancelTrip = function () {
            $('#issuerCancelTrip').modal('hide');
            // $('body').toggleClass('modal-open');
            // $('.modal-backdrop.fade.in').remove();
            //取消订单的api调用
            appContext.getAll().isAllWaitting = true;
            $('#issuerCancelTrip').on('hidden.bs.modal', function (e) {
                if (!appContext.getAll().isAllWaitting )
                    return;

                $http({
                    method: 'POST',
                    url: allUrl.cansleBookingUrl,
                    data: {
                        OrderNumber: $stateParams.id,
                        LeaseCancelReason: appContext.getAll().endTrip.LeaseCancelReason,//取消理由
                        Memo: appContext.getAll().endTrip.Memo//备注
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + appContext.getAll().token
                    }
                }).success(function (data) {
                    console.log(data);
                    appContext.getAll().isAllWaitting = false;
                    $scope.isWaitting = false;
                    if (data.MsgType == 'Success') {
                        window.location.replace('#/sidemenu/mybookings');
                        $scope.dataInfoErrorHandle(data);
                    } else {
                        if (data.MsgType == 'TokenError') {
                            $scope.tokenErrorHandle();
                            return;
                        }
                        $scope.tishiBox.isShow = true;
                        $scope.tishiBox.msg = data.Info;
                    }

                }).error(function () {
                    appContext.getAll().isAllWaitting = false;
                    $scope.isWaitting = false;
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
                });
            });
        };

        $scope.goToFaqCancelAq=function () {
            $('#issuerCancelTrip').modal('hide');
            $('#issuerCancelTrip').on('hidden.bs.modal', function (e) {
                $state.go('faq', {
                    id: 'data-target_t3_q7'
                });
            });
        };

        querryBookingMsgById();

        function querryBookingMsgById() {

            $scope.isWaitting = true;
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getBookingMsgByIdUrl,
                data: {
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.bookingMsg = data.Data;
                    appContext.getAll().lastBooking = data.Data;
                    var mapUrl='https://www.google.com/maps/embed/v1/place?key='+appContext.getAll().key+'&q='+data.Data.list.Latitude+','+data.Data.list.Longitude+'&zoom='+appContext.getAll().zoom;
                    $('#mapFrame').attr('src',mapUrl);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = data.Info;
                }

            }).error(function () {
                $scope.isWaitting = false;
                $scope.tishiBox.isShow = true;
                $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
            });
        }
    });

appControllers.controller('faqCtr', function ($scope,$stateParams,scrollToTop) {

    if($stateParams.id){
        scrollAndOpen($stateParams.id);
    }else{
        scrollToTop.go();
    }



})
    .controller('ourratesCtr', function ($scope, $http, $stateParams, appContext, allUrl) {
        $scope.rateSearch= appContext.getAll().rateSearch;
        initsearchTime($scope.rateSearch);
    })
    .controller('privacypolicyCtr', function ($scope) {

    })
    .controller('termsCtr', function ($scope) {

    })
    .controller('mainCtr', function ($scope,appContext) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        if(appContext.getAll().isAut){
            window.location.replace('#/booking_search')
        }

        $scope.goToSearchWithCarType=function (rentFor) {
            $scope.searchMsg.rentFor=rentFor;
            // $scope.searchMsg.rentFor=id;
            window.location='#/search/';
        }
        $scope.goToSearchWithLocation=function (location) {
            $scope.searchMsg.location=location;
            $scope.searchMsg.rentFor='0';
            // $scope.searchMsg.rentFor=id;
            window.location='#/search/';
        }
    })
    .controller('booking_searchCtr', function ($scope,$http,appContext,allUrl,allCarsMsg,getReferAwaed ) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        if(!appContext.getAll().isAut){
            window.location.replace('#/main2')
        }
        if ($scope.searchMsg.durationType){
            $('#h').tab('show');
        }else{
            $('#d').tab('show');
        }

        $('#h').on('shown.bs.tab', function (e) {
            initSearchLocation($scope,true)
        })
        $('#d').on('shown.bs.tab', function (e) {
            initSearchLocation($scope,false)
        })
        $scope.$watch('searchMsg.duration', function (newValue, oldValue, scope) {
            if(newValue > 24){
                $('#d').tab('show');
                initEndDateAndTime(scope.searchMsg)
            }
        });
        $scope.$watch('searchMsg.locations', function (newValue, oldValue, scope) {
            if (newValue.length <= 0)
                return
            $("#hourly_location").html("");
            $("#daily_location").html("");
            $("#hourly_location").append("<option value='0'>Select Location</option>");
            $("#daily_location").append("<option value='0'>Select Location</option>");
            for (var i = 0; i < newValue.length; i++) {
                $("#hourly_location").append("<option value='" + newValue[i].ID + "'>" + newValue[i].Address + "</option>");
                $("#daily_location").append("<option value='" + newValue[i].ID + "'>" + newValue[i].Address + "</option>");
            }
            $('#hourly_location').selectpicker('refresh');
            $('#hourly_location').selectpicker('render');
            $('#daily_location').selectpicker('refresh');
            $('#daily_location').selectpicker('render');
            for (var i = 0; i < newValue.length; i++){
                if (scope.searchMsg.location == newValue[i].ID){
                    $('.filter-option-inner-inner').text(newValue[i].Address)
                    break
                }
            }


        });




        //分页
        $scope.sourceBookings = [];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];
        initPage($scope);
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
        };


        //////////////////////////分页//////////////////////////////////
        
        $scope.isNoCar = false;
        $scope.isOtherLocationCarViews = false;


        $scope.goToSearchWithCarType=function (rentFor) {
            $scope.searchMsg.rentFor=rentFor;
            // $scope.searchMsg.rentFor=id;
            window.location='#/search/';
        }
        $scope.goToSearchWithLocation=function (location) {
            $scope.searchMsg.location=location;
            $scope.searchMsg.rentFor='0';
            // $scope.searchMsg.rentFor=id;
            window.location='#/search/';
        }

        if ($scope.searchMsg.startTime == '' || compareTimeWithCurrentTime($scope.searchMsg.startDate + " " + $scope.searchMsg.startTime)) {
            initsearchTime($scope.searchMsg);
        }

        $scope.$watch('searchMsg.location', function (newValue, oldValue, scope) {

            scope.searchMsg.vehicleNumbers = [];

            if (newValue == 0) {
                scope.searchMsg.vehicleNumber = '0';
                return;
            }

            searchDuration = $scope.searchMsg.duration
            if(!$scope.searchMsg.durationType){
                searchDuration = computeWithHours($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00',$scope.searchMsg.endDate + ' ' + $scope.searchMsg.endTime + ':00')
            }
            $http({
                method: "POST",
                url: allUrl.getVehicleNumberBylocationUrl,
                data: {
                    Address: newValue,
                    StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                    Duration: searchDuration
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.vehicleNumbers = data.Data;
                    if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, $scope.searchMsg.vehicleNumber)) {
                        scope.searchMsg.vehicleNumber = '0';
                    }
                } else {
                    scope.searchMsg.vehicleNumber = '0';
                }

            }).error(function () {
                scope.searchMsg.vehicleNumber = '0';
            });

        });

        $scope.search = getThreeRecommendedCars;
        $scope.search();
        getReferAwaed.get();

        function getThreeRecommendedCars() {
            $scope.isWaitting = true;
            $scope.isNoCar = false;
            $scope.isOtherLocationCarViews = false;
            allCarsMsg.clear();
            $scope.recommendedCarList = [];
            $scope.pastCarList = [];
            $scope.allCarsMsgs = [];
            $scope.sourceBookings = [];

            searchDuration = $scope.searchMsg.duration
            if(!$scope.searchMsg.durationType){
                searchDuration = computeWithHours($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00',$scope.searchMsg.endDate + ' ' + $scope.searchMsg.endTime + ':00')
            }
            //获取推荐的三辆车
           $http({
                method: "POST",
                url: allUrl.getThreeCarsUrl,
                data: {
                    StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                    Duration: searchDuration,
                    Lat:appContext.getAll().curposition.Lat,
                    Lon:appContext.getAll().curposition.Lon
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    allCarsMsg.addCars(data.Data)
                    $scope.recommendedCarList = data.Data;
                }else if(data.MsgType == 'TokenError'){
                    window.location.replace('#/main2');
                    appContext.getAll().isAut = false;
                    localStorage.removeItem("Token");
                    sessionStorage.removeItem("Token")
                }
            }).error(function () {
                $scope.isWaitting = false;
            });

            //获取收藏或定过的三辆车
           $http({
                method: "POST",
                url: allUrl.getThreePastOrFavouriteUrl,
                data: {
                    StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                    Duration: searchDuration,
                    Lat:appContext.getAll().curposition.Lat,
                    Lon:appContext.getAll().curposition.Lon
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    allCarsMsg.addCars(data.Data)
                    $scope.pastCarList = data.Data;
                }else if(data.MsgType == 'TokenError'){
                    // window.location.replace('#/main2')
                    appContext.getAll().isAut = false;
                    localStorage.removeItem("Token");
                    sessionStorage.removeItem("Token")
                }
            }).error(function () {
                $scope.isWaitting = false;
            });

            //获取所有可用的车辆
            $http({
                method: "POST",
                url: allUrl.searchUrl,
                data: {
                    StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                    Duration: searchDuration,
                    LeaseType: $scope.searchMsg.rentFor,
                    VehiceType: $scope.searchMsg.category,
                    Address: $scope.searchMsg.location,
                    PlateID: $scope.searchMsg.vehicleNumber
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.isNoCar = false;
                    allCarsMsg.addCars(data.Data);
                    $scope.allCarsMsgs = data.Data;
                    $scope.sourceBookings = data.Data;
                    initPage($scope);
                    if($scope.allCarsMsgs[0].AddressID != $scope.searchMsg.location){
                        $scope.isOtherLocationCarViews = true;
                    }
                    localStorage.setItem('startTime',$scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00');
                    localStorage.setItem('duration',searchDuration);

                } else {
                    $scope.isNoCar = true;
                }
            }).error(function () {
                $scope.isWaitting = false;
                $scope.isNoCar = true;
            });



            // $.ajax({
            //     url: allUrl.getThreeCarsUrl,
            //     async:true,
            //     type : "POST",
            //     dataType : "json",
            //     data: {
            //         StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
            //         Duration: $scope.searchMsg.duration
            //     },
            //     headers: {
            //         Authorization: "Basic " + appContext.getAll().token
            //     },
            //     success: function(data){
            //         console.log(data);
            //         $scope.isWaitting = false;
            //         if (data.MsgType == 'Success') {
            //             allCarsMsg.addCars(data.Data)
            //             $scope.recommendedCarList = data.Data;
            //         }
            //     },
            //     error:function () {
            //         $scope.isWaitting = false;
            //     }
            // });

            // $.ajax({
            //     url: allUrl.getThreePastOrFavouriteUrl,
            //     async:true,
            //     type : "POST",
            //     dataType : "json",
            //     data: {
            //         StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
            //         Duration: $scope.searchMsg.duration
            //     },
            //     headers: {
            //         Authorization: "Basic " + appContext.getAll().token
            //     },
            //     success: function(data){
            //         console.log(data);
            //         $scope.isWaitting = false;
            //         if (data.MsgType == 'Success') {
            //             allCarsMsg.addCars(data.Data)
            //             $scope.pastCarList = data.Data;
            //         }
            //     },
            //     error:function () {
            //         $scope.isWaitting = false;
            //     }
            // });


            // $.ajax({
            //     url: allUrl.searchUrl,
            //     async:true,
            //     type : "POST",
            //     dataType : "json",
            //     data: {
            //         StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
            //         Duration: $scope.searchMsg.duration,
            //         LeaseType: $scope.searchMsg.rentFor,
            //         VehiceType: $scope.searchMsg.category,
            //         Address: $scope.searchMsg.location,
            //         PlateID: $scope.searchMsg.vehicleNumber
            //     },
            //     headers: {
            //         Authorization: "Basic " + appContext.getAll().token
            //     },
            //     success: function(data){
            //         console.log(data);
            //         $scope.isWaitting = false;
            //         if (data.MsgType == 'Success') {
            //             $scope.isNoCar = false;
            //             allCarsMsg.addCars(data.Data);
            //             $scope.allCarsMsgs = data.Data;
            //             $scope.sourceBookings = data.Data;
            //             initPage($scope);
            //             if($scope.allCarsMsgs[0].AddressID != $scope.searchMsg.location){
            //                 $scope.isOtherLocationCarViews = true;
            //             }
            //             localStorage.setItem('startTime',$scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00');
            //             localStorage.setItem('duration',$scope.searchMsg.duration);
            //
            //         } else {
            //             $scope.isNoCar = true;
            //         }
            //     },
            //     error:function () {
            //         $scope.isWaitting = false;
            //         $scope.isNoCar = true;
            //     }
            // });
        }

        $scope.mainsearch = function () {
            if ($scope.searchMsg.location == 0) {
                $scope.errorMsgHandle("Please select a location.");
                return;
            }
            window.location.replace('#/search/');
        }
    })
    .controller('main2Ctr', function ($scope,$http,appContext,allUrl) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        //没有登录与不登录的区别
        // if(appContext.getAll().isAut){
        //     window.location.replace('#/booking_search')
        //     return
        // }
        $scope.rateSearch= appContext.getAll().rateSearch;
        if ($scope.rateSearch.startDate == '') {
            initsearchTime($scope.rateSearch);
        }
        if ($scope.rateSearch.durationType){
            $('#h').tab('show');
        }else{
            $('#d').tab('show');
        }

        $('#h').on('shown.bs.tab', function (e) {
            $scope.rateSearch.durationType = true;
        })
        $('#d').on('shown.bs.tab', function (e) {
            $scope.rateSearch.durationType = false;
        })

        $scope.$watch('rateSearch.duration', function (newValue, oldValue, scope) {
            if(newValue > 24){
                $('#d').tab('show');
                initEndDateAndTime(scope.searchMsg)
            }
        });

        $('#advPicBox').modal('show');
        $scope.goToSearchWithLocation=function (location) {
            $scope.searchMsg.location=location + '';
            $scope.searchMsg.rentFor='0';
            // $scope.searchMsg.rentFor=id;
            window.location='#/search/';
        }
    })
    .controller('contact_usCtr', function ($scope,$http,appContext,allUrl) {

    })
    .controller('fleet_ratesCtr', function ($scope,$http,appContext,allUrl,$stateParams,scrollToTop) {
        $scope.rateSearch= appContext.getAll().rateSearch;
        if ($scope.rateSearch.startDate == '') {
            initsearchTime($scope.rateSearch);
        }

        if ($scope.rateSearch.durationType){
            $('#h').tab('show');
        }else{
            $('#d').tab('show');
        }

        $('#h').on('shown.bs.tab', function (e) {
            $scope.rateSearch.durationType = true;
            querryRatesByTime();
        })
        $('#d').on('shown.bs.tab', function (e) {
            $scope.rateSearch.durationType = false;
            querryRatesByTime();
        })
        $scope.curRates = [];

        $scope.querryRatesByTime = querryRatesByTime;

        $scope.$watch('rateSearch.startDate', function (newValue, oldValue, scope) {
            if (newValue == oldValue)
                return
            querryRatesByTime();
        });
        $scope.$watch('rateSearch.startTime', function (newValue, oldValue, scope) {
            if (newValue == oldValue)
                return
            querryRatesByTime();
        });
        $scope.$watch('rateSearch.endDate', function (newValue, oldValue, scope) {
            if (newValue == oldValue)
                return
            querryRatesByTime();
        });
        $scope.$watch('rateSearch.endTime', function (newValue, oldValue, scope) {
            if (newValue == oldValue)
                return
            querryRatesByTime();
        });
        $scope.$watch('rateSearch.duration', function (newValue, oldValue, scope) {
            if (newValue == oldValue)
                return
            if(newValue > 24){
                $('#d').tab('show');
                initEndDateAndTime(scope.searchMsg)
            }
            querryRatesByTime();
        });

        querryAllTimePrice();
        querryRatesByTime();
        function querryAllTimePrice() {
              appContext.getAll().isAllWaitting = true;
              $http({
                  method: "POST",
                  url: allUrl.queryAllTimePriceUrl,
                  data: {
                  }
              }).success(function (data) {
                  console.log(data);
                  appContext.getAll().isAllWaitting = false;
                  if (data.MsgType == 'Success') {
                      appContext.getAll().allPriceMsg = data.Data;
                  } else {
                  }
                  if($stateParams.id){
                      scrollAndOpen($stateParams.id);
                  }else{
                      scrollToTop.go();
                  }

              }).error(function () {
                  appContext.getAll().isAllWaitting = false;
                  if($stateParams.id){
                      scrollAndOpen($stateParams.id);
                  }else{
                      scrollToTop.go();
                  }
              });

          }
        function querryRatesByTime() {
              $scope.curRates = [];
              appContext.getAll().isAllWaitting = true;
            searchDuration = $scope.rateSearch.duration
            if(!$scope.rateSearch.durationType){
                searchDuration = computeWithHours($scope.rateSearch.startDate + ' ' + $scope.rateSearch.startTime + ':00',$scope.rateSearch.endDate + ' ' + $scope.rateSearch.endTime + ':00')
            }

              $http({
                  method: "POST",
                  url: allUrl.getRatesByTime,
                  data: {
                      StartTime: ($scope.rateSearch.startDate + ' ' + $scope.rateSearch.startTime + ':00'),
                      Duration: searchDuration
                  }
              }).success(function (data) {
                  console.log(data);
                  appContext.getAll().isAllWaitting = false;
                  if (data.MsgType == 'Success') {
                      $scope.curRates = data.Data;
                  } else {
                  }

              }).error(function () {
                  appContext.getAll().isAllWaitting = false;
              });

          }

    })
    .controller('our_servicesCtr', function ($scope,$http,appContext,allUrl) {

    })
    .controller('promotionsCtr', function ($scope,$http,appContext,allUrl) {

    })
    .controller('my_profileCtr', function ($scope,$http,appContext,allUrl,appContext) {
        getUserDetailMsg();
        function getUserDetailMsg() {
            $http({
                method: 'POST',
                url: allUrl.getUserDetailUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    appContext.getAll().userMsg = data.Data;

                    if(data.Data.UserStatus != 'Success'){
                        if(data.Data.UserStatus == 'Fail'){
                            appContext.getAll().signinMsg=data.Data;
                            appContext.getAll().signinMsg.LicenseType=data.Data.LicenseType + '';
                            appContext.getAll().signinMsg.Salutation=data.Data.Salutation + '';
                            appContext.getAll().signinMsg.Gender=data.Data.Gender + '';
                            appContext.getAll().signinMsg.Nationality=data.Data.Nationality + '';
                            appContext.getAll().signinMsg.Race=data.Data.Race + '';
                            appContext.getAll().signinMsg.MaritalStatus=data.Data.MaritalStatus + '';
                            appContext.getAll().signinMsg.MaritalStatus=data.Data.MaritalStatus + '';
                        }
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                }
            }).error(function () {
            });
        }
    })
    .controller('my_bookingsCtr', function ($scope,$http,appContext,allUrl,appContext) {
        $scope.sourceBookings = [];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);

        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
            $scope.scrollToTop();
        };


        $scope.querry = queryAllBookings;

        $scope.querry();

        function queryAllBookings() {
            appContext.getAll().isAllWaitting=true;
            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllMyBookingMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                appContext.getAll().isAllWaitting=false;
                console.log(data)
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }
                    $scope.dataInfoErrorHandle(data);
                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        }
    })
    .controller('e_walletCtr', function ($scope,$http,appContext,allUrl,appContext,getWallet) {

        getWallet.init();
        $scope.sourceBookings = [];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);


        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
            $scope.scrollToTop();
        };

        $scope.querry = querryAllWalletMsgs;

        $scope.querry();


        function querryAllWalletMsgs() {
            appContext.getAll().isAllWaitting=true;
            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllWalletMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting=false;
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        $scope.tokenErrorHandle();
                        return;
                    }

                }

            }).error(function () {
                $scope.netErrorHandle();
            });
        }
    });



//////////////////////////////////////////////////////////////////////////////////////////////

function scrollAndOpen(id) {
    if ($("#" + id)) {
        $("#" + id).addClass("in");
        $("html, body").animate({
            scrollTop: $("#" + id).offset().top
        }, {duration: 1000, easing: "easeOutBounce"});
    }
}


//获取保险的checkbox的值并用-拼接
function getInsuranceSendString(insuranceList) {
    if(insuranceList.length <= 0){
        return;
    }
    var arrSend=[];
    for(var total=0;total < insuranceList.length;total++) {
        if($("#insuranceCheck" + insuranceList[total].ID).get(0).checked){
            arrSend[total]=$("#insuranceCheck" + insuranceList[total].ID).val();
        }
    }
    return arrSend.join('-');
}
//获取保险的checkbox的值并用-拼接
function getQuerryCarPriceInsuranceSendString(insuranceList) {
    if(!insuranceList || insuranceList.length <= 0){
        return;
    }
    var arrSend=[];
    for(var total=0;total < insuranceList.length;total++) {
        arrSend[total]=insuranceList[total].ID;
    }
    return arrSend.join('-');
}


/////////////////////////////////////////////////////////////////////////////////////////////
function initPage(scope) {
    scope.pageCount = Math.ceil(scope.sourceBookings.length / scope.avg);
    if (scope.pageCount > 0) {
        scope.currentIndex = 1;
        scope.allPageBookings = paging(scope.sourceBookings, scope.avg);
        scope.currentPageBookings = scope.allPageBookings[0].pageItems;
    } else {
        scope.currentIndex = 0;
        scope.allPageBookings = [];
        scope.currentPageBookings = [];
    }
}

function paging(allItems, space) {
    var count = Math.ceil(allItems.length / space);
    var pages = new Array();
    for (var i = 0; i < count; i++) {
        pages[i] = {index: i + 1, pageItems: []}
        for (var j = 0; j < space; j++) {
            if ((space * i + j) == allItems.length) {
                break;
            } else {
                pages[i].pageItems.push(allItems[space * i + j])
            }
        }

    }
    return pages;
}

function initSearchLocation(scope,durationType) {
    scope.searchMsg.durationType = durationType
    for (var i = 0; i < scope.searchMsg.locations.length; i++){
        if (scope.searchMsg.location == scope.searchMsg.locations[i].ID){
            $('.filter-option-inner-inner').text(scope.searchMsg.locations[i].Address)
            break
        }
    }
}

function initsearchTime(searchObj) {
    var startDateTime = addHours(0.5);
    var endDateTime = addByhours(startDateTime,24);

    var startDate = startDateTime.getFullYear() + '-' + ((startDateTime.getMonth() + 1) > 9 ? (startDateTime.getMonth() + 1) : ('0' + (startDateTime.getMonth() + 1))) + '-' + (startDateTime.getDate() > 9 ? (startDateTime.getDate()) : ('0' + startDateTime.getDate()));
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + (endDateTime.getDate() > 9 ? (endDateTime.getDate()) : ('0' + endDateTime.getDate()));
    var startHour = startDateTime.getHours() > 9 ? (startDateTime.getHours() + ":00") : ("0" + startDateTime.getHours() + ":00");
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");

    searchObj.startDate = startDate;
    startTimeMinus = startDateTime.getMinutes() < 30 ? "00" : "30";
    startTimeHour = startDateTime.getHours();
    searchObj.startTime = (startTimeHour > 9 ? (startTimeHour) : ("0" + startTimeHour)) + ":" +startTimeMinus;
    searchObj.endDate = endDate;
    endTimeMinus = endDateTime.getMinutes() < 30 ? "00" : "30";
    endTimeHour = endDateTime.getHours();
    searchObj.endTime =  (endTimeHour > 9 ? (endTimeHour) : ("0" + endTimeHour)) + ":" +endTimeMinus;
    searchObj.endTimeMinus = endHour;
}

function initEndDateAndTime(searchObj) {
    var endDateTime = addByhours(getDateByString(searchObj.startDate + ' ' + searchObj.startTime + ':00'),24);
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + (endDateTime.getDate() > 9 ? (endDateTime.getDate()) : ('0' + endDateTime.getDate()));

    searchObj.endDate = endDate;
    endTimeMinus = endDateTime.getMinutes() < 30 ? "00" : "30";
    endTimeHour = endDateTime.getHours();
    searchObj.endTime =  (endTimeHour > 9 ? (endTimeHour) : ("0" + endTimeHour)) + ":" +endTimeMinus;
}

function isCanSearch(scope,searchDuration) {
    var curTime = addHours(0);
    var endTime = addByhours(getDateByString(scope.searchMsg.startDate + ' ' + scope.searchMsg.startTime + ':00'),searchDuration);
    var durations = computeWithHours(getFormatStringByDate(curTime),getFormatStringByDate(endTime));
    if( durations >= 744){
        return false;
    }
    return true;
}

function getFormatTime(date) {
    var endDateTime = date;
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + (endDateTime.getDate() > 9 ? (endDateTime.getDate()) : ('0' + endDateTime.getDate()));
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");
    return {
        Date: endDate,
        Time: endHour
    };
}

function getDateByString(a) {
    var d = new Date(Date.parse((a+'').replace(/-/g, "/")));
    return d;
}
function getFormatStringByDate(date) {
    var formatD = getFormatTime(date);
    return formatD.Date + " " + formatD.Time + ":00";
}

function addHours(hours) {
    var a = new Date();
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function addByhours(date, hours) {
    var a = date;
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function subtractByhours(date, hours) {
    var a = date;
    a = a.valueOf();
    a = a - hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function compareTimeWithCurrentTime(datetime) {
    var currentDateTime = addHours(0);
    var storageDateTime = getDateByString(datetime.replace("-", "/"));
    if (currentDateTime > storageDateTime) {
        return true
    } else {
        return false
    }
}

function computeWithHours(startTime, endTime) {
    var startDateTime = getDateByString(startTime.replace("-", "/"));
    var endDateTime = getDateByString(endTime.replace("-", "/"));
    var result = endDateTime.getTime() - startDateTime.getTime()

    return result / 3600 / 1000;
}

function addDayWithStringDateReturnFormatStringDate(stringDate, days) {
    var a = getDateByString(stringDate);
    var b = addByhours(a, 24 * days);
    var c = getFormatTime(b);
    return c.Date + ' ' + c.Time + ":00";
}

function hasVehicleNumberInArray(data, vehicleNumber) {
    var result = false;
    for (var i = 0; i < data.length; i++) {
        if (vehicleNumber == data[i].ID) {
            result = true;
        }
    }
    return result;
}

function getRemainTime(target) {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var endDate = getDateByString(target.endtime);
    var end = endDate.getTime();

    var leftTime = end - now;
    //定义变量 d,h,m,s保存倒计时的时间
    var d, h, m, s;


    if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        target.isTimeout = false;
    } else {
        d = Math.floor(-leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(-leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(-leftTime / 1000 / 60 % 60);
        s = Math.floor(-leftTime / 1000 % 60);
        target.isTimeout = true;
    }
    target.day = d;
    target.hour = h > 9 ? h : '0' + h;
    target.min = m > 9 ? m : '0' + m;
    target.second = s > 9 ? s : '0' + s;

}