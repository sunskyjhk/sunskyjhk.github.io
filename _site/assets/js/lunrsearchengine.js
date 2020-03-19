
var documents = [{
    "id": 0,
    "url": "http://localhost:4000/404.html",
    "title": "404",
    "body": "404 Page does not exist!Please use the search bar at the top or visit our homepage! "
    }, {
    "id": 1,
    "url": "http://localhost:4000/about",
    "title": "Mediumish Template for Jekyll",
    "body": "This website is built with Jekyll and Mediumish template for Jekyll. It's for demonstration purposes, no real content can be found. Mediumish template for Jekyll is compatible with Github pages, in fact even this demo is created with Github Pages and hosted with Github.  Documentation: Please, read the docs here. Questions or bug reports?: Head over to our Github repository! Buy me a coffeeThank you for your support! Your donation helps me to maintain and improve Mediumish . Buy me a coffee Documentation"
    }, {
    "id": 2,
    "url": "http://localhost:4000/categories",
    "title": "Categories",
    "body": ""
    }, {
    "id": 3,
    "url": "http://localhost:4000/",
    "title": "Home",
    "body": "      Featured:                                                                                                                                                                                                           Go 복합 데이터 타입 (Go Composite Types)                              :                Table Of Contents          Arrays          Slices          Maps          Structs          Nested Structs          결론      :                                                                                                                                                                       Genesis                                19 Mar 2020                                                                                                                                                                                                                                                                                                                  Go 인터페이스 (Interfaces)                              :                Table Of Contents          기본 예제          왜 유용한가?          인터페이스 정의하기          값 반환하기          인터페이스 만족하기          결론      :                                                                                                                                                                       Genesis                                18 Mar 2020                                                                                                                                                                                                                                                                                                                  Go 기본 타입 (Go Basic Types)                              :               Table Of Contents 데이터 타입 Integers 표준 int 타입 타입 변환하기 Floating Point Numbers Converting float to int and back again Complex Numbers Booleans 문자열. . . :                                                                                                                                                                       Genesis                                18 Mar 2020                                                                                                                                                                                                                                                                                                                  Go로 시작하기                              :                Table Of Contents          준비하기          시작하기          결      :                                                                                                                                                                       Genesis                                17 Mar 2020                                                                                                                      All Stories:                                                                                                     Go 복합 데이터 타입 (Go Composite Types)              :        Table Of Contents          Arrays          Slices          Maps          Structs          Nested Structs          결론      :                                                                               Genesis                19 Mar 2020                                                                                                                                     Go 인터페이스 (Interfaces)              :        Table Of Contents          기본 예제          왜 유용한가?          인터페이스 정의하기          값 반환하기          인터페이스 만족하기          결론      :                                                                               Genesis                18 Mar 2020                                                                                                                                     Go 기본 타입 (Go Basic Types)              :       Table Of Contents 데이터 타입 Integers 표준 int 타입 타입 변환하기 Floating Point Numbers Converting float to int and back again Complex Numbers Booleans 문자열 상수 결론 이번 포스팅에서는 Go. . . :                                                                               Genesis                18 Mar 2020                                                                                                                                     Go로 시작하기              :        Table Of Contents          준비하기          시작하기          결      :                                                                               Genesis                17 Mar 2020                                            "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/Ch03-Go-Composite-Types-Tutorial/",
    "title": "Go 복합 데이터 타입 (Go Composite Types)",
    "body": "2020/03/19 -  Table Of Contents:           Arrays          Slices          Maps          Structs          Nested Structs          결론      이번 포스팅에서는 Go 프로그래밍 언어로 제공되는 다양한 복합 데이터 타입 (Composite Data Type)을 살펴 보겠습니다. 이 포스팅의 내용이 생소하다면, 기본 데이터 타입에 대한 다른 포스팅을 확인하고 오시면 도움이 될 것입니다. 복합 데이터 타입에 대해서 잘 이해하려면 이러한 기본 데이터 타입에 대해 알아야합니다.   Arrays: 첫 번째 복합 데이터 형식인 arrays를 어떻게 선언하고 사용할 수 있는지 방법을 살펴 보겠습니다. 모든 요일을 배열로 선언하는 것을 시작해 봅시다. 그러기 위해서는 먼저 빈 배열이 있어야 합니다. 12345// declaring an empty array of stringsvar days []string// declaring an array with elementsdays := [. . . ]string{ monday ,  tuesday ,  wednesday ,  thursday ,  friday ,  saturday ,  sunday }배열의 첫 번째 요소 또는 특정 요소를 쿼리하려는 경우 다른 언어와 매우 유사한 방식으로 쿼리할 수 있습니다. 12fmt. Println(days[0]) // prints 'monday'fmt. Println(days[5]) // prints 'saturday'  Slices: slices와 arrays의 차이점은 매우 미묘합니다. Go에서 slice를 사용하면 기본 array 요소의 하위 집합에 액세스할 수 있게 됩니다. slices는 pointer, length, capacity의 세 가지로 이루어져 있습니다. 예제를 가지고 이것을 시각화 해봅시다. 예를 들어, 우리는 한 주의 모든 요일이 있는 array를 가지고 있고, 우리는 이 array에서 주말을 제외한 요일만을 추출하길 원한다면 slice를 사용할 수 있습니다. 1234days := [. . . ]string{ Monday ,  Tuesday ,  Wednesday ,  Thursday ,  Friday ,  Saturday ,  Sunday }weekdays := days[0:5]fmt. Println(weekdays)// This returns: [Monday Tuesday Wednesday Thursday Friday]  Maps: Maps는 Go에서 hash 테이블을 나타내는 것으로, 임의의 데이터 타입을 다른 타입으로 매핑할 수 있는 데이터 구조입니다. 예를 들어 YouTube 채널 이름에서 해당 채널의 구독자 수에 대한 map을 만들어 보겠습니다. 1234567youtubeSubscribers := map[string]int{  TutorialEdge :   2240,  MKBHD :      6580350,  Fun Fun Function : 171220,}fmt. Println(youtubeSubscribers[ MKBHD ]) // prints out 6580350이것은 string 데이터 타입과 int 데이터 타입 간의 mapping을 나타냅니다.   Structs: Go에서 우리는 struct의 개념을 가지고 있습니다. 이 structs를 사용하면 다른 데이터 형식이 aggregate된 데이터 타입을 만들 수 있습니다. 예를 들어, 우리는 응용 프로그램 내에서 어떤 Person에 대한 개념을 다음과 같이 가지고 있다고 가정해봅시다. 그러면 string 타입의 이름 필드와 int 타입의 age 필드를 가질 수 있는 person struct를 만들 수 있습니다: 12345678// our Person structtype Person struct { name string age int}// declaring a new `Person`var myPerson Person이러한 struct를 사용하면 그 안에 있는 값이나 fields를 모두 단일 엔터티라고 취급되어 이를 효과적으로 처리하고 쉽게 수정할 수 있다는 장점이 있습니다. 12345// declaring a new `elliot`elliot := Person{name:  Elliot , age: 24}// trying to roll back time to before I was injury proneelliot. age = 18  Nested Structs: 구조체 안에 중첩 구조체를 만들 수 있기 때문에 구조체는 엄청나게 확장 가능합니다. 예를 들어, 우리 팀에 많은 사람들이 있는 Team 구조체가 있다고 상상해봅시다. 12345678910111213141516171819202122232425262728package mainimport (   fmt )func main() {  type Person struct {    name string    age int  }  // our Team struct  type Team struct {    name  string    players [2]Person  }  // declaring an empty 'Team'  var myTeam Team  fmt. Println(myTeam)  players := [. . . ]Person{Person{name:  Forrest }, Person{name:  Gordon }}  // declaring a team with players  celtic := Team{name:  Celtic FC , players: players} fmt. Println(celtic)}  결론: 이 포스팅이 유용하길 바라면서 자신의 Go 프로그램 내에서 보다 고급 데이터 타입을 사용하는 방법에 대한 통찰력을 얻으셨길 바랍니다. 유용하거나 자세한 정보가 필요하면 아래의 댓글에 알려주세요! "
    }, {
    "id": 6,
    "url": "http://localhost:4000/Ch06-Go-Interfaces-Tutorial/",
    "title": "Go 인터페이스 (Interfaces)",
    "body": "2020/03/18 -  Table Of Contents:           기본 예제          왜 유용한가?          인터페이스 정의하기          값 반환하기          인터페이스 만족하기          결론      "
    }, {
    "id": 7,
    "url": "http://localhost:4000/Ch02-Go-Basic-Types-Tutorial/",
    "title": "Go 기본 타입 (Go Basic Types)",
    "body": "2020/03/18 -  Table Of Contents:           데이터 타입          Integers          표준 int 타입          타입 변환하기          Floating Point Numbers          Converting float to int and back again          Complex Numbers          Booleans          문자열          상수          결론      이번 포스팅에서는 Go 언어에서 사용할 수 있는 모든 기본 데이터 타입을 살펴 보겠습니다. 이 튜토리얼이 끝나면 언어 내에서 사용 가능한 다양한 데이터 타입에 익숙해질 것이며 자신의 Go 프로그램에서 이러한 타입을 사용하는 방법에 대한 이해가 완료될 것입니다. 이런 종류의 튜토리얼은 배우기에는 상당히 건조하고 지루할 수 있으므로 필요한 기본 사항을 다루면서 이것저것 꾸미고 매끄럽게 만들어서 약간의 재미를 주도록 노력했습니다.   데이터 타입: 따라서, 시작하려면 Go 프로그래밍 언어 내에 4 가지 카테고리의 타입이 있다는 것을 알아야 합니다.  Basic Types-이 튜토리얼에서 다룰 내용 Aggregate Types-배열과 구조체 Reference Types-포인터와 슬라이스 Interface Types-표준 인터페이스  Integers: 우리가 다룰 첫 번째 기본 타입은 정수 타입입니다. 프로그램 내에서 부호있는 정수 또는 부호없는 정수를 사용할 수 있으며 필요한 정수의 크기를 지정할 수 있습니다. 요청하는 크기를 지정하고 싶은 이유는 무엇일까요? 프로그램의 메모리 사용률을 최적화하려고 한다고 상상해 보십시오. 특정 숫자가 특정 값을 초과하지 않는 경우 해당 값에 적합한 메모리 크기를 선택하여 할당할 수 있습니다. 타입 끝에 할당할 메모리 크기와 함께 uint 또는 int를 입력하여 새로운 정수 변수를 만들 수 있습니다. 예를 들어, 8 비트의 부호없는 정수를 원한다면 var myint uint8로 선언할 수 있습니다: 1234567891011121314151617181920212223// all numeric types default to 0// unsigned int with 8 bits// Can store: 0 to 255var myint uint8// signed int with 8 bits// Can store: -127 to 127var myint int8// unsigned int with 16 bitsvar myint uint16// signed int with 16 bitsvar myint int16// unsigned int with 32 bitsvar myint uint32// signed int with 32 bitsvar myint int32// unsigned int with 64 bitsvar myint uint64// signed int with 64 bitsvar myint int64처리할 수 있는 것보다 큰 값을 int에 할당하려고하면 다음과 같습니다: 12var myint int8myint = 2500Go 컴파일러는 프로그램을 실행하거나 빌드하지 못하고 2500이 int8을 오버플로우한다는 사실을 출력합니다. 그러나 런타임에 정수를 오버플로우하게 만들면 이상한 결과가 나타날 수 있습니다. 예를 들어,아래의 프로그램을 실행하고 출력을 검사해 보세요: 123456789101112131415package mainimport (   fmt )func main() {  fmt. Println( Hello World )  var myint int8  for i := 0; i &lt; 129; i++ {    myint += 1  }  fmt. Println(myint) // prints out -127}이것은 이 특정 연산의 결과로 부호있는 정수가 오버플로우 되었기 때문입니다. 이것은 여러분의 프로그램 내에서 주의해야 할 부분입니다!   표준 int 타입: 정수 값을 정의할 때, 이 모든 세부 정보가 너무 많으면 대부분의 경우 기본적으로 int로 설정할 수 있습니다. 이 int 데이터 타입은 일반적으로 기본 시스템이 32 비트 시스템인지 64 비트 시스템인지에 따라 크기가 32 비트 또는 64 비트로 결정됩니다. 간단하게 하기 위해 이 데이터 타입을 기본 값으로 사용하는 것이 가장 편하며 이 타입이 가장 널리 사용되는 것을 볼 수 있습니다. 1  &lt;a href= #conversionOfTypes &gt;타입 변환하기&lt;/a&gt;  타입 변환하기: 데이터 타입이 다른 여러 변수로 작업할 때 다양한 정수 변수를 int로 캐스팅 할 필요가 없습니다. 이것은 uint8 및 int16과 같은 것에서 표준 32 또는 64 비트의 부호있는 int로 변환을 처리한 당므 거기에서 더하기, 곱하기 및 빼기와 같은 일을 할 수 있습니다. 1234567891011var men uint8men = 5var women int16women = 6var people int// this throws a compile errorpeople = men + women// this handles converting to a standard format// and is legal within your go programspeople = int(men) + int(women)  Floating Point Numbers : 다음으로, 우리는 부동 소수점 숫자 (Floating Point Numbers)를 살펴보겠습니다. 이들은 float32 또는 float64의 두 가지 메모리 사이즈로 제공되며 표준 int64 데이터 타입에 맞지 않는 매우 큰 숫자를 작업할 수 있게 해줍니다. 12var f1 float32var f2 float64이제 float를 선언하고 작업하는 방법을 살펴보겠습니다: 123456var maxFloat32 float32maxFloat32 = 16777216fmt. Println(maxFloat32 == maxFloat32+10) // you would typically expect this to return false// it returns truefmt. Println(maxFloat32+10) // 16777216fmt. Println(maxFloat32+2000000) // 16777216  Converting float to int and back again: 정수를 부동 소수점으로 변환하거나 부동 소수점을 정수로 변환하려면 변수를 원하는 데이터 타입으로 캐스팅하여 이를 달성할 수 있습니다. 1234567// converting from int to floatvar myint intmyfloat := float64(myint)// converting from float to intvar myfloat2 float64myint2 := int(myfloat2)  Complex Numbers: 자, 정수와 부동 소수점을 모두 다루었지만 일반적으로 간과되는 또 다른 숫자 데이터 타입이 있는데, 그것은 바로 복소수 데이터 타입입니다. 부동 소수점 데이터 타입과 매우 유사한 이 두 가지의 메모리 사이즈로 complex64 또는 complex128을 사용할 수 있습니다. 1234567var x complex128 = complex(1, 2) // 1+2ivar y complex128 = complex(3, 4) // 3+4i// multiplication between complex numbersfmt. Println(x*y)         //  (-5+10i) // extract the each property of complex number (real &amp; imaginary)fmt. Println(real(x*y))      //  -5 fmt. Println(imag(x*y))      //  10   Booleans: 이제 모든 기본 숫자 데이터 타입을 다루었으므로 Go에서 사용할 수 있는 다른 기본 데이터 타입으로 넘어가 보겠습니다. 첫 번째는 bool 또는 boolean 데이터 타입입니다. bool은 true 또는 false를 나타냅니다. Go 프로그램에서 이것이 어떻게 사용될 수 있는지 봅겠습니다: 12345var amazing boolamazing = trueif amazing { subscribeToChannel()}멋지고 단순하지만 프로그램 내에서 약간의 boolean을 이용한 논리 연산을 수행하려면 어떻게 해야할까요?음, ||과 &amp;&amp;을 사용해서 할 수 있습니다! 12345678910var isTrue bool = truevar isFalse bool = false// ANDif isTrue &amp;&amp; isFalse { fmt. Println( Both Conditions need to be True )}// OR - not exclusiveif isTrue || isFalse { fmt. Println( Only one condition needs to be True )}  문자열: Go 언어의 문자열은 문자 조각이라고합니다. string을 사용하여 새로운 문자열 변수를 선언할 수 있습니다: 12var myName stringmyName =  Elliot Forbes   상수: 상수는 우리가 이 포스팅에서 다루는 Go 언어의 마지막 기본 데이터 타입입니다. 이를 통해 프로그램 실행 과정에서 변경되지 않는 불변 값을 지정할 수 있습니다. 1const meaningOfLife = 42  결론: 이번 강의에서 많은 내용을 다루었지만 즐겁게 즐기시기 바랍니다. 추가 도움이 필요하거나 더 알고 싶다면 아래의 댓글란에 알려주세요! "
    }, {
    "id": 8,
    "url": "http://localhost:4000/Ch01-Getting-Started-With-Go/",
    "title": "Go로 시작하기",
    "body": "2020/03/17 -  Table Of Contents:           준비하기          시작하기          결      Go는 다양한 응용 프로그램을 구축할 수 있는 매우 놀라운 언어입니다. command-line 인터페이스에서 분산형 마이크로시스템 및 클라우드 플랫폼에 이르기까지 이 언어가 가지는 단순성과 동시성을 통해 많은 개발팀에서 강력하게 선택하게 되는 언어입니다. 이 튜토리얼을 통해서 언어를 익히고 실행하여 더욱 뛰어난 응용 프로그램을 구축하고 기술을 발전시키는데 도움이 되길 바랍니다. 먼저 정말 간단한 Hello World 스타일 응용 프로그램을 시작하고 실행하는데 중점을 두겠습니다. 모든 것을 순조롭게 마친다면 function, method, 그리고 concurrency 및 reflection과 같은 언어의 보다 복잡한 측면을 배우는 과정을 시작할 수 있는 준비가 될 것 입니다.   준비하기: 이 포스트에 있는 내용을 수행하려면 Go가 필요합니다.  자신의 컴퓨터에 Go가 설치되어 있어야 합니다. 공식 다운로드 페이지를 통해 설치할 수 있습니다: Go 공식 다운로드 페이지  시작하기: Go 언어와 관련된 모든 것을 설치하고 매우 간단한 프로그램을 작성해 봅시다. 먼저 현재 자신의 컴퓨터 OS에 따라 사용 가능한 다양한 버전의 Go를 설치할 수 있는 공식 시작하기 페이지로 이동해 봅시다. 현재 시점에서 최신 버전을 설치해 봅시다. 이 포스트를 작성할 당시의 버전은 다음과 같습니다. go 1. 14 설치하고 나면 공식 Go 바이너리가 컴퓨터의 PATH에 추가됩니다. 이 작업을 수행하면 여러분의 터미널에서 go version을 실행할 수 있게 됩니다: 12$ go versiongo version go1. 14 darwin/amd64이것이 제대로 작동하면 우리는 이제 Go 프로그램 작성을 시작할 수 있습니다. 선택한 코드 편집기를 열고 Hello World 프로젝트가 만들어질 새 디렉토리를 만들어 봅시다. 이 디렉토리 내에서 main. go 라는 새 파일을 만들어 봅시다. 우리는 이 파일에 비교적 간단한 Go 프로그램을 만들어보겠습니다. 이 디렉토리 위치에서 터미널을 열고 다음 명령을 실행하려고 합니다. 12$ GOMODULES11=ON $ go mode init github. com/hello/world이를 통해 프로젝트를 초기화하고 향후 Go 코드를 하위 패키지로 분리할 수 있습니다. 또한 최소한의 노력으로 원하는 외부 종속성을 검색할 수 있습니다. 이제 main. go 파일 내에 다음 코드를 추가해봅시다: 12345678910111213141516171819// the first statement of every go source file// must be a package declaration. If we aren't doing anything// fancy, this tends to be package main. package main// We then want to use the fmt package// which features a `print` function - Printlnimport  fmt // We then need to define our main function. // Think of this as the entry point to our Go// programfunc main() {  // within this main function, we then  // want to call a function within the fmt  // package called Println() in order to print  // out `Hello World`  fmt. Println( Hello World )}이게 끝입니다. 이 5줄의 코드를 추가한 후에 PATH에 있는 go 바이너리를 사용하여 이 코드를 실행하고 컴파일하도록 설정할 수 있습니다. 12$ go run main. goHello World이것을 바이너리 실행 파일로 컴파일하려면 go 바이너리를 다음과 같이 사용하면 됩니다. 12$ go build main. go$ . /main 축하합니다 - 첫 번째 Go 응용 프로그램을 성공적으로 작성, 실행 및 컴파일했습니다!   결론: 이제 이 간단한 튜토리얼에서 Go개발 세계로의 여행을 성공적으로 시작했습니다. Go 기술을 향상시키는데 관심이 있으시면 Go에서 사용할 수있는 기본 유형에 대해 이 튜토리얼의 다음 포스트를 확인하세요 - Go 기본 타입 튜토리얼 "
    }];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if(term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}

function lunr_search(term) {
    $('#lunrsearchresults').show( 400 );
    $( "body" ).addClass( "modal-open" );
    
    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block"  tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    if(term) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></small></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}
    
$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});