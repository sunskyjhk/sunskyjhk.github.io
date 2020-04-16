---
layout: post
title: "Go로 RESTful API 만들기"
author: Sun
date: 2020-04-07 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 전체 범위의 CRUD 조작을 수행할 수 있는 GET, POST, DELETE 
및 PUT 엔드 포인트를 표시하는 본격적인 REST API를 빌드합니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">전제 조건</a>
      </li>
      <li>
        <a href="#goals">목표</a>
      </li>
      <li>
        <a href="#videoTutorial">비디오 튜토리얼</a>
      </li>
      <li>
        <a href="#rESTArchitectures">REST 아키텍처</a>
      </li>
      <li>
        <a href="#jSON">JSON</a>
      </li>
      <li>
        <a href="#marshalling">마샬링</a>
      </li>
      <li>
        <a href="#gettingStarted">기본 API 시작하기</a>
      </li>
      <li>
        <a href="#ourArticles">우리의 기사 구조</a>
      </li>
      <li>
        <a href="#retrievingAll">모든 기사 검색</a>
      </li>
      <li>
        <a href="#gettingStartedrouter">라우터 시작하기</a>
      </li>
      <li>
        <a href="#buildingour">라우터 구축</a>
      </li>
      <li>
        <a href="#pathVariables">경로 변수</a>
      </li>
      <li>
        <a href="#creatingand">기사 작성 및 업데이트</a>
      </li>
      <li>
        <a href="#creatingnew">새로운 기사 만들기</a>
      </li>
      <li>
        <a href="#deletingArticles">기사 삭제</a>
      </li>
      <li>
        <a href="#updatingArticles">기사 엔드 포인트 업데이트</a>
      </li>
      <li>
        <a href="#challenge">Challenge</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
      <li>
        <a href="#furtherReading">더 읽을거리</a>
      </li>
    </ul>
  </nav>
</div>

웹 애플리케이션 form을 작성하는 경우 애플리케이션의 동적 부분을 채우고 
데이터베이스 내에서 데이터 업데이트 또는 삭제와 같은 태스크를 수행하기 위해 하나 이상의 
REST API와 interfacing하고있을 가능성이 높습니다. 

이 포스트에서는 전체 범위의 `CRUD` 조작을 수행할 수 있는 `GET`, `POST`, `DELETE` 
및 `PUT` **엔드 포인트를 표시하는 본격적인 REST API를 빌드**합니다.

이 개념을 단순하게 유지하고 기본 개념에 집중하기 위해 백엔드 데이터베이스 기술과 
상호 작용하여 다루지 않을 기사를 저장하지는 않을 것입니다. 
그러나 필요한 `CRUD` 조작을 수행하기 위해 데이터베이스를 후속 호출하도록 정의할 
함수를 쉽게 업데이트할 수 있는 방식으로이 REST API를 작성합니다.

Go를 사용하여 데이터베이스와 상호 작용하는 방법에 대한 자세한 내용을 보려면 다음 기사를 확인하십시오.

* [MySQL 튜토리얼로 가기 TBA]()
* [ORM 튜토리얼로 이동 TBA]()

> 소스 코드-이 기사의 전체 소스 코드는 다음에서 찾을 수 있습니다: 
>[TutorialEdge/create-rest-api-in-go-tutorial](https://github.com/TutorialEdge/create-rest-api-in-go-tutorial)

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  전제 조건
</h3>

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.

<h3 id="goals">
  <a href="#goals"></a>
  목표 
</h3>

이 포스팅의 내용을 마치게 되면 Go에서 모든 측면을 처리할 수 있는 고유한 RESTful API를 
작성하는 방법을 알게됩니다. 
프로젝트 내에서 `POST`, `GET`, `PUT` 및 `DELETE` HTTP 요청을 처리할 수 있는 
REST 엔드 포인트를 작성하는 방법을 알게됩니다.

<h3 id="videoTutorial">
  <a href="#videoTutorial"></a>
  비디오 튜토리얼 
</h3>

[![video tutorial](https://img.youtube.com/vi/W5b64DXeP0o/0.jpg)](https://youtu.be/W5b64DXeP0o)

<h3 id="rESTArchitectures">
  <a href="#rESTArchitectures"></a>
  REST 아키텍처 
</h3>

REST는 웹 사이트에서 엔터프라이즈 응용 프로그램에 이르기까지 오늘날 어디에서나 RESTful 아키텍처 스타일은 
별도의 소프트웨어 구성 요소간에 통신을 제공하는 강력한 방법입니다. 
REST API를 구축하면 소비자와 생산자를 쉽게 분리할 수 있으며 일반적으로 디자인에 의해 stateless입니다.

>**참고** - REST API의 기본 사항에 대해 자세히 알아 보려면 
>[RESTful API 란 무엇입니까?](https://tutorialedge.net/general/what-is-a-rest-api/)
>를 확인하십시오.

<h3 id="jSON">
  <a href="#jSON"></a>
  JSON 
</h3>

이 튜토리얼에서는 모든 정보를 주고받는 수단으로 JavaScript 객체 표기법을 사용하며 
고맙게도 Go는 표준 라이브러리 패키지인 `encoding/json`을 사용하여 이러한 형식의 
인코딩 및 디코딩에 대한 훌륭한 지원을 제공합니다.

> **참고** - encoding/json 패키지에 대한 자세한 내용은 공식 문서를 참조하십시오: 
>[encoding/json](https://golang.org/pkg/encoding/json/)

<h3 id="marshalling">
  <a href="#marshalling"></a>
  마샬링 
</h3>

우리가 쉽게하기 위해 불필요한 공백없이 매우 긴 문자열을 포함하는 바이트 슬라이스를 생성하는 
마샬링이라는 것을 사용하여 GO의 데이터 구조를 JSON으로 쉽게 변환할 수 있습니다.

<h3 id="gettingStarted">
  <a href="#gettingStarted"></a>
  기본 API 시작하기
</h3>

시작하려면 HTTP 요청을 처리할 수 있는 매우 간단한 서버를 만들어야 합니다. 
이를 위해 `main.go`라는 새 파일을 만듭니다. 
이 `main.go` 파일 내에서 3 가지 고유한 기능을 정의하려고 합니다. 
루트 URL에 대한 모든 요청을 처리하는 `homePage` 함수, 
정의된 함수로 타겟하는 URL 경로와 일치시키는 `handleRequests` 함수 및 
API를 시작하는 `mina` 함수로 구성되어 있습니다.

>**main.go**

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
)

func homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Welcome to the HomePage!")
    fmt.Println("Endpoint Hit: homePage")
}

func handleRequests() {
    http.HandleFunc("/", homePage)
    log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
    handleRequests()
}
```

지금 머신에서이를 실행하면 다른 프로세스에서 아직 가져오지 않은 매우 간단한 API가 
포트 10000에서 시작되는 것을 볼 수 있습니다. 
로컬 브라우저에서 `http://localhost:10000/ `로 이동하면 `Welcome to the HomePage!` 
가 인쇄되어 있는 화면을 띄워야 합니다. 
이는 REST API를 빌드할 기반을 성공적으로 생성했음을 의미합니다.

> **참고** - Go 기반 웹 서버를 만드는 방법에 대한 자세한 포스팅을 보려면 여기에서 확인하십시오: 
>[Go(Lang)을 사용하여 간단한 웹 서버 만들기 TBA]()

<h3 id="ourArticles">
  <a href="#ourArticles"></a>
  우리의 기사 구조 
</h3>

웹 사이트에서 기사를 `CREATE`, `READ`, `UPDATE` 및 `DELETE`할 수 있는 
REST API를 작성합니다. 
`CRUD` API에 대해 이야기할 때 Creating, Reading, Updating 및 Deleting과 같은 
모든 작업을 처리할 수 있는 API를 말합니다.

시작하기 전에 기사 구조를 정의해야합니다. 
Go에는 이 시나리오에 딱 맞는 구조체 개념이 있습니다. 
제목, 설명(desc) 및 내용을 특징으로 하는 `Article` 구조체를 만들어 보겠습니다.

```go 
type Article struct {
    Title string `json:"Title"`
    Desc string `json:"desc"`
    Content string `json:"content"`
}

// let's declare a global Articles array
// that we can then populate in our main function
// to simulate a database
var Articles []Article
```

Struct에는 사이트의 모든 기사를 나타내는 데 필요한 3가지 properties가 포함되어 있습니다. 
이 기능을 사용하려면 `"encoding/json"` 패키지를 import 목록으로 가져와야합니다.

이제 `main` 함수를 업데이트하여 `Articles` 변수에 나중에 검색하고 수정할 수 있는 
더미 데이터가 채워지도록 하겠습니다.

```go 
func main() {
    Articles = []Article{
        Article{Title: "Hello", Desc: "Article Description", Content: "Article Content"},
        Article{Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
    }
    handleRequests()
}
```

완벽합니다. 이제 `/articles` 엔드 포인트 만들기로 넘어가서 여기서 정의한 모든 기사를 반환합니다.

<h3 id="retrievingAll">
  <a href="#retrievingAll"></a>
  모든 기사 검색 
</h3>

포스팅의 이 부분에서는 `HTTP GET` 요청이 발생하면 사이트의 모든 기사를 리턴하는 
새 REST 엔드 포인트를 작성합니다.

먼저 `returnAllArticles`라는 새 함수를 만들어 시작합니다.
이 함수는 새로 채워진 `Article` 변수를 JSON 형식으로 인코딩하여 반환하는 간단한 작업을 수행합니다.

>**main.go**

```go 
func returnAllArticles(w http.ResponseWriter, r *http.Request){
    fmt.Println("Endpoint Hit: returnAllArticles")
    json.NewEncoder(w).Encode(Articles)
}
```

`json.NewEncoder(w).Encode(article)` 호출은 기사 배열을 JSON 문자열로 인코딩한 다음 
응답의 일부로 작성하는 작업을 수행합니다.

이것이 작동하기 전에, `http://localhost:10000/articles `에 대한 호출을 새로 정의된 함수에 
매핑하는 `handleRequests` 함수에 새로운 경로를 추가해야 합니다.

```go 
func handleRequests() {
    http.HandleFunc("/", homePage)
    // add our articles route and map it to our 
    // returnAllArticles function like so
    http.HandleFunc("/articles", returnAllArticles)
    log.Fatal(http.ListenAndServe(":10000", nil))
}
```

이제 이 작업을 수행한 후 `go run main.go`를 입력하여 코드를 실행한 다음 브라우저에서 
`http://localhost:10000/articles `를 열고 다음과 같이 기사 목록을 JSON으로 
표시해야 합니다.

>**http://localhost:10000/articles response**

```json
[
  {
    Title: "Hello",
    desc: "Article Description",
    content: "Article Content"
  },
  {
    Title: "Hello 2",
    desc: "Article Description",
    content: "Article Content"
  }
]
```

첫 번째 API 엔드 포인트를 성공적으로 정의했습니다.

이 시리즈의 다음 부분에서는 기존의 `net/http` 라우터 대신 `gorilla/mux` 라우터를 사용하도록 
REST API를 업데이트합니다.

라우터를 교환하면 나중에 필요한 `HTTP` 요청에 있을 수 있는 경로 또는 쿼리 매개 변수를 구문 분석하는 
등의 작업을보다 쉽게 수행할 수 있습니다.

<h3 id="gettingStartedrouter">
  <a href="#gettingStartedrouter"></a>
  라우터 시작하기 
</h3>

이제 표준 라이브러리는 간단한 REST API를 설치하고 실행하는데 필요한 모든 것을 제공하는데 적합하지만 
기본 개념을 갖추었으므로 이제 타사 라우터 패키지를 소개할 때가 되었습니다. 
가장 눈에 띄고 많이 사용되는 것은 `gorilla/mux router`인데, 
현재 Github에는 2,281개의 stars를 받았습니다.

<h3 id="buildingour">
  <a href="#buildingour"></a>
  라우터 구축 
</h3>

기존 `main.go` 파일을 업데이트하고 이전에 있던 표준 라이브러리 대신 
`gorilla/mux` 기반 `HTTP` router에서 스왑할 수 있습니다.

`handleRequests` 함수가 새 라우터를 작성하도록 수정하십시오.

>**main.go**

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    "github.com/gorilla/mux"
)

… // Existing code from above
func handleRequests() {
    // creates a new instance of a mux router
    myRouter := mux.NewRouter().StrictSlash(true)
    // replace http.HandleFunc with myRouter.HandleFunc
    myRouter.HandleFunc("/", homePage)
    myRouter.HandleFunc("/all", returnAllArticles)
    // finally, instead of passing in nil, we want
    // to pass in our newly created router as the second
    // argument
    log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
    fmt.Println("Rest API v2.0 - Mux Routers")
    Articles = []Article{
        Article{Title: "Hello", Desc: "Article Description", Content: "Article Content"},
        Article{Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
    }
    handleRequests()
}
```

이제 이것을 실행하면 시스템 작동 방식에 실질적인 변화가 없습니다. 
여전히 같은 포트에서 시작하고 어떤 엔드 포인트에 도달했는지에 따라 동일한 결과를 리턴합니다.

유일한 차이점은 이제 이 포스팅의 뒷부분에서 경로 및 쿼리 매개 변수 검색과 같은 작업을 
쉽게 수행할 수 있는 gorilla/mux router가 있다는 것입니다.

>**$ go run main.go**

```bash
Rest API v2.0 - Mux Routers
```

<h3 id="pathVariables">
  <a href="#pathVariables"></a>
  경로 변수 
</h3>

지금까지는 홈페이지와 모든 기사를 반환하는 매우 간단한 REST API를 만들었습니다. 
그러나 하나의 기사만 보려면 어떻게됩니까?

gorilla mux 라우터 덕분에 경로에 변수를 추가한 다음 이러한 변수를 기반으로 
어떤 기사를 반환할지 선택할 수 있습니다. 
`/articles` 경로 바로 아래 `handleRequests()` 함수 내에 새 경로를 만듭니다.

```go 
myRouter.HandleFunc("/article/{id}", returnSingleArticle)
```

경로에 `{id}`를 추가했습니다. 
이는 정확한 키를 제공하는 기사만 반환할 때 사용할 수 있는 id 변수를 나타냅니다. 
현재 `Article` 구조체에는 Id 속성이 없습니다. 지금 추가해 봅시다:

```go 
type Article struct {
    Id      string `json:"Id"`
    Title   string `json:"Title"`
    Desc    string `json:"desc"`
    Content string `json:"content"`
}
```

그런 다음 `main` 함수를 업데이트하여 기사 배열에서 `Id` 값을 채울 수 있습니다.

```go
func main() {
    Articles = []Article{
        Article{Id: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
        Article{Id: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
    }
    handleRequests()
}
```

이제 `returnSingleArticle` 함수에서 URL에서 이 `{id}  값을 얻을 수 있으며
이 기준과 일치하는 기사를 반환할 수 있습니다. 
데이터를 어디에도 저장하지 않았으므로 브라우저로 전달 된 ID만 반환합니다.

```go 
func returnSingleArticle(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    key := vars["id"]

    fmt.Fprintf(w, "Key: " + key)
}
```

이제 이것을 실행한 후 `http://localhost:1000/article/1 `
로 이동하면 브라우저 내에서 `Key: 1`이 인쇄됩니다.

이 `key` 값을 사용하여 해당 키와 일치하는 특정 기사를 반환합니다.

```go 
func returnSingleArticle(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    key := vars["id"]

    // Loop over all of our Articles
    // if the article.Id equals the key we pass in
    // return the article encoded as JSON
    for _, article := range Articles {
        if article.Id == key {
            json.NewEncoder(w).Encode(article)
        }
    }
}
```

`go run main.go`를 호출하여 
브라우저에서 `http://localhost:10000/article/1 `을 엽니다.

>**http://localhost:10000/article/1 response**

```json
{
Id: "1",
Title: "Hello",
desc: "Article Description",
content: "Article Content"
}
```

이제 키 `1`과 일치하는 기사가 JSON으로 반환된 것을 볼 수 있습니다.

<h3 id="creatingand">
  <a href="#creatingand"></a>
  기사 작성 및 업데이트 
</h3>

포스팅의 이 부분에서는 `CRUD` REST API의 `Create`, `Update` 및 `DELETE` 부분을 빌드합니다. 
우리는 이미 단일 기사와 모든 기사를 읽을 수 있는 함수로 `R`을 다루었습니다.

<h3 id="creatingnew">
  <a href="#creatingnew"></a>
  새로운 기사 만들기 
</h3>

다시 한 번,이 새 기사를 작성하는 작업을 수행할 새 함수를 작성해야합니다.

`main.go` 파일 내에 `createNewArticle()` 함수를 만들어 시작하겠습니다.

```go 
func createNewArticle(w http.ResponseWriter, r *http.Request) {
    // get the body of our POST request
    // return the string response containing the request body    
    reqBody, _ := ioutil.ReadAll(r.Body)
    fmt.Fprintf(w, "%+v", string(reqBody))
}
```

이 함수를 정의하면 `handleRequests` 함수 내에 정의된 경로 목록에 경로를 추가할 수 있습니다. 
그러나 이번에는 라우트 끝에 `.Methods("POST")`를 추가하여 
들어오는 요청이 `HTTP POST` 요청인 경우에만 이 함수를 호출하도록 지정합니다.

```go 
func handleRequests() {
    myRouter := mux.NewRouter().StrictSlash(true)
    myRouter.HandleFunc("/", homePage)
    myRouter.HandleFunc("/articles", returnAllArticles)
    // NOTE: Ordering is important here! This has to be defined before
    // the other `/article` endpoint. 
    myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
    myRouter.HandleFunc("/article/{id}", returnSingleArticle)
    log.Fatal(http.ListenAndServe(":10000", myRouter))
}
```

다시 실행한 후 다음 `POST` body가 포함된 `HTTP POST` 요청을 제출하십시오.

```json
{
    "Id": "3", 
    "Title": "Newly Created Post", 
    "desc": "The description for my new post", 
    "content": "my articles content" 
}
```

엔드 포인트는 request body에 있던 모든 값을 트리거하고 에코합니다.

새 엔드 포인트가 올바르게 작동하는지 확인했으므로 request body의 
JSON을 새 `Article` 구조체로 마샬링하여 나중에 `Article` 배열에 추가할 수 있도록 
`createNewArticle` 함수를 업데이트 하겠습니다.

```go
func createNewArticle(w http.ResponseWriter, r *http.Request) {
    // get the body of our POST request
    // unmarshal this into a new Article struct
    // append this to our Articles array.    
    reqBody, _ := ioutil.ReadAll(r.Body)
    var article Article 
    json.Unmarshal(reqBody, &article)
    // update our global Articles array to include
    // our new Article
    Articles = append(Articles, article)

    json.NewEncoder(w).Encode(article)
}
```

좋습니다! 지금 실행하여 동일한 `POST` 요청을 애플리케이션에 전송하면 이전과 동일한 
JSON 형식을 다시 에코하지만 `Article` 배열에 새 기사가 추가됩니다.

`http://localhost:10000/articles`를 눌러 지금 확인하십시오.

>**http://localhost:10000/articles response**

```json
[
    {
        "Id": "1",
        "Title": "Hello",
        "desc": "Article Description",
        "content": "Article Content"
    },
    {
        "Id": "2",
        "Title": "Hello 2",
        "desc": "Article Description",
        "content": "Article Content"
    },
    {
        "Id": "3",
        "Title": "Newly Created Post",
        "desc": "The description for my new post",
        "content": "my articles content"
    }
]
```

이제 새 REST API에 `Create` 함수를 성공적으로 추가했습니다!

이 포스트의 다음 섹션에서는 기사를 삭제할 수있는 
새 API 엔드 포인트를 추가하는 방법을 살펴 보겠습니다.

<h3 id="deletingArticles">
  <a href="#deletingArticles"></a>
  기사 삭제 
</h3>

REST API에 의해 노출되는 데이터를 삭제해야 할 경우가 있습니다. 
이를 위해서는 API 내에서 식별자를 가져와 해당 식별자와 관련된 항목을 
삭제하는 `DELETE` 엔드 포인트를 노출해야합니다.

이 포스팅의 이 섹션에서는 `HTTP DELETE` 요청을 수신하고 지정된 `Id` 경로 매개 변수와 일치하는 
기사를 삭제하는 다른 엔드 포인트를 작성하려고합니다.

`main.go` 파일에 `deleteArticle`이라는 새 함수를 추가하십시오.

```go 
func deleteArticle(w http.ResponseWriter, r *http.Request) {
    // once again, we will need to parse the path parameters
    vars := mux.Vars(r)
    // we will need to extract the `id` of the article we
    // wish to delete
    id := vars["id"]

    // we then need to loop through all our articles
    for index, article := range Articles {
        // if our id path parameter matches one of our
        // articles
        if article.Id == id {
            // updates our Articles array to remove the 
            // article
            Articles = append(Articles[:index], Articles[index+1:]...)
        }
    }

}
```

다시 한 번, 이 새로운 `deleteArticle` 함수에 
매핑되는 `handleRequests` 함수에 경로를 추가해야합니다.

```go 
func handleRequests() {
    myRouter := mux.NewRouter().StrictSlash(true)
    myRouter.HandleFunc("/", homePage)
    myRouter.HandleFunc("/articles", returnAllArticles)
    myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
    // add our new DELETE endpoint here
    myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
    myRouter.HandleFunc("/article/{id}", returnSingleArticle)
    log.Fatal(http.ListenAndServe(":10000", myRouter))
}
```

`http://localhost:10000/article/2 `에 새로운 `HTTP DELETE` 요청을 보내보십시오. 
그러면 `Article` 배열 내에서 두 번째 기사가 삭제되고 `HTTP GET` 요청으로 
`http://localhost:10000/articles `를 누르면 이제 단일 `Article`만 포함됩니다.

>**참고** - 이 단순성을 유지하기 위해 전역 변수를 업데이트하고 있습니다. 
>그러나 코드에 경쟁 조건이 없는지 확인하지 않습니다. 
>이 코드를 스레드로부터 안전하게 만들려면 
>[Go Mutexes TBA]()에 
>대한 다른 포스팅을 확인하는 것이 좋습니다.

<h3 id="updatingArticles">
  <a href="#updatingArticles"></a>
  기사 엔드 포인트 업데이트 
</h3>

구현해야하는 최종 엔드 포인트는 업데이트 엔드 포인트입니다. 
이 엔드 포인트는 `HTTP PUT` 기반 엔드 포인트가되며, 
JSON request body뿐만 아니라 `HTTP DELETE` 엔드 포인트에 대해 수행한 것과 
동일한 방식으로 `Id` 경로 매개 변수를 가져와야합니다.

수신 `HTTP PUT` request body에있는 이 JSON에는 업데이트하려는 
기사의 최신 버전이 포함됩니다.

<h3 id="challenge">
  <a href="#challenge"></a>
  Challenge
</h3>

`handleRequests` 함수에서 `updateArticle` 함수와 해당 라우트를 작성하십시오. 
이것은 `PUT` 요청과 일치합니다. 
이 작업이 완료되면 `createNewArticle` 함수에서 사용한 것과 동일한 코드를 사용하여 
`HTTP` request body를 파싱하도록 `updateArticle` 함수를 구현하십시오.

마지막으로 `Article` 배열에서 기사를 반복하고 기사를 일치시키고 업데이트해야합니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론 
</h3>

이 예제는 Go를 사용하여 작성된 매우 간단한 RESTful API를 나타냅니다. 
실제 프로젝트에서는 일반적으로 실제 값을 반환할 수 있도록 데이터베이스와 연결합니다.

>**소스 코드** - 이 포스트의 전체 소스 코드는 여기에서 확인할 수 있습니다: 
>[TutorialEdge/create-rest-api-in-go](https://github.com/TutorialEdge/create-rest-api-in-go-tutorial)

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  더 읽을거리
</h3>

이 포스트가 마음에 들었다면 다음 포스팅도 참고해보면 좋습니다.

* [Designing a Production-Ready REST API TBA]()
* [Go MySQL Tutorial TBA]()
