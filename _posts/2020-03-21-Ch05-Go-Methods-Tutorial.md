---
layout: post
title: "Go 메서드 (Go Methods)"
author: Sun
date: 2020-03-21 05:00:01
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
        <a href="#aSimpleExample">간단한 예제</a>
      </li>
      <li>
        <a href="#functionsVsMethods">함수 VS 메서드</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스팅에서는 우선 메서드가 무엇인지와 Go 프로그래밍 언어의 범위 내에서 그것이
어떻게 작동하는지 살펴 보겠습니다. 그런 다음 메서드과 함수의 차이점과 Go 프로그램 내에서 
이상적으로 사용해야하는 시점을 설명합니다.

<h3 id="aSimpleExample">
  <a href="#aSimpleExample"></a>
  간단한 예제
</h3>

Go 시스템에서 스스로 어떤 메서드를 어떻게 구현할 수 있는지를 다루면서 시작하겠습니다. 
직원 이름을 업데이트하고 그 이름을 인쇄할 수 있는 매우 간단한 직원 관리 시스템을 만들 것입니다. 
아주 흥미로운 예제 프로젝트는 아니지만 데모의 목적으로 사용됩니다.

먼저 이름이 하나인 문자열 필드를 특징으로하는 Employee 타입의 구조체를 만듭니다.

다음으로 우리가 만든 직원의 이름을 업데이트하고 인쇄할 수 있는 `UpdateName()` 및 
`PrintName()` 메서드를 선언합니다.

> **main.go**

```go
package main

import (
    "fmt"
)

type Employee struct {
    Name string
}

func (e *Employee) UpdateName(newName string) {
    e.Name = newName
}

func (e *Employee) PrintName() {
    fmt.Println(e.Name)
}

func main() {
    var employee Employee
    employee.Name = "Elliot"
    employee.UpdateName("Forbsey")
    employee.PrintName()
}
```

>**주의** – 메소드를 사용할 때 주의해야 할 것은 함수와 같이 전달된 인수의 
>사본을 작성한다는 것입니다. 이를 피하기 위해 메소드를 정의할 때 다음과 같이 
>포인터 리시버(pointer receivers)를 사용할 수 있습니다.
>
>
>`func (pointer *pointer) myMethod()`

그렇다면 왜 Go 프로그램 내에서 메소드를 사용해야 할까요?

<h3 id="functionsVsMethods">
  <a href="#functionsVsMethods"></a>
  함수 VS 메소드
</h3>

Go에 있는 전형적인 함수와 메서드 사이에는 미묘한 차이가 있습니다. 메서드는 일반적으로 주어진 객체, 
즉 `guitarist.Update(params)`에 대해 작동하며, 이 방식으로 코드를 작성하는 경우 
`UpdateGuitarist(guitarist, params)`를 수행하는 것보다 훨씬 더 친숙하고 선호될 것입니다.

```go
func UpdateGuitarist(guitarist *Guitarist, params ParamsStruct) {
  fmt.Println("This is a simple function")
}

// Calling this function
UpdateGuitarist(guitarist, params)
```

위의 예에서 guitarist와 guitarist를 업데이트하려는 파라미터를 모두 전달해야합니다. 
그런데 우리가 메서드로 이와 동일한 함수를 구현한다면, 호출할 때 더 깔끔해 보일 것입니다:

```go
func (g *Guitarist) Update(params ParamsStruct) {
  fmt.Println("This is a simple method")
}

// this is far nicer in my opinion
myGuitarist.Update(params)
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅에서 우리는 메서드가 무엇인지, 그리고 함수와 어떻게 다른지 알아보았습니다.

이 포스팅이 도움이 되었기를 바라며, 추가 도움이나 코멘트가 필요한 경우, 아래 댓글에 작성해주시면 감사하겠습니다.