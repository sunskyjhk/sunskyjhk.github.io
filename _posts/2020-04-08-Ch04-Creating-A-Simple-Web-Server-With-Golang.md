---
layout: post
title: "Golang을 사용하여 간단한 웹 서버 만들기"
author: Sun
date: 2020-04-08 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 `net/http` 패키지를 사용하여 매우 
간단한 웹 서버를 만드는데 중점을 둘 것입니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">전제 조건</a>
      </li>
      <li>
        <a href="#creatingaBasic">기본 웹 서버 만들기</a>
      </li>
      <li>
        <a href="#runningOur">서버 실행</a>
      </li>
      <li>
        <a href="#addinga">약간의 복잡성 추가</a>
      </li>
      <li>
        <a href="#servingStatic">정적 파일 제공</a>
      </li>
      <li>
        <a href="#checkingit">작동 확인</a>
      </li>
      <li>
        <a href="#servingContent">디렉토리에서 컨텐츠 제공</a>
      </li>
      <li>
        <a href="#checkingitWorks">작동 확인</a>
      </li>
      <li>
        <a href="#servingContent2">HTTPS를 통한 콘텐츠 제공</a>
      </li>
      <li>
        <a href="#generatingKeys">키 생성</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
      <li>
        <a href="#recommendedReading">추천 자료</a>
      </li>
    </ul>
  </nav>
</div>

웹 서버는 새로운 언어를 배우려고 할 때 항상 시작되고 실행되는 정말 시원하고 비교적 간단한 
프로젝트입니다. 
Go에서 이것은 다르지 않으며 `net/http` 패키지를 사용하여 웹 서버를 구축하는 것이 일부 
기본 사항을 파악하는 훌륭한 방법입니다.

이 포스트에서는 `net/http` 패키지를 사용하여 매우 간단한 웹 서버를 만드는데 중점을 둘 것입니다. 
Node의 ExpressJS 또는 Python의 Tornado와 같은 것을 사용해본적이 있다면, 
처리 방법과 유사점이 상당히 있다는 것을 발견할 수 있을 것입니다.

먼저 서버에 요청하는 클라이언트에게 정말 간단한 콘텐츠를 제공할 수 있는 간단한 서버를 만드는데 
중점을 둘 것입니다. 
이 작업을 마치면 정적 파일을 제공하는 방법을 살펴보고 마지막으로 TLS 또는 `https`를 통한 
HTTP를 사용하여 이러한 파일을 제공하는 방법을 간략하게 살펴 보겠습니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  전제 조건
</h3>

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.

<h3 id="creatingaBasic">
  <a href="#creatingaBasic"></a>
  기본 웹 서버 만들기  
</h3>

자, 먼저, URL 경로가 무엇이든 반환하는 매우 간단한 웹 서버를 만들 것입니다. 
이것은 우리가 쌓을 수 있는 좋은 기반이 될 것입니다.

```go 
package main

import (
    "fmt"
    "html"
    "log"
    "net/http"
)

func main() {

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
    })

    http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request){
        fmt.Fprintf(w, "Hi")
    })

    log.Fatal(http.ListenAndServe(":8081", nil))

}
```

위의 코드에서 본질적으로 두 개의 다른 핸들러를 정의합니다. 
이 핸들러는 첫 번째 매개 변수로 정의한 문자열 패턴과 일치하는 모든 `HTTP` 요청에 응답합니다. 
따라서 본질적으로 홈페이지 또는 `http://localhost:8081/ `에 대한 요청이 있을때마다 
쿼리가 해당 패턴과 일치할 때 첫 번째 핸들러가 응답하는 것을 보게됩니다.

<h3 id="runningOur">
  <a href="#runningOur"></a>
  서버 실행  
</h3>

이제 매우 간단한 서버를 만들었으므로 go run server.go를 콘솔에 
입력하여 서버를 실행할 수 있습니다. 
이 작업이 완료되면 브라우저로 이동하여 `http://localhost:8081/world `로 이동하십시오. 
이 페이지에서 쿼리 문자열이 진정한 "hello world"방식으로 되돌아 오는 것을 보게 될 것입니다.

<h3 id="addinga">
  <a href="#addinga"></a>
  약간의 복잡성 추가  
</h3>

이제 기본 웹 서버가 설정되었으므로 특정 URL에 도달할 때마다 카운터를 늘리십시오. 
웹 서버가 비동기적이라는 사실 때문에 경쟁 조건 버그에 걸리지 않도록 
`mutex`를 사용하여 카운터를 보호해야합니다.

>**참고** - 뮤텍스가 무엇인지 확실하지 않은 경우 걱정하지 마십시오. 
>이러한 서버는 경쟁 조건으로부터 보호되지 않는다는 것을 강조하기 위해 사용됩니다. 
>mutex에 대해 더 알고 싶다면 여기에서 다른 튜토리얼을 확인하십시오: 
>[Go Mutex Tutorial TBA]()

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
    "strconv"
    "sync"
)

var counter int
var mutex = &sync.Mutex{}

func echoString(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "hello")
}

func incrementCounter(w http.ResponseWriter, r *http.Request) {
    mutex.Lock()
    counter++
    fmt.Fprintf(w, strconv.Itoa(counter))
    mutex.Unlock()
}

func main() {
    http.HandleFunc("/", echoString)

    http.HandleFunc("/increment", incrementCounter)

    http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hi")
    })

    log.Fatal(http.ListenAndServe(":8081", nil))

}
```

이것을 실행 한 다음 `http://localhost:8081/increment `로 이동하면 해당 페이지를 
요청할 때마다 현재 카운트가 잠기고, 증가한 후 잠금 해제 될 것입니다.

<h3 id="servingStatic">
  <a href="#servingStatic"></a>
  정적 파일 제공  
</h3>

Go 기반 웹 서버의 비동기 특성을 살펴 보았으므로 이제 정적 파일 제공으로 넘어갈 수 있습니다.

먼저 프로젝트 디렉토리 내에 정적 폴더를 만든 다음 간단한 HTML 파일을 만듭니다. 
이 예에서는 다음을 다시 제공합니다.

```html
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h2>Hello World!</h2>
  </body>
</html>
```

이것을 얻은 후에는 http.ServeFile 메소드를 사용하도록 웹 서버 코드를 수정할 수 있습니다. 
본질적으로 이것은 서버에 대한 요청의 URL을 취하고 index.html 이라고하면 브라우저에서 
HTML로 렌더링된 index.html 파일을 반환합니다.

edit.html 페이지를 작성하고 `http://localhost:8081/edit.html `에 요청을 보내면 
해당 edit.html 페이지에 넣기로 선택한 HTML 컨텐츠가 리턴됩니다.

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, r.URL.Path[1:])
    })

    http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hi")
    })

    log.Fatal(http.ListenAndServe(":8081", nil))

}
```

<h3 id="checkingit">
  <a href="#checkingit"></a>
  작동 확인  
</h3>

다시 서버를 실행하고 `http://localhost:8081/index.html `로 이동하면 
매우 간단한 index.html 파일이 표시됩니다.

<h3 id="servingContent">
  <a href="#servingContent"></a>
  디렉토리에서 컨텐츠 제공  
</h3>

위의 방법은 경로를 기반으로 파일을 제공하는데 효과적이지만, 
이렇게하면 디렉토리 구조가 다음과 같이됩니다.

```bash
- main.go # our webserver
- index.html
- styles/
- - style.css
- images/
- - image1.png
- ...
```

이것은 나쁘지는 않지만 Go 웹 서버가 복잡해지면 웹 사이트 콘텐츠를 자체 디렉토리로 옮길 수 있습니다. 
프로젝트 내에서 `static/ `이라는 디렉토리를 만들어 모든 웹 사이트의 정적 파일을 포함합니다.

```bash
# Our Updated project structure
- main.go
- static/
- - index.html
- - styles/
- - - style.css
- - images/
- - - image1.png
- ...
```

이렇게하려면 기존 웹 서버 코드를 다음과 같이 수정해야합니다.

```go 
package main

import (
    "log"
    "net/http"
)

func main() {

    http.Handle("/", http.FileServer(http.Dir("./static")))

    log.Fatal(http.ListenAndServe(":8081", nil))
}
```

보시다시피, 우리는 `HandleFunc` 메소드를 사용하지 않고 
경로를 전달하는 `http.Handle()`과 새로 작성된 `static/ ` 디렉토리를 가리키는 
`http.Dir()`을 사용하기 시작했습니다.

<h3 id="checkingitWorks">
  <a href="#checkingitWorks"></a>
  작동 확인  
</h3>

이제 코드를 업데이트 했으므로 `go run main.go`를 사용하여 코드를 다시 실행해 보겠습니다. 
그러면 `http://localhost:8081`에서 웹 서버가 다시 시작되고 해당 URL로 이동하면 
새로 생성된 `static` 디렉토리에 `index.html`이 표시됩니다.

<h3 id="servingContent2">
  <a href="#servingContent2"></a>
  HTTPS를 통한 콘텐츠 제공  
</h3>

완벽하므로 원하는 정적 파일을 제공할 수 있는 매우 간단한 웹 서버를 만들 수 있었지만 
아직 보안에 대해서는 생각하지 않았습니다. 
웹 서버를 보호하고 `HTTPS`를 사용하여 컨텐츠를 제공하는 방법은 무엇입니까?

Go를 사용하면 다음과 같이 `http.ListenAndServeTLS`를 사용하도록 
기존 웹 서버를 수정할 수 있습니다.

```go 
package main

import (
    "log"
    "net/http"
)

func main() {

    http.Handle("/", http.FileServer(http.Dir("./static")))

    log.Fatal(http.ListenAndServeTLS(":443", "server.crt", "server.key", nil))
}
```

>**주의** – 이 예에서는 이미 생성 된 `server.crt` 및 `server.key` 인증서 파일을 전달합니다.

<h3 id="generatingKeys">
  <a href="#generatingKeys"></a>
  키 생성  
</h3>

키가 아직 생성되지 않은 경우 `openssl`을 사용하여 자체 서명된 인증서를 로컬로 생성할 수 있습니다.

```bash
$ openssl genrsa -out server.key 2048
$ openssl ecparam -genkey -name secp384r1 -out server.key
$ openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650
```

로컬에서 자체 서명 된 인증서를 생성 한 다음 `go run main.go`를 입력하여 
`https` 웹 서버를 시작할 수 있습니다. 
`https://localhost:8081`로 이동하면 이제 자체 서명된 인증서를 기반으로 
연결이 보안되는 것을 볼 수 있습니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론 
</h3>

이 API는 우리가 API를 가지고 놀면서 서버를 만드는 일련의 GoLang 튜토리얼 중 하나입니다.

<h3 id="recommendedReading">
  <a href="#recommendedReading"></a>
  추천 자료  
</h3>

* [JWT를 사용하여 REST API 인증 TBA]()
* [MySQL 튜토리얼로 가기 TBA]()