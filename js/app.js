/**
 * Created by pj on 2017/8/16.
 */
var myApp = angular.module("app", ["ui.router","allservice","appControllers"]);
//这里叫做App模块，这将告诉HTML页面这是一个AngularJS作用的页面，并把ui-router注入AngularJS主模块，它的内容由AngularJS引擎来解释。
myApp.config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
    //这一行声明了把 $stateProvider 和 $urlRouteProvider 路由引擎作为函数参数传入，这样我们就可以为这个应用程序配置路由了.

    //如果没有路由引擎能匹配当前的导航状态，默认将路径路由至 PageTab.html, 那它就像switch case语句中的default选项.就是一个默认的视图选项
    $stateProvider
    //这一行定义了会在main.html页面第一个显示出来的状态（就是进入页面先加载的html），作为页面被加载好以后第一个被使用的路由.
        .state("login", {
            url: "/login",//#+标识符，这里就是url地址栏上面的标识符，通过标识符，进入不同的html页面
            templateUrl: "html/login.html",//这里是html的路径，这是跟标识符相对应的html页面
            controller:'loginCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("forgetPassword",{
            url:'/forgetPassword',
            templateUrl:'html/forgetPassword.html',
            controller:'forgetPasswordCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("main",{
            url:'/main',
            templateUrl:'html/main.html',
            controller:'mainCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("signin_first",{
            url:'/signup_f/:id',
            templateUrl:'html/signin_first.html',
            controller:'signinCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state('signin_second',{
            url:'/signup_s',
            templateUrl:'html/signin_second.html',
            controller:'signin_secondCtr',
            params: {
                id: ''
            },
            //注入'isSide'服务
            resolve: {
                app:'initSignupSelectOptions',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                app.init();
                goTop.go();
            }
        })
        .state('auditPage',{
            url:'/auditPage',
            templateUrl:'html/auditPage.html',
            controller:'auditPageCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("search",{
            url:'/search/:id',
            templateUrl:'html/search.html',
            controller:'searchCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop',
                initLocation:'initSometing'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop,initLocation){
                goTop.go();
                initLocation.initSometing();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state('sidemenu',{
            url:'/sidemenu',
            templateUrl:'html/sidemenu.html',
            controller:'sidemenuCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext' ,
                isAutGo:'noAutGoLoginPage',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,isAutGo,goTop){
                isAutGo.init();
                app.getAll().isSidemenu=true;
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().isSidemenu=false;
            }
        })
        .state("sidemenu.account",{
            url:"/account",
            templateUrl:"html/sidemenu/account.html",
            controller:'accountCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
                app.getAll().userTitle = 'MY ACCOUNT';
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().userTitle = 'MENU';
            }
        })
        .state("sidemenu.editprofile",{
            url:"/editprofile",
            templateUrl:"html/sidemenu/editprofile.html",
            controller:'editprofileCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("sidemenu.wallet",{
            url:"/wallet",
            templateUrl:"html/sidemenu/wallet.html",
            controller:'walletCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("sidemenu.topup",{
            url:"/topup",
            templateUrl:"html/sidemenu/topup.html",
            controller:'topupCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            params:{
                href:''
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("sidemenu.mybookings",{
            url:"/mybookings",
            templateUrl:"html/sidemenu/mybookings.html",
            controller:'mybookingsCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("sidemenu.refer",{
            url:"/refer",
            templateUrl:"html/sidemenu/refer.html",
            controller:'referCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })
        .state("sidemenu.reportIssue",{
            url:"/reportIssue",
            templateUrl:"html/sidemenu/reportIssue.html",
            controller:'reportIssueCtr',
            params:{
                id:'',
                url:'',
                title:'',
                getReasonsUrl:''
            },
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext',
                goTop:'scrollToTop'
            },
            onEnter:function (goTop) {
                goTop.go();
            },
            onExit: function(app){
                app.getAll().fromBookingPage.goToReportIssue=false;
            }
        })
        .state("sidemenu.startTrip",{
            url:"/startTrip/:id",
            templateUrl:"html/sidemenu/startTrip.html",
            controller:'startTripCtr',
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(goTop){
                goTop.go();
            },
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
                app.getAll().startTrip.startTripSure1=false;
                app.getAll().startTrip.startTripSure2=false;
                app.getAll().startTrip.startTripSure3=false;
                app.getAll().startTrip.startTripSure4=false;
                app.getAll().startTrip.startTripSure5=false;
            }

        })
        .state("sidemenu.endtrip",{
            url:"/endtrip/:id",
            templateUrl:"html/sidemenu/endtrip.html",
            controller:'endtripCtr',
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
                app.getAll().endTrip.endtripSure1=false;
                app.getAll().endTrip.endtripSure2=false;
                app.getAll().endTrip.endtripSure3=false;
                app.getAll().endTrip.endtripSure4=false;
                app.getAll().endTrip.endtripSure5=false;
                app.getAll().endTrip.endtripSure6=false;
            }
        })
        .state("sidemenu.issue_status",{
            url:"/issue_status/:id",
            templateUrl:"html/sidemenu/issue_status.html",
            controller:'issue_statusCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(goTop){
                goTop.go();
            }
        })
        .state("sidemenu.extendBooking",{
            url:"/extendBooking/:id",
            templateUrl:"html/sidemenu/extendBooking.html",
            controller:'extendBookingCtr',
            //注入'isSide'服务
            resolve: {
                app:'appContext',
                goTop:'scrollToTop'
            },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app,goTop){
                goTop.go();
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
            }
        })

    .state('booking',{
        url:'/booking/:id',
        templateUrl:'html/booking.html',
        controller:'bookingCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('booking_deatils',{
        url:'/booking_deatils/:id',
        templateUrl:'html/booking_deatils.html',
        controller:'booking_deatilsCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('bookingconfirm',{
        url:'/bookingconfirm/:id',
        templateUrl:'html/bookingconfirm.html',
        controller:'bookingconfirmCtr',
        resolve: {
            isAutGo:'noAutGoLoginPage',
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(isAutGo,goTop){
            isAutGo.init();
            goTop.go();
        },
        onExit: function(app){
            app.getAll().fromBookingPage.isFromBooking=false;
        }
    })
    .state("bookingdetails",{
        url:"/bookingdetails/:id",
        templateUrl:"html/bookingdetails.html",
        controller:'bookingdetailsCtr',
        resolve: {
            isAutGo:'noAutGoLoginPage',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(isAutGo,goTop){
            isAutGo.init();
            goTop.go();
        }
    })
    .state('lunbo',{
        url:'/lunbo',
        templateUrl:'html/lunbo.html',
        controller:'lunboCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('mainsearch',{
        url:'/mainsearch',
        templateUrl:'html/mainsearch.html',
        controller:'mainsearchCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('faq',{
        url:'/faq',
        templateUrl:'html/faq.html',
        controller:'faqCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        params:{
            id:''
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            // goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('ourrates',{
        url:'/ourrates',
        templateUrl:'html/ourrates.html',
        controller:'ourratesCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('privacypolicy',{
        url:'/privacypolicy',
        templateUrl:'html/privacypolicy.html',
        controller:'privacypolicyCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('terms',{
        url:'/terms',
        templateUrl:'html/terms.html',
        controller:'termsCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('booking_search',{
        url:'/booking_search',
        templateUrl:'html/booking_search.html',
        controller:'booking_searchCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop',
            getADV:'getADV',
            initLocation:'initSometing'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop,getADV,initLocation){
            initLocation.initSometing();
            app.getAll().userTitle = 'BOOKING SEARCH';
            app.getAll().isNotificationShow = true;
            getADV.get();
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().userTitle = 'MENU';
            app.getAll().isNotificationShow = false;
        }
    })
    .state('main2',{
        url:'/main2',
        templateUrl:'html/main2.html',
        controller:'main2Ctr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop',
            getADV:'getADV'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop,getADV){
            app.getAll().isNotificationShow = true;
            getADV.get();
            getADV.getADVPicture();
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().isNotificationShow = false;
        }
    })
    .state('contact_us',{
        url:'/contact_us',
        templateUrl:'html/contact_us.html',
        controller:'contact_usCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('fleet_rates',{
        url:'/fleet_rates',
        templateUrl:'html/fleet_rates.html',
        controller:'fleet_ratesCtr',
        params:{
            id:''
        },
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('our_services',{
        url:'/our_services',
        templateUrl:'html/our_services.html',
        controller:'our_servicesCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('promotions',{
        url:'/promotions',
        templateUrl:'html/promotions.html',
        controller:'promotionsCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
        }
    })
    .state('my_profile',{
        url:'/my_profile',
        templateUrl:'html/my_profile.html',
        controller:'my_profileCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            app.getAll().userTitle = 'MY PROFILE';
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().userTitle = 'MENU';
        }
    })
    .state('my_bookings',{
        url:'/my_bookings',
        templateUrl:'html/my_bookings.html',
        controller:'my_bookingsCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            app.getAll().userTitle = 'MY BOOKINGS';
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().userTitle = 'MENU';
        }
    })
    .state('e_wallet',{
        url:'/e_wallet',
        templateUrl:'html/e_wallet.html',
        controller:'e_walletCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext',
            goTop:'scrollToTop'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,goTop){
            app.getAll().userTitle = 'E-WALLET';
            goTop.go();
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().userTitle = 'MENU';
        }
    });



    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/main2');
});

myApp.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
myApp.config(function ($httpProvider) {
    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Enables Request.IsAjaxRequest() in ASP.NET MVC
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    //禁用IE对ajax的缓存
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});