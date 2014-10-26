describe('AppCtrl', function(){
  var scope, ctrl, httpBackend, url, mockData, rootScope, YoutubeSearchSrv;

  beforeEach(module("mediaDeck"));

  beforeEach(
    inject(
      function($controller, $rootScope, YoutubeSearch, preset, $httpBackend) {
        rootScope = $rootScope;
        YoutubeSearchSrv = YoutubeSearch;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        ctrl = $controller("AppCtrl", {
          $scope: scope, 
          YoutubeSearch: YoutubeSearch,
          preset: preset
        });

        mockData = { items: [{a: 3}] };
        url = "https://www.googleapis.com/youtube/v3/search" +
        "?key=AIzaSyB7fFNreY1UzX1la5arnnAi3ZOyvqOV6kk&maxResults=50&part=snippet,id";
      }
    )
  );

  it('should set videos after successful search', function() {
    httpBackend.whenGET(url).respond(mockData);
    scope.searchYoutube();
    httpBackend.flush();

    expect(scope.videos).toBeDefined();
    expect(scope.videos.length).toBe(1);
  });

  it("set the feed type when changed in YoutubeSearch and perform search",  function(){
    httpBackend.whenGET(url).respond(mockData);
    spyOn(scope, 'searchYoutube').and.callFake(function(){
      return 'ok';
    });

    spyOn(YoutubeSearchSrv, 'setType').and.callFake(function(){
      return 'set';
    });

    rootScope.$broadcast('feed-type-changed', 'playlist');
    scope.$digest();
    expect(YoutubeSearchSrv.setType).toHaveBeenCalled();
    expect(scope.searchYoutube).toHaveBeenCalled();
  })
});