---
layout: post
title: "Go 함수 (Go Functions)"
author: Sun
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
---
<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#functionDeclaration">함수 선언</a>
      </li>
      <li>
        <a href="#aSimpleExample">간단한 예제</a>
      </li>
      <li>
        <a href="#fullSourceCode">Full Source Code</a>
      </li>
      <li>
        <a href="#multipleResultsFromaFunction">Multiple Results From a Function</a>
      </li>
      <li>
        <a href="#anonymousFunctions">Anonymous Functions</a>
      </li>
      <li>
        <a href="#tryItYourselfChallenges">스스로 도전해보기!</a>
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

**이번 포스팅에서는 Golang의 함수를 살펴보고자 합니다.**
이 포스팅을 다 읽을 무렵, 함수가 무엇인지, 자신의 프로젝트에서 어떻게 사용할 수 있는지에 대해 확실히 이해하게 되길 바랍니다.

이 포스팅에서는 다음 주제를 다룰 것입니다:

* 함수 선언의 기초
* 여러 값을 반환하도록 작동시키는 법

이 포스팅의 끝에, 우리가 다루고있는 것을 검증하고 Go에서 
본인 스스로 함수를 작성하는 재미를 붙일 수 있도록 자신의 컴퓨터에서 수행할 수 있는 과제가 있습니다.

> **소스 코드**-전체 소스 코드는 이 저장소에서 찾을 수 있습니다: 
>[TutorialEdge/Go-Functions-Tutorial](https://github.com/TutorialEdge/go-functions-tutorial)

<h3 id="functionDeclaration">
  <a href="#functionDeclaration"></a>
  함수 선언
</h3>

가장 먼저 알아야 할 것은 go 프로그램 내에서 "함수를 어떻게 선언하는가"입니다. 숙련된 프로그래머라면 전혀 새로운 것이 아닐테고 
본인이 숙련된 프로그래머가 아니더라도 당황하지 않아도 됩니다. 이 포스팅에서 알아야 할 모든 것을 다룰 것입니다.

Go의 모든 기능은 `func` 키워드로 시작하고 그 뒤에 함수의 이름이 옵니다. 이름 뒤에 대괄호를 열고 
`parameter-list`와 이와 매우 유사한 스타일로 `result-list`를 정의합니다:

```go
func name(parameter-list) (result-list) {
  // the body of our function
}
```

`parameter-list`와 `result-list`는 원하는 길이만큼 길게 만들 수 있지만 
일반적으로 코드 가독성과 같은 사항을 개선하려면 가능한 작게 유지하는 것이 좋습니다.

> **대문자 법칙!** 다른 패키지에서 이 함수에 액세스하려면 함수 이름의 첫 글자를 대문자로 만들어야 합니다!

<h3 id="aSimpleExample">
  <a href="#aSimpleExample"></a>
  간단한 예제
</h3>

기본 이론을 다루었으므로 이제 간단한 함수를 정의하여 실제로 살펴 보겠습니다.

이 예제에서는 `myFunction`이라는 함수를 작성하여 2개의 string 매개 변수를 사용하고 결과 string 출력을 리턴할 것입니다.

```go
func myfunction(firstName string, lastName string) (string) {
  fullname := firstName + " " + lastName 
  return fullname
}
```

함수 본문의 첫 번째 행에서 `firstName` 변수에 공백 `" "`과 `lastName` 변수를 이어붙인 `fullname`이라는 새 변수를 만들었습니다.

이 연결을 마치면 `fullname` 변수를 반환합니다.

<h3 id="fullSourceCode">
  <a href="#fullSourceCode"></a>
  Full Source Code
</h3>

그러면 전체 프로그램 코드의 모양새는 다음과 같습니다.

>**main.go**

```go
package main

import (
    "fmt"
)

func myfunction(firstName string, lastName string) (string) {
  fullname := firstName + " " + lastName 
  return fullname
}

func main() {
    fmt.Println("Hello World")

    fullName := myfunction("Elliot", "Forbes")
    fmt.Println(fullName)
}
```

<h3 id="multipleResultsFromaFunction">
  <a href="#multipleResultsFromaFunction"></a>
  Multiple Results From a Function
</h3>

Go 프로그램에서는 함수 호출에서 두 가지 결과가 반환되는 경우가 종종 있습니다. 
이것은 일반적으로 첫 번째 결과의 결과이며 두 번째 결과의 모든 잠재적 오류입니다.

이 방법은 매우 유용할 수 있으며 go 프로그래머가 함수를 호출하는 
원래 함수 블록 내에서 오류를 반환하여 수행할 작업을 결정할 수 있습니다:

>**main.go**

```go
package main

import (
    "fmt"
)

func myfunction(firstName string, lastName string) (string, error) {
  return firstName + " " + lastName, nil
}

func main() {
  fmt.Println("Hello World")

  // we can assign the results to multiple variables
  // by defining their names in a comma separated list
  // like so: 
  fullName, err := myfunction("Elliot", "Forbes")
  if err != nil {
    fmt.Println("Handle Error Case")
  }
  fmt.Println(fullName)
}
```

> **직접 해보기**-`go run main.go`를 호출하여 자신의 컴퓨터에서 이 프로그램을 실행하고 결과를 확인해보세요.

<h3 id="anonymousFunctions">
  <a href="#anonymousFunctions"></a>
  Anonymous Functions
</h3>

익명 함수는 함수 선언에 이름이 없다는 점을 제외하면 일반 함수와 매우 유사합니다. 
이러한 함수는 명명된 함수 내에서 정의할 수 있으며 다음과 같이 그 익명함수를 감싸고 있는 함수 내의 모든 변수에 액세스 할 수 있습니다:

> **main.go**

```go
package main

import (
  "fmt"
)

func addOne() func() int {
  var x int
  // we define and return an
  // anonymous function which in turn
  // returns an integer value
  return func() int {
    // this anonymous function
    // has access to the x variable
    // defined in the parent function
    x++
    return x + 1
  }
}

func main() {
  myFunc := addOne()
  fmt.Println(myFunc()) // 2
  fmt.Println(myFunc()) // 3
  fmt.Println(myFunc()) // 4
  fmt.Println(myFunc()) // 5
}
```

<h3 id="tryItYourselfChallenges">
  <a href="#tryItYourselfChallenges"></a>
  스스로 도전해보기!
</h3>

새로운 개념을 배우는 가장 좋은 방법 중 하나는 직접 시도해 보는 것입니다. 
학습을 돕기 위해 Github 리포지토리 내에 이 프로젝트에 대한 테스트가 실패한 지점을 만들었습니다.

이 테스트는 단순히 정의한 함수가 올바른 결과를 생성하고 프로젝트 디렉토리의 루트 내에서 
`go test ./...`를 호출하여 실행할 수 있는지 확인합니다.

다음 명령을 사용하여 Github 저장소를 로컬로 컴퓨터로 끌어 당기고 Challenge-01 분기로 변경하세요.

```bash
$ git clone https://github.com/TutorialEdge/go-functions-tutorial.git
$ git checkout challenge-01
```

> **Challenge-01**-자신 만의 Add 함 정의하기

이 문제의 목표는 `parameter-list`에서 2개의 `int` 매개 변수를 가져오고 두 값의 합과 동일한 
단일 int 값을 리턴하는 main.go 파일 내에 Add 함수를 정의하는 것입니다.

Add 함수를 성공적으로 구현했으면 테스트를 실행하여 수행한 작업이 올바른지 확인하십시오. 
성공적으로 완료되면 모든 테스트가 통과하고 다음과 같은 출력이 표시됩니다.

```go
$ go test ./...
ok      github.com/tutorialedge/go-functions-tutorial   0.005s
```

> **완전한 챌린지 코드**-이 코드의 완전한 버전은 여기에서 찾을 수 있습니다: 
>[Challenge 01-Complete](https://github.com/TutorialEdge/go-functions-tutorial/tree/challenge-01-complete)

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅에서는 go 프로그래밍 언어의 함수에 대해 꽤 많은 내용을 다루었습니다. 
이것이 여러분에게 유용한 자료였길 바랄게요. 
추가 코멘트이나 도움이 필요하면 아래 댓글에서 언제든지 알려주세요!

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  더 읽을거리
</h3>

* <a href="../Ch02-Go-Variadic-Function-Tutorial/">Go Variadic Function Tutorial</a> 