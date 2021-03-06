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
    var host='http://58.246.122.118:12304/SmrtWebApi';
    // var host='https://www.ucast.sg';
    // var host='http://192.168.0.103:12907';
    // var host='http://192.168.0.56:12907';
    // var host='http://192.168.0.112:12300';
    // var host='http://192.168.0.146:12907';
    return {
        host:host,
        referHost:'https://www.ucast.sg',
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
        getRatesByTime:host + '/api/FontEndFeeCalculator',
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
        getThreePastOrFavouriteUrl:host + '/api/QueryCollectList',
        queryIssueStatusUrl:host + '/ReportIssue/FrontEndDetailsByBooking',
        queryAllTimePriceUrl:host + '/ExcelImportPrice/FrontEndPriceTableDetails',
        registAgain:host + '/api/AgainRegister',
        referCodeAwardUrl:host + '/ActivityRecharge/ReferralsReward',
        topUpAwardUrl:host + '/ActivityRecharge/ActivityRechargeInfo',
        getAllFavouriteCars:host + '/api/QueryCollectList',
        setFavouriteCar:host + '/api/CollectOrCancelCollect',
        getIsFavouriteCar:host + '/api/IsCollect',
        getADVUrlr:host + '/Advertisement/GetFrontEndAdvertisementDetail',
        getADVPictureUrl:host + '/AdvertisementPicture/GetFrontEndAdvPictureDetail',
    }
})
    .factory('appContext',function (allUrl) {
        var appMsg= {
            //key:'AIzaSyAOG4cVPDLrOhF6EfwPUcDmnvJGT46qIcQ',
            key:'AIzaSyAmZApCirzCpPnToCfTm3_2pDxUNMQJy94',//个人key
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
                pickTime:[
                    {Value:'00:00',Time:'00:00'},
                    {Value:'00:30',Time:'00:30'},
                    {Value:'01:00',Time:'01:00'},
                    {Value:'01:30',Time:'01:30'},
                    {Value:'02:00',Time:'02:00'},
                    {Value:'02:30',Time:'02:30'},
                    {Value:'03:00',Time:'03:00'},
                    {Value:'03:30',Time:'03:30'},
                    {Value:'04:00',Time:'04:00'},
                    {Value:'04:30',Time:'04:30'},
                    {Value:'05:00',Time:'05:00'},
                    {Value:'05:30',Time:'05:30'},
                    {Value:'06:00',Time:'06:00'},
                    {Value:'06:30',Time:'06:30'},
                    {Value:'07:00',Time:'07:00'},
                    {Value:'07:30',Time:'07:30'},
                    {Value:'08:00',Time:'08:00'},
                    {Value:'08:30',Time:'08:30'},
                    {Value:'09:00',Time:'09:00'},
                    {Value:'09:30',Time:'09:30'},
                    {Value:'10:00',Time:'10:00'},
                    {Value:'10:30',Time:'10:30'},
                    {Value:'11:00',Time:'11:00'},
                    {Value:'11:30',Time:'11:30'},
                    {Value:'12:00',Time:'12:00'},
                    {Value:'12:30',Time:'12:30'},
                    {Value:'13:00',Time:'13:00'},
                    {Value:'13:30',Time:'13:30'},
                    {Value:'14:00',Time:'14:00'},
                    {Value:'14:30',Time:'14:30'},
                    {Value:'15:00',Time:'15:00'},
                    {Value:'15:30',Time:'15:30'},
                    {Value:'16:00',Time:'16:00'},
                    {Value:'16:30',Time:'16:30'},
                    {Value:'17:00',Time:'17:00'},
                    {Value:'17:30',Time:'17:30'},
                    {Value:'18:00',Time:'18:00'},
                    {Value:'18:30',Time:'18:30'},
                    {Value:'19:00',Time:'19:00'},
                    {Value:'19:30',Time:'19:30'},
                    {Value:'20:00',Time:'20:00'},
                    {Value:'20:30',Time:'20:30'},
                    {Value:'21:00',Time:'21:00'},
                    {Value:'21:30',Time:'21:30'},
                    {Value:'22:00',Time:'22:00'},
                    {Value:'22:30',Time:'22:30'},
                    {Value:'23:00',Time:'23:00'},
                    {Value:'23:30',Time:'23:30'}
                ],
                durations:[
                    {ID:'0.5',Duration:'0.5 hr'},
                    {ID:'1',Duration:'1 hr'},
                    {ID:'1.5',Duration:'1.5hrs'},
                    {ID:'2',Duration:'2 hrs'},
                    {ID:'2.5',Duration:'2.5hrs'},
                    {ID:'3',Duration:'3 hrs'},
                    {ID:'3.5',Duration:'3.5hrs'},
                    {ID:'4',Duration:'4 hrs'},
                    {ID:'4.5',Duration:'4.5 hrs'},
                    {ID:'5',Duration:'5 hrs'},
                    {ID:'5.5',Duration:'5.5 hrs'},
                    {ID:'6',Duration:'6 hrs'},
                    {ID:'6.5',Duration:'6.5 hrs'},
                    {ID:'7',Duration:'7 hrs'},
                    {ID:'7.5',Duration:'7.5 hrs'},
                    {ID:'8',Duration:'8 hrs'},
                    {ID:'8.5',Duration:'8.5 hrs'},
                    {ID:'9',Duration:'9 hrs'},
                    {ID:'9.5',Duration:'9.5 hrs'},
                    {ID:'10',Duration:'10 hrs'},
                    {ID:'10.5',Duration:'10.5 hrs'},
                    {ID:'11',Duration:'11 hrs'},
                    {ID:'11.5',Duration:'11.5 hrs'},
                    {ID:'12',Duration:'12 hrs'},
                    {ID:'12.5',Duration:'12.5 hrs'},
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
                    {ID:'25',Duration:'>24 hrs'}
                ],
                vehicleNumbers:[],
                durationType: true
            },
            ExtendDurations:[
                {ID:'1',Duration:'1 hr'},
                {ID:'1.5',Duration:'1.5 hrs'},
                {ID:'2',Duration:'2 hrs'},
                {ID:'2.5',Duration:'2.5 hrs'},
                {ID:'3',Duration:'3 hrs'},
                {ID:'3.5',Duration:'3.5hrs'},
                {ID:'4',Duration:'4 hrs'},
                {ID:'4.5',Duration:'4.5 hrs'},
                {ID:'5',Duration:'5 hrs'},
                {ID:'5.5',Duration:'5.5 hrs'},
                {ID:'6',Duration:'6 hrs'},
                {ID:'6.5',Duration:'6.5 hrs'},
                {ID:'7',Duration:'7 hrs'},
                {ID:'7.5',Duration:'7.5 hrs'},
                {ID:'8',Duration:'8 hrs'},
                {ID:'8.5',Duration:'8.5 hrs'},
                {ID:'9',Duration:'9 hrs'},
                {ID:'9.5',Duration:'9.5 hrs'},
                {ID:'10',Duration:'10 hrs'},
                {ID:'10.5',Duration:'10.5 hrs'},
                {ID:'11',Duration:'11 hrs'},
                {ID:'11.5',Duration:'11.5 hrs'},
                {ID:'12',Duration:'12 hrs'},
                {ID:'12.5',Duration:'12.5 hrs'},
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
                {ID:'36',Duration:'36 hrs'}
            ],
            rateSearch:{
                startDate: '',
                startTime: '0',
                duration: '3',
                durationType: true
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
            hostName:allUrl.referHost,
            errorMsg:{
                netError:'The network just lost a moment,try again! ',
                uncompleteError:'Please fill in the complete information!',
                noChange:'Nothing has changed!',
                dismatchError:'Reset passwords is different!',
                noOldPawordError:'The original password cannot be empty!',
            },
            tishiMsg:{
                registSucess:'The form has been  submitted successfully.',
                registedMsg:'Your application will be processed and you will receive an email notification within 24 hours.'
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
                Remark:'',
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
            englishMonth:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            maxDayOrWeekMsg:{
                maxDay:'Maximum price rate for the day',
                maxWeek:'Maximum price rate for the week'
            },
            referCodeAwardMsg:{},
            topUpAwardMsg:{},
            favouriteCarID:[],
            userTitle:'MENU',
            curposition:{
                Lat:'0',
                Lon:'0'
            },
            advPicMsg : {}
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
                        // jsToAndroid.sendToken(token);
                        // jsToAndroid.sendUserName(data.Info);
                    } else {
                        appContext.getAll().isAut = false;
                        appContext.getAll().token = '';
                        appContext.getAll().username='Personal';
                        // jsToAndroid.sendToken('');
                        // jsToAndroid.sendUserName('');
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
        }



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
            addCars:function (data) {
               for(var j = 0; j< data.length; j++){
                    allCars.push(data[j]);
               }
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
               // jsToAndroid.sendToken("");
               // jsToAndroid.sendUserName('');
               appContext.getAll().signinMsg={
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
                        appContext.getAll().motaiTishiBox.title='Message Alert:';
                        appContext.getAll().motaiTishiBox.msg= data.Info;
                        $('#moTaiTishiBox').modal('show');
                    }

                }).error(function () {
                    appContext.getAll().motaiTishiBox.title='Message Alert:';
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
    .factory('getReferAwaed',function ($http,appContext,allUrl) {
        return {
            get: function () {
                $http({
                    method: "POST",
                    url: allUrl.referCodeAwardUrl,
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        appContext.getAll().referCodeAwardMsg = data.Data;
                    } else {

                    }
                }).error(function () {

                });

            }
        }
    })
    .factory('getADV',function ($http,appContext,allUrl) {
        return {
            get: function () {

                $http({
                    method: "POST",
                    url: allUrl.getADVUrlr,
                    headers: {'Content-Type': 'application/json'},
                    data:{
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        // appContext.getAll().notification = data.Data.AdvertisementDetail;
                        $('#notification').html(data.Data.AdvertisementDetail);
                    } else {
                    }
                }).error(function () {

                });
            },
            getADVPicture:function () {
                $http({
                    method: "POST",
                    url: allUrl.getADVPictureUrl,
                    headers: {'Content-Type': 'application/json'},
                    data:{
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        appContext.getAll().advPicMsg = data.Data
                    } else {
                    }
                }).error(function () {

                });
            }
        }
    })
    .factory('getTopUpAwaed',function ($http,appContext,allUrl) {
        return {
            get: function () {
                $http({
                    method: "POST",
                    url: allUrl.topUpAwardUrl,
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        appContext.getAll().topUpAwardMsg = data.Data;
                    } else {

                    }
                }).error(function () {

                });

            }
        }
    })
    .factory('getAllFavouriteCars',function ($http,appContext,allUrl) {
        return {
            get: function () {
                appContext.getAll().isAllWaitting = true;
                $.ajax({
                    url: allUrl.getAllFavouriteCars,
                    async:false,
                    type : "POST",
                    dataType : "json",
                    data: {
                    },
                    headers: {
                        Authorization: "Basic " + appContext.getAll().token
                    },
                    success: function(data){
                        console.log(data);
                        appContext.getAll().isAllWaitting = false;
                        if (data.MsgType == 'Success') {

                        }
                    },
                    error:function () {
                        appContext.getAll().isAllWaitting = false;
                    }
                });

            }
        }
    })
    .factory('getCurLocation',function ($http,appContext) {

        function getLocation() {
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(showPosition,showError);
            }
            else{
                var msg="Geolocation is not supported by this browser.";
                console.log(msg);
            }
        }
        function showPosition(position) {
            var ll="Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude;
            console.log(ll);
            // alert(ll);
            appContext.getAll().curposition.Lat = position.coords.latitude;
            appContext.getAll().curposition.Lon = position.coords.longitude;
        }
        function showError(error) {
            console.log(error);
            // alert(error);
            appContext.getAll().curposition.Lat = '0';
            appContext.getAll().curposition.Lon = '0';
            switch(error.code)
            {
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.")
                    break;
            }
        }


        return {
            get:getLocation
        }
    })
    .factory('jsToAndroid',function () {

        return {
            sendToken: function (token) {
                try {
                    if (window.getSomethingByJs)
                        window.getSomethingByJs.getUserToken(token);

                    if (window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
                        window.webkit.messageHandlers.getUserMsg.postMessage({Token: token});
                }catch (err){

                }
            },
            sendUserName:function (username) {
                try {
                    if (window.getSomethingByJs)
                        window.getSomethingByJs.getUsername(username);
                    if (window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
                        window.webkit.messageHandlers.getUserMsg.postMessage({UserName: username});
                }catch (err){

                }           }
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
