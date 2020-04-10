---
layout: post
title: "Go 포인터 튜토리얼"
author: Sun
date: 2020-03-29 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스터에서는 Go의 포인터와 고유한 Go 프로그램 내에서 포인터를 사용하는 방법을 설명합니다. 
모범 사례를 다루고 포인터에 대한 가장 일반적인 사용 사례를 다룰 것입니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#introduction">소개</a>
      </li>
      <li>
        <a href="#definingPointers">포인터 정의하기</a>
      </li>
      <li>
        <a href="#assigningValuestoPointers">포인터에 값 할당하기</a>
      </li>
      <li>
        <a href="#nullability">무효성</a>
      </li>
      <li>
        <a href="#passingVariables">변수 전달하기</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
      <li>
        <a href="#furtherReading">추가 자료</a>
      </li>
    </ul>
  </nav>
</div>

이 포스터에서는 Go의 포인터와 고유한 Go 프로그램 내에서 포인터를 사용하는 방법을 설명합니다. 
모범 사례를 다루고 포인터에 대한 가장 일반적인 사용 사례를 다룰 것입니다.

이 튜토리얼을 마치면 포인터와 포인터 사용 방법을 제대로 이해하게 될 것입니다.

<h3 id="introduction">
  <a href="#introduction"></a>
  소개
</h3>

Go에서 함수를 호출하고 해당 함수에 여러 인수를 전달하면 
언어는 인수의 사본을 작성하여 해당 함수 내에서 사용합니다. 
예를 들면 다음과 같습니다.

> **main.go**

```go 
package main

import "fmt"

func myTestFunc(a int) {
    a += 3
    fmt.Println(a)
}

func main() {
    a := 2
    myTestFunc(a)
    fmt.Println(a) // prints out 2
}
```

위의 코드에서 `myTestFunc`는 정수 변수를 받아서 함수 본문의 컨텍스트 내에서 사용하기 위해 사본을 만듭니다. 
`myTestFunc` 내에서 변경한 내용은 myTestFunc 함수 본문 내에서만 유지됩니다.

이제 `myTestFunc`를 호출하고 원래 변수를 업데이트하고 3을 추가해 볼까요ㅡ?

이 특별한 경우에, 우리는 함수 서명을 참조가 아닌 포인터를 갖도록 변경할 수 있습니다. 
이는 `myTestFunc` 함수 내에서 변경한 내용이 사본이 아니라 원래 변수에 대해 수행됨을 의미합니다!

> **main.go**

```go 
package main

import "fmt"

func myTestFunc(a *int) {
    *a += 3
    fmt.Println(*a)
}

func main() {
    a := 2
    myTestFunc(&a)
    fmt.Println(a) // prints out 5
}
```

위 코드를 실행하면 `myTestFunc`가 `a`의 원래 값을 올바르게 업데이트하고 3을 추가한 것을 볼 수 있습니다:

>$ go run main.go

```bash
5
5
```

<h3 id="definingPointers">
  <a href="#definingPointers"></a>
  포인터 정의하기
</h3>

이제 물러서서 포인터 작업의 기본 사항을 살펴 보겠습니다.

Go 코드 내에서 포인터를 정의하는 방법을 살펴 보겠습니다. 
포인터를 정의하기 위해 변수를 선언하는 지점에서 `*` 기호를 사용할 수 있으며 변수를 `pointer` 변수로 바꿉니다.

> **main.go**

```go 
package main

import "fmt"

func main() {
    var age *int

    fmt.Println(age)
    fmt.Println(&age)
}
```

위의 코드를 실행하면 다음과 같은 결과를 얻을 수 있습니다.

>$go run main.go

```bash
<nil>
0xc00000e018
```

첫 번째 값은 포인터 변수 `age`의 값을 나타냅니다. 두 번째는 이 변수의 주소를 나타냅니다.

<h3 id="assigningValuestoPointers">
  <a href="#assigningValuestoPointers"></a>
  포인터에 값 할당하기
</h3>

> **질문**-`age` 변수에 값을 할당하려고하면 어떻게됩니까?

알다시피, `age` 변수는 `nil`입니다. `26`으로 설정하고 어떻게되는지 확인해보겠습니다:

> **main.go**

```go
package main

import "fmt"

func main() {
    var age *int

    *age = 26

    fmt.Println(age)
    fmt.Println(&age)
}
```

실제로 컴파일러가 패닉 상태가됩니다.

> **go run main.go**

```bash
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x1092f6e]

goroutine 1 [running]:
main.main()
        /Users/elliot/Documents/Projects/TutorialEdge/Projects/Go/go-pointers-tutorial/main.go:8 +0x3e
exit status 2
```

그 이유는 int 타입의 값에 맞는 충분한 메모리를 할당하기 위해 내장 함수 `new`를 사용해야하기 때문입니다. 
지금 이 작업을 살펴 보겠습니다.

> **main.go**

```go 
package main

import "fmt"

func main() {
    var age *int
    age = new(int)
    *age = 26

    fmt.Println(*age)
    fmt.Println(&age)
}
```

> **중요 사항** - 위 예제에서 main 함수의 첫 번째 줄을 제거하고 
>`age = new(int)`를 `age := new(int)`로 수정하면 좀 더 간결하게 만들 수 있습니다.

<h3 id="nullability">
  <a href="#nullability"></a>
  무효성
</h3>

> **중요 참고** - Go 코드 내에서 포인터를 사용하면 얻을 수 있는 큰 이점은 
>포인터가 무효화 (nullable)될 수 있다는 것입니다.

`pointer` 반환 값이 있는 함수가 있으면 그 포인터가 nullable 하다는 사실을 이용할 수 있습니다.

이 첫 번째 함수를 예로 들어 보겠습니다:

```go
func testFunc(id string) (Guitarist, error) {
    result, err := getSongs(id)
    if err != nil {
        return Guitarist{}, err
    }

    return result, nil
}
```

위의 코드에서 우리는 오류를 반환하기 위해 
빈 `Guitarist{}` 구조체를 채워야했습니다. 
그러나 포인터 반환 값으로 이 함수를 정의하면 위의 코드를 다음과 같이 단순화 할 수 있습니다.

```go 
func testFunc(id string) (*Guitarist, error) {
    result, err := getSongs(id)
    if err != nil {
        return nil, err
    }

    return result, nil
}
```

<h3 id="passingVariables">
  <a href="#passingVariables"></a>
  변수 전달하기
</h3>

Go를 가르칠 때 개발자가 포인터 변수를 값 수신기를 사용하는 
함수에 전달하는 방법에 대해 종종 우연히 목격합니다. 이에 대한 예를 보겠습니다:

> **main.go**
```go 
package main

import "fmt"

func YearsUntilRetirement(age int) {
    fmt.Println(100 - age)
}

func main() {
	var age *int
	age = new(int)
	*age = 26
    
    YearsUntilRetirement(age)
}
```

우리가 이것을 실행하려고 할 때, 
우리는 `YearsUntilRetirement` 함수에 `*int type`을 전달할 수 없다고 불평하게 될 것입니다.

> **go run main.go**

```bash
# command-line-arguments
./main.go:13:25: cannot use age (type *int) as type int in argument to YearsUntilRetirement
```

이 포인터의 값을 전달하기 위해 다음과 같이 `*age`로 함수에 전달하여 역참조 할 수 있습니다.

>**main.go**

```go 
package main

import "fmt"

func YearsUntilRetirement(age int) {
    fmt.Println(100 - age)
}

func main() {
	var age *int
	age = new(int)
	*age = 26
    
    YearsUntilRetirement(*age)
}
```

이제 Go 프로그램이 정상적으로 실행되는 것을 볼 수 있습니다.

> $ go run main.go

```bash
74
```

> **챌린지** - Go의 포인터에 대한 당신의 이해도를 이 사이트에서 테스트 해보세요.
>- [Go Pointers and linked site](https://tutorialedge.net/challenges/go/challenge-06/)

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>
  
 이 포스트에서는 Go 언어 내에서의 포인터에 대한 기본 사항과 
 자신의 Go 어플리케이션 내에서 포인터를 사용하는 방법에 대해 설명했습니다.

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  추가 자료
</h3>

* [Go 인터페이스 (Interfaces)](../Ch06-Go-Interfaces-Tutorial)
* [Go 메서드 (Go Methods)](../Ch05-Go-Methods-Tutorial)