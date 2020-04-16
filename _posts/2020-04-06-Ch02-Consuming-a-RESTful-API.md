---
layout: post
title: "Go로 RESTful API 사용하기"
author: Sun
date: 2020-04-06 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 go를 사용하여 이미 실행중인 RESTful API를 사용하는 방법을 
보여 드리겠습니다. 현재 수십만 개에 달하는 개방형 REST API가 있으며 
소비되기를 기다리고 있으며 보다 의미있는 것으로 바뀝니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">전제 조건</a>
      </li>
      <li>
        <a href="#queryingTheAPI">API 쿼리하기</a>
      </li>
      <li>
        <a href="#gETRequest">GET 요청</a>
      </li>
      <li>
        <a href="#creatingaPokemonStruct">포켓몬 구조 만들기</a>
      </li>
      <li>
        <a href="#unmarshallingourJSON">JSON unmarshalling하기</a>
      </li>
      <li>
        <a href="#listingAllOurPokemon">우리의 모든 포켓몬 목록</a>
      </li>
      <li>
        <a href="#fullSourceCoder">전체 소스 코드</a>
      </li>
      <li>
        <a href="#summary">요약</a>
      </li>
    </ul>
  </nav>
</div>

> **참고** - Go에서 RESTful API를 작성하는 방법에 대한 포스팅을 
>보려면 [여기](../Ch03-Creating-RESTful-API)를 클릭하십시오.

이 포스트에서는 go를 사용하여 이미 실행중인 RESTful API를 사용하는 방법을 
보여 드리겠습니다. 현재 수십만 개에 달하는 개방형 REST API가 있으며 
소비되기를 기다리고 있으며 보다 의미있는 것으로 바뀝니다. 
Todd Motto는 Github에서 우리가 사용할 수 있는 모든 공개 API를 나열하는 
활발한 레포지토리를 구성했으며, 
우리가 체크 아웃하려는 항목으로 쉽게 드릴 다운할 수 있도록 분류했습니다. 
[여기](https://github.com/toddmotto/public-apis)에서 찾을 수 있습니다.

이 포스팅의 목적상 브라우저에서 작동하는지 쉽게 테스트 할 수 있는 
이미 있는 라이브 API를 사용해야한다고 생각합니다. 
우리는 Pokemon과 관련된 모든 알려진 정보를 공개하는 API인 매우 인기있는 
`pokeapi`를 사용할 것입니다. 
조금 어리석은 것으로 알고 있지만 표준 명명 규칙을 따르고 
인증이 필요 없으므로 입력 장벽이없는 본격적인 API입니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  전제 조건
</h3>

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.

<h3 id="queryingTheAPI">
  <a href="#queryingTheAPI"></a>
  API 쿼리하기
</h3>

시작하기 위해 우리는 원본 시리즈에서 모든 포켓몬을 쿼리할 것입니다. 
이를 반환하는 `http://pokeapi.co/api/v2/pokedex/kanto/` API 엔드 포인트가 나옵니다. 
브라우저에서 이 엔드 포인트로 이동하면 거대한 JSON 문자열이 출력됩니다. 
이는 go 프로그램이 이 엔드 포인트에서 `GET` 요청을 수행할 때 예상되는 응답입니다.

>**참고** – 브라우저에서 웹 페이지를 열면 해당 페이지에 대한 `GET` 요청이 수행됩니다.

<h3 id="gETRequest">
  <a href="#gETRequest"></a>
  GET 요청
</h3>

브라우저에서 방금 수행한 작업을 모방하려면 다음과 같은 프로그램을 작성해야합니다.

```go 
package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
)

func main() {
    response, err := http.Get("http://pokeapi.co/api/v2/pokedex/kanto/")

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(responseData))

}
```

기본 함수 내에서 먼저 `http.Get("http://pokeapi.co/api/v2/pokedex/kanto") `를 사용하여 
API 엔드 포인트를 쿼리한 후 이 결과를 `response` 또는 `err`에 맵핑 한 후 확인하십시오. 
`err`이 nil이 아닌 경우 그렇다면 우리는 종료합니다.

이 아래에서는 응답의 body를 바이트에서 콘솔로 인쇄할 수 있는 의미있는 것으로 변환합니다. 
먼저 `ioutil.ReadAll(response.Body)`를 사용하여 수신 바이트 스트림에서 데이터를 읽은 다음 
print문 내에서 `string(responseData)`를 사용하여이 `[]byte` 응답을 문자열로 변환합니다.

위 프로그램을 실행하면 API 엔드 포인트에서 `GET` 요청을 성공적으로 수행한 후 
콘솔에서 모든 포켓몬을 출력합니다.

<h3 id="creatingaPokemonStruct">
  <a href="#creatingaPokemonStruct"></a>
  포켓몬 구조 만들기
</h3>

위 API 엔드 포인트가 제공하는 JSON 응답의 구조를 알면 
이제 객체를 매핑할 수 있는 일련의 `structs`로 매핑할 수 있습니다. 
아래는 압축된 JSON 버전입니다. 
JSON 응답에는 두 개의 `key-value` 쌍이 있으며, 
첫 번째는 원래 Pokemon이 있는 지역의 `name`입니다. 
`region`은 특정 지역 등에 대한 자세한 정보를 얻기 위해 API에 대한 링크를 제공합니다.

우리가 가장 관심있는 것은 우리가 원하는 모든 포켓몬의 배열을 저장하는 `pokemon_entries`입니다.

```json
{
  "name":"kanto",
  "region": {
    "url":"http:\/\/pokeapi.co\/api\/v2\/region\/1\/",
    "name":"kanto"
  },
  "version_groups":[ ... ]
  ],
  "is_main_series":true,
  "descriptions":[ ... ],
  "pokemon_entries":[
    {
      "entry_number": 1,
      "pokemon_species": {
        "url":"http:\/\/pokeapi.co\/api\/v2\/pokemon-species\/1\/",
        "name":"bulbasaur"
      }
    }
    ...
  ]
}
```

Go에서 우리는 이것을 3 개의 다른 구조체, 즉 Pokemon 배열을 포함하는 
`Response` 구조체와 이러한 개별 포켓몬과 `PokemonSpecies` 구조체를 
포케몬의 이름에 액세스하기 위한 `Pokemon` 구조체를 포함하는 구조체로 매핑할 수 있습니다.

```go 
// A Response struct to map the Entire Response
type Response struct {
    Name    string    `json:"name"`
    Pokemon []Pokemon `json:"pokemon_entries"`
}

// A Pokemon Struct to map every pokemon to.
type Pokemon struct {
    EntryNo int            `json:"entry_number"`
    Species PokemonSpecies `json:"pokemon_species"`
}

// A struct to map our Pokemon's Species which includes it's name
type PokemonSpecies struct {
    Name string `json:"name"`
}
```

<h3 id="unmarshallingourJSON">
  <a href="#unmarshallingourJSON"></a>
  JSON unmarshalling하기
</h3>

이러한 구조체를 정의했으므로 반환된 JSON 문자열을 새 변수로 unmarshalling할 수 있습니다. 
`responseData`를 인쇄하는 위치에 아래 세 줄을 추가하여 `main` 함수에서 
이 작업을 수행할 수 있습니다.

```go 
var responseObject Response
json.Unmarshal(responseData, &responseObject)

fmt.Println(responseObject.Name)
fmt.Println(len(responseObject.Pokemon))
```

위 코드에서 `Response` 타입의 새로운 `responseObject` 변수를 선언합니다. 
그런 다음 `responseData`를 이 객체로 unmarshalling하고 모든 것이 작동하는지 
테스트하기 위해 `kanto`와 같은 `responseObject.Name`을 인쇄합니다. 
그런 다음 Pokemon 배열의 길이를 인쇄하여 예상과 일치하는지 확인하고 
151을 인쇄하면 올바르게 수행한 것을 알았으므로 이제 이 포켓몬을 반복할 수 있습니다.

<h3 id="listingAllOurPokemon">
  <a href="#listingAllOurPokemon"></a>
  우리의 모든 포켓몬 목록
</h3>

모든 포켓몬을 나열하려면 다음과 같이 `responseObjects` Pokemon 배열의 
모든 객체에 대해 반복되는 for 루프를 만들어야 합니다.

```go 
var responseObject Response
json.Unmarshal(responseData, &responseObject)

fmt.Println(responseObject.Name)
fmt.Println(len(responseObject.Pokemon))

for i := 0; i < len(responseObject.Pokemon); i++ {
  fmt.Println(responseObject.Pokemon[i].Species.Name)
}
```

이것을 실행하면 모든 포켓몬의 이름이 콘솔에 표시됩니다.

<h3 id="fullSourceCoder">
  <a href="#fullSourceCoder"></a>
  전체 소스 코드
</h3>

```go 
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
)

// A Response struct to map the Entire Response
type Response struct {
    Name    string    `json:"name"`
    Pokemon []Pokemon `json:"pokemon_entries"`
}

// A Pokemon Struct to map every pokemon to.
type Pokemon struct {
    EntryNo int            `json:"entry_number"`
    Species PokemonSpecies `json:"pokemon_species"`
}

// A struct to map our Pokemon's Species which includes it's name
type PokemonSpecies struct {
    Name string `json:"name"`
}

func main() {
    response, err := http.Get("http://pokeapi.co/api/v2/pokedex/kanto/")
    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }

    var responseObject Response
    json.Unmarshal(responseData, &responseObject)

    fmt.Println(responseObject.Name)
    fmt.Println(len(responseObject.Pokemon))

    for i := 0; i < len(responseObject.Pokemon); i++ {
        fmt.Println(responseObject.Pokemon[i].Species.Name)
    }

}
```

<h3 id="summary">
  <a href="#summary"></a>
  요약
</h3>

이 포스트에서는 `HTTP` 엔드포인트에서 `GET` 요청을 수행하고 
응답의 일반 텍스트 응답을 인쇄하는 방법을 살펴 보았습니다. 
그런 다음 JSON 응답을 일반 객체처럼 효과적으로 작업할 수 있는 
구조체 객체로 정렬 해제하는 방법을 살펴 보았습니다.