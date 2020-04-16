---
layout: post
title: "Go Decorator 함수 패턴"
author: Sun
date: 2020-04-16 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "데코레이터는 Python 및 TypeScript와 같은 다른 프로그래밍 언어에서 확실히 두드러 지지만 Go에서 사용할 수는 없습니다. 
실제로 특정 문제의 경우 데코레이터를 사용하는 것이 이 포스팅에서 알아볼 수 있는 완벽한 솔루션입니다."
---
데코레이터는 Python 및 TypeScript와 같은 다른 프로그래밍 언어에서 확실히 두드러 지지만 Go에서 사용할 수는 없습니다. 
실제로 특정 문제의 경우 데코레이터를 사용하는 것이 이 포스팅에서 알아볼 수 있는 완벽한 솔루션입니다.

## Understanding the Decorator Pattern

> **Decorators**를 사용하면 기존 기능을 래핑하고 사용자 정의 기능을 추가하거나 확장 할 수 있습니다.

Go에서 함수는 일급 객체로 간주되며 본질적으로 변수와 마찬가지로 전달할 수 있습니다. 
매우 간단한 예를 통해 이를 실제로 살펴 보겠습니다.

```go 
package main

import (
  "fmt"
  "time"
)

func myFunc() {
  fmt.Println("Hello World")
  time.Sleep(1 * time.Second)
}

func main() {
  fmt.Printf("Type: %T\n", myFunc)
}
```

따라서이 예에서는 `myFunc`라는 함수를 정의했습니다.
이 함수는 단순히 `Hello World`를 인쇄합니다. 
그러나 `main()` 함수의 본문에서 `fmt.Printf`를 호출했으며 `%T`를 사용하여 
두 번째 인수로 전달하는 값의 유형을 인쇄했습니다. 
이 경우 `myFunc`를 전달하면 다음과 같이 인쇄됩니다.

```bash
$ go run test.go
Type: func()
```

그렇다면 이것이 Go 개발자에게 무엇을 의미합니까? 
글쎄, 그것은 코드베이스의 다른 부분에서 함수가 전달되어 인수로 사용될 수 있다는 사실을 강조합니다.

코드베이스를 조금 더 확장하고 함수를 유일한 매개 변수로 사용하는 `coolFunc()` 함수를 추가하여 이를 실제로 살펴 보겠습니다.

```go 
package main

import (
  "fmt"
  "time"
)

func myFunc() {
  fmt.Println("Hello World")
  time.Sleep(1 * time.Second)
}

// coolFunc takes in a function
// as a parameter
func coolFunc(a func()) {
    // it then immediately calls that functino
  a()
}

func main() {
  fmt.Printf("Type: %T\n", myFunc)
  // here we call our coolFunc function
  // passing in myFunc
    coolFunc(myFunc)
}
```

이 작업을 실행하려고하면 새로운 출력에 다음과 같이 `Hello World` 문자열이 표시됩니다:

```bash
$ go run test.go
Type: func()
Hello World
```

이제 이것은 처음에는 조금 이상하게 보일 수 있습니다. 
왜 이런 식으로 하시겠습니까? 
기본적으로 `myFunc` 호출에 추상화 계층을 추가하고 많은 value를 추가하지 않고도 코드를 복잡하게 만듭니다.

## A Simple Decorator

이 패턴을 사용하여 코드베이스에 value를 더할 수 있는 방법을 살펴 보겠습니다. 
원하는 경우 시작 및 종료 시간을 강조하기 위해 특정 기능의 실행에 대한 추가 로깅을 추가 할 수 있습니다.

```go 
package main

import (
    "fmt"
    "time"
)

func myFunc() {
  fmt.Println("Hello World")
    time.Sleep(1 * time.Second)
}

func coolFunc(a func()) {
    fmt.Printf("Starting function execution: %s\n", time.Now())
    a()
    fmt.Printf("End of function execution: %s\n", time.Now())
}

func main() {
    fmt.Printf("Type: %T\n", myFunc)
    coolFunc(myFunc)
}
```

이것을 호출하면 다음과 같은 로그가 나타납니다.

```bash
$ go run test.go
Type: func()
Starting function execution: 2018-10-21 11:11:25.011873 +0100 BST m=+0.000443306
Hello World
End of function execution: 2018-10-21 11:11:26.015176 +0100 BST m=+1.003743698
```

보시다시피 구현을 변경하지 않고도 원래 기능을 효과적으로 포장할 수 있었습니다. 
이제 이 함수가 시작된 시점과 실행이 완료된 시점을 명확하게 확인할 수 있으며 
함수가 실행을 마치는데 약 1초가 걸린다는 점을 강조합니다.

## Real World Examples

더 많은 명성과 재산을 위해 데코레이터를 사용하는 방법에 대한 몇 가지 예를 더 살펴 보겠습니다. 
수신 요청에 특정 헤더 세트가 있는지 여부를 확인할 수 있도록 매우 간단한 `http` 웹 서버를 사용하여 엔드 포인트를 decorating합니다.

> Go에서 간단한 REST API 작성에 대해 더 많이 배우고 싶다면 다른 기사를 확인하십시오 .[Go에서 REST API 작성](../Ch03-Creating-RESTful-API)

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Endpoint Hit: homePage")
    fmt.Fprintf(w, "Welcome to the HomePage!")
}

func handleRequests() {
    http.HandleFunc("/", homePage)
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
    handleRequests()
}
```

보시다시피, 코드에서 특별히 복잡한 것은 없습니다. single/end 포인트를 제공하는 `net/http` 라우터를 설정했습니다.

들어오는 요청에서 `Authorized` 헤더가 `true`로 설정되어 있는지 확인하는 매우 간단한 
인증 데코레이터 기능을 추가해 보겠습니다.

```go 
package main

import (
    "fmt"
    "log"
    "net/http"
)

func isAuthorized(endpoint func(http.ResponseWriter, *http.Request)) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

        fmt.Println("Checking to see if Authorized header set...")

        if val, ok := r.Header["Authorized"]; ok {
            fmt.Println(val)
            if val[0] == "true" {
                fmt.Println("Header is set! We can serve content!")
                endpoint(w, r)
            }
        } else {
            fmt.Println("Not Authorized!!")
            fmt.Fprintf(w, "Not Authorized!!")
        }
    })
}

func homePage(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Endpoint Hit: homePage")
    fmt.Fprintf(w, "Welcome to the HomePage!")
}

func handleRequests() {

    http.Handle("/", isAuthorized(homePage))
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func main() {
    handleRequests()
}
```

> **참고** : 이것이 REST API 보안을 처리하는 올바른 방법은 아닙니다. 
>이러한 목표를 달성하기 위해 JWT 또는 OAuth2를 사용하는 것이 좋습니다.

자, 이것을 분석하고 무슨 일이 일어나고 있는지 이해하려고 노력합시다!

우리는 `isAuthorized()`라는 새로운 데코레이터 함수를 만들었습니다.
이 함수는 원래 `homePage` 함수와 동일한 서명과 일치하는 함수를 받습니다. 
그런 다음 `http.Handler`를 반환합니다.

`isAuthorized()` 함수의 본문 내에서 `Authorized` 헤더의 유효성 검사 작업이 설정되어 있고 
`true`인 새 `http.HandlerFunc`를 반환합니다. 
자, 이것은 `OAuth2` authentification/authorization의 대폭 단순화된 버전입니다. 
약간의 차이가 있지만 작동 방식에 대한 일반적인 아이디어를 제공합니다.

그러나 주목해야 할 것은 기존 엔드 포인트를 decorate하고 해당 기능의 기존 구현을 변경하지 않고도 
해당 엔드 포인트 주위에 인증 형식을 추가할 수 있다는 사실입니다.

이제 보호하고자 하는 새로운 엔드 포인트를 추가한다면 다음과 같이 쉽게 할 수 있습니다.

```go 
// define our newEndpoint function. Notice how, yet again,
// we don't do any authentication based stuff in the body
// of this function
func newEndpoint(w http.ResponseWriter, r *http.Request) {
    fmt.Println("My New Endpoint")
    fmt.Fprintf(w, "My second endpoint")
}

func handleRequests() {

    http.Handle("/", isAuthorized(homePage))
  // register our /new endpoint and decorate our
  // function with our isAuthorized Decorator
  http.Handle("/new", isAuthorized(newEndpoint))
    log.Fatal(http.ListenAndServe(":8081", nil))
}
```

이것은 코드베이스 내에서 코드를 래핑하는 것이 매우 간단한 데코레이터 패턴의 주요 이점을 강조합니다. 
동일한 방법으로 새로운 인증된 엔드 포인트를 쉽게 추가할 수 있습니다.

## Conclusion

이 포스팅이 데코레이터의 불가사의를 이해하고 자신의 Go 기반 프로그램에서 
데코레이터 패턴을 사용하는 방법을 이해하는데 도움이 되었기를 바랍니다. 
데코레이터 패턴의 이점과 기존 기능을 새로운 기능으로 감싸는데 사용할 수있는 방법에 대해 배웠습니다.

두 번째 부분은 자체 프로덕션 레벨 Go 시스템에서 이를 어떻게 사용할 수 있는지에 대한 보다 현실적인 예를 살펴 보았습니다.

