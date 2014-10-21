angular.module('ionicApp', ['ionic'])
.factory("AppData",function($q,$http){	
	var url="http://travelokam.com/";
	return{
		getCats:function(){
			return $http.jsonp(url+"?json=get_category_index", {
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
			
		},
		getCatPosts:function(catId,postcount){
			return $http.jsonp(url+"?json=get_category_posts&id="+catId+"&count="+postcount,{
				params:{
					callback:'JSON_CALLBACK'
				}
			});
		},
		getRPosts:function(){
			return $http.jsonp(url+"?json=get_recent_posts&count=4",{
				params:{
					callback:'JSON_CALLBACK'
				}
			});
		}
		,
		getLatLang:function(postId){
			return $http.jsonp(url+"?json=ghm.ghm_cust_vals&pid="+postId+"&ckey=location",{
				params:{
					callback:'JSON_CALLBACK'
				}
			});
		},
		getProducts:function(postcount){
			alert(0)
			return $http.jsonp(url+"?json=get_posts&count="+postcount, {
			
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
		}
	}
})
  
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "menu.html",
      controller: 'MenuCtrl'
    })
    .state('menu.tabs', {
      url: "/tab",
      views: {
        'menuContent' :{
          templateUrl: "tabs.html"
        }
      }
    })
    .state('menu.tabs.buttons', {
      url: "/buttons",
      views: {
        'buttons-tab': {
          templateUrl: "buttons.html",
        }
      }
    })
    .state('menu.tabs.list', {
      url: "/list/:catId/:page",
      views: {
        'list-tab': {
          templateUrl: "list.html",
          controller: 'CatController'
        }
      }
    })
	 .state('menu.tabs.cats', {
        url: "/cats",
      views: {
          'list-tab': {
            templateUrl: "cats.html",
        }
      }
    })
	.state('menu.tabs.single-product', {
        url: "/single-product/:postId",
      views: {
          'list-tab': {
            templateUrl: "single-product.html",
			controller: 'SingleProductController'
        }
      }
    })
	.state('menu.tabs.recent-post', {
        url: "/recent-post/:postId",
      views: {
          'list-tab': {
            templateUrl: "recent-single-post.html",
			controller: 'RecentPostsController'
        }
      }
    })
	.state('menu.tabs.map', {
        url: "/map/:postId",
      views: {
          'list-tab': {
            templateUrl: "map.html",
			controller: 'MapController'
        }
      }
    })
	.state('menu.tabs.map2', {
        url: "/map2/:postId",
      views: {
          'list-tab': {
            templateUrl: "map2.html",
			controller: 'MapController2'
        }
      }
    })
    .state('menu.tabs.item', {
      url: "/item",
      views: {
          'item-tab': {
          templateUrl: "item.html",
        }
      }
    })
     .state('menu.tabs.about', {
      url: "/about",
      views: {
        'exedash-tab': {
          templateUrl: "about.html",
        }
      }
    });

  $urlRouterProvider.otherwise("menu/tab/buttons");

})

.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
              
 
 })
.controller('SingleProductController', function($scope,$rootScope,$stateParams) {
	
		
	for(var i=0;i<$rootScope.posts.length;i++){
		if($stateParams.postId==$rootScope.posts[i].id){
			$scope.post=$rootScope.posts[i];
		}
	}
	
}) 
.controller('RecentPostsController', function($scope,$rootScope,$stateParams) {
	
	for(var i=0;i<$rootScope.rposts.length;i++){
		if($stateParams.postId==$rootScope.rposts[i].id){
			$scope.post=$rootScope.rposts[i];
		}
	}
	
}) 
.controller('MapController', function($scope,$rootScope,$stateParams,AppData) {
	var posts=[];
	var myOptions = {
          zoom: 10,
          center: new google.maps.LatLng(17.3, 78.4),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
	$rootScope.mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
	if($rootScope.posts.length>0){
	
		posts=$rootScope.posts;
		for(var i=0;i<posts.length;i++){
			if($stateParams.postId==posts[i].id){
				$scope.post=posts[i];
			}
		}
		AppData.getLatLang($scope.post.id).then(function(data){
			alert(data.data.location[0]);
			navigator.geolocation.getCurrentPosition(function(pos){
			$rootScope.gfrom=pos;
			$rootScope.gto=data.data.location[0];
				alert(pos.coords.latitude+" "+pos.coords.longitude);
				//new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
				$rootScope.calcRoute();
			 }, function(error) {
			  alert('Unable to get location: ' + error.message);
			});
		});
	}	
}) 

.controller('MapController2', function($scope,$rootScope,$stateParams,AppData) {
	var posts=[];
	var myOptions = {
          zoom: 10,
          center: new google.maps.LatLng(17.3, 78.4),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
	$rootScope.mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
	
	
	if($rootScope.rposts.length>0){
	
		posts=$rootScope.rposts;
		for(var i=0;i<posts.length;i++){
			if($stateParams.postId==posts[i].id){
				$scope.post=posts[i];
			}
		}
		AppData.getLatLang($scope.post.id).then(function(data){
			alert(data.data.location[0]);
			navigator.geolocation.getCurrentPosition(function(pos){
			$rootScope.gfrom=pos;
			$rootScope.gto=data.data.location[0];
				alert(pos.coords.latitude+" "+pos.coords.longitude);
				//new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
				$rootScope.calcRoute();
			 }, function(error) {
			  alert('Unable to get location: ' + error.message);
			});
		});
	}	
}) 

.controller('CatController', function($scope,$rootScope,$stateParams,AppData) {
	var posts=[];
	var catTitle="";
	var currentcat=0;
	for (var i=0;i<$rootScope.cats.length;i++){
		if( $rootScope.cats[i].id==$stateParams.catId){
			currentcat=$rootScope.cats[i];
			break;
		}	
	}
	//target point 1 := need a JSON function to load "cat posts"
	$rootScope.sposts=[];
	if ($rootScope.lcats.indexOf(currentcat.id)==-1)
	{
		$rootScope.ploading=true;
		$rootScope.lcats.push(currentcat.id);
		AppData.getCatPosts(currentcat.id,currentcat.post_count).then(function(cposts){
	
			posts=cposts.data.posts;
			for(var i=0;i<posts.length;i++){
				$rootScope.posts.push(posts[i]);
			}
			$rootScope.catposts.push(posts);
			
			
			for(var i=0;i<posts.length;){
				var scat=[];
				for(var j=0;j<$rootScope.ppp;j++){
					if(i<posts.length){
						scat.push(posts[i]);
						i++;
					}
					
				}
				$rootScope.sposts.push(scat);
			}
			page=parseInt($stateParams.page);
			$rootScope.ploading=false;
			if(page>=0 && page<$rootScope.sposts.length){
				$scope.catTitle=currentcat.title;
				$scope.childCats=$rootScope.sposts[page];
				$scope.currentpage=page;
				$scope.currentcat=$stateParams.catId;
			}
			
			
			$scope.products=[];
			$scope.dpr=[];
		
		
		})
	}
	else{
			$rootScope.ploading=false;
			posts=$rootScope.catposts[$rootScope.lcats.indexOf(currentcat.id)];
			for(var i=0;i<posts.length;){
				var scat=[];
				for(var j=0;j<$rootScope.ppp;j++){
					if(i<posts.length){
						scat.push(posts[i]);
						i++;
					}
					
				}
				$rootScope.sposts.push(scat);
			}
			page=parseInt($stateParams.page);
			if(page>=0 && page<$rootScope.sposts.length){
				$scope.catTitle=currentcat.title;
				$scope.childCats=$rootScope.sposts[page];
				$scope.currentpage=page;
				$scope.currentcat=$stateParams.catId;
			}
			
			
			$scope.products=[];
			$scope.dpr=[];
	}
})
.controller('DataCtrl', function($scope,$rootScope,$timeout,AppData) {
	$rootScope.calcRoute=function(){
		var selectedMode = document.getElementById('mode').value;
		alert("<<"+JSON.stringify(google.maps.TravelMode[selectedMode])+" >>");
		
		var pos=$rootScope.gfrom;
		var from=new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
		alert($rootScope.gfrom+"  "+$rootScope.gto);
		var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
          origin: from,
          destination: $rootScope.gto,
          travelMode: google.maps.TravelMode[selectedMode],
          unitSystem: google.maps.UnitSystem.METRIC
        };
		directionsService.route(
          directionsRequest,
          function(response, status)
          {
            if (status == google.maps.DirectionsStatus.OK)
            {
				
              new google.maps.DirectionsRenderer({
                map: $rootScope.mapObject,
                directions: response
              });
			  var circle = new google.maps.Circle({
				  center: from,
				  radius: pos.coords.accuracy,
				  map: $rootScope.mapObject,
				  fillColor: '#0000FF',
				  fillOpacity: 0.5,
				  strokeColor: '#0000FF',
				  strokeOpacity: 1.0
				});
				$rootScope.mapObject.fitBounds(circle.getBounds());
            }
            else
             // $("#error").append("Unable to retrieve your route<br />");
			 alert("Unable to retrieve your route!")
          }
        );
	}
	var allCats=function(){
		
		AppData.getCats().then(function(cats){
				var postcount=0;
				if(cats!="error")
				{
					
					$rootScope.cats=cats.data.categories;
					
					for (var i=0;i<$rootScope.cats.length;i++)
					{
						postcount=postcount+$rootScope.cats[i].post_count;
					}
					$rootScope.catset=true;
					$rootScope.postcount=postcount;
					if($rootScope.rposts.length<=0)
					{
						AppData.getRPosts().then(function(posts){
							$rootScope.rposts=posts.data.posts;
							$rootScope.cloading=false;
						});
					}
					
				}
				else
				{
					$rootScope.catset=false;
				}
			});
	}
	var allPosts=function(){
		if ($rootScope.postcount){
			var postcount=$rootScope.postcount;
		}
	}
	$rootScope.splitArray=function(parent,slen){
		var dpr=[];
		var k=0;
		for(var i=0;i<parent.length;){
			var tmp=[];
			for(var j=0;j<slen;j++){
				
				if(i<parent.length){
				tmp[j]=parent[i++];
				}
				else break;
			}
			dpr[k++]=tmp;
		}
		return dpr;
	}
	dataCheck=function(){
	if(!($rootScope.catset) || !($rootScope.productset) ){
			alert("Error connecting to server");
		}
	else{
		 
		alert("Loading Completed!");
	}
	
	}
	ionic.Platform.ready(function() {
		$rootScope.postcount=false;
		$rootScope.catposts=[];
		$rootScope.posts=[];
		$rootScope.rposts=[];
		$rootScope.lcats=[];
		$rootScope.cloading=true;
		$rootScope.ploading=true;
		$rootScope.ppp=10; //posts per page
		$rootScope.url="http://travelokam.com";
		allCats();
	});
	 
})         