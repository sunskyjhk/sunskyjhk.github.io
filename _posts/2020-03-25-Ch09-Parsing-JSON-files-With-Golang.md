---
layout: post
title: "Go 프로그램으로 JSON 파일 파싱하기"
author: Sun
date: 2020-03-25 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이번 포스팅에서는 모두 JSON 파일 또는 JSON HTTP 응답을 읽고 
원하는대로 파싱할 수 있는 방법을 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#theEncodingJsonPackage">The Encoding/Json Package</a>
      </li>
      <li>
        <a href="#readingandParsingaJSONFile">JSON 파일 읽기 및 파싱하기</a>
      </li>
      <li>
        <a href="#readingtheJSONFile">JSON 파일 읽기</a>
      </li>
      <li>
        <a href="#parsingwithStructs">Structs로 파싱하기</a>
      </li>
      <li>
        <a href="#unmarshallingourJSON">JSON 비정렬화</a>
      </li>
      <li>
        <a href="#workingwithUnstructuredData">비정형 데이터 작업</a>
      </li>
      <li>
        <a href="#fullImplementation">전체 구현</a>
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

이 포스트에서는 모두 JSON 파일 또는 JSON HTTP 응답을 읽고 
원하는대로 파싱할 수 있는 방법을 살펴 보겠습니다.

JSON 또는 Javascript 객체 표기법은 정보를 주고받는 표준 형식입니다. 
우리는 XML이나 JSON으로 같은 정보를 표현할 수 있지만 JSON은 훨씬 더 작고 개인적인 
경험에서 더 읽기 쉽다는 점에서 이점을 제공합니다.

이제 JSON은 가장 널리 사용되는 데이터 형식이며 대부분의 RESTful API는 인터페이스를 
시도할 때 JSON 응답을 제공합니다. 따라서 Go로 작업하고 파싱할 수 있다는 것은 매우 유용합니다!

<h3 id="theEncodingJsonPackage">
  <a href="#theEncodingJsonPackage"></a>
  The Encoding/Json Package
</h3>

따라서 시작하기 위해 `encoding/json` 표준 라이브러리 패키지를 활용하여 시작하고 실행할 것 입니다. 
여기에서 공식 문서를 확인하는 것이 좋습니다: [Encoding/Json](https://golang.org/pkg/encoding/json/)

기본으로 정말 간단한 Go 프로그램부터 시작해 보겠습니다. 
다양한 예제를 다루는 방법을 보여주기 위해 이를 구축하겠습니다. 
`main.go`라는 새 파일에 다음과 같이 작성하보겠습니다.

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello World")
}
```

그리고 간단한 `go run main.go` 호출로 이것을 실행할 수 있습니다. 
간단한 `Hello World`가 반환됩니다.

<h3 id="readingandParsingaJSONFile">
  <a href="#readingandParsingaJSONFile"></a>
  JSON 파일 읽기 및 파싱하기 
</h3>

간단한 JSON 파일을 읽고 파싱해 봅시다. 
이 포스팅의 목적을 위해 파일 내에서 다음 json을 파싱할 것입니다. 
이를 복사하여 `main.go` 파일과 동일한 디렉토리에 있는 `users.json` 파일 이름으로 저장하세요.

> **user.json**

```json
{
  "users": [
    {
      "name": "Elliot",
      "type": "Reader",
      "age": 23,
      "social": {
        "facebook": "https://facebook.com",
        "twitter": "https://twitter.com"
      }
    },
    {
      "name": "Fraser",
      "type": "Author",
      "age": 17,
      "social": {
        "facebook": "https://facebook.com",
        "twitter": "https://twitter.com"
      }
    }
  ]
}
```

이것은 우리의 스킬을 테스트하기에 충분히 복잡해야하며 
우리의 스킬을 실제 사례로 쉽게 전환할 수 있어야합니다.

<h3 id="readingtheJSONFile">
  <a href="#readingtheJSONFile"></a>
  JSON 파일 읽기
</h3>

파일 시스템에서 `users.json` 파일을 열기 위해 `os` package를 사용할 것입니다. 
파일을 열면 함수가 끝날 때까지 파일 닫기를 연기하여 파일 내부의 데이터로 작업할 수 있습니다.

```go
// Open our jsonFile
jsonFile, err := os.Open("users.json")
// if we os.Open returns an error then handle it
if err != nil {
    fmt.Println(err)
}
fmt.Println("Successfully Opened users.json")
// defer the closing of our jsonFile so that we can parse it later on
defer jsonFile.Close()
```

<h3 id="parsingwithStructs">
  <a href="#parsingwithStructs"></a>
  Structs로 파싱하기
</h3>

`users.json` 파일에 포함된 JSON을 파싱할 때 몇 가지 옵션이 있습니다. 
사전 정의된 구조체 세트를 사용하여 JSON을 unmarshal 하거나 `map[string]interface{}`를 사용하여 
JSON을 unmarshal 하여 JSON을 임의의 데이터 타입에 대해 매핑된 문자열로 파싱할 수 있습니다.

여러분이 원하는 구조를 알고 있다면 다음과 같이 자세한 방법을 따라가며 구조체를 정의하는 것이 좋습니다:

> **main.go**

```go
package main

import (
    …
    // import our encoding/json package
    “encoding/json”
    …
)

// Users struct which contains
// an array of users
type Users struct {
    Users []User `json:"users"`
}

// User struct which contains a name
// a type and a list of social links
type User struct {
    Name   string `json:"name"`
    Type   string `json:"type"`
    Age    int    `json:"Age"`
    Social Social `json:"social"`
}

// Social struct which contains a
// list of links
type Social struct {
    Facebook string `json:"facebook"`
    Twitter  string `json:"twitter"`
}
```

이것들을 한 번 정의해 놓으면, JSON을 언제든지 쉽게 unmarshal 할 수 있습니다.

<h3 id="unmarshallingourJSON">
  <a href="#unmarshallingourJSON"></a>
  JSON unmarshalling
</h3>

`os.Open` 함수를 사용하여 파일을 메모리로 읽은 후에는 `ioutil.ReadAll`을 사용하여 바이트 배열로 변환해야 합니다. 
바이트 배열에 있으면 `json.Unmarshal()` 메소드에 전달할 수 있습니다.

```go
// read our opened jsonFile as a byte array.
byteValue, _ := ioutil.ReadAll(jsonFile)

// we initialize our Users array
var users Users

// we unmarshal our byteArray which contains our
// jsonFile's content into 'users' which we defined above
json.Unmarshal(byteValue, &users)

// we iterate through every user within our users array and
// print out the user Type, their name, and their facebook url
// as just an example
for i := 0; i < len(users.Users); i++ {
    fmt.Println("User Type: " + users.Users[i].Type)
    fmt.Println("User Age: " + strconv.Itoa(users.Users[i].Age))
    fmt.Println("User Name: " + users.Users[i].Name)
    fmt.Println("Facebook Url: " + users.Users[i].Social.Facebook)
}
```

<h3 id="workingwithUnstructuredData">
  <a href="#workingwithUnstructuredData"></a>
  비정형 데이터 작업
</h3>

때로는 모든 것을 위한 구조체를 만드는 과정을 거치는 것이 다소 시간이 걸리고 
해결하려는 문제에 대해 지나치게 장황할 수 있습니다. 
이 경우 모든 JSON 데이터를 읽기 위해 표준 `interface{}`를 사용할 수 있습니다:

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "os"
)

func main() {

    // Open our jsonFile
    jsonFile, err := os.Open("users.json")
    // if we os.Open returns an error then handle it
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println("Successfully Opened users.json")
    // defer the closing of our jsonFile so that we can parse it later on
    defer jsonFile.Close()

    byteValue, _ := ioutil.ReadAll(jsonFile)

    var result map[string]interface{}
    json.Unmarshal([]byte(byteValue), &result)

    fmt.Println(result["users"])

}
```

위 코드에서 알 수 있듯이 우리는 `users.json`을 열고 일반적으로 Python 또는 JavaScript와 같은 
다른 프로그래밍 언어에서와 마찬가지로 JSON을 파싱합니다.

이것을 실행하면, `result["users"]`를 출력하면 맵이 콘솔에 출력되는 것을 볼 수 있습니다:

```bash
$ go run main.go
Successfully opened users.json
[map[type:Reader age:23 social:map[facebook:https://facebook.com twitter:https://twitter.com] name:Elliot] map[name:Frasertype:Author age:17 social:map[facebook:https://facebook.com twitter:https://twitter.com]]]
```

트리를 더 아래로 이동하려면 구조체 유형을 정의하지 않고도 
Go 내에서 `map` 구조를 일반적으로 탐색할 수 있습니다.

> **참고**-데이터가 유입되는 구조를 알고있는 경우 일반적으로 구조체를 시도하고 정의하는 것이 좋습니다.

<h3 id="fullImplementation">
  <a href="#fullImplementation"></a>
  전체 구현
</h3>

아래는 이 포스팅의 전체 구현입니다.

> **main.go**

```go 
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "os"
    "strconv"
)

// Users struct which contains
// an array of users
type Users struct {
    Users []User `json:"users"`
}

// User struct which contains a name
// a type and a list of social links
type User struct {
    Name   string `json:"name"`
    Type   string `json:"type"`
    Age    int    `json:"Age"`
    Social Social `json:"social"`
}

// Social struct which contains a
// list of links
type Social struct {
    Facebook string `json:"facebook"`
    Twitter  string `json:"twitter"`
}

func main() {
    // Open our jsonFile
    jsonFile, err := os.Open("users.json")
    // if we os.Open returns an error then handle it
    if err != nil {
        fmt.Println(err)
    }

    fmt.Println("Successfully Opened users.json")
    // defer the closing of our jsonFile so that we can parse it later on
    defer jsonFile.Close()

    // read our opened xmlFile as a byte array.
    byteValue, _ := ioutil.ReadAll(jsonFile)

    // we initialize our Users array
    var users Users

    // we unmarshal our byteArray which contains our
    // jsonFile's content into 'users' which we defined above
    json.Unmarshal(byteValue, &users)

    // we iterate through every user within our users array and
    // print out the user Type, their name, and their facebook url
    // as just an example
    for i := 0; i < len(users.Users); i++ {
        fmt.Println("User Type: " + users.Users[i].Type)
        fmt.Println("User Age: " + strconv.Itoa(users.Users[i].Age))
        fmt.Println("User Name: " + users.Users[i].Name)
        fmt.Println("Facebook Url: " + users.Users[i].Social.Facebook)
    }

}
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅이 Golang에서 JSON으로 작업하는 스킬을 이해하는데 도움이 되었기를 바랍니다. 

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  추가 자료
</h3>

이 포스팅을 즐겼거나 유용하다고 생각되면 이 사이트에서 다른 포스팅을 볼 수도 있습니다.

* Go를 사용하여 RESTful API 작성하기 **(TBA)**
* Go를 사용하여 간단한 웹 서버 만들기 **(TBA)**