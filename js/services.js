/**
 * Created by pj on 2017/8/16.
 */
var serviceModule=angular.module('allservice',[]);

serviceModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile();
            });
        }
    };
}]);

serviceModule.factory('fileReader', ["$q", "$log", function($q, $log){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);

serviceModule.factory('allUrl',function () {
    var host='http://58.246.122.118:12305';
    // var host='http://192.168.0.103:12907';
    // var host='http://192.168.0.56:12907';
    // var host='http://192.168.0.112:12907';
    // var host='http://192.168.0.113:12907';
    return {
        host:host,
        referHost:'http://www.ucastcomputer.com:8800',
        searchUrl:host + '/api/VehicleShareQuery',
        getLocationsUrl: host + '/Select/FrontQueryParkingSpace',
        getCategorysUrl: host + '/Select/QueryVehicleType',
        getVehicleNumberBylocationUrl: host + '/Select/QueryVehicleName',
        getRentForUrl: host + '/Select/QueryLeaseType',
        loginUrl:host + '/api/Login',
        isAutUserUrl:host + '/api/GetUserInfo',
        signin_fUrl:'',
        getHasEmailUrl:host + '/api/EmailCheck',
        getHasNRICUrl:host + '/api/CheckNRIC',
        signin_sUrl:host + '/api/Register',
        getLicenseTypesUrl:host + '/Select/QueryCertificateType',
        getNationalitiesUrl:host + '/Select/GetNationality',
        getRacesUrl:host + '/Select/GetRace',
        getEducationLevelUrl:host + '/Select/GetEducationLevel',
        getPriceListUrl:host + '/api/VehicleLeasePrice',
        getUserWalletUrl:host + '/api/GetBookingsWallet',
        bookingTheCarUrl:host + '/api/LeaseVehicle ',
        getCarAvailableStateUrl:host + '/api/OnewVehicleShareIdleDay',
        getBookingMsgByIdUrl:host + '/api/UserDetailByRef',
        getAllMyBookingMsgsUrl:host + '/Bookings/QueryUsersBookings',
        getAllWalletMsgsUrl:host + '/LogWallet/MobileGetList',
        getUserDetailUrl:host + '/api/GetUserDetail',
        getUserLastBookingUrl:host + '/Bookings/QueryUsersBookingsDetail',
        getExtensionPaiceListUrl:host + '/api/VehicleShareRenewQuery',
        ExtendBookingUrl:host + '/api/UserRenewOrder',
        getCanStartTripUrl:host + '/Bookings/FrontAllowOpen',
        StartTripUrl:host + '/Bookings/FrontOpen',
        queryDoorStateUrl:host + '/Bookings/QueryDoorsCommand',
        cansleBookingUrl:host + '/api/UserCancelOrder',
        getcancelReasonUrl:host + '/Select/GetCancelReason',
        getCanEndTripUrl:host + '/Bookings/FrontCloseLocation',
        endTripUrl:host + '/Bookings/FrontClose',
        reportIssueUrl:host + '/ReportIssue/Add',
        breakDownUrl:host + '/ReportIssue/CancelAdd',
        reportMainIssueReasonsUrl:host + '/Select/QueryFeedBackCategory',
        reportSubIssueReasonsUrl:host + '/IssueType/GetIssueType',
        reportIssueReasonsUrl:host + '/Select/GetIssueName',
        reportBreakDownOrAccdientReasonsUrl:host + '/Select/GetCancelReason',
        getUserTopupMsgUrl:host + '/Wallet/QueryWallet',
        editProfileUrl:host + '/api/EditPassword',
        getPriceList:host + '/PlanLeasePriceTable/ShowPlanLeasePriceTable',
        getRatesByTime:host + '/',
        topUpUrl:host + '/Wallet/CrateOnLineTopUp',
        isCanTopUpUrl:host + '/Deposit/ForeVerifyDeposit',
        getVerificationUrl:host + '/api/SendEmail',
        getPasswordBackUrl:host + '/api/ResetPassword',
        getPromotionCodeUrl:host + '/api/ReturnPromotionCodeAndMoney',
        getPromoCodeCanUseUrl:host + '/api/IsCheckPromo',
        getReferralCodeCanUseUrl:host + '/api/ValidationReferralCode',
        getInsuranceDetialUrl:host + '/Insurance/GetInsurance',
        getInsuranceDetialByLeaseNumberUrl:host + '/Insurance/GetInsuranceByLeaseNumber',
        getThreeCarsUrl:host + '/api/VehicleRecommend',
        queryIssueStatusUrl:host + '/ReportIssue/FrontEndDetailsByBooking',
        queryAllTimePriceUrl:host + '/ExcelImportPrice/FrontEndPriceTableDetails',
        registAgain:host + '/api/AgainRegister',

    }
})
    .factory('appContext',function (allUrl) {
        var appMsg= {
            key:'AIzaSyAmZApCirzCpPnToCfTm3_2pDxUNMQJy94',
            zoom:'18',
            allCarsMsg: [],
            bookingDetailMsgs: [],
            userMsg: {},
            lastBooking: undefined,
            isAut:false,
            token:'',
            username:'Personal',
            isEnoughBalance:false,
            userAccountMoney:0,
            userCredit:0,
            userTrueWalletMoney:0,
            userTopupMsg:{},
            isAgreeMe:false,
            bookingState:['Apply','Start','Cancel','Finish'],
            Type:['','Consume ','Recharge','SpecialOffer','RewardOrPunishment '],
            EnterBy:['','Consume ','Renew','CancelOrder','Refund','OnlineRecharge','CashRecharge','Deposit', 'Punishment','Reward'],
            isSidemenu: false,
            searchMsg:{
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                location: '0',
                category: '0',
                rentFor: '0',
                duration: '3',
                vehicleNumber: '0',
                searchUrl: allUrl.searchUrl,
                getLocationsUrl: allUrl.getLocationsUrl,
                locations:[],
                categorys:[],
                rentFors:[],
                durations:[
                    {ID:'3',Duration:'3 hrs'},
                    {ID:'4',Duration:'4 hrs'},
                    {ID:'5',Duration:'5 hrs'},
                    {ID:'6',Duration:'6 hrs'},
                    {ID:'7',Duration:'7 hrs'},
                    {ID:'8',Duration:'8 hrs'},
                    {ID:'9',Duration:'9 hrs'},
                    {ID:'10',Duration:'10 hrs'},
                    {ID:'11',Duration:'11 hrs'},
                    {ID:'12',Duration:'12 hrs'},
                    {ID:'13',Duration:'13 hrs'},
                    {ID:'14',Duration:'14 hrs'},
                    {ID:'15',Duration:'15 hrs'},
                    {ID:'16',Duration:'16 hrs'},
                    {ID:'17',Duration:'17 hrs'},
                    {ID:'18',Duration:'18 hrs'},
                    {ID:'19',Duration:'19 hrs'},
                    {ID:'20',Duration:'20 hrs'},
                    {ID:'21',Duration:'21 hrs'},
                    {ID:'22',Duration:'22 hrs'},
                    {ID:'23',Duration:'23 hrs'},
                    {ID:'24',Duration:'24 hrs'},
                    {ID:'25',Duration:'25 hrs'},
                    {ID:'26',Duration:'26 hrs'},
                    {ID:'27',Duration:'27 hrs'},
                    {ID:'28',Duration:'28 hrs'},
                    {ID:'29',Duration:'29 hrs'},
                    {ID:'30',Duration:'30 hrs'},
                    {ID:'31',Duration:'31 hrs'},
                    {ID:'32',Duration:'32 hrs'},
                    {ID:'33',Duration:'33 hrs'},
                    {ID:'34',Duration:'34 hrs'},
                    {ID:'35',Duration:'35 hrs'},
                    {ID:'36',Duration:'36 hrs'},
                    {ID:'48',Duration:'2 days'},
                    {ID:'72',Duration:'3 days'},
                    {ID:'96',Duration:'4 days'},
                    {ID:'120',Duration:'5 days'},
                    {ID:'144',Duration:'6 days'},
                    {ID:'168',Duration:'1 week'},
                    {ID:'336',Duration:'2 weeks'},
                    {ID:'504',Duration:'3 weeks'},
                    {ID:'672',Duration:'4 weeks'},
                    {ID:'720',Duration:'30 days'},
                ],
                vehicleNumbers:[]
            },
            ExtendDurations:[
                {ID:'1',Duration:'1 hr'},
                {ID:'2',Duration:'2 hrs'},
                {ID:'3',Duration:'3 hrs'},
                {ID:'4',Duration:'4 hrs'},
                {ID:'5',Duration:'5 hrs'},
                {ID:'6',Duration:'6 hrs'},
                {ID:'7',Duration:'7 hrs'},
                {ID:'8',Duration:'8 hrs'},
                {ID:'9',Duration:'9 hrs'},
                {ID:'10',Duration:'10 hrs'},
                {ID:'11',Duration:'11 hrs'},
                {ID:'12',Duration:'12 hrs'},
                {ID:'13',Duration:'13 hrs'},
                {ID:'14',Duration:'14 hrs'},
                {ID:'15',Duration:'15 hrs'},
                {ID:'16',Duration:'16 hrs'},
                {ID:'17',Duration:'17 hrs'},
                {ID:'18',Duration:'18 hrs'},
                {ID:'19',Duration:'19 hrs'},
                {ID:'20',Duration:'20 hrs'},
                {ID:'21',Duration:'21 hrs'},
                {ID:'22',Duration:'22 hrs'},
                {ID:'23',Duration:'23 hrs'},
                {ID:'24',Duration:'24 hrs'},
                {ID:'25',Duration:'25 hrs'},
                {ID:'26',Duration:'26 hrs'},
                {ID:'27',Duration:'27 hrs'},
                {ID:'28',Duration:'28 hrs'},
                {ID:'29',Duration:'29 hrs'},
                {ID:'30',Duration:'30 hrs'},
                {ID:'31',Duration:'31 hrs'},
                {ID:'32',Duration:'32 hrs'},
                {ID:'33',Duration:'33 hrs'},
                {ID:'34',Duration:'34 hrs'},
                {ID:'35',Duration:'35 hrs'},
                {ID:'36',Duration:'36 hrs'},
            ],
            rateSearch:{
                startDate: '',
                startTime: '0',
                duration: '3'
            },
            LicenseTypes:[],
            Nationalities:[],
            Races:[],
            EducationLevel:[],
            MaritalStatus:[
                {ID:'1',MaritalStatus:'Single'},
                {ID:'2',MaritalStatus:'Married'},
                {ID:'3',MaritalStatus:'Divorce'},
                {ID:'4',MaritalStatus:'Widow'},
            ],
            Genders:[
                {ID:'1',Gender:'Male'},
                {ID:'2',Gender:'Female'}
            ],
            Salutations:[
                {ID:'1',Salutation:'Mr'},
                {ID:'2',Salutation:'Mrs'},
                {ID:'3',Salutation:'Ms'},
                {ID:'4',Salutation:'Miss'},
            ],
            CancelReasons:[],
            ReportIssueReasons:[],
            ReportIssueSubTitles:[],
            signinMsg:{
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
                Address:'',
                PostalCode:'',
                DateOfBirth:'',
                LicenseIssueDate:'',
                TVDLIssue:'',
                TVDLExpiry:'',
                PVDLIssue:'',
                PVDLExpiry:'',
                ReferralCode:''
            },
            allCurrentSearchCarMsgs:{

            },
            currentSearchCarMsg:{},
            fromBookingPage:{
                id:'',
                isFromBooking:false,
                goToReportIssue:false
            },
            smartEmail:'taxishare-enquiry@smrt.com.sg',
            stridesEmail:'www.strides.com.sg',
            hostName:'http://192.168.0.132/taxi',
            errorMsg:{
                netError:'The network just lost a moment,try again! ',
                uncompleteError:'Please fill in the complete information!',
                noChange:'Nothing has changed!',
                dismatchError:'Reset passwords is different!',
                noOldPawordError:'The original password cannot be empty!',
            },
            tishiMsg:{
                registSucess:'Congratulations,registered successfully !',
                registedMsg:'We will verify the information in 24 hours after recieved. If verification is successful you will recieve an email, then you can enjoy the rental service. During the verification proccess, you can log in and view the progress of the verification.'
            },
            motaiTishiBox:{
                title:'',
                msg:''
            },
            isAllWaitting:false,
            startTrip:{
                startTripSure1:false,
                startTripSure2:false,
                startTripSure3:false,
                startTripSure4:false,
                startTripSure5:false,
            },
            endTrip:{
                isDesignLocation:true,
                LeaseCancelReason:'0',
                Memo:'',
                endtripSure1:false,
                endtripSure2:false,
                endtripSure3:false,
                endtripSure4:false,
                endtripSure5:false,
            },
            depositMsg:{},
            promoData:{},
            totalFees:{},
            issueStausObj:{},
            allPriceMsg:[],
            isNotificationShow:false,
            notification:'Taxi Share Promotion! Chinese New Year rate and daily rate as low as $85/day T&C applies*',
            AERString:'Accident Excess Reduction ( AER )',
            AERStringAD:' A E R ',
            englishMonth:["Jan.","Feb.","Mar.","Apr.","May.","June.","July.","Aug.","Sept.","Oct","Nov.","Dec."],
            maxDayOrWeekMsg:{
                maxDay:'Maximum price rate for the day',
                maxWeek:'Maximum price rate for the week'
            }
        };


        return {
            getAll:function () {
                return appMsg;
            }
        };
    })

    .factory('path', function ($location) {
        function isSideMenuge() {
            var path = $location.path();
            var isSidemenu = false;

            if (path.indexOf('sidemenu') >= 0) {
                isSidemenu = true;
            } else {
                isSidemenu = false;
            }

            return {
                path:  $location.path(),
                isSidemenu: isSidemenu
            }
        }

        return {
            getResult: isSideMenuge
        };
    })
    .factory('JIANCE', function ($http, path,allUrl,jsToAndroid,appContext) {

        function doFirst() {
            var url = allUrl.isAutUserUrl;
            var isRemeberMe = localStorage.getItem('isRemeberMe');
            var token = '';
            if (isRemeberMe && isRemeberMe == 'true') {
                token = localStorage.getItem('Token');
            } else {
                token = sessionStorage.getItem('Token');
            }
            if (token && token != '') {
                appContext.getAll().isAut = true;
                appContext.getAll().token=token;
                appContext.getAll().username =  localStorage.getItem('Username');
                $http({
                    method: "POST",
                    url: url,
                    data:{},
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + token
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.MsgType == 'Success') {
                        appContext.getAll().isAut=true;
                        appContext.getAll().token=token;
                        appContext.getAll().username=data.Info;
                        localStorage.setItem('Username',data.Info);
                        jsToAndroid.sendToken(token);
                        jsToAndroid.sendUserName(data.Info);
                    } else {
                        appContext.getAll().isAut = false;
                        appContext.getAll().token = '';
                        appContext.getAll().username='Personal';
                        jsToAndroid.sendToken('');
                        jsToAndroid.sendUserName('');
                    }
                }).error(function () {
                    appContext.getAll().isAut = false;
                    appContext.getAll().token = '';
                    appContext.getAll().username='Personal';
                })
            } else {
                //本地没有token
                appContext.getAll().isAut = false;
                appContext.getAll().token = '';
                appContext.getAll().username='Personal  ';
            }



        }

        return {init: doFirst};
    })

    .factory('initSometing',function ($http,appContext,allUrl) {
        function initLocations() {
            //所有位置
            $http({
                method: "POST",
                url: allUrl.getLocationsUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.locations = data.Data;
                } else {

                }
            }).error(function () {

            });
        };

        //所有车型
        // $http({
        //     method: "POST",
        //     url: allUrl.getCategorysUrl,
        //     headers: {'Content-Type': 'application/json'}
        // }).success(function (data) {
        //     console.log(data);
        //     if (data.MsgType == 'Success') {
        //         appContext.getAll().searchMsg.categorys = data.Data;
        //     } else {
        //
        //     }
        // }).error(function () {
        //
        // });



        //所有租赁类型
        $http({
            method: "POST",
            url: allUrl.getRentForUrl,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                appContext.getAll().searchMsg.rentFors = data.Data;
            } else {

            }
        }).error(function () {

        });

        return   {
            initSometing:initLocations
        }
    })
    .factory('initSignupSelectOptions',function ($http,appContext,allUrl) {
        function initOptions() {
            //注册缘由
            $http({
                method: "POST",
                url: allUrl.getLicenseTypesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().LicenseTypes = data.Data;
                } else {

                }
            }).error(function () {

            });
            //国籍
            $http({
                method: "POST",
                url: allUrl.getNationalitiesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().Nationalities = data.Data;
                } else {

                }
            }).error(function () {

            });
            //Race
            $http({
                method: "POST",
                url: allUrl.getRacesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().Races = data.Data;
                } else {

                }
            }).error(function () {

            });


            //学历等级
            $http({
                method: "POST",
                url: allUrl.getEducationLevelUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().EducationLevel = data.Data;
                } else {

                }
            }).error(function () {

            });
        }
        return   {
            init:initOptions
        }
    })
    .factory('initCancelReason',function ($http,appContext,allUrl) {
        return {
          init:function () {
              //获取cancel理由
              $http({
                  method: "POST",
                  url: allUrl.getcancelReasonUrl,
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: "Basic " + appContext.getAll().token
                  }
              }).success(function (data) {
                  console.log(data);
                  if (data.MsgType == 'Success') {
                      appContext.getAll().CancelReasons = data.Data;
                  } else {

                  }
              }).error(function () {

              });
          }
        };
    })
    .factory('initReportIssueReasons',function ($http,appContext) {
        return {
          init:function (url) {
              //获取报修原因
              $http({
                  method: "POST",
                  url: url,
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: "Basic " + appContext.getAll().token
                  }
              }).success(function (data) {
                  console.log(data);
                  if (data.MsgType == 'Success') {
                      appContext.getAll().ReportIssueReasons = data.Data;
                  } else {

                  }
              }).error(function () {

              });
          }
        };
    })
    .factory('allCarsMsg',function () {
        var allCars=[];

        return {
            all:function () {
                return allCars;
            },
            getCarById:function (id) {
                for (var i = 0; i < allCars.length; i++) {
                    if (allCars[i].ID == id) {
                        return allCars[i];
                    }
                }
                return null;
            },
            setAllCars:function (data) {
                allCars=[];
                allCars=data;
                return allCars;
            },
            clear:function () {
                allCars=[];
                return allCars;
            }
        };
    })
    .factory('walletMsgs',function ($http) {

    })
    .factory('bookingDetailMsgs',function ($http) {

    })
    .factory('logOut',function (JIANCE,appContext,jsToAndroid) {
       return {
           logOut:function () {
               appContext.getAll().isAllWaitting = true;
               appContext.getAll().userMsg = {};
               appContext.getAll().signinMsg = {};
               localStorage.removeItem('isRemeberMe');
               localStorage.removeItem('Username');
               localStorage.removeItem('Token');
               sessionStorage.removeItem('Token');
               appContext.getAll().isAut=false;
               appContext.getAll().token='';
               JIANCE.init();
               window.location.replace("#/login");
               appContext.getAll().isAllWaitting = false;
               jsToAndroid.sendToken("");
               jsToAndroid.sendUserName('');
           }
       }
    })
    .factory('noAutGoLoginPage',function (appContext) {
        return {
            init:function (isFromBooking,id,goToUrl) {
                isFromBooking=isFromBooking || false;
                id =id || '';
                // appContext.getAll().fromBookingPage.isFromBooking=isFromBooking;
                // appContext.getAll().fromBookingPage.id=id;
                var isAut=appContext.getAll().isAut;
                if(!isAut){
                    window.location.replace('#/login');
                }else{
                    if(goToUrl){
                        window.location.replace(goToUrl);
                    }
                }
            }
        }
    })
    .factory('getWallet',function ($http,allUrl,appContext) {
        return {
            init:function () {
                $http({
                    method : 'POST',
                    url:allUrl.getUserWalletUrl,
                    data:{},
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + appContext.getAll().token
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.MsgType == 'Success') {

                        appContext.getAll().userAccountMoney=((data.Data.Balance + data.Data.Credit)/100).toFixed(2);
                        appContext.getAll().userTrueWalletMoney=((data.Data.Balance)/100).toFixed(2);
                        appContext.getAll().userCredit=(( data.Data.Credit)/100).toFixed(2);
                    }else {
                        appContext.getAll().isEnoughBalance=false;
                        appContext.getAll().userAccountMoney=0;
                        if(data.MsgType == 'TokenError'){
                            appContext.getAll().isAut=false;
                            window.location.replace("#/login");
                            return;
                        }
                        appContext.getAll().motaiTishiBox.title='Promotion:';
                        appContext.getAll().motaiTishiBox.msg= data.Info;
                        $('#moTaiTishiBox').modal('show');
                    }

                }).error(function () {
                    appContext.getAll().motaiTishiBox.title='Promotion:';
                    appContext.getAll().motaiTishiBox.msg=  appContext.getAll().errorMsg.netError;
                    $('#moTaiTishiBox').modal('show');
                });
            }
        };
    })
    .factory('scrollToTop',function (appContext) {

        return {
            go: function () {
                $("html, body").animate({
                        scrollTop: $("#notification").offset().top }, {duration: 750,easing: "easeInBack"});

            }
        }
    })
    .factory('jsToAndroid',function () {

        return {
            sendToken: function (token) {
                if(window.getSomethingByJs)
                    window.getSomethingByJs.getUserToken(token);

                if(window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
                    window.webkit.messageHandlers.getUserMsg.postMessage({Token: token});
            },
            sendUserName:function (username) {
                if(window.getSomethingByJs)
                    window.getSomethingByJs.getUsername(username);
                if(window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
                    window.webkit.messageHandlers.getUserMsg.postMessage({UserName: username});
            }
        }
    });


serviceModule.directive('myheader', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/nav.html'
    }
})
    .directive('myfooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'html/foot.html'
        }
    });
