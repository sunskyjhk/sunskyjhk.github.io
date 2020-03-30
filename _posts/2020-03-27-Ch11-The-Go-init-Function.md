---
layout: post
title: "Go init 함수"
author: Sun
date: 2020-03-27 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "Go에서 응용 프로그램을 만들 때 프로그램을 처음 시작할 때 어떤 형태의 상태를 설정할 수 있어야하는 경우가 있습니다. 
여기에는 데이터베이스에 대한 연결을 만들거나 로컬로 저장된 configuration 파일에서 configuration을 로드하는 것이 포함될 수 있습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="theinitFunction">init 함수란?</a>
      </li>
      <li>
        <a href="multiplePackages">다중 패키지</a>
      </li>
      <li>
        <a href="#orderOfInitialization">초기화 순서</a>
      </li>
      <li>
        <a href="#multipleInitFunctions">같은 파일 안에서의 다중 Init 함수</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

Go에서 응용 프로그램을 만들 때 프로그램을 처음 시작할 때 어떤 형태의 상태를 설정할 수 있어야하는 경우가 있습니다. 
여기에는 데이터베이스에 대한 연결을 만들거나 로컬로 저장된 
configuration 파일에서 configuration을 로드하는 것이 포함될 수 있습니다.

Go에서 이 작업을 수행할 때 `init()` 함수가 작동합니다. 
이 포스트에서는 이 `init()` 함수를 사용하여 다음 Go 기반 프로젝트를 빌드하는데 도움이되는 방법을 살펴 보겠습니다.

<h3 id="theinitFunction">
  <a href="#theinitFunction"></a>
  init 함수란?
</h3>

Go에서 `init()` 함수는 엄청나게 강력하며 다른 언어와 비교하여 Go 프로그램 내에서 사용하기가 훨씬 쉽습니다. 
이러한 `init()` 함수는 `package` 블록 내에서 사용할 수 있으며 패키지를 가져 오는 횟수에 관계없이 `init()` 함수는 한 번만 호출됩니다.

이제 한 번만 호출된다는 사실에 주의를 기울여야 합니다. 
이를 통해 데이터베이스 연결을 설정하거나 다양한 서비스 레지스트리에 등록하거나 
일반적으로 한 번만 수행하려는 다른 많은 작업을 수행할 수 있습니다.

```go 
package main

func init() {
  fmt.Println("This will get called on main initialization")
}

func main() {
  fmt.Println("My Wonderful Go Program")
}
```

이 예제에서 프로그램 내 어디에서나 `init()` 함수를 명시적으로 호출하지 않았습니다. 
Go는 암묵적으로 실행을 처리하므로 위의 프로그램은 다음과 같은 출력을 제공해야 합니다.

```bash
$ go run test.go
This will get called on main initialization
My Wonderful Go Program
```

이 작업을 통해 변수 초기화와 같은 멋진 작업을 시작할 수 있습니다.

```go 
package main

import "fmt"

var name string

func init() {
    fmt.Println("This will get called on main initialization")
    name = "Elliot"
}

func main() {
    fmt.Println("My Wonderful Go Program")
    fmt.Printf("Name: %s\n", name)
}
```

이 예제에서는 명시적으로 자신의 설정 함수를 호출해야하는 것과 비교하여 
`init()` 함수를 사용하는 것이 왜 바람직한지 알 수 있습니다.

위의 프로그램을 실행할 때 이름 변수가 올바르게 설정되어 있으며 
지구상에서 가장 유용한 변수는 아니지만 Go 프로그램 전체에서 계속 사용할 수 있습니다.

```bash
$ go run test.go
This will get called on main initialization
My Wonderful Go Program
Name: Elliot
```

<h3 id="multiplePackages">
  <a href="#multiplePackages"></a>
  다중 패키지
</h3>

프로덕션 Go 시스템에서 기대하는 것에 더 가까운 보다 복잡한 시나리오를 살펴 보겠습니다. 
애플리케이션, `main`, `broker` 및 `database` 내에 4개의 고유한 Go 패키지가 있다고 상상해보십시오.

이들 각각에서 Kafka 또는 MySQL과 같은 다양한 타사 서비스에 대한 연결 풀 설정 작업을 수행하는 `init()` 함수를 지정할 수 있습니다.

`database` package에서 함수를 호출할 때마다 `init()` 함수에서 설정한 연결 풀을 사용합니다.

>**참고**-`init()` 함수의 실행 순서에 의존할 수 없다는 점은 매우 중요합니다. 
>대신 순서가 중요하지 않은 방식으로 시스템을 작성하는데 집중하는 것이 좋습니다.

<h3 id="orderOfInitialization">
  <a href="#orderOfInitialization"></a>
  초기화 순서
</h3>

더 복잡한 시스템의 경우 특정 패키지를 구성하는 파일이 둘 이상있을 수 있습니다. 
이 파일들 각각에는 그들 자신의 `init()` 함수가 있을 수 있습니다. 
그렇다면 Go는 이러한 패키지의 초기화를 어떻게 차례대로합니까?

초기화 순서와 관련하여 몇 가지 사항이 고려됩니다. 
Go에 있는 것들은 일반적으로 선언 순서대로 초기화되지만 종속된 변수 다음에 명시적으로 초기화됩니다. 
즉, 동일한 패키지에 2개의 파일 `a.go` 및 `b.go`가 있는 경우 `a.go`의 초기화가 `b.go`의 
항목에 따라 달라지면 이것들이 먼저 초기화됩니다.

>**참고**-Go의 초기화 순서에 대한 자세한 내용은 공식 문서를 참조하십시오: 
>[Package initialization](https://golang.org/ref/spec#Package_initialization)

이 점에서 주목할 점은 이 선언 순서가 다음과 같은 시나리오로 이어질 수 있다는 것입니다.

```go 
// source: https://stackoverflow.com/questions/24790175/when-is-the-init-function-run
var WhatIsThe = AnswerToLife()

func AnswerToLife() int {
    return 42
}

func init() {
    WhatIsThe = 0
}

func main() {
    if WhatIsThe == 0 {
        fmt.Println("It's all a lie.")
    }
}
```

이 시나리오에서는 `init()` 함수가 호출되기 전에 `WhatIsThe` 변수가 선언되므로 
`AnswerToLife()`가 `init()` 함수보다 먼저 실행됩니다.

<h3 id="multipleInitFunctions">
  <a href="#multipleInitFunctions"></a>
  같은 파일 안에서의 다중 Init 함수
</h3>

동일한 Go 파일 내에 여러 개의 `init()` 함수가 있으면 어떻게 될까요? 
처음에는 이것이 가능하다고 생각하지 않았지만 Go는 실제로 하나의 파일 내에 2개의 개별 `init()` 함수를 지원합니다.

이 `init()` 함수는 파일 내에서 각각의 선언 순서대로 다시 호출됩니다.

```go 
package main

import "fmt"

// this variable is initialized first due to
// order of declaration
var initCounter int

func init() {
    fmt.Println("Called First in Order of Declaration")
    initCounter++
}

func init() {
    fmt.Println("Called second in order of declaration")
    initCounter++
}

func main() {
    fmt.Println("Does nothing of any significance")
    fmt.Printf("Init Counter: %d\n", initCounter)
}
```

위의 프로그램을 실행하면 다음과 같이 출력됩니다.

```bash
$ go run test.go
Called First in Order of Declaration
Called second in order of declaration
Does nothing of any significance
Init Counter: 2
```

멋지긴 한데, 왜 우리는 이것을 허용해야 할까요? 
보다 복잡한 시스템의 경우 복잡한 초기화 절차를 소화하기 쉬운 여러 `init()` 함수로 나눌 수 있습니다. 
그것은 본질적으로 항상 좋은 단일 `init()` 함수에 하나의 모 놀리 식 코드 블록을 갖는 것을 피할 수 있게 합니다. 
이 스타일의 한 가지 주의해야할 부분은 선언 순서를 보장할 때 주의를 기울여야한다는 것입니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이것으로 `init()` 함수의 세계에 대한 기본적인 소개를 마치겠습니다. 
패키지 초기화 사용법을 익힌 후에는 Go 기반 프로젝트를 구성하는 스킬을 익히는 것이 유용할 수 있습니다.

