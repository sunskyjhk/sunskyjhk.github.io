---
layout: post
title: "Go 기본 타입"
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
        <a href="#arrays">Arrays</a>
      </li>
      <li>
        <a href="#slices">Slices</a>
      </li>
      <li>
        <a href="#maps">Maps</a>
      </li>
      <li>
        <a href="#structs">Structs</a>
      </li>
      <li>
        <a href="#nestedStructs">Nested Structs</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이번 포스팅에서는 Go 프로그래밍 언어로 제공되는 다양한 복합 데이터 타입 (Composite Data Type)을 살펴 보겠습니다.

이 포스팅의 내용이 생소하다면, [기본 데이터 타입](../Ch02-Basic-Types-Tutorial)에 대한 다른 포스팅을 확인하고 오시면 도움이 될 것입니다. 
복합 데이터 타입에 대해서 잘 이해하려면 이러한 기본 데이터 타입에 대해 알아야합니다.

<h3 id="arrays">
  <a href="#arrays"></a>
  Arrays
</h3>

첫 번째 복합 데이터 형식인 `arrays`를 어떻게 선언하고 사용할 수 있는지 방법을 살펴 보겠습니다.

모든 요일을 배열로 선언하는 것을 시작해 봅시다. 그러기 위해서는 먼저 빈 배열이 있어야 합니다.

```go
// declaring an empty array of strings
var days []string

// declaring an array with elements
days := [...]string{"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}
```

배열의 첫 번째 요소 또는 특정 요소를 쿼리하려는 경우 다른 언어와 매우 유사한 방식으로 쿼리할 수 있습니다.

```go
fmt.Println(days[0]) // prints 'monday'
fmt.Println(days[5]) // prints 'saturday'
```

<h3 id="slices">
  <a href="#slices"></a>
  Slices
</h3>
slices와 arrays의 차이점은 매우 미묘합니다. Go에서 slice를 사용하면 기본 array 요소의 하위 집합에 액세스할 수 있게 됩니다.

slices는 `pointer`, `length`, `capacity`의 세 가지로 이루어져 있습니다. 예제를 가지고 이것을 시각화 해봅시다. 
예를 들어, 우리는 한 주의 모든 요일이 있는 array를 가지고 있고, 우리는 이 array에서 주말을 제외한 요일만을 추출하길 원한다면 slice를 사용할 수 있습니다.

```go
days := [...]string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
weekdays := days[0:5]
fmt.Println(weekdays)
// This returns: [Monday Tuesday Wednesday Thursday Friday]
```

<h3 id="maps">
  <a href="#maps"></a>
  Maps
</h3>

Maps는 Go에서 hash 테이블을 나타내는 것으로, 임의의 데이터 타입을 다른 타입으로 매핑할 수 있는 데이터 구조입니다. 
예를 들어 YouTube 채널 이름에서 해당 채널의 구독자 수에 대한 map을 만들어 보겠습니다.

```go
youtubeSubscribers := map[string]int{
  "TutorialEdge":     2240,
  "MKBHD":            6580350,
  "Fun Fun Function": 171220,
}

fmt.Println(youtubeSubscribers["MKBHD"]) // prints out 6580350
```

이것은 `string` 데이터 타입과 `int` 데이터 타입 간의 mapping을 나타냅니다.

<h3 id="structs">
  <a href="#structs"></a>
  Structs
</h3>

Go에서 우리는 `struct`의 개념을 가지고 있습니다. 이 `structs`를 사용하면 다른 데이터 형식이 aggregate된 데이터 타입을 만들 수 있습니다.

예를 들어, 우리는 응용 프로그램 내에서 어떤 `Person`에 대한 개념을 다음과 같이 가지고 있다고 가정해봅시다. 
그러면 `string` 타입의 이름 필드와 int 타입의 `age` 필드를 가질 수 있는 person `struct`를 만들 수 있습니다:

```go
// our Person struct
type Person struct {
  name string
  age int
}

// declaring a new `Person`
var myPerson Person
```
이러한 `struct`를 사용하면 그 안에 있는 값이나 `fields`를 모두 단일 엔터티라고 취급되어 이를 효과적으로 처리하고 쉽게 수정할 수 있다는 장점이 있습니다.

```go
// declaring a new `elliot`
elliot := Person{name: "Elliot", age: 24}

// trying to roll back time to before I was injury prone
elliot.age = 18
```

<h3 id="nestedStructs">
  <a href="#nestedStructs"></a>
  Nested Structs
</h3>

구조체 안에 중첩 구조체를 만들 수 있기 때문에 구조체는 엄청나게 확장 가능합니다. 
예를 들어, 우리 팀에 많은 사람들이 있는 Team 구조체가 있다고 상상해봅시다.

```go
package main

import (
    "fmt"
)

func main() {
    type Person struct {
        name string
        age  int
    }

    // our Team struct
    type Team struct {
        name    string
        players [2]Person
    }

    // declaring an empty 'Team'
    var myTeam Team
    fmt.Println(myTeam)

    players := [...]Person{Person{name: "Forrest"}, Person{name: "Gordon"}}
    // declaring a team with players
    celtic := Team{name: "Celtic FC", players: players}
  fmt.Println(celtic)

}
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅이 유용하길 바라면서 자신의 Go 프로그램 내에서 보다 고급 데이터 타입을 사용하는 방법에 대한 통찰력을 얻으셨길 바랍니다.

유용하거나 자세한 정보가 필요하면 아래의 댓글에 알려주세요!