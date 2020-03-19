---
layout: post
title: "Go 인터페이스 (Interfaces)"
author: Sun
date: 2020-03-22 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이번 포스팅에서는 Go 프로그래밍 언어의 인터페이스를 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#basicExample">기본 예제</a>
      </li>
      <li>
        <a href="#whyIsThisUseful">왜 유용한가?</a>
      </li>
      <li>
        <a href="#definingInterfaces">인터페이스 정의하기</a>
      </li>
      <li>
        <a href="#returnValues">값 반환하기</a>
      </li>
      <li>
        <a href="#satisfyingInterfaces">인터페이스 만족하기</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이번 포스팅에서는 Go 프로그래밍 언어의 인터페이스를 살펴 보겠습니다.

이 포스팅에서는 다음 주제를 다룰 것입니다.

* 인터페이스의 기초
* 자신 만의 인터페이스 정의하기

이 포스팅의 끝에는 이 포스팅에서 다룬 일부 주제를 테스트해보고 유효성 검증을 하기 위해 
자신의 컴퓨터에서 자유롭게 시도하고 완료할 수 있는 여러 가지 연습 문제들이 있습니다.

> **Github 소스 코드** - 이 튜토리얼의 전체 소스 코드는 여기에서 찾을 수 있습니다: 
>[TutorialEdge/Go-Interfaces-Tutorial](https://github.com/TutorialEdge/go-interfaces-tutorial)

<h3 id="basicExample">
  <a href="#basicExample"></a>
  기본 예제
</h3>

Go를 처음 사용하는 경우 코드 스니펫이나 튜토리얼에서 `interface{}`가 많이 표시어있는 것을 볼 수 있습니다. 
Go에서 인터페이스라는 개념이 무엇이고 인터페이스가 무얼 위해서 사용되는지 모르는 경우, 처음에는 이것을 보는 것이 상당히 어려울 수 있습니다.

전형적인 빈 인터페이스를 기대하는 함수 또는 메서드를 보게된다면, 일반적으로 이 함수/메소드로 무엇이든 전달할 수 있습니다.

이에 대한 예를 살펴 보겠습니다.

```go
package main

import (
    "fmt"
)

func myFunc(a interface{}) {
    fmt.Println(a)
}

func main() {
    var my_age int
    my_age = 25

    myFunc(my_age)
}
```

그런 다음 이것을 실행하면 성공적으로 실행되고 정수 값을 인쇄한다는 것을 알 수 있습니다.

```bash
$ go run main.go
25
```

<h3 id="whyIsThisUseful">
  <a href="#whyIsThisUseful"></a>
  왜 유용한가?
</h3>

`interface{}`를 가져가는 함수를 정의함으로써 본질적으로 원하는 것을 전달할 수 있는 유연성을 제공합니다. 
Go 프로그래머의 말에 따르면 이 함수에는 무언가가 필요하지만 타입에 신경 쓰지 않아도 된다고 합니다.

<h3 id="definingInterfaces">
  <a href="#definingInterfaces"></a>
  인터페이스 정의하기
</h3>

그렇다면 인터페이스란 무엇일까요? Go 안에서 왜 사용하는걸까요? 
Go에서 인터페이스를 정의함으로써 기본적으로 어떤 계약을 정의하게 됩니다. 
이 인터페이스를 기반으로 하지 않고 타입을 정의해버리면 해당 인터페이스 에서 
정의될 수 있는 모든 타입에 대해 각각의 함수 또는 메소드를 구현해야 합니다.

예를 들어, 기타리스트를 위한 인터페이스를 정의하려고 한다고 가정해 봅시다. 
다음과 같이 `PlayGuitar()` 함수를 포함하도록 인터페이스를 정의할 수 있습니다:

```go
type Guitarist interface {
  // PlayGuitar prints out "Playing Guitar"
  // to the terminal
  PlayGuitar()
}
```

이렇게 `Guitarist` 인터페이스를 정의하면, 기타리스트 인터페이스를 구성하는 
`BaseGuitarist` 및 `AcousticGuitarist` 구조체를 정의할 수 있습니다.

```go
package main

import "fmt"

type Guitarist interface {
    // PlayGuitar prints out "Playing Guitar"
    // to the terminal
    PlayGuitar()
}

type BaseGuitarist struct {
    Name string
}

type AcousticGuitarist struct {
    Name string
}

func (b BaseGuitarist) PlayGuitar() {
    fmt.Printf("%s plays the Bass Guitar\n", b.Name)
}

func (b AcousticGuitarist) PlayGuitar() {
    fmt.Printf("%s plays the Acoustic Guitar\n", b.Name)
}

func main() {
    var player BaseGuitarist
    player.Name = "Paul"
    player.PlayGuitar()

    var player2 AcousticGuitarist
    player2.Name = "Ringo"
    player2.PlayGuitar()
}
```

원하는 경우 `BaseGuitarist` 및 `AcousticGuitarist` 객체를 모두 저장할 수 있는 
`Guitarist` 타입의 배열을 만들 수 있습니다.

```go
var guitarists []Guitarist
guitarists = append(guitarists, player)
guitarists = append(guitarists, player2)
```

<h3 id="returnValues">
  <a href="#returnValues"></a>
  값 반환하기
</h3>

실제 예제에서 우리는 일반적으로 인터페이스 내에서 반환 값을 특징으로하는 
더 복잡한 함수를 갖게됩니다. Go에서 이러한 인터페이스를 다음과 같이 정의할 수 있습니다.

```go
type Employee interface {
    Name() string
    Language() string
    Age() int
    Random() (string, error)
}
```

<h3 id="satisfyingInterfaces">
  <a href="#satisfyingInterfaces"></a>
  인터페이스 만족하기
</h3>

회사에 모든 직원들의 배열을 만들고 싶다고 가정해 보겠습니다. 
이 배열 내에서 모든 엔지니어가 필요합니다.

이제 이것이 작동하려면 Employee 인터페이스를 만족시키기 
위해 엔지니어 타입이 필요합니다. 그렇지 않으면 프로그램을 컴파일 할 수 없습니다.

```go
package main

type Employee interface {
    Language() string
    Age() int
    Random() (string, error)
}

type Engineer struct {
    Name string
}

func (e *Engineer) Language() string {
    return e.Name + " programs in Go"
}

func main() {
    // This will throw an error
    var programmers []Employee
    elliot := Engineer{Name: "Elliot"}
    // Engineer does not implement the Employee interface
    // you'll need to implement Age() and Random()
    programmers = append(programmers, elliot)
}
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이번 포스팅에서 인터페이스가 Go안에서 어떻게 작동하는지 
알게되었고 Go 기반 프로그램에서 구현할 수 있는 방법 또한 알아보았습니다.

