---
layout: post
title: "Go 기본 타입 (Go Basic Types)"
author: Sun
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이번 포스팅에서는 Go 언어에서 사용할 수 있는 모든 기본 데이터 타입을 살펴 보겠습니다. 
이 튜토리얼이 끝나면 언어 내에서 사용 가능한 다양한 데이터 타입에 익숙해질 것이며 자신의 Go 프로그램에서 
이러한 타입을 사용하는 방법에 대한 이해가 완료될 것입니다." 
---
<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#dataTypes">데이터 타입</a>
      </li>
      <li>
        <a href="#integers">Integers</a>
      </li>
      <li>
        <a href="#standardIntType">표준 int 타입</a>
      </li>
      <li>
        <a href="#conversionOfTypes">타입 변환하기</a>
      </li>
      <li>
        <a href="#floatingPointNumbers">Floating Point Numbers</a>
      </li>
      <li>
        <a href="#convertingFloat2int">Converting float to int and back again</a>
      </li>
      <li>
        <a href="#complexNumbers">Complex Numbers</a>
      </li>
      <li>
        <a href="#booleans">Booleans</a>
      </li>
      <li>
        <a href="#strings">문자열</a>
      </li>
      <li>
        <a href="#constants">상수</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>
이번 포스팅에서는 Go 언어에서 사용할 수 있는 모든 기본 데이터 타입을 살펴 보겠습니다. 
이 튜토리얼이 끝나면 언어 내에서 사용 가능한 다양한 데이터 타입에 익숙해질 것이며 자신의 Go 프로그램에서 
이러한 타입을 사용하는 방법에 대한 이해가 완료될 것입니다.

이런 종류의 튜토리얼은 배우기에는 상당히 건조하고 지루할 수 있으므로 필요한 기본 사항을 
다루면서 이것저것 꾸미고 매끄럽게 만들어서 약간의 재미를 주도록 노력했습니다.

<h3 id="dataTypes">
  <a href="#dataTypes"></a>
  데이터 타입
</h3>
 따라서, 시작하려면 Go 프로그래밍 언어 내에 4 가지 카테고리의 타입이 있다는 것을 알아야 합니다.
 
 * **Basic Types**-이 튜토리얼에서 다룰 내용
 * **Aggregate Types**-배열과 구조체
 * **Reference Types**-포인터와 슬라이스
 * **Interface Types**-표준 인터페이스 

<h3 id="integers">
  <a href="#integers"></a>
  Integers
</h3>

우리가 다룰 첫 번째 기본 타입은 `정수` 타입입니다.

프로그램 내에서 부호있는 정수 또는 부호없는 정수를 사용할 수 있으며 필요한 정수의 크기를 지정할 수 있습니다. 
요청하는 크기를 지정하고 싶은 이유는 무엇일까요? 프로그램의 메모리 사용률을 최적화하려고 한다고 상상해 보십시오. 
특정 숫자가 특정 값을 초과하지 않는 경우 해당 값에 적합한 메모리 크기를 선택하여 할당할 수 있습니다.

타입 끝에 할당할 메모리 크기와 함께 `uint` 또는 `int`를 입력하여 새로운 정수 변수를 만들 수 있습니다. 
예를 들어, 8 비트의 부호없는 정수를 원한다면 `var myint uint8`로 선언할 수 있습니다:

```go
// all numeric types default to 0

// unsigned int with 8 bits
// Can store: 0 to 255
var myint uint8
// signed int with 8 bits
// Can store: -127 to 127
var myint int8

// unsigned int with 16 bits
var myint uint16
// signed int with 16 bits
var myint int16

// unsigned int with 32 bits
var myint uint32
// signed int with 32 bits
var myint int32

// unsigned int with 64 bits
var myint uint64
// signed int with 64 bits
var myint int64
```

처리할 수 있는 것보다 큰 값을 `int`에 할당하려고하면 다음과 같습니다:

```go
var myint int8
myint = 2500
```

Go 컴파일러는 프로그램을 실행하거나 빌드하지 못하고 2500이 `int8`을 오버플로우한다는 사실을 출력합니다. 
그러나 런타임에 정수를 오버플로우하게 만들면 이상한 결과가 나타날 수 있습니다. 예를 들어,아래의 프로그램을 실행하고 출력을 검사해 보세요:

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello World")

    var myint int8
    for i := 0; i < 129; i++ {
        myint += 1
    }
    fmt.Println(myint) // prints out -127
}
```

이것은 이 특정 연산의 결과로 부호있는 정수가 오버플로우 되었기 때문입니다. 이것은 여러분의 프로그램 내에서 주의해야 할 부분입니다!

<h3 id="standardIntType">
  <a href="#standardIntType"></a>
  표준 int 타입
</h3>

정수 값을 정의할 때, 이 모든 세부 정보가 너무 많으면 대부분의 경우 기본적으로 `int`로 설정할 수 있습니다. 
이 `int` 데이터 타입은 일반적으로 기본 시스템이 32 비트 시스템인지 64 비트 시스템인지에 따라 크기가 32 비트 또는 64 비트로 결정됩니다.

간단하게 하기 위해 이 데이터 타입을 기본 값으로 사용하는 것이 가장 편하며 이 타입이 가장 널리 사용되는 것을 볼 수 있습니다.

        <a href="#conversionOfTypes">타입 변환하기</a>
<h3 id="conversionOfTypes">
  <a href="#conversionOfTypes"></a>
  타입 변환하기
</h3>

데이터 타입이 다른 여러 변수로 작업할 때 다양한 정수 변수를 `int`로 캐스팅 할 필요가 없습니다. 
이것은 `uint8` 및 `int16`과 같은 것에서 표준 32 또는 64 비트의 부호있는 int로 변환을 처리한 당므 거기에서 더하기, 
곱하기 및 빼기와 같은 일을 할 수 있습니다.

```go
var men uint8
men = 5
var women int16
women = 6

var people int
// this throws a compile error
people = men + women
// this handles converting to a standard format
// and is legal within your go programs
people = int(men) + int(women)
```

<h3 id="floatingPointNumbers">
  <a href="#floatingPointNumbers"></a>
  Floating Point Numbers 
</h3>

다음으로, 우리는 부동 소수점 숫자 (Floating Point Numbers)를 살펴보겠습니다. 
이들은 `float32` 또는 `float64`의 두 가지 메모리 사이즈로 제공되며 표준 `int64` 데이터 타입에 맞지 않는 매우 큰 숫자를 작업할 수 있게 해줍니다.

```go
var f1 float32
var f2 float64
```

이제 `float`를 선언하고 작업하는 방법을 살펴보겠습니다:

```go
var maxFloat32 float32
maxFloat32 = 16777216
fmt.Println(maxFloat32 == maxFloat32+10) // you would typically expect this to return false
// it returns true
fmt.Println(maxFloat32+10) // 16777216
fmt.Println(maxFloat32+2000000) // 16777216
```

<h3 id="convertingFloat2int">
  <a href="#convertingFloat2int"></a>
  Converting float to int and back again
</h3>

정수를 부동 소수점으로 변환하거나 부동 소수점을 정수로 변환하려면 변수를 원하는 데이터 타입으로 캐스팅하여 이를 달성할 수 있습니다.

```go
// converting from int to float
var myint int
myfloat := float64(myint)

// converting from float to int
var myfloat2 float64
myint2 := int(myfloat2)
```

<h3 id="complexNumbers">
  <a href="#complexNumbers"></a>
  Complex Numbers
</h3>

자, 정수와 부동 소수점을 모두 다루었지만 일반적으로 간과되는 또 다른 숫자 데이터 타입이 있는데, 그것은 바로 복소수 데이터 타입입니다. 
부동 소수점 데이터 타입과 매우 유사한 이 두 가지의 메모리 사이즈로 `complex64` 또는 `complex128`을 사용할 수 있습니다.

```go
var x complex128 = complex(1, 2) // 1+2i
var y complex128 = complex(3, 4) // 3+4i
// multiplication between complex numbers
fmt.Println(x*y)                 // "(-5+10i)"
// extract the each property of complex number (real & imaginary)
fmt.Println(real(x*y))           // "-5"
fmt.Println(imag(x*y))           // "10"
```

<h3 id="booleans">
  <a href="#booleans"></a>
  Booleans
</h3>

이제 모든 기본 숫자 데이터 타입을 다루었으므로 Go에서 사용할 수 있는 다른 기본 데이터 타입으로 넘어가 보겠습니다. 
첫 번째는 bool 또는 <em>boolean</em> 데이터 타입입니다.

bool은 `true` 또는 `false`를 나타냅니다. Go 프로그램에서 이것이 어떻게 사용될 수 있는지 봅겠습니다:

```go
var amazing bool
amazing = true
if amazing {
  subscribeToChannel()
}
```

멋지고 단순하지만 프로그램 내에서 약간의 `boolean`을 이용한 논리 연산을 수행하려면 어떻게 해야할까요?
음, `||`과 `&&`을 사용해서 할 수 있습니다!

```go
var isTrue bool = true
var isFalse bool = false
// AND
if isTrue && isFalse {
  fmt.Println("Both Conditions need to be True")
}
// OR - not exclusive
if isTrue || isFalse {
  fmt.Println("Only one condition needs to be True")
}
```

<h3 id="strings">
  <a href="#strings"></a>
  문자열
</h3>

Go 언어의 문자열은 문자 조각이라고합니다. string을 사용하여 새로운 문자열 변수를 선언할 수 있습니다:

```go
var myName string
myName = "Elliot Forbes"
```

<h3 id="constants">
  <a href="#constants"></a>
  상수
</h3>

상수는 우리가 이 포스팅에서 다루는 Go 언어의 마지막 기본 데이터 타입입니다. 
이를 통해 프로그램 실행 과정에서 변경되지 않는 불변 값을 지정할 수 있습니다.

```go
const meaningOfLife = 42
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이번 강의에서 많은 내용을 다루었지만 즐겁게 즐기시기 바랍니다. 
추가 도움이 필요하거나 더 알고 싶다면 아래의 댓글란에 알려주세요!