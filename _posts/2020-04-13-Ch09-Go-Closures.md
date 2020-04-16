---
layout: post
title: "Go Closures 입문"
author: Sun
date: 2020-04-13 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go의 클로저를 살펴 보겠습니다. 
우리는 그 뒤에있는 이론을 다룰 것이며, 
자신의 Go 애플리케이션에서 그것들을 어떻게 사용할 수 있는지 살펴볼 것입니다."
---

이 포스트에서는 Go의 클로저를 살펴 보겠습니다. 
우리는 그 뒤에있는 이론을 다룰 것이며, 
자신의 Go 애플리케이션에서 그것들을 어떻게 사용할 수 있는지 살펴볼 것입니다.

## Closures - The Theory

이론에 대해 알아 보겠습니다.

함수를 일급 객체로 지원하는 모든 프로그래밍 언어 내에서 클로저를 만들고 사용할 수 있습니다. 
Go는 그런 언어 중 하나입니다. 그렇지 않은 언어에는 이 포스팅이 의미가 없습니다.

따라서 클로저에 대한 기술적 정의는 
`클로저는 일급 함수로 언어에서 어휘적 범위가 지정된 이름 바인딩을 구현하는 기술입니다. - 위키백과`

걱정하지 마세요. 처음 읽을 때는 누구든 머리가 약간 아프고 생각이 필요합니다.

일반인의 관점에서 closure는 그것의 body와 함께 배치되는 변수를 참조할 수 있는 함수 값입니다.

> **참고** - 클로저와 클로저라고 일반적으로 잘못 알려진 익명 함수의 뚜렷한 차이점에 주의해야합니다. 
>익명 함수에 대한 자세한 내용은 다음을 참조하십시오. 
>[Go Anonymous Functions](../Ch04-Go-Functions-Tutorial)

## A Simple Example

> **main.go**

```go 
package main

import "fmt"

func getLimit() func() int {
    limit := 10
    return func() int {
        limit -= 1
        return limit
    }
}

func main() {
    limit := getLimit()
    fmt.Println(limit())
    fmt.Println(limit())
}
```

이제 이것을 실행하면 다음과 같은 결과가 나타납니다.

>**go run main.go**

```bash
9
8
```

그러나 이것이 왜 중요한가? 이 `limit` 변수는 할당된 `limit`에 묶여 있습니다. 
`getLimit()`을 바인드하여 바로 아래에 `limit2`를 지정하면 고유 한 상태가됩니다.

>**main.go**

```go
package main

import "fmt"

func getLimit() func() int {
    limit := 10
    return func() int {
        limit -= 1
        return limit
    }
}

func main() {
    limit := getLimit()
    fmt.Println(limit()) // 9
    fmt.Println(limit()) // 8

    limit2 := getLimit()
    fmt.Println(limit2()) // 9
    fmt.Println(limit2()) // 8

    fmt.Println(limit()) // 7

}
```

이것을 실행하면 다음과 같은 결과가 나타납니다.

>**$go run main.go**

```bash
9
8
9
8
7
```

놀랍게도 Go에서 직접 `closure` 인스턴스를 만들었습니다.

## 결론

이 포스트에서는 클로저의 기본 이론과 자신의 Go 프로그램 내에서 클로저를 사용하는 방법에 대해 설명했습니다.