---
layout: post
title: "Go Variadic Function 시작하기"
author: Sun
date: 2020-04-14 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go에서 Variadic Functions를 살펴 보겠습니다. 
자체 Go 애플리케이션에서 이러한 함수를 구현하고 사용하는 방법을 다룰 것입니다."
---

이 포스트에서는 Go에서 Variadic Functions를 살펴 보겠습니다. 
자체 Go 애플리케이션에서 이러한 함수를 구현하고 사용하는 방법을 다룰 것입니다.

## Variadic Functions

함수에 필요한 문자열 인수의 수를 모르는 경우가 있습니다. 이곳에서 가변 기능이 작동합니다.

Variadic 함수를 사용하면 임의의 수의 인수를 취하는 함수를 정의할 수 있습니다. 
이렇게하면 입력 길이의 모든 가능한 변형에 대해 코드를 작성하지 않아도되며 
이 개념은 Python 및 Java와 같은 다양한 언어로 전송됩니다.

```go 
package main

import (
  "fmt"
)

func myVariadicFunction(args ...string) {
  fmt.Println(args)
}

func main() {
  myVariadicFunction("hello", "world")
}
```

이를 실행하려고하면 `fmt.Println()` 호출이 `Hello`와 `world`를 모두 포함하는 문자열 배열을 
인쇄한다는 것을 알 수 있습니다.

```bash
$ go run main.go
[hello world]
```

>**참고** - Variadic 함수는 문자열로 제한되지 않으며 복합 또는 기본 유형의 모든 변형을 사용할 수 있습니다.

## Production Examples

프로덕션 Go 코드에서 이에 대한 예를 살펴 보겠습니다. 
`Println()`은 가장 잘 알려진 가변 함수의 좋은 예입니다.

```go 
// Println formats using the default formats for its operands and writes to standard output.
// Spaces are always added between operands and a newline is appended.
// It returns the number of bytes written and any write error encountered.
func Println(a ...interface{}) (n int, err error) {
    return Fprintln(os.Stdout, a...)
}
```

> **참고** – 이 예에서는 임의의 수의 `interface{}` 인수를 사용합니다.

## Conclusion

따라서 이 포스트에서는 Go의 가변 함수를 성공적으로 다룰 수 있었습니다. 
우리는 그것이 무엇이며, 자신의 Go 프로그램 내에서 명성과 재산으로 사용될 수 있는 방법을 다뤘습니다.