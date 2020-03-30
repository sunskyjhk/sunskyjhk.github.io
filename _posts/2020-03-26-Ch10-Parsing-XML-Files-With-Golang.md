---
layout: post
title: "Go 프로그램으로 XML 파일 파싱하기"
author: Sun
date: 2020-03-26 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스팅에서는 파일 시스템에서 XML 파일을 효과적으로 읽고 
Go의 `encoding/xml package`를 사용하여이 파일을 파싱하는 방법을 살펴 봅니다. 
여러 개의 중첩된 xml 요소를 순회할 수 있는 방법을 살펴본 후 이를 터미널 창에 간단히 인쇄하는 방법을 알아보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#ourExampleXMLFile">XML 파일 예제</a>
      </li>
      <li>
        <a href="#readinginourFile">파일에서 읽기</a>
      </li>
      <li>
        <a href="#definingourStructs">Structs 정의하기</a>
      </li>
      <li>
        <a href="#parsingwithStructs">Structs로 파싱하기</a>
      </li>
      <li>
        <a href="#unmarshallingOurXML">XML 언마샬링</a>
      </li>
      <li>
        <a href="#fullImplementation">전체 구현</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스팅에서는 파일 시스템에서 XML 파일을 효과적으로 읽고 
Go의 `"encoding/xml" package`를 사용하여이 파일을 파싱하는 방법을 살펴 봅니다. 
여러 개의 nested된 xml 요소를 순회할 수 있는 방법을 살펴본 후 이를 터미널 창에 간단히 인쇄하는 방법을 알아보겠습니다.

<h3 id="ourExampleXMLFile">
  <a href="#ourExampleXMLFile"></a>
  XML 파일 예제
</h3>

우선 훑어볼 수 있는 xml 파일이 필요합니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user type="admin">
    <name>Elliot</name>
    <social>
      <facebook>https://facebook.com</facebook>
      <twitter>https://twitter.com</twitter>
      <youtube>https://youtube.com</youtube>
    </social>
  </user>
  <user type="reader">
    <name>Fraser</name>
    <social>
      <facebook>https://facebook.com</facebook>
      <twitter>https://twitter.com</twitter>
      <youtube>https://youtube.com</youtube>
    </social>
  </user>
</users>
```
위의 xml에는 사용자 태그, nested 요소에 속성이 설정되어 있으므로 이 예제를 파싱할 수 있으면 확장하여 
크기에 관계없이 모든 XML 파일을 파싱할 수 있게 될 것입니다.

<h3 id="readinginourFile">
  <a href="#readinginourFile"></a>
  파일에서 읽기
</h3>

우리가 극복해야 할 첫 번째 장애물은 이 파일을 메모리로 읽는 것입니다. 
`os` 와 `io/ioutil` package의 조합을 사용하여 이를 수행할 수 있습니다.

```go
package main

import (
    "fmt"
    "io/ioutil"
    "os"
)

func main() {

    // Open our xmlFile
    xmlFile, err := os.Open("users.xml")
    // if we os.Open returns an error then handle it
    if err != nil {
        fmt.Println(err)
    }

    fmt.Println("Successfully Opened users.xml")
    // defer the closing of our xmlFile so that we can parse it later on
    defer xmlFile.Close()

}
```

<h3 id="definingourStructs">
  <a href="#definingourStructs"></a>
  Structs 정의하기
</h3>

xml 파일을 파싱하기 전에 구조체를 정의해야 합니다. 
하나는 전체 사용자 목록을 나타내고 하나는 사용자를 나타내고 다른 하나는 사용자의 소셜 링크를 나타냅니다.

```go
import (
  ...
  // remember to add encoding/xml to your list of imports
    "encoding/xml"
    ...
)

// our struct which contains the complete
// array of all Users in the file
type Users struct {
    XMLName xml.Name `xml:"users"`
    Users   []User   `xml:"user"`
}

// the user struct, this contains our
// Type attribute, our user's name and
// a social struct which will contain all
// our social links
type User struct {
    XMLName xml.Name `xml:"user"`
    Type    string   `xml:"type,attr"`
    Name    string   `xml:"name"`
    Social  Social   `xml:"social"`
}

// a simple struct which contains all our
// social links
type Social struct {
    XMLName  xml.Name `xml:"social"`
    Facebook string   `xml:"facebook"`
    Twitter  string   `xml:"twitter"`
    Youtube  string   `xml:"youtube"`
}
```

<h3 id="unmarshallingOurXML">
  <a href="#unmarshallingOurXML"></a>
  XML 언마샬링
</h3>

위에서 우리는 파일을 메모리로 로드하는 방법을 보았습니다. 
마샬링하려면 이 파일을 바이트 배열로 변환한 다음 `xml.Unmarshal` 메서드를 사용하여 Users 배열을 채웁니다.

```go
// read our opened xmlFile as a byte array.
byteValue, _ := ioutil.ReadAll(xmlFile)

// we initialize our Users array
var users Users
// we unmarshal our byteArray which contains our
// xmlFiles content into 'users' which we defined above
xml.Unmarshal(byteValue, &users)
```

<h3 id="fullImplementation">
  <a href="#fullImplementation"></a>
  전체 구현
</h3>

```go 
package main

import (
    "encoding/xml"
    "fmt"
    "io/ioutil"
    "os"
)

// our struct which contains the complete
// array of all Users in the file
type Users struct {
    XMLName xml.Name `xml:"users"`
    Users   []User   `xml:"user"`
}

// the user struct, this contains our
// Type attribute, our user's name and
// a social struct which will contain all
// our social links
type User struct {
    XMLName xml.Name `xml:"user"`
    Type    string   `xml:"type,attr"`
    Name    string   `xml:"name"`
    Social  Social   `xml:"social"`
}

// a simple struct which contains all our
// social links
type Social struct {
    XMLName  xml.Name `xml:"social"`
    Facebook string   `xml:"facebook"`
    Twitter  string   `xml:"twitter"`
    Youtube  string   `xml:"youtube"`
}

func main() {

    // Open our xmlFile
    xmlFile, err := os.Open("users.xml")
    // if we os.Open returns an error then handle it
    if err != nil {
        fmt.Println(err)
    }

    fmt.Println("Successfully Opened users.xml")
    // defer the closing of our xmlFile so that we can parse it later on
    defer xmlFile.Close()

    // read our opened xmlFile as a byte array.
    byteValue, _ := ioutil.ReadAll(xmlFile)

    // we initialize our Users array
    var users Users
    // we unmarshal our byteArray which contains our
    // xmlFiles content into 'users' which we defined above
    xml.Unmarshal(byteValue, &users)

    // we iterate through every user within our users array and
    // print out the user Type, their name, and their facebook url
    // as just an example
    for i := 0; i < len(users.Users); i++ {
        fmt.Println("User Type: " + users.Users[i].Type)
        fmt.Println("User Name: " + users.Users[i].Name)
        fmt.Println("Facebook Url: " + users.Users[i].Social.Facebook)
    }

}
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅이 Golang에서 XML로 작업하는 스킬을 이해하는데 도움이 되었기를 바랍니다. 

